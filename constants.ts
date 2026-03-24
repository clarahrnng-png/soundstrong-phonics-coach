
import { PhonemeInfo, PhonemeType, Badge } from './types';

export const BADGES: Badge[] = [
  { id: 'first_step', name: '初試啼聲', description: '完成第一次發音練習', icon: '🐣', color: 'bg-yellow-400' },
  { id: 'vowel_master', name: '母音達人', description: '練習 5 個不同的母音', icon: '👄', color: 'bg-purple-400' },
  { id: 'streak_3', name: '勤奮學子', description: '連續練習 3 次', icon: '🔥', color: 'bg-orange-400' },
  { id: 'perfect_score', name: '發音大師', description: '獲得老師的高度讚賞 👏', icon: '👑', color: 'bg-blue-400' },
];

export const MOCK_LEADERBOARD = [
  { name: '小明', points: 2450 },
  { name: '王大同', points: 1820 },
  { name: '陳小華', points: 1560 },
  { name: 'Jessica L.', points: 1200 },
];

export const PHONEMES: PhonemeInfo[] = [
  // --- VOWELS (10) ---
  {
    id: 'long-e',
    ipa: '/iː/',
    exampleWords: ['Sheep', 'Eat', 'See'],
    type: PhonemeType.VOWEL,
    description: '長母音，嘴唇用力向兩邊展開。',
    tips: '就像在微笑一樣，聲音要拉長且尖銳。',
    commonMistakes: '唸得太短變成 /ɪ/。',
    animationState: 'open',
    minimalPairs: [
      { word1: 'Sheep', word2: 'Ship', targetIpa: '/iː/', comparisonIpa: '/ɪ/' },
      { word1: 'Seat', word2: 'Sit', targetIpa: '/iː/', comparisonIpa: '/ɪ/' }
    ],
    sentences: ["I see three sheep.", "Please eat your meat.", "Keep the key in your pocket.", "We need to clean the street."]
  },
  {
    id: 'short-i',
    ipa: '/ɪ/',
    exampleWords: ['Ship', 'Sit', 'Big'],
    type: PhonemeType.VOWEL,
    description: '短母音，發音輕快短促。',
    tips: '嘴巴放鬆，不要張太大，發音要快。',
    commonMistakes: '常被唸成長音 /iː/。',
    animationState: 'neutral',
    minimalPairs: [
      { word1: 'Ship', word2: 'Sheep', targetIpa: '/ɪ/', comparisonIpa: '/iː/' },
      { word1: 'Bin', word2: 'Bean', targetIpa: '/ɪ/', comparisonIpa: '/iː/' }
    ],
    sentences: ["The ship sits in the dock.", "It is a bit chilly.", "Fill the bin with fish.", "This ring is a bit big."]
  },
  {
    id: 'short-e',
    ipa: '/ɛ/',
    exampleWords: ['Bed', 'Red', 'Egg'],
    type: PhonemeType.VOWEL,
    description: '短母音，嘴巴微張。',
    tips: '嘴巴張開程度介於 /æ/ 與 /ɪ/ 之間。',
    commonMistakes: '張嘴太大變成蝴蝶音。',
    animationState: 'neutral',
    minimalPairs: [
      { word1: 'Bed', word2: 'Bad', targetIpa: '/ɛ/', comparisonIpa: '/æ/' },
      { word1: 'Men', word2: 'Man', targetIpa: '/ɛ/', comparisonIpa: '/æ/' }
    ],
    sentences: ["Tell me the best test.", "Get the red egg.", "Ten men went to bed.", "Help me set the net."]
  },
  {
    id: 'ae-sound',
    ipa: '/æ/',
    exampleWords: ['Apple', 'Cat', 'Bad'],
    type: PhonemeType.VOWEL,
    description: '蝴蝶音，大張嘴的母音。',
    tips: '嘴巴張到最大，嘴角往兩邊拉開。',
    commonMistakes: '嘴巴張得不夠大，變成 /ɛ/。',
    animationState: 'open',
    minimalPairs: [
      { word1: 'Bad', word2: 'Bed', targetIpa: '/æ/', comparisonIpa: '/ɛ/' },
      { word1: 'Had', word2: 'Head', targetIpa: '/æ/', comparisonIpa: '/ɛ/' }
    ],
    sentences: ["The fat cat sat on the mat.", "That is a bad apple.", "The man had a black hat.", "Happy cats nap on bags."]
  },
  {
    id: 'vowel-ah',
    ipa: '/ɑː/',
    exampleWords: ['Car', 'Father', 'Star'],
    type: PhonemeType.VOWEL,
    description: '大口母音，嘴巴自然向下張開。',
    tips: '想像醫生叫你說「啊」，舌頭放平。',
    commonMistakes: '嘴巴張得不夠垂直。',
    animationState: 'open',
    sentences: ["My father has a fast car.", "Look at the star.", "Park the car in the dark.", "The heart is a large part."]
  },
  {
    id: 'vowel-aw',
    ipa: '/ɔː/',
    exampleWords: ['Law', 'Saw', 'Door'],
    type: PhonemeType.VOWEL,
    description: '長母音，嘴唇呈橢圓形。',
    tips: '聲音從喉嚨後方發出，帶一點長音。',
    commonMistakes: '常唸成 /oʊ/。',
    animationState: 'rounded',
    sentences: ["I saw the door open.", "The law is for all.", "Paul bought a tall ball.", "The fall was long and raw."]
  },
  {
    id: 'vowel-uh',
    ipa: '/ʌ/',
    exampleWords: ['Cup', 'Luck', 'Sun'],
    type: PhonemeType.VOWEL,
    description: '短母音，嘴巴自然放鬆微張。',
    tips: '發音短促有力，像被輕拍肚子的聲音。',
    commonMistakes: '常唸成 /ɑː/。',
    animationState: 'neutral',
    minimalPairs: [
      { word1: 'Cup', word2: 'Cap', targetIpa: '/ʌ/', comparisonIpa: '/æ/' }
    ],
    sentences: ["Sun is up in the sky.", "Good luck with the cup.", "The duck is in the mud.", "Run for fun in the sun."]
  },
  {
    id: 'short-u',
    ipa: '/ʊ/',
    exampleWords: ['Foot', 'Book', 'Look'],
    type: PhonemeType.VOWEL,
    description: '短母音，嘴唇微圓不突出。',
    tips: '嘴巴稍微放鬆，不要用力嘟嘴。',
    commonMistakes: '唸成長音 /uː/。',
    animationState: 'rounded',
    minimalPairs: [
      { word1: 'Look', word2: 'Luke', targetIpa: '/ʊ/', comparisonIpa: '/uː/' },
      { word1: 'Full', word2: 'Fool', targetIpa: '/ʊ/', comparisonIpa: '/uː/' }
    ],
    sentences: ["Look at that good book.", "He took his foot off.", "Put the wood in the hood.", "The cook shook the sugar."]
  },
  {
    id: 'long-u',
    ipa: '/uː/',
    exampleWords: ['Food', 'Blue', 'Moon'],
    type: PhonemeType.VOWEL,
    description: '長母音，嘴唇圓且突出。',
    tips: '嘴巴用力縮圓，聲音拉長。',
    commonMistakes: '發音不夠圓或太短。',
    animationState: 'rounded',
    minimalPairs: [
      { word1: 'Fool', word2: 'Full', targetIpa: '/uː/', comparisonIpa: '/ʊ/' },
      { word1: 'Pool', word2: 'Pull', targetIpa: '/uː/', comparisonIpa: '/ʊ/' }
    ],
    sentences: ["The soup is cool and blue.", "Move to the music soon.", "The goose flew to the pool.", "Use the spoon for the food."]
  },
  {
    id: 'vowel-er',
    ipa: '/ɜː/',
    exampleWords: ['Nurse', 'Bird', 'Work'],
    type: PhonemeType.VOWEL,
    description: '捲舌母音，嘴唇平放。',
    tips: '舌尖微微向上捲，發出帶有 R 感的長音。',
    commonMistakes: '舌頭捲得太後面或沒捲舌。',
    animationState: 'neutral',
    sentences: ["The nurse is at work.", "Early bird gets the worm.", "Her shirt is dirty.", "Learn the first word."]
  },
  {
    id: 'vowel-er-unstressed',
    ipa: '/ɚ/',
    exampleWords: ['Teacher', 'Doctor', 'Sugar'],
    type: PhonemeType.VOWEL,
    description: '輕聲捲舌母音，出現在非重音節。',
    tips: '發音像 /ə/ 但舌尖微微向上捲，非常輕短。',
    commonMistakes: '常被唸成不捲舌的 /ə/。',
    animationState: 'neutral',
    sentences: ["My teacher is a doctor.", "Add some sugar to the water.", "The butter is in the center.", "Better later than never."]
  },
  {
    id: 'vowel-ar',
    ipa: '/ɑːr/',
    exampleWords: ['Car', 'Farm', 'Heart'],
    type: PhonemeType.VOWEL,
    description: '大口捲舌母音。',
    tips: '嘴巴先張大發 /ɑː/，結尾舌尖捲起。',
    commonMistakes: '忘記捲舌，聽起來像單純的 /ɑː/。',
    animationState: 'open',
    sentences: ["Park the car on the farm.", "The star is far away.", "Start the hard work.", "He has a large heart."]
  },
  {
    id: 'vowel-or',
    ipa: '/ɔːr/',
    exampleWords: ['Door', 'Short', 'Morning'],
    type: PhonemeType.VOWEL,
    description: '圓唇捲舌母音。',
    tips: '嘴巴先縮圓發 /ɔː/，結尾舌尖捲起。',
    commonMistakes: '捲舌不夠明顯。',
    animationState: 'rounded',
    sentences: ["Open the door in the morning.", "The story is short.", "Four horses on the floor.", "Born in the north."]
  },
  {
    id: 'vowel-air',
    ipa: '/ɛr/',
    exampleWords: ['Air', 'Hair', 'Care'],
    type: PhonemeType.VOWEL,
    description: '開口捲舌母音。',
    tips: '嘴巴微張發 /ɛ/，結尾舌尖捲起。',
    commonMistakes: '常唸成 /eɪr/。',
    animationState: 'neutral',
    sentences: ["The air is fresh.", "Brush your hair with care.", "Where is the chair?", "There is a pair of bears."]
  },
  {
    id: 'vowel-ear',
    ipa: '/ɪr/',
    exampleWords: ['Ear', 'Near', 'Deer'],
    type: PhonemeType.VOWEL,
    description: '閉口捲舌母音。',
    tips: '嘴巴微張發 /ɪ/，結尾舌尖捲起。',
    commonMistakes: '唸得太像 /iːr/。',
    animationState: 'neutral',
    sentences: ["I can hear with my ear.", "The deer is near.", "Clear the beer.", "Fear the spear."]
  },

  // --- DIPHTHONGS (6) ---
  {
    id: 'ei-diphthong',
    ipa: '/eɪ/',
    exampleWords: ['Day', 'Rain', 'Face'],
    type: PhonemeType.DIPHTHONG,
    description: '雙母音，由 /e/ 滑向 /ɪ/。',
    tips: '聲音要有流動感，結尾要有縮小的感覺。',
    commonMistakes: '發得太短變成單音 /ɛ/。',
    animationState: 'neutral',
    minimalPairs: [
      { word1: 'Wait', word2: 'Wet', targetIpa: '/eɪ/', comparisonIpa: '/ɛ/' },
      { word1: 'Late', word2: 'Let', targetIpa: '/eɪ/', comparisonIpa: '/ɛ/' }
    ],
    sentences: ["Wait for the rain today.", "They play all day.", "Say the name on the cake.", "The train came late."]
  },
  {
    id: 'ai-diphthong',
    ipa: '/aɪ/',
    exampleWords: ['Sky', 'My', 'High'],
    type: PhonemeType.DIPHTHONG,
    description: '雙母音，由 /a/ 滑向 /ɪ/。',
    tips: '嘴巴由大到小快速滑動。',
    commonMistakes: '發音不夠完整，滑動感不明顯。',
    animationState: 'open',
    minimalPairs: [
      { word1: 'Ride', word2: 'Red', targetIpa: '/aɪ/', comparisonIpa: '/ɛ/' }
    ],
    sentences: ["The sky is high.", "I like my bike.", "Try the white rice.", "Time to fly the kite."]
  },
  {
    id: 'oi-diphthong',
    ipa: '/ɔɪ/',
    exampleWords: ['Boy', 'Toy', 'Oil'],
    type: PhonemeType.DIPHTHONG,
    description: '雙母音，由 /ɔ/ 滑向 /ɪ/。',
    tips: '嘴唇由圓變扁，流暢滑動。',
    commonMistakes: '兩個音斷開，沒有連在一起。',
    animationState: 'rounded',
    sentences: ["The boy plays with toys.", "Oil is in the soil.", "Enjoy the joy of the voice.", "Point to the coin."]
  },
  {
    id: 'au-diphthong',
    ipa: '/aʊ/',
    exampleWords: ['Now', 'House', 'Cloud'],
    type: PhonemeType.DIPHTHONG,
    description: '雙母音，由 /a/ 滑向 /ʊ/。',
    tips: '嘴巴先張大，再迅速縮小變圓。',
    commonMistakes: '結尾沒有收圓。',
    animationState: 'open',
    minimalPairs: [
      { word1: 'Now', word2: 'No', targetIpa: '/aʊ/', comparisonIpa: '/oʊ/' }
    ],
    sentences: ["Go out of the house.", "The clouds are round.", "How about the brown cow?", "Found a mouse on the ground."]
  },
  {
    id: 'ou-diphthong',
    ipa: '/oʊ/',
    exampleWords: ['Go', 'Boat', 'Old'],
    type: PhonemeType.DIPHTHONG,
    description: '雙母音，由 /o/ 滑向 /ʊ/。',
    tips: '嘴巴先放鬆微圓，再向內縮緊。',
    commonMistakes: '唸成單音，結尾沒收圓。',
    animationState: 'rounded',
    minimalPairs: [
      { word1: 'Boat', word2: 'Bought', targetIpa: '/oʊ/', comparisonIpa: '/ɔː/' }
    ],
    sentences: ["Go home on the boat.", "Don't hold the gold.", "Show the low snow.", "The road is cold and old."]
  },

  // --- CONSONANTS - PLOSIVES (6) ---
  {
    id: 'p-sound',
    ipa: '/p/',
    exampleWords: ['Pen', 'Pig', 'Map'],
    type: PhonemeType.CONSONANT,
    description: '無聲雙唇塞音。',
    tips: '雙唇緊閉後突然張開，噴出強氣。',
    commonMistakes: '噴氣不夠強，聽起來像 /b/。',
    animationState: 'neutral',
    sentences: ["A pink pig with a pen.", "Stop at the map.", "Pick up the paper cup.", "Put the pot on the top."]
  },
  {
    id: 'b-sound',
    ipa: '/b/',
    exampleWords: ['Big', 'Boy', 'Bag'],
    type: PhonemeType.CONSONANT,
    description: '有聲雙唇塞音。',
    tips: '嘴型同 /p/，但發音時聲帶要震動。',
    commonMistakes: '發音太輕。',
    animationState: 'neutral',
    sentences: ["The big boy has a bag.", "Bring the book.", "The baby has a blue ball.", "Best buy for the boat."]
  },
  {
    id: 't-sound',
    ipa: '/t/',
    exampleWords: ['Ten', 'Tea', 'Cat'],
    type: PhonemeType.CONSONANT,
    description: '無聲齒齦塞音。',
    tips: '舌尖抵住上齒齦，快速放開並噴氣。',
    commonMistakes: '噴氣不足，聽起來像 /d/。',
    animationState: 'tongue-up',
    sentences: ["Tell me the time.", "Two cats on the mat.", "Take the ten tickets.", "Eat the sweet tart."]
  },
  {
    id: 'd-sound',
    ipa: '/d/',
    exampleWords: ['Day', 'Dog', 'Dad'],
    type: PhonemeType.CONSONANT,
    description: '有聲齒齦塞音。',
    tips: '位置同 /t/，發音時帶動聲帶震動。',
    commonMistakes: '發音過短。',
    animationState: 'tongue-up',
    sentences: ["Dad loves the dog.", "Do it today.", "Did you find the red door?", "Dance in the dark."]
  },
  {
    id: 'k-sound',
    ipa: '/k/',
    exampleWords: ['Key', 'Cat', 'Back'],
    type: PhonemeType.CONSONANT,
    description: '無聲軟顎塞音。',
    tips: '舌後根抵住軟顎，爆發出清脆氣流。',
    commonMistakes: '噴氣不夠，像 /g/。',
    animationState: 'neutral',
    sentences: ["Keep the cat back.", "Cook the cake.", "The king has a black key.", "Kick the quick clock."]
  },
  {
    id: 'g-sound',
    ipa: '/g/',
    exampleWords: ['Go', 'Get', 'Egg'],
    type: PhonemeType.CONSONANT,
    description: '有聲軟顎塞音。',
    tips: '位置同 /k/，發音時聲帶震動。',
    commonMistakes: '發音不夠響亮。',
    animationState: 'neutral',
    sentences: ["Go get the big egg.", "The girl is good.", "Give the green gift.", "The dog is big and gray."]
  },

  // --- CONSONANTS - FRICATIVES (10) ---
  {
    id: 'f-sound',
    ipa: '/f/',
    exampleWords: ['Fan', 'Fish', 'Leaf'],
    type: PhonemeType.CONSONANT,
    description: '無聲唇齒摩擦音。',
    tips: '上齒輕觸下唇，吹出平滑氣流。',
    commonMistakes: '常被唸成 /h/。',
    animationState: 'neutral',
    sentences: ["Five fast fish.", "The leaf is off.", "Fill the four fans.", "Find the soft fluff."]
  },
  {
    id: 'v-sound',
    ipa: '/v/',
    exampleWords: ['Very', 'Voice', 'Five'],
    type: PhonemeType.CONSONANT,
    description: '有聲唇齒摩擦音。',
    tips: '上齒輕咬下唇並震動聲帶。',
    commonMistakes: '常被唸成 /b/ 或 /w/。',
    animationState: 'neutral',
    minimalPairs: [
      { word1: 'Very', word2: 'Berry', targetIpa: '/v/', comparisonIpa: '/b/' },
      { word1: 'Vest', word2: 'West', targetIpa: '/v/', comparisonIpa: '/w/' }
    ],
    sentences: ["Victor loves the view.", "Five very loud voices.", "The van is very fast.", "Give the five gloves."]
  },
  {
    id: 'th-voiceless',
    ipa: '/θ/',
    exampleWords: ['Think', 'Three', 'Bath'],
    type: PhonemeType.CONSONANT,
    description: '無聲咬舌音，輕觸舌尖。',
    tips: '舌頭放在牙齒中間吹氣。',
    commonMistakes: '常被唸成 /s/ 或 /f/。',
    animationState: 'tongue-out',
    minimalPairs: [
      { word1: 'Think', word2: 'Sink', targetIpa: '/θ/', comparisonIpa: '/s/' },
      { word1: 'Three', word2: 'Free', targetIpa: '/θ/', comparisonIpa: '/f/' }
    ],
    sentences: ["I think I saw three birds.", "Thank you for the bath.", "The thin path is north.", "Both teeth are healthy."]
  },
  {
    id: 'th-voiced',
    ipa: '/ð/',
    exampleWords: ['The', 'This', 'Mother'],
    type: PhonemeType.CONSONANT,
    description: '有聲咬舌音，震動舌尖。',
    tips: '位置同 /θ/，但要發出震動聲。',
    commonMistakes: '常被唸成 /d/ 或 /z/。',
    animationState: 'tongue-out',
    minimalPairs: [
      { word1: 'They', word2: 'Day', targetIpa: '/ð/', comparisonIpa: '/d/' },
      { word1: 'Then', word2: 'Den', targetIpa: '/ð/', comparisonIpa: '/d/' }
    ],
    sentences: ["This is my brother.", "They went there.", "That is their father.", "Breathe with the weather."]
  },
  {
    id: 's-sound',
    ipa: '/s/',
    exampleWords: ['Sun', 'See', 'Bus'],
    type: PhonemeType.CONSONANT,
    description: '無聲齒齦摩擦音。',
    tips: '舌尖靠近上齒齦但不接觸，吹出氣流。',
    commonMistakes: '氣流噴出位置不對。',
    animationState: 'neutral',
    sentences: ["See the sun set.", "Six buses pass.", "Sing a sad song.", "The glass is on the grass."]
  },
  {
    id: 'z-sound',
    ipa: '/z/',
    exampleWords: ['Zoo', 'Rose', 'Buzz'],
    type: PhonemeType.CONSONANT,
    description: '有聲齒齦摩擦音。',
    tips: '位置像 /s/，但要發出蜜蜂般的震動。',
    commonMistakes: '唸成無聲的 /s/。',
    animationState: 'neutral',
    minimalPairs: [
      { word1: 'Zip', word2: 'Sip', targetIpa: '/z/', comparisonIpa: '/s/' },
      { word1: 'Buzz', word2: 'Bus', targetIpa: '/z/', comparisonIpa: '/s/' }
    ],
    sentences: ["Zoe likes the zoo.", "A rose has a buzz.", "Zero is a size.", "The busy bees buzz."]
  },
  {
    id: 'sh-sound',
    ipa: '/ʃ/',
    exampleWords: ['Ship', 'Fish', 'She'],
    type: PhonemeType.CONSONANT,
    description: '唏聲音，嘴唇微翹。',
    tips: '就像在叫人安靜「噓」。',
    commonMistakes: '唸成 /s/。',
    animationState: 'rounded',
    minimalPairs: [
      { word1: 'Ship', word2: 'Sip', targetIpa: '/ʃ/', comparisonIpa: '/s/' },
      { word1: 'Show', word2: 'Sew', targetIpa: '/ʃ/', comparisonIpa: '/s/' }
    ],
    sentences: ["She sells seashells.", "Wash the fish.", "Show the short shoe.", "The shop is on the ship."]
  },
  {
    id: 'zh-sound',
    ipa: '/ʒ/',
    exampleWords: ['Vision', 'Measure', 'Asia'],
    type: PhonemeType.CONSONANT,
    description: '有聲唏聲音。',
    tips: '位置同 /ʃ/，但要帶動聲帶強烈震動。',
    commonMistakes: '常被唸成 /z/。',
    animationState: 'rounded',
    sentences: ["Check your vision.", "Measure the pleasure.", "Usual leisure time.", "A garage in the mirage."]
  },
  {
    id: 'h-sound',
    ipa: '/h/',
    exampleWords: ['Hat', 'Hi', 'Hot'],
    type: PhonemeType.CONSONANT,
    description: '無聲聲門摩擦音。',
    tips: '像在哈氣一樣，氣流輕輕呼出。',
    commonMistakes: '氣流太強。',
    animationState: 'open',
    sentences: ["Hi, hold my hat.", "The house is hot.", "Help him hide.", "He has a heavy heart."]
  },

  // --- CONSONANTS - AFFRICATES (2) ---
  {
    id: 'ch-sound',
    ipa: '/tʃ/',
    exampleWords: ['Chair', 'Watch', 'Much'],
    type: PhonemeType.CONSONANT,
    description: '無聲塞擦音，爆發力強。',
    tips: '舌尖先擋住氣再突然放開噴氣。',
    commonMistakes: '唸成 /ʃ/。',
    animationState: 'tongue-up',
    minimalPairs: [
      { word1: 'Chair', word2: 'Share', targetIpa: '/tʃ/', comparisonIpa: '/ʃ/' },
      { word1: 'Cheap', word2: 'Sheep', targetIpa: '/tʃ/', comparisonIpa: '/ʃ/' }
    ],
    sentences: ["Charlie chose the chair.", "Watch the match.", "Check the rich cheese.", "Each child has a peach."]
  },
  {
    id: 'dj-sound',
    ipa: '/dʒ/',
    exampleWords: ['Jump', 'Age', 'Judge'],
    type: PhonemeType.CONSONANT,
    description: '有聲塞擦音。',
    tips: '位置同 /tʃ/，但要帶動聲帶震動。',
    commonMistakes: '震動不足或唸成 /z/。',
    animationState: 'tongue-up',
    minimalPairs: [
      { word1: 'Joke', word2: 'Choke', targetIpa: '/dʒ/', comparisonIpa: '/tʃ/' }
    ],
    sentences: ["Jump for joy.", "The judge is old.", "The large bridge is huge.", "Join the gym in June."]
  },

  // --- CONSONANTS - NASALS (3) ---
  {
    id: 'm-sound',
    ipa: '/m/',
    exampleWords: ['Me', 'Man', 'Mom'],
    type: PhonemeType.CONSONANT,
    description: '雙唇鼻音。',
    tips: '雙唇緊閉，聲音從鼻子發出。',
    commonMistakes: '結尾音沒閉嘴。',
    animationState: 'neutral',
    sentences: ["Mom made many meals.", "Me and my mouse.", "Make more money.", "The room is warm."]
  },
  {
    id: 'n-sound',
    ipa: '/n/',
    exampleWords: ['No', 'Nice', 'Sun'],
    type: PhonemeType.CONSONANT,
    description: '齒齦鼻音。',
    tips: '舌尖抵住齒齦，氣流從鼻子發出。',
    commonMistakes: '與 /l/ 搞混。',
    animationState: 'tongue-up',
    sentences: ["No, it is nice.", "Sun on the mountain.", "Nine new pens.", "Run in the rain."]
  },
  {
    id: 'ng-sound',
    ipa: '/ŋ/',
    exampleWords: ['Sing', 'Long', 'Ring'],
    type: PhonemeType.CONSONANT,
    description: '軟顎鼻音。',
    tips: '舌根抬起擋住口腔，讓氣流從鼻子走。',
    commonMistakes: '發成 /n/ 或結尾加了 /g/ 的音。',
    animationState: 'tongue-up',
    minimalPairs: [
      { word1: 'Sing', word2: 'Sin', targetIpa: '/ŋ/', comparisonIpa: '/n/' }
    ],
    sentences: ["Sing a long song.", "Bring the ring.", "The king is strong.", "Hang the long string."]
  },

  // --- CONSONANTS - APPROXIMANTS (4) ---
  {
    id: 'l-sound',
    ipa: '/l/',
    exampleWords: ['Light', 'Love', 'Ball'],
    type: PhonemeType.CONSONANT,
    description: '舌邊音，舌尖抵住上齒齦。',
    tips: '舌尖抵在上齒後方氣流兩側流出。',
    commonMistakes: '唸成捲舌音 /r/。',
    animationState: 'tongue-up',
    minimalPairs: [
      { word1: 'Light', word2: 'Right', targetIpa: '/l/', comparisonIpa: '/r/' },
      { word1: 'Fly', word2: 'Fry', targetIpa: '/l/', comparisonIpa: '/r/' }
    ],
    sentences: ["Lily loves the light.", "Look at the little ball.", "Leaf on the lake.", "The tall wall is full."]
  },
  {
    id: 'r-sound',
    ipa: '/r/',
    exampleWords: ['Red', 'Run', 'Car'],
    type: PhonemeType.CONSONANT,
    description: '捲舌音，舌頭不碰上顎。',
    tips: '舌尖微微向上捲但不碰到上方。',
    commonMistakes: '唸成舌邊音 /l/。',
    animationState: 'rounded',
    minimalPairs: [
      { word1: 'Read', word2: 'Lead', targetIpa: '/r/', comparisonIpa: '/l/' },
      { word1: 'Road', word2: 'Load', targetIpa: '/r/', comparisonIpa: '/l/' }
    ],
    sentences: ["Run down the red road.", "Are you ready to race?", "Read the real story.", "The green grass is rare."]
  },
  {
    id: 'w-sound',
    ipa: '/w/',
    exampleWords: ['We', 'Wet', 'Win'],
    type: PhonemeType.CONSONANT,
    description: '雙唇硬顎近音。',
    tips: '嘴唇縮圓後迅速放鬆，像發 /uː/ 的開始。',
    commonMistakes: '唸成 /v/。',
    animationState: 'rounded',
    sentences: ["We will win.", "The weather is wet.", "Wait for the white whale.", "The wide world is wonderful."]
  },
  {
    id: 'j-sound',
    ipa: '/j/',
    exampleWords: ['Yes', 'You', 'Yellow'],
    type: PhonemeType.CONSONANT,
    description: '硬顎近音。',
    tips: '舌中抬高靠近硬顎，快速滑向後面的母音。',
    commonMistakes: '唸成 /dʒ/。',
    animationState: 'neutral',
    sentences: ["Yes, you are right.", "Yellow and young.", "Yesterday was your year.", "Use the yellow yarn."]
  },

  // --- SPECIAL (1) ---
  {
    id: 'schwa',
    ipa: '/ə/',
    exampleWords: ['About', 'Teacher', 'Soda'],
    type: PhonemeType.SPECIAL,
    description: '弱化母音 (Schwa)，最常見。',
    tips: '完全放鬆，極短促的「ㄜ」。',
    commonMistakes: '唸得太重或太清楚。',
    animationState: 'neutral',
    sentences: ["About a soda.", "My teacher is nice.", "A banana for dinner.", "The sofa is comfortable."]
  }
];

export const TEACHER_SYSTEM_PROMPT = `
You are 'Teacher Sound Strong' (赫穠老師), a charismatic, high-energy, and world-class English Phonics coach specifically for Taiwan learners.

CORE PERSONALITY:
- Language: Traditional Chinese (Taiwan). Use warm, local particles like 喔, 吧, 呢, 唷, 呀.
- Attitude: Always encouraging, but highly precise. You have "golden ears" for phonics.
- Goal: Help the student achieve a native-like "Sound Strong" accent through muscle-memory tips.

ENCOURAGEMENT STYLES (Rotate these based on performance):
1. **The Enthusiastic Coach** (For great performance): 
   - "對！就是這個聲音！非常有精神喔！"
   - "太震撼了，這個噴氣音發得真到位！"
   - "哇！這個發音簡直是教科書等級的！"
   - "你的進步真的讓我太驚訝了，繼續保持這股氣勢！"
   - "太棒了！你已經掌握了這個音的精髓！"
   - "聽聽看這個聲音，多麼清脆有力！"
   - "天啊！這聲音太好聽了，簡直是聲控的福音！"
   - "這就是我們要的 Sound Strong 能量！"
2. **The High-Praise Mentor** (For consistent accuracy): 
   - "簡直是母語人士等級！你的發音讓我都要給按個讚！"
   - "非常流利，聽起來非常自然。"
   - "這就是我們追求的 'Sound Strong' 精神！"
   - "聽起來非常有自信，這就是成功的關鍵！"
   - "你的語調非常有感染力，聽起來很舒服。"
   - "這是我今天聽到最完美的發音了！"
   - "你的耳朵一定很靈敏，才能抓到這麼細微的差別！"
   - "這發音，我給 100 分，多一分怕你太驕傲！"
3. **The Gentle Supporter** (When struggling): 
   - "很接近了喔！我們再放鬆一點點，再來挑戰一次吧。"
   - "沒關係，這是最難的一個音，慢慢練習一定會變強的！"
   - "別灰心，發音是肌肉記憶，多練幾次舌頭就會聽話了。"
   - "我們稍微調整一下嘴型，你一定可以做到的！"
   - "沒事沒事，我們放慢速度，先抓到那個感覺。"
   - "發音就像運動，需要一點時間暖身，再來一次！"
   - "差一點點就完美了！我們把舌頭再往後縮一點試試？"
   - "老師陪你一起練，這個音我們一定能攻克它！"

DIAGNOSTIC GUIDELINES:
- **Reference Context**: You MUST use the provided '發音祕訣' (Tips) and '常見錯誤' (Common Mistakes) to diagnose the student.
- **Specific Feedback Structure**:
    1. **Observation**: Start with what you heard.
    2. **Diagnosis**: If there's an error, link it to the '常見錯誤'.
    3. **Actionable Tip**: Use the '發音祕訣' to provide a physical correction.
- **Error Diagnosis**: If the student makes a mistake, point it out explicitly: "聽起來你把 [單字] 唸成 [錯誤音] 了喔！這是常見的盲點。"
- **Actionable Guidance**: Use the '發音祕訣' to give specific instructions: "試試看 [根據發音祕訣修正]，讓聲音更到位。"
- **Muscle Memory**: Focus on physical descriptions (tongue position, lip shape, air flow).
- **Minimal Pairs**: In comparison mode, explicitly check if the two words sound distinct. If they sound too similar, explain the muscle movement (e.g., "蝴蝶音要張得更大").
- **Sentence Flow**: In sentence mode, focus on linking (Linking sounds), reductions, and the "Music of English". Say things like "這邊連音連得很漂亮喔！"

INTERACTION RULES:
- If user input is good: Give a short praise + a "Sound Strong" fun fact or a slight challenge (e.g., "試著唸快一點？").
- If user input is poor: Be encouraging. Identify exactly where the tongue or lips went wrong using the provided Tips.
- Use emojis liberally: 👏, 🌟, 👍, 🔥, 👄, 🎤, 🚀, ✨.

Current Context:
- Mode: (Will be provided in prompt)
- Target Phoneme: (Will be provided in prompt)
- Tips: (Will be provided in prompt)
- Common Mistakes: (Will be provided in prompt)
`;
