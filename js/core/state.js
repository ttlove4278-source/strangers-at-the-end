const GameState = {
  currentScreen: 'boot',
  previousScreen: null,

  player: {
    name: '夏目 珀',
    deathCount: 327,
    logos: 6.2,
    logosMax: 10,
    crystallization: 12,
    hp: 100,
    hpMax: 100,
    items: [
      { id: 'pocari', name: '宝矿力', desc: 'HP+20', count: 2 },
    ]
  },

  story: {
    chapter: 0,
    scene: null,
    nodeIndex: 0,
    flags: {},
    choices: [],
    completedScenes: [],
    day: '1999.07.13',
  },

  affinity: { hikaru: 0, rei: 0, toya: 0 },
  philosophy: { camus: 5, plato: 0, nietzsche: 0, kant: 0 },

  // 已解锁档案
  archive: {
    persons: ['haku'],
    philosophy: ['camus'],
    terms: ['philosophy_disease', 'logos'],
    crystals: [],
  },

  config: {
    textSpeed: 30,
    autoSpeed: 2000,
    volume: 0.3,
    scanlines: true,
    noise: true,
  },

  // === 多栏位存档 ===
  save(slot = 0) {
    try {
      const data = {
        player: JSON.parse(JSON.stringify(this.player)),
        story: JSON.parse(JSON.stringify(this.story)),
        affinity: { ...this.affinity },
        philosophy: { ...this.philosophy },
        archive: JSON.parse(JSON.stringify(this.archive)),
        config: { ...this.config },
        timestamp: Date.now(),
        version: 2,
      };
      localStorage.setItem('seiki_save_' + slot, JSON.stringify(data));
      return true;
    } catch (e) { return false; }
  },

  load(slot = 0) {
    try {
      const raw = localStorage.getItem('seiki_save_' + slot);
      if (!raw) return false;
      const d = JSON.parse(raw);
      Object.assign(this.player, d.player);
      Object.assign(this.story, d.story);
      Object.assign(this.affinity, d.affinity);
      Object.assign(this.philosophy, d.philosophy);
      if (d.archive) Object.assign(this.archive, d.archive);
      Object.assign(this.config, d.config);
      return true;
    } catch (e) { return false; }
  },

  getSaveInfo(slot) {
    try {
      const raw = localStorage.getItem('seiki_save_' + slot);
      if (!raw) return null;
      const d = JSON.parse(raw);
      return {
        day: d.story.day || '???',
        chapter: d.story.chapter,
        deaths: d.player.deathCount,
        crystal: d.player.crystallization,
        timestamp: d.timestamp,
      };
    } catch (e) { return null; }
  },

  deleteSave(slot) {
    localStorage.removeItem('seiki_save_' + slot);
  },

  hasSave() {
    for (let i = 0; i < 6; i++) {
      if (localStorage.getItem('seiki_save_' + i)) return true;
    }
    return false;
  },

  applyEffect(effect) {
    if (!effect) return;
    if (effect.logos !== undefined)
      this.player.logos = Math.max(0, Math.min(this.player.logosMax, this.player.logos + effect.logos));
    if (effect.crystal !== undefined)
      this.player.crystallization = Math.max(0, Math.min(100, this.player.crystallization + effect.crystal));
    if (effect.hp !== undefined)
      this.player.hp = Math.max(0, Math.min(this.player.hpMax, this.player.hp + effect.hp));
    if (effect.affinity) {
      for (const [k, v] of Object.entries(effect.affinity)) {
        if (this.affinity[k] !== undefined) this.affinity[k] += v;
      }
    }
    if (effect.unlock) {
      const { type, id } = effect.unlock;
      if (this.archive[type] && !this.archive[type].includes(id)) {
        this.archive[type].push(id);
      }
    }
    if (effect.flag) {
      Object.assign(this.story.flags, effect.flag);
    }
  },

  unlockArchive(type, id) {
    if (this.archive[type] && !this.archive[type].includes(id)) {
      this.archive[type].push(id);
    }
  }
};
