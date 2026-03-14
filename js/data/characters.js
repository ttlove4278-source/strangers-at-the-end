const CHARACTERS = {
  haku: {
    id: 'haku', name: '夏目 珀', nameShort: '珀', color: '#FF6B35',
    philosopher: '加缪', ability: '西西弗的愉悦',
    proposition: '我们必须想象西西弗是幸福的。',
    silhouetteChar: '珀', signature: 'A.Camus',
    stats: { hp: 100, hpMax: 100, logos: 6.2, logosMax: 10, speed: 7, resolve: 8 },
    skills: {
      quotes: [
        { name: '凝视深渊', desc: '压迫敌方意志', cost: 0.8, power: 12, type: 'attack' },
        { name: '正午之思', desc: '确认自我·回复HP', cost: 0.5, power: 15, type: 'heal' },
        { name: '异乡人的冷漠', desc: '降低敌方攻击', cost: 0.6, power: 0, type: 'debuff' },
      ],
      propositions: [
        { name: '西西弗的愉悦', desc: '死亡重置·3秒', cost: 3, power: 0, type: 'special',
          declaration: '「我们必须想象西西弗是幸福的。」' }
      ]
    },
    archiveEntry: {
      code: 'K-1999-0701', classification: '协助者',
      bio: '17岁。櫂町高校二年三组。已死327次。每次都记得。\n加缪系论证者。能力：「西西弗的愉悦」——死亡后自动重置至3秒前。\n代价：保留全部死亡记忆。\n\n妹妹深雪于1994年8月5日去世。遗物收在床下纸箱里。五年未打开。',
      quote: '「也没什么别的事可做。」'
    }
  },
  hikaru: {
    id: 'hikaru', name: '御厨 光', nameShort: '光', color: '#9B59B6',
    philosopher: '柏拉图', ability: '洞穴',
    proposition: '世界是投影。',
    silhouetteChar: '光', signature: 'Plato',
    stats: { hp: 70, hpMax: 70, logos: 5.0, logosMax: 12, speed: 5, resolve: 4 },
    archiveEntry: {
      code: 'K-1999-0628', classification: '四等论证者·预后不良',
      bio: '17岁。櫂町高校二年三组。书包挂件是磨损严重的塑料海豚。\n柏拉图系论证者。能力：「洞穴」——看穿事物的理念原型。\n代价：看见的真理越多，越无法与人沟通。\n预后42天。第33天仍在存活。\n\n小学三年级时问过母亲："我们现在说话，会不会是有人在梦里梦见我们？"',
      quote: '「……明天也来吗？」'
    }
  },
  rei: {
    id: 'rei', name: '高城 黎', nameShort: '黎', color: '#FFD700',
    philosopher: '尼采', ability: '超人·角斗场',
    proposition: '上帝已死。',
    silhouetteChar: '黎', signature: 'F.Nietzsche',
    stats: { hp: 150, hpMax: 150, logos: 100, logosMax: 999, speed: 9, resolve: 10 },
    archiveEntry: {
      code: 'K-1997-1122', classification: '一等论证者·特级警戒',
      bio: '17岁。櫂町高校三年四组。学生会会长。金发（哲学症副作用）。\n尼采系论证者。能力：「超人·角斗场」——领域内弱者无法伤害强者。\n代价：无法相信任何人的善意。\n\n父亲三年前跳海自杀。遗物《查拉图斯特拉》扉页写着：「给黎——恨是容易的，爱是困难的。」',
      quote: '「你为什么还不认输？」'
    }
  },
  toya: {
    id: 'toya', name: '久我 冻夜', nameShort: '冻夜', color: '#4A90D9',
    philosopher: '康德', ability: '纯粹理性批判',
    proposition: '人为自然立法。',
    silhouetteChar: '冻', signature: 'I.Kant',
    stats: { hp: 120, hpMax: 120, logos: 42, logosMax: 42, speed: 6, resolve: 9 },
    archiveEntry: {
      code: '№9-3', classification: '九课现场指挥官',
      bio: '34岁。藏青西装。鬓角有白发。公文包内层缝着妻子的便签。\n康德系论证者。能力：「纯粹理性批判」——识别并借用超常规则。\n制约：不可将自己视为例外。无法为自己使用能力。\n\n妻子于1995年3月结晶化。便签内容：「记得吃午饭」。七年没扔，也没再看。',
      quote: '「这不是今天的问题。」'
    }
  },
  miyuki: {
    id: 'miyuki', name: '夏目 深雪', nameShort: '深雪', color: '#87CEEB',
    silhouetteChar: '雪', deceased: true,
    archiveEntry: {
      code: 'K-1994-0312', classification: '已故·非论证者',
      bio: '11岁。夏目珀的妹妹。黑发齐刘海，笑的时候露出虎牙。\n1994年3月急性白血病发病，8月5日去世。\n住院期间哥哥常带宝矿力，读《西西弗神话》给她听。\n\n遗物中有两封未寄出的信——\n一封说："如果你要推石头——我会在旁边帮你推。"\n另一封说："我想被你亲一下。额头也好。脸颊也好。"',
      quote: '「哥哥，明天可以亲我一下吗？」'
    }
  },
  fujimori: {
    id: 'fujimori', name: '藤森 明', nameShort: '藤森', color: '#c0c0c0',
    philosopher: '帕斯卡', ability: '芦苇/无限空间',
    silhouetteChar: '藤', signature: 'B.Pascal',
    archiveEntry: {
      code: 'K-1997-0301', classification: '逻各斯测定不能',
      bio: '35岁（看起来像50）。头发全白。旧港高架桥下定居三年四个月。\n帕斯卡系论证者。能力：「芦苇」——存在感稀释至透明。\n代价：每次使用，忘记一件关于妻子的事。\n\n妻子梢，妊娠七个月时母子同时结晶化。\n他还记得的：她的名字叫梢；1994年6月一起去别府，她穿藏青色泳衣，说水很冷。',
      quote: '（沉默）'
    }
  },
  horita: {
    id: 'horita', name: '堀田 诚', nameShort: '堀田', color: '#27AE60',
    philosopher: '卢梭', ability: '社会契约',
    silhouetteChar: '堀', signature: 'J.J.Rousseau',
    archiveEntry: {
      code: 'C-1999-0423', classification: '四等论证者',
      bio: '23岁。站前广场免费报纸分发员。圆脸。荧光绿背心。\n卢梭系论证者。能力：「社会契约」——暂时解除社会关系契约。\n代价：每次使用，忘记一点"为什么想当老师"。\n\n早稻田教育学部中退。实习时未能帮助被霸凌的学生。\n学生母亲寄来感谢信。他至今未读。',
      quote: '「你要记得我哦。」——流浪儿童对他说的话'
    }
  }
};

const ENEMIES = {
  bentham_patient: {
    id: 'bentham_patient', name: '边沁系患者', nameShort: '患者',
    color: '#E74C3C', philosopher: '边沁', ability: '最大幸福',
    proposition: '最大多数的最大幸福。',
    silhouetteChar: '算', signature: 'J.Bentham',
    stats: { hp: 80, hpMax: 80, logos: 5.0, logosMax: 8, speed: 4, resolve: 3 },
    skills: [
      { name: '功利计算', power: 10, cost: 1, type: 'attack' },
      { name: '快乐原理', power: 15, cost: 2, type: 'attack' },
      { name: '全景监狱', power: 0, cost: 3, type: 'debuff', declaration: '「最大多数的最大幸福！」' }
    ],
    drops: { logos: 2, crystal: -3 },
    battleIntro: '一个中年男人堵在商店街入口。\n眼睛里全是数字。\n他在计算每个路人的"幸福指数"。',
  },
  nietzsche_student: {
    id: 'nietzsche_student', name: '尼采系少年', nameShort: '少年',
    color: '#DAA520', philosopher: '尼采(不完全)', ability: '永恒回归(未觉醒)',
    proposition: '我就是超人。',
    silhouetteChar: '超', signature: 'F.N.?',
    stats: { hp: 65, hpMax: 65, logos: 4.0, logosMax: 6, speed: 8, resolve: 2 },
    skills: [
      { name: '权力意志(伪)', power: 8, cost: 1, type: 'attack' },
      { name: '偶像的黄昏', power: 18, cost: 3, type: 'attack', declaration: '「我就是超人！」' },
    ],
    drops: { logos: 1, crystal: -2 },
    battleIntro: '一个穿着改造制服的少年。\n瞳孔签名模糊不清——不完全觉醒。\n他相信自己是超人。\n\n……他错了。但这不重要。',
  },
  descartes_ghost: {
    id: 'descartes_ghost', name: '笛卡尔之影', nameShort: '影',
    color: '#708090', philosopher: '笛卡尔', ability: '方法的怀疑',
    proposition: '我思故我在。',
    silhouetteChar: '疑', signature: 'R.Descartes',
    stats: { hp: 90, hpMax: 90, logos: 7.0, logosMax: 10, speed: 6, resolve: 7 },
    skills: [
      { name: '方法怀疑', power: 12, cost: 1.5, type: 'attack' },
      { name: '恶魔假说', power: 0, cost: 2, type: 'debuff', declaration: '「如果这一切都是恶魔的欺骗——」' },
      { name: '我思故我在', power: 22, cost: 4, type: 'attack', declaration: '「我思——故我在。」' },
    ],
    drops: { logos: 3, crystal: -4 },
    battleIntro: '图书馆哲学区。\n一个理论结晶正在共振——笛卡尔系。\n半透明的人影从结晶中浮现。\n\n这不是人。是残留的思想本身。',
  }
};
