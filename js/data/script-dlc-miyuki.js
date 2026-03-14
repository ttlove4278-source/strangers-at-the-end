const SCRIPT_DLC_MIYUKI = {
  chapter: 'dlc',
  title: '夏天結束之前',

  // DLC独立状态
  state: {
    daysLeft: 155,
    wordsWritten: 0,
    wordsMax: 100,
    currentDay: '1994.03.03',
    letters: [],
  },

  poem: {
    lines: [
      '哥哥',
      '如果你在读这封信',
      '那说明夏天已经结束了',
      '但是没关系',
      '因为我把夏天',
      '写在了信里',
    ],
    highlight: [0, 5],
    author: '——夏目 深雪·病房'
  },

  scenes: [
    // === 序：发病 ===
    {
      id: 'dlc_prologue',
      location: { time: '1994年3月3日', place: '櫂町综合医院·小儿科' },
      bgColor: '#f0ece0',
      dlcStyle: true,
      nodes: [
        { type: 'narration', text: '医院的天花板很白。\n数过了。上面有三十二个小洞。\n\n——不对。三十三个。刚才数错了。', pace: 'slow', dlcNarration: true },
        { type: 'narration', text: '妈妈在哭。\n爸爸没有哭，但他的手在抖。\n\n医生说了很长的话。\n我没有全部听懂。\n但我听懂了一个词。', dlcNarration: true },
        { type: 'narration', text: '——白血病。\n\n这三个字念起来很轻。\n像是一阵风就能吹走。\n但大人们的脸色说明它很重。', pace: 'slow', dlcNarration: true },
        { type: 'narration', text: '哥哥不在。\n哥哥在学校。\n\n我想，等哥哥来了，我要跟他说：\n「没事的。天花板上有三十三个洞。我数过了。」\n\n这样他就不会担心了。\n……大概。', dlcNarration: true },
        { type: 'narration', text: '155天。\n\n——不是医生说的。\n是我自己算的。\n从三月到八月，大概155天。\n\n一个夏天的长度。', pace: 'dramatic', dlcNarration: true },
        { type: 'dlc_days', days: 155 },
        { type: 'goto', target: 'dlc_ch1' }
      ]
    },

    // === 第一章：三月·入院 ===
    {
      id: 'dlc_ch1',
      location: { time: '1994年3月15日', place: '病房·302号' },
      bgColor: '#e8e4d8',
      dlcStyle: true,
      nodes: [
        { type: 'narration', text: '病房里有一扇窗户。\n可以看到停车场。\n\n停车场旁边有一棵树。\n不知道是什么树。还没开花。', dlcNarration: true },
        { type: 'narration', text: '哥哥今天来了。\n他带了宝矿力。和一本很厚的书。\n\n书名很奇怪——《西西弗神话》。\n\n我问他这是什么。\n他说是关于一个推石头的人。', dlcNarration: true },
        { type: 'dialogue', speaker: 'miyuki', text: '推石头？为什么要推石头？', position: 'left' },
        { type: 'dialogue', speaker: 'haku', text: '……因为石头会从山顶滚下来。\n所以要一直推。', position: 'right' },
        { type: 'dialogue', speaker: 'miyuki', text: '那他推上去之后石头又会滚下来？', position: 'left' },
        { type: 'dialogue', speaker: 'haku', text: '嗯。', position: 'right' },
        { type: 'dialogue', speaker: 'miyuki', text: '那他为什么不找别人帮忙？', position: 'left' },
        { type: 'narration', text: '哥哥看着我。\n想了一会儿。\n然后说——', dlcNarration: true },
        { type: 'dialogue', speaker: 'haku', text: '……大概是因为没有别人。', position: 'right' },
        { type: 'narration', text: '我觉得这很寂寞。\n一个人推石头。一直推。\n\n如果是我的话——\n我会在旁边帮他推。\n\n至少他就不是一个人了。', pace: 'slow', dlcNarration: true },
        {
          type: 'choice',
          choices: [
            { text: '「那我帮他推！」', tag: 'cheerful', next: 'dlc_ch1_a' },
            { text: '「……他不觉得累吗？」', tag: 'quiet', next: 'dlc_ch1_b' },
          ]
        }
      ]
    },
    {
      id: 'dlc_ch1_a',
      nodes: [
        { type: 'dialogue', speaker: 'haku', text: '……你推不动。', position: 'right' },
        { type: 'dialogue', speaker: 'miyuki', text: '推不动也要推！\n两个人推不动的话就三个人推！', position: 'left' },
        { type: 'narration', text: '哥哥没有笑。\n但他的嘴角动了一下。\n很小的一下。\n\n我看到了。', pace: 'slow', dlcNarration: true },
        { type: 'dlc_days', days: 143 },
        { type: 'goto', target: 'dlc_ch2' },
      ]
    },
    {
      id: 'dlc_ch1_b',
      nodes: [
        { type: 'dialogue', speaker: 'haku', text: '……书上说，他是幸福的。', position: 'right' },
        { type: 'dialogue', speaker: 'miyuki', text: '推石头怎么会幸福呢？', position: 'left' },
        { type: 'dialogue', speaker: 'haku', text: '我也不知道。', position: 'right' },
        { type: 'narration', text: '我想了很久。\n\n大概……\n推石头的时候不会去想其他事吧。\n不会想天花板上有几个洞。\n不会想血液检查的结果。\n\n只想着石头。\n\n这样的话——也许确实是幸福的。', pace: 'slow', dlcNarration: true },
        { type: 'dlc_days', days: 143 },
        { type: 'goto', target: 'dlc_ch2' },
      ]
    },

    // === 第二章：五月·日常 ===
    {
      id: 'dlc_ch2',
      location: { time: '1994年5月8日', place: '病房·302号' },
      bgColor: '#e5e0d5',
      dlcStyle: true,
      nodes: [
        { type: 'narration', text: '窗外的树开花了。\n白色的。小小的。\n\n护士姐姐说那是梅树。\n「梅花不说话，但是在听。」\n\n……我觉得这个说法很好。', dlcNarration: true },
        { type: 'narration', text: '今天做了骨髓穿刺。\n很痛。\n\n但我没有哭。\n\n……不是因为勇敢。\n是因为哭了的话，哥哥会更难过。\n哥哥难过的样子比针还痛。', pace: 'slow', dlcNarration: true },
        { type: 'narration', text: '哥哥每天都来。\n每次都带宝矿力。\n有时候读书给我听。\n\n——推石头的人。西西弗。\n\n我已经记住他的名字了。\n\n一个法国人写的。名字叫——加缪。\n很难念。', dlcNarration: true },
        { type: 'narration', text: '哥哥读书的时候很认真。\n声音很低。\n有时候读着读着会停下来。\n然后看着窗外。\n\n我不知道他在看什么。\n大概在看梅树吧。', dlcNarration: true },
        {
          type: 'choice',
          choices: [
            { text: '「哥哥，你在想什么？」', tag: 'ask', next: 'dlc_ch2_a' },
            { text: '（安静地喝宝矿力）', tag: 'quiet', next: 'dlc_ch2_b' },
          ]
        }
      ]
    },
    {
      id: 'dlc_ch2_a',
      nodes: [
        { type: 'dialogue', speaker: 'haku', text: '……没有。在看树。', position: 'right' },
        { type: 'dialogue', speaker: 'miyuki', text: '骗人。你在想很难的事情。', position: 'left' },
        { type: 'dialogue', speaker: 'haku', text: '……嗯。', position: 'right' },
        { type: 'dialogue', speaker: 'miyuki', text: '不要想很难的事情。\n想很难的事情会变成推石头的人。', position: 'left' },
        { type: 'narration', text: '哥哥看着我。\n然后说了一句我不太懂的话——', dlcNarration: true },
        { type: 'dialogue', speaker: 'haku', text: '……你说得对。', position: 'right' },
        { type: 'dlc_days', days: 89 },
        { type: 'goto', target: 'dlc_ch3' },
      ]
    },
    {
      id: 'dlc_ch2_b',
      nodes: [
        { type: 'narration', text: '我没有问。\n\n有时候不问比问更好。\n\n宝矿力的味道。\n和昨天一样。\n这样就好。', pace: 'slow', dlcNarration: true },
        { type: 'dlc_days', days: 89 },
        { type: 'goto', target: 'dlc_ch3' },
      ]
    },

    // === 第三章：七月·盛夏 ===
    {
      id: 'dlc_ch3',
      location: { time: '1994年7月20日', place: '病房·302号' },
      bgColor: '#e0dcd0',
      dlcStyle: true,
      nodes: [
        { type: 'narration', text: '好热。\n空调开着，但还是热。\n\n蝉在叫。\n从窗户缝隙里钻进来的声音。\n\n它们大概很努力吧。\n从地下爬出来，只有一个夏天可以叫。', dlcNarration: true },
        { type: 'narration', text: '我也只有一个夏天了。\n\n不是悲伤。\n是数学。\n155天减去139天等于16天。\n\n——16天。', pace: 'slow', dlcNarration: true },
        { type: 'narration', text: '哥哥今天没有读书。\n他坐在床边。\n手里拿着宝矿力。\n但没有打开。\n\n他在看我。\n不是平时那种看。\n是那种——想说什么但说不出来的看。', dlcNarration: true },
        { type: 'dialogue', speaker: 'miyuki', text: '哥哥。', position: 'left' },
        { type: 'dialogue', speaker: 'haku', text: '嗯。', position: 'right' },
        { type: 'dialogue', speaker: 'miyuki', text: '你是不是想说什么？', position: 'left' },
        { type: 'dialogue', speaker: 'haku', text: '……没有。', position: 'right' },
        { type: 'dialogue', speaker: 'miyuki', text: '骗人。', position: 'left' },
        { type: 'narration', text: '沉默。\n蝉还在叫。\n\n空调的水滴在外机上。\n啪嗒。啪嗒。\n\n像很小的时钟。', pace: 'slow', dlcNarration: true },
        {
          type: 'choice',
          choices: [
            { text: '「哥哥，我想写一封信。」', tag: 'letter', next: 'dlc_letter_1' },
            { text: '「……没关系。你不用说。」', tag: 'gentle', next: 'dlc_ch3_gentle' },
          ]
        }
      ]
    },
    {
      id: 'dlc_ch3_gentle',
      nodes: [
        { type: 'narration', text: '我伸出手。\n碰了碰他的手背。\n\n他的手很凉。\n在这么热的天，他的手居然是凉的。\n\n……他大概一直在害怕。\n比我更害怕。', pace: 'slow', dlcNarration: true },
        { type: 'narration', text: '我想——\n我必须比他更坚强。\n\n不是为了我自己。\n是为了让他以后不用一个人推石头的时候\n觉得太寂寞。', pace: 'slow', dlcNarration: true },
        { type: 'goto', target: 'dlc_letter_1' },
      ]
    },

    // === 写信 ===
    {
      id: 'dlc_letter_1',
      location: { time: '1994年8月3日', place: '病房·302号·深夜' },
      bgColor: '#d8d4c8',
      dlcStyle: true,
      nodes: [
        { type: 'narration', text: '八月三日。深夜。\n哥哥回家了。\n\n病房很安静。\n只有心电监护仪的声音。\n\n嘀。嘀。嘀。\n\n——我还活着。\n这台机器在帮我确认。', pace: 'slow', dlcNarration: true },
        { type: 'narration', text: '我从枕头底下拿出纸和笔。\n护士姐姐给的信纸。上面印着海豚。\n\n蓝色的海豚。\n\n我要写一封信。\n给哥哥。\n\n但不是现在给他。\n是——以后给他。\n\n等他需要的时候。', pace: 'slow', dlcNarration: true },
        { type: 'dlc_letter', date: '1994年8月3日 深夜', text: '哥哥，\n\n如果你在读这封信，\n那说明你打开了床下的纸箱。\n\n你大概犹豫了很久吧。\n没关系。我等得起。\n\n如果你要推石头——\n我会在旁边帮你推。\n\n推不动也没关系。\n两个人推不动的话，\n就休息一下再推。\n\n西西弗是幸福的。\n因为推石头的时候\n不用想其他事情。\n\n但是哥哥，\n你不是西西弗。\n你是夏目珀。\n\n你可以停下来。\n你可以不推。\n你可以——\n\n只是活着就好。' },
        { type: 'dlc_days', days: 2 },
        { type: 'goto', target: 'dlc_letter_2' }
      ]
    },

    // === 最后一封信 ===
    {
      id: 'dlc_letter_2',
      location: { time: '1994年8月4日', place: '病房·302号·深夜' },
      bgColor: '#d0ccc0',
      dlcStyle: true,
      nodes: [
        { type: 'narration', text: '八月四日。\n剩余一天。\n\n不是医生说的。\n是身体告诉我的。\n\n很累。但不痛。\n像是水在慢慢退潮。', pace: 'slow', dlcNarration: true },
        { type: 'narration', text: '我又拿出信纸。\n\n这次不写长的了。\n只写一句话就好。\n\n因为最重要的话\n不需要很多字。', dlcNarration: true },
        { type: 'dlc_letter', date: '1994年8月4日 深夜', text: '哥哥，\n\n我想被你亲一下。\n额头也好。脸颊也好。\n\n这样我就知道，\n夏天结束之后，\n你还是会记得我。\n\n\n深雪' },
        { type: 'narration', text: '我把信夹在《西西弗神话》的第43页和44页之间。\n\n然后把书放回床头。\n\n纸上有一个圆形的水渍。\n不知道什么时候留下的。\n\n……大概是宝矿力吧。', pace: 'slow', dlcNarration: true },
        { type: 'dlc_days', days: 1 },
        { type: 'goto', target: 'dlc_ending' }
      ]
    },

    // === 终幕 ===
    {
      id: 'dlc_ending',
      location: { time: '1994年8月5日 16:00', place: '病房·302号' },
      bgColor: '#c8c4b8',
      dlcStyle: true,
      nodes: [
        { type: 'narration', text: '八月五日。下午四点。\n\n窗外的梅树。\n花早就谢了。\n叶子很绿。很密。\n\n阳光穿过叶子。\n在地上画了很多小圆圈。', pace: 'slow', dlcNarration: true },
        { type: 'narration', text: '哥哥在旁边。\n他握着我的手。\n\n他的手今天是暖的。\n\n……太好了。', dlcNarration: true },
        { type: 'narration', text: '我想说话。\n但声音出不来了。\n\n没关系。\n想说的话都写在信里了。', dlcNarration: true },
        { type: 'narration', text: '嘀。嘀。嘀。\n\n心电监护仪还在响。\n\n但声音越来越远了。\n像是有人在慢慢调低音量。', pace: 'slow', dlcNarration: true },
        { type: 'narration', text: '蝉在叫。\n从窗户缝隙里。\n很远。很远。\n\n但我听到了。\n\n——一个夏天。\n它们只有一个夏天。\n\n我也只有一个夏天。\n\n但这个夏天里有宝矿力。\n有梅树。\n有蝉鸣。\n有哥哥。\n\n——足够了。', pace: 'slow', dlcNarration: true },
        { type: 'narration', text: '嘀。\n\n嘀。\n\n\n嘀——————', pace: 'dramatic', dlcNarration: true },
        { type: 'effect', effect: 'fade_black', duration: 3000 },
        { type: 'dlc_days', days: 0 },
        { type: 'narration', text: '1994年8月5日 16:32\n\n夏目深雪\n永眠\n\n享年十一岁', style: 'chapter_end', pace: 'dramatic' },
        { type: 'effect', effect: 'fade_black', duration: 2000 },
        { type: 'narration', text: '——「夏天結束之前」 完——', style: 'chapter_end', pace: 'dramatic' },
        { type: 'narration', text: '第43页和44页之间。\n有一封信。\n和一个圆形的水渍。\n\n五年后，他会打开。\n\n……大概。', pace: 'slow', style: 'chapter_end' },
        { type: 'dlc_end' }
      ]
    }
  ]
};
