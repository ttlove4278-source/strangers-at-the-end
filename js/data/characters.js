/**
 * 《世纪末異鄉人》角色数据
 */
const CHARACTERS = {
  haku: {
    id: 'haku',
    name: '夏目 珀',
    nameShort: '珀',
    nameEN: 'Natsume Haku',
    color: '#FF6B35',        // 加缪·橙
    philosopher: '加缪',
    philosopherEN: 'A.Camus',
    ability: '西西弗的愉悦',
    proposition: '我们必须想象西西弗是幸福的。',
    logosLevel: 4,
    logosRange: [3, 10],
    crystallization: 12,
    deathCount: 327,
    silhouetteChar: '珀',
    signature: 'A.Camus',
    stats: {
      hp: 100,
      logos: 6.2,
      logosMax: 10,
      speed: 7,
      resolve: 8     // 意志力
    }
  },

  hikaru: {
    id: 'hikaru',
    name: '御厨 光',
    nameShort: '光',
    nameEN: 'Mikuriya Hikaru',
    color: '#9B59B6',        // 柏拉图·紫
    philosopher: '柏拉图',
    philosopherEN: 'Plato',
    ability: '洞穴',
    proposition: '世界是投影。',
    logosLevel: 4,
    logosRange: [5, 12],
    crystallization: 78,     // 极高
    prognosis: 42,           // 预后42天
    daysSurvived: 33,
    silhouetteChar: '光',
    signature: 'Plato',
    stats: {
      hp: 70,
      logos: 5.0,
      logosMax: 12,
      speed: 5,
      resolve: 4
    }
  },

  rei: {
    id: 'rei',
    name: '高城 黎',
    nameShort: '黎',
    nameEN: 'Takashiro Rei',
    color: '#FFD700',        // 尼采·金
    philosopher: '尼采',
    philosopherEN: 'F.Nietzsche',
    ability: '超人·角斗场',
    proposition: '上帝已死。',
    logosLevel: 1,
    logosRange: [100, 999],
    crystallization: 3,
    silhouetteChar: '黎',
    signature: 'F.Nietzsche',
    stats: {
      hp: 150,
      logos: 100,
      logosMax: 999,
      speed: 9,
      resolve: 10
    }
  },

  toya: {
    id: 'toya',
    name: '久我 冻夜',
    nameShort: '冻夜',
    nameEN: 'Kuga Tōya',
    color: '#4A90D9',        // 康德·蓝
    philosopher: '康德',
    philosopherEN: 'I.Kant',
    ability: '纯粹理性批判',
    proposition: '人为自然立法。',
    logosLevel: 2,
    logosRange: [42, 42],
    crystallization: 35,
    silhouetteChar: '冻',
    signature: 'I.Kant',
    stats: {
      hp: 120,
      logos: 42,
      logosMax: 42,
      speed: 6,
      resolve: 9
    }
  },

  miyuki: {
    id: 'miyuki',
    name: '夏目 深雪',
    nameShort: '深雪',
    nameEN: 'Natsume Miyuki',
    color: '#87CEEB',
    silhouetteChar: '雪',
    deceased: true,
    deathDate: '1994.8.5'
  }
};
