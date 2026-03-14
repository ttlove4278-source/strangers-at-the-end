const SCRIPT_CHAPTER1 = {
  chapter: 1,
  title: '第一章「世紀末的異鄉人」',
  startMode: 'explore',
  firstScene: 'ch1_intro',

  poem: {
    lines: [
      '她问我明天也来吗',
      '我说',
      '如果明天还活着的话',
      '她没有笑',
      '她只是点了点头',
      '好像这是一句',
      '理所当然的话',
    ],
    highlight: [2, 6],
    author: '——夏目 珀·七月手记'
  },

  scenes: [
    {
      id: 'ch1_intro',
      location: { time: '1999年7月19日 07:30', place: '珀的房间' },
      bgColor: '#0e0a08',
      nodes: [
        { type: 'narration', text: '闹钟响了。\n七月十九日。星期一。\n——昨天是第328次。', pace: 'slow' },
        { type: 'narration', text: '床下的纸箱还在。\n一如既往地没有打开。' },
        { type: 'narration', text: '今天要去九课。\n表格还在口袋里——揉皱了，但字还看得清。\n\n「本人确认，因自身意志成为第九课协助者。」' },
        { type: 'narration', text: '自身意志。\n\n我想了想，觉得今天的自身意志是——先去图书馆。\n空调免费。' },
        { type: 'unlock', flag: { ch1_day1_done: true, nine_joined: true } },
        { type: 'explore' },
      ]
    },

    {
      id: 'ch1_library_hikaru',
      location: { time: '下午', place: '市立图书馆' },
      bgColor: '#0f1218',
      nodes: [
        { type: 'narration', text: '她在。\n窗边。同一个位置。同一本书。\n海豚挂件在阳光下有一点点反光。' },
        { type: 'dialogue', speaker: 'hikaru', text: '……你来了。', position: 'right' },
        { type: 'dialogue', speaker: 'haku', text: '空调免费。', position: 'left' },
        { type: 'dialogue', speaker: 'hikaru', text: '你每次都说这个。', position: 'right' },
        { type: 'narration', text: '我在她对面坐下。\n今天的文库本是——《理想国》。\n\n不是我选的。是她放在桌上的。' },
        { type: 'dialogue', speaker: 'haku', text: '……这是给我看的？', position: 'left' },
        { type: 'dialogue', speaker: 'hikaru', text: '不是。是我看完了。\n……你想看的话可以看。', position: 'right' },
        { type: 'narration', text: '她的眼睛看着我。\n不是那种"看穿"的眼神。\n是普通的、看着另一个人的眼神。\n\n——但对她来说，"普通地看着另一个人"是一件很不容易的事。', pace: 'slow' },
        { type: 'dialogue', speaker: 'hikaru', text: '夏目……你觉得，\n看见太多东西，是一件好事吗？', position: 'right' },
        {
          type: 'choice',
          choices: [
            { text: '「不想看就不看。真理不是义务。」', effect: { affinity: { hikaru: 3 }, logos: 1 }, tag: 'camus', next: 'ch1_hikaru_a' },
            { text: '「我不知道。但你可以选择看什么。」', effect: { affinity: { hikaru: 2 } }, tag: 'neutral', next: 'ch1_hikaru_b' },
            { text: '「……」（沉默）', effect: { affinity: { hikaru: 1 }, crystal: -1 }, tag: 'silence', next: 'ch1_hikaru_c' },
          ]
        }
      ]
    },
    {
      id: 'ch1_hikaru_a',
      nodes: [
        { type: 'narration', text: '她看着我。很久。\n然后嘴角弯了一下。' },
        { type: 'dialogue', speaker: 'hikaru', text: '……你是第一个这么说的人。\n\n所有人都说"你应该用好这个能力"。\n九课的人说"这是有价值的"。\n\n从来没有人说——不想看就不看。', position: 'right' },
        { type: 'narration', text: '她低下头。\n碎发遮住了半张脸。\n\n但我看到她的肩膀放松了一点。\n只是一点点。', pace: 'slow' },
        { type: 'unlock', flag: { library_deep: true }, archive: { type: 'philosophy', id: 'plato' } },
        { type: 'explore' },
      ]
    },
    {
      id: 'ch1_hikaru_b',
      nodes: [
        { type: 'dialogue', speaker: 'hikaru', text: '……选择吗。\n柏拉图说，走出洞穴的人有义务回去告诉洞里的人真相。\n\n但如果洞里的人不想听呢？', position: 'right' },
        { type: 'narration', text: '我答不上来。\n所以我打开了《理想国》，开始读。\n\n她也继续读她的书。\n沉默回来了。图书馆的沉默。安全的沉默。' },
        { type: 'unlock', flag: { library_deep: true } },
        { type: 'explore' },
      ]
    },
    {
      id: 'ch1_hikaru_c',
      nodes: [
        { type: 'narration', text: '我什么也没说。\n她也没有追问。\n\n有时候沉默比回答更诚实。\n至少沉默不会骗人。' },
        { type: 'explore' },
      ]
    },

    {
      id: 'ch1_library_philosophy',
      location: { time: '下午', place: '市立图书馆·哲学区' },
      bgColor: '#0a0e18',
      nodes: [
        { type: 'narration', text: '图书馆最深处。哲学区。\n空气更冷。灰尘更厚。\n书架上排列着死去的思想——或者说，不会死的思想。' },
        { type: 'narration', text: '一本书从书架上掉了下来。\n\n——不。\n不是掉的。是被推下来的。\n被某种看不见的力量。', pace: 'slow' },
        { type: 'narration', text: '书脊上写着：笛卡尔《第一哲学沉思录》。\n\n封面在发光。\n不是比喻。字面意义上的发光——半透明的几何纹路在纸张表面流淌。' },
        { type: 'narration', text: '理论结晶。\n有人在这本书里结晶化了。\n\n残留的思想正在共振——' },
        { type: 'effect', effect: 'glitch', duration: 600 },
        { type: 'narration', text: '一个半透明的人影从结晶中浮现。\n没有面孔。只有签名——\n\nR. Descartes\n\n花体字。', pace: 'dramatic' },
        { type: 'battle', enemy: 'descartes_ghost', afterScene: 'ch1_after_descartes' },
      ]
    },
    {
      id: 'ch1_after_descartes',
      location: { time: '下午', place: '市立图书馆·哲学区' },
      bgColor: '#0a0e18',
      nodes: [
        { type: 'narration', text: '人影消散了。\n结晶安静下来。纹路不再流动。\n\n只剩下一本普通的旧书。' },
        { type: 'narration', text: '我捡起来。\n翻开扉页——\n\n「致我仍在怀疑的自己 —— 1987.4」\n\n1987年。十二年前。\n有人在这本书里找到了答案。然后被答案吞噬了。', pace: 'slow' },
        { type: 'unlock', archive: { type: 'crystals', id: 'descartes_1987' } },
        { type: 'narration', text: '我把书放回书架。\n\n不是所有答案都需要被找到。\n有些问题，保持提问的状态就好。\n\n加缪大概会同意。', pace: 'slow' },
        { type: 'explore' },
      ]
    },

    {
      id: 'ch1_shopping_news',
      location: { time: '傍晚', place: '商店街·电器店前' },
      bgColor: '#1a0f0a',
      nodes: [
        { type: 'narration', text: 'CRT电视在橱窗里播新闻。\n\n「……本月哲学症确诊病例较上月增加47%。厚生省呼吁民众避免——」' },
        { type: 'narration', text: '画面切换。\n\n「——避免长时间阅读哲学类书籍，避免观看哲学家肖像——」' },
        { type: 'narration', text: '他们真的相信不看书就不会发病吗？\n\n哲学症不是感冒。\n它是——当你终于找到一个能解释世界的答案，\n然后被那个答案反噬。\n\n不看书的人只是还没找到他们的答案。不代表不会。', pace: 'slow' },
        { type: 'explore' },
      ]
    },

    {
      id: 'ch1_levee_radio',
      location: { time: '黄昏', place: '堤防' },
      bgColor: '#1a1008',
      nodes: [
        { type: 'narration', text: '收音机。杂音。\n偶尔能听清几个字。\n大部分时候只有蝉鸣和噪点。' },
        { type: 'narration', text: '「——心理学家荣格曾指出，世纪末会引发集体无意识中的原型涌现——」', style: 'radio' },
        { type: 'narration', text: '嘭。\n收音机爆了一声噪音。然后安静了。\n\n蝉还在叫。\n它们大概不需要收音机来确认自己为什么活着。', pace: 'slow' },
        { type: 'explore' },
      ]
    },

    {
      id: 'ch1_student_council',
      location: { time: '放课后', place: '櫂町高校·学生会室' },
      bgColor: '#14100c',
      nodes: [
        { type: 'narration', text: '学生会室的门半开着。\n里面只有一个人。\n\n金发。181cm。制服穿得极其端正。\n——高城黎。三年四组。学生会会长。' },
        { type: 'dialogue', speaker: 'rei', text: '……你就是加缪系的。\n九课的人说你来了。', position: 'right' },
        { type: 'dialogue', speaker: 'haku', text: '……你怎么知道？', position: 'left' },
        { type: 'dialogue', speaker: 'rei', text: '你的瞳孔。签名看得到。\n\n……A. Camus。加缪。\n荒诞主义。很少见的源流。', position: 'right' },
        { type: 'narration', text: '他把书合上。\n封面朝下放在桌上——像是不想让我看到扉页。' },
        { type: 'dialogue', speaker: 'rei', text: '加缪说人要在荒诞中活下去。\n尼采说人要成为超越自我的人。\n\n——你觉得，哪个更难？', position: 'right' },
        {
          type: 'choice',
          choices: [
            { text: '「活下去。」', effect: { affinity: { rei: 2 } }, tag: 'camus', next: 'ch1_rei_a' },
            { text: '「超越自我。」', effect: { affinity: { rei: 1 } }, tag: 'neutral', next: 'ch1_rei_b' },
            { text: '「都不难。难的是选择。」', effect: { affinity: { rei: 3 }, logos: 1 }, tag: 'both', next: 'ch1_rei_c' },
          ]
        }
      ]
    },
    {
      id: 'ch1_rei_a',
      nodes: [
        { type: 'narration', text: '他沉默了一会儿。\n然后笑了。\n——不是善意的笑。是那种"你说出了我不想承认的事"的笑。' },
        { type: 'dialogue', speaker: 'rei', text: '你很诚实。\n大多数人会说"超越自我"。因为听起来更帅。', position: 'right' },
        { type: 'unlock', archive: { type: 'persons', id: 'rei' }, flag: { met_rei: true } },
        { type: 'explore' },
      ]
    },
    {
      id: 'ch1_rei_b',
      nodes: [
        { type: 'dialogue', speaker: 'rei', text: '……嗯。\n那你做到了吗？', position: 'right' },
        { type: 'dialogue', speaker: 'haku', text: '没有。', position: 'left' },
        { type: 'dialogue', speaker: 'rei', text: '至少你没骗我。', position: 'right' },
        { type: 'unlock', archive: { type: 'persons', id: 'rei' }, flag: { met_rei: true } },
        { type: 'explore' },
      ]
    },
    {
      id: 'ch1_rei_c',
      nodes: [
        { type: 'narration', text: '他看着我。\n目光锐利。但不是敌意。\n——是评估。是一个站在绳索上的人，在判断对面的人是不是也站在绳索上。' },
        { type: 'dialogue', speaker: 'rei', text: '……有意思。\n你和他们说的不一样。', position: 'right' },
        { type: 'dialogue', speaker: 'haku', text: '谁说的？', position: 'left' },
        { type: 'dialogue', speaker: 'rei', text: '所有人。\n\n……下次再聊吧。我要关门了。', position: 'right' },
        { type: 'unlock', archive: { type: 'persons', id: 'rei' }, flag: { met_rei: true } },
        { type: 'explore' },
      ]
    },

    {
      id: 'ch1_nine_toya',
      location: { time: '上午', place: '九课厅舍·二楼' },
      bgColor: '#0e0e14',
      nodes: [
        { type: 'dialogue', speaker: 'toya', text: '你来了。\n……坐。', position: 'right' },
        { type: 'narration', text: '办公桌上堆着文件。\n每一份都是一个人的一生——\n浓缩成A4纸上的编号、症状、预后。' },
        { type: 'dialogue', speaker: 'toya', text: '第九课的工作很简单。\n确认。记录。处置。\n\n……有时候是保护。但大多数时候，是确认"已经来不及了"。', position: 'right' },
        { type: 'dialogue', speaker: 'toya', text: '……御厨光。你认识吧？\n柏拉图系。预后42天。\n\n今天是第38天。', position: 'right' },
        { type: 'effect', effect: 'screen_shake', duration: 200 },
        { type: 'narration', text: '第38天。\n\n——只剩4天了。', pace: 'dramatic' },
        { type: 'dialogue', speaker: 'haku', text: '……她知道吗？', position: 'left' },
        { type: 'dialogue', speaker: 'toya', text: '她是柏拉图系。\n她什么都知道。\n\n……比我们任何人都清楚。', position: 'right' },
        { type: 'narration', text: '我站起来。\n没有说再见。\n\n图书馆。我要去图书馆。', pace: 'slow' },
        { type: 'unlock', flag: { know_prognosis: true } },
        { type: 'explore' },
      ]
    },

    {
      id: 'ch1_nine_archive',
      location: { time: '下午', place: '九课厅舍·档案室' },
      bgColor: '#080a10',
      nodes: [
        { type: 'narration', text: '地下一层。档案室。\n荧光灯只亮了一半。\n铁架上排列着文件盒——每一个都是一个结晶化的人。' },
        { type: 'narration', text: '——1998年。萨特系。女性。29岁。杂志编辑。\n预后21天。实际存活23天（超出预后2天）。\n\n备注：超出原因不明。可能与"他者关系"有关。', pace: 'slow' },
        { type: 'narration', text: '他者关系。\n\n——如果有人"看见"你，不是作为论证者，而是作为一个人——\n结晶化就会减速。\n\n这是九课的假说。还没有确证。', pace: 'slow' },
        { type: 'unlock', archive: { type: 'terms', id: 'other_suppression' } },
        { type: 'explore' },
      ]
    },

    {
      id: 'ch1_harbor_fujimori',
      location: { time: '傍晚', place: '旧港·高架桥下' },
      bgColor: '#0a0c10',
      nodes: [
        { type: 'narration', text: '他还在。\n折叠椅。《思想录》。背对大海。\n头发全白。皮肤很白。不见日光。' },
        { type: 'dialogue', speaker: 'haku', text: '……我放了宝矿力。', position: 'left' },
        { type: 'narration', text: '沉默。很长。' },
        { type: 'dialogue', speaker: 'fujimori', text: '……她喜欢宝矿力。', position: 'right' },
        { type: 'narration', text: '他说话了。声音很轻。像是很久没用过声带。' },
        { type: 'dialogue', speaker: 'fujimori', text: '梢。\n她叫梢。\n\n……你知道她叫梢吗？', position: 'right' },
        { type: 'dialogue', speaker: 'haku', text: '现在知道了。', position: 'left' },
        { type: 'narration', text: '「人是一根会思想的芦苇。」\n\n他在小声念。\n同一页。每天。', pace: 'slow' },
        { type: 'unlock', archive: { type: 'persons', id: 'fujimori' } },
        { type: 'explore' },
      ]
    },

    {
      id: 'ch1_shopping_alley',
      location: { time: '夜', place: '商店街·暗巷' },
      bgColor: '#0a0808',
      nodes: [
        { type: 'narration', text: '巷子里有声音。\n\n有人在大声说话。\n声音年轻。愤怒。带着一种拼命想被听见的绝望。' },
        { type: 'narration', text: '「我就是超人——！\n你们这些弱者——不配理解我——！」\n\n一个少年。改造制服。\n瞳孔签名模糊不清——F.N.？\n\n不完全觉醒。', pace: 'slow' },
        { type: 'narration', text: '他的逻各斯在暴走。空气在扭曲。\n——他要结晶化了。不是42天那种。是今晚。现在。', pace: 'dramatic' },
        { type: 'dialogue', speaker: 'haku', text: '……又来了。' },
        { type: 'battle', enemy: 'nietzsche_student', afterScene: 'ch1_after_nietzsche' },
      ]
    },

    {
      id: 'ch1_after_nietzsche',
      location: { time: '夜', place: '商店街·暗巷' },
      bgColor: '#0a0808',
      nodes: [
        { type: 'narration', text: '他倒在地上。\n签名在褪色。\n\n不完全觉醒——所以不会结晶化。\n他只是……用完了。像一台过载的机器突然断电。' },
        { type: 'narration', text: '他大概十五六岁。\n制服领子上别着一枚徽章——不是学校的。\n是自己做的。上面用油性笔写着：\n\n「超人」' },
        { type: 'narration', text: '……', pace: 'pause' },
        { type: 'narration', text: '我蹲下来。\n\n他在哭。\n不是痛苦的哭。是那种——终于承认自己不是超人的哭。', pace: 'slow' },
        { type: 'dialogue', speaker: 'haku', text: '……你不是超人。\n\n但你也不是弱者。\n你只是一个读了尼采的小孩。', position: 'left' },
        { type: 'narration', text: '他没有回答。\n但他不再挣扎了。\n\n九课的车会来的。\n在此之前，我在旁边坐了一会儿。\n\n巷子里很暗。\n但至少不是一个人。' },
        { type: 'unlock', archive: { type: 'terms', id: 'incomplete_awakening' } },
        { type: 'explore' },
      ]
    },

    // === 第一章终幕 ===
    {
      id: 'ch1_finale',
      location: { time: '1999年8月20日 19:00', place: '堤防' },
      bgColor: '#1a0808',
      nodes: [
        { type: 'narration', text: '八月二十日。\n\n御厨光——预后42天。\n今天是第53天。\n\n她还活着。', pace: 'slow' },
        { type: 'narration', text: '九课的人不理解。\n他们查了三次数据。重新做了两次评估。\n\n——超出预后11天。原因不明。', },
        { type: 'narration', text: '……不。\n久我冻夜知道原因。\n他只是不说。\n\n——"他者抑制"。\n如果有人看见你是一个"人"而不是一个"论证者"——\n结晶化就会减速。', pace: 'slow' },
        { type: 'narration', text: '堤防。\n自动贩卖机。\n宝矿力。\n\n她今天也来了。\n——不是在图书馆。是在堤防。\n第一次。', },
        { type: 'dialogue', speaker: 'hikaru', text: '……这就是你每天坐的地方？', position: 'right' },
        { type: 'dialogue', speaker: 'haku', text: '嗯。', position: 'left' },
        { type: 'dialogue', speaker: 'hikaru', text: '……看不到什么特别的风景。\n海。堤防。贩卖机。沥青。', position: 'right' },
        { type: 'dialogue', speaker: 'haku', text: '不需要特别的风景。\n只需要一个可以坐着什么都不想的地方。', position: 'left' },
        { type: 'narration', text: '沉默。\n蝉在叫。\n贩卖机嗡嗡响。\n\n——和那天一样。\n和能力觉醒的那天一模一样。\n\n但有什么不一样了。', pace: 'slow' },
        { type: 'dialogue', speaker: 'hikaru', text: '夏目。', position: 'right' },
        { type: 'dialogue', speaker: 'haku', text: '嗯。', position: 'left' },
        { type: 'dialogue', speaker: 'hikaru', text: '……明天见。', position: 'right' },
        {
          type: 'choice',
          choices: [
            { text: '「明天还活着的话。」', effect: { affinity: { hikaru: 5 }, crystal: -3 }, tag: 'camus', next: 'ch1_ending_a' },
            { text: '「嗯。明天见。」', effect: { affinity: { hikaru: 3 }, crystal: -2 }, tag: 'warmth', next: 'ch1_ending_b' },
          ]
        }
      ]
    },

    {
      id: 'ch1_ending_a',
      nodes: [
        { type: 'narration', text: '她看着我。\n然后——笑了。\n\n不是嘴角微弯的那种。\n是真的笑了。\n\n很小声地。像是怕吓跑什么东西似的。', pace: 'slow' },
        { type: 'dialogue', speaker: 'hikaru', text: '你每次都说这句话。\n\n……但你每次都活着来了。\n所以我信你。', position: 'right' },
        { type: 'narration', text: '——第53天。\n她还活着。\n我也还活着。\n\n不知道明天会怎样。\n但今天的石头，已经推到山顶了。\n\n明天再来推就好。', pace: 'slow' },
        { type: 'goto', target: 'ch1_end_card' },
      ]
    },
    {
      id: 'ch1_ending_b',
      nodes: [
        { type: 'narration', text: '我说了"明天见"。\n没有附加条件。\n\n加缪大概会觉得这不像我。\n但管他呢。\n\n有些话不需要附加条件。', pace: 'slow' },
        { type: 'dialogue', speaker: 'hikaru', text: '……嗯。', position: 'right' },
        { type: 'narration', text: '她站起来。\n走了几步。\n然后回头。\n\n没有说话。只是看了我一眼。\n\n——那一眼里没有"洞穴"。\n没有"理念原型"。\n只有一个普通的女孩，在夕阳下回头看了一眼。', pace: 'slow' },
        { type: 'goto', target: 'ch1_end_card' },
      ]
    },

    {
      id: 'ch1_end_card',
      bgColor: '#000000',
      nodes: [
        { type: 'effect', effect: 'fade_black', duration: 2000 },
        { type: 'narration', text: '——第一章「世紀末的異鄉人」 完——', style: 'chapter_end', pace: 'dramatic' },
        { type: 'narration', text: '石头从山顶滚下来。\n\n第329次。\n\n走下山。\n明天继续推。', pace: 'slow', style: 'chapter_end' },
        { type: 'unlock', flag: { _chapterEnd: true } },
        { type: 'end' },
      ]
    }
  ]
};
