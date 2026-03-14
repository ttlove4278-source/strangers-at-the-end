const ArchiveSystem = {
  currentTab: 'persons',
  _keyHandler: null,

  data: {
    persons: () => {
      return Object.values(CHARACTERS).filter(c => GameState.archive.persons.includes(c.id) && c.archiveEntry).map(c => ({
        title: c.name,
        code: c.archiveEntry.code,
        classification: c.archiveEntry.classification,
        color: c.color,
        content: c.archiveEntry.bio,
        quote: c.archiveEntry.quote,
      }));
    },
    philosophy: () => {
      const data = {
        camus: { name: '阿尔贝·加缪', period: '1913-1960', school: '荒诞主义', core: '人必须想象西西弗是幸福的。', desc: '阿尔及利亚出生的法国作家、哲学家。\n核心命题：世界是荒诞的，但人可以在荒诞中找到反抗的尊严。\n\n论证者特征：橙色逻各斯，烟/热浪质感。\n代表能力：死亡重置、时间覆盖。\n天然抗结晶——因为加缪拒绝体系闭环。' },
        plato: { name: '柏拉图', period: 'BC428-BC348', school: '理念论', core: '世界是投影。', desc: '古希腊哲学家。苏格拉底的学生。\n核心命题：我们所见的现实是理念世界的投影（洞穴比喻）。\n\n论证者特征：紫色逻各斯，大理石纹质感。\n代表能力：揭露事物的理念原型、看穿幻象。\n结晶化风险极高——因为真理是一个闭环。' },
        nietzsche: { name: '弗里德里希·尼采', period: '1844-1900', school: '权力意志/超人哲学', core: '上帝已死。', desc: '德国哲学家。\n核心命题：旧价值体系已崩塌，人必须自己成为价值的创造者。\n\n论证者特征：金色逻各斯，烈日/金箔质感。\n代表能力：领域展开（角斗场）、权力意志。\n天然抗结晶——但代价是永恒的孤独。' },
        kant: { name: '伊曼努尔·康德', period: '1724-1804', school: '先验唯心主义', core: '人为自然立法。', desc: '德国哲学家。启蒙时代核心人物。\n核心命题：人类无法认识物自体，只能认识现象。\n\n论证者特征：蓝色逻各斯，几何/棱镜质感。\n代表能力：规则识别、法则借用。\n康德体系自带抗性——因为它承认人类的局限。' },
        pascal: { name: '布莱兹·帕斯卡', period: '1623-1662', school: '信仰与理性', core: '人是一根会思想的芦苇。', desc: '法国数学家、物理学家、哲学家。\n核心命题：人的伟大在于知道自己渺小。\n\n论证者特征：白色/透明逻各斯，虚无质感。\n代表能力：存在感稀释、无限空间体验。\n代价与记忆直接相关——遗忘是帕斯卡系的宿命。' },
      };
      return GameState.archive.philosophy.filter(id => data[id]).map(id => ({
        title: data[id].name,
        code: data[id].period,
        classification: data[id].school,
        color: CHARACTERS[Object.keys(CHARACTERS).find(k => CHARACTERS[k].philosopher && CHARACTERS[k].philosopher.includes(data[id].name.slice(0,2)))]?.color || 'var(--white)',
        content: data[id].desc,
        quote: data[id].core,
      }));
    },
    terms: () => {
      const data = {
        philosophy_disease: { name: '哲学症', desc: '1999年夏确认的文明病。人类两千年思想积淀在世纪末达到临界质量，意义本身开始链式反应。\n\n发病三要素：接触、共鸣、撕裂。\n症状进程：默读→辩白→独白→绝笔。\n终末：肉身崩解，化为理论结晶。' },
        logos: { name: '逻各斯 (Logos)', desc: '论证者使用的能量。希腊语原义：话语、理性、尺度。\n本质不是"从身体里涌出的力量"，而是"世界暂时接受了你的主张"。\n\n密度单位：1赫拉克利特（简称1赫）。\n基准：普通人一天产生的自我认同 ≈ 0.3赫。' },
        other_suppression: { name: '他者抑制', desc: '九课假说（未确证）。\n\n当论证者被真正"看见"——不是作为能力者、不是作为患者，而是作为"一个人"时，逻各斯增殖速度骤降，结晶化进程减速。\n\n机制不明。但案例表明，被"看见"的论证者平均存活时间延长20-40%。' },
        incomplete_awakening: { name: '不完全觉醒', desc: '哲学症发病但未完全与思想源流同步的状态。\n瞳孔签名模糊，能力不稳定，逻各斯密度低。\n\n好消息：不会结晶化。\n坏消息：暴走时会伤害周围。\n\n多见于青少年——思想尚未定型，所以同步率低。' },
      };
      return GameState.archive.terms.filter(id => data[id]).map(id => ({
        title: data[id].name,
        code: '',
        classification: '用语',
        color: 'var(--grey-light)',
        content: data[id].desc,
        quote: '',
      }));
    },
    crystals: () => {
      const data = {
        descartes_1987: { name: '笛卡尔结晶·1987', desc: '在櫂町市立图书馆哲学区发现的理论结晶。\n\n原持有者不明。扉页题词：「致我仍在怀疑的自己 —— 1987.4」\n\n结晶内容：关于"怀疑是否有尽头"的个人思考。\n结论：怀疑没有尽头。但"我在怀疑"这件事本身是确定的。\n\n——这个结论杀死了他。因为它太完美了。' },
      };
      return GameState.archive.crystals.filter(id => data[id]).map(id => ({
        title: data[id].name,
        code: '',
        classification: '理论結晶',
        color: 'var(--crystal)',
        content: data[id].desc,
        quote: '',
      }));
    }
  },

  init() {
    this.currentTab = 'persons';
    this.renderTabs();
    this.renderContent();
    this.bindInput();
  },

  renderTabs() {
    const tabs = document.querySelectorAll('.archive-tab');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === this.currentTab);
      tab.onclick = () => {
        this.currentTab = tab.dataset.tab;
        this.renderTabs();
        this.renderContent();
        audio.playSelect();
      };
    });
  },

  renderContent() {
    const container = document.getElementById('archive-content');
    const entries = this.data[this.currentTab]();

    if (entries.length === 0) {
      container.innerHTML = '<div class="archive-empty">——該当資料なし——</div>';
      return;
    }

    container.innerHTML = entries.map(entry => `
      <div class="archive-entry">
        <div class="archive-entry-header">
          <div class="ae-color-bar" style="background:${entry.color}"></div>
          <div class="ae-title" style="color:${entry.color}">${entry.title}</div>
          <div class="ae-code">${entry.code}</div>
          <div class="ae-class">${entry.classification}</div>
        </div>
        <div class="ae-body">${entry.content.replace(/\n/g, '<br>')}</div>
        ${entry.quote ? `<div class="ae-quote">${entry.quote}</div>` : ''}
      </div>
    `).join('');

    const backBtn = document.querySelector('#screen-archive .archive-back');
    backBtn.onclick = () => { audio.playConfirm(); this.destroy(); Engine.returnFromOverlay(); };
  },

  bindInput() {
    this._keyHandler = (e) => {
      if (e.code === 'Escape') { e.preventDefault(); audio.playConfirm(); this.destroy(); Engine.returnFromOverlay(); }
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  destroy() {
    if (this._keyHandler) { document.removeEventListener('keydown', this._keyHandler); this._keyHandler = null; }
  }
};
