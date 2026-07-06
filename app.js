"use strict";

const SESSION_LENGTH = 30;
const PRONUNCIATION_SESSION_LENGTH = 15;
const PRONUNCIATION_MAX_HAN_LENGTH = 12;
const SETTINGS_KEY = "chineseTrainerSettings";
const SETTINGS_VERSION = 2;
const HISTORY_KEY = "chineseTrainerHistory";
const HISTORY_LIMIT = 100;

const LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const SENTENCE_COUNTS = {
  beginner: 600,
  intermediate: 600,
  advanced: 600,
};

const SENTENCE_DATA_SRC = "./sentence-data.js";
const WORD_DATA_SRC = "./word-data.js";

const MODES = {
  listening: {
    label: "Listening",
    task: "Listen to the Chinese sentence and type the English meaning.",
    sentenceLabel: "Audio sentence",
    answerPlaceholder: "Type the English meaning you heard",
  },
  writing: {
    label: "Writing",
    task: "Read the English sentence and write it in Chinese.",
    sentenceLabel: "English sentence",
    answerPlaceholder: "Write the Chinese sentence",
  },
  reading: {
    label: "Reading",
    task: "Read the Chinese sentence and type the English meaning.",
    sentenceLabel: "Chinese sentence",
    answerPlaceholder: "Type the English meaning",
  },
};

const TOOLS = {
  vocabulary: {
    label: "Vocabulary Quiz",
  },
  pronunciation: {
    label: "Pronunciation",
  },
  map: {
    label: "Geography of China",
  },
  drill: {
    label: "Sentence Drills",
  },
  history: {
    label: "History",
  },
};

const VOCABULARY_MODES = {
  pinyin: {
    label: "Pinyin",
    task: "Read the Chinese word and type its pinyin.",
    promptLabel: "Chinese word",
    answerPlaceholder: "Type pinyin; spaces, tones, and ü marks optional",
  },
  meaning: {
    label: "Audio",
    task: "Listen to the Chinese word and type its English meaning.",
    promptLabel: "Audio word",
    answerPlaceholder: "Type the English meaning",
  },
};

const ACCEPTANCE_THRESHOLD = 0.7;

const VOICE_SPEEDS = {
  normal: 0.82,
  slow: 0.68,
  "very-slow": 0.52,
};

const PREVIEW_CELLS = {
  listening: {
    character: "听",
    description: "Audio-first translation practice",
  },
  writing: {
    character: "写",
    description: "English to written Chinese recall",
  },
  reading: {
    character: "读",
    description: "Chinese reading comprehension",
  },
};

const VOCABULARY_PREVIEW_CELLS = {
  pinyin: {
    character: "词",
    description: "Chinese characters to pinyin recall",
  },
  meaning: {
    character: "听",
    description: "Audio-first vocabulary meaning recall",
  },
};

const SENTENCES = [];
const RAW_VOCABULARY_QUIZ_SETS = Array.isArray(window.VOCABULARY_QUIZ_SETS)
  ? window.VOCABULARY_QUIZ_SETS
  : [];
const VOCABULARY_QUIZ_SETS = buildVocabularyQuizSets(RAW_VOCABULARY_QUIZ_SETS);
const VOCABULARY_ORDER_OPTIONS = {
  random: "Random order",
  list: "List order",
};
const DEFAULT_VOCABULARY_ORDER = "random";
const VOCABULARY_CHOICE_COUNT = 5;
const VOCABULARY_SECONDS_PER_WORD = 6.85;
const VOCABULARY_MIN_TIMER_SECONDS = 300;
const VOCABULARY_PREVIEW_LIMIT = 12;
const HIDDEN_TRANSLATION_LABEL = "Hidden";
const PINYIN_INITIALS = ["zh", "ch", "sh", "b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "r", "z", "c", "s", "y", "w"];
const CHINA_MAP_VIEWBOX = { width: 980, height: 660 };
const CHINA_MAP_ZOOM_MIN = 1;
const CHINA_MAP_ZOOM_MAX = 3;
const CHINA_MAP_ZOOM_STEP = 0.5;
const CHINA_MAINLAND_FRAME = {
  x: 28,
  y: 18,
  width: 924,
  height: 606,
  minLng: 73.2,
  maxLng: 135.2,
  minLat: 17.2,
  maxLat: 53.9,
};
const SOUTH_CHINA_SEA_INSET = {
  x: 802,
  y: 498,
  width: 132,
  height: 112,
  minLng: 108,
  maxLng: 124,
  minLat: 3,
  maxLat: 24,
};
const CHINA_PROVINCES = [
  { id: "xinjiang", name: "新疆维吾尔自治区", shortName: "新疆", pinyin: "Xīnjiāng Wéiwú'ěr Zìzhìqū", label: ["新疆维吾尔", "自治区"], labelX: 190, labelY: 255, points: "70,210 135,135 245,145 315,200 320,285 270,355 180,370 90,315 48,255" },
  { id: "xizang", name: "西藏自治区", shortName: "西藏", pinyin: "Xīzàng Zìzhìqū", label: ["西藏", "自治区"], labelX: 220, labelY: 455, points: "120,385 265,355 365,395 355,485 290,540 170,520 80,455" },
  { id: "qinghai", name: "青海省", shortName: "青海", pinyin: "Qīnghǎi Shěng", label: ["青海省"], labelX: 345, labelY: 355, points: "300,300 410,305 445,375 370,420 265,360" },
  { id: "gansu", name: "甘肃省", shortName: "甘肃", pinyin: "Gānsù Shěng", label: ["甘肃省"], labelX: 390, labelY: 285, points: "330,230 415,245 465,310 445,345 400,315 370,270 325,265" },
  { id: "ningxia", name: "宁夏回族自治区", shortName: "宁夏", pinyin: "Níngxià Huízú Zìzhìqū", label: ["宁夏"], labelX: 458, labelY: 306, circle: { cx: 458, cy: 305, r: 18 } },
  { id: "neimenggu", name: "内蒙古自治区", shortName: "内蒙古", pinyin: "Nèi Měnggǔ Zìzhìqū", label: ["内蒙古自治区"], labelX: 530, labelY: 180, points: "350,145 480,105 635,105 740,155 720,225 620,245 500,225 430,245 365,205" },
  { id: "heilongjiang", name: "黑龙江省", shortName: "黑龙江", pinyin: "Hēilóngjiāng Shěng", label: ["黑龙江省"], labelX: 710, labelY: 135, points: "650,75 755,72 792,130 755,190 670,175 625,125" },
  { id: "jilin", name: "吉林省", shortName: "吉林", pinyin: "Jílín Shěng", label: ["吉林省"], labelX: 675, labelY: 212, points: "640,180 728,190 718,235 645,235 610,205" },
  { id: "liaoning", name: "辽宁省", shortName: "辽宁", pinyin: "Liáoníng Shěng", label: ["辽宁省"], labelX: 650, labelY: 265, points: "615,238 704,242 692,295 630,295 592,262" },
  { id: "beijing", name: "北京市", shortName: "北京", pinyin: "Běijīng Shì", label: ["北京"], labelX: 570, labelY: 286, circle: { cx: 570, cy: 285, r: 13 } },
  { id: "tianjin", name: "天津市", shortName: "天津", pinyin: "Tiānjīn Shì", label: ["天津"], labelX: 594, labelY: 301, circle: { cx: 594, cy: 300, r: 11 } },
  { id: "hebei", name: "河北省", shortName: "河北", pinyin: "Héběi Shěng", label: ["河北省"], labelX: 560, labelY: 325, points: "535,260 615,285 610,345 560,365 520,330" },
  { id: "shanxi", name: "山西省", shortName: "山西", pinyin: "Shānxī Shěng", label: ["山西省"], labelX: 502, labelY: 330, points: "500,285 540,310 535,365 485,370 465,320" },
  { id: "shandong", name: "山东省", shortName: "山东", pinyin: "Shāndōng Shěng", label: ["山东省"], labelX: 630, labelY: 375, points: "575,340 675,340 705,382 650,410 585,390" },
  { id: "henan", name: "河南省", shortName: "河南", pinyin: "Hénán Shěng", label: ["河南省"], labelX: 548, labelY: 410, points: "510,365 585,380 605,430 545,455 495,420" },
  { id: "jiangsu", name: "江苏省", shortName: "江苏", pinyin: "Jiāngsū Shěng", label: ["江苏省"], labelX: 650, labelY: 432, points: "625,400 675,410 690,455 640,465 610,430" },
  { id: "shanghai", name: "上海市", shortName: "上海", pinyin: "Shànghǎi Shì", label: ["上海"], labelX: 690, labelY: 456, circle: { cx: 690, cy: 455, r: 10 } },
  { id: "anhui", name: "安徽省", shortName: "安徽", pinyin: "Ānhuī Shěng", label: ["安徽省"], labelX: 594, labelY: 458, points: "585,415 635,430 638,480 580,495 550,455" },
  { id: "zhejiang", name: "浙江省", shortName: "浙江", pinyin: "Zhèjiāng Shěng", label: ["浙江省"], labelX: 642, labelY: 500, points: "630,468 690,465 675,520 625,535 598,500" },
  { id: "fujian", name: "福建省", shortName: "福建", pinyin: "Fújiàn Shěng", label: ["福建省"], labelX: 618, labelY: 555, points: "600,525 665,525 655,590 600,585 570,555" },
  { id: "jiangxi", name: "江西省", shortName: "江西", pinyin: "Jiāngxī Shěng", label: ["江西省"], labelX: 558, labelY: 530, points: "545,485 600,500 598,560 540,570 515,525" },
  { id: "hubei", name: "湖北省", shortName: "湖北", pinyin: "Húběi Shěng", label: ["湖北省"], labelX: 520, labelY: 470, points: "490,430 555,445 565,500 500,510 460,470" },
  { id: "hunan", name: "湖南省", shortName: "湖南", pinyin: "Húnán Shěng", label: ["湖南省"], labelX: 520, labelY: 552, points: "500,505 560,520 555,585 500,590 465,545" },
  { id: "guangdong", name: "广东省", shortName: "广东", pinyin: "Guǎngdōng Shěng", label: ["广东省"], labelX: 555, labelY: 617, points: "515,585 600,585 628,625 565,655 500,635" },
  { id: "guangxi", name: "广西壮族自治区", shortName: "广西", pinyin: "Guǎngxī Zhuàngzú Zìzhìqū", label: ["广西壮族", "自治区"], labelX: 455, labelY: 595, points: "425,550 505,565 505,635 430,625 390,585" },
  { id: "hainan", name: "海南省", shortName: "海南", pinyin: "Hǎinán Shěng", label: ["海南省"], labelX: 520, labelY: 670, circle: { cx: 520, cy: 670, r: 24 } },
  { id: "sichuan", name: "四川省", shortName: "四川", pinyin: "Sìchuān Shěng", label: ["四川省"], labelX: 410, labelY: 455, points: "370,395 465,405 485,480 430,530 345,500 330,440" },
  { id: "chongqing", name: "重庆市", shortName: "重庆", pinyin: "Chóngqìng Shì", label: ["重庆"], labelX: 470, labelY: 488, points: "462,455 500,470 500,515 460,520 440,485" },
  { id: "guizhou", name: "贵州省", shortName: "贵州", pinyin: "Guìzhōu Shěng", label: ["贵州省"], labelX: 458, labelY: 555, points: "430,520 500,525 505,580 445,590 410,555" },
  { id: "yunnan", name: "云南省", shortName: "云南", pinyin: "Yúnnán Shěng", label: ["云南省"], labelX: 375, labelY: 585, points: "335,520 430,535 430,620 355,640 300,590" },
  { id: "shaanxi", name: "陕西省", shortName: "陕西", pinyin: "Shǎnxī Shěng", label: ["陕西省"], labelX: 462, labelY: 385, points: "450,330 505,355 492,435 445,425 425,365" },
  { id: "taiwan", name: "台湾省", shortName: "台湾", pinyin: "Táiwān Shěng", label: ["台湾省"], labelX: 696, labelY: 585, points: "690,545 720,555 715,610 682,620 670,575" },
  { id: "hongkong", name: "香港特别行政区", shortName: "香港", pinyin: "Xiānggǎng Tèbié Xíngzhèngqū", label: ["香港"], labelX: 585, labelY: 634, circle: { cx: 585, cy: 634, r: 8 } },
  { id: "macao", name: "澳门特别行政区", shortName: "澳门", pinyin: "Àomén Tèbié Xíngzhèngqū", label: ["澳门"], labelX: 560, labelY: 635, circle: { cx: 560, cy: 635, r: 7 } },
];
const CHINA_CITIES = [
  { id: "beijing-city", provinceId: "beijing", name: "北京市", pinyin: "Běijīng Shì", lng: 116.4074, lat: 39.9042, x: 570, y: 285 },
  { id: "tianjin-city", provinceId: "tianjin", name: "天津市", pinyin: "Tiānjīn Shì", lng: 117.201, lat: 39.0842, x: 594, y: 300 },
  { id: "shijiazhuang", provinceId: "hebei", name: "石家庄市", pinyin: "Shíjiāzhuāng Shì", lng: 114.5149, lat: 38.0428, x: 552, y: 332 },
  { id: "taiyuan", provinceId: "shanxi", name: "太原市", pinyin: "Tàiyuán Shì", lng: 112.5492, lat: 37.8706, x: 505, y: 333 },
  { id: "hohhot", provinceId: "neimenggu", name: "呼和浩特市", pinyin: "Hūhéhàotè Shì", lng: 111.7492, lat: 40.8426, x: 495, y: 238 },
  { id: "shenyang", provinceId: "liaoning", name: "沈阳市", pinyin: "Shěnyáng Shì", lng: 123.4315, lat: 41.8057, x: 650, y: 265 },
  { id: "changchun", provinceId: "jilin", name: "长春市", pinyin: "Chángchūn Shì", lng: 125.3235, lat: 43.8171, x: 675, y: 212 },
  { id: "haerbin", provinceId: "heilongjiang", name: "哈尔滨市", pinyin: "Hā'ěrbīn Shì", lng: 126.6424, lat: 45.756, x: 705, y: 145 },
  { id: "shanghai-city", provinceId: "shanghai", name: "上海市", pinyin: "Shànghǎi Shì", lng: 121.4737, lat: 31.2304, x: 690, y: 455 },
  { id: "nanjing", provinceId: "jiangsu", name: "南京市", pinyin: "Nánjīng Shì", lng: 118.7969, lat: 32.0603, x: 632, y: 424 },
  { id: "hangzhou", provinceId: "zhejiang", name: "杭州市", pinyin: "Hángzhōu Shì", lng: 120.1551, lat: 30.2741, x: 645, y: 492 },
  { id: "hefei", provinceId: "anhui", name: "合肥市", pinyin: "Héféi Shì", lng: 117.2272, lat: 31.8206, x: 592, y: 456 },
  { id: "fuzhou", provinceId: "fujian", name: "福州市", pinyin: "Fúzhōu Shì", lng: 119.2965, lat: 26.0745, x: 625, y: 555 },
  { id: "nanchang", provinceId: "jiangxi", name: "南昌市", pinyin: "Nánchāng Shì", lng: 115.8582, lat: 28.6829, x: 558, y: 530 },
  { id: "jinan", provinceId: "shandong", name: "济南市", pinyin: "Jǐnán Shì", lng: 117.1201, lat: 36.6512, x: 625, y: 370 },
  { id: "zhengzhou", provinceId: "henan", name: "郑州市", pinyin: "Zhèngzhōu Shì", lng: 113.6254, lat: 34.7466, x: 548, y: 410 },
  { id: "wuhan", provinceId: "hubei", name: "武汉市", pinyin: "Wǔhàn Shì", lng: 114.3055, lat: 30.5928, x: 522, y: 468 },
  { id: "changsha", provinceId: "hunan", name: "长沙市", pinyin: "Chángshā Shì", lng: 112.9388, lat: 28.2282, x: 525, y: 550 },
  { id: "guangzhou", provinceId: "guangdong", name: "广州市", pinyin: "Guǎngzhōu Shì", lng: 113.2644, lat: 23.1291, x: 555, y: 617 },
  { id: "nanning", provinceId: "guangxi", name: "南宁市", pinyin: "Nánníng Shì", lng: 108.3669, lat: 22.817, x: 455, y: 596 },
  { id: "haikou", provinceId: "hainan", name: "海口市", pinyin: "Hǎikǒu Shì", lng: 110.3312, lat: 20.031, x: 520, y: 670 },
  { id: "chengdu", provinceId: "sichuan", name: "成都市", pinyin: "Chéngdū Shì", lng: 104.0665, lat: 30.5728, x: 410, y: 455 },
  { id: "chongqing-city", provinceId: "chongqing", name: "重庆市", pinyin: "Chóngqìng Shì", lng: 106.5516, lat: 29.563, x: 470, y: 488 },
  { id: "guiyang", provinceId: "guizhou", name: "贵阳市", pinyin: "Guìyáng Shì", lng: 106.6302, lat: 26.647, x: 458, y: 555 },
  { id: "kunming", provinceId: "yunnan", name: "昆明市", pinyin: "Kūnmíng Shì", lng: 102.8329, lat: 24.8801, x: 375, y: 585 },
  { id: "lasa", provinceId: "xizang", name: "拉萨市", pinyin: "Lāsà Shì", lng: 91.1322, lat: 29.6604, x: 240, y: 455 },
  { id: "xian", provinceId: "shaanxi", name: "西安市", pinyin: "Xī'ān Shì", lng: 108.9398, lat: 34.3416, x: 462, y: 385 },
  { id: "lanzhou", provinceId: "gansu", name: "兰州市", pinyin: "Lánzhōu Shì", lng: 103.8343, lat: 36.0611, x: 405, y: 315 },
  { id: "xining", provinceId: "qinghai", name: "西宁市", pinyin: "Xīníng Shì", lng: 101.7782, lat: 36.6171, x: 360, y: 345 },
  { id: "yinchuan", provinceId: "ningxia", name: "银川市", pinyin: "Yínchuān Shì", lng: 106.2309, lat: 38.4872, x: 458, y: 305 },
  { id: "wulumuqi", provinceId: "xinjiang", name: "乌鲁木齐市", pinyin: "Wūlǔmùqí Shì", lng: 87.6168, lat: 43.8256, x: 165, y: 245 },
  { id: "taibei", provinceId: "taiwan", name: "台北市", pinyin: "Táiběi Shì", lng: 121.5654, lat: 25.033, x: 700, y: 565 },
  { id: "xianggang", provinceId: "hongkong", name: "香港", pinyin: "Xiānggǎng", lng: 114.1694, lat: 22.3193, x: 585, y: 634 },
  { id: "aomen", provinceId: "macao", name: "澳门", pinyin: "Àomén", lng: 113.5439, lat: 22.1987, x: 560, y: 635 },
];
const CHINA_MAP_ITEMS = [
  ...CHINA_PROVINCES.map((item) => ({ ...item, kind: "province" })),
  ...CHINA_CITIES.map((item) => ({ ...item, kind: "city" })),
];
const MAP_QUIZ_MODES = {
  province: {
    label: "Region mode",
    shortLabel: "Regions",
    pickerLabel: "Regions",
    pickerDetail: "Provincial-level",
    startLabel: "Start region quiz",
    promptType: "省级行政区",
    targetMetric: "Provincial-level regions",
    homeDescription: "Test your knowledge of China's geography",
    instruction: "Select the correct region on the map.",
    tip: "Tip: click the provincial-level region to select your answer.",
  },
  city: {
    label: "City mode",
    shortLabel: "Cities",
    pickerLabel: "Cities",
    pickerDetail: "City pins",
    startLabel: "Start city quiz",
    promptType: "城市",
    targetMetric: "City pins",
    homeDescription: "Test your knowledge of China's geography",
    instruction: "Select the correct city pin on the map.",
    tip: "Tip: click the city pin to select your answer.",
  },
};
const DEFAULT_MAP_QUIZ_MODE = "province";
const loadedScripts = new Map();
let sentenceDataPromise = null;
let sentenceDataLoaded = false;
let wordDataPromise = null;
let wordDataLoaded = false;
let vocabularyTimerId = 0;
let speechRequestId = 0;
let pronunciationRecognition = null;
let pronunciationRecognitionRequestId = 0;
let pronunciationRecordingState = null;
let CHINESE_WORD_DATA = {};
let MAX_CHINESE_WORD_LENGTH = 1;
const PRONUNCIATION_SILENCE_GRACE_MS = 3000;
const PRONUNCIATION_MANUAL_STOP_GRACE_MS = 900;
const PRONUNCIATION_RESTART_DELAY_MS = 160;
const PRONUNCIATION_MAX_RECORDING_MS = 20000;
const HAN_CHARACTER_PATTERN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u;
const PINYIN_TONE_MARKS = {
  ā: ["a", "1"],
  á: ["a", "2"],
  ǎ: ["a", "3"],
  à: ["a", "4"],
  ē: ["e", "1"],
  é: ["e", "2"],
  ě: ["e", "3"],
  è: ["e", "4"],
  ī: ["i", "1"],
  í: ["i", "2"],
  ǐ: ["i", "3"],
  ì: ["i", "4"],
  ō: ["o", "1"],
  ó: ["o", "2"],
  ǒ: ["o", "3"],
  ò: ["o", "4"],
  ū: ["u", "1"],
  ú: ["u", "2"],
  ǔ: ["u", "3"],
  ù: ["u", "4"],
  ǖ: ["v", "1"],
  ǘ: ["v", "2"],
  ǚ: ["v", "3"],
  ǜ: ["v", "4"],
  ü: ["v", ""],
  ń: ["n", "2"],
  ň: ["n", "3"],
  ǹ: ["n", "4"],
  ḿ: ["m", "2"],
};
const PLECO_TONE_CLASS_BY_TONE = {
  1: "tone-one",
  2: "tone-two",
  3: "tone-three",
  4: "tone-four",
  5: "tone-neutral",
};

const state = {
  tool: "drill",
  mode: "reading",
  vocabularyMode: "pinyin",
  vocabularySetId: VOCABULARY_QUIZ_SETS[0]?.id || "",
  vocabularyOrder: DEFAULT_VOCABULARY_ORDER,
  vocabularyHideTranslations: false,
  mapQuizMode: DEFAULT_MAP_QUIZ_MODE,
  mapShowPinyinNames: false,
  pronunciationShowPinyin: true,
  selectedLevels: new Set(["beginner"]),
  voiceSpeed: "normal",
  voices: [],
  preferredVoice: null,
  isSpeaking: false,
  isLoadingSentences: false,
  isCheckingAnswer: false,
  dataError: "",
  session: null,
  result: null,
};

const app = document.querySelector("#app");
const levelOptions = document.querySelector("#levelOptions");
const voiceSpeed = document.querySelector("#voiceSpeed");
const vocabularyOrder = document.querySelector("#vocabularyOrder");
const vocabularyHideTranslations = document.querySelector("#vocabularyHideTranslations");
const pronunciationShowPinyin = document.querySelector("#pronunciationShowPinyin");

function init() {
  if (!app || !levelOptions || !voiceSpeed || !vocabularyOrder || !vocabularyHideTranslations || !pronunciationShowPinyin) {
    throw new Error("Chinese Trainer could not find its required page elements.");
  }

  loadSettings();
  renderLevelOptions();
  syncVocabularyOptionControls();
  bindTopLevelControls();
  bindGlossTooltipAlignment();
  loadVoices();
  primeVoicesOnFirstInteraction();
  render();
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    if (saved.tool && TOOLS[saved.tool]) {
      state.tool = saved.tool;
    }
    if (saved.mode && MODES[saved.mode]) {
      state.mode = saved.mode;
    }
    if (saved.vocabularyMode && VOCABULARY_MODES[saved.vocabularyMode]) {
      state.vocabularyMode = saved.vocabularyMode;
    }
    if (saved.vocabularySetId && VOCABULARY_QUIZ_SETS.some((set) => set.id === saved.vocabularySetId)) {
      state.vocabularySetId = saved.vocabularySetId;
    }
    if (
      saved.settingsVersion >= SETTINGS_VERSION &&
      saved.vocabularyOrder &&
      VOCABULARY_ORDER_OPTIONS[saved.vocabularyOrder]
    ) {
      state.vocabularyOrder = saved.vocabularyOrder;
    }
    if (typeof saved.vocabularyHideTranslations === "boolean") {
      state.vocabularyHideTranslations = saved.vocabularyHideTranslations;
    }
    if (saved.mapQuizMode && MAP_QUIZ_MODES[saved.mapQuizMode]) {
      state.mapQuizMode = saved.mapQuizMode;
    }
    if (typeof saved.mapShowPinyinNames === "boolean") {
      state.mapShowPinyinNames = saved.mapShowPinyinNames;
    }
    if (typeof saved.pronunciationShowPinyin === "boolean") {
      state.pronunciationShowPinyin = saved.pronunciationShowPinyin;
    }
    if (Array.isArray(saved.selectedLevels) && saved.selectedLevels.length) {
      state.selectedLevels = new Set(
        saved.selectedLevels.filter((level) => LEVELS.some((item) => item.id === level)),
      );
    }
    if (saved.voiceSpeed && VOICE_SPEEDS[saved.voiceSpeed]) {
      state.voiceSpeed = saved.voiceSpeed;
    }
  } catch {
    state.selectedLevels = new Set(["beginner"]);
  }

  if (!state.selectedLevels.size) {
    state.selectedLevels.add("beginner");
  }

  if (!state.vocabularySetId && VOCABULARY_QUIZ_SETS[0]) {
    state.vocabularySetId = VOCABULARY_QUIZ_SETS[0].id;
  }

  voiceSpeed.value = state.voiceSpeed;
  vocabularyOrder.value = state.vocabularyOrder;
  pronunciationShowPinyin.checked = state.pronunciationShowPinyin;
  syncVocabularyOptionControls();
}

function saveSettings() {
  try {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        settingsVersion: SETTINGS_VERSION,
        tool: state.tool,
        mode: state.mode,
        vocabularyMode: state.vocabularyMode,
        vocabularySetId: state.vocabularySetId,
        vocabularyOrder: state.vocabularyOrder,
        vocabularyHideTranslations: state.vocabularyHideTranslations,
        mapQuizMode: state.mapQuizMode,
        mapShowPinyinNames: state.mapShowPinyinNames,
        pronunciationShowPinyin: state.pronunciationShowPinyin,
        selectedLevels: [...state.selectedLevels],
        voiceSpeed: state.voiceSpeed,
      }),
    );
  } catch {
    // Settings persistence is a convenience; practice sessions still work without it.
  }
}

function bindTopLevelControls() {
  document.querySelectorAll(".tool-tab").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTool = button.dataset.tool;
      if (!TOOLS[nextTool] || nextTool === state.tool) return;

      if (state.session && !window.confirm("Switch tools and end this session?")) {
        return;
      }

      stopPronunciationRecognition();
      stopSpeech();
      state.tool = nextTool;
      state.session = null;
      state.result = null;
      state.dataError = "";
      saveSettings();
      render();
    });
  });

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.mode;
      if (nextMode === state.mode) return;

      if (state.session && !window.confirm("Switch training type and end this session?")) {
        return;
      }

      stopPronunciationRecognition();
      stopSpeech();
      state.mode = nextMode;
      state.session = null;
      state.result = null;
      saveSettings();
      render();
    });
  });

  document.querySelectorAll("[data-vocabulary-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.vocabularyMode;
      if (!VOCABULARY_MODES[nextMode] || nextMode === state.vocabularyMode) return;

      if (state.session && !window.confirm("Switch quiz type and end this session?")) {
        return;
      }

      stopPronunciationRecognition();
      stopSpeech();
      state.vocabularyMode = nextMode;
      state.session = null;
      state.result = null;
      saveSettings();
      render();
    });
  });

  document.addEventListener("keydown", handleSessionShortcut);

  voiceSpeed.addEventListener("change", () => {
    state.voiceSpeed = voiceSpeed.value;
    saveSettings();
  });

  vocabularyOrder.addEventListener("change", () => {
    state.vocabularyOrder = vocabularyOrder.value;
    state.result = null;
    saveSettings();
    render();
  });

  vocabularyHideTranslations.addEventListener("change", () => {
    state.vocabularyHideTranslations = vocabularyHideTranslations.checked;
    state.result = null;
    saveSettings();
    render();
  });

  pronunciationShowPinyin.addEventListener("change", () => {
    state.pronunciationShowPinyin = pronunciationShowPinyin.checked;
    if (state.session?.type === "pronunciation") {
      state.session.showPinyin = state.pronunciationShowPinyin;
    }
    saveSettings();
    render();
  });
}

function bindGlossTooltipAlignment() {
  document.addEventListener("pointerover", (event) => {
    const target = event.target.closest?.(".annotated-word.has-gloss");
    if (target) {
      alignGlossTooltip(target);
    }
  });

  document.addEventListener("focusin", (event) => {
    const target = event.target.closest?.(".annotated-word.has-gloss");
    if (target) {
      alignGlossTooltip(target);
    }
  });
}

function handleSessionShortcut(event) {
  if (event.isComposing || event.altKey) {
    return;
  }

  if (isVocabularyChoiceShortcut(event)) {
    event.preventDefault();
    submitVocabularyChoiceByShortcut(event.key);
    return;
  }

  const isEnter = event.key === "Enter";
  if (!isEnter) {
    return;
  }

  if ((event.metaKey || event.ctrlKey) && sessionUsesAudioPrompt(state.session)) {
    event.preventDefault();
    const current = state.session.items[state.session.index];
    if (current) {
      speak(current.zh, { immediate: true });
    }
    return;
  }

  if (event.metaKey || event.ctrlKey || event.shiftKey) {
    return;
  }

  if (isTypingTarget(event.target) && event.target?.id !== "answerInput") {
    return;
  }

  if (!state.session) {
    if (shouldStartSessionFromShortcut(event.target)) {
      event.preventDefault();
      startActiveSession();
    }
    return;
  }

  event.preventDefault();

  if (state.session.currentAssessment) {
    nextQuestion();
    return;
  }

  if (state.session.type === "vocabulary") {
    if (state.session.quizMode === "pinyin") {
      const input = document.querySelector("#vocabularyGuess");
      if (input) {
        submitVocabularyGuess(input.value);
      }
      return;
    }

    return;
  }

  if (state.session.type === "pronunciation") {
    if (state.session.isListening) {
      requestPronunciationManualStop();
      return;
    }

    startPronunciationRecording();
    return;
  }

  const input = document.querySelector("#answerInput");
  if (input) {
    submitAnswer(input.value);
  }
}

function isTypingTarget(target) {
  const tagName = target?.tagName?.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || target?.isContentEditable;
}

function shouldStartSessionFromShortcut(target) {
  return !isTypingTarget(target) && !state.result;
}

function sessionUsesAudioPrompt(session) {
  if (session?.type === "pronunciation") {
    return true;
  }

  return session?.type === "vocabulary"
    ? session.quizMode === "meaning"
    : session?.mode === "listening";
}

function isVocabularyChoiceShortcut(event) {
  return state.session?.type === "vocabulary" &&
    state.session.quizMode === "meaning" &&
    !state.session.currentAssessment &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    /^[1-5]$/.test(event.key);
}

function renderLevelOptions() {
  const selectedPoolCount = getSelectedSentenceCount();
  const levelMarkup = LEVELS.map((level) => {
    const checked = state.selectedLevels.has(level.id) ? "checked" : "";
    return `
      <label class="level-check">
        <input type="checkbox" value="${level.id}" ${checked}>
        ${level.label}
      </label>
    `;
  }).join("");

  levelOptions.innerHTML = `
    ${levelMarkup}
    <span class="level-check pool-count-pill" aria-label="Selected sentence pool: ${selectedPoolCount}">
      <strong>${selectedPoolCount}</strong>
      <span>Selected sentence pool</span>
    </span>
  `;

  levelOptions.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        state.selectedLevels.add(input.value);
      } else if (state.selectedLevels.size > 1) {
        state.selectedLevels.delete(input.value);
      } else {
        input.checked = true;
      }

      state.session = null;
      state.result = null;
      saveSettings();
      renderLevelOptions();
      render();
    });
  });
}

function ensureSentenceData() {
  hydrateSentenceDataFromWindow();
  if (sentenceDataLoaded) {
    return Promise.resolve();
  }

  if (!sentenceDataPromise) {
    sentenceDataPromise = loadScriptOnce(SENTENCE_DATA_SRC)
      .then(() => {
        hydrateSentenceDataFromWindow();
        if (!sentenceDataLoaded) {
          throw new Error("The sentence bank loaded, but no sentences were found.");
        }
      })
      .catch((error) => {
        sentenceDataPromise = null;
        throw error;
      });
  }

  return sentenceDataPromise;
}

function hydrateSentenceDataFromWindow() {
  if (typeof window === "undefined" || !Array.isArray(window.ADDITIONAL_SENTENCES)) {
    return;
  }

  const seenIds = new Set(SENTENCES.map((item) => item.id));
  window.ADDITIONAL_SENTENCES.forEach((item) => {
    if (!seenIds.has(item.id)) {
      SENTENCES.push(item);
      seenIds.add(item.id);
    }
  });

  sentenceDataLoaded = SENTENCES.length > 0;
}

function ensureWordData() {
  hydrateWordDataFromWindow();
  if (wordDataLoaded) {
    return Promise.resolve();
  }

  if (!wordDataPromise) {
    wordDataPromise = loadScriptOnce(WORD_DATA_SRC)
      .then(() => {
        hydrateWordDataFromWindow();
        if (!wordDataLoaded) {
          throw new Error("The word glossary loaded, but no word data was found.");
        }
      })
      .catch((error) => {
        wordDataPromise = null;
        throw error;
      });
  }

  return wordDataPromise;
}

function hydrateWordDataFromWindow() {
  if (
    typeof window === "undefined" ||
    !window.CHINESE_WORD_DATA ||
    typeof window.CHINESE_WORD_DATA !== "object"
  ) {
    return;
  }

  CHINESE_WORD_DATA = window.CHINESE_WORD_DATA;
  MAX_CHINESE_WORD_LENGTH = Math.max(1, ...Object.keys(CHINESE_WORD_DATA).map((word) => word.length));
  wordDataLoaded = true;
}

function loadScriptOnce(src) {
  if (loadedScripts.has(src)) {
    return loadedScripts.get(src);
  }

  const promise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-dynamic-src="${src}"]`);
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = existing || document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.dynamicSrc = src;

    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`Could not load ${src}.`)), { once: true });

    if (!existing) {
      document.head.append(script);
    }
  });

  loadedScripts.set(src, promise);
  return promise;
}

function queueIdleTask(callback) {
  if (typeof window === "undefined") {
    return;
  }

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 2500 });
    return;
  }

  window.setTimeout(callback, 400);
}

function loadVoices() {
  if (!supportsSpeechSynthesis()) {
    return;
  }

  const refresh = refreshVoices;

  refresh();
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", refresh);
  } else {
    window.speechSynthesis.onvoiceschanged = refresh;
  }
}

function primeVoicesOnFirstInteraction() {
  if (!supportsSpeechSynthesis()) {
    return;
  }

  const prime = () => refreshVoices();
  ["pointerdown", "touchstart", "keydown"].forEach((eventName) => {
    document.addEventListener(eventName, prime, { once: true, passive: true });
  });
}

function refreshVoices() {
  if (!supportsSpeechSynthesis()) {
    return [];
  }

  state.voices = window.speechSynthesis.getVoices();
  state.preferredVoice = choosePreferredVoice(state.voices);
  return state.voices;
}

function waitForVoices(timeout = 450) {
  const voices = refreshVoices();
  if (voices.length) {
    return Promise.resolve(voices);
  }

  return new Promise((resolve) => {
    let settled = false;
    let intervalId = 0;

    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearInterval(intervalId);
      resolve(refreshVoices());
    };

    const onVoicesChanged = () => finish();

    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged, { once: true });
    }

    intervalId = window.setInterval(() => {
      if (window.speechSynthesis.getVoices().length) {
        finish();
      }
    }, 75);

    window.setTimeout(finish, timeout);
  });
}

function choosePreferredVoice(voices) {
  const chineseVoices = voices.filter(isMandarinVoice);
  const mandarinVoices = chineseVoices.filter(isSimplifiedMandarinVoice);
  const candidates = mandarinVoices.length ? mandarinVoices : chineseVoices;
  return candidates
    .map((voice) => ({ voice, score: scoreMandarinVoice(voice) }))
    .sort((a, b) => b.score - a.score)[0]?.voice || null;
}

function scoreMandarinVoice(voice) {
  const name = `${voice.name || ""} ${voice.voiceURI || ""}`.toLowerCase();
  const lang = (voice.lang || "").toLowerCase();
  let score = lang === "zh-cn" ? 160 : 100;
  if (lang.startsWith("cmn-cn") || lang.startsWith("zh-hans")) score += 45;
  if (lang.startsWith("cmn") || lang.startsWith("zh")) score += 20;

  if (name.includes("microsoft") && (name.includes("online") || name.includes("natural"))) score += 900;
  if (name.includes("xiaoxiao")) score += 820;
  if (name.includes("xiaoyi")) score += 760;
  if (name.includes("yunxi") || name.includes("yunyang")) score += 720;
  if (name.includes("microsoft")) score += 650;
  if (name.includes("google")) score += 560;
  if (name.includes("ting-ting") || name.includes("tingting") || name.includes("ting ting")) score += 500;
  if (name.includes("premium") || name.includes("enhanced") || name.includes("neural")) score += 420;
  if (name.includes("natural") || name.includes("siri")) score += 360;
  if (voice.localService === false) score += 90;
  if (name.includes("compact") || name.includes("eloquence")) score -= 260;

  return score;
}

function isMandarinVoice(voice) {
  const lang = (voice.lang || "").toLowerCase();
  const name = `${voice.name || ""} ${voice.voiceURI || ""}`.toLowerCase();
  const excludedNames = ["cantonese", "yue"];

  if (lang.startsWith("yue") || excludedNames.some((term) => name.includes(term))) {
    return false;
  }

  return lang.startsWith("zh") ||
    lang.startsWith("cmn") ||
    name.includes("mandarin") ||
    name.includes("putonghua") ||
    name.includes("chinese");
}

function isSimplifiedMandarinVoice(voice) {
  const lang = (voice.lang || "").toLowerCase();
  const name = `${voice.name || ""} ${voice.voiceURI || ""}`.toLowerCase();
  const excludedNames = ["yue", "hong kong", "hk", "taiwan", "taiwanese", "tw"];
  const mainlandMandarinLangs = ["zh-cn", "zh-hans", "cmn-cn", "cmn-hans", "cmn-hans-cn"];

  return mainlandMandarinLangs.some((prefix) => lang.startsWith(prefix)) &&
    !excludedNames.some((term) => name.includes(term));
}

function render() {
  updateNavigationState();

  if (state.result) {
    stopVocabularyTimer();
    if (state.result.type === "vocabulary") {
      renderVocabularyResults();
    } else if (state.result.type === "pronunciation") {
      renderPronunciationResults();
    } else if (state.result.type === "map") {
      renderMapQuizResults();
    } else {
      renderResults();
    }
    return;
  }

  if (state.session) {
    renderSession();
    if (state.session.type === "vocabulary") {
      startVocabularyTimer();
    } else {
      stopVocabularyTimer();
    }
    return;
  }

  stopVocabularyTimer();
  if (state.tool === "history") {
    renderHistoryHome();
    return;
  }

  if (state.tool === "vocabulary") {
    renderVocabularyHome();
    return;
  }

  if (state.tool === "pronunciation") {
    renderPronunciationHome();
    return;
  }

  if (state.tool === "map") {
    renderMapQuizHome();
    return;
  }

  renderModeHome();
}

function updateNavigationState() {
  document.body.dataset.tool = state.tool;
  document.body.dataset.mode = state.tool === "drill" ? state.mode : state.tool;
  document.querySelectorAll(".drill-only").forEach((element) => {
    element.hidden = state.tool !== "drill";
  });
  document.querySelectorAll(".sentence-bank-only").forEach((element) => {
    element.hidden = state.tool !== "drill" && state.tool !== "pronunciation";
  });
  document.querySelectorAll(".pronunciation-only").forEach((element) => {
    element.hidden = state.tool !== "pronunciation";
  });
  document.querySelectorAll(".vocabulary-only").forEach((element) => {
    element.hidden = state.tool !== "vocabulary";
  });
  document.querySelectorAll(".tool-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === state.tool);
  });
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
  document.querySelectorAll("[data-vocabulary-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.vocabularyMode === state.vocabularyMode);
  });
  syncVocabularyOptionControls();
}

function syncVocabularyOptionControls() {
  if (!vocabularyOrder || !vocabularyHideTranslations) {
    return;
  }

  const translationsHidden = state.vocabularyMode === "meaning" || state.vocabularyHideTranslations;
  vocabularyOrder.value = state.vocabularyOrder;
  vocabularyHideTranslations.checked = translationsHidden;
  vocabularyHideTranslations.disabled = state.vocabularyMode === "meaning";
}

function shortcutHint(key, options = {}) {
  const commandControl = options.commandControl || false;
  const label = commandControl ? `Command or Control plus ${key}` : key;
  const modifierMarkup = commandControl
    ? `<kbd>⌘</kbd><span class="shortcut-separator">/</span><kbd>Ctrl</kbd><span class="shortcut-plus">+</span>`
    : "";

  return `
    <span class="shortcut-hint" aria-label="${label}">
      ${modifierMarkup}<kbd>${key}</kbd>
    </span>
  `;
}

function trashIconMarkup() {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 6h18"></path>
      <path d="M8 6V4h8v2"></path>
      <path d="M19 6l-1 14H6L5 6"></path>
      <path d="M10 11v5"></path>
      <path d="M14 11v5"></path>
    </svg>
  `;
}

function renderModeHome() {
  const mode = MODES[state.mode];
  const preview = PREVIEW_CELLS[state.mode];
  const hasEnoughSentences = getSelectedSentenceCount() >= SESSION_LENGTH;
  const startLabel = state.isLoadingSentences ? "Loading sentence bank..." : "Start 30-sentence session";

  app.innerHTML = `
    <section class="workspace-panel">
      <div class="mode-heading">
        <div>
          <h2>${mode.label} Training</h2>
          <p>${mode.task}</p>
        </div>
      </div>

      <div class="task-preview" aria-hidden="true">
        <div class="preview-cell">
          <strong>${preview.character}</strong>
          <span>${preview.description}</span>
        </div>
      </div>

      ${hasEnoughSentences ? "" : `
        <p class="empty-note">
          Select at least ${SESSION_LENGTH} available sentences before starting a session.
        </p>
      `}
      ${state.dataError ? `<p class="empty-note error-note">${escapeHtml(state.dataError)}</p>` : ""}

      <button class="primary-btn shortcut-btn" type="button" id="startSession" ${hasEnoughSentences && !state.isLoadingSentences ? "" : "disabled"}>
        <span>${startLabel}</span>
        ${shortcutHint("Enter")}
      </button>
    </section>
  `;

  document.querySelector("#startSession").addEventListener("click", startSession);
}

function renderPronunciationHome() {
  const shortSentenceCount = getSelectedPronunciationSentenceCount();
  const hasEnoughSentences = shortSentenceCount >= PRONUNCIATION_SESSION_LENGTH;
  const recognitionAvailable = supportsSpeechRecognition();
  const startLabel = state.isLoadingSentences ? "Loading sentence bank..." : "Start 15-sentence session";

  app.innerHTML = `
    <section class="workspace-panel">
      <div class="mode-heading">
        <div>
          <h2>Pronunciation Practice</h2>
          <p>Read short Chinese sentences aloud and compare what the browser recognizes.</p>
        </div>
      </div>

      <div class="task-preview pronunciation-preview" aria-hidden="true">
        <div class="preview-cell">
          <strong>说</strong>
          <span>Short sentence speaking practice</span>
        </div>
      </div>

      <div class="stat-grid pronunciation-home-stats">
        <div class="stat">
          <strong>${shortSentenceCount}</strong>
          <span>Short prompts in pool</span>
        </div>
        <div class="stat">
          <strong>${state.pronunciationShowPinyin ? "On" : "Off"}</strong>
          <span>Pinyin hint</span>
        </div>
      </div>

      ${recognitionAvailable ? "" : `
        <p class="empty-note error-note">
          Speech recognition is not available in this browser. Try Chrome or Edge on an HTTPS page.
        </p>
      `}
      ${hasEnoughSentences ? "" : `
        <p class="empty-note">
          Select at least ${PRONUNCIATION_SESSION_LENGTH} short sentences before starting a session.
        </p>
      `}
      ${state.dataError ? `<p class="empty-note error-note">${escapeHtml(state.dataError)}</p>` : ""}

      <div class="pronunciation-start-row">
        <button class="primary-btn shortcut-btn" type="button" id="startPronunciationSession" ${hasEnoughSentences && !state.isLoadingSentences && recognitionAvailable ? "" : "disabled"}>
          <span>${startLabel}</span>
          ${shortcutHint("Enter")}
        </button>
      </div>
    </section>
  `;

  document.querySelector("#startPronunciationSession").addEventListener("click", startPronunciationSession);
}

function renderMapQuizHome() {
  const mapMode = getSelectedMapQuizMode();
  const targetCount = getMapQuizPool().length;
  const sessionLength = targetCount;

  app.innerHTML = `
    <section class="workspace-panel map-quiz-workspace map-home">
      ${buildMapModeHeaderMarkup({ interactive: true })}

      <div class="map-game-shell map-home-shell">
        <aside class="map-question-panel map-home-panel">
          <div class="map-score-card">
            <div>
              <span>Practice Set</span>
              <strong>${sessionLength}</strong>
              <small>Questions</small>
            </div>
            <div>
              <span>Targets</span>
              <strong>${targetCount}</strong>
              <small>${escapeHtml(mapMode.targetMetric)}</small>
            </div>
          </div>

          <div class="map-prompt-card">
            <h2 class="map-prompt chinese-text" lang="zh-CN">中国地图</h2>
            <p>${escapeHtml(mapMode.homeDescription)}</p>
          </div>

          <button class="primary-btn shortcut-btn map-next-btn" type="button" id="startMapQuizSession">
            <span>${escapeHtml(mapMode.startLabel)}</span>
            ${shortcutHint("Enter")}
          </button>
        </aside>

        <div class="map-stage-panel">
          ${buildChinaMapMarkup({ type: "map", mapQuizMode: state.mapQuizMode, items: [], index: 0, currentAssessment: null }, { preview: true })}
        </div>
      </div>
    </section>
  `;

  bindMapModePicker();
  bindMapNameTextToggle();
  document.querySelector("#startMapQuizSession").addEventListener("click", startMapQuizSession);
  bindMapViewControls();
  bindChinaMapInteractions({ type: "map", mapQuizMode: state.mapQuizMode, items: [], index: 0, currentAssessment: null }, { preview: true });
}

function buildMapModeHeaderMarkup({ interactive = true } = {}) {
  const activeModeId = state.session?.type === "map" ? state.session.mapQuizMode : state.mapQuizMode;
  const activeMode = getSelectedMapQuizMode(activeModeId);

  return `
    <div class="map-mode-header" aria-label="Map quiz mode controls">
      <div class="map-mode-heading">
        <span>Quiz mode</span>
        <strong>${escapeHtml(activeMode.label)}</strong>
      </div>
      ${buildMapModePickerMarkup({ activeModeId, disabled: !interactive })}
      ${buildMapNameTextToggleMarkup()}
    </div>
  `;
}

function buildMapNameTextToggleMarkup({ compact = false } = {}) {
  return `
    <label class="map-name-toggle ${compact ? "compact" : ""}">
      <input type="checkbox" data-map-pinyin-toggle ${state.mapShowPinyinNames ? "checked" : ""}>
      <span>Show pinyin names</span>
    </label>
  `;
}

function buildMapModePickerMarkup({ activeModeId = state.mapQuizMode, disabled = false } = {}) {
  return `
    <div class="map-mode-picker" role="group" aria-label="Map quiz mode">
      ${Object.entries(MAP_QUIZ_MODES).map(([modeId, mode]) => `
        <button
          class="map-mode-option ${activeModeId === modeId ? "active" : ""}"
          type="button"
          data-map-quiz-mode="${modeId}"
          aria-pressed="${activeModeId === modeId ? "true" : "false"}"
          ${disabled ? "disabled" : ""}
        >
          <strong>${escapeHtml(mode.pickerLabel)}</strong>
          <span>${escapeHtml(mode.pickerDetail)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function bindMapModePicker() {
  document.querySelectorAll("[data-map-quiz-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) {
        return;
      }
      const nextMode = button.dataset.mapQuizMode;
      if (!MAP_QUIZ_MODES[nextMode] || nextMode === state.mapQuizMode) {
        return;
      }

      state.mapQuizMode = nextMode;
      state.result = null;
      saveSettings();
      renderMapQuizHome();
    });
  });
}

function bindMapNameTextToggle() {
  document.querySelectorAll("[data-map-pinyin-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      state.mapShowPinyinNames = input.checked;
      if (state.session?.type === "map") {
        state.session.showPinyinNames = state.mapShowPinyinNames;
      }
      saveSettings();
      render();
    });
  });
}

function renderVocabularyHome() {
  const mode = VOCABULARY_MODES[state.vocabularyMode];
  const selectedSet = getSelectedVocabularySet();
  const wordCount = selectedSet?.words.length || 0;
  const timeLimit = formatTimer(determineVocabularyTimeLimit(wordCount));
  const bestTime = getVocabularyHighScore(state.vocabularyMode, selectedSet?.id || "");
  const canStart = Boolean(selectedSet && wordCount);
  const translationsHidden = state.vocabularyMode === "meaning" || state.vocabularyHideTranslations;
  const startLabel = wordCount
    ? `Start ${state.vocabularyMode === "meaning" ? "audio quiz" : "timed quiz"}`
    : "No vocabulary sets loaded";
  const previewRows = selectedSet
    ? buildVocabularyPreviewRows(selectedSet.words, VOCABULARY_PREVIEW_LIMIT, {
        hideTranslation: translationsHidden,
      })
    : "";
  const previewNote = selectedSet && wordCount > VOCABULARY_PREVIEW_LIMIT
    ? `<p class="table-note">Showing ${VOCABULARY_PREVIEW_LIMIT} of ${wordCount} words. The full list appears in the quiz.</p>`
    : "";

  app.innerHTML = `
    <section class="workspace-panel vocabulary-home">
      <div class="mode-heading">
        <div>
          <h2>${mode.label} Vocabulary Quiz</h2>
          <p>${mode.task}</p>
        </div>
      </div>

      ${buildVocabularySetPicker(state.vocabularySetId)}

      <div class="quiz-start-strip">
        <div class="quiz-start-metric">
          <strong>${wordCount}</strong>
          <span>Word count</span>
        </div>
        <div class="quiz-start-metric">
          <strong>${timeLimit}</strong>
          <span>Timer</span>
        </div>
        <div class="quiz-start-metric">
          <strong>${bestTime ? formatTimer(bestTime.elapsedSeconds) : "None"}</strong>
          <span>Best time</span>
        </div>
        <button class="primary-btn shortcut-btn" type="button" id="startVocabularySession" ${canStart ? "" : "disabled"}>
          <span>${startLabel}</span>
          ${shortcutHint("Enter")}
        </button>
      </div>

      ${canStart ? "" : `
        <p class="empty-note error-note">
          The vocabulary quiz data could not be loaded.
        </p>
      `}

      ${selectedSet ? `
        <div class="vocab-table-section">
          <div class="vocab-section-heading">
            <h3>Word List Preview</h3>
            <span>${escapeHtml(selectedSet.label)}</span>
          </div>
          <div class="vocab-table-wrap preview-table-wrap" tabindex="0">
            <table class="vocab-table">
              <thead>
                <tr>
                  <th>Character</th>
                  <th>Pinyin</th>
                  <th>Translation</th>
                </tr>
              </thead>
              <tbody>${previewRows}</tbody>
            </table>
          </div>
          ${previewNote}
        </div>
      ` : ""}
    </section>
  `;

  document.querySelectorAll("[data-vocabulary-set-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextSetId = button.dataset.vocabularySetId;
      if (!nextSetId || nextSetId === state.vocabularySetId) {
        return;
      }

      state.vocabularySetId = nextSetId;
      state.result = null;
      saveSettings();
      render();
    });
  });

  document.querySelector("#startVocabularySession").addEventListener("click", startVocabularySession);
}

function buildVocabularySetPicker(selectedSetId) {
  if (!VOCABULARY_QUIZ_SETS.length) {
    return "";
  }

  const groupedSets = VOCABULARY_QUIZ_SETS.reduce((groups, set) => {
    const meta = getVocabularySetMeta(set);
    const group = groups.get(meta.levelLabel) || { meta, sets: [] };
    group.sets.push(set);
    groups.set(meta.levelLabel, group);
    return groups;
  }, new Map());

  return `
    <div class="quiz-set-picker" aria-label="Quiz set">
      ${[...groupedSets.values()].map((group, index) => {
        const selectedGroup = group.sets.some((set) => set.id === selectedSetId);
        const partCount = group.sets.length;
        const open = selectedGroup || (!selectedSetId && index === 0);
        return `
        <details class="quiz-set-group" ${open ? "open" : ""}>
          <summary class="quiz-set-group-heading">
            <span class="quiz-set-group-title">${escapeHtml(group.meta.levelLabel)}</span>
            <span class="quiz-set-group-count">${partCount} ${partCount === 1 ? "part" : "parts"}</span>
          </summary>
          <div class="quiz-set-grid">
            ${group.sets.map((set) => buildVocabularySetButton(set, selectedSetId, group.sets.length)).join("")}
          </div>
        </details>
      `;
      }).join("")}
    </div>
  `;
}

function buildVocabularySetButton(set, selectedSetId, totalParts = 1) {
  const meta = getVocabularySetMeta(set);
  const selected = set.id === selectedSetId;
  const levelClass = meta.levelNumber ? `hsk-level-${meta.levelNumber}` : "";
  const partClass = meta.partNumber ? `hsk-part-${meta.partNumber}` : "";
  return `
    <button
      class="quiz-set-card ${levelClass} ${partClass} ${selected ? "selected" : ""}"
      type="button"
      data-vocabulary-set-id="${escapeHtml(set.id)}"
      aria-pressed="${selected ? "true" : "false"}"
    >
      <span class="quiz-set-icon" aria-hidden="true">
        <span class="quiz-set-icon-level">${escapeHtml(meta.levelNumber || "V")}</span>
        <span class="quiz-set-icon-part">${escapeHtml(meta.partBadge)}</span>
        ${buildVocabularyPartMarks(meta.partNumber, totalParts)}
      </span>
      <span class="quiz-set-card-text">
        <strong>${escapeHtml(meta.levelLabel)}</strong>
        <span>${escapeHtml(meta.partLabel)}</span>
      </span>
    </button>
  `;
}

function buildVocabularyPartMarks(partNumber, totalParts = 1) {
  const markCount = Math.max(1, Number(totalParts) || 1);
  const activeCount = Math.max(1, Math.min(markCount, Number(partNumber) || 1));
  return `
    <span class="quiz-set-part-marks">
      ${Array.from({ length: markCount }).map((_, index) => `
        <span class="${index < activeCount ? "active" : ""}"></span>
      `).join("")}
    </span>
  `;
}

function getVocabularySetMeta(set) {
  const text = `${set.level || ""} ${set.label || ""} ${set.shortLabel || ""} ${set.id || ""}`;
  const levelNumber = text.match(/hsk[\s-]*(\d+)/i)?.[1] || "";
  const partNumber = text.match(/part[\s-]*(\d+)/i)?.[1] || "";
  const levelLabel = levelNumber ? `HSK ${levelNumber}` : set.level || "Vocabulary";
  const partLabel = partNumber ? `Part ${partNumber}` : set.shortLabel || set.label || "Set";

  return {
    levelLabel,
    levelNumber,
    partBadge: partNumber ? `P${partNumber}` : "Set",
    partLabel,
    partNumber,
  };
}

function formatVocabularySetOption(set) {
  return set.label || set.shortLabel || "";
}

function renderHistoryHome() {
  const history = loadHistoryRecords();
  const drillCount = history.filter((record) => record.type === "drill").length;
  const quizCount = history.filter((record) => record.type === "vocabulary").length;
  const pronunciationCount = history.filter((record) => record.type === "pronunciation").length;
  const mapCount = history.filter((record) => record.type === "map").length;
  const highScores = getVocabularyHighScoreRecords(history);
  const highScoreRows = highScores.length
    ? highScores.map((record) => `
        <tr>
          <td>${escapeHtml(record.setLabel)}</td>
          <td>${escapeHtml(VOCABULARY_MODES[record.quizMode]?.label || record.quizMode)}</td>
          <td>${formatTimer(record.elapsedSeconds)}</td>
          <td>${escapeHtml(formatHistoryDate(record.completedAt))}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="4">No completed quiz high scores yet.</td></tr>`;
  const recentRows = history.length
    ? history.slice(0, 30).map(buildHistoryRowMarkup).join("")
    : `<tr><td colspan="5">No saved sessions yet.</td></tr>`;

  app.innerHTML = `
    <section class="workspace-panel history-panel">
      <div class="results-header">
        <div>
          <h2>History</h2>
          <p>${history.length} saved sessions in this browser.</p>
        </div>
        <div class="result-actions">
          <button class="ghost-btn icon-label-btn" type="button" id="clearHistory" ${history.length ? "" : "disabled"}>
            ${trashIconMarkup()}
            <span>Clear history</span>
          </button>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat">
          <strong>${history.length}</strong>
          <span>Saved sessions</span>
        </div>
        <div class="stat">
          <strong>${drillCount}</strong>
          <span>Sentence drills</span>
        </div>
        <div class="stat">
          <strong>${quizCount}</strong>
          <span>Quizzes</span>
        </div>
        <div class="stat">
          <strong>${pronunciationCount}</strong>
          <span>Pronunciation</span>
        </div>
        <div class="stat">
          <strong>${mapCount}</strong>
          <span>Map quizzes</span>
        </div>
        <div class="stat">
          <strong>${highScores.length}</strong>
          <span>High scores</span>
        </div>
      </div>

      <div class="history-section">
        <div class="vocab-section-heading">
          <h3>Vocabulary High Scores</h3>
          <span>Fastest completed time per mode and set</span>
        </div>
        <div class="results-table-wrap history-table-wrap" tabindex="0">
          <table>
            <thead>
              <tr>
                <th>Quiz set</th>
                <th>Mode</th>
                <th>Best time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>${highScoreRows}</tbody>
          </table>
        </div>
      </div>

      <div class="history-section">
        <div class="vocab-section-heading">
          <h3>Recent Sessions</h3>
          <span>Most recent first</span>
        </div>
        <div class="results-table-wrap history-table-wrap" tabindex="0">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Mode or set</th>
                <th>Result</th>
                <th>Answers</th>
              </tr>
            </thead>
            <tbody>${recentRows}</tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  document.querySelector("#clearHistory").addEventListener("click", () => {
    if (!window.confirm("Clear saved practice and quiz history from this browser?")) {
      return;
    }

    clearHistoryRecords();
    render();
  });
}

function buildHistoryRowMarkup(record) {
  const typeLabel = record.type === "vocabulary"
    ? "Vocabulary quiz"
    : record.type === "pronunciation"
      ? "Pronunciation"
      : record.type === "map"
        ? "Map quiz"
      : "Sentence drill";
  const modeLabel = record.type === "vocabulary"
    ? `${record.setLabel} · ${VOCABULARY_MODES[record.quizMode]?.label || record.quizMode}`
    : record.type === "pronunciation"
      ? selectedLevelLabels(record.levels)
      : record.type === "map"
        ? `${getSelectedMapQuizMode(record.mapQuizMode).label} locations`
      : MODES[record.mode]?.label || record.mode;
  const resultLabel = record.type === "vocabulary"
    ? buildVocabularyHistoryResultLabel(record)
    : record.type === "pronunciation"
      ? `${Math.round((record.averageScore || 0) * 100)}% recognized · ${record.total} sentences`
      : record.type === "map"
        ? `${record.correct}/${record.total} correct · ${formatTimer(record.elapsedSeconds || 0)}`
      : `${record.correct}/${record.total} correct · ${Math.round((record.averageScore || 0) * 100)}% avg`;
  const answerCount = Array.isArray(record.answers) ? record.answers.length : 0;

  return `
    <tr>
      <td>${escapeHtml(formatHistoryDate(record.completedAt))}</td>
      <td>${escapeHtml(typeLabel)}</td>
      <td>${escapeHtml(modeLabel)}</td>
      <td>${escapeHtml(resultLabel)}</td>
      <td>${answerCount}</td>
    </tr>
  `;
}

function buildVocabularyHistoryResultLabel(record) {
  const time = formatTimer(record.elapsedSeconds);
  if (record.highScoreEligible) {
    return `Completed in ${time}`;
  }

  return `${record.finishReason || "Ended"} · ${record.correct}/${record.total} correct · ${time}`;
}

function renderSession() {
  if (state.session?.type === "vocabulary") {
    renderVocabularySession();
    return;
  }

  if (state.session?.type === "pronunciation") {
    renderPronunciationSession();
    return;
  }

  if (state.session?.type === "map") {
    renderMapQuizSession();
    return;
  }

  const session = state.session;
  const current = session.items[session.index];
  const mode = MODES[session.mode];
  const submitted = Boolean(session.currentAssessment);
  const answer = submitted ? session.currentAssessment.answer : "";
  const sessionLength = session.items.length;
  const progressPercent = Math.round((session.index / sessionLength) * 100);
  const sentenceMarkup = buildSentenceMarkup(current, session.mode);
  const feedbackMarkup = submitted ? buildFeedbackMarkup(session.currentAssessment, current) : "";

  app.innerHTML = `
    <section class="workspace-panel session-shell">
      <div class="progress-row">
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        <span class="progress-label">Sentence ${session.index + 1} of ${sessionLength}</span>
      </div>

      <div class="sentence-card">
        <span class="sentence-label">${mode.sentenceLabel}</span>
        ${sentenceMarkup}
      </div>

      <form class="answer-form" id="answerForm">
        <textarea
          id="answerInput"
          lang="${session.mode === "writing" ? "zh-CN" : "en"}"
          class="${session.mode === "writing" ? "chinese-text" : ""}"
          autocomplete="off"
          autocapitalize="none"
          spellcheck="false"
          enterkeyhint="done"
          placeholder="${mode.answerPlaceholder}"
          ${submitted ? "disabled" : ""}
        >${escapeHtml(answer)}</textarea>
        <div class="form-actions">
          ${
            submitted
              ? `<button class="primary-btn shortcut-btn" type="button" id="nextQuestion">
                  <span>${session.index + 1 === sessionLength ? "View results" : "Next sentence"}</span>
                  ${shortcutHint("Enter")}
                </button>`
              : `<button class="primary-btn shortcut-btn" type="submit">
                  <span>Check sentence</span>
                  ${shortcutHint("Enter")}
                </button>`
          }
          <button class="ghost-btn" type="button" id="endSession">End session</button>
        </div>
      </form>

      ${feedbackMarkup}
    </section>
  `;

  if (session.mode === "listening") {
    document.querySelector("#playAudio").addEventListener("click", () => speak(current.zh));
  }

  document.querySelector("#endSession").addEventListener("click", finishSessionEarly);

  if (submitted) {
    document.querySelector("#nextQuestion").addEventListener("click", nextQuestion);
    revealFeedbackPanel();
  } else {
    const form = document.querySelector("#answerForm");
    const input = document.querySelector("#answerInput");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitAnswer(input.value);
    });
    if (!isTouchLikeDevice()) {
      input.focus();
    }
  }
}

function renderPronunciationSession() {
  const session = state.session;
  const current = session.items[session.index];
  const submitted = Boolean(session.currentAssessment);
  const sessionLength = session.items.length;
  const progressPercent = Math.round((session.index / sessionLength) * 100);
  const showPinyin = Boolean(session.showPinyin);
  const promptMarkup = buildPronunciationSentenceMarkup(current, session.currentAssessment, { showPinyin });
  const recognized = session.currentAssessment?.transcript || "";
  const score = session.currentAssessment ? Math.round(session.currentAssessment.score * 100) : 0;
  const recordLabel = session.isListening ? "Show feedback" : "Record sentence";

  app.innerHTML = `
    <section class="workspace-panel session-shell pronunciation-session">
      <div class="progress-row">
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        <span class="progress-label">Sentence ${session.index + 1} of ${sessionLength}</span>
      </div>

      <div class="sentence-card pronunciation-card">
        <div class="sentence-card-header">
          <span class="sentence-label">Read aloud</span>
          <button class="secondary-btn compact-btn" type="button" id="playPronunciationAudio">
            <span>Play sentence</span>
            ${shortcutHint("Enter", { commandControl: true })}
          </button>
        </div>
        ${promptMarkup}
      </div>

      ${session.recognitionError ? `<p class="empty-note error-note">${escapeHtml(session.recognitionError)}</p>` : ""}

      <div class="pronunciation-actions">
        ${
          session.isListening
            ? `<span class="recording-status" aria-live="polite">
                <span class="sound-bars" aria-hidden="true"><span></span><span></span><span></span></span>
                <span>Listening</span>
              </span>`
            : ""
        }
        <button class="primary-btn shortcut-btn" type="button" id="recordPronunciation" ${submitted ? "disabled" : ""}>
          <span>${recordLabel}</span>
          ${shortcutHint("Enter")}
        </button>
        ${
          submitted
            ? `<button class="secondary-btn shortcut-btn" type="button" id="nextQuestion">
                <span>${session.index + 1 === sessionLength ? "View results" : "Next sentence"}</span>
                ${shortcutHint("Enter")}
              </button>`
            : ""
        }
        <button class="ghost-btn" type="button" id="endSession">End session</button>
      </div>

      ${
        submitted
          ? `<section class="feedback ${session.currentAssessment.score >= 0.7 ? "good" : session.currentAssessment.score >= 0.45 ? "okay" : "review"} pronunciation-feedback">
              <div class="feedback-title">
                <strong>${score}% recognized</strong>
                <span>${session.currentAssessment.goodCount}/${session.currentAssessment.tokenCount} words recognized</span>
              </div>
              <div class="answer-pair">
                ${buildAnswerBox("Recognized", recognized || "No Chinese speech recognized", { annotateChinese: showPinyin })}
                ${buildAnswerBox("Expected", current.zh, { annotateChinese: showPinyin })}
              </div>
            </section>`
          : ""
      }
    </section>
  `;

  document.querySelector("#playPronunciationAudio").addEventListener("click", () => speak(current.zh, { immediate: true }));
  document.querySelector("#recordPronunciation").addEventListener("click", () => {
    if (session.isListening) {
      requestPronunciationManualStop();
      return;
    }

    startPronunciationRecording();
  });
  document.querySelector("#endSession").addEventListener("click", finishSessionEarly);
  document.querySelector("#nextQuestion")?.addEventListener("click", nextQuestion);
}

function renderMapQuizSession() {
  const session = state.session;
  const mapMode = getSelectedMapQuizMode(session.mapQuizMode);
  const current = session.items[session.index];
  const submitted = Boolean(session.currentAssessment);
  const sessionLength = session.items.length;
  const correctCount = session.answers.filter((answer) => answer.correct).length;
  const answeredCount = session.answers.length;
  const progressPercent = Math.round((answeredCount / sessionLength) * 100);
  const streak = getMapQuizStreak(session.answers);
  const instruction = mapMode.instruction;
  const feedback = submitted ? buildMapQuizFeedbackMarkup(session.currentAssessment) : "";
  const pinyinNameMarkup = session.showPinyinNames
    ? `<p class="map-prompt-pinyin">${escapeHtml(current.pinyin)}</p>`
    : "";
  const hintMarkup = !submitted && session.hintVisible
    ? `<p class="map-hint-note">Reveal: ${escapeHtml(current.pinyin)}</p>`
    : "";

  app.innerHTML = `
    <section class="workspace-panel session-shell map-quiz-workspace map-quiz-session">
      <div class="map-game-shell">
        <aside class="map-question-panel">
          <div class="map-score-card">
            <div>
              <span>Score</span>
              <strong>${correctCount}/${sessionLength}</strong>
              <small>${progressPercent}% answered</small>
            </div>
            <div>
              <span>Streak</span>
              <strong>${streak}</strong>
              <small>${streak >= 3 ? "On fire" : "Keep going"}</small>
            </div>
            <div class="map-progress-line" aria-hidden="true">
              <span style="width: ${progressPercent}%"></span>
            </div>
          </div>

          <div class="map-question-meta">
            <p class="map-question-count">Question ${session.index + 1} of ${sessionLength}</p>
            ${buildMapNameTextToggleMarkup({ compact: true })}
          </div>

          <div class="map-prompt-card">
            <h2 class="map-prompt chinese-text" lang="zh-CN">${escapeHtml(current.name)}</h2>
            ${pinyinNameMarkup}
            <p>${instruction}</p>
          </div>

          ${
            submitted
              ? ""
              : `<button class="secondary-btn map-hint-btn" type="button" id="showMapHint" ${session.hintVisible ? "disabled" : ""}>
                  <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                    <path d="M8.5 14.5a6 6 0 1 1 7 0c-.8.6-1.5 1.4-1.5 2.5h-4c0-1.1-.7-1.9-1.5-2.5z"></path>
                  </svg>
                  <span>${session.hintVisible ? "Revealed" : "Reveal"}</span>
                </button>`
          }
          ${hintMarkup}

          ${feedback}

          <div class="map-panel-actions">
            ${
              submitted
                ? `<button class="primary-btn shortcut-btn map-next-btn" type="button" id="nextQuestion">
                    <span>${session.index + 1 === sessionLength ? "View results" : "Next question"}</span>
                    ${shortcutHint("Enter")}
                  </button>`
                : ""
            }
            <button class="ghost-btn" type="button" id="endSession">End quiz</button>
          </div>
        </aside>

        <div class="map-stage-panel">
          ${buildChinaMapMarkup(session)}
        </div>
      </div>
    </section>
  `;

  bindMapViewControls();
  bindMapNameTextToggle();
  document.querySelector("#showMapHint")?.addEventListener("click", showMapHint);
  document.querySelector("#endSession").addEventListener("click", finishSessionEarly);
  document.querySelector("#nextQuestion")?.addEventListener("click", nextQuestion);
  bindChinaMapInteractions(session);
}

function getSelectedMapQuizMode(mode = state.mapQuizMode) {
  return MAP_QUIZ_MODES[mode] || MAP_QUIZ_MODES[DEFAULT_MAP_QUIZ_MODE];
}

function getMapQuizPool(mode = state.mapQuizMode) {
  return mode === "city"
    ? CHINA_CITIES.map((item) => ({ ...item, kind: "city" }))
    : CHINA_PROVINCES.map((item) => ({ ...item, kind: "province" }));
}

function getMapQuizStreak(answers) {
  let streak = 0;
  for (let index = answers.length - 1; index >= 0; index -= 1) {
    if (!answers[index]?.correct) {
      break;
    }
    streak += 1;
  }

  return streak;
}

function createDefaultChinaMapView() {
  return { scale: CHINA_MAP_ZOOM_MIN, x: 0, y: 0 };
}

function showMapHint() {
  if (state.session?.type !== "map" || state.session.currentAssessment) {
    return;
  }

  state.session.hintVisible = true;
  render();
}

function scrollMapSessionIntoView(target = "session") {
  if (!window.matchMedia?.("(max-width: 720px)").matches) {
    return;
  }

  window.requestAnimationFrame(() => {
    const selector = target === "feedback" ? ".map-feedback" : ".map-quiz-session";
    const element = document.querySelector(selector) || document.querySelector(".map-quiz-session");
    element?.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
  });
}

function buildPronunciationSentenceMarkup(item, assessment, options = {}) {
  const tokens = assessment?.tokens || getPronunciationTokens(item.zh);
  const showPinyin = options.showPinyin ?? state.session?.showPinyin ?? state.pronunciationShowPinyin;
  const hanziMarkup = tokens.map(buildPronunciationHanziTokenMarkup).join("");
  const pinyinMarkup = tokens.map(buildPronunciationPinyinTokenMarkup).join("");

  return `
    <div class="pronunciation-prompt">
      <p class="pronunciation-hanzi-line chinese-text" lang="zh-CN">${hanziMarkup}</p>
      ${showPinyin ? `<p class="pronunciation-pinyin-line">${pinyinMarkup}</p>` : ""}
    </div>
  `;
}

function buildPronunciationHanziTokenMarkup(token) {
  if (token.type !== "word") {
    return `<span class="pronunciation-punctuation">${escapeHtml(token.text)}</span>`;
  }

  const status = typeof token.recognized === "boolean"
    ? token.recognized
      ? "good correct-celebration"
      : "missed"
    : "pending";
  const label = typeof token.recognized === "boolean"
    ? `${token.text}: ${token.recognized ? "recognized" : "not recognized"}`
    : token.text;

  return `<span class="pronunciation-token ${status}" aria-label="${escapeHtml(label)}">${escapeHtml(token.text)}</span>`;
}

function buildPronunciationPinyinTokenMarkup(token) {
  if (token.type !== "word") {
    return `<span class="pronunciation-pinyin-punctuation">${escapeHtml(token.text)}</span>`;
  }

  const status = typeof token.recognized === "boolean"
    ? token.recognized
      ? "good"
      : "missed"
    : "pending";

  return `<span class="pronunciation-pinyin-token ${status}">${escapeHtml(token.pinyin || "")}</span>`;
}

function getPronunciationTokens(value) {
  hydrateWordDataFromWindow();
  return tokenizeAnnotatedChinese(value).map((token) => {
    if (token.type !== "word") {
      return { type: "punctuation", text: token.text };
    }

    return {
      type: "word",
      text: token.text,
      pinyin: token.entry?.pinyin || "",
    };
  });
}

function assessPronunciationTranscript(transcript, item) {
  const normalizedTranscript = normalizeChinese(transcript);
  let cursor = 0;
  const tokens = getPronunciationTokens(item.zh).map((token) => {
    if (token.type !== "word") {
      return token;
    }

    const expected = normalizeChinese(token.text);
    const foundAt = expected ? normalizedTranscript.indexOf(expected, cursor) : -1;
    const recognized = foundAt >= 0;
    if (recognized) {
      cursor = foundAt + expected.length;
    }

    return {
      ...token,
      recognized,
    };
  });
  const wordTokens = tokens.filter((token) => token.type === "word");
  const goodCount = wordTokens.filter((token) => token.recognized).length;
  const tokenCount = wordTokens.length;
  const score = tokenCount ? goodCount / tokenCount : 0;

  return {
    mode: "pronunciation",
    transcript,
    normalizedTranscript,
    tokens,
    score,
    correct: score >= ACCEPTANCE_THRESHOLD,
    goodCount,
    missedCount: tokenCount - goodCount,
    tokenCount,
  };
}

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function supportsSpeechRecognition() {
  return Boolean(getSpeechRecognitionConstructor());
}

function clearPronunciationRecordingTimers(recording) {
  if (!recording) {
    return;
  }

  if (recording.finishTimerId) {
    window.clearTimeout?.(recording.finishTimerId);
    recording.finishTimerId = 0;
  }

  if (recording.restartTimerId) {
    window.clearTimeout?.(recording.restartTimerId);
    recording.restartTimerId = 0;
  }

  if (recording.maxTimerId) {
    window.clearTimeout?.(recording.maxTimerId);
    recording.maxTimerId = 0;
  }
}

function isActivePronunciationRecording(recording) {
  return Boolean(
    recording &&
    pronunciationRecordingState === recording &&
    recording.requestId === pronunciationRecognitionRequestId &&
    state.session === recording.session &&
    recording.session?.type === "pronunciation" &&
    !recording.session.currentAssessment,
  );
}

function stopPronunciationRecognition() {
  pronunciationRecognitionRequestId += 1;
  clearPronunciationRecordingTimers(pronunciationRecordingState);
  pronunciationRecordingState = null;
  if (pronunciationRecognition) {
    try {
      pronunciationRecognition.abort?.();
    } catch {
      // Some browser implementations throw when aborting an idle recognizer.
    }
  }
  pronunciationRecognition = null;

  if (state.session?.type === "pronunciation") {
    state.session.isListening = false;
  }
}

function startPronunciationRecording() {
  const session = state.session;
  if (session?.type !== "pronunciation" || session.currentAssessment) {
    return;
  }

  if (session.isListening) {
    requestPronunciationManualStop();
    return;
  }

  const SpeechRecognition = getSpeechRecognitionConstructor();
  if (!SpeechRecognition) {
    session.recognitionError = "Speech recognition is not available in this browser. Try Chrome or Edge on an HTTPS page.";
    render();
    return;
  }

  stopSpeech();
  stopPronunciationRecognition();
  pronunciationRecognitionRequestId += 1;
  const requestId = pronunciationRecognitionRequestId;
  const recording = {
    requestId,
    session,
    segments: [],
    transcript: "",
    finishTimerId: 0,
    restartTimerId: 0,
    maxTimerId: 0,
    manualStopRequested: false,
    startedAt: Date.now(),
  };
  pronunciationRecordingState = recording;

  session.isListening = true;
  session.recognitionError = "";
  render();

  recording.maxTimerId = window.setTimeout(() => {
    finalizePronunciationRecording(requestId, {
      emptyMessage: "No Chinese speech was recognized. Try the sentence again.",
    });
  }, PRONUNCIATION_MAX_RECORDING_MS);

  startPronunciationRecognizer(recording);
}

function startPronunciationRecognizer(recording) {
  if (!isActivePronunciationRecording(recording)) {
    return;
  }

  const SpeechRecognition = getSpeechRecognitionConstructor();
  if (!SpeechRecognition) {
    handlePronunciationRecognitionError("Speech recognition is not available in this browser. Try Chrome or Edge on an HTTPS page.", recording.requestId);
    return;
  }

  const recognition = new SpeechRecognition();
  const requestId = recording.requestId;
  const session = recording.session;
  const segmentIndex = recording.segments.length;
  recording.segments.push("");
  pronunciationRecognition = recognition;

  recognition.lang = "zh-CN";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 3;

  recognition.onresult = (event) => {
    if (!isActivePronunciationRecording(recording)) {
      return;
    }

    const transcript = getSpeechRecognitionTranscript(event);
    if (!transcript) {
      return;
    }

    recording.segments[segmentIndex] = transcript;
    recording.transcript = getPronunciationRecordingTranscript(recording);
    session.recognitionError = "";
    schedulePronunciationFinalization(
      recording,
      recording.manualStopRequested ? 250 : PRONUNCIATION_SILENCE_GRACE_MS,
    );
  };

  recognition.onnomatch = () => {
    if (!isActivePronunciationRecording(recording)) {
      return;
    }

    if (recording.transcript) {
      schedulePronunciationFinalization(recording, 0);
      return;
    }

    handlePronunciationRecognitionError("No Chinese speech was recognized. Try the sentence again.", requestId);
  };

  recognition.onerror = (event) => {
    if (!isActivePronunciationRecording(recording)) {
      return;
    }

    if (event.error === "aborted") {
      return;
    }

    if (recording.transcript) {
      schedulePronunciationFinalization(recording, event.error === "no-speech" ? 400 : 0);
      return;
    }

    const message = event.error === "not-allowed" || event.error === "service-not-allowed"
      ? "Microphone permission was blocked for this site."
      : event.error === "no-speech"
        ? "No speech was detected. Try speaking a little closer to the microphone."
        : "Speech recognition stopped before it could read the sentence.";
    handlePronunciationRecognitionError(message, requestId);
  };

  recognition.onend = () => {
    if (!isActivePronunciationRecording(recording)) {
      return;
    }

    if (pronunciationRecognition === recognition) {
      pronunciationRecognition = null;
    }

    if (recording.manualStopRequested) {
      if (recording.transcript) {
        schedulePronunciationFinalization(recording, 0);
        return;
      }

      finalizePronunciationRecording(requestId, {
        emptyMessage: "No Chinese speech was recognized. Try the sentence again.",
      });
      return;
    }

    if (recording.transcript) {
      restartPronunciationRecognizerAfterDelay(recording);
      return;
    }

    session.isListening = false;
    session.recognitionError = "No speech was detected. Try speaking a little closer to the microphone.";
    pronunciationRecordingState = null;
    clearPronunciationRecordingTimers(recording);
    render();
  };

  try {
    recognition.start();
  } catch {
    handlePronunciationRecognitionError("Speech recognition could not start. Try again in a moment.", requestId);
  }
}

function getPronunciationRecordingTranscript(recording) {
  return recording.segments
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join("")
    .trim();
}

function schedulePronunciationFinalization(recording, delay) {
  if (!isActivePronunciationRecording(recording)) {
    return;
  }

  if (recording.finishTimerId) {
    window.clearTimeout?.(recording.finishTimerId);
  }

  recording.finishTimerId = window.setTimeout(() => {
    finalizePronunciationRecording(recording.requestId, {
      emptyMessage: "No Chinese speech was recognized. Try the sentence again.",
    });
  }, delay);
}

function restartPronunciationRecognizerAfterDelay(recording) {
  if (!isActivePronunciationRecording(recording) || recording.restartTimerId) {
    return;
  }

  if (Date.now() - recording.startedAt >= PRONUNCIATION_MAX_RECORDING_MS - PRONUNCIATION_RESTART_DELAY_MS) {
    return;
  }

  recording.restartTimerId = window.setTimeout(() => {
    recording.restartTimerId = 0;
    if (isActivePronunciationRecording(recording) && !recording.manualStopRequested) {
      startPronunciationRecognizer(recording);
    }
  }, PRONUNCIATION_RESTART_DELAY_MS);
}

function requestPronunciationManualStop() {
  const recording = pronunciationRecordingState;
  if (!isActivePronunciationRecording(recording)) {
    stopPronunciationRecognition();
    render();
    return;
  }

  recording.manualStopRequested = true;
  schedulePronunciationFinalization(recording, PRONUNCIATION_MANUAL_STOP_GRACE_MS);

  if (!pronunciationRecognition) {
    return;
  }

  try {
    if (typeof pronunciationRecognition.stop === "function") {
      pronunciationRecognition.stop();
    } else {
      pronunciationRecognition.abort?.();
    }
  } catch {
    finalizePronunciationRecording(recording.requestId, {
      emptyMessage: "No Chinese speech was recognized. Try the sentence again.",
    });
  }
}

function finalizePronunciationRecording(requestId, options = {}) {
  const recording = pronunciationRecordingState;
  if (!recording || recording.requestId !== requestId) {
    return;
  }

  const session = recording.session;
  const transcript = recording.transcript.trim();
  clearPronunciationRecordingTimers(recording);
  pronunciationRecordingState = null;
  pronunciationRecognitionRequestId += 1;

  if (pronunciationRecognition) {
    try {
      pronunciationRecognition.abort?.();
    } catch {
      // Some browser implementations throw when aborting an idle recognizer.
    }
  }
  pronunciationRecognition = null;

  if (transcript) {
    submitPronunciationTranscript(transcript);
    return;
  }

  if (state.session === session && session?.type === "pronunciation" && !session.currentAssessment) {
    session.isListening = false;
    session.recognitionError = options.emptyMessage || "No Chinese speech was recognized. Try the sentence again.";
    render();
  }
}

function getSpeechRecognitionTranscript(event) {
  const results = event?.results ? Array.from(event.results) : [];
  return results
    .map((result) => result?.[0]?.transcript || "")
    .join("")
    .trim();
}

function handlePronunciationRecognitionError(message, requestId) {
  if (requestId && requestId !== pronunciationRecognitionRequestId) {
    return;
  }

  if (state.session?.type !== "pronunciation") {
    return;
  }

  pronunciationRecognitionRequestId += 1;
  clearPronunciationRecordingTimers(pronunciationRecordingState);
  pronunciationRecordingState = null;
  pronunciationRecognition = null;
  state.session.isListening = false;
  state.session.recognitionError = message;
  render();
}

function submitPronunciationTranscript(transcript) {
  const session = state.session;
  if (session?.type !== "pronunciation" || session.currentAssessment) {
    return;
  }

  const item = session.items[session.index];
  const assessment = assessPronunciationTranscript(transcript, item);
  if (pronunciationRecordingState || pronunciationRecognition) {
    pronunciationRecognitionRequestId += 1;
    clearPronunciationRecordingTimers(pronunciationRecordingState);
    pronunciationRecordingState = null;
    if (pronunciationRecognition) {
      try {
        pronunciationRecognition.abort?.();
      } catch {
        // Some browser implementations throw when aborting an idle recognizer.
      }
    }
  }
  session.currentAssessment = assessment;
  session.isListening = false;
  session.recognitionError = "";
  session.answers.push({
    ...assessment,
    item,
    itemIndex: session.index,
  });
  pronunciationRecognition = null;
  render();
}

function buildChinaMapMarkup(session, options = {}) {
  const assessment = session?.currentAssessment || null;
  const mapMode = getMapQuizModeForSession(session);
  const toastMarkup = assessment ? buildMapQuizToastMarkup(assessment) : "";
  const targetClass = mapMode === "city" ? "city-mode" : "province-mode";

  return `
    <div class="china-map-wrap ${targetClass}">
      ${toastMarkup}
      <div class="china-map-canvas" id="chinaMapQuiz" role="application" aria-label="中国地图定位练习">
        ${buildChinaMapSvgMarkup(session, options)}
      </div>
      ${buildChinaMapZoomControlsMarkup()}
    </div>
  `;
}

function buildChinaMapZoomControlsMarkup() {
  return `
    <div class="map-zoom-controls" aria-label="Map zoom controls">
      <button class="map-zoom-btn" type="button" data-map-zoom="out" aria-label="Zoom out">-</button>
      <button class="map-zoom-btn map-zoom-reset" type="button" data-map-zoom="reset" aria-label="Reset map zoom">1x</button>
      <button class="map-zoom-btn" type="button" data-map-zoom="in" aria-label="Zoom in">+</button>
    </div>
  `;
}

function buildChinaMapSvgMarkup(session, options = {}) {
  const mapData = getChinaMapData();

  if (!mapData?.features?.length) {
    return `
      <div class="china-map-fallback">
        <strong>China map data did not load</strong>
        <span>Reload the page or check that china-map-data.js is included in the static site.</span>
      </div>
    `;
  }

  return `
    <svg class="china-map-svg" viewBox="0 0 ${CHINA_MAP_VIEWBOX.width} ${CHINA_MAP_VIEWBOX.height}" preserveAspectRatio="xMidYMid meet" aria-label="Interactive blank China map" focusable="false">
      <defs>
        <clipPath id="southChinaSeaInsetClip">
          <rect x="${SOUTH_CHINA_SEA_INSET.x}" y="${SOUTH_CHINA_SEA_INSET.y}" width="${SOUTH_CHINA_SEA_INSET.width}" height="${SOUTH_CHINA_SEA_INSET.height}" rx="10"></rect>
        </clipPath>
      </defs>
      <rect class="china-map-water" x="0" y="0" width="${CHINA_MAP_VIEWBOX.width}" height="${CHINA_MAP_VIEWBOX.height}" rx="18"></rect>
      <g class="china-map-zoom-layer" data-map-transform-layer>
        <g class="china-map-provinces">
          ${buildChinaMapProvincePaths(mapData.features, session)}
        </g>
        ${shouldEnableMapProvinceSelection(session) ? `
          <g class="china-map-province-outlines" aria-hidden="true">
            ${buildChinaMapProvinceOutlinePaths(mapData.features, session)}
          </g>
        ` : ""}
        ${shouldShowMapCityPins(session) ? `
          <g class="china-city-pins">
            ${buildChinaMapCityPins(session)}
          </g>
        ` : ""}
      </g>
      ${buildSouthChinaSeaInsetMarkup(mapData.features)}
    </svg>
  `;
}

function getChinaMapData() {
  return window.CHINESE_TRAINER_CHINA_MAP || null;
}

function buildChinaMapProvincePaths(features, session) {
  const provinceSelectionEnabled = shouldEnableMapProvinceSelection(session);

  return features
    .map((feature) => {
      const province = getProvinceForMapFeature(feature);
      if (!province) {
        return "";
      }

      const status = getMapTargetStatus("province", province.id, session);
      const classes = [
        "china-province-shape",
        status ? `is-${status}` : "",
      ].filter(Boolean).join(" ");

      return `
        <path
          class="${classes}"
          ${provinceSelectionEnabled ? `data-map-province-id="${escapeHtml(province.id)}"` : ""}
          d="${geoGeometryToPath(feature.geometry, CHINA_MAINLAND_FRAME)}"
          ${provinceSelectionEnabled ? `role="button" tabindex="0"` : ""}
          aria-label="${provinceSelectionEnabled ? "Provincial-level region" : "Map region outline"}"
        ></path>
      `;
    })
    .join("");
}

function buildChinaMapProvinceOutlinePaths(features, session) {
  return features
    .map((feature) => {
      const province = getProvinceForMapFeature(feature);
      if (!province) {
        return "";
      }

      const status = getMapTargetStatus("province", province.id, session);
      const classes = [
        "china-province-outline",
        status ? `is-${status}` : "",
      ].filter(Boolean).join(" ");

      return `
        <path
          class="${classes}"
          data-map-province-outline-id="${escapeHtml(province.id)}"
          d="${geoGeometryToPath(feature.geometry, CHINA_MAINLAND_FRAME)}"
        ></path>
      `;
    })
    .join("");
}

function buildChinaMapCityPins(session) {
  return CHINA_CITIES.map((city) => {
    const status = getMapTargetStatus("city", city.id, session);
    const point = projectMapCoordinate(city.lng, city.lat, CHINA_MAINLAND_FRAME);
    const label = status ? escapeHtml(city.name.replace(/市$/, "")) : "";
    const classes = [
      "china-city-pin",
      status ? `is-${status}` : "",
    ].filter(Boolean).join(" ");

    return `
      <g
        class="${classes}"
        data-map-city-id="${escapeHtml(city.id)}"
        role="button"
        tabindex="0"
        aria-label="City pin"
        transform="translate(${formatMapNumber(point.x)} ${formatMapNumber(point.y)})"
      >
        <circle class="china-city-pin-hit" r="13"></circle>
        <circle class="china-city-pin-ring" r="7"></circle>
        <circle class="china-city-pin-dot" r="4"></circle>
        ${label ? `<text class="china-city-pin-label" x="11" y="4">${label}</text>` : ""}
      </g>
    `;
  }).join("");
}

function buildSouthChinaSeaInsetMarkup(features) {
  const insetPaths = features
    .map((feature) => `
      <path
        class="china-map-inset-shape"
        d="${geoGeometryToPath(feature.geometry, SOUTH_CHINA_SEA_INSET)}"
      ></path>
    `)
    .join("");

  return `
    <g class="south-china-sea-inset" aria-hidden="true">
      <rect class="south-china-sea-inset-frame" x="${SOUTH_CHINA_SEA_INSET.x}" y="${SOUTH_CHINA_SEA_INSET.y}" width="${SOUTH_CHINA_SEA_INSET.width}" height="${SOUTH_CHINA_SEA_INSET.height}" rx="10"></rect>
      <g clip-path="url(#southChinaSeaInsetClip)">
        ${insetPaths}
      </g>
      <text class="south-china-sea-inset-label" x="${SOUTH_CHINA_SEA_INSET.x + SOUTH_CHINA_SEA_INSET.width / 2}" y="${SOUTH_CHINA_SEA_INSET.y + SOUTH_CHINA_SEA_INSET.height - 12}">南海诸岛</text>
    </g>
  `;
}

function getProvinceForMapFeature(feature) {
  const name = feature?.properties?.name || "";
  if (!name) {
    return null;
  }

  const normalized = normalizeMapRegionName(name);
  return CHINA_PROVINCES.find((province) => {
    const provinceNames = [province.name, province.shortName].map(normalizeMapRegionName);
    return provinceNames.includes(normalized);
  }) || null;
}

function getMapTargetStatus(kind, id, session) {
  const mapMode = getMapQuizModeForSession(session);
  if ((mapMode === "province" && kind === "city") || (mapMode === "city" && kind === "province")) {
    return "";
  }

  const current = session?.items?.[session.index] || null;
  const assessment = session?.currentAssessment || null;
  const key = mapTargetKey(kind, id);
  const currentKey = mapTargetKey(current?.kind, current?.id);
  const selectedKey = assessment ? mapTargetKey(assessment.selectedKind, assessment.selectedId) : "";

  if (!assessment && session?.hintVisible && key === currentKey) {
    return "hint";
  }

  if (assessment && key === currentKey) {
    return "correct";
  }

  if (assessment && key === selectedKey && key !== currentKey) {
    return "wrong";
  }

  return "";
}

function getMapQuizModeForSession(session) {
  const mode = session?.mapQuizMode || state.mapQuizMode;
  return MAP_QUIZ_MODES[mode] ? mode : DEFAULT_MAP_QUIZ_MODE;
}

function shouldShowMapCityPins(session) {
  return getMapQuizModeForSession(session) === "city";
}

function shouldEnableMapProvinceSelection(session) {
  return getMapQuizModeForSession(session) === "province";
}

function geoGeometryToPath(geometry, frame) {
  if (!geometry) {
    return "";
  }

  const polygons = geometry.type === "Polygon"
    ? [geometry.coordinates]
    : geometry.type === "MultiPolygon"
      ? geometry.coordinates
      : [];

  return polygons.map((polygon) => polygonToPath(polygon, frame)).join(" ");
}

function polygonToPath(polygon, frame) {
  return polygon.map((ring) => ringToPath(ring, frame)).join(" ");
}

function ringToPath(ring, frame) {
  return ring.map(([lng, lat], index) => {
    const point = projectMapCoordinate(lng, lat, frame);
    return `${index === 0 ? "M" : "L"}${formatMapNumber(point.x)} ${formatMapNumber(point.y)}`;
  }).join(" ") + "Z";
}

function projectMapCoordinate(lng, lat, frame) {
  const minY = mercatorY(frame.minLat);
  const maxY = mercatorY(frame.maxLat);
  const y = mercatorY(lat);

  return {
    x: frame.x + ((lng - frame.minLng) / (frame.maxLng - frame.minLng)) * frame.width,
    y: frame.y + ((maxY - y) / (maxY - minY)) * frame.height,
  };
}

function mercatorY(lat) {
  const clamped = Math.max(-85, Math.min(85, lat));
  const radians = clamped * Math.PI / 180;
  return Math.log(Math.tan(Math.PI / 4 + radians / 2));
}

function formatMapNumber(value) {
  return Number(value).toFixed(1).replace(/\.0$/, "");
}

function normalizeMapRegionName(value) {
  return value
    .replace(/\s+/g, "")
    .replace(/特别行政区|维吾尔自治区|壮族自治区|回族自治区|自治区|省|市/g, "");
}

function showMapStatus(message) {
  const tip = document.querySelector(".map-tip");
  if (!tip) {
    return;
  }

  tip.textContent = message;
  tip.classList.add("attention");
  window.setTimeout(() => tip.classList.remove("attention"), 1200);
}

function bindChinaMapInteractions(session, options = {}) {
  const map = document.querySelector("#chinaMapQuiz");
  if (!map) {
    return;
  }

  bindChinaMapZoomControls(map, session);

  if (options.preview) {
    return;
  }

  map.querySelectorAll("[data-map-province-id]").forEach((provincePath) => {
    const outline = map.querySelector(`[data-map-province-outline-id="${provincePath.dataset.mapProvinceId}"]`);
    const setHover = (isHovered) => {
      outline?.classList.toggle("is-hovered", isHovered);
    };
    const submitProvince = (event) => {
      event.stopPropagation();
      submitMapQuizSelection("province", provincePath.dataset.mapProvinceId);
    };

    provincePath.addEventListener("click", submitProvince);
    provincePath.addEventListener("mouseenter", () => setHover(true));
    provincePath.addEventListener("mouseleave", () => setHover(false));
    provincePath.addEventListener("focus", () => setHover(true));
    provincePath.addEventListener("blur", () => setHover(false));
    provincePath.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      submitProvince(event);
    });
  });

  map.querySelectorAll("[data-map-city-id]").forEach((cityPin) => {
    const submitCity = (event) => {
      event.stopPropagation();
      submitMapQuizSelection("city", cityPin.dataset.mapCityId);
    };

    cityPin.addEventListener("click", submitCity);
    cityPin.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      submitCity(event);
    });
  });

  map.addEventListener("click", () => {
    const activeSession = state.session;
    if (activeSession?.type !== "map" || activeSession.currentAssessment) {
      return;
    }
    showMapStatus(getSelectedMapQuizMode(activeSession.mapQuizMode).tip);
  });
}

function bindChinaMapZoomControls(map, session) {
  const svg = map.querySelector(".china-map-svg");
  const layer = map.querySelector("[data-map-transform-layer]");
  const wrap = map.closest(".china-map-wrap");
  const controls = wrap?.querySelectorAll("[data-map-zoom]") || [];
  if (!svg || !layer || !controls.length) {
    return;
  }

  const activeSession = session?.type === "map" && state.session === session ? session : null;
  const savedView = activeSession?.mapView || createDefaultChinaMapView();
  const view = {
    scale: clamp(Number(savedView.scale) || CHINA_MAP_ZOOM_MIN, CHINA_MAP_ZOOM_MIN, CHINA_MAP_ZOOM_MAX),
    x: Number(savedView.x) || 0,
    y: Number(savedView.y) || 0,
  };
  const pointers = new Map();
  let dragStart = null;
  let pinchStart = null;
  let suppressClick = false;

  const clearSuppressedClickSoon = () => {
    window.setTimeout(() => {
      suppressClick = false;
    }, 120);
  };

  const saveView = () => {
    if (activeSession) {
      activeSession.mapView = { ...view };
    }
  };

  const clampView = () => {
    if (view.scale <= CHINA_MAP_ZOOM_MIN) {
      view.scale = CHINA_MAP_ZOOM_MIN;
      view.x = 0;
      view.y = 0;
      return;
    }

    view.x = clamp(view.x, CHINA_MAP_VIEWBOX.width - (CHINA_MAP_VIEWBOX.width * view.scale), 0);
    view.y = clamp(view.y, CHINA_MAP_VIEWBOX.height - (CHINA_MAP_VIEWBOX.height * view.scale), 0);
  };

  const updateControls = () => {
    controls.forEach((button) => {
      if (button.dataset.mapZoom === "in") {
        button.disabled = view.scale >= CHINA_MAP_ZOOM_MAX;
      } else {
        button.disabled = view.scale <= CHINA_MAP_ZOOM_MIN;
      }

      if (button.dataset.mapZoom === "reset") {
        button.textContent = `${Number(view.scale.toFixed(1))}x`;
      }
    });
  };

  const applyView = () => {
    clampView();
    layer.setAttribute("transform", `matrix(${view.scale} 0 0 ${view.scale} ${view.x} ${view.y})`);
    map.classList.toggle("is-zoomed", view.scale > CHINA_MAP_ZOOM_MIN);
    updateControls();
    saveView();
  };

  const getSvgPoint = (event) => {
    const matrix = svg.getScreenCTM();
    if (!matrix) {
      return {
        x: CHINA_MAP_VIEWBOX.width / 2,
        y: CHINA_MAP_VIEWBOX.height / 2,
      };
    }

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(matrix.inverse());
  };

  const getPointerDistance = (first, second) => Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);

  const getPointerMidpoint = (first, second) => ({
    clientX: (first.clientX + second.clientX) / 2,
    clientY: (first.clientY + second.clientY) / 2,
  });

  const zoomAt = (nextScale, anchor) => {
    const scale = clamp(nextScale, CHINA_MAP_ZOOM_MIN, CHINA_MAP_ZOOM_MAX);
    const point = anchor || {
      x: CHINA_MAP_VIEWBOX.width / 2,
      y: CHINA_MAP_VIEWBOX.height / 2,
    };
    const contentX = (point.x - view.x) / view.scale;
    const contentY = (point.y - view.y) / view.scale;

    view.scale = scale;
    view.x = point.x - (contentX * scale);
    view.y = point.y - (contentY * scale);
    applyView();
  };

  controls.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.mapZoom;
      if (action === "in") {
        zoomAt(view.scale + CHINA_MAP_ZOOM_STEP);
      } else if (action === "out") {
        zoomAt(view.scale - CHINA_MAP_ZOOM_STEP);
      } else {
        view.scale = CHINA_MAP_ZOOM_MIN;
        view.x = 0;
        view.y = 0;
        applyView();
      }
    });
  });

  svg.addEventListener("click", (event) => {
    if (!suppressClick) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, true);

  svg.addEventListener("pointerdown", (event) => {
    pointers.set(event.pointerId, {
      clientX: event.clientX,
      clientY: event.clientY,
    });

    if (pointers.size === 2) {
      const [first, second] = [...pointers.values()];
      const midpoint = getPointerMidpoint(first, second);
      const center = getSvgPoint(midpoint);
      pinchStart = {
        distance: getPointerDistance(first, second),
        contentX: (center.x - view.x) / view.scale,
        contentY: (center.y - view.y) / view.scale,
        scale: view.scale,
      };
      suppressClick = true;
      event.preventDefault();
      return;
    }

    if (view.scale <= CHINA_MAP_ZOOM_MIN) {
      return;
    }

    dragStart = {
      pointerId: event.pointerId,
      point: getSvgPoint(event),
      x: view.x,
      y: view.y,
      moved: false,
    };
  });

  svg.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId)) {
      return;
    }

    pointers.set(event.pointerId, {
      clientX: event.clientX,
      clientY: event.clientY,
    });

    if (pointers.size === 2 && pinchStart) {
      const [first, second] = [...pointers.values()];
      const nextDistance = getPointerDistance(first, second);
      if (pinchStart.distance > 0) {
        const midpoint = getPointerMidpoint(first, second);
        const center = getSvgPoint(midpoint);
        view.scale = clamp(pinchStart.scale * (nextDistance / pinchStart.distance), CHINA_MAP_ZOOM_MIN, CHINA_MAP_ZOOM_MAX);
        view.x = center.x - (pinchStart.contentX * view.scale);
        view.y = center.y - (pinchStart.contentY * view.scale);
        applyView();
      }
      suppressClick = true;
      event.preventDefault();
      return;
    }

    if (!dragStart || dragStart.pointerId !== event.pointerId || view.scale <= CHINA_MAP_ZOOM_MIN) {
      return;
    }

    const point = getSvgPoint(event);
    const deltaX = point.x - dragStart.point.x;
    const deltaY = point.y - dragStart.point.y;
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      dragStart.moved = true;
      suppressClick = true;
      svg.setPointerCapture?.(event.pointerId);
    }

    view.x = dragStart.x + deltaX;
    view.y = dragStart.y + deltaY;
    applyView();
    event.preventDefault();
  });

  const endPointer = (event) => {
    pointers.delete(event.pointerId);
    if (dragStart?.pointerId === event.pointerId) {
      suppressClick = suppressClick || dragStart.moved;
      dragStart = null;
    }
    if (pointers.size < 2) {
      pinchStart = null;
    }
    if (suppressClick) {
      clearSuppressedClickSoon();
    }
    svg.releasePointerCapture?.(event.pointerId);
  };

  svg.addEventListener("pointerup", endPointer);
  svg.addEventListener("pointercancel", endPointer);
  svg.addEventListener("pointerleave", endPointer);

  applyView();
}

function bindMapViewControls() {
  document.querySelectorAll("[data-map-view]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#chinaMapQuiz")?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  });
}

function buildMapQuizToastMarkup(assessment) {
  const current = state.session?.items?.[state.session.index];
  const correct = assessment.correct;
  return `
    <div class="map-answer-toast ${correct ? "good" : "review"}" role="status" aria-live="polite">
      <span class="map-answer-toast-icon" aria-hidden="true">${correct ? "✓" : "!"}</span>
      <strong>${correct ? "Correct!" : "Wrong location"}</strong>
      <span>${escapeHtml(current?.name || "")}</span>
    </div>
  `;
}

function submitMapQuizSelection(kind, id) {
  const session = state.session;
  if (session?.type !== "map" || session.currentAssessment) {
    return;
  }

  const mapMode = getMapQuizModeForSession(session);
  if ((mapMode === "province" && kind !== "province") || (mapMode === "city" && kind !== "city")) {
    showMapStatus(getSelectedMapQuizMode(mapMode).tip);
    return;
  }

  const item = session.items[session.index];
  const assessment = assessMapQuizSelection(kind, id, item);
  session.currentAssessment = assessment;
  session.answers.push({
    ...assessment,
    item,
    itemIndex: session.index,
  });
  render();
  scrollMapSessionIntoView("feedback");
}

function assessMapQuizSelection(kind, id, item) {
  const selected = getMapTargetByKindAndId(kind, id);
  const correct = Boolean(selected && kind === item.kind && id === item.id);

  return {
    mode: "map",
    selectedKind: kind,
    selectedId: id,
    selectedName: selected?.name || "Unknown target",
    selectedPinyin: selected?.pinyin || "",
    answer: selected?.name || "",
    score: correct ? 1 : 0,
    correct,
  };
}

function buildMapQuizFeedbackMarkup(assessment) {
  const current = state.session.items[state.session.index];
  const status = assessment.correct ? "good correct-celebration" : "review";
  const title = assessment.correct ? "Correct" : "Wrong location";

  return `
    <section class="map-feedback ${status}" role="status" aria-live="polite">
      <div>
        <strong>${title}</strong>
        <span>${escapeHtml(current.name)} · ${escapeHtml(current.pinyin)}</span>
      </div>
      ${
        assessment.correct
          ? ""
          : `<p>You selected ${escapeHtml(assessment.selectedName)}.</p>`
      }
    </section>
  `;
}

function getMapTargetByKindAndId(kind, id) {
  if (kind === "province") {
    const province = CHINA_PROVINCES.find((item) => item.id === id);
    return province ? { ...province, x: province.labelX, y: province.labelY, r: province.circle?.r ? province.circle.r + 12 : 34 } : null;
  }

  if (kind === "city") {
    const city = CHINA_CITIES.find((item) => item.id === id);
    return city ? { ...city, r: 18 } : null;
  }

  return null;
}

function mapTargetKey(kind, id) {
  return `${kind}:${id}`;
}

function renderVocabularySession() {
  if (state.session?.quizMode === "meaning") {
    renderVocabularyMeaningSession();
    return;
  }

  renderVocabularyPinyinSession();
}

function renderVocabularyPinyinSession() {
  const session = state.session;
  const mode = VOCABULARY_MODES[session.quizMode];
  const sessionLength = session.items.length;
  const foundCount = session.foundIds.size;
  const answeredCount = getVocabularyPinyinAnsweredCount(session);
  const progressPercent = Math.round((answeredCount / sessionLength) * 100);
  const remaining = getVocabularyRemainingSeconds(session);
  const rows = buildVocabularyQuizRows(session, { hideTranslation: session.hideTranslations });
  const currentWordMarkup = buildVocabularyCurrentWordMarkup(session);

  app.innerHTML = `
    <section class="workspace-panel session-shell vocabulary-session">
      <div class="quiz-play-header">
        <div class="quiz-meter">
          <span>Score</span>
          <strong id="vocabularyScore">${foundCount}/${sessionLength}</strong>
        </div>
        <div class="quiz-meter">
          <span>Timer</span>
          <strong id="vocabularyTimer">${formatTimer(remaining)}</strong>
        </div>
        <button class="ghost-btn" type="button" id="endSession">End quiz</button>
      </div>

      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill" id="vocabularyProgress" style="width: ${progressPercent}%"></div>
      </div>

      ${currentWordMarkup}

      <form class="vocab-guess-form" id="vocabularyGuessForm">
        <label class="field">
          <span>Answer</span>
          <input
            id="vocabularyGuess"
            class="answer-input"
            type="text"
            lang="en"
            autocomplete="off"
            autocapitalize="none"
            spellcheck="false"
            enterkeyhint="done"
            placeholder="${mode.answerPlaceholder}"
          >
        </label>
        <button class="secondary-btn shortcut-btn" type="submit">
          <span>Submit</span>
          ${shortcutHint("Enter")}
        </button>
        <button class="ghost-btn" type="button" id="giveUpVocabularyRow">Reveal</button>
      </form>

      <div class="vocab-table-section">
        <div class="vocab-section-heading">
          <h3>${escapeHtml(session.setLabel)}</h3>
          <span>${formatVocabularyPinyinProgressText(session)}</span>
        </div>
        <div class="vocab-table-wrap" tabindex="0">
          <table class="vocab-table">
            <thead>
              <tr>
                <th>Character</th>
                <th>Pinyin</th>
                <th>Translation</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  document.querySelector("#endSession").addEventListener("click", finishSessionEarly);

  const form = document.querySelector("#vocabularyGuessForm");
  const input = document.querySelector("#vocabularyGuess");
  bindVocabularyRowSelectionHandlers(session);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitVocabularyGuess(input.value);
  });
  document.querySelector("#giveUpVocabularyRow").addEventListener("click", giveUpVocabularyRow);
  input.addEventListener("input", () => {
    submitVocabularyGuess(input.value, { live: true });
  });
  if (!isTouchLikeDevice()) {
    input.focus();
  }
}

function buildVocabularyCurrentWordMarkup(session) {
  const index = getSelectedVocabularyIndex(session);
  const item = index >= 0 ? session.items[index] : null;
  const label = index >= 0
    ? `Row ${index + 1} of ${session.items.length}`
    : "No row selected";

  return `
    <div class="mobile-current-word" aria-live="polite">
      <span id="mobileCurrentWordLabel">${escapeHtml(label)}</span>
      <strong id="mobileCurrentWordText" class="chinese-text" lang="zh-CN">${escapeHtml(item?.zh || "")}</strong>
    </div>
  `;
}

function renderVocabularyMeaningSession() {
  const session = state.session;
  const mode = VOCABULARY_MODES[session.quizMode];
  const submitted = Boolean(session.currentAssessment);
  const currentIndex = submitted ? session.index : getSelectedVocabularyIndex(session);
  const current = session.items[currentIndex];
  const choices = getVocabularyChoiceSet(session, currentIndex);
  const sessionLength = session.items.length;
  const answeredCount = session.answers.length;
  const correctCount = session.answers.filter((entry) => entry.correct).length;
  const progressPercent = Math.round((answeredCount / sessionLength) * 100);
  const remaining = getVocabularyRemainingSeconds(session);
  const rows = buildVocabularyQuizRows(session, { hideTranslation: true });
  const nextUnansweredIndex = getNextVocabularyUnansweredIndex(session);
  const nextButtonLabel = nextUnansweredIndex < 0 ? "View results" : "Next word";

  app.innerHTML = `
    <section class="workspace-panel session-shell vocabulary-session">
      <div class="quiz-play-header">
        <div class="quiz-meter">
          <span>Score</span>
          <strong id="vocabularyScore">${correctCount}/${sessionLength}</strong>
        </div>
        <div class="quiz-meter">
          <span>Timer</span>
          <strong id="vocabularyTimer">${formatTimer(remaining)}</strong>
        </div>
        <button class="ghost-btn" type="button" id="endSession">End quiz</button>
      </div>

      <div class="progress-row">
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" id="vocabularyProgress" style="width: ${progressPercent}%"></div>
        </div>
        <span class="progress-label">Selected word ${currentIndex + 1} of ${sessionLength}</span>
      </div>

      <div class="sentence-card">
        <span class="sentence-label">${mode.promptLabel}</span>
        ${buildVocabularyPromptMarkup(current, session.quizMode, session.currentAssessment)}
      </div>

      <div class="choice-panel" id="answerChoices" role="group" aria-label="Answer choices">
        ${buildVocabularyChoiceMarkup(choices, session.currentAssessment)}
        <div class="form-actions">
          ${
            submitted
              ? `<button class="primary-btn shortcut-btn" type="button" id="nextQuestion">
                  <span>${nextButtonLabel}</span>
                  ${shortcutHint("Enter")}
                </button>`
              : ""
          }
          <button class="ghost-btn" type="button" id="endSessionSecondary">End quiz</button>
        </div>
      </div>

      <div class="vocab-table-section">
        <div class="vocab-section-heading">
          <h3>${escapeHtml(session.setLabel)}</h3>
          <span>${answeredCount} answered, ${sessionLength - answeredCount} left</span>
        </div>
        <div class="vocab-table-wrap" tabindex="0">
          <table class="vocab-table audio-vocab-table">
            <thead>
              <tr>
                <th>Character</th>
                <th>Pinyin</th>
                <th>Translation</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  document.querySelector("#playAudio")?.addEventListener("click", () => speak(current.zh, { immediate: true }));
  document.querySelector("#endSession").addEventListener("click", finishSessionEarly);
  document.querySelector("#endSessionSecondary").addEventListener("click", finishSessionEarly);
  bindVocabularyRowSelectionHandlers(session);

  if (submitted) {
    document.querySelector("#nextQuestion").addEventListener("click", nextQuestion);
    return;
  }

  bindVocabularyChoiceHandlers();
}

function buildVocabularyPromptMarkup(item, quizMode, assessment = null) {
  if (quizMode === "pinyin") {
    return `<p class="sentence-text zh quiz-word chinese-text" lang="zh-CN">${escapeHtml(item.zh)}</p>`;
  }

  return `
    <div class="audio-sentence">
      <button class="secondary-btn shortcut-btn" type="button" id="playAudio" ${supportsSpeechSynthesis() ? "" : "disabled"}>
        <span>Play word</span>
        ${shortcutHint("Enter", { commandControl: true })}
      </button>
      ${supportsSpeechSynthesis() ? "" : `
        <span class="audio-warning">Speech playback is unavailable in this browser.</span>
      `}
      ${buildAudioAnswerStatusMarkup(assessment)}
      <span class="sound-indicator ${state.isSpeaking ? "active" : ""}" id="soundIndicator" aria-live="polite">
        <span class="sound-bars" aria-hidden="true"><span></span><span></span><span></span></span>
        Playing
      </span>
    </div>
    ${buildAudioRevealedWordMarkup(item, assessment)}
  `;
}

function buildAudioRevealedWordMarkup(item, assessment) {
  if (!assessment) {
    return "";
  }

  return `<p class="sentence-text zh quiz-word audio-revealed-word chinese-text" lang="zh-CN" aria-live="polite">${escapeHtml(item.zh)}</p>`;
}

function buildAudioAnswerStatusMarkup(assessment) {
  if (!assessment) {
    return "";
  }

  const classes = [
    "answer-status-pill",
    assessment.correct ? "correct" : "wrong",
    assessment.correct ? "correct-celebration" : "",
  ].filter(Boolean).join(" ");
  return `
    <span class="${classes}" aria-live="polite">
      ${assessment.correct ? "Correct" : "Wrong"}
    </span>
  `;
}

function buildVocabularyFeedbackMarkup(assessment, item) {
  const status = answerStatusTone(assessment);
  const title = answerStatusLabel(assessment);
  const expectedPrimary = assessment.quizMode === "pinyin"
    ? item.pinyin
    : formatVocabularyMeanings(item);
  const referenceMarkup = assessment.quizMode === "pinyin"
    ? `
      <div class="answer-pair">
        ${buildAnswerBox("Word", item.zh)}
        ${buildAnswerBox("Meaning", formatVocabularyMeanings(item))}
      </div>
    `
    : `
      <div class="answer-pair">
        ${buildAnswerBox("Word", item.zh)}
        ${buildAnswerBox("Pinyin", item.pinyin)}
      </div>
    `;

  return `
    <section class="feedback ${status} ${assessment.correct ? "correct-celebration" : ""}" id="feedbackPanel" tabindex="-1">
      <div class="feedback-title">
        <span>${title}</span>
        <span class="score-badge">${Math.round(assessment.score * 100)}%</span>
      </div>
      <div class="answer-pair">
        <div class="answer-box">
          <span class="answer-box-label">Your answer</span>
          ${buildPlainAnswerText(assessment.answer || "No answer entered")}
        </div>
        ${buildAnswerBox(assessment.quizMode === "pinyin" ? "Expected pinyin" : "Expected meaning", expectedPrimary)}
      </div>
      ${referenceMarkup}
    </section>
  `;
}

function buildVocabularyChoiceMarkup(choices, assessment = null) {
  const submitted = Boolean(assessment);
  return `
    <div class="choice-grid">
      ${choices.map((choice) => {
        const selected = assessment?.choiceId === choice.id;
        const classes = [
          "choice-option",
          selected ? "selected" : "",
          submitted && choice.correct ? "correct" : "",
          submitted && selected && !choice.correct ? "incorrect" : "",
          submitted && selected && choice.correct ? "correct-celebration" : "",
        ].filter(Boolean).join(" ");

        return `
          <button
            class="${classes}"
            type="button"
            data-choice-id="${escapeHtml(choice.id)}"
            ${submitted ? "disabled" : ""}
          >
            <span class="choice-key">${escapeHtml(choice.shortcut)}</span>
            <span class="choice-text">${escapeHtml(choice.text)}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function bindVocabularyChoiceHandlers() {
  document.querySelectorAll("[data-choice-id]").forEach((button) => {
    button.addEventListener("click", () => submitVocabularyChoice(button.dataset.choiceId || ""));
  });
}

function getVocabularyChoiceSet(session, index) {
  if (session?.type !== "vocabulary" || session.quizMode !== "meaning" || index < 0) {
    return [];
  }

  if (!(session.choiceSets instanceof Map)) {
    session.choiceSets = new Map();
  }

  if (!session.choiceSets.has(index)) {
    session.choiceSets.set(index, buildVocabularyChoiceSet(session, index));
  }

  return session.choiceSets.get(index);
}

function buildVocabularyChoiceSet(session, index) {
  const item = session.items[index];
  if (!item) {
    return [];
  }

  const correctText = formatVocabularyChoiceText(item);
  const seen = new Set([normalizeChoiceText(correctText)]);
  const wrongOptions = [];
  const pool = shuffle([
    ...session.items,
    ...VOCABULARY_QUIZ_SETS.flatMap((set) => set.words || []),
  ]);

  pool.forEach((candidate) => {
    if (wrongOptions.length >= VOCABULARY_CHOICE_COUNT - 1) {
      return;
    }

    const text = formatVocabularyChoiceText(candidate);
    const key = normalizeChoiceText(text);
    if (!key || seen.has(key)) {
      return;
    }

    seen.add(key);
    wrongOptions.push({
      text,
      correct: false,
    });
  });

  return shuffle([
    {
      text: correctText,
      correct: true,
    },
    ...wrongOptions,
  ])
    .slice(0, VOCABULARY_CHOICE_COUNT)
    .map((choice, choiceIndex) => ({
      ...choice,
      id: `choice-${index}-${choiceIndex}`,
      shortcut: String(choiceIndex + 1),
    }));
}

function normalizeChoiceText(value) {
  return normalizeEnglish(value) || String(value || "").trim().toLowerCase();
}

function formatVocabularyChoiceText(item) {
  const meanings = getVocabularyMeaningCandidates(item).filter((meaning) => !containsChinese(meaning));
  if (meanings.length) {
    return meanings.join("; ");
  }

  return formatVocabularyMeanings(item)
    .replace(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/gu, "")
    .replace(/\s+/g, " ")
    .replace(/\s*;\s*/g, "; ")
    .trim() || "Meaning listed";
}

function buildSentenceMarkup(item, mode) {
  if (mode === "writing") {
    return `<p class="sentence-text">${escapeHtml(item.en)}</p>`;
  }

  if (mode === "reading") {
    return `<p class="sentence-text zh chinese-text" lang="zh-CN">${escapeHtml(item.zh)}</p>`;
  }

  return `
    <div class="audio-sentence">
      <button class="secondary-btn shortcut-btn" type="button" id="playAudio" ${supportsSpeechSynthesis() ? "" : "disabled"}>
        <span>Play sentence</span>
        ${shortcutHint("Enter", { commandControl: true })}
      </button>
      ${supportsSpeechSynthesis() ? "" : `
        <span class="audio-warning">Speech playback is unavailable in this browser.</span>
      `}
      <span class="sound-indicator ${state.isSpeaking ? "active" : ""}" id="soundIndicator" aria-live="polite">
        <span class="sound-bars" aria-hidden="true"><span></span><span></span><span></span></span>
        Playing
      </span>
    </div>
  `;
}

function revealFeedbackPanel() {
  const panel = document.querySelector("#feedbackPanel");
  if (!panel) {
    return;
  }

  const scrollToFeedback = () => {
    panel.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  requestAnimationFrame(() => {
    window.setTimeout(scrollToFeedback, window.visualViewport ? 180 : 80);
  });
}

function getScrollPosition() {
  if (typeof window === "undefined") {
    return null;
  }

  return {
    x: window.scrollX || 0,
    y: window.scrollY || 0,
  };
}

function restoreScrollPosition(position) {
  if (!position || typeof window === "undefined" || typeof window.scrollTo !== "function") {
    return;
  }

  window.scrollTo(position.x, position.y);
  window.requestAnimationFrame?.(() => {
    window.scrollTo(position.x, position.y);
  });
  window.setTimeout?.(() => {
    window.scrollTo(position.x, position.y);
  }, 120);
}

function scrollAudioQuizPromptIntoView() {
  const target = document.querySelector(".sentence-card");
  if (!target) {
    return;
  }

  const scrollToPrompt = () => {
    target.scrollIntoView({ block: "start", behavior: "auto" });
  };

  scrollToPrompt();
  window.requestAnimationFrame?.(scrollToPrompt);
  window.setTimeout?.(scrollToPrompt, 120);
}

function scrollVocabularyWordListToCurrentRow(session) {
  if (session?.type !== "vocabulary") {
    return;
  }

  scrollVocabularyWordListToIndex(getSelectedVocabularyIndex(session));
}

function scrollVocabularyWordListToIndex(index) {
  if (!Number.isInteger(index) || index < 0) {
    return;
  }

  const scrollToRow = () => {
    const wrapper = document.querySelector(".vocabulary-session .vocab-table-wrap");
    const row = wrapper?.querySelector(`tr[data-vocab-index="${index}"]`);
    if (!wrapper || !row) {
      return;
    }

    const header = wrapper.querySelector("thead");
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const wrapperRect = wrapper.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const rowTopInWrapper = rowRect.top - wrapperRect.top + wrapper.scrollTop;
    const targetOffset = Math.max(headerHeight + 12, wrapper.clientHeight * 0.36);
    const maxScrollTop = Math.max(0, wrapper.scrollHeight - wrapper.clientHeight);
    const nextTop = Math.min(
      maxScrollTop,
      Math.max(0, rowTopInWrapper - targetOffset),
    );

    if (typeof wrapper.scrollTo === "function") {
      wrapper.scrollTo({
        top: nextTop,
        behavior: "auto",
      });
      return;
    }

    wrapper.scrollTop = nextTop;
  };

  scrollToRow();
  window.requestAnimationFrame?.(scrollToRow);
  window.setTimeout?.(scrollToRow, 80);
  window.setTimeout?.(scrollToRow, 240);
}

function buildFeedbackMarkup(assessment, item) {
  const status = answerStatusTone(assessment);
  const title = answerStatusLabel(assessment);
  const expectedPrimary = assessment.mode === "writing" ? item.zh : item.en;
  const expectedSecondary = assessment.mode === "writing" ? item.en : item.zh;
  return `
    <section class="feedback ${status} ${assessment.correct ? "correct-celebration" : ""}" id="feedbackPanel" tabindex="-1">
      <div class="feedback-title">
        <span>${title}</span>
        <span class="score-badge">${Math.round(assessment.score * 100)}%</span>
      </div>
      <div class="answer-pair">
        <div class="answer-box">
          <span class="answer-box-label">Your answer</span>
          ${buildPlainAnswerText(assessment.answer || "No answer entered")}
        </div>
        ${buildAnswerBox("Expected", expectedPrimary)}
      </div>
      ${buildAnswerBox("Reference", expectedSecondary)}
    </section>
  `;
}

function answerStatusLabel(answer) {
  const scorePercent = Math.round(answer.score * 100);
  if (scorePercent >= 100) return "Perfect";
  if (scorePercent >= 70) return "Good";
  if (scorePercent > 50) return "Okay";
  return "Review needed";
}

function answerStatusTone(answer) {
  const scorePercent = Math.round(answer.score * 100);
  if (scorePercent >= 70) return "good";
  if (scorePercent > 50) return "okay";
  return "review";
}

function buildPlainAnswerText(value) {
  const className = containsChinese(value) ? ` class="answer-text chinese-text"` : ` class="answer-text"`;
  const lang = containsChinese(value) ? ` lang="zh-CN"` : "";
  return `<p${className}${lang}>${escapeHtml(value)}</p>`;
}

function buildAnswerBox(label, value, options = {}) {
  const annotateChinese = options.annotateChinese !== false;
  return `
    <div class="answer-box">
      <span class="answer-box-label">${label}</span>
      ${annotateChinese ? buildAnswerBoxText(value) : buildPlainAnswerText(value)}
    </div>
  `;
}

function buildAnswerBoxText(value) {
  if (!containsChinese(value)) {
    return `<p>${escapeHtml(value)}</p>`;
  }

  return buildAnnotatedChineseMarkup(value);
}

function buildAnnotatedChineseMarkup(value) {
  hydrateWordDataFromWindow();
  const tokens = tokenizeAnnotatedChinese(value);
  const textMarkup = tokens.map(buildAnnotatedTextTokenMarkup).join("");
  const pinyinMarkup = tokens.map(buildAnnotatedPinyinTokenMarkup).join("");

  return `
    <div class="annotated-chinese chinese-text" lang="zh-CN">
      <p class="annotated-hanzi-line">${textMarkup}</p>
      <p class="annotated-pinyin-line">${pinyinMarkup}</p>
    </div>
  `;
}

function tokenizeAnnotatedChinese(value) {
  const tokens = [];
  let index = 0;

  while (index < value.length) {
    const character = value[index];
    if (!isChineseCharacter(character)) {
      tokens.push({ type: "punctuation", text: character });
      index += 1;
      continue;
    }

    const word = findAnnotatedWord(value, index);
    tokens.push({ type: "word", text: word, entry: CHINESE_WORD_DATA[word] || {} });
    index += word.length;
  }

  return tokens;
}

function findAnnotatedWord(value, index) {
  const maxLength = Math.min(MAX_CHINESE_WORD_LENGTH, value.length - index);

  for (let length = maxLength; length > 0; length -= 1) {
    const candidate = value.slice(index, index + length);
    if (isChineseText(candidate) && Object.prototype.hasOwnProperty.call(CHINESE_WORD_DATA, candidate)) {
      return candidate;
    }
  }

  return value[index];
}

function buildAnnotatedTextTokenMarkup(token) {
  if (token.type !== "word") {
    return `<span class="annotation-punctuation">${escapeHtml(token.text)}</span>`;
  }

  const gloss = token.entry.gloss || "";
  const glossAttributes = gloss
    ? ` has-gloss" title="${escapeHtml(gloss)}" data-gloss="${escapeHtml(gloss)}" tabindex="0"`
    : `"`;

  return `<span class="annotated-word${glossAttributes}>${escapeHtml(token.text)}</span>`;
}

function buildAnnotatedPinyinTokenMarkup(token) {
  if (token.type !== "word") {
    return `<span class="annotation-pinyin-punctuation">${escapeHtml(token.text)}</span>`;
  }

  return `<span class="annotation-pinyin-word">${escapeHtml(token.entry.pinyin || "")}</span>`;
}

function alignGlossTooltip(wordElement) {
  const tooltipWidth = measureGlossTooltipWidth(wordElement.dataset.gloss || "");
  const rect = wordElement.getBoundingClientRect();
  const edgePadding = 12;
  const centeredLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
  const centeredRight = centeredLeft + tooltipWidth;

  if (centeredLeft < edgePadding) {
    wordElement.dataset.tooltipAlign = "left";
    return;
  }

  if (centeredRight > window.innerWidth - edgePadding) {
    wordElement.dataset.tooltipAlign = "right";
    return;
  }

  wordElement.dataset.tooltipAlign = "center";
}

function measureGlossTooltipWidth(gloss) {
  const maxWidth = Math.min(260, Math.max(120, window.innerWidth - 24));
  const measurer = getGlossTooltipMeasurer();
  measurer.style.maxWidth = `${maxWidth}px`;
  measurer.textContent = gloss;
  return Math.min(Math.ceil(measurer.getBoundingClientRect().width), maxWidth);
}

function getGlossTooltipMeasurer() {
  const existing = document.querySelector("#glossTooltipMeasurer");
  if (existing) {
    return existing;
  }

  const measurer = document.createElement("span");
  measurer.id = "glossTooltipMeasurer";
  measurer.className = "gloss-tooltip-measurer";
  document.body.append(measurer);
  return measurer;
}

function renderResults() {
  const result = state.result;
  const correct = result.answers.filter((answer) => answer.correct).length;
  const average = result.answers.length
    ? result.answers.reduce((sum, answer) => sum + answer.score, 0) / result.answers.length
    : 0;
  const percent = Math.round(average * 100);
  const rows = result.answers
    .map((answer, index) => {
      const item = answer.item;
      const sentence =
        result.mode === "writing"
          ? item.en
          : result.mode === "reading"
            ? item.zh
            : "Audio sentence";
      const expected = result.mode === "writing" ? item.zh : item.en;
      const statusClass = `status-${answerStatusTone(answer)}`;
      const statusText = answerStatusLabel(answer);
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${selectedLevelLabel(item.level)}</td>
          <td>${escapeHtml(sentence)}</td>
          <td>${escapeHtml(answer.answer || "No answer entered")}</td>
          <td>${escapeHtml(expected)}</td>
          <td>${Math.round(answer.score * 100)}%</td>
          <td class="${statusClass}">${statusText}</td>
        </tr>
      `;
    })
    .join("");

  app.innerHTML = `
    <section class="workspace-panel">
      <div class="results-header">
        <div>
          <h2>${MODES[result.mode].label} Results</h2>
          <p>${correct} correct out of ${result.answers.length}; average score ${percent}%.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>Start another session</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">Back to trainer</button>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat">
          <strong>${correct}/${result.answers.length}</strong>
          <span>Correct</span>
        </div>
        <div class="stat">
          <strong>${percent}%</strong>
          <span>Average</span>
        </div>
        <div class="stat">
          <strong>${selectedLevelLabels(result.levels)}</strong>
          <span>Difficulty filter</span>
        </div>
        <div class="stat">
          <strong>${result.answers.length}</strong>
          <span>Session size</span>
        </div>
      </div>

      <div class="results-table-wrap" tabindex="0">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Level</th>
              <th>Sentence</th>
              <th>Your answer</th>
              <th>Expected</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  document.querySelector("#restartSession").addEventListener("click", startSession);
  document.querySelector("#backToModes").addEventListener("click", () => {
    state.result = null;
    state.session = null;
    render();
  });
}

function renderPronunciationResults() {
  const result = state.result;
  const average = result.answers.length
    ? result.answers.reduce((sum, answer) => sum + answer.score, 0) / result.answers.length
    : 0;
  const percent = Math.round(average * 100);
  const recognizedWords = result.answers.reduce((sum, answer) => sum + (answer.goodCount || 0), 0);
  const totalWords = result.answers.reduce((sum, answer) => sum + (answer.tokenCount || 0), 0);
  const weaknessStats = getPronunciationWeaknessStats(result.answers);
  const rows = result.answers
    .map((answer, index) => {
      const missedWords = (answer.tokens || [])
        .filter((token) => token.type === "word" && !token.recognized)
        .map((token) => token.text)
        .join("、");
      return `
        <tr>
          <td>${index + 1}</td>
          <td class="chinese-text">${escapeHtml(answer.item.zh)}</td>
          <td class="chinese-text">${escapeHtml(answer.transcript || "No speech recognized")}</td>
          <td>${Math.round(answer.score * 100)}%</td>
          <td>${escapeHtml(missedWords || "None")}</td>
        </tr>
      `;
    })
    .join("");

  app.innerHTML = `
    <section class="workspace-panel">
      <div class="results-header">
        <div>
          <h2>Pronunciation Results</h2>
          <p>${percent}% average recognition across ${result.answers.length} sentences.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>Start another session</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">Back to practice</button>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat">
          <strong>${percent}%</strong>
          <span>Average recognized</span>
        </div>
        <div class="stat">
          <strong>${recognizedWords}/${totalWords}</strong>
          <span>Words recognized</span>
        </div>
        <div class="stat">
          <strong>${selectedLevelLabels(result.levels)}</strong>
          <span>Difficulty filter</span>
        </div>
        <div class="stat">
          <strong>${formatTimer(result.elapsedSeconds || 0)}</strong>
          <span>Session time</span>
        </div>
      </div>

      <section class="pronunciation-breakdown">
        <div class="vocab-section-heading">
          <h3>Focus Areas</h3>
          <span>Inferred from words the browser did not recognize</span>
        </div>
        <div class="pronunciation-breakdown-grid">
          ${buildPronunciationWeaknessCard("Tones", weaknessStats.tones, "No missed tones yet")}
          ${buildPronunciationWeaknessCard("Initials", weaknessStats.initials, "No missed initials yet")}
          ${buildPronunciationWeaknessCard("Finals", weaknessStats.finals, "No missed finals yet")}
        </div>
      </section>

      <div class="results-table-wrap pronunciation-results-table" tabindex="0">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Expected</th>
              <th>Recognized</th>
              <th>Score</th>
              <th>Missed words</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  document.querySelector("#restartSession").addEventListener("click", startPronunciationSession);
  document.querySelector("#backToModes").addEventListener("click", () => {
    state.result = null;
    state.session = null;
    render();
  });
}

function renderMapQuizResults() {
  const result = state.result;
  const correct = result.answers.filter((answer) => answer.correct).length;
  const total = result.answers.length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const resultMode = result.mapQuizMode || DEFAULT_MAP_QUIZ_MODE;
  const mapMode = getSelectedMapQuizMode(resultMode);
  const modeCorrect = countMapAnswersByKind(result.answers, resultMode, true);
  const modeTotal = countMapAnswersByKind(result.answers, resultMode);
  const rows = result.answers.map((answer, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${answer.item.kind === "province" ? "省级行政区" : "城市"}</td>
      <td class="chinese-text">${escapeHtml(answer.item.name)}</td>
      <td>${escapeHtml(answer.item.pinyin)}</td>
      <td>${escapeHtml(answer.selectedName || "No selection")}</td>
      <td class="${answer.correct ? "status-good" : "status-review"}">${answer.correct ? "Correct" : "Review"}</td>
    </tr>
  `).join("");

  app.innerHTML = `
    <section class="workspace-panel">
      <div class="results-header">
        <div>
          <h2>Map Quiz Results</h2>
          <p>${escapeHtml(mapMode.label)}: ${correct} correct out of ${total}; ${percent}% location accuracy.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>Start another quiz</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">Back to map</button>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat">
          <strong>${correct}/${total}</strong>
          <span>Correct</span>
        </div>
        <div class="stat">
          <strong>${modeCorrect}/${modeTotal}</strong>
          <span>${escapeHtml(mapMode.shortLabel)}</span>
        </div>
        <div class="stat">
          <strong>${percent}%</strong>
          <span>Accuracy</span>
        </div>
        <div class="stat">
          <strong>${formatTimer(result.elapsedSeconds || 0)}</strong>
          <span>Quiz time</span>
        </div>
      </div>

      <div class="results-table-wrap map-results-table" tabindex="0">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Prompt</th>
              <th>Pinyin</th>
              <th>Your selection</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  document.querySelector("#restartSession").addEventListener("click", () => {
    state.mapQuizMode = result.mapQuizMode || DEFAULT_MAP_QUIZ_MODE;
    startMapQuizSession();
  });
  document.querySelector("#backToModes").addEventListener("click", () => {
    state.result = null;
    state.session = null;
    render();
  });
}

function countMapAnswersByKind(answers, kind, correctOnly = false) {
  return answers.filter((answer) => answer.item?.kind === kind && (!correctOnly || answer.correct)).length;
}

function buildPronunciationWeaknessCard(title, items, emptyText) {
  const list = items.length
    ? items.slice(0, 6).map((item) => `
        <li>
          <span>${escapeHtml(item.label)}</span>
          <strong>${item.count}</strong>
        </li>
      `).join("")
    : `<li class="empty">${escapeHtml(emptyText)}</li>`;

  return `
    <div class="pronunciation-breakdown-card">
      <h4>${escapeHtml(title)}</h4>
      <ul class="pronunciation-metric-list">${list}</ul>
    </div>
  `;
}

function getPronunciationWeaknessStats(answers) {
  const tones = new Map();
  const initials = new Map();
  const finals = new Map();

  answers.forEach((answer) => {
    (answer.tokens || []).forEach((token) => {
      if (token.type !== "word" || token.recognized || !token.pinyin) {
        return;
      }

      splitPinyinSyllables(normalizePinyinForCompare(token.pinyin)).forEach((syllable) => {
        const parsed = parsePinyinSyllable(syllable);
        incrementMapCount(tones, parsed.toneLabel);
        incrementMapCount(initials, parsed.initial || "No initial");
        incrementMapCount(finals, parsed.final || "No final");
      });
    });
  });

  return {
    tones: mapCountsToSortedItems(tones),
    initials: mapCountsToSortedItems(initials),
    finals: mapCountsToSortedItems(finals),
  };
}

function parsePinyinSyllable(syllable) {
  const normalized = String(syllable || "").trim();
  const toneMatch = normalized.match(/([1-5])$/);
  const tone = toneMatch?.[1] || "5";
  const base = normalized.replace(/[1-5]$/, "");
  const initial = PINYIN_INITIALS.find((candidate) => base.startsWith(candidate)) || "";
  const final = base.slice(initial.length);

  return {
    tone,
    toneLabel: tone === "5" ? "Neutral tone" : `Tone ${tone}`,
    initial,
    final,
  };
}

function incrementMapCount(map, key) {
  if (!key) {
    return;
  }

  map.set(key, (map.get(key) || 0) + 1);
}

function mapCountsToSortedItems(map) {
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function renderVocabularyResults() {
  const result = state.result;
  if (result.quizMode === "meaning") {
    renderVocabularyMeaningResults();
    return;
  }

  const foundIds = new Set(result.foundIds || []);
  const missedIds = new Set(result.missedIds || []);
  const total = result.items.length;
  const stats = getVocabularyResultStats(result);
  const correct = stats.correct;
  const bestTime = getVocabularyHighScore(result.quizMode, result.setId);
  const resultLabel = result.finishReason === "complete"
    ? "Completed"
    : result.finishReason === "time"
      ? "Time expired"
      : "Ended";
  const rows = result.items
    .map((item, index) => {
      const id = vocabularyItemId(item, index);
      const found = foundIds.has(id);
      const statusText = found ? "Correct" : "Wrong";
      return `
        <tr class="${found ? "found" : "missed"}">
          <td>${index + 1}</td>
          <td class="chinese-text">${escapeHtml(item.zh)}</td>
          <td>${buildToneColoredPinyinMarkup(item.pinyin)}</td>
          <td>${escapeHtml(formatVocabularyMeanings(item))}</td>
          <td class="${found ? "status-good" : "status-review"}">${statusText}</td>
        </tr>
      `;
    })
    .join("");

  app.innerHTML = `
    <section class="workspace-panel">
      <div class="results-header">
        <div>
          <h2>Vocabulary Results</h2>
          <p>${resultLabel}: ${correct} of ${total} correct in ${formatTimer(result.elapsedSeconds)}. Best time: ${bestTime ? formatTimer(bestTime.elapsedSeconds) : "none"}.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>Start another quiz</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">Back to quiz</button>
        </div>
      </div>

      ${buildHighScoreCelebration(result)}

      <div class="stat-grid">
        <div class="stat">
          <strong>${correct}/${total}</strong>
          <span>Correct</span>
        </div>
        <div class="stat">
          <strong>${formatTimer(result.elapsedSeconds)}</strong>
          <span>This run</span>
        </div>
        <div class="stat">
          <strong>${bestTime ? formatTimer(bestTime.elapsedSeconds) : "None"}</strong>
          <span>Best time</span>
        </div>
        <div class="stat">
          <strong>${formatTimer(result.timeLimitSeconds)}</strong>
          <span>Time limit</span>
        </div>
      </div>

      <div class="results-table-wrap vocab-table-wrap" tabindex="0">
        <table class="vocab-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Character</th>
              <th>Pinyin</th>
              <th>Translation</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  document.querySelector("#restartSession").addEventListener("click", startVocabularySession);
  document.querySelector("#backToModes").addEventListener("click", () => {
    state.result = null;
    state.session = null;
    render();
  });
  dismissHighScoreCelebration();
}

function renderVocabularyMeaningResults() {
  const result = state.result;
  const total = result.items.length;
  const answered = result.answers.length;
  const stats = getVocabularyResultStats(result);
  const correct = stats.correct;
  const bestTime = getVocabularyHighScore(result.quizMode, result.setId);
  const resultLabel = result.finishReason === "complete"
    ? "Completed"
    : result.finishReason === "time"
      ? "Time expired"
      : "Ended";
  const answersByIndex = new Map(result.answers.map((answer) => [answer.itemIndex, answer]));
  const rows = result.items
    .map((item, index) => {
      const answer = answersByIndex.get(index);
      const statusTone = answer ? answerStatusTone(answer) : "review";
      const statusText = answer ? answerStatusLabel(answer) : "Unanswered";
      return `
        <tr class="${answer?.correct ? "found" : "missed"}">
          <td>${index + 1}</td>
          <td class="chinese-text">${escapeHtml(item.zh)}</td>
          <td>${buildToneColoredPinyinMarkup(item.pinyin)}</td>
          <td>${escapeHtml(answer?.answer || "No answer entered")}</td>
          <td>${escapeHtml(formatVocabularyMeanings(item))}</td>
          <td>${answer ? `${Math.round(answer.score * 100)}%` : "0%"}</td>
          <td class="status-${statusTone}">${statusText}</td>
        </tr>
      `;
    })
    .join("");

  app.innerHTML = `
    <section class="workspace-panel">
      <div class="results-header">
        <div>
          <h2>Audio Vocabulary Results</h2>
          <p>${resultLabel}: ${correct} correct out of ${total}; ${answered} answered in ${formatTimer(result.elapsedSeconds)}. Best time: ${bestTime ? formatTimer(bestTime.elapsedSeconds) : "none"}.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>Start another quiz</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">Back to quiz</button>
        </div>
      </div>

      ${buildHighScoreCelebration(result)}

      <div class="stat-grid">
        <div class="stat">
          <strong>${correct}/${total}</strong>
          <span>Correct</span>
        </div>
        <div class="stat">
          <strong>${formatTimer(result.elapsedSeconds)}</strong>
          <span>This run</span>
        </div>
        <div class="stat">
          <strong>${bestTime ? formatTimer(bestTime.elapsedSeconds) : "None"}</strong>
          <span>Best time</span>
        </div>
        <div class="stat">
          <strong>${formatTimer(result.timeLimitSeconds)}</strong>
          <span>Time limit</span>
        </div>
      </div>

      <div class="results-table-wrap vocab-table-wrap" tabindex="0">
        <table class="vocab-table audio-results-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Character</th>
              <th>Pinyin</th>
              <th>Your answer</th>
              <th>Expected meaning</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  document.querySelector("#restartSession").addEventListener("click", startVocabularySession);
  document.querySelector("#backToModes").addEventListener("click", () => {
    state.result = null;
    state.session = null;
    render();
  });
  dismissHighScoreCelebration();
}

function buildHighScoreCelebration(result) {
  if (!result?.isNewHighScore) {
    return "";
  }

  const previousBest = Number.isFinite(result.previousBestSeconds)
    ? ` Beat ${formatTimer(result.previousBestSeconds)}.`
    : "";

  return `
    <div class="high-score-celebration" role="status" aria-live="polite">
      <span class="high-score-icon" aria-hidden="true">
        <span></span>
      </span>
      <div>
        <strong>Nice, new best time!</strong>
        <span>Finished in ${formatTimer(result.elapsedSeconds)}.${previousBest}</span>
      </div>
    </div>
  `;
}

function dismissHighScoreCelebration() {
  const celebration = document.querySelector(".high-score-celebration");
  if (!celebration) {
    return;
  }

  window.setTimeout(() => {
    if (!celebration.isConnected) {
      return;
    }

    celebration.classList.add("dismissed");
    const removeDelay = prefersReducedMotion() ? 0 : 260;
    window.setTimeout(() => celebration.remove(), removeDelay);
  }, 3800);
}

function startActiveSession() {
  if (state.tool === "vocabulary") {
    startVocabularySession();
    return;
  }

  if (state.tool === "pronunciation") {
    startPronunciationSession();
    return;
  }

  if (state.tool === "map") {
    startMapQuizSession();
    return;
  }

  if (state.tool === "history") {
    renderHistoryHome();
    return;
  }

  startSession();
}

async function startSession() {
  if (state.isLoadingSentences) {
    return;
  }

  stopPronunciationRecognition();
  stopSpeech();
  state.dataError = "";
  state.isLoadingSentences = true;
  render();

  try {
    await ensureSentenceData();
  } catch {
    state.dataError = "The sentence bank could not be loaded. Check your connection and try again.";
    state.isLoadingSentences = false;
    render();
    return;
  }

  state.isLoadingSentences = false;
  const pool = shuffle(getFilteredPool());
  if (pool.length < SESSION_LENGTH) {
    render();
    return;
  }

  const items = pool.slice(0, SESSION_LENGTH);

  state.result = null;
  state.session = {
    type: "drill",
    mode: state.mode,
    levels: [...state.selectedLevels],
    items,
    index: 0,
    answers: [],
    currentAssessment: null,
  };

  render();
  queueIdleTask(() => {
    ensureWordData().catch(() => {});
  });
  if (state.mode === "listening") {
    speak(state.session.items[0].zh);
  }
}

async function startPronunciationSession() {
  if (state.isLoadingSentences) {
    return;
  }

  if (!supportsSpeechRecognition()) {
    state.dataError = "Speech recognition is not available in this browser. Try Chrome or Edge on an HTTPS page.";
    render();
    return;
  }

  stopPronunciationRecognition();
  stopSpeech();
  state.dataError = "";
  state.isLoadingSentences = true;
  render();

  try {
    await ensureSentenceData();
  } catch {
    state.dataError = "The sentence bank could not be loaded. Check your connection and try again.";
    state.isLoadingSentences = false;
    render();
    return;
  }

  try {
    await ensureWordData();
  } catch {
    // Word-level pinyin is used for richer feedback; the session can still run with character tokens.
  }

  state.isLoadingSentences = false;
  const pool = shuffle(getPronunciationPool());
  if (pool.length < PRONUNCIATION_SESSION_LENGTH) {
    state.dataError = `Select at least ${PRONUNCIATION_SESSION_LENGTH} short sentences before starting a session.`;
    render();
    return;
  }

  state.result = null;
  state.session = {
    type: "pronunciation",
    levels: [...state.selectedLevels],
    showPinyin: state.pronunciationShowPinyin,
    items: pool.slice(0, PRONUNCIATION_SESSION_LENGTH),
    index: 0,
    answers: [],
    currentAssessment: null,
    isListening: false,
    recognitionError: "",
    startedAt: Date.now(),
  };

  saveSettings();
  render();
}

function startMapQuizSession() {
  stopPronunciationRecognition();
  stopSpeech();
  const mapQuizMode = MAP_QUIZ_MODES[state.mapQuizMode] ? state.mapQuizMode : DEFAULT_MAP_QUIZ_MODE;
  const items = shuffle(getMapQuizPool(mapQuizMode));

  state.result = null;
  state.session = {
    type: "map",
    mapQuizMode,
    showPinyinNames: state.mapShowPinyinNames,
    items,
    index: 0,
    answers: [],
    currentAssessment: null,
    hintVisible: false,
    mapView: createDefaultChinaMapView(),
    startedAt: Date.now(),
  };

  saveSettings();
  render();
  scrollMapSessionIntoView("session");
}

function startVocabularySession() {
  const selectedSet = getSelectedVocabularySet();
  if (!selectedSet?.words.length) {
    return;
  }

  stopPronunciationRecognition();
  stopSpeech();
  const items = state.vocabularyOrder === "random"
    ? shuffle(selectedSet.words)
    : [...selectedSet.words];
  const timeLimitSeconds = determineVocabularyTimeLimit(items.length);
  const startedAt = Date.now();

  state.result = null;
  state.session = {
    type: "vocabulary",
    quizMode: state.vocabularyMode,
    setId: selectedSet.id,
    setLabel: selectedSet.label,
    setShortLabel: selectedSet.shortLabel,
    order: state.vocabularyOrder,
    hideTranslations: state.vocabularyMode === "meaning" || state.vocabularyHideTranslations,
    items,
    index: 0,
    selectedVocabularyIndex: 0,
    foundIds: new Set(),
    missedIds: new Set(),
    answers: [],
    choiceSets: new Map(),
    lastCorrectItemIndex: -1,
    currentAssessment: null,
    startedAt,
    endsAt: startedAt + timeLimitSeconds * 1000,
    timeLimitSeconds,
  };

  saveSettings();
  render();
  if (state.session.quizMode === "meaning") {
    speak(state.session.items[0].zh, { immediate: true });
  }
}

function submitVocabularyGuess(answer, options = {}) {
  const session = state.session;
  if (session?.type !== "vocabulary" || session.quizMode !== "pinyin") {
    return;
  }

  const trimmed = answer.trim();
  if (!trimmed) {
    return;
  }

  const matches = findVocabularyGuessMatches(trimmed, session);
  const match = matches[0];
  if (!match) {
    return;
  }

  const foundAt = Math.max(0, Math.round((Date.now() - session.startedAt) / 1000));
  session.foundIds.add(match.id);
  ensureVocabularyMissedIds(session).delete(match.id);
  session.lastCorrectItemIndex = match.index;
  session.answers.push({
    answer: trimmed,
    correct: true,
    foundAt,
    item: match.item,
    itemIndex: match.index,
    score: 1,
  });
  selectNextVocabularyRowAfter(session, match.index);

  if (getVocabularyPinyinAnsweredCount(session) >= session.items.length) {
    finishVocabularySession("complete");
    return;
  }

  if (options.live) {
    const input = document.querySelector("#vocabularyGuess");
    if (input) {
      input.value = "";
    }
    updateVocabularySessionMetrics(session);
    scrollVocabularyWordListToCurrentRow(session);
    return;
  }

  render();
  scrollVocabularyWordListToCurrentRow(session);
}

function giveUpVocabularyRow() {
  const session = state.session;
  if (session?.type !== "vocabulary" || session.quizMode !== "pinyin") {
    return;
  }

  const index = getSelectedVocabularyIndex(session);
  if (index < 0 || !isVocabularyRowPending(session, index)) {
    return;
  }

  const item = session.items[index];
  const id = vocabularyItemId(item, index);
  const foundAt = Math.max(0, Math.round((Date.now() - session.startedAt) / 1000));
  ensureVocabularyMissedIds(session).add(id);
  session.lastCorrectItemIndex = -1;
  session.answers.push({
    answer: "",
    correct: false,
    foundAt,
    givenUp: true,
    item,
    itemIndex: index,
    score: 0,
  });

  selectNextVocabularyRowAfter(session, index);

  if (getVocabularyPinyinAnsweredCount(session) >= session.items.length) {
    finishVocabularySession("complete");
    return;
  }

  const input = document.querySelector("#vocabularyGuess");
  if (input) {
    input.value = "";
  }
  updateVocabularySessionMetrics(session);
  scrollVocabularyWordListToCurrentRow(session);
  focusVocabularyInput();
}

async function submitAnswer(answer) {
  if (state.isCheckingAnswer) {
    return;
  }

  const session = state.session;
  if (!session) {
    return;
  }
  if (session.type === "vocabulary" && session.quizMode === "meaning") {
    return;
  }

  state.isCheckingAnswer = true;
  document.activeElement?.blur?.();

  try {
    await ensureWordData();
  } catch {
    // Annotation is a convenience; answer checking should still work if the glossary fails.
  }

  if (state.session !== session) {
    state.isCheckingAnswer = false;
    return;
  }

  const item = session.items[session.index];
  const assessment = session.type === "vocabulary"
    ? assessVocabularyAnswer(answer, item, session.quizMode)
    : assessAnswer(answer, item, session.mode);
  session.currentAssessment = assessment;
  session.answers.push({
    ...assessment,
    item,
    ...(session.type === "vocabulary" ? { itemIndex: session.index } : {}),
  });
  state.isCheckingAnswer = false;
  render();
}

function submitVocabularyChoiceByShortcut(shortcut) {
  const session = state.session;
  if (session?.type !== "vocabulary" || session.quizMode !== "meaning" || session.currentAssessment) {
    return;
  }

  const index = getSelectedVocabularyIndex(session);
  const choice = getVocabularyChoiceSet(session, index).find((option) => option.shortcut === shortcut);
  if (choice) {
    submitVocabularyChoice(choice.id);
  }
}

function submitVocabularyChoice(choiceId) {
  if (state.isCheckingAnswer) {
    return;
  }

  const session = state.session;
  if (session?.type !== "vocabulary" || session.quizMode !== "meaning" || session.currentAssessment) {
    return;
  }

  const index = getSelectedVocabularyIndex(session);
  if (index < 0) {
    return;
  }

  const item = session.items[index];
  const choice = getVocabularyChoiceSet(session, index).find((option) => option.id === choiceId);
  if (!choice) {
    return;
  }

  state.isCheckingAnswer = true;
  document.activeElement?.blur?.();
  const scrollPosition = getScrollPosition();

  const assessment = {
    quizMode: "meaning",
    answer: choice.text,
    choiceId: choice.id,
    score: choice.correct ? 1 : 0,
    correct: choice.correct,
  };

  session.index = index;
  session.selectedVocabularyIndex = index;
  session.currentAssessment = assessment;
  session.answers.push({
    ...assessment,
    item,
    itemIndex: index,
  });
  state.isCheckingAnswer = false;
  render();
  restoreScrollPosition(scrollPosition);
  scrollVocabularyWordListToIndex(index);
}

function nextQuestion() {
  const session = state.session;
  const sessionLength = session.items.length;

  if (session.type === "vocabulary") {
    const nextIndex = selectNextVocabularyRowAfter(session, session.index);
    if (nextIndex < 0) {
      const result = markVocabularyHighScoreResult(buildSessionResult({ ...session, finishReason: "complete" }));
      state.result = result;
      saveHistoryResult(result);
      state.session = null;
      stopSpeech();
      render();
      return;
    }

    session.currentAssessment = null;
    render();
    scrollVocabularyWordListToCurrentRow(session);
    if (session.quizMode === "meaning") {
      scrollAudioQuizPromptIntoView();
    }

    if (sessionUsesAudioPrompt(session)) {
      speak(session.items[session.index].zh, { immediate: true });
    }
    return;
  }

  if (session.type === "pronunciation") {
    stopPronunciationRecognition();
    if (session.index + 1 >= sessionLength) {
      const result = buildSessionResult(session);
      state.result = result;
      saveHistoryResult(result);
      state.session = null;
      stopSpeech();
      render();
      return;
    }

    session.index += 1;
    session.currentAssessment = null;
    session.recognitionError = "";
    session.isListening = false;
    render();
    return;
  }

  if (session.type === "map") {
    if (session.index + 1 >= sessionLength) {
      const result = buildSessionResult(session);
      state.result = result;
      saveHistoryResult(result);
      state.session = null;
      render();
      return;
    }

    session.index += 1;
    session.currentAssessment = null;
    session.hintVisible = false;
    session.mapView = createDefaultChinaMapView();
    render();
    scrollMapSessionIntoView("session");
    return;
  }

  if (session.index + 1 >= sessionLength) {
    const result = buildSessionResult(
      session.type === "vocabulary"
        ? { ...session, finishReason: "complete" }
        : session,
    );
    state.result = result;
    saveHistoryResult(result);
    state.session = null;
    stopSpeech();
    render();
    return;
  }

  session.index += 1;
  session.currentAssessment = null;
  render();

  if (sessionUsesAudioPrompt(session)) {
    speak(session.items[session.index].zh, { immediate: true });
  }
}

function finishSessionEarly() {
  const session = state.session;
  if (session?.type === "vocabulary") {
    finishVocabularySession("ended");
    return;
  }

  if (session?.type === "pronunciation") {
    stopPronunciationRecognition();
  }

  if (session?.type === "map") {
    stopSpeech();
  }

  if (!session.answers.length) {
    state.session = null;
    stopSpeech();
    render();
    return;
  }

  const result = buildSessionResult(session);
  state.result = result;
  saveHistoryResult(result);
  state.session = null;
  stopSpeech();
  render();
}

function finishVocabularySession(reason) {
  const session = state.session;
  if (session?.type !== "vocabulary") {
    return;
  }

  const result = markVocabularyHighScoreResult(buildSessionResult({ ...session, finishReason: reason }));
  state.result = result;
  saveHistoryResult(result);
  state.session = null;
  stopVocabularyTimer();
  render();
}

function buildSessionResult(session) {
  if (session.type === "vocabulary") {
    const elapsedSeconds = Math.min(
      session.timeLimitSeconds,
      Math.max(0, Math.round((Date.now() - session.startedAt) / 1000)),
    );
    return {
      type: "vocabulary",
      quizMode: session.quizMode,
      setId: session.setId,
      setLabel: session.setLabel,
      setShortLabel: session.setShortLabel,
      order: session.order,
      items: session.items,
      foundIds: [...session.foundIds],
      missedIds: [...ensureVocabularyMissedIds(session)],
      answers: session.answers,
      elapsedSeconds,
      finishReason: session.finishReason || "ended",
      timeLimitSeconds: session.timeLimitSeconds,
    };
  }

  if (session.type === "pronunciation") {
    const elapsedSeconds = Math.max(0, Math.round((Date.now() - session.startedAt) / 1000));
    return {
      type: "pronunciation",
      levels: session.levels,
      showPinyin: session.showPinyin,
      items: session.items,
      answers: session.answers,
      elapsedSeconds,
      total: session.items.length,
    };
  }

  if (session.type === "map") {
    const elapsedSeconds = Math.max(0, Math.round((Date.now() - session.startedAt) / 1000));
    return {
      type: "map",
      mapQuizMode: session.mapQuizMode || DEFAULT_MAP_QUIZ_MODE,
      items: session.items,
      answers: session.answers,
      elapsedSeconds,
      total: session.items.length,
    };
  }

  return {
    type: "drill",
    mode: session.mode,
    levels: session.levels,
    answers: session.answers,
  };
}

function saveHistoryResult(result) {
  try {
    const history = loadHistoryRecords();
    const record = buildHistoryRecord(result);
    saveHistoryRecords([record, ...history].slice(0, HISTORY_LIMIT));
  } catch {
    // History is browser-local convenience data; session results still render if storage is unavailable.
  }
}

function markVocabularyHighScoreResult(result) {
  if (result?.type !== "vocabulary") {
    return result;
  }

  const stats = getVocabularyResultStats(result);
  if (!stats.highScoreEligible) {
    return result;
  }

  const previousBest = getVocabularyHighScore(result.quizMode, result.setId);
  return {
    ...result,
    isNewHighScore: !previousBest || result.elapsedSeconds < previousBest.elapsedSeconds,
    previousBestSeconds: previousBest?.elapsedSeconds ?? null,
  };
}

function buildHistoryRecord(result) {
  const completedAt = new Date().toISOString();
  const id = `${completedAt}-${Math.random().toString(36).slice(2, 9)}`;

  if (result.type === "vocabulary") {
    const stats = getVocabularyResultStats(result);
    const answersByIndex = new Map((result.answers || []).map((answer) => [answer.itemIndex, answer]));
    const answerRows = result.items.map((item, index) => {
      const answer = answersByIndex.get(index);
      const pinyinFound = result.quizMode === "pinyin" && new Set(result.foundIds || []).has(vocabularyItemId(item, index));
      return {
        index,
        zh: item.zh,
        pinyin: item.pinyin,
        meaning: formatVocabularyMeanings(item),
        answer: answer?.answer || "",
        correct: result.quizMode === "pinyin" ? pinyinFound : Boolean(answer?.correct),
        score: result.quizMode === "pinyin" ? (pinyinFound ? 1 : 0) : (answer?.score || 0),
      };
    });

    return {
      id,
      type: "vocabulary",
      completedAt,
      quizMode: result.quizMode,
      setId: result.setId,
      setLabel: result.setLabel || result.setShortLabel || result.setId,
      order: result.order,
      total: stats.total,
      correct: stats.correct,
      elapsedSeconds: result.elapsedSeconds,
      finishReason: result.finishReason || "ended",
      highScoreEligible: stats.highScoreEligible,
      timeLimitSeconds: result.timeLimitSeconds,
      answers: answerRows,
    };
  }

  if (result.type === "pronunciation") {
    const averageScore = result.answers.length
      ? result.answers.reduce((sum, answer) => sum + answer.score, 0) / result.answers.length
      : 0;
    const weaknesses = getPronunciationWeaknessStats(result.answers);

    return {
      id,
      type: "pronunciation",
      completedAt,
      levels: result.levels,
      total: result.answers.length,
      averageScore,
      elapsedSeconds: result.elapsedSeconds || 0,
      weaknesses,
      answers: result.answers.map((answer, index) => ({
        index,
        zh: answer.item.zh,
        en: answer.item.en,
        transcript: answer.transcript || "",
        score: answer.score,
        recognizedWords: answer.goodCount || 0,
        totalWords: answer.tokenCount || 0,
        missedWords: (answer.tokens || [])
          .filter((token) => token.type === "word" && !token.recognized)
          .map((token) => ({
            text: token.text,
            pinyin: token.pinyin || "",
          })),
      })),
    };
  }

  if (result.type === "map") {
    const correct = result.answers.filter((answer) => answer.correct).length;

    return {
      id,
      type: "map",
      completedAt,
      mapQuizMode: result.mapQuizMode || DEFAULT_MAP_QUIZ_MODE,
      total: result.answers.length,
      correct,
      elapsedSeconds: result.elapsedSeconds || 0,
      answers: result.answers.map((answer, index) => ({
        index,
        prompt: answer.item.name,
        kind: answer.item.kind,
        pinyin: answer.item.pinyin,
        selected: answer.selectedName,
        selectedKind: answer.selectedKind,
        correct: answer.correct,
        score: answer.score,
      })),
    };
  }

  const correct = result.answers.filter((answer) => answer.correct).length;
  const averageScore = result.answers.length
    ? result.answers.reduce((sum, answer) => sum + answer.score, 0) / result.answers.length
    : 0;

  return {
    id,
    type: "drill",
    completedAt,
    mode: result.mode,
    levels: result.levels,
    total: result.answers.length,
    correct,
    averageScore,
    answers: result.answers.map((answer, index) => ({
      index,
      prompt: result.mode === "writing"
        ? answer.item.en
        : result.mode === "reading"
          ? answer.item.zh
          : "Audio sentence",
      answer: answer.answer,
      expected: result.mode === "writing" ? answer.item.zh : answer.item.en,
      score: answer.score,
      correct: answer.correct,
    })),
  };
}

function loadHistoryRecords() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistoryRecords(records) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}

function clearHistoryRecords() {
  localStorage.removeItem(HISTORY_KEY);
}

function getVocabularyResultStats(result) {
  const total = result.items?.length || result.total || 0;
  const correct = result.quizMode === "pinyin"
    ? new Set(result.foundIds || []).size
    : (result.answers || []).filter((answer) => answer.correct).length;
  const answered = result.quizMode === "pinyin"
    ? correct
    : (result.answers || []).length;
  const highScoreEligible = total > 0 &&
    result.finishReason === "complete" &&
    answered === total &&
    correct === total;

  return { answered, correct, highScoreEligible, total };
}

function getVocabularyHighScore(quizMode, setId, records = loadHistoryRecords()) {
  return records
    .filter((record) =>
      record.type === "vocabulary" &&
      record.quizMode === quizMode &&
      record.setId === setId &&
      record.highScoreEligible,
    )
    .sort((a, b) => a.elapsedSeconds - b.elapsedSeconds)[0] || null;
}

function getVocabularyHighScoreRecords(records = loadHistoryRecords()) {
  const bestByKey = new Map();
  records
    .filter((record) => record.type === "vocabulary" && record.highScoreEligible)
    .forEach((record) => {
      const key = `${record.quizMode}:${record.setId}`;
      const existing = bestByKey.get(key);
      if (!existing || record.elapsedSeconds < existing.elapsedSeconds) {
        bestByKey.set(key, record);
      }
    });

  return [...bestByKey.values()].sort((a, b) =>
    a.setLabel.localeCompare(b.setLabel) ||
    a.quizMode.localeCompare(b.quizMode),
  );
}

function formatHistoryDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function assessAnswer(answer, item, mode) {
  const trimmed = answer.trim();
  const score = mode === "writing"
    ? scoreChinese(trimmed, item.zh)
    : scoreEnglish(trimmed, item.en, {
        ignoreGenderPronouns: mode === "listening" && /[他她]/.test(item.zh),
      });
  return {
    mode,
    answer: trimmed,
    score,
    correct: score >= ACCEPTANCE_THRESHOLD,
  };
}

function assessVocabularyAnswer(answer, item, quizMode) {
  const trimmed = answer.trim();
  const score = quizMode === "pinyin"
    ? scorePinyin(trimmed, item)
    : scoreVocabularyMeaning(trimmed, item);

  return {
    quizMode,
    answer: trimmed,
    score,
    correct: score >= ACCEPTANCE_THRESHOLD,
  };
}

function scorePinyin(actual, item) {
  const normalizedActual = normalizePinyinForCompare(actual);
  if (!normalizedActual) return 0;

  const expectedVariants = getNormalizedVocabularyPinyinVariants(item);
  const compactActual = compactPinyin(normalizedActual);

  if (expectedVariants.some((expected) => normalizedActual === expected || compactActual === compactPinyin(expected))) {
    return 1;
  }

  const actualBase = stripPinyinTones(normalizedActual);
  const compactActualBase = compactPinyin(actualBase);
  const expectedBases = expectedVariants.map(stripPinyinTones);

  if (expectedBases.some((expected) => actualBase === expected || compactActualBase === compactPinyin(expected))) {
    return 0.82;
  }

  const actualPlainBase = stripPinyinToneAndUmlautMarks(normalizedActual);
  const compactActualPlainBase = compactPinyin(actualPlainBase);
  const expectedPlainBases = expectedVariants.map(stripPinyinToneAndUmlautMarks);

  if (expectedPlainBases.some((expected) => actualPlainBase === expected || compactActualPlainBase === compactPinyin(expected))) {
    return 0.82;
  }

  const bestBaseSimilarity = Math.max(
    0,
    ...expectedBases.map((expected) => stringSimilarity(compactActualBase, compactPinyin(expected))),
  );
  const bestToneSimilarity = Math.max(
    0,
    ...expectedVariants.map((expected) => stringSimilarity(compactActual, compactPinyin(expected))),
  );

  return clamp(Math.max(bestBaseSimilarity * 0.68, bestToneSimilarity * 0.78), 0, 1);
}

function scoreVocabularyMeaning(actual, item) {
  if (!normalizeEnglish(actual)) return 0;
  const candidates = getVocabularyMeaningCandidates(item);
  return clamp(Math.max(0, ...candidates.map((candidate) => scoreEnglish(actual, candidate))), 0, 1);
}

function getVocabularyPinyinVariants(item) {
  return uniqueStrings([
    item.pinyin,
    item.numeric,
    ...(item.pinyinAlternates || []),
    ...(item.numericAlternates || []),
  ]);
}

function getNormalizedVocabularyPinyinVariants(item) {
  return uniqueStrings(
    getVocabularyPinyinVariants(item)
      .map(normalizePinyinForCompare)
      .filter(Boolean)
      .flatMap(expandNormalizedPinyinVariant),
  );
}

function expandNormalizedPinyinVariant(normalized) {
  const variants = new Set([normalized]);
  const syllables = normalized.split(/\s+/).filter(Boolean);

  syllables.forEach((syllable, index) => {
    const standaloneErhua = syllable.match(/^r([1-5]?)$/);
    if (standaloneErhua) {
      const next = [...syllables];
      next[index] = `er${standaloneErhua[1] || ""}`;
      variants.add(next.join(" "));
      return;
    }

    const trailingErhua = syllable.match(/^([a-zv]+)r([1-5]?)$/);
    if (trailingErhua) {
      const next = [...syllables];
      next[index] = `${trailingErhua[1]}er${trailingErhua[2] || ""}`;
      variants.add(next.join(" "));
    }
  });

  return [...variants];
}

function getVocabularyMeaningCandidates(item) {
  return uniqueStrings(item.meanings || [])
    .flatMap((meaning) => String(meaning).split(/[;/]/))
    .map((meaning) => meaning.trim())
    .filter(Boolean);
}

function formatVocabularyMeanings(item) {
  const meanings = getVocabularyMeaningCandidates(item);
  return meanings.length ? meanings.join("; ") : "No meaning listed";
}

function buildToneColoredPinyinMarkup(pinyin) {
  return String(pinyin || "")
    .normalize("NFC")
    .split(/(\s+)/)
    .map((part) => {
      if (!part || /^\s+$/.test(part)) {
        return escapeHtml(part);
      }

      const toneClass = getPlecoToneClass(extractPinyinTones(part)[0] || "5");
      return `<span class="tone-pinyin ${toneClass}">${escapeHtml(part)}</span>`;
    })
    .join("");
}

function extractPinyinTones(pinyin, expectedToneCount = 0) {
  const tones = [];

  String(pinyin || "")
    .normalize("NFC")
    .replace(/[’'`]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .forEach((token) => {
      const startingLength = tones.length;
      Array.from(token).forEach((character) => {
        const toneMark = PINYIN_TONE_MARKS[character]?.[1];
        if (toneMark) {
          tones.push(toneMark);
          return;
        }

        if (/[1-5]/.test(character)) {
          tones.push(character);
        }
      });

      if (tones.length === startingLength) {
        const normalized = convertPinyinSyllable(token);
        const tone = normalized.match(/([1-5])$/)?.[1] || "5";
        tones.push(tone);
      }
    });

  while (expectedToneCount > 0 && tones.length < expectedToneCount) {
    tones.push("5");
  }

  return expectedToneCount > 0 ? tones.slice(0, expectedToneCount) : tones;
}

function getPlecoToneClass(tone) {
  return PLECO_TONE_CLASS_BY_TONE[String(tone)] || PLECO_TONE_CLASS_BY_TONE[5];
}

function normalizePinyinForCompare(value) {
  return String(value)
    .normalize("NFC")
    .toLowerCase()
    .replace(/u:/g, "v")
    .replace(/ü/g, "v")
    .replace(/['’`]/g, " ")
    .replace(/[^a-z0-9āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜńňǹḿü:\s-]/g, " ")
    .split(/[\s-]+/)
    .map(convertPinyinSyllable)
    .filter(Boolean)
    .join(" ")
    .trim();
}

function convertPinyinSyllable(value) {
  const syllable = value.replace(/u:/g, "v").replace(/ü/g, "v");
  let base = "";
  let tone = "";
  [...syllable].forEach((character) => {
    const mark = PINYIN_TONE_MARKS[character];
    if (mark) {
      base += mark[0];
      tone = mark[1] || tone;
      return;
    }

    if (/[a-zv]/.test(character)) {
      base += character;
      return;
    }

    if (/[1-5]/.test(character)) {
      base += character;
    }
  });

  if (/[1-5]$/.test(base)) {
    return base;
  }

  return `${base}${tone}`;
}

function stripPinyinTones(value) {
  return String(value).replace(/[1-5]/g, "").replace(/\s+/g, " ").trim();
}

function stripPinyinToneAndUmlautMarks(value) {
  return stripPinyinTones(value).replace(/v/g, "u");
}

function compactPinyin(value) {
  return String(value).replace(/\s+/g, "");
}

function scoreChinese(actual, expected) {
  const normalizedActual = normalizeChinese(actual);
  const normalizedExpected = normalizeChinese(expected);

  if (!normalizedActual) return 0;
  if (normalizedActual === normalizedExpected) return 1;

  const orderedSimilarity =
    lcsLength(normalizedActual, normalizedExpected) /
    Math.max(normalizedActual.length, normalizedExpected.length);
  const editSimilarity = stringSimilarity(normalizedActual, normalizedExpected);
  return clamp(Math.max(orderedSimilarity, editSimilarity), 0, 1);
}

function scoreEnglish(actual, expected, options = {}) {
  const normalizedActual = options.ignoreGenderPronouns
    ? neutralizeGenderPronouns(normalizeEnglish(actual))
    : normalizeEnglish(actual);
  const normalizedExpected = options.ignoreGenderPronouns
    ? neutralizeGenderPronouns(normalizeEnglish(expected))
    : normalizeEnglish(expected);

  if (!normalizedActual) return 0;
  if (normalizedActual === normalizedExpected) return 1;

  const actualTokens = contentTokens(normalizedActual);
  const expectedTokens = contentTokens(normalizedExpected);
  const tokenScore = f1Score(actualTokens, expectedTokens);
  const editScore = stringSimilarity(normalizedActual, normalizedExpected);

  return clamp(Math.max(tokenScore, editScore * 0.92), 0, 1);
}

function neutralizeGenderPronouns(value) {
  return value
    .replace(/\b(he|she|him|her|his|hers|himself|herself)\b/g, "person")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeChinese(value) {
  return value
    .replace(/[，。！？、；：“”‘’《》（）\s]/g, "")
    .replace(/[,.!?;:'"()[\]]/g, "")
    .trim();
}

function normalizeEnglish(value) {
  return value
    .toLowerCase()
    .replace(/[\u2018\u2019\u201b\u2032]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\bwon['’]?t\b/g, "will not")
    .replace(/\bcan['’]?t\b/g, "can not")
    .replace(/\bshan['’]?t\b/g, "shall not")
    .replace(/\blet['’]?s\b/g, "let us")
    .replace(/\bdo['’]?nt\b/g, "do not")
    .replace(/\bdoes['’]?nt\b/g, "does not")
    .replace(/\bdid['’]?nt\b/g, "did not")
    .replace(/\bis['’]?nt\b/g, "is not")
    .replace(/\bare['’]?nt\b/g, "are not")
    .replace(/\bwas['’]?nt\b/g, "was not")
    .replace(/\bwere['’]?nt\b/g, "were not")
    .replace(/\bhave['’]?nt\b/g, "have not")
    .replace(/\bhas['’]?nt\b/g, "has not")
    .replace(/\bhad['’]?nt\b/g, "had not")
    .replace(/\bshould['’]?nt\b/g, "should not")
    .replace(/\bcould['’]?nt\b/g, "could not")
    .replace(/\bwould['’]?nt\b/g, "would not")
    .replace(/\bmust['’]?nt\b/g, "must not")
    .replace(/\b([a-z]+)n't\b/g, "$1 not")
    .replace(/\bim\b/g, "i am")
    .replace(/\byoure\b/g, "you are")
    .replace(/\btheyre\b/g, "they are")
    .replace(/\b(i)'m\b/g, "$1 am")
    .replace(/\b(you|we|they)'re\b/g, "$1 are")
    .replace(/\b(i|you|we|they)['’]?ve\b/g, "$1 have")
    .replace(/\byoull\b/g, "you will")
    .replace(/\btheyll\b/g, "they will")
    .replace(/\b(i|you|he|she|it|we|they)'ll\b/g, "$1 will")
    .replace(/\byoud\b/g, "you would")
    .replace(/\btheyd\b/g, "they would")
    .replace(/\b(i|you|he|she|it|we|they)'d\b/g, "$1 would")
    .replace(/\b([a-z]+)'re\b/g, "$1 are")
    .replace(/\b([a-z]+)'ve\b/g, "$1 have")
    .replace(/\b([a-z]+)'ll\b/g, "$1 will")
    .replace(/\b([a-z]+)'d\b/g, "$1 would")
    .replace(/\b(he|she|it|that|there|what|who|where|when|why|how)['’]?s\b/g, "$1 is")
    .replace(/\b([a-z]+)['’]s\b/g, "$1")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function contentTokens(value) {
  const stopWords = new Set([
    "a",
    "an",
    "the",
    "to",
    "of",
    "at",
    "in",
    "on",
    "for",
    "with",
    "is",
    "are",
    "am",
    "be",
    "was",
    "were",
    "do",
    "does",
    "did",
    "have",
    "has",
    "had",
    "will",
  ]);

  return value
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => !stopWords.has(token));
}

function f1Score(actualTokens, expectedTokens) {
  if (!actualTokens.length || !expectedTokens.length) return 0;

  const expectedCounts = new Map();
  expectedTokens.forEach((token) => expectedCounts.set(token, (expectedCounts.get(token) || 0) + 1));

  let matches = 0;
  actualTokens.forEach((token) => {
    const count = expectedCounts.get(token) || 0;
    if (count > 0) {
      matches += 1;
      expectedCounts.set(token, count - 1);
    }
  });

  const precision = matches / actualTokens.length;
  const recall = matches / expectedTokens.length;
  return precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
}

function stringSimilarity(a, b) {
  if (!a.length || !b.length) return 0;
  const distance = levenshteinDistance(a, b);
  return 1 - distance / Math.max(a.length, b.length);
}

function levenshteinDistance(a, b) {
  const previous = new Array(b.length + 1).fill(0).map((_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost,
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

function lcsLength(a, b) {
  const rows = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      rows[i][j] =
        a[i - 1] === b[j - 1]
          ? rows[i - 1][j - 1] + 1
          : Math.max(rows[i - 1][j], rows[i][j - 1]);
    }
  }

  return rows[a.length][b.length];
}

function setPlaybackState(isSpeaking) {
  state.isSpeaking = isSpeaking;
  const indicator = document.querySelector("#soundIndicator");
  if (indicator) {
    indicator.classList.toggle("active", isSpeaking);
  }
}

function stopSpeech() {
  speechRequestId += 1;
  if (supportsSpeechSynthesis()) {
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending || synth.paused) {
      synth.cancel();
    }
  }
  setPlaybackState(false);
}

async function speak(text, options = {}) {
  if (!supportsSpeechSynthesis()) return;

  const requestId = speechRequestId + 1;
  speechRequestId = requestId;
  const synth = window.speechSynthesis;
  if (options.immediate) {
    refreshVoices();
  } else {
    await waitForVoices();
    if (requestId !== speechRequestId) return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = VOICE_SPEEDS[state.voiceSpeed] || VOICE_SPEEDS.normal;
  utterance.pitch = 1;
  utterance.volume = 1;

  state.preferredVoice = choosePreferredVoice(refreshVoices());
  if (state.preferredVoice) {
    utterance.voice = state.preferredVoice;
  }

  utterance.onstart = () => {
    if (requestId === speechRequestId) {
      setPlaybackState(true);
    }
  };
  utterance.onend = () => {
    if (requestId === speechRequestId) {
      setPlaybackState(false);
    }
  };
  utterance.onerror = () => {
    if (requestId === speechRequestId) {
      setPlaybackState(false);
    }
  };

  const wasActive = Boolean(synth.speaking || synth.pending || synth.paused);
  if (wasActive) {
    synth.cancel();
  }
  setPlaybackState(true);
  const play = () => {
    if (requestId === speechRequestId) {
      synth.resume?.();
      synth.speak(utterance);
    }
  };

  if (!wasActive) {
    play();
    return;
  }

  window.setTimeout(play, 60);
}

function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function buildVocabularyQuizSets(sourceSets) {
  if (!Array.isArray(sourceSets) || !sourceSets.length) {
    return [];
  }

  return sourceSets
    .map((set) => ({
      id: set.id,
      label: set.label || set.shortLabel,
      shortLabel: set.shortLabel || set.label,
      level: set.level || set.shortLabel || set.label || "Vocabulary",
      words: dedupeVocabularyWords(set.words || []),
    }))
    .filter((set) => set.id && set.words.length);
}

function dedupeVocabularyWords(words) {
  const seen = new Set();
  return words.filter((word) => {
    const key = `${word.zh}::${word.pinyin}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function slugifyVocabularySetId(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildVocabularyPreviewRows(items, limit, options = {}) {
  const hiddenTranslation = options.hideTranslation || false;
  return items.slice(0, limit).map((item) => `
    <tr>
      <td class="chinese-text">${escapeHtml(item.zh)}</td>
      <td class="pinyin-slot muted-slot">Hidden during quiz</td>
      <td class="${hiddenTranslation ? "translation-hidden" : ""}">
        ${hiddenTranslation ? HIDDEN_TRANSLATION_LABEL : escapeHtml(formatVocabularyMeanings(item))}
      </td>
    </tr>
  `).join("");
}

function buildVocabularyQuizRows(session, options = {}) {
  const hiddenTranslation = options.hideTranslation || session.hideTranslations || false;
  const hiddenCharacter = options.hideCharacter || session.quizMode === "meaning";
  const currentId = getCurrentVocabularyRowId(session);
  return session.items.map((item, index) => {
    const id = vocabularyItemId(item, index);
    const answered = isVocabularyRowAnswered(session, index);
    const correct = isVocabularyRowCorrect(session, index);
    const current = !answered && id === currentId;
    const selectable = !answered;
    const justAnsweredCorrect = correct && session.lastCorrectItemIndex === index;
    const rowClasses = [
      answered ? (correct ? "found" : "missed") : "pending",
      current ? "current" : "",
      selectable ? "selectable" : "",
      justAnsweredCorrect ? "correct-celebration" : "",
    ].filter(Boolean).join(" ");
    const translationHidden = hiddenTranslation && !answered;
    const translationText = translationHidden
      ? HIDDEN_TRANSLATION_LABEL
      : formatVocabularyMeanings(item);
    const characterText = hiddenCharacter && !answered
      ? HIDDEN_TRANSLATION_LABEL
      : item.zh;
    const characterClass = [
      "vocab-character-cell",
      hiddenCharacter && !answered ? "muted-slot" : "chinese-text",
    ].filter(Boolean).join(" ");
    const characterMarkup = escapeHtml(characterText);
    const pinyinText = answered
      ? item.pinyin
      : "";
    const pinyinMarkup = answered ? buildToneColoredPinyinMarkup(pinyinText) : "";

    return `
      <tr
        class="${rowClasses}"
        data-vocab-id="${escapeHtml(id)}"
        data-vocab-index="${index}"
        ${selectable ? `tabindex="0"` : ""}
        ${current ? `aria-current="true" aria-selected="true"` : `aria-selected="false"`}
      >
        <td class="${characterClass}">${characterMarkup}</td>
        <td class="pinyin-slot">${pinyinMarkup}</td>
        <td class="translation-cell ${translationHidden ? "translation-hidden" : ""}">${escapeHtml(translationText)}</td>
      </tr>
    `;
  }).join("");
}

function getCurrentVocabularyRowId(session) {
  if (session?.type !== "vocabulary") {
    return "";
  }

  const selectedIndex = getSelectedVocabularyIndex(session);

  return selectedIndex >= 0
    ? vocabularyItemId(session.items[selectedIndex], selectedIndex)
    : "";
}

function findVocabularyGuessMatches(answer, session) {
  const normalizedAnswer = normalizePinyinForCompare(answer);
  if (!normalizedAnswer) {
    return [];
  }

  const selectedIndex = getSelectedVocabularyIndex(session);
  if (selectedIndex < 0) {
    return [];
  }

  const item = session.items[selectedIndex];
  const id = vocabularyItemId(item, selectedIndex);
  if (isVocabularyRowAnswered(session, selectedIndex) || !isAcceptedVocabularyPinyinGuess(normalizedAnswer, item)) {
    return [];
  }

  return [{ item, id, index: selectedIndex }];
}

function bindVocabularyRowSelectionHandlers(session) {
  document.querySelectorAll("[data-vocab-index]").forEach((row) => {
    const index = Number(row.dataset.vocabIndex);
    if (!Number.isInteger(index) || !isVocabularyRowPending(session, index)) {
      return;
    }

    row.addEventListener("click", () => selectVocabularyRow(index));
    row.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      selectVocabularyRow(index);
    });
  });
}

function selectVocabularyRow(index) {
  const session = state.session;
  if (session?.type !== "vocabulary" || !isVocabularyRowPending(session, index)) {
    return;
  }

  session.index = index;
  session.selectedVocabularyIndex = index;
  session.currentAssessment = null;

  if (session.quizMode === "meaning") {
    render();
    scrollVocabularyWordListToIndex(index);
    speak(session.items[index].zh, { immediate: true });
    return;
  }

  updateVocabularySessionMetrics(session);
  scrollVocabularyWordListToCurrentRow(session);
  focusVocabularyInput();
}

function selectNextVocabularyRowAfter(session, index) {
  const nextAfterIndex = getNextVocabularyUnansweredIndexAfter(session, index);
  const nextIndex = nextAfterIndex >= 0
    ? nextAfterIndex
    : getNextVocabularyUnansweredIndex(session);
  session.index = nextIndex >= 0 ? nextIndex : session.index;
  session.selectedVocabularyIndex = nextIndex >= 0 ? nextIndex : session.selectedVocabularyIndex;
  return nextIndex;
}

function getSelectedVocabularyIndex(session) {
  if (session?.type !== "vocabulary") {
    return -1;
  }

  const selectedIndex = Number.isInteger(session.selectedVocabularyIndex)
    ? session.selectedVocabularyIndex
    : session.index;

  if (isVocabularyRowPending(session, selectedIndex)) {
    return selectedIndex;
  }

  const nextAfterSelected = getNextVocabularyUnansweredIndexAfter(session, selectedIndex);
  return nextAfterSelected >= 0
    ? nextAfterSelected
    : getNextVocabularyUnansweredIndex(session);
}

function getNextVocabularyUnansweredIndex(session) {
  if (session?.type !== "vocabulary") {
    return -1;
  }

  return session.items.findIndex((_, index) => isVocabularyRowPending(session, index));
}

function getNextVocabularyUnansweredIndexAfter(session, index) {
  if (session?.type !== "vocabulary") {
    return -1;
  }

  for (let nextIndex = index + 1; nextIndex < session.items.length; nextIndex += 1) {
    if (isVocabularyRowPending(session, nextIndex)) {
      return nextIndex;
    }
  }

  return -1;
}

function isVocabularyRowPending(session, index) {
  return !isVocabularyRowAnswered(session, index);
}

function isVocabularyRowAnswered(session, index) {
  if (session?.type !== "vocabulary" || index < 0 || index >= session.items.length) {
    return false;
  }

  if (session.quizMode === "pinyin") {
    const id = vocabularyItemId(session.items[index], index);
    return session.foundIds.has(id) || ensureVocabularyMissedIds(session).has(id);
  }

  return session.answers.some((answer) => answer.itemIndex === index);
}

function isVocabularyRowCorrect(session, index) {
  if (session?.type !== "vocabulary" || index < 0 || index >= session.items.length) {
    return false;
  }

  if (session.quizMode === "pinyin") {
    return session.foundIds.has(vocabularyItemId(session.items[index], index));
  }

  return session.answers.some((answer) => answer.itemIndex === index && answer.correct);
}

function ensureVocabularyMissedIds(session) {
  if (!(session?.missedIds instanceof Set)) {
    session.missedIds = new Set(session?.missedIds || []);
  }
  return session.missedIds;
}

function focusVocabularyInput() {
  if (isTouchLikeDevice()) {
    return;
  }

  const input = document.querySelector("#vocabularyGuess") || document.querySelector("#answerInput");
  input?.focus?.();
}

function isAcceptedVocabularyPinyinGuess(normalizedAnswer, item) {
  const compactAnswer = compactPinyin(normalizedAnswer);
  const toneFreeAnswer = stripPinyinTones(normalizedAnswer);
  const compactToneFreeAnswer = compactPinyin(toneFreeAnswer);
  const plainAnswer = stripPinyinToneAndUmlautMarks(normalizedAnswer);
  const compactPlainAnswer = compactPinyin(plainAnswer);

  return getNormalizedVocabularyPinyinVariants(item)
    .some((expected) => {
      const compactExpected = compactPinyin(expected);
      const toneFreeExpected = stripPinyinTones(expected);
      const compactToneFreeExpected = compactPinyin(toneFreeExpected);
      const plainExpected = stripPinyinToneAndUmlautMarks(expected);
      const compactPlainExpected = compactPinyin(plainExpected);

      return normalizedAnswer === expected ||
        compactAnswer === compactExpected ||
        toneFreeAnswer === toneFreeExpected ||
        compactToneFreeAnswer === compactToneFreeExpected ||
        plainAnswer === plainExpected ||
        compactPlainAnswer === compactPlainExpected;
    });
}

function vocabularyItemId(item, index) {
  return `${index}:${item.zh}:${item.pinyin}`;
}

function determineVocabularyTimeLimit(wordCount) {
  if (!wordCount) {
    return VOCABULARY_MIN_TIMER_SECONDS;
  }

  return Math.max(
    VOCABULARY_MIN_TIMER_SECONDS,
    Math.ceil((wordCount * VOCABULARY_SECONDS_PER_WORD) / 60) * 60,
  );
}

function getVocabularyRemainingSeconds(session) {
  if (!session?.endsAt) {
    return 0;
  }

  return Math.max(0, Math.ceil((session.endsAt - Date.now()) / 1000));
}

function formatTimer(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function startVocabularyTimer() {
  if (vocabularyTimerId || state.session?.type !== "vocabulary") {
    return;
  }

  vocabularyTimerId = window.setInterval(() => {
    const session = state.session;
    if (session?.type !== "vocabulary") {
      stopVocabularyTimer();
      return;
    }

    if (getVocabularyRemainingSeconds(session) <= 0) {
      finishVocabularySession("time");
      return;
    }

    updateVocabularySessionMetrics(session);
  }, 250);
}

function stopVocabularyTimer() {
  if (!vocabularyTimerId) {
    return;
  }

  window.clearInterval(vocabularyTimerId);
  vocabularyTimerId = 0;
}

function updateVocabularySessionMetrics(session) {
  const total = session.items.length;
  const found = session.quizMode === "pinyin"
    ? session.foundIds.size
    : session.answers.filter((answer) => answer.correct).length;
  const progressCount = session.quizMode === "pinyin"
    ? getVocabularyPinyinAnsweredCount(session)
    : session.answers.length;
  const score = document.querySelector("#vocabularyScore");
  const timer = document.querySelector("#vocabularyTimer");
  const progress = document.querySelector("#vocabularyProgress");
  const tableSection = document.querySelector(".vocab-section-heading span");
  const tableSectionText = session.quizMode === "pinyin"
    ? formatVocabularyPinyinProgressText(session)
    : `${session.answers.length} answered, ${total - session.answers.length} left`;

  if (score) {
    score.textContent = `${found}/${total}`;
  }
  if (timer) {
    timer.textContent = formatTimer(getVocabularyRemainingSeconds(session));
  }
  if (progress) {
    progress.style.width = `${Math.round((progressCount / total) * 100)}%`;
  }
  if (tableSection) {
    tableSection.textContent = tableSectionText;
  }

  if (session.quizMode !== "pinyin") {
    return;
  }

  updateVocabularyCurrentWordMarkup(session);

  const currentId = getCurrentVocabularyRowId(session);
  session.items.forEach((item, index) => {
    const id = vocabularyItemId(item, index);
    const row = document.querySelector(`tr[data-vocab-id="${cssEscape(id)}"]`);
    if (!row) {
      return;
    }

    const isAnswered = isVocabularyRowAnswered(session, index);
    const isCorrect = isVocabularyRowCorrect(session, index);
    const isCurrent = !isAnswered && id === currentId;
    row.classList.toggle("found", isAnswered && isCorrect);
    row.classList.toggle("missed", isAnswered && !isCorrect);
    row.classList.toggle("pending", !isAnswered);
    row.classList.toggle("current", isCurrent);
    row.classList.toggle("selectable", !isAnswered);
    row.classList.toggle("correct-celebration", isAnswered && isCorrect && session.lastCorrectItemIndex === index);
    if (isCurrent) {
      row.setAttribute("aria-current", "true");
      row.setAttribute("aria-selected", "true");
    } else {
      row.removeAttribute("aria-current");
      row.setAttribute("aria-selected", "false");
    }
    if (isAnswered) {
      row.removeAttribute("tabindex");
    } else {
      row.setAttribute("tabindex", "0");
    }

    const pinyinCell = row.querySelector(".pinyin-slot");
    if (pinyinCell) {
      pinyinCell.innerHTML = isAnswered ? buildToneColoredPinyinMarkup(item.pinyin) : "";
    }

    const translationCell = row.querySelector(".translation-cell");
    if (translationCell) {
      const translationHidden = session.hideTranslations && !isAnswered;
      translationCell.classList.toggle("translation-hidden", translationHidden);
      translationCell.textContent = translationHidden
        ? HIDDEN_TRANSLATION_LABEL
        : formatVocabularyMeanings(item);
    }
  });
}

function updateVocabularyCurrentWordMarkup(session) {
  const label = document.querySelector("#mobileCurrentWordLabel");
  const word = document.querySelector("#mobileCurrentWordText");
  if (!label || !word) {
    return;
  }

  const index = getSelectedVocabularyIndex(session);
  const item = index >= 0 ? session.items[index] : null;
  label.textContent = index >= 0
    ? `Row ${index + 1} of ${session.items.length}`
    : "No row selected";
  word.textContent = item?.zh || "";
}

function getVocabularyPinyinAnsweredCount(session) {
  if (session?.type !== "vocabulary" || session.quizMode !== "pinyin") {
    return 0;
  }

  return new Set([
    ...session.foundIds,
    ...ensureVocabularyMissedIds(session),
  ]).size;
}

function getVocabularyPinyinMissedCount(session) {
  if (session?.type !== "vocabulary" || session.quizMode !== "pinyin") {
    return 0;
  }

  return ensureVocabularyMissedIds(session).size;
}

function formatVocabularyPinyinProgressText(session) {
  const found = session.foundIds.size;
  const missed = getVocabularyPinyinMissedCount(session);
  const left = Math.max(0, session.items.length - getVocabularyPinyinAnsweredCount(session));

  if (!missed) {
    return `${found} correct, ${left} left`;
  }

  return `${found} correct, ${missed} wrong, ${left} left`;
}

function cssEscape(value) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }

  return String(value).replace(/["\\]/g, "\\$&");
}

function getFilteredPool() {
  hydrateSentenceDataFromWindow();
  return SENTENCES.filter((item) => state.selectedLevels.has(item.level));
}

function getPronunciationPool() {
  return getFilteredPool().filter((item) => {
    const hanCount = countHanCharacters(item.zh);
    return hanCount > 0 && hanCount <= PRONUNCIATION_MAX_HAN_LENGTH;
  });
}

function getSelectedPronunciationSentenceCount() {
  hydrateSentenceDataFromWindow();
  return sentenceDataLoaded ? getPronunciationPool().length : getSelectedSentenceCount();
}

function getSelectedSentenceCount() {
  return [...state.selectedLevels].reduce((total, level) => total + (SENTENCE_COUNTS[level] || 0), 0);
}

function selectedLevelLabels(levelIds = [...state.selectedLevels]) {
  return levelIds.map(selectedLevelLabel).join(", ");
}

function selectedLevelLabel(levelId) {
  return LEVELS.find((level) => level.id === levelId)?.label || levelId;
}

function getSelectedVocabularySet() {
  return VOCABULARY_QUIZ_SETS.find((set) => set.id === state.vocabularySetId) || VOCABULARY_QUIZ_SETS[0] || null;
}

function shuffle(items) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function containsChinese(value) {
  return [...String(value)].some(isChineseCharacter);
}

function countHanCharacters(value) {
  return [...String(value)].filter(isChineseCharacter).length;
}

function isChineseText(value) {
  return [...String(value)].every(isChineseCharacter);
}

function isChineseCharacter(value) {
  return HAN_CHARACTER_PATTERN.test(value);
}

function splitPinyinSyllables(value) {
  return String(value).trim().split(/\s+/).filter(Boolean);
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
}

function isTouchLikeDevice() {
  return window.matchMedia?.("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
