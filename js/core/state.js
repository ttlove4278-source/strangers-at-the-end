/**
 * 游戏状态管理
 */
const GameState = {
  // 当前画面
  currentScreen: 'boot',

  // 玩家数据
  player: {
    name: '夏目 珀',
    deathCount: 327,
    logos: 6.2,
    logosMax: 10,
    crystallization: 12,
    hp: 100,
    hpMax: 100
  },

  // 剧情进度
  story: {
    chapter: 0,        // 0=序章
    scene: null,
    nodeIndex: 0,
    flags: {},
    choices: [],       // 记录所有选择
  },

  // 人物好感度 / 思想亲和
  affinity: {
    hikaru: 0,
    rei: 0,
    toya: 0,
  },

  // 思想亲和
  philosophy: {
    camus: 5,
    plato: 0,
    nietzsche: 0,
    kant: 0,
  },

  // 设置
  config: {
    textSpeed: 30,     // ms per char
    autoSpeed: 2000,   // ms auto wait
    volume: 0.3,
    scanlines: true,
    noise: true,
  },

  // 存档
  save() {
    const data = {
      player: this.player,
      story: this.story,
      affinity: this.affinity,
      philosophy: this.philosophy,
      config: this.config,
      timestamp: Date.now()
    };
    try {
      localStorage.setItem('seiki_save', JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('Save failed:', e);
      return false;
    }
  },

  load() {
    try {
      const raw = localStorage.getItem('seiki_save');
      if (!raw) return false;
      const data = JSON.parse(raw);
      Object.assign(this.player, data.player);
      Object.assign(this.story, data.story);
      Object.assign(this.affinity, data.affinity);
      Object.assign(this.philosophy, data.philosophy);
      Object.assign(this.config, data.config);
      return true;
    } catch (e) {
      console.warn('Load failed:', e);
      return false;
    }
  },

  hasSave() {
    return !!localStorage.getItem('seiki_save');
  },

  applyEffect(effect) {
    if (!effect) return;
    if (effect.logos !== undefined) {
      this.player.logos = Math.max(0, Math.min(
        this.player.logosMax, this.player.logos + effect.logos
      ));
    }
    if (effect.crystal !== undefined) {
      this.player.crystallization = Math.max(0, Math.min(
        100, this.player.crystallization + effect.crystal
      ));
    }
    if (effect.affinity) {
      for (const [key, val] of Object.entries(effect.affinity)) {
        if (this.affinity[key] !== undefined) {
          this.affinity[key] += val;
        }
      }
    }
    if (effect.philosophy) {
      for (const [key, val] of Object.entries(effect.philosophy)) {
        if (this.philosophy[key] !== undefined) {
          this.philosophy[key] += val;
        }
      }
    }
  }
};
