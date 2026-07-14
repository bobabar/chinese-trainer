"use strict";

const SESSION_LENGTH = 30;
const PRONUNCIATION_SESSION_LENGTH = 15;
const PRONUNCIATION_MAX_HAN_LENGTH = 12;
const REVIEW_SESSION_LENGTH = 12;
const DASHBOARD_DAILY_GOAL = 3;
const DASHBOARD_WEEK_DAYS = 7;
const PROGRESS_ACTIVITY_DAYS = 28;
const PROGRESS_RECENT_SESSION_LIMIT = 20;
const PROGRESS_MISTAKE_LIMIT = 6;
const SETTINGS_KEY = "chineseTrainerSettings";
const SETTINGS_VERSION = 2;
const HISTORY_KEY = "chineseTrainerHistory";
const REVIEW_PROGRESS_KEY = "chineseTrainerReviewProgress";
const SAVED_VOCABULARY_KEY = "chineseTrainerSavedVocabulary";
const SAVED_SENTENCES_KEY = "chineseTrainerSavedSentences";
const HISTORY_LIMIT = 100;
const SUPPORTED_HISTORY_TYPES = new Set(["drill", "vocabulary", "review", "pronunciation", "map"]);
const REVIEW_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30, 60];
const DAY_IN_MS = 24 * 60 * 60 * 1000;

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
const SENTENCE_LIBRARY_PAGE_SIZE = 40;
const DRILL_VIEWS = new Set(["practice", "library"]);

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
  dashboard: {
    label: "Today",
  },
  vocabulary: {
    label: "Vocabulary Quiz",
  },
  review: {
    label: "Daily Review",
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
const VOCABULARY_LIBRARY_PAGE_SIZE = 80;
const VOCABULARY_VIEWS = new Set(["quiz", "library", "path"]);
const HIDDEN_TRANSLATION_LABEL = "Hidden";
const MDBG_WORD_DICTIONARY_URL = "https://www.mdbg.net/chinese/dictionary";
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
const sentencePinyinSearchCache = new Map();
const PRONUNCIATION_SILENCE_GRACE_MS = 3000;
const PRONUNCIATION_MANUAL_STOP_GRACE_MS = 900;
const PRONUNCIATION_RESTART_DELAY_MS = 160;
const PRONUNCIATION_MAX_RECORDING_MS = 20000;
const PRONUNCIATION_TERMINAL_ERRORS = new Set([
  "audio-capture",
  "language-not-supported",
  "not-allowed",
  "service-not-allowed",
]);
const CHINA_SMALL_REGION_SELECTORS = [
  {
    provinceId: "hongkong",
    selectorX: 696,
    selectorY: 538,
    curveX: 660,
    curveY: 536,
  },
  {
    provinceId: "macao",
    selectorX: 648,
    selectorY: 604,
    curveX: 635,
    curveY: 578,
  },
];
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
  tool: "dashboard",
  mode: "reading",
  drillView: "practice",
  sentenceLibraryQuery: "",
  sentenceLibrarySavedOnly: false,
  sentenceLibraryShowPinyin: true,
  sentenceLibraryVisibleCount: SENTENCE_LIBRARY_PAGE_SIZE,
  vocabularyMode: "pinyin",
  vocabularyView: "quiz",
  vocabularySetId: VOCABULARY_QUIZ_SETS[0]?.id || "",
  vocabularyOrder: DEFAULT_VOCABULARY_ORDER,
  vocabularyHideTranslations: false,
  vocabularyLibraryQuery: "",
  vocabularyLibraryLevel: "all",
  vocabularyLibraryStatus: "all",
  vocabularyLibraryVisibleCount: VOCABULARY_LIBRARY_PAGE_SIZE,
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
    if (saved.mode && MODES[saved.mode]) {
      state.mode = saved.mode;
    }
    if (DRILL_VIEWS.has(saved.drillView)) {
      state.drillView = saved.drillView;
    }
    if (typeof saved.sentenceLibraryShowPinyin === "boolean") {
      state.sentenceLibraryShowPinyin = saved.sentenceLibraryShowPinyin;
    }
    if (saved.vocabularyMode && VOCABULARY_MODES[saved.vocabularyMode]) {
      state.vocabularyMode = saved.vocabularyMode;
    }
    if (VOCABULARY_VIEWS.has(saved.vocabularyView)) {
      state.vocabularyView = saved.vocabularyView;
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
        mode: state.mode,
        drillView: state.drillView,
        sentenceLibraryShowPinyin: state.sentenceLibraryShowPinyin,
        vocabularyMode: state.vocabularyMode,
        vocabularyView: state.vocabularyView,
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

  document.querySelectorAll(".mode-tab[data-mode]").forEach((button) => {
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

  if (isReviewChoiceShortcut(event)) {
    event.preventDefault();
    submitReviewChoiceByShortcut(event.key);
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

  if (state.session.type === "review") {
    const current = state.session.items[state.session.index];
    if (current?.reviewMode === "pinyin") {
      const input = document.querySelector("#reviewAnswer");
      if (input) {
        submitReviewPinyin(input.value);
      }
    }
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

  if (session?.type === "review") {
    return session.items?.[session.index]?.reviewMode === "meaning";
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

function isReviewChoiceShortcut(event) {
  const current = state.session?.items?.[state.session.index];
  return state.session?.type === "review" &&
    current?.reviewMode === "meaning" &&
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
    } else if (state.result.type === "review") {
      renderReviewResults();
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
  if (state.tool === "dashboard") {
    renderDashboardHome();
    return;
  }

  if (state.tool === "history") {
    renderHistoryHome();
    return;
  }

  if (state.tool === "vocabulary") {
    renderVocabularyHome();
    return;
  }

  if (state.tool === "review") {
    renderReviewHome();
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
  document.querySelectorAll(".vocabulary-quiz-only").forEach((element) => {
    element.hidden = state.tool !== "vocabulary" || state.vocabularyView !== "quiz";
  });
  document.querySelectorAll(".tool-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === state.tool);
  });
  document.querySelectorAll(".mode-tab[data-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
  document.querySelectorAll("[data-vocabulary-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.vocabularyMode === state.vocabularyMode);
  });
  document.body.dataset.vocabularyView = state.vocabularyView;
  document.body.dataset.drillView = state.drillView;
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

function renderDashboardHome() {
  const dashboard = getDashboardData();
  const nextActivity = dashboard.nextActivity;
  const goalComplete = dashboard.completedCount >= DASHBOARD_DAILY_GOAL;
  const goalAngle = Math.round(dashboard.goalProgress * 3.6);
  const planRows = dashboard.plan.map((activity, index) => {
    const statusLabel = activity.completed
      ? "Complete"
      : activity.id === nextActivity.id
        ? "Next"
        : "Later";
    return `
      <div class="dashboard-plan-row ${activity.completed ? "is-complete" : ""} ${activity.id === nextActivity.id ? "is-next" : ""}">
        <span class="dashboard-plan-index" aria-hidden="true">${activity.completed ? "✓" : index + 1}</span>
        <div class="dashboard-plan-copy">
          <strong>${escapeHtml(activity.title)}</strong>
          <span>${escapeHtml(activity.detail)}</span>
        </div>
        <span class="dashboard-plan-status">${statusLabel}</span>
        <button
          class="ghost-btn dashboard-plan-button"
          type="button"
          data-dashboard-start="${escapeHtml(activity.tool)}"
          data-dashboard-mode="${escapeHtml(activity.mode || "")}">
          ${activity.completed ? "Repeat" : "Start"}
        </button>
      </div>
    `;
  }).join("");
  const pronunciationMetric = dashboard.pronunciationAccuracy === null
    ? "Not yet"
    : `${Math.round(dashboard.pronunciationAccuracy * 100)}%`;

  app.innerHTML = `
    <section class="workspace-panel dashboard-panel">
      <header class="dashboard-hero">
        <div class="dashboard-hero-copy">
          <p class="dashboard-date">${escapeHtml(formatDashboardDate(dashboard.now))}</p>
          <h2>${escapeHtml(getDashboardGreeting(dashboard.now))}</h2>
          <p>${goalComplete
            ? "Your daily plan is complete. Extra practice now will strengthen what you learned."
            : "A focused plan built from your vocabulary schedule and recent practice."}</p>
          <button
            class="primary-btn shortcut-btn dashboard-primary"
            type="button"
            data-dashboard-start="${escapeHtml(nextActivity.tool)}"
            data-dashboard-mode="${escapeHtml(nextActivity.mode || "")}">
            <span>${goalComplete ? `Practice ${nextActivity.title}` : `Continue: ${nextActivity.title}`}</span>
            ${shortcutHint("Enter")}
          </button>
        </div>
        <div class="dashboard-goal" aria-label="${dashboard.completedCount} of ${DASHBOARD_DAILY_GOAL} daily activities complete">
          <div class="dashboard-goal-ring" style="--dashboard-goal-angle: ${goalAngle}deg">
            <strong>${dashboard.completedCount}/${DASHBOARD_DAILY_GOAL}</strong>
          </div>
          <div>
            <strong>Daily goal</strong>
            <span>${dashboard.practiceStreak} day streak</span>
          </div>
        </div>
      </header>

      <div class="dashboard-main-grid">
        <section class="dashboard-section dashboard-plan" aria-labelledby="dashboardPlanHeading">
          <div class="dashboard-section-heading">
            <div>
              <h3 id="dashboardPlanHeading">Today&rsquo;s plan</h3>
              <p>Three complete sessions make a focused study day.</p>
            </div>
            <strong>${dashboard.completedCount} of ${DASHBOARD_DAILY_GOAL}</strong>
          </div>
          <div class="dashboard-plan-list">${planRows}</div>
        </section>

        <section class="dashboard-section dashboard-snapshot" aria-labelledby="dashboardSnapshotHeading">
          <div class="dashboard-section-heading">
            <div>
              <h3 id="dashboardSnapshotHeading">Learning snapshot</h3>
              <p>Progress stored in this browser.</p>
            </div>
          </div>
          <dl class="dashboard-metric-list">
            <div><dt>Words in review</dt><dd>${dashboard.review.totalTracked}</dd></div>
            <div><dt>Strong vocabulary</dt><dd>${dashboard.review.strongCount}</dd></div>
            <div><dt>Pronunciation average</dt><dd>${pronunciationMetric}</dd></div>
            <div><dt>Sessions this week</dt><dd>${dashboard.sessionsThisWeek}</dd></div>
          </dl>
          <div class="dashboard-focus">
            <span>Focus next</span>
            <strong>${escapeHtml(dashboard.focus.title)}</strong>
            <p>${escapeHtml(dashboard.focus.detail)}</p>
            <button
              class="secondary-btn dashboard-focus-button"
              type="button"
              data-dashboard-start="${escapeHtml(dashboard.focus.tool)}"
              data-dashboard-mode="${escapeHtml(dashboard.focus.mode || "")}">
              Practice now
            </button>
          </div>
        </section>
      </div>

      <section class="dashboard-week" aria-labelledby="dashboardWeekHeading">
        <div class="dashboard-section-heading">
          <div>
            <h3 id="dashboardWeekHeading">Last seven days</h3>
            <p>${dashboard.sessionsThisWeek ? `${dashboard.sessionsThisWeek} saved sessions across your tools.` : "Complete a session to begin your activity record."}</p>
          </div>
          <span>${dashboard.todaySessionCount} today</span>
        </div>
        ${buildDashboardWeekMarkup(dashboard.week)}
      </section>
    </section>
  `;

  document.querySelectorAll("[data-dashboard-start]").forEach((button) => {
    button.addEventListener("click", () => {
      launchDashboardActivity(button.dataset.dashboardStart, button.dataset.dashboardMode || "");
    });
  });
}

function getDashboardData(now = Date.now(), history = loadHistoryRecords()) {
  const review = getReviewDashboardData(now);
  const plan = buildDashboardPlan(history, review, now);
  const completedCount = plan.filter((activity) => activity.completed).length;
  const week = getDashboardWeek(history, now);
  const todayKey = localDateKey(now);

  return {
    now,
    review,
    plan,
    completedCount,
    goalProgress: Math.min(100, Math.round((completedCount / DASHBOARD_DAILY_GOAL) * 100)),
    nextActivity: plan.find((activity) => !activity.completed) || plan[0],
    practiceStreak: getPracticeStreakDays(history, now),
    week,
    sessionsThisWeek: week.reduce((sum, day) => sum + day.count, 0),
    todaySessionCount: history.filter((record) => localDateKey(Date.parse(record.completedAt)) === todayKey).length,
    pronunciationAccuracy: getDashboardPronunciationAccuracy(history),
    focus: getDashboardFocusInsight(history, review),
  };
}

function buildDashboardPlan(history, review, now = Date.now()) {
  const todayKey = localDateKey(now);
  const completedTypes = new Set(
    history
      .filter((record) =>
        localDateKey(Date.parse(record.completedAt)) === todayKey && isDashboardPlanRecordComplete(record),
      )
      .map((record) => record.type),
  );
  const drillMode = getRecommendedDrillMode(history);
  const drillLabel = MODES[drillMode]?.label || "Reading";
  const reviewDetail = review.dueCount
    ? `${review.dueCount} due ${review.dueCount === 1 ? "word" : "words"} · mixed pinyin and listening`
    : review.totalTracked
      ? "12-word retrieval practice to maintain recall"
      : "Build your adaptive HSK vocabulary baseline";

  return [
    {
      id: "review",
      tool: "review",
      title: "Daily vocabulary review",
      detail: reviewDetail,
      completed: completedTypes.has("review"),
    },
    {
      id: "pronunciation",
      tool: "pronunciation",
      title: "Pronunciation practice",
      detail: "15 short sentences with word-level feedback",
      completed: completedTypes.has("pronunciation"),
    },
    {
      id: "drill",
      tool: "drill",
      mode: drillMode,
      title: `${drillLabel} sentence drill`,
      detail: "30 sentences at your selected difficulty",
      completed: completedTypes.has("drill"),
    },
  ];
}

function isDashboardPlanRecordComplete(record) {
  const total = Number(record?.total) || 0;
  if (record?.type === "review") {
    return total >= REVIEW_SESSION_LENGTH;
  }
  if (record?.type === "pronunciation") {
    return total >= PRONUNCIATION_SESSION_LENGTH;
  }
  if (record?.type === "drill") {
    return total >= SESSION_LENGTH;
  }
  return false;
}

function getRecommendedDrillMode(history) {
  const modeOrder = ["reading", "writing", "listening"];
  const stats = modeOrder.map((mode) => {
    const records = history.filter((record) => record.type === "drill" && record.mode === mode);
    const total = records.reduce((sum, record) => sum + (Number(record.total) || 0), 0);
    const correct = records.reduce((sum, record) => sum + (Number(record.correct) || 0), 0);
    return {
      mode,
      sessions: records.length,
      accuracy: total ? correct / total : null,
    };
  });
  const unpracticed = stats.find((item) => !item.sessions);
  if (unpracticed) {
    return unpracticed.mode;
  }
  return stats.sort((a, b) => a.accuracy - b.accuracy || a.sessions - b.sessions)[0].mode;
}

function getPracticeStreakDays(history, now = Date.now()) {
  const activeDays = new Set(
    history
      .map((record) => localDateKey(Date.parse(record.completedAt)))
      .filter(Boolean),
  );
  if (!activeDays.size) {
    return 0;
  }

  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (!activeDays.has(localDateKey(cursor.getTime()))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (activeDays.has(localDateKey(cursor.getTime()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function getDashboardWeek(history, now = Date.now()) {
  const days = [];
  const cursor = new Date(now);
  cursor.setHours(12, 0, 0, 0);

  for (let offset = DASHBOARD_WEEK_DAYS - 1; offset >= 0; offset -= 1) {
    const date = new Date(cursor);
    date.setDate(cursor.getDate() - offset);
    const dateKey = localDateKey(date.getTime());
    const count = history.filter((record) => localDateKey(Date.parse(record.completedAt)) === dateKey).length;
    days.push({
      dateKey,
      count,
      label: offset === 0 ? "Today" : date.toLocaleDateString(undefined, { weekday: "short" }),
    });
  }

  return days;
}

function getDashboardPronunciationAccuracy(history) {
  const records = history.filter((record) => record.type === "pronunciation" && Number(record.total) > 0).slice(0, 5);
  const total = records.reduce((sum, record) => sum + (Number(record.total) || 0), 0);
  if (!total) {
    return null;
  }
  return records.reduce(
    (sum, record) => sum + (Number(record.averageScore) || 0) * (Number(record.total) || 0),
    0,
  ) / total;
}

function getDashboardFocusInsight(history, review) {
  if (review.dueCount) {
    return {
      title: `${review.dueCount} vocabulary ${review.dueCount === 1 ? "word is" : "words are"} due`,
      detail: "Retrieval practice is most effective when the scheduled words are reviewed on time.",
      tool: "review",
    };
  }

  const weaknessCounts = new Map();
  history
    .filter((record) => record.type === "pronunciation")
    .slice(0, 5)
    .forEach((record) => {
      [
        ["tone", record.weaknesses?.tones || []],
        ["initial", record.weaknesses?.initials || []],
        ["final", record.weaknesses?.finals || []],
      ].forEach(([kind, items]) => {
        items.forEach((item) => {
          const key = `${kind}:${item.label}`;
          const current = weaknessCounts.get(key) || { kind, label: item.label, count: 0 };
          current.count += Number(item.count) || 0;
          weaknessCounts.set(key, current);
        });
      });
    });
  const pronunciationFocus = [...weaknessCounts.values()]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))[0];
  if (pronunciationFocus) {
    return {
      title: `Pronunciation focus: ${pronunciationFocus.label}`,
      detail: `This ${pronunciationFocus.kind} appears most often in words the browser did not recognize.`,
      tool: "pronunciation",
    };
  }

  const drillRecords = history.filter((record) => record.type === "drill" && Number(record.total) > 0);
  if (drillRecords.length) {
    const mode = getRecommendedDrillMode(history);
    return {
      title: `${MODES[mode]?.label || "Sentence"} needs attention`,
      detail: "This is your least-practiced or lowest-scoring sentence mode.",
      tool: "drill",
      mode,
    };
  }

  return {
    title: "Build your learning baseline",
    detail: "Start with adaptive vocabulary review so future practice can respond to your results.",
    tool: "review",
  };
}

function buildDashboardWeekMarkup(days) {
  const maxCount = Math.max(1, ...days.map((day) => day.count));
  return `
    <div class="dashboard-week-chart" role="img" aria-label="Saved sessions over the last seven days">
      ${days.map((day) => {
        const height = day.count ? Math.max(16, Math.round((day.count / maxCount) * 100)) : 4;
        return `
          <div class="dashboard-week-day" aria-label="${escapeHtml(day.label)}: ${day.count} ${day.count === 1 ? "session" : "sessions"}">
            <span>${day.count || ""}</span>
            <div><i style="height: ${height}%"></i></div>
            <strong>${escapeHtml(day.label)}</strong>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function formatDashboardDate(now = Date.now()) {
  return new Date(now).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getDashboardGreeting(now = Date.now()) {
  const hour = new Date(now).getHours();
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 18) {
    return "Good afternoon";
  }
  return "Good evening";
}

function launchDashboardActivity(tool, mode = "") {
  if (!TOOLS[tool] || tool === "dashboard") {
    return;
  }

  stopPronunciationRecognition();
  stopSpeech();
  state.tool = tool;
  state.session = null;
  state.result = null;
  state.dataError = "";
  if (tool === "drill" && MODES[mode]) {
    state.mode = mode;
    state.drillView = "practice";
  }
  saveSettings();

  if (tool === "review") {
    startReviewSession();
  } else if (tool === "pronunciation") {
    startPronunciationSession();
  } else if (tool === "drill") {
    startSession();
  } else {
    render();
  }

  window.setTimeout(() => window.scrollTo?.({ top: 0, left: 0, behavior: "auto" }), 0);
}

function renderModeHome() {
  if (state.drillView === "library") {
    renderSentenceLibrary();
    return;
  }

  const mode = MODES[state.mode];
  const preview = PREVIEW_CELLS[state.mode];
  const hasEnoughSentences = getSelectedSentenceCount() >= SESSION_LENGTH;
  const startLabel = state.isLoadingSentences ? "Loading sentence bank..." : "Start 30-sentence session";

  app.innerHTML = `
    <section class="workspace-panel">
      ${buildDrillViewSwitcher()}
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

  bindDrillViewSwitcher();
  document.querySelector("#startSession").addEventListener("click", startSession);
}

function buildDrillViewSwitcher() {
  return `
    <nav class="drill-view-switcher" aria-label="Sentence drill view">
      <button class="${state.drillView === "practice" ? "active" : ""}" type="button" data-drill-view="practice">Practice</button>
      <button class="${state.drillView === "library" ? "active" : ""}" type="button" data-drill-view="library">Sentence Library</button>
    </nav>
  `;
}

function bindDrillViewSwitcher() {
  document.querySelectorAll(".drill-view-switcher button[data-drill-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextView = button.dataset.drillView;
      if (!DRILL_VIEWS.has(nextView) || nextView === state.drillView) {
        return;
      }
      state.drillView = nextView;
      state.sentenceLibraryVisibleCount = SENTENCE_LIBRARY_PAGE_SIZE;
      state.dataError = "";
      saveSettings();
      render();
    });
  });
}

function renderSentenceLibrary() {
  const resourcesReady = sentenceDataLoaded && wordDataLoaded;
  const savedIds = loadSavedSentenceIds();
  const validSavedCount = resourcesReady
    ? getSavedSentenceItems(SENTENCES, savedIds, state.selectedLevels).length
    : savedIds.size;

  if (!resourcesReady) {
    app.innerHTML = `
      <section class="workspace-panel sentence-library">
        ${buildDrillViewSwitcher()}
        <div class="mode-heading sentence-library-heading">
          <div>
            <h2>Sentence Library</h2>
            <p>Search 1,800 sourced Chinese examples, inspect their pinyin and meanings, and save useful sentences for practice.</p>
          </div>
          <button class="primary-btn sentence-library-practice-btn" type="button" disabled>Practice saved in ${escapeHtml(MODES[state.mode].label)}${validSavedCount ? ` (${validSavedCount})` : ""}</button>
        </div>
        <div class="sentence-library-loading" role="status">
          <strong>${state.dataError ? "Sentence library unavailable" : "Loading sentence library"}</strong>
          <p>${state.dataError ? escapeHtml(state.dataError) : "Preparing sentences, pinyin, and word annotations."}</p>
          ${state.dataError ? `<button class="secondary-btn" type="button" id="retrySentenceLibrary">Retry</button>` : ""}
        </div>
      </section>
    `;
    bindDrillViewSwitcher();
    document.querySelector("#retrySentenceLibrary")?.addEventListener("click", () => {
      state.dataError = "";
      loadSentenceLibraryResources();
    });
    if (!state.isLoadingSentences && !state.dataError) {
      loadSentenceLibraryResources();
    }
    return;
  }

  const filteredItems = filterSentenceLibraryItems(SENTENCES, {
    query: state.sentenceLibraryQuery,
    levels: state.selectedLevels,
    savedOnly: state.sentenceLibrarySavedOnly,
    savedIds,
  });
  const visibleItems = filteredItems.slice(0, state.sentenceLibraryVisibleCount);
  const itemById = new Map(SENTENCES.map((item) => [sentenceItemKey(item), item]));

  app.innerHTML = `
    <section class="workspace-panel sentence-library">
      ${buildDrillViewSwitcher()}
      <div class="mode-heading sentence-library-heading">
        <div>
          <h2>Sentence Library</h2>
          <p>Search 1,800 sourced Chinese examples, inspect their pinyin and meanings, and save useful sentences for practice.</p>
        </div>
        <button class="primary-btn sentence-library-practice-btn" type="button" id="practiceSavedSentences" ${validSavedCount ? "" : "disabled"}>
          Practice saved in ${escapeHtml(MODES[state.mode].label)}${validSavedCount ? ` (${validSavedCount})` : ""}
        </button>
      </div>

      <form class="sentence-library-toolbar" id="sentenceLibrarySearch" role="search">
        <div class="field sentence-library-search-field">
          <label for="sentenceLibraryQuery">Search sentences</label>
          <span class="vocabulary-search-input-wrap">
            ${searchIconMarkup()}
            <input
              id="sentenceLibraryQuery"
              type="search"
              autocomplete="off"
              spellcheck="false"
              placeholder="Chinese, pinyin, or English"
              value="${escapeHtml(state.sentenceLibraryQuery)}"
            >
            ${state.sentenceLibraryQuery ? `
              <button class="icon-btn vocabulary-search-clear" type="button" id="clearSentenceLibrarySearch" aria-label="Clear search" title="Clear search">
                ${closeIconMarkup()}
              </button>
            ` : ""}
          </span>
        </div>
        <label class="sentence-library-toggle">
          <input type="checkbox" id="sentenceLibrarySavedOnly" ${state.sentenceLibrarySavedOnly ? "checked" : ""}>
          <span>Saved only</span>
        </label>
        <label class="sentence-library-toggle">
          <input type="checkbox" id="sentenceLibraryShowPinyin" ${state.sentenceLibraryShowPinyin ? "checked" : ""}>
          <span>Show pinyin</span>
        </label>
      </form>

      <div class="sentence-library-summary">
        <strong>${filteredItems.length}</strong>
        <span>${filteredItems.length === 1 ? "sentence" : "sentences"}</span>
        <span>· ${escapeHtml(selectedLevelLabels())}</span>
        ${state.sentenceLibraryQuery ? `<span>· matching &ldquo;${escapeHtml(state.sentenceLibraryQuery)}&rdquo;</span>` : ""}
      </div>

      ${visibleItems.length ? `
        <div class="sentence-library-list" aria-label="Chinese sentence examples">
          ${visibleItems.map((item) => buildSentenceLibraryRow(item, {
            saved: savedIds.has(sentenceItemKey(item)),
            showPinyin: state.sentenceLibraryShowPinyin,
          })).join("")}
        </div>
        ${visibleItems.length < filteredItems.length ? `
          <button class="secondary-btn sentence-library-more" type="button" id="loadMoreSentences">
            Show ${Math.min(SENTENCE_LIBRARY_PAGE_SIZE, filteredItems.length - visibleItems.length)} more
          </button>
        ` : ""}
      ` : `
        <div class="sentence-library-empty">
          <strong>No matching sentences</strong>
          <p>Try another phrase, change the difficulty filter in Options, or turn off Saved only.</p>
        </div>
      `}
    </section>
  `;

  bindDrillViewSwitcher();
  bindSentenceLibraryInteractions(itemById);
}

async function loadSentenceLibraryResources() {
  if (state.isLoadingSentences) {
    return;
  }
  state.isLoadingSentences = true;
  state.dataError = "";
  try {
    await Promise.all([ensureSentenceData(), ensureWordData()]);
  } catch {
    state.dataError = "The sentence and word data could not be loaded. Check your connection and try again.";
  }
  state.isLoadingSentences = false;
  if (state.tool === "drill" && state.drillView === "library") {
    render();
  }
}

function filterSentenceLibraryItems(items, {
  query = "",
  levels = new Set(),
  savedOnly = false,
  savedIds = new Set(),
} = {}) {
  const rawQuery = String(query || "").trim().toLowerCase();
  const normalizedPinyinQuery = compactPinyin(stripPinyinToneAndUmlautMarks(normalizePinyinForCompare(rawQuery)));
  const matches = [];
  items.forEach((item, sourceIndex) => {
    const key = sentenceItemKey(item);
    if (levels.size && !levels.has(item.level)) {
      return;
    }
    if (savedOnly && !savedIds.has(key)) {
      return;
    }
    if (!rawQuery) {
      matches.push({ item, score: 0, sourceIndex });
      return;
    }

    const chinese = String(item.zh || "").toLowerCase();
    const english = String(item.en || "").toLowerCase();
    let score = Infinity;
    if (chinese === rawQuery || english === rawQuery) {
      score = 0;
    } else if (chinese.startsWith(rawQuery) || english.startsWith(rawQuery)) {
      score = 1;
    } else if (chinese.includes(rawQuery) || english.includes(rawQuery)) {
      score = 2;
    } else if (normalizedPinyinQuery) {
      const pinyin = getSentenceSearchPinyin(item);
      if (pinyin === normalizedPinyinQuery) {
        score = 0;
      } else if (pinyin.startsWith(normalizedPinyinQuery)) {
        score = 1;
      } else if (pinyin.includes(normalizedPinyinQuery)) {
        score = 2;
      }
    }
    if (Number.isFinite(score)) {
      matches.push({ item, score, sourceIndex });
    }
  });
  return matches
    .sort((a, b) => a.score - b.score || a.sourceIndex - b.sourceIndex)
    .map((match) => match.item);
}

function getSentenceSearchPinyin(item) {
  hydrateWordDataFromWindow();
  const key = sentenceItemKey(item);
  if (!sentencePinyinSearchCache.has(key)) {
    const pinyin = tokenizeAnnotatedChinese(String(item?.zh || ""))
      .filter((token) => token.type === "word")
      .map((token) => token.entry.pinyin || "")
      .join(" ");
    sentencePinyinSearchCache.set(
      key,
      compactPinyin(stripPinyinToneAndUmlautMarks(normalizePinyinForCompare(pinyin))),
    );
  }
  return sentencePinyinSearchCache.get(key) || "";
}

function buildSentenceLibraryRow(item, { saved = false, showPinyin = true } = {}) {
  const key = sentenceItemKey(item);
  const levelLabel = selectedLevelLabel(item.level);
  const sourceLink = item.sourceId
    ? `<a href="https://tatoeba.org/en/sentences/show/${encodeURIComponent(item.sourceId)}" target="_blank" rel="noopener noreferrer">Tatoeba ${externalLinkIconMarkup()}</a>`
    : "";
  return `
    <article class="sentence-library-row ${saved ? "is-saved" : ""}" data-sentence-library-id="${escapeHtml(key)}">
      <button
        class="icon-btn sentence-library-save ${saved ? "active" : ""}"
        type="button"
        data-sentence-save-id="${escapeHtml(key)}"
        aria-label="${saved ? "Remove" : "Save"} sentence ${saved ? "from" : "to"} saved sentences"
        aria-pressed="${saved ? "true" : "false"}"
        title="${saved ? "Remove from saved sentences" : "Save sentence"}">
        ${bookmarkIconMarkup(saved)}
      </button>
      <div class="sentence-library-copy">
        ${buildAnnotatedChineseMarkup(item.zh, { showPinyin })}
        <p class="sentence-library-english">${escapeHtml(item.en)}</p>
        <footer>
          <span>${escapeHtml(levelLabel)}</span>
          ${sourceLink}
        </footer>
      </div>
      <button
        class="icon-btn sentence-library-audio"
        type="button"
        data-sentence-audio-id="${escapeHtml(key)}"
        aria-label="Play sentence"
        title="Play sentence"
        ${supportsSpeechSynthesis() ? "" : "disabled"}>
        ${speakerIconMarkup()}
      </button>
    </article>
  `;
}

function bindSentenceLibraryInteractions(itemById) {
  const searchForm = document.querySelector("#sentenceLibrarySearch");
  const searchInput = document.querySelector("#sentenceLibraryQuery");
  let searchTimer = 0;
  searchForm?.addEventListener("submit", (event) => event.preventDefault());
  searchInput?.addEventListener("input", () => {
    state.sentenceLibraryQuery = searchInput.value;
    state.sentenceLibraryVisibleCount = SENTENCE_LIBRARY_PAGE_SIZE;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      const cursor = state.sentenceLibraryQuery.length;
      render();
      const nextInput = document.querySelector("#sentenceLibraryQuery");
      nextInput?.focus();
      nextInput?.setSelectionRange?.(cursor, cursor);
    }, 90);
  });
  document.querySelector("#clearSentenceLibrarySearch")?.addEventListener("click", () => {
    state.sentenceLibraryQuery = "";
    state.sentenceLibraryVisibleCount = SENTENCE_LIBRARY_PAGE_SIZE;
    render();
    document.querySelector("#sentenceLibraryQuery")?.focus();
  });
  document.querySelector("#sentenceLibrarySavedOnly")?.addEventListener("change", (event) => {
    state.sentenceLibrarySavedOnly = event.target.checked;
    state.sentenceLibraryVisibleCount = SENTENCE_LIBRARY_PAGE_SIZE;
    render();
  });
  document.querySelector("#sentenceLibraryShowPinyin")?.addEventListener("change", (event) => {
    state.sentenceLibraryShowPinyin = event.target.checked;
    saveSettings();
    render();
  });
  document.querySelectorAll("[data-sentence-save-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = itemById.get(button.dataset.sentenceSaveId);
      if (!item) {
        return;
      }
      const saved = toggleSavedSentence(item);
      if (state.sentenceLibrarySavedOnly && !saved) {
        render();
        return;
      }
      updateSentenceLibrarySavedControls(item, saved);
    });
  });
  document.querySelectorAll("[data-sentence-audio-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = itemById.get(button.dataset.sentenceAudioId);
      if (item) {
        speak(item.zh, { immediate: true });
      }
    });
  });
  document.querySelector("#loadMoreSentences")?.addEventListener("click", () => {
    state.sentenceLibraryVisibleCount += SENTENCE_LIBRARY_PAGE_SIZE;
    render();
  });
  document.querySelector("#practiceSavedSentences")?.addEventListener("click", startSavedSentenceSession);
}

function updateSentenceLibrarySavedControls(item, saved) {
  const key = sentenceItemKey(item);
  const button = document.querySelector(`[data-sentence-save-id="${cssEscape(key)}"]`);
  const row = button?.closest(".sentence-library-row");
  if (button) {
    button.classList.toggle("active", saved);
    button.setAttribute("aria-pressed", String(saved));
    button.setAttribute("aria-label", `${saved ? "Remove" : "Save"} sentence ${saved ? "from" : "to"} saved sentences`);
    button.title = saved ? "Remove from saved sentences" : "Save sentence";
    button.innerHTML = bookmarkIconMarkup(saved);
  }
  row?.classList.toggle("is-saved", saved);
  const savedIds = loadSavedSentenceIds();
  const validSavedCount = getSavedSentenceItems(SENTENCES, savedIds, state.selectedLevels).length;
  const practiceButton = document.querySelector("#practiceSavedSentences");
  if (practiceButton) {
    practiceButton.disabled = validSavedCount === 0;
    practiceButton.textContent = `Practice saved in ${MODES[state.mode].label}${validSavedCount ? ` (${validSavedCount})` : ""}`;
  }
}

function sentenceItemKey(item) {
  return String(item?.id || item?.sourceId || "").trim();
}

function loadSavedSentenceIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_SENTENCES_KEY) || "[]");
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string" && id) : []);
  } catch {
    return new Set();
  }
}

function saveSavedSentenceIds(ids) {
  try {
    localStorage.setItem(SAVED_SENTENCES_KEY, JSON.stringify([...ids]));
  } catch {
    // Saved sentences remain optional browser-local state.
  }
}

function toggleSavedSentence(item) {
  const key = sentenceItemKey(item);
  if (!key) {
    return false;
  }
  const savedIds = loadSavedSentenceIds();
  if (savedIds.has(key)) {
    savedIds.delete(key);
    saveSavedSentenceIds(savedIds);
    return false;
  }
  savedIds.add(key);
  saveSavedSentenceIds(savedIds);
  return true;
}

function getSavedSentenceItems(items = SENTENCES, savedIds = loadSavedSentenceIds(), levels = new Set()) {
  return items.filter((item) =>
    savedIds.has(sentenceItemKey(item)) &&
    (!levels.size || levels.has(item.level)),
  );
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
  if (state.vocabularyView === "library") {
    renderVocabularyLibrary();
    return;
  }

  if (state.vocabularyView === "path") {
    renderVocabularyPath();
    return;
  }

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
      ${buildVocabularyViewSwitcher()}
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

  bindVocabularyViewSwitcher();

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

function buildVocabularyViewSwitcher() {
  return `
    <nav class="vocabulary-view-switcher" aria-label="Vocabulary view">
      <button class="${state.vocabularyView === "quiz" ? "active" : ""}" type="button" data-vocabulary-view="quiz">Quiz</button>
      <button class="${state.vocabularyView === "library" ? "active" : ""}" type="button" data-vocabulary-view="library">Word Library</button>
      <button class="${state.vocabularyView === "path" ? "active" : ""}" type="button" data-vocabulary-view="path">HSK Path</button>
    </nav>
  `;
}

function bindVocabularyViewSwitcher() {
  document.querySelectorAll(".vocabulary-view-switcher button[data-vocabulary-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextView = button.dataset.vocabularyView;
      if (!VOCABULARY_VIEWS.has(nextView) || nextView === state.vocabularyView) {
        return;
      }
      state.vocabularyView = nextView;
      state.vocabularyLibraryVisibleCount = VOCABULARY_LIBRARY_PAGE_SIZE;
      saveSettings();
      render();
    });
  });
}

function renderVocabularyPath() {
  const path = getVocabularyPathData();
  const recommended = getRecommendedVocabularyPathPart(path);
  const totals = path.totals;
  const coveragePercent = getVocabularyPathPercent(totals.introduced, totals.total);
  const strongPercent = getVocabularyPathPercent(totals.strong, totals.total);
  const recommendedMeta = recommended?.meta;

  app.innerHTML = `
    <section class="workspace-panel vocabulary-path">
      ${buildVocabularyViewSwitcher()}
      <div class="mode-heading vocabulary-path-heading">
        <div>
          <h2>HSK Vocabulary Path</h2>
          <p>Move through the complete HSK 1 and HSK 2 vocabulary curriculum, one focused part at a time.</p>
        </div>
        <button class="primary-btn shortcut-btn vocabulary-path-continue" type="button" id="continueVocabularyPath" ${recommended ? "" : "disabled"}>
          <span>${recommendedMeta ? `Continue ${escapeHtml(recommendedMeta.levelLabel)} ${escapeHtml(recommendedMeta.partLabel)}` : "No parts available"}</span>
          ${shortcutHint("Enter")}
        </button>
      </div>

      <div class="vocabulary-path-overview" aria-label="Overall HSK vocabulary progress">
        <div>
          <span>Coverage</span>
          <strong>${coveragePercent}%</strong>
          <small>${totals.introduced} of ${totals.total} introduced</small>
        </div>
        <div>
          <span>Strong</span>
          <strong>${strongPercent}%</strong>
          <small>${totals.strong} words retained</small>
        </div>
        <div>
          <span>Due now</span>
          <strong>${totals.due}</strong>
          <small>${totals.due === 1 ? "word needs review" : "words need review"}</small>
        </div>
        <div>
          <span>Curriculum</span>
          <strong>${path.parts.length}</strong>
          <small>HSK parts</small>
        </div>
      </div>

      <div class="vocabulary-path-legend" aria-label="Progress status legend">
        <span class="is-strong">Strong</span>
        <span class="is-learning">Learning</span>
        <span class="is-due">Due</span>
        <span class="is-new">New</span>
      </div>

      <div class="vocabulary-path-levels">
        ${path.levels.map((level, index) => buildVocabularyPathLevelMarkup(level, {
          open: recommended ? level.parts.some((part) => part.set.id === recommended.set.id) : index === 0,
          recommendedSetId: recommended?.set.id || "",
        })).join("")}
      </div>
    </section>
  `;

  bindVocabularyViewSwitcher();
  document.querySelector("#continueVocabularyPath")?.addEventListener("click", () => {
    if (recommended) {
      startVocabularySetReview(recommended.set.id);
    }
  });
  document.querySelectorAll("[data-vocabulary-path-review]").forEach((button) => {
    button.addEventListener("click", () => startVocabularySetReview(button.dataset.vocabularyPathReview));
  });
  document.querySelectorAll("[data-vocabulary-path-quiz]").forEach((button) => {
    button.addEventListener("click", () => openVocabularySetQuiz(button.dataset.vocabularyPathQuiz));
  });
}

function getVocabularyPathData(progress = ensureReviewProgress(), now = Date.now(), sets = VOCABULARY_QUIZ_SETS) {
  const levelsByLabel = new Map();
  const totals = createVocabularyPathCounts();
  const parts = sets.map((set) => {
    const meta = getVocabularySetMeta(set);
    const items = getVocabularySetReviewItems(set);
    const counts = createVocabularyPathCounts(items.length);
    items.forEach((item) => {
      const status = getVocabularyLibraryStatus(item, progress, now).id;
      counts[status] += 1;
    });
    counts.introduced = counts.total - counts.new;
    addVocabularyPathCounts(totals, counts);
    const part = { set, meta, items, counts };
    const level = levelsByLabel.get(meta.levelLabel) || {
      label: meta.levelLabel,
      levelNumber: meta.levelNumber,
      parts: [],
      totals: createVocabularyPathCounts(),
    };
    level.parts.push(part);
    addVocabularyPathCounts(level.totals, counts);
    levelsByLabel.set(meta.levelLabel, level);
    return part;
  });

  return {
    levels: [...levelsByLabel.values()],
    parts,
    totals,
  };
}

function createVocabularyPathCounts(total = 0) {
  return { total, introduced: 0, new: 0, due: 0, learning: 0, strong: 0 };
}

function addVocabularyPathCounts(target, source) {
  target.total += source.total;
  target.introduced += source.introduced;
  target.new += source.new;
  target.due += source.due;
  target.learning += source.learning;
  target.strong += source.strong;
  return target;
}

function getVocabularyPathPercent(count, total) {
  if (!count || !total) {
    return 0;
  }
  return Math.max(1, Math.round((count / total) * 100));
}

function getRecommendedVocabularyPathPart(path) {
  return path.parts.find((part) => part.counts.due > 0) ||
    path.parts.find((part) => part.counts.learning > 0) ||
    path.parts.find((part) => part.counts.new > 0) ||
    path.parts[0] || null;
}

function buildVocabularyPathLevelMarkup(level, { open = false, recommendedSetId = "" } = {}) {
  const coveragePercent = getVocabularyPathPercent(level.totals.introduced, level.totals.total);
  return `
    <details class="vocabulary-path-level hsk-level-${escapeHtml(level.levelNumber)}" ${open ? "open" : ""}>
      <summary>
        <span class="vocabulary-path-level-number" aria-hidden="true">${escapeHtml(level.levelNumber)}</span>
        <span class="vocabulary-path-level-copy">
          <strong>${escapeHtml(level.label)}</strong>
          <small>${level.totals.introduced} of ${level.totals.total} introduced · ${level.totals.strong} strong${level.totals.due ? ` · ${level.totals.due} due` : ""}</small>
        </span>
        <span class="vocabulary-path-level-progress" aria-label="${coveragePercent}% introduced">
          <span><i style="width: ${coveragePercent}%"></i></span>
          <strong>${coveragePercent}%</strong>
        </span>
        <span class="vocabulary-path-level-chevron" aria-hidden="true"></span>
      </summary>
      <div class="vocabulary-path-parts">
        ${level.parts.map((part) => buildVocabularyPathPartMarkup(part, {
          recommended: part.set.id === recommendedSetId,
          totalParts: level.parts.length,
        })).join("")}
      </div>
    </details>
  `;
}

function buildVocabularyPathPartMarkup(part, { recommended = false, totalParts = 1 } = {}) {
  const counts = part.counts;
  const introducedPercent = getVocabularyPathPercent(counts.introduced, counts.total);
  const segmentWidth = (count) => counts.total ? `${(count / counts.total) * 100}%` : "0%";
  return `
    <article class="vocabulary-path-part ${recommended ? "is-recommended" : ""}">
      ${buildVocabularySetIconMarkup(part.set, totalParts)}
      <div class="vocabulary-path-part-copy">
        <div class="vocabulary-path-part-title">
          <strong>${escapeHtml(part.meta.partLabel)}</strong>
          ${recommended ? `<span>Up next</span>` : ""}
        </div>
        <p>${counts.total} words · ${counts.introduced} introduced · ${counts.strong} strong${counts.due ? ` · ${counts.due} due` : ""}</p>
        <div
          class="vocabulary-path-bar"
          role="img"
          aria-label="${counts.strong} strong, ${counts.learning} learning, ${counts.due} due, ${counts.new} new"
        >
          <span class="is-strong" style="width: ${segmentWidth(counts.strong)}"></span>
          <span class="is-learning" style="width: ${segmentWidth(counts.learning)}"></span>
          <span class="is-due" style="width: ${segmentWidth(counts.due)}"></span>
        </div>
      </div>
      <div class="vocabulary-path-part-progress">
        <strong>${introducedPercent}%</strong>
        <span>covered</span>
      </div>
      <div class="vocabulary-path-part-actions">
        <button class="secondary-btn" type="button" data-vocabulary-path-review="${escapeHtml(part.set.id)}">Review part</button>
        <button class="ghost-btn" type="button" data-vocabulary-path-quiz="${escapeHtml(part.set.id)}">Timed quiz</button>
      </div>
    </article>
  `;
}

function openVocabularySetQuiz(setId) {
  if (!VOCABULARY_QUIZ_SETS.some((set) => set.id === setId)) {
    return;
  }
  state.vocabularySetId = setId;
  state.vocabularyView = "quiz";
  state.result = null;
  state.session = null;
  saveSettings();
  render();
}

function renderVocabularyLibrary() {
  const items = getAllVocabularyReviewItems();
  const savedKeys = loadSavedVocabularyKeys();
  const progress = ensureReviewProgress();
  const now = Date.now();
  const filteredItems = filterVocabularyLibraryItems(items, {
    query: state.vocabularyLibraryQuery,
    level: state.vocabularyLibraryLevel,
    status: state.vocabularyLibraryStatus,
    savedKeys,
    progress,
    now,
  });
  const visibleItems = filteredItems.slice(0, state.vocabularyLibraryVisibleCount);
  const validSavedCount = items.filter((item) => savedKeys.has(reviewItemKey(item))).length;
  const itemByKey = new Map(items.map((item) => [reviewItemKey(item), item]));

  app.innerHTML = `
    <section class="workspace-panel vocabulary-library">
      ${buildVocabularyViewSwitcher()}
      <div class="mode-heading vocabulary-library-heading">
        <div>
          <h2>Vocabulary Word Library</h2>
          <p>Search the complete HSK 1 and HSK 2 collection, hear each word, and save vocabulary for adaptive review.</p>
        </div>
        <button class="primary-btn vocabulary-saved-review-btn" type="button" id="reviewSavedVocabulary" ${validSavedCount ? "" : "disabled"}>
          Review saved${validSavedCount ? ` (${validSavedCount})` : ""}
        </button>
      </div>

      <form class="vocabulary-library-toolbar" id="vocabularyLibrarySearch" role="search">
        <div class="field vocabulary-library-search-field">
          <label for="vocabularyLibraryQuery">Search words</label>
          <span class="vocabulary-search-input-wrap">
            ${searchIconMarkup()}
            <input
              id="vocabularyLibraryQuery"
              type="search"
              autocomplete="off"
              spellcheck="false"
              placeholder="Chinese, pinyin, or English meaning"
              value="${escapeHtml(state.vocabularyLibraryQuery)}"
            >
            ${state.vocabularyLibraryQuery ? `
              <button class="icon-btn vocabulary-search-clear" type="button" id="clearVocabularyLibrarySearch" aria-label="Clear search" title="Clear search">
                ${closeIconMarkup()}
              </button>
            ` : ""}
          </span>
        </div>
        <label class="field compact-field">
          <span>HSK level</span>
          <select id="vocabularyLibraryLevel">
            <option value="all" ${state.vocabularyLibraryLevel === "all" ? "selected" : ""}>All levels</option>
            <option value="1" ${state.vocabularyLibraryLevel === "1" ? "selected" : ""}>HSK 1</option>
            <option value="2" ${state.vocabularyLibraryLevel === "2" ? "selected" : ""}>HSK 2</option>
          </select>
        </label>
        <label class="field compact-field">
          <span>Learning status</span>
          <select id="vocabularyLibraryStatus">
            <option value="all" ${state.vocabularyLibraryStatus === "all" ? "selected" : ""}>All words</option>
            <option value="saved" ${state.vocabularyLibraryStatus === "saved" ? "selected" : ""}>Saved words</option>
            <option value="due" ${state.vocabularyLibraryStatus === "due" ? "selected" : ""}>Due now</option>
            <option value="learning" ${state.vocabularyLibraryStatus === "learning" ? "selected" : ""}>Learning</option>
            <option value="strong" ${state.vocabularyLibraryStatus === "strong" ? "selected" : ""}>Strong</option>
            <option value="new" ${state.vocabularyLibraryStatus === "new" ? "selected" : ""}>New</option>
          </select>
        </label>
      </form>

      <div class="vocabulary-library-summary">
        <strong>${filteredItems.length}</strong>
        <span>${filteredItems.length === 1 ? "word" : "words"}</span>
        ${state.vocabularyLibraryQuery ? `<span>matching &ldquo;${escapeHtml(state.vocabularyLibraryQuery)}&rdquo;</span>` : ""}
      </div>

      ${visibleItems.length ? `
        <div class="vocabulary-library-list" aria-label="Vocabulary words">
          ${visibleItems.map((item) => buildVocabularyLibraryRow(item, {
            saved: savedKeys.has(reviewItemKey(item)),
            status: getVocabularyLibraryStatus(item, progress, now),
          })).join("")}
        </div>
        ${visibleItems.length < filteredItems.length ? `
          <button class="secondary-btn vocabulary-library-more" type="button" id="loadMoreVocabularyWords">
            Show ${Math.min(VOCABULARY_LIBRARY_PAGE_SIZE, filteredItems.length - visibleItems.length)} more
          </button>
        ` : ""}
      ` : `
        <div class="vocabulary-library-empty">
          <strong>No matching words</strong>
          <p>Try a different spelling or remove one of the filters.</p>
        </div>
      `}
    </section>
  `;

  bindVocabularyViewSwitcher();
  bindVocabularyLibraryInteractions(itemByKey);
}

function buildVocabularyLibraryRow(item, { saved = false, status = { id: "new", label: "New" } } = {}) {
  const meta = getVocabularySetMeta({
    id: item.setId,
    label: item.setLabel,
    level: item.level,
  });
  const key = reviewItemKey(item);
  return `
    <article class="vocabulary-library-row">
      <button
        class="icon-btn vocabulary-save-button ${saved ? "active" : ""}"
        type="button"
        data-vocabulary-save-key="${escapeHtml(key)}"
        aria-label="${saved ? "Remove" : "Save"} ${escapeHtml(item.zh)} ${saved ? "from" : "to"} saved words"
        aria-pressed="${saved ? "true" : "false"}"
        title="${saved ? "Remove from saved words" : "Save for review"}">
        ${bookmarkIconMarkup(saved)}
      </button>
      <div class="vocabulary-library-word">
        <strong class="chinese-text" lang="zh-CN">${buildVocabularyWordLink(item)}</strong>
        <span>${buildToneColoredPinyinMarkup(item.pinyin)}</span>
      </div>
      <p class="vocabulary-library-meaning">${escapeHtml(formatVocabularyMeanings(item))}</p>
      <div class="vocabulary-library-meta">
        <span>${escapeHtml(`${meta.levelLabel} · ${meta.partLabel}`)}</span>
        <strong class="is-${escapeHtml(status.id)}">${escapeHtml(status.label)}</strong>
      </div>
      <div class="vocabulary-library-actions">
        <button
          class="icon-btn vocabulary-library-study"
          type="button"
          data-vocabulary-study-key="${escapeHtml(key)}"
          aria-label="Study ${escapeHtml(item.zh)}"
          title="Study word">
          ${bookOpenIconMarkup()}
        </button>
        <button
          class="icon-btn vocabulary-library-audio"
          type="button"
          data-vocabulary-audio-key="${escapeHtml(key)}"
          aria-label="Play ${escapeHtml(item.zh)}"
          title="Play word">
          ${speakerIconMarkup()}
        </button>
      </div>
    </article>
  `;
}

function bindVocabularyLibraryInteractions(itemByKey) {
  const searchForm = document.querySelector("#vocabularyLibrarySearch");
  const searchInput = document.querySelector("#vocabularyLibraryQuery");
  let searchTimer = 0;
  searchForm?.addEventListener("submit", (event) => event.preventDefault());
  searchInput?.addEventListener("input", () => {
    state.vocabularyLibraryQuery = searchInput.value;
    state.vocabularyLibraryVisibleCount = VOCABULARY_LIBRARY_PAGE_SIZE;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      const cursor = state.vocabularyLibraryQuery.length;
      render();
      const nextInput = document.querySelector("#vocabularyLibraryQuery");
      nextInput?.focus();
      nextInput?.setSelectionRange?.(cursor, cursor);
    }, 90);
  });
  document.querySelector("#clearVocabularyLibrarySearch")?.addEventListener("click", () => {
    state.vocabularyLibraryQuery = "";
    state.vocabularyLibraryVisibleCount = VOCABULARY_LIBRARY_PAGE_SIZE;
    render();
    document.querySelector("#vocabularyLibraryQuery")?.focus();
  });
  document.querySelector("#vocabularyLibraryLevel")?.addEventListener("change", (event) => {
    state.vocabularyLibraryLevel = event.target.value;
    state.vocabularyLibraryVisibleCount = VOCABULARY_LIBRARY_PAGE_SIZE;
    render();
  });
  document.querySelector("#vocabularyLibraryStatus")?.addEventListener("change", (event) => {
    state.vocabularyLibraryStatus = event.target.value;
    state.vocabularyLibraryVisibleCount = VOCABULARY_LIBRARY_PAGE_SIZE;
    render();
  });
  document.querySelectorAll("[data-vocabulary-save-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = itemByKey.get(button.dataset.vocabularySaveKey);
      if (item) {
        toggleSavedVocabularyItem(item);
        render();
      }
    });
  });
  document.querySelectorAll("[data-vocabulary-audio-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = itemByKey.get(button.dataset.vocabularyAudioKey);
      if (item) {
        speak(item.zh, { immediate: true });
      }
    });
  });
  document.querySelectorAll("[data-vocabulary-study-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = itemByKey.get(button.dataset.vocabularyStudyKey);
      if (item) {
        openVocabularyDetail(item, button);
      }
    });
  });
  document.querySelector("#loadMoreVocabularyWords")?.addEventListener("click", () => {
    state.vocabularyLibraryVisibleCount += VOCABULARY_LIBRARY_PAGE_SIZE;
    render();
  });
  document.querySelector("#reviewSavedVocabulary")?.addEventListener("click", startSavedVocabularyReview);
}

function filterVocabularyLibraryItems(items, {
  query = "",
  level = "all",
  status = "all",
  savedKeys = new Set(),
  progress = {},
  now = Date.now(),
} = {}) {
  const rawQuery = String(query || "").trim().toLowerCase();
  const normalizedPinyinQuery = compactPinyin(stripPinyinToneAndUmlautMarks(normalizePinyinForCompare(rawQuery)));
  const matches = [];
  items.forEach((item, sourceIndex) => {
    const key = reviewItemKey(item);
    const meta = getVocabularySetMeta({ id: item.setId, label: item.setLabel, level: item.level });
    if (level !== "all" && meta.levelNumber !== level) {
      return;
    }
    const learningStatus = getVocabularyLibraryStatus(item, progress, now).id;
    if (status === "saved" && !savedKeys.has(key)) {
      return;
    }
    if (!["all", "saved"].includes(status) && learningStatus !== status) {
      return;
    }
    if (!rawQuery) {
      matches.push({ item, score: 0, sourceIndex });
      return;
    }

    const word = String(item.zh || "").toLowerCase();
    const meanings = formatVocabularyMeanings(item).toLowerCase();
    const setLabel = String(item.setLabel || "").toLowerCase();
    const itemPinyin = compactPinyin(stripPinyinToneAndUmlautMarks(normalizePinyinForCompare(item.pinyin)));
    let score = Infinity;
    if (word === rawQuery || (normalizedPinyinQuery && itemPinyin === normalizedPinyinQuery)) {
      score = 0;
    } else if (word.startsWith(rawQuery) || (normalizedPinyinQuery && itemPinyin.startsWith(normalizedPinyinQuery))) {
      score = 1;
    } else if (word.includes(rawQuery) || (normalizedPinyinQuery && itemPinyin.includes(normalizedPinyinQuery))) {
      score = 2;
    } else if (getVocabularyMeaningCandidates(item).some((meaning) => meaning.toLowerCase().startsWith(rawQuery))) {
      score = 3;
    } else if (meanings.includes(rawQuery)) {
      score = 4;
    } else if (setLabel.includes(rawQuery)) {
      score = 5;
    }
    if (Number.isFinite(score)) {
      matches.push({ item, score, sourceIndex });
    }
  });
  return matches
    .sort((a, b) => a.score - b.score || a.sourceIndex - b.sourceIndex)
    .map((match) => match.item);
}

function getVocabularyLibraryStatus(item, progress = {}, now = Date.now()) {
  const record = progress[reviewItemKey(item)];
  if (!record) {
    return { id: "new", label: "New" };
  }
  if ((Number(record.dueAt) || 0) <= now) {
    return { id: "due", label: "Due" };
  }
  if ((Number(record.stage) || 0) >= 4) {
    return { id: "strong", label: "Strong" };
  }
  return { id: "learning", label: "Learning" };
}

function loadSavedVocabularyKeys() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_VOCABULARY_KEY) || "[]");
    return new Set(Array.isArray(parsed) ? parsed.filter((key) => typeof key === "string" && key) : []);
  } catch {
    return new Set();
  }
}

function saveSavedVocabularyKeys(keys) {
  try {
    localStorage.setItem(SAVED_VOCABULARY_KEY, JSON.stringify([...keys]));
  } catch {
    // Saved words are optional browser-local state.
  }
}

function toggleSavedVocabularyItem(item, now = Date.now()) {
  const key = reviewItemKey(item);
  if (!key) {
    return false;
  }
  const savedKeys = loadSavedVocabularyKeys();
  if (savedKeys.has(key)) {
    savedKeys.delete(key);
    saveSavedVocabularyKeys(savedKeys);
    return false;
  }

  savedKeys.add(key);
  saveSavedVocabularyKeys(savedKeys);
  const progress = ensureReviewProgress();
  ensureVocabularyReviewEntry(progress, item, now);
  saveReviewProgress(progress);
  return true;
}

function ensureVocabularyReviewEntry(progress, item, now = Date.now()) {
  const key = reviewItemKey(item);
  if (!key || progress[key]) {
    return progress[key] || null;
  }
  progress[key] = {
    key,
    zh: item.zh,
    pinyin: item.pinyin,
    meanings: getVocabularyMeaningCandidates(item),
    setId: item.setId || "",
    setLabel: item.setLabel || "",
    stage: 0,
    dueAt: now,
    lastReviewedAt: 0,
    lastMode: "",
    attempts: 0,
    correct: 0,
    streak: 0,
    lapses: 0,
  };
  return progress[key];
}

function startSavedVocabularyReview() {
  const savedKeys = loadSavedVocabularyKeys();
  const items = getAllVocabularyReviewItems().filter((item) => savedKeys.has(reviewItemKey(item)));
  if (!items.length) {
    return;
  }
  const progress = ensureReviewProgress();
  const selected = shuffle(items).slice(0, REVIEW_SESSION_LENGTH).map((item, index) => ({
    ...item,
    reviewMode: chooseReviewMode(progress[reviewItemKey(item)], index),
  }));
  state.tool = "review";
  saveSettings();
  startReviewItems(selected, "saved");
}

function startVocabularySetReview(setId) {
  const set = VOCABULARY_QUIZ_SETS.find((candidate) => candidate.id === setId);
  if (!set?.words?.length) {
    return;
  }

  const progress = ensureReviewProgress();
  const queue = buildReviewQueue(progress, Date.now(), getVocabularySetReviewItems(set));
  const selected = queue.slice(0, REVIEW_SESSION_LENGTH).map((entry, index) => ({
    ...entry.item,
    reviewMode: chooseReviewMode(entry.record, index),
  }));
  state.tool = "vocabulary";
  state.vocabularyView = "path";
  state.vocabularySetId = set.id;
  saveSettings();
  startReviewItems(selected, "path", { setId: set.id, setLabel: set.label });
}

function bookmarkIconMarkup(saved = false) {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path class="bookmark-shape ${saved ? "filled" : ""}" d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.6L6 21V4.5z"></path>
    </svg>
  `;
}

function speakerIconMarkup() {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M11 5L6.5 9H3v6h3.5l4.5 4V5z"></path>
      <path d="M15 9a4 4 0 0 1 0 6"></path>
      <path d="M17.5 6.5a8 8 0 0 1 0 11"></path>
    </svg>
  `;
}

function bookOpenIconMarkup() {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3.5 5.5A3.5 3.5 0 0 1 7 2h5v17H7a3.5 3.5 0 0 0-3.5 3V5.5z"></path>
      <path d="M20.5 5.5A3.5 3.5 0 0 0 17 2h-5v17h5a3.5 3.5 0 0 1 3.5 3V5.5z"></path>
    </svg>
  `;
}

function searchIconMarkup() {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="6"></circle>
      <path d="M16 16l5 5"></path>
    </svg>
  `;
}

function closeIconMarkup() {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12"></path>
      <path d="M18 6L6 18"></path>
    </svg>
  `;
}

function externalLinkIconMarkup() {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14 4h6v6"></path>
      <path d="M20 4l-9 9"></path>
      <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"></path>
    </svg>
  `;
}

function getVocabularyDetailProgress(item, progress = loadReviewProgress(), now = Date.now()) {
  const record = progress[reviewItemKey(item)] || null;
  const status = getVocabularyLibraryStatus(item, progress, now);
  const attempts = Number(record?.attempts) || 0;
  const correct = Number(record?.correct) || 0;
  return {
    record,
    status,
    attempts,
    accuracy: attempts ? correct / attempts : null,
  };
}

function findVocabularyExamples(item, sentences = SENTENCES, limit = 5) {
  const word = String(item?.zh || "").trim();
  if (!word || !Array.isArray(sentences) || !sentences.length || limit <= 0) {
    return [];
  }

  hydrateWordDataFromWindow();

  const levelNumber = getVocabularySetMeta({
    id: item.setId,
    label: item.setLabel,
    level: item.level,
  }).levelNumber;
  const levelPriority = levelNumber === "2"
    ? { intermediate: 0, beginner: 1, advanced: 2 }
    : { beginner: 0, intermediate: 1, advanced: 2 };
  return sentences
    .filter((sentence) => {
      const text = String(sentence?.zh || "");
      if (!text.includes(word)) {
        return false;
      }
      if (!wordDataLoaded) {
        return true;
      }
      return tokenizeAnnotatedChinese(text).some((token) => token.type === "word" && token.text === word);
    })
    .sort((a, b) =>
      (levelPriority[a.level] ?? 3) - (levelPriority[b.level] ?? 3) ||
      String(a.zh || "").length - String(b.zh || "").length ||
      String(a.id || "").localeCompare(String(b.id || "")),
    )
    .slice(0, limit);
}

function highlightVocabularyTermMarkup(text, term) {
  const source = String(text || "");
  const target = String(term || "");
  if (!target || !source.includes(target)) {
    return escapeHtml(source);
  }

  const parts = [];
  let cursor = 0;
  while (cursor < source.length) {
    const index = source.indexOf(target, cursor);
    if (index < 0) {
      parts.push(escapeHtml(source.slice(cursor)));
      break;
    }
    parts.push(escapeHtml(source.slice(cursor, index)));
    parts.push(`<mark class="word-detail-highlight">${escapeHtml(target)}</mark>`);
    cursor = index + target.length;
  }
  return parts.join("");
}

function buildVocabularyExamplePinyinMarkup(text, target) {
  hydrateWordDataFromWindow();
  return tokenizeAnnotatedChinese(String(text || ""))
    .map((token) => {
      if (token.type !== "word") {
        return `<span class="annotation-pinyin-punctuation">${escapeHtml(token.text)}</span>`;
      }
      const isTarget = token.text.includes(target);
      return `<span class="annotation-pinyin-word ${isTarget ? "is-target" : ""}">${escapeHtml(token.entry.pinyin || "")}</span>`;
    })
    .join("");
}

function buildVocabularyExampleMarkup(sentence, item, index = 0) {
  const sourceLink = sentence.sourceId
    ? `
      <a href="https://tatoeba.org/en/sentences/show/${encodeURIComponent(sentence.sourceId)}" target="_blank" rel="noopener noreferrer">
        Tatoeba ${externalLinkIconMarkup()}
      </a>
    `
    : "";
  return `
    <article class="word-detail-example">
      <div class="word-detail-example-heading">
        <span>Example ${index + 1}</span>
        <span>${escapeHtml(LEVELS.find((level) => level.id === sentence.level)?.label || sentence.level || "")}</span>
      </div>
      <p class="word-detail-example-zh chinese-text" lang="zh-CN">${highlightVocabularyTermMarkup(sentence.zh, item.zh)}</p>
      <p class="word-detail-example-pinyin">${buildVocabularyExamplePinyinMarkup(sentence.zh, item.zh)}</p>
      <p class="word-detail-example-en">${escapeHtml(sentence.en || "")}</p>
      <footer>
        ${sourceLink}
        <button
          class="icon-btn"
          type="button"
          data-word-example-audio="${escapeHtml(sentence.zh)}"
          aria-label="Play example ${index + 1}"
          title="Play sentence">
          ${speakerIconMarkup()}
        </button>
      </footer>
    </article>
  `;
}

function buildVocabularyDetailDialog(item, {
  progress = loadReviewProgress(),
  savedKeys = loadSavedVocabularyKeys(),
  now = Date.now(),
} = {}) {
  const key = reviewItemKey(item);
  const saved = savedKeys.has(key);
  const detailProgress = getVocabularyDetailProgress(item, progress, now);
  const meta = getVocabularySetMeta({ id: item.setId, label: item.setLabel, level: item.level });
  const accuracyLabel = detailProgress.accuracy === null
    ? "Not reviewed"
    : `${Math.round(detailProgress.accuracy * 100)}% recall`;
  return `
    <dialog class="word-detail-dialog" id="vocabularyWordDetail" data-word-detail-key="${escapeHtml(key)}" aria-labelledby="wordDetailTitle">
      <div class="word-detail-shell">
        <header class="word-detail-header">
          <div>
            <span>${escapeHtml(`${meta.levelLabel} · ${meta.partLabel}`)}</span>
            <h2 id="wordDetailTitle">Word study</h2>
          </div>
          <button class="icon-btn" type="button" data-word-detail-close aria-label="Close word study" title="Close">
            ${closeIconMarkup()}
          </button>
        </header>

        <div class="word-detail-hero">
          <div class="word-detail-identity">
            <div class="word-detail-character-row">
              <strong class="chinese-text" lang="zh-CN">${escapeHtml(item.zh)}</strong>
              <button class="icon-btn word-detail-audio" type="button" data-word-detail-audio aria-label="Play ${escapeHtml(item.zh)}" title="Play word">
                ${speakerIconMarkup()}
              </button>
            </div>
            <p>${buildToneColoredPinyinMarkup(item.pinyin)}</p>
          </div>
          <p class="word-detail-meaning">${escapeHtml(formatVocabularyMeanings(item))}</p>
        </div>

        <dl class="word-detail-metrics">
          <div>
            <dt>Review status</dt>
            <dd class="word-detail-status is-${escapeHtml(detailProgress.status.id)}">${escapeHtml(detailProgress.status.label)}</dd>
          </div>
          <div>
            <dt>Attempts</dt>
            <dd>${detailProgress.attempts}</dd>
          </div>
          <div>
            <dt>Recall</dt>
            <dd>${escapeHtml(accuracyLabel)}</dd>
          </div>
        </dl>

        <div class="word-detail-actions">
          <button
            class="secondary-btn icon-label-btn ${saved ? "active" : ""}"
            type="button"
            data-word-detail-save
            aria-pressed="${saved ? "true" : "false"}">
            ${bookmarkIconMarkup(saved)}
            <span>${saved ? "Saved for review" : "Save for review"}</span>
          </button>
          <a class="ghost-btn icon-label-btn" href="${escapeHtml(buildMdbgWordUrl(item))}" target="_blank" rel="noopener noreferrer">
            ${externalLinkIconMarkup()}
            <span>Open in MDBG</span>
          </a>
        </div>

        <section class="word-detail-section" aria-labelledby="wordDetailDictionaryHeading">
          <div class="word-detail-section-heading">
            <h3 id="wordDetailDictionaryHeading">Dictionary notes</h3>
          </div>
          <div id="wordDetailDictionary" class="word-detail-loading" aria-live="polite">
            <span></span><span></span>
          </div>
        </section>

        <section class="word-detail-section" aria-labelledby="wordDetailExamplesHeading">
          <div class="word-detail-section-heading">
            <h3 id="wordDetailExamplesHeading">Example sentences</h3>
            <span id="wordDetailExampleCount"></span>
          </div>
          <div id="wordDetailExamples" class="word-detail-loading" aria-live="polite">
            <span></span><span></span><span></span>
          </div>
        </section>
      </div>
    </dialog>
  `;
}

function updateVocabularyDetailSaveControls(dialog, item, saved) {
  const detailButton = dialog.querySelector("[data-word-detail-save]");
  if (detailButton) {
    detailButton.classList.toggle("active", saved);
    detailButton.setAttribute("aria-pressed", String(saved));
    detailButton.innerHTML = `${bookmarkIconMarkup(saved)}<span>${saved ? "Saved for review" : "Save for review"}</span>`;
  }

  const listButton = document.querySelector(`[data-vocabulary-save-key="${cssEscape(reviewItemKey(item))}"]`);
  if (listButton) {
    listButton.classList.toggle("active", saved);
    listButton.setAttribute("aria-pressed", String(saved));
    listButton.setAttribute("aria-label", `${saved ? "Remove" : "Save"} ${item.zh} ${saved ? "from" : "to"} saved words`);
    listButton.title = saved ? "Remove from saved words" : "Save for review";
    listButton.innerHTML = bookmarkIconMarkup(saved);
  }
}

async function hydrateVocabularyDetailResources(dialog, item) {
  const [sentenceResult, wordResult] = await Promise.allSettled([
    ensureSentenceData(),
    ensureWordData(),
  ]);
  if (!dialog.isConnected || dialog.dataset.wordDetailKey !== reviewItemKey(item)) {
    return;
  }

  const dictionary = dialog.querySelector("#wordDetailDictionary");
  if (dictionary) {
    dictionary.classList.remove("word-detail-loading");
    const entry = wordResult.status === "fulfilled" ? CHINESE_WORD_DATA[item.zh] : null;
    dictionary.innerHTML = entry?.gloss
      ? `<p>${escapeHtml(entry.gloss)}</p>`
      : `<p class="word-detail-unavailable">No additional dictionary note is available for this word.</p>`;
  }

  const examplesElement = dialog.querySelector("#wordDetailExamples");
  const countElement = dialog.querySelector("#wordDetailExampleCount");
  if (examplesElement) {
    examplesElement.classList.remove("word-detail-loading");
    const examples = sentenceResult.status === "fulfilled"
      ? findVocabularyExamples(item, SENTENCES)
      : [];
    if (countElement) {
      countElement.textContent = examples.length ? `${examples.length} from the sentence bank` : "";
    }
    examplesElement.innerHTML = examples.length
      ? `<div class="word-detail-example-list">${examples.map((sentence, index) => buildVocabularyExampleMarkup(sentence, item, index)).join("")}</div>`
      : `<p class="word-detail-unavailable">No matching example is available in the local sentence bank.</p>`;
    examplesElement.querySelectorAll("[data-word-example-audio]").forEach((button) => {
      button.addEventListener("click", () => speak(button.dataset.wordExampleAudio, { immediate: true }));
    });
  }
}

function openVocabularyDetail(item, trigger = null) {
  const existing = document.querySelector("#vocabularyWordDetail");
  if (existing) {
    existing.close?.();
    existing.remove();
  }

  app.insertAdjacentHTML("beforeend", buildVocabularyDetailDialog(item));
  const dialog = document.querySelector("#vocabularyWordDetail");
  if (!dialog) {
    return;
  }

  const closeDialog = () => {
    if (dialog.open) {
      dialog.close();
    } else {
      dialog.remove();
      trigger?.focus?.();
    }
  };
  dialog.addEventListener("close", () => {
    dialog.remove();
    trigger?.focus?.();
  }, { once: true });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });
  dialog.querySelector("[data-word-detail-close]")?.addEventListener("click", closeDialog);
  dialog.querySelector("[data-word-detail-audio]")?.addEventListener("click", () => speak(item.zh, { immediate: true }));
  dialog.querySelector("[data-word-detail-save]")?.addEventListener("click", () => {
    const saved = toggleSavedVocabularyItem(item);
    updateVocabularyDetailSaveControls(dialog, item, saved);
    const status = getVocabularyLibraryStatus(item, loadReviewProgress());
    const statusElement = dialog.querySelector(".word-detail-status");
    if (statusElement) {
      statusElement.className = `word-detail-status is-${status.id}`;
      statusElement.textContent = status.label;
    }
  });

  try {
    dialog.showModal();
  } catch {
    dialog.setAttribute("open", "");
  }
  hydrateVocabularyDetailResources(dialog, item);
}

function renderReviewHome() {
  const dashboard = getReviewDashboardData();
  const queuePreview = dashboard.queue.slice(0, 6);
  const startLabel = dashboard.totalTracked
    ? dashboard.dueCount
      ? `Review ${Math.min(REVIEW_SESSION_LENGTH, dashboard.queue.length)} due words`
      : "Start a practice review"
    : "Start baseline review";

  app.innerHTML = `
    <section class="workspace-panel review-home">
      <div class="mode-heading review-heading">
        <div>
          <h2>Daily Review</h2>
          <p>A focused queue that adapts to your vocabulary quiz answers.</p>
        </div>
        <span class="review-streak" aria-label="${dashboard.streakDays} day review streak">
          <strong>${dashboard.streakDays}</strong>
          <span>day streak</span>
        </span>
      </div>

      <div class="review-metrics" aria-label="Review progress">
        <div>
          <strong>${dashboard.dueCount}</strong>
          <span>Due now</span>
        </div>
        <div>
          <strong>${dashboard.learningCount}</strong>
          <span>Learning</span>
        </div>
        <div>
          <strong>${dashboard.strongCount}</strong>
          <span>Strong</span>
        </div>
        <div>
          <strong>${dashboard.reviewedToday}</strong>
          <span>Reviewed today</span>
        </div>
      </div>

      <div class="review-home-grid">
        <section class="review-start-panel">
          <span class="review-eyebrow">Today</span>
          <h3>${dashboard.dueCount ? `${dashboard.dueCount} words are ready` : dashboard.totalTracked ? "You are caught up" : "Build your baseline"}</h3>
          <p>${dashboard.totalTracked
            ? "The queue starts with due words, then adds new vocabulary to keep each session useful."
            : "Your first round samples HSK 1 vocabulary. Future rounds prioritize words you miss in quizzes and reviews."}</p>
          <button class="primary-btn shortcut-btn review-start-btn" type="button" id="startReviewSession" ${dashboard.queue.length ? "" : "disabled"}>
            <span>${startLabel}</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn review-quiz-link" type="button" id="openVocabularyQuiz">Open Vocabulary Quiz</button>
        </section>

        <section class="review-queue-panel" aria-labelledby="reviewQueueHeading">
          <div class="review-section-heading">
            <div>
              <span>Up next</span>
              <h3 id="reviewQueueHeading">Review queue</h3>
            </div>
            <strong>${Math.min(REVIEW_SESSION_LENGTH, dashboard.queue.length)} next</strong>
          </div>
          <div class="review-word-list">
            ${queuePreview.map((entry, index) => buildReviewQueueRowMarkup(entry, index)).join("")}
          </div>
        </section>
      </div>
    </section>
  `;

  document.querySelector("#startReviewSession")?.addEventListener("click", startReviewSession);
  document.querySelector("#openVocabularyQuiz").addEventListener("click", () => {
    state.tool = "vocabulary";
    state.result = null;
    saveSettings();
    render();
  });
}

function buildReviewQueueRowMarkup(entry, index) {
  return `
    <div class="review-word-row">
      <span class="review-word-rank">${index + 1}</span>
      <div class="review-word-identity">
        <strong class="chinese-text" lang="zh-CN">${escapeHtml(entry.item.zh)}</strong>
        <span>${buildToneColoredPinyinMarkup(entry.item.pinyin)}</span>
      </div>
      <span class="review-word-meaning">${escapeHtml(formatVocabularyChoiceText(entry.item))}</span>
      <span class="review-word-state ${entry.statusClass}">${escapeHtml(entry.statusLabel)}</span>
    </div>
  `;
}

function renderReviewSession() {
  const session = state.session;
  const current = session.items[session.index];
  const assessment = session.currentAssessment;
  const correctCount = session.answers.filter((answer) => answer.correct).length;
  const progressPercent = Math.round((session.answers.length / session.items.length) * 100);
  const isPinyin = current.reviewMode === "pinyin";
  const nextLabel = session.index + 1 >= session.items.length ? "View results" : "Next word";
  const promptMarkup = isPinyin
    ? `<p class="review-prompt-word chinese-text" lang="zh-CN">${escapeHtml(current.zh)}</p>`
    : buildVocabularyPromptMarkup(current, "meaning", assessment);
  const sourceLabel = session.source === "path"
    ? formatVocabularyPathSetName(session.setId, session.setLabel)
    : session.source === "saved"
      ? "Saved Words"
      : "Daily Review";

  app.innerHTML = `
    <section class="workspace-panel review-session">
      <div class="review-session-header">
        <div>
          <span>${escapeHtml(sourceLabel)}</span>
          <strong>${isPinyin ? "Character to pinyin" : "Listen for the meaning"}</strong>
        </div>
        <div class="review-session-score">
          <span>Score</span>
          <strong>${correctCount}/${session.items.length}</strong>
        </div>
        <button class="ghost-btn" type="button" id="endSession">End review</button>
      </div>

      <div class="progress-row review-progress-row">
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        <span class="progress-label">Word ${session.index + 1} of ${session.items.length}</span>
      </div>

      <div class="review-practice-layout">
        <div class="review-prompt-panel">
          <span class="sentence-label">${isPinyin ? "Chinese word" : "Audio word"}</span>
          ${promptMarkup}
        </div>

        <div class="review-response-panel ${assessment ? "is-answered" : ""}">
          ${isPinyin
            ? buildReviewPinyinResponseMarkup(current, assessment)
            : buildReviewMeaningResponseMarkup(session, current, assessment)}
          ${assessment ? buildReviewFeedbackMarkup(current, assessment) : ""}
          ${assessment ? `
            <button class="primary-btn shortcut-btn review-next-btn" type="button" id="nextQuestion">
              <span>${nextLabel}</span>
              ${shortcutHint("Enter")}
            </button>
          ` : ""}
        </div>
      </div>
    </section>
  `;

  document.querySelector("#endSession").addEventListener("click", finishSessionEarly);
  document.querySelector("#playAudio")?.addEventListener("click", () => speak(current.zh, { immediate: true }));

  if (assessment) {
    document.querySelector("#nextQuestion").addEventListener("click", nextQuestion);
    return;
  }

  if (isPinyin) {
    const form = document.querySelector("#reviewAnswerForm");
    const input = document.querySelector("#reviewAnswer");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitReviewPinyin(input.value);
    });
    if (!isTouchLikeDevice()) {
      input.focus();
    }
    return;
  }

  document.querySelectorAll("[data-review-choice-id]").forEach((button) => {
    button.addEventListener("click", () => submitReviewChoice(button.dataset.reviewChoiceId));
  });
}

function buildReviewPinyinResponseMarkup(item, assessment) {
  return `
    <form class="review-answer-form" id="reviewAnswerForm">
      <label class="field">
        <span>Pinyin answer</span>
        <input
          id="reviewAnswer"
          class="answer-input"
          type="text"
          lang="en"
          autocomplete="off"
          autocapitalize="none"
          spellcheck="false"
          enterkeyhint="done"
          placeholder="Type pinyin; tone marks are optional"
          value="${assessment ? escapeHtml(assessment.answer) : ""}"
          ${assessment ? "disabled" : ""}
        >
      </label>
      ${assessment ? "" : `
        <button class="secondary-btn shortcut-btn" type="submit">
          <span>Check answer</span>
          ${shortcutHint("Enter")}
        </button>
      `}
    </form>
  `;
}

function buildReviewMeaningResponseMarkup(session, current, assessment) {
  const choices = getReviewChoiceSet(session, session.index);
  return `
    <div class="choice-grid review-choice-grid" role="group" aria-label="Meaning choices">
      ${choices.map((choice) => {
        const selected = assessment?.choiceId === choice.id;
        const classes = [
          "choice-option",
          selected ? "selected" : "",
          assessment && choice.correct ? "correct" : "",
          assessment && selected && !choice.correct ? "incorrect" : "",
          assessment && selected && choice.correct ? "correct-celebration" : "",
        ].filter(Boolean).join(" ");
        return `
          <button class="${classes}" type="button" data-review-choice-id="${escapeHtml(choice.id)}" ${assessment ? "disabled" : ""}>
            <span class="choice-key">${escapeHtml(choice.shortcut)}</span>
            <span class="choice-text">${escapeHtml(choice.text)}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function buildReviewFeedbackMarkup(item, assessment) {
  return `
    <section class="feedback review-feedback ${assessment.correct ? "good correct-celebration" : "review"}" role="status" aria-live="polite">
      <div class="feedback-title">
        <strong>${assessment.correct ? "Correct" : "Review this word"}</strong>
        <span>${escapeHtml(formatReviewDueLabel(assessment.nextDueAt, assessment.correct))}</span>
      </div>
      <div class="review-answer-reveal">
        <strong class="chinese-text" lang="zh-CN">${buildVocabularyWordLink(item)}</strong>
        <span>${buildToneColoredPinyinMarkup(item.pinyin)}</span>
        <p>${escapeHtml(formatVocabularyMeanings(item))}</p>
      </div>
      ${assessment.correct ? "" : `<p class="review-answer-note">Your answer: ${escapeHtml(assessment.answer || "No answer")}</p>`}
    </section>
  `;
}

function renderReviewResults() {
  const result = state.result;
  const isSavedReview = result.source === "saved";
  const isPathReview = result.source === "path";
  const pathSetName = formatVocabularyPathSetName(result.setId, result.setLabel);
  const resultTitle = isSavedReview
    ? "Saved Words Review Complete"
    : isPathReview
      ? `${pathSetName} Review Complete`
      : "Daily Review Complete";
  const restartLabel = isSavedReview
    ? "Review saved again"
    : isPathReview
      ? `Review ${getVocabularySetMeta({ id: result.setId, label: result.setLabel }).partLabel} again`
      : "Start another review";
  const backLabel = isSavedReview ? "Back to word library" : isPathReview ? "Back to HSK path" : "Back to review";
  const correct = result.answers.filter((answer) => answer.correct).length;
  const strengthened = result.answers.filter((answer) => answer.reviewStage > answer.previousStage).length;
  const dashboard = getReviewDashboardData();
  const rows = result.answers.map((answer, index) => `
    <tr class="${answer.correct ? "found" : "missed"}">
      <td>${index + 1}</td>
      <td class="chinese-text">${buildVocabularyWordLink(answer.item)}</td>
      <td>${buildToneColoredPinyinMarkup(answer.item.pinyin)}</td>
      <td>${answer.reviewMode === "pinyin" ? "Pinyin" : "Audio meaning"}</td>
      <td>${escapeHtml(formatVocabularyMeanings(answer.item))}</td>
      <td class="${answer.correct ? "status-good" : "status-review"}">${answer.correct ? "Correct" : "Review"}</td>
      <td>${escapeHtml(formatReviewDueLabel(answer.nextDueAt, answer.correct))}</td>
    </tr>
  `).join("");

  app.innerHTML = `
    <section class="workspace-panel review-results">
      <div class="results-header">
        <div>
          <h2>${escapeHtml(resultTitle)}</h2>
          <p>${correct} of ${result.answers.length} correct in ${formatTimer(result.elapsedSeconds)}.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>${escapeHtml(restartLabel)}</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">${escapeHtml(backLabel)}</button>
        </div>
      </div>

      <div class="stat-grid review-result-metrics">
        <div class="stat"><strong>${correct}/${result.answers.length}</strong><span>Correct</span></div>
        <div class="stat"><strong>${strengthened}</strong><span>Strengthened</span></div>
        <div class="stat"><strong>${dashboard.dueCount}</strong><span>Still due</span></div>
        <div class="stat"><strong>${formatTimer(result.elapsedSeconds)}</strong><span>Review time</span></div>
      </div>

      <div class="results-table-wrap vocab-table-wrap" tabindex="0">
        <table class="vocab-table review-results-table">
          <thead><tr><th>#</th><th>Word</th><th>Pinyin</th><th>Prompt</th><th>Meaning</th><th>Status</th><th>Next review</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  document.querySelector("#restartSession").addEventListener("click", () => {
    if (isSavedReview) {
      startSavedVocabularyReview();
    } else if (isPathReview) {
      startVocabularySetReview(result.setId);
    } else {
      startReviewSession();
    }
  });
  document.querySelector("#backToModes").addEventListener("click", () => {
    state.result = null;
    state.session = null;
    if (isSavedReview) {
      state.tool = "vocabulary";
      state.vocabularyView = "library";
      saveSettings();
    } else if (isPathReview) {
      state.tool = "vocabulary";
      state.vocabularyView = "path";
      saveSettings();
    }
    render();
  });
}

function formatVocabularyPathSetName(setId, setLabel = "") {
  const set = VOCABULARY_QUIZ_SETS.find((candidate) => candidate.id === setId) || { id: setId, label: setLabel };
  const meta = getVocabularySetMeta(set);
  return `${meta.levelLabel} · ${meta.partLabel}`;
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
      ${buildVocabularySetIconMarkup(set, totalParts)}
      <span class="quiz-set-card-text">
        <strong>${escapeHtml(meta.levelLabel)}</strong>
        <span>${escapeHtml(meta.partLabel)}</span>
      </span>
    </button>
  `;
}

function buildVocabularySetIconMarkup(set, totalParts = 1) {
  const meta = getVocabularySetMeta(set);
  return `
    <span class="quiz-set-icon" aria-hidden="true">
      <span class="quiz-set-icon-level">${escapeHtml(meta.levelNumber || "V")}</span>
      <span class="quiz-set-icon-part">${escapeHtml(meta.partBadge)}</span>
      ${buildVocabularyPartMarks(meta.partNumber, totalParts)}
    </span>
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

function getProgressSkillDefinitions() {
  return [
    { id: "vocabulary", label: "Vocabulary", tool: "review", unit: "words" },
    { id: "pronunciation", label: "Pronunciation", tool: "pronunciation", unit: "sentences" },
    { id: "reading", label: "Reading", tool: "drill", mode: "reading", unit: "sentences" },
    { id: "writing", label: "Writing", tool: "drill", mode: "writing", unit: "sentences" },
    { id: "listening", label: "Listening", tool: "drill", mode: "listening", unit: "sentences" },
    { id: "geography", label: "Geography", tool: "map", unit: "locations" },
  ];
}

function getHistorySkillStats(history = []) {
  const skills = new Map(getProgressSkillDefinitions().map((skill) => [skill.id, {
    ...skill,
    sessions: 0,
    attempts: 0,
    scoreTotal: 0,
    accuracy: null,
  }]));

  history.forEach((record) => {
    const skillId = record.type === "drill"
      ? record.mode
      : ["vocabulary", "review"].includes(record.type)
        ? "vocabulary"
        : record.type === "map"
          ? "geography"
          : record.type;
    const skill = skills.get(skillId);
    const attempts = Math.max(0, Number(record.total) || (Array.isArray(record.answers) ? record.answers.length : 0));
    if (!skill || !attempts) {
      return;
    }

    const score = record.type === "pronunciation"
      ? clamp(Number(record.averageScore) || 0, 0, 1)
      : clamp((Number(record.correct) || 0) / attempts, 0, 1);
    skill.sessions += 1;
    skill.attempts += attempts;
    skill.scoreTotal += score * attempts;
  });

  return [...skills.values()].map((skill) => ({
    ...skill,
    accuracy: skill.attempts ? skill.scoreTotal / skill.attempts : null,
  }));
}

function getHistoryActivityDays(history = [], now = Date.now(), dayCount = PROGRESS_ACTIVITY_DAYS) {
  const counts = new Map();
  history.forEach((record) => {
    const key = localDateKey(Date.parse(record?.completedAt || ""));
    if (key) {
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  });

  const cursor = new Date(now);
  cursor.setHours(12, 0, 0, 0);
  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(cursor);
    date.setDate(cursor.getDate() - (dayCount - index - 1));
    const dateKey = localDateKey(date.getTime());
    return {
      dateKey,
      count: counts.get(dateKey) || 0,
      day: date.getDate(),
      shortLabel: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      fullLabel: date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }),
      isToday: dateKey === localDateKey(now),
    };
  });
}

function getProgressPronunciationFocus(history = []) {
  const totals = new Map();
  history
    .filter((record) => record.type === "pronunciation")
    .slice(0, 10)
    .forEach((record) => {
      [
        ["tone", record.weaknesses?.tones || []],
        ["initial", record.weaknesses?.initials || []],
        ["final", record.weaknesses?.finals || []],
      ].forEach(([kind, items]) => {
        items.forEach((item) => {
          if (!item?.label) {
            return;
          }
          const key = `${kind}:${item.label}`;
          const current = totals.get(key) || { kind, label: item.label, count: 0 };
          current.count += Number(item.count) || 0;
          totals.set(key, current);
        });
      });
    });

  return [...totals.values()]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))[0] || null;
}

function getVocabularyMistakeStats(history = [], limit = PROGRESS_MISTAKE_LIMIT) {
  const mistakes = new Map();
  history
    .filter((record) => ["vocabulary", "review"].includes(record.type))
    .slice(0, 50)
    .forEach((record) => {
      (record.answers || []).forEach((answer) => {
        if (answer.correct || !answer.zh || !answer.pinyin) {
          return;
        }
        const item = {
          zh: answer.zh,
          pinyin: answer.pinyin,
          meanings: String(answer.meaning || "")
            .split(";")
            .map((meaning) => meaning.trim())
            .filter(Boolean),
        };
        const key = reviewItemKey(item);
        if (!key) {
          return;
        }
        const current = mistakes.get(key) || {
          ...item,
          key,
          misses: 0,
          lastMissedAt: record.completedAt || "",
        };
        current.misses += 1;
        if (Date.parse(record.completedAt || "") > Date.parse(current.lastMissedAt || "")) {
          current.lastMissedAt = record.completedAt;
        }
        mistakes.set(key, current);
      });
    });

  return [...mistakes.values()]
    .sort((a, b) => b.misses - a.misses || Date.parse(b.lastMissedAt || "") - Date.parse(a.lastMissedAt || ""))
    .slice(0, limit);
}

function getHistoryProgressData(history = [], now = Date.now(), review = { dueCount: 0, strongCount: 0, totalTracked: 0 }) {
  const activity = getHistoryActivityDays(history, now);
  const weekKeys = new Set(activity.slice(-7).map((day) => day.dateKey));
  const weekRecords = history.filter((record) => weekKeys.has(localDateKey(Date.parse(record.completedAt || ""))));
  const skills = getHistorySkillStats(history);
  const pronunciationFocus = getProgressPronunciationFocus(history);
  const vocabularyMistakes = getVocabularyMistakeStats(history);
  const practicedSkills = skills.filter((skill) => skill.accuracy !== null);
  const rankedSkills = [...practicedSkills]
    .sort((a, b) => a.accuracy - b.accuracy || a.attempts - b.attempts);
  const vocabularyAlreadyPrioritized = Boolean(review.dueCount || !review.totalTracked);
  const weakestSkill = rankedSkills.find((skill) => !vocabularyAlreadyPrioritized || skill.id !== "vocabulary") || null;
  const focusItems = [];

  if (review.dueCount) {
    focusItems.push({
      id: "due-vocabulary",
      eyebrow: "Due now",
      title: `${review.dueCount} ${review.dueCount === 1 ? "word" : "words"} ready for review`,
      detail: "Keep scheduled vocabulary from slipping out of recall.",
      tool: "review",
      actionLabel: "Review now",
    });
  } else if (!review.totalTracked) {
    focusItems.push({
      id: "vocabulary-baseline",
      eyebrow: "Start here",
      title: "Build a vocabulary baseline",
      detail: "Your first review creates a personalized recall schedule.",
      tool: "review",
      actionLabel: "Start review",
    });
  }

  if (weakestSkill) {
    focusItems.push({
      id: `skill-${weakestSkill.id}`,
      eyebrow: "Lowest accuracy",
      title: `${weakestSkill.label} at ${Math.round(weakestSkill.accuracy * 100)}%`,
      detail: `${weakestSkill.attempts} ${weakestSkill.unit} recorded across ${weakestSkill.sessions} ${weakestSkill.sessions === 1 ? "session" : "sessions"}.`,
      tool: weakestSkill.tool,
      mode: weakestSkill.mode || "",
      actionLabel: `Practice ${weakestSkill.label.toLowerCase()}`,
    });
  }

  if (pronunciationFocus && !focusItems.some((item) => item.tool === "pronunciation")) {
    focusItems.push({
      id: "pronunciation-focus",
      eyebrow: "Pronunciation pattern",
      title: `${pronunciationFocus.label} needs attention`,
      detail: `This ${pronunciationFocus.kind} appears repeatedly in words that were not recognized.`,
      tool: "pronunciation",
      actionLabel: "Practice speaking",
    });
  }

  if (vocabularyMistakes.length && !focusItems.some((item) => item.id === "due-vocabulary")) {
    focusItems.push({
      id: "vocabulary-mistakes",
      eyebrow: "Recurring misses",
      title: `${vocabularyMistakes.length} vocabulary ${vocabularyMistakes.length === 1 ? "word" : "words"} to revisit`,
      detail: "Save them below to place them in your review queue.",
      tool: "vocabulary",
      view: "library",
      actionLabel: "Open word library",
    });
  }

  return {
    activity,
    activeDays: activity.filter((day) => day.count).length,
    weekSessions: weekRecords.length,
    weekAnswers: weekRecords.reduce((sum, record) => sum + (Number(record.total) || 0), 0),
    streakDays: getPracticeStreakDays(history, now),
    skills,
    focusItems: focusItems.slice(0, 3),
    pronunciationFocus,
    vocabularyMistakes,
  };
}

function buildProgressActivityMarkup(days) {
  const maxCount = Math.max(1, ...days.map((day) => day.count));
  return `
    <div class="progress-activity-grid" role="img" aria-label="Saved practice sessions over the last 28 days">
      ${days.map((day) => {
        const intensity = day.count ? Math.max(1, Math.ceil((day.count / maxCount) * 4)) : 0;
        const sessionLabel = `${day.count} ${day.count === 1 ? "session" : "sessions"}`;
        return `
          <span
            class="progress-activity-day level-${intensity} ${day.isToday ? "is-today" : ""}"
            aria-label="${escapeHtml(`${day.fullLabel}: ${sessionLabel}`)}"
            title="${escapeHtml(`${day.fullLabel}: ${sessionLabel}`)}">
            <b>${day.day}</b>
          </span>
        `;
      }).join("")}
    </div>
  `;
}

function buildProgressSkillMarkup(skill) {
  const hasData = skill.accuracy !== null;
  const percent = hasData ? Math.round(skill.accuracy * 100) : 0;
  return `
    <div class="progress-skill-row">
      <div class="progress-skill-heading">
        <strong>${escapeHtml(skill.label)}</strong>
        <span>${hasData ? `${percent}% · ${skill.attempts} ${escapeHtml(skill.unit)}` : "No sessions yet"}</span>
      </div>
      <div class="progress-skill-track" aria-label="${escapeHtml(skill.label)} ${hasData ? `${percent}%` : "not started"}">
        <span style="width: ${percent}%"></span>
      </div>
      <button
        class="ghost-btn progress-skill-action"
        type="button"
        data-progress-tool="${escapeHtml(skill.tool)}"
        data-progress-mode="${escapeHtml(skill.mode || "")}">
        ${hasData ? "Practice" : "Start"}
      </button>
    </div>
  `;
}

function buildProgressFocusMarkup(item) {
  return `
    <article class="progress-focus-item">
      <span>${escapeHtml(item.eyebrow)}</span>
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
      <button
        class="secondary-btn"
        type="button"
        data-progress-tool="${escapeHtml(item.tool)}"
        data-progress-mode="${escapeHtml(item.mode || "")}"
        data-progress-view="${escapeHtml(item.view || "")}">
        ${escapeHtml(item.actionLabel)}
      </button>
    </article>
  `;
}

function buildProgressVocabularyMistakeMarkup(item, savedKeys = new Set()) {
  const saved = savedKeys.has(item.key);
  return `
    <article class="progress-word-row">
      <button
        class="icon-btn vocabulary-save-button ${saved ? "active" : ""}"
        type="button"
        data-progress-save-word="${escapeHtml(item.key)}"
        aria-label="${saved ? "Remove" : "Save"} ${escapeHtml(item.zh)} ${saved ? "from" : "to"} saved words"
        aria-pressed="${saved ? "true" : "false"}"
        title="${saved ? "Remove from saved words" : "Save for review"}">
        ${bookmarkIconMarkup(saved)}
      </button>
      <div class="progress-word-term">
        <strong class="chinese-text" lang="zh-CN">${buildVocabularyWordLink(item)}</strong>
        <span>${buildToneColoredPinyinMarkup(item.pinyin)}</span>
      </div>
      <p>${escapeHtml(formatVocabularyMeanings(item))}</p>
      <span class="progress-word-count">${item.misses} ${item.misses === 1 ? "miss" : "misses"}</span>
      <button
        class="icon-btn"
        type="button"
        data-progress-audio="${escapeHtml(item.zh)}"
        aria-label="Play ${escapeHtml(item.zh)}"
        title="Play word">
        ${speakerIconMarkup()}
      </button>
    </article>
  `;
}

function getHistoryRecordPresentation(record) {
  const typeLabel = record.type === "vocabulary"
    ? "Vocabulary quiz"
    : record.type === "review"
      ? record.source === "path" ? "HSK path review" : "Daily review"
      : record.type === "pronunciation"
        ? "Pronunciation"
        : record.type === "map"
          ? "Geography"
          : "Sentence drill";
  const modeLabel = record.type === "vocabulary"
    ? `${record.setLabel} · ${VOCABULARY_MODES[record.quizMode]?.label || record.quizMode}`
    : record.type === "review"
      ? record.source === "saved"
        ? "Saved vocabulary"
        : record.source === "path"
          ? `${formatVocabularyPathSetName(record.setId, record.setLabel)} · Focused review`
          : "Adaptive vocabulary"
      : record.type === "pronunciation"
        ? selectedLevelLabels(record.levels)
      : record.type === "map"
          ? getSelectedMapQuizMode(record.mapQuizMode).targetMetric
          : `${MODES[record.mode]?.label || record.mode}${record.source === "saved" ? " · Saved sentences" : ""}`;
  const resultLabel = record.type === "vocabulary"
    ? buildVocabularyHistoryResultLabel(record)
    : record.type === "review"
      ? `${record.correct}/${record.total} correct · ${formatTimer(record.elapsedSeconds || 0)}`
      : record.type === "pronunciation"
        ? `${Math.round((record.averageScore || 0) * 100)}% recognized · ${record.total} sentences`
        : record.type === "map"
          ? `${record.correct}/${record.total} correct · ${formatTimer(record.elapsedSeconds || 0)}`
          : `${record.correct}/${record.total} correct · ${Math.round((record.averageScore || 0) * 100)}% avg`;
  return { typeLabel, modeLabel, resultLabel };
}

function buildHistorySessionReviewMarkup(record) {
  const answers = Array.isArray(record.answers) ? record.answers : [];
  const mistakes = record.type === "pronunciation"
    ? answers.filter((answer) => (Number(answer.score) || 0) < 0.999 || (answer.missedWords || []).length)
    : answers.filter((answer) => answer.correct === false);
  if (!answers.length) {
    return `<p class="history-session-empty">Answer details are not available for this session.</p>`;
  }
  if (!mistakes.length) {
    return `<p class="history-session-perfect">No mistakes in this session.</p>`;
  }

  return `
    <div class="history-mistake-list">
      ${mistakes.slice(0, 8).map((answer) => {
        if (["vocabulary", "review"].includes(record.type)) {
          const item = {
            zh: answer.zh || "",
            pinyin: answer.pinyin || "",
            meanings: String(answer.meaning || "").split(";").map((meaning) => meaning.trim()).filter(Boolean),
          };
          return `
            <div class="history-mistake-row">
              <div class="history-mistake-word">
                <strong class="chinese-text" lang="zh-CN">${buildVocabularyWordLink(item)}</strong>
                <span>${buildToneColoredPinyinMarkup(item.pinyin)}</span>
              </div>
              <p>${escapeHtml(formatVocabularyMeanings(item))}</p>
              <span>Your answer: ${escapeHtml(answer.answer || "No answer")}</span>
              <button class="icon-btn" type="button" data-progress-audio="${escapeHtml(item.zh)}" aria-label="Play ${escapeHtml(item.zh)}" title="Play word">${speakerIconMarkup()}</button>
            </div>
          `;
        }
        if (record.type === "pronunciation") {
          const missed = (answer.missedWords || []).map((word) => word.text).join(" · ");
          return `
            <div class="history-mistake-row is-sentence">
              <strong class="chinese-text" lang="zh-CN">${escapeHtml(answer.zh || "")}</strong>
              <p>${escapeHtml(answer.en || "")}</p>
              <span>${missed ? `Missed: ${escapeHtml(missed)}` : `Heard: ${escapeHtml(answer.transcript || "No transcript")}`}</span>
              <b>${Math.round((Number(answer.score) || 0) * 100)}%</b>
            </div>
          `;
        }
        if (record.type === "map") {
          return `
            <div class="history-mistake-row is-sentence">
              <strong class="chinese-text" lang="zh-CN">${escapeHtml(answer.prompt || "")}</strong>
              <p>${escapeHtml(answer.pinyin || "")}</p>
              <span>Selected: ${escapeHtml(answer.selected || "No answer")}</span>
            </div>
          `;
        }
        return `
          <div class="history-mistake-row is-sentence">
            <strong>${escapeHtml(answer.prompt || "")}</strong>
            <p>Expected: ${escapeHtml(answer.expected || "")}</p>
            <span>Your answer: ${escapeHtml(answer.answer || "No answer")}</span>
          </div>
        `;
      }).join("")}
      ${mistakes.length > 8 ? `<p class="history-mistake-overflow">${mistakes.length - 8} more ${mistakes.length - 8 === 1 ? "mistake" : "mistakes"} in this session</p>` : ""}
    </div>
  `;
}

function buildHistorySessionMarkup(record) {
  const presentation = getHistoryRecordPresentation(record);
  return `
    <details class="history-session-item">
      <summary>
        <span class="history-session-date">${escapeHtml(formatHistoryDate(record.completedAt))}</span>
        <span class="history-session-title">
          <strong>${escapeHtml(presentation.typeLabel)}</strong>
          <small>${escapeHtml(presentation.modeLabel)}</small>
        </span>
        <span class="history-session-result">${escapeHtml(presentation.resultLabel)}</span>
        <span class="history-session-chevron" aria-hidden="true"></span>
      </summary>
      <div class="history-session-review">
        <div class="history-session-review-heading">
          <strong>Mistake review</strong>
          <span>${Array.isArray(record.answers) ? record.answers.length : 0} saved answers</span>
        </div>
        ${buildHistorySessionReviewMarkup(record)}
      </div>
    </details>
  `;
}

function renderHistoryHome() {
  const history = loadHistoryRecords();
  const review = getReviewDashboardData();
  const progress = getHistoryProgressData(history, Date.now(), review);
  const savedKeys = loadSavedVocabularyKeys();
  const mistakeByKey = new Map(progress.vocabularyMistakes.map((item) => [item.key, item]));
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
  const recentSessions = history.length
    ? history.slice(0, PROGRESS_RECENT_SESSION_LIMIT).map(buildHistorySessionMarkup).join("")
    : `
      <div class="history-empty-state">
        <strong>No saved sessions yet</strong>
        <p>Your completed practice will appear here.</p>
        <button class="primary-btn" type="button" data-progress-tool="review">Start daily review</button>
      </div>
    `;

  app.innerHTML = `
    <section class="workspace-panel history-panel">
      <div class="results-header progress-header">
        <div>
          <p class="progress-kicker">Learning record</p>
          <h2>Learning progress</h2>
          <p>${history.length ? "Patterns from your saved practice and review schedule." : "Complete a session to begin your learning record."}</p>
        </div>
        <div class="result-actions">
          <button class="ghost-btn icon-label-btn" type="button" id="clearHistory" ${history.length ? "" : "disabled"}>
            ${trashIconMarkup()}
            <span>Clear history</span>
          </button>
        </div>
      </div>

      <div class="progress-metric-strip">
        <div>
          <span>Current streak</span>
          <strong>${progress.streakDays}</strong>
          <small>${progress.streakDays === 1 ? "day" : "days"}</small>
        </div>
        <div>
          <span>Last 7 days</span>
          <strong>${progress.weekSessions}</strong>
          <small>${progress.weekSessions === 1 ? "session" : "sessions"}</small>
        </div>
        <div>
          <span>Answers this week</span>
          <strong>${progress.weekAnswers}</strong>
          <small>attempted</small>
        </div>
        <div>
          <span>Strong vocabulary</span>
          <strong>${review.strongCount}</strong>
          <small>of ${review.totalTracked} tracked</small>
        </div>
      </div>

      <section class="progress-activity" aria-labelledby="progressActivityHeading">
        <div class="progress-section-heading">
          <div>
            <h3 id="progressActivityHeading">Practice rhythm</h3>
            <p>${progress.activeDays} active ${progress.activeDays === 1 ? "day" : "days"} in the last four weeks</p>
          </div>
          <span>Last 28 days</span>
        </div>
        ${buildProgressActivityMarkup(progress.activity)}
      </section>

      <div class="progress-main-grid">
        <section class="progress-section" aria-labelledby="progressSkillsHeading">
          <div class="progress-section-heading">
            <div>
              <h3 id="progressSkillsHeading">Skills</h3>
              <p>Accuracy across saved sessions</p>
            </div>
          </div>
          <div class="progress-skill-list">
            ${progress.skills.map(buildProgressSkillMarkup).join("")}
          </div>
        </section>

        <section class="progress-section progress-focus" aria-labelledby="progressFocusHeading">
          <div class="progress-section-heading">
            <div>
              <h3 id="progressFocusHeading">Focus next</h3>
              <p>Priorities from your recent results</p>
            </div>
          </div>
          <div class="progress-focus-list">
            ${progress.focusItems.length
              ? progress.focusItems.map(buildProgressFocusMarkup).join("")
              : buildProgressFocusMarkup({
                  eyebrow: "On track",
                  title: "Keep your practice balanced",
                  detail: "Complete another session to refresh your recommendations.",
                  tool: "review",
                  actionLabel: "Practice now",
                })}
          </div>
        </section>
      </div>

      ${progress.vocabularyMistakes.length ? `
        <section class="progress-section progress-words" aria-labelledby="progressWordsHeading">
          <div class="progress-section-heading">
            <div>
              <h3 id="progressWordsHeading">Words to revisit</h3>
              <p>Most frequently missed across quizzes and reviews</p>
            </div>
            <button class="ghost-btn" type="button" id="saveAllProgressWords">Save all</button>
          </div>
          <div class="progress-word-list">
            ${progress.vocabularyMistakes.map((item) => buildProgressVocabularyMistakeMarkup(item, savedKeys)).join("")}
          </div>
        </section>
      ` : ""}

      <details class="progress-disclosure">
        <summary>
          <span>
            <strong>Vocabulary high scores</strong>
            <small>Fastest completed time per mode and set</small>
          </span>
          <b>${highScores.length}</b>
        </summary>
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
      </details>

      <section class="progress-section history-recent" aria-labelledby="recentSessionsHeading">
        <div class="progress-section-heading">
          <div>
            <h3 id="recentSessionsHeading">Recent sessions</h3>
            <p>Open a session to review its mistakes</p>
          </div>
          <span>Most recent first</span>
        </div>
        <div class="history-session-list">${recentSessions}</div>
      </section>
    </section>
  `;

  document.querySelector("#clearHistory").addEventListener("click", () => {
    if (!window.confirm("Clear saved practice and quiz history from this browser?")) {
      return;
    }

    clearHistoryRecords();
    render();
  });

  document.querySelectorAll("[data-progress-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.progressTool === "vocabulary" && button.dataset.progressView === "library") {
        state.tool = "vocabulary";
        state.vocabularyView = "library";
        state.session = null;
        state.result = null;
        saveSettings();
        render();
        return;
      }
      launchDashboardActivity(button.dataset.progressTool, button.dataset.progressMode || "");
    });
  });
  document.querySelectorAll("[data-progress-save-word]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = mistakeByKey.get(button.dataset.progressSaveWord);
      if (item) {
        toggleSavedVocabularyItem(item);
        render();
      }
    });
  });
  document.querySelector("#saveAllProgressWords")?.addEventListener("click", () => {
    const currentSavedKeys = loadSavedVocabularyKeys();
    progress.vocabularyMistakes.forEach((item) => {
      if (!currentSavedKeys.has(item.key)) {
        toggleSavedVocabularyItem(item);
      }
    });
    render();
  });
  document.querySelectorAll("[data-progress-audio]").forEach((button) => {
    button.addEventListener("click", () => speak(button.dataset.progressAudio, { immediate: true }));
  });
}

function buildHistoryRowMarkup(record) {
  const { typeLabel, modeLabel, resultLabel } = getHistoryRecordPresentation(record);
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
  if (state.session?.type === "review") {
    renderReviewSession();
    return;
  }

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

function isCurrentPronunciationRecognizer(recording, recognizerId) {
  return isActivePronunciationRecording(recording) && recording.activeRecognizerId === recognizerId;
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
    lastRecognitionError: "",
    activeRecognizerId: 0,
    startedAt: Date.now(),
  };
  pronunciationRecordingState = recording;

  session.isListening = true;
  session.recognitionError = "";
  render();

  recording.maxTimerId = window.setTimeout(() => {
    finalizePronunciationRecording(requestId, {
      emptyMessage: getPronunciationEmptyResultMessage(recording),
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
  const recognizerId = recording.activeRecognizerId + 1;
  recording.activeRecognizerId = recognizerId;
  recording.segments.push("");
  pronunciationRecognition = recognition;

  recognition.lang = "zh-CN";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 3;

  recognition.onresult = (event) => {
    if (!isCurrentPronunciationRecognizer(recording, recognizerId)) {
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
    if (!isCurrentPronunciationRecognizer(recording, recognizerId)) {
      return;
    }

    if (recording.transcript) {
      schedulePronunciationFinalization(recording, 0);
      return;
    }

    handlePronunciationRecognitionError("No Chinese speech was recognized. Try the sentence again.", requestId);
  };

  recognition.onerror = (event) => {
    if (!isCurrentPronunciationRecognizer(recording, recognizerId)) {
      return;
    }

    const error = event.error || "";

    if (error === "aborted") {
      return;
    }

    if (recording.transcript) {
      schedulePronunciationFinalization(recording, error === "no-speech" ? 400 : 0);
      return;
    }

    recording.lastRecognitionError = error;
    if (shouldRetryPronunciationRecognition(recording, error)) {
      restartPronunciationRecognizerAfterDelay(recording, getPronunciationRestartDelay(error));
      return;
    }

    handlePronunciationRecognitionError(getPronunciationRecognitionErrorMessage(error), requestId);
  };

  recognition.onend = () => {
    if (!isCurrentPronunciationRecognizer(recording, recognizerId)) {
      return;
    }

    if (pronunciationRecognition === recognition) {
      pronunciationRecognition = null;
    }

    if (recording.restartTimerId) {
      return;
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

    recording.lastRecognitionError = recording.lastRecognitionError || "ended";
    if (shouldRetryPronunciationRecognition(recording, "ended")) {
      restartPronunciationRecognizerAfterDelay(recording);
      return;
    }

    session.isListening = false;
    session.recognitionError = getPronunciationEmptyResultMessage(recording);
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

function shouldRetryPronunciationRecognition(recording, error = "") {
  if (
    !isActivePronunciationRecording(recording) ||
    recording.manualStopRequested ||
    PRONUNCIATION_TERMINAL_ERRORS.has(error)
  ) {
    return false;
  }

  return Date.now() - recording.startedAt < PRONUNCIATION_MAX_RECORDING_MS - PRONUNCIATION_RESTART_DELAY_MS;
}

function getPronunciationRestartDelay(error = "") {
  return error ? 450 : PRONUNCIATION_RESTART_DELAY_MS;
}

function getPronunciationRecognitionErrorMessage(error = "") {
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "Microphone permission was blocked for this site.";
  }

  if (error === "audio-capture") {
    return "No microphone was found. Connect or enable a microphone and try again.";
  }

  if (error === "language-not-supported") {
    return "Chinese speech recognition is not supported by this browser.";
  }

  if (error === "network") {
    return "Speech recognition could not connect. Check your connection or try Chrome or Edge.";
  }

  if (error === "no-speech" || error === "ended") {
    return "No speech was detected. Try speaking a little closer to the microphone.";
  }

  return "Speech recognition could not read the sentence. Try again, or try Chrome or Edge with microphone permission enabled.";
}

function getPronunciationEmptyResultMessage(recording) {
  return getPronunciationRecognitionErrorMessage(recording?.lastRecognitionError || "no-speech");
}

function restartPronunciationRecognizerAfterDelay(recording, delay = PRONUNCIATION_RESTART_DELAY_MS) {
  if (!isActivePronunciationRecording(recording) || recording.restartTimerId) {
    return;
  }

  if (Date.now() - recording.startedAt >= PRONUNCIATION_MAX_RECORDING_MS - PRONUNCIATION_RESTART_DELAY_MS) {
    return;
  }

  recording.restartTimerId = window.setTimeout(() => {
    recording.restartTimerId = 0;
    if (isActivePronunciationRecording(recording) && !recording.manualStopRequested) {
      recording.lastRecognitionError = "";
      startPronunciationRecognizer(recording);
    }
  }, delay);
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
          <g class="china-small-region-selectors">
            ${buildChinaMapSmallRegionSelectors(mapData.features, session)}
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

function buildChinaMapSmallRegionSelectors(features, session) {
  if (!shouldEnableMapProvinceSelection(session)) {
    return "";
  }

  return CHINA_SMALL_REGION_SELECTORS.map((selector) => {
    const feature = getMapFeatureForProvinceId(features, selector.provinceId);
    const province = feature ? getProvinceForMapFeature(feature) : null;
    const center = feature?.properties?.center;
    if (!province || !Array.isArray(center)) {
      return "";
    }

    const anchor = projectMapCoordinate(center[0], center[1], CHINA_MAINLAND_FRAME);
    const status = getMapTargetStatus("province", province.id, session);
    const classes = [
      "china-small-region-selector",
      status ? `is-${status}` : "",
    ].filter(Boolean).join(" ");
    const leaderPath = [
      `M${formatMapNumber(anchor.x)} ${formatMapNumber(anchor.y)}`,
      `C${formatMapNumber(selector.curveX)} ${formatMapNumber(selector.curveY)}`,
      `${formatMapNumber(selector.selectorX - 16)} ${formatMapNumber(selector.selectorY)}`,
      `${formatMapNumber(selector.selectorX)} ${formatMapNumber(selector.selectorY)}`,
    ].join(" ");

    return `
      <g
        class="${classes}"
        data-map-province-id="${escapeHtml(province.id)}"
        role="button"
        tabindex="0"
        aria-label="Small provincial-level region selector"
      >
        <path class="china-small-region-leader" d="${leaderPath}"></path>
        <circle class="china-small-region-anchor" cx="${formatMapNumber(anchor.x)}" cy="${formatMapNumber(anchor.y)}" r="3.2"></circle>
        <circle class="china-small-region-hit" cx="${formatMapNumber(selector.selectorX)}" cy="${formatMapNumber(selector.selectorY)}" r="34"></circle>
        <circle class="china-small-region-ring" cx="${formatMapNumber(selector.selectorX)}" cy="${formatMapNumber(selector.selectorY)}" r="16.5"></circle>
        <circle class="china-small-region-dot" cx="${formatMapNumber(selector.selectorX)}" cy="${formatMapNumber(selector.selectorY)}" r="5"></circle>
      </g>
    `;
  }).join("");
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

function getMapFeatureForProvinceId(features, provinceId) {
  return features.find((feature) => getProvinceForMapFeature(feature)?.id === provinceId) || null;
}

function buildChinaMapCityPins(session) {
  return CHINA_CITIES.map((city) => {
    const status = getMapTargetStatus("city", city.id, session);
    const point = projectMapCoordinate(city.lng, city.lat, CHINA_MAINLAND_FRAME);
    const rawLabel = city.name.replace(/市$/, "");
    const label = status ? escapeHtml(rawLabel) : "";
    const labelWidth = Math.max(42, rawLabel.length * 15 + 18);
    const labelX = status === "correct" ? 20 : 11;
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
        ${status === "correct" ? `<circle class="china-city-pin-halo" r="18"></circle>` : ""}
        <circle class="china-city-pin-ring" r="7"></circle>
        <circle class="china-city-pin-dot" r="4"></circle>
        ${status === "correct" ? `<rect class="china-city-pin-label-backdrop" x="9" y="-14" width="${formatMapNumber(labelWidth)}" height="24" rx="12"></rect>` : ""}
        ${label ? `<text class="china-city-pin-label" x="${labelX}" y="4">${label}</text>` : ""}
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
  const correctCityMarkup = !assessment.correct && current.kind === "city"
    ? `
      <div class="map-correct-answer-card">
        <span>Correct city</span>
        <strong class="chinese-text" lang="zh-CN">${escapeHtml(current.name)}</strong>
        <em>${escapeHtml(current.pinyin)}</em>
      </div>
    `
    : "";

  return `
    <section class="map-feedback ${status}" role="status" aria-live="polite">
      <div>
        <strong>${title}</strong>
        <span>${escapeHtml(current.name)} · ${escapeHtml(current.pinyin)}</span>
      </div>
      ${
        assessment.correct
          ? ""
          : `
            ${correctCityMarkup}
            <p>You selected ${escapeHtml(assessment.selectedName)}.</p>
          `
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

function buildAnnotatedChineseMarkup(value, { showPinyin = true } = {}) {
  hydrateWordDataFromWindow();
  const tokens = tokenizeAnnotatedChinese(value);
  const textMarkup = tokens.map(buildAnnotatedTextTokenMarkup).join("");
  const pinyinMarkup = tokens.map(buildAnnotatedPinyinTokenMarkup).join("");

  return `
    <div class="annotated-chinese chinese-text" lang="zh-CN">
      <p class="annotated-hanzi-line">${textMarkup}</p>
      ${showPinyin ? `<p class="annotated-pinyin-line">${pinyinMarkup}</p>` : ""}
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
  const isSavedSentenceSession = result.source === "saved";
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
          <h2>${isSavedSentenceSession ? "Saved Sentence Results" : `${MODES[result.mode].label} Results`}</h2>
          <p>${correct} correct out of ${result.answers.length}; average score ${percent}%.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>${isSavedSentenceSession ? "Practice saved again" : "Start another session"}</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">${isSavedSentenceSession ? "Back to sentence library" : "Back to trainer"}</button>
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

  document.querySelector("#restartSession").addEventListener("click", isSavedSentenceSession ? startSavedSentenceSession : startSession);
  document.querySelector("#backToModes").addEventListener("click", () => {
    state.result = null;
    state.session = null;
    if (isSavedSentenceSession) {
      state.drillView = "library";
      saveSettings();
    }
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
          <td class="chinese-text">${buildVocabularyWordLink(item)}</td>
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
          <td class="chinese-text">${buildVocabularyWordLink(item)}</td>
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

function getAllVocabularyReviewItems() {
  const seen = new Set();
  const items = [];

  VOCABULARY_QUIZ_SETS.forEach((set) => {
    getVocabularySetReviewItems(set).forEach((item) => {
      const key = reviewItemKey(item);
      if (!key || seen.has(key)) {
        return;
      }

      seen.add(key);
      items.push(item);
    });
  });

  return items;
}

function getVocabularySetReviewItems(set) {
  return (set?.words || []).map((item) => ({
    ...item,
    reviewKey: reviewItemKey(item),
    setId: set.id,
    setLabel: set.label,
    level: set.level,
  }));
}

function reviewItemKey(item) {
  const zh = String(item?.zh || "").trim();
  const pinyin = normalizePinyinForCompare(item?.pinyin || "");
  return zh && pinyin ? `${zh}|${pinyin}` : "";
}

function loadReviewProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(REVIEW_PROGRESS_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function saveReviewProgress(progress) {
  try {
    localStorage.setItem(REVIEW_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Review scheduling remains usable for the current session if browser storage is unavailable.
  }
}

function ensureReviewProgress() {
  const progress = loadReviewProgress();
  if (Object.keys(progress).length) {
    return progress;
  }

  const vocabularyByKey = new Map(getAllVocabularyReviewItems().map((item) => [reviewItemKey(item), item]));
  const history = loadHistoryRecords()
    .filter((record) => record.type === "vocabulary")
    .sort((a, b) => Date.parse(a.completedAt || 0) - Date.parse(b.completedAt || 0));

  history.forEach((record) => {
    (record.answers || []).forEach((answer) => {
      const key = reviewItemKey(answer);
      const sourceItem = vocabularyByKey.get(key) || {
        zh: answer.zh,
        pinyin: answer.pinyin,
        meanings: String(answer.meaning || "").split(";").map((meaning) => meaning.trim()).filter(Boolean),
      };
      if (!key || !sourceItem.zh || !sourceItem.pinyin) {
        return;
      }

      applyReviewAttempt(progress, sourceItem, Boolean(answer.correct), {
        mode: record.quizMode,
        now: Date.parse(record.completedAt || "") || Date.now(),
      });
    });
  });

  if (Object.keys(progress).length) {
    saveReviewProgress(progress);
  }
  return progress;
}

function applyReviewAttempt(progress, item, correct, { mode = "pinyin", now = Date.now() } = {}) {
  const key = reviewItemKey(item);
  if (!key) {
    return null;
  }

  const previous = progress[key] || {};
  const previousStage = clamp(Number(previous.stage) || 0, 0, REVIEW_INTERVAL_DAYS.length - 1);
  const nextStage = correct
    ? Math.min(REVIEW_INTERVAL_DAYS.length - 1, previousStage + 1)
    : 0;
  const intervalDays = correct ? REVIEW_INTERVAL_DAYS[nextStage] : 0;
  const nextRecord = {
    key,
    zh: item.zh,
    pinyin: item.pinyin,
    meanings: getVocabularyMeaningCandidates(item),
    setId: item.setId || previous.setId || "",
    setLabel: item.setLabel || previous.setLabel || "",
    stage: nextStage,
    dueAt: now + intervalDays * DAY_IN_MS,
    lastReviewedAt: now,
    lastMode: mode,
    attempts: (Number(previous.attempts) || 0) + 1,
    correct: (Number(previous.correct) || 0) + (correct ? 1 : 0),
    streak: correct ? (Number(previous.streak) || 0) + 1 : 0,
    lapses: (Number(previous.lapses) || 0) + (correct ? 0 : 1),
  };
  progress[key] = nextRecord;

  return {
    previousStage,
    reviewStage: nextStage,
    nextDueAt: nextRecord.dueAt,
    record: nextRecord,
  };
}

function updateReviewProgressFromVocabularyResult(result) {
  if (result?.type !== "vocabulary") {
    return;
  }

  const progress = ensureReviewProgress();
  const now = Date.now();
  if (result.quizMode === "pinyin") {
    const foundIds = new Set(result.foundIds || []);
    const missedIds = new Set(result.missedIds || []);
    result.items.forEach((item, index) => {
      const id = vocabularyItemId(item, index);
      if (!foundIds.has(id) && !missedIds.has(id)) {
        return;
      }
      applyReviewAttempt(progress, item, foundIds.has(id), { mode: "pinyin", now });
    });
  } else {
    (result.answers || []).forEach((answer) => {
      const item = answer.item || result.items?.[answer.itemIndex];
      if (item) {
        applyReviewAttempt(progress, item, Boolean(answer.correct), { mode: "meaning", now });
      }
    });
  }
  saveReviewProgress(progress);
}

function buildReviewQueue(progress = ensureReviewProgress(), now = Date.now(), vocabulary = getAllVocabularyReviewItems()) {
  const due = [];
  const unseen = [];
  const upcoming = [];

  vocabulary.forEach((item, sourceIndex) => {
    const record = progress[reviewItemKey(item)];
    if (!record) {
      unseen.push({ item, record: null, sourceIndex, statusLabel: "New", statusClass: "is-new" });
      return;
    }

    if ((Number(record.dueAt) || 0) <= now) {
      due.push({ item, record, sourceIndex, statusLabel: "Due", statusClass: "is-due" });
      return;
    }

    upcoming.push({
      item,
      record,
      sourceIndex,
      statusLabel: formatReviewDueLabel(record.dueAt, true, now),
      statusClass: "is-upcoming",
    });
  });

  due.sort((a, b) =>
    (Number(b.record?.lapses) || 0) - (Number(a.record?.lapses) || 0) ||
    (Number(a.record?.dueAt) || 0) - (Number(b.record?.dueAt) || 0) ||
    a.sourceIndex - b.sourceIndex,
  );
  upcoming.sort((a, b) =>
    (Number(a.record?.dueAt) || Infinity) - (Number(b.record?.dueAt) || Infinity) ||
    a.sourceIndex - b.sourceIndex,
  );

  return [...due, ...unseen, ...upcoming];
}

function getReviewDashboardData(now = Date.now()) {
  const progress = ensureReviewProgress();
  const records = Object.values(progress);
  const queue = buildReviewQueue(progress, now);
  const today = localDateKey(now);

  return {
    queue,
    totalTracked: records.length,
    dueCount: records.filter((record) => (Number(record.dueAt) || 0) <= now).length,
    learningCount: records.filter((record) => (Number(record.stage) || 0) < 4).length,
    strongCount: records.filter((record) => (Number(record.stage) || 0) >= 4).length,
    reviewedToday: records.filter((record) => localDateKey(record.lastReviewedAt) === today).length,
    streakDays: getReviewStreakDays(records, now),
  };
}

function getReviewStreakDays(records, now = Date.now()) {
  const activeDays = new Set(records.map((record) => localDateKey(record.lastReviewedAt)).filter(Boolean));
  if (!activeDays.size) {
    return 0;
  }

  let cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (!activeDays.has(localDateKey(cursor.getTime()))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (activeDays.has(localDateKey(cursor.getTime()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function localDateKey(timestamp) {
  const date = new Date(Number(timestamp));
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatReviewDueLabel(timestamp, correct = true, now = Date.now()) {
  if (!correct || !timestamp || timestamp <= now) {
    return "Due now";
  }

  const days = Math.max(1, Math.round((timestamp - now) / DAY_IN_MS));
  return days === 1 ? "Tomorrow" : `In ${days} days`;
}

function chooseReviewMode(record, index) {
  if (record?.lastMode === "pinyin") {
    return "meaning";
  }
  if (record?.lastMode === "meaning") {
    return "pinyin";
  }
  return index % 2 === 0 ? "pinyin" : "meaning";
}

function startReviewSession() {
  const dashboard = getReviewDashboardData();
  const selected = dashboard.queue.slice(0, REVIEW_SESSION_LENGTH);
  if (!selected.length) {
    return;
  }

  startReviewItems(selected.map((entry, index) => ({
    ...entry.item,
    reviewMode: chooseReviewMode(entry.record, index),
  })), "adaptive");
}

function startReviewItems(items, source = "adaptive", { setId = "", setLabel = "" } = {}) {
  if (!items.length) {
    return;
  }

  stopPronunciationRecognition();
  stopSpeech();
  state.result = null;
  state.session = {
    type: "review",
    source,
    setId,
    setLabel,
    items,
    index: 0,
    answers: [],
    choiceSets: new Map(),
    currentAssessment: null,
    startedAt: Date.now(),
  };
  render();
  if (state.session.items[0].reviewMode === "meaning") {
    speak(state.session.items[0].zh, { immediate: true });
  }
}

function getReviewChoiceSet(session, index) {
  if (session?.type !== "review" || index < 0 || index >= session.items.length) {
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

function submitReviewPinyin(answer) {
  const session = state.session;
  const item = session?.items?.[session.index];
  if (session?.type !== "review" || item?.reviewMode !== "pinyin" || session.currentAssessment) {
    return;
  }
  const trimmed = String(answer || "").trim();
  if (!trimmed) {
    return;
  }
  commitReviewAssessment(session, item, {
    ...assessVocabularyAnswer(trimmed, item, "pinyin"),
    reviewMode: "pinyin",
  });
}

function submitReviewChoiceByShortcut(shortcut) {
  const session = state.session;
  if (session?.type !== "review" || session.currentAssessment) {
    return;
  }
  const choice = getReviewChoiceSet(session, session.index).find((option) => option.shortcut === shortcut);
  if (choice) {
    submitReviewChoice(choice.id);
  }
}

function submitReviewChoice(choiceId) {
  const session = state.session;
  const item = session?.items?.[session.index];
  if (session?.type !== "review" || item?.reviewMode !== "meaning" || session.currentAssessment) {
    return;
  }
  const choice = getReviewChoiceSet(session, session.index).find((option) => option.id === choiceId);
  if (!choice) {
    return;
  }
  commitReviewAssessment(session, item, {
    quizMode: "meaning",
    reviewMode: "meaning",
    answer: choice.text,
    choiceId: choice.id,
    score: choice.correct ? 1 : 0,
    correct: choice.correct,
  });
}

function commitReviewAssessment(session, item, assessment) {
  const progress = ensureReviewProgress();
  const schedule = applyReviewAttempt(progress, item, assessment.correct, {
    mode: assessment.reviewMode,
    now: Date.now(),
  });
  saveReviewProgress(progress);
  const completedAssessment = {
    ...assessment,
    previousStage: schedule?.previousStage || 0,
    reviewStage: schedule?.reviewStage || 0,
    nextDueAt: schedule?.nextDueAt || Date.now(),
  };
  session.currentAssessment = completedAssessment;
  session.answers.push({ ...completedAssessment, item, itemIndex: session.index });
  render();
}

function startActiveSession() {
  if (state.tool === "dashboard") {
    const dashboard = getDashboardData();
    launchDashboardActivity(dashboard.nextActivity.tool, dashboard.nextActivity.mode || "");
    return;
  }

  if (state.tool === "vocabulary") {
    if (state.vocabularyView === "library") {
      startSavedVocabularyReview();
    } else if (state.vocabularyView === "path") {
      const recommended = getRecommendedVocabularyPathPart(getVocabularyPathData());
      if (recommended) {
        startVocabularySetReview(recommended.set.id);
      }
    } else {
      startVocabularySession();
    }
    return;
  }

  if (state.tool === "review") {
    startReviewSession();
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

  if (state.tool === "drill" && state.drillView === "library") {
    startSavedSentenceSession();
  } else {
    startSession();
  }
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
  startSentenceDrillItems(items, "random");
}

async function startSavedSentenceSession() {
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
  const savedIds = loadSavedSentenceIds();
  const items = shuffle(getSavedSentenceItems(SENTENCES, savedIds, state.selectedLevels))
    .slice(0, SESSION_LENGTH);
  if (!items.length) {
    render();
    return;
  }

  startSentenceDrillItems(items, "saved");
}

function startSentenceDrillItems(items, source = "random") {
  if (!items.length) {
    return;
  }

  state.result = null;
  state.session = {
    type: "drill",
    source,
    mode: state.mode,
    levels: uniqueStrings(items.map((item) => item.level)),
    items,
    index: 0,
    answers: [],
    currentAssessment: null,
    startedAt: Date.now(),
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

  if (session.type === "review") {
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
    render();
    if (session.items[session.index].reviewMode === "meaning") {
      speak(session.items[session.index].zh, { immediate: true });
    }
    return;
  }

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
  if (session?.type === "review") {
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
    return;
  }

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
  if (session.type === "review") {
    return {
      type: "review",
      source: session.source || "adaptive",
      setId: session.setId || "",
      setLabel: session.setLabel || "",
      items: session.items,
      answers: session.answers,
      elapsedSeconds: Math.max(0, Math.round((Date.now() - session.startedAt) / 1000)),
      total: session.items.length,
    };
  }

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
    source: session.source || "random",
    mode: session.mode,
    levels: session.levels,
    answers: session.answers,
    elapsedSeconds: session.startedAt
      ? Math.max(0, Math.round((Date.now() - session.startedAt) / 1000))
      : 0,
  };
}

function saveHistoryResult(result) {
  try {
    if (result.type === "vocabulary") {
      updateReviewProgressFromVocabularyResult(result);
    }
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

  if (result.type === "review") {
    const correct = result.answers.filter((answer) => answer.correct).length;
    return {
      id,
      type: "review",
      source: result.source || "adaptive",
      setId: result.setId || "",
      setLabel: result.setLabel || "",
      completedAt,
      total: result.answers.length,
      correct,
      elapsedSeconds: result.elapsedSeconds || 0,
      answers: result.answers.map((answer, index) => ({
        index,
        zh: answer.item.zh,
        pinyin: answer.item.pinyin,
        meaning: formatVocabularyMeanings(answer.item),
        reviewMode: answer.reviewMode,
        answer: answer.answer || "",
        correct: answer.correct,
        score: answer.score,
        previousStage: answer.previousStage,
        reviewStage: answer.reviewStage,
        nextDueAt: answer.nextDueAt,
      })),
    };
  }

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
    source: result.source || "random",
    completedAt,
    mode: result.mode,
    levels: result.levels,
    total: result.answers.length,
    correct,
    averageScore,
    elapsedSeconds: result.elapsedSeconds || 0,
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
    return Array.isArray(parsed)
      ? parsed.filter((record) => record && SUPPORTED_HISTORY_TYPES.has(record.type))
      : [];
  } catch {
    return [];
  }
}

function saveHistoryRecords(records) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}

function clearHistoryRecords() {
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(REVIEW_PROGRESS_KEY);
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

function buildMdbgWordUrl(item) {
  return `${MDBG_WORD_DICTIONARY_URL}?page=worddict&wdqb=${encodeURIComponent(item?.zh || "")}&wdrst=0`;
}

function buildVocabularyWordLink(item) {
  const word = item?.zh || "";
  return `
    <a
      class="vocab-word-link"
      href="${escapeHtml(buildMdbgWordUrl(item))}"
      target="_blank"
      rel="noopener noreferrer"
      title="Open ${escapeHtml(word)} on MDBG"
    >${escapeHtml(word)}</a>
  `;
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
      <td class="chinese-text">${buildVocabularyWordLink(item)}</td>
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
    const characterMarkup = hiddenCharacter && !answered
      ? escapeHtml(characterText)
      : buildVocabularyWordLink(item);
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

    row.addEventListener("click", (event) => {
      if (event.target.closest?.("a")) {
        return;
      }
      selectVocabularyRow(index);
    });
    row.addEventListener("keydown", (event) => {
      if (event.target.closest?.("a")) {
        return;
      }
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
