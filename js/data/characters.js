const CHARACTERS = {
  haku: {
    id: 'haku',
    name: '夏目 珀',
    nameShort: '珀',
    color: '#FF6B35',
    philosopher: '加缪',
    ability: '西西弗的愉悦',
    proposition: '我们必须想象西西弗是幸福的。',
    silhouetteChar: '珀',
    signature: 'A.Camus',
    stats: { hp: 100, hpMax: 100, logos: 6.2, logosMax: 10, speed: 7, resolve: 8 },
    skills: {
      quotes: [
        { name: '凝视深渊', desc: '强化压迫感', cost: 0.8, power: 12, type: 'attack' },
        { name: '正午之思', desc: '恢复意志', cost: 0.5, power: 8, type: 'heal' },
      ],
      propositions: [
        {
          name: '西西弗的愉悦',
          desc: '死亡重置·3秒',
          cost: 3,
          power: 0,
          type: 'special',
          declaration: '「我们必须想象西西弗是幸福的。」'
        }
      ]
    }
  },
  hikaru: {
    id: 'hikaru',
    name: '御厨 光',
    nameShort: '光',
    color: '#9B59B6',
    philosopher: '柏拉图',
    ability: '洞穴',
    proposition: '世界是投影。',
    silhouetteChar: '光',
    signature: 'Plato',
    stats: { hp: 70, hpMax: 70, logos: 5.0, logosMax: 12, speed: 5, resolve: 4 }
  },
  rei: {
    id: 'rei',
    name: '高城 黎',
    nameShort: '黎',
    color: '#FFD700',
    philosopher: '尼采',
    ability: '超人·角斗场',
    proposition: '上帝已死。',
    silhouetteChar: '黎',
    signature: 'F.Nietzsche',
    stats: { hp: 150, hpMax: 150, logos: 100, logosMax: 999, speed: 9, resolve: 10 }
  },
  toya: {
    id: 'toya',
    name: '久我 冻夜',
    nameShort: '冻夜',
    color: '#4A90D9',
    philosopher: '康德',
    ability: '纯粹理性批判',
    proposition: '人为自然立法。',
    silhouetteChar: '冻',
    signature: 'I.Kant',
    stats: { hp: 120, hpMax: 120, logos: 42, logosMax: 42, speed: 6, resolve: 9 }
  },
  miyuki: {
    id: 'miyuki',
    name: '夏目 深雪',
    nameShort: '深雪',
    color: '#87CEEB',
    silhouetteChar: '雪',
    deceased: true
  }
};

const ENEMIES = {
  bentham_patient: {
    id: 'bentham_patient',
    name: '边沁系患者',
    nameShort: '患者',
    color: '#E74C3C',
    philosopher: '边沁',
    ability: '最大幸福',
    proposition: '最大多数的最大幸福。',
    silhouetteChar: '算',
    signature: 'J.Bentham',
    stats: { hp: 80, hpMax: 80, logos: 5.0, logosMax: 8, speed: 4, resolve: 3 },
    skills: [
      { name: '功利计算', power: 10, cost: 1, type: 'attack' },
      { name: '快乐原理', power: 15, cost: 2, type: 'attack' },
      { name: '全景监狱', power: 0, cost: 3, type: 'debuff', declaration: '「最大多数的最大幸福！」' }
    ],
    ai: 'aggressive',
    drops: { logos: 2, crystal: -3 },
    battleIntro: '一个中年男人堵在商店街入口。\n眼睛里全是数字。\n他在计算每个路人的"幸福指数"。',
    battleOutro: '数字从他的瞳孔褪去。\n他跪在地上，喘着粗气。\n\n「……我只是想让大家都幸福……」'
  }
};
