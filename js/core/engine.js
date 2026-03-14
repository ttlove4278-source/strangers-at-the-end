const Engine = {
  initialized: false,
  currentChapterScript: null,
  returnAfterBattle: null,

  async boot() {
    Transitions.init();
    DialogueSystem.init();
    MobileControls.init();

    const bootScreen = document.getElementById('screen-boot');
    const lines = bootScreen.querySelectorAll('.boot-line');
    const cursor = bootScreen.querySelector('.boot-cursor');

    await new Promise(resolve => {
      const handler = () => {
        document.removeEventListener('click', handler);
        document.removeEventListener('keydown', handler);
        audio.init(); audio.resume(); resolve();
      };
      document.addEventListener('click', handler);
      document.addEventListener('keydown', handler);
    });

    const hint = bootScreen.querySelector('.boot-hint');
    if (hint) hint.style.display = 'none';

    for (let i = 0; i < lines.length; i++) {
      await this.wait(280 + Math.random() * 180);
      lines[i].classList.add('visible');
      audio.playCRTBoot();
    }
    await this.wait(350);
    cursor.classList.add('visible');
    await this.wait(900);

    await Transitions.switchScreen('boot', 'opening', 'crt_off', 700);
    await Opening.play();
    await Transitions.switchScreen('opening', 'title', 'fade', 800);

    TitleScreen.init();
    DLCMiyuki.initTitleFlip();
    this.initialized = true;
  },

  async startNewGame() {
    GameState.story.chapter = 0;
    this.currentChapterScript = SCRIPT_PROLOGUE;
    await Transitions.switchScreen('title', 'poem', 'fade', 700);
    await PoemScreen.play(this.currentChapterScript.poem);
    await Transitions.switchScreen('poem', 'dialogue', 'fade', 500);
    const first = this.currentChapterScript.scenes.find(s => s.id === 'prologue_01');
    if (first) DialogueSystem.playScene(first);
  },

  async startChapter1() {
    GameState.story.chapter = 1;
    GameState.story.day = '1999.07.19';
    this.currentChapterScript = SCRIPT_CHAPTER1;
    GameState.unlockArchive('persons', 'hikaru');
    GameState.unlockArchive('persons', 'toya');
    await Transitions.switchScreen(GameState.currentScreen, 'poem', 'fade', 700);
    await PoemScreen.play(this.currentChapterScript.poem);
    if (this.currentChapterScript.startMode === 'explore') {
      await Transitions.switchScreen('poem', 'explore', 'fade', 500);
      ExploreSystem.enter(this.currentChapterScript);
    } else {
      await Transitions.switchScreen('poem', 'dialogue', 'fade', 500);
      const first = this.currentChapterScript.scenes.find(s => s.id === this.currentChapterScript.firstScene);
      if (first) DialogueSystem.playScene(first);
    }
  },

  onSceneEnd() {
    const script = this.currentChapterScript;
    if (!script) return;

    // DLC结束
    if (script === SCRIPT_DLC_MIYUKI) return;

    GameState.save(0);

    if (GameState.story.flags._chapterEnd) {
      delete GameState.story.flags._chapterEnd;
      this.onChapterEnd();
      return;
    }

    if (script.startMode === 'explore' && GameState.story.chapter >= 1) {
      Transitions.switchScreen('dialogue', 'explore', 'fade', 500).then(() => ExploreSystem.enter(script));
      return;
    }

    if (GameState.story.chapter === 0) {
      this.startChapter1();
      return;
    }
  },

  onChapterEnd() {
    GameState.save(0);
    setTimeout(async () => {
      await Transitions.switchScreen(GameState.currentScreen, 'title', 'fade', 1200);
      TitleScreen.init();
      DLCMiyuki.initTitleFlip();
    }, 1500);
  },

  async enterSceneFromExplore(sceneId) {
    const script = this.currentChapterScript;
    if (!script) return;
    const scene = script.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    await Transitions.switchScreen('explore', 'dialogue', 'fade', 500);
    DialogueSystem.playScene(scene);
  },

  async startBattle(enemyId, returnScene) {
    this.returnAfterBattle = returnScene || null;
    await Transitions.switchScreen(GameState.currentScreen, 'battle', 'glitch', 600);
    BattleSystem.start(enemyId);
  },

  async onBattleEnd() {
    const script = this.currentChapterScript;
    if (this.returnAfterBattle) {
      const after = script.scenes.find(s => s.id === this.returnAfterBattle);
      if (after) {
        this.returnAfterBattle = null;
        await Transitions.switchScreen('battle', 'dialogue', 'fade', 600);
        DialogueSystem.currentScene = after;
        DialogueSystem.nodeIndex = 0;
        DialogueSystem.active = true;
        audio.startCicadas();
        if (after.location) DialogueSystem.showLocation(after.location.time, after.location.place);
        if (after.bgColor) DialogueSystem.els.bg.style.background = after.bgColor;
        await this.wait(400);
        DialogueSystem.processNode();
        return;
      }
    }
    const afterBattle = script.scenes.find(s => s.id === 'prologue_after_battle');
    if (afterBattle) {
      await Transitions.switchScreen('battle', 'dialogue', 'fade', 600);
      DialogueSystem.currentScene = afterBattle;
      DialogueSystem.nodeIndex = 0;
      DialogueSystem.active = true;
      audio.startCicadas();
      if (afterBattle.location) DialogueSystem.showLocation(afterBattle.location.time, afterBattle.location.place);
      if (afterBattle.bgColor) DialogueSystem.els.bg.style.background = afterBattle.bgColor;
      await this.wait(400);
      DialogueSystem.processNode();
    } else {
      await Transitions.switchScreen('battle', 'explore', 'fade', 600);
      ExploreSystem.enter(script);
    }
  },

  async showConfig() {
    GameState.previousScreen = GameState.currentScreen;
    await Transitions.switchScreen(GameState.currentScreen, 'config', 'fade', 400);
    ConfigScreen.init();
  },

  async backToTitle() {
    ConfigScreen.destroy();
    await Transitions.switchScreen(GameState.currentScreen, 'title', 'fade', 400);
    TitleScreen.init();
    DLCMiyuki.initTitleFlip();
  },

  async showSaveScreen(mode) {
    GameState.previousScreen = GameState.currentScreen;
    await Transitions.switchScreen(GameState.currentScreen, 'save', 'fade', 400);
    SaveUI.init(mode);
  },

  async showArchive() {
    GameState.previousScreen = GameState.currentScreen;
    await Transitions.switchScreen(GameState.currentScreen, 'archive', 'fade', 400);
    ArchiveSystem.init();
  },

  async returnFromOverlay() {
    const target = GameState.previousScreen || 'title';
    await Transitions.switchScreen(GameState.currentScreen, target, 'fade', 400);
    if (target === 'title') { TitleScreen.init(); DLCMiyuki.initTitleFlip(); }
    else if (target === 'explore') ExploreSystem.enter(this.currentChapterScript);
  },

  wait(ms) { return new Promise(r => setTimeout(r, ms)); }
};

document.addEventListener('DOMContentLoaded', () => Engine.boot());
