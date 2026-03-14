const LOCATIONS = [
  {
    id: 'levee',
    name: '堤防',
    channel: 1,
    bgColor: '#1a1008',
    desc: '堤防。自动贩卖机。沥青的余温。\n蝉在叫。宝矿力100日元。\n——她喜欢喝这个。',
    actions: [
      { label: '坐着发呆', icon: '◇', effect: { logos: 0.5 }, text: '什么也没想。逻各斯缓缓回流。' },
      { label: '买宝矿力', icon: '□', condition: () => true, text: '100日元。和五年前一样的味道。', effect: { hp: 10 } },
      { label: '听收音机', icon: '♪', scene: 'ch1_levee_radio' },
    ]
  },
  {
    id: 'school',
    name: '櫂町高校',
    channel: 2,
    bgColor: '#12100e',
    desc: '放学后的校舍。走廊里残留着粉笔灰的气味。\n公告栏上贴着关于"千年虫"的注意事项。\n……和一张撕掉一半的哲学症预防海报。',
    actions: [
      { label: '图书室', icon: '◇', scene: 'ch1_school_library' },
      { label: '天台', icon: '△', effect: { logos: 0.3 }, text: '风很大。可以看到整个櫂町。\n从这里看，这个城市像是一个缩小的模型。' },
      { label: '学生会室', icon: '☆', scene: 'ch1_student_council', condition: () => GameState.story.flags.met_rei },
    ]
  },
  {
    id: 'library',
    name: '市立图书馆',
    channel: 3,
    bgColor: '#0f1218',
    desc: '空调嗡嗡响。书架间的灰尘在光线中漂浮。\n她每天都在窗边的位置。\n海豚挂件晃来晃去。',
    actions: [
      { label: '和光说话', icon: '○', scene: 'ch1_library_hikaru' },
      { label: '读书', icon: '◇', effect: { logos: 0.8, crystal: 1 }, text: '读了一会儿《人间失格》。\n第27页还是有咖啡渍。' },
      { label: '哲学区', icon: '△', scene: 'ch1_library_philosophy', condition: () => GameState.story.flags.library_deep },
    ]
  },
  {
    id: 'shopping',
    name: '商店街',
    channel: 4,
    bgColor: '#1a0f0a',
    desc: '便利店、关东煮、二手录像带店。\nCRT电视在播新闻。\n世纪末的日常——如果你不去想那些不日常的事的话。',
    actions: [
      { label: '逛便利店', icon: '□', text: '买了一罐BOSS咖啡。罐子上印着汤米·李·琼斯的脸。\n"在这个星球，活着就很了不起。"', effect: { hp: 5 } },
      { label: '看新闻', icon: '◇', scene: 'ch1_shopping_news' },
      { label: '暗巷', icon: '！', scene: 'ch1_shopping_alley', condition: () => GameState.story.flags.nine_joined },
    ]
  },
  {
    id: 'harbor',
    name: '旧港高架桥下',
    channel: 5,
    bgColor: '#0a0c10',
    desc: '桥墩。折叠椅。一个背对大海的白发男人。\n他在读《思想录》。和昨天同一页。\n和前天同一页。',
    actions: [
      { label: '放下宝矿力', icon: '○', text: '我把宝矿力放在他旁边。\n他没有看我。\n但他的手移了一下——把罐子放得更近了一点。', effect: { logos: 0.2 } },
      { label: '说话', icon: '△', scene: 'ch1_harbor_fujimori', condition: () => GameState.affinity.hikaru >= 3 },
    ]
  },
  {
    id: 'nine_hq',
    name: '九课厅舍',
    channel: 6,
    bgColor: '#0e0e14',
    desc: '合同厅舍二楼。荧光灯嗡嗡响。\n走廊里贴着过期的健康检查通知。\n——厚生省第九课。处理哲学症的地方。',
    actions: [
      { label: '找冻夜', icon: '○', scene: 'ch1_nine_toya', condition: () => GameState.story.flags.nine_joined },
      { label: '档案室', icon: '◇', scene: 'ch1_nine_archive', condition: () => GameState.story.flags.nine_joined },
      { label: '离开', icon: '←', text: '还没有理由进去。', condition: () => !GameState.story.flags.nine_joined },
    ]
  }
];
