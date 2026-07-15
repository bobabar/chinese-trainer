(() => {
  "use strict";

  const SCENES = {
    apples: { sheet: 1, column: 0, row: 0, alt: "three apples" },
    bus: { sheet: 1, column: 1, row: 0, alt: "a city bus" },
    rain: { sheet: 1, column: 2, row: 0, alt: "a person walking in rain" },
    doctor: { sheet: 1, column: 3, row: 0, alt: "a doctor beside a hospital bed" },
    reading: { sheet: 1, column: 0, row: 1, alt: "a student reading" },
    tea: { sheet: 1, column: 1, row: 1, alt: "a person drinking tea" },
    cooking: { sheet: 1, column: 2, row: 1, alt: "a person cooking" },
    phone: { sheet: 1, column: 3, row: 1, alt: "a person making a phone call" },
    sleep: { sheet: 1, column: 0, row: 2, alt: "a person sleeping" },
    basketball: { sheet: 1, column: 1, row: 2, alt: "a person playing basketball" },
    airplane: { sheet: 1, column: 2, row: 2, alt: "an airplane" },
    shopping: { sheet: 1, column: 3, row: 2, alt: "a person shopping in a supermarket" },
    familyDinner: { sheet: 1, column: 0, row: 3, alt: "a family eating dinner" },
    dog: { sheet: 1, column: 1, row: 3, alt: "a small dog" },
    cake: { sheet: 1, column: 2, row: 3, alt: "a birthday cake" },
    train: { sheet: 1, column: 3, row: 3, alt: "a passenger waiting for a train" },
    classroom: { sheet: 2, column: 0, row: 0, alt: "a teacher in a classroom" },
    office: { sheet: 2, column: 1, row: 0, alt: "an office worker at a computer" },
    library: { sheet: 2, column: 2, row: 0, alt: "a person choosing a library book" },
    jogging: { sheet: 2, column: 3, row: 0, alt: "a person jogging in a park" },
    noodles: { sheet: 2, column: 0, row: 1, alt: "a bowl of noodles" },
    coffee: { sheet: 2, column: 1, row: 1, alt: "a cup of coffee" },
    gift: { sheet: 2, column: 2, row: 1, alt: "a wrapped gift" },
    camera: { sheet: 2, column: 3, row: 1, alt: "a person taking a photograph" },
    laundry: { sheet: 2, column: 0, row: 2, alt: "a person washing clothes" },
    subway: { sheet: 2, column: 1, row: 2, alt: "a subway train" },
    pharmacy: { sheet: 2, column: 2, row: 2, alt: "a pharmacy" },
    bicycle: { sheet: 2, column: 3, row: 2, alt: "a person riding a bicycle" },
    dancing: { sheet: 2, column: 0, row: 3, alt: "two people dancing" },
    park: { sheet: 2, column: 1, row: 3, alt: "a park with a bench" },
    writing: { sheet: 2, column: 2, row: 3, alt: "a person writing at a desk" },
    conversation: { sheet: 2, column: 3, row: 3, alt: "two friends talking" },
  };

  function visualQuestion(audio, sceneIds, answerIndex, extra = {}) {
    return {
      type: "choice",
      audio,
      prompt: extra.prompt || "Listen and select the matching picture.",
      choices: sceneIds.map((scene, index) => ({ id: `option-${index}`, scene, label: SCENES[scene].alt })),
      answer: `option-${answerIndex}`,
      ...extra,
    };
  }

  function choiceQuestion(prompt, choices, answerIndex, extra = {}) {
    return {
      type: "choice",
      prompt,
      choices: choices.map((label, index) => ({ id: `option-${index}`, label })),
      answer: `option-${answerIndex}`,
      ...extra,
    };
  }

  function listeningQuestion(audio, choices, answerIndex, extra = {}) {
    return choiceQuestion(extra.prompt || "Listen and choose the best answer.", choices, answerIndex, {
      audio,
      ...extra,
    });
  }

  function reorderQuestion(tokens, answer, extra = {}) {
    return {
      type: "reorder",
      prompt: "Put the words in the correct order.",
      tokens,
      answer,
      ...extra,
    };
  }

  function textQuestion(prompt, answers, extra = {}) {
    return {
      type: "text",
      prompt,
      answers: Array.isArray(answers) ? answers : [answers],
      answer: Array.isArray(answers) ? answers[0] : answers,
      ...extra,
    };
  }

  function freeQuestion(scene, keywords, modelAnswer, extra = {}) {
    return {
      type: "free",
      scene,
      prompt: "Write one complete sentence about the picture.",
      keywords,
      answer: modelAnswer,
      ...extra,
    };
  }

  function part(id, label, instruction, questions) {
    return { id, label, instruction, questions };
  }

  function section(id, label, minutes, parts) {
    return { id, label, minutes, parts };
  }

  function finalizeLevel(level, durationMinutes, sections) {
    let questionNumber = 0;
    const normalizedSections = sections.map((examSection) => ({
      ...examSection,
      parts: examSection.parts.map((examPart) => ({
        ...examPart,
        questions: examPart.questions.map((question, index) => {
          questionNumber += 1;
          return {
            ...question,
            id: `hsk${level}-${examSection.id}-${examPart.id}-${String(index + 1).padStart(2, "0")}`,
            number: questionNumber,
            level,
            skill: examSection.id,
            sectionLabel: examSection.label,
            partId: examPart.id,
            partLabel: examPart.label,
            instruction: examPart.instruction,
          };
        }),
      })),
    }));

    return {
      level,
      label: `New HSK ${level}`,
      durationMinutes,
      totalQuestions: questionNumber,
      sections: normalizedSections,
    };
  }

  const LEVEL_1 = finalizeLevel(1, 40, [
    section("listening", "Listening", 12, [
      part("1", "Part 1", "Listen and select the picture that matches the sentence.", [
        visualQuestion("桌子上有三个苹果。", ["apples", "tea", "gift"], 0),
        visualQuestion("我坐公共汽车去学校。", ["bicycle", "bus", "train"], 1),
        visualQuestion("外面下雨了。", ["park", "rain", "airplane"], 1),
        visualQuestion("王医生在医院工作。", ["office", "classroom", "doctor"], 2),
        visualQuestion("妹妹在看书。", ["phone", "reading", "sleep"], 1),
      ]),
      part("2", "Part 2", "Listen to the question and select the best picture.", [
        visualQuestion("你想喝什么？我想喝茶。", ["noodles", "tea", "apples"], 1),
        visualQuestion("他在做什么？他在睡觉。", ["sleep", "basketball", "phone"], 0),
        visualQuestion("今天是谁的生日？今天是小明的生日。", ["cake", "gift", "familyDinner"], 0),
        visualQuestion("妈妈在哪儿买东西？她在超市买东西。", ["library", "shopping", "pharmacy"], 1),
        visualQuestion("你喜欢什么动物？我喜欢小狗。", ["dog", "apples", "bus"], 0),
      ]),
      part("3", "Part 3", "Listen to the short dialogue and select the matching picture.", [
        visualQuestion("女：你下午做什么？男：我去打篮球。", ["jogging", "basketball", "dancing"], 1),
        visualQuestion("女：你怎么去北京？男：我坐飞机去。", ["train", "airplane", "bus"], 1),
        visualQuestion("男：妈妈在哪儿？女：她在厨房做饭。", ["cooking", "shopping", "laundry"], 0),
        visualQuestion("女：他们在做什么？男：他们在一起吃饭。", ["conversation", "familyDinner", "classroom"], 1),
        visualQuestion("男：你现在忙吗？女：我在给朋友打电话。", ["writing", "phone", "camera"], 1),
      ]),
      part("4", "Part 4", "Listen to the sentence and question, then choose the answer.", [
        listeningQuestion("他下午去超市买水果。问：他下午去哪儿？", ["超市", "学校", "医院"], 0),
        listeningQuestion("我女儿今年八岁。问：她多大？", ["六岁", "八岁", "十八岁"], 1),
        listeningQuestion("明天星期六，我们不上课。问：明天星期几？", ["星期五", "星期六", "星期日"], 1),
        listeningQuestion("这杯茶十块钱。问：这杯茶多少钱？", ["五块", "十块", "二十块"], 1),
        listeningQuestion("我的猫在椅子下面。问：猫在哪儿？", ["椅子上面", "椅子下面", "椅子里面"], 1),
      ]),
    ]),
    section("reading", "Reading", 20, [
      part("1", "Part 1", "Read the sentence and select the matching picture.", [
        visualQuestion("", ["bus", "subway", "train"], 1, { prompt: "我每天坐地铁上班。" }),
        visualQuestion("", ["dancing", "basketball", "cooking"], 0, { prompt: "她会跳舞。" }),
        visualQuestion("", ["classroom", "office", "library"], 1, { prompt: "爸爸在办公室工作。" }),
        visualQuestion("", ["shopping", "park", "pharmacy"], 1, { prompt: "我们去公园走走。" }),
        visualQuestion("", ["airplane", "bus", "bicycle"], 2, { prompt: "弟弟骑自行车上学。" }),
      ]),
      part("2", "Part 2", "Choose the response that best completes the exchange.", [
        choiceQuestion("你叫什么名字？", ["我叫李月。", "我是老师。", "我很好。"], 0),
        choiceQuestion("今天天气怎么样？", ["我在北京。", "今天下雨。", "今天星期三。"], 1),
        choiceQuestion("你想喝茶吗？", ["好的，谢谢。", "茶在桌子上。", "我有一本书。"], 0),
        choiceQuestion("你的书在哪儿？", ["这本书很好。", "在桌子上。", "我喜欢看书。"], 1),
        choiceQuestion("明天见！", ["不客气。", "对不起。", "明天见！"], 2),
      ]),
      part("3", "Part 3", "Choose the word that correctly fills the blank.", [
        choiceQuestion("我是（　）生。", ["学", "医", "先"], 0),
        choiceQuestion("妈妈（　）医院工作。", ["有", "在", "叫"], 1),
        choiceQuestion("他（　）两个好朋友。", ["是", "去", "有"], 2),
        choiceQuestion("请（　）门。", ["开", "吃", "听"], 0),
        choiceQuestion("我们下午（　）电影。", ["说", "看", "喝"], 1),
      ]),
      part("4", "Part 4", "Read the short text and choose the answer.", [
        choiceQuestion("现在九点，他十点上课。\n问：他什么时候上课？", ["九点", "十点", "十一点"], 1),
        choiceQuestion("我家有爸爸、妈妈、姐姐和我。\n问：他家有几个人？", ["三个人", "四个人", "五个人"], 1),
        choiceQuestion("小王不喝咖啡，他喜欢喝茶。\n问：小王喜欢喝什么？", ["水", "咖啡", "茶"], 2),
        choiceQuestion("星期日商店不开门。\n问：商店哪天不开门？", ["星期六", "星期日", "星期一"], 1),
        choiceQuestion("北京今天很冷，请多穿衣服。\n问：北京今天天气怎么样？", ["很热", "很冷", "下雨"], 1),
      ]),
    ]),
  ]);

  const LEVEL_2 = finalizeLevel(2, 60, [
    section("listening", "Listening", 17, [
      part("1", "Part 1", "Listen and select the picture that matches the sentence.", [
        visualQuestion("她星期六在家洗衣服。", ["laundry", "shopping", "cooking"], 0),
        visualQuestion("我每天骑自行车上班。", ["bicycle", "bus", "subway"], 0),
        visualQuestion("他去图书馆借书。", ["office", "library", "classroom"], 1),
        visualQuestion("他们听着音乐跳舞。", ["conversation", "dancing", "basketball"], 1),
        visualQuestion("王老师正在给学生上课。", ["writing", "office", "classroom"], 2),
      ]),
      part("2", "Part 2", "Listen to the dialogue and select the matching picture.", [
        visualQuestion("男：你早上喝茶吗？女：不，我喜欢喝咖啡。", ["tea", "coffee", "noodles"], 1),
        visualQuestion("女：你几点到？男：下午三点的火车。", ["airplane", "train", "subway"], 1),
        visualQuestion("男：周末去哪儿？女：天气好，我们去公园吧。", ["park", "shopping", "library"], 0),
        visualQuestion("女：这是给你的生日礼物。男：谢谢你！", ["cake", "gift", "apples"], 1),
        visualQuestion("男：你为什么带相机？女：我想给大家照相。", ["phone", "camera", "writing"], 1),
        visualQuestion("女：你怎么了？男：我不舒服，要去看医生。", ["doctor", "pharmacy", "sleep"], 0),
        visualQuestion("男：中午想吃什么？女：吃面条吧。", ["familyDinner", "noodles", "tea"], 1),
        visualQuestion("女：你哥哥在哪儿工作？男：他在一家公司工作。", ["classroom", "office", "hospital"].map((scene) => scene === "hospital" ? "doctor" : scene), 1),
        visualQuestion("男：你每天都跑步吗？女：对，早上跑半个小时。", ["jogging", "bicycle", "basketball"], 0),
        visualQuestion("女：去火车站坐什么车最快？男：坐地铁吧。", ["bus", "subway", "bicycle"], 1),
      ]),
      part("3", "Part 3", "Listen to the conversation and choose the best answer.", [
        listeningQuestion("男：外面风很大，你还出去吗？女：不去了，我在家看书。问：女的打算做什么？", ["出门跑步", "在家看书", "去买衣服"], 1),
        listeningQuestion("女：你的生日是五月二十号吗？男：不是，是五月二十二号。问：男的生日是哪天？", ["五月二十号", "五月二十一号", "五月二十二号"], 2),
        listeningQuestion("男：这件蓝色的怎么样？女：颜色不错，可是有点儿大。问：女的觉得衣服怎么样？", ["太贵", "有点儿大", "颜色不好"], 1),
        listeningQuestion("女：你怎么还没吃药？男：医生说饭后吃。问：男的什么时候吃药？", ["吃饭前", "吃饭时", "吃饭后"], 2),
        listeningQuestion("男：你坐公交车来的吗？女：今天路上车多，我走路来的。问：女的怎么来的？", ["走路", "坐公交车", "骑自行车"], 0),
        listeningQuestion("女：电影七点开始，现在六点四十。男：那我们快进去吧。问：电影还有多久开始？", ["十分钟", "二十分钟", "四十分钟"], 1),
        listeningQuestion("男：你姐姐比你高吗？女：她比我高，也比我大两岁。问：关于姐姐，可以知道什么？", ["比女的矮", "比女的年轻", "比女的大"], 2),
        listeningQuestion("女：这个问题我还是不明白。男：下课以后我再给你讲一次。问：男的什么时候再讲？", ["上课以前", "下课以后", "明天早上"], 1),
        listeningQuestion("男：今天的鱼很好吃。女：是我爸爸做的，他很会做饭。问：鱼是谁做的？", ["女的", "女的爸爸", "男的爸爸"], 1),
        listeningQuestion("女：请问，洗手间在哪儿？男：一直走，电梯右边就是。问：洗手间在哪儿？", ["电梯左边", "电梯右边", "楼梯下面"], 1),
      ]),
    ]),
    section("reading", "Reading", 25, [
      part("1", "Part 1", "Read the sentence and select the matching picture.", [
        visualQuestion("", ["camera", "phone", "writing"], 0, { prompt: "他旅行的时候拍了很多照片。" }),
        visualQuestion("", ["pharmacy", "library", "office"], 0, { prompt: "药店就在医院旁边。" }),
        visualQuestion("", ["coffee", "noodles", "tea"], 1, { prompt: "这家饭店的面条很好吃。" }),
        visualQuestion("", ["park", "shopping", "subway"], 2, { prompt: "坐地铁去市中心很方便。" }),
        visualQuestion("", ["jogging", "sleep", "basketball"], 0, { prompt: "为了身体健康，他每天跑步。" }),
      ]),
      part("2", "Part 2", "Choose the word that correctly fills the blank.", [
        choiceQuestion("我来这里已经三年（　）。", ["过", "了", "着"], 1),
        choiceQuestion("这件衣服（　）那件便宜。", ["比", "跟", "从"], 0),
        choiceQuestion("你先休息（　），我们一会儿再走。", ["一下", "一直", "一起"], 0),
        choiceQuestion("他每天（　）早上七点起床。", ["还", "都", "再"], 1),
        choiceQuestion("外面下雨了，（　）带上雨伞。", ["正在", "已经", "别忘了"], 2),
      ]),
      part("3", "Part 3", "Choose the response that best completes the exchange.", [
        choiceQuestion("你看见李老师了吗？", ["他刚才出去了。", "我认识王老师。", "老师很高。"], 0),
        choiceQuestion("这条裤子有小一点儿的吗？", ["您穿多大号？", "今天不太冷。", "我没有裤子。"], 0),
        choiceQuestion("你为什么没参加昨天的比赛？", ["比赛很有意思。", "因为我生病了。", "我最喜欢比赛。"], 1),
        choiceQuestion("周末一起去爬山，怎么样？", ["山上很高。", "好啊，几点出发？", "我昨天去了。"], 1),
        choiceQuestion("请问，去机场怎么走？", ["机场很大。", "坐地铁二号线。", "飞机起飞了。"], 1),
        choiceQuestion("你觉得这本书怎么样？", ["我在书店买的。", "很有意思。", "我看了两个小时。"], 1),
        choiceQuestion("今天的汉语考试难吗？", ["有几道题比较难。", "我学习汉语。", "考试在教室里。"], 0),
        choiceQuestion("你什么时候开始学跳舞的？", ["在文化中心。", "两年以前。", "和我朋友。"], 1),
        choiceQuestion("你的新同事怎么样？", ["他很热情，也很认真。", "他坐公交车。", "他八点上班。"], 0),
        choiceQuestion("你能帮我拿一下这个箱子吗？", ["箱子是新的。", "当然可以。", "我买了两个。"], 1),
      ]),
      part("4", "Part 4", "Read the short text and choose the answer.", [
        choiceQuestion("小林喜欢运动，每星期游泳两次，周末还常常跟朋友打篮球。\n问：小林周末常做什么？", ["打篮球", "去游泳", "在家休息"], 0),
        choiceQuestion("今天商店里的牛奶买一送一，所以妈妈买了四盒，只付了两盒的钱。\n问：妈妈付了几盒牛奶的钱？", ["两盒", "三盒", "四盒"], 0),
        choiceQuestion("张老师下午要开会，让学生把作业放在她办公室门口。\n问：学生应该把作业放在哪儿？", ["教室里", "办公室门口", "会议室里"], 1),
        choiceQuestion("我的手机昨天坏了，今天下班后我要去商场买一个新的。\n问：他今天下班后要做什么？", ["修电脑", "买手机", "找工作"], 1),
        choiceQuestion("火车九点开，车站离这里要四十分钟。我们最好八点以前出发。\n问：他们为什么要八点以前出发？", ["车站很远", "要先吃饭", "火车八点开"], 0),
      ]),
    ]),
    section("writing", "Writing", 10, [
      part("1", "Part 1", "Put the words in the correct order to make a sentence.", [
        reorderQuestion(["我", "已经", "作业", "做完", "了"], "我已经做完作业了。"),
        reorderQuestion(["这件", "比", "那件", "衣服", "便宜"], "这件衣服比那件便宜。"),
        reorderQuestion(["每天", "他", "地铁", "坐", "上班"], "他每天坐地铁上班。"),
        reorderQuestion(["送给", "朋友", "我", "一本书"], "我送给朋友一本书。"),
        reorderQuestion(["正在", "妹妹", "房间里", "唱歌"], "妹妹正在房间里唱歌。"),
      ]),
      part("2", "Part 2", "Type the missing Chinese character shown in pinyin.", [
        textQuestion("你想喝（　）还是喝咖啡？", "茶", { hintPinyin: "chá" }),
        textQuestion("请把门（　）上。", "关", { hintPinyin: "guān" }),
        textQuestion("今天的天（　）很好。", "气", { hintPinyin: "qì" }),
        textQuestion("他在学（　）汉语。", "习", { hintPinyin: "xí" }),
        textQuestion("我家离学校很（　）。", "近", { hintPinyin: "jìn" }),
      ]),
    ]),
  ]);

  const LEVEL_3 = finalizeLevel(3, 83, [
    section("listening", "Listening", 23, [
      part("1", "Part 1", "Listen to the dialogue and select the matching picture.", [
        visualQuestion("女：你怎么每天都骑车上班？男：这样既方便又能锻炼身体。", ["bicycle", "bus", "jogging"], 0),
        visualQuestion("男：会议几点开始？女：九点，在三楼会议室。", ["office", "classroom", "conversation"], 0),
        visualQuestion("女：周末的照片洗出来了吗？男：还没有，我今天去照相馆。", ["camera", "phone", "writing"], 0),
        visualQuestion("男：你嗓子怎么了？女：有点儿疼，我去药店买药。", ["doctor", "pharmacy", "sleep"], 1),
        visualQuestion("女：衣服都洗好了吗？男：还剩一件外套。", ["shopping", "laundry", "gift"], 1),
        visualQuestion("男：你不是说要减肥吗？女：所以我每天早上都去跑步。", ["basketball", "jogging", "dancing"], 1),
        visualQuestion("女：晚饭吃什么？男：我刚学会做西红柿鸡蛋面。", ["noodles", "cooking", "familyDinner"], 1),
        visualQuestion("男：你的课几点结束？女：老师说今天提前十分钟下课。", ["office", "classroom", "library"], 1),
        visualQuestion("女：你买到回上海的票了吗？男：买到了，明天下午的高铁。", ["airplane", "subway", "train"], 2),
        visualQuestion("男：你们怎么认识的？女：我们在朋友的生日会上认识的。", ["cake", "conversation", "gift"], 0),
      ]),
      part("2", "Part 2", "Listen to the conversation and choose the best answer.", [
        listeningQuestion("女：你最近看起来很累。男：公司有个新项目，我常常加班。问：男的为什么累？", ["经常加班", "每天运动", "晚上失眠"], 0),
        listeningQuestion("男：你的航班不是下午两点吗？女：航空公司通知改到四点了。问：航班几点起飞？", ["两点", "三点", "四点"], 2),
        listeningQuestion("女：这家饭店味道不错，就是人太多。男：下次我们早点儿来。问：他们觉得饭店怎么样？", ["菜太贵", "客人很多", "服务不好"], 1),
        listeningQuestion("男：你的报告写完了吗？女：内容写完了，还要检查一下数据。问：女的接下来要做什么？", ["收集材料", "检查数据", "介绍项目"], 1),
        listeningQuestion("女：你为什么不坐电梯？男：才三层，走楼梯更快。问：男的为什么走楼梯？", ["电梯坏了", "想锻炼身体", "楼层不高"], 2),
        listeningQuestion("男：这条路不能停车。女：我只等朋友两分钟。问：女的想做什么？", ["在这里等人", "去找停车场", "马上回家"], 0),
        listeningQuestion("女：明天的活动改到室内了。男：天气预报说会下大雨吗？问：活动为什么改到室内？", ["参加的人太少", "可能下大雨", "房间更安静"], 1),
        listeningQuestion("男：你学中文多久了？女：大学学了两年，工作后又学了一年。问：女的学了几年中文？", ["一年", "两年", "三年"], 2),
        listeningQuestion("女：经理让你给客户回电话。男：我开完会马上回。问：男的什么时候回电话？", ["开会以前", "开会以后", "明天上午"], 1),
        listeningQuestion("男：你还去爬山吗？女：我的脚已经不疼了，当然去。问：女的决定做什么？", ["去爬山", "在家休息", "去看医生"], 0),
      ]),
      part("3", "Part 3", "Listen to the passage and choose the best answer.", [
        listeningQuestion("为了让大家多读书，社区图书馆从这个月开始，星期六和星期日晚上也开放到九点。问：图书馆有什么变化？", ["周末开放得更晚", "增加了很多新书", "搬到了社区中心"], 0),
        listeningQuestion("李明刚到北京时不习惯冬天的天气，后来他开始每周滑冰，现在最喜欢的季节反而是冬天。问：李明现在最喜欢哪个季节？", ["春天", "夏天", "冬天"], 2),
        listeningQuestion("这家咖啡店上午比较安静，下午学生很多。如果想在这里工作，最好十点以前来。问：什么时候咖啡店比较安静？", ["上午", "下午", "晚上"], 0),
        listeningQuestion("张阿姨每天走路去菜市场，虽然坐公交车更快，但她觉得走路既能买菜，也能锻炼身体。问：张阿姨为什么走路去菜市场？", ["公交车太贵", "可以锻炼身体", "菜市场离得很远"], 1),
        listeningQuestion("小刘本来打算周五出发，可是宾馆周末没有房间，所以他把旅行提前到了周四。问：小刘什么时候出发？", ["周四", "周五", "周六"], 0),
        listeningQuestion("网上购物虽然方便，但是买衣服时不能试穿。王女士一般先去商场试好，再到网上比较价格。问：王女士为什么先去商场？", ["商场更便宜", "可以先试衣服", "网上没有衣服"], 1),
        listeningQuestion("学校附近新开了一家面包店。每天晚上七点以后，没卖完的面包都便宜一半，所以那时顾客特别多。问：什么时候面包更便宜？", ["早上七点前", "中午以后", "晚上七点后"], 2),
        listeningQuestion("陈老师建议学生每天写五句话。句子不一定要很难，重要的是坚持。问：陈老师最看重什么？", ["句子要长", "每天坚持写", "使用生词"], 1),
        listeningQuestion("公园里的花很漂亮，但是管理人员提醒游客只能拍照，不能摘花。问：游客可以做什么？", ["拍照", "摘花", "带花回家"], 0),
        listeningQuestion("这场演出原来计划七点开始，因为一位演员路上堵车，最后晚了二十分钟。问：演出实际几点开始？", ["六点四十", "七点", "七点二十"], 2),
      ]),
    ]),
    section("reading", "Reading", 30, [
      part("1", "Part 1", "Choose the response that best completes the exchange.", [
        choiceQuestion("经理怎么不在办公室？", ["他休假了，你可以给他发邮件。", "办公室在三楼。", "经理很有经验。"], 0),
        choiceQuestion("你能告诉我会议改到哪儿了吗？", ["会议已经结束了。", "改到二楼会议室了。", "我没参加昨天的会。"], 1),
        choiceQuestion("这份材料今天必须交吗？", ["最好下班以前交。", "材料一共有十页。", "我在打印材料。"], 0),
        choiceQuestion("你为什么选择住在这里？", ["我住了三个月。", "因为交通很方便。", "房间在东边。"], 1),
        choiceQuestion("听说你换工作了，新工作怎么样？", ["离家近多了，也更有意思。", "我已经工作五年了。", "工作在电脑上。"], 0),
        choiceQuestion("你把我的电话号码记下来了吗？", ["手机没电了。", "已经记在本子上了。", "号码有十一位。"], 1),
        choiceQuestion("周末的足球比赛你参加吗？", ["比赛在体育馆。", "只要不下雨，我就参加。", "我昨天买了足球。"], 1),
        choiceQuestion("这台洗衣机怎么用？", ["我来给你介绍一下。", "洗衣服很累。", "它是去年买的。"], 0),
        choiceQuestion("你最近怎么很少来图书馆？", ["这里的书很多。", "我在准备一个重要考试。", "图书馆八点关门。"], 1),
        choiceQuestion("请问，这附近有银行吗？", ["银行今天休息。", "沿着这条路走五分钟就到了。", "我没有银行卡。"], 1),
      ]),
      part("2", "Part 2", "Choose the word or phrase that correctly fills the blank.", [
        choiceQuestion("洗手间地方（　）小，放不下这么大的洗衣机。", ["尤其", "有点儿", "终于"], 1),
        choiceQuestion("我去洗个澡，然后跟你们（　）聊天儿。", ["一块儿", "一直", "一般"], 0),
        choiceQuestion("他不仅会说中文，（　）会写汉字。", ["还是", "而且", "或者"], 1),
        choiceQuestion("你到家以后，（　）给我发个消息。", ["千万", "从来", "只好"], 0),
        choiceQuestion("这个办法我试过了，（　）没有成功。", ["却", "才", "就"], 0),
        choiceQuestion("如果明天不下雨，我们（　）按计划出发。", ["仍然", "突然", "互相"], 0),
        choiceQuestion("这篇文章内容不难，我十分钟（　）看完了。", ["把", "被", "就"], 2),
        choiceQuestion("她对中国历史很感兴趣，（　）借了很多相关的书。", ["因此", "尽管", "否则"], 0),
        choiceQuestion("会议结束后，请大家（　）离开，不要着急。", ["重新", "按照", "排队"], 2),
        choiceQuestion("我本来想坐地铁，（　）发现地铁已经停了。", ["后来", "永远", "马上"], 0),
      ]),
      part("3", "Part 3", "Read the text and choose the best answer.", [
        choiceQuestion("我把参加活动的名单发给大家了。请检查姓名和电话，如果有问题，星期五以前告诉我。\n问：大家需要检查什么？", ["活动时间", "姓名和电话", "交通方式"], 1),
        choiceQuestion("兴趣是很好的老师。对一件事感兴趣，人们通常愿意花更多时间，也更容易坚持。\n问：兴趣有什么作用？", ["让学习更容易坚持", "让时间变得更多", "让事情马上成功"], 0),
        choiceQuestion("公司楼下新开了一家餐厅。菜的种类不多，但是味道不错，而且上菜很快，很适合午休时间去。\n问：这家餐厅有什么优点？", ["环境特别安静", "菜的种类很多", "上菜速度快"], 2),
        choiceQuestion("我以前总觉得早起很困难。后来养了一只狗，每天早上必须带它出去散步，现在我已经习惯早起了。\n问：什么让他习惯了早起？", ["新的工作", "养了一只狗", "参加跑步比赛"], 1),
        choiceQuestion("请注意，明天上午十点到十二点，小区会停水。请大家提前准备好需要用的水。\n问：通知希望大家做什么？", ["提前存水", "上午出门", "检查水管"], 0),
        choiceQuestion("很多人旅行时喜欢把每天的安排排得很满。我却觉得，留一点儿没有计划的时间，可能会发现更有意思的地方。\n问：作者旅行时喜欢怎么做？", ["每天早起", "留一些自由时间", "只去有名的地方"], 1),
        choiceQuestion("57-58题：小赵大学毕业后去了南方工作。刚开始他不习惯那里的饮食，但同事经常带他尝当地菜。半年后，他不但习惯了，还学会做两道当地菜。\n问：小赵刚到南方时不习惯什么？", ["天气", "工作时间", "当地饮食"], 2),
        choiceQuestion("57-58题：小赵大学毕业后去了南方工作。刚开始他不习惯那里的饮食，但同事经常带他尝当地菜。半年后，他不但习惯了，还学会做两道当地菜。\n问：半年后，小赵有什么变化？", ["会做当地菜了", "换了一份工作", "回到了大学"], 0),
        choiceQuestion("59-60题：市博物馆将在暑假举办志愿者活动。参加者需要会说普通话和一种外语，每周至少工作两个下午。有兴趣的人请在六月十五日前报名。\n问：参加者需要具备什么条件？", ["会开车", "会一种外语", "有博物馆经验"], 1),
        choiceQuestion("59-60题：市博物馆将在暑假举办志愿者活动。参加者需要会说普通话和一种外语，每周至少工作两个下午。有兴趣的人请在六月十五日前报名。\n问：最晚什么时候报名？", ["六月十五日", "暑假开始后", "每周二下午"], 0),
      ]),
    ]),
    section("writing", "Writing", 20, [
      part("1", "Part 1", "Type the missing Chinese character shown in pinyin.", [
        textQuestion("她们出发了，咱们（　）打出租车吧。", "也", { hintPinyin: "yě" }),
        textQuestion("请再检（　）一下你的姓名和电话。", "查", { hintPinyin: "chá" }),
        textQuestion("这次旅行给我留下了很深的印（　）。", "象", { hintPinyin: "xiàng" }),
        textQuestion("天气预报说下午可（　）会下雨。", "能", { hintPinyin: "néng" }),
        textQuestion("他终于做出了正确的选（　）。", "择", { hintPinyin: "zé" }),
      ]),
      part("2", "Part 2", "Write one complete sentence about each picture.", [
        freeQuestion("basketball", ["打", "篮球"], "他每周末都去打篮球。"),
        freeQuestion("camera", ["照相"], "她正在公园里照相。", { alternateKeywords: [["拍", "照片"]] }),
        freeQuestion("subway", ["坐", "地铁"], "我每天坐地铁去上班。"),
        freeQuestion("familyDinner", ["一起", "吃饭"], "一家人正在一起吃饭。"),
        freeQuestion("rain", ["下雨", "伞"], "外面下雨了，她带着一把伞。"),
      ]),
    ]),
  ]);

  const HSK_3_SPEAKING = {
    level: 3,
    label: "New HSK 3 Speaking",
    durationMinutes: 15,
    preparationMinutes: 6,
    totalQuestions: 15,
    parts: [
      {
        id: "repeat",
        label: "Listen and repeat",
        responseSeconds: 10,
        items: [
          "我每天坐地铁去上班。",
          "这家饭店的服务很不错。",
          "周末我们一起去爬山吧。",
          "请把会议时间发给我。",
          "外面下雨，别忘了带伞。",
          "他对中国历史很感兴趣。",
          "我的新同事工作非常认真。",
          "图书馆晚上九点才关门。",
        ].map((prompt, index) => ({ id: `hsk3-speaking-repeat-${index + 1}`, prompt })),
      },
      {
        id: "picture",
        label: "Describe the picture",
        responseSeconds: 15,
        items: [
          { id: "hsk3-speaking-picture-1", scene: "cooking", modelAnswer: "他正在厨房做饭。" },
          { id: "hsk3-speaking-picture-2", scene: "library", modelAnswer: "她在图书馆找书。" },
          { id: "hsk3-speaking-picture-3", scene: "jogging", modelAnswer: "他每天早上在公园跑步。" },
          { id: "hsk3-speaking-picture-4", scene: "laundry", modelAnswer: "她正在用洗衣机洗衣服。" },
          { id: "hsk3-speaking-picture-5", scene: "conversation", modelAnswer: "两个朋友正在聊天儿。" },
        ],
      },
      {
        id: "response",
        label: "Answer the question",
        responseSeconds: 90,
        items: [
          { id: "hsk3-speaking-response-1", prompt: "请介绍一下你的一位好朋友。" },
          { id: "hsk3-speaking-response-2", prompt: "你周末最喜欢做什么？为什么？" },
        ],
      },
    ],
  };

  window.HSK_MOCK_EXAMS = {
    version: "2026-07",
    sourceLabel: "Official HSK 3.0 syllabus and sample structure",
    sourceUrl: "https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf",
    scenes: SCENES,
    levels: {
      1: LEVEL_1,
      2: LEVEL_2,
      3: LEVEL_3,
    },
    speaking: HSK_3_SPEAKING,
  };
})();
