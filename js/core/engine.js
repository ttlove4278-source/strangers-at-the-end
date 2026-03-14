/**
 * 《世纪末異鄉人》游戏主引擎
 */
const Engine = {
  initialized: false,
  sceneQueue: [],
  currentSceneIndex: 0,

  /**
   * 初始化
   */
  async init() {
    if (this.initialized) return;

    // 初始化子系统
    Transitions.init();
    DialogueSystem.init();

    // 首次交互后初始化音频
    const initAudio = () => {
      audio.init();
      audio.resume();
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
    document.addEventListener('click', initAudio);
    document.addEventListener('keydown', initAudio);

    this.initialized = true;

    // 启动BOOT序列
    await this.bootSequence();
  },

  /**
   * BOOT开机序列
   */
  async bootSequence() {
    const bootScreen = document.getElementById('screen-boot');
    const lines = bootScreen.querySelectorAll('.boot-line');
    const cursor = bootScreen.querySelector('.boot-cursor');

    // 逐行显示
    for (const line of lines) {
      const delay = parseInt(line.dataset.delay) || 0;
      await this.wait(delay ? delay - (parseInt(lines[0].dataset.delay) || 0) : 300);
      line.classList.add('visible');

      // 初始化音频（需要用户交互）
      audio.init();
      audio.playCRTBoot();

      // 如果前面有行，计算相对延迟
      if (line === lines[0]) {
        await this.wait(400);
      }
    }

    // 显示光标
    await this.wait(400);
    cursor.classList.add('visible');

    // 等待
    await this.wait(1500);

    // 跳转到OP
    await Transitions.switchScreen('boot', 'opening', 'crt_off', 800);
    await this.playOpening();
  },

  /**
   * OP动画
   */
  async playOpening() {
    await Opening.play();
    await Transitions.switchScreen('opening', 'title', 'fade', 1000);
    this.showTitle();
  },

  /**
   * 标题画面
   */
  showTitle() {
    TitleScreen.init();
  },

  /**
   * 开始新游戏
   */
  async startGame() {
    TitleScreen.destroy();

    // 切到卷首诗
    await Transitions.switchScreen('title', 'poem', 'fade', 800);

    // 播放序章卷首诗
    await PoemScreen.play(SCRIPT_PROLOGUE.poem);

    // 切到对话画面
    await Transitions.switchScreen('poem', 'dialogue', 'fade', 600);

    // 播放序章第一个场景
    this.sceneQueue = SCRIPT_PROLOGUE.scenes.filter(s =>
      s.id === 'prologue_01'
    );
    this.currentSceneIndex = 0;
    this.playNextScene();
  },

  /**
   * 继续游戏
   */
  async continueGame() {
    // TODO: 根据存档恢复
    await this.startGame();
  },

  /**
   * 播放下一个场景
   */
  playNextScene() {
    if (this.currentSceneIndex >= this.sceneQueue.length) {
      this.onAllScenesComplete();
      return;
    }

    const scene = this.sceneQueue[this.currentSceneIndex];
    DialogueSystem.playScene(scene);
  },

  /**
   * 场景结束回调
   */
  onSceneEnd() {
    this.currentSceneIndex++;

    if (this.currentSceneIndex < this.sceneQueue.length) {
      this.playNextScene();
    } else {
      this.onAllScenesComplete();
    }
  },

  /**
   * 所有场景播放完毕
   */
  async onAllScenesComplete() {
    // 序章完毕 → 保存 → 回标题 or 继续
    GameState.story.chapter = 0;
    GameState.story.scene = 'complete';
    GameState.save();

    await this.wait(2000);
    await Transitions.switchScreen('dialogue', 'title', 'fade', 1500);
    this.showTitle();
  },

  /**
   * 工具
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// ===== 启动 =====
document.addEventListener('DOMContentLoaded', () => {
  // 修正boot序列的时序
  const bootScreen = document.getElementById('screen-boot');
  const lines = bootScreen.querySelectorAll('.boot-line');
  const cursor = bootScreen.querySelector('.boot-cursor');

  // 先显示boot画面，等待点击
  const startOnInteraction = async () => {
    document.removeEventListener('click', startOnInteraction);
    document.removeEventListener('keydown', startOnInteraction);

    audio.init();
    audio.resume();

    // Boot 序列
    for (let i = 0; i < lines.length; i++) {
      const delay = i === 0 ? 300 : 400 + Math.random() * 200;
      await new Promise(r => setTimeout(r, delay));
      lines[i].classList.add('visible');
      audio.playCRTBoot();
    }

    await new Promise(r => setTimeout(r, 500));
    cursor.classList.add('visible');
    await new Promise(r => setTimeout(r, 1200));

    // 跳转OP
    await Transitions.init();
    await Transitions.switchScreen('boot', 'opening', 'crt_off', 800);

    // OP
    await Opening.play();
    await Transitions.switchScreen('opening', 'title', 'fade', 1000);

    // 标题
    TitleScreen.init();
    DialogueSystem.init();

    // 把startGame绑到Engine
    Engine.initialized = true;
  };

  // 显示"点击开始"提示
  const hint = document.createElement('div');
  hint.style.cssText = `
    position: absolute; bottom: 15vh; left: 50%; transform: translateX(-50%);
    font-family: var(--font-mono); font-size: 0.75rem; color: var(--grey-dark);
    letter-spacing: 0.3em; animation: breathe 2s ease-in-out infinite;
  `;
  hint.textContent = 'CLICK TO START';
  bootScreen.querySelector('.boot-content').appendChild(hint);

  document.addEventListener('click', startOnInteraction);
  document.addEventListener('keydown', startOnInteraction);
});

// Engine的startGame需要重新绑定（因为DOMContentLoaded里的逻辑覆盖了）
Engine.startGame = async function() {
  TitleScreen.destroy();

  await Transitions.switchScreen('title', 'poem', 'fade', 800);
  await PoemScreen.play(SCRIPT_PROLOGUE.poem);
  await Transitions.switchScreen('poem', 'dialogue', 'fade', 600);

  // 播放序章
  const firstScene = SCRIPT_PROLOGUE.scenes.find(s => s.id === 'prologue_01');
  if (firstScene) {
    DialogueSystem.playScene(firstScene);
  }
};

Engine.onSceneEnd = function() {
  // 序章结束
  Engine.onAllScenesComplete();
};

Engine.onAllScenesComplete = async function() {
  GameState.save();
  await new Promise(r => setTimeout(r, 2000));
  await Transitions.switchScreen('dialogue', 'title', 'fade', 1500);
  TitleScreen.init();
};
