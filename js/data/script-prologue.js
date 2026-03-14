const SCRIPT_PROLOGUE = {
  poem: {
    lines: [
      '石头从山顶滚落',
      '这是第三百二十七次',
      '我数得很清楚',
      '因为每一次',
      '都记得死去的温度',
    ],
    highlight: [1, 4],
    author: '——夏目 珀'
  },

  scenes: [
    {
      id: 'prologue_01',
      location: { time: '1999年7月13日 17:42', place: '櫂町·堤防' },
      bgColor: '#1a1008',
      nodes: [
        { type: 'narration', text: '七月的堤防。沥青在阳光下发软。\n空气扭曲得像劣质毛玻璃，远处的海岸线随之弯折。', pace: 'slow' },
        { type: 'narration', text: '蝉在叫。\n它们大概以为这是世界上最重要的事。' },
        { type: 'narration', text: '我坐在自动贩卖机旁边。\n机器嗡嗡地震动，像一颗不规则的心脏。' },
        { type: 'narration', text: '宝矿力500ml。100日元。\n深雪喜欢喝这个。', pace: 'slow' },
        { type: 'narration', text: '……五年了。', pace: 'pause' },
        { type: 'dialogue', speaker: 'haku', text: '…………', auto: true, duration: 1500 },
        { type: 'narration', text: '收音机在播什么。\n信号不好，杂音里混着人声——某个文化节目。\n关于一个法国人。一个写书的法国人。' },
        { type: 'narration', text: '「——阿尔贝·加缪，生于1913年11月7日。在《西西弗神话》中，他提出了哲学的根本问题——」', pace: 'slow', style: 'radio' },
        { type: 'narration', text: '我没在听。\n或者说，我以为我没在听。' },
        { type: 'narration', text: '「——人必须想象西西弗是幸福的。」', pace: 'dramatic', style: 'radio' },
        { type: 'narration', text: '……', pace: 'long_pause' },
        { type: 'narration', text: '那一瞬间，有什么东西在胸腔里裂开了。\n不是疼痛。比疼痛更安静。\n像是一扇从内侧锁了很久的门，终于被人用指尖叩了一下。', pace: 'slow' },
        { type: 'narration', text: '——然后我想起来了。\n\n我已经死过327次。', pace: 'dramatic' },
        { type: 'effect', effect: 'glitch', duration: 800 },
        { type: 'narration', text: '不。\n不是"想起来"。是"承认"。\n是终于允许自己说出这个数字。', pace: 'slow' },
        { type: 'narration', text: '327次心跳停止。\n327次体温降至室温。\n327次，在黑暗中确认——\n\n啊，我又死了。' },
        { type: 'narration', text: '然后是重置。\n3秒前的身体。3秒前的位置。3秒前的伤口。\n一切恢复原状。\n\n只有记忆——\n只有死亡的记忆，一次也不会消失。', pace: 'slow' },
        { type: 'effect', effect: 'screen_shake', duration: 300 },
        { type: 'narration', text: '自动贩卖机吐出一罐宝矿力。\n我不记得投了钱。\n\n手指在发抖。\n不是因为害怕。是因为太热了。\n\n……大概是因为太热了。' },
        { type: 'dialogue', speaker: 'haku', text: '也没什么别的事可做。' },
        { type: 'narration', text: '我拉开拉环。\n宝矿力的味道。\n和五年前一样。\n\n和深雪病房里的，一模一样。', pace: 'slow' },
        { type: 'narration', text: '1999年的夏天。\n世纪末。\n收音机说世界可能会在年底结束。\n\n我觉得无所谓。\n世界结束327次了，每次都还在。' },
        {
          type: 'choice',
          choices: [
            { text: '「石头还在山脚。」', effect: { logos: 1, crystal: -1 }, tag: 'camus', next: 'prologue_choice_a' },
            { text: '「……该回去了。」', effect: {}, tag: 'neutral', next: 'prologue_choice_b' },
            { text: '（继续坐着，什么也不做）', effect: { crystal: -2 }, tag: 'silence', next: 'prologue_choice_c' }
          ]
        }
      ]
    },

    {
      id: 'prologue_choice_a',
      nodes: [
        { type: 'narration', text: '我站起来。\n膝盖有点酸。在堤防上坐太久了。' },
        { type: 'narration', text: '石头在山脚。太阳在头顶。\n西西弗没有选择权。\n\n但他可以选择怎么走下山。', pace: 'slow' },
        { type: 'dialogue', speaker: 'haku', text: '走吧。' },
        { type: 'goto', target: 'prologue_02' }
      ]
    },
    {
      id: 'prologue_choice_b',
      nodes: [
        { type: 'narration', text: '该回去了。\n回到那个有床下纸箱的房间。\n回到那个从不打开纸箱的日常。' },
        { type: 'narration', text: '有些事不做，不是因为忘了。\n是因为记得太清楚。', pace: 'slow' },
        { type: 'goto', target: 'prologue_02' }
      ]
    },
    {
      id: 'prologue_choice_c',
      nodes: [
        { type: 'narration', text: '我什么也没做。\n蝉继续叫。贩卖机继续嗡嗡响。\n宝矿力的露珠从罐子上滑落，在沥青上蒸发。' },
        { type: 'narration', text: '什么也不做。\n这本身就是一种选择。\n\n加缪大概也是这么想的。', pace: 'slow' },
        { type: 'goto', target: 'prologue_02' }
      ]
    },

    {
      id: 'prologue_02',
      location: { time: '1999年7月13日 18:15', place: '櫂町·商店街' },
      bgColor: '#1a0f0a',
      nodes: [
        { type: 'narration', text: '商店街。\n关东煮的味道从便利店飘出来。\nCRT电视在橱窗里放着新闻。\n\n「——厚生省今日确认，所谓『哲学症』的病例数已累计超过——」' },
        { type: 'narration', text: '我换了个频道。\n不是真的换。是把目光移开。\n\n这种能力不需要教。人人都会。' },
        { type: 'narration', text: '路过图书馆。\n灯还亮着。透过玻璃可以看见里面——\n\n有个女孩坐在窗边。\n黑发。低马尾。书包上挂着一只塑料海豚。\n\n她在看一本很厚的书。' },
        { type: 'narration', text: '——不。\n她不是在看书。\n她是在——用一种很奇怪的方式——凝视那本书。\n\n像是在透过文字，看见文字背后的什么东西。', pace: 'slow' },
        { type: 'narration', text: '我们的视线相遇了。\n\n大概有0.5秒。\n在这0.5秒里，我确信她看见了我身上的某种东西——\n某种和她相同的东西。' },
        { type: 'narration', text: '然后她低下头，继续读书。\n\n我继续走路。' },
        { type: 'effect', effect: 'fade_black', duration: 1500 },
        { type: 'narration', text: '1999年7月13日。\n就这样结束了。\n\n没什么特别的。\n只是又活过了一天。', pace: 'slow' },
        { type: 'goto', target: 'prologue_03' }
      ]
    },

    // === 第二天：图书馆 ===
    {
      id: 'prologue_03',
      location: { time: '1999年7月14日 16:00', place: '櫂町市立图书馆' },
      bgColor: '#0f1218',
      nodes: [
        { type: 'narration', text: '第二天。\n我也不知道为什么来了图书馆。\n\n……大概是因为空调免费。' },
        { type: 'narration', text: '她在昨天的位置。\n同一张桌子。同一本书。\n海豚挂件在书包上晃来晃去。' },
        { type: 'narration', text: '我在对面坐下。\n打开一本随手拿的文库本——太宰治《人间失格》。\n\n不是故意选的。\n……真的不是。' },
        { type: 'narration', text: '她抬头看了我一眼。\n那种眼神我认识。\n\n——你也是吧。\n——你也看到了什么不该看到的东西吧。' },
        { type: 'dialogue', speaker: 'hikaru', text: '……那本书，第27页有咖啡渍。', position: 'right' },
        { type: 'narration', text: '我翻到第27页。\n确实有。一圈淡棕色的痕迹。' },
        { type: 'dialogue', speaker: 'haku', text: '……是罗多伦的。', position: 'left' },
        { type: 'dialogue', speaker: 'hikaru', text: '嗯。大概是谁在读"生而为人，我很抱歉"的时候洒的。', position: 'right' },
        { type: 'narration', text: '沉默。\n但不是不舒服的那种。\n是图书馆才有的、被书脊和灰尘填满的沉默。' },
        { type: 'dialogue', speaker: 'hikaru', text: '……明天也来吗？', position: 'right' },
        {
          type: 'choice',
          choices: [
            { text: '「如果明天还活着的话。」', effect: { logos: 1 }, tag: 'camus', next: 'prologue_03a' },
            { text: '「空调免费的话。」', effect: {}, tag: 'neutral', next: 'prologue_03b' },
          ]
        }
      ]
    },
    {
      id: 'prologue_03a',
      nodes: [
        { type: 'narration', text: '她看着我。\n大概有两秒。\n然后嘴角动了一下——不确定是不是在笑。' },
        { type: 'dialogue', speaker: 'hikaru', text: '……嗯。明天见。', position: 'right' },
        { type: 'narration', text: '明天见。\n一句非常普通的话。\n在1999年的夏天，它听起来像是某种契约。', pace: 'slow' },
        { type: 'goto', target: 'prologue_04' }
      ]
    },
    {
      id: 'prologue_03b',
      nodes: [
        { type: 'dialogue', speaker: 'hikaru', text: '……很实际。', position: 'right' },
        { type: 'narration', text: '她低下头，继续读书。\n\n我想，这大概就是活着的全部内容了。\n在免费的空调下，和一个陌生人共享沉默。' },
        { type: 'goto', target: 'prologue_04' }
      ]
    },

    // === 边沁事件 ===
    {
      id: 'prologue_04',
      location: { time: '1999年7月18日 19:30', place: '櫂町·商店街' },
      bgColor: '#1a0a05',
      nodes: [
        { type: 'narration', text: '五天后。\n傍晚的商店街。\n天还没完全黑。沥青在余温里散发着一天积蓄的热量。' },
        { type: 'narration', text: '人群忽然开始往两边退。\n不是恐慌。是那种——\n本能地感觉到"那个人有什么不对"的退让。' },
        { type: 'narration', text: '一个中年男人站在商店街中央。\n眼睛里——\n\n眼睛里全是数字。', pace: 'slow' },
        { type: 'narration', text: '他在计算。\n计算每一个路人的"幸福指数"。\n计算这条商店街的"总体效用"。\n计算让所有人幸福的最优解。', pace: 'slow' },
        { type: 'dialogue', speaker: 'haku', text: '……哲学症。', position: 'left' },
        { type: 'narration', text: '他转向一个带着孩子的母亲。\n嘴角在笑，但瞳孔里刻着签名——\n\nJ. Bentham\n\n哥特体。' },
        { type: 'narration', text: '边沁。\n功利主义。\n\n——最大多数的最大幸福。', pace: 'dramatic' },
        { type: 'narration', text: '他的手抬起来。\n指尖有数字在流淌。\n\n他要"计算"那对母子了——\n把她们的幸福强行最优化。' },
        {
          type: 'choice',
          choices: [
            { text: '「——停下。」', effect: { logos: -1 }, tag: 'intervene', next: 'prologue_battle' },
            { text: '（什么也不做）', effect: { crystal: 3 }, tag: 'ignore', next: 'prologue_ignore' },
          ]
        }
      ]
    },

    {
      id: 'prologue_ignore',
      nodes: [
        { type: 'narration', text: '我没有动。\n\n……不是因为冷漠。\n是因为我不知道阻止他的理由。\n\n如果有人真的能计算出"让所有人幸福"的方法——\n那或许——' },
        { type: 'narration', text: '然后我看到了那个孩子的眼睛。\n\n——不需要理由。', pace: 'slow' },
        { type: 'dialogue', speaker: 'haku', text: '……啧。' },
        { type: 'goto', target: 'prologue_battle' }
      ]
    },

    // === 战斗 ===
    {
      id: 'prologue_battle',
      nodes: [
        { type: 'narration', text: '我站到了他面前。\n\n数字涌过来。\n他的逻各斯像计算器一样精确——\n把我的"幸福值"拆解成0和1。' },
        { type: 'narration', text: '很不舒服。\n但我已经死过327次了。\n不舒服这种东西，排不进前一百。', pace: 'slow' },
        { type: 'battle', enemy: 'bentham_patient' },
      ]
    },

    // === 战斗后 ===
    {
      id: 'prologue_after_battle',
      location: { time: '1999年7月18日 20:10', place: '櫂町·商店街' },
      bgColor: '#0f0a08',
      nodes: [
        { type: 'narration', text: '数字从他的瞳孔褪去。\n他跪在地上，喘着粗气。\n\n签名正在消退。但不会完全消失。\n哲学症不可逆——他会带着这些数字活下去。' },
        { type: 'dialogue', speaker: 'haku', text: '……你没事吧。' },
        { type: 'narration', text: '他抬头看我。\n眼睛里不再有数字了。只有一个普通中年人的疲惫。' },
        { type: 'narration', text: '「……我只是想让大家都幸福……」\n\n他的声音很小。\n但我听清了每一个字。' },
        { type: 'narration', text: '……我知道。\n所有发病的人都是这样。\n\n他们不是坏人。\n他们只是找到了一个答案，然后被那个答案吞噬了。', pace: 'slow' },
        { type: 'narration', text: '远处传来脚步声。\n皮鞋踩在沥青上的清脆节奏。\n\n——九课的人来了。' },
        { type: 'effect', effect: 'fade_black', duration: 1000 },
        { type: 'narration', text: '一个穿着旧西装的男人走过来。\n藏青色。公文包。鬓角有白发。\n\n他看了我一眼。\n然后看了看地上的边沁患者。\n然后又看了我一眼。' },
        { type: 'dialogue', speaker: 'toya', text: '厚生省第九课。\n……你是论证者？' },
        { type: 'dialogue', speaker: 'haku', text: '不知道。你说呢。' },
        { type: 'dialogue', speaker: 'toya', text: '瞳孔签名。A.Camus。四等。\n……加缪系。少见。' },
        { type: 'narration', text: '他从公文包里抽出一张名片。\n——不。不是名片。\n是一张格式化的表格。上面印着：\n\n「哲学症患者协助意向确认书」' },
        {
          type: 'choice',
          choices: [
            { text: '「……我不是患者。」', effect: {}, tag: 'denial', next: 'prologue_end_a' },
            { text: '（接过表格）', effect: { logos: 1 }, tag: 'accept', next: 'prologue_end_b' },
          ]
        }
      ]
    },

    {
      id: 'prologue_end_a',
      nodes: [
        { type: 'dialogue', speaker: 'toya', text: '加缪系的通病——拒绝定义。\n表格放在这里。想签的时候来合同厅舍。', position: 'right' },
        { type: 'narration', text: '他把表格塞进我手里。\n然后带走了边沁患者。\n\n商店街恢复了日常。\n好像什么也没发生过。' },
        { type: 'goto', target: 'prologue_final' }
      ]
    },
    {
      id: 'prologue_end_b',
      nodes: [
        { type: 'narration', text: '我接过表格。\n纸很薄。印刷墨水已经干了，有点扎手。' },
        { type: 'dialogue', speaker: 'toya', text: '……明天来合同厅舍。二楼。\n带上这个和身份证。', position: 'right' },
        { type: 'narration', text: '他带走了边沁患者。\n\n表格上有一行小字：\n「本人确认，因自身意志成为第九课协助者。」\n\n自身意志。\n\n加缪大概会觉得这很讽刺。' },
        { type: 'goto', target: 'prologue_final' }
      ]
    },

    {
      id: 'prologue_final',
      location: { time: '1999年7月18日 21:00', place: '櫂町·堤防' },
      bgColor: '#0a0a12',
      nodes: [
        { type: 'narration', text: '夜晚的堤防。\n贩卖机的光是唯一的光源。\n蝉终于安静了。大概它们也需要睡觉。' },
        { type: 'narration', text: '手机响了。\n——不。我没有手机。\n是贩卖机旁边的公用电话在响。' },
        { type: 'narration', text: '我没接。\n\n没人知道我在这里。\n所以那个电话不是打给我的。\n\n……大概不是。' },
        { type: 'narration', text: '宝矿力。100日元。\n今天是第二罐了。', pace: 'slow' },
        { type: 'narration', text: '1999年7月18日。\n石头从山顶滚了下来。\n我走下山去。\n\n明天还要推。', pace: 'slow' },
        { type: 'effect', effect: 'fade_black', duration: 2000 },
        { type: 'narration', text: '——序章「堤防·第327次」 完——', style: 'chapter_end', pace: 'dramatic' },
        { type: 'end' }
      ]
    }
  ]
};
