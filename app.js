"use strict";

const SESSION_LENGTH = 30;
const PRONUNCIATION_SESSION_LENGTH = 15;
const TONE_LISTENING_SESSION_LENGTH = 15;
const GRAMMAR_SESSION_LENGTH = 10;
const PLACEMENT_SESSION_LENGTH = 30;
const PLACEMENT_VOCABULARY_PER_LEVEL = 6;
const PLACEMENT_GRAMMAR_PER_LEVEL = 4;
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
const EXAM_DRAFT_KEY = "chineseTrainerHskExamDraft";
const LEARNING_BACKUP_APP_ID = "chinese-trainer";
const LEARNING_BACKUP_VERSION = 1;
const LEARNING_BACKUP_MAX_BYTES = 8 * 1024 * 1024;
const HISTORY_LIMIT = 100;
const SUPPORTED_HISTORY_TYPES = new Set(["drill", "vocabulary", "review", "grammar", "placement", "pronunciation", "tone", "map", "exam", "reader"]);
const REVIEW_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30, 60];
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const STUDY_FOCUSES = {
  balanced: {
    label: "Balanced",
    description: "Vocabulary, pronunciation, and grammar or sentence practice.",
  },
  speaking: {
    label: "Listening & speaking",
    description: "Pronunciation, audio comprehension, and active vocabulary recall.",
  },
  literacy: {
    label: "Reading & writing",
    description: "Written sentence production, grammar, and vocabulary recall.",
  },
};

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
const SENTENCE_LIBRARY_PAGE_SIZE = 16;
const DRILL_VIEWS = new Set(["practice", "library"]);
const PRONUNCIATION_VIEWS = new Set(["speaking", "tone"]);

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
  grammar: {
    label: "Grammar Lab",
  },
  reader: {
    label: "Graded Readers",
  },
  exam: {
    label: "Mock HSK Exam",
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

const PLACEMENT_VOCABULARY = {
  1: [
    { zh: "人", meaning: "person" },
    { zh: "学校", meaning: "school" },
    { zh: "喜欢", meaning: "to like" },
    { zh: "朋友", meaning: "friend" },
    { zh: "今天", meaning: "today" },
    { zh: "工作", meaning: "to work; job" },
    { zh: "医生", meaning: "doctor" },
    { zh: "觉得", meaning: "to think; feel" },
    { zh: "电影", meaning: "movie" },
    { zh: "饭店", meaning: "restaurant" },
    { zh: "火车", meaning: "train" },
    { zh: "买", meaning: "to buy" },
  ],
  2: [
    { zh: "爱好", meaning: "hobby; interest" },
    { zh: "帮忙", meaning: "to help" },
    { zh: "比", meaning: "to compare; than" },
    { zh: "车站", meaning: "station" },
    { zh: "地铁", meaning: "subway" },
    { zh: "考试", meaning: "exam; test" },
    { zh: "机场", meaning: "airport" },
    { zh: "介绍", meaning: "to introduce" },
    { zh: "篮球", meaning: "basketball" },
    { zh: "旅游", meaning: "to travel; tourism" },
    { zh: "可能", meaning: "possible; might" },
    { zh: "跳舞", meaning: "to dance" },
  ],
  3: [
    { zh: "安静", meaning: "quiet" },
    { zh: "安全", meaning: "safe" },
    { zh: "办法", meaning: "method; solution" },
    { zh: "必须", meaning: "must" },
    { zh: "参加", meaning: "to participate" },
    { zh: "成绩", meaning: "result; grade" },
    { zh: "出发", meaning: "to set out" },
    { zh: "打算", meaning: "to plan" },
    { zh: "发现", meaning: "to discover" },
    { zh: "回答", meaning: "to answer" },
    { zh: "解决", meaning: "to solve" },
    { zh: "照顾", meaning: "to look after" },
  ],
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
const VOCABULARY_CURRICULUM = window.VOCABULARY_CURRICULUM && typeof window.VOCABULARY_CURRICULUM === "object"
  ? window.VOCABULARY_CURRICULUM
  : null;
const VOCABULARY_QUIZ_SETS = buildVocabularyQuizSets(RAW_VOCABULARY_QUIZ_SETS);
const GRAMMAR_LESSONS = Array.isArray(window.GRAMMAR_LESSONS)
  ? window.GRAMMAR_LESSONS
  : [];
const HSK_MOCK_EXAMS = window.HSK_MOCK_EXAMS && typeof window.HSK_MOCK_EXAMS === "object"
  ? window.HSK_MOCK_EXAMS
  : { levels: {}, scenes: {}, speaking: null };
const GRADED_READERS = Array.isArray(window.GRADED_READERS)
  ? window.GRADED_READERS
  : [];
const HSK_EXAM_LEVELS = [1, 2, 3];
const VOCABULARY_ORDER_OPTIONS = {
  random: "Random order",
  list: "List order",
};
const DEFAULT_VOCABULARY_ORDER = "random";
const VOCABULARY_CHOICE_COUNT = 5;
const VOCABULARY_SECONDS_PER_WORD = 6.85;
const VOCABULARY_MIN_TIMER_SECONDS = 300;
const VOCABULARY_PREVIEW_LIMIT = 12;
const VOCABULARY_LIBRARY_PAGE_SIZE = 24;
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
const GLOBAL_SEARCH_RECENTS_KEY = "chineseTrainerSearchRecents";
const GLOBAL_SEARCH_RESULT_LIMIT = 5;
const GLOBAL_SEARCH_RECENT_LIMIT = 6;
const loadedScripts = new Map();
let sentenceDataPromise = null;
let sentenceDataLoaded = false;
let wordDataPromise = null;
let wordDataLoaded = false;
let vocabularyTimerId = 0;
let examTimerId = 0;
let speechRequestId = 0;
let pronunciationRecognition = null;
let pronunciationRecognitionRequestId = 0;
let pronunciationRecordingState = null;
let hskSpeakingMediaRecorder = null;
let hskSpeakingMediaStream = null;
let hskSpeakingChunks = [];
let hskSpeakingStopCallback = null;
let deferredPwaInstallPrompt = null;
let pwaRegistration = null;
let pwaOfflineReady = false;
let pwaUpdateRequested = false;
let pwaReloading = false;
let globalSearchDataLoading = false;
let globalSearchView = "search";
let globalSearchActiveIndex = 0;
let globalSearchFlatResults = [];
let globalSearchRestoreFocus = null;
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
const PINYIN_VOWEL_TONE_MARKS = {
  a: ["a", "ā", "á", "ǎ", "à"],
  e: ["e", "ē", "é", "ě", "è"],
  i: ["i", "ī", "í", "ǐ", "ì"],
  o: ["o", "ō", "ó", "ǒ", "ò"],
  u: ["u", "ū", "ú", "ǔ", "ù"],
  ü: ["ü", "ǖ", "ǘ", "ǚ", "ǜ"],
  n: ["n", "n", "ń", "ň", "ǹ"],
  m: ["m", "m", "ḿ", "m", "m"],
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
  studyTargetLevel: 1,
  studyFocus: "balanced",
  onboardingComplete: false,
  studyPlanLevelChoice: "1",
  studyPlanFocusChoice: "balanced",
  planSetupOpen: false,
  grammarLevel: 1,
  grammarLessonId: "",
  readerLevel: 1,
  readerId: "",
  readerShowPinyin: false,
  readerShowTranslation: false,
  examLevel: 1,
  examMode: "written",
  examScreen: "home",
  mapQuizMode: DEFAULT_MAP_QUIZ_MODE,
  mapShowPinyinNames: false,
  pronunciationView: "speaking",
  pronunciationShowPinyin: true,
  historyTypeFilter: "all",
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
const pwaAccess = document.querySelector("#pwaAccess");
const pwaStatus = document.querySelector("#pwaStatus");
const installAppButton = document.querySelector("#installApp");
const refreshAppButton = document.querySelector("#refreshApp");
const globalSearchTrigger = document.querySelector("#globalSearchTrigger");
const globalSearchDialog = document.querySelector("#globalSearchDialog");
const globalSearchInput = document.querySelector("#globalSearchInput");
const globalSearchResults = document.querySelector("#globalSearchResults");
const globalSearchClose = document.querySelector("#globalSearchClose");
const globalSearchSavedCount = document.querySelector("#globalSearchSavedCount");
const globalSearchSavedActions = document.querySelector("#globalSearchSavedActions");
const toolNavigation = document.querySelector("#toolNavigation");
const mobileNavToggle = document.querySelector("#mobileNavToggle");
const mobileNavClose = document.querySelector("#mobileNavClose");
const mobileNavBackdrop = document.querySelector("#mobileNavBackdrop");
const mobileMoreButton = document.querySelector("#mobileMoreButton");
const sidebarProfileButton = document.querySelector("#sidebarProfileButton");
const sidebarSettingsButton = document.querySelector("#sidebarSettingsButton");
const sidebarLevelLabel = document.querySelector("#sidebarLevelLabel");
const sidebarStreakCount = document.querySelector("#sidebarStreakCount");
const sidebarSessionCount = document.querySelector("#sidebarSessionCount");
const globalNotificationSummary = document.querySelector("#globalNotificationSummary");
const globalNotificationAction = document.querySelector("#globalNotificationAction");
const mobileNavigationQuery = typeof window.matchMedia === "function"
  ? window.matchMedia("(max-width: 980px)")
  : { matches: false, addEventListener() {} };
let mobileNavigationRestoreFocus = null;

function init() {
  if (
    !app ||
    !levelOptions ||
    !voiceSpeed ||
    !vocabularyOrder ||
    !vocabularyHideTranslations ||
    !pronunciationShowPinyin ||
    !globalSearchTrigger ||
    !globalSearchDialog ||
    !globalSearchInput ||
    !globalSearchResults ||
    !globalSearchClose ||
    !globalSearchSavedCount ||
    !globalSearchSavedActions
  ) {
    throw new Error("Mandarin Trainer could not find its required page elements.");
  }

  loadSettings();
  renderLevelOptions();
  syncVocabularyOptionControls();
  bindTopLevelControls();
  bindMobileNavigation();
  bindGlobalSearch();
  bindGlossTooltipAlignment();
  bindPwaLifecycle();
  bindAccountState();
  loadVoices();
  primeVoicesOnFirstInteraction();
  render();
}

function loadSettings() {
  let hadSavedSettings = false;
  try {
    const rawSettings = localStorage.getItem(SETTINGS_KEY);
    hadSavedSettings = Boolean(rawSettings);
    const saved = JSON.parse(rawSettings || "{}");
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
    if ([1, 2, 3].includes(Number(saved.grammarLevel))) {
      state.grammarLevel = Number(saved.grammarLevel);
    }
    if (HSK_EXAM_LEVELS.includes(Number(saved.examLevel))) {
      state.examLevel = Number(saved.examLevel);
    }
    if (["written", "speaking"].includes(saved.examMode)) {
      state.examMode = saved.examMode;
    }
    state.studyTargetLevel = [1, 2, 3].includes(Number(saved.studyTargetLevel))
      ? Number(saved.studyTargetLevel)
      : state.grammarLevel;
    state.studyFocus = STUDY_FOCUSES[saved.studyFocus] ? saved.studyFocus : "balanced";
    state.onboardingComplete = typeof saved.onboardingComplete === "boolean"
      ? saved.onboardingComplete
      : hadSavedSettings;
    if (saved.grammarLessonId && GRAMMAR_LESSONS.some((lesson) => lesson.id === saved.grammarLessonId)) {
      state.grammarLessonId = saved.grammarLessonId;
    }
    if ([1, 2, 3].includes(Number(saved.readerLevel))) {
      state.readerLevel = Number(saved.readerLevel);
    }
    if (typeof saved.readerShowPinyin === "boolean") {
      state.readerShowPinyin = saved.readerShowPinyin;
    }
    if (typeof saved.readerShowTranslation === "boolean") {
      state.readerShowTranslation = saved.readerShowTranslation;
    }
    if (typeof saved.mapShowPinyinNames === "boolean") {
      state.mapShowPinyinNames = saved.mapShowPinyinNames;
    }
    if (PRONUNCIATION_VIEWS.has(saved.pronunciationView)) {
      state.pronunciationView = saved.pronunciationView;
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
    state.onboardingComplete = hadSavedSettings;
  }

  if (!state.selectedLevels.size) {
    state.selectedLevels.add("beginner");
  }

  if (!state.vocabularySetId && VOCABULARY_QUIZ_SETS[0]) {
    state.vocabularySetId = VOCABULARY_QUIZ_SETS[0].id;
  }
  state.studyPlanLevelChoice = String(state.studyTargetLevel);
  state.studyPlanFocusChoice = state.studyFocus;

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
        studyTargetLevel: state.studyTargetLevel,
        studyFocus: state.studyFocus,
        onboardingComplete: state.onboardingComplete,
        grammarLevel: state.grammarLevel,
        grammarLessonId: state.grammarLessonId,
        readerLevel: state.readerLevel,
        readerShowPinyin: state.readerShowPinyin,
        readerShowTranslation: state.readerShowTranslation,
        examLevel: state.examLevel,
        examMode: state.examMode,
        mapQuizMode: state.mapQuizMode,
        mapShowPinyinNames: state.mapShowPinyinNames,
        pronunciationView: state.pronunciationView,
        pronunciationShowPinyin: state.pronunciationShowPinyin,
        selectedLevels: [...state.selectedLevels],
        voiceSpeed: state.voiceSpeed,
      }),
    );
  } catch {
    // Settings persistence is a convenience; practice sessions still work without it.
  }
}

function bindAccountState() {
  const account = window.ChineseTrainerAccount;
  if (!account) {
    return;
  }
  account.subscribe(() => {
    if (!state.session && !state.result && ["reader", "exam"].includes(state.tool)) {
      render();
    }
  });
  account.init();
}

function hasPremiumAccess() {
  return Boolean(window.ChineseTrainerAccount?.isPremium?.());
}

function requirePremiumAccess(reason) {
  return Boolean(window.ChineseTrainerAccount?.requirePremium?.(reason));
}

function bindTopLevelControls() {
  const openAccountDialog = () => document.querySelector("#accountTrigger")?.click();
  sidebarProfileButton?.addEventListener("click", openAccountDialog);
  sidebarSettingsButton?.addEventListener("click", openAccountDialog);
  globalNotificationAction?.addEventListener("click", () => {
    if (state.session && !window.confirm("Switch tools and end this session?")) {
      return;
    }
    document.querySelector(".utility-notifications")?.removeAttribute("open");
    const dashboard = getDashboardData();
    launchDashboardActivity(dashboard.nextActivity.tool, dashboard.nextActivity.mode || "");
  });

  document.querySelectorAll(".tool-tab").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTool = button.dataset.tool;
      closeMobileNavigation({ restoreFocus: false });
      if (!TOOLS[nextTool] || nextTool === state.tool) return;

      const switchMessage = state.session?.type === "exam"
        ? "Leave this mock exam? Your answers will stay saved, but the timer will keep running."
        : "Switch tools and end this session?";
      if (state.session && !window.confirm(switchMessage)) {
        return;
      }

      stopPronunciationRecognition();
      stopSpeech();
      if (state.session?.type === "exam-speaking") {
        if (hskSpeakingMediaRecorder?.state === "recording") hskSpeakingMediaRecorder.stop();
        releaseHskSpeakingMicrophone();
      }
      stopExamTimer();
      state.tool = nextTool;
      state.planSetupOpen = false;
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

function bindMobileNavigation() {
  mobileNavToggle?.addEventListener("click", openMobileNavigation);
  mobileMoreButton?.addEventListener("click", openMobileNavigation);
  mobileNavClose?.addEventListener("click", () => closeMobileNavigation());
  mobileNavBackdrop?.addEventListener("click", () => closeMobileNavigation());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("mobile-nav-open")) {
      closeMobileNavigation();
    }
  });
  mobileNavigationQuery.addEventListener?.("change", syncMobileNavigationMode);
  syncMobileNavigationMode();
}

function openMobileNavigation(event) {
  if (!mobileNavigationQuery.matches || !toolNavigation) return;
  mobileNavigationRestoreFocus = event?.currentTarget instanceof HTMLElement
    ? event.currentTarget
    : document.activeElement;
  document.body.classList.add("mobile-nav-open");
  toolNavigation.removeAttribute("inert");
  toolNavigation.setAttribute("aria-hidden", "false");
  mobileNavToggle?.setAttribute("aria-expanded", "true");
  mobileMoreButton?.setAttribute("aria-expanded", "true");
  window.setTimeout(() => {
    toolNavigation.querySelector(".tool-tab.active")?.focus({ preventScroll: true });
  }, 180);
}

function closeMobileNavigation(options = {}) {
  const wasOpen = document.body.classList.contains("mobile-nav-open");
  document.body.classList.remove("mobile-nav-open");
  mobileNavToggle?.setAttribute("aria-expanded", "false");
  mobileMoreButton?.setAttribute("aria-expanded", "false");
  if (mobileNavigationQuery.matches && toolNavigation) {
    toolNavigation.setAttribute("aria-hidden", "true");
    if (wasOpen) {
      window.setTimeout(() => {
        if (mobileNavigationQuery.matches && !document.body.classList.contains("mobile-nav-open")) {
          toolNavigation.setAttribute("inert", "");
        }
      }, 220);
    } else {
      toolNavigation.setAttribute("inert", "");
    }
  }
  if (wasOpen && options.restoreFocus !== false && mobileNavigationRestoreFocus instanceof HTMLElement) {
    mobileNavigationRestoreFocus.focus({ preventScroll: true });
  }
  mobileNavigationRestoreFocus = null;
}

function syncMobileNavigationMode() {
  if (!toolNavigation) return;
  if (mobileNavigationQuery.matches) {
    closeMobileNavigation({ restoreFocus: false });
    return;
  }
  document.body.classList.remove("mobile-nav-open");
  toolNavigation.removeAttribute("inert");
  toolNavigation.removeAttribute("aria-hidden");
  mobileNavToggle?.setAttribute("aria-expanded", "false");
  mobileMoreButton?.setAttribute("aria-expanded", "false");
}

function bindGlobalSearch() {
  const shortcut = globalSearchTrigger.querySelector(".global-search-trigger-shortcut");
  if (shortcut) {
    const isApplePlatform = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || "");
    shortcut.textContent = isApplePlatform ? "⌘K" : "Ctrl K";
  }

  globalSearchTrigger.addEventListener("click", () => openGlobalSearch());
  globalSearchClose.addEventListener("click", closeGlobalSearch);
  document.addEventListener("keydown", handleGlobalSearchShortcut);

  document.querySelectorAll("[data-global-search-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextView = button.dataset.globalSearchView;
      if (!["search", "saved"].includes(nextView) || nextView === globalSearchView) {
        return;
      }
      globalSearchView = nextView;
      globalSearchInput.value = "";
      globalSearchActiveIndex = 0;
      renderGlobalSearchResults();
      globalSearchInput.focus();
    });
  });
  globalSearchSavedActions.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-global-search-saved-action]");
    if (
      !button ||
      button.disabled ||
      !prepareGlobalSearchNavigation("Start saved practice and end the current session?")
    ) {
      return;
    }
    if (button.dataset.globalSearchSavedAction === "vocabulary") {
      startSavedVocabularyReview();
      return;
    }
    if (button.dataset.globalSearchSavedAction === "sentences") {
      state.tool = "drill";
      state.drillView = "library";
      state.selectedLevels = new Set(LEVELS.map((level) => level.id));
      saveSettings();
      startSavedSentenceSession({ allLevels: true });
    }
  });

  globalSearchInput.addEventListener("input", () => {
    globalSearchActiveIndex = 0;
    renderGlobalSearchResults();
  });
  globalSearchInput.addEventListener("keydown", handleGlobalSearchNavigation);
  globalSearchResults.addEventListener("click", (event) => {
    const suggestion = event.target.closest?.("[data-global-search-suggestion]");
    if (suggestion) {
      globalSearchInput.value = suggestion.dataset.globalSearchSuggestion || "";
      globalSearchActiveIndex = 0;
      renderGlobalSearchResults();
      globalSearchInput.focus();
      return;
    }
    const button = event.target.closest?.("[data-global-search-index]");
    if (!button) {
      return;
    }
    const result = globalSearchFlatResults[Number(button.dataset.globalSearchIndex)];
    if (result) {
      activateGlobalSearchResult(result);
    }
  });
  globalSearchResults.addEventListener("pointermove", (event) => {
    const button = event.target.closest?.("[data-global-search-index]");
    if (!button) {
      return;
    }
    const nextIndex = Number(button.dataset.globalSearchIndex);
    if (Number.isInteger(nextIndex) && nextIndex !== globalSearchActiveIndex) {
      globalSearchActiveIndex = nextIndex;
      syncGlobalSearchActiveResult();
    }
  });
  globalSearchDialog.addEventListener("click", (event) => {
    if (event.target === globalSearchDialog) {
      closeGlobalSearch();
    }
  });
  globalSearchDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeGlobalSearch();
  });
  globalSearchDialog.addEventListener("close", () => {
    document.body.classList.remove("global-search-open");
    globalSearchDialog.removeAttribute("aria-busy");
    const restoreFocus = globalSearchRestoreFocus;
    globalSearchRestoreFocus = null;
    restoreFocus?.focus?.();
  });
}

function handleGlobalSearchShortcut(event) {
  if (
    event.isComposing ||
    event.altKey ||
    !(event.metaKey || event.ctrlKey) ||
    event.key.toLowerCase() !== "k"
  ) {
    return;
  }

  event.preventDefault();
  if (globalSearchDialog.open) {
    globalSearchInput.focus();
    globalSearchInput.select();
    return;
  }
  openGlobalSearch();
}

function openGlobalSearch({ view = "search" } = {}) {
  globalSearchRestoreFocus = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : globalSearchTrigger;
  globalSearchView = view === "saved" ? "saved" : "search";
  globalSearchInput.value = "";
  globalSearchInput.placeholder = globalSearchView === "saved"
    ? "Search saved material"
    : "Search Chinese, pinyin, or English";
  globalSearchActiveIndex = 0;
  renderGlobalSearchResults();
  document.body.classList.add("global-search-open");

  try {
    globalSearchDialog.showModal();
  } catch {
    globalSearchDialog.setAttribute("open", "");
  }
  window.requestAnimationFrame?.(() => globalSearchInput.focus());

  if (sentenceDataLoaded && wordDataLoaded) {
    return;
  }
  globalSearchDataLoading = true;
  globalSearchDialog.setAttribute("aria-busy", "true");
  renderGlobalSearchResults();
  Promise.allSettled([ensureSentenceData(), ensureWordData()]).then(() => {
    globalSearchDataLoading = false;
    globalSearchDialog.removeAttribute("aria-busy");
    if (globalSearchDialog.open) {
      renderGlobalSearchResults();
    }
  });
}

function closeGlobalSearch() {
  if (globalSearchDialog.open && typeof globalSearchDialog.close === "function") {
    globalSearchDialog.close();
    return;
  }
  globalSearchDialog.removeAttribute("open");
  document.body.classList.remove("global-search-open");
  const restoreFocus = globalSearchRestoreFocus;
  globalSearchRestoreFocus = null;
  restoreFocus?.focus?.();
}

function handleGlobalSearchNavigation(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    closeGlobalSearch();
    return;
  }
  if (!globalSearchFlatResults.length) {
    return;
  }
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    globalSearchActiveIndex = (
      globalSearchActiveIndex + direction + globalSearchFlatResults.length
    ) % globalSearchFlatResults.length;
    syncGlobalSearchActiveResult({ scroll: true });
    return;
  }
  if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    globalSearchActiveIndex = event.key === "Home" ? 0 : globalSearchFlatResults.length - 1;
    syncGlobalSearchActiveResult({ scroll: true });
    return;
  }
  if (event.key === "Enter") {
    event.preventDefault();
    const result = globalSearchFlatResults[globalSearchActiveIndex];
    if (result) {
      activateGlobalSearchResult(result);
    }
  }
}

function renderGlobalSearchResults() {
  const query = globalSearchInput.value.trim();
  const notebook = getSavedNotebookData();
  renderGlobalSearchViewControls(notebook);
  const groups = globalSearchView === "saved"
    ? getSavedGlobalSearchResults(query, notebook)
    : query
      ? getGlobalSearchResults(query)
      : [{ id: "recent", label: "Recent", results: getRecentGlobalSearchResults() }];
  globalSearchFlatResults = groups.flatMap((group) => group.results);
  if (globalSearchActiveIndex >= globalSearchFlatResults.length) {
    globalSearchActiveIndex = Math.max(0, globalSearchFlatResults.length - 1);
  }

  if (!globalSearchFlatResults.length) {
    const loading = globalSearchDataLoading && (query || globalSearchView === "saved");
    const emptyTitle = globalSearchView === "saved"
      ? query ? "No saved matches" : "Your notebook is empty"
      : query
        ? "No matching study material"
        : "Your learning library";
    const emptyDetail = globalSearchView === "saved"
      ? query ? "Try another Chinese word, pinyin, or English phrase." : "Save useful words and sentences to collect them here."
      : query
        ? "Try another Chinese word, pinyin, or English phrase."
        : "Search vocabulary, grammar, and example sentences.";
    globalSearchResults.innerHTML = `
      <div class="global-search-empty" role="status">
        ${loading ? `<span class="global-search-loader" aria-hidden="true"></span>` : searchIconMarkup()}
        <strong>${loading ? "Opening your notebook" : emptyTitle}</strong>
        <span>${loading ? "Loading local saved resources…" : emptyDetail}</span>
        ${!loading && globalSearchView === "search" && !query ? `
          <div class="global-search-suggestions" aria-label="Suggested searches">
            <button type="button" data-global-search-suggestion="你好">你好</button>
            <button type="button" data-global-search-suggestion="xuexi">xuexi</button>
            <button type="button" data-global-search-suggestion="because">because</button>
          </div>
        ` : ""}
      </div>
    `;
    globalSearchInput.removeAttribute("aria-activedescendant");
    return;
  }

  let resultIndex = 0;
  globalSearchResults.innerHTML = groups
    .filter((group) => group.results.length)
    .map((group) => `
      <section class="global-search-group" aria-labelledby="global-search-group-${escapeHtml(group.id)}">
        <div class="global-search-group-heading" id="global-search-group-${escapeHtml(group.id)}">
          <span>${escapeHtml(group.label)}</span>
          <small>${Number.isFinite(group.count) ? group.count : group.results.length}</small>
        </div>
        <div class="global-search-list">
          ${group.results.map((result) => {
            const currentIndex = resultIndex;
            resultIndex += 1;
            return buildGlobalSearchResultMarkup(result, currentIndex);
          }).join("")}
        </div>
      </section>
    `).join("");
  syncGlobalSearchActiveResult();
}

function renderGlobalSearchViewControls(notebook = getSavedNotebookData()) {
  document.querySelectorAll("[data-global-search-view]").forEach((button) => {
    const active = button.dataset.globalSearchView === globalSearchView;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  globalSearchSavedCount.textContent = String(notebook.total);
  globalSearchInput.placeholder = globalSearchView === "saved"
    ? "Search saved material"
    : "Search Chinese, pinyin, or English";
  globalSearchSavedActions.hidden = globalSearchView !== "saved";
  if (globalSearchView !== "saved") {
    globalSearchSavedActions.innerHTML = "";
    return;
  }
  globalSearchSavedActions.innerHTML = `
    <button
      type="button"
      data-global-search-saved-action="vocabulary"
      ${notebook.vocabulary.length ? "" : "disabled"}>
      ${bookmarkIconMarkup(true)}
      <span>Review ${notebook.vocabulary.length} ${notebook.vocabulary.length === 1 ? "word" : "words"}</span>
    </button>
    <button
      type="button"
      data-global-search-saved-action="sentences"
      ${notebook.sentences.length ? "" : "disabled"}>
      ${sentenceSearchIconMarkup()}
      <span>Practice ${notebook.sentences.length} ${notebook.sentences.length === 1 ? "sentence" : "sentences"}</span>
    </button>
  `;
}

function getSavedNotebookData({
  vocabulary = getAllVocabularyReviewItems(),
  sentences = SENTENCES,
  savedVocabularyKeys = loadSavedVocabularyKeys(),
  savedSentenceIds = loadSavedSentenceIds(),
} = {}) {
  const savedVocabulary = vocabulary.filter((item) => savedVocabularyKeys.has(reviewItemKey(item)));
  const savedSentences = sentences.filter((item) => savedSentenceIds.has(sentenceItemKey(item)));
  return {
    vocabulary: savedVocabulary,
    sentences: savedSentences,
    total: savedVocabulary.length + savedSentences.length,
  };
}

function getSavedGlobalSearchResults(query = "", notebook = getSavedNotebookData(), limit = GLOBAL_SEARCH_RESULT_LIMIT) {
  const trimmedQuery = String(query || "").trim();
  if (trimmedQuery) {
    return getGlobalSearchResults(trimmedQuery, {
      vocabulary: notebook.vocabulary,
      grammar: [],
      sentences: notebook.sentences,
      limit,
    }).filter((group) => group.id !== "grammar");
  }
  return [
    {
      id: "saved-vocabulary",
      label: "Saved vocabulary",
      count: notebook.vocabulary.length,
      results: notebook.vocabulary.slice(0, limit).map(createVocabularySearchResult),
    },
    {
      id: "saved-sentences",
      label: "Saved sentences",
      count: notebook.sentences.length,
      results: notebook.sentences.slice(0, limit).map(createSentenceSearchResult),
    },
  ];
}

function buildGlobalSearchResultMarkup(result, index) {
  const selected = index === globalSearchActiveIndex;
  const typeIcon = result.type === "vocabulary"
    ? `<span class="global-search-result-character chinese-text" lang="zh-CN">${escapeHtml(result.item.zh.slice(0, 1))}</span>`
    : result.type === "grammar"
      ? grammarSearchIconMarkup()
      : sentenceSearchIconMarkup();
  const title = result.type === "vocabulary"
    ? `<span class="chinese-text global-search-result-hanzi" lang="zh-CN">${escapeHtml(result.item.zh)}</span>`
    : result.type === "sentence"
      ? `<span class="chinese-text global-search-result-hanzi" lang="zh-CN">${escapeHtml(result.item.zh)}</span>`
    : escapeHtml(result.title);
  const secondary = result.type === "vocabulary"
    ? `<span class="global-search-result-pinyin">${buildToneColoredPinyinMarkup(result.item.pinyin || result.item.numeric || "")}</span>`
    : result.type === "grammar"
      ? `<span class="chinese-text" lang="zh-CN">${escapeHtml(result.item.pattern)}</span>`
      : "";

  return `
    <button
      class="global-search-result ${selected ? "active" : ""}"
      type="button"
      role="option"
      id="global-search-result-${index}"
      data-global-search-index="${index}"
      aria-selected="${selected}">
      <span class="global-search-result-icon" aria-hidden="true">${typeIcon}</span>
      <span class="global-search-result-copy">
        <span class="global-search-result-title">${title}${secondary}</span>
        <span class="global-search-result-detail">${escapeHtml(result.detail)}</span>
      </span>
      <span class="global-search-result-meta">${escapeHtml(result.meta)}</span>
      <svg class="button-icon global-search-result-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="m9 18 6-6-6-6"></path>
      </svg>
    </button>
  `;
}

function syncGlobalSearchActiveResult({ scroll = false } = {}) {
  globalSearchResults.querySelectorAll("[data-global-search-index]").forEach((button) => {
    const selected = Number(button.dataset.globalSearchIndex) === globalSearchActiveIndex;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  const active = globalSearchResults.querySelector(`[data-global-search-index="${globalSearchActiveIndex}"]`);
  if (!active) {
    globalSearchInput.removeAttribute("aria-activedescendant");
    return;
  }
  globalSearchInput.setAttribute("aria-activedescendant", active.id);
  if (scroll) {
    active.scrollIntoView({ block: "nearest" });
  }
}

function getGlobalSearchResults(query, {
  vocabulary = getAllVocabularyReviewItems(),
  grammar = GRAMMAR_LESSONS,
  sentences = SENTENCES,
  limit = GLOBAL_SEARCH_RESULT_LIMIT,
} = {}) {
  const trimmedQuery = String(query || "").trim();
  const normalizedQuery = normalizeGlobalSearchText(trimmedQuery);
  if (!trimmedQuery || (!containsChinese(trimmedQuery) && normalizedQuery.length < 2)) {
    return [
      { id: "vocabulary", label: "Vocabulary", results: [] },
      { id: "grammar", label: "Grammar", results: [] },
      { id: "sentences", label: "Sentences", results: [] },
    ];
  }

  const vocabularyResults = rankGlobalSearchItems(vocabulary, (item) => scoreGlobalSearchItem(trimmedQuery, {
    text: [item.zh, ...(item.meanings || [])],
    pinyin: [item.pinyin, item.numeric, ...(item.pinyinAlternates || []), ...(item.numericAlternates || [])],
  }))
    .slice(0, limit)
    .map(({ item }) => createVocabularySearchResult(item));
  const grammarResults = rankGlobalSearchItems(grammar, (lesson) => scoreGlobalSearchItem(trimmedQuery, {
    text: [
      lesson.title,
      lesson.category,
      lesson.pattern,
      lesson.summary,
      lesson.structure,
      lesson.note,
      ...(lesson.examples || []).flatMap((example) => [example.zh, example.en]),
    ],
    pinyin: (lesson.examples || []).map((example) => example.pinyin),
  }))
    .slice(0, limit)
    .map(({ item }) => createGrammarSearchResult(item));
  const sentenceResults = rankGlobalSearchItems(sentences, (item) => scoreGlobalSearchItem(trimmedQuery, {
    text: [item.zh, item.en],
    pinyin: [getSentenceSearchPinyin(item)],
  }))
    .slice(0, limit)
    .map(({ item }) => createSentenceSearchResult(item));

  return [
    { id: "vocabulary", label: "Vocabulary", results: vocabularyResults },
    { id: "grammar", label: "Grammar", results: grammarResults },
    { id: "sentences", label: "Sentences", results: sentenceResults },
  ];
}

function createVocabularySearchResult(item) {
  const meta = getVocabularySetMeta({ id: item.setId, label: item.setLabel, level: item.level });
  return {
    type: "vocabulary",
    key: reviewItemKey(item),
    title: item.zh,
    detail: formatVocabularyMeanings(item),
    meta: `${meta.levelLabel} · ${meta.partLabel}`,
    item,
  };
}

function createGrammarSearchResult(item) {
  return {
    type: "grammar",
    key: item.id,
    title: item.title,
    detail: item.summary,
    meta: `HSK ${item.level} · ${item.category}`,
    item,
  };
}

function createSentenceSearchResult(item) {
  return {
    type: "sentence",
    key: sentenceItemKey(item),
    title: item.en,
    detail: item.en,
    meta: selectedLevelLabel(item.level),
    item,
  };
}

function rankGlobalSearchItems(items, getScore) {
  return (items || [])
    .map((item, sourceIndex) => ({ item, sourceIndex, score: getScore(item) }))
    .filter((match) => Number.isFinite(match.score))
    .sort((a, b) => a.score - b.score || a.sourceIndex - b.sourceIndex);
}

function scoreGlobalSearchItem(query, { text = [], pinyin = [] } = {}) {
  const normalizedQuery = normalizeGlobalSearchText(query);
  const normalizedPinyinQuery = compactPinyin(
    stripPinyinToneAndUmlautMarks(normalizePinyinForCompare(query)),
  );
  let bestScore = Infinity;
  text.filter(Boolean).forEach((value) => {
    bestScore = Math.min(bestScore, scoreGlobalSearchValue(normalizedQuery, normalizeGlobalSearchText(value)));
  });
  if (normalizedPinyinQuery) {
    pinyin.filter(Boolean).forEach((value) => {
      const normalizedValue = compactPinyin(
        stripPinyinToneAndUmlautMarks(normalizePinyinForCompare(value)),
      );
      bestScore = Math.min(bestScore, scoreGlobalSearchValue(normalizedPinyinQuery, normalizedValue) + 1);
    });
  }
  return bestScore;
}

function scoreGlobalSearchValue(query, value) {
  if (!query || !value) {
    return Infinity;
  }
  if (value === query) {
    return 0;
  }
  if (value.startsWith(query)) {
    return 10;
  }
  if (value.split(/\s+/).some((part) => part.startsWith(query))) {
    return 14;
  }
  if (value.includes(query)) {
    return 20;
  }
  return Infinity;
}

function normalizeGlobalSearchText(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function getRecentGlobalSearchResults() {
  let references = [];
  try {
    const parsed = JSON.parse(localStorage.getItem(GLOBAL_SEARCH_RECENTS_KEY) || "[]");
    references = Array.isArray(parsed) ? parsed : [];
  } catch {
    references = [];
  }
  return references
    .map(resolveGlobalSearchReference)
    .filter(Boolean)
    .slice(0, GLOBAL_SEARCH_RECENT_LIMIT);
}

function resolveGlobalSearchReference(reference) {
  if (reference?.type === "vocabulary") {
    const item = getAllVocabularyReviewItems().find((candidate) => reviewItemKey(candidate) === reference.key);
    if (!item) return null;
    return createVocabularySearchResult(item);
  }
  if (reference?.type === "grammar") {
    const item = getGrammarLessonById(reference.key);
    return item ? createGrammarSearchResult(item) : null;
  }
  if (reference?.type === "sentence") {
    const item = SENTENCES.find((candidate) => sentenceItemKey(candidate) === reference.key);
    return item ? createSentenceSearchResult(item) : null;
  }
  return null;
}

function rememberGlobalSearchResult(result) {
  const nextReference = { type: result.type, key: result.key };
  let references = [];
  try {
    const parsed = JSON.parse(localStorage.getItem(GLOBAL_SEARCH_RECENTS_KEY) || "[]");
    references = Array.isArray(parsed) ? parsed : [];
    const next = [
      nextReference,
      ...references.filter((reference) => reference?.type !== result.type || reference?.key !== result.key),
    ].slice(0, GLOBAL_SEARCH_RECENT_LIMIT);
    localStorage.setItem(GLOBAL_SEARCH_RECENTS_KEY, JSON.stringify(next));
  } catch {
    // Recent searches are a convenience; search remains available without storage.
  }
}

function activateGlobalSearchResult(result) {
  const navigation = prepareGlobalSearchNavigation();
  if (!navigation) {
    return;
  }
  rememberGlobalSearchResult(result);

  if (result.type === "vocabulary") {
    if (navigation.shouldRefreshCurrentView) {
      render();
    }
    openVocabularyDetail(result.item, globalSearchTrigger);
    return;
  }
  if (result.type === "grammar") {
    state.tool = "grammar";
    state.grammarLevel = result.item.level;
    state.grammarLessonId = result.item.id;
  } else if (result.type === "sentence") {
    state.tool = "drill";
    state.drillView = "library";
    state.sentenceLibraryQuery = result.item.zh;
    state.sentenceLibraryVisibleCount = SENTENCE_LIBRARY_PAGE_SIZE;
    state.selectedLevels.add(result.item.level);
  }
  saveSettings();
  render();
  window.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
}

function prepareGlobalSearchNavigation(message = "Open this result and end the current session?") {
  if (state.session && !window.confirm(message)) {
    return null;
  }
  stopPronunciationRecognition();
  stopSpeech();
  const shouldRefreshCurrentView = Boolean(state.session || state.result);
  state.session = null;
  state.result = null;
  state.planSetupOpen = false;
  state.dataError = "";
  closeGlobalSearch();
  return { shouldRefreshCurrentView };
}

function searchIconMarkup() {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="7"></circle>
      <path d="m20 20-4-4"></path>
    </svg>
  `;
}

function grammarSearchIconMarkup() {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H7a3 3 0 0 0-3 3V5.5z"></path>
      <path d="M8 8h8M8 12h5"></path>
    </svg>
  `;
}

function sentenceSearchIconMarkup() {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 4h14v13H9l-4 4V4z"></path>
      <path d="M9 8h6M9 12h4"></path>
    </svg>
  `;
}

function bindPwaLifecycle() {
  if (
    !pwaAccess ||
    !pwaStatus ||
    !installAppButton ||
    !refreshAppButton ||
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  pwaAccess.hidden = false;
  updatePwaConnectionStatus();

  window.addEventListener("online", updatePwaConnectionStatus);
  window.addEventListener("offline", updatePwaConnectionStatus);
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPwaInstallPrompt = event;
    if (!isPwaStandalone()) {
      installAppButton.hidden = false;
    }
  });
  window.addEventListener("appinstalled", () => {
    deferredPwaInstallPrompt = null;
    installAppButton.hidden = true;
    setPwaStatus("Installed · available offline", "ready");
  });

  installAppButton.addEventListener("click", installPwaApp);
  refreshAppButton.addEventListener("click", activateWaitingServiceWorker);

  const hadControllerAtLoad = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (pwaUpdateRequested && !pwaReloading) {
      pwaReloading = true;
      window.location.reload();
      return;
    }
    if (!hadControllerAtLoad) {
      pwaOfflineReady = true;
      updatePwaConnectionStatus();
    }
  });

  navigator.serviceWorker.register("./service-worker.js", { updateViaCache: "none" })
    .then((registration) => {
      pwaRegistration = registration;
      watchServiceWorkerRegistration(registration);
      if (registration.waiting) {
        showPwaUpdateReady(registration);
      }
      return navigator.serviceWorker.ready;
    })
    .then(() => {
      pwaOfflineReady = true;
      updatePwaConnectionStatus();
    })
    .catch(() => {
      pwaAccess.hidden = true;
    });
}

function watchServiceWorkerRegistration(registration) {
  registration.addEventListener("updatefound", () => {
    const installingWorker = registration.installing;
    if (!installingWorker) {
      return;
    }
    installingWorker.addEventListener("statechange", () => {
      if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
        showPwaUpdateReady(registration);
      }
    });
  });
}

function showPwaUpdateReady(registration) {
  pwaRegistration = registration;
  refreshAppButton.hidden = false;
  setPwaStatus("Update ready", "update");
}

async function installPwaApp() {
  const prompt = deferredPwaInstallPrompt;
  if (!prompt) {
    return;
  }
  installAppButton.hidden = true;
  await prompt.prompt();
  await prompt.userChoice;
  deferredPwaInstallPrompt = null;
  updatePwaConnectionStatus();
}

function activateWaitingServiceWorker() {
  const waitingWorker = pwaRegistration?.waiting;
  if (!waitingWorker) {
    return;
  }
  pwaUpdateRequested = true;
  refreshAppButton.disabled = true;
  setPwaStatus("Updating app", "preparing");
  waitingWorker.postMessage({ type: "SKIP_WAITING" });
}

function updatePwaConnectionStatus() {
  if (!pwaStatus) {
    return;
  }
  if (!navigator.onLine) {
    setPwaStatus("Working offline", "offline");
    return;
  }
  if (refreshAppButton && !refreshAppButton.hidden) {
    setPwaStatus("Update ready", "update");
    return;
  }
  if (isPwaStandalone()) {
    setPwaStatus("Installed · available offline", "ready");
    return;
  }
  setPwaStatus(pwaOfflineReady ? "Available offline" : "Preparing offline access", pwaOfflineReady ? "ready" : "preparing");
}

function setPwaStatus(label, status) {
  if (!pwaStatus) {
    return;
  }
  pwaStatus.textContent = label;
  pwaStatus.dataset.state = status;
}

function isPwaStandalone() {
  return window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone === true;
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

  if (isExamChoiceShortcut(event)) {
    event.preventDefault();
    submitHskExamChoiceByShortcut(event.key);
    return;
  }

  if (isReaderChoiceShortcut(event)) {
    event.preventDefault();
    submitReaderChoice(Number(event.key) - 1);
    return;
  }

  if (isPlacementChoiceShortcut(event)) {
    event.preventDefault();
    submitPlacementChoiceByShortcut(event.key);
    return;
  }

  if (isGrammarChoiceShortcut(event)) {
    event.preventDefault();
    submitGrammarChoiceByShortcut(event.key);
    return;
  }

  if (isToneChoiceShortcut(event)) {
    event.preventDefault();
    submitToneChoiceByShortcut(event.key);
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

  if (state.session.type === "exam") {
    if (isTypingTarget(event.target)) {
      return;
    }
    event.preventDefault();
    goToHskExamQuestion(Math.min(state.session.items.length - 1, state.session.index + 1));
    return;
  }

  if (state.session.type === "exam-speaking") {
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
  const interactiveTarget = target?.closest?.("button, a, summary, [role='button']");
  return !isTypingTarget(target) && !interactiveTarget && !state.result;
}

function sessionUsesAudioPrompt(session) {
  if (session?.type === "pronunciation" || session?.type === "tone") {
    return true;
  }

  if (session?.type === "review") {
    return session.items?.[session.index]?.reviewMode === "meaning";
  }

  return session?.type === "vocabulary"
    ? session.quizMode === "meaning"
    : session?.mode === "listening";
}

function isToneChoiceShortcut(event) {
  return state.session?.type === "tone" &&
    !state.session.currentAssessment &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    /^[1-5]$/.test(event.key);
}

function isExamChoiceShortcut(event) {
  const question = state.session?.type === "exam"
    ? state.session.items?.[state.session.index]
    : null;
  return question?.type === "choice" &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    /^[1-6]$/.test(event.key);
}

function isReaderChoiceShortcut(event) {
  return state.session?.type === "reader" &&
    !state.session.currentAssessment &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    /^[1-3]$/.test(event.key);
}

function isGrammarChoiceShortcut(event) {
  return state.session?.type === "grammar" &&
    !state.session.currentAssessment &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    /^[1-4]$/.test(event.key);
}

function isPlacementChoiceShortcut(event) {
  return state.session?.type === "placement" &&
    !state.session.currentAssessment &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    /^[1-4]$/.test(event.key);
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
    stopExamTimer();
    if (state.result.type === "vocabulary") {
      renderVocabularyResults();
    } else if (state.result.type === "review") {
      renderReviewResults();
    } else if (state.result.type === "grammar") {
      renderGrammarResults();
    } else if (state.result.type === "placement") {
      renderPlacementResults();
    } else if (state.result.type === "pronunciation") {
      renderPronunciationResults();
    } else if (state.result.type === "tone") {
      renderToneListeningResults();
    } else if (state.result.type === "map") {
      renderMapQuizResults();
    } else if (state.result.type === "exam") {
      renderHskExamResults();
    } else if (state.result.type === "reader") {
      renderReaderResults();
    } else {
      renderResults();
    }
    enhanceRenderedExperience();
    return;
  }

  if (state.session) {
    renderSession();
    if (state.session.type === "vocabulary") {
      startVocabularyTimer();
      stopExamTimer();
    } else if (["exam", "exam-speaking"].includes(state.session.type)) {
      stopVocabularyTimer();
      startExamTimer();
    } else {
      stopVocabularyTimer();
      stopExamTimer();
    }
    enhanceRenderedExperience();
    return;
  }

  stopVocabularyTimer();
  stopExamTimer();
  if (state.tool === "dashboard") {
    if (!state.onboardingComplete || state.planSetupOpen) {
      renderStudyPlanSetup();
    } else {
      renderDashboardHome();
    }
    enhanceRenderedExperience();
    return;
  }

  if (state.tool === "history") {
    renderHistoryHome();
    enhanceRenderedExperience();
    return;
  }

  if (state.tool === "vocabulary") {
    renderVocabularyHome();
    enhanceRenderedExperience();
    return;
  }

  if (state.tool === "review") {
    renderReviewHome();
    enhanceRenderedExperience();
    return;
  }

  if (state.tool === "grammar") {
    renderGrammarHome();
    enhanceRenderedExperience();
    return;
  }

  if (state.tool === "reader") {
    renderReaderHome();
    enhanceRenderedExperience();
    return;
  }

  if (state.tool === "exam") {
    renderHskExamHome();
    enhanceRenderedExperience();
    return;
  }

  if (state.tool === "pronunciation") {
    renderPronunciationHome();
    enhanceRenderedExperience();
    return;
  }

  if (state.tool === "map") {
    renderMapQuizHome();
    enhanceRenderedExperience();
    return;
  }

  renderModeHome();
  enhanceRenderedExperience();
}

function enhanceRenderedExperience() {
  const screen = state.result ? "result" : state.session ? "session" : "home";
  document.body.dataset.screen = screen;

  if (screen === "home" && isIntegratedToolLandingScreen()) {
    addToolPlanContext();
  }
  if (screen === "result" && state.result?.type !== "placement") {
    addResultPlanNextStep();
  }
}

function isIntegratedToolLandingScreen() {
  if (["dashboard", "history"].includes(state.tool)) {
    return false;
  }
  if (state.tool === "reader") {
    return !state.readerId;
  }
  if (state.tool === "exam") {
    return state.examScreen === "home";
  }
  if (state.tool === "grammar") {
    return !state.grammarLessonId;
  }
  return true;
}

function getToolExperienceProfile(tool = state.tool) {
  const profiles = {
    vocabulary: {
      label: "Vocabulary & recall",
      detail: "Build vocabulary coverage and complete quiz benchmarks.",
    },
    review: {
      label: "Adaptive recall",
      detail: "Strengthen words at the point they are due for review.",
    },
    grammar: {
      label: "Grammar mastery",
      detail: "Build the core patterns for your current HSK level.",
    },
    reader: {
      label: "Reading in context",
      detail: "Apply vocabulary and grammar inside short stories.",
    },
    exam: {
      label: "Exam readiness",
      detail: "Measure your level under realistic HSK timing.",
    },
    pronunciation: {
      label: "Speaking & listening",
      detail: "Build pronunciation accuracy and tone awareness.",
    },
    map: {
      label: "Culture & geography",
      detail: "Learn official Chinese place names and locations.",
    },
    drill: {
      label: "Sentence fluency",
      detail: "Turn sentence knowledge into active recall.",
    },
  };
  return profiles[tool] || profiles.review;
}

function getMatchingPlanActivity(dashboard, tool = state.tool) {
  return dashboard.plan.find((activity) => {
    if (activity.tool !== tool) {
      return false;
    }
    return tool !== "drill" || !activity.mode || activity.mode === state.mode;
  }) || null;
}

function addToolPlanContext() {
  const panel = app.querySelector(".workspace-panel");
  if (!panel || panel.querySelector(".tool-plan-context")) {
    return;
  }

  const dashboard = getDashboardData();
  const profile = getToolExperienceProfile();
  const activity = getMatchingPlanActivity(dashboard);
  const isNext = activity && dashboard.nextActivity.id === activity.id;
  const status = activity?.completed
    ? "Completed in today\'s plan"
    : isNext
      ? "Up next in today\'s plan"
      : activity
        ? "In today\'s plan"
        : "Extra path practice";

  panel.insertAdjacentHTML("afterbegin", `
    <div class="tool-plan-context ${activity?.completed ? "is-complete" : ""}">
      <span class="tool-plan-context-icon" aria-hidden="true">${dashboardActivityIconMarkup(state.tool)}</span>
      <span class="tool-plan-context-copy">
        <small>${escapeHtml(status)}</small>
        <strong>${escapeHtml(profile.label)}</strong>
        <span>${escapeHtml(profile.detail)}</span>
      </span>
      <span class="tool-plan-context-meta">New HSK ${state.studyTargetLevel} &middot; ${escapeHtml(getStudyFocus().label)}</span>
      <button class="tool-plan-context-action" type="button" id="viewTodayFromTool">
        Today ${dashboardArrowIconMarkup()}
      </button>
    </div>
  `);

  document.querySelector("#viewTodayFromTool")?.addEventListener("click", openTodayDashboard);
}

function addResultPlanNextStep() {
  const panel = app.querySelector(".workspace-panel");
  if (!panel || panel.querySelector(".session-plan-next")) {
    return;
  }

  const dashboard = getDashboardData();
  const goalComplete = dashboard.completedCount >= DASHBOARD_DAILY_GOAL;
  const nextActivity = dashboard.nextActivity;
  const nextTitle = goalComplete ? "Today\'s plan is complete" : `Next: ${nextActivity.title}`;
  const nextDetail = goalComplete
    ? "Your result is saved. Review today\'s progress or continue with optional practice."
    : nextActivity.detail;
  const markup = `
    <section class="session-plan-next ${goalComplete ? "is-complete" : ""}" aria-label="Learning plan update">
      <span class="session-plan-next-icon" aria-hidden="true">${goalComplete ? "&#10003;" : dashboardActivityIconMarkup(nextActivity.tool)}</span>
      <span class="session-plan-next-copy">
        <small>${goalComplete ? "Daily goal complete" : "Learning record updated"}</small>
        <strong>${escapeHtml(nextTitle)}</strong>
        <span>${escapeHtml(nextDetail)}</span>
      </span>
      <button class="primary-btn session-plan-next-action" type="button" id="continuePlanAfterResult">
        ${goalComplete ? "View today\'s progress" : "Continue plan"}
        ${dashboardArrowIconMarkup()}
      </button>
      ${goalComplete ? "" : '<button class="tool-plan-context-action session-plan-today" type="button" id="viewTodayAfterResult">Today</button>'}
    </section>
  `;
  const heading = panel.querySelector(".results-header, .reader-results-header, .hsk-exam-results-header");
  if (heading) {
    heading.insertAdjacentHTML("afterend", markup);
  } else {
    panel.insertAdjacentHTML("afterbegin", markup);
  }

  document.querySelector("#continuePlanAfterResult")?.addEventListener("click", () => {
    if (goalComplete) {
      openTodayDashboard();
      return;
    }
    launchDashboardActivity(nextActivity.tool, nextActivity.mode || "");
  });
  document.querySelector("#viewTodayAfterResult")?.addEventListener("click", openTodayDashboard);
}

function openTodayDashboard() {
  stopPronunciationRecognition();
  stopSpeech();
  state.tool = "dashboard";
  state.session = null;
  state.result = null;
  state.dataError = "";
  saveSettings();
  render();
  window.setTimeout(() => window.scrollTo?.({ top: 0, left: 0, behavior: "auto" }), 0);
}

function updateNavigationState() {
  document.body.dataset.tool = state.tool;
  document.body.dataset.mode = state.tool === "drill" ? state.mode : state.tool;
  document.querySelectorAll(".drill-only").forEach((element) => {
    element.hidden = state.tool !== "drill";
  });
  document.querySelectorAll(".sentence-bank-only").forEach((element) => {
    element.hidden = state.tool !== "drill" && !(state.tool === "pronunciation" && state.pronunciationView === "speaking");
  });
  document.querySelectorAll(".pronunciation-only").forEach((element) => {
    element.hidden = state.tool !== "pronunciation";
  });
  document.querySelectorAll(".pronunciation-speaking-only").forEach((element) => {
    element.hidden = state.tool !== "pronunciation" || state.pronunciationView !== "speaking";
  });
  document.querySelectorAll(".vocabulary-only").forEach((element) => {
    element.hidden = state.tool !== "vocabulary";
  });
  document.querySelectorAll(".vocabulary-quiz-only").forEach((element) => {
    element.hidden = state.tool !== "vocabulary" || state.vocabularyView !== "quiz";
  });
  document.querySelectorAll(".tool-tab").forEach((button) => {
    const active = button.dataset.tool === state.tool;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  const mobilePrimaryTools = new Set(["dashboard", "vocabulary", "review"]);
  const moreActive = !mobilePrimaryTools.has(state.tool);
  mobileMoreButton?.classList.toggle("active", moreActive);
  if (moreActive) mobileMoreButton?.setAttribute("aria-current", "page");
  else mobileMoreButton?.removeAttribute("aria-current");
  document.querySelectorAll(".mode-tab[data-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
  document.querySelectorAll("[data-vocabulary-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.vocabularyMode === state.vocabularyMode);
  });
  document.body.dataset.vocabularyView = state.vocabularyView;
  document.body.dataset.drillView = state.drillView;
  document.body.dataset.pronunciationView = state.pronunciationView;
  syncVocabularyOptionControls();
  updateSidebarSummary();
}

function updateSidebarSummary() {
  const history = loadHistoryRecords();
  if (sidebarLevelLabel) sidebarLevelLabel.textContent = `HSK ${state.studyTargetLevel} path`;
  if (sidebarStreakCount) sidebarStreakCount.textContent = String(getPracticeStreakDays(history));
  if (sidebarSessionCount) sidebarSessionCount.textContent = String(history.length);
  if (globalNotificationSummary) {
    const dashboard = getDashboardData(Date.now(), history);
    globalNotificationSummary.textContent = `${dashboard.nextActivity.title} is ready when you are.`;
  }
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

function downloadIconMarkup() {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3v12"></path>
      <path d="M7.5 10.5L12 15l4.5-4.5"></path>
      <path d="M4 19h16"></path>
    </svg>
  `;
}

function uploadIconMarkup() {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 16V4"></path>
      <path d="M7.5 8.5L12 4l4.5 4.5"></path>
      <path d="M4 20h16"></path>
    </svg>
  `;
}

function getStudyFocus(focus = state.studyFocus) {
  return STUDY_FOCUSES[focus] || STUDY_FOCUSES.balanced;
}

function getStudyPlanPreview(focus = state.studyPlanFocusChoice, levelChoice = state.studyPlanLevelChoice) {
  if (focus === "speaking") {
    return [
      ["Pronunciation practice", "Speak short sentences and inspect recognition feedback"],
      ["Listening sentence drill", "Train meaning recall from spoken Mandarin"],
      ["HSK vocabulary review", "Keep target-level words active with spaced practice"],
    ];
  }
  if (focus === "literacy") {
    return [
      ["Writing sentence drill", "Produce Chinese from an English prompt"],
      ["Grammar pattern practice", "Use core structures in context"],
      ["HSK vocabulary review", "Keep target-level words active with spaced practice"],
    ];
  }
  return [
    ["HSK vocabulary review", "Build recall with a target-level adaptive queue"],
    ["Pronunciation practice", "Speak short sentences and inspect recognition feedback"],
    ["Grammar or sentence practice", "Rotate language skills using recent results"],
  ];
}

function renderStudyPlanSetup() {
  const isEditing = state.onboardingComplete;
  const levelChoice = state.studyPlanLevelChoice;
  const focusChoice = STUDY_FOCUSES[state.studyPlanFocusChoice] ? state.studyPlanFocusChoice : "balanced";
  const selectedFocus = getStudyFocus(focusChoice);
  const preview = getStudyPlanPreview(focusChoice, levelChoice);
  const levelOptions = [
    { id: "1", label: "HSK 1", detail: "Build the foundation" },
    { id: "2", label: "HSK 2", detail: "Continue beyond the basics" },
    { id: "3", label: "HSK 3", detail: "Build exam-ready independence" },
    { id: "placement", label: "Not sure", detail: "Take the level check" },
  ];

  app.innerHTML = `
    <section class="workspace-panel study-plan-setup">
      <header class="study-plan-header">
        <div>
          <span>${isEditing ? "Study preferences" : "First step"}</span>
          <h2>${isEditing ? "Edit your study plan" : "Build your study plan"}</h2>
          <p>Choose where to start and what you want to improve. Today will turn those choices into a focused daily mix.</p>
        </div>
        ${isEditing ? `<button class="ghost-btn study-plan-cancel" type="button" id="cancelStudyPlan">Cancel</button>` : ""}
      </header>

      <button class="primary-btn shortcut-btn study-plan-mobile-action" type="button" data-complete-study-plan>
        <span>${levelChoice === "placement" ? "Start level check" : isEditing ? "Save study plan" : "Create my plan"}</span>
        ${shortcutHint("Enter")}
      </button>

      <div class="study-plan-layout">
        <div class="study-plan-form">
          <section class="study-plan-field" aria-labelledby="studyPlanLevelHeading">
            <div class="study-plan-field-heading">
              <span>1</span>
              <div>
                <h3 id="studyPlanLevelHeading">Choose your starting point</h3>
                <p>You can switch HSK roadmaps at any time.</p>
              </div>
            </div>
            <div class="study-plan-choice-grid study-plan-level-grid" role="group" aria-label="Starting level">
              ${levelOptions.map((option) => `
                <button
                  class="study-plan-choice ${levelChoice === option.id ? "active" : ""}"
                  type="button"
                  data-study-plan-level="${option.id}"
                  aria-pressed="${levelChoice === option.id}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <span>${escapeHtml(option.detail)}</span>
                </button>
              `).join("")}
            </div>
          </section>

          <section class="study-plan-field" aria-labelledby="studyPlanFocusHeading">
            <div class="study-plan-field-heading">
              <span>2</span>
              <div>
                <h3 id="studyPlanFocusHeading">Choose your focus</h3>
                <p>The plan still keeps vocabulary in every study day.</p>
              </div>
            </div>
            <div class="study-plan-choice-grid study-plan-focus-grid" role="group" aria-label="Learning focus">
              ${Object.entries(STUDY_FOCUSES).map(([id, focus]) => `
                <button
                  class="study-plan-choice ${focusChoice === id ? "active" : ""}"
                  type="button"
                  data-study-plan-focus="${id}"
                  aria-pressed="${focusChoice === id}">
                  <strong>${escapeHtml(focus.label)}</strong>
                  <span>${escapeHtml(focus.description)}</span>
                </button>
              `).join("")}
            </div>
          </section>
        </div>

        <aside class="study-plan-preview" aria-live="polite">
          <span>Your daily mix</span>
          <h3>${escapeHtml(selectedFocus.label)} plan</h3>
          <p>${levelChoice === "placement" ? "Your level check will set the HSK roadmap." : `Starting with the HSK ${levelChoice} roadmap.`}</p>
          <ol>
            ${preview.map(([title, detail], index) => `
              <li>
                <span>${index + 1}</span>
                <div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></div>
              </li>
            `).join("")}
          </ol>
          <div class="study-plan-actions">
            <button class="primary-btn shortcut-btn" type="button" id="completeStudyPlan" data-complete-study-plan>
              <span>${levelChoice === "placement" ? "Start level check" : isEditing ? "Save study plan" : "Create my plan"}</span>
              ${shortcutHint("Enter")}
            </button>
            <small>Preferences and progress are saved privately in this browser.</small>
          </div>
        </aside>
      </div>
    </section>
  `;

  document.querySelectorAll("[data-study-plan-level]").forEach((button) => {
    button.addEventListener("click", () => {
      state.studyPlanLevelChoice = button.dataset.studyPlanLevel;
      render();
    });
  });
  document.querySelectorAll("[data-study-plan-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      state.studyPlanFocusChoice = button.dataset.studyPlanFocus;
      render();
    });
  });
  document.querySelectorAll("[data-complete-study-plan]").forEach((button) => {
    button.addEventListener("click", completeStudyPlanSetup);
  });
  document.querySelector("#cancelStudyPlan")?.addEventListener("click", () => {
    state.planSetupOpen = false;
    state.studyPlanLevelChoice = String(state.studyTargetLevel);
    state.studyPlanFocusChoice = state.studyFocus;
    render();
    window.setTimeout(() => window.scrollTo?.({ top: 0, left: 0, behavior: "auto" }), 0);
  });
}

function completeStudyPlanSetup() {
  const levelChoice = state.studyPlanLevelChoice;
  state.studyFocus = STUDY_FOCUSES[state.studyPlanFocusChoice] ? state.studyPlanFocusChoice : "balanced";
  state.onboardingComplete = true;
  state.planSetupOpen = false;
  if (levelChoice === "placement") {
    saveSettings();
    startPlacementSession();
    return;
  }
  setStudyTargetLevel(Number(levelChoice));
  state.studyPlanLevelChoice = String(state.studyTargetLevel);
  render();
  window.setTimeout(() => window.scrollTo?.({ top: 0, left: 0, behavior: "auto" }), 0);
}

function renderDashboardHome() {
  const dashboard = getDashboardData();
  const roadmap = getHskRoadmapData(state.studyTargetLevel);
  const nextActivity = dashboard.nextActivity;
  const goalComplete = dashboard.completedCount >= DASHBOARD_DAILY_GOAL;
  const goalAngle = Math.round(dashboard.goalProgress * 3.6);
  const planSteps = dashboard.plan.map((activity, index) => {
    const isNext = activity.id === nextActivity.id;
    return `
      <button
        class="dashboard-plan-step ${activity.completed ? "is-complete" : ""} ${isNext ? "is-next" : ""}"
        type="button"
        data-dashboard-start="${escapeHtml(activity.tool)}"
        data-dashboard-mode="${escapeHtml(activity.mode || "")}">
        <span class="dashboard-plan-number" aria-hidden="true">${activity.completed ? "&#10003;" : index + 1}</span>
        <span class="dashboard-plan-icon" aria-hidden="true">${dashboardActivityIconMarkup(activity.tool)}</span>
        <span class="dashboard-plan-copy">
          <strong>${escapeHtml(activity.title)}</strong>
          <small>${escapeHtml(activity.detail)}</small>
          <span>${dashboardClockIconMarkup()} ${getDashboardActivityMinutes(activity)} min</span>
        </span>
      </button>
    `;
  }).join("");
  const continueData = getDashboardContinueData(dashboard.latestRecord, nextActivity);
  const tip = getDashboardTip(dashboard.now, dashboard.focus);
  const strongVocabulary = roadmap.milestones.find((milestone) => milestone.id === "retention") || { current: 0, total: 0 };
  const firstMilestoneTarget = Math.min(50, strongVocabulary.total || 50);
  const firstMilestoneCurrent = Math.min(firstMilestoneTarget, strongVocabulary.current || 0);
  const firstMilestonePercent = firstMilestoneTarget ? Math.round((firstMilestoneCurrent / firstMilestoneTarget) * 100) : 0;
  const roadmapCategories = roadmap.milestones.slice(0, 4);
  const snapshotAction = dashboard.saved.total
    ? `
      <button class="dashboard-journey-callout" type="button" id="openSavedNotebook">
        <span aria-hidden="true">${bookmarkIconMarkup(true)}</span>
        <span><strong>Saved notebook</strong><small>${dashboard.saved.total} saved learning ${dashboard.saved.total === 1 ? "item" : "items"}</small></span>
        ${dashboardArrowIconMarkup()}
      </button>
    `
    : `
      <button
        class="dashboard-journey-callout"
        type="button"
        data-dashboard-start="${escapeHtml(nextActivity.tool)}"
        data-dashboard-mode="${escapeHtml(nextActivity.mode || "")}">
        <span aria-hidden="true">${dashboardSproutIconMarkup()}</span>
        <span><strong>Start your journey</strong><small>Complete today&rsquo;s plan to build momentum.</small></span>
        ${dashboardArrowIconMarkup()}
      </button>
    `;

  app.innerHTML = `
    <section class="workspace-panel dashboard-panel">
      <header class="dashboard-hero dashboard-hero-v2">
        <div class="dashboard-hero-copy">
          <h2>${escapeHtml(getDashboardGreeting(dashboard.now))}</h2>
          <p class="dashboard-date">${escapeHtml(formatDashboardDate(dashboard.now))}</p>
          <p>${goalComplete
            ? "Daily goal complete. A little extra practice will make today&rsquo;s work stick."
            : "Consistency builds fluency. Let&rsquo;s make today count."}</p>
          <div class="dashboard-hero-actions">
            <button
              class="primary-btn shortcut-btn dashboard-primary"
              type="button"
              data-dashboard-start="${escapeHtml(nextActivity.tool)}"
              data-dashboard-mode="${escapeHtml(nextActivity.mode || "")}">
              <span class="dashboard-primary-icon" aria-hidden="true">${dashboardPlayIconMarkup()}</span>
              <span>${goalComplete
                ? `Practice ${nextActivity.title}`
                : nextActivity.tool === "review"
                  ? "Continue daily review"
                  : `Continue ${getDashboardActivityShortLabel(nextActivity).toLowerCase()}`}</span>
              ${shortcutHint("Enter")}
            </button>
          </div>
        </div>
        <div class="dashboard-goal-cluster">
          <div class="dashboard-goal" aria-label="${dashboard.completedCount} of ${DASHBOARD_DAILY_GOAL} daily activities complete">
            <div class="dashboard-goal-ring" style="--dashboard-goal-angle: ${goalAngle}deg">
              <strong>${dashboard.completedCount}<small>/${DASHBOARD_DAILY_GOAL}</small></strong>
            </div>
            <span>Daily goal</span>
            <small>lessons</small>
          </div>
          <ul class="dashboard-goal-checklist">
            ${dashboard.plan.map((activity) => `
              <li class="${activity.completed ? "is-complete" : ""}">
                <span aria-hidden="true">${activity.completed ? "&#10003;" : ""}</span>
                <strong>${escapeHtml(getDashboardActivityShortLabel(activity))}</strong>
              </li>
            `).join("")}
          </ul>
        </div>
      </header>

      <section class="dashboard-plan-section" aria-labelledby="dashboardPlanHeading">
        <div class="dashboard-card-heading dashboard-plan-heading">
          <h3 id="dashboardPlanHeading">Today&rsquo;s plan</h3>
          <button type="button" id="editStudyPlan">Edit plan ${dashboardArrowIconMarkup()}</button>
        </div>
        <div class="dashboard-plan-track">${planSteps}</div>
      </section>

      <div class="dashboard-overview-grid">
        <section class="dashboard-overview-card dashboard-learning-card" aria-labelledby="dashboardSnapshotHeading">
          <div class="dashboard-card-heading">
            <h3 id="dashboardSnapshotHeading">Learning snapshot</h3>
            <button type="button" id="dashboardViewHistory">View all ${dashboardArrowIconMarkup()}</button>
          </div>
          <dl class="dashboard-snapshot-list">
            <div><dt>${dashboardMetricIconMarkup("words")} Words learned</dt><dd>${dashboard.review.totalTracked}</dd></div>
            <div><dt>${dashboardMetricIconMarkup("reviews")} Reviews completed</dt><dd>${dashboard.reviewSessions}</dd></div>
            <div><dt>${dashboardMetricIconMarkup("time")} Study time (this week)</dt><dd>${dashboard.studyMinutesThisWeek} min</dd></div>
            <div><dt>${dashboardMetricIconMarkup("streak")} Current streak</dt><dd>${dashboard.practiceStreak} ${dashboard.practiceStreak === 1 ? "day" : "days"}</dd></div>
          </dl>
          ${snapshotAction}
        </section>

        <section class="dashboard-overview-card dashboard-mastery-card" aria-labelledby="dashboardMasteryHeading">
          <div class="dashboard-card-heading">
            <h3 id="dashboardMasteryHeading">HSK ${roadmap.level} mastery path</h3>
            <button type="button" id="dashboardViewPath">View path ${dashboardArrowIconMarkup()}</button>
          </div>
          <div class="dashboard-mastery-levels" role="group" aria-label="Target HSK level">
            ${[1, 2, 3].map((level) => `<button type="button" data-roadmap-level="${level}" aria-pressed="${roadmap.level === level}" class="${roadmap.level === level ? "active" : ""}">HSK ${level}</button>`).join("")}
          </div>
          <span class="dashboard-mastery-eyebrow">Next milestone</span>
          <div class="dashboard-milestone-callout">
            <span aria-hidden="true">${dashboardFlagIconMarkup()}</span>
            <span>
              <strong>Master ${firstMilestoneTarget} words</strong>
              <small>Build a reliable New HSK ${roadmap.level} vocabulary base</small>
            </span>
            <strong>${firstMilestoneCurrent}/${firstMilestoneTarget}</strong>
            <div class="dashboard-progress-track"><span style="width:${firstMilestonePercent}%"></span></div>
          </div>
          <div class="dashboard-overall-progress">
            <span><strong>Overall progress</strong><b>${roadmap.overallPercent}%</b></span>
            <div class="dashboard-progress-track"><span style="width:${roadmap.overallPercent}%"></span></div>
          </div>
          <div class="dashboard-mastery-categories">
            ${roadmapCategories.map((milestone) => `
              <span data-category="${escapeHtml(milestone.id)}">
                <i aria-hidden="true"></i>
                <strong>${escapeHtml(getDashboardMilestoneShortLabel(milestone))}</strong>
                <small>${milestone.current}/${milestone.total}</small>
              </span>
            `).join("")}
          </div>
          <div class="dashboard-mastery-footer">
            <button type="button" id="startPlacementCheck">${roadmap.latestPlacement ? "Retake level check" : "Check my level"}</button>
            <button type="button" id="continueHskRoadmap">Continue path ${dashboardArrowIconMarkup()}</button>
          </div>
        </section>

        <section class="dashboard-overview-card dashboard-activity-card" aria-labelledby="dashboardWeekHeading">
          <div class="dashboard-card-heading">
            <h3 id="dashboardWeekHeading">Activity (last 7 days)</h3>
            <span title="Sessions saved in this browser">i</span>
          </div>
          <div class="dashboard-week-dots" role="img" aria-label="${dashboard.sessionsThisWeek} saved sessions over the last seven days">
            ${dashboard.week.map((day) => `
              <span class="${day.count ? "is-active" : ""}" title="${escapeHtml(`${day.label}: ${day.count} ${day.count === 1 ? "session" : "sessions"}`)}">
                <small>${escapeHtml(day.label === "Today" ? "Today" : day.label.slice(0, 3))}</small>
                <i>${day.count || "-"}</i>
              </span>
            `).join("")}
          </div>
          <div class="dashboard-activity-state">
            <img src="./assets/panda-mascot.png" alt="" aria-hidden="true">
            <strong>${dashboard.sessionsThisWeek ? `${dashboard.sessionsThisWeek} ${dashboard.sessionsThisWeek === 1 ? "session" : "sessions"} this week` : "No activity yet"}</strong>
            <span>${dashboard.sessionsThisWeek ? `${dashboard.todaySessionCount} completed today. Keep the rhythm going.` : "Complete a lesson to start your streak."}</span>
          </div>
        </section>
      </div>

      <div class="dashboard-lower-grid">
        <section class="dashboard-resume-card" aria-labelledby="dashboardResumeHeading">
          <div class="dashboard-card-heading">
            <h3 id="dashboardResumeHeading">Continue where you left off</h3>
            <button type="button" id="dashboardViewAllHistory">View all ${dashboardArrowIconMarkup()}</button>
          </div>
          <button
            class="dashboard-resume-action"
            type="button"
            data-dashboard-start="${escapeHtml(continueData.tool)}"
            data-dashboard-mode="${escapeHtml(continueData.mode || "")}">
            <span aria-hidden="true">${dashboardActivityIconMarkup(continueData.tool)}</span>
            <span><strong>${escapeHtml(continueData.title)}</strong><small>${escapeHtml(continueData.detail)}</small></span>
            <b>${escapeHtml(continueData.actionLabel)} ${dashboardArrowIconMarkup()}</b>
          </button>
        </section>
        <aside class="dashboard-tip-card" aria-labelledby="dashboardTipHeading">
          <div class="dashboard-card-heading"><h3 id="dashboardTipHeading">Daily tip</h3></div>
          <div>
            <span aria-hidden="true">${dashboardStarIconMarkup()}</span>
            <p>${escapeHtml(tip)}</p>
          </div>
        </aside>
      </div>
    </section>
  `;

  document.querySelectorAll("[data-dashboard-start]").forEach((button) => {
    button.addEventListener("click", () => {
      launchDashboardActivity(button.dataset.dashboardStart, button.dataset.dashboardMode || "");
    });
  });
  document.querySelector("#editStudyPlan")?.addEventListener("click", () => {
    state.studyPlanLevelChoice = String(state.studyTargetLevel);
    state.studyPlanFocusChoice = state.studyFocus;
    state.planSetupOpen = true;
    render();
  });
  document.querySelector("#openSavedNotebook")?.addEventListener("click", () => openGlobalSearch({ view: "saved" }));
  document.querySelectorAll("#dashboardViewHistory, #dashboardViewAllHistory").forEach((button) => {
    button.addEventListener("click", () => {
      state.tool = "history";
      saveSettings();
      render();
    });
  });
  document.querySelector("#dashboardViewPath")?.addEventListener("click", () => {
    state.tool = "vocabulary";
    state.vocabularyView = "path";
    saveSettings();
    render();
  });
  document.querySelectorAll("[data-roadmap-level]").forEach((button) => {
    button.addEventListener("click", () => {
      const level = Number(button.dataset.roadmapLevel);
      if (![1, 2, 3].includes(level) || level === state.studyTargetLevel) {
        return;
      }
      setStudyTargetLevel(level);
      render();
    });
  });
  document.querySelector("#startPlacementCheck")?.addEventListener("click", startPlacementSession);
  document.querySelector("#continueHskRoadmap")?.addEventListener("click", () => {
    launchHskRoadmapAction(roadmap.recommendation);
  });
}

function dashboardActivityIconMarkup(tool) {
  const paths = {
    vocabulary: '<path d="M5 5h11a3 3 0 0 1 3 3v11H8a3 3 0 0 1-3-3V5z"></path><path d="M9 9h6"></path><path d="M9 13h4"></path>',
    review: '<path d="M20 7v5h-5"></path><path d="M19 12a7 7 0 1 1-2-5"></path><path d="m9 12 2 2 4-4"></path>',
    grammar: '<path d="M9 3h6"></path><path d="M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"></path><path d="M8 15h8"></path>',
    pronunciation: '<path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"></path><path d="M5 10v1a7 7 0 0 0 14 0v-1"></path><path d="M12 18v3"></path>',
    drill: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H7a3 3 0 0 0-3 3V5.5z"></path><path d="M8 8h8"></path><path d="M8 12h6"></path>',
    reader: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5z"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5z"></path>',
    exam: '<path d="M7 3h10v4H7z"></path><path d="M5 5h14v16H5z"></path><path d="m8 12 2 2 4-4"></path>',
    map: '<path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z"></path><path d="M9 3v15"></path><path d="M15 6v15"></path>',
  };
  return `<svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[tool] || paths.review}</svg>`;
}

function dashboardMetricIconMarkup(kind) {
  const paths = {
    words: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5z"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5z"></path>',
    reviews: '<rect x="4" y="5" width="16" height="16" rx="2"></rect><path d="M8 3v4"></path><path d="M16 3v4"></path><path d="M4 10h16"></path><path d="m9 15 2 2 4-4"></path>',
    time: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
    streak: '<path d="M13 2c.5 3-1 4.5-2.5 6.2C9 10 8 11.5 9 14c.6-1.2 1.5-2.1 2.7-3 .2 2.1 1.3 3.1 2.3 4.2 1 1 1.5 2.1 1.2 3.8A6.5 6.5 0 0 0 13 2z"></path><path d="M7.5 12.5A6.5 6.5 0 0 0 12 22c3.6 0 6.5-2.7 6.5-6.2"></path>',
  };
  return `<svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[kind] || paths.words}</svg>`;
}

function dashboardClockIconMarkup() {
  return '<svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>';
}

function dashboardArrowIconMarkup() {
  return '<svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14"></path><path d="m14 7 5 5-5 5"></path></svg>';
}

function dashboardPlayIconMarkup() {
  return '<svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><path d="m10 8 6 4-6 4V8z"></path></svg>';
}

function dashboardFlagIconMarkup() {
  return '<svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 22V4"></path><path d="M5 5h12l-2 4 2 4H5"></path></svg>';
}

function dashboardStarIconMarkup() {
  return '<svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z"></path></svg>';
}

function dashboardSproutIconMarkup() {
  return '<svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21v-9"></path><path d="M12 14c-4 0-7-2.5-7-7 4 0 7 2.5 7 7z"></path><path d="M12 11c0-4 2.5-7 7-7 0 4-2.5 7-7 7z"></path></svg>';
}

function getDashboardActivityMinutes(activity) {
  if (activity.tool === "pronunciation" || activity.tool === "grammar") return 10;
  if (activity.tool === "drill") return 12;
  return 10;
}

function getDashboardActivityShortLabel(activity) {
  if (activity.tool === "review") return "Vocabulary review";
  if (activity.tool === "pronunciation") return "Pronunciation practice";
  if (activity.tool === "grammar") return "Grammar patterns";
  if (activity.tool === "drill") return `${MODES[activity.mode]?.label || "Sentence"} practice`;
  return activity.title;
}

function getDashboardMilestoneShortLabel(milestone) {
  const labels = {
    coverage: "Words",
    retention: "Recall",
    grammar: "Grammar",
    benchmarks: "Quizzes",
    exam: "Exam",
  };
  return labels[milestone.id] || milestone.label;
}

function getDashboardContinueData(record, fallback) {
  if (!record) {
    return {
      tool: fallback.tool,
      mode: fallback.mode || "",
      title: "No recent activity",
      detail: `Start with ${fallback.title.toLowerCase()} from today's plan.`,
      actionLabel: "Start lesson",
    };
  }
  const presentation = getHistoryRecordPresentation(record);
  const toolByType = {
    vocabulary: "vocabulary",
    review: "review",
    grammar: "grammar",
    reader: "reader",
    exam: "exam",
    pronunciation: "pronunciation",
    tone: "pronunciation",
    map: "map",
    drill: "drill",
    placement: "exam",
  };
  return {
    tool: toolByType[record.type] || fallback.tool,
    mode: record.type === "drill" ? record.mode || "" : record.type === "tone" ? "tone" : "",
    title: presentation.typeLabel,
    detail: `${presentation.modeLabel} · ${presentation.resultLabel}`,
    actionLabel: "Practice again",
  };
}

function getDashboardTip(now = Date.now(), focus = {}) {
  const tips = [
    "Try shadowing a native speaker and match the tone contour, not just the syllable.",
    "Recall a word before revealing it. The effort is what strengthens the memory.",
    "Read one sentence aloud twice: first slowly for accuracy, then once at natural speed.",
    "When a word keeps slipping, notice its initial, final, and tone as three separate cues.",
    focus?.detail || "A short daily session is more useful than a long session you cannot repeat.",
  ];
  const dayIndex = Math.floor(now / 86400000) % tips.length;
  return tips[dayIndex];
}

function getDashboardData(now = Date.now(), history = loadHistoryRecords()) {
  const review = getReviewDashboardData(now);
  const plan = buildDashboardPlan(history, review, now, state.studyFocus);
  const completedCount = plan.filter((activity) => activity.completed).length;
  const week = getDashboardWeek(history, now);
  const weekKeys = new Set(week.map((day) => day.dateKey));
  const weekRecords = history.filter((record) => weekKeys.has(localDateKey(Date.parse(record.completedAt))));
  const todayKey = localDateKey(now);
  const savedVocabularyKeys = loadSavedVocabularyKeys();
  const savedVocabularyCount = getAllVocabularyReviewItems()
    .filter((item) => savedVocabularyKeys.has(reviewItemKey(item)))
    .length;
  const savedSentenceCount = loadSavedSentenceIds().size;

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
    studyMinutesThisWeek: Math.round(weekRecords.reduce((sum, record) => sum + (Number(record.elapsedSeconds) || 0), 0) / 60),
    reviewSessions: history.filter((record) => record.type === "review").length,
    latestRecord: history[0] || null,
    historyCount: history.length,
    pronunciationAccuracy: getDashboardPronunciationAccuracy(history),
    focus: getDashboardFocusInsight(history, review),
    saved: {
      vocabularyCount: savedVocabularyCount,
      sentenceCount: savedSentenceCount,
      total: savedVocabularyCount + savedSentenceCount,
    },
  };
}

function getHskRoadmapData(
  level = state.studyTargetLevel,
  {
    history = loadHistoryRecords(),
    progress = ensureReviewProgress(),
    now = Date.now(),
    sets = VOCABULARY_QUIZ_SETS,
  } = {},
) {
  const targetLevel = [1, 2, 3].includes(Number(level)) ? Number(level) : 1;
  const vocabularyPath = getVocabularyPathData(progress, now, sets);
  const vocabularyLevel = vocabularyPath.levels.find((item) => Number(item.levelNumber) === targetLevel) || {
    label: `HSK ${targetLevel}`,
    levelNumber: String(targetLevel),
    parts: [],
    totals: createVocabularyPathCounts(),
  };
  const targetSetIds = new Set(vocabularyLevel.parts.map((part) => part.set.id));
  const lessons = GRAMMAR_LESSONS
    .filter((lesson) => lesson.level === targetLevel)
    .map((lesson) => ({
      ...lesson,
      progress: getGrammarLessonProgress(history, lesson.id),
    }));
  const benchmarkModes = Object.keys(VOCABULARY_MODES);
  const latestPlacement = history
    .filter((record) => record.type === "placement")
    .sort((a, b) => Date.parse(b.completedAt || "") - Date.parse(a.completedAt || ""))[0] || null;
  const passedBenchmarks = new Set(
    history
      .filter((record) =>
        record.type === "vocabulary" &&
        targetSetIds.has(record.setId) &&
        benchmarkModes.includes(record.quizMode) &&
        record.highScoreEligible,
      )
      .map((record) => `${record.setId}:${record.quizMode}`),
  );
  const grammarStarted = lessons.filter((lesson) => lesson.progress.attempts).length;
  const grammarStrong = lessons.filter((lesson) => lesson.progress.status === "Strong").length;
  const writtenExamAttempts = history.filter((record) =>
    record.type === "exam" &&
    record.examMode !== "speaking" &&
    Number(record.level) === targetLevel &&
    Number(record.maxScore) > 0,
  );
  const examBestPercent = writtenExamAttempts.reduce((best, record) =>
    Math.max(best, Math.round((Number(record.scaledScore || 0) / Number(record.maxScore)) * 100)),
  0);
  const benchmarkTotal = vocabularyLevel.parts.length * benchmarkModes.length;
  const knowledgeMilestone = {
    id: "grammar",
    label: "Grammar patterns",
    current: grammarStrong,
    total: lessons.length,
    detail: `${grammarStrong} of ${lessons.length} core patterns strong`,
  };
  const milestones = [
    {
      id: "coverage",
      label: "Vocabulary coverage",
      current: vocabularyLevel.totals.introduced,
      total: vocabularyLevel.totals.total,
      detail: `${vocabularyLevel.totals.introduced} of ${vocabularyLevel.totals.total} words introduced`,
    },
    {
      id: "retention",
      label: "Strong vocabulary",
      current: vocabularyLevel.totals.strong,
      total: vocabularyLevel.totals.total,
      detail: `${vocabularyLevel.totals.strong} words retained through spaced review`,
    },
    knowledgeMilestone,
    {
      id: "benchmarks",
      label: "Quiz benchmarks",
      current: passedBenchmarks.size,
      total: benchmarkTotal,
      detail: `${passedBenchmarks.size} of ${benchmarkTotal} Pinyin and Audio benchmarks passed`,
    },
    ...(targetLevel === 3 ? [{
      id: "exam",
      label: "Mock exam readiness",
      current: Math.min(70, examBestPercent),
      total: 70,
      detail: writtenExamAttempts.length
        ? `Best timed mock score: ${examBestPercent}% · target 70%`
        : "Complete a timed HSK 3 written mock · target 70%",
    }] : []),
  ].map((milestone) => ({
    ...milestone,
    percent: getHskRoadmapPercent(milestone.current, milestone.total),
    status: getHskRoadmapMilestoneStatus(milestone.current, milestone.total),
  }));
  const roadmap = {
    level: targetLevel,
    levelLabel: vocabularyLevel.label,
    vocabularyLevel,
    lessons,
    grammarStarted,
    grammarStrong,
    examBestPercent,
    writtenExamAttempts,
    benchmarkModes,
    passedBenchmarks,
    latestPlacement,
    milestones,
    overallPercent: milestones.length
      ? Math.round(milestones.reduce((sum, milestone) => sum + milestone.percent, 0) / milestones.length)
      : 0,
  };
  roadmap.recommendation = getHskRoadmapRecommendation(roadmap);
  return roadmap;
}

function getHskRoadmapPercent(current, total) {
  return total > 0 ? Math.min(100, Math.round((Math.max(0, current) / total) * 100)) : 0;
}

function getHskRoadmapMilestoneStatus(current, total) {
  if (total > 0 && current >= total) {
    return "Complete";
  }
  return current > 0 ? "In progress" : "Not started";
}

function setStudyTargetLevel(level) {
  const targetLevel = [1, 2, 3].includes(Number(level)) ? Number(level) : 1;
  state.studyTargetLevel = targetLevel;
  state.grammarLevel = targetLevel;
  state.grammarLessonId = "";
  const firstTargetSet = VOCABULARY_QUIZ_SETS.find((set) =>
    Number(getVocabularySetMeta(set).levelNumber) === targetLevel,
  );
  if (firstTargetSet) {
    state.vocabularySetId = firstTargetSet.id;
  }
  saveSettings();
}

function getHskRoadmapRecommendation(roadmap) {
  const parts = roadmap.vocabularyLevel.parts;
  const duePart = parts.find((part) => part.counts.due > 0);
  if (duePart) {
    return {
      type: "review-set",
      setId: duePart.set.id,
      label: "Review due vocabulary",
      detail: `${duePart.counts.due} due in ${roadmap.levelLabel} · ${duePart.meta.partLabel}`,
    };
  }

  const vocabularyTotals = roadmap.vocabularyLevel.totals;
  const vocabularyPart = parts.find((part) => part.counts.learning > 0) ||
    parts.find((part) => part.counts.new > 0) ||
    parts[0];
  if (!vocabularyTotals.introduced && vocabularyPart) {
    return {
      type: "review-set",
      setId: vocabularyPart.set.id,
      label: `Begin ${roadmap.levelLabel} vocabulary`,
      detail: `${vocabularyPart.meta.partLabel} · first 12 words`,
    };
  }

  const nextGrammarLesson = roadmap.lessons.find((lesson) => lesson.progress.status !== "Strong");
  const coverageRatio = vocabularyTotals.total ? vocabularyTotals.introduced / vocabularyTotals.total : 0;
  const grammarPracticeRatio = roadmap.lessons.length ? roadmap.grammarStarted / roadmap.lessons.length : 1;
  if (nextGrammarLesson && grammarPracticeRatio <= coverageRatio) {
    return {
      type: "grammar-lesson",
      lessonId: nextGrammarLesson.id,
      label: "Continue grammar",
      detail: `${nextGrammarLesson.title} · ${nextGrammarLesson.pattern}`,
    };
  }

  const benchmarkPart = parts.find((part) =>
    part.counts.total > 0 &&
    part.counts.introduced >= part.counts.total &&
    roadmap.benchmarkModes.some((mode) => !roadmap.passedBenchmarks.has(`${part.set.id}:${mode}`)),
  );
  if (benchmarkPart) {
    const quizMode = roadmap.benchmarkModes.find((mode) =>
      !roadmap.passedBenchmarks.has(`${benchmarkPart.set.id}:${mode}`),
    ) || "pinyin";
    return {
      type: "quiz-set",
      setId: benchmarkPart.set.id,
      quizMode,
      label: `Take ${VOCABULARY_MODES[quizMode]?.label || "Vocabulary"} benchmark`,
      detail: `${roadmap.levelLabel} · ${benchmarkPart.meta.partLabel}`,
    };
  }

  if (vocabularyPart && vocabularyTotals.strong < vocabularyTotals.total) {
    return {
      type: "review-set",
      setId: vocabularyPart.set.id,
      label: "Continue vocabulary path",
      detail: `${roadmap.levelLabel} · ${vocabularyPart.meta.partLabel}`,
    };
  }

  if (nextGrammarLesson) {
    return {
      type: "grammar-lesson",
      lessonId: nextGrammarLesson.id,
      label: "Strengthen grammar",
      detail: `${nextGrammarLesson.title} · ${nextGrammarLesson.pattern}`,
    };
  }

  const missingBenchmark = parts.flatMap((part) =>
    roadmap.benchmarkModes.map((mode) => ({ part, mode })),
  ).find(({ part, mode }) => !roadmap.passedBenchmarks.has(`${part.set.id}:${mode}`));
  if (missingBenchmark) {
    return {
      type: "quiz-set",
      setId: missingBenchmark.part.set.id,
      quizMode: missingBenchmark.mode,
      label: `Take ${VOCABULARY_MODES[missingBenchmark.mode]?.label || "Vocabulary"} benchmark`,
      detail: `${roadmap.levelLabel} · ${missingBenchmark.part.meta.partLabel}`,
    };
  }

  if (roadmap.level === 3 && roadmap.examBestPercent < 70) {
    return {
      type: "exam",
      level: 3,
      label: roadmap.writtenExamAttempts.length ? "Improve HSK 3 mock score" : "Take an HSK 3 mock exam",
      detail: roadmap.writtenExamAttempts.length
        ? `Personal best ${roadmap.examBestPercent}% · target 70%`
        : "Timed written paper with exam-style sections",
    };
  }

  return {
    type: "review",
    label: `Maintain ${roadmap.levelLabel}`,
    detail: "Keep strong words active with spaced review",
  };
}

function buildHskRoadmapMarkup(roadmap) {
  const recommendation = roadmap.recommendation;
  return `
    <section class="dashboard-roadmap" aria-labelledby="dashboardRoadmapHeading">
      <header class="dashboard-roadmap-header">
        <div>
          <h3 id="dashboardRoadmapHeading">HSK mastery roadmap</h3>
          <p>A balanced path across vocabulary coverage, retention, knowledge checks, and timed benchmarks.</p>
        </div>
        <div class="dashboard-roadmap-controls">
          <div class="dashboard-roadmap-levels" role="group" aria-label="Target HSK level">
            ${[1, 2, 3].map((level) => `
              <button type="button" data-roadmap-level="${level}" aria-pressed="${roadmap.level === level}" class="${roadmap.level === level ? "active" : ""}">HSK ${level}</button>
            `).join("")}
          </div>
          <div class="dashboard-placement-control">
            <button class="ghost-btn dashboard-placement-start" type="button" id="startPlacementCheck">${roadmap.latestPlacement ? "Retake level check" : "Check my level"}</button>
            ${roadmap.latestPlacement ? `<small>Last result: HSK ${roadmap.latestPlacement.recommendedLevel || 1}</small>` : ""}
          </div>
        </div>
      </header>

      <div class="dashboard-roadmap-layout">
        <div class="dashboard-roadmap-summary">
          <span>Path progress</span>
          <div class="dashboard-roadmap-score">
            <strong>${roadmap.overallPercent}%</strong>
            <small>${escapeHtml(roadmap.levelLabel)}</small>
          </div>
          <div class="progress-track" role="progressbar" aria-label="${escapeHtml(roadmap.levelLabel)} path progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${roadmap.overallPercent}">
            <div style="width:${roadmap.overallPercent}%"></div>
          </div>
          <div class="dashboard-roadmap-next">
            <span>Recommended next</span>
            <strong>${escapeHtml(recommendation.label)}</strong>
            <small>${escapeHtml(recommendation.detail)}</small>
          </div>
          <button class="primary-btn dashboard-roadmap-continue" type="button" id="continueHskRoadmap">
            Continue path
          </button>
        </div>

        <div class="dashboard-roadmap-milestones">
          ${roadmap.milestones.map((milestone, index) => `
            <div class="dashboard-roadmap-milestone ${milestone.status === "Complete" ? "is-complete" : ""}">
              <span class="dashboard-roadmap-index" aria-hidden="true">${milestone.status === "Complete" ? "✓" : index + 1}</span>
              <div class="dashboard-roadmap-milestone-copy">
                <div>
                  <strong>${escapeHtml(milestone.label)}</strong>
                  <span>${escapeHtml(milestone.status)}</span>
                </div>
                <small>${escapeHtml(milestone.detail)}</small>
                <div class="progress-track" role="progressbar" aria-label="${escapeHtml(milestone.label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${milestone.percent}">
                  <div style="width:${milestone.percent}%"></div>
                </div>
              </div>
              <strong class="dashboard-roadmap-count">${milestone.current}/${milestone.total}</strong>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function launchHskRoadmapAction(action) {
  if (!action) {
    return;
  }
  stopPronunciationRecognition();
  stopSpeech();
  state.session = null;
  state.result = null;
  state.dataError = "";

  if (action.type === "review-set") {
    startVocabularySetReview(action.setId);
    return;
  }
  if (action.type === "grammar-lesson") {
    const lesson = getGrammarLessonById(action.lessonId);
    state.tool = "grammar";
    state.grammarLevel = lesson?.level || state.studyTargetLevel;
    state.grammarLessonId = action.lessonId || "";
    saveSettings();
    render();
    return;
  }
  if (action.type === "quiz-set") {
    state.tool = "vocabulary";
    state.vocabularyView = "quiz";
    state.vocabularySetId = action.setId || state.vocabularySetId;
    state.vocabularyMode = VOCABULARY_MODES[action.quizMode] ? action.quizMode : "pinyin";
    saveSettings();
    render();
    return;
  }
  if (action.type === "exam") {
    state.tool = "exam";
    state.examLevel = HSK_EXAM_LEVELS.includes(Number(action.level)) ? Number(action.level) : state.studyTargetLevel;
    state.examMode = "written";
    state.examScreen = "home";
    saveSettings();
    render();
    return;
  }

  state.tool = "review";
  saveSettings();
  startReviewSession();
}

function getPlacementVocabularyPool(level, vocabulary = getAllVocabularyReviewItems()) {
  const targetLevel = Number(level) || 1;
  const itemByZh = new Map(
    vocabulary
      .filter((item) => Number(getVocabularySetMeta(item).levelNumber) === targetLevel)
      .map((item) => [item.zh, item]),
  );
  return (PLACEMENT_VOCABULARY[targetLevel] || []).flatMap((definition) => {
    const item = itemByZh.get(definition.zh);
    return item ? [{ ...definition, pinyin: item.pinyin }] : [];
  });
}

function buildPlacementSessionItems() {
  const items = [];
  [1, 2, 3].forEach((level) => {
    const vocabularyPool = getPlacementVocabularyPool(level);
    shuffle(vocabularyPool).slice(0, PLACEMENT_VOCABULARY_PER_LEVEL).forEach((entry) => {
      const options = shuffle([
        entry.meaning,
        ...shuffle(vocabularyPool.filter((candidate) => candidate.zh !== entry.zh))
          .slice(0, 3)
          .map((candidate) => candidate.meaning),
      ]);
      items.push({
        id: `placement-vocabulary-${level}-${entry.zh}`,
        kind: "vocabulary",
        level,
        prompt: entry.zh,
        translation: "Choose the closest English meaning.",
        pinyin: entry.pinyin,
        answer: entry.meaning,
        options,
        explanation: `${entry.zh} (${entry.pinyin}) means ${entry.meaning}.`,
      });
    });

    if (level <= 2) {
      shuffle(GRAMMAR_LESSONS.filter((lesson) => lesson.level === level))
        .slice(0, PLACEMENT_GRAMMAR_PER_LEVEL)
        .forEach((lesson) => {
          const question = shuffle(lesson.questions)[0];
          items.push({
            id: `placement-language-${question ? `${lesson.id}-${lesson.questions.indexOf(question) + 1}` : lesson.id}`,
            kind: "language",
            level,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            lessonPattern: lesson.pattern,
            prompt: question?.prompt || "",
            translation: question?.translation || "",
            answer: question?.answer || "",
            options: [...(question?.options || [])],
            explanation: question?.explanation || lesson.summary,
          });
        });
      return;
    }

    const readingQuestions = HSK_MOCK_EXAMS.levels[3]?.sections
      ?.find((section) => section.id === "reading")
      ?.parts.flatMap((part) => part.questions)
      .filter((question) => question.type === "choice" && question.choices.every((choice) => choice.label)) || [];
    const readingDistractors = readingQuestions.flatMap((question) => question.choices.map((choice) => choice.label));
    shuffle(readingQuestions)
      .slice(0, PLACEMENT_GRAMMAR_PER_LEVEL)
      .forEach((question) => {
        const answer = question.choices.find((choice) => choice.id === question.answer)?.label || "";
        items.push({
          id: `placement-language-${question.id}`,
          kind: "language",
          level,
          prompt: question.prompt,
          translation: question.instruction || "Choose the best answer.",
          answer,
          options: uniqueStrings([
            ...question.choices.map((choice) => choice.label),
            ...shuffle(readingDistractors),
          ]).slice(0, 4),
          explanation: `The best answer is ${answer}.`,
        });
      });
  });

  return shuffle(items).map((item, itemIndex) => ({
    ...item,
    choices: shuffle(item.options).map((text, choiceIndex) => ({
      id: `${item.id}-choice-${itemIndex}-${choiceIndex}`,
      text,
      correct: text === item.answer,
      shortcut: String(choiceIndex + 1),
    })),
  }));
}

function startPlacementSession() {
  const items = buildPlacementSessionItems();
  if (items.length !== PLACEMENT_SESSION_LENGTH) {
    state.dataError = "The placement question bank could not be loaded.";
    render();
    return;
  }
  stopPronunciationRecognition();
  stopSpeech();
  state.tool = "dashboard";
  state.dataError = "";
  state.result = null;
  state.session = {
    type: "placement",
    items,
    index: 0,
    answers: [],
    currentAssessment: null,
    startedAt: Date.now(),
  };
  render();
  window.setTimeout(() => window.scrollTo?.({ top: 0, left: 0, behavior: "auto" }), 0);
}

function renderPlacementSession() {
  const session = state.session;
  const item = session.items[session.index];
  const assessment = session.currentAssessment;
  const correct = session.answers.filter((answer) => answer.correct).length;
  const progress = Math.round(((session.index + (assessment ? 1 : 0)) / session.items.length) * 100);
  const prompt = item.kind === "language"
    ? buildGrammarPromptMarkup(item.prompt)
    : escapeHtml(item.prompt);

  app.innerHTML = `
    <section class="workspace-panel placement-session">
      <header class="placement-session-header">
        <div>
          <span>Quick level check</span>
          <strong>${item.kind === "language" ? "Language in context" : "Vocabulary recognition"}</strong>
        </div>
        <div class="placement-session-score"><span>Score</span><strong>${correct}/${session.answers.length}</strong></div>
        <button class="ghost-btn" type="button" id="exitPlacementCheck">Exit check</button>
      </header>
      <div class="placement-session-progress">
        <div class="progress-track" role="progressbar" aria-label="Level check progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><div style="width:${progress}%"></div></div>
        <span>Question ${session.index + 1} of ${session.items.length}</span>
      </div>

      <section class="placement-question-panel ${assessment ? "is-answered" : ""}">
        <div class="placement-question-copy">
          <span>${item.kind === "language" ? "Choose the best answer" : "What does this word mean?"}</span>
          <h2 class="chinese-text ${item.kind === "vocabulary" ? "is-vocabulary" : ""}" lang="zh-CN">${prompt}</h2>
          <p>${escapeHtml(item.translation)}</p>
        </div>

        <div class="placement-choice-grid">
          ${item.choices.map((choice) => buildPlacementChoiceMarkup(item, choice, assessment)).join("")}
        </div>

        ${assessment ? buildPlacementFeedbackMarkup(item, assessment) : ""}
        ${assessment ? `
          <button class="primary-btn shortcut-btn placement-next-button" type="button" id="nextQuestion">
            <span>${session.index + 1 >= session.items.length ? "View results" : "Next question"}</span>
            ${shortcutHint("Enter")}
          </button>
        ` : ""}
      </section>
    </section>
  `;

  document.querySelectorAll("[data-placement-choice-id]").forEach((button) => {
    button.addEventListener("click", () => submitPlacementChoice(button.dataset.placementChoiceId));
  });
  document.querySelector("#nextQuestion")?.addEventListener("click", nextQuestion);
  document.querySelector("#exitPlacementCheck")?.addEventListener("click", () => {
    state.session = null;
    render();
  });
}

function buildPlacementChoiceMarkup(item, choice, assessment) {
  const selected = assessment?.choiceId === choice.id;
  const classes = [
    "choice-option",
    "placement-choice-option",
    selected ? "selected" : "",
    assessment && choice.correct ? "correct" : "",
    assessment && selected && !choice.correct ? "incorrect" : "",
    assessment && selected && choice.correct ? "correct-celebration" : "",
  ].filter(Boolean).join(" ");
  return `
    <button class="${classes}" type="button" data-placement-choice-id="${escapeHtml(choice.id)}" ${assessment ? "disabled" : ""}>
      <span class="choice-key">${escapeHtml(choice.shortcut)}</span>
      <span class="choice-text ${item.kind === "language" ? "chinese-text" : ""}" ${item.kind === "language" ? 'lang="zh-CN"' : ""}>${escapeHtml(choice.text)}</span>
    </button>
  `;
}

function buildPlacementFeedbackMarkup(item, assessment) {
  return `
    <section class="placement-feedback ${assessment.correct ? "is-correct correct-celebration" : "is-wrong"}" role="status" aria-live="polite">
      <div>
        <strong>${assessment.correct ? "Correct" : "Review this one"}</strong>
        <span>Answer: <b class="${item.kind === "language" ? "chinese-text" : ""}">${escapeHtml(item.answer)}</b></span>
      </div>
      ${item.kind === "vocabulary" ? `<p class="tone-pinyin">${buildToneColoredPinyinMarkup(item.pinyin)}</p>` : ""}
      <p>${escapeHtml(item.explanation)}</p>
    </section>
  `;
}

function submitPlacementChoiceByShortcut(shortcut) {
  const session = state.session;
  if (session?.type !== "placement" || session.currentAssessment) {
    return;
  }
  const choice = session.items[session.index]?.choices.find((option) => option.shortcut === shortcut);
  if (choice) {
    submitPlacementChoice(choice.id);
  }
}

function submitPlacementChoice(choiceId) {
  const session = state.session;
  const item = session?.items?.[session.index];
  if (session?.type !== "placement" || !item || session.currentAssessment) {
    return;
  }
  const choice = item.choices.find((option) => option.id === choiceId);
  if (!choice) {
    return;
  }
  const assessment = {
    choiceId: choice.id,
    answer: choice.text,
    expected: item.answer,
    correct: choice.correct,
    score: choice.correct ? 1 : 0,
  };
  session.currentAssessment = assessment;
  session.answers.push({ ...assessment, item, itemIndex: session.index });
  render();
  scrollPlacementFeedbackIntoView();
}

function scrollPlacementFeedbackIntoView() {
  window.setTimeout(() => {
    document.querySelector("#nextQuestion")?.scrollIntoView?.({ block: "nearest", behavior: "auto" });
  }, 0);
}

function scrollPlacementQuestionIntoView() {
  window.setTimeout(() => {
    document.querySelector(".placement-question-copy")?.scrollIntoView?.({ block: "nearest", behavior: "auto" });
  }, 0);
}

function getPlacementResultStats(result) {
  const answers = result?.answers || [];
  const buildStats = (items) => {
    const correct = items.filter((answer) => answer.correct).length;
    return {
      correct,
      total: items.length,
      accuracy: items.length ? correct / items.length : 0,
    };
  };
  return {
    total: buildStats(answers),
    levels: {
      1: buildStats(answers.filter((answer) => answer.item.level === 1)),
      2: buildStats(answers.filter((answer) => answer.item.level === 2)),
      3: buildStats(answers.filter((answer) => answer.item.level === 3)),
    },
    skills: {
      vocabulary: buildStats(answers.filter((answer) => answer.item.kind === "vocabulary")),
      language: buildStats(answers.filter((answer) => answer.item.kind === "language")),
    },
  };
}

function getPlacementRecommendation(result) {
  const stats = getPlacementResultStats(result);
  if (stats.levels[1].accuracy < 0.7) {
    return {
      level: 1,
      band: "HSK 1 foundation",
      summary: "Build reliable HSK 1 vocabulary and core sentence patterns before moving up.",
    };
  }
  if (stats.levels[2].accuracy >= 0.7) {
    if (stats.levels[3].accuracy >= 0.7) {
      return {
        level: 3,
        band: "HSK 3 consolidation",
        summary: "You recognize much of HSK 3. Focus on retention, speed, and performance in timed mock exams.",
      };
    }
    return {
      level: 3,
      band: "Ready for HSK 3",
      summary: "Your HSK 2 foundation is ready. Start building HSK 3 vocabulary and exam confidence.",
    };
  }
  return {
    level: 2,
    band: "Ready for HSK 2",
    summary: "Your HSK 1 foundation is ready. Start building HSK 2 vocabulary and grammar.",
  };
}

function renderPlacementResults() {
  const result = state.result;
  const stats = getPlacementResultStats(result);
  const recommendation = getPlacementRecommendation(result);
  const rows = result.answers.map((answer, index) => {
    const item = answer.item;
    const prompt = item.kind === "language"
      ? buildGrammarPromptMarkup(item.prompt)
      : `${escapeHtml(item.prompt)} <small>${buildToneColoredPinyinMarkup(item.pinyin)}</small>`;
    return `
      <tr class="${answer.correct ? "found" : "missed"}">
        <td>${index + 1}</td>
        <td>HSK ${item.level} ${item.kind === "language" ? "Language use" : "Vocabulary"}</td>
        <td class="chinese-text">${prompt}</td>
        <td>${escapeHtml(answer.answer)}</td>
        <td>${escapeHtml(item.answer)}</td>
        <td class="${answer.correct ? "status-good" : "status-review"}">${answer.correct ? "Correct" : "Wrong"}</td>
      </tr>
    `;
  }).join("");

  app.innerHTML = `
    <section class="workspace-panel placement-results">
      <header class="results-header">
        <div>
          <h2>Level check complete</h2>
          <p>${stats.total.correct} of ${stats.total.total} correct across vocabulary and language use.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn" type="button" id="retakePlacement">Retake check</button>
          <button class="ghost-btn" type="button" id="backFromPlacement">Back to Today</button>
        </div>
      </header>

      <section class="placement-recommendation">
        <div>
          <span>Recommended roadmap</span>
          <h3>${escapeHtml(recommendation.band)}</h3>
          <p>${escapeHtml(recommendation.summary)}</p>
        </div>
        <button class="primary-btn" type="button" id="applyPlacementResult">Use HSK ${recommendation.level} roadmap</button>
      </section>

      <div class="placement-result-stats">
        ${[
          ["HSK 1", stats.levels[1]],
          ["HSK 2", stats.levels[2]],
          ["HSK 3", stats.levels[3]],
          ["Vocabulary", stats.skills.vocabulary],
          ["Language use", stats.skills.language],
        ].map(([label, item]) => `
          <div>
            <span>${label}</span>
            <strong>${Math.round(item.accuracy * 100)}%</strong>
            <small>${item.correct}/${item.total} correct</small>
            <div class="progress-track"><div style="width:${Math.round(item.accuracy * 100)}%"></div></div>
          </div>
        `).join("")}
      </div>

      <div class="placement-results-heading">
        <div>
          <h3>Answer review</h3>
          <p>This short check estimates where to start. Your roadmap continues adapting as you practice.</p>
        </div>
      </div>
      <div class="results-table-wrap" tabindex="0">
        <table class="placement-results-table">
          <thead><tr><th>#</th><th>Area</th><th>Question</th><th>Your answer</th><th>Expected</th><th>Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  document.querySelector("#applyPlacementResult")?.addEventListener("click", () => {
    setStudyTargetLevel(recommendation.level);
    state.result = null;
    state.session = null;
    state.tool = "dashboard";
    render();
    window.setTimeout(() => window.scrollTo?.({ top: 0, left: 0, behavior: "auto" }), 0);
  });
  document.querySelector("#retakePlacement")?.addEventListener("click", startPlacementSession);
  document.querySelector("#backFromPlacement")?.addEventListener("click", () => {
    state.result = null;
    state.session = null;
    state.tool = "dashboard";
    render();
  });
}

function buildDashboardPlan(history, review, now = Date.now(), focus = state.studyFocus) {
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
  const languageActivity = getRecommendedLanguageActivity(history, drillMode, drillLabel, now);
  const reviewDetail = review.dueCount
    ? `${review.dueCount} due ${review.dueCount === 1 ? "word" : "words"} · mixed pinyin and listening`
    : review.totalTracked
      ? "12-word retrieval practice to maintain recall"
      : `Build your adaptive HSK ${state.studyTargetLevel} vocabulary baseline`;

  const reviewActivity = {
    id: "review",
    tool: "review",
    title: "Daily vocabulary review",
    detail: reviewDetail,
    completed: completedTypes.has("review"),
  };
  const pronunciationActivity = {
    id: "pronunciation",
    tool: "pronunciation",
    title: "Pronunciation practice",
    detail: "15 short sentences with word-level feedback",
    completed: completedTypes.has("pronunciation"),
  };
  const selectedFocus = STUDY_FOCUSES[focus] ? focus : "balanced";
  if (selectedFocus === "speaking") {
    return [
      pronunciationActivity,
      buildFocusedDrillActivity(history, "listening", now),
      reviewActivity,
    ];
  }
  if (selectedFocus === "literacy") {
    const knowledgeActivity = {
      id: "grammar",
      tool: "grammar",
      title: "Grammar pattern practice",
      detail: "10 contextual questions from your current HSK level",
      completed: history.some((record) =>
        record.type === "grammar" &&
        localDateKey(Date.parse(record.completedAt)) === todayKey &&
        isDashboardPlanRecordComplete(record),
      ),
    };
    return [
      buildFocusedDrillActivity(history, "writing", now),
      knowledgeActivity,
      reviewActivity,
    ];
  }
  return [reviewActivity, pronunciationActivity, languageActivity];
}

function buildFocusedDrillActivity(history, mode, now = Date.now()) {
  const targetMode = MODES[mode] ? mode : "reading";
  const label = MODES[targetMode].label;
  const todayKey = localDateKey(now);
  return {
    id: `${targetMode}-drill`,
    tool: "drill",
    mode: targetMode,
    title: `${label} sentence drill`,
    detail: targetMode === "listening"
      ? "30 spoken sentences for audio comprehension"
      : "30 English prompts for written Chinese production",
    completed: history.some((record) =>
      record.type === "drill" &&
      record.mode === targetMode &&
      localDateKey(Date.parse(record.completedAt)) === todayKey &&
      isDashboardPlanRecordComplete(record),
    ),
  };
}

function getRecommendedLanguageActivity(history, drillMode = getRecommendedDrillMode(history), drillLabel = MODES[drillMode]?.label || "Reading", now = Date.now()) {
  const todayKey = localDateKey(now);
  const completedGrammarToday = history.some((record) => record.type === "grammar" && localDateKey(Date.parse(record.completedAt)) === todayKey && isDashboardPlanRecordComplete(record));
  const completedDrillToday = history.some((record) => record.type === "drill" && localDateKey(Date.parse(record.completedAt)) === todayKey && isDashboardPlanRecordComplete(record));
  const priorHistory = history.filter((record) => localDateKey(Date.parse(record.completedAt)) !== todayKey);
  const lastGrammar = priorHistory.find((record) => record.type === "grammar");
  const lastDrill = priorHistory.find((record) => record.type === "drill");
  const grammarIsDue = completedGrammarToday || (!completedDrillToday && (!lastGrammar || (lastDrill && Date.parse(lastGrammar.completedAt || "") < Date.parse(lastDrill.completedAt || ""))));
  if (grammarIsDue) {
    return {
      id: "grammar",
      tool: "grammar",
      title: "Grammar pattern practice",
      detail: "10 contextual questions from your current HSK level",
      completed: completedGrammarToday,
    };
  }
  return {
    id: "drill",
    tool: "drill",
    mode: drillMode,
    title: `${drillLabel} sentence drill`,
    detail: "30 sentences at your selected difficulty",
    completed: completedDrillToday,
  };
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
  if (record?.type === "grammar") {
    return total >= GRAMMAR_SESSION_LENGTH || record.scope === "lesson";
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
    title: `Build your HSK ${state.studyTargetLevel} learning baseline`,
    detail: "Start with target-level vocabulary review so future practice can respond to your results.",
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
  if (tool === "pronunciation") {
    state.pronunciationView = PRONUNCIATION_VIEWS.has(mode) ? mode : "speaking";
  }
  saveSettings();

  if (tool === "review") {
    startReviewSession();
  } else if (tool === "grammar") {
    startGrammarSession();
  } else if (tool === "pronunciation") {
    startActivePronunciationSession();
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
  const flowLabels = {
    reading: "Chinese to English",
    writing: "English to Chinese",
    listening: "Audio to English",
  };
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

      <div class="practice-readiness">
        <span class="practice-readiness-mark" aria-hidden="true">${preview.character}</span>
        <span class="practice-readiness-copy">
          <small>${escapeHtml(mode.label)} session</small>
          <strong>${escapeHtml(flowLabels[state.mode] || preview.description)}</strong>
          <span>30 sentences with immediate feedback and saved mistakes.</span>
        </span>
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
  if (state.pronunciationView === "tone") {
    renderToneListeningHome();
    return;
  }

  const shortSentenceCount = getSelectedPronunciationSentenceCount();
  const hasEnoughSentences = shortSentenceCount >= PRONUNCIATION_SESSION_LENGTH;
  const recognitionAvailable = supportsSpeechRecognition();
  const startLabel = state.isLoadingSentences ? "Loading sentence bank..." : "Start pronunciation session";

  app.innerHTML = `
    <section class="workspace-panel">
      ${buildPronunciationViewSwitcher()}
      <div class="mode-heading">
        <div>
          <h2>Pronunciation Practice</h2>
          <p>Read short Chinese sentences aloud and compare what the browser recognizes.</p>
        </div>
      </div>

      <div class="practice-readiness ${recognitionAvailable ? "" : "is-unavailable"}">
        <span class="practice-readiness-mark" aria-hidden="true">说</span>
        <span class="practice-readiness-copy">
          <small>${recognitionAvailable ? "Ready to speak" : "Browser check"}</small>
          <strong>${recognitionAvailable ? "Microphone practice is ready" : "Speech recognition is unavailable"}</strong>
          <span>${state.pronunciationShowPinyin ? "Pinyin hints on" : "Characters only"} &middot; ${escapeHtml(selectedLevelLabels())}</span>
        </span>
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

  bindPronunciationViewSwitcher();
  document.querySelector("#startPronunciationSession").addEventListener("click", startPronunciationSession);
}

function renderToneListeningHome() {
  const toneWordCount = getToneListeningPool().length;
  const playbackAvailable = supportsSpeechSynthesis();

  app.innerHTML = `
    <section class="workspace-panel tone-listening-home">
      ${buildPronunciationViewSwitcher()}
      <div class="mode-heading">
        <div>
          <h2>Tone Listening</h2>
          <p>Hear an HSK word and identify its tone pattern.</p>
        </div>
      </div>

      <div class="practice-readiness ${playbackAvailable ? "" : "is-unavailable"}">
        <span class="practice-readiness-mark" aria-hidden="true">调</span>
        <span class="practice-readiness-copy">
          <small>${playbackAvailable ? "Ready to listen" : "Browser check"}</small>
          <strong>${playbackAvailable ? "15-word tone session ready" : "Speech playback is unavailable"}</strong>
          <span>HSK 1 and 2 &middot; 5 choices per word &middot; ${toneWordCount.toLocaleString()} words in rotation</span>
        </span>
      </div>

      ${playbackAvailable ? "" : `
        <p class="empty-note error-note">
          Speech playback is not available in this browser.
        </p>
      `}

      <div class="pronunciation-start-row">
        <button class="primary-btn shortcut-btn" type="button" id="startToneListeningSession" ${toneWordCount >= TONE_LISTENING_SESSION_LENGTH && playbackAvailable ? "" : "disabled"}>
          <span>Start tone listening session</span>
          ${shortcutHint("Enter")}
        </button>
      </div>
    </section>
  `;

  bindPronunciationViewSwitcher();
  document.querySelector("#startToneListeningSession").addEventListener("click", startToneListeningSession);
}

function buildPronunciationViewSwitcher() {
  return `
    <nav class="pronunciation-view-switcher" aria-label="Pronunciation practice type">
      <button class="${state.pronunciationView === "speaking" ? "active" : ""}" type="button" data-pronunciation-view="speaking">Speaking</button>
      <button class="${state.pronunciationView === "tone" ? "active" : ""}" type="button" data-pronunciation-view="tone">Tone Listening</button>
    </nav>
  `;
}

function bindPronunciationViewSwitcher() {
  document.querySelectorAll(".pronunciation-view-switcher button[data-pronunciation-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextView = button.dataset.pronunciationView;
      if (!PRONUNCIATION_VIEWS.has(nextView) || nextView === state.pronunciationView) {
        return;
      }
      stopPronunciationRecognition();
      stopSpeech();
      state.pronunciationView = nextView;
      state.dataError = "";
      saveSettings();
      render();
    });
  });
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
      render();
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
          ${buildVocabularyCurriculumSourceMarkup()}
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
        <details class="vocab-table-section vocabulary-preview-disclosure">
          <summary>
            <span>
              <strong>Preview word list</strong>
              <small>${escapeHtml(selectedSet.label)} &middot; ${wordCount} words</small>
            </span>
            <b>Show</b>
          </summary>
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
        </details>
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

function buildVocabularyCurriculumSourceMarkup() {
  if (!VOCABULARY_CURRICULUM?.sourceUrl) {
    return "";
  }
  return `
    <p class="vocabulary-curriculum-source">
      Official 2025 HSK syllabus · issued ${escapeHtml(VOCABULARY_CURRICULUM.version || "2025-11")} · effective ${escapeHtml(VOCABULARY_CURRICULUM.effective || "2026-07")}
      <a href="${escapeHtml(VOCABULARY_CURRICULUM.sourceUrl)}" target="_blank" rel="noopener noreferrer">View source</a>
    </p>
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
          <p>Move through the complete HSK 1–3 vocabulary curriculum, one focused part at a time.</p>
          ${buildVocabularyCurriculumSourceMarkup()}
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
          <p>Search the complete HSK 1–3 collection, hear each word, and save vocabulary for adaptive review.</p>
          ${buildVocabularyCurriculumSourceMarkup()}
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
            <option value="3" ${state.vocabularyLibraryLevel === "3" ? "selected" : ""}>HSK 3</option>
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

      ${dashboard.totalTracked ? `
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
      ` : `
        <div class="review-baseline-summary" aria-label="First review setup">
          <span aria-hidden="true">1</span>
          <div>
            <small>First review</small>
            <strong>Build a 12-word HSK 1 baseline</strong>
            <p>Your answers seed the adaptive queue used by Today and future reviews.</p>
          </div>
        </div>
      `}

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
  const isMistakeReview = result.source === "mistakes";
  const pathSetName = formatVocabularyPathSetName(result.setId, result.setLabel);
  const resultTitle = isSavedReview
    ? "Saved Words Review Complete"
    : isPathReview
      ? `${pathSetName} Review Complete`
      : isMistakeReview
        ? "Mistake Review Complete"
      : "Daily Review Complete";
  const restartLabel = isSavedReview
    ? "Review saved again"
    : isPathReview
      ? `Review ${getVocabularySetMeta({ id: result.setId, label: result.setLabel }).partLabel} again`
      : isMistakeReview
        ? "Review these words again"
      : "Start another review";
  const backLabel = isSavedReview
    ? "Back to word library"
    : isPathReview
      ? "Back to HSK path"
      : "Back to daily review";
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
    } else if (isMistakeReview) {
      startReviewItems(result.items, "mistakes", {
        setId: result.setId,
        setLabel: result.setLabel,
      });
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
    } else if (isMistakeReview) {
      state.tool = "review";
      saveSettings();
    }
    render();
  });
}

function getGrammarLessonById(lessonId) {
  return GRAMMAR_LESSONS.find((lesson) => lesson.id === lessonId) || null;
}

function getGrammarLessonProgress(history, lessonId) {
  const answers = history
    .filter((record) => record.type === "grammar")
    .flatMap((record) => record.answers || [])
    .filter((answer) => answer.lessonId === lessonId);
  const correct = answers.filter((answer) => answer.correct).length;
  const accuracy = answers.length ? correct / answers.length : null;
  const status = !answers.length
    ? "Not started"
    : answers.length >= 3 && accuracy >= 0.8
      ? "Strong"
      : "Learning";
  return { attempts: answers.length, correct, accuracy, status };
}

function getGrammarProgressData(history = loadHistoryRecords()) {
  const lessons = GRAMMAR_LESSONS.map((lesson) => ({
    ...lesson,
    progress: getGrammarLessonProgress(history, lesson.id),
  }));
  const answers = history
    .filter((record) => record.type === "grammar")
    .flatMap((record) => record.answers || []);
  return {
    lessons,
    started: lessons.filter((lesson) => lesson.progress.attempts).length,
    strong: lessons.filter((lesson) => lesson.progress.status === "Strong").length,
    accuracy: answers.length ? answers.filter((answer) => answer.correct).length / answers.length : null,
    answers: answers.length,
  };
}

function renderGrammarHome() {
  if (state.grammarLessonId) {
    renderGrammarLesson(getGrammarLessonById(state.grammarLessonId));
    return;
  }

  const progress = getGrammarProgressData();
  const lessons = progress.lessons.filter((lesson) => lesson.level === state.grammarLevel);
  const levelStrong = lessons.filter((lesson) => lesson.progress.status === "Strong").length;
  const levelStarted = lessons.filter((lesson) => lesson.progress.attempts).length;
  const accuracyLabel = progress.accuracy === null ? "Not started" : `${Math.round(progress.accuracy * 100)}%`;
  const recommendedLesson = lessons.find((lesson) => lesson.progress.status === "Learning") ||
    lessons.find((lesson) => lesson.progress.status === "Not started") ||
    lessons[0];
  const recommendationLabel = recommendedLesson?.progress.status === "Learning"
    ? "Continue learning"
    : levelStrong === lessons.length
      ? "Maintain mastery"
      : "Recommended first pattern";

  app.innerHTML = `
    <section class="workspace-panel grammar-home">
      <header class="grammar-home-header">
        <div>
          <h2>Grammar Lab</h2>
          <p>Learn the patterns that turn vocabulary into natural sentences, then check your understanding in context.</p>
        </div>
        <button class="primary-btn shortcut-btn grammar-mixed-start" type="button" id="startGrammarPractice">
          <span>Start mixed practice</span>
          ${shortcutHint("Enter")}
        </button>
      </header>

      <div class="grammar-level-switcher" role="group" aria-label="Grammar level">
        ${[1, 2, 3].map((level) => `
          <button class="grammar-level-button ${state.grammarLevel === level ? "active" : ""}" type="button" data-grammar-level="${level}" aria-pressed="${state.grammarLevel === level}">
            <strong>HSK ${level}</strong>
            <span>${GRAMMAR_LESSONS.filter((lesson) => lesson.level === level).length} core patterns</span>
          </button>
        `).join("")}
      </div>

      ${recommendedLesson ? `
        <button class="grammar-recommendation" type="button" data-grammar-lesson="${escapeHtml(recommendedLesson.id)}">
          <span class="grammar-recommendation-icon" aria-hidden="true">${dashboardFlagIconMarkup()}</span>
          <span>
            <small>${escapeHtml(recommendationLabel)}</small>
            <strong>${escapeHtml(recommendedLesson.title)}</strong>
            <span class="chinese-text" lang="zh-CN">${escapeHtml(recommendedLesson.pattern)}</span>
          </span>
          <b>${recommendedLesson.progress.status === "Learning" ? "Continue" : "Open lesson"} ${dashboardArrowIconMarkup()}</b>
        </button>
      ` : ""}

      ${levelStarted ? `
        <div class="grammar-metric-strip" aria-label="Grammar progress">
          <div><strong>${levelStarted}/${lessons.length}</strong><span>Patterns practiced</span></div>
          <div><strong>${levelStrong}</strong><span>Strong patterns</span></div>
          <div><strong>${accuracyLabel}</strong><span>Overall accuracy</span></div>
        </div>
      ` : ""}

      <div class="grammar-list-heading">
        <div>
          <h3>HSK ${state.grammarLevel} core patterns</h3>
          <p>Select a lesson for a concise explanation, examples, and focused practice.</p>
        </div>
        <span>${lessons.length} lessons</span>
      </div>

      <div class="grammar-lesson-list">
        ${lessons.map((lesson, index) => buildGrammarLessonRow(lesson, index)).join("")}
      </div>

      <p class="grammar-source-note">
        Core curriculum selected from the grammar dimension of the
        <a href="https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf" target="_blank" rel="noopener noreferrer">official New HSK syllabus (2025 revision)</a>.
      </p>
    </section>
  `;

  document.querySelectorAll("[data-grammar-level]").forEach((button) => {
    button.addEventListener("click", () => {
      state.grammarLevel = Number(button.dataset.grammarLevel) || 1;
      saveSettings();
      render();
    });
  });
  document.querySelectorAll("[data-grammar-lesson]").forEach((button) => {
    button.addEventListener("click", () => {
      state.grammarLessonId = button.dataset.grammarLesson;
      saveSettings();
      render();
      window.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
    });
  });
  document.querySelector("#startGrammarPractice")?.addEventListener("click", () => startGrammarSession());
}

function buildGrammarLessonRow(lesson, index) {
  const progress = lesson.progress || { attempts: 0, accuracy: null, status: "Not started" };
  const accuracy = progress.accuracy === null ? "New" : `${Math.round(progress.accuracy * 100)}%`;
  const statusClass = progress.status.toLowerCase().replace(/\s+/g, "-");
  return `
    <button class="grammar-lesson-row" type="button" data-grammar-lesson="${escapeHtml(lesson.id)}">
      <span class="grammar-lesson-index">${index + 1}</span>
      <span class="grammar-lesson-main">
        <span class="grammar-lesson-meta">${escapeHtml(lesson.category)}</span>
        <strong>${escapeHtml(lesson.title)}</strong>
        <span>${escapeHtml(lesson.summary)}</span>
      </span>
      <span class="grammar-lesson-pattern chinese-text" lang="zh-CN">${escapeHtml(lesson.pattern)}</span>
      <span class="grammar-lesson-progress ${statusClass}">
        <strong>${escapeHtml(accuracy)}</strong>
        <span>${escapeHtml(progress.status)}</span>
      </span>
      <span class="grammar-lesson-arrow" aria-hidden="true">→</span>
    </button>
  `;
}

function renderGrammarLesson(lesson) {
  if (!lesson) {
    state.grammarLessonId = "";
    saveSettings();
    render();
    return;
  }
  const progress = getGrammarLessonProgress(loadHistoryRecords(), lesson.id);
  const progressLabel = progress.accuracy === null
    ? "Not practiced yet"
    : `${Math.round(progress.accuracy * 100)}% across ${progress.attempts} ${progress.attempts === 1 ? "answer" : "answers"}`;

  app.innerHTML = `
    <section class="workspace-panel grammar-lesson-view">
      <button class="grammar-back-button" type="button" id="backToGrammar">
        <span aria-hidden="true">←</span> All HSK ${lesson.level} patterns
      </button>

      <header class="grammar-lesson-hero">
        <div class="grammar-lesson-copy">
          <span>HSK ${lesson.level} · ${escapeHtml(lesson.category)}</span>
          <h2>${escapeHtml(lesson.title)}</h2>
          <p>${escapeHtml(lesson.summary)}</p>
        </div>
        <div class="grammar-pattern-display">
          <span>Pattern</span>
          <strong class="chinese-text" lang="zh-CN">${escapeHtml(lesson.pattern)}</strong>
          <small>${escapeHtml(progressLabel)}</small>
        </div>
      </header>

      <div class="grammar-lesson-body">
        <section class="grammar-explanation" aria-labelledby="grammarStructureHeading">
          <div>
            <span>Structure</span>
            <h3 id="grammarStructureHeading">${escapeHtml(lesson.structure)}</h3>
          </div>
          <p>${escapeHtml(lesson.note)}</p>
        </section>

        <section class="grammar-example-section" aria-labelledby="grammarExamplesHeading">
          <div class="grammar-list-heading">
            <div>
              <h3 id="grammarExamplesHeading">Examples in context</h3>
              <p>Listen, read the pattern, and compare the English meaning.</p>
            </div>
          </div>
          <div class="grammar-example-list">
            ${lesson.examples.map((example, index) => `
              <article class="grammar-example-row">
                <span class="grammar-example-index">${index + 1}</span>
                <div>
                  <strong class="chinese-text" lang="zh-CN">${escapeHtml(example.zh)}</strong>
                  <span>${buildToneColoredPinyinMarkup(example.pinyin)}</span>
                </div>
                <p>${escapeHtml(example.en)}</p>
                <button class="icon-btn" type="button" data-grammar-audio="${escapeHtml(example.zh)}" aria-label="Play ${escapeHtml(example.zh)}" title="Play sentence">
                  ${speakerIconMarkup()}
                </button>
              </article>
            `).join("")}
          </div>
        </section>
      </div>

      <footer class="grammar-lesson-footer">
        <div>
          <strong>Check this pattern</strong>
          <span>${lesson.questions.length} focused questions with immediate explanations.</span>
        </div>
        <button class="primary-btn shortcut-btn" type="button" id="practiceGrammarLesson">
          <span>Practice this pattern</span>
          ${shortcutHint("Enter")}
        </button>
      </footer>
    </section>
  `;

  document.querySelector("#backToGrammar")?.addEventListener("click", () => {
    state.grammarLessonId = "";
    saveSettings();
    render();
  });
  document.querySelector("#practiceGrammarLesson")?.addEventListener("click", () => startGrammarSession(lesson.id));
  document.querySelectorAll("[data-grammar-audio]").forEach((button) => {
    button.addEventListener("click", () => speak(button.dataset.grammarAudio, { immediate: true }));
  });
}

function getGrammarQuestionPool(lessonId = "", level = state.grammarLevel) {
  const lessons = lessonId
    ? GRAMMAR_LESSONS.filter((lesson) => lesson.id === lessonId)
    : GRAMMAR_LESSONS.filter((lesson) => lesson.level === level);
  return lessons.flatMap((lesson) => lesson.questions.map((question, questionIndex) => ({
    ...question,
    id: `${lesson.id}-${questionIndex + 1}`,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    lessonPattern: lesson.pattern,
    level: lesson.level,
  })));
}

function buildGrammarSessionItems(lessonId = "", level = state.grammarLevel) {
  const pool = getGrammarQuestionPool(lessonId, level);
  const count = lessonId ? pool.length : Math.min(GRAMMAR_SESSION_LENGTH, pool.length);
  const selected = lessonId
    ? shuffle(pool)
    : shuffle([
        ...shuffle(GRAMMAR_LESSONS.filter((lesson) => lesson.level === level))
          .map((lesson) => shuffle(pool.filter((question) => question.lessonId === lesson.id))[0])
          .filter(Boolean),
        ...shuffle(pool),
      ].filter((question, index, items) => items.findIndex((candidate) => candidate.id === question.id) === index)).slice(0, count);

  return selected.map((question) => ({
    ...question,
    choices: shuffle(question.options).map((text, choiceIndex) => ({
      id: `${question.id}-choice-${choiceIndex}`,
      text,
      correct: text === question.answer,
      shortcut: String(choiceIndex + 1),
    })),
  }));
}

function startGrammarSession(lessonId = "") {
  const lesson = lessonId ? getGrammarLessonById(lessonId) : null;
  const level = lesson?.level || state.grammarLevel;
  const items = buildGrammarSessionItems(lessonId, level);
  startGrammarItems(items, {
    scope: lessonId ? "lesson" : "mixed",
    lessonId,
    level,
  });
}

function startGrammarItems(items, options = {}) {
  if (!items.length) {
    return;
  }
  const level = options.level || items[0]?.level || state.grammarLevel;
  stopSpeech();
  state.tool = "grammar";
  state.grammarLevel = level;
  state.grammarLessonId = options.lessonId || "";
  state.result = null;
  state.session = {
    type: "grammar",
    scope: options.scope || "mixed",
    lessonId: options.lessonId || "",
    level,
    items,
    index: 0,
    answers: [],
    currentAssessment: null,
    startedAt: Date.now(),
  };
  saveSettings();
  render();
  window.setTimeout(() => window.scrollTo?.({ top: 0, left: 0, behavior: "auto" }), 0);
}

function buildGrammarPromptMarkup(prompt) {
  return escapeHtml(prompt).replaceAll("___", '<span class="grammar-blank" aria-label="blank">?</span>');
}

function renderGrammarSession() {
  const session = state.session;
  const item = session.items[session.index];
  const assessment = session.currentAssessment;
  const correct = session.answers.filter((answer) => answer.correct).length;
  const progress = Math.round(((session.index + (assessment ? 1 : 0)) / session.items.length) * 100);

  app.innerHTML = `
    <section class="workspace-panel grammar-session">
      <header class="grammar-session-header">
        <div>
          <span>${session.scope === "lesson" ? "Focused pattern practice" : `HSK ${session.level} mixed practice`}</span>
          <strong>${escapeHtml(item.lessonTitle)}</strong>
        </div>
        <div class="grammar-session-score"><span>Score</span><strong>${correct}/${session.answers.length}</strong></div>
        <button class="ghost-btn" type="button" id="endSession">End practice</button>
      </header>
      <div class="grammar-session-progress">
        <div class="progress-track"><div style="width:${progress}%"></div></div>
        <span>Question ${session.index + 1} of ${session.items.length}</span>
      </div>

      <div class="grammar-practice-layout">
        <aside class="grammar-context-panel">
          <span>Pattern in focus</span>
          <strong class="chinese-text" lang="zh-CN">${escapeHtml(item.lessonPattern)}</strong>
          <p>${escapeHtml(getGrammarLessonById(item.lessonId)?.summary || "")}</p>
        </aside>

        <section class="grammar-question-panel ${assessment ? "is-answered" : ""}">
          <div class="grammar-question-copy">
            <span>Choose the best answer</span>
            <h2 class="chinese-text" lang="zh-CN">${buildGrammarPromptMarkup(item.prompt)}</h2>
            <p>${escapeHtml(item.translation)}</p>
          </div>

          <div class="grammar-choice-grid">
            ${item.choices.map((choice) => buildGrammarChoiceMarkup(choice, assessment)).join("")}
          </div>

          ${assessment ? buildGrammarFeedbackMarkup(item, assessment) : ""}
          ${assessment ? `
            <button class="primary-btn shortcut-btn grammar-next-button" type="button" id="nextQuestion">
              <span>${session.index + 1 >= session.items.length ? "View results" : "Next question"}</span>
              ${shortcutHint("Enter")}
            </button>
          ` : ""}
        </section>
      </div>
    </section>
  `;

  document.querySelectorAll("[data-grammar-choice-id]").forEach((button) => {
    button.addEventListener("click", () => submitGrammarChoice(button.dataset.grammarChoiceId));
  });
  document.querySelector("#nextQuestion")?.addEventListener("click", nextQuestion);
  document.querySelector("#endSession")?.addEventListener("click", finishSessionEarly);
}

function buildGrammarChoiceMarkup(choice, assessment) {
  const selected = assessment?.choiceId === choice.id;
  const classes = [
    "choice-option",
    "grammar-choice-option",
    selected ? "selected" : "",
    assessment && choice.correct ? "correct" : "",
    assessment && selected && !choice.correct ? "incorrect" : "",
    assessment && selected && choice.correct ? "correct-celebration" : "",
  ].filter(Boolean).join(" ");
  return `
    <button class="${classes}" type="button" data-grammar-choice-id="${escapeHtml(choice.id)}" ${assessment ? "disabled" : ""}>
      <span class="choice-key">${escapeHtml(choice.shortcut)}</span>
      <span class="choice-text chinese-text" lang="zh-CN">${escapeHtml(choice.text)}</span>
    </button>
  `;
}

function buildGrammarFeedbackMarkup(item, assessment) {
  return `
    <section class="grammar-feedback ${assessment.correct ? "is-correct correct-celebration" : "is-wrong"}" role="status" aria-live="polite">
      <div>
        <strong>${assessment.correct ? "Correct" : "Review the pattern"}</strong>
        <span>Answer: <b class="chinese-text" lang="zh-CN">${escapeHtml(item.answer)}</b></span>
      </div>
      <p>${escapeHtml(item.explanation)}</p>
    </section>
  `;
}

function submitGrammarChoiceByShortcut(shortcut) {
  const session = state.session;
  if (session?.type !== "grammar" || session.currentAssessment) {
    return;
  }
  const choice = session.items[session.index]?.choices.find((option) => option.shortcut === shortcut);
  if (choice) {
    submitGrammarChoice(choice.id);
  }
}

function submitGrammarChoice(choiceId) {
  const session = state.session;
  const item = session?.items?.[session.index];
  if (session?.type !== "grammar" || !item || session.currentAssessment) {
    return;
  }
  const choice = item.choices.find((option) => option.id === choiceId);
  if (!choice) {
    return;
  }
  const assessment = {
    choiceId: choice.id,
    answer: choice.text,
    expected: item.answer,
    correct: choice.correct,
    score: choice.correct ? 1 : 0,
  };
  session.currentAssessment = assessment;
  session.answers.push({ ...assessment, item, itemIndex: session.index });
  render();
}

function getGrammarResultFocus(result) {
  const stats = new Map();
  result.answers.forEach((answer) => {
    const current = stats.get(answer.item.lessonId) || {
      lesson: getGrammarLessonById(answer.item.lessonId),
      attempts: 0,
      correct: 0,
    };
    current.attempts += 1;
    current.correct += answer.correct ? 1 : 0;
    stats.set(answer.item.lessonId, current);
  });
  return [...stats.values()]
    .map((item) => ({ ...item, accuracy: item.attempts ? item.correct / item.attempts : 0 }))
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);
}

function renderGrammarResults() {
  const result = state.result;
  const correct = result.answers.filter((answer) => answer.correct).length;
  const accuracy = result.answers.length ? Math.round((correct / result.answers.length) * 100) : 0;
  const focus = getGrammarResultFocus(result);
  const needsReview = focus.filter((item) => item.accuracy < 1).slice(0, 3);
  const rows = result.answers.map((answer, index) => `
    <tr class="${answer.correct ? "found" : "missed"}">
      <td>${index + 1}</td>
      <td>${escapeHtml(answer.item.lessonTitle)}</td>
      <td class="chinese-text">${buildGrammarPromptMarkup(answer.item.prompt)}</td>
      <td class="chinese-text">${escapeHtml(answer.answer)}</td>
      <td class="chinese-text">${escapeHtml(answer.item.answer)}</td>
      <td class="${answer.correct ? "status-good" : "status-review"}">${answer.correct ? "Correct" : "Review"}</td>
    </tr>
  `).join("");

  app.innerHTML = `
    <section class="workspace-panel grammar-results">
      <header class="results-header">
        <div>
          <h2>${result.scope === "lesson" ? "Pattern Check Complete" : result.scope === "mistakes" ? "Grammar Mistakes Reviewed" : "Grammar Practice Complete"}</h2>
          <p>${correct} of ${result.answers.length} correct across ${focus.length} ${focus.length === 1 ? "pattern" : "patterns"}.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>Practice again</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">Back to Grammar Lab</button>
        </div>
      </header>

      <div class="stat-grid grammar-result-stats">
        <div class="stat"><strong>${accuracy}%</strong><span>Accuracy</span></div>
        <div class="stat"><strong>${correct}/${result.answers.length}</strong><span>Correct</span></div>
        <div class="stat"><strong>${formatTimer(result.elapsedSeconds)}</strong><span>Practice time</span></div>
      </div>

      <section class="grammar-result-focus" aria-labelledby="grammarFocusHeading">
        <div class="grammar-list-heading">
          <div>
            <h3 id="grammarFocusHeading">${needsReview.length ? "Patterns to revisit" : "Patterns strengthened"}</h3>
            <p>${needsReview.length ? "Open a lesson to review the explanation and examples." : "Every pattern in this session was answered correctly."}</p>
          </div>
        </div>
        <div class="grammar-result-focus-list">
          ${(needsReview.length ? needsReview : focus.slice(0, 3)).map((item) => `
            <button type="button" data-result-grammar-lesson="${escapeHtml(item.lesson?.id || "")}">
              <span>${escapeHtml(item.lesson?.category || "Pattern")}</span>
              <strong>${escapeHtml(item.lesson?.title || "Grammar pattern")}</strong>
              <small>${item.correct}/${item.attempts} correct · ${escapeHtml(item.lesson?.pattern || "")}</small>
            </button>
          `).join("")}
        </div>
      </section>

      <div class="results-table-wrap" tabindex="0">
        <table class="grammar-results-table">
          <thead><tr><th>#</th><th>Pattern</th><th>Question</th><th>Your answer</th><th>Expected</th><th>Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  document.querySelector("#restartSession")?.addEventListener("click", () => {
    if (result.scope === "mistakes") {
      startGrammarItems(result.items, { scope: "mistakes", level: result.level });
    } else {
      startGrammarSession(result.lessonId || "");
    }
  });
  document.querySelector("#backToModes")?.addEventListener("click", () => {
    state.result = null;
    state.session = null;
    state.grammarLessonId = "";
    saveSettings();
    render();
  });
  document.querySelectorAll("[data-result-grammar-lesson]").forEach((button) => {
    button.addEventListener("click", () => {
      state.result = null;
      state.session = null;
      state.grammarLessonId = button.dataset.resultGrammarLesson;
      saveSettings();
      render();
    });
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

function getReaderById(readerId) {
  return GRADED_READERS.find((reader) => reader.id === readerId) || null;
}

function isPremiumReader(reader) {
  return Number(reader?.level) > 1;
}

function canAccessReader(reader, { prompt = true } = {}) {
  if (reader && (!isPremiumReader(reader) || hasPremiumAccess())) {
    return true;
  }
  if (prompt) {
    requirePremiumAccess("HSK 2 and HSK 3 graded readers are included with Premium.");
  }
  return false;
}

function getReaderCompletion(readerId, history = loadHistoryRecords()) {
  const attempts = history.filter((record) => record.type === "reader" && record.readerId === readerId);
  const best = attempts.reduce((highest, record) => Math.max(highest, Number(record.correct) || 0), 0);
  return { attempts: attempts.length, best };
}

function renderReaderHome() {
  const selectedReader = getReaderById(state.readerId);
  if (selectedReader && canAccessReader(selectedReader, { prompt: false })) {
    renderReaderDetail(selectedReader);
    return;
  }
  if (selectedReader) {
    state.readerId = "";
  }

  const history = loadHistoryRecords();
  const premium = hasPremiumAccess();
  const levelReaders = GRADED_READERS.filter((reader) => reader.level === state.readerLevel);
  const levelLocked = state.readerLevel > 1 && !premium;
  const levelCompletions = new Map(levelReaders.map((reader) => [reader.id, getReaderCompletion(reader.id, history)]));
  const completedReaders = levelReaders.filter((reader) => levelCompletions.get(reader.id)?.attempts).length;
  const nextReader = levelReaders.find((reader) => !levelCompletions.get(reader.id)?.attempts) || levelReaders[0];
  const readerProgressPercent = levelReaders.length ? Math.round((completedReaders / levelReaders.length) * 100) : 0;
  const tabs = [1, 2, 3].map((level) => {
    const locked = level > 1 && !premium;
    return `<button type="button" data-reader-level="${level}" class="${state.readerLevel === level ? "active" : ""}" aria-pressed="${state.readerLevel === level}">
      HSK ${level}${locked ? '<span class="reader-tab-lock" aria-label="Premium">Premium</span>' : ""}
    </button>`;
  }).join("");
  const cards = levelReaders.map((reader) => {
    const locked = isPremiumReader(reader) && !premium;
    const completion = levelCompletions.get(reader.id) || { attempts: 0, best: 0 };
    return `
      <article class="reader-card ${locked ? "is-locked" : ""}">
        <div class="reader-card-level" aria-hidden="true">${reader.level}<span>HSK</span></div>
        <div class="reader-card-copy">
          <div class="reader-card-heading">
            <div>
              <h3 lang="zh-CN">${escapeHtml(reader.title)}</h3>
              <p>${escapeHtml(reader.pinyinTitle)}</p>
            </div>
            ${locked ? '<span class="reader-premium-badge">Premium</span>' : completion.attempts ? '<span class="reader-complete-badge">Completed</span>' : ""}
          </div>
          <p class="reader-card-summary">${escapeHtml(reader.summary)}</p>
          <div class="reader-card-meta">
            <span>${reader.sentences.length} sentences</span>
            <span>${reader.minutes} min</span>
            ${completion.attempts ? `<span>Best ${completion.best}/${reader.questions.length}</span>` : ""}
          </div>
        </div>
        <button class="secondary-btn reader-card-action" type="button" data-reader-id="${escapeHtml(reader.id)}">
          ${locked ? "Unlock story" : completion.attempts ? "Read again" : "Read story"}
          <span aria-hidden="true">${locked ? "Locked" : "→"}</span>
        </button>
      </article>
    `;
  }).join("");

  app.innerHTML = `
    <section class="workspace-panel reader-home">
      <header class="reader-home-header">
        <div>
          <span class="reader-kicker">Read at your level</span>
          <h2>Graded Readers</h2>
          <p>Short original stories with focused vocabulary, optional support, and a comprehension check.</p>
        </div>
        <div class="reader-access-summary ${premium ? "is-premium" : ""}">
          <span>${premium ? "Premium active" : "Free reading"}</span>
          <strong>${premium ? "HSK 1–3 unlocked" : "HSK 1 included"}</strong>
        </div>
      </header>
      <div class="reader-level-tabs" role="group" aria-label="Reader level">${tabs}</div>
      ${!levelLocked && nextReader ? `
        <div class="reader-level-progress">
          <div>
            <span>HSK ${state.readerLevel} reading path</span>
            <strong>${completedReaders}/${levelReaders.length} stories checked</strong>
          </div>
          <div class="progress-track" role="progressbar" aria-label="HSK ${state.readerLevel} reader progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${readerProgressPercent}">
            <div style="width:${readerProgressPercent}%"></div>
          </div>
          <button type="button" data-reader-id="${escapeHtml(nextReader.id)}">
            ${completedReaders === levelReaders.length ? "Revisit" : "Next"}: <span lang="zh-CN">${escapeHtml(nextReader.title)}</span> ${dashboardArrowIconMarkup()}
          </button>
        </div>
      ` : ""}
      ${levelLocked ? `
        <div class="reader-level-notice">
          <div><strong>Continue with HSK ${state.readerLevel}</strong><span>Unlock every story at this level with Premium.</span></div>
          <button class="primary-btn" type="button" id="readerLevelUpgrade">See Premium</button>
        </div>
      ` : ""}
      <div class="reader-grid">${cards}</div>
    </section>
  `;

  document.querySelectorAll("[data-reader-level]").forEach((button) => {
    button.addEventListener("click", () => {
      state.readerLevel = Number(button.dataset.readerLevel) || 1;
      saveSettings();
      render();
    });
  });
  document.querySelectorAll("[data-reader-id]").forEach((button) => {
    button.addEventListener("click", () => openReader(button.dataset.readerId));
  });
  document.querySelector("#readerLevelUpgrade")?.addEventListener("click", () => {
    requirePremiumAccess(`Unlock every HSK ${state.readerLevel} graded reader with Premium.`);
  });
}

function openReader(readerId) {
  const reader = getReaderById(readerId);
  if (!reader || !canAccessReader(reader)) {
    return;
  }
  state.readerId = reader.id;
  state.readerLevel = reader.level;
  saveSettings();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderReaderDetail(reader) {
  const storyMarkup = reader.sentences.map((sentence, index) => `
    <div class="reader-sentence">
      <span class="reader-sentence-number">${index + 1}</span>
      <div>
        <p class="reader-sentence-zh" lang="zh-CN">${escapeHtml(sentence.zh)}</p>
        ${state.readerShowPinyin ? `<p class="reader-sentence-pinyin">${buildToneColoredPinyinMarkup(sentence.pinyin)}</p>` : ""}
        ${state.readerShowTranslation ? `<p class="reader-sentence-translation">${escapeHtml(sentence.en)}</p>` : ""}
      </div>
      <button class="icon-btn" type="button" data-reader-audio="${index}" aria-label="Play sentence ${index + 1}" title="Play sentence">${speakerIconMarkup()}</button>
    </div>
  `).join("");
  const vocabularyMarkup = reader.vocabulary.map((word) => `
    <li>
      <div><strong lang="zh-CN">${escapeHtml(word.zh)}</strong><span>${buildToneColoredPinyinMarkup(word.pinyin)}</span></div>
      <p>${escapeHtml(word.en)}</p>
      <button class="icon-btn" type="button" data-reader-word-audio="${escapeHtml(word.zh)}" aria-label="Play ${escapeHtml(word.zh)}" title="Play word">${speakerIconMarkup()}</button>
    </li>
  `).join("");

  app.innerHTML = `
    <section class="workspace-panel reader-detail">
      <div class="reader-detail-toolbar">
        <button class="reader-back" type="button" id="readerBack"><span aria-hidden="true">←</span> Reader shelf</button>
        <div class="reader-detail-actions">
          <button class="ghost-btn" type="button" id="readerPlayStory">${speakerIconMarkup()} Listen</button>
          <button class="reader-toggle ${state.readerShowPinyin ? "active" : ""}" type="button" id="readerTogglePinyin" aria-pressed="${state.readerShowPinyin}">Pinyin</button>
          <button class="reader-toggle ${state.readerShowTranslation ? "active" : ""}" type="button" id="readerToggleTranslation" aria-pressed="${state.readerShowTranslation}">English</button>
        </div>
      </div>
      <header class="reader-story-header">
        <span class="reader-level-label">New HSK ${reader.level} · ${reader.minutes} minute read</span>
        <h2 lang="zh-CN">${escapeHtml(reader.title)}</h2>
        ${state.readerShowPinyin ? `<p class="reader-story-title-pinyin">${buildToneColoredPinyinMarkup(reader.pinyinTitle)}</p>` : ""}
        <p>${escapeHtml(reader.summary)}</p>
      </header>
      <div class="reader-story-layout">
        <article class="reader-story" aria-label="${escapeHtml(reader.title)}">${storyMarkup}</article>
        <aside class="reader-vocabulary">
          <span>Story vocabulary</span>
          <h3>Words to notice</h3>
          <ul>${vocabularyMarkup}</ul>
        </aside>
      </div>
      <footer class="reader-story-footer">
        <div><strong>Finished reading?</strong><span>Check your understanding with three questions.</span></div>
        <button class="primary-btn" type="button" id="startReaderQuiz">Check understanding <span aria-hidden="true">→</span></button>
      </footer>
    </section>
  `;

  document.querySelector("#readerBack")?.addEventListener("click", closeReader);
  document.querySelector("#readerPlayStory")?.addEventListener("click", () => {
    speak(reader.sentences.map((sentence) => sentence.zh).join(""), { immediate: true });
  });
  document.querySelector("#readerTogglePinyin")?.addEventListener("click", () => {
    state.readerShowPinyin = !state.readerShowPinyin;
    saveSettings();
    render();
  });
  document.querySelector("#readerToggleTranslation")?.addEventListener("click", () => {
    state.readerShowTranslation = !state.readerShowTranslation;
    saveSettings();
    render();
  });
  document.querySelectorAll("[data-reader-audio]").forEach((button) => {
    button.addEventListener("click", () => {
      const sentence = reader.sentences[Number(button.dataset.readerAudio)];
      if (sentence) speak(sentence.zh, { immediate: true });
    });
  });
  document.querySelectorAll("[data-reader-word-audio]").forEach((button) => {
    button.addEventListener("click", () => speak(button.dataset.readerWordAudio, { immediate: true }));
  });
  document.querySelector("#startReaderQuiz")?.addEventListener("click", () => startReaderQuiz(reader.id));
}

function closeReader() {
  stopSpeech();
  state.readerId = "";
  state.session = null;
  state.result = null;
  render();
}

function startReaderQuiz(readerId = state.readerId) {
  const reader = getReaderById(readerId);
  if (!reader || !canAccessReader(reader)) {
    return;
  }
  stopSpeech();
  state.tool = "reader";
  state.readerId = reader.id;
  state.result = null;
  state.session = {
    type: "reader",
    readerId: reader.id,
    level: reader.level,
    title: reader.title,
    items: reader.questions,
    index: 0,
    answers: [],
    currentAssessment: null,
    startedAt: Date.now(),
  };
  render();
}

function renderReaderQuiz() {
  const session = state.session;
  const reader = getReaderById(session?.readerId);
  const question = session?.items?.[session.index];
  if (!reader || !question || !canAccessReader(reader, { prompt: false })) {
    state.session = null;
    state.readerId = "";
    render();
    return;
  }
  const assessment = session.currentAssessment;
  const progress = Math.round(((session.index + (assessment ? 1 : 0)) / session.items.length) * 100);
  const choices = question.options.map((option, index) => {
    const selected = assessment?.answerIndex === index;
    const correct = assessment && question.answer === index;
    return `
      <button class="reader-choice ${selected ? "is-selected" : ""} ${correct ? "is-correct" : ""}" type="button" data-reader-choice="${index}" ${assessment ? "disabled" : ""}>
        <span>${index + 1}</span><strong lang="zh-CN">${escapeHtml(option)}</strong>
      </button>
    `;
  }).join("");

  app.innerHTML = `
    <section class="workspace-panel reader-quiz">
      <header class="reader-quiz-header">
        <div><span>New HSK ${reader.level} · ${escapeHtml(reader.title)}</span><strong>Question ${session.index + 1} of ${session.items.length}</strong></div>
        <button class="text-button" type="button" id="exitReaderQuiz">Back to story</button>
      </header>
      <div class="progress-track" aria-hidden="true"><div class="progress-fill" style="width:${progress}%"></div></div>
      <div class="reader-quiz-panel">
        <span class="reader-quiz-kicker">Check your understanding</span>
        <h2 lang="zh-CN">${escapeHtml(question.prompt)}</h2>
        <div class="reader-choice-list" role="radiogroup" aria-label="Answer choices">${choices}</div>
        ${assessment ? `
          <div class="reader-answer-feedback ${assessment.correct ? "is-correct" : "is-wrong"}" role="status">
            <strong>${assessment.correct ? "Correct" : "Not quite"}</strong>
            <p lang="zh-CN">${escapeHtml(question.explanation)}</p>
          </div>
          <button class="primary-btn reader-next" type="button" id="readerNextQuestion">${session.index + 1 >= session.items.length ? "View results" : "Next question"} <span aria-hidden="true">→</span></button>
        ` : '<p class="reader-keyboard-note">Use keys 1–3 or select an answer.</p>'}
      </div>
    </section>
  `;

  document.querySelectorAll("[data-reader-choice]").forEach((button) => {
    button.addEventListener("click", () => submitReaderChoice(Number(button.dataset.readerChoice)));
  });
  document.querySelector("#readerNextQuestion")?.addEventListener("click", nextQuestion);
  document.querySelector("#exitReaderQuiz")?.addEventListener("click", () => {
    if (!session.answers.length || window.confirm("Return to the story and leave this comprehension check?")) {
      state.session = null;
      render();
    }
  });
}

function submitReaderChoice(answerIndex) {
  const session = state.session;
  const question = session?.items?.[session.index];
  if (session?.type !== "reader" || !question || session.currentAssessment || !Number.isInteger(answerIndex)) {
    return;
  }
  const assessment = {
    answerIndex,
    answer: question.options[answerIndex] || "",
    expected: question.options[question.answer] || "",
    correct: answerIndex === question.answer,
    score: answerIndex === question.answer ? 1 : 0,
  };
  session.currentAssessment = assessment;
  session.answers.push({ ...assessment, item: question, itemIndex: session.index });
  render();
}

function renderReaderResults() {
  const result = state.result;
  const reader = getReaderById(result.readerId);
  if (!reader) {
    state.result = null;
    state.readerId = "";
    render();
    return;
  }
  const correct = result.answers.filter((answer) => answer.correct).length;
  const rows = result.answers.map((answer, index) => `
    <article class="reader-result-row ${answer.correct ? "is-correct" : "is-wrong"}">
      <span>${index + 1}</span>
      <div><strong lang="zh-CN">${escapeHtml(answer.item.prompt)}</strong><p>Your answer: ${escapeHtml(answer.answer)} · Correct answer: ${escapeHtml(answer.expected)}</p></div>
      <b>${answer.correct ? "Correct" : "Review"}</b>
    </article>
  `).join("");
  app.innerHTML = `
    <section class="workspace-panel reader-results">
      <header class="reader-results-header">
        <div><span>Reading complete</span><h2 lang="zh-CN">${escapeHtml(reader.title)}</h2><p>${escapeHtml(reader.pinyinTitle)}</p></div>
        <div class="reader-result-score"><strong>${correct}/${result.answers.length}</strong><span>correct</span></div>
      </header>
      <div class="reader-result-list">${rows}</div>
      <div class="reader-results-actions">
        <button class="primary-btn" type="button" id="readerResultAgain">Read story again</button>
        <button class="secondary-btn" type="button" id="readerResultShelf">Back to reader shelf</button>
      </div>
    </section>
  `;
  document.querySelector("#readerResultAgain")?.addEventListener("click", () => {
    state.result = null;
    state.readerId = reader.id;
    render();
  });
  document.querySelector("#readerResultShelf")?.addEventListener("click", () => {
    state.result = null;
    state.readerId = "";
    render();
  });
}

function getHskExam(level = state.examLevel) {
  return HSK_MOCK_EXAMS.levels?.[Number(level)] || null;
}

function flattenHskExamQuestions(exam) {
  return (exam?.sections || []).flatMap((examSection) =>
    (examSection.parts || []).flatMap((examPart) => examPart.questions || []),
  );
}

function getHskExamSectionCounts(exam) {
  return (exam?.sections || []).map((examSection) => ({
    id: examSection.id,
    label: examSection.label,
    minutes: examSection.minutes,
    total: examSection.parts.reduce((sum, examPart) => sum + examPart.questions.length, 0),
  }));
}

function getHskExamAttemptSummary(level, history = loadHistoryRecords()) {
  const records = history.filter((record) =>
    record.type === "exam" &&
    record.examMode === "written" &&
    Number(record.level) === Number(level) &&
    Number(record.maxScore) > 0,
  );
  const bestRecord = records.reduce((best, record) =>
    !best || Number(record.scaledScore) > Number(best.scaledScore) ? record : best,
  null);
  return {
    attempts: records.length,
    latestScore: records.length ? Number(records[0].scaledScore) || 0 : null,
    bestScore: bestRecord ? Number(bestRecord.scaledScore) || 0 : null,
    maxScore: bestRecord
      ? Number(bestRecord.maxScore) || 0
      : (getHskExam(level)?.sections.length || 0) * 100,
    latestAt: records[0]?.completedAt || "",
  };
}

function loadHskExamDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(EXAM_DRAFT_KEY) || "null");
    const exam = getHskExam(draft?.level);
    if (
      !draft ||
      draft.version !== HSK_MOCK_EXAMS.version ||
      !exam ||
      !Number.isFinite(Number(draft.endsAt))
    ) {
      if (draft) {
        localStorage.removeItem(EXAM_DRAFT_KEY);
      }
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

function saveHskExamDraft(session = state.session) {
  if (session?.type !== "exam") {
    return;
  }
  try {
    localStorage.setItem(EXAM_DRAFT_KEY, JSON.stringify({
      version: HSK_MOCK_EXAMS.version,
      level: session.level,
      index: session.index,
      answers: session.answers,
      flaggedIds: [...session.flaggedIds],
      audioPlays: session.audioPlays,
      startedAt: session.startedAt,
      endsAt: session.endsAt,
    }));
  } catch {
    // An exam remains usable when browser storage is unavailable.
  }
}

function clearHskExamDraft() {
  try {
    localStorage.removeItem(EXAM_DRAFT_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
}

function getHskExamDraftProgress(draft) {
  const exam = getHskExam(draft?.level);
  const items = flattenHskExamQuestions(exam);
  const answered = items.filter((item) => isHskExamAnswerPresent(item, draft?.answers?.[item.id])).length;
  return { answered, total: items.length };
}

function isPremiumHskExamLevel(level) {
  return Number(level) > 1;
}

function canAccessHskExamLevel(level, { prompt = true } = {}) {
  if (!isPremiumHskExamLevel(level) || hasPremiumAccess()) {
    return true;
  }
  if (prompt) {
    requirePremiumAccess(`New HSK ${Number(level) || 2} mock exams are included with Premium.`);
  }
  return false;
}

function renderHskExamHome() {
  if (state.examScreen === "ready") {
    renderHskExamReadiness();
    return;
  }

  const draft = loadHskExamDraft();
  const draftProgress = draft ? getHskExamDraftProgress(draft) : null;
  const draftExpired = draft ? Number(draft.endsAt) <= Date.now() : false;
  const history = loadHistoryRecords();
  const levelCards = HSK_EXAM_LEVELS.map((level) => {
    const exam = getHskExam(level);
    const sections = getHskExamSectionCounts(exam);
    const attempt = getHskExamAttemptSummary(level, history);
    const locked = !canAccessHskExamLevel(level, { prompt: false });
    return `
      <article class="hsk-exam-level-card ${level === 3 ? "is-extended" : ""} ${locked ? "is-locked" : ""} ${Number(state.studyTargetLevel) === level ? "is-target" : ""}">
        <div class="hsk-exam-level-mark" aria-hidden="true">${level}</div>
        <div class="hsk-exam-level-copy">
          <span>HSK 3.0 ${locked ? "· Premium" : level === 1 ? "· Free" : ""}</span>
          <h3>New HSK ${level} ${Number(state.studyTargetLevel) === level ? '<small class="hsk-exam-target-badge">Your plan</small>' : ""}</h3>
          <p>${sections.map((item) => item.label).join(" · ")}</p>
        </div>
        <dl class="hsk-exam-level-meta">
          <div><dt>Questions</dt><dd>${exam.totalQuestions}</dd></div>
          <div><dt>Time</dt><dd>${exam.durationMinutes} min</dd></div>
          ${level === 3 ? `<div><dt>Speaking</dt><dd>15 min</dd></div>` : ""}
        </dl>
        <div class="hsk-exam-level-history ${attempt.attempts ? "" : "is-empty"}">
          <span>${attempt.attempts ? "Personal best" : "Progress"}</span>
          <strong>${attempt.attempts ? `${attempt.bestScore}/${attempt.maxScore}` : "No attempt yet"}</strong>
          <small>${attempt.attempts ? `${attempt.attempts} ${attempt.attempts === 1 ? "attempt" : "attempts"} saved` : "Your first result will be tracked here"}</small>
        </div>
        <button class="secondary-btn hsk-exam-level-action" type="button" data-hsk-exam-level="${level}">
          ${locked ? "Unlock Premium" : "View exam details"}
          <span aria-hidden="true">→</span>
        </button>
      </article>
    `;
  }).join("");

  app.innerHTML = `
    <section class="workspace-panel hsk-exam-home">
      <header class="hsk-exam-home-header">
        <div>
          <span class="hsk-exam-kicker">Full-length practice</span>
          <h2>Mock HSK Exam</h2>
          <p>Timed HSK 3.0 papers with official section order and original questions at the target level.</p>
        </div>
        <a class="hsk-exam-source-link" href="${escapeHtml(HSK_MOCK_EXAMS.sourceUrl || "https://www.chinesetest.cn/notice")}" target="_blank" rel="noopener noreferrer">
          Official 2025 syllabus
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      ${draft ? `
        <section class="hsk-exam-resume" aria-label="Saved exam">
          <div class="hsk-exam-resume-icon" aria-hidden="true">${draft.level}</div>
          <div>
            <span>Saved attempt</span>
            <strong>New HSK ${draft.level}</strong>
            <p>${draftProgress.answered} of ${draftProgress.total} answered · ${draftExpired ? "time expired" : `${formatTimer(Math.ceil((draft.endsAt - Date.now()) / 1000))} remaining`}</p>
          </div>
          <button class="primary-btn" type="button" id="resumeHskExam">${draftExpired ? "View timed result" : "Resume exam"}</button>
          <button class="icon-btn" type="button" id="discardHskExam" aria-label="Discard saved exam" title="Discard saved exam">${trashIconMarkup()}</button>
        </section>
      ` : ""}

      <div class="hsk-exam-level-grid">${levelCards}</div>

      <footer class="hsk-exam-notice">
        <strong>HSK 3.0 practice format</strong>
        <p>The official January 2026 HSK 3.0 sitting was a trial. Regular 2026 HSK dates still use HSK 2.0 until an official transition date is announced.</p>
      </footer>
    </section>
  `;

  document.querySelectorAll("[data-hsk-exam-level]").forEach((button) => {
    button.addEventListener("click", () => {
      const level = Number(button.dataset.hskExamLevel) || 1;
      if (!canAccessHskExamLevel(level)) {
        return;
      }
      state.examLevel = level;
      state.examMode = "written";
      state.examScreen = "ready";
      saveSettings();
      render();
    });
  });
  document.querySelector("#resumeHskExam")?.addEventListener("click", resumeHskExam);
  document.querySelector("#discardHskExam")?.addEventListener("click", () => {
    if (window.confirm("Discard this saved mock exam attempt?")) {
      clearHskExamDraft();
      render();
    }
  });
}

function renderHskExamReadiness() {
  if (!canAccessHskExamLevel(state.examLevel, { prompt: false })) {
    state.examScreen = "home";
    render();
    requirePremiumAccess(`New HSK ${state.examLevel} mock exams are included with Premium.`);
    return;
  }
  const exam = getHskExam();
  if (!exam) {
    state.examScreen = "home";
    render();
    return;
  }
  const sections = getHskExamSectionCounts(exam);
  const isSpeaking = state.examLevel === 3 && state.examMode === "speaking";
  const speaking = HSK_MOCK_EXAMS.speaking;

  app.innerHTML = `
    <section class="workspace-panel hsk-exam-ready">
      <button class="hsk-exam-back" type="button" id="backToHskExamLevels">
        <span aria-hidden="true">←</span>
        All levels
      </button>
      <div class="hsk-exam-ready-layout">
        <div class="hsk-exam-ready-main">
          <span class="hsk-exam-kicker">${isSpeaking ? "Speaking simulation" : "Written mock"}</span>
          <h2>${isSpeaking ? speaking.label : exam.label}</h2>
          <p>${isSpeaking
            ? "Prepare, record, and review all three official speaking task types under the 15-minute limit."
            : "Complete every section under one continuous timer. Answers and flags are saved in this browser while the timer keeps running."}</p>

          ${state.examLevel === 3 ? `
            <div class="hsk-exam-mode-switcher" role="tablist" aria-label="HSK 3 exam component">
              <button type="button" role="tab" data-hsk-exam-mode="written" aria-selected="${!isSpeaking}" class="${!isSpeaking ? "active" : ""}">Written · 83 min</button>
              <button type="button" role="tab" data-hsk-exam-mode="speaking" aria-selected="${isSpeaking}" class="${isSpeaking ? "active" : ""}">Speaking · 15 min</button>
            </div>
          ` : ""}

          <div class="hsk-exam-blueprint">
            ${(isSpeaking
              ? speaking.parts.map((examPart) => ({
                  label: examPart.label,
                  total: examPart.items.length,
                  minutes: examPart.responseSeconds < 60 ? `${examPart.responseSeconds} sec each` : `${examPart.responseSeconds / 60} min each`,
                }))
              : sections.map((examSection) => ({
                  label: examSection.label,
                  total: examSection.total,
                  minutes: `${examSection.minutes} min task time`,
                })))
              .map((item, index) => `
                <div class="hsk-exam-blueprint-row">
                  <span>${index + 1}</span>
                  <strong>${escapeHtml(item.label)}</strong>
                  <small>${item.total} ${item.total === 1 ? "item" : "items"}</small>
                  <b>${escapeHtml(String(item.minutes))}</b>
                </div>
              `).join("")}
          </div>
        </div>

        <aside class="hsk-exam-start-panel">
          <div class="hsk-exam-start-time">
            <span>Total time</span>
            <strong>${isSpeaking ? speaking.durationMinutes : exam.durationMinutes}</strong>
            <small>minutes</small>
          </div>
          <ul>
            <li>${isSpeaking ? "Allow microphone access when asked." : "Listening audio can be played once per item."}</li>
            <li>No answer feedback appears before submission.</li>
            <li>${isSpeaking ? "Recordings stay in this tab for review." : "Reloading can resume the same running timer."}</li>
          </ul>
          ${!isSpeaking ? `
            <button class="ghost-btn hsk-exam-audio-test" type="button" id="testHskExamAudio">
              ${speakerIconMarkup()}
              Test Mandarin audio
            </button>
          ` : ""}
          <button class="primary-btn hsk-exam-start" type="button" id="beginHskExam">
            Begin timed ${isSpeaking ? "speaking" : "exam"}
          </button>
          <p>Starting begins the countdown immediately.</p>
        </aside>
      </div>
    </section>
  `;

  document.querySelector("#backToHskExamLevels")?.addEventListener("click", () => {
    state.examScreen = "home";
    render();
  });
  document.querySelectorAll("[data-hsk-exam-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.examMode = button.dataset.hskExamMode;
      saveSettings();
      render();
    });
  });
  document.querySelector("#testHskExamAudio")?.addEventListener("click", () => speak("欢迎参加中文水平考试。", { immediate: true }));
  document.querySelector("#beginHskExam")?.addEventListener("click", () => {
    if (isSpeaking) {
      startHskSpeakingExam();
    } else {
      startHskExam(exam.level);
    }
  });
}

async function startHskExam(level) {
  if (!canAccessHskExamLevel(level)) {
    return;
  }
  const exam = getHskExam(level);
  if (!exam) {
    return;
  }
  stopPronunciationRecognition();
  stopSpeech();
  try {
    await ensureWordData();
  } catch {
    // Pinyin annotations are enhanced by the local word data, but the exam can run without it.
  }
  const startedAt = Date.now();
  state.tool = "exam";
  state.examLevel = exam.level;
  state.examMode = "written";
  state.examScreen = "home";
  state.result = null;
  state.session = {
    type: "exam",
    level: exam.level,
    exam,
    items: flattenHskExamQuestions(exam),
    index: 0,
    answers: {},
    flaggedIds: new Set(),
    audioPlays: {},
    startedAt,
    endsAt: startedAt + exam.durationMinutes * 60 * 1000,
  };
  saveSettings();
  saveHskExamDraft();
  render();
}

function resumeHskExam() {
  const draft = loadHskExamDraft();
  const exam = getHskExam(draft?.level);
  if (!draft || !exam) {
    render();
    return;
  }
  if (!canAccessHskExamLevel(exam.level)) {
    return;
  }
  state.tool = "exam";
  state.examLevel = exam.level;
  state.examMode = "written";
  state.result = null;
  state.session = {
    type: "exam",
    level: exam.level,
    exam,
    items: flattenHskExamQuestions(exam),
    index: clamp(Number(draft.index) || 0, 0, exam.totalQuestions - 1),
    answers: draft.answers && typeof draft.answers === "object" ? draft.answers : {},
    flaggedIds: new Set(Array.isArray(draft.flaggedIds) ? draft.flaggedIds : []),
    audioPlays: draft.audioPlays && typeof draft.audioPlays === "object" ? draft.audioPlays : {},
    startedAt: Number(draft.startedAt) || Date.now(),
    endsAt: Number(draft.endsAt),
  };
  render();
}

function buildHskExamSceneMarkup(sceneId, options = {}) {
  const scene = HSK_MOCK_EXAMS.scenes?.[sceneId];
  if (!scene) {
    return "";
  }
  const positions = [0, 33.333, 66.667, 100];
  const image = `./assets/exam/hsk-scenes-${scene.sheet}.webp`;
  return `
    <span
      class="hsk-exam-scene ${options.large ? "is-large" : ""}"
      role="img"
      aria-label="${escapeHtml(scene.alt)}"
      style="--hsk-scene-image:url('${image}');--hsk-scene-x:${positions[scene.column] || 0}%;--hsk-scene-y:${positions[scene.row] || 0}%">
    </span>
  `;
}

function buildHskExamChineseMarkup(value, level, options = {}) {
  const lines = String(value || "").split("\n");
  return `<div class="hsk-exam-chinese-copy ${options.compact ? "is-compact" : ""}">
    ${lines.map((line) => {
      if (!containsChinese(line)) {
        return `<p>${escapeHtml(line)}</p>`;
      }
      if (Number(level) <= 2) {
        return buildAnnotatedChineseMarkup(line, { showPinyin: true });
      }
      return `<p class="chinese-text" lang="zh-CN">${escapeHtml(line)}</p>`;
    }).join("")}
  </div>`;
}

function buildHskExamQuestionControl(question, answer, level) {
  if (question.type === "choice") {
    return `
      <div class="hsk-exam-choice-grid ${question.choices.some((choice) => choice.scene) ? "has-scenes" : ""}" role="radiogroup" aria-label="Answer choices">
        ${question.choices.map((choice, index) => {
          const selected = answer === choice.id;
          return `
            <button
              class="hsk-exam-choice ${selected ? "is-selected" : ""} ${choice.scene ? "is-scene" : ""}"
              type="button"
              role="radio"
              aria-checked="${selected}"
              data-hsk-exam-choice="${escapeHtml(choice.id)}">
              <span class="hsk-exam-choice-key">${index + 1}</span>
              ${choice.scene
                ? buildHskExamSceneMarkup(choice.scene)
                : buildHskExamChineseMarkup(choice.label, level, { compact: true })}
            </button>
          `;
        }).join("")}
      </div>
    `;
  }

  if (question.type === "reorder") {
    const selectedIndexes = Array.isArray(answer) ? answer : [];
    const available = question.tokens.map((token, index) => ({ token, index })).filter((item) => !selectedIndexes.includes(item.index));
    return `
      <div class="hsk-exam-reorder">
        <div class="hsk-exam-reorder-answer" aria-label="Constructed sentence">
          ${selectedIndexes.length
            ? selectedIndexes.map((tokenIndex, position) => `
                <button type="button" data-hsk-reorder-remove="${position}" class="hsk-exam-word-tile is-selected">${escapeHtml(question.tokens[tokenIndex])}</button>
              `).join("")
            : `<span>Select words below to build the sentence.</span>`}
        </div>
        <div class="hsk-exam-word-bank" aria-label="Available words">
          ${available.map((item) => `
            <button type="button" data-hsk-reorder-add="${item.index}" class="hsk-exam-word-tile">${escapeHtml(item.token)}</button>
          `).join("")}
        </div>
        <button type="button" class="hsk-exam-clear-answer" id="clearHskExamAnswer" ${selectedIndexes.length ? "" : "disabled"}>Clear answer</button>
      </div>
    `;
  }

  const inputValue = typeof answer === "string" ? answer : "";
  const isFree = question.type === "free";
  return `
    <label class="hsk-exam-text-answer">
      <span>${isFree ? "Your sentence" : "Your answer"}</span>
      ${isFree
        ? `<textarea id="hskExamTextAnswer" class="chinese-text" lang="zh-CN" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Write a complete Chinese sentence">${escapeHtml(inputValue)}</textarea>`
        : `<input id="hskExamTextAnswer" class="chinese-text" lang="zh-CN" value="${escapeHtml(inputValue)}" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Type the missing character">`}
    </label>
  `;
}

function buildHskExamNavigator(session) {
  return session.exam.sections.map((examSection) => {
    const sectionItems = session.items.filter((item) => item.skill === examSection.id);
    const answered = sectionItems.filter((item) => isHskExamAnswerPresent(item, session.answers[item.id])).length;
    return `
      <section class="hsk-exam-nav-section">
        <header><strong>${escapeHtml(examSection.label)}</strong><span>${answered}/${sectionItems.length}</span></header>
        <div class="hsk-exam-nav-grid">
          ${sectionItems.map((item) => {
            const itemIndex = session.items.findIndex((candidate) => candidate.id === item.id);
            const hasAnswer = isHskExamAnswerPresent(item, session.answers[item.id]);
            const flagged = session.flaggedIds.has(item.id);
            return `
              <button
                class="${hasAnswer ? "is-answered" : ""} ${flagged ? "is-flagged" : ""} ${itemIndex === session.index ? "is-current" : ""}"
                type="button"
                data-hsk-question-index="${itemIndex}"
                aria-label="Question ${item.number}${hasAnswer ? ", answered" : ""}${flagged ? ", flagged" : ""}"
                ${itemIndex === session.index ? `aria-current="step"` : ""}>${item.number}</button>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function renderHskExamSession() {
  const session = state.session;
  const question = session.items[session.index];
  const answer = session.answers[question.id];
  const answeredCount = session.items.filter((item) => isHskExamAnswerPresent(item, session.answers[item.id])).length;
  const progressPercent = Math.round((answeredCount / session.items.length) * 100);
  const audioUsed = Number(session.audioPlays[question.id]) || 0;
  const flagged = session.flaggedIds.has(question.id);

  app.innerHTML = `
    <section class="workspace-panel hsk-exam-session-shell">
      <header class="hsk-exam-session-header">
        <div class="hsk-exam-session-identity">
          <span>HSK 3.0 mock</span>
          <strong>New HSK ${session.level}</strong>
        </div>
        <div class="hsk-exam-session-progress">
          <span>${answeredCount} of ${session.items.length} answered</span>
          <div class="progress-track" aria-hidden="true"><div style="width:${progressPercent}%"></div></div>
        </div>
        <div class="hsk-exam-session-clock ${getHskExamRemainingSeconds(session) <= 300 ? "is-urgent" : ""}">
          <span>Time remaining</span>
          <strong id="hskExamTimer">${formatTimer(getHskExamRemainingSeconds(session))}</strong>
        </div>
        <button class="ghost-btn hsk-exam-finish" type="button" id="finishHskExam">Finish exam</button>
      </header>

      <div class="hsk-exam-session-layout">
        <aside class="hsk-exam-navigator" aria-label="Question navigator">
          <div class="hsk-exam-nav-legend"><span><i></i>Answered</span><span><i></i>Flagged</span></div>
          ${buildHskExamNavigator(session)}
        </aside>

        <main class="hsk-exam-question-panel" id="hskExamQuestionPanel">
          <header class="hsk-exam-question-header">
            <div>
              <span>${escapeHtml(question.sectionLabel)} · ${escapeHtml(question.partLabel)}</span>
              <strong>Question ${question.number} of ${session.items.length}</strong>
            </div>
            <button class="hsk-exam-flag ${flagged ? "is-active" : ""}" type="button" id="flagHskExamQuestion" aria-pressed="${flagged}">
              <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 21V4"></path><path d="M5 5h12l-2 4 2 4H5"></path></svg>
              ${flagged ? "Flagged" : "Flag for review"}
            </button>
          </header>

          <p class="hsk-exam-instruction">${escapeHtml(question.instruction)}</p>

          ${question.audio ? `
            <div class="hsk-exam-audio-prompt">
              <button class="hsk-exam-play-audio" type="button" id="playHskExamAudio" ${audioUsed >= 1 ? "disabled" : ""}>
                ${speakerIconMarkup()}
                <span>${audioUsed >= 1 ? "Audio played" : "Play audio"}</span>
              </button>
              <span>${audioUsed >= 1 ? "No replays remaining" : "One play available"}</span>
              <i id="soundIndicator" aria-hidden="true"></i>
            </div>
          ` : ""}

          ${question.scene && question.type === "free" ? `<div class="hsk-exam-writing-scene">${buildHskExamSceneMarkup(question.scene, { large: true })}</div>` : ""}
          ${question.hintPinyin ? `<div class="hsk-exam-pinyin-hint"><span>Pinyin</span><strong>${buildToneColoredPinyinMarkup(question.hintPinyin)}</strong></div>` : ""}
          ${question.audio
            ? `<h2 class="hsk-exam-hidden-prompt">Listen before answering</h2>`
            : buildHskExamChineseMarkup(question.prompt, session.level)}

          ${buildHskExamQuestionControl(question, answer, session.level)}

          <footer class="hsk-exam-question-actions">
            <button class="ghost-btn" type="button" id="previousHskExamQuestion" ${session.index === 0 ? "disabled" : ""}>Previous</button>
            <span>Answers are not checked until the exam ends.</span>
            ${session.index + 1 === session.items.length
              ? `<button class="primary-btn" type="button" id="submitHskExamFromLast">Review and finish</button>`
              : `<button class="primary-btn" type="button" id="nextHskExamQuestion">Next question</button>`}
          </footer>
        </main>
      </div>
    </section>
  `;

  document.querySelectorAll("[data-hsk-question-index]").forEach((button) => {
    button.addEventListener("click", () => goToHskExamQuestion(Number(button.dataset.hskQuestionIndex)));
  });
  document.querySelectorAll("[data-hsk-exam-choice]").forEach((button) => {
    button.addEventListener("click", () => setHskExamAnswer(question.id, button.dataset.hskExamChoice));
  });
  document.querySelectorAll("[data-hsk-reorder-add]").forEach((button) => {
    button.addEventListener("click", () => {
      const current = Array.isArray(session.answers[question.id]) ? [...session.answers[question.id]] : [];
      current.push(Number(button.dataset.hskReorderAdd));
      setHskExamAnswer(question.id, current);
    });
  });
  document.querySelectorAll("[data-hsk-reorder-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const current = Array.isArray(session.answers[question.id]) ? [...session.answers[question.id]] : [];
      current.splice(Number(button.dataset.hskReorderRemove), 1);
      setHskExamAnswer(question.id, current);
    });
  });
  document.querySelector("#clearHskExamAnswer")?.addEventListener("click", () => setHskExamAnswer(question.id, []));
  document.querySelector("#hskExamTextAnswer")?.addEventListener("input", (event) => {
    session.answers[question.id] = event.currentTarget.value;
    saveHskExamDraft(session);
    updateHskExamNavigatorState(session, question);
  });
  document.querySelector("#playHskExamAudio")?.addEventListener("click", () => playHskExamAudio(question));
  document.querySelector("#flagHskExamQuestion")?.addEventListener("click", () => toggleHskExamFlag(question.id));
  document.querySelector("#previousHskExamQuestion")?.addEventListener("click", () => goToHskExamQuestion(session.index - 1));
  document.querySelector("#nextHskExamQuestion")?.addEventListener("click", () => goToHskExamQuestion(session.index + 1));
  document.querySelector("#finishHskExam")?.addEventListener("click", () => finishHskExam("submitted"));
  document.querySelector("#submitHskExamFromLast")?.addEventListener("click", () => finishHskExam("submitted"));
  if (["text", "free"].includes(question.type) && !isTouchLikeDevice()) {
    document.querySelector("#hskExamTextAnswer")?.focus();
  }
}

function updateHskExamNavigatorState(session, question) {
  const answered = isHskExamAnswerPresent(question, session.answers[question.id]);
  const navButton = document.querySelector(`[data-hsk-question-index="${session.index}"]`);
  navButton?.classList.toggle("is-answered", answered);
  const answeredCount = session.items.filter((item) => isHskExamAnswerPresent(item, session.answers[item.id])).length;
  const progressCopy = document.querySelector(".hsk-exam-session-progress > span");
  const progressFill = document.querySelector(".hsk-exam-session-progress .progress-track > div");
  if (progressCopy) progressCopy.textContent = `${answeredCount} of ${session.items.length} answered`;
  if (progressFill) progressFill.style.width = `${Math.round((answeredCount / session.items.length) * 100)}%`;
}

function setHskExamAnswer(questionId, answer) {
  const session = state.session;
  if (session?.type !== "exam" || !session.items.some((item) => item.id === questionId)) {
    return;
  }
  session.answers[questionId] = answer;
  saveHskExamDraft(session);
  render();
}

function submitHskExamChoiceByShortcut(key) {
  const session = state.session;
  const question = session?.type === "exam" ? session.items[session.index] : null;
  const choice = question?.choices?.[Number(key) - 1];
  if (choice) {
    setHskExamAnswer(question.id, choice.id);
  }
}

function toggleHskExamFlag(questionId) {
  const session = state.session;
  if (session?.type !== "exam") return;
  if (session.flaggedIds.has(questionId)) {
    session.flaggedIds.delete(questionId);
  } else {
    session.flaggedIds.add(questionId);
  }
  saveHskExamDraft(session);
  render();
}

function goToHskExamQuestion(index) {
  const session = state.session;
  if (session?.type !== "exam") return;
  const nextIndex = clamp(Number(index) || 0, 0, session.items.length - 1);
  if (nextIndex === session.index) return;
  stopSpeech();
  session.index = nextIndex;
  saveHskExamDraft(session);
  render();
  if (window.matchMedia?.("(max-width: 820px)").matches) {
    document.querySelector("#hskExamQuestionPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function playHskExamAudio(question) {
  const session = state.session;
  if (session?.type !== "exam" || !question?.audio || Number(session.audioPlays[question.id]) >= 1) {
    return;
  }
  session.audioPlays[question.id] = 1;
  saveHskExamDraft(session);
  render();
  speak(question.audio, { immediate: true });
}

function isHskExamAnswerPresent(question, answer) {
  if (question?.type === "reorder") {
    return Array.isArray(answer) && answer.length > 0;
  }
  return typeof answer === "string" ? Boolean(answer.trim()) : answer !== undefined && answer !== null;
}

function formatHskExamAnswer(question, answer) {
  if (!isHskExamAnswerPresent(question, answer)) return "No answer";
  if (question.type === "choice") {
    const choice = question.choices.find((item) => item.id === answer);
    return choice?.label || HSK_MOCK_EXAMS.scenes?.[choice?.scene]?.alt || "Selected picture";
  }
  if (question.type === "reorder") {
    return answer.map((index) => question.tokens[index] || "").join("");
  }
  return String(answer).trim();
}

function getHskExamExpectedAnswer(question) {
  if (question.type === "choice") {
    const choice = question.choices.find((item) => item.id === question.answer);
    return choice?.label || HSK_MOCK_EXAMS.scenes?.[choice?.scene]?.alt || "Correct picture";
  }
  return question.answer || "";
}

function assessHskExamAnswer(question, answer) {
  const answered = isHskExamAnswerPresent(question, answer);
  let score = 0;
  if (answered && question.type === "choice") {
    score = answer === question.answer ? 1 : 0;
  } else if (answered && question.type === "reorder") {
    score = scoreChinese(formatHskExamAnswer(question, answer), question.answer);
  } else if (answered && question.type === "text") {
    score = Math.max(0, ...(question.answers || [question.answer]).map((expected) => scoreChinese(String(answer), expected)));
  } else if (answered && question.type === "free") {
    const normalized = normalizeChinese(String(answer));
    const groups = [question.keywords || [], ...(question.alternateKeywords || [])];
    const bestKeywordScore = Math.max(0, ...groups.map((keywords) => {
      if (!keywords.length) return 0;
      return keywords.filter((keyword) => normalized.includes(normalizeChinese(keyword))).length / keywords.length;
    }));
    score = normalized.length >= 4 ? bestKeywordScore : bestKeywordScore * 0.5;
  }
  return {
    item: question,
    answer: formatHskExamAnswer(question, answer),
    expected: getHskExamExpectedAnswer(question),
    answered,
    score: clamp(score, 0, 1),
    correct: score >= 0.8,
    estimated: question.type === "free",
  };
}

function buildHskExamResult(session, finishReason = "submitted") {
  const answers = session.items.map((item) => assessHskExamAnswer(item, session.answers[item.id]));
  const elapsedSeconds = Math.min(
    session.exam.durationMinutes * 60,
    Math.max(0, Math.round((Date.now() - session.startedAt) / 1000)),
  );
  return {
    type: "exam",
    examMode: "written",
    level: session.level,
    exam: session.exam,
    items: session.items,
    answers,
    total: session.items.length,
    elapsedSeconds,
    timeLimitSeconds: session.exam.durationMinutes * 60,
    finishReason,
  };
}

function getHskExamResultStats(result) {
  const sections = (result.exam?.sections || []).map((examSection) => {
    const answers = result.answers.filter((answer) => answer.item.skill === examSection.id);
    const correct = answers.filter((answer) => answer.correct).length;
    const answered = answers.filter((answer) => answer.answered).length;
    const accuracy = answers.length ? answers.reduce((sum, answer) => sum + answer.score, 0) / answers.length : 0;
    return {
      id: examSection.id,
      label: examSection.label,
      correct,
      answered,
      total: answers.length,
      accuracy,
      scaledScore: Math.round(accuracy * 100),
      parts: examSection.parts.map((examPart) => {
        const partAnswers = answers.filter((answer) =>
          String(answer.item.partId || answer.item.partLabel) === String(examPart.id || examPart.label),
        );
        const partScore = partAnswers.reduce((sum, answer) => sum + answer.score, 0);
        return {
          id: examPart.id,
          label: examPart.label,
          correct: partAnswers.filter((answer) => answer.correct).length,
          answered: partAnswers.filter((answer) => answer.answered).length,
          total: partAnswers.length,
          accuracy: partAnswers.length ? partScore / partAnswers.length : 0,
        };
      }),
    };
  });
  const maxScore = sections.length * 100;
  const scaledScore = sections.reduce((sum, examSection) => sum + examSection.scaledScore, 0);
  return {
    sections,
    answered: result.answers.filter((answer) => answer.answered).length,
    correct: result.answers.filter((answer) => answer.correct).length,
    total: result.answers.length,
    scaledScore,
    maxScore,
    percent: maxScore ? scaledScore / maxScore : 0,
  };
}

function getHskExamReadiness(percent = 0) {
  if (percent >= 0.85) {
    return {
      id: "strong",
      label: "Strong readiness signal",
      summary: "Your performance is consistent across most of this practice paper. Focus on the remaining weak part before the next full mock.",
    };
  }
  if (percent >= 0.7) {
    return {
      id: "near",
      label: "Approaching test readiness",
      summary: "The core skills are in place. Targeted work on the lowest section should produce the fastest improvement.",
    };
  }
  if (percent >= 0.5) {
    return {
      id: "developing",
      label: "Core skills are developing",
      summary: "Use short focused sessions before taking another full paper so the next score reflects stronger recall and pacing.",
    };
  }
  return {
    id: "foundation",
    label: "Rebuild the foundation first",
    summary: "Return to guided vocabulary and sentence practice, then use another mock to measure what changed.",
  };
}

function getHskExamAttemptComparison(result, history = loadHistoryRecords()) {
  const stats = getHskExamResultStats(result);
  const previous = history.filter((record) =>
    record.type === "exam" &&
    record.examMode === "written" &&
    Number(record.level) === Number(result.level) &&
    record.id !== result.historyRecordId,
  );
  const prior = previous[0] || null;
  const previousBest = previous.reduce(
    (best, record) => Math.max(best, Number(record.scaledScore) || 0),
    -1,
  );
  return {
    attemptNumber: previous.length + 1,
    priorScore: prior ? Number(prior.scaledScore) || 0 : null,
    delta: prior ? stats.scaledScore - (Number(prior.scaledScore) || 0) : null,
    bestScore: Math.max(stats.scaledScore, previousBest),
    isPersonalBest: previousBest < 0 || stats.scaledScore > previousBest,
  };
}

function getHskExamCoachRecommendations(result, stats = getHskExamResultStats(result)) {
  const recommendations = [];
  const unanswered = stats.total - stats.answered;
  if (unanswered) {
    recommendations.push({
      id: "pace",
      action: "retake",
      title: "Protect time for every question",
      detail: `${unanswered} ${unanswered === 1 ? "question was" : "questions were"} left unanswered. Use section checkpoints and make a best choice before moving on.`,
      actionLabel: "Retake with a pacing plan",
      accuracy: stats.answered / Math.max(1, stats.total),
    });
  }

  const sectionCopy = {
    listening: {
      title: "Strengthen spoken comprehension",
      action: "listening",
      actionLabel: "Start a listening drill",
      detail: "Train sentence-level listening without written clues, then return to the exam audio format.",
    },
    reading: {
      title: "Build faster reading decisions",
      action: Number(result.level) <= 2 ? "review" : "reading",
      actionLabel: Number(result.level) <= 2 ? "Start vocabulary review" : "Start a reading drill",
      detail: Number(result.level) <= 2
        ? "Strengthen rapid word recognition so prompts and distractors take less time to process."
        : "Practice extracting the main point and supporting detail from complete Chinese sentences.",
    },
    writing: {
      title: "Practice sentence production",
      action: "writing",
      actionLabel: "Start a writing drill",
      detail: "Build natural word order and produce complete Chinese sentences without answer choices.",
    },
  };

  [...stats.sections]
    .sort((left, right) => left.accuracy - right.accuracy)
    .forEach((examSection) => {
      const copy = sectionCopy[examSection.id];
      if (!copy) return;
      const weakestPart = [...examSection.parts].sort((left, right) => left.accuracy - right.accuracy)[0];
      recommendations.push({
        id: examSection.id,
        ...copy,
        accuracy: examSection.accuracy,
        detail: `${weakestPart?.label || examSection.label} was the main opportunity at ${Math.round((weakestPart?.accuracy ?? examSection.accuracy) * 100)}%. ${copy.detail}`,
      });
    });

  return recommendations.slice(0, 3);
}

function getHskExamReviewExplanation(answer) {
  const question = answer.item;
  if (!answer.answered) {
    return `This item was unanswered. The expected response is “${answer.expected}”; make a best choice before leaving an item in the timed exam.`;
  }
  if (question.type === "reorder") {
    return `Use subject, time, verb, and object order as your guide. A natural complete sentence is “${answer.expected}”.`;
  }
  if (question.type === "text") {
    return `The missing character must fit both meaning and grammar. Read the completed sentence again with “${answer.expected}” in the blank.`;
  }
  if (question.type === "free") {
    return "Compare your sentence with the model for meaning, word order, and completeness. Other natural sentences can also be valid.";
  }
  if (question.audio) {
    return `Listen for the words that identify “${answer.expected}”. The other choices do not match the key detail in the spoken prompt.`;
  }
  return `The prompt supports “${answer.expected}”. Re-read the key phrase and check why your choice changes the meaning.`;
}

function finishHskExam(reason = "submitted") {
  const session = state.session;
  if (session?.type !== "exam") return;
  const unanswered = session.items.filter((item) => !isHskExamAnswerPresent(item, session.answers[item.id])).length;
  if (reason === "submitted" && unanswered && !window.confirm(`${unanswered} ${unanswered === 1 ? "question is" : "questions are"} unanswered. Finish the exam anyway?`)) {
    return;
  }
  const result = buildHskExamResult(session, reason);
  clearHskExamDraft();
  stopExamTimer();
  stopSpeech();
  state.result = result;
  state.session = null;
  saveHistoryResult(result);
  render();
}

function buildHskExamReviewMarkup(answer) {
  const question = answer.item;
  const prompt = question.audio ? question.audio : question.prompt;
  const explanation = getHskExamReviewExplanation(answer);
  return `
    <details class="hsk-exam-review-item ${answer.correct ? "is-correct" : "is-wrong"}">
      <summary>
        <span>${question.number}</span>
        <strong>${escapeHtml(question.sectionLabel)} · ${escapeHtml(question.partLabel)}</strong>
        <b>${answer.correct ? "Correct" : answer.answered ? "Review" : "Not answered"}</b>
      </summary>
      <div class="hsk-exam-review-body">
        ${buildHskExamChineseMarkup(prompt, question.level)}
        <dl>
          <div><dt>Your answer</dt><dd>${escapeHtml(answer.answer)}</dd></div>
          <div><dt>${answer.estimated ? "Model answer" : "Correct answer"}</dt><dd>${escapeHtml(answer.expected)}</dd></div>
        </dl>
        ${answer.correct ? "" : `<div class="hsk-exam-coach-note"><strong>Coach note</strong><p>${escapeHtml(explanation)}</p></div>`}
      </div>
    </details>
  `;
}

function renderHskExamResults() {
  const result = state.result;
  if (result?.examMode === "speaking") {
    renderHskSpeakingResults();
    return;
  }
  const stats = getHskExamResultStats(result);
  const readiness = getHskExamReadiness(stats.percent);
  const comparison = getHskExamAttemptComparison(result);
  const recommendations = getHskExamCoachRecommendations(result, stats);
  const missed = result.answers.filter((answer) => !answer.correct);
  const trendCopy = comparison.priorScore === null
    ? "First benchmark saved"
    : comparison.delta > 0
      ? `Up ${comparison.delta} points from your last attempt`
      : comparison.delta < 0
        ? `${Math.abs(comparison.delta)} points below your last attempt`
        : "Matched your last attempt";
  app.innerHTML = `
    <section class="workspace-panel hsk-exam-results">
      <header class="hsk-exam-results-header">
        <div>
          <span class="hsk-exam-kicker">Mock complete</span>
          <h2>New HSK ${result.level} results</h2>
          <p>${result.finishReason === "time" ? "Time expired and the exam was submitted automatically." : "Your full paper has been scored and saved to History."}</p>
        </div>
        <div class="hsk-exam-score-ring" style="--score:${Math.round(stats.percent * 100)}">
          <span>Estimated score</span>
          <strong>${stats.scaledScore}</strong>
          <small>of ${stats.maxScore}</small>
        </div>
      </header>

      <div class="hsk-exam-result-summary">
        <div><span>Correct</span><strong>${stats.correct}/${stats.total}</strong></div>
        <div><span>Answered</span><strong>${stats.answered}/${stats.total}</strong></div>
        <div><span>Time used</span><strong>${formatTimer(result.elapsedSeconds)}</strong></div>
        <div><span>Practice benchmark</span><strong>${Math.round(stats.percent * 100)}%</strong></div>
      </div>

      <section class="hsk-exam-coach is-${readiness.id} ${comparison.isPersonalBest ? "is-personal-best" : ""}" aria-labelledby="hskExamCoachHeading">
        <header>
          <div>
            <span class="hsk-exam-kicker">Exam coach</span>
            <h3 id="hskExamCoachHeading">${escapeHtml(readiness.label)}</h3>
            <p>${escapeHtml(readiness.summary)}</p>
          </div>
          <div class="hsk-exam-attempt-trend">
            <span>${comparison.isPersonalBest ? "New personal best" : `Attempt ${comparison.attemptNumber}`}</span>
            <strong>${comparison.bestScore}/${stats.maxScore}</strong>
            <small>${escapeHtml(trendCopy)}</small>
          </div>
        </header>
        <div class="hsk-exam-coach-priorities">
          ${recommendations.map((recommendation, index) => `
            <article>
              <span>Priority ${index + 1} · ${Math.round(recommendation.accuracy * 100)}%</span>
              <h4>${escapeHtml(recommendation.title)}</h4>
              <p>${escapeHtml(recommendation.detail)}</p>
              <button class="hsk-exam-coach-action" type="button" data-hsk-coach-action="${escapeHtml(recommendation.action)}">
                ${escapeHtml(recommendation.actionLabel)} <span aria-hidden="true">→</span>
              </button>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="hsk-exam-section-results" aria-labelledby="hskExamSectionResultsHeading">
        <div class="hsk-exam-results-section-heading">
          <div><h3 id="hskExamSectionResultsHeading">Section performance</h3><p>Each section contributes 100 estimated points.</p></div>
        </div>
        ${stats.sections.map((examSection) => `
          <div class="hsk-exam-section-result-row">
            <strong>${escapeHtml(examSection.label)}</strong>
            <span>${examSection.correct}/${examSection.total} correct</span>
            <div class="progress-track" aria-hidden="true"><div style="width:${Math.round(examSection.accuracy * 100)}%"></div></div>
            <b>${examSection.scaledScore}/100</b>
          </div>
          <div class="hsk-exam-part-results" aria-label="${escapeHtml(examSection.label)} part results">
            ${examSection.parts.map((examPart) => `
              <span><strong>${escapeHtml(examPart.label)}</strong><b>${examPart.correct}/${examPart.total}</b></span>
            `).join("")}
          </div>
        `).join("")}
      </section>

      <section class="hsk-exam-review" aria-labelledby="hskExamReviewHeading">
        <div class="hsk-exam-results-section-heading">
          <div><h3 id="hskExamReviewHeading">Answer review</h3><p>${missed.length ? `${missed.length} ${missed.length === 1 ? "answer" : "answers"} to review` : "Every answer was correct"}</p></div>
          <span>${result.answers.length} saved answers</span>
        </div>
        <div class="hsk-exam-review-list">
          ${(missed.length ? missed : result.answers).map(buildHskExamReviewMarkup).join("")}
        </div>
      </section>

      <p class="hsk-exam-score-note">This is a practice estimate from raw answers, not an official HSK score report. Open writing accepts target-language alternatives but still requires self-review.</p>

      <div class="result-actions">
        <button class="primary-btn" type="button" id="restartHskExam">Retake New HSK ${result.level}</button>
        ${result.level === 3 ? `<button class="secondary-btn" type="button" id="startHskSpeakingFromResults">Practice HSK 3 speaking</button>` : ""}
        <button class="ghost-btn" type="button" id="backToHskExamHome">All mock exams</button>
      </div>
    </section>
  `;

  document.querySelector("#restartHskExam")?.addEventListener("click", () => startHskExam(result.level));
  document.querySelectorAll("[data-hsk-coach-action]").forEach((button) => {
    button.addEventListener("click", () => launchHskExamCoachAction(button.dataset.hskCoachAction, result.level));
  });
  document.querySelector("#startHskSpeakingFromResults")?.addEventListener("click", () => {
    state.result = null;
    state.examLevel = 3;
    state.examMode = "speaking";
    state.examScreen = "ready";
    render();
  });
  document.querySelector("#backToHskExamHome")?.addEventListener("click", () => {
    state.result = null;
    state.examScreen = "home";
    render();
  });
}

function launchHskExamCoachAction(action, level) {
  if (action === "retake") {
    startHskExam(level);
    return;
  }

  const sentenceLevel = Number(level) >= 3 ? "advanced" : Number(level) === 2 ? "intermediate" : "beginner";
  state.selectedLevels = new Set([sentenceLevel]);
  if (action === "review") {
    const vocabulary = shuffle(getAllVocabularyReviewItems().filter((item) =>
      Number(getVocabularySetMeta(item).levelNumber) === Number(level),
    )).slice(0, REVIEW_SESSION_LENGTH);
    if (vocabulary.length) {
      state.tool = "review";
      state.result = null;
      state.session = null;
      saveSettings();
      startReviewItems(vocabulary.map((item, index) => ({
        ...item,
        reviewMode: index % 2 ? "meaning" : "pinyin",
      })), "exam-coach", { setLabel: `New HSK ${level} exam focus` });
      return;
    }
  }
  if (action === "listening" || action === "reading" || action === "writing") {
    launchDashboardActivity("drill", action);
    return;
  }
  state.result = null;
  state.examScreen = "home";
  render();
}

function flattenHskSpeakingItems(speaking = HSK_MOCK_EXAMS.speaking) {
  let number = 0;
  return (speaking?.parts || []).flatMap((examPart) =>
    examPart.items.map((item) => {
      number += 1;
      return {
        ...item,
        number,
        partId: examPart.id,
        partLabel: examPart.label,
        responseSeconds: examPart.responseSeconds,
      };
    }),
  );
}

function startHskSpeakingExam() {
  if (!canAccessHskExamLevel(3)) {
    return;
  }
  const speaking = HSK_MOCK_EXAMS.speaking;
  if (!speaking) return;
  stopPronunciationRecognition();
  stopSpeech();
  releaseHskSpeakingMicrophone();
  const startedAt = Date.now();
  state.tool = "exam";
  state.examLevel = 3;
  state.examMode = "speaking";
  state.examScreen = "home";
  state.result = null;
  state.dataError = "";
  state.session = {
    type: "exam-speaking",
    level: 3,
    speaking,
    items: flattenHskSpeakingItems(speaking),
    index: 0,
    stage: "preparation",
    recordings: {},
    audioPlays: {},
    isRecording: false,
    microphoneError: "",
    startedAt,
    preparationEndsAt: startedAt + speaking.preparationMinutes * 60 * 1000,
    endsAt: startedAt + speaking.durationMinutes * 60 * 1000,
  };
  saveSettings();
  render();
}

function renderHskSpeakingSession() {
  const session = state.session;
  if (session.stage === "preparation") {
    renderHskSpeakingPreparation();
    return;
  }
  const item = session.items[session.index];
  const recording = session.recordings[item.id];
  const audioUsed = Number(session.audioPlays[item.id]) || 0;
  const responseRemaining = session.isRecording && session.responseEndsAt
    ? Math.max(0, Math.ceil((session.responseEndsAt - Date.now()) / 1000))
    : item.responseSeconds;

  app.innerHTML = `
    <section class="workspace-panel hsk-speaking-session">
      <header class="hsk-exam-session-header hsk-speaking-header">
        <div class="hsk-exam-session-identity"><span>HSK 3.0 mock</span><strong>New HSK 3 Speaking</strong></div>
        <div class="hsk-exam-session-progress">
          <span>${Object.keys(session.recordings).length} of ${session.items.length} recorded</span>
          <div class="progress-track" aria-hidden="true"><div style="width:${Math.round((session.index / session.items.length) * 100)}%"></div></div>
        </div>
        <div class="hsk-exam-session-clock ${getHskExamRemainingSeconds(session) <= 120 ? "is-urgent" : ""}"><span>Total time</span><strong id="hskExamTimer">${formatTimer(getHskExamRemainingSeconds(session))}</strong></div>
        <button class="ghost-btn hsk-exam-finish" type="button" id="finishHskSpeaking">Finish</button>
      </header>

      <main class="hsk-speaking-question-panel">
        <div class="hsk-speaking-question-meta">
          <span>${escapeHtml(item.partLabel)}</span>
          <strong>Question ${item.number} of ${session.items.length}</strong>
          <b>${item.responseSeconds < 60 ? `${item.responseSeconds} seconds` : `${item.responseSeconds / 60} minutes`}</b>
        </div>

        ${item.partId === "repeat" ? `
          <div class="hsk-speaking-repeat-prompt">
            <span>Listen carefully, then repeat the sentence.</span>
            <button class="hsk-exam-play-audio" type="button" id="playHskSpeakingPrompt" ${audioUsed >= 1 || session.isRecording ? "disabled" : ""}>
              ${speakerIconMarkup()}
              <span>${audioUsed ? "Prompt played" : "Play prompt"}</span>
            </button>
          </div>
        ` : item.partId === "picture" ? `
          <div class="hsk-speaking-picture-prompt">${buildHskExamSceneMarkup(item.scene, { large: true })}</div>
          <h2>Describe what you see in one clear sentence.</h2>
        ` : `
          <div class="hsk-speaking-open-prompt">
            <span>回答问题</span>
            <h2 class="chinese-text" lang="zh-CN">${escapeHtml(item.prompt)}</h2>
          </div>
        `}

        <div class="hsk-speaking-recorder ${session.isRecording ? "is-recording" : ""}">
          <div class="hsk-speaking-recorder-status">
            <i aria-hidden="true"></i>
            <div>
              <span>${session.isRecording ? "Recording" : recording ? "Response saved" : "Ready to record"}</span>
              <strong id="hskSpeakingResponseTimer">${formatTimer(responseRemaining)}</strong>
            </div>
          </div>
          ${session.microphoneError ? `<p class="hsk-speaking-microphone-error" role="alert">${escapeHtml(session.microphoneError)}</p>` : ""}
          <div class="hsk-speaking-recorder-actions">
            ${session.isRecording
              ? `<button class="primary-btn is-danger" type="button" id="stopHskSpeakingRecording">Stop response</button>`
              : `<button class="primary-btn" type="button" id="startHskSpeakingRecording">${recording ? "Record again" : "Start recording"}</button>`}
            ${recording && !session.isRecording ? `<audio controls preload="metadata" src="${escapeHtml(recording.url)}" aria-label="Your response to question ${item.number}"></audio>` : ""}
          </div>
        </div>

        <footer class="hsk-speaking-actions">
          <button class="ghost-btn" type="button" id="previousHskSpeakingQuestion" ${session.index === 0 || session.isRecording ? "disabled" : ""}>Previous</button>
          <span>Recordings are kept only until this tab closes.</span>
          <button class="primary-btn" type="button" id="nextHskSpeakingQuestion" ${session.isRecording ? "disabled" : ""}>${session.index + 1 === session.items.length ? "Finish speaking mock" : "Next question"}</button>
        </footer>
      </main>
    </section>
  `;

  document.querySelector("#playHskSpeakingPrompt")?.addEventListener("click", () => {
    if (!session.audioPlays[item.id]) {
      session.audioPlays[item.id] = 1;
      render();
      speak(item.prompt, { immediate: true });
    }
  });
  document.querySelector("#startHskSpeakingRecording")?.addEventListener("click", startHskSpeakingRecording);
  document.querySelector("#stopHskSpeakingRecording")?.addEventListener("click", () => stopHskSpeakingRecording());
  document.querySelector("#previousHskSpeakingQuestion")?.addEventListener("click", () => goToHskSpeakingQuestion(session.index - 1));
  document.querySelector("#nextHskSpeakingQuestion")?.addEventListener("click", () => {
    if (session.index + 1 >= session.items.length) {
      finishHskSpeakingExam("submitted");
    } else {
      goToHskSpeakingQuestion(session.index + 1);
    }
  });
  document.querySelector("#finishHskSpeaking")?.addEventListener("click", () => finishHskSpeakingExam("submitted"));
}

function renderHskSpeakingPreparation() {
  const session = state.session;
  const pictureItems = session.items.filter((item) => item.partId === "picture");
  const responseItems = session.items.filter((item) => item.partId === "response");
  const remaining = Math.max(0, Math.ceil((session.preparationEndsAt - Date.now()) / 1000));
  app.innerHTML = `
    <section class="workspace-panel hsk-speaking-preparation">
      <header>
        <div><span class="hsk-exam-kicker">Preparation period</span><h2>Review the picture and response prompts</h2><p>The listen-and-repeat sentences remain hidden until playback.</p></div>
        <div class="hsk-speaking-prep-clock"><span>Preparation</span><strong id="hskSpeakingPreparationTimer">${formatTimer(remaining)}</strong><small>Total exam <b id="hskExamTimer">${formatTimer(getHskExamRemainingSeconds(session))}</b></small></div>
      </header>
      <div class="hsk-speaking-prep-pictures">
        ${pictureItems.map((item, index) => `<div><span>${index + 9}</span>${buildHskExamSceneMarkup(item.scene)}</div>`).join("")}
      </div>
      <div class="hsk-speaking-prep-responses">
        ${responseItems.map((item) => `<div><span>${item.number}</span><strong class="chinese-text" lang="zh-CN">${escapeHtml(item.prompt)}</strong></div>`).join("")}
      </div>
      <div class="hsk-speaking-prep-actions">
        <p>You may begin early. The overall 15-minute timer continues either way.</p>
        <button class="primary-btn" type="button" id="beginHskSpeakingResponses">Begin responses</button>
      </div>
    </section>
  `;
  document.querySelector("#beginHskSpeakingResponses")?.addEventListener("click", beginHskSpeakingResponses);
}

function beginHskSpeakingResponses() {
  const session = state.session;
  if (session?.type !== "exam-speaking") return;
  session.stage = "responses";
  session.index = 0;
  render();
}

async function startHskSpeakingRecording() {
  const session = state.session;
  const item = session?.type === "exam-speaking" ? session.items[session.index] : null;
  if (!item || session.isRecording) return;
  stopSpeech();
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    session.microphoneError = "Audio recording is not supported in this browser. Try current Chrome, Edge, or Safari over HTTPS.";
    render();
    return;
  }
  try {
    if (!hskSpeakingMediaStream?.active) {
      hskSpeakingMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    const previous = session.recordings[item.id];
    if (previous?.url) URL.revokeObjectURL(previous.url);
    hskSpeakingChunks = [];
    hskSpeakingMediaRecorder = new MediaRecorder(hskSpeakingMediaStream);
    hskSpeakingMediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data?.size) hskSpeakingChunks.push(event.data);
    });
    hskSpeakingMediaRecorder.addEventListener("stop", () => {
      const blob = new Blob(hskSpeakingChunks, { type: hskSpeakingMediaRecorder?.mimeType || "audio/webm" });
      if (blob.size) {
        session.recordings[item.id] = {
          url: URL.createObjectURL(blob),
          durationSeconds: Math.max(1, Math.round((Date.now() - session.responseStartedAt) / 1000)),
        };
      }
      session.isRecording = false;
      session.responseEndsAt = 0;
      hskSpeakingMediaRecorder = null;
      const callback = hskSpeakingStopCallback;
      hskSpeakingStopCallback = null;
      if (callback) callback();
      else if (state.session === session) render();
    }, { once: true });
    session.microphoneError = "";
    session.isRecording = true;
    session.responseStartedAt = Date.now();
    session.responseEndsAt = session.responseStartedAt + item.responseSeconds * 1000;
    hskSpeakingMediaRecorder.start(250);
    render();
  } catch (error) {
    session.microphoneError = error?.name === "NotAllowedError"
      ? "Microphone permission was denied. Allow access in the browser site settings and try again."
      : "The microphone could not start. Check that another app is not using it.";
    render();
  }
}

function stopHskSpeakingRecording(callback = null) {
  const session = state.session;
  if (session?.type !== "exam-speaking" || !session.isRecording) {
    callback?.();
    return;
  }
  hskSpeakingStopCallback = callback;
  if (hskSpeakingMediaRecorder?.state === "recording") {
    hskSpeakingMediaRecorder.stop();
  } else {
    session.isRecording = false;
    callback?.();
  }
}

function goToHskSpeakingQuestion(index) {
  const session = state.session;
  if (session?.type !== "exam-speaking" || session.isRecording) return;
  stopSpeech();
  session.index = clamp(Number(index) || 0, 0, session.items.length - 1);
  session.microphoneError = "";
  render();
}

function finishHskSpeakingExam(reason = "submitted") {
  const session = state.session;
  if (session?.type !== "exam-speaking") return;
  if (session.isRecording) {
    stopHskSpeakingRecording(() => finishHskSpeakingExam(reason));
    return;
  }
  const recorded = Object.keys(session.recordings).length;
  if (reason === "submitted" && recorded < session.items.length && !window.confirm(`${session.items.length - recorded} responses are not recorded. Finish anyway?`)) {
    return;
  }
  const result = {
    type: "exam",
    examMode: "speaking",
    level: 3,
    speaking: session.speaking,
    items: session.items,
    recordings: session.recordings,
    answers: session.items.map((item) => ({ item, recorded: Boolean(session.recordings[item.id]) })),
    total: session.items.length,
    recorded,
    elapsedSeconds: Math.min(session.speaking.durationMinutes * 60, Math.max(0, Math.round((Date.now() - session.startedAt) / 1000))),
    timeLimitSeconds: session.speaking.durationMinutes * 60,
    finishReason: reason,
  };
  stopExamTimer();
  stopSpeech();
  releaseHskSpeakingMicrophone();
  state.result = result;
  state.session = null;
  saveHistoryResult(result);
  render();
}

function releaseHskSpeakingMicrophone() {
  hskSpeakingMediaStream?.getTracks?.().forEach((track) => track.stop());
  hskSpeakingMediaStream = null;
  hskSpeakingMediaRecorder = null;
  hskSpeakingChunks = [];
}

function renderHskSpeakingResults() {
  const result = state.result;
  app.innerHTML = `
    <section class="workspace-panel hsk-exam-results hsk-speaking-results">
      <header class="hsk-exam-results-header">
        <div><span class="hsk-exam-kicker">Speaking mock complete</span><h2>New HSK 3 speaking review</h2><p>Listen back while the recordings remain available in this tab.</p></div>
        <div class="hsk-speaking-result-count"><span>Responses recorded</span><strong>${result.recorded}</strong><small>of ${result.total}</small></div>
      </header>
      <div class="hsk-exam-result-summary">
        <div><span>Repeat</span><strong>${result.answers.filter((answer) => answer.item.partId === "repeat" && answer.recorded).length}/8</strong></div>
        <div><span>Picture</span><strong>${result.answers.filter((answer) => answer.item.partId === "picture" && answer.recorded).length}/5</strong></div>
        <div><span>Response</span><strong>${result.answers.filter((answer) => answer.item.partId === "response" && answer.recorded).length}/2</strong></div>
        <div><span>Time used</span><strong>${formatTimer(result.elapsedSeconds)}</strong></div>
      </div>
      <section class="hsk-speaking-review" aria-labelledby="hskSpeakingReviewHeading">
        <div class="hsk-exam-results-section-heading"><div><h3 id="hskSpeakingReviewHeading">Self-review</h3><p>Compare clarity, completeness, and fluency across all three parts.</p></div></div>
        <div class="hsk-speaking-review-list">
          ${result.answers.map((answer) => {
            const item = answer.item;
            const recording = result.recordings[item.id];
            const reference = item.partId === "repeat" ? item.prompt : item.partId === "picture" ? item.modelAnswer : "Aim for at least five connected sentences with a clear reason or example.";
            return `
              <article class="hsk-speaking-review-item ${answer.recorded ? "" : "is-missing"}">
                <span>${item.number}</span>
                <div><strong>${escapeHtml(item.partLabel)}</strong><p class="${containsChinese(reference) ? "chinese-text" : ""}">${escapeHtml(reference)}</p></div>
                ${recording ? `<audio controls preload="metadata" src="${escapeHtml(recording.url)}" aria-label="Response ${item.number}"></audio>` : `<b>Not recorded</b>`}
              </article>
            `;
          }).join("")}
        </div>
      </section>
      <p class="hsk-exam-score-note">Speaking responses require human judgment, so this simulation records completion rather than inventing an automated official score.</p>
      <div class="result-actions">
        <button class="primary-btn" type="button" id="restartHskSpeaking">Retake speaking mock</button>
        <button class="secondary-btn" type="button" id="startHskWrittenFromSpeaking">Take New HSK 3 written</button>
        <button class="ghost-btn" type="button" id="backToHskExamHome">All mock exams</button>
      </div>
    </section>
  `;
  document.querySelector("#restartHskSpeaking")?.addEventListener("click", startHskSpeakingExam);
  document.querySelector("#startHskWrittenFromSpeaking")?.addEventListener("click", () => startHskExam(3));
  document.querySelector("#backToHskExamHome")?.addEventListener("click", () => {
    Object.values(result.recordings || {}).forEach((recording) => recording?.url && URL.revokeObjectURL(recording.url));
    state.result = null;
    state.examScreen = "home";
    render();
  });
}

function getProgressSkillDefinitions() {
  return [
    { id: "vocabulary", label: "Vocabulary", tool: "review", unit: "words" },
    { id: "grammar", label: "Grammar", tool: "grammar", unit: "questions" },
    { id: "exam", label: "Mock exams", tool: "exam", unit: "questions" },
    { id: "pronunciation", label: "Pronunciation", tool: "pronunciation", unit: "sentences" },
    { id: "tone", label: "Tone listening", tool: "pronunciation", mode: "tone", unit: "words" },
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
  let typeLabel = "Sentence drill";
  let modeLabel = `${MODES[record.mode]?.label || record.mode}${record.source === "saved" ? " · Saved sentences" : record.source === "mistakes" ? " · Mistake retry" : ""}`;
  let resultLabel = `${record.correct}/${record.total} correct · ${Math.round((record.averageScore || 0) * 100)}% avg`;

  if (record.type === "vocabulary") {
    typeLabel = "Vocabulary quiz";
    modeLabel = `${record.setLabel} · ${VOCABULARY_MODES[record.quizMode]?.label || record.quizMode}`;
    resultLabel = buildVocabularyHistoryResultLabel(record);
  } else if (record.type === "review") {
    typeLabel = record.source === "path" ? "HSK path review" : record.source === "mistakes" ? "Mistake review" : "Daily review";
    modeLabel = record.source === "saved"
      ? "Saved vocabulary"
      : record.source === "path"
        ? `${formatVocabularyPathSetName(record.setId, record.setLabel)} · Focused review`
        : record.source === "mistakes"
          ? `${record.setLabel || "Vocabulary"} · Targeted retry`
          : "Adaptive vocabulary";
    resultLabel = `${record.correct}/${record.total} correct · ${formatTimer(record.elapsedSeconds || 0)}`;
  } else if (record.type === "grammar") {
    typeLabel = "Grammar practice";
    modeLabel = record.scope === "lesson"
      ? `${record.lessonTitle || "Focused pattern"} · HSK ${record.level || 1}`
      : `HSK ${record.level || 1} · Mixed patterns`;
    resultLabel = `${record.correct}/${record.total} correct · ${formatTimer(record.elapsedSeconds || 0)}`;
  } else if (record.type === "reader") {
    typeLabel = "Graded reader";
    modeLabel = `New HSK ${record.level || 1} · ${record.title || "Story"}`;
    resultLabel = `${record.correct}/${record.total} correct · ${formatTimer(record.elapsedSeconds || 0)}`;
  } else if (record.type === "exam") {
    typeLabel = record.examMode === "speaking" ? "HSK speaking mock" : "Mock HSK exam";
    modeLabel = `New HSK ${record.level || 1} · ${record.examMode === "speaking" ? "Speaking" : "Written"}`;
    resultLabel = record.examMode === "speaking"
      ? `${record.recorded || 0}/${record.total} recorded · ${formatTimer(record.elapsedSeconds || 0)}`
      : `${record.scaledScore || 0}/${record.maxScore || 0} estimated · ${formatTimer(record.elapsedSeconds || 0)}`;
  } else if (record.type === "placement") {
    typeLabel = "Level check";
    modeLabel = "HSK 1–3 · Vocabulary and language use";
    resultLabel = `HSK ${record.recommendedLevel || 1} recommended · ${record.correct}/${record.total} correct`;
  } else if (record.type === "pronunciation") {
    typeLabel = "Pronunciation";
    modeLabel = selectedLevelLabels(record.levels);
    resultLabel = `${Math.round((record.averageScore || 0) * 100)}% recognized · ${record.total} sentences`;
  } else if (record.type === "tone") {
    typeLabel = "Tone listening";
    modeLabel = "HSK 1–3 vocabulary";
    resultLabel = `${record.correct}/${record.total} correct · ${formatTimer(record.elapsedSeconds || 0)}`;
  } else if (record.type === "map") {
    typeLabel = "Geography";
    modeLabel = getSelectedMapQuizMode(record.mapQuizMode).targetMetric;
    resultLabel = `${record.correct}/${record.total} correct · ${formatTimer(record.elapsedSeconds || 0)}`;
  }
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
        if (record.type === "reader") {
          return `
            <div class="history-mistake-row is-sentence is-grammar">
              <strong class="chinese-text" lang="zh-CN">${escapeHtml(answer.prompt || "Reading question")}</strong>
              <p>New HSK ${record.level || 1} · ${escapeHtml(record.title || "Graded reader")}</p>
              <span>Your answer: ${escapeHtml(answer.answer || "No answer")} · expected ${escapeHtml(answer.expected || "")}</span>
              <b>Review</b>
            </div>
          `;
        }
        if (record.type === "exam") {
          return `
            <div class="history-mistake-row is-sentence is-grammar">
              <strong class="${containsChinese(answer.prompt || "") ? "chinese-text" : ""}" lang="${containsChinese(answer.prompt || "") ? "zh-CN" : "en"}">${escapeHtml(answer.prompt || `Question ${(answer.index || 0) + 1}`)}</strong>
              <p>${record.examMode === "speaking" ? escapeHtml(answer.partLabel || "Speaking response") : `${escapeHtml(answer.skillLabel || "Exam")} · New HSK ${record.level || 1}`}</p>
              <span>${record.examMode === "speaking" ? "No response recorded" : `Your answer: ${escapeHtml(answer.answer || "No answer")} · expected ${escapeHtml(answer.expected || "")}`}</span>
              <b>${answer.correct ? "Correct" : "Review"}</b>
            </div>
          `;
        }
        if (record.type === "placement") {
          if (answer.kind === "vocabulary") {
            return `
              <div class="history-mistake-row">
                <div class="history-mistake-word">
                  <strong class="chinese-text" lang="zh-CN">${escapeHtml(answer.prompt || "")}</strong>
                  <span>${buildToneColoredPinyinMarkup(answer.pinyin || "")}</span>
                </div>
                <p>HSK ${answer.level || 1} vocabulary</p>
                <span>Chose ${escapeHtml(answer.answer || "No answer")} · expected ${escapeHtml(answer.expected || "")}</span>
                <button class="icon-btn" type="button" data-progress-audio="${escapeHtml(answer.prompt || "")}" aria-label="Play ${escapeHtml(answer.prompt || "word")}" title="Play word">${speakerIconMarkup()}</button>
              </div>
            `;
          }
          return `
            <div class="history-mistake-row is-sentence is-grammar">
              <strong class="chinese-text" lang="zh-CN">${buildGrammarPromptMarkup(answer.prompt || "")}</strong>
              <p>HSK ${answer.level || 1} · ${escapeHtml(answer.lessonTitle || answer.pattern || "Grammar")}</p>
              <span>Chose ${escapeHtml(answer.answer || "No answer")} · expected ${escapeHtml(answer.expected || "")}</span>
              <b>Review</b>
            </div>
          `;
        }
        if (record.type === "tone") {
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
              <span>Chose ${escapeHtml(answer.selectedPattern || "No answer")} · expected ${escapeHtml(answer.correctPattern || "")}</span>
              <button class="icon-btn" type="button" data-progress-audio="${escapeHtml(item.zh)}" aria-label="Play ${escapeHtml(item.zh)}" title="Play word">${speakerIconMarkup()}</button>
            </div>
          `;
        }
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
        if (record.type === "grammar") {
          return `
            <div class="history-mistake-row is-sentence is-grammar">
              <strong class="chinese-text" lang="zh-CN">${buildGrammarPromptMarkup(answer.prompt || "")}</strong>
              <p>${escapeHtml(answer.lessonTitle || answer.pattern || "Grammar pattern")}</p>
              <span>Chose ${escapeHtml(answer.answer || "No answer")} · expected ${escapeHtml(answer.expected || "")}</span>
              <b>${answer.correct ? "Correct" : "Review"}</b>
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
  const retry = getHistoryMistakeRetryData(record);
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
          <div>
            <strong>Mistake review</strong>
            <span>${Array.isArray(record.answers) ? record.answers.length : 0} saved answers</span>
          </div>
          ${retry ? `
            <button class="ghost-btn history-retry-btn" type="button" data-history-retry-id="${escapeHtml(record.id || "")}">
              ${escapeHtml(formatMistakePracticeAction(retry.items.length, retry.type === "vocabulary" ? REVIEW_SESSION_LENGTH : retry.items.length))}
            </button>
          ` : ""}
        </div>
        ${buildHistorySessionReviewMarkup(record)}
      </div>
    </details>
  `;
}

function getHistoryTypeFilterLabel(type) {
  const labels = {
    all: "All",
    vocabulary: "Quizzes",
    review: "Review",
    grammar: "Grammar",
    reader: "Reading",
    exam: "Exams",
    pronunciation: "Speaking",
    tone: "Tones",
    map: "Geography",
    drill: "Sentences",
    placement: "Level checks",
  };
  return labels[type] || "Practice";
}

function buildHistoryDataActionsMarkup(canClear) {
  return `
    <div class="history-data-action-wrap">
      <div class="result-actions history-data-actions" aria-label="Learning data">
        <button class="ghost-btn icon-label-btn" type="button" id="exportLearningData">
          ${downloadIconMarkup()}
          <span>Export</span>
        </button>
        <button class="ghost-btn icon-label-btn" type="button" id="restoreLearningData">
          ${uploadIconMarkup()}
          <span>Restore</span>
        </button>
        <button class="ghost-btn icon-label-btn" type="button" id="clearHistory" aria-label="Clear history" title="Clear history" ${canClear ? "" : "disabled"}>
          ${trashIconMarkup()}
          <span>Clear</span>
        </button>
        <input id="learningDataFile" type="file" accept="application/json,.json" tabindex="-1" hidden>
      </div>
      <p class="history-storage-note"><strong>Browser storage</strong> Export a backup before clearing site data.</p>
      <p class="history-data-status" id="learningDataStatus" role="status" aria-live="polite" hidden></p>
    </div>
  `;
}

function bindHistoryDataControls() {
  document.querySelector("#exportLearningData")?.addEventListener("click", exportLearningData);
  document.querySelector("#restoreLearningData")?.addEventListener("click", () => {
    document.querySelector("#learningDataFile")?.click();
  });
  document.querySelector("#learningDataFile")?.addEventListener("change", async (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) {
      return;
    }

    try {
      await restoreLearningDataFile(file);
    } catch (error) {
      setLearningDataStatus(error instanceof Error ? error.message : "This backup could not be restored.", true);
    }
  });
  document.querySelector("#clearHistory")?.addEventListener("click", () => {
    if (!window.confirm("Clear saved practice history and vocabulary review progress from this browser?")) {
      return;
    }
    clearHistoryRecords();
    render();
  });
}

function renderEmptyHistoryHome() {
  const dashboard = getDashboardData();
  const nextActivity = dashboard.nextActivity;
  app.innerHTML = `
    <section class="workspace-panel history-panel history-empty-home">
      <div class="results-header progress-header">
        <div>
          <p class="progress-kicker">Learning record</p>
          <h2>Learning progress</h2>
          <p>Your record begins after the first completed session.</p>
        </div>
        ${buildHistoryDataActionsMarkup(false)}
      </div>

      <section class="history-empty-overview" aria-labelledby="historyEmptyHeading">
        <span class="history-empty-overview-icon" aria-hidden="true">${dashboardActivityIconMarkup(nextActivity.tool)}</span>
        <div>
          <span>Start your learning record</span>
          <h3 id="historyEmptyHeading">Complete ${escapeHtml(nextActivity.title.toLowerCase())}</h3>
          <p>${escapeHtml(nextActivity.detail)} Your result will update Today and establish the first progress trend.</p>
        </div>
        <button class="primary-btn" type="button" id="startHistoryFirstActivity">
          Start next activity ${dashboardArrowIconMarkup()}
        </button>
      </section>

      <section class="history-empty-plan" aria-labelledby="historyEmptyPlanHeading">
        <div class="progress-section-heading">
          <div>
            <h3 id="historyEmptyPlanHeading">Today&rsquo;s plan</h3>
            <p>Three short activities build the first balanced snapshot.</p>
          </div>
          <button class="tool-plan-context-action" type="button" id="viewTodayFromEmptyHistory">View Today ${dashboardArrowIconMarkup()}</button>
        </div>
        <div class="history-empty-plan-list">
          ${dashboard.plan.map((activity, index) => `
            <div class="history-empty-plan-step ${activity.id === nextActivity.id ? "is-next" : ""}">
              <span>${index + 1}</span>
              <i aria-hidden="true">${dashboardActivityIconMarkup(activity.tool)}</i>
              <div><strong>${escapeHtml(activity.title)}</strong><small>${getDashboardActivityMinutes(activity)} min</small></div>
            </div>
          `).join("")}
        </div>
      </section>
    </section>
  `;
  bindHistoryDataControls();
  document.querySelector("#startHistoryFirstActivity")?.addEventListener("click", () => {
    launchDashboardActivity(nextActivity.tool, nextActivity.mode || "");
  });
  document.querySelector("#viewTodayFromEmptyHistory")?.addEventListener("click", openTodayDashboard);
}

function renderHistoryHome() {
  const history = loadHistoryRecords();
  const historyById = new Map(history.map((record) => [record.id, record]));
  const review = getReviewDashboardData();
  if (!history.length && !review.totalTracked) {
    renderEmptyHistoryHome();
    return;
  }
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
  const availableHistoryTypes = [...new Set(history.map((record) => record.type))];
  if (state.historyTypeFilter !== "all" && !availableHistoryTypes.includes(state.historyTypeFilter)) {
    state.historyTypeFilter = "all";
  }
  const filteredHistory = state.historyTypeFilter === "all"
    ? history
    : history.filter((record) => record.type === state.historyTypeFilter);
  const recentSessions = filteredHistory.length
    ? filteredHistory.slice(0, PROGRESS_RECENT_SESSION_LIMIT).map(buildHistorySessionMarkup).join("")
    : `
      <div class="history-empty-state">
        <strong>No ${escapeHtml(getHistoryTypeFilterLabel(state.historyTypeFilter).toLowerCase())} sessions yet</strong>
        <p>Choose another activity type or complete a new session.</p>
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
        ${buildHistoryDataActionsMarkup(history.length || review.totalTracked)}
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
          <span>${filteredHistory.length} shown</span>
        </div>
        ${availableHistoryTypes.length > 1 ? `
          <div class="history-type-filters" role="group" aria-label="Filter recent sessions">
            ${["all", ...availableHistoryTypes].map((type) => `
              <button type="button" data-history-filter="${escapeHtml(type)}" aria-pressed="${state.historyTypeFilter === type}" class="${state.historyTypeFilter === type ? "active" : ""}">
                ${escapeHtml(getHistoryTypeFilterLabel(type))}
              </button>
            `).join("")}
          </div>
        ` : ""}
        <div class="history-session-list">${recentSessions}</div>
      </section>
    </section>
  `;

  bindHistoryDataControls();
  document.querySelectorAll("[data-history-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.historyTypeFilter = button.dataset.historyFilter || "all";
      render();
    });
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
  document.querySelectorAll("[data-history-retry-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const record = historyById.get(button.dataset.historyRetryId);
      if (record) {
        startHistoryMistakeRetry(record);
      }
    });
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
  if (state.session?.type === "reader") {
    renderReaderQuiz();
    return;
  }

  if (state.session?.type === "exam") {
    renderHskExamSession();
    return;
  }

  if (state.session?.type === "exam-speaking") {
    renderHskSpeakingSession();
    return;
  }

  if (state.session?.type === "review") {
    renderReviewSession();
    return;
  }

  if (state.session?.type === "vocabulary") {
    renderVocabularySession();
    return;
  }

  if (state.session?.type === "grammar") {
    renderGrammarSession();
    return;
  }

  if (state.session?.type === "placement") {
    renderPlacementSession();
    return;
  }

  if (state.session?.type === "pronunciation") {
    renderPronunciationSession();
    return;
  }

  if (state.session?.type === "tone") {
    renderToneListeningSession();
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
    <section class="workspace-panel session-shell pronunciation-session speaking-session">
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

function renderToneListeningSession() {
  const session = state.session;
  const current = session.items[session.index];
  const assessment = session.currentAssessment;
  const choices = getToneChoiceSet(session, session.index);
  const answeredCount = session.answers.length;
  const correctCount = session.answers.filter((answer) => answer.correct).length;
  const progressPercent = Math.round((answeredCount / session.items.length) * 100);
  const nextLabel = session.index + 1 === session.items.length ? "View results" : "Next word";

  app.innerHTML = `
    <section class="workspace-panel session-shell pronunciation-session tone-listening-session">
      <div class="progress-row">
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        <span class="progress-label">Word ${session.index + 1} of ${session.items.length} · ${correctCount} correct</span>
      </div>

      <div class="tone-listening-layout">
        <div class="tone-prompt-panel">
          <span class="sentence-label">Listen for the tones</span>
          <div class="audio-sentence tone-audio-controls">
            <button class="secondary-btn shortcut-btn" type="button" id="playToneWord">
              <span>Play word</span>
              ${shortcutHint("Enter", { commandControl: true })}
            </button>
            ${buildAudioAnswerStatusMarkup(assessment)}
            <span class="sound-indicator ${state.isSpeaking ? "active" : ""}" id="soundIndicator" aria-live="polite">
              <span class="sound-bars" aria-hidden="true"><span></span><span></span><span></span></span>
              Playing
            </span>
          </div>
          ${assessment ? buildToneAnswerRevealMarkup(current, assessment) : `<div class="tone-word-concealment" aria-label="Word hidden until answered"><span></span><span></span><span></span></div>`}
          ${assessment ? `
            <button class="primary-btn shortcut-btn tone-next-btn" type="button" id="nextQuestion">
              <span>${nextLabel}</span>
              ${shortcutHint("Enter")}
            </button>
          ` : ""}
          <button class="ghost-btn tone-end-btn" type="button" id="endSession">End session</button>
        </div>

        <div class="tone-response-panel ${assessment ? "is-answered" : ""}">
          ${buildToneChoiceMarkup(choices, assessment)}
        </div>
      </div>
    </section>
  `;

  document.querySelector("#playToneWord").addEventListener("click", () => speak(current.zh, { immediate: true }));
  document.querySelector("#endSession").addEventListener("click", finishSessionEarly);
  document.querySelector("#nextQuestion")?.addEventListener("click", nextQuestion);
  document.querySelectorAll("[data-tone-choice-id]").forEach((button) => {
    button.addEventListener("click", () => submitToneChoice(button.dataset.toneChoiceId));
  });
}

function buildToneChoiceMarkup(choices, assessment = null) {
  return `
    <div class="choice-grid tone-choice-grid" role="group" aria-label="Tone pattern choices">
      ${choices.map((choice) => {
        const selected = assessment?.choiceId === choice.id;
        const classes = [
          "choice-option",
          "tone-choice-option",
          selected ? "selected" : "",
          assessment && choice.correct ? "correct" : "",
          assessment && selected && !choice.correct ? "incorrect" : "",
          assessment && selected && choice.correct ? "correct-celebration" : "",
        ].filter(Boolean).join(" ");

        return `
          <button class="${classes}" type="button" data-tone-choice-id="${escapeHtml(choice.id)}" ${assessment ? "disabled" : ""}>
            <span class="choice-key">${escapeHtml(choice.shortcut)}</span>
            <span class="tone-choice-text">
              <strong>${buildToneColoredPinyinMarkup(choice.pinyin)}</strong>
              <span>${escapeHtml(formatTonePattern(choice.tones))}</span>
            </span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function buildToneAnswerRevealMarkup(item, assessment) {
  return `
    <div class="tone-answer-reveal ${assessment.correct ? "correct-celebration" : ""}" role="status" aria-live="polite">
      <div class="tone-answer-word">
        <strong class="chinese-text" lang="zh-CN">${buildVocabularyWordLink(item)}</strong>
        <span>${buildToneColoredPinyinMarkup(item.pinyin)}</span>
      </div>
      <p>${escapeHtml(formatVocabularyMeanings(item))}</p>
      <span class="tone-answer-pattern">Tone pattern <strong>${escapeHtml(formatTonePattern(getTonePattern(item)))}</strong></span>
    </div>
  `;
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

function scrollToneListeningSessionIntoView() {
  if (!window.matchMedia?.("(max-width: 980px)").matches) {
    return;
  }
  const target = document.querySelector(".tone-listening-session");
  if (!target) {
    return;
  }
  const scrollToSession = () => target.scrollIntoView({ block: "start", behavior: "auto" });
  scrollToSession();
  window.requestAnimationFrame?.(scrollToSession);
  window.setTimeout?.(scrollToSession, 100);
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
  const isMistakeRetry = result.source === "mistakes";
  const missedItems = getMissedSentenceDrillItems(result);
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
          <h2>${isSavedSentenceSession ? "Saved Sentence Results" : isMistakeRetry ? "Mistake Retry Results" : `${MODES[result.mode].label} Results`}</h2>
          <p>${correct} correct out of ${result.answers.length}; average score ${percent}%.</p>
        </div>
        <div class="result-actions">
          ${missedItems.length ? `
            <button class="primary-btn" type="button" id="retrySentenceMistakes">
              Review ${missedItems.length} ${missedItems.length === 1 ? "mistake" : "mistakes"}
            </button>
          ` : ""}
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>${isSavedSentenceSession ? "Practice saved again" : isMistakeRetry ? "Practice this set again" : "Start another session"}</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">${isSavedSentenceSession ? "Back to sentence library" : "Back to sentence drills"}</button>
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

  document.querySelector("#retrySentenceMistakes")?.addEventListener("click", () => startSentenceMistakeRetry(result));
  document.querySelector("#restartSession").addEventListener("click", isSavedSentenceSession
    ? startSavedSentenceSession
    : isMistakeRetry
      ? () => startSentenceDrillItems(result.answers.map((answer) => answer.item), "mistakes")
      : startSession);
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

function renderToneListeningResults() {
  const result = state.result;
  const correct = result.answers.filter((answer) => answer.correct).length;
  const total = result.answers.length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const weaknesses = getToneListeningWeaknessStats(result.answers);
  const rows = result.answers.map((answer, index) => `
    <tr class="${answer.correct ? "found" : "missed"}">
      <td>${index + 1}</td>
      <td class="chinese-text">${buildVocabularyWordLink(answer.item)}</td>
      <td>${buildToneColoredPinyinMarkup(answer.item.pinyin)}</td>
      <td>${escapeHtml(answer.selectedPattern || formatTonePattern(answer.selectedTones))}</td>
      <td>${escapeHtml(answer.correctPattern || formatTonePattern(getTonePattern(answer.item)))}</td>
      <td>${escapeHtml(formatVocabularyMeanings(answer.item))}</td>
      <td class="${answer.correct ? "status-good" : "status-review"}">${answer.correct ? "Correct" : "Review"}</td>
    </tr>
  `).join("");

  app.innerHTML = `
    <section class="workspace-panel tone-listening-results">
      <div class="results-header">
        <div>
          <h2>Tone Listening Results</h2>
          <p>${correct} of ${total} tone patterns identified correctly.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>Start another session</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">Back to practice</button>
        </div>
      </div>

      <div class="stat-grid tone-result-stats">
        <div class="stat">
          <strong>${percent}%</strong>
          <span>Tone accuracy</span>
        </div>
        <div class="stat">
          <strong>${correct}/${total}</strong>
          <span>Correct</span>
        </div>
        <div class="stat">
          <strong>${formatTimer(result.elapsedSeconds || 0)}</strong>
          <span>Session time</span>
        </div>
      </div>

      <section class="pronunciation-breakdown tone-breakdown">
        <div class="vocab-section-heading">
          <h3>Focus Areas</h3>
          <span>Based on the tone patterns you confused</span>
        </div>
        <div class="pronunciation-breakdown-grid tone-breakdown-grid">
          ${buildPronunciationWeaknessCard("Tones to revisit", weaknesses.tones.slice(0, 5), "No missed tones")}
          ${buildPronunciationWeaknessCard("Patterns to revisit", weaknesses.patterns.slice(0, 5), "No missed patterns")}
        </div>
      </section>

      <div class="results-table-wrap tone-results-table" tabindex="0">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Word</th>
              <th>Pinyin</th>
              <th>Your pattern</th>
              <th>Expected</th>
              <th>Meaning</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  document.querySelector("#restartSession").addEventListener("click", startToneListeningSession);
  document.querySelector("#backToModes").addEventListener("click", () => {
    state.result = null;
    state.session = null;
    state.pronunciationView = "tone";
    saveSettings();
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
          <h2>Geography Results</h2>
          <p>${escapeHtml(mapMode.label)}: ${correct} correct out of ${total}; ${percent}% location accuracy.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>Start another quiz</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">Back to Geography of China</button>
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
  const mistakeReviewItems = getMissedVocabularyReviewItems(result);
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
          ${mistakeReviewItems.length ? `
            <button class="primary-btn" type="button" id="reviewVocabularyMistakes">
              ${escapeHtml(formatMistakePracticeAction(mistakeReviewItems.length))}
            </button>
          ` : ""}
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

  document.querySelector("#reviewVocabularyMistakes")?.addEventListener("click", () => startVocabularyMistakeReview(result));
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
  const mistakeReviewItems = getMissedVocabularyReviewItems(result);
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
          ${mistakeReviewItems.length ? `
            <button class="primary-btn" type="button" id="reviewVocabularyMistakes">
              ${escapeHtml(formatMistakePracticeAction(mistakeReviewItems.length))}
            </button>
          ` : ""}
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

  document.querySelector("#reviewVocabularyMistakes")?.addEventListener("click", () => startVocabularyMistakeReview(result));
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

function getToneListeningPool(vocabulary = getAllVocabularyReviewItems()) {
  return vocabulary.filter(isReliableToneListeningItem);
}

function isReliableToneListeningItem(item) {
  const normalized = normalizePinyinForCompare(item?.numeric || item?.pinyin || "");
  const syllables = splitPinyinSyllables(normalized);
  const tones = syllables.map((syllable) => syllable.match(/([1-5])$/)?.[1] || "");
  const hanCount = countHanCharacters(item?.zh || "");

  if (
    syllables.length < 1 ||
    syllables.length > 3 ||
    hanCount < 1 ||
    hanCount > 4 ||
    tones.some((tone) => !tone) ||
    (item?.numericAlternates || []).length
  ) {
    return false;
  }

  if (syllables.length > 1 && /[一不]/.test(item.zh || "")) {
    return false;
  }

  return !tones.some((tone, index) => tone === "3" && tones[index + 1] === "3");
}

function getTonePattern(item) {
  return splitPinyinSyllables(normalizePinyinForCompare(item?.numeric || item?.pinyin || ""))
    .map((syllable) => syllable.match(/([1-5])$/)?.[1] || "5");
}

function formatTonePattern(tones) {
  return (tones || []).join("–");
}

function getToneChoiceSet(session, index) {
  if (session?.type !== "tone" || index < 0 || index >= session.items.length) {
    return [];
  }
  if (!(session.choiceSets instanceof Map)) {
    session.choiceSets = new Map();
  }
  if (!session.choiceSets.has(index)) {
    session.choiceSets.set(index, buildToneChoiceSet(session.items[index], index));
  }
  return session.choiceSets.get(index);
}

function buildToneChoiceSet(item, index = 0) {
  const correctTones = getTonePattern(item);
  if (!correctTones.length) {
    return [];
  }

  const alternatives = [];
  correctTones.forEach((correctTone, toneIndex) => {
    ["1", "2", "3", "4", "5"].forEach((tone) => {
      if (tone === correctTone) {
        return;
      }
      const next = [...correctTones];
      next[toneIndex] = tone;
      alternatives.push(next);
    });
  });

  const seen = new Set();
  const wrongPatterns = shuffle(alternatives).filter((tones) => {
    const key = tones.join("-");
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  }).slice(0, 4);

  return shuffle([
    { tones: correctTones, correct: true },
    ...wrongPatterns.map((tones) => ({ tones, correct: false })),
  ]).map((choice, choiceIndex) => ({
    ...choice,
    id: `tone-choice-${index}-${choiceIndex}`,
    pinyin: buildPinyinForTonePattern(item, choice.tones),
    shortcut: String(choiceIndex + 1),
  }));
}

function buildPinyinForTonePattern(item, tones) {
  const syllables = splitPinyinSyllables(normalizePinyinForCompare(item?.numeric || item?.pinyin || ""));
  return syllables.map((syllable, index) => applyToneToPinyinSyllable(syllable, tones[index] || "5")).join(" ");
}

function applyToneToPinyinSyllable(syllable, tone) {
  const toneNumber = clamp(Number(tone) || 5, 1, 5);
  const base = String(syllable || "")
    .toLowerCase()
    .replace(/[1-5]$/, "")
    .replace(/v/g, "ü");
  if (toneNumber === 5 || !base) {
    return base;
  }

  if ((base === "m" || base === "n") && PINYIN_VOWEL_TONE_MARKS[base]?.[toneNumber]) {
    return PINYIN_VOWEL_TONE_MARKS[base][toneNumber];
  }

  let markIndex = base.indexOf("a");
  if (markIndex < 0) {
    markIndex = base.indexOf("e");
  }
  if (markIndex < 0 && base.includes("ou")) {
    markIndex = base.indexOf("o");
  }
  if (markIndex < 0) {
    for (let index = base.length - 1; index >= 0; index -= 1) {
      if (PINYIN_VOWEL_TONE_MARKS[base[index]]) {
        markIndex = index;
        break;
      }
    }
  }
  if (markIndex < 0) {
    return base;
  }

  const vowel = base[markIndex];
  const marked = PINYIN_VOWEL_TONE_MARKS[vowel]?.[toneNumber] || vowel;
  return `${base.slice(0, markIndex)}${marked}${base.slice(markIndex + 1)}`;
}

function getToneListeningWeaknessStats(answers = []) {
  const tones = new Map();
  const patterns = new Map();

  answers.filter((answer) => !answer.correct).forEach((answer) => {
    const expected = answer.correctTones || getTonePattern(answer.item);
    const selected = answer.selectedTones || [];
    expected.forEach((tone, index) => {
      if (tone !== selected[index]) {
        incrementMapCount(tones, tone === "5" ? "Neutral tone" : `Tone ${tone}`);
      }
    });
    incrementMapCount(patterns, formatTonePattern(expected));
  });

  return {
    tones: mapCountsToSortedItems(tones),
    patterns: mapCountsToSortedItems(patterns),
  };
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
  if (typeof item?.reviewKey === "string" && item.reviewKey.trim()) {
    return item.reviewKey.trim();
  }
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

function buildReviewQueue(
  progress = ensureReviewProgress(),
  now = Date.now(),
  vocabulary = getAllVocabularyReviewItems(),
  targetLevel = state.studyTargetLevel,
) {
  const due = [];
  const unseen = [];
  const upcoming = [];
  const normalizedTargetLevel = [1, 2, 3].includes(Number(targetLevel)) ? Number(targetLevel) : 1;

  vocabulary.forEach((item, sourceIndex) => {
    const record = progress[reviewItemKey(item)];
    if (!record) {
      if (Number(getVocabularySetMeta(item).levelNumber) !== normalizedTargetLevel) {
        return;
      }
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
    if (!state.onboardingComplete || state.planSetupOpen) {
      completeStudyPlanSetup();
      return;
    }
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

  if (state.tool === "grammar") {
    startGrammarSession(state.grammarLessonId || "");
    return;
  }

  if (state.tool === "reader") {
    if (state.readerId) {
      startReaderQuiz(state.readerId);
    }
    return;
  }

  if (state.tool === "exam") {
    if (state.examScreen === "ready") {
      if (state.examMode === "speaking") {
        startHskSpeakingExam();
      } else {
        startHskExam(state.examLevel);
      }
    } else {
      state.examScreen = "ready";
      render();
    }
    return;
  }

  if (state.tool === "pronunciation") {
    startActivePronunciationSession();
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

async function startSavedSentenceSession({ allLevels = false } = {}) {
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
  const levels = allLevels ? new Set() : state.selectedLevels;
  const items = shuffle(getSavedSentenceItems(SENTENCES, savedIds, levels))
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

function getMissedSentenceDrillItems(result) {
  if (result?.type !== "drill") {
    return [];
  }

  return (result.answers || [])
    .filter((answer) => !answer.correct && answer.item?.zh && answer.item?.en)
    .map((answer) => answer.item);
}

function startSentenceMistakeRetry(result = state.result) {
  const items = getMissedSentenceDrillItems(result);
  if (!items.length) {
    return;
  }

  state.tool = "drill";
  state.mode = result.mode;
  state.drillView = "practice";
  saveSettings();
  startSentenceDrillItems(items, "mistakes");
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

function startActivePronunciationSession() {
  if (state.pronunciationView === "tone") {
    startToneListeningSession();
    return;
  }
  startPronunciationSession();
}

function startToneListeningSession() {
  if (!supportsSpeechSynthesis()) {
    state.dataError = "Speech playback is not available in this browser.";
    render();
    return;
  }

  stopPronunciationRecognition();
  stopSpeech();
  const items = shuffle(getToneListeningPool()).slice(0, TONE_LISTENING_SESSION_LENGTH);
  if (items.length < TONE_LISTENING_SESSION_LENGTH) {
    state.dataError = "There are not enough unambiguous HSK words for tone practice.";
    render();
    return;
  }

  state.dataError = "";
  state.result = null;
  state.session = {
    type: "tone",
    items,
    index: 0,
    answers: [],
    choiceSets: new Map(),
    currentAssessment: null,
    startedAt: Date.now(),
  };
  saveSettings();
  render();
  scrollToneListeningSessionIntoView();
  speak(items[0].zh, { immediate: true });
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

function getMissedVocabularyReviewItems(result) {
  if (result?.type !== "vocabulary") {
    return [];
  }

  const foundIds = new Set(result.foundIds || []);
  const answersByIndex = new Map((result.answers || []).map((answer) => [answer.itemIndex, answer]));
  return (result.items || []).flatMap((item, index) => {
    const correct = result.quizMode === "pinyin"
      ? foundIds.has(vocabularyItemId(item, index))
      : Boolean(answersByIndex.get(index)?.correct);
    return correct ? [] : [{
      ...item,
      reviewMode: result.quizMode === "meaning" ? "meaning" : "pinyin",
    }];
  });
}

function formatMistakePracticeAction(count, limit = REVIEW_SESSION_LENGTH) {
  const practiceCount = Math.min(count, limit);
  if (practiceCount < count) {
    return `Review ${practiceCount} of ${count} mistakes`;
  }
  return `Review ${count} ${count === 1 ? "mistake" : "mistakes"}`;
}

function startVocabularyMistakeReview(result = state.result) {
  const items = getMissedVocabularyReviewItems(result).slice(0, REVIEW_SESSION_LENGTH);
  if (!items.length) {
    return;
  }

  state.tool = "review";
  saveSettings();
  startReviewItems(items, "mistakes", {
    setId: result.setId,
    setLabel: result.setLabel,
  });
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

function submitToneChoiceByShortcut(shortcut) {
  const session = state.session;
  if (session?.type !== "tone" || session.currentAssessment) {
    return;
  }
  const choice = getToneChoiceSet(session, session.index).find((option) => option.shortcut === shortcut);
  if (choice) {
    submitToneChoice(choice.id);
  }
}

function submitToneChoice(choiceId) {
  const session = state.session;
  const item = session?.items?.[session.index];
  if (session?.type !== "tone" || !item || session.currentAssessment) {
    return;
  }
  const choice = getToneChoiceSet(session, session.index).find((option) => option.id === choiceId);
  if (!choice) {
    return;
  }

  const scrollPosition = getScrollPosition();

  const correctTones = getTonePattern(item);
  const assessment = {
    choiceId: choice.id,
    answer: choice.pinyin,
    selectedPinyin: choice.pinyin,
    selectedTones: [...choice.tones],
    correctTones,
    selectedPattern: formatTonePattern(choice.tones),
    correctPattern: formatTonePattern(correctTones),
    score: choice.correct ? 1 : 0,
    correct: choice.correct,
  };
  session.currentAssessment = assessment;
  session.answers.push({ ...assessment, item, itemIndex: session.index });
  stopSpeech();
  render();
  restoreScrollPosition(scrollPosition);
}

function nextQuestion() {
  const session = state.session;
  const sessionLength = session.items.length;

  if (session.type === "reader") {
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
    render();
    return;
  }

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

  if (session.type === "tone") {
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
    scrollToneListeningSessionIntoView();
    speak(session.items[session.index].zh, { immediate: true });
    return;
  }

  if (session.type === "placement") {
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
    render();
    scrollPlacementQuestionIntoView();
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
  if (session.type === "reader") {
    return {
      type: "reader",
      readerId: session.readerId,
      level: session.level,
      title: session.title,
      items: session.items,
      answers: session.answers,
      elapsedSeconds: Math.max(0, Math.round((Date.now() - session.startedAt) / 1000)),
      total: session.items.length,
    };
  }

  if (session.type === "placement") {
    return {
      type: "placement",
      items: session.items,
      answers: session.answers,
      elapsedSeconds: Math.max(0, Math.round((Date.now() - session.startedAt) / 1000)),
      total: session.items.length,
    };
  }

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

  if (session.type === "grammar") {
    return {
      type: "grammar",
      scope: session.scope || "mixed",
      lessonId: session.lessonId || "",
      level: session.level || 1,
      items: session.items,
      answers: session.answers,
      elapsedSeconds: Math.max(0, Math.round((Date.now() - session.startedAt) / 1000)),
      total: session.items.length,
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

  if (session.type === "tone") {
    return {
      type: "tone",
      items: session.items,
      answers: session.answers,
      elapsedSeconds: Math.max(0, Math.round((Date.now() - session.startedAt) / 1000)),
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
    result.historyRecordId = record.id;
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

  if (result.type === "exam") {
    if (result.examMode === "speaking") {
      return {
        id,
        type: "exam",
        examMode: "speaking",
        level: result.level || 3,
        completedAt,
        total: result.total || result.answers.length,
        recorded: result.recorded || 0,
        correct: result.recorded || 0,
        elapsedSeconds: result.elapsedSeconds || 0,
        finishReason: result.finishReason || "submitted",
        answers: result.answers.map((answer, index) => ({
          index,
          prompt: answer.item.prompt || answer.item.modelAnswer || "Picture description",
          partLabel: answer.item.partLabel || "Speaking",
          recorded: Boolean(answer.recorded),
          correct: Boolean(answer.recorded),
          score: answer.recorded ? 1 : 0,
        })),
      };
    }

    const stats = getHskExamResultStats(result);
    return {
      id,
      type: "exam",
      examMode: "written",
      level: result.level || 1,
      completedAt,
      total: stats.total,
      answered: stats.answered,
      correct: stats.correct,
      scaledScore: stats.scaledScore,
      maxScore: stats.maxScore,
      elapsedSeconds: result.elapsedSeconds || 0,
      finishReason: result.finishReason || "submitted",
      sections: stats.sections.map((examSection) => ({
        id: examSection.id,
        label: examSection.label,
        correct: examSection.correct,
        total: examSection.total,
        scaledScore: examSection.scaledScore,
        parts: examSection.parts.map((examPart) => ({
          id: examPart.id,
          label: examPart.label,
          correct: examPart.correct,
          total: examPart.total,
        })),
      })),
      answers: result.answers.map((answer, index) => ({
        index,
        questionId: answer.item.id,
        prompt: answer.item.audio || answer.item.prompt || "",
        skill: answer.item.skill,
        skillLabel: answer.item.sectionLabel,
        partId: answer.item.partId,
        partLabel: answer.item.partLabel,
        answer: answer.answer,
        expected: answer.expected,
        answered: answer.answered,
        estimated: answer.estimated,
        correct: answer.correct,
        score: answer.score,
      })),
    };
  }

  if (result.type === "reader") {
    const correct = result.answers.filter((answer) => answer.correct).length;
    return {
      id,
      type: "reader",
      readerId: result.readerId,
      level: result.level || 1,
      title: result.title || "Graded reader",
      completedAt,
      total: result.answers.length,
      correct,
      elapsedSeconds: result.elapsedSeconds || 0,
      answers: result.answers.map((answer, index) => ({
        index,
        questionId: answer.item.id,
        prompt: answer.item.prompt,
        answer: answer.answer,
        expected: answer.expected,
        explanation: answer.item.explanation || "",
        correct: Boolean(answer.correct),
        score: answer.correct ? 1 : 0,
      })),
    };
  }

  if (result.type === "placement") {
    const correct = result.answers.filter((answer) => answer.correct).length;
    const recommendation = getPlacementRecommendation(result);
    const stats = getPlacementResultStats(result);
    return {
      id,
      type: "placement",
      completedAt,
      total: result.answers.length,
      correct,
      elapsedSeconds: result.elapsedSeconds || 0,
      recommendedLevel: recommendation.level,
      recommendationBand: recommendation.band,
      levelScores: {
        1: { correct: stats.levels[1].correct, total: stats.levels[1].total },
        2: { correct: stats.levels[2].correct, total: stats.levels[2].total },
        3: { correct: stats.levels[3].correct, total: stats.levels[3].total },
      },
      answers: result.answers.map((answer, index) => ({
        index,
        questionId: answer.item.id,
        kind: answer.item.kind,
        level: answer.item.level,
        prompt: answer.item.prompt,
        translation: answer.item.translation,
        pinyin: answer.item.pinyin || "",
        lessonTitle: answer.item.lessonTitle || "",
        pattern: answer.item.lessonPattern || "",
        answer: answer.answer || "",
        expected: answer.item.answer,
        explanation: answer.item.explanation,
        correct: Boolean(answer.correct),
        score: answer.correct ? 1 : 0,
      })),
    };
  }

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

  if (result.type === "grammar") {
    const lesson = getGrammarLessonById(result.lessonId);
    const correct = result.answers.filter((answer) => answer.correct).length;
    return {
      id,
      type: "grammar",
      scope: result.scope || "mixed",
      lessonId: result.lessonId || "",
      lessonTitle: lesson?.title || "",
      level: result.level || 1,
      completedAt,
      total: result.answers.length,
      correct,
      elapsedSeconds: result.elapsedSeconds || 0,
      answers: result.answers.map((answer, index) => ({
        index,
        questionId: answer.item.id,
        lessonId: answer.item.lessonId,
        lessonTitle: answer.item.lessonTitle,
        pattern: answer.item.lessonPattern,
        prompt: answer.item.prompt,
        translation: answer.item.translation,
        answer: answer.answer || "",
        expected: answer.item.answer,
        explanation: answer.item.explanation,
        correct: Boolean(answer.correct),
        score: answer.correct ? 1 : 0,
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

  if (result.type === "tone") {
    const correct = result.answers.filter((answer) => answer.correct).length;
    const weaknesses = getToneListeningWeaknessStats(result.answers);
    return {
      id,
      type: "tone",
      completedAt,
      total: result.answers.length,
      correct,
      elapsedSeconds: result.elapsedSeconds || 0,
      weaknesses,
      answers: result.answers.map((answer, index) => ({
        index,
        zh: answer.item.zh,
        pinyin: answer.item.pinyin,
        meaning: formatVocabularyMeanings(answer.item),
        selectedPinyin: answer.selectedPinyin || "",
        selectedPattern: answer.selectedPattern || formatTonePattern(answer.selectedTones),
        correctPattern: answer.correctPattern || formatTonePattern(getTonePattern(answer.item)),
        correct: Boolean(answer.correct),
        score: answer.correct ? 1 : 0,
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
      id: answer.item.id || "",
      zh: answer.item.zh,
      en: answer.item.en,
      level: answer.item.level || "",
      source: answer.item.source || "",
      sourceId: answer.item.sourceId || "",
      translationId: answer.item.translationId || "",
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

function getHistoryMistakeRetryData(record) {
  const mistakes = Array.isArray(record?.answers)
    ? record.answers.filter((answer) => answer.correct === false)
    : [];
  if (!mistakes.length) {
    return null;
  }

  if (record.type === "grammar") {
    const questionById = new Map(
      [1, 2, 3].flatMap((level) => getGrammarQuestionPool("", level)).map((question) => [question.id, question]),
    );
    const items = mistakes.flatMap((answer) => {
      const question = questionById.get(answer.questionId);
      if (!question) {
        return [];
      }
      return [{
        ...question,
        choices: shuffle(question.options).map((text, choiceIndex) => ({
          id: `${question.id}-retry-${choiceIndex}`,
          text,
          correct: text === question.answer,
          shortcut: String(choiceIndex + 1),
        })),
      }];
    });
    return items.length ? { type: "grammar", items, level: record.level || items[0].level || 1 } : null;
  }

  if (["vocabulary", "review"].includes(record.type)) {
    const itemsByKey = new Map();
    mistakes.forEach((answer) => {
      if (!answer.zh || !answer.pinyin) {
        return;
      }
      const item = {
        zh: answer.zh,
        pinyin: answer.pinyin,
        meanings: String(answer.meaning || "").split(";").map((meaning) => meaning.trim()).filter(Boolean),
        reviewMode: answer.reviewMode || (record.quizMode === "meaning" ? "meaning" : "pinyin"),
      };
      itemsByKey.set(reviewItemKey(item), item);
    });
    const items = [...itemsByKey.values()];
    return items.length ? { type: "vocabulary", items } : null;
  }

  if (record.type !== "drill" || !MODES[record.mode]) {
    return null;
  }

  const items = mistakes.flatMap((answer, index) => {
    const zh = answer.zh || (record.mode === "writing" ? answer.expected : record.mode === "reading" ? answer.prompt : "");
    const en = answer.en || (record.mode === "writing" ? answer.prompt : record.mode === "reading" ? answer.expected : "");
    if (!zh || !en || zh === "Audio sentence") {
      return [];
    }
    return [{
      id: answer.id || `history-${record.id || "session"}-${index}`,
      zh,
      en,
      level: answer.level || record.levels?.[0] || "beginner",
      source: answer.source || "History",
      sourceId: answer.sourceId || "",
      translationId: answer.translationId || "",
    }];
  });
  return items.length ? { type: "drill", items, mode: record.mode } : null;
}

function startHistoryMistakeRetry(record) {
  const retry = getHistoryMistakeRetryData(record);
  if (!retry) {
    return;
  }

  if (retry.type === "vocabulary") {
    state.tool = "review";
    saveSettings();
    startReviewItems(retry.items.slice(0, REVIEW_SESSION_LENGTH), "mistakes", {
      setId: record.setId || "",
      setLabel: record.setLabel || "Mistakes from History",
    });
    return;
  }

  if (retry.type === "grammar") {
    state.tool = "grammar";
    saveSettings();
    startGrammarItems(retry.items, { scope: "mistakes", level: retry.level });
    return;
  }

  state.tool = "drill";
  state.mode = retry.mode;
  state.drillView = "practice";
  saveSettings();
  startSentenceDrillItems(retry.items, "mistakes");
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

function buildLearningBackup(now = Date.now()) {
  const exportedAt = new Date(now);
  return {
    app: LEARNING_BACKUP_APP_ID,
    version: LEARNING_BACKUP_VERSION,
    exportedAt: exportedAt.toISOString(),
    data: {
      settings: readStoredJson(SETTINGS_KEY, {}),
      history: readStoredJson(HISTORY_KEY, []),
      reviewProgress: readStoredJson(REVIEW_PROGRESS_KEY, {}),
      savedVocabulary: readStoredJson(SAVED_VOCABULARY_KEY, []),
      savedSentences: readStoredJson(SAVED_SENTENCES_KEY, []),
    },
  };
}

function readStoredJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeLearningBackup(backup) {
  if (!isPlainRecord(backup) || backup.app !== LEARNING_BACKUP_APP_ID) {
    throw new Error("Choose a Mandarin Trainer backup file.");
  }
  if (backup.version !== LEARNING_BACKUP_VERSION) {
    throw new Error("This backup version is not supported yet.");
  }
  if (!isPlainRecord(backup.data)) {
    throw new Error("This backup is missing its learning data.");
  }

  const settings = isPlainRecord(backup.data.settings) ? backup.data.settings : null;
  const history = Array.isArray(backup.data.history)
    ? backup.data.history.filter((record) => isPlainRecord(record) && SUPPORTED_HISTORY_TYPES.has(record.type)).slice(0, HISTORY_LIMIT)
    : null;
  const reviewProgress = sanitizeReviewProgressBackup(backup.data.reviewProgress);
  const savedVocabulary = sanitizeStringArrayBackup(backup.data.savedVocabulary);
  const savedSentences = sanitizeStringArrayBackup(backup.data.savedSentences);
  if (!settings || !history || !reviewProgress || !savedVocabulary || !savedSentences) {
    throw new Error("This backup has invalid or incomplete learning data.");
  }

  const exportedAt = new Date(backup.exportedAt);
  return {
    app: LEARNING_BACKUP_APP_ID,
    version: LEARNING_BACKUP_VERSION,
    exportedAt: Number.isNaN(exportedAt.getTime()) ? new Date(0).toISOString() : exportedAt.toISOString(),
    data: {
      settings,
      history,
      reviewProgress,
      savedVocabulary,
      savedSentences,
    },
  };
}

function sanitizeReviewProgressBackup(value) {
  if (!isPlainRecord(value)) {
    return null;
  }
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, record]) => typeof key === "string" && key && isPlainRecord(record))
      .slice(0, 5000),
  );
}

function sanitizeStringArrayBackup(value) {
  if (!Array.isArray(value)) {
    return null;
  }
  return uniqueStrings(value.filter((item) => typeof item === "string" && item).slice(0, 5000));
}

function isPlainRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function applyLearningBackup(backup) {
  const normalized = normalizeLearningBackup(backup);
  const valuesByKey = new Map([
    [SETTINGS_KEY, JSON.stringify(normalized.data.settings)],
    [HISTORY_KEY, JSON.stringify(normalized.data.history)],
    [REVIEW_PROGRESS_KEY, JSON.stringify(normalized.data.reviewProgress)],
    [SAVED_VOCABULARY_KEY, JSON.stringify(normalized.data.savedVocabulary)],
    [SAVED_SENTENCES_KEY, JSON.stringify(normalized.data.savedSentences)],
  ]);
  const previousValues = new Map([...valuesByKey.keys()].map((key) => [key, localStorage.getItem(key)]));

  try {
    valuesByKey.forEach((value, key) => localStorage.setItem(key, value));
  } catch (error) {
    previousValues.forEach((value, key) => {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    });
    throw error;
  }

  return normalized;
}

function exportLearningData() {
  const backup = normalizeLearningBackup(buildLearningBackup());
  const blob = new Blob([`${JSON.stringify(backup, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `chinese-trainer-backup-${backup.exportedAt.slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  setLearningDataStatus("Backup downloaded.");
}

async function restoreLearningDataFile(file) {
  if (Number(file?.size) > LEARNING_BACKUP_MAX_BYTES) {
    throw new Error("This backup file is too large.");
  }

  let parsed;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error("This file is not valid JSON.");
  }
  const normalized = normalizeLearningBackup(parsed);
  const dateLabel = formatBackupDate(normalized.exportedAt);
  if (!window.confirm(`Restore the backup from ${dateLabel}? This will replace learning data in this browser.`)) {
    return false;
  }

  applyLearningBackup(normalized);
  window.location.reload();
  return true;
}

function formatBackupDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "an unknown date";
  }
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function setLearningDataStatus(message, isError = false) {
  const status = document.querySelector("#learningDataStatus");
  if (!status) {
    return;
  }
  status.hidden = !message;
  status.classList.toggle("is-error", isError);
  status.textContent = message;
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
    const key = Number.isInteger(word.officialIndex)
      ? `official:${word.officialIndex}`
      : `${word.zh}::${word.pinyin}`;
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

function getHskExamRemainingSeconds(session = state.session) {
  if (!["exam", "exam-speaking"].includes(session?.type) || !session.endsAt) {
    return 0;
  }
  return Math.max(0, Math.ceil((session.endsAt - Date.now()) / 1000));
}

function startExamTimer() {
  if (examTimerId || !["exam", "exam-speaking"].includes(state.session?.type)) {
    return;
  }
  examTimerId = window.setInterval(updateHskExamTimer, 250);
  updateHskExamTimer();
}

function stopExamTimer() {
  if (!examTimerId) return;
  window.clearInterval(examTimerId);
  examTimerId = 0;
}

function updateHskExamTimer() {
  const session = state.session;
  if (!["exam", "exam-speaking"].includes(session?.type)) {
    stopExamTimer();
    return;
  }
  const remaining = getHskExamRemainingSeconds(session);
  const timer = document.querySelector("#hskExamTimer");
  if (timer) timer.textContent = formatTimer(remaining);
  document.querySelector(".hsk-exam-session-clock")?.classList.toggle("is-urgent", remaining <= (session.type === "exam" ? 300 : 120));
  if (remaining <= 0) {
    if (session.type === "exam") finishHskExam("time");
    else finishHskSpeakingExam("time");
    return;
  }
  if (session.type !== "exam-speaking") return;
  if (session.stage === "preparation") {
    const prepRemaining = Math.max(0, Math.ceil((session.preparationEndsAt - Date.now()) / 1000));
    const prepTimer = document.querySelector("#hskSpeakingPreparationTimer");
    if (prepTimer) prepTimer.textContent = formatTimer(prepRemaining);
    if (prepRemaining <= 0) beginHskSpeakingResponses();
    return;
  }
  if (session.isRecording && session.responseEndsAt) {
    const responseRemaining = Math.max(0, Math.ceil((session.responseEndsAt - Date.now()) / 1000));
    const responseTimer = document.querySelector("#hskSpeakingResponseTimer");
    if (responseTimer) responseTimer.textContent = formatTimer(responseRemaining);
    if (responseRemaining <= 0) stopHskSpeakingRecording();
  }
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
