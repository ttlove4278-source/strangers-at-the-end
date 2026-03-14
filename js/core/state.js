const GameState = {
  currentScreen: 'boot',

  player: {
    name: '夏目 珀',
    deathCount: 327,
    logos: 6.2,
    logosMax: 10,
    crystallization: 12,
    hp: 100,
    hpMax: 100
  },

  story: {
    chapter: 0,
    scene: null,
    nodeIndex: 0,
    flags: {},
    choices: [],
  },

  affinity: { hikaru: 0, rei: 0, toya: 0 },

  philosophy: { camus: 5, plato: 0, nietzsche: 0, kant: 0 },

  config: {
    textSpeed: 30,
    autoSpeed: 2000,
    volume: 0.3,
    scanlines: true,
    noise: true,
  },

  save() {
    try {
      localStorage.setItem('seiki_save', JSON.stringify({
        player: this.player, story: this.story,
        affinity: this.affinity, philosophy: this.philosophy,
        config: this.config, timestamp: Date.now()
      }));
      return true;
    } catch(e) { return false; }
  },

  load() {
    try {
      const raw = localStorage.getItem('seiki_save');
      if (!raw) return false;
      const d = JSON.parse(raw);
      Object.assign(this.player, d.player);
      Object.assign(this.story, d.story);
      Object.assign(this.affinity, d.affinity);
      Object.assign(this.philosophy, d.philosophy);
      Object.assign(this.config, d.config);
      return true;
    } catch(e) { return false; }
  },

  hasSave() { return !!localStorage.getItem('seiki_save'); },

  applyEffect(effect) {
    if (!effect) return;
    if (effect.logos !== undefined) {
      this.player.logos = Math.max(0, Math.min(this.player.logosMax, this.player.logos + effect.logos));
    }
    if (effect.crystal !== undefined) {
      this.player.crystallization = Math.max(0, Math.min(100, this.player.crystallization + effect.crystal));
    }
  }
};
