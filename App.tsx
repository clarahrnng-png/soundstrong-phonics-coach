
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import Header from './components/Header';
import MouthAnimation from './components/MouthAnimation';
import GamificationPanel from './components/GamificationPanel';
import { PHONEMES, TEACHER_SYSTEM_PROMPT } from './constants';
import { PhonemeInfo, TranscriptionItem, PhonemeType, UserProgress, PracticeMode } from './types';
import { encode, decode, decodeAudioData, floatTo16BitPCM } from './services/audioUtils';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const STORAGE_KEY = 'sound_strong_user_progress';

const DEFAULT_PROGRESS: UserProgress = {
  points: 0,
  level: 1,
  streak: 0,
  lastPracticeDate: null,
  badges: [],
  sessionsCount: 0,
};

const App: React.FC = () => {
  const [selectedPhoneme, setSelectedPhoneme] = useState<PhonemeInfo>(PHONEMES[0]);
  const [activeMode, setActiveMode] = useState<PracticeMode>(PracticeMode.PHONEME);
  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptions, setTranscriptions] = useState<TranscriptionItem[]>([]);
  const [teacherFeedback, setTeacherFeedback] = useState<string>("老師正在聽你練習喔！準備好了就點擊下方按鈕開始吧。");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastError, setLastError] = useState<string | null>(null);
  const [isKeySelected, setIsKeySelected] = useState<boolean>(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('vowels');

  const CATEGORY_LABELS: Record<string, { label: string, icon: string }> = {
    vowels: { label: '母音 (Vowels)', icon: '👄' },
    diphthongs: { label: '雙母音 (Diphthongs)', icon: '🗣️' },
    consonants: { label: '子音 (Consonants)', icon: '🦷' },
    special: { label: '特殊音 (Special)', icon: '✨' }
  };

  // Check for API key selection on mount
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setIsKeySelected(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setIsKeySelected(true); // Assume success after opening dialog
    }
  };

  // Gamification State
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    setSelectedPairIndex(0);
  }, [selectedPhoneme]);

  // Search Logic
  const filteredPhonemes = useMemo(() => {
    if (!searchQuery.trim()) return PHONEMES;
    const query = searchQuery.toLowerCase();
    return PHONEMES.filter(p => 
      p.ipa.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.exampleWords.some(w => w.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Grouping phonemes for better UX
  const categorizedPhonemes = useMemo(() => {
    return {
      vowels: filteredPhonemes.filter(p => p.type === PhonemeType.VOWEL),
      diphthongs: filteredPhonemes.filter(p => p.type === PhonemeType.DIPHTHONG),
      consonants: filteredPhonemes.filter(p => p.type === PhonemeType.CONSONANT),
      special: filteredPhonemes.filter(p => p.type === PhonemeType.SPECIAL),
    };
  }, [filteredPhonemes]);

  // Navigation Logic
  const currentIndex = useMemo(() => 
    PHONEMES.findIndex(p => p.id === selectedPhoneme.id),
  [selectedPhoneme]);

  const isLastPhoneme = currentIndex === PHONEMES.length - 1;

  const handleNextPhoneme = useCallback(() => {
    if (!isLastPhoneme && !isRecording) {
      const nextPhoneme = PHONEMES[currentIndex + 1];
      setSelectedPhoneme(nextPhoneme);
      setTeacherFeedback(`切換到下一課：${nextPhoneme.ipa}。準備好就可以點擊錄音鈕練習囉！`);
      setTranscriptions([]); 
    }
  }, [currentIndex, isLastPhoneme, isRecording]);

  // Refs for audio processing
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const cleanup = useCallback(() => {
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {
        console.warn('Error closing session:', e);
      }
      sessionRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    sourcesRef.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    sourcesRef.current.clear();
    setIsRecording(false);
    setIsAiSpeaking(false);
  }, []);

  const awardPoints = useCallback((amount: number, isPerfect: boolean = false) => {
    setProgress(prev => {
      // 1. Calculate Multiplier based on Mode
      // Sentences are much harder, so they get a higher multiplier (5x)
      // Minimal pairs are moderately harder (3x)
      // Individual phonemes are the baseline (1x)
      const modeMultiplier = activeMode === PracticeMode.SENTENCES ? 5 : activeMode === PracticeMode.MINIMAL_PAIRS ? 3 : 1;
      
      // 2. Base Award with Perfect Bonus
      let baseAward = amount;
      if (isPerfect) baseAward += 25; // Extra bonus for perfect pronunciation
      
      // 3. Streak Bonus (5% per streak, capped at 50%)
      const streakBonus = Math.min(prev.streak * 0.05, 0.5);
      
      // 4. Final Calculation
      const actualAward = Math.round(baseAward * modeMultiplier * (1 + streakBonus));
      
      const newPoints = prev.points + actualAward;
      const newLevel = Math.floor(newPoints / 500) + 1;
      const newBadges = [...prev.badges];

      // Award badges based on milestones
      if (!newBadges.includes('first_step')) newBadges.push('first_step');
      if (isPerfect && !newBadges.includes('perfect_score')) newBadges.push('perfect_score');
      if (prev.streak >= 3 && !newBadges.includes('streak_3')) newBadges.push('streak_3');
      
      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        badges: newBadges,
      };
    });
  }, [activeMode]);

  const toggleRecording = async () => {
    setLastError(null);
    if (isRecording) {
      cleanup();
      return;
    }

    try {
      // Use the mapped VITE_GEMINI_API_KEY which is injected at build time by Vite
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "undefined") {
        console.warn('API Key not found or invalid in environment variables.');
        if (window.aistudio) {
          await handleOpenSelectKey();
          return;
        }
        throw new Error('API Key is missing. Please ensure you have set GEMINI_API_KEY in your Vercel Environment Variables and redeployed.');
      }
      
      // Create a fresh instance for each connection to ensure latest key is used
      const ai = new GoogleGenAI({ apiKey });
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      if (!outputAudioContextRef.current) {
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (outputAudioContextRef.current.state === 'suspended') {
        await outputAudioContextRef.current.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const modeContext = activeMode === PracticeMode.MINIMAL_PAIRS 
        ? `目前的模式是【最小對立體對比練習】。
           目標音標是 ${selectedPhoneme.ipa}。
           正在練習的對立單字是：${selectedPhoneme.minimalPairs?.[selectedPairIndex]?.word1} (${selectedPhoneme.minimalPairs?.[selectedPairIndex]?.targetIpa}) 與 ${selectedPhoneme.minimalPairs?.[selectedPairIndex]?.word2} (${selectedPhoneme.minimalPairs?.[selectedPairIndex]?.comparisonIpa})。
           請特別注意學生是否能區分這兩個音標的差異，並給予具體的肌肉運動建議（如嘴巴張開程度、舌頭位置）。
           如果學生唸得太像，請指出具體的發音位置差異。`
        : activeMode === PracticeMode.SENTENCES
        ? `目前的模式是【句子應用練習】。
           請注意句子的流暢度、連音 (Linking sounds)、以及語調起伏。
           目標音標 ${selectedPhoneme.ipa} 隱藏在句子中，請檢查學生是否在句子中也能保持正確的發音。`
        : `目前的模式是【基礎單字發音】。
           請專注於單個音標 ${selectedPhoneme.ipa} 的準確度，以及在單字中的呈現。`;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: TEACHER_SYSTEM_PROMPT + 
            `\n${modeContext}\n` +
            `練習主題 (Target Phoneme)：${selectedPhoneme.ipa}\n` +
            `發音祕訣 (Tips)：${selectedPhoneme.tips}\n` +
            `常見錯誤 (Common Mistakes)：${selectedPhoneme.commonMistakes}\n`,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsRecording(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = floatTo16BitPCM(inputData);
              const base64Data = encode(pcmData);
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  audio: {
                    data: base64Data,
                    mimeType: 'audio/pcm;rate=16000'
                  }
                });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
            
            setProgress(prev => ({
              ...prev,
              sessionsCount: prev.sessionsCount + 1,
              streak: prev.streak + 1
            }));
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscriptions(prev => [...prev, { role: 'user', text, timestamp: Date.now() }]);
            }
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTeacherFeedback(text);
              setTranscriptions(prev => [...prev, { role: 'model', text, timestamp: Date.now() }]);

              if (text.includes('👏') || text.includes('棒') || text.includes('標準') || text.includes('完美')) {
                awardPoints(50, true);
              } else if (text.includes('不錯') || text.includes('很好') || text.includes('正確')) {
                awardPoints(30);
              } else {
                awardPoints(10);
              }
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsAiSpeaking(true);
              const outCtx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsAiSpeaking(false);
              };

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsAiSpeaking(false);
            }
          },
          onerror: (e) => {
            console.error('Gemini error:', e);
            let errorMessage = '連線發生錯誤 (Network Error)';
            
            if (e instanceof Error) {
              errorMessage = e.message;
            } else if (typeof e === 'string') {
              errorMessage = e;
            } else if (typeof e === 'object' && e !== null) {
              // Try to extract a useful message from the error object
              errorMessage = (e as any).message || (e as any).error || JSON.stringify(e);
            }
            
            // If it's a 404 or "not found", it might be a key issue
            if (errorMessage.includes('Requested entity was not found') || 
                errorMessage.includes('404') || 
                errorMessage.includes('API_KEY_INVALID')) {
              setIsKeySelected(false);
              errorMessage = 'API Key 無效或找不到資源，請重新選擇或檢查 Vercel 設定。';
            } else if (errorMessage.includes('Network error') || errorMessage.includes('failed to connect')) {
              errorMessage = '網路連線失敗。請確認您的 API Key 是否為付費版 (Paid Tier)，Live API 目前僅支援付費版金鑰。';
            }

            setLastError(errorMessage);
            cleanup();
          },
          onclose: () => {
            cleanup();
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start recording:', err);
      const message = err instanceof Error ? err.message : '連線 API 失敗，請稍後再試。';
      setLastError(message);
      cleanup();
    }
  };

  const renderPhonemeButton = (p: PhonemeInfo) => (
    <button
      key={p.id}
      onClick={() => !isRecording && setSelectedPhoneme(p)}
      disabled={isRecording}
      className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center justify-between group ${
        selectedPhoneme.id === p.id 
          ? 'border-orange-500 bg-orange-50 shadow-sm' 
          : 'border-white bg-white/60 hover:border-orange-100'
      } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex flex-col">
        <span className="text-xl font-bold text-orange-600">{p.ipa}</span>
        <span className="text-[10px] text-gray-400 font-medium uppercase truncate max-w-[120px]">{p.description}</span>
      </div>
      {p.type === PhonemeType.DIPHTHONG && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-black">D</span>}
      {p.type === PhonemeType.SPECIAL && <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-black">S</span>}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/20">
      <Header progress={progress} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-gray-800 tracking-tight leading-none mb-2">
              Sound Strong <span className="text-orange-500 underline decoration-orange-200 decoration-4 underline-offset-4">Phonics</span> Coach
            </h2>
          </div>
          
          <button 
            onClick={() => setShowAchievements(!showAchievements)}
            className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
              showAchievements 
                ? 'bg-orange-500 text-white shadow-orange-200 shadow-xl' 
                : 'bg-white text-gray-400 hover:text-orange-500 border border-orange-100'
            }`}
          >
            {showAchievements ? '返回練習' : '我的成就排行榜'}
          </button>
        </div>

        {!showAchievements && (
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-orange-100 flex gap-1 shadow-sm">
              {[
                { id: PracticeMode.PHONEME, label: '單字基礎', icon: '🔤' },
                { id: PracticeMode.MINIMAL_PAIRS, label: '對比糾錯', icon: '⚖️' },
                { id: PracticeMode.SENTENCES, label: '句子應用', icon: '📝' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => !isRecording && setActiveMode(mode.id)}
                  disabled={isRecording}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeMode === mode.id
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
                  } ${isRecording ? 'opacity-50' : ''}`}
                >
                  <span>{mode.icon}</span>
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {showAchievements ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <GamificationPanel progress={progress} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-500">
            {/* Left: Phoneme Selection with Search */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-4 max-h-[750px] flex flex-col">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="搜尋音標或單字..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-orange-100 text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-300 outline-none transition-all shadow-sm"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3.5 top-3.5 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-3.5 text-orange-300 hover:text-orange-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {/* Fix: Cast categorizedPhonemes entries to preserve array types for PhonemeInfo items */}
                {(Object.entries(categorizedPhonemes) as [string, PhonemeInfo[]][]).map(([key, list]) => {
                  const isExpanded = expandedCategory === key || searchQuery.trim() !== "";
                  const category = CATEGORY_LABELS[key] || { label: key, icon: '📍' };
                  
                  return list.length > 0 && (
                    <div key={key} className="border border-orange-50 rounded-2xl overflow-hidden transition-all duration-300">
                      <button 
                        onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
                        className={`w-full flex items-center justify-between p-3 text-left transition-all ${
                          isExpanded ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 hover:bg-orange-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{category.icon}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest">{category.label}</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${isExpanded ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'}`}>
                            {list.length}
                          </span>
                        </div>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-3 w-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {isExpanded && (
                        <div className="p-2 bg-white/50 animate-in slide-in-from-top-2 duration-300">
                          <div className="grid grid-cols-1 gap-1">
                            {list.map(renderPhonemeButton)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {filteredPhonemes.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-xs font-bold text-gray-400">找不到相關音標 🔍</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Main Interface */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              <div className="bg-white p-6 md:p-10 rounded-[3.5rem] shadow-2xl shadow-orange-100/30 border border-orange-50 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center gap-10">
                  <div className="flex flex-col items-center w-full">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-8xl font-black text-orange-500 drop-shadow-sm">{selectedPhoneme.ipa}</span>
                      <div className="h-16 w-[2px] bg-gray-100"></div>
                      <span className="text-lg font-black text-gray-700">{selectedPhoneme.description}</span>
                    </div>

                    {/* Dynamic Content Based on Mode */}
                    <div className="w-full animate-in fade-in zoom-in duration-300">
                      {activeMode === PracticeMode.PHONEME && (
                        <div className="flex flex-wrap justify-center gap-2">
                          {selectedPhoneme.exampleWords.map(word => (
                            <span key={word} className="px-6 py-2 bg-orange-50 rounded-2xl text-lg font-black text-orange-600 border border-orange-100 shadow-sm">{word}</span>
                          ))}
                        </div>
                      )}
                      
                      {activeMode === PracticeMode.MINIMAL_PAIRS && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedPhoneme.minimalPairs?.length ? (
                            selectedPhoneme.minimalPairs.map((pair, idx) => (
                              <button 
                                key={idx} 
                                onClick={() => setSelectedPairIndex(idx)}
                                className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-2 group ${
                                  selectedPairIndex === idx 
                                    ? 'bg-orange-100 border-orange-400 shadow-lg scale-105' 
                                    : 'bg-orange-50/50 border-orange-100 hover:border-orange-200'
                                }`}
                              >
                                <div className="flex items-center gap-4 w-full justify-center">
                                  <div className="flex flex-col items-center">
                                    <span className={`text-2xl font-black ${selectedPairIndex === idx ? 'text-orange-700' : 'text-gray-800'}`}>{pair.word1}</span>
                                    <span className={`text-xs font-bold ${selectedPairIndex === idx ? 'text-orange-500' : 'text-orange-400'}`}>{pair.targetIpa}</span>
                                  </div>
                                  <span className={`font-bold italic ${selectedPairIndex === idx ? 'text-orange-400' : 'text-gray-300'}`}>vs</span>
                                  <div className="flex flex-col items-center">
                                    <span className={`text-2xl font-black ${selectedPairIndex === idx ? 'text-orange-700' : 'text-gray-400'}`}>{pair.word2}</span>
                                    <span className={`text-xs font-bold ${selectedPairIndex === idx ? 'text-orange-500' : 'text-gray-300'}`}>{pair.comparisonIpa}</span>
                                  </div>
                                </div>
                                {selectedPairIndex === idx && (
                                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-2">正在練習中 🎤</span>
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="col-span-2 text-center py-6 text-gray-400 font-bold bg-gray-50 rounded-3xl border border-dashed">此音標無建議對立練習</div>
                          )}
                        </div>
                      )}

                      {activeMode === PracticeMode.SENTENCES && (
                        <div className="space-y-3">
                          {selectedPhoneme.sentences?.map((sentence, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-[2rem] border-2 border-orange-50 shadow-sm text-center">
                              <p className="text-xl font-bold text-gray-700 leading-relaxed italic">"{sentence}"</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full items-center">
                    <div className="flex flex-col items-center gap-4">
                      <MouthAnimation 
                        state={selectedPhoneme.animationState || 'neutral'} 
                        isActive={isAiSpeaking || isRecording} 
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="bg-orange-50/50 backdrop-blur-sm border border-orange-100 p-8 rounded-[2.5rem] shadow-inner text-center relative min-h-[180px] flex flex-col items-center justify-center transition-all duration-300">
                         {isAiSpeaking && (
                           <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full shadow-lg border border-orange-100">
                              {[1,2,3,4,5,6].map(i => (
                                <div key={i} className={`w-1.5 h-4 bg-orange-500 rounded-full animate-bounce`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                              ))}
                           </div>
                         )}
                         {lastError ? (
                           <div className="text-red-500 space-y-3">
                             <p className="font-black text-sm uppercase tracking-widest">⚠️ 連線發生錯誤</p>
                             <p className="text-xs font-medium opacity-80">{lastError}</p>
                             <button 
                               onClick={toggleRecording}
                               className="px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-tighter hover:bg-red-200 transition-colors"
                             >
                               重新連線
                             </button>
                           </div>
                         ) : (
                           <p className="text-gray-800 font-bold text-xl leading-relaxed">
                             {teacherFeedback}
                           </p>
                         )}
                      </div>

                      <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center gap-6">
                           <button
                            onClick={toggleRecording}
                            className={`group relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-500 transform active:scale-90 ${
                              isRecording ? 'bg-red-500 shadow-red-200 shadow-2xl scale-110' : 'bg-orange-500 shadow-orange-300 shadow-2xl hover:scale-105'
                            }`}
                          >
                            {isRecording ? <div className="w-10 h-10 bg-white rounded-2xl animate-pulse"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
                            <div className={`absolute -inset-3 rounded-full border-4 ${isRecording ? 'border-red-400 animate-ping opacity-20' : 'border-transparent'}`}></div>
                          </button>

                          <button
                            onClick={handleNextPhoneme}
                            disabled={isLastPhoneme || isRecording}
                            className={`flex flex-col items-center justify-center w-20 h-20 rounded-full transition-all border-2 ${
                              isLastPhoneme || isRecording ? 'border-gray-100 bg-gray-50 text-gray-300' : 'border-orange-200 bg-white text-orange-500 hover:border-orange-500 hover:bg-orange-50 shadow-sm'
                            }`}
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                             <span className="text-[8px] font-black uppercase mt-1">Next</span>
                          </button>
                        </div>
                        <p className={`text-[10px] font-black tracking-[0.3em] uppercase ${isRecording ? 'text-red-500 animate-pulse' : 'text-orange-400'}`}>
                          {isRecording ? 'Recording...' : 'Tap to Practice'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-orange-50 max-h-72 overflow-y-auto custom-scrollbar shadow-sm shadow-orange-50">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6 flex justify-center">Session History</h4>
                <div className="space-y-4">
                  {transcriptions.length === 0 ? <p className="text-sm text-gray-400 font-medium italic text-center py-6">準備好就點擊錄音鍵開始練習喔！老師在等你。</p> : 
                    transcriptions.map((item, idx) => (
                      <div key={idx} className={`flex ${item.role === 'model' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] p-5 rounded-3xl text-sm shadow-sm transition-all hover:shadow-md ${
                          item.role === 'model' ? 'bg-white text-gray-700 rounded-tl-none border border-orange-100 font-medium' : 'bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-tr-none font-black shadow-orange-100'
                        }`}>{item.text}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #fffcf9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffe7d1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #fb923c; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(1rem); } to { transform: translateY(0); } }
        @keyframes zoom-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-in { animation: fade-in 0.5s ease-out, slide-in-from-bottom-4 0.5s ease-out; }
      `}} />
    </div>
  );
};

export default App;
