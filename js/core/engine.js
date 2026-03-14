const Engine = {
  initialized: false,

  async boot() {
    Transitions.init();
    DialogueSystem.init();

    const bootScreen = document.getElementById('screen-boot');
    const lines = bootScreen.querySelectorAll('.boot-line');
    const cursor = bootScreen.querySelector('.boot-cursor');

    // 等待首次交互
    await new Promise(resolve => {
      const handler = () => {
        document.removeEventListener('click', handler);
        document.removeEventListener('keydown', handler);
        audio.init();
        audio.resume();
        resolve();
      };
      document.addEventListener('click', handler);
      document.addEventListener('keydown', handler);
    });

    // 隐藏提示
    const hint = bootScreen.querySelector('.boot-hint');
    if (hint) hint.style.display = 'none';

    // Boot序列
    for (let i = 0; i < lines.length; i++) {
      await this.wait(300 + Math.random() * 200);
      lines[i].classList.add('visible');
      audio.playCRTBoot();
    }
    await this.wait(400);
    cursor.classList.add('visible');
    await this.wait(1000);

    // OP
    await Transitions.switchScreen('boot', 'opening', 'crt_off', 700);
    await Opening.play();
    await Transitions.switchScreen('opening', 'title', 'fade', 800);
    TitleScreen.init();
    this.initialized = true;
  },

  async startNewGame() {
    await Transitions.switchScreen('title', 'poem', 'fade', 700);
    await PoemScreen.play(SCRIPT_PROLOGUE.poem);
    await Transitions.switchScreen('poem', 'dialogue', 'fade', 500);
    const firstScene = SCRIPT_PROLOGUE.scenes.find(s => s.id === 'prologue_01');
    if (firstScene) DialogueSystem.playScene(firstScene);
  },

  async showConfig() {
    await Transitions.switchScreen('title', 'config', 'fade', 400);
    ConfigScreen.init();
  },

  async backToTitle() {
    ConfigScreen.destroy();
    await Transitions.switchScreen('config', 'title', 'fade', 400);
    TitleScreen.init();
  },

  async startBattle(enemyId) {
    await Transitions.switchScreen('dialogue', 'battle', 'glitch', 600);
    BattleSystem.start(enemyId);
  },

  async onBattleEnd() {
    await Transitions.switchScreen('battle', 'dialogue', 'fade', 600);
    // 继续剧情：跳到战后场景
    const afterBattle = SCRIPT_PROLOGUE.scenes.find(s => s.id === 'prologue_after_battle');
    if (afterBattle) {
      DialogueSystem.currentScene = afterBattle;
      DialogueSystem.nodeIndex = 0;
      DialogueSystem.active = true;
      audio.startCicadas();
      if (afterBattle.location) {
        DialogueSystem.showLocation(afterBattle.location.time, afterBattle.location.place);
      }
      if (afterBattle.bgColor) {
        DialogueSystem.els.bg.style.background = afterBattle.bgColor;
      }
      await this.wait(400);
      DialogueSystem.processNode();
    }
  },

  onSceneEnd() {
    // 序章结束
    GameState.save();
    setTimeout(async () => {
      await Transitions.switchScreen('dialogue', 'title', 'fade', 1200);
      TitleScreen.init();
    }, 1500);
  },

  wait(ms) { return new Promise(r => setTimeout(r, ms)); }
};

// 启动
document.addEventListener('DOMContentLoaded', () => Engine.boot());
