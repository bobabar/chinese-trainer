(() => {
  "use strict";

  // Sentence pairs are sourced from Tatoeba and redistributed under CC BY 2.0 FR.
  // Source and translation IDs are retained on each row for attribution and auditing.
  const sentences = [
    {
      "id": "beginner-001",
      "level": "beginner",
      "zh": "我已经走了超过四个小时。",
      "en": "I've been walking for over four hours.",
      "source": "Tatoeba",
      "sourceId": 602900,
      "translationId": 7792853
    },
    {
      "id": "beginner-002",
      "level": "beginner",
      "zh": "这几天你最好还是别下床。",
      "en": "You'd better stay in bed for a few days.",
      "source": "Tatoeba",
      "sourceId": 6822552,
      "translationId": 72998
    },
    {
      "id": "beginner-003",
      "level": "beginner",
      "zh": "他每天跑步，所以身体很好。",
      "en": "He runs every day so he is very healthy.",
      "source": "Tatoeba",
      "sourceId": 10501234,
      "translationId": 10501273
    },
    {
      "id": "beginner-004",
      "level": "beginner",
      "zh": "你很快就会习惯住在这里。",
      "en": "You'll get used to living here in no time.",
      "source": "Tatoeba",
      "sourceId": 517602,
      "translationId": 606867
    },
    {
      "id": "beginner-005",
      "level": "beginner",
      "zh": "我是三个孩子中第二大的。",
      "en": "I'm the second oldest of three children.",
      "source": "Tatoeba",
      "sourceId": 9958166,
      "translationId": 1849429
    },
    {
      "id": "beginner-006",
      "level": "beginner",
      "zh": "走自己的路，让别人去说吧。",
      "en": "Follow your own path and let people talk.",
      "source": "Tatoeba",
      "sourceId": 7771870,
      "translationId": 4875869
    },
    {
      "id": "beginner-007",
      "level": "beginner",
      "zh": "那个班有15名男孩和28名女孩子。",
      "en": "That class has 15 boys and 28 girls.",
      "source": "Tatoeba",
      "sourceId": 926737,
      "translationId": 930429
    },
    {
      "id": "beginner-008",
      "level": "beginner",
      "zh": "我们同意了第二天一早开始。",
      "en": "We agreed to start early the next morning.",
      "source": "Tatoeba",
      "sourceId": 333084,
      "translationId": 22640
    },
    {
      "id": "beginner-009",
      "level": "beginner",
      "zh": "昨天星期五，所以他就休息了。",
      "en": "Yesterday was Friday, so he took a break.",
      "source": "Tatoeba",
      "sourceId": 10002030,
      "translationId": 10179171
    },
    {
      "id": "beginner-010",
      "level": "beginner",
      "zh": "不如我们走着去书店吧？",
      "en": "Why don't we go to the bookstore on foot?",
      "source": "Tatoeba",
      "sourceId": 1944086,
      "translationId": 320502
    },
    {
      "id": "beginner-011",
      "level": "beginner",
      "zh": "这种药我吃了好多年了。",
      "en": "I've been taking this medication for many years.",
      "source": "Tatoeba",
      "sourceId": 10699403,
      "translationId": 10700632
    },
    {
      "id": "beginner-012",
      "level": "beginner",
      "zh": "这本书很好懂，对我来说。",
      "en": "It is easy for me to read this book.",
      "source": "Tatoeba",
      "sourceId": 2298431,
      "translationId": 56816
    },
    {
      "id": "beginner-013",
      "level": "beginner",
      "zh": "他们的苹果没有我们的好吃。",
      "en": "Their apples aren't as tasty as ours.",
      "source": "Tatoeba",
      "sourceId": 4874063,
      "translationId": 1580112
    },
    {
      "id": "beginner-014",
      "level": "beginner",
      "zh": "她可能迟到，然后我们就要等。",
      "en": "She may be late, in which case we will wait.",
      "source": "Tatoeba",
      "sourceId": 6020846,
      "translationId": 315791
    },
    {
      "id": "beginner-015",
      "level": "beginner",
      "zh": "我会在这里等着到他回来的。",
      "en": "Until he comes back, I will wait here.",
      "source": "Tatoeba",
      "sourceId": 8815389,
      "translationId": 8305418
    },
    {
      "id": "beginner-016",
      "level": "beginner",
      "zh": "今天要是不下雨就好了。",
      "en": "It would be nice if it didn't rain today.",
      "source": "Tatoeba",
      "sourceId": 13545280,
      "translationId": 13821727
    },
    {
      "id": "beginner-017",
      "level": "beginner",
      "zh": "我每六小时要服一次药。",
      "en": "I have to take my medicine every six hours.",
      "source": "Tatoeba",
      "sourceId": 792850,
      "translationId": 497663
    },
    {
      "id": "beginner-018",
      "level": "beginner",
      "zh": "虽然时间好早，天气已经热了。",
      "en": "Although it was still early, it was already hot outside.",
      "source": "Tatoeba",
      "sourceId": 9779602,
      "translationId": 9777100
    },
    {
      "id": "beginner-019",
      "level": "beginner",
      "zh": "你走了，我们都会想你的。",
      "en": "We shall all miss you when you go away.",
      "source": "Tatoeba",
      "sourceId": 332548,
      "translationId": 18050
    },
    {
      "id": "beginner-020",
      "level": "beginner",
      "zh": "我想问他的电话号码是多少。",
      "en": "I want to ask him for his phone number.",
      "source": "Tatoeba",
      "sourceId": 1616503,
      "translationId": 1616508
    },
    {
      "id": "beginner-021",
      "level": "beginner",
      "zh": "我希望下周还能见到你。",
      "en": "I'd like to see you again next week.",
      "source": "Tatoeba",
      "sourceId": 3076592,
      "translationId": 325081
    },
    {
      "id": "beginner-022",
      "level": "beginner",
      "zh": "我们学校离公园非常近。",
      "en": "Our school is very close to the park.",
      "source": "Tatoeba",
      "sourceId": 408485,
      "translationId": 23439
    },
    {
      "id": "beginner-023",
      "level": "beginner",
      "zh": "可那不是真正的问题所在。",
      "en": "But that's not the real problem.",
      "source": "Tatoeba",
      "sourceId": 10086130,
      "translationId": 2663284
    },
    {
      "id": "beginner-024",
      "level": "beginner",
      "zh": "我知道你在和她一起工作。",
      "en": "I know you're working with her.",
      "source": "Tatoeba",
      "sourceId": 9970229,
      "translationId": 3902998
    },
    {
      "id": "beginner-025",
      "level": "beginner",
      "zh": "没有人说得出来她在哪里。",
      "en": "No one could tell where she was.",
      "source": "Tatoeba",
      "sourceId": 662314,
      "translationId": 308097
    },
    {
      "id": "beginner-026",
      "level": "beginner",
      "zh": "我几乎每天都见到那条狗。",
      "en": "I see that dog almost every day.",
      "source": "Tatoeba",
      "sourceId": 375346,
      "translationId": 7780388
    },
    {
      "id": "beginner-027",
      "level": "beginner",
      "zh": "我本来想走的，但后来忘了。",
      "en": "I intended to go, but forgot to.",
      "source": "Tatoeba",
      "sourceId": 4264664,
      "translationId": 257415
    },
    {
      "id": "beginner-028",
      "level": "beginner",
      "zh": "他算是男孩子中最高的了。",
      "en": "He's the tallest amongst the boys.",
      "source": "Tatoeba",
      "sourceId": 1188444,
      "translationId": 1211525
    },
    {
      "id": "beginner-029",
      "level": "beginner",
      "zh": "今天我们有一场数学考试。",
      "en": "We had an examination in mathematics today.",
      "source": "Tatoeba",
      "sourceId": 869142,
      "translationId": 248707
    },
    {
      "id": "beginner-030",
      "level": "beginner",
      "zh": "他们看了那部电影半天了。",
      "en": "They've been watching that film for ages.",
      "source": "Tatoeba",
      "sourceId": 1305934,
      "translationId": 1305935
    },
    {
      "id": "beginner-031",
      "level": "beginner",
      "zh": "我不记得上次看到她微笑。",
      "en": "I can't remember when was the last time I've seen her smile.",
      "source": "Tatoeba",
      "sourceId": 8860609,
      "translationId": 3633492
    },
    {
      "id": "beginner-032",
      "level": "beginner",
      "zh": "许多学生喜欢在早上学习。",
      "en": "Many students like to study in the morning.",
      "source": "Tatoeba",
      "sourceId": 1783903,
      "translationId": 1712930
    },
    {
      "id": "beginner-033",
      "level": "beginner",
      "zh": "如果你会唱歌就好了。",
      "en": "If you can sing, that's good enough.",
      "source": "Tatoeba",
      "sourceId": 407287,
      "translationId": 1498837
    },
    {
      "id": "beginner-034",
      "level": "beginner",
      "zh": "他每天都给她打电话。",
      "en": "He calls her on the phone every day.",
      "source": "Tatoeba",
      "sourceId": 2029431,
      "translationId": 5618371
    },
    {
      "id": "beginner-035",
      "level": "beginner",
      "zh": "你已经有了很多机会。",
      "en": "You've had plenty of chances to do that.",
      "source": "Tatoeba",
      "sourceId": 9408592,
      "translationId": 7735202
    },
    {
      "id": "beginner-036",
      "level": "beginner",
      "zh": "我天黑后不喜欢出门。",
      "en": "I don't like to go out after dark.",
      "source": "Tatoeba",
      "sourceId": 333762,
      "translationId": 28455
    },
    {
      "id": "beginner-037",
      "level": "beginner",
      "zh": "你该上学去了，不是吗？",
      "en": "It's high time you left for school, isn't it?",
      "source": "Tatoeba",
      "sourceId": 512894,
      "translationId": 31555
    },
    {
      "id": "beginner-038",
      "level": "beginner",
      "zh": "他说完就站起来走了。",
      "en": "When he finished speaking, he stood up and walked away.",
      "source": "Tatoeba",
      "sourceId": 3541778,
      "translationId": 3622294
    },
    {
      "id": "beginner-039",
      "level": "beginner",
      "zh": "你爱我只是因为我是个黑人吗？",
      "en": "Do you love me just because I'm black?",
      "source": "Tatoeba",
      "sourceId": 10007056,
      "translationId": 1816714
    },
    {
      "id": "beginner-040",
      "level": "beginner",
      "zh": "我们要开始做饭了，你想帮忙吗？",
      "en": "We're going to start cooking, would you like to help?",
      "source": "Tatoeba",
      "sourceId": 11837351,
      "translationId": 11837353
    },
    {
      "id": "beginner-041",
      "level": "beginner",
      "zh": "我累得再也走不动了。",
      "en": "I'm too tired to walk any further.",
      "source": "Tatoeba",
      "sourceId": 6452041,
      "translationId": 317811
    },
    {
      "id": "beginner-042",
      "level": "beginner",
      "zh": "您说的话完全跑题了。",
      "en": "What you say is quite wide of the mark.",
      "source": "Tatoeba",
      "sourceId": 2392970,
      "translationId": 17230
    },
    {
      "id": "beginner-043",
      "level": "beginner",
      "zh": "我想去加拿大读大学。",
      "en": "I want to go study at a Canadian university.",
      "source": "Tatoeba",
      "sourceId": 10732718,
      "translationId": 10732720
    },
    {
      "id": "beginner-044",
      "level": "beginner",
      "zh": "你听说过这样的事吗？",
      "en": "Have you ever heard of such a thing?",
      "source": "Tatoeba",
      "sourceId": 7773141,
      "translationId": 54782
    },
    {
      "id": "beginner-045",
      "level": "beginner",
      "zh": "他问我知不知道她的电话号码。",
      "en": "He asked me if I knew her telephone number.",
      "source": "Tatoeba",
      "sourceId": 1862911,
      "translationId": 297706
    },
    {
      "id": "beginner-046",
      "level": "beginner",
      "zh": "我一有钱马上就还你。",
      "en": "I'll pay you back as soon as I have money.",
      "source": "Tatoeba",
      "sourceId": 756896,
      "translationId": 756897
    },
    {
      "id": "beginner-047",
      "level": "beginner",
      "zh": "他一周没有来工作了。",
      "en": "He has been absent from work for a week.",
      "source": "Tatoeba",
      "sourceId": 1408012,
      "translationId": 238505
    },
    {
      "id": "beginner-048",
      "level": "beginner",
      "zh": "他是你前些时候见过的那个人。",
      "en": "He is the man you met the other day.",
      "source": "Tatoeba",
      "sourceId": 5668920,
      "translationId": 300664
    },
    {
      "id": "beginner-049",
      "level": "beginner",
      "zh": "我走路10分钟能到学校。",
      "en": "I can walk to school in 10 minutes.",
      "source": "Tatoeba",
      "sourceId": 334145,
      "translationId": 1616
    },
    {
      "id": "beginner-050",
      "level": "beginner",
      "zh": "我想这药会对您有好处的。",
      "en": "I think this medicine will do you good.",
      "source": "Tatoeba",
      "sourceId": 782216,
      "translationId": 56600
    },
    {
      "id": "beginner-051",
      "level": "beginner",
      "zh": "他会是我妹妹的好丈夫的。",
      "en": "He will be a good husband to my sister.",
      "source": "Tatoeba",
      "sourceId": 335936,
      "translationId": 432787
    },
    {
      "id": "beginner-052",
      "level": "beginner",
      "zh": "你今天早上喂过狗了吗？",
      "en": "Did you feed the dog this morning?",
      "source": "Tatoeba",
      "sourceId": 333766,
      "translationId": 242245
    },
    {
      "id": "beginner-053",
      "level": "beginner",
      "zh": "好的，但我们先吃晚饭吧。",
      "en": "Sure, but let's eat dinner first.",
      "source": "Tatoeba",
      "sourceId": 333569,
      "translationId": 65349
    },
    {
      "id": "beginner-054",
      "level": "beginner",
      "zh": "明天九点打电话给我吧。",
      "en": "Phone me tomorrow at nine o'clock.",
      "source": "Tatoeba",
      "sourceId": 4903261,
      "translationId": 10596528
    },
    {
      "id": "beginner-055",
      "level": "beginner",
      "zh": "她年轻的时候非常漂亮。",
      "en": "She was very beautiful in her youth.",
      "source": "Tatoeba",
      "sourceId": 2357585,
      "translationId": 2382108
    },
    {
      "id": "beginner-056",
      "level": "beginner",
      "zh": "我们班有二十多个学生。",
      "en": "Our class has more than twenty students.",
      "source": "Tatoeba",
      "sourceId": 3378107,
      "translationId": 3378108
    },
    {
      "id": "beginner-057",
      "level": "beginner",
      "zh": "医生给他的病人开了一些药。",
      "en": "The physician prescribed his patient some medicine.",
      "source": "Tatoeba",
      "sourceId": 8650501,
      "translationId": 27931
    },
    {
      "id": "beginner-058",
      "level": "beginner",
      "zh": "他想得到一本新的字典。",
      "en": "He wants to get a new dictionary.",
      "source": "Tatoeba",
      "sourceId": 881690,
      "translationId": 299896
    },
    {
      "id": "beginner-059",
      "level": "beginner",
      "zh": "玩笑而已，不要太认真了。",
      "en": "Just kidding, don't be so serious.",
      "source": "Tatoeba",
      "sourceId": 1766222,
      "translationId": 9401842
    },
    {
      "id": "beginner-060",
      "level": "beginner",
      "zh": "他以前就是在这里住的。",
      "en": "Here is the house where he lived.",
      "source": "Tatoeba",
      "sourceId": 564571,
      "translationId": 504716
    },
    {
      "id": "beginner-061",
      "level": "beginner",
      "zh": "今年的雪下得比去年多。",
      "en": "It snowed more this year than last.",
      "source": "Tatoeba",
      "sourceId": 683586,
      "translationId": 1360731
    },
    {
      "id": "beginner-062",
      "level": "beginner",
      "zh": "那是你昨天买的毛衣吗？",
      "en": "Is that the sweater you bought yesterday?",
      "source": "Tatoeba",
      "sourceId": 6956923,
      "translationId": 6954669
    },
    {
      "id": "beginner-063",
      "level": "beginner",
      "zh": "我们会在我的办公室见面。",
      "en": "We'll meet in my office.",
      "source": "Tatoeba",
      "sourceId": 10696110,
      "translationId": 11406530
    },
    {
      "id": "beginner-064",
      "level": "beginner",
      "zh": "一个人只能活七十岁左右。",
      "en": "Humans only live about 70 years.",
      "source": "Tatoeba",
      "sourceId": 8739474,
      "translationId": 1990616
    },
    {
      "id": "beginner-065",
      "level": "beginner",
      "zh": "我一直等到了最后一分钟。",
      "en": "I waited until the last minute.",
      "source": "Tatoeba",
      "sourceId": 770948,
      "translationId": 327630
    },
    {
      "id": "beginner-066",
      "level": "beginner",
      "zh": "我以前从未见过这样的事情。",
      "en": "I've never seen anything like this before.",
      "source": "Tatoeba",
      "sourceId": 10783863,
      "translationId": 54721
    },
    {
      "id": "beginner-067",
      "level": "beginner",
      "zh": "你不介意的路上捡东西回来？",
      "en": "Would you mind picking up something on the way back?",
      "source": "Tatoeba",
      "sourceId": 733163,
      "translationId": 20446
    },
    {
      "id": "beginner-068",
      "level": "beginner",
      "zh": "每堂课我都分别有一本笔记。",
      "en": "I have a separate notebook for each class.",
      "source": "Tatoeba",
      "sourceId": 3596585,
      "translationId": 3596586
    },
    {
      "id": "beginner-069",
      "level": "beginner",
      "zh": "我都没想过会在这里碰见你。",
      "en": "I didn't expect to see you at a place like this.",
      "source": "Tatoeba",
      "sourceId": 3662924,
      "translationId": 3550166
    },
    {
      "id": "beginner-070",
      "level": "beginner",
      "zh": "在意大利，他们每周工作五天。",
      "en": "In Italy, they work five days a week.",
      "source": "Tatoeba",
      "sourceId": 5155058,
      "translationId": 5154982
    },
    {
      "id": "beginner-071",
      "level": "beginner",
      "zh": "你为什么不和我们一起来？",
      "en": "Why aren't you coming with us?",
      "source": "Tatoeba",
      "sourceId": 1776630,
      "translationId": 2383
    },
    {
      "id": "beginner-072",
      "level": "beginner",
      "zh": "我想知道明天是否会下雨。",
      "en": "I wonder if it will rain tomorrow.",
      "source": "Tatoeba",
      "sourceId": 333812,
      "translationId": 323257
    },
    {
      "id": "beginner-073",
      "level": "beginner",
      "zh": "昨晚他看见天上有个飞碟。",
      "en": "He saw a UFO flying last night.",
      "source": "Tatoeba",
      "sourceId": 663320,
      "translationId": 296939
    },
    {
      "id": "beginner-074",
      "level": "beginner",
      "zh": "我仍然热爱着网球运动。",
      "en": "I am still keeping up my tennis craze.",
      "source": "Tatoeba",
      "sourceId": 686607,
      "translationId": 32657
    },
    {
      "id": "beginner-075",
      "level": "beginner",
      "zh": "我敢说他不是个坏男生。",
      "en": "I dare say he's not a bad boy.",
      "source": "Tatoeba",
      "sourceId": 804787,
      "translationId": 274990
    },
    {
      "id": "beginner-076",
      "level": "beginner",
      "zh": "他关掉了电视开始学习。",
      "en": "He turned off the TV and began to study.",
      "source": "Tatoeba",
      "sourceId": 3666930,
      "translationId": 291892
    },
    {
      "id": "beginner-077",
      "level": "beginner",
      "zh": "她比其他人都漂亮。",
      "en": "She was more beautiful than all the others.",
      "source": "Tatoeba",
      "sourceId": 5911661,
      "translationId": 1561528
    },
    {
      "id": "beginner-078",
      "level": "beginner",
      "zh": "如果明天下雨，我们就坐车去那儿。",
      "en": "If it's raining tomorrow, we'll go there by car.",
      "source": "Tatoeba",
      "sourceId": 4620827,
      "translationId": 4728287
    },
    {
      "id": "beginner-079",
      "level": "beginner",
      "zh": "现在我爸爸不在家。",
      "en": "My dad is not at home for the moment.",
      "source": "Tatoeba",
      "sourceId": 333477,
      "translationId": 333479
    },
    {
      "id": "beginner-080",
      "level": "beginner",
      "zh": "这一年他在学习上有很大的进步。",
      "en": "This year, he improved greatly on the education front.",
      "source": "Tatoeba",
      "sourceId": 3205570,
      "translationId": 13731429
    },
    {
      "id": "beginner-081",
      "level": "beginner",
      "zh": "明天很有可能下雨。",
      "en": "Tomorrow there's a high probability it will rain.",
      "source": "Tatoeba",
      "sourceId": 6152995,
      "translationId": 5399394
    },
    {
      "id": "beginner-082",
      "level": "beginner",
      "zh": "我能认识一下你吗？",
      "en": "Can I get to know you for a bit?",
      "source": "Tatoeba",
      "sourceId": 10989120,
      "translationId": 11149237
    },
    {
      "id": "beginner-083",
      "level": "beginner",
      "zh": "你国家的人吃米吗？",
      "en": "Do the people of your country eat rice?",
      "source": "Tatoeba",
      "sourceId": 10966794,
      "translationId": 763883
    },
    {
      "id": "beginner-084",
      "level": "beginner",
      "zh": "你有必要到那里去。",
      "en": "It is necessary for you to go there.",
      "source": "Tatoeba",
      "sourceId": 528044,
      "translationId": 70004
    },
    {
      "id": "beginner-085",
      "level": "beginner",
      "zh": "他的儿子有才能，但是考不上大学。",
      "en": "His son has talent, but cannot pass the college entrance exam.",
      "source": "Tatoeba",
      "sourceId": 4444861,
      "translationId": 7251711
    },
    {
      "id": "beginner-086",
      "level": "beginner",
      "zh": "你最好马上去睡觉。",
      "en": "You'd better go to bed at once.",
      "source": "Tatoeba",
      "sourceId": 829310,
      "translationId": 52148
    },
    {
      "id": "beginner-087",
      "level": "beginner",
      "zh": "她说再过5分钟就到，但她还是没来。",
      "en": "She said she would arrive in 5 more minutes, but she still hasn't come.",
      "source": "Tatoeba",
      "sourceId": 5685871,
      "translationId": 5260645
    },
    {
      "id": "beginner-088",
      "level": "beginner",
      "zh": "你得注意他说的话。",
      "en": "You should pay attention to what he says.",
      "source": "Tatoeba",
      "sourceId": 2442277,
      "translationId": 286031
    },
    {
      "id": "beginner-089",
      "level": "beginner",
      "zh": "我得问你做那件事。",
      "en": "I must ask you to do just that.",
      "source": "Tatoeba",
      "sourceId": 5136735,
      "translationId": 3728007
    },
    {
      "id": "beginner-090",
      "level": "beginner",
      "zh": "我们的孩子喜欢狗，但我更喜欢猫。",
      "en": "Our children like dogs, but I prefer cats.",
      "source": "Tatoeba",
      "sourceId": 332805,
      "translationId": 247536
    },
    {
      "id": "beginner-091",
      "level": "beginner",
      "zh": "这本汉语书对我们来说没有太难。",
      "en": "This Chinese book is not too difficult for us.",
      "source": "Tatoeba",
      "sourceId": 3377893,
      "translationId": 3377894
    },
    {
      "id": "beginner-092",
      "level": "beginner",
      "zh": "今天中午你在家吗？",
      "en": "Will you be at home at midday today?",
      "source": "Tatoeba",
      "sourceId": 10961182,
      "translationId": 13731442
    },
    {
      "id": "beginner-093",
      "level": "beginner",
      "zh": "我没有朋友可以聊天。",
      "en": "I have no friend to talk with.",
      "source": "Tatoeba",
      "sourceId": 706430,
      "translationId": 250020
    },
    {
      "id": "beginner-094",
      "level": "beginner",
      "zh": "你能去学校接小孩吗？",
      "en": "Can you fetch the children from school?",
      "source": "Tatoeba",
      "sourceId": 1516158,
      "translationId": 1514222
    },
    {
      "id": "beginner-095",
      "level": "beginner",
      "zh": "知道和行动是两回事。",
      "en": "Knowing and doing are two different things.",
      "source": "Tatoeba",
      "sourceId": 3630322,
      "translationId": 3633854
    },
    {
      "id": "beginner-096",
      "level": "beginner",
      "zh": "我正在用手机打电话。",
      "en": "I'm calling from a cell phone.",
      "source": "Tatoeba",
      "sourceId": 8777601,
      "translationId": 1890967
    },
    {
      "id": "beginner-097",
      "level": "beginner",
      "zh": "我们过去常在公园玩。",
      "en": "We used to play in the park.",
      "source": "Tatoeba",
      "sourceId": 333434,
      "translationId": 248379
    },
    {
      "id": "beginner-098",
      "level": "beginner",
      "zh": "他问我喜不喜欢数学。",
      "en": "He asked me whether I like math.",
      "source": "Tatoeba",
      "sourceId": 345743,
      "translationId": 1266429
    },
    {
      "id": "beginner-099",
      "level": "beginner",
      "zh": "这一家人一起看电影。",
      "en": "The family is watching a movie together.",
      "source": "Tatoeba",
      "sourceId": 1416277,
      "translationId": 682372
    },
    {
      "id": "beginner-100",
      "level": "beginner",
      "zh": "我们明天下午不上课。",
      "en": "We don't have class tomorrow afternoon.",
      "source": "Tatoeba",
      "sourceId": 8293438,
      "translationId": 9164551
    },
    {
      "id": "beginner-101",
      "level": "beginner",
      "zh": "我好多天没吃东西了。",
      "en": "I haven't eaten for many days.",
      "source": "Tatoeba",
      "sourceId": 1417555,
      "translationId": 1309296
    },
    {
      "id": "beginner-102",
      "level": "beginner",
      "zh": "您可不可以告诉我您贵姓？",
      "en": "Can you tell me your last name?",
      "source": "Tatoeba",
      "sourceId": 659896,
      "translationId": 9819379
    },
    {
      "id": "beginner-103",
      "level": "beginner",
      "zh": "你不能帮我找找钱包吗？",
      "en": "Can't you help me look for my wallet?",
      "source": "Tatoeba",
      "sourceId": 3078815,
      "translationId": 7829862
    },
    {
      "id": "beginner-104",
      "level": "beginner",
      "zh": "一天一苹果，医生远离我。",
      "en": "An apple a day keeps the doctor away.",
      "source": "Tatoeba",
      "sourceId": 379584,
      "translationId": 236496
    },
    {
      "id": "beginner-105",
      "level": "beginner",
      "zh": "她爱上了她朋友的弟弟。",
      "en": "She fell in love with her friend's brother.",
      "source": "Tatoeba",
      "sourceId": 2283480,
      "translationId": 317265
    },
    {
      "id": "beginner-106",
      "level": "beginner",
      "zh": "他星期天很少留在家中。",
      "en": "He seldom stays home on Sundays.",
      "source": "Tatoeba",
      "sourceId": 1401733,
      "translationId": 1401642
    },
    {
      "id": "beginner-107",
      "level": "beginner",
      "zh": "他们人太多了，数不过来。",
      "en": "They are too numerous to enumerate.",
      "source": "Tatoeba",
      "sourceId": 2318409,
      "translationId": 41937
    },
    {
      "id": "beginner-108",
      "level": "beginner",
      "zh": "这只手机实在是太贵了。",
      "en": "This cell phone is really expensive.",
      "source": "Tatoeba",
      "sourceId": 1300407,
      "translationId": 1299988
    },
    {
      "id": "beginner-109",
      "level": "beginner",
      "zh": "我经常忘记别人的名字。",
      "en": "I always have trouble remembering names.",
      "source": "Tatoeba",
      "sourceId": 395528,
      "translationId": 253163
    },
    {
      "id": "beginner-110",
      "level": "beginner",
      "zh": "这些天他们很少看电视。",
      "en": "They seldom watch television these days.",
      "source": "Tatoeba",
      "sourceId": 4757610,
      "translationId": 4752650
    },
    {
      "id": "beginner-111",
      "level": "beginner",
      "zh": "下班时间还没到，大家就想溜走。",
      "en": "It still isn't time to leave work, and everyone wants to escape.",
      "source": "Tatoeba",
      "sourceId": 421040,
      "translationId": 7845683
    },
    {
      "id": "beginner-112",
      "level": "beginner",
      "zh": "夜晚是我一天中最喜欢的时候。",
      "en": "Nighttime is my favorite time of the day.",
      "source": "Tatoeba",
      "sourceId": 8744824,
      "translationId": 8742997
    },
    {
      "id": "beginner-113",
      "level": "beginner",
      "zh": "你是不是跟长岛家有关系的？",
      "en": "Are you related to the Nagashima family?",
      "source": "Tatoeba",
      "sourceId": 691195,
      "translationId": 69086
    },
    {
      "id": "beginner-114",
      "level": "beginner",
      "zh": "那台电脑是花三千块买的。",
      "en": "This computer cost three thousand dollars.",
      "source": "Tatoeba",
      "sourceId": 2737441,
      "translationId": 2737508
    },
    {
      "id": "beginner-115",
      "level": "beginner",
      "zh": "那个学生正在学习社会学。",
      "en": "The student is working at sociology.",
      "source": "Tatoeba",
      "sourceId": 429352,
      "translationId": 48904
    },
    {
      "id": "beginner-116",
      "level": "beginner",
      "zh": "只要你微笑，我就会快乐。",
      "en": "If you smile, I'll be happy.",
      "source": "Tatoeba",
      "sourceId": 393370,
      "translationId": 392517
    },
    {
      "id": "beginner-117",
      "level": "beginner",
      "zh": "你什么时候学会游泳的？",
      "en": "When did you learn how to swim?",
      "source": "Tatoeba",
      "sourceId": 621068,
      "translationId": 4533256
    },
    {
      "id": "beginner-118",
      "level": "beginner",
      "zh": "我很少能抽出时间看书。",
      "en": "I can seldom find time for reading.",
      "source": "Tatoeba",
      "sourceId": 528036,
      "translationId": 249960
    },
    {
      "id": "beginner-119",
      "level": "beginner",
      "zh": "这个男孩说会来一条狼。",
      "en": "The boy said a wolf would come.",
      "source": "Tatoeba",
      "sourceId": 760160,
      "translationId": 46275
    },
    {
      "id": "beginner-120",
      "level": "beginner",
      "zh": "我们乐意帮你做。",
      "en": "We were happy to do that for you.",
      "source": "Tatoeba",
      "sourceId": 9423259,
      "translationId": 6348451
    },
    {
      "id": "beginner-121",
      "level": "beginner",
      "zh": "不好意思，请问您知道现在几点了吗？",
      "en": "Excuse me, do you know what time it is?",
      "source": "Tatoeba",
      "sourceId": 5100269,
      "translationId": 3789181
    },
    {
      "id": "beginner-122",
      "level": "beginner",
      "zh": "地球公转时间是一年。",
      "en": "The earth orbits the sun once a year.",
      "source": "Tatoeba",
      "sourceId": 8490497,
      "translationId": 4770193
    },
    {
      "id": "beginner-123",
      "level": "beginner",
      "zh": "你们两个误了我一生。",
      "en": "The two of you have ruined my life.",
      "source": "Tatoeba",
      "sourceId": 2319014,
      "translationId": 2319015
    },
    {
      "id": "beginner-124",
      "level": "beginner",
      "zh": "明早八点车站见。",
      "en": "Let's meet at the station at eight tomorrow morning.",
      "source": "Tatoeba",
      "sourceId": 4972514,
      "translationId": 323184
    },
    {
      "id": "beginner-125",
      "level": "beginner",
      "zh": "这是你要找的书。",
      "en": "This is the book you're looking for.",
      "source": "Tatoeba",
      "sourceId": 10696104,
      "translationId": 9028673
    },
    {
      "id": "beginner-126",
      "level": "beginner",
      "zh": "我家离这儿很远。",
      "en": "My house is a long way from here.",
      "source": "Tatoeba",
      "sourceId": 407259,
      "translationId": 250526
    },
    {
      "id": "beginner-127",
      "level": "beginner",
      "zh": "五百年前是一家。",
      "en": "Five hundred years ago it was a house.",
      "source": "Tatoeba",
      "sourceId": 760850,
      "translationId": 7770325
    },
    {
      "id": "beginner-128",
      "level": "beginner",
      "zh": "有时候不知道的。",
      "en": "I don't know if there's time.",
      "source": "Tatoeba",
      "sourceId": 939538,
      "translationId": 1033662
    },
    {
      "id": "beginner-129",
      "level": "beginner",
      "zh": "它们中没有我要的。",
      "en": "I don't want either of them.",
      "source": "Tatoeba",
      "sourceId": 1446781,
      "translationId": 1156147
    },
    {
      "id": "beginner-130",
      "level": "beginner",
      "zh": "您不想再喝点茶吗？",
      "en": "Won't you have some more tea?",
      "source": "Tatoeba",
      "sourceId": 423140,
      "translationId": 64202
    },
    {
      "id": "beginner-131",
      "level": "beginner",
      "zh": "他晚上很晚才回家。",
      "en": "He came home late in the evening.",
      "source": "Tatoeba",
      "sourceId": 10541627,
      "translationId": 304493
    },
    {
      "id": "beginner-132",
      "level": "beginner",
      "zh": "她没有让我们帮忙。",
      "en": "She wouldn't let us help her.",
      "source": "Tatoeba",
      "sourceId": 11672641,
      "translationId": 7383838
    },
    {
      "id": "beginner-133",
      "level": "beginner",
      "zh": "我来了好长时间了。",
      "en": "I've been here for a while.",
      "source": "Tatoeba",
      "sourceId": 374887,
      "translationId": 399085
    },
    {
      "id": "beginner-134",
      "level": "beginner",
      "zh": "我再也不想看到她。",
      "en": "I never want to see her again.",
      "source": "Tatoeba",
      "sourceId": 5541877,
      "translationId": 1908959
    },
    {
      "id": "beginner-135",
      "level": "beginner",
      "zh": "他正坐在会议室里。",
      "en": "He's sitting in the meeting room.",
      "source": "Tatoeba",
      "sourceId": 332471,
      "translationId": 2456988
    },
    {
      "id": "beginner-136",
      "level": "beginner",
      "zh": "火车站离这里不远。",
      "en": "The station is not far from here.",
      "source": "Tatoeba",
      "sourceId": 136604,
      "translationId": 26049
    },
    {
      "id": "beginner-137",
      "level": "beginner",
      "zh": "他们说天气会很热。",
      "en": "They say it will be very hot.",
      "source": "Tatoeba",
      "sourceId": 9955925,
      "translationId": 463222
    },
    {
      "id": "beginner-138",
      "level": "beginner",
      "zh": "他在东京出生长大。",
      "en": "He was born and raised in Tokyo.",
      "source": "Tatoeba",
      "sourceId": 1471143,
      "translationId": 685961
    },
    {
      "id": "beginner-139",
      "level": "beginner",
      "zh": "桌子上的书是谁的？",
      "en": "Whose book is this on the desk?",
      "source": "Tatoeba",
      "sourceId": 1933280,
      "translationId": 1263814
    },
    {
      "id": "beginner-140",
      "level": "beginner",
      "zh": "我会在三天后回来。",
      "en": "I'll be back in three days.",
      "source": "Tatoeba",
      "sourceId": 13063667,
      "translationId": 6265992
    },
    {
      "id": "beginner-141",
      "level": "beginner",
      "zh": "我不记得你的名字了。",
      "en": "I don't remember your name.",
      "source": "Tatoeba",
      "sourceId": 466283,
      "translationId": 383640
    },
    {
      "id": "beginner-142",
      "level": "beginner",
      "zh": "我以前从没去过国外。",
      "en": "I've never been abroad before.",
      "source": "Tatoeba",
      "sourceId": 5715139,
      "translationId": 530526
    },
    {
      "id": "beginner-143",
      "level": "beginner",
      "zh": "最近的地铁站在哪里？",
      "en": "Where is the closest metro stop?",
      "source": "Tatoeba",
      "sourceId": 623171,
      "translationId": 554302
    },
    {
      "id": "beginner-144",
      "level": "beginner",
      "zh": "你们要在这里唱歌吗？",
      "en": "Are you going to sing here?",
      "source": "Tatoeba",
      "sourceId": 1878272,
      "translationId": 16718
    },
    {
      "id": "beginner-145",
      "level": "beginner",
      "zh": "你的椅子和我的很像。",
      "en": "Your chair is similar to mine.",
      "source": "Tatoeba",
      "sourceId": 1225645,
      "translationId": 11272470
    },
    {
      "id": "beginner-146",
      "level": "beginner",
      "zh": "她有一个少见的名字。",
      "en": "She has a rare given name.",
      "source": "Tatoeba",
      "sourceId": 10513373,
      "translationId": 596345
    },
    {
      "id": "beginner-147",
      "level": "beginner",
      "zh": "请问您能告诉我那家餐馆在哪吗？",
      "en": "Can you please tell me where the restaurant is?",
      "source": "Tatoeba",
      "sourceId": 1316886,
      "translationId": 434422
    },
    {
      "id": "beginner-148",
      "level": "beginner",
      "zh": "她一个月写一次信给我。",
      "en": "She writes to me once a month.",
      "source": "Tatoeba",
      "sourceId": 345991,
      "translationId": 313443
    },
    {
      "id": "beginner-149",
      "level": "beginner",
      "zh": "只有你回答了这个问题。",
      "en": "Only you answered the question.",
      "source": "Tatoeba",
      "sourceId": 528062,
      "translationId": 17685
    },
    {
      "id": "beginner-150",
      "level": "beginner",
      "zh": "这是你第一次看这部电影吗？",
      "en": "Is this the first time you've seen this movie?",
      "source": "Tatoeba",
      "sourceId": 10275181,
      "translationId": 6713362
    },
    {
      "id": "beginner-151",
      "level": "beginner",
      "zh": "你从来不明白我的玩笑。",
      "en": "You never get my jokes.",
      "source": "Tatoeba",
      "sourceId": 844175,
      "translationId": 841063
    },
    {
      "id": "beginner-152",
      "level": "beginner",
      "zh": "请在下一站让我下车。",
      "en": "Please let me off at the next stop.",
      "source": "Tatoeba",
      "sourceId": 4468899,
      "translationId": 1655683
    },
    {
      "id": "beginner-153",
      "level": "beginner",
      "zh": "那个朝我们跑过来的男孩是谁？",
      "en": "Who is that boy running toward us?",
      "source": "Tatoeba",
      "sourceId": 811026,
      "translationId": 247415
    },
    {
      "id": "beginner-154",
      "level": "beginner",
      "zh": "大家都知道她的英语说得很好。",
      "en": "Everybody knew she could speak English well.",
      "source": "Tatoeba",
      "sourceId": 333282,
      "translationId": 308184
    },
    {
      "id": "beginner-155",
      "level": "beginner",
      "zh": "他还没有给我我借给他的钱。",
      "en": "He still hasn't given me the money I lent him.",
      "source": "Tatoeba",
      "sourceId": 3702588,
      "translationId": 3702594
    },
    {
      "id": "beginner-156",
      "level": "beginner",
      "zh": "学校里有多少位教西班牙语的老师呢？",
      "en": "How many teachers of Spanish are there at this high school?",
      "source": "Tatoeba",
      "sourceId": 4425824,
      "translationId": 1820783
    },
    {
      "id": "beginner-157",
      "level": "beginner",
      "zh": "我不想跟你说！",
      "en": "I don't want to talk to you.",
      "source": "Tatoeba",
      "sourceId": 1446789,
      "translationId": 953445
    },
    {
      "id": "beginner-158",
      "level": "beginner",
      "zh": "如果你唱歌了，他们就会把你踢出酒吧。",
      "en": "If you sang, they'd kick you out of the bar.",
      "source": "Tatoeba",
      "sourceId": 8746396,
      "translationId": 7127281
    },
    {
      "id": "beginner-159",
      "level": "beginner",
      "zh": "明天下午2点以前，我希望这工作完成了。",
      "en": "I want this work completed by two o'clock tomorrow afternoon.",
      "source": "Tatoeba",
      "sourceId": 334693,
      "translationId": 59095
    },
    {
      "id": "beginner-160",
      "level": "beginner",
      "zh": "我想去看医生。",
      "en": "I want to go to see a doctor.",
      "source": "Tatoeba",
      "sourceId": 6055184,
      "translationId": 7808561
    },
    {
      "id": "beginner-161",
      "level": "beginner",
      "zh": "我下午去卖车。",
      "en": "I'm going to go sell my car this afternoon.",
      "source": "Tatoeba",
      "sourceId": 2299585,
      "translationId": 2300031
    },
    {
      "id": "beginner-162",
      "level": "beginner",
      "zh": "金钱不能买到所有的东西。",
      "en": "Money can't buy everything.",
      "source": "Tatoeba",
      "sourceId": 4600759,
      "translationId": 1334072
    },
    {
      "id": "beginner-163",
      "level": "beginner",
      "zh": "我就只告诉你，他靠不住。",
      "en": "Between you and me, he cannot be relied upon.",
      "source": "Tatoeba",
      "sourceId": 813557,
      "translationId": 62021
    },
    {
      "id": "beginner-164",
      "level": "beginner",
      "zh": "我不知道他喝那么多酒。",
      "en": "I didn't know he drank so much.",
      "source": "Tatoeba",
      "sourceId": 405195,
      "translationId": 2364
    },
    {
      "id": "beginner-165",
      "level": "beginner",
      "zh": "我看这雨还会下一阵子。",
      "en": "I don't think this rain will let up anytime soon.",
      "source": "Tatoeba",
      "sourceId": 6799628,
      "translationId": 5618442
    },
    {
      "id": "beginner-166",
      "level": "beginner",
      "zh": "我现在在这所学校任教。",
      "en": "I'm currently a teacher at this school.",
      "source": "Tatoeba",
      "sourceId": 1766187,
      "translationId": 2149796
    },
    {
      "id": "beginner-167",
      "level": "beginner",
      "zh": "那位帅哥是我们的老师。",
      "en": "That young man is our teacher.",
      "source": "Tatoeba",
      "sourceId": 1891368,
      "translationId": 68270
    },
    {
      "id": "beginner-168",
      "level": "beginner",
      "zh": "我的书为什么会在这里？",
      "en": "What's my book doing here?",
      "source": "Tatoeba",
      "sourceId": 623175,
      "translationId": 24994
    },
    {
      "id": "beginner-169",
      "level": "beginner",
      "zh": "你能来我真高兴。",
      "en": "I'm really glad you're here.",
      "source": "Tatoeba",
      "sourceId": 3671241,
      "translationId": 2543492
    },
    {
      "id": "beginner-170",
      "level": "beginner",
      "zh": "他是我的老朋友。",
      "en": "He's an old friend of mine.",
      "source": "Tatoeba",
      "sourceId": 10182749,
      "translationId": 881498
    },
    {
      "id": "beginner-171",
      "level": "beginner",
      "zh": "我十一点起床了。",
      "en": "I woke up at eleven o'clock.",
      "source": "Tatoeba",
      "sourceId": 7704617,
      "translationId": 5509264
    },
    {
      "id": "beginner-172",
      "level": "beginner",
      "zh": "我们看着这孩子玩耍。",
      "en": "We were watching the child at play.",
      "source": "Tatoeba",
      "sourceId": 332545,
      "translationId": 23188
    },
    {
      "id": "beginner-173",
      "level": "beginner",
      "zh": "我想快要下雨了。",
      "en": "I think it's going to rain.",
      "source": "Tatoeba",
      "sourceId": 389521,
      "translationId": 26904
    },
    {
      "id": "beginner-174",
      "level": "beginner",
      "zh": "是的，今天晚上很愉快。",
      "en": "Yes, it's such a nice evening.",
      "source": "Tatoeba",
      "sourceId": 609920,
      "translationId": 402418
    },
    {
      "id": "beginner-175",
      "level": "beginner",
      "zh": "我觉得最好别试。",
      "en": "I think it better not to try.",
      "source": "Tatoeba",
      "sourceId": 363901,
      "translationId": 30256
    },
    {
      "id": "beginner-176",
      "level": "beginner",
      "zh": "她经常九点睡觉。",
      "en": "She usually goes to bed at nine.",
      "source": "Tatoeba",
      "sourceId": 609970,
      "translationId": 316793
    },
    {
      "id": "beginner-177",
      "level": "beginner",
      "zh": "我给我们煮了些咖啡。",
      "en": "I've made some coffee for us.",
      "source": "Tatoeba",
      "sourceId": 9963193,
      "translationId": 7791587
    },
    {
      "id": "beginner-178",
      "level": "beginner",
      "zh": "这样的东西很少。",
      "en": "There are so few things like this.",
      "source": "Tatoeba",
      "sourceId": 1216056,
      "translationId": 1230599
    },
    {
      "id": "beginner-179",
      "level": "beginner",
      "zh": "我很高兴见到你。",
      "en": "I'm very happy to see you.",
      "source": "Tatoeba",
      "sourceId": 406328,
      "translationId": 432319
    },
    {
      "id": "beginner-180",
      "level": "beginner",
      "zh": "将来我要去国外旅游。",
      "en": "I want to go abroad one day.",
      "source": "Tatoeba",
      "sourceId": 2040283,
      "translationId": 66354
    },
    {
      "id": "beginner-181",
      "level": "beginner",
      "zh": "我们学校的图书馆很小，但是是新的。",
      "en": "Our school library is small, but new.",
      "source": "Tatoeba",
      "sourceId": 819761,
      "translationId": 247468
    },
    {
      "id": "beginner-182",
      "level": "beginner",
      "zh": "你上了几所学校？",
      "en": "How many different schools have you attended?",
      "source": "Tatoeba",
      "sourceId": 9432371,
      "translationId": 953341
    },
    {
      "id": "beginner-183",
      "level": "beginner",
      "zh": "五千元是很多钱。",
      "en": "5000 yuan is a lot of money.",
      "source": "Tatoeba",
      "sourceId": 3283115,
      "translationId": 1454609
    },
    {
      "id": "beginner-184",
      "level": "beginner",
      "zh": "我弟弟小的时候，我常常陪他去公园。",
      "en": "When my brother was young, I often used to take him to the park.",
      "source": "Tatoeba",
      "sourceId": 788992,
      "translationId": 788994
    },
    {
      "id": "beginner-185",
      "level": "beginner",
      "zh": "为了准时到达那里，我们叫了出租车。",
      "en": "We took a taxi so as to reach there on time.",
      "source": "Tatoeba",
      "sourceId": 1335441,
      "translationId": 29095
    },
    {
      "id": "beginner-186",
      "level": "beginner",
      "zh": "房子里家具太多了。",
      "en": "There is too much furniture in the house.",
      "source": "Tatoeba",
      "sourceId": 614448,
      "translationId": 49409
    },
    {
      "id": "beginner-187",
      "level": "beginner",
      "zh": "他白天睡夜晚工作。",
      "en": "He sleeps during the day and works at night.",
      "source": "Tatoeba",
      "sourceId": 1316024,
      "translationId": 1211531
    },
    {
      "id": "beginner-188",
      "level": "beginner",
      "zh": "十字路口出了车祸。",
      "en": "There's been an accident at the crossroads.",
      "source": "Tatoeba",
      "sourceId": 9401505,
      "translationId": 6575232
    },
    {
      "id": "beginner-189",
      "level": "beginner",
      "zh": "你不教我们说英语。",
      "en": "You do not teach us to speak English.",
      "source": "Tatoeba",
      "sourceId": 3378247,
      "translationId": 3378248
    },
    {
      "id": "beginner-190",
      "level": "beginner",
      "zh": "你不喜欢爱情故事。",
      "en": "You don't like love stories.",
      "source": "Tatoeba",
      "sourceId": 469274,
      "translationId": 16335
    },
    {
      "id": "beginner-191",
      "level": "beginner",
      "zh": "意外发生在两年前。",
      "en": "The accident happened two years ago.",
      "source": "Tatoeba",
      "sourceId": 431580,
      "translationId": 46678
    },
    {
      "id": "beginner-192",
      "level": "beginner",
      "zh": "他有很多兴趣爱好。",
      "en": "He has a lot of hobbies.",
      "source": "Tatoeba",
      "sourceId": 8936656,
      "translationId": 301125
    },
    {
      "id": "beginner-193",
      "level": "beginner",
      "zh": "我在等我的女朋友。",
      "en": "I'm waiting for my girlfriend.",
      "source": "Tatoeba",
      "sourceId": 1740872,
      "translationId": 1549228
    },
    {
      "id": "beginner-194",
      "level": "beginner",
      "zh": "请坐在这把椅子上。",
      "en": "Please sit down on this chair.",
      "source": "Tatoeba",
      "sourceId": 8932566,
      "translationId": 61333
    },
    {
      "id": "beginner-195",
      "level": "beginner",
      "zh": "她还是个孩子的时候，唱歌很好听。",
      "en": "She sang well as a child.",
      "source": "Tatoeba",
      "sourceId": 7781511,
      "translationId": 4706599
    },
    {
      "id": "beginner-196",
      "level": "beginner",
      "zh": "让我为您做这件事！",
      "en": "Let me do this for you.",
      "source": "Tatoeba",
      "sourceId": 10460409,
      "translationId": 3636226
    },
    {
      "id": "beginner-197",
      "level": "beginner",
      "zh": "他在哪家公司工作？",
      "en": "What company does he work in?",
      "source": "Tatoeba",
      "sourceId": 336041,
      "translationId": 8246494
    },
    {
      "id": "beginner-198",
      "level": "beginner",
      "zh": "我有个不错的想法。",
      "en": "I've had a brilliant idea.",
      "source": "Tatoeba",
      "sourceId": 5574490,
      "translationId": 1176639
    },
    {
      "id": "beginner-199",
      "level": "beginner",
      "zh": "我告诉她我会帮忙。",
      "en": "I told her I'd help.",
      "source": "Tatoeba",
      "sourceId": 11509736,
      "translationId": 3905625
    },
    {
      "id": "beginner-200",
      "level": "beginner",
      "zh": "他不在这有多久了？",
      "en": "How long has he been absent?",
      "source": "Tatoeba",
      "sourceId": 7773131,
      "translationId": 292182
    },
    {
      "id": "beginner-201",
      "level": "beginner",
      "zh": "你今天早上非常早。",
      "en": "You are very early this morning.",
      "source": "Tatoeba",
      "sourceId": 874983,
      "translationId": 62603
    },
    {
      "id": "beginner-202",
      "level": "beginner",
      "zh": "有一天你会忘了我。",
      "en": "You'll forget about me someday.",
      "source": "Tatoeba",
      "sourceId": 334164,
      "translationId": 1602
    },
    {
      "id": "beginner-203",
      "level": "beginner",
      "zh": "我给你再买一个吧。",
      "en": "Let me buy you another one.",
      "source": "Tatoeba",
      "sourceId": 1395057,
      "translationId": 320289
    },
    {
      "id": "beginner-204",
      "level": "beginner",
      "zh": "是谁给你说那个的呢？",
      "en": "Who said that to you?",
      "source": "Tatoeba",
      "sourceId": 5100179,
      "translationId": 2646712
    },
    {
      "id": "beginner-205",
      "level": "beginner",
      "zh": "请问我们现在能走吗？",
      "en": "Can we go now, please?",
      "source": "Tatoeba",
      "sourceId": 5698024,
      "translationId": 3328488
    },
    {
      "id": "beginner-206",
      "level": "beginner",
      "zh": "你今天可以休假一天。",
      "en": "You can take today off.",
      "source": "Tatoeba",
      "sourceId": 838642,
      "translationId": 242861
    },
    {
      "id": "beginner-207",
      "level": "beginner",
      "zh": "不是每一个孩子都喜欢吃苹果。",
      "en": "Not every child likes apples.",
      "source": "Tatoeba",
      "sourceId": 1454438,
      "translationId": 596726
    },
    {
      "id": "beginner-208",
      "level": "beginner",
      "zh": "您的手机号码是多少？",
      "en": "What is your phone number?",
      "source": "Tatoeba",
      "sourceId": 3378151,
      "translationId": 687372
    },
    {
      "id": "beginner-209",
      "level": "beginner",
      "zh": "她的孩子她都一样爱。",
      "en": "She loved her children alike.",
      "source": "Tatoeba",
      "sourceId": 334723,
      "translationId": 313962
    },
    {
      "id": "beginner-210",
      "level": "beginner",
      "zh": "我每天都给他打电话。",
      "en": "I phone him every day.",
      "source": "Tatoeba",
      "sourceId": 7772433,
      "translationId": 1736436
    },
    {
      "id": "beginner-211",
      "level": "beginner",
      "zh": "最近的图书馆在哪里？",
      "en": "Where's the nearest library?",
      "source": "Tatoeba",
      "sourceId": 8932578,
      "translationId": 27257
    },
    {
      "id": "beginner-212",
      "level": "beginner",
      "zh": "她爱上了她男友的弟弟。",
      "en": "She fell in love with her boyfriend's younger brother.",
      "source": "Tatoeba",
      "sourceId": 2254271,
      "translationId": 2296681
    },
    {
      "id": "beginner-213",
      "level": "beginner",
      "zh": "等他下次来时，我会把这件事告诉他。",
      "en": "I will tell him about it when he comes next time.",
      "source": "Tatoeba",
      "sourceId": 1895016,
      "translationId": 58898
    },
    {
      "id": "beginner-214",
      "level": "beginner",
      "zh": "我有一只狗和两只猫。",
      "en": "I have a dog and two cats.",
      "source": "Tatoeba",
      "sourceId": 381928,
      "translationId": 257247
    },
    {
      "id": "beginner-215",
      "level": "beginner",
      "zh": "别介意别人所说的话。",
      "en": "Don't worry about what others say.",
      "source": "Tatoeba",
      "sourceId": 431622,
      "translationId": 274698
    },
    {
      "id": "beginner-216",
      "level": "beginner",
      "zh": "认识他的人都爱他。",
      "en": "He was loved by everyone that knew him.",
      "source": "Tatoeba",
      "sourceId": 777582,
      "translationId": 777583
    },
    {
      "id": "beginner-217",
      "level": "beginner",
      "zh": "你明早7点来接我吗？",
      "en": "Are you picking me up at 7 tomorrow morning?",
      "source": "Tatoeba",
      "sourceId": 333384,
      "translationId": 621733
    },
    {
      "id": "beginner-218",
      "level": "beginner",
      "zh": "离这里不远。",
      "en": "It's not far from here to there.",
      "source": "Tatoeba",
      "sourceId": 398388,
      "translationId": 398384
    },
    {
      "id": "beginner-219",
      "level": "beginner",
      "zh": "明天我吃了午饭以后就跟朋友出去玩儿。",
      "en": "Tomorrow I'll go out with friends after having lunch.",
      "source": "Tatoeba",
      "sourceId": 841831,
      "translationId": 841832
    },
    {
      "id": "beginner-220",
      "level": "beginner",
      "zh": "今天的小饭馆明天就可以变成大饭店了。",
      "en": "The small restaurant of today may be a big hotel tomorrow.",
      "source": "Tatoeba",
      "sourceId": 858926,
      "translationId": 858927
    },
    {
      "id": "beginner-221",
      "level": "beginner",
      "zh": "这家饭馆下午的时候往往没有很多顾客。",
      "en": "Not many customers come to this restaurant in the afternoon.",
      "source": "Tatoeba",
      "sourceId": 789137,
      "translationId": 7800717
    },
    {
      "id": "beginner-222",
      "level": "beginner",
      "zh": "你家有猫吗？",
      "en": "Have you got a cat in your house?",
      "source": "Tatoeba",
      "sourceId": 10966807,
      "translationId": 13138652
    },
    {
      "id": "beginner-223",
      "level": "beginner",
      "zh": "她没去看电影。",
      "en": "She didn't go see the movie.",
      "source": "Tatoeba",
      "sourceId": 11837655,
      "translationId": 11837660
    },
    {
      "id": "beginner-224",
      "level": "beginner",
      "zh": "老师从来不拿学生们的错误来开玩笑。",
      "en": "The teacher has never made fun of the students' mistakes.",
      "source": "Tatoeba",
      "sourceId": 1661553,
      "translationId": 1663278
    },
    {
      "id": "beginner-225",
      "level": "beginner",
      "zh": "不要这样看我。",
      "en": "Don't look at me that way.",
      "source": "Tatoeba",
      "sourceId": 2889777,
      "translationId": 49747
    },
    {
      "id": "beginner-226",
      "level": "beginner",
      "zh": "你想看房子吗？",
      "en": "Do you want to see the house?",
      "source": "Tatoeba",
      "sourceId": 9963199,
      "translationId": 5242421
    },
    {
      "id": "beginner-227",
      "level": "beginner",
      "zh": "他病了一星期。",
      "en": "He has been sick for a week.",
      "source": "Tatoeba",
      "sourceId": 407248,
      "translationId": 293693
    },
    {
      "id": "beginner-228",
      "level": "beginner",
      "zh": "很少有学生能在古汉语考试上拿满分。",
      "en": "Almost no students get full marks in Chinese classics.",
      "source": "Tatoeba",
      "sourceId": 1397149,
      "translationId": 21024
    },
    {
      "id": "beginner-229",
      "level": "beginner",
      "zh": "我昨天钓了一条大鱼。",
      "en": "I caught a big fish yesterday.",
      "source": "Tatoeba",
      "sourceId": 344881,
      "translationId": 257790
    },
    {
      "id": "beginner-230",
      "level": "beginner",
      "zh": "我知道你多大了。",
      "en": "I know how old you are.",
      "source": "Tatoeba",
      "sourceId": 783024,
      "translationId": 252682
    },
    {
      "id": "beginner-231",
      "level": "beginner",
      "zh": "我想在这里再待一会。",
      "en": "I want to stay here longer.",
      "source": "Tatoeba",
      "sourceId": 8686319,
      "translationId": 253462
    },
    {
      "id": "beginner-232",
      "level": "beginner",
      "zh": "他想明天去看你。",
      "en": "He will come to you tomorrow.",
      "source": "Tatoeba",
      "sourceId": 609846,
      "translationId": 304079
    },
    {
      "id": "beginner-233",
      "level": "beginner",
      "zh": "请问，地铁在哪儿？",
      "en": "Excuse me. Where's the metro?",
      "source": "Tatoeba",
      "sourceId": 4563001,
      "translationId": 4728331
    },
    {
      "id": "beginner-234",
      "level": "beginner",
      "zh": "他们会为你做饭。",
      "en": "They will be cooking for you.",
      "source": "Tatoeba",
      "sourceId": 12169649,
      "translationId": 12169646
    },
    {
      "id": "beginner-235",
      "level": "beginner",
      "zh": "这些书都是我的。",
      "en": "All of these books are mine.",
      "source": "Tatoeba",
      "sourceId": 799259,
      "translationId": 1360853
    },
    {
      "id": "beginner-236",
      "level": "beginner",
      "zh": "请不要跟我说话。",
      "en": "Please don't speak to me.",
      "source": "Tatoeba",
      "sourceId": 5136668,
      "translationId": 2276690
    },
    {
      "id": "beginner-237",
      "level": "beginner",
      "zh": "我觉得他不在家。",
      "en": "I think he is not home.",
      "source": "Tatoeba",
      "sourceId": 3378007,
      "translationId": 3378008
    },
    {
      "id": "beginner-238",
      "level": "beginner",
      "zh": "我爷爷每天吃药。",
      "en": "My grandfather takes medicine every day.",
      "source": "Tatoeba",
      "sourceId": 1216089,
      "translationId": 1230545
    },
    {
      "id": "beginner-239",
      "level": "beginner",
      "zh": "我昨天住在他家。",
      "en": "I stayed at his place yesterday.",
      "source": "Tatoeba",
      "sourceId": 858225,
      "translationId": 244534
    },
    {
      "id": "beginner-240",
      "level": "beginner",
      "zh": "对了，我明天有事。",
      "en": "Oh right, I have something tomorrow.",
      "source": "Tatoeba",
      "sourceId": 411272,
      "translationId": 411269
    },
    {
      "id": "beginner-241",
      "level": "beginner",
      "zh": "我知道他叫什么名字。",
      "en": "I know what his name is.",
      "source": "Tatoeba",
      "sourceId": 390853,
      "translationId": 287622
    },
    {
      "id": "beginner-242",
      "level": "beginner",
      "zh": "以下是我们怎么做的。",
      "en": "Here's how we do it.",
      "source": "Tatoeba",
      "sourceId": 5091710,
      "translationId": 3126584
    },
    {
      "id": "beginner-243",
      "level": "beginner",
      "zh": "他昨天没来上学。",
      "en": "He was absent from school yesterday.",
      "source": "Tatoeba",
      "sourceId": 346832,
      "translationId": 296900
    },
    {
      "id": "beginner-244",
      "level": "beginner",
      "zh": "我们队进了第一个球。",
      "en": "Our team scored the first goal.",
      "source": "Tatoeba",
      "sourceId": 7774760,
      "translationId": 7829881
    },
    {
      "id": "beginner-245",
      "level": "beginner",
      "zh": "我要花很长时间。",
      "en": "It'll take a long time.",
      "source": "Tatoeba",
      "sourceId": 5691275,
      "translationId": 2499284
    },
    {
      "id": "beginner-246",
      "level": "beginner",
      "zh": "我每天都去学校。",
      "en": "I go to school every day.",
      "source": "Tatoeba",
      "sourceId": 10695991,
      "translationId": 1233508
    },
    {
      "id": "beginner-247",
      "level": "beginner",
      "zh": "你另一个弟弟在哪里？",
      "en": "Where is your other younger brother?",
      "source": "Tatoeba",
      "sourceId": 4019078,
      "translationId": 4023294
    },
    {
      "id": "beginner-248",
      "level": "beginner",
      "zh": "没有人住在这栋楼里。",
      "en": "No one lives in that building.",
      "source": "Tatoeba",
      "sourceId": 444814,
      "translationId": 397848
    },
    {
      "id": "beginner-249",
      "level": "beginner",
      "zh": "我知道她很可爱。",
      "en": "I know she is very lovely.",
      "source": "Tatoeba",
      "sourceId": 442286,
      "translationId": 5583034
    },
    {
      "id": "beginner-250",
      "level": "beginner",
      "zh": "我会打电话给你。",
      "en": "I'll give you a ring.",
      "source": "Tatoeba",
      "sourceId": 2163111,
      "translationId": 2164519
    },
    {
      "id": "beginner-251",
      "level": "beginner",
      "zh": "你还在找工作吗？",
      "en": "Aren't you looking for work?",
      "source": "Tatoeba",
      "sourceId": 9961343,
      "translationId": 6102546
    },
    {
      "id": "beginner-252",
      "level": "beginner",
      "zh": "希望我没有烦到你。",
      "en": "I hope I'm not boring you.",
      "source": "Tatoeba",
      "sourceId": 5091173,
      "translationId": 2360859
    },
    {
      "id": "beginner-253",
      "level": "beginner",
      "zh": "我能休息一会儿吗？",
      "en": "Can I rest a bit?",
      "source": "Tatoeba",
      "sourceId": 334654,
      "translationId": 338305
    },
    {
      "id": "beginner-254",
      "level": "beginner",
      "zh": "你的中文老师是谁？",
      "en": "Who is your Chinese teacher?",
      "source": "Tatoeba",
      "sourceId": 335142,
      "translationId": 335141
    },
    {
      "id": "beginner-255",
      "level": "beginner",
      "zh": "我准备好了，你们呢？",
      "en": "I'm ready. And you?",
      "source": "Tatoeba",
      "sourceId": 9965482,
      "translationId": 2671683
    },
    {
      "id": "beginner-256",
      "level": "beginner",
      "zh": "这本书明年要出版。",
      "en": "This book will be printed next year.",
      "source": "Tatoeba",
      "sourceId": 398933,
      "translationId": 56853
    },
    {
      "id": "beginner-257",
      "level": "beginner",
      "zh": "她从家里跑了出来。",
      "en": "She's running from home.",
      "source": "Tatoeba",
      "sourceId": 1944807,
      "translationId": 1570754
    },
    {
      "id": "beginner-258",
      "level": "beginner",
      "zh": "他在打扫他的房间。",
      "en": "He was cleaning his room.",
      "source": "Tatoeba",
      "sourceId": 358288,
      "translationId": 298837
    },
    {
      "id": "beginner-259",
      "level": "beginner",
      "zh": "放学后我打了网球。",
      "en": "I played tennis after school.",
      "source": "Tatoeba",
      "sourceId": 1238175,
      "translationId": 261707
    },
    {
      "id": "beginner-260",
      "level": "beginner",
      "zh": "请给我找一把椅子。",
      "en": "Get me a chair, please.",
      "source": "Tatoeba",
      "sourceId": 394594,
      "translationId": 66451
    },
    {
      "id": "beginner-261",
      "level": "beginner",
      "zh": "我是跑得最快的人。",
      "en": "I am the fastest runner.",
      "source": "Tatoeba",
      "sourceId": 917826,
      "translationId": 257652
    },
    {
      "id": "beginner-262",
      "level": "beginner",
      "zh": "你不是我的女朋友。",
      "en": "You're not my girlfriend.",
      "source": "Tatoeba",
      "sourceId": 9387471,
      "translationId": 2545042
    },
    {
      "id": "beginner-263",
      "level": "beginner",
      "zh": "他不是我的男朋友。",
      "en": "He's not my boyfriend.",
      "source": "Tatoeba",
      "sourceId": 8934410,
      "translationId": 1935032
    },
    {
      "id": "beginner-264",
      "level": "beginner",
      "zh": "这是你的兴趣爱好吗？",
      "en": "Is this your hobby?",
      "source": "Tatoeba",
      "sourceId": 9991915,
      "translationId": 10372327
    },
    {
      "id": "beginner-265",
      "level": "beginner",
      "zh": "你怎么认为我做不了？",
      "en": "What makes you think I won't be able to do it?",
      "source": "Tatoeba",
      "sourceId": 5611682,
      "translationId": 3738707
    },
    {
      "id": "beginner-266",
      "level": "beginner",
      "zh": "我们在学习西班牙语。",
      "en": "We are learning Spanish.",
      "source": "Tatoeba",
      "sourceId": 1878338,
      "translationId": 1592896
    },
    {
      "id": "beginner-267",
      "level": "beginner",
      "zh": "我的生日马上就要到了。",
      "en": "My birthday approaches.",
      "source": "Tatoeba",
      "sourceId": 1870551,
      "translationId": 808500
    },
    {
      "id": "beginner-268",
      "level": "beginner",
      "zh": "不知道怎么回事，她昨天晚上没回家。",
      "en": "For some reason she didn't come home last night.",
      "source": "Tatoeba",
      "sourceId": 4262132,
      "translationId": 2605147
    },
    {
      "id": "beginner-269",
      "level": "beginner",
      "zh": "这是本关于星星的书。",
      "en": "This is a book about stars.",
      "source": "Tatoeba",
      "sourceId": 7772079,
      "translationId": 55552
    },
    {
      "id": "beginner-270",
      "level": "beginner",
      "zh": "这对我来说全是新的。",
      "en": "All this is new to me.",
      "source": "Tatoeba",
      "sourceId": 5631899,
      "translationId": 4325122
    },
    {
      "id": "beginner-271",
      "level": "beginner",
      "zh": "日本人每天都会吃寿司吗？",
      "en": "Do Japanese people eat sushi every day?",
      "source": "Tatoeba",
      "sourceId": 8865163,
      "translationId": 3255262
    },
    {
      "id": "beginner-272",
      "level": "beginner",
      "zh": "你是不是刚认识他？",
      "en": "Did you just get to know him?",
      "source": "Tatoeba",
      "sourceId": 784403,
      "translationId": 785437
    },
    {
      "id": "beginner-273",
      "level": "beginner",
      "zh": "如果你明天有空，我们就可以一起吃午饭了。",
      "en": "If you have free time tomorrow, we could eat lunch together.",
      "source": "Tatoeba",
      "sourceId": 381899,
      "translationId": 7808084
    },
    {
      "id": "beginner-274",
      "level": "beginner",
      "zh": "先生，您把您的打火机留在桌子上了。",
      "en": "Sir, you have left your lighter on the table.",
      "source": "Tatoeba",
      "sourceId": 336182,
      "translationId": 64667
    },
    {
      "id": "beginner-275",
      "level": "beginner",
      "zh": "今天是二零一六年十一月二十三日。",
      "en": "Today is the twenty-third of November twenty-sixteen.",
      "source": "Tatoeba",
      "sourceId": 6486872,
      "translationId": 10542089
    },
    {
      "id": "beginner-276",
      "level": "beginner",
      "zh": "我跟她有很多共同点。",
      "en": "I have a lot in common with her.",
      "source": "Tatoeba",
      "sourceId": 11698188,
      "translationId": 11378955
    },
    {
      "id": "beginner-277",
      "level": "beginner",
      "zh": "那个教授讲得太快了，没有一个人听得懂。",
      "en": "The professor spoke too fast for anyone to understand.",
      "source": "Tatoeba",
      "sourceId": 8727887,
      "translationId": 48674
    },
    {
      "id": "beginner-278",
      "level": "beginner",
      "zh": "她很懂汉字。",
      "en": "She knows the Chinese characters very well.",
      "source": "Tatoeba",
      "sourceId": 3672863,
      "translationId": 3378167
    },
    {
      "id": "beginner-279",
      "level": "beginner",
      "zh": "他天黑前能回家。",
      "en": "He was able to get home before dark.",
      "source": "Tatoeba",
      "sourceId": 13117580,
      "translationId": 530741
    },
    {
      "id": "beginner-280",
      "level": "beginner",
      "zh": "我想买一只狗。",
      "en": "I wanted to buy a dog.",
      "source": "Tatoeba",
      "sourceId": 9415394,
      "translationId": 8071444
    },
    {
      "id": "beginner-281",
      "level": "beginner",
      "zh": "他正在打电话。",
      "en": "He's talking on the telephone.",
      "source": "Tatoeba",
      "sourceId": 334343,
      "translationId": 301814
    },
    {
      "id": "beginner-282",
      "level": "beginner",
      "zh": "让她中午过来。",
      "en": "Tell her to come at noon.",
      "source": "Tatoeba",
      "sourceId": 375286,
      "translationId": 308906
    },
    {
      "id": "beginner-283",
      "level": "beginner",
      "zh": "这周我非常忙。",
      "en": "I'm very busy this week.",
      "source": "Tatoeba",
      "sourceId": 8692954,
      "translationId": 242108
    },
    {
      "id": "beginner-284",
      "level": "beginner",
      "zh": "我以为你想等。",
      "en": "I thought you wanted to wait.",
      "source": "Tatoeba",
      "sourceId": 2390037,
      "translationId": 1961721
    },
    {
      "id": "beginner-285",
      "level": "beginner",
      "zh": "想让他读这个。",
      "en": "I want him to read this.",
      "source": "Tatoeba",
      "sourceId": 3630309,
      "translationId": 284568
    },
    {
      "id": "beginner-286",
      "level": "beginner",
      "zh": "来跟我喝茶吧。",
      "en": "Come and have tea with me.",
      "source": "Tatoeba",
      "sourceId": 6089788,
      "translationId": 64191
    },
    {
      "id": "beginner-287",
      "level": "beginner",
      "zh": "我会说一点儿。",
      "en": "I can talk for a bit.",
      "source": "Tatoeba",
      "sourceId": 2430521,
      "translationId": 2431100
    },
    {
      "id": "beginner-288",
      "level": "beginner",
      "zh": "他现在出去了。",
      "en": "He's out at the moment.",
      "source": "Tatoeba",
      "sourceId": 335030,
      "translationId": 10654922
    },
    {
      "id": "beginner-289",
      "level": "beginner",
      "zh": "我能关电视吗？",
      "en": "Can I turn off the TV?",
      "source": "Tatoeba",
      "sourceId": 472983,
      "translationId": 39139
    },
    {
      "id": "beginner-290",
      "level": "beginner",
      "zh": "你明白他想说些什么吗？",
      "en": "Can you make out what he is trying to say?",
      "source": "Tatoeba",
      "sourceId": 1939367,
      "translationId": 283427
    },
    {
      "id": "beginner-291",
      "level": "beginner",
      "zh": "他是什么样子的男人啊？",
      "en": "What kind of man was he?",
      "source": "Tatoeba",
      "sourceId": 839261,
      "translationId": 802933
    },
    {
      "id": "beginner-292",
      "level": "beginner",
      "zh": "你是我们唯一的希望。",
      "en": "You are our only hope.",
      "source": "Tatoeba",
      "sourceId": 1394896,
      "translationId": 1126719
    },
    {
      "id": "beginner-293",
      "level": "beginner",
      "zh": "他们教我们说话。",
      "en": "They teach us to speak.",
      "source": "Tatoeba",
      "sourceId": 3378280,
      "translationId": 3378281
    },
    {
      "id": "beginner-294",
      "level": "beginner",
      "zh": "我记得看过这部电影。",
      "en": "I remember seeing the movie.",
      "source": "Tatoeba",
      "sourceId": 745901,
      "translationId": 49514
    },
    {
      "id": "beginner-295",
      "level": "beginner",
      "zh": "我试过告诉你的。",
      "en": "I tried to tell you.",
      "source": "Tatoeba",
      "sourceId": 714794,
      "translationId": 41064
    },
    {
      "id": "beginner-296",
      "level": "beginner",
      "zh": "这本书不是我的。",
      "en": "This book isn't mine.",
      "source": "Tatoeba",
      "sourceId": 763414,
      "translationId": 726366
    },
    {
      "id": "beginner-297",
      "level": "beginner",
      "zh": "他们玩得很高兴。",
      "en": "They have a good time.",
      "source": "Tatoeba",
      "sourceId": 2357749,
      "translationId": 2357751
    },
    {
      "id": "beginner-298",
      "level": "beginner",
      "zh": "对不起，我听不懂。",
      "en": "Sorry, I don't understand.",
      "source": "Tatoeba",
      "sourceId": 1105648,
      "translationId": 1159735
    },
    {
      "id": "beginner-299",
      "level": "beginner",
      "zh": "我希望能见到你。",
      "en": "I hope to see you.",
      "source": "Tatoeba",
      "sourceId": 389391,
      "translationId": 63893
    },
    {
      "id": "beginner-300",
      "level": "beginner",
      "zh": "我在叫他们回来。",
      "en": "I'm calling them back.",
      "source": "Tatoeba",
      "sourceId": 5624884,
      "translationId": 3918850
    },
    {
      "id": "beginner-301",
      "level": "beginner",
      "zh": "今天是个好日子。",
      "en": "Today is a good day.",
      "source": "Tatoeba",
      "sourceId": 922230,
      "translationId": 922232
    },
    {
      "id": "beginner-302",
      "level": "beginner",
      "zh": "这部电影真的很好看。",
      "en": "The movie was really good.",
      "source": "Tatoeba",
      "sourceId": 9958206,
      "translationId": 5077903
    },
    {
      "id": "beginner-303",
      "level": "beginner",
      "zh": "那不是我的问题。",
      "en": "That isn't my problem.",
      "source": "Tatoeba",
      "sourceId": 736549,
      "translationId": 1897754
    },
    {
      "id": "beginner-304",
      "level": "beginner",
      "zh": "你看起来不高兴。",
      "en": "You don't seem happy.",
      "source": "Tatoeba",
      "sourceId": 2694365,
      "translationId": 2044480
    },
    {
      "id": "beginner-305",
      "level": "beginner",
      "zh": "她是个迷人的女孩子。",
      "en": "She's a glamorous girl.",
      "source": "Tatoeba",
      "sourceId": 2518656,
      "translationId": 310767
    },
    {
      "id": "beginner-306",
      "level": "beginner",
      "zh": "你做饭做得很好吃。",
      "en": "Your cooking is delicious.",
      "source": "Tatoeba",
      "sourceId": 1728948,
      "translationId": 1734905
    },
    {
      "id": "beginner-307",
      "level": "beginner",
      "zh": "你们怎么读这个词？",
      "en": "How do you pronounce this word?",
      "source": "Tatoeba",
      "sourceId": 345739,
      "translationId": 57963
    },
    {
      "id": "beginner-308",
      "level": "beginner",
      "zh": "这家饭馆开门了吗？",
      "en": "Is this restaurant open?",
      "source": "Tatoeba",
      "sourceId": 2918350,
      "translationId": 2918354
    },
    {
      "id": "beginner-309",
      "level": "beginner",
      "zh": "请问，现在什么时候？",
      "en": "Excuse me, what time is it?",
      "source": "Tatoeba",
      "sourceId": 382996,
      "translationId": 385392
    },
    {
      "id": "beginner-310",
      "level": "beginner",
      "zh": "这幢楼以前是医院。",
      "en": "Formerly this building was a hospital.",
      "source": "Tatoeba",
      "sourceId": 791618,
      "translationId": 272166
    },
    {
      "id": "beginner-311",
      "level": "beginner",
      "zh": "我只想要一件东西。",
      "en": "I only want one.",
      "source": "Tatoeba",
      "sourceId": 7774358,
      "translationId": 1956085
    },
    {
      "id": "beginner-312",
      "level": "beginner",
      "zh": "电影已经开始了吗？",
      "en": "Has the movie started?",
      "source": "Tatoeba",
      "sourceId": 349924,
      "translationId": 9807129
    },
    {
      "id": "beginner-313",
      "level": "beginner",
      "zh": "你们午饭吃了什么？",
      "en": "What did you have for lunch?",
      "source": "Tatoeba",
      "sourceId": 7772627,
      "translationId": 2643465
    },
    {
      "id": "beginner-314",
      "level": "beginner",
      "zh": "水位上升得非常快。",
      "en": "The water level rises very quickly.",
      "source": "Tatoeba",
      "sourceId": 6581671,
      "translationId": 6581021
    },
    {
      "id": "beginner-315",
      "level": "beginner",
      "zh": "我昨天非常想念你。",
      "en": "I missed you very much yesterday.",
      "source": "Tatoeba",
      "sourceId": 848418,
      "translationId": 244514
    },
    {
      "id": "beginner-316",
      "level": "beginner",
      "zh": "你们是加拿大人吗？",
      "en": "Are you guys Canadians?",
      "source": "Tatoeba",
      "sourceId": 12378260,
      "translationId": 8407304
    },
    {
      "id": "beginner-317",
      "level": "beginner",
      "zh": "没有一个朋友来了。",
      "en": "Not one friend came.",
      "source": "Tatoeba",
      "sourceId": 843468,
      "translationId": 4728211
    },
    {
      "id": "beginner-318",
      "level": "beginner",
      "zh": "我觉得我们老板很蠢，这我就只跟你说。",
      "en": "Between you and me, I think our boss is stupid.",
      "source": "Tatoeba",
      "sourceId": 813560,
      "translationId": 62027
    },
    {
      "id": "beginner-319",
      "level": "beginner",
      "zh": "我的学校里有个乐队。",
      "en": "There's a band at my school.",
      "source": "Tatoeba",
      "sourceId": 2357595,
      "translationId": 2381342
    },
    {
      "id": "beginner-320",
      "level": "beginner",
      "zh": "他是两人之中最大的。",
      "en": "He is the older of the two.",
      "source": "Tatoeba",
      "sourceId": 688838,
      "translationId": 288492
    },
    {
      "id": "beginner-321",
      "level": "beginner",
      "zh": "我要是个独子就好了。",
      "en": "I wish I were an only child.",
      "source": "Tatoeba",
      "sourceId": 4906169,
      "translationId": 3054089
    },
    {
      "id": "beginner-322",
      "level": "beginner",
      "zh": "请来两杯茶和一杯咖啡。",
      "en": "Two teas and a coffee, please.",
      "source": "Tatoeba",
      "sourceId": 335007,
      "translationId": 240960
    },
    {
      "id": "beginner-323",
      "level": "beginner",
      "zh": "我希望你在和我说实话。",
      "en": "I hope you're telling me the truth.",
      "source": "Tatoeba",
      "sourceId": 10983111,
      "translationId": 8234573
    },
    {
      "id": "beginner-324",
      "level": "beginner",
      "zh": "我喜欢打网球和高尔夫球。",
      "en": "I like playing tennis and golf.",
      "source": "Tatoeba",
      "sourceId": 336665,
      "translationId": 39416
    },
    {
      "id": "beginner-325",
      "level": "beginner",
      "zh": "带着眼镜的那位老先生是一位中国小说家。",
      "en": "The man wearing glasses is an old Chinese author.",
      "source": "Tatoeba",
      "sourceId": 1577311,
      "translationId": 1577321
    },
    {
      "id": "beginner-326",
      "level": "beginner",
      "zh": "如果你不介意的话，我想一个人呆着。",
      "en": "I'd like to be alone if you don't mind.",
      "source": "Tatoeba",
      "sourceId": 9007586,
      "translationId": 1936534
    },
    {
      "id": "beginner-327",
      "level": "beginner",
      "zh": "你们是几位？",
      "en": "How many of you are there?",
      "source": "Tatoeba",
      "sourceId": 419685,
      "translationId": 68772
    },
    {
      "id": "beginner-328",
      "level": "beginner",
      "zh": "现在7点30分了。",
      "en": "Right now it's 7:30.",
      "source": "Tatoeba",
      "sourceId": 2335918,
      "translationId": 11294080
    },
    {
      "id": "beginner-329",
      "level": "beginner",
      "zh": "你要多少钱？",
      "en": "How much money do you want?",
      "source": "Tatoeba",
      "sourceId": 476554,
      "translationId": 16790
    },
    {
      "id": "beginner-330",
      "level": "beginner",
      "zh": "我不想回去。",
      "en": "I don't wanna go back.",
      "source": "Tatoeba",
      "sourceId": 9963132,
      "translationId": 20450
    },
    {
      "id": "beginner-331",
      "level": "beginner",
      "zh": "我不能等你。",
      "en": "I can't wait for you.",
      "source": "Tatoeba",
      "sourceId": 833049,
      "translationId": 237702
    },
    {
      "id": "beginner-332",
      "level": "beginner",
      "zh": "他没有朋友。",
      "en": "He doesn't have any friends.",
      "source": "Tatoeba",
      "sourceId": 2241812,
      "translationId": 284930
    },
    {
      "id": "beginner-333",
      "level": "beginner",
      "zh": "书桌下有一只猫。",
      "en": "There's a cat under the desk.",
      "source": "Tatoeba",
      "sourceId": 336604,
      "translationId": 9013940
    },
    {
      "id": "beginner-334",
      "level": "beginner",
      "zh": "我知道我做错了。",
      "en": "I know what I did was wrong.",
      "source": "Tatoeba",
      "sourceId": 5663534,
      "translationId": 2376270
    },
    {
      "id": "beginner-335",
      "level": "beginner",
      "zh": "请你给我一杯水。",
      "en": "Please give me a cup of water.",
      "source": "Tatoeba",
      "sourceId": 334646,
      "translationId": 387566
    },
    {
      "id": "beginner-336",
      "level": "beginner",
      "zh": "我明天不工作。",
      "en": "I don't work tomorrow.",
      "source": "Tatoeba",
      "sourceId": 2306416,
      "translationId": 2306419
    },
    {
      "id": "beginner-337",
      "level": "beginner",
      "zh": "你在找工作吗？",
      "en": "Are you looking for work?",
      "source": "Tatoeba",
      "sourceId": 3671516,
      "translationId": 1959341
    },
    {
      "id": "beginner-338",
      "level": "beginner",
      "zh": "这就是车站吗？",
      "en": "Is this the train station?",
      "source": "Tatoeba",
      "sourceId": 2318424,
      "translationId": 1460446
    },
    {
      "id": "beginner-339",
      "level": "beginner",
      "zh": "我送你回家吧。",
      "en": "Let me take you home.",
      "source": "Tatoeba",
      "sourceId": 526394,
      "translationId": 64245
    },
    {
      "id": "beginner-340",
      "level": "beginner",
      "zh": "你就是要面子。",
      "en": "You're only saving face!",
      "source": "Tatoeba",
      "sourceId": 3341549,
      "translationId": 1362559
    },
    {
      "id": "beginner-341",
      "level": "beginner",
      "zh": "你不可以出去。",
      "en": "You can't go out.",
      "source": "Tatoeba",
      "sourceId": 366910,
      "translationId": 21990
    },
    {
      "id": "beginner-342",
      "level": "beginner",
      "zh": "我正在读汉字。",
      "en": "I am pronouncing Chinese words.",
      "source": "Tatoeba",
      "sourceId": 1749271,
      "translationId": 1686852
    },
    {
      "id": "beginner-343",
      "level": "beginner",
      "zh": "我晚点打给你。",
      "en": "I will call you later.",
      "source": "Tatoeba",
      "sourceId": 345859,
      "translationId": 9409578
    },
    {
      "id": "beginner-344",
      "level": "beginner",
      "zh": "你们出门了吗？",
      "en": "Did you guys go out?",
      "source": "Tatoeba",
      "sourceId": 2300112,
      "translationId": 2301438
    },
    {
      "id": "beginner-345",
      "level": "beginner",
      "zh": "谁教了你说话？",
      "en": "Who taught you to speak?",
      "source": "Tatoeba",
      "sourceId": 3377927,
      "translationId": 3377928
    },
    {
      "id": "beginner-346",
      "level": "beginner",
      "zh": "问一下不要钱。",
      "en": "Nothing is lost for asking.",
      "source": "Tatoeba",
      "sourceId": 805106,
      "translationId": 320087
    },
    {
      "id": "beginner-347",
      "level": "beginner",
      "zh": "我非常同意你。",
      "en": "I really agree with you.",
      "source": "Tatoeba",
      "sourceId": 918032,
      "translationId": 2381339
    },
    {
      "id": "beginner-348",
      "level": "beginner",
      "zh": "我坐在他旁边。",
      "en": "I sat by his side.",
      "source": "Tatoeba",
      "sourceId": 334889,
      "translationId": 250343
    },
    {
      "id": "beginner-349",
      "level": "beginner",
      "zh": "你喝了多少酒？",
      "en": "How much did you drink?",
      "source": "Tatoeba",
      "sourceId": 13137631,
      "translationId": 5203269
    },
    {
      "id": "beginner-350",
      "level": "beginner",
      "zh": "我以前打网球。",
      "en": "I used to play tennis.",
      "source": "Tatoeba",
      "sourceId": 4623415,
      "translationId": 453663
    },
    {
      "id": "beginner-351",
      "level": "beginner",
      "zh": "你和谁说话呢？",
      "en": "Who did you talk with?",
      "source": "Tatoeba",
      "sourceId": 7771910,
      "translationId": 1042637
    },
    {
      "id": "beginner-352",
      "level": "beginner",
      "zh": "男孩子在那里。",
      "en": "The boy is over there.",
      "source": "Tatoeba",
      "sourceId": 1264904,
      "translationId": 45404
    },
    {
      "id": "beginner-353",
      "level": "beginner",
      "zh": "我就是这样的。",
      "en": "I am as I am.",
      "source": "Tatoeba",
      "sourceId": 9779604,
      "translationId": 9777136
    },
    {
      "id": "beginner-354",
      "level": "beginner",
      "zh": "我们有多远了？",
      "en": "How far away are we?",
      "source": "Tatoeba",
      "sourceId": 7768295,
      "translationId": 619764
    },
    {
      "id": "beginner-355",
      "level": "beginner",
      "zh": "我们不在中国。",
      "en": "We're not in China.",
      "source": "Tatoeba",
      "sourceId": 13881309,
      "translationId": 7776977
    },
    {
      "id": "beginner-356",
      "level": "beginner",
      "zh": "那可能太晚了。",
      "en": "That could be too late.",
      "source": "Tatoeba",
      "sourceId": 6548848,
      "translationId": 3723479
    },
    {
      "id": "beginner-357",
      "level": "beginner",
      "zh": "你家里都有谁？",
      "en": "Who do you live with?",
      "source": "Tatoeba",
      "sourceId": 3537983,
      "translationId": 700113
    },
    {
      "id": "beginner-358",
      "level": "beginner",
      "zh": "我以前常在那儿。",
      "en": "I was often there.",
      "source": "Tatoeba",
      "sourceId": 1516204,
      "translationId": 942450
    },
    {
      "id": "beginner-359",
      "level": "beginner",
      "zh": "他们从不做运动。",
      "en": "They never do exercise.",
      "source": "Tatoeba",
      "sourceId": 843480,
      "translationId": 7843024
    },
    {
      "id": "beginner-360",
      "level": "beginner",
      "zh": "那个女人在哪里？",
      "en": "Where is that woman?",
      "source": "Tatoeba",
      "sourceId": 2217670,
      "translationId": 9414941
    },
    {
      "id": "beginner-361",
      "level": "beginner",
      "zh": "你已经吃过饭了！",
      "en": "You've already eaten!",
      "source": "Tatoeba",
      "sourceId": 9991927,
      "translationId": 10372332
    },
    {
      "id": "beginner-362",
      "level": "beginner",
      "zh": "这是我们的学校。",
      "en": "This is my school.",
      "source": "Tatoeba",
      "sourceId": 2386259,
      "translationId": 1255406
    },
    {
      "id": "beginner-363",
      "level": "beginner",
      "zh": "昨天我吃了米饭。",
      "en": "Yesterday I ate rice.",
      "source": "Tatoeba",
      "sourceId": 10171225,
      "translationId": 7356202
    },
    {
      "id": "beginner-364",
      "level": "beginner",
      "zh": "你现在在哪里呢？",
      "en": "Where are you now?",
      "source": "Tatoeba",
      "sourceId": 1468442,
      "translationId": 679375
    },
    {
      "id": "beginner-365",
      "level": "beginner",
      "zh": "我们在哪儿见面？",
      "en": "Where shall we meet?",
      "source": "Tatoeba",
      "sourceId": 6402753,
      "translationId": 38177
    },
    {
      "id": "beginner-366",
      "level": "beginner",
      "zh": "她有绿色的眼睛。",
      "en": "She has green eyes.",
      "source": "Tatoeba",
      "sourceId": 3076586,
      "translationId": 1463505
    },
    {
      "id": "beginner-367",
      "level": "beginner",
      "zh": "我看见五个男人。",
      "en": "I saw five men.",
      "source": "Tatoeba",
      "sourceId": 1372536,
      "translationId": 370730
    },
    {
      "id": "beginner-368",
      "level": "beginner",
      "zh": "你能告诉我你为什么喜欢她吗？",
      "en": "Could you tell me why you love her?",
      "source": "Tatoeba",
      "sourceId": 389444,
      "translationId": 10639838
    },
    {
      "id": "beginner-369",
      "level": "beginner",
      "zh": "我将明天和他见面。",
      "en": "I'll meet him tomorrow.",
      "source": "Tatoeba",
      "sourceId": 933959,
      "translationId": 509196
    },
    {
      "id": "beginner-370",
      "level": "beginner",
      "zh": "给我看看你哪里痛。",
      "en": "Show me where it hurts.",
      "source": "Tatoeba",
      "sourceId": 714790,
      "translationId": 2234198
    },
    {
      "id": "beginner-371",
      "level": "beginner",
      "zh": "电影什么时候开始？",
      "en": "When did the movie start?",
      "source": "Tatoeba",
      "sourceId": 3378294,
      "translationId": 3378295
    },
    {
      "id": "beginner-372",
      "level": "beginner",
      "zh": "这个女人在说什么？",
      "en": "What is the woman saying?",
      "source": "Tatoeba",
      "sourceId": 2777866,
      "translationId": 2771781
    },
    {
      "id": "beginner-373",
      "level": "beginner",
      "zh": "打扫一下你的房间。",
      "en": "Clean your room.",
      "source": "Tatoeba",
      "sourceId": 7768207,
      "translationId": 435774
    },
    {
      "id": "beginner-374",
      "level": "beginner",
      "zh": "她们只是胡说八道。",
      "en": "They're just talking shit.",
      "source": "Tatoeba",
      "sourceId": 2390038,
      "translationId": 2199135
    },
    {
      "id": "beginner-375",
      "level": "beginner",
      "zh": "不要再打扰我们了。",
      "en": "Don't bother us anymore.",
      "source": "Tatoeba",
      "sourceId": 9739381,
      "translationId": 6799151
    },
    {
      "id": "beginner-376",
      "level": "beginner",
      "zh": "如果我知道你生病了，我会去医院看望你。",
      "en": "If I knew you were sick, I would have gone to the hospital to pay you a visit.",
      "source": "Tatoeba",
      "sourceId": 918530,
      "translationId": 7251704
    },
    {
      "id": "beginner-377",
      "level": "beginner",
      "zh": "就是没有人陪我，我也要去看这部电影。",
      "en": "Even if no one goes with me, I still want to see this movie.",
      "source": "Tatoeba",
      "sourceId": 381906,
      "translationId": 5937320
    },
    {
      "id": "beginner-378",
      "level": "beginner",
      "zh": "你为什么要和他说话？",
      "en": "Why did you speak to him?",
      "source": "Tatoeba",
      "sourceId": 13882181,
      "translationId": 11886658
    },
    {
      "id": "beginner-379",
      "level": "beginner",
      "zh": "有什么事我可以做吗？",
      "en": "Is there anything I can do?",
      "source": "Tatoeba",
      "sourceId": 6197254,
      "translationId": 1886895
    },
    {
      "id": "beginner-380",
      "level": "beginner",
      "zh": "说实在的，我真的喜欢你。",
      "en": "Honestly, I really like you.",
      "source": "Tatoeba",
      "sourceId": 3703826,
      "translationId": 3703828
    },
    {
      "id": "beginner-381",
      "level": "beginner",
      "zh": "你最喜欢哪位作曲家？",
      "en": "Which of the composers do you like best?",
      "source": "Tatoeba",
      "sourceId": 5655341,
      "translationId": 244310
    },
    {
      "id": "beginner-382",
      "level": "beginner",
      "zh": "他把我的病给医好了。",
      "en": "He cured my illness.",
      "source": "Tatoeba",
      "sourceId": 2029367,
      "translationId": 297977
    },
    {
      "id": "beginner-383",
      "level": "beginner",
      "zh": "十二月有三十一天。",
      "en": "December has thirty-one days.",
      "source": "Tatoeba",
      "sourceId": 1440499,
      "translationId": 664032
    },
    {
      "id": "beginner-384",
      "level": "beginner",
      "zh": "你的后门是开着的。",
      "en": "Your back door was open.",
      "source": "Tatoeba",
      "sourceId": 11508939,
      "translationId": 11508938
    },
    {
      "id": "beginner-385",
      "level": "beginner",
      "zh": "他很会教育人所以他的孩子都很听话。",
      "en": "He's a very good teacher, so his children really listen to him.",
      "source": "Tatoeba",
      "sourceId": 1488564,
      "translationId": 1495325
    },
    {
      "id": "beginner-386",
      "level": "beginner",
      "zh": "我只想忘记。",
      "en": "I only wanted to forget.",
      "source": "Tatoeba",
      "sourceId": 5965738,
      "translationId": 3728066
    },
    {
      "id": "beginner-387",
      "level": "beginner",
      "zh": "您走太快了。",
      "en": "You're walking too fast.",
      "source": "Tatoeba",
      "sourceId": 9968956,
      "translationId": 6867767
    },
    {
      "id": "beginner-388",
      "level": "beginner",
      "zh": "他不打篮球。",
      "en": "He doesn't play basketball.",
      "source": "Tatoeba",
      "sourceId": 9982223,
      "translationId": 9024093
    },
    {
      "id": "beginner-389",
      "level": "beginner",
      "zh": "我昨天不忙。",
      "en": "I wasn't busy yesterday.",
      "source": "Tatoeba",
      "sourceId": 832935,
      "translationId": 257810
    },
    {
      "id": "beginner-390",
      "level": "beginner",
      "zh": "我可以等你。",
      "en": "I can wait for you.",
      "source": "Tatoeba",
      "sourceId": 918078,
      "translationId": 64310
    },
    {
      "id": "beginner-391",
      "level": "beginner",
      "zh": "我很好，你呢？",
      "en": "I am fine, and you?",
      "source": "Tatoeba",
      "sourceId": 10338215,
      "translationId": 872223
    },
    {
      "id": "beginner-392",
      "level": "beginner",
      "zh": "你有朋友吗？",
      "en": "Do you have any friends?",
      "source": "Tatoeba",
      "sourceId": 9959099,
      "translationId": 2685988
    },
    {
      "id": "beginner-393",
      "level": "beginner",
      "zh": "现在太晚了。",
      "en": "It's too late now.",
      "source": "Tatoeba",
      "sourceId": 3539203,
      "translationId": 65909
    },
    {
      "id": "beginner-394",
      "level": "beginner",
      "zh": "我要一条鱼。",
      "en": "I'd like a fish.",
      "source": "Tatoeba",
      "sourceId": 5568438,
      "translationId": 661518
    },
    {
      "id": "beginner-395",
      "level": "beginner",
      "zh": "我们要回家。",
      "en": "We're going back home.",
      "source": "Tatoeba",
      "sourceId": 10982872,
      "translationId": 3635893
    },
    {
      "id": "beginner-396",
      "level": "beginner",
      "zh": "你要点菜吗？",
      "en": "Would you like to order?",
      "source": "Tatoeba",
      "sourceId": 348255,
      "translationId": 54373
    },
    {
      "id": "beginner-397",
      "level": "beginner",
      "zh": "她七点起床。",
      "en": "She gets up at seven.",
      "source": "Tatoeba",
      "sourceId": 743100,
      "translationId": 743104
    },
    {
      "id": "beginner-398",
      "level": "beginner",
      "zh": "看看你能跳多高。",
      "en": "See how high you can jump.",
      "source": "Tatoeba",
      "sourceId": 6147593,
      "translationId": 2744935
    },
    {
      "id": "beginner-399",
      "level": "beginner",
      "zh": "你是不是想坐下？",
      "en": "Do you want to sit down?",
      "source": "Tatoeba",
      "sourceId": 1307774,
      "translationId": 64486
    },
    {
      "id": "beginner-400",
      "level": "beginner",
      "zh": "我儿子不听我话。",
      "en": "My son doesn't obey me.",
      "source": "Tatoeba",
      "sourceId": 4764610,
      "translationId": 4759178
    },
    {
      "id": "beginner-401",
      "level": "beginner",
      "zh": "那是公司的钱。",
      "en": "That's company money.",
      "source": "Tatoeba",
      "sourceId": 11698268,
      "translationId": 12136697
    },
    {
      "id": "beginner-402",
      "level": "beginner",
      "zh": "他们都很喜欢。",
      "en": "They all loved it.",
      "source": "Tatoeba",
      "sourceId": 11508828,
      "translationId": 5383122
    },
    {
      "id": "beginner-403",
      "level": "beginner",
      "zh": "他是医生来的。",
      "en": "He is a doctor.",
      "source": "Tatoeba",
      "sourceId": 8593079,
      "translationId": 293611
    },
    {
      "id": "beginner-404",
      "level": "beginner",
      "zh": "他们住在哪里？",
      "en": "Where do they live?",
      "source": "Tatoeba",
      "sourceId": 1888742,
      "translationId": 687608
    },
    {
      "id": "beginner-405",
      "level": "beginner",
      "zh": "今天可能下雨。",
      "en": "It may rain today.",
      "source": "Tatoeba",
      "sourceId": 11837420,
      "translationId": 11837423
    },
    {
      "id": "beginner-406",
      "level": "beginner",
      "zh": "这本书是我的。",
      "en": "This book is mine.",
      "source": "Tatoeba",
      "sourceId": 1870358,
      "translationId": 516622
    },
    {
      "id": "beginner-407",
      "level": "beginner",
      "zh": "这是我的妻子。",
      "en": "This is my wife.",
      "source": "Tatoeba",
      "sourceId": 5640760,
      "translationId": 1898100
    },
    {
      "id": "beginner-408",
      "level": "beginner",
      "zh": "他就要出院了。",
      "en": "He'll be discharged.",
      "source": "Tatoeba",
      "sourceId": 13199804,
      "translationId": 12845126
    },
    {
      "id": "beginner-409",
      "level": "beginner",
      "zh": "你现在高兴吗？",
      "en": "Are you happy now?",
      "source": "Tatoeba",
      "sourceId": 5983647,
      "translationId": 971988
    },
    {
      "id": "beginner-410",
      "level": "beginner",
      "zh": "你眼睛不好吗？",
      "en": "Are your eyes bad?",
      "source": "Tatoeba",
      "sourceId": 10275180,
      "translationId": 68892
    },
    {
      "id": "beginner-411",
      "level": "beginner",
      "zh": "我可以喝酒吗？",
      "en": "Can I drink alcohol?",
      "source": "Tatoeba",
      "sourceId": 567980,
      "translationId": 64381
    },
    {
      "id": "beginner-412",
      "level": "beginner",
      "zh": "这些书是新的。",
      "en": "These books are new.",
      "source": "Tatoeba",
      "sourceId": 686937,
      "translationId": 55079
    },
    {
      "id": "beginner-413",
      "level": "beginner",
      "zh": "今天是星期一。",
      "en": "It's Monday today.",
      "source": "Tatoeba",
      "sourceId": 348445,
      "translationId": 437971
    },
    {
      "id": "beginner-414",
      "level": "beginner",
      "zh": "明天会下雨吗？",
      "en": "Will it rain tomorrow?",
      "source": "Tatoeba",
      "sourceId": 333928,
      "translationId": 475766
    },
    {
      "id": "beginner-415",
      "level": "beginner",
      "zh": "你还认识我吗？",
      "en": "Do you know me?",
      "source": "Tatoeba",
      "sourceId": 4835855,
      "translationId": 69295
    },
    {
      "id": "beginner-416",
      "level": "beginner",
      "zh": "现在就跟我来。",
      "en": "Come with me now.",
      "source": "Tatoeba",
      "sourceId": 1783795,
      "translationId": 1553527
    },
    {
      "id": "beginner-417",
      "level": "beginner",
      "zh": "他没有女朋友。",
      "en": "He has no girlfriend.",
      "source": "Tatoeba",
      "sourceId": 432313,
      "translationId": 284658
    },
    {
      "id": "beginner-418",
      "level": "beginner",
      "zh": "你不是日本人。",
      "en": "You are not Japanese.",
      "source": "Tatoeba",
      "sourceId": 4759784,
      "translationId": 69057
    },
    {
      "id": "beginner-419",
      "level": "beginner",
      "zh": "他是我的爸爸。",
      "en": "He is my father.",
      "source": "Tatoeba",
      "sourceId": 6051010,
      "translationId": 297979
    },
    {
      "id": "beginner-420",
      "level": "beginner",
      "zh": "你看上去很好。",
      "en": "You look very good.",
      "source": "Tatoeba",
      "sourceId": 5091401,
      "translationId": 1935382
    },
    {
      "id": "beginner-421",
      "level": "beginner",
      "zh": "我错过了很多。",
      "en": "I missed a lot.",
      "source": "Tatoeba",
      "sourceId": 9961275,
      "translationId": 3822929
    },
    {
      "id": "beginner-422",
      "level": "beginner",
      "zh": "他都告诉我了。",
      "en": "He told me everything.",
      "source": "Tatoeba",
      "sourceId": 1314397,
      "translationId": 1112373
    },
    {
      "id": "beginner-423",
      "level": "beginner",
      "zh": "您会告诉我吗？",
      "en": "Could you tell me?",
      "source": "Tatoeba",
      "sourceId": 1659816,
      "translationId": 1663393
    },
    {
      "id": "beginner-424",
      "level": "beginner",
      "zh": "现在我想起来了。",
      "en": "Now I remember.",
      "source": "Tatoeba",
      "sourceId": 472898,
      "translationId": 72076
    },
    {
      "id": "beginner-425",
      "level": "beginner",
      "zh": "有时间打给我吧。",
      "en": "Call me sometime.",
      "source": "Tatoeba",
      "sourceId": 9007394,
      "translationId": 66339
    },
    {
      "id": "beginner-426",
      "level": "beginner",
      "zh": "你可以告诉我我下一步该做什么吗？",
      "en": "Could you tell me what I should do next?",
      "source": "Tatoeba",
      "sourceId": 10983023,
      "translationId": 10654851
    },
    {
      "id": "beginner-427",
      "level": "beginner",
      "zh": "你可以随便去哪儿。",
      "en": "You may go anywhere.",
      "source": "Tatoeba",
      "sourceId": 469417,
      "translationId": 16250
    },
    {
      "id": "beginner-428",
      "level": "beginner",
      "zh": "我的包裹到哪里了？",
      "en": "Where's my package?",
      "source": "Tatoeba",
      "sourceId": 10913660,
      "translationId": 10968467
    },
    {
      "id": "beginner-429",
      "level": "beginner",
      "zh": "多么出色的晚饭啊！",
      "en": "What a splendid dinner!",
      "source": "Tatoeba",
      "sourceId": 5613669,
      "translationId": 36032
    },
    {
      "id": "beginner-430",
      "level": "beginner",
      "zh": "你是我的理想情人。",
      "en": "You're the girl of my dreams.",
      "source": "Tatoeba",
      "sourceId": 1399732,
      "translationId": 1357331
    },
    {
      "id": "beginner-431",
      "level": "beginner",
      "zh": "我也喝两杯茶。",
      "en": "I also drink two cups of tea.",
      "source": "Tatoeba",
      "sourceId": 3378131,
      "translationId": 3378132
    },
    {
      "id": "beginner-432",
      "level": "beginner",
      "zh": "我坐在我车里。",
      "en": "I'm sitting here in my car.",
      "source": "Tatoeba",
      "sourceId": 5953330,
      "translationId": 2544102
    },
    {
      "id": "beginner-433",
      "level": "beginner",
      "zh": "他有很多幅名贵的画。",
      "en": "He has many valuable paintings.",
      "source": "Tatoeba",
      "sourceId": 3078801,
      "translationId": 7768876
    },
    {
      "id": "beginner-434",
      "level": "beginner",
      "zh": "哪首是你最喜欢的歌？",
      "en": "Which is your favorite song?",
      "source": "Tatoeba",
      "sourceId": 1695402,
      "translationId": 1697723
    },
    {
      "id": "beginner-435",
      "level": "beginner",
      "zh": "我想，但我不能。",
      "en": "I want to, but I can't.",
      "source": "Tatoeba",
      "sourceId": 4189345,
      "translationId": 4360429
    },
    {
      "id": "beginner-436",
      "level": "beginner",
      "zh": "你得等一等看。",
      "en": "We'll have to wait and see.",
      "source": "Tatoeba",
      "sourceId": 714332,
      "translationId": 3312061
    },
    {
      "id": "beginner-437",
      "level": "beginner",
      "zh": "不管他是上学还是做生意，我不会反对。",
      "en": "Whether he studies or goes into business, I won't stop him.",
      "source": "Tatoeba",
      "sourceId": 2202407,
      "translationId": 2202402
    },
    {
      "id": "beginner-438",
      "level": "beginner",
      "zh": "你想要另一杯咖啡吗？",
      "en": "Do you want another cup of coffee?",
      "source": "Tatoeba",
      "sourceId": 9955801,
      "translationId": 2540709
    },
    {
      "id": "beginner-439",
      "level": "beginner",
      "zh": "我不喜欢你的微笑。",
      "en": "I don't like your smile.",
      "source": "Tatoeba",
      "sourceId": 8589249,
      "translationId": 2315312
    },
    {
      "id": "beginner-440",
      "level": "beginner",
      "zh": "雪下得很大。",
      "en": "It's snowing heavily.",
      "source": "Tatoeba",
      "sourceId": 10648732,
      "translationId": 7547059
    },
    {
      "id": "beginner-441",
      "level": "beginner",
      "zh": "这天会到来。",
      "en": "That day shall come.",
      "source": "Tatoeba",
      "sourceId": 10260795,
      "translationId": 44579
    },
    {
      "id": "beginner-442",
      "level": "beginner",
      "zh": "真的就是他！",
      "en": "It's really him!",
      "source": "Tatoeba",
      "sourceId": 1642840,
      "translationId": 9408753
    },
    {
      "id": "beginner-443",
      "level": "beginner",
      "zh": "你们在工作。",
      "en": "You are at work.",
      "source": "Tatoeba",
      "sourceId": 5580892,
      "translationId": 7785092
    },
    {
      "id": "beginner-444",
      "level": "beginner",
      "zh": "我每天跑步。",
      "en": "I run every day.",
      "source": "Tatoeba",
      "sourceId": 414247,
      "translationId": 261849
    },
    {
      "id": "beginner-445",
      "level": "beginner",
      "zh": "别跟着来啊。",
      "en": "Don't follow me.",
      "source": "Tatoeba",
      "sourceId": 4885130,
      "translationId": 1849386
    },
    {
      "id": "beginner-446",
      "level": "beginner",
      "zh": "她是我女儿。",
      "en": "She is my daughter.",
      "source": "Tatoeba",
      "sourceId": 1428124,
      "translationId": 724404
    },
    {
      "id": "beginner-447",
      "level": "beginner",
      "zh": "你住在哪儿？",
      "en": "Where do you live?",
      "source": "Tatoeba",
      "sourceId": 391063,
      "translationId": 370708
    },
    {
      "id": "beginner-448",
      "level": "beginner",
      "zh": "没有希望了。",
      "en": "There's no hope.",
      "source": "Tatoeba",
      "sourceId": 9409433,
      "translationId": 1935443
    },
    {
      "id": "beginner-449",
      "level": "beginner",
      "zh": "周日我休息。",
      "en": "I rest on Sunday.",
      "source": "Tatoeba",
      "sourceId": 4764667,
      "translationId": 4754195
    },
    {
      "id": "beginner-450",
      "level": "beginner",
      "zh": "她的话很多。",
      "en": "She talks a lot.",
      "source": "Tatoeba",
      "sourceId": 944065,
      "translationId": 312397
    },
    {
      "id": "beginner-451",
      "level": "beginner",
      "zh": "你也是，儿子！",
      "en": "You are too, son!",
      "source": "Tatoeba",
      "sourceId": 651219,
      "translationId": 1165008
    },
    {
      "id": "beginner-452",
      "level": "beginner",
      "zh": "他正在游泳。",
      "en": "He's swimming now.",
      "source": "Tatoeba",
      "sourceId": 6475101,
      "translationId": 289261
    },
    {
      "id": "beginner-453",
      "level": "beginner",
      "zh": "这谁给你的？",
      "en": "Who gave you this?",
      "source": "Tatoeba",
      "sourceId": 4885110,
      "translationId": 1839632
    },
    {
      "id": "beginner-454",
      "level": "beginner",
      "zh": "谁是你老师？",
      "en": "Who is your teacher?",
      "source": "Tatoeba",
      "sourceId": 787631,
      "translationId": 17660
    },
    {
      "id": "beginner-455",
      "level": "beginner",
      "zh": "学校在哪儿？",
      "en": "Where is the school?",
      "source": "Tatoeba",
      "sourceId": 1054527,
      "translationId": 1054512
    },
    {
      "id": "beginner-456",
      "level": "beginner",
      "zh": "她家在哪儿？",
      "en": "Where is her house?",
      "source": "Tatoeba",
      "sourceId": 1691786,
      "translationId": 481895
    },
    {
      "id": "beginner-457",
      "level": "beginner",
      "zh": "你有一些书。",
      "en": "You have some books.",
      "source": "Tatoeba",
      "sourceId": 510745,
      "translationId": 16791
    },
    {
      "id": "beginner-458",
      "level": "beginner",
      "zh": "他是本地人。",
      "en": "He is a local.",
      "source": "Tatoeba",
      "sourceId": 9954763,
      "translationId": 9954764
    },
    {
      "id": "beginner-459",
      "level": "beginner",
      "zh": "是的，我知道。",
      "en": "Yes, I know it.",
      "source": "Tatoeba",
      "sourceId": 834241,
      "translationId": 433589
    },
    {
      "id": "beginner-460",
      "level": "beginner",
      "zh": "这是我的书。",
      "en": "This is my book.",
      "source": "Tatoeba",
      "sourceId": 334383,
      "translationId": 463306
    },
    {
      "id": "beginner-461",
      "level": "beginner",
      "zh": "那太多了吗？",
      "en": "Was that too much?",
      "source": "Tatoeba",
      "sourceId": 5581793,
      "translationId": 3392977
    },
    {
      "id": "beginner-462",
      "level": "beginner",
      "zh": "今天是周一。",
      "en": "It is Monday today.",
      "source": "Tatoeba",
      "sourceId": 348446,
      "translationId": 242836
    },
    {
      "id": "beginner-463",
      "level": "beginner",
      "zh": "你昨晚在工作吗？",
      "en": "Were you working last night?",
      "source": "Tatoeba",
      "sourceId": 8947254,
      "translationId": 4014181
    },
    {
      "id": "beginner-464",
      "level": "beginner",
      "zh": "那是一个好意见。",
      "en": "That is a good opinion.",
      "source": "Tatoeba",
      "sourceId": 3526208,
      "translationId": 11291108
    },
    {
      "id": "beginner-465",
      "level": "beginner",
      "zh": "早饭准备好了。",
      "en": "Breakfast is ready.",
      "source": "Tatoeba",
      "sourceId": 782920,
      "translationId": 277773
    },
    {
      "id": "beginner-466",
      "level": "beginner",
      "zh": "昨天我休息了。",
      "en": "Yesterday, I rested.",
      "source": "Tatoeba",
      "sourceId": 13717743,
      "translationId": 13717668
    },
    {
      "id": "beginner-467",
      "level": "beginner",
      "zh": "你最喜欢的颜色是什么？",
      "en": "What is your favourite colour?",
      "source": "Tatoeba",
      "sourceId": 7771880,
      "translationId": 2794594
    },
    {
      "id": "beginner-468",
      "level": "beginner",
      "zh": "看，厨房里有一只猫。",
      "en": "Look, there's a cat in the kitchen.",
      "source": "Tatoeba",
      "sourceId": 482307,
      "translationId": 545865
    },
    {
      "id": "beginner-469",
      "level": "beginner",
      "zh": "他喝了三杯水。",
      "en": "He drank three glasses of water.",
      "source": "Tatoeba",
      "sourceId": 618147,
      "translationId": 300197
    },
    {
      "id": "beginner-470",
      "level": "beginner",
      "zh": "你的一切我都知道。",
      "en": "I know everything about you.",
      "source": "Tatoeba",
      "sourceId": 3703447,
      "translationId": 2375870
    },
    {
      "id": "beginner-471",
      "level": "beginner",
      "zh": "不光是你，我也有错。",
      "en": "We are both to blame.",
      "source": "Tatoeba",
      "sourceId": 380718,
      "translationId": 17682
    },
    {
      "id": "beginner-472",
      "level": "beginner",
      "zh": "七点钟我打电话给你。",
      "en": "I'll call you at seven.",
      "source": "Tatoeba",
      "sourceId": 341937,
      "translationId": 72357
    },
    {
      "id": "beginner-473",
      "level": "beginner",
      "zh": "为什么你花了所有钱？",
      "en": "Why did you use up all the money?",
      "source": "Tatoeba",
      "sourceId": 471312,
      "translationId": 16460
    },
    {
      "id": "beginner-474",
      "level": "beginner",
      "zh": "没有人爱他。",
      "en": "Nobody loves him.",
      "source": "Tatoeba",
      "sourceId": 11524315,
      "translationId": 11142210
    },
    {
      "id": "beginner-475",
      "level": "beginner",
      "zh": "他喜欢睡觉。",
      "en": "He likes sleeping.",
      "source": "Tatoeba",
      "sourceId": 2083009,
      "translationId": 1676741
    },
    {
      "id": "beginner-476",
      "level": "beginner",
      "zh": "我们是男人。",
      "en": "We are men.",
      "source": "Tatoeba",
      "sourceId": 706434,
      "translationId": 388869
    },
    {
      "id": "beginner-477",
      "level": "beginner",
      "zh": "你给我下来！",
      "en": "Come down here!",
      "source": "Tatoeba",
      "sourceId": 1766123,
      "translationId": 1934782
    },
    {
      "id": "beginner-478",
      "level": "beginner",
      "zh": "记者租了间很贵的房。",
      "en": "The reporter rented an expensive room.",
      "source": "Tatoeba",
      "sourceId": 333459,
      "translationId": 4971601
    },
    {
      "id": "beginner-479",
      "level": "beginner",
      "zh": "人们啊，擦亮你的眼睛吧！",
      "en": "Open your eyes, people!",
      "source": "Tatoeba",
      "sourceId": 4313890,
      "translationId": 4313664
    },
    {
      "id": "beginner-480",
      "level": "beginner",
      "zh": "告诉我拿它做什么。",
      "en": "Tell me what to do with it.",
      "source": "Tatoeba",
      "sourceId": 816484,
      "translationId": 41882
    },
    {
      "id": "beginner-481",
      "level": "beginner",
      "zh": "我是个好男孩。",
      "en": "I am a good boy.",
      "source": "Tatoeba",
      "sourceId": 4763861,
      "translationId": 1070261
    },
    {
      "id": "beginner-482",
      "level": "beginner",
      "zh": "他左右看了看。",
      "en": "He looked left and right.",
      "source": "Tatoeba",
      "sourceId": 8756388,
      "translationId": 4351264
    },
    {
      "id": "beginner-483",
      "level": "beginner",
      "zh": "为什么你昨晚睡不着？",
      "en": "Why couldn't you sleep last night?",
      "source": "Tatoeba",
      "sourceId": 333168,
      "translationId": 36381
    },
    {
      "id": "beginner-484",
      "level": "beginner",
      "zh": "有好的也有坏的。",
      "en": "Some are good, some aren't.",
      "source": "Tatoeba",
      "sourceId": 2585074,
      "translationId": 2599423
    },
    {
      "id": "beginner-485",
      "level": "beginner",
      "zh": "他不吃生鱼。",
      "en": "He doesn't eat raw fish.",
      "source": "Tatoeba",
      "sourceId": 464938,
      "translationId": 295273
    },
    {
      "id": "beginner-486",
      "level": "beginner",
      "zh": "我没书可读。",
      "en": "I have no books to read.",
      "source": "Tatoeba",
      "sourceId": 1490533,
      "translationId": 1498981
    },
    {
      "id": "beginner-487",
      "level": "beginner",
      "zh": "你读了我的报告了吗？",
      "en": "Have you read my report?",
      "source": "Tatoeba",
      "sourceId": 9415224,
      "translationId": 3821192
    },
    {
      "id": "beginner-488",
      "level": "beginner",
      "zh": "你的衣服是什么颜色的？",
      "en": "What color is your dress?",
      "source": "Tatoeba",
      "sourceId": 3565125,
      "translationId": 3565126
    },
    {
      "id": "beginner-489",
      "level": "beginner",
      "zh": "你为什么对我生气？",
      "en": "Why are you angry with me?",
      "source": "Tatoeba",
      "sourceId": 767697,
      "translationId": 767698
    },
    {
      "id": "beginner-490",
      "level": "beginner",
      "zh": "妈妈，你在想什么呢？",
      "en": "Mom, what are you thinking about?",
      "source": "Tatoeba",
      "sourceId": 10966720,
      "translationId": 12080340
    },
    {
      "id": "beginner-491",
      "level": "beginner",
      "zh": "我为什么找不到你？",
      "en": "Why can't I find you?",
      "source": "Tatoeba",
      "sourceId": 10038367,
      "translationId": 10379349
    },
    {
      "id": "beginner-492",
      "level": "beginner",
      "zh": "谁这么说说得不对。",
      "en": "Whoever said so, it is false.",
      "source": "Tatoeba",
      "sourceId": 380596,
      "translationId": 276231
    },
    {
      "id": "beginner-493",
      "level": "beginner",
      "zh": "你喜欢打高尔夫吗？",
      "en": "Do you like to play golf?",
      "source": "Tatoeba",
      "sourceId": 2370675,
      "translationId": 2377828
    },
    {
      "id": "beginner-494",
      "level": "beginner",
      "zh": "这饭足够三个人吃。",
      "en": "This meal is adequate for three.",
      "source": "Tatoeba",
      "sourceId": 1397137,
      "translationId": 72682
    },
    {
      "id": "beginner-495",
      "level": "beginner",
      "zh": "你看到的都是幻觉。",
      "en": "Everything you saw was an illusion.",
      "source": "Tatoeba",
      "sourceId": 3710642,
      "translationId": 3962752
    },
    {
      "id": "beginner-496",
      "level": "beginner",
      "zh": "你为什么不回家呢？",
      "en": "Why don't you go home?",
      "source": "Tatoeba",
      "sourceId": 1415798,
      "translationId": 1412377
    },
    {
      "id": "beginner-497",
      "level": "beginner",
      "zh": "快中场休息了。",
      "en": "It's almost intermission.",
      "source": "Tatoeba",
      "sourceId": 12378400,
      "translationId": 2249027
    },
    {
      "id": "beginner-498",
      "level": "beginner",
      "zh": "那是因为我爱她。",
      "en": "It's because I love her.",
      "source": "Tatoeba",
      "sourceId": 2021500,
      "translationId": 2021210
    },
    {
      "id": "beginner-499",
      "level": "beginner",
      "zh": "他再也没见过他爸。",
      "en": "He never saw his father again.",
      "source": "Tatoeba",
      "sourceId": 9972423,
      "translationId": 2276584
    },
    {
      "id": "beginner-500",
      "level": "beginner",
      "zh": "谁也没在看她。",
      "en": "Nobody watches her.",
      "source": "Tatoeba",
      "sourceId": 7767591,
      "translationId": 737153
    },
    {
      "id": "beginner-501",
      "level": "beginner",
      "zh": "没人在意你的看法。",
      "en": "Nobody cares what you think.",
      "source": "Tatoeba",
      "sourceId": 12591982,
      "translationId": 482683
    },
    {
      "id": "beginner-502",
      "level": "beginner",
      "zh": "他看了一眼他的表。",
      "en": "He glanced at his watch.",
      "source": "Tatoeba",
      "sourceId": 335111,
      "translationId": 291762
    },
    {
      "id": "beginner-503",
      "level": "beginner",
      "zh": "他所说的一切是真的。",
      "en": "All he said was true.",
      "source": "Tatoeba",
      "sourceId": 845108,
      "translationId": 286090
    },
    {
      "id": "beginner-504",
      "level": "beginner",
      "zh": "你能来就来！",
      "en": "Come if you can.",
      "source": "Tatoeba",
      "sourceId": 804811,
      "translationId": 450074
    },
    {
      "id": "beginner-505",
      "level": "beginner",
      "zh": "她太累了学不动了。",
      "en": "She is too tired to study.",
      "source": "Tatoeba",
      "sourceId": 5975064,
      "translationId": 2611786
    },
    {
      "id": "beginner-506",
      "level": "beginner",
      "zh": "我的文件夹去哪了？",
      "en": "Where is my folder?",
      "source": "Tatoeba",
      "sourceId": 9953227,
      "translationId": 9198611
    },
    {
      "id": "beginner-507",
      "level": "beginner",
      "zh": "我走一步算一步吧。",
      "en": "I'll see as I walk along.",
      "source": "Tatoeba",
      "sourceId": 4282794,
      "translationId": 4344781
    },
    {
      "id": "beginner-508",
      "level": "beginner",
      "zh": "那里的气候怎么样？",
      "en": "What's the climate there like?",
      "source": "Tatoeba",
      "sourceId": 406353,
      "translationId": 1481760
    },
    {
      "id": "beginner-509",
      "level": "beginner",
      "zh": "我爱你胜过你爱我。",
      "en": "I love you more than you love me.",
      "source": "Tatoeba",
      "sourceId": 736283,
      "translationId": 17829
    },
    {
      "id": "beginner-510",
      "level": "beginner",
      "zh": "我们放学后会去踢足球。",
      "en": "We will play soccer after school.",
      "source": "Tatoeba",
      "sourceId": 865424,
      "translationId": 321000
    },
    {
      "id": "beginner-511",
      "level": "beginner",
      "zh": "当我回家时，我遇见了他。",
      "en": "I met him while I was coming home.",
      "source": "Tatoeba",
      "sourceId": 824435,
      "translationId": 823796
    },
    {
      "id": "beginner-512",
      "level": "beginner",
      "zh": "我吃完晚饭后做作业。",
      "en": "After dinner, I did my homework.",
      "source": "Tatoeba",
      "sourceId": 6159158,
      "translationId": 262094
    },
    {
      "id": "beginner-513",
      "level": "beginner",
      "zh": "我们偶尔去钓鱼。",
      "en": "We go fishing once in a while.",
      "source": "Tatoeba",
      "sourceId": 804950,
      "translationId": 248800
    },
    {
      "id": "beginner-514",
      "level": "beginner",
      "zh": "你今早几点起床？",
      "en": "When did you get up this morning?",
      "source": "Tatoeba",
      "sourceId": 423903,
      "translationId": 242197
    },
    {
      "id": "beginner-515",
      "level": "beginner",
      "zh": "我若能来就会来。",
      "en": "I will come if I can.",
      "source": "Tatoeba",
      "sourceId": 13210512,
      "translationId": 6897478
    },
    {
      "id": "beginner-516",
      "level": "beginner",
      "zh": "你昨天几点睡的？",
      "en": "When did you go to bed last night?",
      "source": "Tatoeba",
      "sourceId": 9962104,
      "translationId": 244818
    },
    {
      "id": "beginner-517",
      "level": "beginner",
      "zh": "她前天去了美国。",
      "en": "She left for America the day before yesterday.",
      "source": "Tatoeba",
      "sourceId": 634828,
      "translationId": 310585
    },
    {
      "id": "beginner-518",
      "level": "beginner",
      "zh": "你是今天买还是昨天买的？",
      "en": "Did you buy it today or yesterday?",
      "source": "Tatoeba",
      "sourceId": 1733243,
      "translationId": 69924
    },
    {
      "id": "beginner-519",
      "level": "beginner",
      "zh": "你和你哥哥长得一模一样。",
      "en": "You look just like your big brother.",
      "source": "Tatoeba",
      "sourceId": 8850438,
      "translationId": 16743
    },
    {
      "id": "beginner-520",
      "level": "beginner",
      "zh": "我让她清扫了我的房间。",
      "en": "I got her to clean my room.",
      "source": "Tatoeba",
      "sourceId": 804551,
      "translationId": 261218
    },
    {
      "id": "beginner-521",
      "level": "beginner",
      "zh": "我喜欢这张桌子的颜色。",
      "en": "I like the color of this table.",
      "source": "Tatoeba",
      "sourceId": 13531849,
      "translationId": 13531678
    },
    {
      "id": "beginner-522",
      "level": "beginner",
      "zh": "你能帮我搬这张桌子吗？",
      "en": "Will you help me move this desk?",
      "source": "Tatoeba",
      "sourceId": 903375,
      "translationId": 59840
    },
    {
      "id": "beginner-523",
      "level": "beginner",
      "zh": "她用我喜欢的方式烹调鸡肉。",
      "en": "She cooks chicken the way I like.",
      "source": "Tatoeba",
      "sourceId": 893020,
      "translationId": 314328
    },
    {
      "id": "beginner-524",
      "level": "beginner",
      "zh": "你为什么去了车站呢？",
      "en": "Why did you go to the station?",
      "source": "Tatoeba",
      "sourceId": 10306020,
      "translationId": 8086736
    },
    {
      "id": "beginner-525",
      "level": "beginner",
      "zh": "在你们国家吃米饭吗？",
      "en": "Do you eat rice in your country?",
      "source": "Tatoeba",
      "sourceId": 504875,
      "translationId": 17151
    },
    {
      "id": "beginner-526",
      "level": "beginner",
      "zh": "他从来没有上学迟到。",
      "en": "He has never been late for school.",
      "source": "Tatoeba",
      "sourceId": 880301,
      "translationId": 293783
    },
    {
      "id": "beginner-527",
      "level": "beginner",
      "zh": "我们老师要我们打扫这间房间。",
      "en": "Our teacher made us clean the room.",
      "source": "Tatoeba",
      "sourceId": 894082,
      "translationId": 272853
    },
    {
      "id": "beginner-528",
      "level": "beginner",
      "zh": "我想告诉你一些事情。",
      "en": "I would like to tell you something.",
      "source": "Tatoeba",
      "sourceId": 893033,
      "translationId": 71165
    },
    {
      "id": "beginner-529",
      "level": "beginner",
      "zh": "你今天下午会在家吗？",
      "en": "Will you be at home this afternoon?",
      "source": "Tatoeba",
      "sourceId": 8589264,
      "translationId": 2259918
    },
    {
      "id": "beginner-530",
      "level": "beginner",
      "zh": "除了星期天我每一天都工作。",
      "en": "I work every day except Sunday.",
      "source": "Tatoeba",
      "sourceId": 850360,
      "translationId": 259863
    },
    {
      "id": "beginner-531",
      "level": "beginner",
      "zh": "你今天晚上能来吃饭吗？",
      "en": "Can you come for dinner tonight?",
      "source": "Tatoeba",
      "sourceId": 842468,
      "translationId": 243195
    },
    {
      "id": "beginner-532",
      "level": "beginner",
      "zh": "海滩上你到底愿意去吗？",
      "en": "Are you willing to go to the beach?",
      "source": "Tatoeba",
      "sourceId": 419932,
      "translationId": 1319985
    },
    {
      "id": "beginner-533",
      "level": "beginner",
      "zh": "我必须问你一个蠢问题。",
      "en": "I need to ask you a silly question.",
      "source": "Tatoeba",
      "sourceId": 501415,
      "translationId": 1417
    },
    {
      "id": "beginner-534",
      "level": "beginner",
      "zh": "她昨天参加了入学考试。",
      "en": "She took the entrance exam yesterday.",
      "source": "Tatoeba",
      "sourceId": 861044,
      "translationId": 388905
    },
    {
      "id": "beginner-535",
      "level": "beginner",
      "zh": "来吧。我想让你看点东西。",
      "en": "Come on. I want to show you something.",
      "source": "Tatoeba",
      "sourceId": 5091346,
      "translationId": 2025814
    },
    {
      "id": "beginner-536",
      "level": "beginner",
      "zh": "你还有什么别的想知道的吗？",
      "en": "Is there anything else you want to know?",
      "source": "Tatoeba",
      "sourceId": 10329358,
      "translationId": 2454726
    },
    {
      "id": "beginner-537",
      "level": "beginner",
      "zh": "我喜欢在雨中漫步。",
      "en": "I like to walk in the rain.",
      "source": "Tatoeba",
      "sourceId": 618148,
      "translationId": 26723
    },
    {
      "id": "beginner-538",
      "level": "beginner",
      "zh": "你最好现在去睡觉。",
      "en": "You had better go to bed now.",
      "source": "Tatoeba",
      "sourceId": 338803,
      "translationId": 16392
    },
    {
      "id": "beginner-539",
      "level": "beginner",
      "zh": "她答应不单独外出。",
      "en": "She promised not to go out alone.",
      "source": "Tatoeba",
      "sourceId": 892512,
      "translationId": 312077
    },
    {
      "id": "beginner-540",
      "level": "beginner",
      "zh": "我明天不会去学校。",
      "en": "I will not go to school tomorrow.",
      "source": "Tatoeba",
      "sourceId": 875336,
      "translationId": 261934
    },
    {
      "id": "beginner-541",
      "level": "beginner",
      "zh": "他设法使收支平衡。",
      "en": "He managed to make both ends meet.",
      "source": "Tatoeba",
      "sourceId": 794079,
      "translationId": 291975
    },
    {
      "id": "beginner-542",
      "level": "beginner",
      "zh": "你打算长时间停留吗？",
      "en": "Do you plan to stay long?",
      "source": "Tatoeba",
      "sourceId": 840432,
      "translationId": 515768
    },
    {
      "id": "beginner-543",
      "level": "beginner",
      "zh": "请问鸡蛋要什么做法？",
      "en": "How would you like your eggs?",
      "source": "Tatoeba",
      "sourceId": 8940739,
      "translationId": 325221
    },
    {
      "id": "beginner-544",
      "level": "beginner",
      "zh": "我叔叔住在学校附近。",
      "en": "My uncle lives near the school.",
      "source": "Tatoeba",
      "sourceId": 332488,
      "translationId": 65069
    },
    {
      "id": "beginner-545",
      "level": "beginner",
      "zh": "我想你把真相告诉我。",
      "en": "I want you to tell me the truth.",
      "source": "Tatoeba",
      "sourceId": 392673,
      "translationId": 2429
    },
    {
      "id": "beginner-546",
      "level": "beginner",
      "zh": "我今天感觉比昨天好。",
      "en": "I feel better today than yesterday.",
      "source": "Tatoeba",
      "sourceId": 848807,
      "translationId": 242678
    },
    {
      "id": "beginner-547",
      "level": "beginner",
      "zh": "我们怎么付得起这种地方的钱？",
      "en": "How can you afford a place like this?",
      "source": "Tatoeba",
      "sourceId": 6073910,
      "translationId": 3011214
    },
    {
      "id": "beginner-548",
      "level": "beginner",
      "zh": "他就是所谓的活字典。",
      "en": "He is what we call a walking dictionary.",
      "source": "Tatoeba",
      "sourceId": 1408067,
      "translationId": 284353
    },
    {
      "id": "beginner-549",
      "level": "beginner",
      "zh": "我们讨论那个问题讨论了很久。",
      "en": "We discussed the problem for a long time.",
      "source": "Tatoeba",
      "sourceId": 486548,
      "translationId": 262796
    },
    {
      "id": "beginner-550",
      "level": "beginner",
      "zh": "我喜欢那件紫色的上衣。",
      "en": "I like that purple shirt.",
      "source": "Tatoeba",
      "sourceId": 10368487,
      "translationId": 3170733
    },
    {
      "id": "beginner-551",
      "level": "beginner",
      "zh": "我晚上很晚就寝。",
      "en": "I go to bed late at night.",
      "source": "Tatoeba",
      "sourceId": 804862,
      "translationId": 255903
    },
    {
      "id": "beginner-552",
      "level": "beginner",
      "zh": "我得去趟图书馆。",
      "en": "I have to go to the library.",
      "source": "Tatoeba",
      "sourceId": 10580071,
      "translationId": 10121144
    },
    {
      "id": "beginner-553",
      "level": "beginner",
      "zh": "希望她会帮我吧。",
      "en": "I hope that she will help me.",
      "source": "Tatoeba",
      "sourceId": 1401688,
      "translationId": 314450
    },
    {
      "id": "beginner-554",
      "level": "beginner",
      "zh": "我通常九时睡觉。",
      "en": "I regularly go to bed at nine.",
      "source": "Tatoeba",
      "sourceId": 350696,
      "translationId": 66131
    },
    {
      "id": "beginner-555",
      "level": "beginner",
      "zh": "她七点钟到车站。",
      "en": "She got to the station at seven.",
      "source": "Tatoeba",
      "sourceId": 894241,
      "translationId": 314772
    },
    {
      "id": "beginner-556",
      "level": "beginner",
      "zh": "我以前从不吃零食。",
      "en": "I never used to eat snacks.",
      "source": "Tatoeba",
      "sourceId": 13549622,
      "translationId": 5189342
    },
    {
      "id": "beginner-557",
      "level": "beginner",
      "zh": "他下个月会去纽约。",
      "en": "He will go to New York next month.",
      "source": "Tatoeba",
      "sourceId": 2879114,
      "translationId": 304570
    },
    {
      "id": "beginner-558",
      "level": "beginner",
      "zh": "我妈妈每天洗衣服。",
      "en": "My mother washes clothes every day.",
      "source": "Tatoeba",
      "sourceId": 858804,
      "translationId": 484053
    },
    {
      "id": "beginner-559",
      "level": "beginner",
      "zh": "你昨天看到的那个男人是我叔叔。",
      "en": "The man you saw yesterday is my uncle.",
      "source": "Tatoeba",
      "sourceId": 333456,
      "translationId": 387552
    },
    {
      "id": "beginner-560",
      "level": "beginner",
      "zh": "你能用圆珠笔写吗？",
      "en": "Would you please write with a ballpoint pen?",
      "source": "Tatoeba",
      "sourceId": 5611475,
      "translationId": 779483
    },
    {
      "id": "beginner-561",
      "level": "beginner",
      "zh": "我真的很喜欢这首歌。",
      "en": "I really like this song.",
      "source": "Tatoeba",
      "sourceId": 9955572,
      "translationId": 2510774
    },
    {
      "id": "beginner-562",
      "level": "beginner",
      "zh": "我认为考试破坏教育。",
      "en": "I think exams ruin education.",
      "source": "Tatoeba",
      "sourceId": 334155,
      "translationId": 1230707
    },
    {
      "id": "beginner-563",
      "level": "beginner",
      "zh": "我要你想一想。",
      "en": "I want you to think about it.",
      "source": "Tatoeba",
      "sourceId": 11231381,
      "translationId": 2013614
    },
    {
      "id": "beginner-564",
      "level": "beginner",
      "zh": "我没朋友帮我。",
      "en": "I have no friends to help me.",
      "source": "Tatoeba",
      "sourceId": 332934,
      "translationId": 258598
    },
    {
      "id": "beginner-565",
      "level": "beginner",
      "zh": "你要这钱干嘛？",
      "en": "What do you need the money for?",
      "source": "Tatoeba",
      "sourceId": 471309,
      "translationId": 16458
    },
    {
      "id": "beginner-566",
      "level": "beginner",
      "zh": "你必须去医院。",
      "en": "You have to go to the hospital.",
      "source": "Tatoeba",
      "sourceId": 6111934,
      "translationId": 1570751
    },
    {
      "id": "beginner-567",
      "level": "beginner",
      "zh": "我和家人去露营。",
      "en": "I went camping with my family.",
      "source": "Tatoeba",
      "sourceId": 862877,
      "translationId": 256514
    },
    {
      "id": "beginner-568",
      "level": "beginner",
      "zh": "我刚刚去了邮局。",
      "en": "I have just been to the post office.",
      "source": "Tatoeba",
      "sourceId": 890967,
      "translationId": 255032
    },
    {
      "id": "beginner-569",
      "level": "beginner",
      "zh": "希望他明天会来吧。",
      "en": "I hope he comes tomorrow.",
      "source": "Tatoeba",
      "sourceId": 1769186,
      "translationId": 1343256
    },
    {
      "id": "beginner-570",
      "level": "beginner",
      "zh": "你昨天为甚么缺席？",
      "en": "Why were you absent yesterday?",
      "source": "Tatoeba",
      "sourceId": 342721,
      "translationId": 16117
    },
    {
      "id": "beginner-571",
      "level": "beginner",
      "zh": "来杯咖啡吗？",
      "en": "Do you want a cup of coffee?",
      "source": "Tatoeba",
      "sourceId": 8696299,
      "translationId": 138867
    },
    {
      "id": "beginner-572",
      "level": "beginner",
      "zh": "他要了水喝。",
      "en": "He asked for a drink of water.",
      "source": "Tatoeba",
      "sourceId": 875375,
      "translationId": 300196
    },
    {
      "id": "beginner-573",
      "level": "beginner",
      "zh": "你想一起去吗？",
      "en": "Would you like to come along?",
      "source": "Tatoeba",
      "sourceId": 875123,
      "translationId": 237657
    },
    {
      "id": "beginner-574",
      "level": "beginner",
      "zh": "您下午做啥呢？",
      "en": "So what will you do in the afternoon?",
      "source": "Tatoeba",
      "sourceId": 2254408,
      "translationId": 2256281
    },
    {
      "id": "beginner-575",
      "level": "beginner",
      "zh": "你家有多少人？",
      "en": "How many people are there in your family?",
      "source": "Tatoeba",
      "sourceId": 333605,
      "translationId": 387554
    },
    {
      "id": "beginner-576",
      "level": "beginner",
      "zh": "你能等到今天下午2：30吗？",
      "en": "Can you wait until 2:30 this afternoon?",
      "source": "Tatoeba",
      "sourceId": 10333110,
      "translationId": 3329767
    },
    {
      "id": "beginner-577",
      "level": "beginner",
      "zh": "他有自己的房间。",
      "en": "He has his own room.",
      "source": "Tatoeba",
      "sourceId": 4517811,
      "translationId": 298838
    },
    {
      "id": "beginner-578",
      "level": "beginner",
      "zh": "您现在想要什么？",
      "en": "What do you want now?",
      "source": "Tatoeba",
      "sourceId": 469355,
      "translationId": 16275
    },
    {
      "id": "beginner-579",
      "level": "beginner",
      "zh": "我们需要你的帮忙。",
      "en": "We need your help.",
      "source": "Tatoeba",
      "sourceId": 771610,
      "translationId": 410780
    },
    {
      "id": "beginner-580",
      "level": "beginner",
      "zh": "我想念日本的食物。",
      "en": "I miss Japanese food.",
      "source": "Tatoeba",
      "sourceId": 10742801,
      "translationId": 10742822
    },
    {
      "id": "beginner-581",
      "level": "beginner",
      "zh": "你几点起床？",
      "en": "What time do you get up?",
      "source": "Tatoeba",
      "sourceId": 424526,
      "translationId": 24579
    },
    {
      "id": "beginner-582",
      "level": "beginner",
      "zh": "我还是希望哪天能做那件事。",
      "en": "I still hope to do that someday.",
      "source": "Tatoeba",
      "sourceId": 13839314,
      "translationId": 6110479
    },
    {
      "id": "beginner-583",
      "level": "beginner",
      "zh": "你为什么总是逃避这个话题？",
      "en": "Why do you always avoid that topic?",
      "source": "Tatoeba",
      "sourceId": 1259917,
      "translationId": 7819400
    },
    {
      "id": "beginner-584",
      "level": "beginner",
      "zh": "他时不时地因为工作去东京。",
      "en": "He sometimes goes to Tokyo on business.",
      "source": "Tatoeba",
      "sourceId": 444639,
      "translationId": 298403
    },
    {
      "id": "beginner-585",
      "level": "beginner",
      "zh": "她八岁的时候开始跳舞。",
      "en": "She started dancing when she was eight.",
      "source": "Tatoeba",
      "sourceId": 587519,
      "translationId": 310215
    },
    {
      "id": "beginner-586",
      "level": "beginner",
      "zh": "你想要些茶吗？",
      "en": "Would you like some tea?",
      "source": "Tatoeba",
      "sourceId": 10301349,
      "translationId": 3123338
    },
    {
      "id": "beginner-587",
      "level": "beginner",
      "zh": "不要边走边看书。",
      "en": "Do not read while walking.",
      "source": "Tatoeba",
      "sourceId": 512489,
      "translationId": 320505
    },
    {
      "id": "beginner-588",
      "level": "beginner",
      "zh": "他们全都来了。",
      "en": "They all have come.",
      "source": "Tatoeba",
      "sourceId": 5091726,
      "translationId": 306081
    },
    {
      "id": "beginner-589",
      "level": "beginner",
      "zh": "他们休息了一会儿。",
      "en": "They had a rest for a while.",
      "source": "Tatoeba",
      "sourceId": 796061,
      "translationId": 305652
    },
    {
      "id": "beginner-590",
      "level": "beginner",
      "zh": "她总是低声地说话。",
      "en": "She always speaks in a low voice.",
      "source": "Tatoeba",
      "sourceId": 891741,
      "translationId": 310468
    },
    {
      "id": "beginner-591",
      "level": "beginner",
      "zh": "您得小心。",
      "en": "You need to be careful.",
      "source": "Tatoeba",
      "sourceId": 10401626,
      "translationId": 2020560
    },
    {
      "id": "beginner-592",
      "level": "beginner",
      "zh": "如果我错了，请你指正。",
      "en": "Correct me if I am wrong.",
      "source": "Tatoeba",
      "sourceId": 346180,
      "translationId": 30908
    },
    {
      "id": "beginner-593",
      "level": "beginner",
      "zh": "他们买了吗？",
      "en": "Did they buy it?",
      "source": "Tatoeba",
      "sourceId": 9433044,
      "translationId": 3150406
    },
    {
      "id": "beginner-594",
      "level": "beginner",
      "zh": "他在吃午餐。",
      "en": "He is having lunch.",
      "source": "Tatoeba",
      "sourceId": 591215,
      "translationId": 296636
    },
    {
      "id": "beginner-595",
      "level": "beginner",
      "zh": "我们需要指导。",
      "en": "We need directions.",
      "source": "Tatoeba",
      "sourceId": 10518642,
      "translationId": 10516009
    },
    {
      "id": "beginner-596",
      "level": "beginner",
      "zh": "为什么男人很喜欢足球？",
      "en": "Why do men like football so much?",
      "source": "Tatoeba",
      "sourceId": 5651521,
      "translationId": 9409582
    },
    {
      "id": "beginner-597",
      "level": "beginner",
      "zh": "他因为没有被邀请而气得快疯了。",
      "en": "He was mad because he was not invited.",
      "source": "Tatoeba",
      "sourceId": 2082992,
      "translationId": 1875952
    },
    {
      "id": "beginner-598",
      "level": "beginner",
      "zh": "我想知道他会不会来这里。",
      "en": "I want to know if he'll come here.",
      "source": "Tatoeba",
      "sourceId": 864606,
      "translationId": 282999
    },
    {
      "id": "beginner-599",
      "level": "beginner",
      "zh": "我哥哥有时会教我做功课。",
      "en": "My brother sometimes helps me with my homework.",
      "source": "Tatoeba",
      "sourceId": 633878,
      "translationId": 237878
    },
    {
      "id": "beginner-600",
      "level": "beginner",
      "zh": "我爸爸不是每天都走路上班的。",
      "en": "My father does not always walk to work.",
      "source": "Tatoeba",
      "sourceId": 395189,
      "translationId": 318966
    },
    {
      "id": "intermediate-001",
      "level": "intermediate",
      "zh": "声音大声一点，以便让坐在后边的学生能听到。",
      "en": "Turn the volume up so that the students at the back can hear.",
      "source": "Tatoeba",
      "sourceId": 1577382,
      "translationId": 1577407
    },
    {
      "id": "intermediate-002",
      "level": "intermediate",
      "zh": "你知道我为了成为一名医生有多么努力吗？",
      "en": "Do you have any idea how hard I've studied to become a doctor?",
      "source": "Tatoeba",
      "sourceId": 8605831,
      "translationId": 6766372
    },
    {
      "id": "intermediate-003",
      "level": "intermediate",
      "zh": "不管这个问题重不重要，你必须解决它。",
      "en": "No matter how important the question may or may not be, you must solve it.",
      "source": "Tatoeba",
      "sourceId": 335848,
      "translationId": 1260696
    },
    {
      "id": "intermediate-004",
      "level": "intermediate",
      "zh": "如果你们不想帮我们可以不用帮。",
      "en": "You don't have to help us if you don't want to.",
      "source": "Tatoeba",
      "sourceId": 10019682,
      "translationId": 5834507
    },
    {
      "id": "intermediate-005",
      "level": "intermediate",
      "zh": "风刮得太猛，他们没法在公园里玩了。",
      "en": "The wind blew too hard for them to play in the park.",
      "source": "Tatoeba",
      "sourceId": 333203,
      "translationId": 319665
    },
    {
      "id": "intermediate-006",
      "level": "intermediate",
      "zh": "这个想法已经在他脑中存在了好久。",
      "en": "This idea has been in his mind for a long time now.",
      "source": "Tatoeba",
      "sourceId": 9991897,
      "translationId": 10372324
    },
    {
      "id": "intermediate-007",
      "level": "intermediate",
      "zh": "首先，让我们欢迎公司的一个新成员。",
      "en": "Before anything else, let's welcome a new member to our company.",
      "source": "Tatoeba",
      "sourceId": 2938690,
      "translationId": 2938691
    },
    {
      "id": "intermediate-008",
      "level": "intermediate",
      "zh": "注意，你们最迟要在五点钟之前到这儿。",
      "en": "Make sure you're here before five.",
      "source": "Tatoeba",
      "sourceId": 1783892,
      "translationId": 10540435
    },
    {
      "id": "intermediate-009",
      "level": "intermediate",
      "zh": "如果你想改变世界，就从你自己开始吧。",
      "en": "If you want to change the world, then you should start with yourself.",
      "source": "Tatoeba",
      "sourceId": 4267308,
      "translationId": 7779313
    },
    {
      "id": "intermediate-010",
      "level": "intermediate",
      "zh": "新西兰和日本的气候差不多一样。",
      "en": "The climate of New Zealand is similar to that of Japan.",
      "source": "Tatoeba",
      "sourceId": 8903290,
      "translationId": 35963
    },
    {
      "id": "intermediate-011",
      "level": "intermediate",
      "zh": "他是那个职位最有希望的候选人。",
      "en": "He was the strongest candidate for the position.",
      "source": "Tatoeba",
      "sourceId": 2411006,
      "translationId": 291051
    },
    {
      "id": "intermediate-012",
      "level": "intermediate",
      "zh": "那个时候，没有人在这个岛上生活。",
      "en": "No one lived on the island at that time.",
      "source": "Tatoeba",
      "sourceId": 2007051,
      "translationId": 279912
    },
    {
      "id": "intermediate-013",
      "level": "intermediate",
      "zh": "我们吃甜点的时候，去那个国家旅游的愿望更强烈了。",
      "en": "While eating dessert, our desire to travel to that country grew stronger.",
      "source": "Tatoeba",
      "sourceId": 503275,
      "translationId": 13573058
    },
    {
      "id": "intermediate-014",
      "level": "intermediate",
      "zh": "虽然有人来了，但是她还是忐忑不安。",
      "en": "Even though someone came, she still remained uneasy.",
      "source": "Tatoeba",
      "sourceId": 795826,
      "translationId": 795828
    },
    {
      "id": "intermediate-015",
      "level": "intermediate",
      "zh": "如果她知道的话，一定会很生气。",
      "en": "She'd be furious if she knew.",
      "source": "Tatoeba",
      "sourceId": 10249576,
      "translationId": 7392294
    },
    {
      "id": "intermediate-016",
      "level": "intermediate",
      "zh": "没有人知道他接下来会干什么。",
      "en": "There is no knowing what he will do next.",
      "source": "Tatoeba",
      "sourceId": 805611,
      "translationId": 283789
    },
    {
      "id": "intermediate-017",
      "level": "intermediate",
      "zh": "我能不能看一下你的报纸？",
      "en": "Can I have a look at your newspaper?",
      "source": "Tatoeba",
      "sourceId": 343983,
      "translationId": 387704
    },
    {
      "id": "intermediate-018",
      "level": "intermediate",
      "zh": "好像你们在这儿玩得不愉快啊。",
      "en": "It seems that you're not having a good time here.",
      "source": "Tatoeba",
      "sourceId": 795738,
      "translationId": 7803523
    },
    {
      "id": "intermediate-019",
      "level": "intermediate",
      "zh": "这是一家专门为学生提供服务的商店。",
      "en": "This is a store that caters specially to students.",
      "source": "Tatoeba",
      "sourceId": 2516542,
      "translationId": 21338
    },
    {
      "id": "intermediate-020",
      "level": "intermediate",
      "zh": "如果他继续这样喝酒，他该乘出租车回家。",
      "en": "If he keeps drinking like that, he'll have to take a taxi home.",
      "source": "Tatoeba",
      "sourceId": 683621,
      "translationId": 539481
    },
    {
      "id": "intermediate-021",
      "level": "intermediate",
      "zh": "他老了，所以这任务对他来说一定很难。",
      "en": "Since he is old, this task must be difficult for him.",
      "source": "Tatoeba",
      "sourceId": 5794102,
      "translationId": 302337
    },
    {
      "id": "intermediate-022",
      "level": "intermediate",
      "zh": "人们认为，他完全能胜任这个工作。",
      "en": "He was considered very qualified for the job.",
      "source": "Tatoeba",
      "sourceId": 1577192,
      "translationId": 1577216
    },
    {
      "id": "intermediate-023",
      "level": "intermediate",
      "zh": "如果你不忙，这周末为何不来跟我钓鱼呢？",
      "en": "If you are not busy, why don't you come fishing with me this weekend?",
      "source": "Tatoeba",
      "sourceId": 464944,
      "translationId": 7795618
    },
    {
      "id": "intermediate-024",
      "level": "intermediate",
      "zh": "如果有人激怒你，你最好不要立刻做出反应。",
      "en": "If someone irritates you, it is best not to react immediately.",
      "source": "Tatoeba",
      "sourceId": 8791826,
      "translationId": 269893
    },
    {
      "id": "intermediate-025",
      "level": "intermediate",
      "zh": "你自己小心，玩得开心点！",
      "en": "Take care of yourself, and have a good time!",
      "source": "Tatoeba",
      "sourceId": 335519,
      "translationId": 20375
    },
    {
      "id": "intermediate-026",
      "level": "intermediate",
      "zh": "我在周末起床比平时晚。",
      "en": "On weekends I got up later than usual.",
      "source": "Tatoeba",
      "sourceId": 5698057,
      "translationId": 2428455
    },
    {
      "id": "intermediate-027",
      "level": "intermediate",
      "zh": "家人或朋友会来接你吗？",
      "en": "Will family or friends come to pick you up?",
      "source": "Tatoeba",
      "sourceId": 10699379,
      "translationId": 10696179
    },
    {
      "id": "intermediate-028",
      "level": "intermediate",
      "zh": "一开始许多事情看上去不同了，但我很快习惯了我的新生活。",
      "en": "At first many things seemed different, but I soon got involved in my new life.",
      "source": "Tatoeba",
      "sourceId": 636204,
      "translationId": 244035
    },
    {
      "id": "intermediate-029",
      "level": "intermediate",
      "zh": "要我解释给你听是不可能的。",
      "en": "It's impossible for me to explain it to you.",
      "source": "Tatoeba",
      "sourceId": 334169,
      "translationId": 1597
    },
    {
      "id": "intermediate-030",
      "level": "intermediate",
      "zh": "下雨了，但是我依然需要出去。",
      "en": "Although it was raining, I had to go out.",
      "source": "Tatoeba",
      "sourceId": 10059144,
      "translationId": 63517
    },
    {
      "id": "intermediate-031",
      "level": "intermediate",
      "zh": "没有你这个城市孤单又冷清。",
      "en": "This city is cold and lonely without you.",
      "source": "Tatoeba",
      "sourceId": 1990185,
      "translationId": 386841
    },
    {
      "id": "intermediate-032",
      "level": "intermediate",
      "zh": "太阳在夏天比冬天升起得早。",
      "en": "The sun rises earlier in summer than in winter.",
      "source": "Tatoeba",
      "sourceId": 795426,
      "translationId": 275119
    },
    {
      "id": "intermediate-033",
      "level": "intermediate",
      "zh": "你们该养成使用字典的习惯。",
      "en": "You should try to form the habit of using your dictionaries.",
      "source": "Tatoeba",
      "sourceId": 792843,
      "translationId": 16028
    },
    {
      "id": "intermediate-034",
      "level": "intermediate",
      "zh": "听说意大利语是一门很难的语言。",
      "en": "I've heard Italian is a tricky language.",
      "source": "Tatoeba",
      "sourceId": 1275374,
      "translationId": 1283959
    },
    {
      "id": "intermediate-035",
      "level": "intermediate",
      "zh": "我从小的梦想就是做一名糕点师。",
      "en": "From childhood I dreamed of being a pastry cook.",
      "source": "Tatoeba",
      "sourceId": 348911,
      "translationId": 62628
    },
    {
      "id": "intermediate-036",
      "level": "intermediate",
      "zh": "他在他的照片里看上去很可爱。",
      "en": "He looked cute in his photos.",
      "source": "Tatoeba",
      "sourceId": 8914628,
      "translationId": 8350980
    },
    {
      "id": "intermediate-037",
      "level": "intermediate",
      "zh": "您的家族史跟中医有没有关系？",
      "en": "Does your family background involve Chinese medicine?",
      "source": "Tatoeba",
      "sourceId": 827186,
      "translationId": 827187
    },
    {
      "id": "intermediate-038",
      "level": "intermediate",
      "zh": "你正在把我杯子里的东西喝掉。",
      "en": "You're drinking out of my cup.",
      "source": "Tatoeba",
      "sourceId": 4845053,
      "translationId": 2422925
    },
    {
      "id": "intermediate-039",
      "level": "intermediate",
      "zh": "我还从没听说过这个演员。",
      "en": "I've never heard of the actor.",
      "source": "Tatoeba",
      "sourceId": 817263,
      "translationId": 43573
    },
    {
      "id": "intermediate-040",
      "level": "intermediate",
      "zh": "我昨天买了一支像你那样的笔。",
      "en": "I bought a pen like yours yesterday.",
      "source": "Tatoeba",
      "sourceId": 401958,
      "translationId": 401955
    },
    {
      "id": "intermediate-041",
      "level": "intermediate",
      "zh": "今天是我们最后一天放假。",
      "en": "Today is our last day of vacation.",
      "source": "Tatoeba",
      "sourceId": 1066642,
      "translationId": 13561162
    },
    {
      "id": "intermediate-042",
      "level": "intermediate",
      "zh": "如果人生是凸的，那我们可以优化它。",
      "en": "If human life is convex, we can optimize it.",
      "source": "Tatoeba",
      "sourceId": 796741,
      "translationId": 689167
    },
    {
      "id": "intermediate-043",
      "level": "intermediate",
      "zh": "我才感冒一天没来上班，桌上就堆满了文件。",
      "en": "I only missed one day of work because of a cold and my desk is piled high with papers.",
      "source": "Tatoeba",
      "sourceId": 1974785,
      "translationId": 27395
    },
    {
      "id": "intermediate-044",
      "level": "intermediate",
      "zh": "真的不敢相信你在吃医生叮嘱不要食用的东西。",
      "en": "I can't believe you are eating something the doctor has told you repeatedly you shouldn't eat.",
      "source": "Tatoeba",
      "sourceId": 4760026,
      "translationId": 4779017
    },
    {
      "id": "intermediate-045",
      "level": "intermediate",
      "zh": "每一个人都应该知法懂法，但是真正能做到的人却很少。",
      "en": "Everybody is supposed to know the law, but few people really do.",
      "source": "Tatoeba",
      "sourceId": 2456041,
      "translationId": 276453
    },
    {
      "id": "intermediate-046",
      "level": "intermediate",
      "zh": "我在外地生活了很久。",
      "en": "I've lived away from home for a long time.",
      "source": "Tatoeba",
      "sourceId": 9518534,
      "translationId": 10534796
    },
    {
      "id": "intermediate-047",
      "level": "intermediate",
      "zh": "大房子不一定适合住。",
      "en": "Large houses are not necessarily comfortable to live in.",
      "source": "Tatoeba",
      "sourceId": 9970091,
      "translationId": 275497
    },
    {
      "id": "intermediate-048",
      "level": "intermediate",
      "zh": "世界杯11号就要开始了。",
      "en": "The World Cup is going to start on the 11th.",
      "source": "Tatoeba",
      "sourceId": 3060499,
      "translationId": 3060500
    },
    {
      "id": "intermediate-049",
      "level": "intermediate",
      "zh": "我爸爸年轻的时候一定很英俊。",
      "en": "My father must have been handsome in his youth.",
      "source": "Tatoeba",
      "sourceId": 334228,
      "translationId": 319262
    },
    {
      "id": "intermediate-050",
      "level": "intermediate",
      "zh": "他的名字在这个地区人尽皆知。",
      "en": "His name is known to everybody in this area.",
      "source": "Tatoeba",
      "sourceId": 1325276,
      "translationId": 287631
    },
    {
      "id": "intermediate-051",
      "level": "intermediate",
      "zh": "所有的医药费我大概要付多少？",
      "en": "About how much will I have to pay for all the treatments?",
      "source": "Tatoeba",
      "sourceId": 333845,
      "translationId": 264380
    },
    {
      "id": "intermediate-052",
      "level": "intermediate",
      "zh": "后来我意识到北京人比较慢地散步。",
      "en": "I later realized that Beijing people walk slowly.",
      "source": "Tatoeba",
      "sourceId": 858950,
      "translationId": 858951
    },
    {
      "id": "intermediate-053",
      "level": "intermediate",
      "zh": "来吧，阿里亚娜号，不快点我们就永远到不了那儿！",
      "en": "Come on, Arianna, speed up or we'll never get there!",
      "source": "Tatoeba",
      "sourceId": 804901,
      "translationId": 792266
    },
    {
      "id": "intermediate-054",
      "level": "intermediate",
      "zh": "如果他年轻一点，他将很适合这个职位。",
      "en": "If he were a little younger, he would be eligible for the post.",
      "source": "Tatoeba",
      "sourceId": 332456,
      "translationId": 283299
    },
    {
      "id": "intermediate-055",
      "level": "intermediate",
      "zh": "老实说，我们是来抓你们的。",
      "en": "To be honest, we came to capture you.",
      "source": "Tatoeba",
      "sourceId": 800930,
      "translationId": 800924
    },
    {
      "id": "intermediate-056",
      "level": "intermediate",
      "zh": "他把问题从脑子里排除了。",
      "en": "He cast off the problem from his mind.",
      "source": "Tatoeba",
      "sourceId": 686620,
      "translationId": 291351
    },
    {
      "id": "intermediate-057",
      "level": "intermediate",
      "zh": "我记得你以前跳舞的方式。",
      "en": "I remember the way you used to dance.",
      "source": "Tatoeba",
      "sourceId": 5780584,
      "translationId": 4083734
    },
    {
      "id": "intermediate-058",
      "level": "intermediate",
      "zh": "这样做你能节约几个小时。",
      "en": "If you do it this way, you can save several hours.",
      "source": "Tatoeba",
      "sourceId": 9518505,
      "translationId": 62329
    },
    {
      "id": "intermediate-059",
      "level": "intermediate",
      "zh": "这个夏天他要去英国旅游。",
      "en": "He is going to go to England for a trip this summer.",
      "source": "Tatoeba",
      "sourceId": 3216470,
      "translationId": 7213823
    },
    {
      "id": "intermediate-060",
      "level": "intermediate",
      "zh": "你认为他适合这个职位吗？",
      "en": "Do you think he is good for the position?",
      "source": "Tatoeba",
      "sourceId": 334067,
      "translationId": 291159
    },
    {
      "id": "intermediate-061",
      "level": "intermediate",
      "zh": "从网上退下来去洗个澡吧。",
      "en": "Get off the internet and take a shower.",
      "source": "Tatoeba",
      "sourceId": 7781501,
      "translationId": 7785204
    },
    {
      "id": "intermediate-062",
      "level": "intermediate",
      "zh": "生活对于那些有工作的母亲来说并不简单。",
      "en": "Life is not easy for working mothers.",
      "source": "Tatoeba",
      "sourceId": 11698186,
      "translationId": 11378703
    },
    {
      "id": "intermediate-063",
      "level": "intermediate",
      "zh": "我的照相机在火车上被偷了。",
      "en": "My camera was stolen on the train.",
      "source": "Tatoeba",
      "sourceId": 476640,
      "translationId": 2846107
    },
    {
      "id": "intermediate-064",
      "level": "intermediate",
      "zh": "过去我们每个周末都去溜冰。",
      "en": "We used to go skating every weekend.",
      "source": "Tatoeba",
      "sourceId": 333149,
      "translationId": 249380
    },
    {
      "id": "intermediate-065",
      "level": "intermediate",
      "zh": "我是个有缺点的人，但这些缺点很容易就能被改正。",
      "en": "I am not without my shortcomings, but these shortcomings can easily be amended.",
      "source": "Tatoeba",
      "sourceId": 501343,
      "translationId": 606854
    },
    {
      "id": "intermediate-066",
      "level": "intermediate",
      "zh": "有时候你那精疲力尽的面孔出现在我的眼前。",
      "en": "Sometimes that tired-out face of yours appears in front of my eyes.",
      "source": "Tatoeba",
      "sourceId": 1504004,
      "translationId": 11277871
    },
    {
      "id": "intermediate-067",
      "level": "intermediate",
      "zh": "我们应该根据他的作为来评判他。",
      "en": "We should judge him according to his actions.",
      "source": "Tatoeba",
      "sourceId": 802918,
      "translationId": 802919
    },
    {
      "id": "intermediate-068",
      "level": "intermediate",
      "zh": "因为害怕不及格，他努力学习。",
      "en": "He studied hard for fear he should fail.",
      "source": "Tatoeba",
      "sourceId": 1323605,
      "translationId": 298934
    },
    {
      "id": "intermediate-069",
      "level": "intermediate",
      "zh": "你的国家的最低工资是多少？",
      "en": "What's the minimum wage in your country?",
      "source": "Tatoeba",
      "sourceId": 8863035,
      "translationId": 1534782
    },
    {
      "id": "intermediate-070",
      "level": "intermediate",
      "zh": "冬天有很多老人在冰上滑倒。",
      "en": "In the winter, many older people slip on ice and fall down.",
      "source": "Tatoeba",
      "sourceId": 5640779,
      "translationId": 279649
    },
    {
      "id": "intermediate-071",
      "level": "intermediate",
      "zh": "有空的时候，我总喜欢听古典音乐。",
      "en": "I always enjoy listening to classical music in my free time.",
      "source": "Tatoeba",
      "sourceId": 334071,
      "translationId": 386732
    },
    {
      "id": "intermediate-072",
      "level": "intermediate",
      "zh": "您需要带两张本人的白底报名照。",
      "en": "You will need to bring two passport-sized photos of yourself taken with a white background.",
      "source": "Tatoeba",
      "sourceId": 808202,
      "translationId": 694078
    },
    {
      "id": "intermediate-073",
      "level": "intermediate",
      "zh": "你们要我带什么东西吗？",
      "en": "Do you all want me to bring you anything?",
      "source": "Tatoeba",
      "sourceId": 3168831,
      "translationId": 3170888
    },
    {
      "id": "intermediate-074",
      "level": "intermediate",
      "zh": "我建议让我们结束会议。",
      "en": "I suggested that we bring the meeting to an end.",
      "source": "Tatoeba",
      "sourceId": 956003,
      "translationId": 22423
    },
    {
      "id": "intermediate-075",
      "level": "intermediate",
      "zh": "对不起，我在睡午觉，没听到你按门铃。",
      "en": "Sorry, I was taking a nap and didn't hear you ring the doorbell.",
      "source": "Tatoeba",
      "sourceId": 10913657,
      "translationId": 11552037
    },
    {
      "id": "intermediate-076",
      "level": "intermediate",
      "zh": "我昨晚不应该喝那么多酒的。",
      "en": "I shouldn't have drunk so much beer last night.",
      "source": "Tatoeba",
      "sourceId": 13882183,
      "translationId": 1887669
    },
    {
      "id": "intermediate-077",
      "level": "intermediate",
      "zh": "我很开心你不在我朋友卷里。",
      "en": "I'm glad you're not in my circle of friends.",
      "source": "Tatoeba",
      "sourceId": 5136725,
      "translationId": 4499495
    },
    {
      "id": "intermediate-078",
      "level": "intermediate",
      "zh": "为什么你送给他这个礼物？",
      "en": "Why did you give him this gift?",
      "source": "Tatoeba",
      "sourceId": 1505022,
      "translationId": 1513437
    },
    {
      "id": "intermediate-079",
      "level": "intermediate",
      "zh": "为了感谢您，这里有份礼物。",
      "en": "To thank you, here is a gift.",
      "source": "Tatoeba",
      "sourceId": 336660,
      "translationId": 7782265
    },
    {
      "id": "intermediate-080",
      "level": "intermediate",
      "zh": "我比刚才饿多了。",
      "en": "I'm a lot hungrier now than I was before.",
      "source": "Tatoeba",
      "sourceId": 9432367,
      "translationId": 2538546
    },
    {
      "id": "intermediate-081",
      "level": "intermediate",
      "zh": "我真是哭笑不得。",
      "en": "I do not know whether to take it as a compliment or an insult.",
      "source": "Tatoeba",
      "sourceId": 1946774,
      "translationId": 1681405
    },
    {
      "id": "intermediate-082",
      "level": "intermediate",
      "zh": "再想别的办法吧。",
      "en": "We'll find some other way to do that.",
      "source": "Tatoeba",
      "sourceId": 10511443,
      "translationId": 3312038
    },
    {
      "id": "intermediate-083",
      "level": "intermediate",
      "zh": "不要听风就是雨。",
      "en": "If you hear hoofbeats, don't look for zebras.",
      "source": "Tatoeba",
      "sourceId": 799242,
      "translationId": 409495
    },
    {
      "id": "intermediate-084",
      "level": "intermediate",
      "zh": "我不用打扫房间。",
      "en": "I don't have to clean my room.",
      "source": "Tatoeba",
      "sourceId": 472868,
      "translationId": 261572
    },
    {
      "id": "intermediate-085",
      "level": "intermediate",
      "zh": "他昨天看了一部最有趣的小说。",
      "en": "Yesterday, he read the most interesting novel.",
      "source": "Tatoeba",
      "sourceId": 332448,
      "translationId": 4577214
    },
    {
      "id": "intermediate-086",
      "level": "intermediate",
      "zh": "我没去过我叔叔的房子。",
      "en": "I've never been to my uncle's house.",
      "source": "Tatoeba",
      "sourceId": 5845599,
      "translationId": 253226
    },
    {
      "id": "intermediate-087",
      "level": "intermediate",
      "zh": "努力工作才能养活自己。",
      "en": "Work hard so that you may earn your living.",
      "source": "Tatoeba",
      "sourceId": 1718723,
      "translationId": 271780
    },
    {
      "id": "intermediate-088",
      "level": "intermediate",
      "zh": "我可不能把阿渚交给这种文弱的男人。",
      "en": "I can't hand Nagisa over to such a weak man.",
      "source": "Tatoeba",
      "sourceId": 347560,
      "translationId": 7768916
    },
    {
      "id": "intermediate-089",
      "level": "intermediate",
      "zh": "我们这周末应该干点什么的。",
      "en": "We should do something this weekend.",
      "source": "Tatoeba",
      "sourceId": 6828273,
      "translationId": 3804552
    },
    {
      "id": "intermediate-090",
      "level": "intermediate",
      "zh": "他很害羞，都不敢和女孩子说话。",
      "en": "He is too shy to talk to girls.",
      "source": "Tatoeba",
      "sourceId": 1883092,
      "translationId": 292147
    },
    {
      "id": "intermediate-091",
      "level": "intermediate",
      "zh": "她在数学上不如他。",
      "en": "She is inferior to him in math.",
      "source": "Tatoeba",
      "sourceId": 396113,
      "translationId": 310013
    },
    {
      "id": "intermediate-092",
      "level": "intermediate",
      "zh": "不要担心，会没事的。",
      "en": "Don't worry, it'll be okay.",
      "source": "Tatoeba",
      "sourceId": 8730052,
      "translationId": 9711748
    },
    {
      "id": "intermediate-093",
      "level": "intermediate",
      "zh": "我再也不相信他了。",
      "en": "I do not trust him any longer.",
      "source": "Tatoeba",
      "sourceId": 478819,
      "translationId": 255797
    },
    {
      "id": "intermediate-094",
      "level": "intermediate",
      "zh": "哎呀，差点上课迟到！",
      "en": "Ach, I was almost late to class!",
      "source": "Tatoeba",
      "sourceId": 10024477,
      "translationId": 10333299
    },
    {
      "id": "intermediate-095",
      "level": "intermediate",
      "zh": "您应该去看看医生。",
      "en": "You should pay the doctor a visit.",
      "source": "Tatoeba",
      "sourceId": 2437268,
      "translationId": 2438442
    },
    {
      "id": "intermediate-096",
      "level": "intermediate",
      "zh": "我的办公室在那幢灰色的六层楼的四楼。",
      "en": "My office is on the fourth floor of that gray six-story building.",
      "source": "Tatoeba",
      "sourceId": 8500070,
      "translationId": 251001
    },
    {
      "id": "intermediate-097",
      "level": "intermediate",
      "zh": "他们约了七点在这儿碰头。",
      "en": "They planned to get together here at 7 o'clock.",
      "source": "Tatoeba",
      "sourceId": 718626,
      "translationId": 1242620
    },
    {
      "id": "intermediate-098",
      "level": "intermediate",
      "zh": "尽管下着雨，他还是出去了。",
      "en": "He went out in spite of the rain.",
      "source": "Tatoeba",
      "sourceId": 375288,
      "translationId": 26774
    },
    {
      "id": "intermediate-099",
      "level": "intermediate",
      "zh": "还有二十分钟，时间很充裕。",
      "en": "There is still 20 minutes left; that is plenty of time.",
      "source": "Tatoeba",
      "sourceId": 382993,
      "translationId": 7766807
    },
    {
      "id": "intermediate-100",
      "level": "intermediate",
      "zh": "你们不需要害怕犯错。",
      "en": "You don't need to be afraid of making mistakes.",
      "source": "Tatoeba",
      "sourceId": 8878022,
      "translationId": 1397771
    },
    {
      "id": "intermediate-101",
      "level": "intermediate",
      "zh": "你扫完以后，我会拖地。",
      "en": "When you're done sweeping, I'll mop.",
      "source": "Tatoeba",
      "sourceId": 4762212,
      "translationId": 4413097
    },
    {
      "id": "intermediate-102",
      "level": "intermediate",
      "zh": "应该趁年轻多读点书。",
      "en": "You should read many books when you are young.",
      "source": "Tatoeba",
      "sourceId": 812234,
      "translationId": 639885
    },
    {
      "id": "intermediate-103",
      "level": "intermediate",
      "zh": "王小姐有一点固执，但是她还算是一个好学生。",
      "en": "Miss Wang has a trace of obstinacy in her, but she is still a good student.",
      "source": "Tatoeba",
      "sourceId": 1565719,
      "translationId": 1565749
    },
    {
      "id": "intermediate-104",
      "level": "intermediate",
      "zh": "我们的对话总是以争吵收场。",
      "en": "Our conversation always ends in a quarrel.",
      "source": "Tatoeba",
      "sourceId": 466084,
      "translationId": 247450
    },
    {
      "id": "intermediate-105",
      "level": "intermediate",
      "zh": "我只想向自己证明我可以做到。",
      "en": "I just wanted to prove to myself that I could do this.",
      "source": "Tatoeba",
      "sourceId": 8555682,
      "translationId": 8555606
    },
    {
      "id": "intermediate-106",
      "level": "intermediate",
      "zh": "没有太阳，不可能有生命。",
      "en": "There cannot be life without the sun.",
      "source": "Tatoeba",
      "sourceId": 2188498,
      "translationId": 8590993
    },
    {
      "id": "intermediate-107",
      "level": "intermediate",
      "zh": "你在一个安全的地方。",
      "en": "You are at a safe place.",
      "source": "Tatoeba",
      "sourceId": 469314,
      "translationId": 5870602
    },
    {
      "id": "intermediate-108",
      "level": "intermediate",
      "zh": "请你不要发信息给我。",
      "en": "Please don't send me messages.",
      "source": "Tatoeba",
      "sourceId": 9821316,
      "translationId": 11818270
    },
    {
      "id": "intermediate-109",
      "level": "intermediate",
      "zh": "我在报纸上看到了它。",
      "en": "I saw it in the newspaper.",
      "source": "Tatoeba",
      "sourceId": 332437,
      "translationId": 387702
    },
    {
      "id": "intermediate-110",
      "level": "intermediate",
      "zh": "这张纸太大，塞不进信封里。",
      "en": "The paper is too big for the envelope.",
      "source": "Tatoeba",
      "sourceId": 1397319,
      "translationId": 59053
    },
    {
      "id": "intermediate-111",
      "level": "intermediate",
      "zh": "我规定自己在九点之后不看电视。",
      "en": "I make it a rule not to watch television after nine o'clock.",
      "source": "Tatoeba",
      "sourceId": 8714987,
      "translationId": 18400
    },
    {
      "id": "intermediate-112",
      "level": "intermediate",
      "zh": "你知道这儿附近有什么好餐馆吗？",
      "en": "Do you know of any good restaurant near here?",
      "source": "Tatoeba",
      "sourceId": 390531,
      "translationId": 61364
    },
    {
      "id": "intermediate-113",
      "level": "intermediate",
      "zh": "如果我们不继续赶路，我们会迟到的。",
      "en": "If we don't keep walking, we'll be late.",
      "source": "Tatoeba",
      "sourceId": 2482650,
      "translationId": 2476333
    },
    {
      "id": "intermediate-114",
      "level": "intermediate",
      "zh": "她说很满意她的生活。",
      "en": "She says that she is content with her life.",
      "source": "Tatoeba",
      "sourceId": 465922,
      "translationId": 7825183
    },
    {
      "id": "intermediate-115",
      "level": "intermediate",
      "zh": "你该听妈妈的话。",
      "en": "You ought to listen to your mother.",
      "source": "Tatoeba",
      "sourceId": 399179,
      "translationId": 399178
    },
    {
      "id": "intermediate-116",
      "level": "intermediate",
      "zh": "她喜欢去图书馆。",
      "en": "She likes to go to the library.",
      "source": "Tatoeba",
      "sourceId": 6563547,
      "translationId": 1588719
    },
    {
      "id": "intermediate-117",
      "level": "intermediate",
      "zh": "附近有一家花店。",
      "en": "There is a flower shop near by.",
      "source": "Tatoeba",
      "sourceId": 13827607,
      "translationId": 18737
    },
    {
      "id": "intermediate-118",
      "level": "intermediate",
      "zh": "他们常在这儿打羽毛球。",
      "en": "They play badminton here often.",
      "source": "Tatoeba",
      "sourceId": 1231595,
      "translationId": 13103160
    },
    {
      "id": "intermediate-119",
      "level": "intermediate",
      "zh": "他觉得必须报道这件事。",
      "en": "He felt compelled to report the incident.",
      "source": "Tatoeba",
      "sourceId": 4948552,
      "translationId": 4948554
    },
    {
      "id": "intermediate-120",
      "level": "intermediate",
      "zh": "我的朋友相信阴谋论，我该试着向他指出他错了吗？",
      "en": "My friend believes conspiracy theories; should I try to prove him wrong?",
      "source": "Tatoeba",
      "sourceId": 7772529,
      "translationId": 7584264
    },
    {
      "id": "intermediate-121",
      "level": "intermediate",
      "zh": "我把钱都花在衣服、食物和书籍上了。",
      "en": "I spent my money on clothes, food and books.",
      "source": "Tatoeba",
      "sourceId": 12686159,
      "translationId": 10193663
    },
    {
      "id": "intermediate-122",
      "level": "intermediate",
      "zh": "她一劳永逸地告诉我，她不想再见我了。",
      "en": "She told me once and for all that she did not want to see me again.",
      "source": "Tatoeba",
      "sourceId": 9961303,
      "translationId": 312341
    },
    {
      "id": "intermediate-123",
      "level": "intermediate",
      "zh": "那离欧洲有点远，你不觉得吗？",
      "en": "That's kind of far from Europe, don't you think?",
      "source": "Tatoeba",
      "sourceId": 7795217,
      "translationId": 5674067
    },
    {
      "id": "intermediate-124",
      "level": "intermediate",
      "zh": "这地方给我一个很差的印象。",
      "en": "This place gives me a really bad vibe.",
      "source": "Tatoeba",
      "sourceId": 819693,
      "translationId": 592488
    },
    {
      "id": "intermediate-125",
      "level": "intermediate",
      "zh": "我喜欢动物，除了猫。",
      "en": "Apart from cats, I like animals.",
      "source": "Tatoeba",
      "sourceId": 1372498,
      "translationId": 282071
    },
    {
      "id": "intermediate-126",
      "level": "intermediate",
      "zh": "你这样不分昼夜地工作，将会伤害自己的健康。",
      "en": "If you work day and night, you will lose your health.",
      "source": "Tatoeba",
      "sourceId": 604462,
      "translationId": 277626
    },
    {
      "id": "intermediate-127",
      "level": "intermediate",
      "zh": "今天早饭我吃了些腌鲱鱼。",
      "en": "Today I had some kipper for breakfast.",
      "source": "Tatoeba",
      "sourceId": 5899458,
      "translationId": 3779917
    },
    {
      "id": "intermediate-128",
      "level": "intermediate",
      "zh": "我会把所有有用的信息提供给您的。",
      "en": "I will provide you all the necessary information.",
      "source": "Tatoeba",
      "sourceId": 805039,
      "translationId": 526662
    },
    {
      "id": "intermediate-129",
      "level": "intermediate",
      "zh": "我们已经等了那么久。",
      "en": "We waited for such a long time.",
      "source": "Tatoeba",
      "sourceId": 3526218,
      "translationId": 7794250
    },
    {
      "id": "intermediate-130",
      "level": "intermediate",
      "zh": "我不会在这里呆很久。",
      "en": "I won't stay here for long.",
      "source": "Tatoeba",
      "sourceId": 5095181,
      "translationId": 5093726
    },
    {
      "id": "intermediate-131",
      "level": "intermediate",
      "zh": "我想您要拿到驾照根本不难。",
      "en": "I think you'll have very little difficulty in getting a driver's license.",
      "source": "Tatoeba",
      "sourceId": 469318,
      "translationId": 16302
    },
    {
      "id": "intermediate-132",
      "level": "intermediate",
      "zh": "我的外公想安静地度过晚年。",
      "en": "My grandfather wants to live quietly for the rest of his life.",
      "source": "Tatoeba",
      "sourceId": 604463,
      "translationId": 273876
    },
    {
      "id": "intermediate-133",
      "level": "intermediate",
      "zh": "我们必须始终为灾害做好准备。",
      "en": "We must always be prepared for disasters.",
      "source": "Tatoeba",
      "sourceId": 336856,
      "translationId": 22899
    },
    {
      "id": "intermediate-134",
      "level": "intermediate",
      "zh": "世界上有10种人：懂二进制和不懂二进制的人。",
      "en": "There are 10 types of people in the world: those who understand binary, and those who don't.",
      "source": "Tatoeba",
      "sourceId": 502739,
      "translationId": 1797
    },
    {
      "id": "intermediate-135",
      "level": "intermediate",
      "zh": "她不喜欢我说话的方式。",
      "en": "She doesn't like the way I speak.",
      "source": "Tatoeba",
      "sourceId": 332617,
      "translationId": 314395
    },
    {
      "id": "intermediate-136",
      "level": "intermediate",
      "zh": "猪肉，牛肉，鸡蛋我都不吃。",
      "en": "I don't eat pork, beef or eggs.",
      "source": "Tatoeba",
      "sourceId": 1335292,
      "translationId": 1335294
    },
    {
      "id": "intermediate-137",
      "level": "intermediate",
      "zh": "去您那儿怎么走最方便？",
      "en": "What is the most convenient route to your place?",
      "source": "Tatoeba",
      "sourceId": 3493093,
      "translationId": 9981708
    },
    {
      "id": "intermediate-138",
      "level": "intermediate",
      "zh": "一瓶啤酒多少钱？",
      "en": "How much does a beer cost?",
      "source": "Tatoeba",
      "sourceId": 774305,
      "translationId": 436173
    },
    {
      "id": "intermediate-139",
      "level": "intermediate",
      "zh": "但如果他说不呢？",
      "en": "But what if he says no?",
      "source": "Tatoeba",
      "sourceId": 10538610,
      "translationId": 5894451
    },
    {
      "id": "intermediate-140",
      "level": "intermediate",
      "zh": "你认识她多久了？",
      "en": "How long have you known her?",
      "source": "Tatoeba",
      "sourceId": 444701,
      "translationId": 308626
    },
    {
      "id": "intermediate-141",
      "level": "intermediate",
      "zh": "我明天要去上海。",
      "en": "Tomorrow I'm going to Shanghai.",
      "source": "Tatoeba",
      "sourceId": 1953188,
      "translationId": 1953205
    },
    {
      "id": "intermediate-142",
      "level": "intermediate",
      "zh": "他正在听收音机。",
      "en": "He is listening to the radio.",
      "source": "Tatoeba",
      "sourceId": 12685980,
      "translationId": 293340
    },
    {
      "id": "intermediate-143",
      "level": "intermediate",
      "zh": "阅读一本书可以比作一次旅行。",
      "en": "Reading a book can be compared to a journey.",
      "source": "Tatoeba",
      "sourceId": 1313759,
      "translationId": 1550197
    },
    {
      "id": "intermediate-144",
      "level": "intermediate",
      "zh": "让我给你介绍一下我的父母。",
      "en": "Let me introduce my parents to you.",
      "source": "Tatoeba",
      "sourceId": 1779205,
      "translationId": 325731
    },
    {
      "id": "intermediate-145",
      "level": "intermediate",
      "zh": "我每次见到你就会想起你的母亲。",
      "en": "Every time I see you, I think of your mother.",
      "source": "Tatoeba",
      "sourceId": 710866,
      "translationId": 252755
    },
    {
      "id": "intermediate-146",
      "level": "intermediate",
      "zh": "我肯定你会喜欢我们今晚的菜肴。",
      "en": "I'm sure you'll love what we have on the menu tonight.",
      "source": "Tatoeba",
      "sourceId": 332978,
      "translationId": 36567
    },
    {
      "id": "intermediate-147",
      "level": "intermediate",
      "zh": "他八岁时离开了他的父母。",
      "en": "He left his parents when he was eight years old.",
      "source": "Tatoeba",
      "sourceId": 427181,
      "translationId": 427178
    },
    {
      "id": "intermediate-148",
      "level": "intermediate",
      "zh": "他家后面有小溪，清可见底。",
      "en": "Behind his house is a stream so clear that you can see the bottom of it.",
      "source": "Tatoeba",
      "sourceId": 1759602,
      "translationId": 12114703
    },
    {
      "id": "intermediate-149",
      "level": "intermediate",
      "zh": "你啥时候来看我？",
      "en": "When are you going to come and see me?",
      "source": "Tatoeba",
      "sourceId": 1870585,
      "translationId": 11160354
    },
    {
      "id": "intermediate-150",
      "level": "intermediate",
      "zh": "这件事至关重要。",
      "en": "This is a matter of the utmost importance.",
      "source": "Tatoeba",
      "sourceId": 332559,
      "translationId": 55708
    },
    {
      "id": "intermediate-151",
      "level": "intermediate",
      "zh": "你只会逃避生活问题。",
      "en": "You're just running away from life's problems.",
      "source": "Tatoeba",
      "sourceId": 501364,
      "translationId": 1388
    },
    {
      "id": "intermediate-152",
      "level": "intermediate",
      "zh": "从窗户可以看见高楼。",
      "en": "The high building can be seen from the window.",
      "source": "Tatoeba",
      "sourceId": 334202,
      "translationId": 274168
    },
    {
      "id": "intermediate-153",
      "level": "intermediate",
      "zh": "他们给了他逃脱的机会。",
      "en": "They gave him a chance to escape.",
      "source": "Tatoeba",
      "sourceId": 429353,
      "translationId": 317715
    },
    {
      "id": "intermediate-154",
      "level": "intermediate",
      "zh": "你要把它放在哪里？",
      "en": "Where will you put it?",
      "source": "Tatoeba",
      "sourceId": 13881202,
      "translationId": 3439469
    },
    {
      "id": "intermediate-155",
      "level": "intermediate",
      "zh": "会议一直开到五点。",
      "en": "The meeting lasted until 5.",
      "source": "Tatoeba",
      "sourceId": 1517480,
      "translationId": 22493
    },
    {
      "id": "intermediate-156",
      "level": "intermediate",
      "zh": "我没有你那么聪明。",
      "en": "I'm not as smart as you.",
      "source": "Tatoeba",
      "sourceId": 9955479,
      "translationId": 3500611
    },
    {
      "id": "intermediate-157",
      "level": "intermediate",
      "zh": "你看起来病怏怏的，还好吗？",
      "en": "You look sick; are you alright?",
      "source": "Tatoeba",
      "sourceId": 9974964,
      "translationId": 10372249
    },
    {
      "id": "intermediate-158",
      "level": "intermediate",
      "zh": "劳动不仅是一种需要，而还是一种愉快。",
      "en": "Labor is not merely a necessity but a pleasure.",
      "source": "Tatoeba",
      "sourceId": 760653,
      "translationId": 326334
    },
    {
      "id": "intermediate-159",
      "level": "intermediate",
      "zh": "我会给他买一支铅笔。",
      "en": "I'll buy him a pencil.",
      "source": "Tatoeba",
      "sourceId": 7785254,
      "translationId": 489027
    },
    {
      "id": "intermediate-160",
      "level": "intermediate",
      "zh": "这辆车保养起来很贵。",
      "en": "It is expensive running this car.",
      "source": "Tatoeba",
      "sourceId": 333042,
      "translationId": 58753
    },
    {
      "id": "intermediate-161",
      "level": "intermediate",
      "zh": "这架照相机我不喜欢。",
      "en": "I don't like this camera.",
      "source": "Tatoeba",
      "sourceId": 545870,
      "translationId": 61218
    },
    {
      "id": "intermediate-162",
      "level": "intermediate",
      "zh": "向日葵总是面向太阳。",
      "en": "Sunflowers always point towards the sun.",
      "source": "Tatoeba",
      "sourceId": 13882008,
      "translationId": 12597680
    },
    {
      "id": "intermediate-163",
      "level": "intermediate",
      "zh": "在二零三零年，百分之二十一的人口将是六十五年多。",
      "en": "By 2030, twenty-one percent of its population will be over sixty-five.",
      "source": "Tatoeba",
      "sourceId": 8932436,
      "translationId": 72978
    },
    {
      "id": "intermediate-164",
      "level": "intermediate",
      "zh": "我妹妹比你矮。",
      "en": "My sister is shorter than you.",
      "source": "Tatoeba",
      "sourceId": 856387,
      "translationId": 250962
    },
    {
      "id": "intermediate-165",
      "level": "intermediate",
      "zh": "这个主意不错。",
      "en": "That's not a bad idea.",
      "source": "Tatoeba",
      "sourceId": 1413703,
      "translationId": 42025
    },
    {
      "id": "intermediate-166",
      "level": "intermediate",
      "zh": "除非有可靠的证据，不然我们不应该相信任何事。",
      "en": "Unless there is reliable evidence for it, we should not believe anything.",
      "source": "Tatoeba",
      "sourceId": 1477295,
      "translationId": 1477304
    },
    {
      "id": "intermediate-167",
      "level": "intermediate",
      "zh": "他对自己的思维方式进行着很多思考。",
      "en": "He puts a lot of thought into how he thinks.",
      "source": "Tatoeba",
      "sourceId": 1316894,
      "translationId": 646787
    },
    {
      "id": "intermediate-168",
      "level": "intermediate",
      "zh": "这个看法可能是正确的。",
      "en": "Maybe this opinion is correct.",
      "source": "Tatoeba",
      "sourceId": 888422,
      "translationId": 888423
    },
    {
      "id": "intermediate-169",
      "level": "intermediate",
      "zh": "天气预报说明天会下雪。",
      "en": "The forecast says it'll snow tomorrow.",
      "source": "Tatoeba",
      "sourceId": 4960569,
      "translationId": 10068484
    },
    {
      "id": "intermediate-170",
      "level": "intermediate",
      "zh": "我们担心着外公和外婆。",
      "en": "We're worried about Grandma and Grandpa.",
      "source": "Tatoeba",
      "sourceId": 3068506,
      "translationId": 247158
    },
    {
      "id": "intermediate-171",
      "level": "intermediate",
      "zh": "他总有一天要返回日本。",
      "en": "One day he will return to Japan.",
      "source": "Tatoeba",
      "sourceId": 956044,
      "translationId": 1612805
    },
    {
      "id": "intermediate-172",
      "level": "intermediate",
      "zh": "我们收养了一个孩子。",
      "en": "We adopted a child.",
      "source": "Tatoeba",
      "sourceId": 9690048,
      "translationId": 263053
    },
    {
      "id": "intermediate-173",
      "level": "intermediate",
      "zh": "你现在有几块电池呀？",
      "en": "How many batteries do you have right now?",
      "source": "Tatoeba",
      "sourceId": 1860171,
      "translationId": 4761242
    },
    {
      "id": "intermediate-174",
      "level": "intermediate",
      "zh": "如果可能的话，这周末。",
      "en": "If possible, this weekend.",
      "source": "Tatoeba",
      "sourceId": 334252,
      "translationId": 1230730
    },
    {
      "id": "intermediate-175",
      "level": "intermediate",
      "zh": "他的自行车是蓝色的。",
      "en": "His bicycle is blue.",
      "source": "Tatoeba",
      "sourceId": 334534,
      "translationId": 386701
    },
    {
      "id": "intermediate-176",
      "level": "intermediate",
      "zh": "没有什么和和平一样重要。",
      "en": "Nothing is as important as peace.",
      "source": "Tatoeba",
      "sourceId": 334140,
      "translationId": 320180
    },
    {
      "id": "intermediate-177",
      "level": "intermediate",
      "zh": "她上周去旅行了。",
      "en": "She set out on a trip last week.",
      "source": "Tatoeba",
      "sourceId": 917916,
      "translationId": 313804
    },
    {
      "id": "intermediate-178",
      "level": "intermediate",
      "zh": "我的哥哥是很狂热的足球迷。",
      "en": "My older brother is a very enthusiastic soccer fan.",
      "source": "Tatoeba",
      "sourceId": 5574352,
      "translationId": 3274464
    },
    {
      "id": "intermediate-179",
      "level": "intermediate",
      "zh": "他的故事不会是假的。",
      "en": "His story can't be false.",
      "source": "Tatoeba",
      "sourceId": 713100,
      "translationId": 287877
    },
    {
      "id": "intermediate-180",
      "level": "intermediate",
      "zh": "我想要本好词典。",
      "en": "I want a good dictionary.",
      "source": "Tatoeba",
      "sourceId": 4265103,
      "translationId": 453183
    },
    {
      "id": "intermediate-181",
      "level": "intermediate",
      "zh": "你听到新闻了吗？",
      "en": "Did you hear the news?",
      "source": "Tatoeba",
      "sourceId": 345984,
      "translationId": 69991
    },
    {
      "id": "intermediate-182",
      "level": "intermediate",
      "zh": "昨晚我玩得开心。",
      "en": "I had fun last night.",
      "source": "Tatoeba",
      "sourceId": 5091761,
      "translationId": 2331654
    },
    {
      "id": "intermediate-183",
      "level": "intermediate",
      "zh": "不用担心其他人。",
      "en": "Don't worry about others.",
      "source": "Tatoeba",
      "sourceId": 510742,
      "translationId": 274705
    },
    {
      "id": "intermediate-184",
      "level": "intermediate",
      "zh": "我数学学的很好。",
      "en": "I'm good at mathematics.",
      "source": "Tatoeba",
      "sourceId": 375972,
      "translationId": 944962
    },
    {
      "id": "intermediate-185",
      "level": "intermediate",
      "zh": "我的头像漂亮吗？",
      "en": "Is my profile picture beautiful?",
      "source": "Tatoeba",
      "sourceId": 8577512,
      "translationId": 7847180
    },
    {
      "id": "intermediate-186",
      "level": "intermediate",
      "zh": "那是一张近照吗？",
      "en": "Is it a recent picture?",
      "source": "Tatoeba",
      "sourceId": 16,
      "translationId": 1291
    },
    {
      "id": "intermediate-187",
      "level": "intermediate",
      "zh": "她刚刚十二岁了。",
      "en": "She has just turned twelve.",
      "source": "Tatoeba",
      "sourceId": 1288216,
      "translationId": 316059
    },
    {
      "id": "intermediate-188",
      "level": "intermediate",
      "zh": "这是我度过的最好的夜晚之一。",
      "en": "It was one of the best nights I've had.",
      "source": "Tatoeba",
      "sourceId": 5574441,
      "translationId": 1655354
    },
    {
      "id": "intermediate-189",
      "level": "intermediate",
      "zh": "运动内衣最好只在运动时穿着，在其他非运动场合不穿。",
      "en": "A sports bra should only be worn for working out, and not in any non-sports situations.",
      "source": "Tatoeba",
      "sourceId": 10908874,
      "translationId": 12977881
    },
    {
      "id": "intermediate-190",
      "level": "intermediate",
      "zh": "法语太难了，我不想学。",
      "en": "French is too hard. I don't want to learn it.",
      "source": "Tatoeba",
      "sourceId": 8709805,
      "translationId": 979263
    },
    {
      "id": "intermediate-191",
      "level": "intermediate",
      "zh": "他要不行了。",
      "en": "He's on his last legs.",
      "source": "Tatoeba",
      "sourceId": 10287442,
      "translationId": 1401237
    },
    {
      "id": "intermediate-192",
      "level": "intermediate",
      "zh": "每年冬天，我的嘴唇都会干裂。",
      "en": "I get chapped lips every winter.",
      "source": "Tatoeba",
      "sourceId": 3667864,
      "translationId": 2976292
    },
    {
      "id": "intermediate-193",
      "level": "intermediate",
      "zh": "你应该直接拒绝他的要求。",
      "en": "You should have refused his request flatly.",
      "source": "Tatoeba",
      "sourceId": 3068630,
      "translationId": 15903
    },
    {
      "id": "intermediate-194",
      "level": "intermediate",
      "zh": "每个人都将在原则上同意那个想法。",
      "en": "Everyone will accept that idea in principle.",
      "source": "Tatoeba",
      "sourceId": 1428120,
      "translationId": 276530
    },
    {
      "id": "intermediate-195",
      "level": "intermediate",
      "zh": "不要害怕付出。",
      "en": "Don't be afraid to invest time and energy.",
      "source": "Tatoeba",
      "sourceId": 735157,
      "translationId": 735158
    },
    {
      "id": "intermediate-196",
      "level": "intermediate",
      "zh": "他看上去显老。",
      "en": "He is not as young as he looks.",
      "source": "Tatoeba",
      "sourceId": 377447,
      "translationId": 296006
    },
    {
      "id": "intermediate-197",
      "level": "intermediate",
      "zh": "我什么都看不见。",
      "en": "I didn't see anything at all.",
      "source": "Tatoeba",
      "sourceId": 614444,
      "translationId": 5440604
    },
    {
      "id": "intermediate-198",
      "level": "intermediate",
      "zh": "她问这怎么可能。",
      "en": "She's asking how that's possible.",
      "source": "Tatoeba",
      "sourceId": 501363,
      "translationId": 1387
    },
    {
      "id": "intermediate-199",
      "level": "intermediate",
      "zh": "这些鞋子太紧了，伤脚。",
      "en": "These shoes are too tight. They hurt.",
      "source": "Tatoeba",
      "sourceId": 1783815,
      "translationId": 18119
    },
    {
      "id": "intermediate-200",
      "level": "intermediate",
      "zh": "我为你保存这些东西。",
      "en": "I've been saving these for you.",
      "source": "Tatoeba",
      "sourceId": 8853709,
      "translationId": 6575678
    },
    {
      "id": "intermediate-201",
      "level": "intermediate",
      "zh": "恰巧我们有同样的生日。",
      "en": "It happens that we have the same birthday.",
      "source": "Tatoeba",
      "sourceId": 5136717,
      "translationId": 248188
    },
    {
      "id": "intermediate-202",
      "level": "intermediate",
      "zh": "会议什么时候开始？",
      "en": "How soon will the meeting begin?",
      "source": "Tatoeba",
      "sourceId": 1438406,
      "translationId": 37546
    },
    {
      "id": "intermediate-203",
      "level": "intermediate",
      "zh": "这张桌子缺了个角。",
      "en": "This table is missing a leg.",
      "source": "Tatoeba",
      "sourceId": 5152968,
      "translationId": 5165026
    },
    {
      "id": "intermediate-204",
      "level": "intermediate",
      "zh": "你不应该在社交网络上分享过多私人信息。",
      "en": "You shouldn't share too much private information on the social networks.",
      "source": "Tatoeba",
      "sourceId": 1454427,
      "translationId": 954814
    },
    {
      "id": "intermediate-205",
      "level": "intermediate",
      "zh": "虽然我被公司解雇了，但是我还有点存款，所以目前不用担心生计问题。",
      "en": "I got the sack but I've a little saved up, so for the time being I won't be troubled by living expenses.",
      "source": "Tatoeba",
      "sourceId": 8929162,
      "translationId": 327437
    },
    {
      "id": "intermediate-206",
      "level": "intermediate",
      "zh": "你需要多少呀？",
      "en": "How much do you need?",
      "source": "Tatoeba",
      "sourceId": 10333103,
      "translationId": 436187
    },
    {
      "id": "intermediate-207",
      "level": "intermediate",
      "zh": "他的名声很好。",
      "en": "He has a good reputation.",
      "source": "Tatoeba",
      "sourceId": 718424,
      "translationId": 303085
    },
    {
      "id": "intermediate-208",
      "level": "intermediate",
      "zh": "你刷过牙没有？",
      "en": "Did you brush your teeth?",
      "source": "Tatoeba",
      "sourceId": 3516206,
      "translationId": 263600
    },
    {
      "id": "intermediate-209",
      "level": "intermediate",
      "zh": "她在开始练习。",
      "en": "She's starting to practice.",
      "source": "Tatoeba",
      "sourceId": 8932437,
      "translationId": 7905798
    },
    {
      "id": "intermediate-210",
      "level": "intermediate",
      "zh": "那辆车十分新。",
      "en": "That car is quite new.",
      "source": "Tatoeba",
      "sourceId": 816434,
      "translationId": 46841
    },
    {
      "id": "intermediate-211",
      "level": "intermediate",
      "zh": "谢谢您的帮助。",
      "en": "Thank you for your help.",
      "source": "Tatoeba",
      "sourceId": 700491,
      "translationId": 462516
    },
    {
      "id": "intermediate-212",
      "level": "intermediate",
      "zh": "我不相信他们。",
      "en": "I didn't believe them.",
      "source": "Tatoeba",
      "sourceId": 9960186,
      "translationId": 2280296
    },
    {
      "id": "intermediate-213",
      "level": "intermediate",
      "zh": "他们都开始哭。",
      "en": "Both of them started crying.",
      "source": "Tatoeba",
      "sourceId": 8932003,
      "translationId": 2543855
    },
    {
      "id": "intermediate-214",
      "level": "intermediate",
      "zh": "谢谢您的关注。",
      "en": "Thank you for your attention.",
      "source": "Tatoeba",
      "sourceId": 2500039,
      "translationId": 1767253
    },
    {
      "id": "intermediate-215",
      "level": "intermediate",
      "zh": "今年夏天很冷。",
      "en": "Summer this year is cold.",
      "source": "Tatoeba",
      "sourceId": 472815,
      "translationId": 1168577
    },
    {
      "id": "intermediate-216",
      "level": "intermediate",
      "zh": "他老是把我和我姐姐搞错。",
      "en": "He always mistakes me for my sister.",
      "source": "Tatoeba",
      "sourceId": 343842,
      "translationId": 289144
    },
    {
      "id": "intermediate-217",
      "level": "intermediate",
      "zh": "您没必要准备一个正式的演讲。",
      "en": "You don't need to prepare a formal speech.",
      "source": "Tatoeba",
      "sourceId": 472843,
      "translationId": 472094
    },
    {
      "id": "intermediate-218",
      "level": "intermediate",
      "zh": "有了坚定的目标，你会做得很好。",
      "en": "With a firm goal in mind, you will do well.",
      "source": "Tatoeba",
      "sourceId": 332844,
      "translationId": 53469
    },
    {
      "id": "intermediate-219",
      "level": "intermediate",
      "zh": "他们放弃了他们的孩子。",
      "en": "They abandon their children.",
      "source": "Tatoeba",
      "sourceId": 4408269,
      "translationId": 4405030
    },
    {
      "id": "intermediate-220",
      "level": "intermediate",
      "zh": "那条船昨天穿过了赤道。",
      "en": "That ship crossed the equator yesterday.",
      "source": "Tatoeba",
      "sourceId": 846789,
      "translationId": 45682
    },
    {
      "id": "intermediate-221",
      "level": "intermediate",
      "zh": "我的电子邮箱改变了。",
      "en": "My e-mail address has been changed.",
      "source": "Tatoeba",
      "sourceId": 1738005,
      "translationId": 250194
    },
    {
      "id": "intermediate-222",
      "level": "intermediate",
      "zh": "他还没回我的信。",
      "en": "He hasn't answered my letter yet.",
      "source": "Tatoeba",
      "sourceId": 337881,
      "translationId": 292878
    },
    {
      "id": "intermediate-223",
      "level": "intermediate",
      "zh": "我只想知道事实。",
      "en": "I only want to know the facts.",
      "source": "Tatoeba",
      "sourceId": 5630392,
      "translationId": 5300586
    },
    {
      "id": "intermediate-224",
      "level": "intermediate",
      "zh": "木头或许能在水里呆上十年，但它终究不可能变成一条鳄鱼。",
      "en": "Wood may remain ten years in the water, but it will never become a crocodile.",
      "source": "Tatoeba",
      "sourceId": 5068214,
      "translationId": 5067576
    },
    {
      "id": "intermediate-225",
      "level": "intermediate",
      "zh": "那把白色阳伞是她的。",
      "en": "That white parasol is hers.",
      "source": "Tatoeba",
      "sourceId": 343607,
      "translationId": 1482641
    },
    {
      "id": "intermediate-226",
      "level": "intermediate",
      "zh": "那花闻起来很香。",
      "en": "That flower smells sweet.",
      "source": "Tatoeba",
      "sourceId": 363881,
      "translationId": 68517
    },
    {
      "id": "intermediate-227",
      "level": "intermediate",
      "zh": "我需要你的意见。",
      "en": "I need your advice.",
      "source": "Tatoeba",
      "sourceId": 1772680,
      "translationId": 2249
    },
    {
      "id": "intermediate-228",
      "level": "intermediate",
      "zh": "我喜欢你的鞋子。",
      "en": "I like your shoes.",
      "source": "Tatoeba",
      "sourceId": 4845043,
      "translationId": 2377636
    },
    {
      "id": "intermediate-229",
      "level": "intermediate",
      "zh": "把那个号码给我。",
      "en": "Give me the number.",
      "source": "Tatoeba",
      "sourceId": 2035087,
      "translationId": 806747
    },
    {
      "id": "intermediate-230",
      "level": "intermediate",
      "zh": "你应该试试这个。",
      "en": "You should try this.",
      "source": "Tatoeba",
      "sourceId": 5819727,
      "translationId": 3178294
    },
    {
      "id": "intermediate-231",
      "level": "intermediate",
      "zh": "我父亲明天会做一桌好菜。",
      "en": "My father is going to make a good meal tomorrow.",
      "source": "Tatoeba",
      "sourceId": 1324006,
      "translationId": 7770312
    },
    {
      "id": "intermediate-232",
      "level": "intermediate",
      "zh": "我很庆幸我们没有去那儿，因为当时那儿有局部大暴雨。",
      "en": "I'm glad we didn't go there because there were some localized heavy rain showers.",
      "source": "Tatoeba",
      "sourceId": 1235313,
      "translationId": 18870
    },
    {
      "id": "intermediate-233",
      "level": "intermediate",
      "zh": "你愿意来吗？",
      "en": "Would you like to come?",
      "source": "Tatoeba",
      "sourceId": 1776642,
      "translationId": 2398
    },
    {
      "id": "intermediate-234",
      "level": "intermediate",
      "zh": "我在这里待到10点。",
      "en": "I'll stay here until ten.",
      "source": "Tatoeba",
      "sourceId": 353559,
      "translationId": 73428
    },
    {
      "id": "intermediate-235",
      "level": "intermediate",
      "zh": "后天正好礼拜日。",
      "en": "The day after tomorrow is Sunday.",
      "source": "Tatoeba",
      "sourceId": 385099,
      "translationId": 8889569
    },
    {
      "id": "intermediate-236",
      "level": "intermediate",
      "zh": "能借我支铅笔吗？",
      "en": "Would you lend me a pencil?",
      "source": "Tatoeba",
      "sourceId": 1438613,
      "translationId": 1075505
    },
    {
      "id": "intermediate-237",
      "level": "intermediate",
      "zh": "我节约我有的钱。",
      "en": "I save what money I got.",
      "source": "Tatoeba",
      "sourceId": 462018,
      "translationId": 258449
    },
    {
      "id": "intermediate-238",
      "level": "intermediate",
      "zh": "母亲让我打扫卫生间。",
      "en": "Mother made me clean the bathroom.",
      "source": "Tatoeba",
      "sourceId": 769747,
      "translationId": 320610
    },
    {
      "id": "intermediate-239",
      "level": "intermediate",
      "zh": "带上你的外套以防下雨。",
      "en": "Take your coat in case it rains.",
      "source": "Tatoeba",
      "sourceId": 1516459,
      "translationId": 26731
    },
    {
      "id": "intermediate-240",
      "level": "intermediate",
      "zh": "试衣室正在占用着。",
      "en": "The fitting room is occupied.",
      "source": "Tatoeba",
      "sourceId": 839200,
      "translationId": 2714666
    },
    {
      "id": "intermediate-241",
      "level": "intermediate",
      "zh": "我们应该进行测试。",
      "en": "We should run some tests.",
      "source": "Tatoeba",
      "sourceId": 5819726,
      "translationId": 1893728
    },
    {
      "id": "intermediate-242",
      "level": "intermediate",
      "zh": "德语学起来容易吗？",
      "en": "Is German easy to learn?",
      "source": "Tatoeba",
      "sourceId": 10055665,
      "translationId": 10041390
    },
    {
      "id": "intermediate-243",
      "level": "intermediate",
      "zh": "他们俩的影子重叠在一起。",
      "en": "Their two shadows overlap.",
      "source": "Tatoeba",
      "sourceId": 458041,
      "translationId": 1747284
    },
    {
      "id": "intermediate-244",
      "level": "intermediate",
      "zh": "用手指点别人不礼貌。",
      "en": "It's bad manners to point at people.",
      "source": "Tatoeba",
      "sourceId": 5091092,
      "translationId": 2712808
    },
    {
      "id": "intermediate-245",
      "level": "intermediate",
      "zh": "城市中心有很多高高的建筑。",
      "en": "There are many tall buildings in the city center.",
      "source": "Tatoeba",
      "sourceId": 4267328,
      "translationId": 13547925
    },
    {
      "id": "intermediate-246",
      "level": "intermediate",
      "zh": "图书馆在楼上。",
      "en": "The library is upstairs.",
      "source": "Tatoeba",
      "sourceId": 8932580,
      "translationId": 4494345
    },
    {
      "id": "intermediate-247",
      "level": "intermediate",
      "zh": "我感觉得到它。",
      "en": "I can feel it.",
      "source": "Tatoeba",
      "sourceId": 10699360,
      "translationId": 1841705
    },
    {
      "id": "intermediate-248",
      "level": "intermediate",
      "zh": "我们的猫很胖。",
      "en": "Our cat is fat.",
      "source": "Tatoeba",
      "sourceId": 10192181,
      "translationId": 10116614
    },
    {
      "id": "intermediate-249",
      "level": "intermediate",
      "zh": "他是加拿大人。",
      "en": "He's a Canadian.",
      "source": "Tatoeba",
      "sourceId": 3783447,
      "translationId": 8479921
    },
    {
      "id": "intermediate-250",
      "level": "intermediate",
      "zh": "这真的很简单。",
      "en": "This is real easy.",
      "source": "Tatoeba",
      "sourceId": 10054252,
      "translationId": 3365388
    },
    {
      "id": "intermediate-251",
      "level": "intermediate",
      "zh": "如果你不喜欢葡萄酒，那你还没喝到好的葡萄酒。",
      "en": "If you don't like wine, then you must've not had good wine before.",
      "source": "Tatoeba",
      "sourceId": 10184234,
      "translationId": 10187999
    },
    {
      "id": "intermediate-252",
      "level": "intermediate",
      "zh": "您愿意跟我换座位吗？",
      "en": "Will you switch seats with me?",
      "source": "Tatoeba",
      "sourceId": 512054,
      "translationId": 638695
    },
    {
      "id": "intermediate-253",
      "level": "intermediate",
      "zh": "你可以随便用我的车。",
      "en": "My car is at your disposal.",
      "source": "Tatoeba",
      "sourceId": 343356,
      "translationId": 251074
    },
    {
      "id": "intermediate-254",
      "level": "intermediate",
      "zh": "他比平常早起了。",
      "en": "He got up earlier than usual.",
      "source": "Tatoeba",
      "sourceId": 804962,
      "translationId": 289078
    },
    {
      "id": "intermediate-255",
      "level": "intermediate",
      "zh": "进入地球大气层后，小行星分裂成了无数的小块。",
      "en": "The asteroid broke up into small pieces as it entered Earth's atmosphere.",
      "source": "Tatoeba",
      "sourceId": 1749191,
      "translationId": 626512
    },
    {
      "id": "intermediate-256",
      "level": "intermediate",
      "zh": "我跟公司签了一份三年的合同。",
      "en": "This company and I have signed a three-year contract.",
      "source": "Tatoeba",
      "sourceId": 4731437,
      "translationId": 4731170
    },
    {
      "id": "intermediate-257",
      "level": "intermediate",
      "zh": "你的爱情留下的疤痕使我想起我们。",
      "en": "The scars of your love remind me of us.",
      "source": "Tatoeba",
      "sourceId": 1020712,
      "translationId": 1020684
    },
    {
      "id": "intermediate-258",
      "level": "intermediate",
      "zh": "很少人活到100岁。",
      "en": "Very few people live to be 100.",
      "source": "Tatoeba",
      "sourceId": 389421,
      "translationId": 1266465
    },
    {
      "id": "intermediate-259",
      "level": "intermediate",
      "zh": "我们已经开了一整夜的派对了。",
      "en": "We've already partied all night.",
      "source": "Tatoeba",
      "sourceId": 2318401,
      "translationId": 2321181
    },
    {
      "id": "intermediate-260",
      "level": "intermediate",
      "zh": "她非常想当口译。",
      "en": "She has a strong wish to work as an interpreter.",
      "source": "Tatoeba",
      "sourceId": 2411918,
      "translationId": 315886
    },
    {
      "id": "intermediate-261",
      "level": "intermediate",
      "zh": "他的腿很长。",
      "en": "He has long legs.",
      "source": "Tatoeba",
      "sourceId": 453742,
      "translationId": 287067
    },
    {
      "id": "intermediate-262",
      "level": "intermediate",
      "zh": "没有关系呀。",
      "en": "It's all right.",
      "source": "Tatoeba",
      "sourceId": 3859472,
      "translationId": 20397
    },
    {
      "id": "intermediate-263",
      "level": "intermediate",
      "zh": "睡在沙发上。",
      "en": "Sleep on the couch.",
      "source": "Tatoeba",
      "sourceId": 10484433,
      "translationId": 10475669
    },
    {
      "id": "intermediate-264",
      "level": "intermediate",
      "zh": "打开收音机。",
      "en": "Turn on the radio.",
      "source": "Tatoeba",
      "sourceId": 2032175,
      "translationId": 29763
    },
    {
      "id": "intermediate-265",
      "level": "intermediate",
      "zh": "请吃点蛋糕。",
      "en": "Please eat some cake.",
      "source": "Tatoeba",
      "sourceId": 5091393,
      "translationId": 1008846
    },
    {
      "id": "intermediate-266",
      "level": "intermediate",
      "zh": "孩子需要你。",
      "en": "The children need you.",
      "source": "Tatoeba",
      "sourceId": 9475933,
      "translationId": 4839663
    },
    {
      "id": "intermediate-267",
      "level": "intermediate",
      "zh": "她很少迟到。",
      "en": "She is rarely late.",
      "source": "Tatoeba",
      "sourceId": 354513,
      "translationId": 497352
    },
    {
      "id": "intermediate-268",
      "level": "intermediate",
      "zh": "他开始哭了。",
      "en": "He began to cry.",
      "source": "Tatoeba",
      "sourceId": 5715130,
      "translationId": 295240
    },
    {
      "id": "intermediate-269",
      "level": "intermediate",
      "zh": "猫在桌子底下。",
      "en": "The cat is under the table.",
      "source": "Tatoeba",
      "sourceId": 802831,
      "translationId": 801731
    },
    {
      "id": "intermediate-270",
      "level": "intermediate",
      "zh": "他可能迷路了。",
      "en": "He may have lost his way.",
      "source": "Tatoeba",
      "sourceId": 332783,
      "translationId": 302061
    },
    {
      "id": "intermediate-271",
      "level": "intermediate",
      "zh": "我不擅长游泳。",
      "en": "I'm not a good swimmer.",
      "source": "Tatoeba",
      "sourceId": 4757664,
      "translationId": 4757709
    },
    {
      "id": "intermediate-272",
      "level": "intermediate",
      "zh": "我没有反对你。",
      "en": "I'm not disagreeing with you.",
      "source": "Tatoeba",
      "sourceId": 5978333,
      "translationId": 2869061
    },
    {
      "id": "intermediate-273",
      "level": "intermediate",
      "zh": "你差不多猜对了。",
      "en": "Your guess is almost right.",
      "source": "Tatoeba",
      "sourceId": 476678,
      "translationId": 17173
    },
    {
      "id": "intermediate-274",
      "level": "intermediate",
      "zh": "这部相机多少钱？",
      "en": "How much is this camera?",
      "source": "Tatoeba",
      "sourceId": 5096459,
      "translationId": 61222
    },
    {
      "id": "intermediate-275",
      "level": "intermediate",
      "zh": "我们买了张圆桌。",
      "en": "We bought a round table.",
      "source": "Tatoeba",
      "sourceId": 7771687,
      "translationId": 248550
    },
    {
      "id": "intermediate-276",
      "level": "intermediate",
      "zh": "我不太擅长运动。",
      "en": "I'm not very athletic.",
      "source": "Tatoeba",
      "sourceId": 9566046,
      "translationId": 2478682
    },
    {
      "id": "intermediate-277",
      "level": "intermediate",
      "zh": "这是一个愚蠢的问题。",
      "en": "That's a stupid question!",
      "source": "Tatoeba",
      "sourceId": 1808259,
      "translationId": 1808128
    },
    {
      "id": "intermediate-278",
      "level": "intermediate",
      "zh": "我不懂匈牙利语，对不起。",
      "en": "I don't understand Hungarian, sorry.",
      "source": "Tatoeba",
      "sourceId": 4459745,
      "translationId": 3270946
    },
    {
      "id": "intermediate-279",
      "level": "intermediate",
      "zh": "现在四点整。",
      "en": "It's now exactly four o'clock.",
      "source": "Tatoeba",
      "sourceId": 2041418,
      "translationId": 10296541
    },
    {
      "id": "intermediate-280",
      "level": "intermediate",
      "zh": "假如你认识这张脸，请拨打110！",
      "en": "If you recognize this person, call 110!",
      "source": "Tatoeba",
      "sourceId": 8742178,
      "translationId": 734431
    },
    {
      "id": "intermediate-281",
      "level": "intermediate",
      "zh": "他们正努力降低成本。",
      "en": "They're trying to keep costs down.",
      "source": "Tatoeba",
      "sourceId": 611542,
      "translationId": 9611404
    },
    {
      "id": "intermediate-282",
      "level": "intermediate",
      "zh": "测试延迟了两天，因此，我们需要重新安排发布日期。",
      "en": "Testing has been delayed by two days. As a consequence, we need to reschedule the release date.",
      "source": "Tatoeba",
      "sourceId": 2938648,
      "translationId": 2938649
    },
    {
      "id": "intermediate-283",
      "level": "intermediate",
      "zh": "在厦威夷，一个人可以一年到头享受海水浴的乐趣。",
      "en": "In Hawaii, one can swim in the ocean all year round.",
      "source": "Tatoeba",
      "sourceId": 955391,
      "translationId": 34978
    },
    {
      "id": "intermediate-284",
      "level": "intermediate",
      "zh": "他把她的话当作是一种赞美。",
      "en": "He took her words as a compliment.",
      "source": "Tatoeba",
      "sourceId": 461624,
      "translationId": 1259032
    },
    {
      "id": "intermediate-285",
      "level": "intermediate",
      "zh": "他的所作所为总是让我惊讶。",
      "en": "His behavior never ceases to surprise me.",
      "source": "Tatoeba",
      "sourceId": 8727832,
      "translationId": 286281
    },
    {
      "id": "intermediate-286",
      "level": "intermediate",
      "zh": "我每隔一天就跟一个好朋友一起去，我们一起一边谈话一边举重。",
      "en": "Every other day I go with a friend; we lift weights whilst chatting together.",
      "source": "Tatoeba",
      "sourceId": 899134,
      "translationId": 899135
    },
    {
      "id": "intermediate-287",
      "level": "intermediate",
      "zh": "他有个住在东京的兄弟。",
      "en": "He has a brother who lives in Tokyo.",
      "source": "Tatoeba",
      "sourceId": 7771888,
      "translationId": 284881
    },
    {
      "id": "intermediate-288",
      "level": "intermediate",
      "zh": "这个单词是什么意思？",
      "en": "What does this word mean?",
      "source": "Tatoeba",
      "sourceId": 348879,
      "translationId": 48085
    },
    {
      "id": "intermediate-289",
      "level": "intermediate",
      "zh": "在这个密码里，每个数字取代了一个字母。",
      "en": "In this secret code, each number stands for a letter of the alphabet.",
      "source": "Tatoeba",
      "sourceId": 465943,
      "translationId": 57464
    },
    {
      "id": "intermediate-290",
      "level": "intermediate",
      "zh": "好了，我必须走了。",
      "en": "Well, I must be going.",
      "source": "Tatoeba",
      "sourceId": 333798,
      "translationId": 43011
    },
    {
      "id": "intermediate-291",
      "level": "intermediate",
      "zh": "他给了以下的答复。",
      "en": "He answered as follows.",
      "source": "Tatoeba",
      "sourceId": 429475,
      "translationId": 298427
    },
    {
      "id": "intermediate-292",
      "level": "intermediate",
      "zh": "这只不过全是个大误会而已。",
      "en": "It's all just a big misunderstanding.",
      "source": "Tatoeba",
      "sourceId": 537919,
      "translationId": 537917
    },
    {
      "id": "intermediate-293",
      "level": "intermediate",
      "zh": "我下周六有空。",
      "en": "I will be free next Saturday.",
      "source": "Tatoeba",
      "sourceId": 353594,
      "translationId": 325070
    },
    {
      "id": "intermediate-294",
      "level": "intermediate",
      "zh": "我非常感谢你。",
      "en": "I'm very grateful to you.",
      "source": "Tatoeba",
      "sourceId": 3078814,
      "translationId": 1662028
    },
    {
      "id": "intermediate-295",
      "level": "intermediate",
      "zh": "价钱是二十五元五毛。",
      "en": "It costs 25 dollars and 50 cents.",
      "source": "Tatoeba",
      "sourceId": 420704,
      "translationId": 9415034
    },
    {
      "id": "intermediate-296",
      "level": "intermediate",
      "zh": "您什么时候开始学英语的？",
      "en": "When did you begin studying English?",
      "source": "Tatoeba",
      "sourceId": 512839,
      "translationId": 16759
    },
    {
      "id": "intermediate-297",
      "level": "intermediate",
      "zh": "你可以去巴士站。",
      "en": "You can go to the bus station.",
      "source": "Tatoeba",
      "sourceId": 11502945,
      "translationId": 1698674
    },
    {
      "id": "intermediate-298",
      "level": "intermediate",
      "zh": "我为此对你生气。",
      "en": "I'm angry with you about this.",
      "source": "Tatoeba",
      "sourceId": 767684,
      "translationId": 767688
    },
    {
      "id": "intermediate-299",
      "level": "intermediate",
      "zh": "那是个漆黑的没有月光的夜晚。",
      "en": "It was a pitch-black night without moonlight.",
      "source": "Tatoeba",
      "sourceId": 1328172,
      "translationId": 13559258
    },
    {
      "id": "intermediate-300",
      "level": "intermediate",
      "zh": "没人盯着她的时候，她甚至会哭。",
      "en": "She'll cry even when no one is looking.",
      "source": "Tatoeba",
      "sourceId": 2254415,
      "translationId": 2256438
    },
    {
      "id": "intermediate-301",
      "level": "intermediate",
      "zh": "她说她从未见过有耳朵的刺猬。",
      "en": "She says that she's never seen hedgehogs with ears.",
      "source": "Tatoeba",
      "sourceId": 10364535,
      "translationId": 508274
    },
    {
      "id": "intermediate-302",
      "level": "intermediate",
      "zh": "我无法容忍别人打扰我的工作。",
      "en": "I cannot endure being disturbed in my work.",
      "source": "Tatoeba",
      "sourceId": 1501721,
      "translationId": 245347
    },
    {
      "id": "intermediate-303",
      "level": "intermediate",
      "zh": "我很抱歉用这种方式把你请来。",
      "en": "I apologize for the methods used to get you here.",
      "source": "Tatoeba",
      "sourceId": 4297294,
      "translationId": 4297295
    },
    {
      "id": "intermediate-304",
      "level": "intermediate",
      "zh": "行胜于言，但并不是所有情况都是这样。",
      "en": "Action speaks louder than words, but not nearly as often.",
      "source": "Tatoeba",
      "sourceId": 2426072,
      "translationId": 667883
    },
    {
      "id": "intermediate-305",
      "level": "intermediate",
      "zh": "会议结束了。",
      "en": "The meeting ended.",
      "source": "Tatoeba",
      "sourceId": 1411729,
      "translationId": 1284135
    },
    {
      "id": "intermediate-306",
      "level": "intermediate",
      "zh": "我想要更新。",
      "en": "I want updates.",
      "source": "Tatoeba",
      "sourceId": 13175377,
      "translationId": 5851609
    },
    {
      "id": "intermediate-307",
      "level": "intermediate",
      "zh": "钱还没用完。",
      "en": "The money has not been used up.",
      "source": "Tatoeba",
      "sourceId": 2317172,
      "translationId": 50591
    },
    {
      "id": "intermediate-308",
      "level": "intermediate",
      "zh": "我住在离波士顿不远的一个农场。",
      "en": "I live on a farm not too far from Boston.",
      "source": "Tatoeba",
      "sourceId": 12569590,
      "translationId": 6343228
    },
    {
      "id": "intermediate-309",
      "level": "intermediate",
      "zh": "没有了你，我就像没有灵魂的躯体。",
      "en": "Me without you is like a body with no soul.",
      "source": "Tatoeba",
      "sourceId": 9953235,
      "translationId": 1962630
    },
    {
      "id": "intermediate-310",
      "level": "intermediate",
      "zh": "挣的越多钱，就花得越多钱。",
      "en": "The more you earn, the more you spend.",
      "source": "Tatoeba",
      "sourceId": 431633,
      "translationId": 266271
    },
    {
      "id": "intermediate-311",
      "level": "intermediate",
      "zh": "青春只有一次。",
      "en": "You're only young once.",
      "source": "Tatoeba",
      "sourceId": 604475,
      "translationId": 265744
    },
    {
      "id": "intermediate-312",
      "level": "intermediate",
      "zh": "这个房子属于谁？",
      "en": "Who owns this house?",
      "source": "Tatoeba",
      "sourceId": 902026,
      "translationId": 60136
    },
    {
      "id": "intermediate-313",
      "level": "intermediate",
      "zh": "我在另一个地方。",
      "en": "I was somewhere else.",
      "source": "Tatoeba",
      "sourceId": 7768156,
      "translationId": 2547913
    },
    {
      "id": "intermediate-314",
      "level": "intermediate",
      "zh": "汽车发生故障了。",
      "en": "The car broke down.",
      "source": "Tatoeba",
      "sourceId": 336112,
      "translationId": 46829
    },
    {
      "id": "intermediate-315",
      "level": "intermediate",
      "zh": "很少人这么认为。",
      "en": "Few people think so.",
      "source": "Tatoeba",
      "sourceId": 332422,
      "translationId": 51060
    },
    {
      "id": "intermediate-316",
      "level": "intermediate",
      "zh": "我们在哪里集合？",
      "en": "Where are we assembling?",
      "source": "Tatoeba",
      "sourceId": 5153277,
      "translationId": 5241607
    },
    {
      "id": "intermediate-317",
      "level": "intermediate",
      "zh": "我买了份英文写的报纸。",
      "en": "I bought a newspaper written in English.",
      "source": "Tatoeba",
      "sourceId": 441466,
      "translationId": 256199
    },
    {
      "id": "intermediate-318",
      "level": "intermediate",
      "zh": "你想要哪种风格的家具？",
      "en": "What style of furniture would you like?",
      "source": "Tatoeba",
      "sourceId": 10192243,
      "translationId": 2270139
    },
    {
      "id": "intermediate-319",
      "level": "intermediate",
      "zh": "山坡上有一间小屋。",
      "en": "There was a cottage on the side of the hill.",
      "source": "Tatoeba",
      "sourceId": 847791,
      "translationId": 48731
    },
    {
      "id": "intermediate-320",
      "level": "intermediate",
      "zh": "我不知道该怎么办。",
      "en": "I have no idea of what to do.",
      "source": "Tatoeba",
      "sourceId": 714388,
      "translationId": 714389
    },
    {
      "id": "intermediate-321",
      "level": "intermediate",
      "zh": "绝对不可能。",
      "en": "It's out of the question.",
      "source": "Tatoeba",
      "sourceId": 709495,
      "translationId": 42054
    },
    {
      "id": "intermediate-322",
      "level": "intermediate",
      "zh": "你这么漂亮，况且又这么聪明，怎么可能没人追你呢？",
      "en": "You're beautiful and intelligent, how is it possible that no man is chasing after you?",
      "source": "Tatoeba",
      "sourceId": 381010,
      "translationId": 607587
    },
    {
      "id": "intermediate-323",
      "level": "intermediate",
      "zh": "本地人、外来人齐心共创上海新文明。",
      "en": "Native Chinese people are working alongside foreigners to change the culture of Shanghai.",
      "source": "Tatoeba",
      "sourceId": 421276,
      "translationId": 1542268
    },
    {
      "id": "intermediate-324",
      "level": "intermediate",
      "zh": "他们要求我原谅他们。",
      "en": "They asked me to forgive them.",
      "source": "Tatoeba",
      "sourceId": 8743592,
      "translationId": 7409222
    },
    {
      "id": "intermediate-325",
      "level": "intermediate",
      "zh": "这笔交易是我的，所以你需要去冷静并且同意我。",
      "en": "This deal is mine, so you need to just settle down and agree with me.",
      "source": "Tatoeba",
      "sourceId": 4844581,
      "translationId": 4844479
    },
    {
      "id": "intermediate-326",
      "level": "intermediate",
      "zh": "他不适合当老师。",
      "en": "He is unfit to be a teacher.",
      "source": "Tatoeba",
      "sourceId": 1450537,
      "translationId": 295359
    },
    {
      "id": "intermediate-327",
      "level": "intermediate",
      "zh": "他没带钥匙，用铁丝拨动了两下，门居然开了。",
      "en": "Having forgotten his key, he was able to open the door by inserting a wire in the keyhole.",
      "source": "Tatoeba",
      "sourceId": 934185,
      "translationId": 934186
    },
    {
      "id": "intermediate-328",
      "level": "intermediate",
      "zh": "她有蓝色的眼睛。",
      "en": "She has blue eyes.",
      "source": "Tatoeba",
      "sourceId": 472842,
      "translationId": 472087
    },
    {
      "id": "intermediate-329",
      "level": "intermediate",
      "zh": "有什么开心的事吗？",
      "en": "Did you do something fun?",
      "source": "Tatoeba",
      "sourceId": 6486681,
      "translationId": 6534859
    },
    {
      "id": "intermediate-330",
      "level": "intermediate",
      "zh": "他的化学很差。",
      "en": "He is poor at chemistry.",
      "source": "Tatoeba",
      "sourceId": 332985,
      "translationId": 294218
    },
    {
      "id": "intermediate-331",
      "level": "intermediate",
      "zh": "动物不能选择成为素食主义者？",
      "en": "Animals can't choose to be vegan.",
      "source": "Tatoeba",
      "sourceId": 10342307,
      "translationId": 5987931
    },
    {
      "id": "intermediate-332",
      "level": "intermediate",
      "zh": "大道之行也，天下为公。",
      "en": "When the great way is followed, the world is for the common good.",
      "source": "Tatoeba",
      "sourceId": 12705145,
      "translationId": 12717060
    },
    {
      "id": "intermediate-333",
      "level": "intermediate",
      "zh": "他们向她微笑。",
      "en": "They smiled at her.",
      "source": "Tatoeba",
      "sourceId": 5663546,
      "translationId": 3919631
    },
    {
      "id": "intermediate-334",
      "level": "intermediate",
      "zh": "请刮一下胡子。",
      "en": "Please shave my beard.",
      "source": "Tatoeba",
      "sourceId": 796115,
      "translationId": 34802
    },
    {
      "id": "intermediate-335",
      "level": "intermediate",
      "zh": "这男人喝醉了。",
      "en": "This man is drunk.",
      "source": "Tatoeba",
      "sourceId": 7781721,
      "translationId": 463342
    },
    {
      "id": "intermediate-336",
      "level": "intermediate",
      "zh": "他看起来很可疑。",
      "en": "He looks suspicious.",
      "source": "Tatoeba",
      "sourceId": 9540496,
      "translationId": 72055
    },
    {
      "id": "intermediate-337",
      "level": "intermediate",
      "zh": "你下个周末有什么安排？",
      "en": "What do you have planned for next weekend?",
      "source": "Tatoeba",
      "sourceId": 10081635,
      "translationId": 10081591
    },
    {
      "id": "intermediate-338",
      "level": "intermediate",
      "zh": "今晚我将在朋友家过夜。",
      "en": "I will put up at my friend's tonight.",
      "source": "Tatoeba",
      "sourceId": 332789,
      "translationId": 243330
    },
    {
      "id": "intermediate-339",
      "level": "intermediate",
      "zh": "我把这个杯子倒满了牛奶。",
      "en": "I filled this glass with milk.",
      "source": "Tatoeba",
      "sourceId": 2254360,
      "translationId": 61130
    },
    {
      "id": "intermediate-340",
      "level": "intermediate",
      "zh": "我们该报警。",
      "en": "We should call the police.",
      "source": "Tatoeba",
      "sourceId": 796691,
      "translationId": 632491
    },
    {
      "id": "intermediate-341",
      "level": "intermediate",
      "zh": "我们缺钱了。",
      "en": "We ran short of money.",
      "source": "Tatoeba",
      "sourceId": 804852,
      "translationId": 18493
    },
    {
      "id": "intermediate-342",
      "level": "intermediate",
      "zh": "孩子摸着猫。",
      "en": "The child pets the cat.",
      "source": "Tatoeba",
      "sourceId": 463949,
      "translationId": 5870609
    },
    {
      "id": "intermediate-343",
      "level": "intermediate",
      "zh": "这个叫什么？",
      "en": "What do you call this?",
      "source": "Tatoeba",
      "sourceId": 3695239,
      "translationId": 1841545
    },
    {
      "id": "intermediate-344",
      "level": "intermediate",
      "zh": "在上一届世界杯上，新西兰在比赛中被墨西哥淘汰。",
      "en": "In the last World Cup, New Zealand was knocked out of the competition by Mexico.",
      "source": "Tatoeba",
      "sourceId": 3579591,
      "translationId": 3579592
    },
    {
      "id": "intermediate-345",
      "level": "intermediate",
      "zh": "上海人讲上海话，上海人也都会讲普通话。",
      "en": "People from Shanghai speak Shanghainese; they can also speak Mandarin.",
      "source": "Tatoeba",
      "sourceId": 421248,
      "translationId": 7807362
    },
    {
      "id": "intermediate-346",
      "level": "intermediate",
      "zh": "那药不会管用。",
      "en": "That medicine isn't going to help.",
      "source": "Tatoeba",
      "sourceId": 5701331,
      "translationId": 3726138
    },
    {
      "id": "intermediate-347",
      "level": "intermediate",
      "zh": "我是个二流子。",
      "en": "I'm a good-for-nothing bum.",
      "source": "Tatoeba",
      "sourceId": 554678,
      "translationId": 433739
    },
    {
      "id": "intermediate-348",
      "level": "intermediate",
      "zh": "我好想吃大福。",
      "en": "I really want to eat some daifuku.",
      "source": "Tatoeba",
      "sourceId": 10062389,
      "translationId": 10253661
    },
    {
      "id": "intermediate-349",
      "level": "intermediate",
      "zh": "丽萨不但会说英文，而且会说法文。",
      "en": "Lisa speaks not only English but also French.",
      "source": "Tatoeba",
      "sourceId": 393273,
      "translationId": 29701
    },
    {
      "id": "intermediate-350",
      "level": "intermediate",
      "zh": "我虽然在虎口里，却是安如泰山。",
      "en": "Though I am in the tiger's mouth, I am as calm as Mount Tai.",
      "source": "Tatoeba",
      "sourceId": 421489,
      "translationId": 421491
    },
    {
      "id": "intermediate-351",
      "level": "intermediate",
      "zh": "我会给你看图片。",
      "en": "I will show you the picture.",
      "source": "Tatoeba",
      "sourceId": 5978324,
      "translationId": 252763
    },
    {
      "id": "intermediate-352",
      "level": "intermediate",
      "zh": "她的祖母活到了八十八岁。",
      "en": "Her grandmother lived to be eighty-eight years old.",
      "source": "Tatoeba",
      "sourceId": 472114,
      "translationId": 309528
    },
    {
      "id": "intermediate-353",
      "level": "intermediate",
      "zh": "他不知道如何用英语写信。",
      "en": "He doesn't know how to write a letter in English.",
      "source": "Tatoeba",
      "sourceId": 1314171,
      "translationId": 294071
    },
    {
      "id": "intermediate-354",
      "level": "intermediate",
      "zh": "你会不会教我学吹气风笛？",
      "en": "Can you teach me how to play the bagpipes?",
      "source": "Tatoeba",
      "sourceId": 2221122,
      "translationId": 2229693
    },
    {
      "id": "intermediate-355",
      "level": "intermediate",
      "zh": "他在这次事故中失明了。",
      "en": "He went blind in the accident.",
      "source": "Tatoeba",
      "sourceId": 1516190,
      "translationId": 290904
    },
    {
      "id": "intermediate-356",
      "level": "intermediate",
      "zh": "她常常利用他的无知。",
      "en": "She often takes advantage of his ignorance.",
      "source": "Tatoeba",
      "sourceId": 4265049,
      "translationId": 887319
    },
    {
      "id": "intermediate-357",
      "level": "intermediate",
      "zh": "鲍勃有太多的书要读。",
      "en": "Bob has too many books to read.",
      "source": "Tatoeba",
      "sourceId": 864406,
      "translationId": 33164
    },
    {
      "id": "intermediate-358",
      "level": "intermediate",
      "zh": "熊猫是很美的动物。",
      "en": "Pandas are beautiful animals.",
      "source": "Tatoeba",
      "sourceId": 2884025,
      "translationId": 680203
    },
    {
      "id": "intermediate-359",
      "level": "intermediate",
      "zh": "爱沙尼亚有它自己的国歌。",
      "en": "Estonia has its own national anthem.",
      "source": "Tatoeba",
      "sourceId": 10695982,
      "translationId": 719181
    },
    {
      "id": "intermediate-360",
      "level": "intermediate",
      "zh": "道路结冰导致了很多起事故。",
      "en": "Many accidents resulted from the icy conditions of the road.",
      "source": "Tatoeba",
      "sourceId": 332922,
      "translationId": 280463
    },
    {
      "id": "intermediate-361",
      "level": "intermediate",
      "zh": "她是一名记者。",
      "en": "She is a journalist.",
      "source": "Tatoeba",
      "sourceId": 8918173,
      "translationId": 6736457
    },
    {
      "id": "intermediate-362",
      "level": "intermediate",
      "zh": "他一转眼就跑了。",
      "en": "He left in the blink of an eye.",
      "source": "Tatoeba",
      "sourceId": 8737036,
      "translationId": 534718
    },
    {
      "id": "intermediate-363",
      "level": "intermediate",
      "zh": "他想成为科学家。",
      "en": "He wants to be a scientist in the future.",
      "source": "Tatoeba",
      "sourceId": 1733473,
      "translationId": 299530
    },
    {
      "id": "intermediate-364",
      "level": "intermediate",
      "zh": "他每天都打垒球。",
      "en": "He plays baseball every day.",
      "source": "Tatoeba",
      "sourceId": 352063,
      "translationId": 303925
    },
    {
      "id": "intermediate-365",
      "level": "intermediate",
      "zh": "你今天为什么忙？",
      "en": "Why are you busy today?",
      "source": "Tatoeba",
      "sourceId": 1438402,
      "translationId": 69583
    },
    {
      "id": "intermediate-366",
      "level": "intermediate",
      "zh": "今天你要干什么？",
      "en": "What are you doing today?",
      "source": "Tatoeba",
      "sourceId": 1182336,
      "translationId": 1007952
    },
    {
      "id": "intermediate-367",
      "level": "intermediate",
      "zh": "我想要一把叉子。",
      "en": "I'd like a fork.",
      "source": "Tatoeba",
      "sourceId": 13540044,
      "translationId": 2756922
    },
    {
      "id": "intermediate-368",
      "level": "intermediate",
      "zh": "看上去很可疑。",
      "en": "It looks suspicious.",
      "source": "Tatoeba",
      "sourceId": 9961397,
      "translationId": 2248776
    },
    {
      "id": "intermediate-369",
      "level": "intermediate",
      "zh": "这树全年常绿。",
      "en": "The tree is green all year round.",
      "source": "Tatoeba",
      "sourceId": 7768333,
      "translationId": 43802
    },
    {
      "id": "intermediate-370",
      "level": "intermediate",
      "zh": "她给了他一个耳光。",
      "en": "She slapped him in the face.",
      "source": "Tatoeba",
      "sourceId": 1409409,
      "translationId": 316371
    },
    {
      "id": "intermediate-371",
      "level": "intermediate",
      "zh": "他们说这属于他们。",
      "en": "They said it belonged to them.",
      "source": "Tatoeba",
      "sourceId": 9974942,
      "translationId": 7409643
    },
    {
      "id": "intermediate-372",
      "level": "intermediate",
      "zh": "我们只须保持冷静。",
      "en": "We just need to stay calm.",
      "source": "Tatoeba",
      "sourceId": 11294946,
      "translationId": 3185060
    },
    {
      "id": "intermediate-373",
      "level": "intermediate",
      "zh": "他非常醉了。",
      "en": "He's really drunk.",
      "source": "Tatoeba",
      "sourceId": 1202589,
      "translationId": 1211460
    },
    {
      "id": "intermediate-374",
      "level": "intermediate",
      "zh": "那些人疯了！",
      "en": "Those folks are insane!",
      "source": "Tatoeba",
      "sourceId": 6563559,
      "translationId": 1406109
    },
    {
      "id": "intermediate-375",
      "level": "intermediate",
      "zh": "谢谢你答应到来。",
      "en": "Thanks for agreeing to come.",
      "source": "Tatoeba",
      "sourceId": 10086123,
      "translationId": 4016627
    },
    {
      "id": "intermediate-376",
      "level": "intermediate",
      "zh": "我的兄弟被捕了而不是他。",
      "en": "Instead of him, my brother was arrested.",
      "source": "Tatoeba",
      "sourceId": 4844659,
      "translationId": 4838380
    },
    {
      "id": "intermediate-377",
      "level": "intermediate",
      "zh": "我什么时间到达东京？",
      "en": "When will I get to Tokyo?",
      "source": "Tatoeba",
      "sourceId": 2889761,
      "translationId": 940857
    },
    {
      "id": "intermediate-378",
      "level": "intermediate",
      "zh": "她说的极其快。",
      "en": "She spoke rapidly.",
      "source": "Tatoeba",
      "sourceId": 2336817,
      "translationId": 619916
    },
    {
      "id": "intermediate-379",
      "level": "intermediate",
      "zh": "欢迎来到法国！",
      "en": "Welcome to France!",
      "source": "Tatoeba",
      "sourceId": 9094110,
      "translationId": 5201722
    },
    {
      "id": "intermediate-380",
      "level": "intermediate",
      "zh": "你为什么不去加入她？",
      "en": "Why don't you go and join her?",
      "source": "Tatoeba",
      "sourceId": 4844765,
      "translationId": 3914342
    },
    {
      "id": "intermediate-381",
      "level": "intermediate",
      "zh": "据说她是个滑雪专家。",
      "en": "It is said that she is an expert in skiing.",
      "source": "Tatoeba",
      "sourceId": 809003,
      "translationId": 310953
    },
    {
      "id": "intermediate-382",
      "level": "intermediate",
      "zh": "我喜欢有幽默感的人。",
      "en": "I like people with a sense of humour.",
      "source": "Tatoeba",
      "sourceId": 1240252,
      "translationId": 7779317
    },
    {
      "id": "intermediate-383",
      "level": "intermediate",
      "zh": "绿灯时，拐弯车要让人。",
      "en": "When the light is green, cars turning must yield to pedestrians.",
      "source": "Tatoeba",
      "sourceId": 421254,
      "translationId": 1560363
    },
    {
      "id": "intermediate-384",
      "level": "intermediate",
      "zh": "别用铅笔签合同。",
      "en": "Don't sign the contract in pencil.",
      "source": "Tatoeba",
      "sourceId": 5663461,
      "translationId": 3821554
    },
    {
      "id": "intermediate-385",
      "level": "intermediate",
      "zh": "他去名古屋出差。",
      "en": "He's gone to Nagoya on business.",
      "source": "Tatoeba",
      "sourceId": 4953630,
      "translationId": 40892
    },
    {
      "id": "intermediate-386",
      "level": "intermediate",
      "zh": "她讲话非常俗气。",
      "en": "She is extremely vulgar in her speech.",
      "source": "Tatoeba",
      "sourceId": 2031459,
      "translationId": 317520
    },
    {
      "id": "intermediate-387",
      "level": "intermediate",
      "zh": "机器发了很多电。",
      "en": "The machine generated large amounts of electricity.",
      "source": "Tatoeba",
      "sourceId": 4267339,
      "translationId": 4770610
    },
    {
      "id": "intermediate-388",
      "level": "intermediate",
      "zh": "您想告诉我什么？",
      "en": "What do you want to tell me?",
      "source": "Tatoeba",
      "sourceId": 10182795,
      "translationId": 5093806
    },
    {
      "id": "intermediate-389",
      "level": "intermediate",
      "zh": "你学韩文多久了？",
      "en": "How long have you been learning Korean?",
      "source": "Tatoeba",
      "sourceId": 8696354,
      "translationId": 8860563
    },
    {
      "id": "intermediate-390",
      "level": "intermediate",
      "zh": "他跟我说我很苍白，并问我怎么了。",
      "en": "He told me that I looked pale and asked me what the matter was.",
      "source": "Tatoeba",
      "sourceId": 343927,
      "translationId": 297456
    },
    {
      "id": "intermediate-391",
      "level": "intermediate",
      "zh": "我无法想象另一个星球上的生物。",
      "en": "I can't imagine what creatures living on another planet are like.",
      "source": "Tatoeba",
      "sourceId": 332481,
      "translationId": 1489059
    },
    {
      "id": "intermediate-392",
      "level": "intermediate",
      "zh": "她烫了他的衬衫。",
      "en": "She ironed his shirts.",
      "source": "Tatoeba",
      "sourceId": 6799574,
      "translationId": 316351
    },
    {
      "id": "intermediate-393",
      "level": "intermediate",
      "zh": "地铁在地下通行。",
      "en": "The subway runs underground.",
      "source": "Tatoeba",
      "sourceId": 464915,
      "translationId": 13545701
    },
    {
      "id": "intermediate-394",
      "level": "intermediate",
      "zh": "那是谁的环？",
      "en": "Whose ring is that?",
      "source": "Tatoeba",
      "sourceId": 5780604,
      "translationId": 3408916
    },
    {
      "id": "intermediate-395",
      "level": "intermediate",
      "zh": "护士轻柔地给我的头缠上绷带。",
      "en": "The nurse gently put a bandage around my head.",
      "source": "Tatoeba",
      "sourceId": 5550308,
      "translationId": 48869
    },
    {
      "id": "intermediate-396",
      "level": "intermediate",
      "zh": "它还活着吗？",
      "en": "Is it still alive?",
      "source": "Tatoeba",
      "sourceId": 10668579,
      "translationId": 6357980
    },
    {
      "id": "intermediate-397",
      "level": "intermediate",
      "zh": "显然没有人有新的建议。",
      "en": "It is clear that no one has anything new to suggest.",
      "source": "Tatoeba",
      "sourceId": 1565731,
      "translationId": 1565732
    },
    {
      "id": "intermediate-398",
      "level": "intermediate",
      "zh": "富人有时会看不起穷人。",
      "en": "The rich sometimes despise the poor.",
      "source": "Tatoeba",
      "sourceId": 1998069,
      "translationId": 18516
    },
    {
      "id": "intermediate-399",
      "level": "intermediate",
      "zh": "您想待多久？",
      "en": "How long do you want to stay?",
      "source": "Tatoeba",
      "sourceId": 10280537,
      "translationId": 4497754
    },
    {
      "id": "intermediate-400",
      "level": "intermediate",
      "zh": "别怕犯错啊。",
      "en": "Don't be afraid of making mistakes.",
      "source": "Tatoeba",
      "sourceId": 713133,
      "translationId": 20858
    },
    {
      "id": "intermediate-401",
      "level": "intermediate",
      "zh": "你能举例说明你的想法吗？",
      "en": "Could you make an example to reify your idea?",
      "source": "Tatoeba",
      "sourceId": 9531463,
      "translationId": 1395150
    },
    {
      "id": "intermediate-402",
      "level": "intermediate",
      "zh": "本世纪初以来，产生了很多进步。",
      "en": "Many improvements have been made since this century began.",
      "source": "Tatoeba",
      "sourceId": 8500213,
      "translationId": 242142
    },
    {
      "id": "intermediate-403",
      "level": "intermediate",
      "zh": "这不是一只蜘蛛，而是一个怪物。",
      "en": "This is not a spider, it's a monster!",
      "source": "Tatoeba",
      "sourceId": 2028081,
      "translationId": 1820208
    },
    {
      "id": "intermediate-404",
      "level": "intermediate",
      "zh": "我哭了一整晚。",
      "en": "I cried all night long.",
      "source": "Tatoeba",
      "sourceId": 437751,
      "translationId": 25510
    },
    {
      "id": "intermediate-405",
      "level": "intermediate",
      "zh": "我努力忍住哭。",
      "en": "I tried not to cry.",
      "source": "Tatoeba",
      "sourceId": 8696271,
      "translationId": 2775425
    },
    {
      "id": "intermediate-406",
      "level": "intermediate",
      "zh": "祖国到处是春天。",
      "en": "It's spring everywhere in the motherland.",
      "source": "Tatoeba",
      "sourceId": 2277156,
      "translationId": 2278204
    },
    {
      "id": "intermediate-407",
      "level": "intermediate",
      "zh": "地球不是恒星，而是行星。",
      "en": "The earth is not a star, but a planet.",
      "source": "Tatoeba",
      "sourceId": 528045,
      "translationId": 277128
    },
    {
      "id": "intermediate-408",
      "level": "intermediate",
      "zh": "平行四边形的对边平行。",
      "en": "The opposite sides of a parallelogram are parallel.",
      "source": "Tatoeba",
      "sourceId": 9932480,
      "translationId": 499388
    },
    {
      "id": "intermediate-409",
      "level": "intermediate",
      "zh": "你不是我喜欢的类型。",
      "en": "You're not my type.",
      "source": "Tatoeba",
      "sourceId": 2318405,
      "translationId": 1911929
    },
    {
      "id": "intermediate-410",
      "level": "intermediate",
      "zh": "小明很喜欢飞机模型。",
      "en": "Xiaoming really likes model airplanes.",
      "source": "Tatoeba",
      "sourceId": 2448822,
      "translationId": 11587821
    },
    {
      "id": "intermediate-411",
      "level": "intermediate",
      "zh": "中国让人印象最深的就是中国菜。",
      "en": "The thing that left the biggest impression on me in China was the Chinese food.",
      "source": "Tatoeba",
      "sourceId": 1821137,
      "translationId": 1821146
    },
    {
      "id": "intermediate-412",
      "level": "intermediate",
      "zh": "你见过灌肠的做法吗？",
      "en": "Have you ever seen sausage being made?",
      "source": "Tatoeba",
      "sourceId": 4874076,
      "translationId": 4285675
    },
    {
      "id": "intermediate-413",
      "level": "intermediate",
      "zh": "自由是我们所力争的。",
      "en": "Freedom is what we're fighting for.",
      "source": "Tatoeba",
      "sourceId": 9963138,
      "translationId": 3665456
    },
    {
      "id": "intermediate-414",
      "level": "intermediate",
      "zh": "不知是谁在敲门。",
      "en": "Someone is knocking on the door.",
      "source": "Tatoeba",
      "sourceId": 1438471,
      "translationId": 1065448
    },
    {
      "id": "intermediate-415",
      "level": "intermediate",
      "zh": "你做了个坏榜样。",
      "en": "You've set a bad example.",
      "source": "Tatoeba",
      "sourceId": 469263,
      "translationId": 16329
    },
    {
      "id": "intermediate-416",
      "level": "intermediate",
      "zh": "那你会给我什么？",
      "en": "So, what'll you give me?",
      "source": "Tatoeba",
      "sourceId": 5663560,
      "translationId": 3151306
    },
    {
      "id": "intermediate-417",
      "level": "intermediate",
      "zh": "很容易感冒。",
      "en": "It's easy to catch a cold.",
      "source": "Tatoeba",
      "sourceId": 776961,
      "translationId": 776367
    },
    {
      "id": "intermediate-418",
      "level": "intermediate",
      "zh": "短发很适合你。",
      "en": "Your short hair suits you.",
      "source": "Tatoeba",
      "sourceId": 6884327,
      "translationId": 542521
    },
    {
      "id": "intermediate-419",
      "level": "intermediate",
      "zh": "天气的预报是很科学的。",
      "en": "The weather is forecast scientifically.",
      "source": "Tatoeba",
      "sourceId": 1944122,
      "translationId": 278882
    },
    {
      "id": "intermediate-420",
      "level": "intermediate",
      "zh": "两兄弟都是音乐家。",
      "en": "Both brothers are musicians.",
      "source": "Tatoeba",
      "sourceId": 429185,
      "translationId": 48583
    },
    {
      "id": "intermediate-421",
      "level": "intermediate",
      "zh": "现代的人想法不同。",
      "en": "People today think differently.",
      "source": "Tatoeba",
      "sourceId": 6452010,
      "translationId": 6452011
    },
    {
      "id": "intermediate-422",
      "level": "intermediate",
      "zh": "我想做个派。",
      "en": "I want to make a pie.",
      "source": "Tatoeba",
      "sourceId": 4625752,
      "translationId": 2361775
    },
    {
      "id": "intermediate-423",
      "level": "intermediate",
      "zh": "他的梦想最终实现了。",
      "en": "His dream has come true at last.",
      "source": "Tatoeba",
      "sourceId": 349666,
      "translationId": 287573
    },
    {
      "id": "intermediate-424",
      "level": "intermediate",
      "zh": "本住在新加坡。",
      "en": "Bin lived in Singapore.",
      "source": "Tatoeba",
      "sourceId": 10484069,
      "translationId": 34429
    },
    {
      "id": "intermediate-425",
      "level": "intermediate",
      "zh": "她是一名教授。",
      "en": "She is a professor.",
      "source": "Tatoeba",
      "sourceId": 10329833,
      "translationId": 3635537
    },
    {
      "id": "intermediate-426",
      "level": "intermediate",
      "zh": "我弟弟很富有。",
      "en": "My brother is rich.",
      "source": "Tatoeba",
      "sourceId": 1388731,
      "translationId": 1388691
    },
    {
      "id": "intermediate-427",
      "level": "intermediate",
      "zh": "你会陪我去吗？",
      "en": "Will you accompany me?",
      "source": "Tatoeba",
      "sourceId": 2383343,
      "translationId": 1855200
    },
    {
      "id": "intermediate-428",
      "level": "intermediate",
      "zh": "他碰了我的手。",
      "en": "He touched my hand.",
      "source": "Tatoeba",
      "sourceId": 8934349,
      "translationId": 1977695
    },
    {
      "id": "intermediate-429",
      "level": "intermediate",
      "zh": "你把你的铅笔弄掉了。",
      "en": "You dropped your pencil.",
      "source": "Tatoeba",
      "sourceId": 469391,
      "translationId": 16283
    },
    {
      "id": "intermediate-430",
      "level": "intermediate",
      "zh": "这出乎意料地容易。",
      "en": "It was amazingly easy.",
      "source": "Tatoeba",
      "sourceId": 5091377,
      "translationId": 4530096
    },
    {
      "id": "intermediate-431",
      "level": "intermediate",
      "zh": "你怎样作出的解释？",
      "en": "How do you account for that?",
      "source": "Tatoeba",
      "sourceId": 1450439,
      "translationId": 69928
    },
    {
      "id": "intermediate-432",
      "level": "intermediate",
      "zh": "电脑是个复杂的机器。",
      "en": "A computer is a complex machine.",
      "source": "Tatoeba",
      "sourceId": 335129,
      "translationId": 54545
    },
    {
      "id": "intermediate-433",
      "level": "intermediate",
      "zh": "我同意他的建议。",
      "en": "I agree with his suggestion.",
      "source": "Tatoeba",
      "sourceId": 970192,
      "translationId": 983009
    },
    {
      "id": "intermediate-434",
      "level": "intermediate",
      "zh": "我刚才在洗澡。",
      "en": "I was just showering.",
      "source": "Tatoeba",
      "sourceId": 539520,
      "translationId": 599700
    },
    {
      "id": "intermediate-435",
      "level": "intermediate",
      "zh": "那条连衣裙真的很适合她。",
      "en": "That dress really becomes her.",
      "source": "Tatoeba",
      "sourceId": 408236,
      "translationId": 68652
    },
    {
      "id": "intermediate-436",
      "level": "intermediate",
      "zh": "点击图片进入下一页！",
      "en": "Click the picture to go to the next page!",
      "source": "Tatoeba",
      "sourceId": 787562,
      "translationId": 329272
    },
    {
      "id": "intermediate-437",
      "level": "intermediate",
      "zh": "请给我提提建议，我该做什么。",
      "en": "Please give me some advice on what I should do.",
      "source": "Tatoeba",
      "sourceId": 4262238,
      "translationId": 7797081
    },
    {
      "id": "intermediate-438",
      "level": "intermediate",
      "zh": "他会说法语吗？",
      "en": "Can he speak French?",
      "source": "Tatoeba",
      "sourceId": 340484,
      "translationId": 292639
    },
    {
      "id": "intermediate-439",
      "level": "intermediate",
      "zh": "这种药片对心脏有疗效。",
      "en": "These pills act on the heart.",
      "source": "Tatoeba",
      "sourceId": 3630142,
      "translationId": 59883
    },
    {
      "id": "intermediate-440",
      "level": "intermediate",
      "zh": "谁都会犯错。",
      "en": "Anybody can make a mistake.",
      "source": "Tatoeba",
      "sourceId": 512819,
      "translationId": 40401
    },
    {
      "id": "intermediate-441",
      "level": "intermediate",
      "zh": "我是个职员。",
      "en": "I'm an office worker.",
      "source": "Tatoeba",
      "sourceId": 2827155,
      "translationId": 6873236
    },
    {
      "id": "intermediate-442",
      "level": "intermediate",
      "zh": "你救不了我。",
      "en": "You can't save me.",
      "source": "Tatoeba",
      "sourceId": 10650300,
      "translationId": 3241644
    },
    {
      "id": "intermediate-443",
      "level": "intermediate",
      "zh": "不是那么远。",
      "en": "It's not that far.",
      "source": "Tatoeba",
      "sourceId": 451442,
      "translationId": 451726
    },
    {
      "id": "intermediate-444",
      "level": "intermediate",
      "zh": "天空完全变黑了。",
      "en": "The sky was completely dark.",
      "source": "Tatoeba",
      "sourceId": 1878280,
      "translationId": 18284
    },
    {
      "id": "intermediate-445",
      "level": "intermediate",
      "zh": "你是美国人吗？",
      "en": "Are you American?",
      "source": "Tatoeba",
      "sourceId": 3804964,
      "translationId": 1977734
    },
    {
      "id": "intermediate-446",
      "level": "intermediate",
      "zh": "我们玩点什么吧。",
      "en": "Let's have some fun.",
      "source": "Tatoeba",
      "sourceId": 1144526,
      "translationId": 21283
    },
    {
      "id": "intermediate-447",
      "level": "intermediate",
      "zh": "他天生热爱冒险。",
      "en": "He has an innate love of adventure.",
      "source": "Tatoeba",
      "sourceId": 5763025,
      "translationId": 300454
    },
    {
      "id": "intermediate-448",
      "level": "intermediate",
      "zh": "我对音乐一无所知。",
      "en": "I know nothing about music.",
      "source": "Tatoeba",
      "sourceId": 1928584,
      "translationId": 1312248
    },
    {
      "id": "intermediate-449",
      "level": "intermediate",
      "zh": "你为什么一个人？",
      "en": "Why are you alone?",
      "source": "Tatoeba",
      "sourceId": 7772050,
      "translationId": 69874
    },
    {
      "id": "intermediate-450",
      "level": "intermediate",
      "zh": "他重二百七十磅。",
      "en": "He weighs 270 pounds.",
      "source": "Tatoeba",
      "sourceId": 659588,
      "translationId": 288481
    },
    {
      "id": "intermediate-451",
      "level": "intermediate",
      "zh": "您知道为什么吗？",
      "en": "Do you know why?",
      "source": "Tatoeba",
      "sourceId": 10695962,
      "translationId": 2891110
    },
    {
      "id": "intermediate-452",
      "level": "intermediate",
      "zh": "那是有道理的。",
      "en": "That makes sense.",
      "source": "Tatoeba",
      "sourceId": 781532,
      "translationId": 780859
    },
    {
      "id": "intermediate-453",
      "level": "intermediate",
      "zh": "凡事要尽力而为，更要量力而行。",
      "en": "One needs to do their best in all things, and more importantly work within their abilities.",
      "source": "Tatoeba",
      "sourceId": 3537585,
      "translationId": 3537586
    },
    {
      "id": "intermediate-454",
      "level": "intermediate",
      "zh": "我不得不这么做以维生。",
      "en": "I had to do that to survive.",
      "source": "Tatoeba",
      "sourceId": 8743569,
      "translationId": 7137334
    },
    {
      "id": "intermediate-455",
      "level": "intermediate",
      "zh": "他从英国来。",
      "en": "He comes from England.",
      "source": "Tatoeba",
      "sourceId": 333281,
      "translationId": 288977
    },
    {
      "id": "intermediate-456",
      "level": "intermediate",
      "zh": "你能潜水吗？",
      "en": "Can you swim underwater?",
      "source": "Tatoeba",
      "sourceId": 1776712,
      "translationId": 270907
    },
    {
      "id": "intermediate-457",
      "level": "intermediate",
      "zh": "他慢慢地适应了黑暗。",
      "en": "He slowly got used to the dark.",
      "source": "Tatoeba",
      "sourceId": 7774772,
      "translationId": 10605016
    },
    {
      "id": "intermediate-458",
      "level": "intermediate",
      "zh": "我在感受生命的气息。",
      "en": "I'm feeling the breath of life.",
      "source": "Tatoeba",
      "sourceId": 4625755,
      "translationId": 243521
    },
    {
      "id": "intermediate-459",
      "level": "intermediate",
      "zh": "我会去到雅典。",
      "en": "I will be visiting Athens.",
      "source": "Tatoeba",
      "sourceId": 2521501,
      "translationId": 10276512
    },
    {
      "id": "intermediate-460",
      "level": "intermediate",
      "zh": "它是我兄弟的。",
      "en": "It's my brother's.",
      "source": "Tatoeba",
      "sourceId": 780233,
      "translationId": 278535
    },
    {
      "id": "intermediate-461",
      "level": "intermediate",
      "zh": "我是个好厨师。",
      "en": "I'm a good cook.",
      "source": "Tatoeba",
      "sourceId": 346721,
      "translationId": 325794
    },
    {
      "id": "intermediate-462",
      "level": "intermediate",
      "zh": "每个人都无视他。",
      "en": "Everyone ignored him.",
      "source": "Tatoeba",
      "sourceId": 9962122,
      "translationId": 3914484
    },
    {
      "id": "intermediate-463",
      "level": "intermediate",
      "zh": "你到底是怎么做到的？",
      "en": "How exactly did you do it?",
      "source": "Tatoeba",
      "sourceId": 1169506,
      "translationId": 1213518
    },
    {
      "id": "intermediate-464",
      "level": "intermediate",
      "zh": "一个木头碗。",
      "en": "A wooden bowl.",
      "source": "Tatoeba",
      "sourceId": 2915620,
      "translationId": 8716821
    },
    {
      "id": "intermediate-465",
      "level": "intermediate",
      "zh": "这惊到我了。",
      "en": "This startled me.",
      "source": "Tatoeba",
      "sourceId": 10044065,
      "translationId": 10044290
    },
    {
      "id": "intermediate-466",
      "level": "intermediate",
      "zh": "我被你逗乐了。",
      "en": "You made me laugh.",
      "source": "Tatoeba",
      "sourceId": 1762991,
      "translationId": 1765123
    },
    {
      "id": "intermediate-467",
      "level": "intermediate",
      "zh": "我冒犯到你了。",
      "en": "I've offended you.",
      "source": "Tatoeba",
      "sourceId": 8085413,
      "translationId": 3728918
    },
    {
      "id": "intermediate-468",
      "level": "intermediate",
      "zh": "我喜欢独自一人散步。",
      "en": "I like a solitary walk.",
      "source": "Tatoeba",
      "sourceId": 348508,
      "translationId": 293732
    },
    {
      "id": "intermediate-469",
      "level": "intermediate",
      "zh": "这本书的内容是什么？",
      "en": "What is the book about?",
      "source": "Tatoeba",
      "sourceId": 1872274,
      "translationId": 56989
    },
    {
      "id": "intermediate-470",
      "level": "intermediate",
      "zh": "你来自台北。",
      "en": "You come from Taipei.",
      "source": "Tatoeba",
      "sourceId": 3990334,
      "translationId": 3990342
    },
    {
      "id": "intermediate-471",
      "level": "intermediate",
      "zh": "他是希腊人吗？",
      "en": "Is he Greek?",
      "source": "Tatoeba",
      "sourceId": 8931984,
      "translationId": 8169470
    },
    {
      "id": "intermediate-472",
      "level": "intermediate",
      "zh": "我来自非洲。",
      "en": "I am from Africa.",
      "source": "Tatoeba",
      "sourceId": 10342264,
      "translationId": 5769781
    },
    {
      "id": "intermediate-473",
      "level": "intermediate",
      "zh": "祝你早日康复。",
      "en": "I hope you'll be well soon.",
      "source": "Tatoeba",
      "sourceId": 2777027,
      "translationId": 52223
    },
    {
      "id": "intermediate-474",
      "level": "intermediate",
      "zh": "木质房屋很容易着火。",
      "en": "A wooden building can easily catch fire.",
      "source": "Tatoeba",
      "sourceId": 2029284,
      "translationId": 323646
    },
    {
      "id": "intermediate-475",
      "level": "intermediate",
      "zh": "他全吃光了。",
      "en": "He ate all of it.",
      "source": "Tatoeba",
      "sourceId": 2422276,
      "translationId": 291477
    },
    {
      "id": "intermediate-476",
      "level": "intermediate",
      "zh": "别让我失望。",
      "en": "Don't let me down.",
      "source": "Tatoeba",
      "sourceId": 2444320,
      "translationId": 262382
    },
    {
      "id": "intermediate-477",
      "level": "intermediate",
      "zh": "我祝您好运。",
      "en": "I wish you good luck.",
      "source": "Tatoeba",
      "sourceId": 344208,
      "translationId": 54468
    },
    {
      "id": "intermediate-478",
      "level": "intermediate",
      "zh": "看看这一切。",
      "en": "Just look at all this.",
      "source": "Tatoeba",
      "sourceId": 9958211,
      "translationId": 3408651
    },
    {
      "id": "intermediate-479",
      "level": "intermediate",
      "zh": "他有点苍白。",
      "en": "He's a little pale.",
      "source": "Tatoeba",
      "sourceId": 335114,
      "translationId": 997834
    },
    {
      "id": "intermediate-480",
      "level": "intermediate",
      "zh": "她坐在窗旁。",
      "en": "She sat at the window.",
      "source": "Tatoeba",
      "sourceId": 6404920,
      "translationId": 6404921
    },
    {
      "id": "intermediate-481",
      "level": "intermediate",
      "zh": "她不是伤害者。",
      "en": "She is not the victim.",
      "source": "Tatoeba",
      "sourceId": 382441,
      "translationId": 1159733
    },
    {
      "id": "intermediate-482",
      "level": "intermediate",
      "zh": "我在喝果汁。",
      "en": "I'm drinking juice.",
      "source": "Tatoeba",
      "sourceId": 10256747,
      "translationId": 5975586
    },
    {
      "id": "intermediate-483",
      "level": "intermediate",
      "zh": "如果想了解一个国家，就必须学习这个国家的历史。",
      "en": "If you are to know a nation, you must learn its history.",
      "source": "Tatoeba",
      "sourceId": 2393066,
      "translationId": 67245
    },
    {
      "id": "intermediate-484",
      "level": "intermediate",
      "zh": "你告诉她你已经在三天前完成这个工作了。",
      "en": "You told her that you had finished the work three days before.",
      "source": "Tatoeba",
      "sourceId": 775601,
      "translationId": 14530
    },
    {
      "id": "intermediate-485",
      "level": "intermediate",
      "zh": "当我进入那个房间的时候，她正在弹钢琴。",
      "en": "When I entered the room, she was playing the piano.",
      "source": "Tatoeba",
      "sourceId": 8690131,
      "translationId": 483690
    },
    {
      "id": "intermediate-486",
      "level": "intermediate",
      "zh": "跟我的老师谈过后，我决定认真努力。",
      "en": "After I talked with my teacher, I decided to work hard.",
      "source": "Tatoeba",
      "sourceId": 830466,
      "translationId": 272813
    },
    {
      "id": "intermediate-487",
      "level": "intermediate",
      "zh": "我去参加舞会，母亲就帮忙照顾婴儿。",
      "en": "My mother will attend to the baby while I go to the dance.",
      "source": "Tatoeba",
      "sourceId": 380160,
      "translationId": 40315
    },
    {
      "id": "intermediate-488",
      "level": "intermediate",
      "zh": "你必须在后天以前完成回家作业。",
      "en": "You must get this homework finished by the day after tomorrow.",
      "source": "Tatoeba",
      "sourceId": 775829,
      "translationId": 16684
    },
    {
      "id": "intermediate-489",
      "level": "intermediate",
      "zh": "你最后一次给花园浇水在什么时候？",
      "en": "When was the last time that you watered the garden?",
      "source": "Tatoeba",
      "sourceId": 9971549,
      "translationId": 8177780
    },
    {
      "id": "intermediate-490",
      "level": "intermediate",
      "zh": "我想在出发旅行前剪个头发。",
      "en": "I want to get a haircut before I go on the trip.",
      "source": "Tatoeba",
      "sourceId": 2638673,
      "translationId": 325550
    },
    {
      "id": "intermediate-491",
      "level": "intermediate",
      "zh": "我正要出门的时候，电话就响起了。",
      "en": "I was about to go out when the phone rang.",
      "source": "Tatoeba",
      "sourceId": 494347,
      "translationId": 2324
    },
    {
      "id": "intermediate-492",
      "level": "intermediate",
      "zh": "看了信之后，她把它撕成碎片。",
      "en": "After she had read the letter, she tore it to pieces.",
      "source": "Tatoeba",
      "sourceId": 830470,
      "translationId": 314897
    },
    {
      "id": "intermediate-493",
      "level": "intermediate",
      "zh": "上次来吃的时候是很美味的。",
      "en": "The food was very good when I was last here.",
      "source": "Tatoeba",
      "sourceId": 357169,
      "translationId": 10657460
    },
    {
      "id": "intermediate-494",
      "level": "intermediate",
      "zh": "我在想你今天会不会来。",
      "en": "I was wondering if you were going to show up today.",
      "source": "Tatoeba",
      "sourceId": 334925,
      "translationId": 1464
    },
    {
      "id": "intermediate-495",
      "level": "intermediate",
      "zh": "这个月我只打算在明天一天做那件事。",
      "en": "Tomorrow is the only day this month I plan to do that.",
      "source": "Tatoeba",
      "sourceId": 13504853,
      "translationId": 6334843
    },
    {
      "id": "intermediate-496",
      "level": "intermediate",
      "zh": "眼下我不得不和我朋友同住这间房间。",
      "en": "For the time being, I must share this room with my friend.",
      "source": "Tatoeba",
      "sourceId": 4463319,
      "translationId": 280039
    },
    {
      "id": "intermediate-497",
      "level": "intermediate",
      "zh": "我昨天放学回家的时候突然下起了大雨。",
      "en": "Yesterday I was caught in a shower on my way home from school.",
      "source": "Tatoeba",
      "sourceId": 425007,
      "translationId": 257758
    },
    {
      "id": "intermediate-498",
      "level": "intermediate",
      "zh": "你能不能提供他那天晚上没在家的证明？",
      "en": "Can you produce any evidence that he was not at home that night?",
      "source": "Tatoeba",
      "sourceId": 1577240,
      "translationId": 1577256
    },
    {
      "id": "intermediate-499",
      "level": "intermediate",
      "zh": "我想知道这些物质是怎么被人体吸收的。",
      "en": "I would like to know how these substances are absorbed by the body.",
      "source": "Tatoeba",
      "sourceId": 358974,
      "translationId": 55101
    },
    {
      "id": "intermediate-500",
      "level": "intermediate",
      "zh": "我喜欢把东西拆开，看看里面的结构。",
      "en": "I like to take things apart to see what makes them tick.",
      "source": "Tatoeba",
      "sourceId": 1746109,
      "translationId": 637199
    },
    {
      "id": "intermediate-501",
      "level": "intermediate",
      "zh": "我和他在学生时代是分不开的朋友。",
      "en": "He and I were inseparable friends during our time together in school.",
      "source": "Tatoeba",
      "sourceId": 767107,
      "translationId": 1444018
    },
    {
      "id": "intermediate-502",
      "level": "intermediate",
      "zh": "很幸运地，我在机场遇到了我的老朋友。",
      "en": "Quite by chance, I met my old friend at the airport.",
      "source": "Tatoeba",
      "sourceId": 334850,
      "translationId": 32529
    },
    {
      "id": "intermediate-503",
      "level": "intermediate",
      "zh": "不管我用什么招数，儿子就是不肯吃青菜。",
      "en": "I can never get my son to eat any vegetables.",
      "source": "Tatoeba",
      "sourceId": 1941951,
      "translationId": 792245
    },
    {
      "id": "intermediate-504",
      "level": "intermediate",
      "zh": "我们会按照你的工作量付钱给你。",
      "en": "We will pay you according to the amount of work you do.",
      "source": "Tatoeba",
      "sourceId": 534176,
      "translationId": 18021
    },
    {
      "id": "intermediate-505",
      "level": "intermediate",
      "zh": "我有一支圆珠笔，可是我还想再要一支。",
      "en": "I have a ball-point pen, but I want another.",
      "source": "Tatoeba",
      "sourceId": 4762218,
      "translationId": 33634
    },
    {
      "id": "intermediate-506",
      "level": "intermediate",
      "zh": "她在校外见到没家的人住纸板箱。",
      "en": "Outside the school, she saw people with no homes living in cardboard boxes.",
      "source": "Tatoeba",
      "sourceId": 5576844,
      "translationId": 21486
    },
    {
      "id": "intermediate-507",
      "level": "intermediate",
      "zh": "你做那份兼职工作最多能赚到八万日元。",
      "en": "You can make up to 80,000 yen a month in that part-time job.",
      "source": "Tatoeba",
      "sourceId": 1516182,
      "translationId": 50687
    },
    {
      "id": "intermediate-508",
      "level": "intermediate",
      "zh": "我住在海边所以经常去海滩。",
      "en": "I live near the sea, so I often go to the beach.",
      "source": "Tatoeba",
      "sourceId": 3636657,
      "translationId": 3567588
    },
    {
      "id": "intermediate-509",
      "level": "intermediate",
      "zh": "要想成功只需要无知和自信。",
      "en": "All you need is ignorance and confidence and the success is sure.",
      "source": "Tatoeba",
      "sourceId": 2426073,
      "translationId": 667886
    },
    {
      "id": "intermediate-510",
      "level": "intermediate",
      "zh": "你要告诉我你到底想让我干嘛。",
      "en": "You need to tell me what you want me to do.",
      "source": "Tatoeba",
      "sourceId": 11698193,
      "translationId": 3204362
    },
    {
      "id": "intermediate-511",
      "level": "intermediate",
      "zh": "我要回房间了，在那儿我可以学习。",
      "en": "I am going to my room, where I can study.",
      "source": "Tatoeba",
      "sourceId": 332540,
      "translationId": 261656
    },
    {
      "id": "intermediate-512",
      "level": "intermediate",
      "zh": "我起了个大早为了赶第一班火车。",
      "en": "I got up early enough to catch the first train.",
      "source": "Tatoeba",
      "sourceId": 437259,
      "translationId": 256109
    },
    {
      "id": "intermediate-513",
      "level": "intermediate",
      "zh": "你十月二十号下午两点半的时候在哪儿？",
      "en": "Where were you on October 20th at 2:30 in the afternoon?",
      "source": "Tatoeba",
      "sourceId": 10278281,
      "translationId": 6431557
    },
    {
      "id": "intermediate-514",
      "level": "intermediate",
      "zh": "我一回到家就打电话给你。",
      "en": "I will give you a call as soon as I get home.",
      "source": "Tatoeba",
      "sourceId": 401127,
      "translationId": 24211
    },
    {
      "id": "intermediate-515",
      "level": "intermediate",
      "zh": "如果你喜欢，买就是了。",
      "en": "If you like it, just buy it.",
      "source": "Tatoeba",
      "sourceId": 3709334,
      "translationId": 7222036
    },
    {
      "id": "intermediate-516",
      "level": "intermediate",
      "zh": "我今天必须把书还给图书馆。",
      "en": "I have to take the book back to the library today.",
      "source": "Tatoeba",
      "sourceId": 738476,
      "translationId": 1112535
    },
    {
      "id": "intermediate-517",
      "level": "intermediate",
      "zh": "他还记得他妈妈发现他正在抽烟的那天。",
      "en": "He still remembers the day his mother found out he was smoking.",
      "source": "Tatoeba",
      "sourceId": 846418,
      "translationId": 264547
    },
    {
      "id": "intermediate-518",
      "level": "intermediate",
      "zh": "如果我是一只小鸟，我就可以飞到你的身边了。",
      "en": "If I were a bird, I could fly to you.",
      "source": "Tatoeba",
      "sourceId": 501362,
      "translationId": 30798
    },
    {
      "id": "intermediate-519",
      "level": "intermediate",
      "zh": "当我无家可归的时候，我常在那张长椅上睡觉。",
      "en": "I often slept on that bench when I was homeless.",
      "source": "Tatoeba",
      "sourceId": 7771956,
      "translationId": 7105624
    },
    {
      "id": "intermediate-520",
      "level": "intermediate",
      "zh": "我想看看您的邮票收藏。",
      "en": "I would like to have a look at your collection of stamps.",
      "source": "Tatoeba",
      "sourceId": 782291,
      "translationId": 266871
    },
    {
      "id": "intermediate-521",
      "level": "intermediate",
      "zh": "我希望我能和她多谈一会儿。",
      "en": "I wish I had more time to talk with her.",
      "source": "Tatoeba",
      "sourceId": 1408084,
      "translationId": 30374
    },
    {
      "id": "intermediate-522",
      "level": "intermediate",
      "zh": "我们登得愈高，空气就愈稀薄。",
      "en": "The higher we go up, the thinner the air becomes.",
      "source": "Tatoeba",
      "sourceId": 339212,
      "translationId": 262518
    },
    {
      "id": "intermediate-523",
      "level": "intermediate",
      "zh": "立刻起床，否则你会错过七点的公车。",
      "en": "Get up at once, or you will miss the 7:00 bus.",
      "source": "Tatoeba",
      "sourceId": 12080546,
      "translationId": 52092
    },
    {
      "id": "intermediate-524",
      "level": "intermediate",
      "zh": "我一周去图书馆两、三次。",
      "en": "I go to the library two or three times a week.",
      "source": "Tatoeba",
      "sourceId": 5544844,
      "translationId": 256049
    },
    {
      "id": "intermediate-525",
      "level": "intermediate",
      "zh": "我爸爸会在这周末回家。",
      "en": "My father will come home at the end of this week.",
      "source": "Tatoeba",
      "sourceId": 334238,
      "translationId": 319270
    },
    {
      "id": "intermediate-526",
      "level": "intermediate",
      "zh": "我们需要尽早谈论那件事。",
      "en": "We need to talk about that as soon as possible.",
      "source": "Tatoeba",
      "sourceId": 6148401,
      "translationId": 3182125
    },
    {
      "id": "intermediate-527",
      "level": "intermediate",
      "zh": "他被视为村里最好的医生。",
      "en": "He is regarded as the best doctor in the village.",
      "source": "Tatoeba",
      "sourceId": 367905,
      "translationId": 301038
    },
    {
      "id": "intermediate-528",
      "level": "intermediate",
      "zh": "她用手捂住了电话的话筒。",
      "en": "She covered the mouthpiece of the phone with her hand.",
      "source": "Tatoeba",
      "sourceId": 8775850,
      "translationId": 315944
    },
    {
      "id": "intermediate-529",
      "level": "intermediate",
      "zh": "我要一件新衬衫。你想要什么？",
      "en": "I want a new shirt. What do you want?",
      "source": "Tatoeba",
      "sourceId": 4621013,
      "translationId": 2361766
    },
    {
      "id": "intermediate-530",
      "level": "intermediate",
      "zh": "我从来没碰到过这么倔的人。",
      "en": "I have never come across such a stubborn person.",
      "source": "Tatoeba",
      "sourceId": 4218323,
      "translationId": 253060
    },
    {
      "id": "intermediate-531",
      "level": "intermediate",
      "zh": "黑乎乎的，戴墨镜干啥？",
      "en": "What do you need sunglasses for in such a dark place?",
      "source": "Tatoeba",
      "sourceId": 12413258,
      "translationId": 54696
    },
    {
      "id": "intermediate-532",
      "level": "intermediate",
      "zh": "我让他随我来，他同意了。",
      "en": "I asked him to come with me and he agreed.",
      "source": "Tatoeba",
      "sourceId": 9962900,
      "translationId": 247003
    },
    {
      "id": "intermediate-533",
      "level": "intermediate",
      "zh": "我唯一想做的是去钓鱼。",
      "en": "The only thing I want to do is go fishing.",
      "source": "Tatoeba",
      "sourceId": 4193788,
      "translationId": 2006522
    },
    {
      "id": "intermediate-534",
      "level": "intermediate",
      "zh": "他一干完活儿就回了家。",
      "en": "As soon as he finished his work, he went home.",
      "source": "Tatoeba",
      "sourceId": 10275077,
      "translationId": 297073
    },
    {
      "id": "intermediate-535",
      "level": "intermediate",
      "zh": "他继续读书，好像什么事也没有发生。",
      "en": "He went on reading the book as if nothing had happened.",
      "source": "Tatoeba",
      "sourceId": 876542,
      "translationId": 294340
    },
    {
      "id": "intermediate-536",
      "level": "intermediate",
      "zh": "为了避免误解，他们又过了一遍合同。",
      "en": "In order to avoid misunderstandings, they went through the contract again.",
      "source": "Tatoeba",
      "sourceId": 10546668,
      "translationId": 240264
    },
    {
      "id": "intermediate-537",
      "level": "intermediate",
      "zh": "一位医生告诉过我，吃鸡蛋对我的健康有害。",
      "en": "A doctor told me that eating eggs was bad for me.",
      "source": "Tatoeba",
      "sourceId": 1323967,
      "translationId": 953071
    },
    {
      "id": "intermediate-538",
      "level": "intermediate",
      "zh": "他撞车是因为有人在刹车上做了手脚。",
      "en": "He crashed his car because someone tampered with the brakes.",
      "source": "Tatoeba",
      "sourceId": 812258,
      "translationId": 640831
    },
    {
      "id": "intermediate-539",
      "level": "intermediate",
      "zh": "两个老人打牌消磨着时间。",
      "en": "The two old men while away the time playing cards.",
      "source": "Tatoeba",
      "sourceId": 554541,
      "translationId": 553876
    },
    {
      "id": "intermediate-540",
      "level": "intermediate",
      "zh": "全体销售人员通宵达旦地工作了一周。",
      "en": "The entire sales staff has worked around the clock for a week.",
      "source": "Tatoeba",
      "sourceId": 332763,
      "translationId": 282815
    },
    {
      "id": "intermediate-541",
      "level": "intermediate",
      "zh": "不如一起去看电影吧。",
      "en": "Would you like to go see a movie with me?",
      "source": "Tatoeba",
      "sourceId": 400071,
      "translationId": 27701
    },
    {
      "id": "intermediate-542",
      "level": "intermediate",
      "zh": "走了一个小时后，我们停下来休息。",
      "en": "After walking for an hour, we stopped to take a rest.",
      "source": "Tatoeba",
      "sourceId": 830471,
      "translationId": 73150
    },
    {
      "id": "intermediate-543",
      "level": "intermediate",
      "zh": "如果他是清白的，那他妻子就有罪。",
      "en": "If he is innocent, it follows that his wife is guilty.",
      "source": "Tatoeba",
      "sourceId": 1394858,
      "translationId": 284210
    },
    {
      "id": "intermediate-544",
      "level": "intermediate",
      "zh": "23点我打电话给她的时候，她已经去睡觉了。",
      "en": "She had already gone to bed when I called her at 11 p.m.",
      "source": "Tatoeba",
      "sourceId": 510772,
      "translationId": 1398573
    },
    {
      "id": "intermediate-545",
      "level": "intermediate",
      "zh": "他不知道怎么到那里去、什么时候到。",
      "en": "He was unsure how he would get there, and when.",
      "source": "Tatoeba",
      "sourceId": 5617173,
      "translationId": 1070351
    },
    {
      "id": "intermediate-546",
      "level": "intermediate",
      "zh": "那些想要颠覆这个世界的人们，我们将击败你们。",
      "en": "To those who would tear the world down: we will defeat you.",
      "source": "Tatoeba",
      "sourceId": 347869,
      "translationId": 347784
    },
    {
      "id": "intermediate-547",
      "level": "intermediate",
      "zh": "他把他在非洲的所见所闻一五一十地告诉了我们。",
      "en": "He gave us a detailed account of his experiences in Africa.",
      "source": "Tatoeba",
      "sourceId": 494773,
      "translationId": 294540
    },
    {
      "id": "intermediate-548",
      "level": "intermediate",
      "zh": "在医院的时候，我不得不戒烟。",
      "en": "I had to abstain from smoking while I was in the hospital.",
      "source": "Tatoeba",
      "sourceId": 1878437,
      "translationId": 259867
    },
    {
      "id": "intermediate-549",
      "level": "intermediate",
      "zh": "我很渴，想喝点冷饮。",
      "en": "I was quite thirsty and wanted to drink something cool.",
      "source": "Tatoeba",
      "sourceId": 8558451,
      "translationId": 8557702
    },
    {
      "id": "intermediate-550",
      "level": "intermediate",
      "zh": "他大喊的时候，脖子上青筋暴起。",
      "en": "When he shouted, the veins in his neck stood out clearly.",
      "source": "Tatoeba",
      "sourceId": 5617162,
      "translationId": 283541
    },
    {
      "id": "intermediate-551",
      "level": "intermediate",
      "zh": "获得诺贝尔奖后，她仍谦虚如昔。",
      "en": "After winning the Nobel prize, she remained as modest as ever.",
      "source": "Tatoeba",
      "sourceId": 830473,
      "translationId": 309924
    },
    {
      "id": "intermediate-552",
      "level": "intermediate",
      "zh": "我有一个问题得问你。",
      "en": "I have a question I need to ask you.",
      "source": "Tatoeba",
      "sourceId": 4444836,
      "translationId": 3142896
    },
    {
      "id": "intermediate-553",
      "level": "intermediate",
      "zh": "她担心她赶不上火车。",
      "en": "She was worried that she might miss the train.",
      "source": "Tatoeba",
      "sourceId": 13043625,
      "translationId": 510191
    },
    {
      "id": "intermediate-554",
      "level": "intermediate",
      "zh": "我们走了十分钟就抵达了博物馆。",
      "en": "We arrived at the museum after a ten-minute walk.",
      "source": "Tatoeba",
      "sourceId": 9419141,
      "translationId": 3665452
    },
    {
      "id": "intermediate-555",
      "level": "intermediate",
      "zh": "如果你有一万美元，你想做什么呢？",
      "en": "What would you do if you had ten thousand dollars?",
      "source": "Tatoeba",
      "sourceId": 1426521,
      "translationId": 1426494
    },
    {
      "id": "intermediate-556",
      "level": "intermediate",
      "zh": "他给我们讲了一个有趣的故事，我们都笑了起来。",
      "en": "He told us such a funny story that we all laughed.",
      "source": "Tatoeba",
      "sourceId": 332533,
      "translationId": 283229
    },
    {
      "id": "intermediate-557",
      "level": "intermediate",
      "zh": "我邀请了二十人参加我们的聚会，但不是所有人都来。",
      "en": "I asked twenty people to my party but not all of them came.",
      "source": "Tatoeba",
      "sourceId": 1193454,
      "translationId": 252518
    },
    {
      "id": "intermediate-558",
      "level": "intermediate",
      "zh": "如果我是你，我会帮他一把。",
      "en": "If I were in your place, I would lend him a hand.",
      "source": "Tatoeba",
      "sourceId": 2411936,
      "translationId": 30805
    },
    {
      "id": "intermediate-559",
      "level": "intermediate",
      "zh": "您那样做的话，可就帮到我了。",
      "en": "It would be helpful if you could do that for me.",
      "source": "Tatoeba",
      "sourceId": 5096803,
      "translationId": 4740204
    },
    {
      "id": "intermediate-560",
      "level": "intermediate",
      "zh": "你能以大约1000日元买下它。",
      "en": "You can buy it for a thousand yen or so.",
      "source": "Tatoeba",
      "sourceId": 846533,
      "translationId": 73498
    },
    {
      "id": "intermediate-561",
      "level": "intermediate",
      "zh": "我们有必要为上这门课买本教材吗？",
      "en": "Will it be necessary for us to buy a book for this class?",
      "source": "Tatoeba",
      "sourceId": 8969819,
      "translationId": 503182
    },
    {
      "id": "intermediate-562",
      "level": "intermediate",
      "zh": "你身上有很多钱吗？",
      "en": "Do you have a lot of money on you?",
      "source": "Tatoeba",
      "sourceId": 463850,
      "translationId": 7843011
    },
    {
      "id": "intermediate-563",
      "level": "intermediate",
      "zh": "在哪能买到入场券？",
      "en": "Where can you buy a ticket to get in?",
      "source": "Tatoeba",
      "sourceId": 989139,
      "translationId": 995340
    },
    {
      "id": "intermediate-564",
      "level": "intermediate",
      "zh": "像他那样的人，很容易赢总统选举。",
      "en": "A person like that would have no trouble getting elected president.",
      "source": "Tatoeba",
      "sourceId": 1045500,
      "translationId": 1060032
    },
    {
      "id": "intermediate-565",
      "level": "intermediate",
      "zh": "日本的高校生每年要上三十五个星期的学。",
      "en": "Japanese high school students go to school 35 weeks a year.",
      "source": "Tatoeba",
      "sourceId": 685093,
      "translationId": 281384
    },
    {
      "id": "intermediate-566",
      "level": "intermediate",
      "zh": "你把我的钢笔怎么了?一分钟前它还在这里。",
      "en": "What have you done with my pen? It was here a minute ago.",
      "source": "Tatoeba",
      "sourceId": 793606,
      "translationId": 33560
    },
    {
      "id": "intermediate-567",
      "level": "intermediate",
      "zh": "谁都知道他现在还在人世。",
      "en": "Everybody knows for a fact that he is still alive.",
      "source": "Tatoeba",
      "sourceId": 339862,
      "translationId": 40365
    },
    {
      "id": "intermediate-568",
      "level": "intermediate",
      "zh": "请在两点半参加在二楼会议室的会议。",
      "en": "Please attend the meeting in the second floor conference room at 2:30 p.m.",
      "source": "Tatoeba",
      "sourceId": 8792110,
      "translationId": 1021181
    },
    {
      "id": "intermediate-569",
      "level": "intermediate",
      "zh": "火车的尾三节车厢损坏得很严重。",
      "en": "The last three coaches of the train were badly damaged.",
      "source": "Tatoeba",
      "sourceId": 612034,
      "translationId": 326177
    },
    {
      "id": "intermediate-570",
      "level": "intermediate",
      "zh": "他奋不顾身地把遇溺的男孩救了起来。",
      "en": "He saved the drowning boy at the risk of his own life.",
      "source": "Tatoeba",
      "sourceId": 716851,
      "translationId": 298798
    },
    {
      "id": "intermediate-571",
      "level": "intermediate",
      "zh": "他告诉我不论发生什么，他都准备好了。",
      "en": "He told me that whatever might happen, he was prepared for it.",
      "source": "Tatoeba",
      "sourceId": 5576742,
      "translationId": 25130
    },
    {
      "id": "intermediate-572",
      "level": "intermediate",
      "zh": "那个店里没有合我尺寸的帽子。",
      "en": "There are no hats in that store that fit me.",
      "source": "Tatoeba",
      "sourceId": 2661328,
      "translationId": 2681957
    },
    {
      "id": "intermediate-573",
      "level": "intermediate",
      "zh": "她认为他是她所见过最好的音乐家。",
      "en": "In her opinion, he is the best musician she has ever seen.",
      "source": "Tatoeba",
      "sourceId": 767066,
      "translationId": 309064
    },
    {
      "id": "intermediate-574",
      "level": "intermediate",
      "zh": "以下是我们不支持他的看法的理由。",
      "en": "The reason why we cannot support his view will be given below.",
      "source": "Tatoeba",
      "sourceId": 431573,
      "translationId": 36408
    },
    {
      "id": "intermediate-575",
      "level": "intermediate",
      "zh": "我从来没想到他能做到那么残忍的事。",
      "en": "I never thought he was capable of doing something so cruel.",
      "source": "Tatoeba",
      "sourceId": 747640,
      "translationId": 41370
    },
    {
      "id": "intermediate-576",
      "level": "intermediate",
      "zh": "这里的空气不是很好。你可以打开窗户吗？",
      "en": "The air is bad here. Will you open the window?",
      "source": "Tatoeba",
      "sourceId": 7752863,
      "translationId": 61655
    },
    {
      "id": "intermediate-577",
      "level": "intermediate",
      "zh": "我年轻时经常爬树。",
      "en": "When I was young, I used to climb trees a lot.",
      "source": "Tatoeba",
      "sourceId": 6877971,
      "translationId": 5189093
    },
    {
      "id": "intermediate-578",
      "level": "intermediate",
      "zh": "我小时总是很早起床。",
      "en": "I always got up early when I was a kid.",
      "source": "Tatoeba",
      "sourceId": 348161,
      "translationId": 9638090
    },
    {
      "id": "intermediate-579",
      "level": "intermediate",
      "zh": "那个店里没有适合我的帽子。",
      "en": "There were no hats in that store that fit me.",
      "source": "Tatoeba",
      "sourceId": 774425,
      "translationId": 67909
    },
    {
      "id": "intermediate-580",
      "level": "intermediate",
      "zh": "你现在手头儿有钱吗？先借我点儿。",
      "en": "Do you have cash on you now? Could you lend me some?",
      "source": "Tatoeba",
      "sourceId": 756891,
      "translationId": 756892
    },
    {
      "id": "intermediate-581",
      "level": "intermediate",
      "zh": "听他的谈吐，就知道他不是美国人了。",
      "en": "I know from his speech that he is not an American.",
      "source": "Tatoeba",
      "sourceId": 505665,
      "translationId": 326532
    },
    {
      "id": "intermediate-582",
      "level": "intermediate",
      "zh": "她真的有本事让别人做她想做的事。",
      "en": "She has a real knack for getting people to do what she wants.",
      "source": "Tatoeba",
      "sourceId": 812249,
      "translationId": 640823
    },
    {
      "id": "intermediate-583",
      "level": "intermediate",
      "zh": "如遇情况紧急，请立即联系我的代理。",
      "en": "In case of an emergency, get in touch with my agent right away.",
      "source": "Tatoeba",
      "sourceId": 1958189,
      "translationId": 18805
    },
    {
      "id": "intermediate-584",
      "level": "intermediate",
      "zh": "我跟你说过她在的时候不要说这件事。",
      "en": "I told you not to mention that in her presence.",
      "source": "Tatoeba",
      "sourceId": 465025,
      "translationId": 661272
    },
    {
      "id": "intermediate-585",
      "level": "intermediate",
      "zh": "我们可以用望远镜来观察远方的事物。",
      "en": "We can see things in the distance using a telescope.",
      "source": "Tatoeba",
      "sourceId": 1269868,
      "translationId": 684011
    },
    {
      "id": "intermediate-586",
      "level": "intermediate",
      "zh": "更棒的是房子还有一个漂亮的花园。",
      "en": "What is still better is that the house has a beautiful garden.",
      "source": "Tatoeba",
      "sourceId": 395651,
      "translationId": 53994
    },
    {
      "id": "intermediate-587",
      "level": "intermediate",
      "zh": "由于天气变差，出发延迟了。",
      "en": "With the weather getting worse, the departure was put off.",
      "source": "Tatoeba",
      "sourceId": 335626,
      "translationId": 278834
    },
    {
      "id": "intermediate-588",
      "level": "intermediate",
      "zh": "虽然她有些缺点，但我始终还是爱她。",
      "en": "She has faults, but I love her none the less.",
      "source": "Tatoeba",
      "sourceId": 377540,
      "translationId": 308744
    },
    {
      "id": "intermediate-589",
      "level": "intermediate",
      "zh": "上周日妈妈给我买了件漂亮的衣服。",
      "en": "My mother bought me a pretty dress this past Sunday.",
      "source": "Tatoeba",
      "sourceId": 1408062,
      "translationId": 743655
    },
    {
      "id": "intermediate-590",
      "level": "intermediate",
      "zh": "她花了好长时间挑帽子。",
      "en": "It took her a long time to choose a hat.",
      "source": "Tatoeba",
      "sourceId": 2411906,
      "translationId": 315866
    },
    {
      "id": "intermediate-591",
      "level": "intermediate",
      "zh": "出国的人数一直在增加。",
      "en": "The number of people who go abroad has been increasing.",
      "source": "Tatoeba",
      "sourceId": 1394883,
      "translationId": 21933
    },
    {
      "id": "intermediate-592",
      "level": "intermediate",
      "zh": "他们终于在漫长的讨论之后得出了一个计划。",
      "en": "They came up with a plan after a long discussion.",
      "source": "Tatoeba",
      "sourceId": 1394796,
      "translationId": 278034
    },
    {
      "id": "intermediate-593",
      "level": "intermediate",
      "zh": "失业之后他挨过了一段非常艰苦的日子。",
      "en": "After losing his job, he went through a very difficult time.",
      "source": "Tatoeba",
      "sourceId": 339915,
      "translationId": 264945
    },
    {
      "id": "intermediate-594",
      "level": "intermediate",
      "zh": "经过长久的争论，我终于说服了她去露营。",
      "en": "After a long argument, I finally persuaded her to go camping.",
      "source": "Tatoeba",
      "sourceId": 830463,
      "translationId": 278076
    },
    {
      "id": "intermediate-595",
      "level": "intermediate",
      "zh": "如果你需要我的建议，我很愿意告诉你。",
      "en": "If you need my advice, I'd be glad to give it to you.",
      "source": "Tatoeba",
      "sourceId": 2581473,
      "translationId": 1543629
    },
    {
      "id": "intermediate-596",
      "level": "intermediate",
      "zh": "我没有车，所以我一般骑自行车去上班。",
      "en": "I don't have a car, so I usually go to work by bicycle.",
      "source": "Tatoeba",
      "sourceId": 13361711,
      "translationId": 6339502
    },
    {
      "id": "intermediate-597",
      "level": "intermediate",
      "zh": "他完成工作几分钟后，就去睡觉了。",
      "en": "A few minutes after he finished his work, he went to bed.",
      "source": "Tatoeba",
      "sourceId": 430965,
      "translationId": 245432
    },
    {
      "id": "intermediate-598",
      "level": "intermediate",
      "zh": "除了雨天，我都是骑车去上班的。",
      "en": "Apart from on rainy days, I always ride my bike to work.",
      "source": "Tatoeba",
      "sourceId": 332827,
      "translationId": 1360705
    },
    {
      "id": "intermediate-599",
      "level": "intermediate",
      "zh": "如果明天下雨的话，我就不去野餐了。",
      "en": "If it rains tomorrow, I won't go to the picnic.",
      "source": "Tatoeba",
      "sourceId": 345934,
      "translationId": 386764
    },
    {
      "id": "intermediate-600",
      "level": "intermediate",
      "zh": "得到他的帮助，我的工作现在很顺利。",
      "en": "Thanks to his help, my work is going well now.",
      "source": "Tatoeba",
      "sourceId": 864537,
      "translationId": 285578
    },
    {
      "id": "advanced-001",
      "level": "advanced",
      "zh": "玩这些电脑游戏要反应灵敏。",
      "en": "You need to have quick reactions to play these computer games.",
      "source": "Tatoeba",
      "sourceId": 4929474,
      "translationId": 4929473
    },
    {
      "id": "advanced-002",
      "level": "advanced",
      "zh": "很抱歉在这个时间打扰您。",
      "en": "I am sorry to bother you at this time.",
      "source": "Tatoeba",
      "sourceId": 2482704,
      "translationId": 7779308
    },
    {
      "id": "advanced-003",
      "level": "advanced",
      "zh": "我父亲示意我离开会议室。",
      "en": "My father motioned for me to leave the meeting room.",
      "source": "Tatoeba",
      "sourceId": 8603763,
      "translationId": 9506995
    },
    {
      "id": "advanced-004",
      "level": "advanced",
      "zh": "这将是你最后一次被欺骗了。",
      "en": "This will be the last time you're deceived.",
      "source": "Tatoeba",
      "sourceId": 333147,
      "translationId": 10253655
    },
    {
      "id": "advanced-005",
      "level": "advanced",
      "zh": "我看见他们胳膊挽着胳膊地走路。",
      "en": "I saw them walking arm in arm.",
      "source": "Tatoeba",
      "sourceId": 2437290,
      "translationId": 260827
    },
    {
      "id": "advanced-006",
      "level": "advanced",
      "zh": "我在打开包装时遇到了麻烦。",
      "en": "I had trouble unwrapping the package.",
      "source": "Tatoeba",
      "sourceId": 8741566,
      "translationId": 7146021
    },
    {
      "id": "advanced-007",
      "level": "advanced",
      "zh": "年轻人骑摩托车可能会很危险。",
      "en": "It can be dangerous for young people to ride motorcycles.",
      "source": "Tatoeba",
      "sourceId": 336687,
      "translationId": 35537
    },
    {
      "id": "advanced-008",
      "level": "advanced",
      "zh": "我在巴西的大学认识了美丽的波兰女士，也见了一些会说波兰语的友好的人们。",
      "en": "I became acquainted with beautiful Polish women at the university in Brazil, and I also met there some very friendly people who could speak Polish.",
      "source": "Tatoeba",
      "sourceId": 8589265,
      "translationId": 853221
    },
    {
      "id": "advanced-009",
      "level": "advanced",
      "zh": "如果小错误不被立即纠正，可能会导致严重问题。",
      "en": "If small mistakes are not corrected at once, they may lead to serious problems.",
      "source": "Tatoeba",
      "sourceId": 2915543,
      "translationId": 2915544
    },
    {
      "id": "advanced-010",
      "level": "advanced",
      "zh": "山那边有一个村庄。",
      "en": "There is a village beyond the hill.",
      "source": "Tatoeba",
      "sourceId": 6404924,
      "translationId": 6404925
    },
    {
      "id": "advanced-011",
      "level": "advanced",
      "zh": "我想去和他们谈谈。",
      "en": "I want to go talk to them.",
      "source": "Tatoeba",
      "sourceId": 10734316,
      "translationId": 3906654
    },
    {
      "id": "advanced-012",
      "level": "advanced",
      "zh": "当列车停止时，所有的乘客都想知道发生了什么。",
      "en": "As the train came to a halt, all of the passengers wondered what was happening.",
      "source": "Tatoeba",
      "sourceId": 1397024,
      "translationId": 326154
    },
    {
      "id": "advanced-013",
      "level": "advanced",
      "zh": "尽管事故使进度延迟了一个月，我们还是设法赶上了日程表。",
      "en": "Although the accident has delayed progress by one month, we have managed to catch up with the schedule.",
      "source": "Tatoeba",
      "sourceId": 2938650,
      "translationId": 2938651
    },
    {
      "id": "advanced-014",
      "level": "advanced",
      "zh": "进口数量的急速增长让我们感到惊讶。",
      "en": "We're amazed by the rapid growth in import quantities.",
      "source": "Tatoeba",
      "sourceId": 4548238,
      "translationId": 4728109
    },
    {
      "id": "advanced-015",
      "level": "advanced",
      "zh": "花园被木栅栏围了起来。",
      "en": "The garden was surrounded by a wooden fence.",
      "source": "Tatoeba",
      "sourceId": 333146,
      "translationId": 44961
    },
    {
      "id": "advanced-016",
      "level": "advanced",
      "zh": "如果一个人没有坚强的意志，那么他也不会拥有高深的智慧。",
      "en": "If a person doesn't have a strong will, he will be unable to embrace profound wisdom.",
      "source": "Tatoeba",
      "sourceId": 1185732,
      "translationId": 5896555
    },
    {
      "id": "advanced-017",
      "level": "advanced",
      "zh": "这里正在筹划建设一座发电站。",
      "en": "Plans are being drawn up to build a power station here.",
      "source": "Tatoeba",
      "sourceId": 12568787,
      "translationId": 12568788
    },
    {
      "id": "advanced-018",
      "level": "advanced",
      "zh": "最近频繁的地震让我们很焦虑。",
      "en": "The recent frequency of earthquakes makes us nervous.",
      "source": "Tatoeba",
      "sourceId": 796120,
      "translationId": 18689
    },
    {
      "id": "advanced-019",
      "level": "advanced",
      "zh": "援救人员为了找到孩子，仔细搜索了那个区域。",
      "en": "The rescuers searched the surroundings in hopes of finding the child.",
      "source": "Tatoeba",
      "sourceId": 333292,
      "translationId": 971512
    },
    {
      "id": "advanced-020",
      "level": "advanced",
      "zh": "今天下这么大的雨，土松着呢。",
      "en": "It is still raining a lot today, and the soil is being broken up.",
      "source": "Tatoeba",
      "sourceId": 3526227,
      "translationId": 7819895
    },
    {
      "id": "advanced-021",
      "level": "advanced",
      "zh": "他将永远活在我们的记忆中。",
      "en": "He will forever live on in our memories.",
      "source": "Tatoeba",
      "sourceId": 9958317,
      "translationId": 3168594
    },
    {
      "id": "advanced-022",
      "level": "advanced",
      "zh": "这是自动投币电话，用一元硬币来打的。",
      "en": "This is an automated payphone; you use it by inserting a coin.",
      "source": "Tatoeba",
      "sourceId": 420600,
      "translationId": 7845681
    },
    {
      "id": "advanced-023",
      "level": "advanced",
      "zh": "她每天早上都帮母亲在厨房准备早餐。",
      "en": "Every morning, she helps her mother make breakfast in the kitchen.",
      "source": "Tatoeba",
      "sourceId": 2028014,
      "translationId": 430075
    },
    {
      "id": "advanced-024",
      "level": "advanced",
      "zh": "在这种困难的时候，任何寻常的努力都无法使我们的公司摆脱赤字。",
      "en": "In hard times like this, no ordinary effort can get our company out of the red.",
      "source": "Tatoeba",
      "sourceId": 334817,
      "translationId": 60423
    },
    {
      "id": "advanced-025",
      "level": "advanced",
      "zh": "你明天去把栅栏漆一下。",
      "en": "You're painting the fence tomorrow.",
      "source": "Tatoeba",
      "sourceId": 11240805,
      "translationId": 8946974
    },
    {
      "id": "advanced-026",
      "level": "advanced",
      "zh": "他们公司的公关团队非常强悍。",
      "en": "Their company's public relations team is very strong.",
      "source": "Tatoeba",
      "sourceId": 2456628,
      "translationId": 7772953
    },
    {
      "id": "advanced-027",
      "level": "advanced",
      "zh": "晚饭后我洗了餐具。",
      "en": "I washed the dishes after supper.",
      "source": "Tatoeba",
      "sourceId": 6075182,
      "translationId": 252380
    },
    {
      "id": "advanced-028",
      "level": "advanced",
      "zh": "我可能把钥匙忘了。",
      "en": "I might've forgotten my keys.",
      "source": "Tatoeba",
      "sourceId": 7771879,
      "translationId": 7024577
    },
    {
      "id": "advanced-029",
      "level": "advanced",
      "zh": "不要点击那个链接。",
      "en": "Don't click on that link.",
      "source": "Tatoeba",
      "sourceId": 10734052,
      "translationId": 10734044
    },
    {
      "id": "advanced-030",
      "level": "advanced",
      "zh": "在我们的周围没有敌人的迹象。",
      "en": "No sign of the enemy in our surroundings.",
      "source": "Tatoeba",
      "sourceId": 1781986,
      "translationId": 328524
    },
    {
      "id": "advanced-031",
      "level": "advanced",
      "zh": "快乐存在于过去和未来，唯独不存在于现在。",
      "en": "Pleasure is always in the past or in the future, never in the present.",
      "source": "Tatoeba",
      "sourceId": 1409353,
      "translationId": 713343
    },
    {
      "id": "advanced-032",
      "level": "advanced",
      "zh": "我可以触摸这个吗？",
      "en": "Can I touch this one too?",
      "source": "Tatoeba",
      "sourceId": 3805035,
      "translationId": 3962593
    },
    {
      "id": "advanced-033",
      "level": "advanced",
      "zh": "她们买了一盒饼干。",
      "en": "They bought a box of cookies.",
      "source": "Tatoeba",
      "sourceId": 879224,
      "translationId": 305598
    },
    {
      "id": "advanced-034",
      "level": "advanced",
      "zh": "我们经常讨论天气。",
      "en": "We often talk about the weather.",
      "source": "Tatoeba",
      "sourceId": 4972684,
      "translationId": 2402172
    },
    {
      "id": "advanced-035",
      "level": "advanced",
      "zh": "梅西差一点就进球了，但裁判吹哨说他越位。",
      "en": "Messi was very close to scoring a goal, but the referee blew his whistle to say that he was offside.",
      "source": "Tatoeba",
      "sourceId": 3579547,
      "translationId": 3579548
    },
    {
      "id": "advanced-036",
      "level": "advanced",
      "zh": "我在校庆后打扫的时候弄掉了一把学校的钥匙，我被迫写了一份检讨。",
      "en": "I lost a school key when I was cleaning up after the school festival and I was then required to write an apology letter.",
      "source": "Tatoeba",
      "sourceId": 787627,
      "translationId": 425780
    },
    {
      "id": "advanced-037",
      "level": "advanced",
      "zh": "去美国学习对我来说是否有益处，还有待考虑。",
      "en": "It remains to be seen whether or not going to America to study is good for me.",
      "source": "Tatoeba",
      "sourceId": 604905,
      "translationId": 320396
    },
    {
      "id": "advanced-038",
      "level": "advanced",
      "zh": "你不要随意评判别人的传统文化。",
      "en": "Don't judge other people's traditional culture.",
      "source": "Tatoeba",
      "sourceId": 802916,
      "translationId": 802917
    },
    {
      "id": "advanced-039",
      "level": "advanced",
      "zh": "姐姐在市场买了一点茄子、土豆、西葫芦和大白菜。",
      "en": "Our sister bought some eggplants, potatoes, zucchinis and Chinese cabbage at the market.",
      "source": "Tatoeba",
      "sourceId": 2415717,
      "translationId": 706653
    },
    {
      "id": "advanced-040",
      "level": "advanced",
      "zh": "我们必须设法打破这个僵局。",
      "en": "We must try to break the deadlock.",
      "source": "Tatoeba",
      "sourceId": 332477,
      "translationId": 28808
    },
    {
      "id": "advanced-041",
      "level": "advanced",
      "zh": "明天天气晴转阵雨。",
      "en": "Tomorrow's weather should be sunny with occasional rain.",
      "source": "Tatoeba",
      "sourceId": 2567436,
      "translationId": 323216
    },
    {
      "id": "advanced-042",
      "level": "advanced",
      "zh": "我咳嗽，还有点发烧。",
      "en": "I have a cough and a little fever.",
      "source": "Tatoeba",
      "sourceId": 389812,
      "translationId": 135968
    },
    {
      "id": "advanced-043",
      "level": "advanced",
      "zh": "听说适时地补充水分可以预防中暑。",
      "en": "I hear that keeping yourself hydrated at appropriate times can help prevent heatstroke.",
      "source": "Tatoeba",
      "sourceId": 2609505,
      "translationId": 2610616
    },
    {
      "id": "advanced-044",
      "level": "advanced",
      "zh": "对不起，您拨打的用户暂时无法接通。",
      "en": "Sorry. The number you have dialled is currently unavailable.",
      "source": "Tatoeba",
      "sourceId": 497299,
      "translationId": 12758086
    },
    {
      "id": "advanced-045",
      "level": "advanced",
      "zh": "不要沉迷于过去，而是要从中吸取教训。",
      "en": "Never live in the past but always learn from it.",
      "source": "Tatoeba",
      "sourceId": 6461969,
      "translationId": 6461968
    },
    {
      "id": "advanced-046",
      "level": "advanced",
      "zh": "我不能确保这一切会发生。",
      "en": "I can't guarantee that that's going to happen.",
      "source": "Tatoeba",
      "sourceId": 6858748,
      "translationId": 6858726
    },
    {
      "id": "advanced-047",
      "level": "advanced",
      "zh": "过去一百多年，澳大利亚共有二十七例蜘蛛咬人致死的记录。",
      "en": "Over the last hundred years, there have been twenty-seven recorded deaths from spider bites in Australia.",
      "source": "Tatoeba",
      "sourceId": 2333742,
      "translationId": 430625
    },
    {
      "id": "advanced-048",
      "level": "advanced",
      "zh": "为了缓解就业压力，国家已经制定了一系列相关政策。",
      "en": "In order to alleviate employment pressures, the nation has established a series of relevant policies.",
      "source": "Tatoeba",
      "sourceId": 3537572,
      "translationId": 3537574
    },
    {
      "id": "advanced-049",
      "level": "advanced",
      "zh": "任何时间我都可以。",
      "en": "Any time will suit me.",
      "source": "Tatoeba",
      "sourceId": 1020108,
      "translationId": 66185
    },
    {
      "id": "advanced-050",
      "level": "advanced",
      "zh": "你说尼斯湖水怪是虚构的，但我觉得它真实存在。",
      "en": "You say Nessie is an imaginary being, but I think she exists.",
      "source": "Tatoeba",
      "sourceId": 1245389,
      "translationId": 16438
    },
    {
      "id": "advanced-051",
      "level": "advanced",
      "zh": "蠢人一下子就把箭射完。",
      "en": "A fool's bolt is soon shot.",
      "source": "Tatoeba",
      "sourceId": 806637,
      "translationId": 18357
    },
    {
      "id": "advanced-052",
      "level": "advanced",
      "zh": "您只要按一下按钮。",
      "en": "You have only to touch the button.",
      "source": "Tatoeba",
      "sourceId": 471238,
      "translationId": 16524
    },
    {
      "id": "advanced-053",
      "level": "advanced",
      "zh": "一个有名的建筑师造了这栋房子。",
      "en": "A famous architect built this house.",
      "source": "Tatoeba",
      "sourceId": 335932,
      "translationId": 324465
    },
    {
      "id": "advanced-054",
      "level": "advanced",
      "zh": "我奶奶说，良好健康的关键是保持积极。",
      "en": "According to my grandmother, being active is the key to her good health.",
      "source": "Tatoeba",
      "sourceId": 13109473,
      "translationId": 12990438
    },
    {
      "id": "advanced-055",
      "level": "advanced",
      "zh": "就我所知，铃木先生还没从夏威夷回来。",
      "en": "Mr Suzuki, as far as I know, has not returned from Hawaii yet.",
      "source": "Tatoeba",
      "sourceId": 444621,
      "translationId": 326100
    },
    {
      "id": "advanced-056",
      "level": "advanced",
      "zh": "这个夏天，我去苏格兰度假了。",
      "en": "This summer I went on vacation in Scotland.",
      "source": "Tatoeba",
      "sourceId": 710307,
      "translationId": 708390
    },
    {
      "id": "advanced-057",
      "level": "advanced",
      "zh": "中松为自己的愚蠢问题苦笑。",
      "en": "Nakamatsu smiled bitterly at his own stupid question.",
      "source": "Tatoeba",
      "sourceId": 5550240,
      "translationId": 649705
    },
    {
      "id": "advanced-058",
      "level": "advanced",
      "zh": "我们村不缺水。",
      "en": "Our village is not short of water.",
      "source": "Tatoeba",
      "sourceId": 762132,
      "translationId": 7772882
    },
    {
      "id": "advanced-059",
      "level": "advanced",
      "zh": "难民从整个国家涌来。",
      "en": "Refugees poured in from all over the country.",
      "source": "Tatoeba",
      "sourceId": 787357,
      "translationId": 280806
    },
    {
      "id": "advanced-060",
      "level": "advanced",
      "zh": "父亲示意我离开房间。",
      "en": "Father gestured to me to leave the room.",
      "source": "Tatoeba",
      "sourceId": 1074525,
      "translationId": 319264
    },
    {
      "id": "advanced-061",
      "level": "advanced",
      "zh": "这些东西构成了一顿营养均衡的饭。",
      "en": "These things constitute a balanced meal.",
      "source": "Tatoeba",
      "sourceId": 1397099,
      "translationId": 55277
    },
    {
      "id": "advanced-062",
      "level": "advanced",
      "zh": "在光滑的路上开车会导致车祸。",
      "en": "Driving on a slippery road can lead to a car wreck.",
      "source": "Tatoeba",
      "sourceId": 816518,
      "translationId": 682500
    },
    {
      "id": "advanced-063",
      "level": "advanced",
      "zh": "联盟号宇宙飞船于美国东部时间晚上9点53分脱离国际空间站，携带3人返回地球。",
      "en": "The Soyuz spacecraft undocked from the International Space Station at 9:53 p.m. EDT, carrying three people back to Earth.",
      "source": "Tatoeba",
      "sourceId": 8748603,
      "translationId": 8713614
    },
    {
      "id": "advanced-064",
      "level": "advanced",
      "zh": "人们热切地寻求更有现代风格的衣服，所以把以前的旗袍改成了适合他们品位的东西。",
      "en": "People eagerly sought a more modernised style of dress and transformed the old qipao to suit their tastes.",
      "source": "Tatoeba",
      "sourceId": 728013,
      "translationId": 728009
    },
    {
      "id": "advanced-065",
      "level": "advanced",
      "zh": "嗨，先生，黑板上的不是指数函数，而是三角函数。",
      "en": "Hey, sir, the function on the blackboard is not exponential, but trigonometric.",
      "source": "Tatoeba",
      "sourceId": 469488,
      "translationId": 7794265
    },
    {
      "id": "advanced-066",
      "level": "advanced",
      "zh": "我喜欢吃巧克力味的冰激凌。",
      "en": "I like to eat chocolate flavored ice cream.",
      "source": "Tatoeba",
      "sourceId": 993684,
      "translationId": 995297
    },
    {
      "id": "advanced-067",
      "level": "advanced",
      "zh": "她不仅擅长跑步，也擅长唱歌。",
      "en": "She is not only good at running; she is also good at singing.",
      "source": "Tatoeba",
      "sourceId": 1565711,
      "translationId": 1565761
    },
    {
      "id": "advanced-068",
      "level": "advanced",
      "zh": "我想订一张去温哥华的机票。",
      "en": "I'd like to reserve a flight to Vancouver.",
      "source": "Tatoeba",
      "sourceId": 373438,
      "translationId": 34959
    },
    {
      "id": "advanced-069",
      "level": "advanced",
      "zh": "我们终于登上了富士山山顶。",
      "en": "We gained the top of Mt. Fuji at last.",
      "source": "Tatoeba",
      "sourceId": 332730,
      "translationId": 23144
    },
    {
      "id": "advanced-070",
      "level": "advanced",
      "zh": "他拥有的书是我拥有的三倍。",
      "en": "He has three times as many books as I have.",
      "source": "Tatoeba",
      "sourceId": 1366193,
      "translationId": 297860
    },
    {
      "id": "advanced-071",
      "level": "advanced",
      "zh": "革命不是请客吃饭。",
      "en": "A revolution is not a dinner party.",
      "source": "Tatoeba",
      "sourceId": 13831731,
      "translationId": 13820128
    },
    {
      "id": "advanced-072",
      "level": "advanced",
      "zh": "我试着阻止它发生。",
      "en": "I tried to stop that from happening.",
      "source": "Tatoeba",
      "sourceId": 5862098,
      "translationId": 5860528
    },
    {
      "id": "advanced-073",
      "level": "advanced",
      "zh": "每人心里都有牢骚。",
      "en": "Everyone has something that's troubling him.",
      "source": "Tatoeba",
      "sourceId": 3106250,
      "translationId": 3106596
    },
    {
      "id": "advanced-074",
      "level": "advanced",
      "zh": "她一直在对你撒谎。",
      "en": "She lies to you all the time.",
      "source": "Tatoeba",
      "sourceId": 7772417,
      "translationId": 2439787
    },
    {
      "id": "advanced-075",
      "level": "advanced",
      "zh": "很多贫穷的学生得到助学金。",
      "en": "Many poor students are given bursaries.",
      "source": "Tatoeba",
      "sourceId": 1214444,
      "translationId": 1214445
    },
    {
      "id": "advanced-076",
      "level": "advanced",
      "zh": "用纸质餐盘的话，野餐就方便多了。",
      "en": "A picnic is easier on everyone if you use a paper plate.",
      "source": "Tatoeba",
      "sourceId": 3596566,
      "translationId": 3596568
    },
    {
      "id": "advanced-077",
      "level": "advanced",
      "zh": "我们经常用英语讨论。",
      "en": "We usually talked in English.",
      "source": "Tatoeba",
      "sourceId": 8905148,
      "translationId": 247891
    },
    {
      "id": "advanced-078",
      "level": "advanced",
      "zh": "注意你们的食品。",
      "en": "Pay attention to your food.",
      "source": "Tatoeba",
      "sourceId": 839810,
      "translationId": 7785173
    },
    {
      "id": "advanced-079",
      "level": "advanced",
      "zh": "悉尼离这里很远。",
      "en": "Sydney is far from here.",
      "source": "Tatoeba",
      "sourceId": 1366182,
      "translationId": 62130
    },
    {
      "id": "advanced-080",
      "level": "advanced",
      "zh": "她不得不放弃这个计划。",
      "en": "She was obliged to give up the plan.",
      "source": "Tatoeba",
      "sourceId": 2456076,
      "translationId": 312382
    },
    {
      "id": "advanced-081",
      "level": "advanced",
      "zh": "我听到这个消息很惊讶。",
      "en": "I was very surprised to hear the news.",
      "source": "Tatoeba",
      "sourceId": 333214,
      "translationId": 254178
    },
    {
      "id": "advanced-082",
      "level": "advanced",
      "zh": "上海被称为东方的巴黎。",
      "en": "Shanghai is referred to as the Paris of the East.",
      "source": "Tatoeba",
      "sourceId": 795015,
      "translationId": 795012
    },
    {
      "id": "advanced-083",
      "level": "advanced",
      "zh": "你能代替我出席会议吗？",
      "en": "Can you fill in for me at the meeting?",
      "source": "Tatoeba",
      "sourceId": 3565107,
      "translationId": 3565108
    },
    {
      "id": "advanced-084",
      "level": "advanced",
      "zh": "自行车有两个轮胎。",
      "en": "Bicycles have two wheels.",
      "source": "Tatoeba",
      "sourceId": 8902705,
      "translationId": 6689438
    },
    {
      "id": "advanced-085",
      "level": "advanced",
      "zh": "他们在一起很幸福。",
      "en": "They were happy together.",
      "source": "Tatoeba",
      "sourceId": 10783968,
      "translationId": 7781446
    },
    {
      "id": "advanced-086",
      "level": "advanced",
      "zh": "听起来非常诡异啊！",
      "en": "That sounds really weird!",
      "source": "Tatoeba",
      "sourceId": 1753053,
      "translationId": 9401957
    },
    {
      "id": "advanced-087",
      "level": "advanced",
      "zh": "鲍勃也会开车。",
      "en": "Bob can drive a car, too.",
      "source": "Tatoeba",
      "sourceId": 4815154,
      "translationId": 33153
    },
    {
      "id": "advanced-088",
      "level": "advanced",
      "zh": "他们的工作是煎土豆。",
      "en": "Their job is to fry the potatoes.",
      "source": "Tatoeba",
      "sourceId": 7771921,
      "translationId": 1771330
    },
    {
      "id": "advanced-089",
      "level": "advanced",
      "zh": "这味道可能是微波炉传出来的！",
      "en": "This smell might come from the oven!",
      "source": "Tatoeba",
      "sourceId": 784482,
      "translationId": 781118
    },
    {
      "id": "advanced-090",
      "level": "advanced",
      "zh": "托尼的英语和你说得一样好。",
      "en": "Tony speaks English as well as you.",
      "source": "Tatoeba",
      "sourceId": 846780,
      "translationId": 37708
    },
    {
      "id": "advanced-091",
      "level": "advanced",
      "zh": "他的鼻子上长了一个小疙瘩。",
      "en": "On his nose grew a small pimple.",
      "source": "Tatoeba",
      "sourceId": 3479877,
      "translationId": 3621235
    },
    {
      "id": "advanced-092",
      "level": "advanced",
      "zh": "中国与美国隔着哪个大洋？",
      "en": "Which ocean separates China and America?",
      "source": "Tatoeba",
      "sourceId": 876547,
      "translationId": 876549
    },
    {
      "id": "advanced-093",
      "level": "advanced",
      "zh": "今天是世界无烟日。",
      "en": "Today is World No Tobacco Day.",
      "source": "Tatoeba",
      "sourceId": 2467527,
      "translationId": 2481176
    },
    {
      "id": "advanced-094",
      "level": "advanced",
      "zh": "建夫专心致志地解决数学问题。",
      "en": "Takeo is engrossed in solving mathematical problems.",
      "source": "Tatoeba",
      "sourceId": 8792104,
      "translationId": 40928
    },
    {
      "id": "advanced-095",
      "level": "advanced",
      "zh": "很快，城市就被士兵占领了。",
      "en": "The city was soon occupied by the soldiers.",
      "source": "Tatoeba",
      "sourceId": 334298,
      "translationId": 47355
    },
    {
      "id": "advanced-096",
      "level": "advanced",
      "zh": "主场队总是比对手有优势。",
      "en": "The home team always have an advantage over their opponents.",
      "source": "Tatoeba",
      "sourceId": 755897,
      "translationId": 737454
    },
    {
      "id": "advanced-097",
      "level": "advanced",
      "zh": "我小睡后就感到精力充沛。",
      "en": "A little nap and, just like that, I'm as fresh as a daisy.",
      "source": "Tatoeba",
      "sourceId": 410893,
      "translationId": 410798
    },
    {
      "id": "advanced-098",
      "level": "advanced",
      "zh": "问题的根源是，在当今世界，愚人充满了自信，而智者充满了怀疑。",
      "en": "The fundamental cause of the trouble is that in the modern world the stupid are cocksure while the intelligent are full of doubt.",
      "source": "Tatoeba",
      "sourceId": 3029726,
      "translationId": 411791
    },
    {
      "id": "advanced-099",
      "level": "advanced",
      "zh": "我家后面曾经有棵大樱桃树。",
      "en": "There used to be a big cherry tree behind my house.",
      "source": "Tatoeba",
      "sourceId": 3667779,
      "translationId": 1497187
    },
    {
      "id": "advanced-100",
      "level": "advanced",
      "zh": "我以为他没有任何权利这么做。",
      "en": "He had, I thought, no right to do that.",
      "source": "Tatoeba",
      "sourceId": 813610,
      "translationId": 291539
    },
    {
      "id": "advanced-101",
      "level": "advanced",
      "zh": "这个洋娃娃是婶婶给我的礼物。",
      "en": "This doll is a gift from my aunt.",
      "source": "Tatoeba",
      "sourceId": 10273867,
      "translationId": 58319
    },
    {
      "id": "advanced-102",
      "level": "advanced",
      "zh": "我们猜这是一种被蛇咬伤的毒。",
      "en": "We suspect it's about a poisoning by snake bite.",
      "source": "Tatoeba",
      "sourceId": 811099,
      "translationId": 412787
    },
    {
      "id": "advanced-103",
      "level": "advanced",
      "zh": "除了洋葱我什么都可以吃。",
      "en": "I can eat anything but onions.",
      "source": "Tatoeba",
      "sourceId": 472888,
      "translationId": 254987
    },
    {
      "id": "advanced-104",
      "level": "advanced",
      "zh": "甚至我们的手指都不相像。",
      "en": "Not even our fingers look alike.",
      "source": "Tatoeba",
      "sourceId": 1417580,
      "translationId": 2524234
    },
    {
      "id": "advanced-105",
      "level": "advanced",
      "zh": "无产者在这个革命中失去的只是锁链。",
      "en": "The proletarians lose nothing in this revolution but their chains.",
      "source": "Tatoeba",
      "sourceId": 2961931,
      "translationId": 8523345
    },
    {
      "id": "advanced-106",
      "level": "advanced",
      "zh": "我没有强烈的欲望去学习。",
      "en": "I don't feel like studying.",
      "source": "Tatoeba",
      "sourceId": 604910,
      "translationId": 320407
    },
    {
      "id": "advanced-107",
      "level": "advanced",
      "zh": "不要欺骗你自己。",
      "en": "Don't deceive yourself.",
      "source": "Tatoeba",
      "sourceId": 1272224,
      "translationId": 1481773
    },
    {
      "id": "advanced-108",
      "level": "advanced",
      "zh": "我们结束了讨论。",
      "en": "We closed the discussion.",
      "source": "Tatoeba",
      "sourceId": 787277,
      "translationId": 263169
    },
    {
      "id": "advanced-109",
      "level": "advanced",
      "zh": "汽车的数量在增长。",
      "en": "The number of cars is on the increase.",
      "source": "Tatoeba",
      "sourceId": 799254,
      "translationId": 265515
    },
    {
      "id": "advanced-110",
      "level": "advanced",
      "zh": "你参加社团活动吗？",
      "en": "Do you take part in any community activities?",
      "source": "Tatoeba",
      "sourceId": 332432,
      "translationId": 70301
    },
    {
      "id": "advanced-111",
      "level": "advanced",
      "zh": "我不喜欢被人愚弄。",
      "en": "I don't like being made a fool of.",
      "source": "Tatoeba",
      "sourceId": 2046288,
      "translationId": 27848
    },
    {
      "id": "advanced-112",
      "level": "advanced",
      "zh": "他很有钱，但不幸福。",
      "en": "He's rich, but he isn't happy.",
      "source": "Tatoeba",
      "sourceId": 1672002,
      "translationId": 295484
    },
    {
      "id": "advanced-113",
      "level": "advanced",
      "zh": "他朝狗扔了一块肉。",
      "en": "He threw a piece of meat to a dog.",
      "source": "Tatoeba",
      "sourceId": 4621040,
      "translationId": 293775
    },
    {
      "id": "advanced-114",
      "level": "advanced",
      "zh": "我一直想登富士山。",
      "en": "I've always wanted to climb Mt. Fuji.",
      "source": "Tatoeba",
      "sourceId": 1438430,
      "translationId": 953872
    },
    {
      "id": "advanced-115",
      "level": "advanced",
      "zh": "他在入学考试中失败了。",
      "en": "He failed the entrance exam.",
      "source": "Tatoeba",
      "sourceId": 10275149,
      "translationId": 302286
    },
    {
      "id": "advanced-116",
      "level": "advanced",
      "zh": "我们黎明时起床以避开交通堵塞。",
      "en": "We got up at dawn to avoid a traffic jam.",
      "source": "Tatoeba",
      "sourceId": 5670800,
      "translationId": 263080
    },
    {
      "id": "advanced-117",
      "level": "advanced",
      "zh": "他告诉我他已经获得了原谅。",
      "en": "He told me that he'd been forgiven.",
      "source": "Tatoeba",
      "sourceId": 13878986,
      "translationId": 7392383
    },
    {
      "id": "advanced-118",
      "level": "advanced",
      "zh": "我纳闷我为什么不该那样做。",
      "en": "I wonder why I shouldn't do that.",
      "source": "Tatoeba",
      "sourceId": 8750761,
      "translationId": 6348680
    },
    {
      "id": "advanced-119",
      "level": "advanced",
      "zh": "宝宝在妈妈的怀里睡得很香。",
      "en": "The baby was sleeping soundly in his mother's arms.",
      "source": "Tatoeba",
      "sourceId": 1944420,
      "translationId": 894482
    },
    {
      "id": "advanced-120",
      "level": "advanced",
      "zh": "我想要一个直飞纽约的航班。",
      "en": "I'd like a nonstop flight to New York.",
      "source": "Tatoeba",
      "sourceId": 812246,
      "translationId": 35884
    },
    {
      "id": "advanced-121",
      "level": "advanced",
      "zh": "不能根据服装来判断一个人。",
      "en": "You can't judge a person based on clothing.",
      "source": "Tatoeba",
      "sourceId": 392233,
      "translationId": 1144451
    },
    {
      "id": "advanced-122",
      "level": "advanced",
      "zh": "伦敦是一个为马而建立的城市。",
      "en": "London was a city built for the horse.",
      "source": "Tatoeba",
      "sourceId": 791495,
      "translationId": 29263
    },
    {
      "id": "advanced-123",
      "level": "advanced",
      "zh": "他去了伦敦，并在那儿待了一周。",
      "en": "He went to London, where he stayed for a week.",
      "source": "Tatoeba",
      "sourceId": 782115,
      "translationId": 293383
    },
    {
      "id": "advanced-124",
      "level": "advanced",
      "zh": "梅苏特·厄齐尔是世界上最好的中场之一。",
      "en": "Mesut Ozil is one of the best midfielders in the world.",
      "source": "Tatoeba",
      "sourceId": 3579545,
      "translationId": 3579546
    },
    {
      "id": "advanced-125",
      "level": "advanced",
      "zh": "他们嫉妒我们的成功。",
      "en": "They are jealous of our success.",
      "source": "Tatoeba",
      "sourceId": 334609,
      "translationId": 306659
    },
    {
      "id": "advanced-126",
      "level": "advanced",
      "zh": "他们很明显在嫉妒他的财富和地位。",
      "en": "Obviously, they are jealous of his wealth and status.",
      "source": "Tatoeba",
      "sourceId": 3667823,
      "translationId": 322990
    },
    {
      "id": "advanced-127",
      "level": "advanced",
      "zh": "系统故障的修复工作持续了一整个晚上。",
      "en": "The repair for the system malfunction lasted for an entire night.",
      "source": "Tatoeba",
      "sourceId": 8789365,
      "translationId": 8932617
    },
    {
      "id": "advanced-128",
      "level": "advanced",
      "zh": "这个画框能让画升值。",
      "en": "This picture frame can make the picture rise in value.",
      "source": "Tatoeba",
      "sourceId": 4674470,
      "translationId": 4728082
    },
    {
      "id": "advanced-129",
      "level": "advanced",
      "zh": "他们给士兵提供了充足的食物和水。",
      "en": "They supplied the soldiers with enough food and water.",
      "source": "Tatoeba",
      "sourceId": 5655405,
      "translationId": 317717
    },
    {
      "id": "advanced-130",
      "level": "advanced",
      "zh": "大多数的昆虫有六只脚和四只翅膀。",
      "en": "Most insects have six legs and four wings.",
      "source": "Tatoeba",
      "sourceId": 10484366,
      "translationId": 10483909
    },
    {
      "id": "advanced-131",
      "level": "advanced",
      "zh": "这是非常好的土壤。",
      "en": "This is very good soil.",
      "source": "Tatoeba",
      "sourceId": 5993945,
      "translationId": 5196360
    },
    {
      "id": "advanced-132",
      "level": "advanced",
      "zh": "我可以用支票付吗？",
      "en": "May I pay by check?",
      "source": "Tatoeba",
      "sourceId": 332454,
      "translationId": 267608
    },
    {
      "id": "advanced-133",
      "level": "advanced",
      "zh": "有些食物令人口渴。",
      "en": "Some foods make you thirsty.",
      "source": "Tatoeba",
      "sourceId": 1535975,
      "translationId": 7791050
    },
    {
      "id": "advanced-134",
      "level": "advanced",
      "zh": "不要欺骗我！",
      "en": "Don't try to trick me!",
      "source": "Tatoeba",
      "sourceId": 348493,
      "translationId": 1499129
    },
    {
      "id": "advanced-135",
      "level": "advanced",
      "zh": "他的牙齿白得像珍珠一样。",
      "en": "His teeth are white like a pearl.",
      "source": "Tatoeba",
      "sourceId": 7768145,
      "translationId": 873996
    },
    {
      "id": "advanced-136",
      "level": "advanced",
      "zh": "他们永远不会取得一致意见。",
      "en": "They will never agree.",
      "source": "Tatoeba",
      "sourceId": 1148247,
      "translationId": 306428
    },
    {
      "id": "advanced-137",
      "level": "advanced",
      "zh": "我们消耗了所有的自然资源。",
      "en": "We have consumed all the natural resources.",
      "source": "Tatoeba",
      "sourceId": 813474,
      "translationId": 248040
    },
    {
      "id": "advanced-138",
      "level": "advanced",
      "zh": "你的中文已经登峰造极了。",
      "en": "Your Chinese is awesome already.",
      "source": "Tatoeba",
      "sourceId": 1519160,
      "translationId": 1526525
    },
    {
      "id": "advanced-139",
      "level": "advanced",
      "zh": "伦敦有很多公园。",
      "en": "There are many parks in London.",
      "source": "Tatoeba",
      "sourceId": 335022,
      "translationId": 1588851
    },
    {
      "id": "advanced-140",
      "level": "advanced",
      "zh": "他看见他很惊讶。",
      "en": "He was surprised to see him.",
      "source": "Tatoeba",
      "sourceId": 389407,
      "translationId": 7681637
    },
    {
      "id": "advanced-141",
      "level": "advanced",
      "zh": "我们要继续下去。",
      "en": "We'll continue.",
      "source": "Tatoeba",
      "sourceId": 7768123,
      "translationId": 2203625
    },
    {
      "id": "advanced-142",
      "level": "advanced",
      "zh": "友谊与快乐不可分。",
      "en": "Friendship and happiness can't be separated.",
      "source": "Tatoeba",
      "sourceId": 1185803,
      "translationId": 6873376
    },
    {
      "id": "advanced-143",
      "level": "advanced",
      "zh": "我忍不住取笑他的发型。",
      "en": "I could not help laughing at his haircut.",
      "source": "Tatoeba",
      "sourceId": 1407999,
      "translationId": 287336
    },
    {
      "id": "advanced-144",
      "level": "advanced",
      "zh": "张开嘴巴闭上眼睛。",
      "en": "Open your mouth and close your eyes.",
      "source": "Tatoeba",
      "sourceId": 1438441,
      "translationId": 240557
    },
    {
      "id": "advanced-145",
      "level": "advanced",
      "zh": "你的袜子上有个洞。",
      "en": "There is a hole in your sock.",
      "source": "Tatoeba",
      "sourceId": 1878281,
      "translationId": 18089
    },
    {
      "id": "advanced-146",
      "level": "advanced",
      "zh": "暴风妨碍了我们准时到达。",
      "en": "The storm prevented us from arriving on time.",
      "source": "Tatoeba",
      "sourceId": 1312402,
      "translationId": 325268
    },
    {
      "id": "advanced-147",
      "level": "advanced",
      "zh": "你咳嗽、打喷嚏或打哈欠的时候要捂住你的嘴。",
      "en": "Cover your mouth when you cough, sneeze, or yawn.",
      "source": "Tatoeba",
      "sourceId": 401028,
      "translationId": 21841
    },
    {
      "id": "advanced-148",
      "level": "advanced",
      "zh": "谁要是忽略这一点，谁就得犯错误。",
      "en": "Whoever ignores that point will make mistakes.",
      "source": "Tatoeba",
      "sourceId": 2367508,
      "translationId": 2367510
    },
    {
      "id": "advanced-149",
      "level": "advanced",
      "zh": "请你在阅读完毕后归还此书。",
      "en": "Please return the book when you have finished reading it.",
      "source": "Tatoeba",
      "sourceId": 9952204,
      "translationId": 43871
    },
    {
      "id": "advanced-150",
      "level": "advanced",
      "zh": "他太年轻，无法胜任这项工作。",
      "en": "He is too young to undertake this work.",
      "source": "Tatoeba",
      "sourceId": 4789611,
      "translationId": 4844643
    },
    {
      "id": "advanced-151",
      "level": "advanced",
      "zh": "俄罗斯去年发射了一个卫星。",
      "en": "A satellite was launched in Russia last year.",
      "source": "Tatoeba",
      "sourceId": 1214437,
      "translationId": 1214438
    },
    {
      "id": "advanced-152",
      "level": "advanced",
      "zh": "她对绘画有很好的鉴赏力。",
      "en": "She's got a good eye for paintings.",
      "source": "Tatoeba",
      "sourceId": 8621094,
      "translationId": 312965
    },
    {
      "id": "advanced-153",
      "level": "advanced",
      "zh": "他告诉过我他会去威尼斯。",
      "en": "He told me he would go to Venice.",
      "source": "Tatoeba",
      "sourceId": 1778255,
      "translationId": 2450
    },
    {
      "id": "advanced-154",
      "level": "advanced",
      "zh": "我的怀疑没有根据。",
      "en": "My suspicions were unfounded.",
      "source": "Tatoeba",
      "sourceId": 8534770,
      "translationId": 8534768
    },
    {
      "id": "advanced-155",
      "level": "advanced",
      "zh": "电脑让人变愚蠢了。",
      "en": "Computers make people stupid.",
      "source": "Tatoeba",
      "sourceId": 501710,
      "translationId": 1738
    },
    {
      "id": "advanced-156",
      "level": "advanced",
      "zh": "消防车到达之前，房子就全烧了。",
      "en": "The house burned to the ground before the fire truck arrived.",
      "source": "Tatoeba",
      "sourceId": 332896,
      "translationId": 4753818
    },
    {
      "id": "advanced-157",
      "level": "advanced",
      "zh": "我尽量不去想它。",
      "en": "I just try not to think about it.",
      "source": "Tatoeba",
      "sourceId": 5812675,
      "translationId": 5812148
    },
    {
      "id": "advanced-158",
      "level": "advanced",
      "zh": "她一直哭哭啼啼。",
      "en": "She did nothing but cry all the while.",
      "source": "Tatoeba",
      "sourceId": 907929,
      "translationId": 48864
    },
    {
      "id": "advanced-159",
      "level": "advanced",
      "zh": "店前排起了长龙。",
      "en": "A long queue had formed in front of the shop.",
      "source": "Tatoeba",
      "sourceId": 2487756,
      "translationId": 2484871
    },
    {
      "id": "advanced-160",
      "level": "advanced",
      "zh": "他比我高三英寸。",
      "en": "He's three inches taller than I am.",
      "source": "Tatoeba",
      "sourceId": 875323,
      "translationId": 287533
    },
    {
      "id": "advanced-161",
      "level": "advanced",
      "zh": "他比珍妮大两岁。",
      "en": "He is older than Jane by two years.",
      "source": "Tatoeba",
      "sourceId": 799249,
      "translationId": 290062
    },
    {
      "id": "advanced-162",
      "level": "advanced",
      "zh": "我无法判断他的话是真是假。",
      "en": "I've no way of telling whether or not what he says is true.",
      "source": "Tatoeba",
      "sourceId": 792598,
      "translationId": 792599
    },
    {
      "id": "advanced-163",
      "level": "advanced",
      "zh": "中国有日益壮大的中产阶层。",
      "en": "China has a growing middle class.",
      "source": "Tatoeba",
      "sourceId": 10194197,
      "translationId": 6457897
    },
    {
      "id": "advanced-164",
      "level": "advanced",
      "zh": "她为我们煮了一顿美味的晚餐。",
      "en": "She cooked us a delicious dinner.",
      "source": "Tatoeba",
      "sourceId": 1361957,
      "translationId": 314070
    },
    {
      "id": "advanced-165",
      "level": "advanced",
      "zh": "奥运会最重要的不是获胜，而是参与。",
      "en": "The most important thing in the Olympic Games is not winning but taking part.",
      "source": "Tatoeba",
      "sourceId": 334990,
      "translationId": 64807
    },
    {
      "id": "advanced-166",
      "level": "advanced",
      "zh": "自古至今，容忍的总是老百姓，被容忍的总是统治者。",
      "en": "Since ancient times, it has always been the commoners who tolerate their ruler.",
      "source": "Tatoeba",
      "sourceId": 3130844,
      "translationId": 9408534
    },
    {
      "id": "advanced-167",
      "level": "advanced",
      "zh": "为什么你要对你没做过的事表示抱歉？",
      "en": "Why say sorry for something you haven't even done?",
      "source": "Tatoeba",
      "sourceId": 334920,
      "translationId": 416893
    },
    {
      "id": "advanced-168",
      "level": "advanced",
      "zh": "这让我感到沮丧。",
      "en": "It makes me feel sad.",
      "source": "Tatoeba",
      "sourceId": 5637375,
      "translationId": 3447020
    },
    {
      "id": "advanced-169",
      "level": "advanced",
      "zh": "正的声音很温柔。",
      "en": "Tadashi has a soft voice.",
      "source": "Tatoeba",
      "sourceId": 8936645,
      "translationId": 271589
    },
    {
      "id": "advanced-170",
      "level": "advanced",
      "zh": "公司取消了会议。",
      "en": "The company cancelled the meeting.",
      "source": "Tatoeba",
      "sourceId": 5595120,
      "translationId": 680468
    },
    {
      "id": "advanced-171",
      "level": "advanced",
      "zh": "没有人投反对票。",
      "en": "No one voted against it.",
      "source": "Tatoeba",
      "sourceId": 2000401,
      "translationId": 804297
    },
    {
      "id": "advanced-172",
      "level": "advanced",
      "zh": "诚信是一种重要的美德。",
      "en": "Honesty is a capital virtue.",
      "source": "Tatoeba",
      "sourceId": 332612,
      "translationId": 271678
    },
    {
      "id": "advanced-173",
      "level": "advanced",
      "zh": "雅尼的生日是4月4日。",
      "en": "Yanni's birthday is April 4th.",
      "source": "Tatoeba",
      "sourceId": 13575558,
      "translationId": 9821452
    },
    {
      "id": "advanced-174",
      "level": "advanced",
      "zh": "他没有进步的迹象。",
      "en": "He shows no mark of progress.",
      "source": "Tatoeba",
      "sourceId": 346805,
      "translationId": 299590
    },
    {
      "id": "advanced-175",
      "level": "advanced",
      "zh": "我喜欢吃烤羊肉串。",
      "en": "I like to eat lamb kebabs.",
      "source": "Tatoeba",
      "sourceId": 2109940,
      "translationId": 2166229
    },
    {
      "id": "advanced-176",
      "level": "advanced",
      "zh": "他喜欢看科幻小说。",
      "en": "He likes reading science fiction novels.",
      "source": "Tatoeba",
      "sourceId": 10184303,
      "translationId": 10188028
    },
    {
      "id": "advanced-177",
      "level": "advanced",
      "zh": "医生也许这么说过。",
      "en": "The doctor may have said so.",
      "source": "Tatoeba",
      "sourceId": 6822731,
      "translationId": 28010
    },
    {
      "id": "advanced-178",
      "level": "advanced",
      "zh": "我的老婆孩子都依靠我。",
      "en": "My wife and children depend on me.",
      "source": "Tatoeba",
      "sourceId": 10260760,
      "translationId": 244113
    },
    {
      "id": "advanced-179",
      "level": "advanced",
      "zh": "他这么做，没有任何不安。",
      "en": "He had no qualms in doing so.",
      "source": "Tatoeba",
      "sourceId": 7768152,
      "translationId": 290407
    },
    {
      "id": "advanced-180",
      "level": "advanced",
      "zh": "这个男孩把收音机折散架了。",
      "en": "The boy took the radio apart.",
      "source": "Tatoeba",
      "sourceId": 1235245,
      "translationId": 45409
    },
    {
      "id": "advanced-181",
      "level": "advanced",
      "zh": "你最喜欢的编程语言是什么？",
      "en": "What's your favorite programming language?",
      "source": "Tatoeba",
      "sourceId": 8928666,
      "translationId": 906967
    },
    {
      "id": "advanced-182",
      "level": "advanced",
      "zh": "观察鸟类是个很好的业余爱好。",
      "en": "Bird watching is a nice hobby.",
      "source": "Tatoeba",
      "sourceId": 333590,
      "translationId": 324134
    },
    {
      "id": "advanced-183",
      "level": "advanced",
      "zh": "我听说你弹钢琴。",
      "en": "I hear that you play the piano.",
      "source": "Tatoeba",
      "sourceId": 1358716,
      "translationId": 69786
    },
    {
      "id": "advanced-184",
      "level": "advanced",
      "zh": "他有权得到奖励。",
      "en": "He is entitled to receive the reward.",
      "source": "Tatoeba",
      "sourceId": 9959101,
      "translationId": 291268
    },
    {
      "id": "advanced-185",
      "level": "advanced",
      "zh": "复制/粘贴是很有用的。",
      "en": "Copy-and-paste is very useful.",
      "source": "Tatoeba",
      "sourceId": 619799,
      "translationId": 442534
    },
    {
      "id": "advanced-186",
      "level": "advanced",
      "zh": "魔术师吸引了孩子们的注意。",
      "en": "The magician had the children's attention.",
      "source": "Tatoeba",
      "sourceId": 334604,
      "translationId": 20645
    },
    {
      "id": "advanced-187",
      "level": "advanced",
      "zh": "凭着节俭，她设法以自己微薄的薪水生活。",
      "en": "By frugality she managed to get along on her small salary.",
      "source": "Tatoeba",
      "sourceId": 3534643,
      "translationId": 3534644
    },
    {
      "id": "advanced-188",
      "level": "advanced",
      "zh": "钥匙在桌子上。",
      "en": "The key is on the table.",
      "source": "Tatoeba",
      "sourceId": 349271,
      "translationId": 732315
    },
    {
      "id": "advanced-189",
      "level": "advanced",
      "zh": "不要翻越铁轨！",
      "en": "Don't walk across the tracks!",
      "source": "Tatoeba",
      "sourceId": 10649041,
      "translationId": 12137541
    },
    {
      "id": "advanced-190",
      "level": "advanced",
      "zh": "我不知道如何传真。",
      "en": "I don't know how to send a fax.",
      "source": "Tatoeba",
      "sourceId": 3565127,
      "translationId": 12259796
    },
    {
      "id": "advanced-191",
      "level": "advanced",
      "zh": "他们可以克服恐惧。",
      "en": "They can overcome their fear.",
      "source": "Tatoeba",
      "sourceId": 334641,
      "translationId": 2581635
    },
    {
      "id": "advanced-192",
      "level": "advanced",
      "zh": "啄木鸟正在使劲地啄树干。",
      "en": "The woodpecker is pecking the tree trunk vigorously.",
      "source": "Tatoeba",
      "sourceId": 8744807,
      "translationId": 8743001
    },
    {
      "id": "advanced-193",
      "level": "advanced",
      "zh": "看到巴亚微笑，曼纳德非常高兴。",
      "en": "Mennad was so glad to see Baya smile.",
      "source": "Tatoeba",
      "sourceId": 8750724,
      "translationId": 8012873
    },
    {
      "id": "advanced-194",
      "level": "advanced",
      "zh": "私家侦探们受雇调查这桩奇怪的案件。",
      "en": "Private detectives were hired to look into the strange case.",
      "source": "Tatoeba",
      "sourceId": 1883480,
      "translationId": 263337
    },
    {
      "id": "advanced-195",
      "level": "advanced",
      "zh": "这只企鹅宝宝太可爱了！",
      "en": "This baby penguin is too cute!",
      "source": "Tatoeba",
      "sourceId": 502796,
      "translationId": 1848
    },
    {
      "id": "advanced-196",
      "level": "advanced",
      "zh": "他们继续走。",
      "en": "They kept on walking.",
      "source": "Tatoeba",
      "sourceId": 1397033,
      "translationId": 305960
    },
    {
      "id": "advanced-197",
      "level": "advanced",
      "zh": "他们会嫉妒。",
      "en": "They'll be jealous.",
      "source": "Tatoeba",
      "sourceId": 5670765,
      "translationId": 2994210
    },
    {
      "id": "advanced-198",
      "level": "advanced",
      "zh": "很显然我们是豆荚里的俩颗豆子。",
      "en": "Apparently we're just two peas in a pod.",
      "source": "Tatoeba",
      "sourceId": 2453109,
      "translationId": 2453106
    },
    {
      "id": "advanced-199",
      "level": "advanced",
      "zh": "你需要赔偿他损失的钱。",
      "en": "You must compensate him for the money he lost.",
      "source": "Tatoeba",
      "sourceId": 10342272,
      "translationId": 15828
    },
    {
      "id": "advanced-200",
      "level": "advanced",
      "zh": "用纸巾把那口锅擦干。",
      "en": "Wipe the pan dry with a paper towel.",
      "source": "Tatoeba",
      "sourceId": 8574653,
      "translationId": 8574335
    },
    {
      "id": "advanced-201",
      "level": "advanced",
      "zh": "她笑眯眯的对我招手。",
      "en": "She waved her hand to me, smiling brightly.",
      "source": "Tatoeba",
      "sourceId": 10871952,
      "translationId": 323009
    },
    {
      "id": "advanced-202",
      "level": "advanced",
      "zh": "我想要出席派对。",
      "en": "I'd like to attend the party.",
      "source": "Tatoeba",
      "sourceId": 782835,
      "translationId": 516475
    },
    {
      "id": "advanced-203",
      "level": "advanced",
      "zh": "语言会与时俱进。",
      "en": "Language keeps in step with the times.",
      "source": "Tatoeba",
      "sourceId": 9496198,
      "translationId": 239734
    },
    {
      "id": "advanced-204",
      "level": "advanced",
      "zh": "即使他道歉了，我还是很愤怒。",
      "en": "Even though he apologized, I'm still furious.",
      "source": "Tatoeba",
      "sourceId": 454663,
      "translationId": 1399
    },
    {
      "id": "advanced-205",
      "level": "advanced",
      "zh": "例如，中国的公共交通毫不怀疑比英国的好，但英国的公益事业可能比中国的好。",
      "en": "For example, China's public transport is without a doubt better than the UK's, but the UK's public welfare may be better than China's.",
      "source": "Tatoeba",
      "sourceId": 905849,
      "translationId": 905850
    },
    {
      "id": "advanced-206",
      "level": "advanced",
      "zh": "你的钥匙在哪儿？",
      "en": "Where are your keys?",
      "source": "Tatoeba",
      "sourceId": 2220948,
      "translationId": 1229116
    },
    {
      "id": "advanced-207",
      "level": "advanced",
      "zh": "我们去了波士顿。",
      "en": "We went to Boston.",
      "source": "Tatoeba",
      "sourceId": 10540452,
      "translationId": 2739060
    },
    {
      "id": "advanced-208",
      "level": "advanced",
      "zh": "这个理论很有争议。",
      "en": "This theory is very controversial.",
      "source": "Tatoeba",
      "sourceId": 5568458,
      "translationId": 5568135
    },
    {
      "id": "advanced-209",
      "level": "advanced",
      "zh": "你为什么这么害怕？",
      "en": "Why were you so scared?",
      "source": "Tatoeba",
      "sourceId": 5650409,
      "translationId": 4501940
    },
    {
      "id": "advanced-210",
      "level": "advanced",
      "zh": "你可以寄希望于此。",
      "en": "You can bank on that.",
      "source": "Tatoeba",
      "sourceId": 844549,
      "translationId": 16542
    },
    {
      "id": "advanced-211",
      "level": "advanced",
      "zh": "我跟不上你的逻辑。",
      "en": "I cannot follow your logic.",
      "source": "Tatoeba",
      "sourceId": 4760161,
      "translationId": 257124
    },
    {
      "id": "advanced-212",
      "level": "advanced",
      "zh": "地球的外形和橙子相似。",
      "en": "The earth is similar to an orange in shape.",
      "source": "Tatoeba",
      "sourceId": 334742,
      "translationId": 277103
    },
    {
      "id": "advanced-213",
      "level": "advanced",
      "zh": "你知道这部漫画吗？",
      "en": "Do you know this cartoon?",
      "source": "Tatoeba",
      "sourceId": 10538257,
      "translationId": 2462807
    },
    {
      "id": "advanced-214",
      "level": "advanced",
      "zh": "你能辨别小麦和大麦吗？",
      "en": "Can you tell wheat from barley?",
      "source": "Tatoeba",
      "sourceId": 1785939,
      "translationId": 15911
    },
    {
      "id": "advanced-215",
      "level": "advanced",
      "zh": "把你的肩膀借给我让我依靠。",
      "en": "Lend me your shoulder for me to lean on.",
      "source": "Tatoeba",
      "sourceId": 733113,
      "translationId": 13803768
    },
    {
      "id": "advanced-216",
      "level": "advanced",
      "zh": "他们彼此不信任。",
      "en": "They didn't trust each other.",
      "source": "Tatoeba",
      "sourceId": 13749728,
      "translationId": 8403882
    },
    {
      "id": "advanced-217",
      "level": "advanced",
      "zh": "天不怕，地不怕，就怕温州人说温州话。",
      "en": "Do not fear the heavens and the earth, but be afraid of hearing a person from Wenzhou speak in their local tongue.",
      "source": "Tatoeba",
      "sourceId": 702262,
      "translationId": 702591
    },
    {
      "id": "advanced-218",
      "level": "advanced",
      "zh": "你应该去上婴儿心肺复苏课程。",
      "en": "You should really take an infant CPR class.",
      "source": "Tatoeba",
      "sourceId": 8741556,
      "translationId": 6583382
    },
    {
      "id": "advanced-219",
      "level": "advanced",
      "zh": "那就是我不赞同你的计划的原因。",
      "en": "That's why I don't approve of your plan.",
      "source": "Tatoeba",
      "sourceId": 1577314,
      "translationId": 1577319
    },
    {
      "id": "advanced-220",
      "level": "advanced",
      "zh": "那部电影有看的价值。",
      "en": "That movie is worth seeing.",
      "source": "Tatoeba",
      "sourceId": 2029444,
      "translationId": 68571
    },
    {
      "id": "advanced-221",
      "level": "advanced",
      "zh": "她用玫瑰花装饰了她的房间。",
      "en": "She decorated her room with roses.",
      "source": "Tatoeba",
      "sourceId": 784578,
      "translationId": 314726
    },
    {
      "id": "advanced-222",
      "level": "advanced",
      "zh": "连超级英雄们也该偶尔休息一下。",
      "en": "Even superheroes need an occasional break.",
      "source": "Tatoeba",
      "sourceId": 408569,
      "translationId": 408566
    },
    {
      "id": "advanced-223",
      "level": "advanced",
      "zh": "这是免费报纸。",
      "en": "This is a free newspaper.",
      "source": "Tatoeba",
      "sourceId": 348606,
      "translationId": 387707
    },
    {
      "id": "advanced-224",
      "level": "advanced",
      "zh": "不要这么恶心。",
      "en": "Don't be so disgusting.",
      "source": "Tatoeba",
      "sourceId": 4757661,
      "translationId": 4757704
    },
    {
      "id": "advanced-225",
      "level": "advanced",
      "zh": "我们不是纯素食的。",
      "en": "We aren't vegan.",
      "source": "Tatoeba",
      "sourceId": 10342303,
      "translationId": 9211107
    },
    {
      "id": "advanced-226",
      "level": "advanced",
      "zh": "他在艺术世家长大。",
      "en": "He was raised in an artistic family.",
      "source": "Tatoeba",
      "sourceId": 366882,
      "translationId": 295769
    },
    {
      "id": "advanced-227",
      "level": "advanced",
      "zh": "你应该提前付租金。",
      "en": "You should pay your rent in advance.",
      "source": "Tatoeba",
      "sourceId": 1780763,
      "translationId": 9581
    },
    {
      "id": "advanced-228",
      "level": "advanced",
      "zh": "绷带把伤口包扎住了。",
      "en": "The bandage was wound around the wound.",
      "source": "Tatoeba",
      "sourceId": 2177507,
      "translationId": 710612
    },
    {
      "id": "advanced-229",
      "level": "advanced",
      "zh": "他需要和她亲自谈谈。",
      "en": "He needs to talk to her himself.",
      "source": "Tatoeba",
      "sourceId": 8746394,
      "translationId": 8536892
    },
    {
      "id": "advanced-230",
      "level": "advanced",
      "zh": "谢谢你烤的美味蛋糕。",
      "en": "Thank you for baking this delicious cake.",
      "source": "Tatoeba",
      "sourceId": 1990260,
      "translationId": 1716451
    },
    {
      "id": "advanced-231",
      "level": "advanced",
      "zh": "悉尼是澳洲最大的城市。",
      "en": "Sydney is the largest city in Australia.",
      "source": "Tatoeba",
      "sourceId": 799737,
      "translationId": 53449
    },
    {
      "id": "advanced-232",
      "level": "advanced",
      "zh": "她一看到蜘蛛就尖叫。",
      "en": "She shrieked whenever she saw a spider.",
      "source": "Tatoeba",
      "sourceId": 435236,
      "translationId": 310748
    },
    {
      "id": "advanced-233",
      "level": "advanced",
      "zh": "夏威夷是一个大众化旅游圣地。",
      "en": "Hawaii is a popular tourist resort.",
      "source": "Tatoeba",
      "sourceId": 770859,
      "translationId": 34964
    },
    {
      "id": "advanced-234",
      "level": "advanced",
      "zh": "我父亲五十岁了。",
      "en": "My father is fifty years old.",
      "source": "Tatoeba",
      "sourceId": 517002,
      "translationId": 251625
    },
    {
      "id": "advanced-235",
      "level": "advanced",
      "zh": "这种尝试很荒谬。",
      "en": "It's nonsense to try that.",
      "source": "Tatoeba",
      "sourceId": 335012,
      "translationId": 41627
    },
    {
      "id": "advanced-236",
      "level": "advanced",
      "zh": "她住在他的隔壁。",
      "en": "She lives next door to him.",
      "source": "Tatoeba",
      "sourceId": 457755,
      "translationId": 316456
    },
    {
      "id": "advanced-237",
      "level": "advanced",
      "zh": "他们在互相交谈。",
      "en": "They are talking with each other.",
      "source": "Tatoeba",
      "sourceId": 510866,
      "translationId": 306500
    },
    {
      "id": "advanced-238",
      "level": "advanced",
      "zh": "你应该留在澳洲。",
      "en": "You should've stayed in Australia.",
      "source": "Tatoeba",
      "sourceId": 9415235,
      "translationId": 7149927
    },
    {
      "id": "advanced-239",
      "level": "advanced",
      "zh": "那音乐烦死他了。",
      "en": "That music gets on his nerves.",
      "source": "Tatoeba",
      "sourceId": 9462616,
      "translationId": 68554
    },
    {
      "id": "advanced-240",
      "level": "advanced",
      "zh": "他每天早晨溜狗。",
      "en": "He walks his dog every morning.",
      "source": "Tatoeba",
      "sourceId": 848429,
      "translationId": 303874
    },
    {
      "id": "advanced-241",
      "level": "advanced",
      "zh": "银行对风险客户收取较高的贷款利息。",
      "en": "Banks charge higher interest on loans to risky customers.",
      "source": "Tatoeba",
      "sourceId": 332651,
      "translationId": 18430
    },
    {
      "id": "advanced-242",
      "level": "advanced",
      "zh": "她父亲把一生都贡献给科学事业了。",
      "en": "Her father dedicated his life to science.",
      "source": "Tatoeba",
      "sourceId": 343777,
      "translationId": 1275373
    },
    {
      "id": "advanced-243",
      "level": "advanced",
      "zh": "在新加坡的街道上扔垃圾会被罚款。",
      "en": "They fine you in Singapore if you throw trash in the streets.",
      "source": "Tatoeba",
      "sourceId": 5576760,
      "translationId": 52475
    },
    {
      "id": "advanced-244",
      "level": "advanced",
      "zh": "其他人不那么乐观。",
      "en": "Others are less optimistic.",
      "source": "Tatoeba",
      "sourceId": 5945159,
      "translationId": 5738032
    },
    {
      "id": "advanced-245",
      "level": "advanced",
      "zh": "为什么他要这么对待你？",
      "en": "Why did he treat you like that?",
      "source": "Tatoeba",
      "sourceId": 9989865,
      "translationId": 10372265
    },
    {
      "id": "advanced-246",
      "level": "advanced",
      "zh": "我送了个长鼓给我父亲。",
      "en": "I sent this drum to my father.",
      "source": "Tatoeba",
      "sourceId": 804808,
      "translationId": 1159723
    },
    {
      "id": "advanced-247",
      "level": "advanced",
      "zh": "我哥住在一座小村庄里。",
      "en": "My brother lives in a small village.",
      "source": "Tatoeba",
      "sourceId": 10252141,
      "translationId": 250687
    },
    {
      "id": "advanced-248",
      "level": "advanced",
      "zh": "祝你一天过得愉快。",
      "en": "Have a nice day.",
      "source": "Tatoeba",
      "sourceId": 336675,
      "translationId": 30085
    },
    {
      "id": "advanced-249",
      "level": "advanced",
      "zh": "昨夜我们拜访了他。",
      "en": "We called on him last night.",
      "source": "Tatoeba",
      "sourceId": 1737962,
      "translationId": 263045
    },
    {
      "id": "advanced-250",
      "level": "advanced",
      "zh": "我对她有很深刻的印象。",
      "en": "I find her very impressive.",
      "source": "Tatoeba",
      "sourceId": 801982,
      "translationId": 801985
    },
    {
      "id": "advanced-251",
      "level": "advanced",
      "zh": "我难以用言语表达我的感情。",
      "en": "I find it hard to express my feelings in words.",
      "source": "Tatoeba",
      "sourceId": 332491,
      "translationId": 4350791
    },
    {
      "id": "advanced-252",
      "level": "advanced",
      "zh": "他割掉了树上的几根树枝。",
      "en": "He cut some branches off the tree.",
      "source": "Tatoeba",
      "sourceId": 839194,
      "translationId": 304161
    },
    {
      "id": "advanced-253",
      "level": "advanced",
      "zh": "什么是您最大的灵感来源？",
      "en": "What is your greatest source of inspiration?",
      "source": "Tatoeba",
      "sourceId": 502798,
      "translationId": 1852
    },
    {
      "id": "advanced-254",
      "level": "advanced",
      "zh": "由于天气恶劣，飞机延误了。",
      "en": "The plane was late because of bad weather.",
      "source": "Tatoeba",
      "sourceId": 381119,
      "translationId": 1332074
    },
    {
      "id": "advanced-255",
      "level": "advanced",
      "zh": "我的手机充电器掉了。",
      "en": "My smartphone charger fell.",
      "source": "Tatoeba",
      "sourceId": 6183604,
      "translationId": 7758466
    },
    {
      "id": "advanced-256",
      "level": "advanced",
      "zh": "小甜甜布莱尼在哪里？",
      "en": "Where is Britney Spears?",
      "source": "Tatoeba",
      "sourceId": 8928631,
      "translationId": 472106
    },
    {
      "id": "advanced-257",
      "level": "advanced",
      "zh": "他很难掩饰对自己成功的骄傲。",
      "en": "It was difficult for him to hide his pride in his success.",
      "source": "Tatoeba",
      "sourceId": 463878,
      "translationId": 284627
    },
    {
      "id": "advanced-258",
      "level": "advanced",
      "zh": "你父亲在哪儿？",
      "en": "Where is your father?",
      "source": "Tatoeba",
      "sourceId": 349910,
      "translationId": 467672
    },
    {
      "id": "advanced-259",
      "level": "advanced",
      "zh": "安德森也很怕狗的。",
      "en": "Andersen was afraid of dogs, too.",
      "source": "Tatoeba",
      "sourceId": 421830,
      "translationId": 66953
    },
    {
      "id": "advanced-260",
      "level": "advanced",
      "zh": "和东京比，伦敦很小。",
      "en": "London is small compared to Tokyo.",
      "source": "Tatoeba",
      "sourceId": 784409,
      "translationId": 4581845
    },
    {
      "id": "advanced-261",
      "level": "advanced",
      "zh": "你凭什么叫我走？",
      "en": "Who are you to tell me to get out?",
      "source": "Tatoeba",
      "sourceId": 334808,
      "translationId": 24848
    },
    {
      "id": "advanced-262",
      "level": "advanced",
      "zh": "身份证你带来吗？",
      "en": "Have you brought your ID card with you?",
      "source": "Tatoeba",
      "sourceId": 420564,
      "translationId": 474600
    },
    {
      "id": "advanced-263",
      "level": "advanced",
      "zh": "海洋不是将世界分隔开来，而是将世界连接起来。",
      "en": "Oceans do not so much divide the world as unite it.",
      "source": "Tatoeba",
      "sourceId": 345396,
      "translationId": 22222
    },
    {
      "id": "advanced-264",
      "level": "advanced",
      "zh": "日本人是勤奋的国民。",
      "en": "The Japanese are an industrious people.",
      "source": "Tatoeba",
      "sourceId": 344833,
      "translationId": 281739
    },
    {
      "id": "advanced-265",
      "level": "advanced",
      "zh": "滑冰是我的嗜好之一。",
      "en": "Skating is one of my hobbies.",
      "source": "Tatoeba",
      "sourceId": 797082,
      "translationId": 52036
    },
    {
      "id": "advanced-266",
      "level": "advanced",
      "zh": "您为什么指责我儿子？",
      "en": "Why are you accusing my son?",
      "source": "Tatoeba",
      "sourceId": 471328,
      "translationId": 2796665
    },
    {
      "id": "advanced-267",
      "level": "advanced",
      "zh": "请你告诉我详细地址。",
      "en": "Please give me the exact address.",
      "source": "Tatoeba",
      "sourceId": 420642,
      "translationId": 2163017
    },
    {
      "id": "advanced-268",
      "level": "advanced",
      "zh": "我曾经在波士顿上学。",
      "en": "I went to school in Boston.",
      "source": "Tatoeba",
      "sourceId": 6938002,
      "translationId": 5154783
    },
    {
      "id": "advanced-269",
      "level": "advanced",
      "zh": "房子被火吞噬了。",
      "en": "The house was in flames.",
      "source": "Tatoeba",
      "sourceId": 8924801,
      "translationId": 24147
    },
    {
      "id": "advanced-270",
      "level": "advanced",
      "zh": "她不在，我很孤独。",
      "en": "I was lonely without her.",
      "source": "Tatoeba",
      "sourceId": 375290,
      "translationId": 310510
    },
    {
      "id": "advanced-271",
      "level": "advanced",
      "zh": "你的父母有多高？",
      "en": "How tall are your parents?",
      "source": "Tatoeba",
      "sourceId": 5918306,
      "translationId": 4013859
    },
    {
      "id": "advanced-272",
      "level": "advanced",
      "zh": "您必须预先付钱。",
      "en": "You must pay in advance.",
      "source": "Tatoeba",
      "sourceId": 787172,
      "translationId": 273598
    },
    {
      "id": "advanced-273",
      "level": "advanced",
      "zh": "我有一点困惑了。",
      "en": "I'm a little confused.",
      "source": "Tatoeba",
      "sourceId": 2440675,
      "translationId": 1549729
    },
    {
      "id": "advanced-274",
      "level": "advanced",
      "zh": "明明签订了互不侵犯条约，竟然还来攻击我们。",
      "en": "They still attacked us, despite clearly agreeing to sign the non-aggression pact.",
      "source": "Tatoeba",
      "sourceId": 1501684,
      "translationId": 1539022
    },
    {
      "id": "advanced-275",
      "level": "advanced",
      "zh": "他确实很穷，但是他很幸福。",
      "en": "He is poor, to be sure, but he is happy.",
      "source": "Tatoeba",
      "sourceId": 512448,
      "translationId": 36227
    },
    {
      "id": "advanced-276",
      "level": "advanced",
      "zh": "耶路撒冷是犹太人的圣城。",
      "en": "Jerusalem is the Holy City of the Jews.",
      "source": "Tatoeba",
      "sourceId": 9961273,
      "translationId": 2744035
    },
    {
      "id": "advanced-277",
      "level": "advanced",
      "zh": "我会说一点儿苏格兰盖尔语。",
      "en": "I speak a little Scottish Gaelic.",
      "source": "Tatoeba",
      "sourceId": 857233,
      "translationId": 847770
    },
    {
      "id": "advanced-278",
      "level": "advanced",
      "zh": "宿舍里的暖气系统出毛病了。",
      "en": "Our dorm's heating system isn't working properly.",
      "source": "Tatoeba",
      "sourceId": 1300385,
      "translationId": 1300205
    },
    {
      "id": "advanced-279",
      "level": "advanced",
      "zh": "他把信撕成碎片，扔出了窗外。",
      "en": "He tore up his letter into small bits and threw them out the window.",
      "source": "Tatoeba",
      "sourceId": 373192,
      "translationId": 299234
    },
    {
      "id": "advanced-280",
      "level": "advanced",
      "zh": "这家工厂每周能够生产250台车。",
      "en": "This factory's productive capacity is 250 cars a week.",
      "source": "Tatoeba",
      "sourceId": 1889312,
      "translationId": 59308
    },
    {
      "id": "advanced-281",
      "level": "advanced",
      "zh": "由于科学技术的进步，人类现在很富裕。",
      "en": "Humanity is now affluent due to progression in science and technology.",
      "source": "Tatoeba",
      "sourceId": 12615466,
      "translationId": 12615447
    },
    {
      "id": "advanced-282",
      "level": "advanced",
      "zh": "这辆车很省油。",
      "en": "This car is very economical on gas.",
      "source": "Tatoeba",
      "sourceId": 791419,
      "translationId": 58738
    },
    {
      "id": "advanced-283",
      "level": "advanced",
      "zh": "趁热喝你的汤。",
      "en": "Eat your soup while it is hot.",
      "source": "Tatoeba",
      "sourceId": 334689,
      "translationId": 52330
    },
    {
      "id": "advanced-284",
      "level": "advanced",
      "zh": "祝您一路顺风。",
      "en": "I hope you have a good trip.",
      "source": "Tatoeba",
      "sourceId": 435214,
      "translationId": 435205
    },
    {
      "id": "advanced-285",
      "level": "advanced",
      "zh": "现代版旗袍因能突显女人的身材而闻名。",
      "en": "The modernized version of the qipao is noted for accentuating the female figure.",
      "source": "Tatoeba",
      "sourceId": 728056,
      "translationId": 728054
    },
    {
      "id": "advanced-286",
      "level": "advanced",
      "zh": "我不想考雅思和托福。",
      "en": "I don't want to take the IELTS or the TOEFL.",
      "source": "Tatoeba",
      "sourceId": 1759589,
      "translationId": 10259097
    },
    {
      "id": "advanced-287",
      "level": "advanced",
      "zh": "多么糟糕的天气啊！",
      "en": "What horrible weather.",
      "source": "Tatoeba",
      "sourceId": 8727951,
      "translationId": 430442
    },
    {
      "id": "advanced-288",
      "level": "advanced",
      "zh": "希腊是美丽的国家。",
      "en": "Greece is a beautiful country.",
      "source": "Tatoeba",
      "sourceId": 2521478,
      "translationId": 6157216
    },
    {
      "id": "advanced-289",
      "level": "advanced",
      "zh": "人有德行，如水之清。",
      "en": "A person has morals like water is clear.",
      "source": "Tatoeba",
      "sourceId": 1703783,
      "translationId": 5933113
    },
    {
      "id": "advanced-290",
      "level": "advanced",
      "zh": "人们需要止住仇恨。",
      "en": "People need to stop hating.",
      "source": "Tatoeba",
      "sourceId": 5883315,
      "translationId": 4949946
    },
    {
      "id": "advanced-291",
      "level": "advanced",
      "zh": "第一次攻击错过了目标。",
      "en": "The first attack missed the target.",
      "source": "Tatoeba",
      "sourceId": 335859,
      "translationId": 244025
    },
    {
      "id": "advanced-292",
      "level": "advanced",
      "zh": "我们总要遵守法律。",
      "en": "We should always obey laws.",
      "source": "Tatoeba",
      "sourceId": 1438614,
      "translationId": 1075502
    },
    {
      "id": "advanced-293",
      "level": "advanced",
      "zh": "我不会表现出恐惧。",
      "en": "I'm not going to show any fear.",
      "source": "Tatoeba",
      "sourceId": 5933783,
      "translationId": 5659246
    },
    {
      "id": "advanced-294",
      "level": "advanced",
      "zh": "严格地讲，番茄是水果。",
      "en": "Strictly speaking, the tomato is a fruit.",
      "source": "Tatoeba",
      "sourceId": 358981,
      "translationId": 387579
    },
    {
      "id": "advanced-295",
      "level": "advanced",
      "zh": "他们俩彼此心照不宣。",
      "en": "They have a secret understanding between them.",
      "source": "Tatoeba",
      "sourceId": 3552515,
      "translationId": 3622292
    },
    {
      "id": "advanced-296",
      "level": "advanced",
      "zh": "我可以吸烟吗？",
      "en": "May I smoke?",
      "source": "Tatoeba",
      "sourceId": 11508790,
      "translationId": 456367
    },
    {
      "id": "advanced-297",
      "level": "advanced",
      "zh": "我匆忙的吃了午餐。",
      "en": "I ate a hasty lunch.",
      "source": "Tatoeba",
      "sourceId": 866298,
      "translationId": 256851
    },
    {
      "id": "advanced-298",
      "level": "advanced",
      "zh": "这是一朵美丽的花。",
      "en": "This is a beautiful flower.",
      "source": "Tatoeba",
      "sourceId": 1358621,
      "translationId": 55417
    },
    {
      "id": "advanced-299",
      "level": "advanced",
      "zh": "妈妈叫我修剪草坪。",
      "en": "Mother told me to mow the lawn.",
      "source": "Tatoeba",
      "sourceId": 451829,
      "translationId": 320748
    },
    {
      "id": "advanced-300",
      "level": "advanced",
      "zh": "这首曲子是大调。",
      "en": "This piece is in a major key.",
      "source": "Tatoeba",
      "sourceId": 8786454,
      "translationId": 2763430
    },
    {
      "id": "advanced-301",
      "level": "advanced",
      "zh": "齐里和丽玛走上前来。",
      "en": "Ziri and Rima came up.",
      "source": "Tatoeba",
      "sourceId": 13881254,
      "translationId": 11417833
    },
    {
      "id": "advanced-302",
      "level": "advanced",
      "zh": "错误是如何显示出来的？",
      "en": "How is the error observed?",
      "source": "Tatoeba",
      "sourceId": 749460,
      "translationId": 749459
    },
    {
      "id": "advanced-303",
      "level": "advanced",
      "zh": "把你的武器放下。",
      "en": "Put your weapon down.",
      "source": "Tatoeba",
      "sourceId": 6678460,
      "translationId": 3155585
    },
    {
      "id": "advanced-304",
      "level": "advanced",
      "zh": "这没有任何区别。",
      "en": "That makes no difference.",
      "source": "Tatoeba",
      "sourceId": 335016,
      "translationId": 41534
    },
    {
      "id": "advanced-305",
      "level": "advanced",
      "zh": "您的蛋糕很美味。",
      "en": "Your cake is delicious.",
      "source": "Tatoeba",
      "sourceId": 782881,
      "translationId": 17395
    },
    {
      "id": "advanced-306",
      "level": "advanced",
      "zh": "我讨厌我的电脑。",
      "en": "I hate my computer.",
      "source": "Tatoeba",
      "sourceId": 9970234,
      "translationId": 2821975
    },
    {
      "id": "advanced-307",
      "level": "advanced",
      "zh": "你跟摩托车到底怎么回事？",
      "en": "What is it with you and motorbikes?",
      "source": "Tatoeba",
      "sourceId": 9961709,
      "translationId": 3731537
    },
    {
      "id": "advanced-308",
      "level": "advanced",
      "zh": "我更愿意贫穷而不是富裕。",
      "en": "I prefer being poor to being rich.",
      "source": "Tatoeba",
      "sourceId": 1366060,
      "translationId": 18524
    },
    {
      "id": "advanced-309",
      "level": "advanced",
      "zh": "医生治疗了他们的降低体温。",
      "en": "They were treated for hypothermia.",
      "source": "Tatoeba",
      "sourceId": 1214431,
      "translationId": 1214432
    },
    {
      "id": "advanced-310",
      "level": "advanced",
      "zh": "齐里的汽水罐在里玛身上爆炸了。",
      "en": "Ziri's can of soda exploded on Rima.",
      "source": "Tatoeba",
      "sourceId": 13549608,
      "translationId": 11190146
    },
    {
      "id": "advanced-311",
      "level": "advanced",
      "zh": "她热忱地投身于这份光荣的事业。",
      "en": "He enthusiastically engaged himself in this honorable undertaking.",
      "source": "Tatoeba",
      "sourceId": 1551883,
      "translationId": 1553552
    },
    {
      "id": "advanced-312",
      "level": "advanced",
      "zh": "那么上高架走。",
      "en": "Which way to the elevated highway?",
      "source": "Tatoeba",
      "sourceId": 420486,
      "translationId": 13731431
    },
    {
      "id": "advanced-313",
      "level": "advanced",
      "zh": "他1970年去了伦敦。",
      "en": "He went to London in 1970.",
      "source": "Tatoeba",
      "sourceId": 429064,
      "translationId": 288399
    },
    {
      "id": "advanced-314",
      "level": "advanced",
      "zh": "它是基本人权。",
      "en": "It's a basic human right.",
      "source": "Tatoeba",
      "sourceId": 5613655,
      "translationId": 1983986
    },
    {
      "id": "advanced-315",
      "level": "advanced",
      "zh": "他躺在长凳上。",
      "en": "He is lying on the bench.",
      "source": "Tatoeba",
      "sourceId": 2254399,
      "translationId": 292679
    },
    {
      "id": "advanced-316",
      "level": "advanced",
      "zh": "生活就像一盒巧克力。",
      "en": "Life is like a box of chocolates.",
      "source": "Tatoeba",
      "sourceId": 3031839,
      "translationId": 2260336
    },
    {
      "id": "advanced-317",
      "level": "advanced",
      "zh": "我已经游览过澳大利亚了。",
      "en": "I've already visited Australia.",
      "source": "Tatoeba",
      "sourceId": 8631837,
      "translationId": 6943193
    },
    {
      "id": "advanced-318",
      "level": "advanced",
      "zh": "我认为我没犯任何严重的错误。",
      "en": "I don't think I've ever made any serious mistakes.",
      "source": "Tatoeba",
      "sourceId": 5945144,
      "translationId": 4497415
    },
    {
      "id": "advanced-319",
      "level": "advanced",
      "zh": "装置被牢牢地固定在天花板上。",
      "en": "The device is attached fast to the ceiling.",
      "source": "Tatoeba",
      "sourceId": 829643,
      "translationId": 45605
    },
    {
      "id": "advanced-320",
      "level": "advanced",
      "zh": "低温使水变成冰。",
      "en": "Low temperatures turn water into ice.",
      "source": "Tatoeba",
      "sourceId": 354559,
      "translationId": 20350
    },
    {
      "id": "advanced-321",
      "level": "advanced",
      "zh": "士兵们对危险习以为常。",
      "en": "Soldiers are used to danger.",
      "source": "Tatoeba",
      "sourceId": 788566,
      "translationId": 320102
    },
    {
      "id": "advanced-322",
      "level": "advanced",
      "zh": "他们惊得目瞪口呆。",
      "en": "They were left speechless.",
      "source": "Tatoeba",
      "sourceId": 334419,
      "translationId": 1571
    },
    {
      "id": "advanced-323",
      "level": "advanced",
      "zh": "汽车尾气在城镇里造成了严重的污染。",
      "en": "Car exhaust causes serious pollution in towns.",
      "source": "Tatoeba",
      "sourceId": 5715189,
      "translationId": 265533
    },
    {
      "id": "advanced-324",
      "level": "advanced",
      "zh": "这对于我来说没任何意义。",
      "en": "It doesn't make sense to me.",
      "source": "Tatoeba",
      "sourceId": 2440958,
      "translationId": 249869
    },
    {
      "id": "advanced-325",
      "level": "advanced",
      "zh": "杰西卡穿着一条丑陋的连衣裙。",
      "en": "Jessica wore an ugly dress.",
      "source": "Tatoeba",
      "sourceId": 13880624,
      "translationId": 11542857
    },
    {
      "id": "advanced-326",
      "level": "advanced",
      "zh": "杂志比报纸报导得更深入。",
      "en": "A magazine can tell more about a story than a newspaper.",
      "source": "Tatoeba",
      "sourceId": 3890947,
      "translationId": 3890948
    },
    {
      "id": "advanced-327",
      "level": "advanced",
      "zh": "她理所当然的取得了胜利。",
      "en": "She's sure to succeed.",
      "source": "Tatoeba",
      "sourceId": 3783107,
      "translationId": 1327568
    },
    {
      "id": "advanced-328",
      "level": "advanced",
      "zh": "这秘密是怎么泄漏出去的？",
      "en": "How did the secret get out?",
      "source": "Tatoeba",
      "sourceId": 1020110,
      "translationId": 38343
    },
    {
      "id": "advanced-329",
      "level": "advanced",
      "zh": "我不知道怎么操作这台电脑。",
      "en": "I don't know how to operate this computer.",
      "source": "Tatoeba",
      "sourceId": 349436,
      "translationId": 253513
    },
    {
      "id": "advanced-330",
      "level": "advanced",
      "zh": "蜗牛缩进壳里去了。",
      "en": "The snail retreated into its shell.",
      "source": "Tatoeba",
      "sourceId": 1593704,
      "translationId": 1593727
    },
    {
      "id": "advanced-331",
      "level": "advanced",
      "zh": "咬紧牙关坚持到底！",
      "en": "Grit your teeth and bear it!",
      "source": "Tatoeba",
      "sourceId": 6330913,
      "translationId": 9408767
    },
    {
      "id": "advanced-332",
      "level": "advanced",
      "zh": "把那幅画挂到墙上。",
      "en": "Hang that picture on the wall.",
      "source": "Tatoeba",
      "sourceId": 408499,
      "translationId": 68493
    },
    {
      "id": "advanced-333",
      "level": "advanced",
      "zh": "金窝银窝不如自己的狗窝。",
      "en": "Be it ever so humble, there's no place like home.",
      "source": "Tatoeba",
      "sourceId": 333947,
      "translationId": 36695
    },
    {
      "id": "advanced-334",
      "level": "advanced",
      "zh": "长江是亚洲的最长江，6380公里。",
      "en": "The Yangtze, at 6,380 km, is Asia's longest river.",
      "source": "Tatoeba",
      "sourceId": 6744667,
      "translationId": 2144559
    },
    {
      "id": "advanced-335",
      "level": "advanced",
      "zh": "厕所冲水不正常。",
      "en": "The toilet doesn't flush properly.",
      "source": "Tatoeba",
      "sourceId": 332804,
      "translationId": 38948
    },
    {
      "id": "advanced-336",
      "level": "advanced",
      "zh": "我想要去夏威夷。",
      "en": "I want to go to Hawaii.",
      "source": "Tatoeba",
      "sourceId": 4394674,
      "translationId": 5313653
    },
    {
      "id": "advanced-337",
      "level": "advanced",
      "zh": "他假的布局非常温馨。",
      "en": "His home is furnished in a very cozy way.",
      "source": "Tatoeba",
      "sourceId": 13881215,
      "translationId": 6218470
    },
    {
      "id": "advanced-338",
      "level": "advanced",
      "zh": "我乘几路车去怀基基？",
      "en": "What number bus do I take to get to Waikiki?",
      "source": "Tatoeba",
      "sourceId": 794181,
      "translationId": 29236
    },
    {
      "id": "advanced-339",
      "level": "advanced",
      "zh": "整个过程需要耗费数月。",
      "en": "The whole process will take months.",
      "source": "Tatoeba",
      "sourceId": 8744964,
      "translationId": 7120443
    },
    {
      "id": "advanced-340",
      "level": "advanced",
      "zh": "重庆是一座丘陵的城市，道路弯弯曲曲的。",
      "en": "Chongqing is a hilly city with winding streets.",
      "source": "Tatoeba",
      "sourceId": 2228186,
      "translationId": 2228189
    },
    {
      "id": "advanced-341",
      "level": "advanced",
      "zh": "我父母不在家。",
      "en": "My parents aren't home.",
      "source": "Tatoeba",
      "sourceId": 10182722,
      "translationId": 2173919
    },
    {
      "id": "advanced-342",
      "level": "advanced",
      "zh": "该信件未署名。",
      "en": "This letter bears no signature.",
      "source": "Tatoeba",
      "sourceId": 2032273,
      "translationId": 58668
    },
    {
      "id": "advanced-343",
      "level": "advanced",
      "zh": "这是托尼的书。",
      "en": "This is Tony's book.",
      "source": "Tatoeba",
      "sourceId": 787042,
      "translationId": 55868
    },
    {
      "id": "advanced-344",
      "level": "advanced",
      "zh": "猫抓住了老鼠。",
      "en": "The cat caught a mouse.",
      "source": "Tatoeba",
      "sourceId": 332496,
      "translationId": 2301125
    },
    {
      "id": "advanced-345",
      "level": "advanced",
      "zh": "你拿错钥匙了。",
      "en": "You took the wrong key.",
      "source": "Tatoeba",
      "sourceId": 1776658,
      "translationId": 2416
    },
    {
      "id": "advanced-346",
      "level": "advanced",
      "zh": "宝宝对我笑了。",
      "en": "The baby smiled at me.",
      "source": "Tatoeba",
      "sourceId": 791573,
      "translationId": 272361
    },
    {
      "id": "advanced-347",
      "level": "advanced",
      "zh": "请帮我递下盐。",
      "en": "Please pass me the salt.",
      "source": "Tatoeba",
      "sourceId": 689260,
      "translationId": 25741
    },
    {
      "id": "advanced-348",
      "level": "advanced",
      "zh": "请把盐递给我。",
      "en": "Pass me the salt, please.",
      "source": "Tatoeba",
      "sourceId": 407281,
      "translationId": 25729
    },
    {
      "id": "advanced-349",
      "level": "advanced",
      "zh": "我差点没去澳大利亚。",
      "en": "I almost didn't visit Australia.",
      "source": "Tatoeba",
      "sourceId": 8746386,
      "translationId": 7186711
    },
    {
      "id": "advanced-350",
      "level": "advanced",
      "zh": "是什么让你这么紧张？",
      "en": "What are you so nervous about?",
      "source": "Tatoeba",
      "sourceId": 13069532,
      "translationId": 2929372
    },
    {
      "id": "advanced-351",
      "level": "advanced",
      "zh": "父亲总是不确定。",
      "en": "The father is always uncertain.",
      "source": "Tatoeba",
      "sourceId": 7768124,
      "translationId": 810826
    },
    {
      "id": "advanced-352",
      "level": "advanced",
      "zh": "篮子里装满了草莓。",
      "en": "The basket was full of strawberries.",
      "source": "Tatoeba",
      "sourceId": 346762,
      "translationId": 9730386
    },
    {
      "id": "advanced-353",
      "level": "advanced",
      "zh": "巧克力是用可可豆做的。",
      "en": "Chocolate is made from cocoa beans.",
      "source": "Tatoeba",
      "sourceId": 10368461,
      "translationId": 40109
    },
    {
      "id": "advanced-354",
      "level": "advanced",
      "zh": "谁能融化你的铁石心肠？",
      "en": "Who could melt that stone heart of yours?",
      "source": "Tatoeba",
      "sourceId": 793494,
      "translationId": 793495
    },
    {
      "id": "advanced-355",
      "level": "advanced",
      "zh": "他请求她给予优待。",
      "en": "He asked her to give him preferential treatment.",
      "source": "Tatoeba",
      "sourceId": 332618,
      "translationId": 4753801
    },
    {
      "id": "advanced-356",
      "level": "advanced",
      "zh": "我想改善我的英语发音。",
      "en": "I would like to improve my English pronunciation.",
      "source": "Tatoeba",
      "sourceId": 446163,
      "translationId": 256219
    },
    {
      "id": "advanced-357",
      "level": "advanced",
      "zh": "那片云是鱼的形状。",
      "en": "That cloud is in the shape of a fish.",
      "source": "Tatoeba",
      "sourceId": 472272,
      "translationId": 68580
    },
    {
      "id": "advanced-358",
      "level": "advanced",
      "zh": "至于该文件，我在保管。",
      "en": "As for the papers, I have custody of them.",
      "source": "Tatoeba",
      "sourceId": 2032208,
      "translationId": 46664
    },
    {
      "id": "advanced-359",
      "level": "advanced",
      "zh": "富人往往瞧不起穷人。",
      "en": "The rich are apt to look down upon the poor.",
      "source": "Tatoeba",
      "sourceId": 2030754,
      "translationId": 18512
    },
    {
      "id": "advanced-360",
      "level": "advanced",
      "zh": "这根湿掉的火柴点不出火的。",
      "en": "This damp match won't light.",
      "source": "Tatoeba",
      "sourceId": 839212,
      "translationId": 60467
    },
    {
      "id": "advanced-361",
      "level": "advanced",
      "zh": "由于噪音，我无法集中精力工作了。",
      "en": "I can't concentrate on my work because of the noise.",
      "source": "Tatoeba",
      "sourceId": 787537,
      "translationId": 244948
    },
    {
      "id": "advanced-362",
      "level": "advanced",
      "zh": "摄像机对我而言是必需品。",
      "en": "The camera was essential for me.",
      "source": "Tatoeba",
      "sourceId": 333763,
      "translationId": 63561
    },
    {
      "id": "advanced-363",
      "level": "advanced",
      "zh": "不要感觉那么悲观。",
      "en": "Don't be so pessimistic.",
      "source": "Tatoeba",
      "sourceId": 8850437,
      "translationId": 3603648
    },
    {
      "id": "advanced-364",
      "level": "advanced",
      "zh": "这辆车是布莱恩的。",
      "en": "The car is Brian's.",
      "source": "Tatoeba",
      "sourceId": 10513375,
      "translationId": 873548
    },
    {
      "id": "advanced-365",
      "level": "advanced",
      "zh": "他没见到任何人。",
      "en": "He didn't see anybody.",
      "source": "Tatoeba",
      "sourceId": 673307,
      "translationId": 301396
    },
    {
      "id": "advanced-366",
      "level": "advanced",
      "zh": "你欠我一份真相。",
      "en": "You owe me the truth.",
      "source": "Tatoeba",
      "sourceId": 9964350,
      "translationId": 2216519
    },
    {
      "id": "advanced-367",
      "level": "advanced",
      "zh": "氢是最轻的元素。",
      "en": "Hydrogen is the lightest element.",
      "source": "Tatoeba",
      "sourceId": 5670790,
      "translationId": 1345299
    },
    {
      "id": "advanced-368",
      "level": "advanced",
      "zh": "你的姓氏怎么写？",
      "en": "How is your surname written?",
      "source": "Tatoeba",
      "sourceId": 5794104,
      "translationId": 436257
    },
    {
      "id": "advanced-369",
      "level": "advanced",
      "zh": "在德国过得如何？",
      "en": "How's life in Germany?",
      "source": "Tatoeba",
      "sourceId": 4900971,
      "translationId": 1761511
    },
    {
      "id": "advanced-370",
      "level": "advanced",
      "zh": "她乘着光之翼飞走了。",
      "en": "She flew away on wings of light.",
      "source": "Tatoeba",
      "sourceId": 8744866,
      "translationId": 8742983
    },
    {
      "id": "advanced-371",
      "level": "advanced",
      "zh": "她把鼻子贴在玻璃上。",
      "en": "She pressed her nose against the glass.",
      "source": "Tatoeba",
      "sourceId": 8463527,
      "translationId": 1742338
    },
    {
      "id": "advanced-372",
      "level": "advanced",
      "zh": "罢工妨碍了国家经济。",
      "en": "The strike affected the nation's economy.",
      "source": "Tatoeba",
      "sourceId": 819787,
      "translationId": 51884
    },
    {
      "id": "advanced-373",
      "level": "advanced",
      "zh": "他后悔自己的挥金如土。",
      "en": "He regrets his having wasted his money.",
      "source": "Tatoeba",
      "sourceId": 1397037,
      "translationId": 298674
    },
    {
      "id": "advanced-374",
      "level": "advanced",
      "zh": "我每年拜访我父亲两次。",
      "en": "I visit my father twice a year.",
      "source": "Tatoeba",
      "sourceId": 1312390,
      "translationId": 7830239
    },
    {
      "id": "advanced-375",
      "level": "advanced",
      "zh": "我救了你一命。",
      "en": "I saved your life.",
      "source": "Tatoeba",
      "sourceId": 9968871,
      "translationId": 1887639
    },
    {
      "id": "advanced-376",
      "level": "advanced",
      "zh": "我的脉搏很快。",
      "en": "My pulse is fast.",
      "source": "Tatoeba",
      "sourceId": 8725289,
      "translationId": 322672
    },
    {
      "id": "advanced-377",
      "level": "advanced",
      "zh": "这是谁的坟墓？",
      "en": "Whose tomb is this?",
      "source": "Tatoeba",
      "sourceId": 1417559,
      "translationId": 12135571
    },
    {
      "id": "advanced-378",
      "level": "advanced",
      "zh": "他的薪酬很高。",
      "en": "His salary is high.",
      "source": "Tatoeba",
      "sourceId": 4764601,
      "translationId": 4759786
    },
    {
      "id": "advanced-379",
      "level": "advanced",
      "zh": "我是一个奴隶。",
      "en": "I'm a slave.",
      "source": "Tatoeba",
      "sourceId": 10737544,
      "translationId": 10204809
    },
    {
      "id": "advanced-380",
      "level": "advanced",
      "zh": "梅拉妮在喝牛奶。",
      "en": "Melanie is drinking milk.",
      "source": "Tatoeba",
      "sourceId": 2790039,
      "translationId": 2790038
    },
    {
      "id": "advanced-381",
      "level": "advanced",
      "zh": "好险啊，还好侥幸逃过一劫。",
      "en": "That was so dangerous! Fortunately, I narrowly escaped a disaster.",
      "source": "Tatoeba",
      "sourceId": 10042018,
      "translationId": 11975645
    },
    {
      "id": "advanced-382",
      "level": "advanced",
      "zh": "厨房里缺少一台洗碗机。",
      "en": "The kitchen lacks a dishwasher.",
      "source": "Tatoeba",
      "sourceId": 774513,
      "translationId": 681320
    },
    {
      "id": "advanced-383",
      "level": "advanced",
      "zh": "麻烦给我点晕机药。",
      "en": "Please bring me some medicine for airsickness.",
      "source": "Tatoeba",
      "sourceId": 1931906,
      "translationId": 25038
    },
    {
      "id": "advanced-384",
      "level": "advanced",
      "zh": "卓别林是有预见力的人。",
      "en": "Chaplin was visionary.",
      "source": "Tatoeba",
      "sourceId": 805120,
      "translationId": 810861
    },
    {
      "id": "advanced-385",
      "level": "advanced",
      "zh": "他能轻松地读英语。",
      "en": "He can read English easily.",
      "source": "Tatoeba",
      "sourceId": 1397011,
      "translationId": 294874
    },
    {
      "id": "advanced-386",
      "level": "advanced",
      "zh": "我是唯一的幸存者。",
      "en": "I'm the only one who survived.",
      "source": "Tatoeba",
      "sourceId": 2336011,
      "translationId": 1664650
    },
    {
      "id": "advanced-387",
      "level": "advanced",
      "zh": "你怎么能容忍他呢？",
      "en": "How you can abide him?",
      "source": "Tatoeba",
      "sourceId": 2054109,
      "translationId": 2054108
    },
    {
      "id": "advanced-388",
      "level": "advanced",
      "zh": "她法语说得不流利。",
      "en": "Her French is not fluent.",
      "source": "Tatoeba",
      "sourceId": 3700364,
      "translationId": 3700383
    },
    {
      "id": "advanced-389",
      "level": "advanced",
      "zh": "我对童年的记忆越来越模糊了。",
      "en": "I recall less and less of my childhood.",
      "source": "Tatoeba",
      "sourceId": 342109,
      "translationId": 246027
    },
    {
      "id": "advanced-390",
      "level": "advanced",
      "zh": "你是我的救命恩人。",
      "en": "You are my saviour.",
      "source": "Tatoeba",
      "sourceId": 2607393,
      "translationId": 7765384
    },
    {
      "id": "advanced-391",
      "level": "advanced",
      "zh": "一块圆桌玻璃被打碎了。",
      "en": "The glass round table was smashed.",
      "source": "Tatoeba",
      "sourceId": 400344,
      "translationId": 7785095
    },
    {
      "id": "advanced-392",
      "level": "advanced",
      "zh": "资本家倾向于压榨工人。",
      "en": "The capitalists tend to exploit the working people.",
      "source": "Tatoeba",
      "sourceId": 12568730,
      "translationId": 12568732
    },
    {
      "id": "advanced-393",
      "level": "advanced",
      "zh": "他受邀做俱乐部的主席。",
      "en": "He was invited to be the chairman of the club.",
      "source": "Tatoeba",
      "sourceId": 332946,
      "translationId": 289768
    },
    {
      "id": "advanced-394",
      "level": "advanced",
      "zh": "我对她的大公无私怀有敬意。",
      "en": "I respect her selflessness.",
      "source": "Tatoeba",
      "sourceId": 482287,
      "translationId": 482289
    },
    {
      "id": "advanced-395",
      "level": "advanced",
      "zh": "那是可避免的。",
      "en": "That's avoidable.",
      "source": "Tatoeba",
      "sourceId": 5842633,
      "translationId": 2283751
    },
    {
      "id": "advanced-396",
      "level": "advanced",
      "zh": "没有挑战就没有收获。",
      "en": "Nothing ventured, nothing gained.",
      "source": "Tatoeba",
      "sourceId": 8715858,
      "translationId": 537811
    },
    {
      "id": "advanced-397",
      "level": "advanced",
      "zh": "他的袜子是紫色的。",
      "en": "His socks are purple.",
      "source": "Tatoeba",
      "sourceId": 8863197,
      "translationId": 435114
    },
    {
      "id": "advanced-398",
      "level": "advanced",
      "zh": "他经济上依靠他的太太。",
      "en": "He relies on his wife financially.",
      "source": "Tatoeba",
      "sourceId": 336076,
      "translationId": 295715
    },
    {
      "id": "advanced-399",
      "level": "advanced",
      "zh": "听到消息，她晕倒了。",
      "en": "On hearing the news, she fainted.",
      "source": "Tatoeba",
      "sourceId": 4282858,
      "translationId": 456543
    },
    {
      "id": "advanced-400",
      "level": "advanced",
      "zh": "我的伯叔住在纽约。",
      "en": "My uncle lives in New York.",
      "source": "Tatoeba",
      "sourceId": 2881789,
      "translationId": 251173
    },
    {
      "id": "advanced-401",
      "level": "advanced",
      "zh": "你能演奏管风琴吗？",
      "en": "Are you able to play organ?",
      "source": "Tatoeba",
      "sourceId": 4844748,
      "translationId": 4841310
    },
    {
      "id": "advanced-402",
      "level": "advanced",
      "zh": "为什么我的兄弟是笨蛋？",
      "en": "Why is my friend an idiot?",
      "source": "Tatoeba",
      "sourceId": 3629993,
      "translationId": 3633907
    },
    {
      "id": "advanced-403",
      "level": "advanced",
      "zh": "光速比音速快很多。",
      "en": "Light is much faster than sound.",
      "source": "Tatoeba",
      "sourceId": 503192,
      "translationId": 599130
    },
    {
      "id": "advanced-404",
      "level": "advanced",
      "zh": "美国国旗有五十颗星。",
      "en": "The American flag has fifty stars.",
      "source": "Tatoeba",
      "sourceId": 3376511,
      "translationId": 1159935
    },
    {
      "id": "advanced-405",
      "level": "advanced",
      "zh": "兄弟，你到底姓什么啊？",
      "en": "Bro, what's your last name?",
      "source": "Tatoeba",
      "sourceId": 4835903,
      "translationId": 4844603
    },
    {
      "id": "advanced-406",
      "level": "advanced",
      "zh": "雷雨天气请勿登山。",
      "en": "Lightning-prone area: please do not climb",
      "source": "Tatoeba",
      "sourceId": 5918549,
      "translationId": 5918555
    },
    {
      "id": "advanced-407",
      "level": "advanced",
      "zh": "不是任何人能够买车子。",
      "en": "Not everyone can afford a car.",
      "source": "Tatoeba",
      "sourceId": 2410920,
      "translationId": 2410918
    },
    {
      "id": "advanced-408",
      "level": "advanced",
      "zh": "俄罗斯大使馆在哪儿？",
      "en": "Where is the Russian embassy?",
      "source": "Tatoeba",
      "sourceId": 2884121,
      "translationId": 1759411
    },
    {
      "id": "advanced-409",
      "level": "advanced",
      "zh": "给我这座城堡的钥匙！",
      "en": "Give me the key to this castle!",
      "source": "Tatoeba",
      "sourceId": 796919,
      "translationId": 371761
    },
    {
      "id": "advanced-410",
      "level": "advanced",
      "zh": "冰冻三尺，非一日之寒。",
      "en": "Rome was not built in a day.",
      "source": "Tatoeba",
      "sourceId": 398231,
      "translationId": 27493
    },
    {
      "id": "advanced-411",
      "level": "advanced",
      "zh": "梦想能让我疯狂。",
      "en": "Dreams can make me crazy.",
      "source": "Tatoeba",
      "sourceId": 795768,
      "translationId": 1033598
    },
    {
      "id": "advanced-412",
      "level": "advanced",
      "zh": "我至始至终都在支持你。",
      "en": "I have supported you throughout.",
      "source": "Tatoeba",
      "sourceId": 1397077,
      "translationId": 259588
    },
    {
      "id": "advanced-413",
      "level": "advanced",
      "zh": "你父亲是做什么的？",
      "en": "What does your father do?",
      "source": "Tatoeba",
      "sourceId": 471108,
      "translationId": 64082
    },
    {
      "id": "advanced-414",
      "level": "advanced",
      "zh": "你为什么这么可怜？",
      "en": "Why are you so unfortunate?",
      "source": "Tatoeba",
      "sourceId": 9958376,
      "translationId": 12135120
    },
    {
      "id": "advanced-415",
      "level": "advanced",
      "zh": "药物缓解了他的痛苦。",
      "en": "The medicine decreased his pain.",
      "source": "Tatoeba",
      "sourceId": 2312182,
      "translationId": 43545
    },
    {
      "id": "advanced-416",
      "level": "advanced",
      "zh": "我没法忍受这种痛苦。",
      "en": "I cannot bear this pain.",
      "source": "Tatoeba",
      "sourceId": 5068213,
      "translationId": 5067597
    },
    {
      "id": "advanced-417",
      "level": "advanced",
      "zh": "狂风暴雨造成她无法准时抵达。",
      "en": "The storm prevented her from arriving on time.",
      "source": "Tatoeba",
      "sourceId": 602898,
      "translationId": 325281
    },
    {
      "id": "advanced-418",
      "level": "advanced",
      "zh": "我的手机是美丽的。",
      "en": "My phone is beautiful.",
      "source": "Tatoeba",
      "sourceId": 1101860,
      "translationId": 1101861
    },
    {
      "id": "advanced-419",
      "level": "advanced",
      "zh": "梅格买了一罐西红柿。",
      "en": "Meg bought a can of tomatoes.",
      "source": "Tatoeba",
      "sourceId": 898922,
      "translationId": 31816
    },
    {
      "id": "advanced-420",
      "level": "advanced",
      "zh": "您曾经去过威尼斯吗？",
      "en": "Have you ever been to Venice?",
      "source": "Tatoeba",
      "sourceId": 1050403,
      "translationId": 1325099
    },
    {
      "id": "advanced-421",
      "level": "advanced",
      "zh": "用你的鼻子呼吸。",
      "en": "Breathe through your nose.",
      "source": "Tatoeba",
      "sourceId": 4845078,
      "translationId": 4666280
    },
    {
      "id": "advanced-422",
      "level": "advanced",
      "zh": "派对主席说话时有葡萄牙腔。",
      "en": "The party host had a Portuguese accent.",
      "source": "Tatoeba",
      "sourceId": 5301828,
      "translationId": 5301768
    },
    {
      "id": "advanced-423",
      "level": "advanced",
      "zh": "开车其乐无穷。",
      "en": "It is a lot of fun to drive a car.",
      "source": "Tatoeba",
      "sourceId": 1363329,
      "translationId": 265585
    },
    {
      "id": "advanced-424",
      "level": "advanced",
      "zh": "骄傲是失败的先行者。",
      "en": "Pride cometh before a fall.",
      "source": "Tatoeba",
      "sourceId": 3086999,
      "translationId": 5720793
    },
    {
      "id": "advanced-425",
      "level": "advanced",
      "zh": "那些俄罗斯人啊。",
      "en": "Ah, those Russians!",
      "source": "Tatoeba",
      "sourceId": 4462459,
      "translationId": 4462428
    },
    {
      "id": "advanced-426",
      "level": "advanced",
      "zh": "她熬夜习惯了。",
      "en": "She is used to staying up late.",
      "source": "Tatoeba",
      "sourceId": 1319977,
      "translationId": 317224
    },
    {
      "id": "advanced-427",
      "level": "advanced",
      "zh": "价格根据需求变化。",
      "en": "The price varies with demand.",
      "source": "Tatoeba",
      "sourceId": 501184,
      "translationId": 24421
    },
    {
      "id": "advanced-428",
      "level": "advanced",
      "zh": "充满希望比绝望好。",
      "en": "To hope is better than to despair.",
      "source": "Tatoeba",
      "sourceId": 4844660,
      "translationId": 4838307
    },
    {
      "id": "advanced-429",
      "level": "advanced",
      "zh": "让房间保持原样。",
      "en": "Leave the room as it is.",
      "source": "Tatoeba",
      "sourceId": 816300,
      "translationId": 319587
    },
    {
      "id": "advanced-430",
      "level": "advanced",
      "zh": "我希望去夏威夷。",
      "en": "I wish to go to Hawaii.",
      "source": "Tatoeba",
      "sourceId": 862703,
      "translationId": 255439
    },
    {
      "id": "advanced-431",
      "level": "advanced",
      "zh": "要有大局观。",
      "en": "We should judge matters on a broader basis.",
      "source": "Tatoeba",
      "sourceId": 1946810,
      "translationId": 30394
    },
    {
      "id": "advanced-432",
      "level": "advanced",
      "zh": "我不想挂科。",
      "en": "I don't want to fail my exams.",
      "source": "Tatoeba",
      "sourceId": 2395001,
      "translationId": 2109
    },
    {
      "id": "advanced-433",
      "level": "advanced",
      "zh": "他终于恢复了理智。",
      "en": "He finally came to his senses.",
      "source": "Tatoeba",
      "sourceId": 7768220,
      "translationId": 10621399
    },
    {
      "id": "advanced-434",
      "level": "advanced",
      "zh": "男孩在玩玩具兵。",
      "en": "The boy is playing with his toy soldiers.",
      "source": "Tatoeba",
      "sourceId": 6148997,
      "translationId": 1907681
    },
    {
      "id": "advanced-435",
      "level": "advanced",
      "zh": "我期待您的消息。",
      "en": "I'm looking forward to hearing from you soon.",
      "source": "Tatoeba",
      "sourceId": 399086,
      "translationId": 18746
    },
    {
      "id": "advanced-436",
      "level": "advanced",
      "zh": "这朵玫瑰很漂亮。",
      "en": "This rose is very beautiful.",
      "source": "Tatoeba",
      "sourceId": 1891233,
      "translationId": 60644
    },
    {
      "id": "advanced-437",
      "level": "advanced",
      "zh": "我拼命地跑。",
      "en": "I ran as fast as I could.",
      "source": "Tatoeba",
      "sourceId": 358290,
      "translationId": 27573
    },
    {
      "id": "advanced-438",
      "level": "advanced",
      "zh": "土豆很便宜的。",
      "en": "Potatoes are very cheap.",
      "source": "Tatoeba",
      "sourceId": 420268,
      "translationId": 862341
    },
    {
      "id": "advanced-439",
      "level": "advanced",
      "zh": "你用什么方法解压？",
      "en": "How do you relieve stress?",
      "source": "Tatoeba",
      "sourceId": 9955850,
      "translationId": 9955799
    },
    {
      "id": "advanced-440",
      "level": "advanced",
      "zh": "屠夫的刀子在抽屉里。",
      "en": "The butcher knife is in the drawer.",
      "source": "Tatoeba",
      "sourceId": 3682956,
      "translationId": 7806145
    },
    {
      "id": "advanced-441",
      "level": "advanced",
      "zh": "你的寒假怎么过的？",
      "en": "How did you spend your winter vacation?",
      "source": "Tatoeba",
      "sourceId": 8686670,
      "translationId": 279653
    },
    {
      "id": "advanced-442",
      "level": "advanced",
      "zh": "别想阻止我。",
      "en": "Don't try to stop me.",
      "source": "Tatoeba",
      "sourceId": 5862105,
      "translationId": 1852408
    },
    {
      "id": "advanced-443",
      "level": "advanced",
      "zh": "他指控了她。",
      "en": "He laid a charge against her.",
      "source": "Tatoeba",
      "sourceId": 5554528,
      "translationId": 2455322
    },
    {
      "id": "advanced-444",
      "level": "advanced",
      "zh": "我全心全意地支持你。",
      "en": "I support you whole-heartedly.",
      "source": "Tatoeba",
      "sourceId": 825766,
      "translationId": 321790
    },
    {
      "id": "advanced-445",
      "level": "advanced",
      "zh": "生活是美丽的。",
      "en": "Life is beautiful.",
      "source": "Tatoeba",
      "sourceId": 502771,
      "translationId": 1829
    },
    {
      "id": "advanced-446",
      "level": "advanced",
      "zh": "在埃及说什么语言？",
      "en": "What language is spoken in Egypt?",
      "source": "Tatoeba",
      "sourceId": 462060,
      "translationId": 729046
    },
    {
      "id": "advanced-447",
      "level": "advanced",
      "zh": "这份合同没有法律效力。",
      "en": "This contract is null and void.",
      "source": "Tatoeba",
      "sourceId": 9958559,
      "translationId": 7861634
    },
    {
      "id": "advanced-448",
      "level": "advanced",
      "zh": "我喜欢澳大利亚料理。",
      "en": "I am fond of Australian food.",
      "source": "Tatoeba",
      "sourceId": 1777456,
      "translationId": 1771852
    },
    {
      "id": "advanced-449",
      "level": "advanced",
      "zh": "你有义务还债。",
      "en": "You're liable for the debt.",
      "source": "Tatoeba",
      "sourceId": 332812,
      "translationId": 8332962
    },
    {
      "id": "advanced-450",
      "level": "advanced",
      "zh": "我佩服他的勇气。",
      "en": "I admire him for his courage.",
      "source": "Tatoeba",
      "sourceId": 512110,
      "translationId": 287713
    },
    {
      "id": "advanced-451",
      "level": "advanced",
      "zh": "这是免费的。",
      "en": "It's on the house.",
      "source": "Tatoeba",
      "sourceId": 2513880,
      "translationId": 1112522
    },
    {
      "id": "advanced-452",
      "level": "advanced",
      "zh": "那座桥不长。",
      "en": "That bridge isn't long.",
      "source": "Tatoeba",
      "sourceId": 348907,
      "translationId": 68448
    },
    {
      "id": "advanced-453",
      "level": "advanced",
      "zh": "有人在呼救。",
      "en": "Someone is calling for help.",
      "source": "Tatoeba",
      "sourceId": 718624,
      "translationId": 276170
    },
    {
      "id": "advanced-454",
      "level": "advanced",
      "zh": "我又熬夜了。",
      "en": "I had another all-nighter.",
      "source": "Tatoeba",
      "sourceId": 6069406,
      "translationId": 6106240
    },
    {
      "id": "advanced-455",
      "level": "advanced",
      "zh": "我把旅费耗光了。",
      "en": "I have run out of my traveling expenses.",
      "source": "Tatoeba",
      "sourceId": 330588,
      "translationId": 262216
    },
    {
      "id": "advanced-456",
      "level": "advanced",
      "zh": "这支笔没墨了。",
      "en": "This pen has run dry.",
      "source": "Tatoeba",
      "sourceId": 1901924,
      "translationId": 56795
    },
    {
      "id": "advanced-457",
      "level": "advanced",
      "zh": "你为什么恨我？",
      "en": "Why do you resent me?",
      "source": "Tatoeba",
      "sourceId": 8589273,
      "translationId": 3822513
    },
    {
      "id": "advanced-458",
      "level": "advanced",
      "zh": "新加坡是城邦。",
      "en": "Singapore is a city-state.",
      "source": "Tatoeba",
      "sourceId": 10189714,
      "translationId": 5694005
    },
    {
      "id": "advanced-459",
      "level": "advanced",
      "zh": "作家很有幽默感。",
      "en": "The writer is very humorous.",
      "source": "Tatoeba",
      "sourceId": 1401592,
      "translationId": 47785
    },
    {
      "id": "advanced-460",
      "level": "advanced",
      "zh": "你没什么可抱歉的。",
      "en": "You have nothing to be sorry about.",
      "source": "Tatoeba",
      "sourceId": 2318387,
      "translationId": 1561462
    },
    {
      "id": "advanced-461",
      "level": "advanced",
      "zh": "为什么你企图逃走？",
      "en": "Why did you try to run away?",
      "source": "Tatoeba",
      "sourceId": 476596,
      "translationId": 16451
    },
    {
      "id": "advanced-462",
      "level": "advanced",
      "zh": "雪是粉状的。",
      "en": "The snow was powdery.",
      "source": "Tatoeba",
      "sourceId": 12047754,
      "translationId": 2335854
    },
    {
      "id": "advanced-463",
      "level": "advanced",
      "zh": "你太谦虚了。",
      "en": "You're too modest.",
      "source": "Tatoeba",
      "sourceId": 4760086,
      "translationId": 2218451
    },
    {
      "id": "advanced-464",
      "level": "advanced",
      "zh": "我要赶紧了！",
      "en": "I have to hurry!",
      "source": "Tatoeba",
      "sourceId": 793948,
      "translationId": 705285
    },
    {
      "id": "advanced-465",
      "level": "advanced",
      "zh": "你坏了规矩。",
      "en": "You broke the rule.",
      "source": "Tatoeba",
      "sourceId": 1992653,
      "translationId": 16216
    },
    {
      "id": "advanced-466",
      "level": "advanced",
      "zh": "法案以10票微弱多数通过。",
      "en": "The bill passed by a small majority of 10 votes.",
      "source": "Tatoeba",
      "sourceId": 6101390,
      "translationId": 20026
    },
    {
      "id": "advanced-467",
      "level": "advanced",
      "zh": "舞台上撒了花瓣。",
      "en": "The stage was sprinkled with flower petals.",
      "source": "Tatoeba",
      "sourceId": 3100669,
      "translationId": 3106600
    },
    {
      "id": "advanced-468",
      "level": "advanced",
      "zh": "那留下了印象。",
      "en": "That left an impression.",
      "source": "Tatoeba",
      "sourceId": 9432376,
      "translationId": 5746191
    },
    {
      "id": "advanced-469",
      "level": "advanced",
      "zh": "我忽略了事实。",
      "en": "I overlooked the truth.",
      "source": "Tatoeba",
      "sourceId": 1416062,
      "translationId": 11295056
    },
    {
      "id": "advanced-470",
      "level": "advanced",
      "zh": "你为什么醒着？",
      "en": "Why are you awake?",
      "source": "Tatoeba",
      "sourceId": 844137,
      "translationId": 2648208
    },
    {
      "id": "advanced-471",
      "level": "advanced",
      "zh": "没人能阻止我！",
      "en": "Nobody can stop me!",
      "source": "Tatoeba",
      "sourceId": 541032,
      "translationId": 276525
    },
    {
      "id": "advanced-472",
      "level": "advanced",
      "zh": "你的专业是什么？",
      "en": "What is your major?",
      "source": "Tatoeba",
      "sourceId": 5094692,
      "translationId": 6713340
    },
    {
      "id": "advanced-473",
      "level": "advanced",
      "zh": "无事掘小，小事掘大。",
      "en": "Make the best of your opportunities.",
      "source": "Tatoeba",
      "sourceId": 969846,
      "translationId": 997872
    },
    {
      "id": "advanced-474",
      "level": "advanced",
      "zh": "我是埃及人。",
      "en": "I am Egyptian.",
      "source": "Tatoeba",
      "sourceId": 2235418,
      "translationId": 2235409
    },
    {
      "id": "advanced-475",
      "level": "advanced",
      "zh": "我打喷嚏了。",
      "en": "I am sneezing.",
      "source": "Tatoeba",
      "sourceId": 9970071,
      "translationId": 1661181
    },
    {
      "id": "advanced-476",
      "level": "advanced",
      "zh": "女孩与我擦肩而过。",
      "en": "The girl brushed past me.",
      "source": "Tatoeba",
      "sourceId": 1397022,
      "translationId": 46444
    },
    {
      "id": "advanced-477",
      "level": "advanced",
      "zh": "我的母语是捷克语。",
      "en": "My native language is Czech.",
      "source": "Tatoeba",
      "sourceId": 10194201,
      "translationId": 8413288
    },
    {
      "id": "advanced-478",
      "level": "advanced",
      "zh": "我犯了严重错误。",
      "en": "I made a serious mistake.",
      "source": "Tatoeba",
      "sourceId": 2218994,
      "translationId": 258527
    },
    {
      "id": "advanced-479",
      "level": "advanced",
      "zh": "你的强项是什么？",
      "en": "What are your strong points?",
      "source": "Tatoeba",
      "sourceId": 334405,
      "translationId": 70461
    },
    {
      "id": "advanced-480",
      "level": "advanced",
      "zh": "男孩依旧沉默不语。",
      "en": "The boy remained silent.",
      "source": "Tatoeba",
      "sourceId": 8935964,
      "translationId": 47434
    },
    {
      "id": "advanced-481",
      "level": "advanced",
      "zh": "加拿大毗邻阿拉斯加州。",
      "en": "Canada borders Alaska.",
      "source": "Tatoeba",
      "sourceId": 10188619,
      "translationId": 6672694
    },
    {
      "id": "advanced-482",
      "level": "advanced",
      "zh": "喝咖啡伤胃。",
      "en": "Coffee does harm to your stomach.",
      "source": "Tatoeba",
      "sourceId": 1360019,
      "translationId": 62240
    },
    {
      "id": "advanced-483",
      "level": "advanced",
      "zh": "铁路与公路平行。",
      "en": "The tracks run parallel to the road.",
      "source": "Tatoeba",
      "sourceId": 5670798,
      "translationId": 457120
    },
    {
      "id": "advanced-484",
      "level": "advanced",
      "zh": "医生，我胃痛。",
      "en": "Doctor, my stomach hurts.",
      "source": "Tatoeba",
      "sourceId": 10540451,
      "translationId": 707331
    },
    {
      "id": "advanced-485",
      "level": "advanced",
      "zh": "知识就是力量。",
      "en": "Knowledge is power.",
      "source": "Tatoeba",
      "sourceId": 1314409,
      "translationId": 277046
    },
    {
      "id": "advanced-486",
      "level": "advanced",
      "zh": "厕所塞住了。",
      "en": "The toilet is backed up.",
      "source": "Tatoeba",
      "sourceId": 799308,
      "translationId": 5870557
    },
    {
      "id": "advanced-487",
      "level": "advanced",
      "zh": "别这么粗心！",
      "en": "Don't be so careless!",
      "source": "Tatoeba",
      "sourceId": 5931753,
      "translationId": 1418885
    },
    {
      "id": "advanced-488",
      "level": "advanced",
      "zh": "这是什么废话？",
      "en": "What is this nonsense?",
      "source": "Tatoeba",
      "sourceId": 1039699,
      "translationId": 482376
    },
    {
      "id": "advanced-489",
      "level": "advanced",
      "zh": "阿伦是诗人。",
      "en": "Allan is a poet.",
      "source": "Tatoeba",
      "sourceId": 345401,
      "translationId": 1420356
    },
    {
      "id": "advanced-490",
      "level": "advanced",
      "zh": "男孩微微笑。",
      "en": "The boy is smiling.",
      "source": "Tatoeba",
      "sourceId": 13519166,
      "translationId": 13131838
    },
    {
      "id": "advanced-491",
      "level": "advanced",
      "zh": "别狼吞虎咽的，你最好细嚼慢咽地吃。",
      "en": "Stop inhaling your food. You should eat a little slower.",
      "source": "Tatoeba",
      "sourceId": 2581495,
      "translationId": 41676
    },
    {
      "id": "advanced-492",
      "level": "advanced",
      "zh": "别犯傻，我做不到。",
      "en": "Don't be silly. I can't do it.",
      "source": "Tatoeba",
      "sourceId": 5933784,
      "translationId": 1860511
    },
    {
      "id": "advanced-493",
      "level": "advanced",
      "zh": "每天早上吃一只活青蛙，那么你一天中其他的时间就不会发生什么更糟糕的事了。",
      "en": "Eat a live frog every morning, and nothing worse will happen to you the rest of the day.",
      "source": "Tatoeba",
      "sourceId": 771977,
      "translationId": 667964
    },
    {
      "id": "advanced-494",
      "level": "advanced",
      "zh": "他的食物供给不足的的时候，他不得不去找新的地方居住。",
      "en": "When his food supply ran short, he had to look for a new place to live.",
      "source": "Tatoeba",
      "sourceId": 1990207,
      "translationId": 286791
    },
    {
      "id": "advanced-495",
      "level": "advanced",
      "zh": "我们要走到山上，还没走到一半的路，你真的已经那么累了吗？",
      "en": "We still have more than halfway to go to get to the top of the mountain. Are you really already exhausted?",
      "source": "Tatoeba",
      "sourceId": 12080608,
      "translationId": 1167467
    },
    {
      "id": "advanced-496",
      "level": "advanced",
      "zh": "因为天气不好，不能打高尔夫球，所以母亲的心情很差。",
      "en": "Mother was in a bad mood since she could not play golf because of bad weather.",
      "source": "Tatoeba",
      "sourceId": 569718,
      "translationId": 278950
    },
    {
      "id": "advanced-497",
      "level": "advanced",
      "zh": "你还记得我们还在小学时你和我一起去动物园那次吗？",
      "en": "Do you remember the time you and I went to the zoo together when you and I were in elementary school?",
      "source": "Tatoeba",
      "sourceId": 12221517,
      "translationId": 6913048
    },
    {
      "id": "advanced-498",
      "level": "advanced",
      "zh": "他去了那里帮助清洁工人和平地争取更高的薪金和更好的工作环境。",
      "en": "He had gone there to help garbage workers strike peacefully for better pay and working conditions.",
      "source": "Tatoeba",
      "sourceId": 435245,
      "translationId": 288218
    },
    {
      "id": "advanced-499",
      "level": "advanced",
      "zh": "这里除了恶劣的天气和频繁的地震之外，几乎就是一个完美的居住地。",
      "en": "Except for the bad weather and the frequent earthquakes, this is almost a perfect place to live.",
      "source": "Tatoeba",
      "sourceId": 13556622,
      "translationId": 9387463
    },
    {
      "id": "advanced-500",
      "level": "advanced",
      "zh": "他到了火车站的时候，火车已经开出了差不多半小时。",
      "en": "When he reached the station, the train had already left almost half an hour before.",
      "source": "Tatoeba",
      "sourceId": 459992,
      "translationId": 283403
    },
    {
      "id": "advanced-501",
      "level": "advanced",
      "zh": "如果你喜欢你做的工作，你就有比金钱更有价值的东西。",
      "en": "If you enjoy the work you do, you have something worth more than money.",
      "source": "Tatoeba",
      "sourceId": 891582,
      "translationId": 264724
    },
    {
      "id": "advanced-502",
      "level": "advanced",
      "zh": "你去那个超级市场，几乎甚么日用品都买得到。",
      "en": "If you go to that supermarket, you can buy most things you use in your daily life.",
      "source": "Tatoeba",
      "sourceId": 403775,
      "translationId": 68682
    },
    {
      "id": "advanced-503",
      "level": "advanced",
      "zh": "无论我们是否喜欢电脑，它在我们的生活中始终起着重要的作用。",
      "en": "Computers are certainly playing an important role in our life, whether we like it or not.",
      "source": "Tatoeba",
      "sourceId": 1551881,
      "translationId": 240703
    },
    {
      "id": "advanced-504",
      "level": "advanced",
      "zh": "你乘公车去的话，可以省掉三分之二的时间。",
      "en": "If you go by bus, you can get there in about one-third of the time.",
      "source": "Tatoeba",
      "sourceId": 452562,
      "translationId": 35386
    },
    {
      "id": "advanced-505",
      "level": "advanced",
      "zh": "你决定好要怎么做的时候就打个电话给我吧。",
      "en": "Please telephone me when you have made up your mind what you want to do.",
      "source": "Tatoeba",
      "sourceId": 364847,
      "translationId": 24760
    },
    {
      "id": "advanced-506",
      "level": "advanced",
      "zh": "如果你想变瘦，就应该少点在正餐以外吃零食。",
      "en": "If you want to become thin, you should cut back on the between-meal snacks.",
      "source": "Tatoeba",
      "sourceId": 1085661,
      "translationId": 274106
    },
    {
      "id": "advanced-507",
      "level": "advanced",
      "zh": "我老婆把瓶子打破了，把厨房弄得满地都是牛奶。",
      "en": "There is milk all over the kitchen floor because my wife broke the bottle.",
      "source": "Tatoeba",
      "sourceId": 488220,
      "translationId": 250899
    },
    {
      "id": "advanced-508",
      "level": "advanced",
      "zh": "我的名字在名单中排得最前，所以我第一个被叫进了办工室。",
      "en": "I was called into the office first, my name being at the head of the list.",
      "source": "Tatoeba",
      "sourceId": 700950,
      "translationId": 251971
    },
    {
      "id": "advanced-509",
      "level": "advanced",
      "zh": "如果每周你跑步两三次，你应该可以减肥。",
      "en": "If you went jogging two or three times a week, you could probably lose some weight.",
      "source": "Tatoeba",
      "sourceId": 9401149,
      "translationId": 7781475
    },
    {
      "id": "advanced-510",
      "level": "advanced",
      "zh": "他不是因为想家，而是因为没钱才回来的。",
      "en": "He came back not because he was homesick, but because he was running short of money.",
      "source": "Tatoeba",
      "sourceId": 1252430,
      "translationId": 283511
    },
    {
      "id": "advanced-511",
      "level": "advanced",
      "zh": "我想你迟早会知道在桌面建立一个快捷方式是有多方便。",
      "en": "I think you will find it convenient to put a short-cut on the desktop.",
      "source": "Tatoeba",
      "sourceId": 1767755,
      "translationId": 393814
    },
    {
      "id": "advanced-512",
      "level": "advanced",
      "zh": "孤独的人会孤独，是因为他畏惧他人。",
      "en": "Lonely people tend to be afraid of meeting others, which ensures they will always be lonely.",
      "source": "Tatoeba",
      "sourceId": 884748,
      "translationId": 885702
    },
    {
      "id": "advanced-513",
      "level": "advanced",
      "zh": "我们走的时候下着雨，到的时候有太阳。",
      "en": "It was raining when we left, but by the time we arrived, it was sunny.",
      "source": "Tatoeba",
      "sourceId": 389827,
      "translationId": 2394
    },
    {
      "id": "advanced-514",
      "level": "advanced",
      "zh": "我不得不在电话里等了20分钟才联系到客服代表。",
      "en": "I had to wait 20 minutes on the phone before reaching the customer service rep.",
      "source": "Tatoeba",
      "sourceId": 13527812,
      "translationId": 4058789
    },
    {
      "id": "advanced-515",
      "level": "advanced",
      "zh": "有时从办公室回家的路上他会到这家书店看一看。",
      "en": "Every now and then he drops in at this bookstore on his way home from the office.",
      "source": "Tatoeba",
      "sourceId": 809710,
      "translationId": 38262
    },
    {
      "id": "advanced-516",
      "level": "advanced",
      "zh": "昨天我去衣服店买了一件蓝色的衬衫和三件裤子。",
      "en": "I went to the clothing store yesterday and bought a blue blouse and three pairs of pants.",
      "source": "Tatoeba",
      "sourceId": 3704411,
      "translationId": 9814642
    },
    {
      "id": "advanced-517",
      "level": "advanced",
      "zh": "我在二手书店看到一本书，现在它成为了我最爱的书。",
      "en": "A book I happened to come across at a secondhand bookstore has now become my favorite.",
      "source": "Tatoeba",
      "sourceId": 13519450,
      "translationId": 13161009
    },
    {
      "id": "advanced-518",
      "level": "advanced",
      "zh": "在人际交往中，第一印象决定着将要发生的事情内容的百分之五十以上。",
      "en": "When people meet, first impressions determine more than 50 percent of whatever happens next.",
      "source": "Tatoeba",
      "sourceId": 3086996,
      "translationId": 269966
    },
    {
      "id": "advanced-519",
      "level": "advanced",
      "zh": "根据你所说的话，我认为我们应该重新审视我们的计划。",
      "en": "In the light of what you told us, I think we should revise our plan.",
      "source": "Tatoeba",
      "sourceId": 334050,
      "translationId": 16856
    },
    {
      "id": "advanced-520",
      "level": "advanced",
      "zh": "钱要花很长的时间来赚，但你可以一下子就花掉它了。",
      "en": "Money takes a long time to earn, but you can spend it in no time.",
      "source": "Tatoeba",
      "sourceId": 781174,
      "translationId": 64603
    },
    {
      "id": "advanced-521",
      "level": "advanced",
      "zh": "我们不在的时候，需要有人照看婴儿。",
      "en": "We need someone to keep an eye on our baby while we are away.",
      "source": "Tatoeba",
      "sourceId": 358160,
      "translationId": 247313
    },
    {
      "id": "advanced-522",
      "level": "advanced",
      "zh": "由于错过了火车，我不得不等下一班等一小时。",
      "en": "As I missed the train, I had to wait for the next one for about an hour.",
      "source": "Tatoeba",
      "sourceId": 344002,
      "translationId": 44835
    },
    {
      "id": "advanced-523",
      "level": "advanced",
      "zh": "我的朋友总是三分钟热度，一年就换了三份工作。",
      "en": "My friend has had three jobs in a year; he never sticks to anything for long.",
      "source": "Tatoeba",
      "sourceId": 339188,
      "translationId": 252018
    },
    {
      "id": "advanced-524",
      "level": "advanced",
      "zh": "最后，他的病夺去了他走路的能力，想去哪儿也要用电动轮椅来代步。",
      "en": "In the end, because of the disease, he became unable to walk and had to use a motorized wheelchair to get around.",
      "source": "Tatoeba",
      "sourceId": 1324922,
      "translationId": 38448
    },
    {
      "id": "advanced-525",
      "level": "advanced",
      "zh": "我们的乐队刚起步时，只有小城市里的小俱乐部雇我们。",
      "en": "When we started out, our band could only find small clubs in small cities that would hire us.",
      "source": "Tatoeba",
      "sourceId": 5624958,
      "translationId": 954630
    },
    {
      "id": "advanced-526",
      "level": "advanced",
      "zh": "全盘考虑后，我觉得你应该回家，照顾你的父母。",
      "en": "All things considered, I think you should go back home and take care of your parents.",
      "source": "Tatoeba",
      "sourceId": 865394,
      "translationId": 404076
    },
    {
      "id": "advanced-527",
      "level": "advanced",
      "zh": "筹划旅行的时候，我们必须考虑到全家人的意愿。",
      "en": "We must take into account the wishes of all the family in planning a trip.",
      "source": "Tatoeba",
      "sourceId": 7774822,
      "translationId": 325571
    },
    {
      "id": "advanced-528",
      "level": "advanced",
      "zh": "你还是快点上床睡觉吧，不然感冒会愈来愈严重的。",
      "en": "You had better go to bed right away, or your cold will get worse.",
      "source": "Tatoeba",
      "sourceId": 397024,
      "translationId": 52147
    },
    {
      "id": "advanced-529",
      "level": "advanced",
      "zh": "如果想与客服代表通话，请按三。",
      "en": "If you would like to speak to a customer service representative, please press three.",
      "source": "Tatoeba",
      "sourceId": 13527807,
      "translationId": 2990132
    },
    {
      "id": "advanced-530",
      "level": "advanced",
      "zh": "世界就像是一本书，走一步等于翻了一页。",
      "en": "The world is just like a book, and every step you take is like turning a page.",
      "source": "Tatoeba",
      "sourceId": 4515028,
      "translationId": 4728183
    },
    {
      "id": "advanced-531",
      "level": "advanced",
      "zh": "火车很挤迫，一直驶到了大阪我们都要站着。",
      "en": "The train was so crowded that we were obliged to stand all the way to Osaka.",
      "source": "Tatoeba",
      "sourceId": 344717,
      "translationId": 326141
    },
    {
      "id": "advanced-532",
      "level": "advanced",
      "zh": "山谷中，薄雾如白色羽毛般缓缓升腾，化作一团白云，遮蔽了一切。",
      "en": "Down in the valley a mist like a white feather rose gently into a white cloud, and obscured everything.",
      "source": "Tatoeba",
      "sourceId": 13573405,
      "translationId": 11168106
    },
    {
      "id": "advanced-533",
      "level": "advanced",
      "zh": "长远来说，我们买了这台机器可以省回很多钱。",
      "en": "In the long run, we can save a lot of money by buying this machine.",
      "source": "Tatoeba",
      "sourceId": 685197,
      "translationId": 278071
    },
    {
      "id": "advanced-534",
      "level": "advanced",
      "zh": "他在一周前离开去往欧洲，就是说，是在五月十号。",
      "en": "He left for Europe a week ago, that is, on the tenth of May.",
      "source": "Tatoeba",
      "sourceId": 4844841,
      "translationId": 293698
    },
    {
      "id": "advanced-535",
      "level": "advanced",
      "zh": "你应该为你没有及时回家吃晚餐向你父亲道歉。",
      "en": "You should apologize to your father for not getting home in time for dinner.",
      "source": "Tatoeba",
      "sourceId": 775840,
      "translationId": 387423
    },
    {
      "id": "advanced-536",
      "level": "advanced",
      "zh": "去外国旅行不能不带护照。",
      "en": "A passport is something you cannot do without when you go to a foreign country.",
      "source": "Tatoeba",
      "sourceId": 684838,
      "translationId": 35280
    },
    {
      "id": "advanced-537",
      "level": "advanced",
      "zh": "我正要上床的时候接到了他打来的电话。",
      "en": "I got a phone call from him just as I was about to go to bed.",
      "source": "Tatoeba",
      "sourceId": 1423384,
      "translationId": 1423290
    },
    {
      "id": "advanced-538",
      "level": "advanced",
      "zh": "上学迟到的学生人数比我想像中少很多。",
      "en": "The number of students who were late for school was much smaller than I had expected.",
      "source": "Tatoeba",
      "sourceId": 617150,
      "translationId": 21587
    },
    {
      "id": "advanced-539",
      "level": "advanced",
      "zh": "父亲生前留下来的老古董，原来只是一堆不值钱的垃圾。",
      "en": "The antiques my father left when he died turned out to be nothing but worthless junk.",
      "source": "Tatoeba",
      "sourceId": 617189,
      "translationId": 246357
    },
    {
      "id": "advanced-540",
      "level": "advanced",
      "zh": "我认为我现在有足够的钱买我想要的那辆车。",
      "en": "I think I now have enough money to buy the car that I want.",
      "source": "Tatoeba",
      "sourceId": 8605872,
      "translationId": 8388468
    },
    {
      "id": "advanced-541",
      "level": "advanced",
      "zh": "我们没指望过他在那么短的时间里完成工作。",
      "en": "We did not expect him to finish the task in so short a time.",
      "source": "Tatoeba",
      "sourceId": 813580,
      "translationId": 252320
    },
    {
      "id": "advanced-542",
      "level": "advanced",
      "zh": "我今天早上只吃了一块吐司和喝了一杯咖啡。",
      "en": "I only had a piece of toast and a cup of coffee this morning.",
      "source": "Tatoeba",
      "sourceId": 3364359,
      "translationId": 3364310
    },
    {
      "id": "advanced-543",
      "level": "advanced",
      "zh": "人们或可选择何时开始恋爱，但它的终结却不由人。",
      "en": "People can begin to love when they choose, but they have no choice when it comes to ending love.",
      "source": "Tatoeba",
      "sourceId": 1531718,
      "translationId": 1327645
    },
    {
      "id": "advanced-544",
      "level": "advanced",
      "zh": "对工具箱里只有一把榔头的人来说，所有的问题都像钉子。",
      "en": "To the man who only has a hammer in the toolkit, every problem looks like a nail.",
      "source": "Tatoeba",
      "sourceId": 811119,
      "translationId": 2292
    },
    {
      "id": "advanced-545",
      "level": "advanced",
      "zh": "这个周末去纽约对你来说是不可能的事。",
      "en": "It is out of the question for you to go to New York this weekend.",
      "source": "Tatoeba",
      "sourceId": 785080,
      "translationId": 18033
    },
    {
      "id": "advanced-546",
      "level": "advanced",
      "zh": "我到柜台拿了钥匙，然后就乘电梯去了我房间的楼层。",
      "en": "After asking for my key at the front desk, I took the elevator to my floor.",
      "source": "Tatoeba",
      "sourceId": 431516,
      "translationId": 34053
    },
    {
      "id": "advanced-547",
      "level": "advanced",
      "zh": "我需要某人抱着我并对我说一切会顺利的。",
      "en": "I need someone to hold me and tell me everything will be all right.",
      "source": "Tatoeba",
      "sourceId": 757998,
      "translationId": 10282172
    },
    {
      "id": "advanced-548",
      "level": "advanced",
      "zh": "她被要求去说服他以让他或者他的儿子或者是别的人来粉刷屋子。",
      "en": "She was asked to convince him to get his son or someone else to paint the house.",
      "source": "Tatoeba",
      "sourceId": 1397125,
      "translationId": 887541
    },
    {
      "id": "advanced-549",
      "level": "advanced",
      "zh": "我想挣点钱，所以我一周打三天小时工。",
      "en": "I wanted to earn some money, so I worked part time three days a week.",
      "source": "Tatoeba",
      "sourceId": 9962365,
      "translationId": 5194597
    },
    {
      "id": "advanced-550",
      "level": "advanced",
      "zh": "你出国看看，才会知道日本是多么的细小。",
      "en": "It is not until you go abroad that you realize how small Japan is.",
      "source": "Tatoeba",
      "sourceId": 428997,
      "translationId": 21929
    },
    {
      "id": "advanced-551",
      "level": "advanced",
      "zh": "要是他知道会发生什么，他就会改变计划。",
      "en": "Had he known what was about to happen, he would have changed his plan.",
      "source": "Tatoeba",
      "sourceId": 5624988,
      "translationId": 25139
    },
    {
      "id": "advanced-552",
      "level": "advanced",
      "zh": "你乘出租车去和走路去也没有甚么分别。",
      "en": "It will make little difference whether you go there by taxi or on foot.",
      "source": "Tatoeba",
      "sourceId": 364919,
      "translationId": 71583
    },
    {
      "id": "advanced-553",
      "level": "advanced",
      "zh": "当这位女士得知她已经赢得了百万美元，她真的乐疯了。",
      "en": "The lady really flipped out when she learned she had won a million dollars.",
      "source": "Tatoeba",
      "sourceId": 780041,
      "translationId": 68239
    },
    {
      "id": "advanced-554",
      "level": "advanced",
      "zh": "虽然美国有些私立或教会学校有校服，但校服并不常见。",
      "en": "While some private and church schools in America have uniforms, they are not common.",
      "source": "Tatoeba",
      "sourceId": 13523603,
      "translationId": 67635
    },
    {
      "id": "advanced-555",
      "level": "advanced",
      "zh": "人群把伤者团团围住，但医生来到现场时都让了路给他。",
      "en": "The people crowded round the injured man, but they made way for the doctor when he reached the scene of the accident.",
      "source": "Tatoeba",
      "sourceId": 340159,
      "translationId": 270411
    },
    {
      "id": "advanced-556",
      "level": "advanced",
      "zh": "在日本，在我们的雨季常常下雨，雨季一般在六月中旬至七月中旬。",
      "en": "In Japan, it rains quite a bit during our rainy season which is from mid-June until mid-July.",
      "source": "Tatoeba",
      "sourceId": 2030725,
      "translationId": 1177436
    },
    {
      "id": "advanced-557",
      "level": "advanced",
      "zh": "我想尽快从这个不透气的屋子里出去。",
      "en": "I want to move out of this cramped room as soon as I can.",
      "source": "Tatoeba",
      "sourceId": 819722,
      "translationId": 54677
    },
    {
      "id": "advanced-558",
      "level": "advanced",
      "zh": "他承诺给这个地区带来新的工业，但是政治家很少完成他们的承诺。",
      "en": "He promised to bring new industries to the region, but politicians rarely keep their word.",
      "source": "Tatoeba",
      "sourceId": 353614,
      "translationId": 269155
    },
    {
      "id": "advanced-559",
      "level": "advanced",
      "zh": "我九岁的时候问我妈妈圣诞老人是否真的存在。",
      "en": "I was nine years old when I asked my mom if Santa Claus really existed.",
      "source": "Tatoeba",
      "sourceId": 812363,
      "translationId": 652440
    },
    {
      "id": "advanced-560",
      "level": "advanced",
      "zh": "她受人欢迎，不是因为她漂亮，而是因为她人很好。",
      "en": "She is popular not because she is beautiful, but because she is kind to everyone.",
      "source": "Tatoeba",
      "sourceId": 843875,
      "translationId": 316607
    },
    {
      "id": "advanced-561",
      "level": "advanced",
      "zh": "他天生就是一个和蔼可亲的人，所以很受住在附近的孩子欢迎。",
      "en": "He is by nature a kind person and is popular with the children in his neighborhood.",
      "source": "Tatoeba",
      "sourceId": 1132326,
      "translationId": 300448
    },
    {
      "id": "advanced-562",
      "level": "advanced",
      "zh": "你最喜欢我借给你的哪一本书呢？",
      "en": "Which one of the books that I lent you did you like the best?",
      "source": "Tatoeba",
      "sourceId": 10336107,
      "translationId": 10327594
    },
    {
      "id": "advanced-563",
      "level": "advanced",
      "zh": "我打了电话给你，但却接不通。",
      "en": "I tried to reach you on the phone, but I was unable to get through.",
      "source": "Tatoeba",
      "sourceId": 472950,
      "translationId": 16440
    },
    {
      "id": "advanced-564",
      "level": "advanced",
      "zh": "即使太阳从西边出来，我也不会改变主意。",
      "en": "Even if the sun were to rise in the west, I would not change my mind.",
      "source": "Tatoeba",
      "sourceId": 343986,
      "translationId": 40714
    },
    {
      "id": "advanced-565",
      "level": "advanced",
      "zh": "由于轨道是椭圆形的，行星和太阳之间的距离不会总是相同。",
      "en": "Since the orbits are elliptical, the planets do not always have the same distance from the Sun.",
      "source": "Tatoeba",
      "sourceId": 4272257,
      "translationId": 4344792
    },
    {
      "id": "advanced-566",
      "level": "advanced",
      "zh": "由于他的财富，他能够成为这个俱乐部的成员。",
      "en": "Because of his wealth, he was able to become a member of that club.",
      "source": "Tatoeba",
      "sourceId": 874459,
      "translationId": 476498
    },
    {
      "id": "advanced-567",
      "level": "advanced",
      "zh": "在公园里，我看到一个年轻人躺在一棵樱桃树下的长椅上。",
      "en": "I saw a young man lying on the bench under the cherry tree in the park.",
      "source": "Tatoeba",
      "sourceId": 453753,
      "translationId": 240438
    },
    {
      "id": "advanced-568",
      "level": "advanced",
      "zh": "我们的任务到目前为止很轻松，但从现在开始将会变得很难。",
      "en": "Our task has been easy so far, but it will be difficult from now on.",
      "source": "Tatoeba",
      "sourceId": 332592,
      "translationId": 247532
    },
    {
      "id": "advanced-569",
      "level": "advanced",
      "zh": "我昨晚在床上看书的时候点着灯就睡了。",
      "en": "While I was reading in bed last night, I fell asleep with the light on.",
      "source": "Tatoeba",
      "sourceId": 1446793,
      "translationId": 244847
    },
    {
      "id": "advanced-570",
      "level": "advanced",
      "zh": "如果我知道你病了，怎么也会赶来看你的。",
      "en": "If I had known about your illness, I could have visited you in the hospital.",
      "source": "Tatoeba",
      "sourceId": 403354,
      "translationId": 70413
    },
    {
      "id": "advanced-571",
      "level": "advanced",
      "zh": "他和我简直心有灵犀，才刚说一句，另一方已经回应。",
      "en": "He and I have a near-telepathic understanding of each other. No sooner does one of us say something than the other is already responding.",
      "source": "Tatoeba",
      "sourceId": 1408333,
      "translationId": 284423
    },
    {
      "id": "advanced-572",
      "level": "advanced",
      "zh": "女士们，先生们，由于机场的意外情况，我们的着陆将被推迟。",
      "en": "Ladies and gentlemen, due to an accident at the airport, our arrival will be delayed.",
      "source": "Tatoeba",
      "sourceId": 5558547,
      "translationId": 32256
    },
    {
      "id": "advanced-573",
      "level": "advanced",
      "zh": "站在这个凳子上的话，你可以摸到衣柜顶。",
      "en": "If you stand on this stool, you can reach the top of the closet.",
      "source": "Tatoeba",
      "sourceId": 1944096,
      "translationId": 57645
    },
    {
      "id": "advanced-574",
      "level": "advanced",
      "zh": "随着时间的推移，比赛增加了规则以使之更安全。",
      "en": "As time went on, rules were added to the game to make it safer.",
      "source": "Tatoeba",
      "sourceId": 332589,
      "translationId": 263867
    },
    {
      "id": "advanced-575",
      "level": "advanced",
      "zh": "我一听到那首歌，就想起来我小的时候。",
      "en": "When I heard that song, it reminded me of when I was a kid.",
      "source": "Tatoeba",
      "sourceId": 6150887,
      "translationId": 1451721
    },
    {
      "id": "advanced-576",
      "level": "advanced",
      "zh": "这个工人本来应该在中午十二点到达，但他被交通堵塞困住了几个小时。",
      "en": "The handyman was supposed to arrive at twelve noon, but got stuck in a traffic jam for a few hours.",
      "source": "Tatoeba",
      "sourceId": 778901,
      "translationId": 704605
    },
    {
      "id": "advanced-577",
      "level": "advanced",
      "zh": "如果他们知道会发生那样的事，一定会改用别的计划的。",
      "en": "Had they known what was about to happen, they would have changed their plans.",
      "source": "Tatoeba",
      "sourceId": 422974,
      "translationId": 25149
    },
    {
      "id": "advanced-578",
      "level": "advanced",
      "zh": "这个童话故事很浅白，七岁的小孩也看得懂。",
      "en": "This fairy tale is easy enough for a seven-year-old child to read.",
      "source": "Tatoeba",
      "sourceId": 4193501,
      "translationId": 57634
    },
    {
      "id": "advanced-579",
      "level": "advanced",
      "zh": "我和她在公司里职位相同，但她赚的钱比我多。",
      "en": "She and I hold the same position in the company, but she earns more than I do.",
      "source": "Tatoeba",
      "sourceId": 1218267,
      "translationId": 1560311
    },
    {
      "id": "advanced-580",
      "level": "advanced",
      "zh": "我养了一只猫和一只狗。猫是黑色的，狗是白色的。",
      "en": "I have a cat and a dog. The cat is black and the dog is white.",
      "source": "Tatoeba",
      "sourceId": 458154,
      "translationId": 255347
    },
    {
      "id": "advanced-581",
      "level": "advanced",
      "zh": "他用五分钟就把我烦脑了两个小时的问题解决了。",
      "en": "He solved the problem in five minutes that I had struggled with for two hours.",
      "source": "Tatoeba",
      "sourceId": 1590745,
      "translationId": 288148
    },
    {
      "id": "advanced-582",
      "level": "advanced",
      "zh": "我们听见自己说话的回音从山谷的另一边传了回来。",
      "en": "We heard the echo of our voices from the other side of the valley.",
      "source": "Tatoeba",
      "sourceId": 502619,
      "translationId": 247590
    },
    {
      "id": "advanced-583",
      "level": "advanced",
      "zh": "他的信写得很亲切，她读了以后不禁感动得哭了起来。",
      "en": "So friendly was his letter that she was deeply moved and began to cry.",
      "source": "Tatoeba",
      "sourceId": 436022,
      "translationId": 67722
    },
    {
      "id": "advanced-584",
      "level": "advanced",
      "zh": "因为空气污染的问题，也许有一天自行车会取代汽车。",
      "en": "Because of the problem of air pollution, the bicycle may some day replace the automobile.",
      "source": "Tatoeba",
      "sourceId": 2807834,
      "translationId": 18228
    },
    {
      "id": "advanced-585",
      "level": "advanced",
      "zh": "美国的第十六任总统亚伯拉罕·林肯是在肯塔基州的一间木屋中出生的。",
      "en": "Abraham Lincoln, the 16th president of the United States, was born in a log cabin in Kentucky.",
      "source": "Tatoeba",
      "sourceId": 596684,
      "translationId": 241323
    },
    {
      "id": "advanced-586",
      "level": "advanced",
      "zh": "我花园里的一部分玫瑰是白色的，其他的是红色的。",
      "en": "Some of the roses in my garden are white, and the others are red.",
      "source": "Tatoeba",
      "sourceId": 423408,
      "translationId": 278485
    },
    {
      "id": "advanced-587",
      "level": "advanced",
      "zh": "在所有的游戏里有最重要的特点：它们都拥有法则。",
      "en": "The most important feature of all games is that they are governed by rules.",
      "source": "Tatoeba",
      "sourceId": 1872719,
      "translationId": 67418
    },
    {
      "id": "advanced-588",
      "level": "advanced",
      "zh": "叉子放在盘子的左边，刀子放在右边。",
      "en": "Forks go to the left side of the plate, and knives go to the right.",
      "source": "Tatoeba",
      "sourceId": 13539392,
      "translationId": 5335437
    },
    {
      "id": "advanced-589",
      "level": "advanced",
      "zh": "那间旧屋里只有一张床，所以我们便轮流睡觉。",
      "en": "The old cottage had only one bed, so we all took turns sleeping in it.",
      "source": "Tatoeba",
      "sourceId": 800862,
      "translationId": 48167
    },
    {
      "id": "advanced-590",
      "level": "advanced",
      "zh": "假如能回到过去让人生再来一遍的话，你希望能回到几岁的时候？",
      "en": "If you could go back and start your life again, from what age would you like to start?",
      "source": "Tatoeba",
      "sourceId": 8751010,
      "translationId": 1153258
    },
    {
      "id": "advanced-591",
      "level": "advanced",
      "zh": "如果你想去，就去好了。如果你不想去，那也没什么大不了的。",
      "en": "If you want to go, then go. If you don't want to, then it's no big deal.",
      "source": "Tatoeba",
      "sourceId": 2456037,
      "translationId": 941358
    },
    {
      "id": "advanced-592",
      "level": "advanced",
      "zh": "快要到早上的繁忙时段了，我们还不出发就要堵车了。",
      "en": "If we don't hit the road soon, we'll get caught in the morning rush hour traffic.",
      "source": "Tatoeba",
      "sourceId": 413246,
      "translationId": 52170
    },
    {
      "id": "advanced-593",
      "level": "advanced",
      "zh": "我并不反对你出去工作，可是小孩靠谁来照看呢？",
      "en": "I don't object to your going out to work, but who will look after the children?",
      "source": "Tatoeba",
      "sourceId": 347730,
      "translationId": 17774
    },
    {
      "id": "advanced-594",
      "level": "advanced",
      "zh": "如果你想做对一件事，有时候你得亲力亲为。",
      "en": "If you want something to be done right, sometimes you've just got to do it yourself.",
      "source": "Tatoeba",
      "sourceId": 3087001,
      "translationId": 1617661
    },
    {
      "id": "advanced-595",
      "level": "advanced",
      "zh": "我不知道你今天回家之前本来是要那样做。",
      "en": "I didn't know that you were planning on doing that before you went home today.",
      "source": "Tatoeba",
      "sourceId": 13807606,
      "translationId": 7501040
    },
    {
      "id": "advanced-596",
      "level": "advanced",
      "zh": "如果看起来像个苹果而且吃起来也像苹果的话，可能就是苹果。",
      "en": "If it looks like an apple and it tastes like an apple, it's probably an apple.",
      "source": "Tatoeba",
      "sourceId": 1438412,
      "translationId": 1078801
    },
    {
      "id": "advanced-597",
      "level": "advanced",
      "zh": "要是我知道会发生这种事，那我死活不同意。",
      "en": "If I'd known that it would come to this, I would have never consented.",
      "source": "Tatoeba",
      "sourceId": 9970725,
      "translationId": 4053216
    },
    {
      "id": "advanced-598",
      "level": "advanced",
      "zh": "幸福家庭的幸福原因全都大同小异，但悲惨的家庭却往往各自有各自的惨法。",
      "en": "All happy families resemble each other, each unhappy family is unhappy in its own way.",
      "source": "Tatoeba",
      "sourceId": 1324075,
      "translationId": 51759
    },
    {
      "id": "advanced-599",
      "level": "advanced",
      "zh": "我会找个地方安顿下来，然后结婚生子的，但这是以后的事。",
      "en": "Eventually I'd like to settle down and have a family, but not yet.",
      "source": "Tatoeba",
      "sourceId": 358970,
      "translationId": 66476
    },
    {
      "id": "advanced-600",
      "level": "advanced",
      "zh": "你一路往前走，过了红绿灯就到了。",
      "en": "Go straight down the road, and when you pass the traffic light you're there.",
      "source": "Tatoeba",
      "sourceId": 391130,
      "translationId": 622359
    }
  ];

  window.ADDITIONAL_SENTENCES = sentences;
})();
