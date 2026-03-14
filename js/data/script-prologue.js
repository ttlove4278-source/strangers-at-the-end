/**
 * 《世纪末異鄉人》序章剧本
 * 「堤防·第327次」
 */
const SCRIPT_PROLOGUE = {

  // ===== 卷首诗 =====
  poem: {
    lines: [
      '石头从山顶滚落',
      '这是第三百二十七次',
      '我数得很清楚',
      '因为每一次',
      '都记得死去的温度',
    ],
    highlight: [1, 4],   // 高亮第2行和第5行
    author: '——夏目 珀'
  },

  // ===== 场景序列 =====
  scenes: [
    // --- SCENE 01: 堤防·黄昏 ---
    {
      id: 'prologue_01',
      location: { time: '1999年7月13日 17:42', place: '櫂町·堤防' },
      bg: 'levee-sunset',
      bgColor: '#1a1008',
      nodes: [
        {
          type: 'narration',
          text: '七月的堤防。沥青在阳光下发软。\n空气扭曲得像劣质毛玻璃，远处的海岸线随之弯折。',
          pace: 'slow'
        },
        {
          type: 'narration',
          text: '蝉在叫。\n它们大概以为这是世界上最重要的事。',
        },
        {
          type: 'narration',
          text: '我坐在自动贩卖机旁边。\n机器嗡嗡地震动，像一颗不规则的心脏。',
        },
        {
          type: 'narration',
          text: '宝矿力500ml。100日元。\n深雪喜欢喝这个。',
          pace: 'slow'
        },
        {
          type: 'narration',
          text: '……五年了。',
          pace: 'pause'
        },
        {
          type: 'dialogue',
          speaker: 'haku',
          text: '…………',
          auto: true,
          duration: 1500
        },
        {
          type: 'narration',
          text: '收音机在播什么。\n信号不好，杂音里混着人声——某个文化节目。\n关于一个法国人。一个写书的法国人。',
        },
        {
          type: 'narration',
          text: '「——阿尔贝·加缪，生于1913年11月7日。在《西西弗神话》中，他提出了哲学的根本问题——」',
          pace: 'slow',
          style: 'radio'
        },
        {
          type: 'narration',
          text: '我没在听。\n或者说，我以为我没在听。',
        },
        {
          type: 'narration',
          text: '「——人必须想象西西弗是幸福的。」',
          pace: 'dramatic',
          style: 'radio'
        },
        {
          type: 'narration',
          text: '……',
          pace: 'long_pause'
        },
        {
          type: 'narration',
          text: '那一瞬间，有什么东西在胸腔里裂开了。\n不是疼痛。比疼痛更安静。\n像是一扇从内侧锁了很久的门，终于被人用指尖叩了一下。',
          pace: 'slow'
        },
        {
          type: 'narration',
          text: '——然后我想起来了。\n\n我已经死过327次。',
          pace: 'dramatic'
        },
        // 画面闪烁/故障
        {
          type: 'effect',
          effect: 'glitch',
          duration: 800
        },
        {
          type: 'narration',
          text: '不。\n不是"想起来"。是"承认"。\n是终于允许自己说出这个数字。',
          pace: 'slow'
        },
        {
          type: 'narration',
          text: '327次心跳停止。\n327次体温降至室温。\n327次，在黑暗中确认——\n\n啊，我又死了。',
        },
        {
          type: 'narration',
          text: '然后是重置。\n3秒前的身体。3秒前的位置。3秒前的伤口。\n一切恢复原状。\n\n只有记忆——\n只有死亡的记忆，一次也不会消失。',
          pace: 'slow'
        },
        {
          type: 'effect',
          effect: 'screen_shake',
          duration: 300
        },
        {
          type: 'narration',
          text: '自动贩卖机吐出一罐宝矿力。\n我不记得投了钱。\n\n手指在发抖。\n不是因为害怕。是因为太热了。\n\n……大概是因为太热了。',
        },
        {
          type: 'dialogue',
          speaker: 'haku',
          text: '也没什么别的事可做。',
        },
        {
          type: 'narration',
          text: '我拉开拉环。\n宝矿力的味道。\n和五年前一样。\n\n和深雪病房里的，一模一样。',
          pace: 'slow'
        },
        {
          type: 'narration',
          text: '1999年的夏天。\n世纪末。\n收音机说世界可能会在年底结束。\n\n我觉得无所谓。\n世界结束327次了，每次都还在。',
        },
        // 选项
        {
          type: 'choice',
          prompt: '',
          choices: [
            {
              text: '「石头还在山脚。」',
              effect: { logos: 1, crystal: -1 },
              tag: 'camus',
              next: 'prologue_choice_a'
            },
            {
              text: '「……该回去了。」',
              effect: { logos: 0 },
              tag: 'neutral',
              next: 'prologue_choice_b'
            },
            {
              text: '（继续坐着，什么也不做）',
              effect: { crystal: -2 },
              tag: 'silence',
              next: 'prologue_choice_c'
            }
          ]
        }
      ]
    },

    // --- SCENE 02a: 选择A ---
    {
      id: 'prologue_choice_a',
      nodes: [
        {
          type: 'narration',
          text: '我站起来。\n膝盖有点酸。在堤防上坐太久了。',
        },
        {
          type: 'narration',
          text: '石头在山脚。太阳在头顶。\n西西弗没有选择权。\n\n但他可以选择怎么走下山。',
          pace: 'slow'
        },
        {
          type: 'dialogue',
          speaker: 'haku',
          text: '走吧。',
        },
        { type: 'goto', target: 'prologue_02' }
      ]
    },

    // --- SCENE 02b: 选择B ---
    {
      id: 'prologue_choice_b',
      nodes: [
        {
          type: 'narration',
          text: '该回去了。\n回到那个有床下纸箱的房间。\n回到那个从不打开纸箱的日常。',
        },
        {
          type: 'narration',
          text: '有些事不做，不是因为忘了。\n是因为记得太清楚。',
          pace: 'slow'
        },
        { type: 'goto', target: 'prologue_02' }
      ]
    },

    // --- SCENE 02c: 选择C ---
    {
      id: 'prologue_choice_c',
      nodes: [
        {
          type: 'narration',
          text: '我什么也没做。\n蝉继续叫。贩卖机继续嗡嗡响。\n宝矿力的露珠从罐子上滑落，在沥青上蒸发。',
        },
        {
          type: 'narration',
          text: '什么也不做。\n这本身就是一种选择。\n\n加缪大概也是这么想的。',
          pace: 'slow'
        },
        { type: 'goto', target: 'prologue_02' }
      ]
    },

    // --- SCENE 02: 归途·遇见 ---
    {
      id: 'prologue_02',
      location: { time: '1999年7月13日 18:15', place: '櫂町·商店街' },
      bg: 'shopping-street',
      bgColor: '#1a0f0a',
      nodes: [
        {
          type: 'narration',
          text: '商店街。\n关东煮的味道从便利店飘出来。\nCRT电视在橱窗里放着新闻。\n\n「——厚生省今日确认，所谓『哲学症』的病例数已累计超过——」',
        },
        {
          type: 'narration',
          text: '我换了个频道。\n不是真的换。是把目光移开。\n\n这种能力不需要教。人人都会。',
        },
        {
          type: 'narration',
          text: '路过图书馆。\n灯还亮着。透过玻璃可以看见里面——\n\n有个女孩坐在窗边。\n黑发。低马尾。书包上挂着一只塑料海豚。\n\n她在看一本很厚的书。',
        },
        {
          type: 'narration',
          text: '——不。\n她不是在看书。\n她是在——用一种很奇怪的方式——凝视那本书。\n\n像是在透过文字，看见文字背后的什么东西。',
          pace: 'slow'
        },
        {
          type: 'narration',
          text: '我们的视线相遇了。\n\n大概有0.5秒。\n在这0.5秒里，我确信她看见了我身上的某种东西——\n某种和她相同的东西。',
        },
        {
          type: 'narration',
          text: '然后她低下头，继续读书。\n\n我继续走路。',
        },
        {
          type: 'narration',
          text: '1999年7月13日。\n就这样结束了。\n\n没什么特别的。\n只是又活过了一天。',
          pace: 'slow'
        },
        {
          type: 'effect',
          effect: 'fade_black',
          duration: 2000
        },
        {
          type: 'narration',
          text: '——序章「堤防·第327次」 完——',
          style: 'chapter_end',
          pace: 'dramatic'
        }
      ]
    }
  ]
};
