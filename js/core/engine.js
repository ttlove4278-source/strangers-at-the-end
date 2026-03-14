var Engine = {
  initialized: false,
  currentChapterScript: null,
  returnAfterBattle: null,

  boot: async function() {
    Transitions.init();
    DialogueSystem.init();
    MobileControls.init();

    var bootScreen = document.getElementById('screen-boot');
    var lines = bootScreen.querySelectorAll('.boot-line');
    var cursor = bootScreen.querySelector('.boot-cursor');

    await new Promise(function(resolve) {
      var handler = function() {
        document.removeEventListener('click', handler);
        document.removeEventListener('keydown', handler);
        audio.init();
        audio.resume();
        resolve();
      };
      document.addEventListener('click', handler);
      document.addEventListener('keydown', handler);
    });

    var hint = bootScreen.querySelector('.boot-hint');
    if (hint) hint.style.display = 'none';

    for (var i = 0; i < lines.length; i++) {
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

  startNewGame: async function() {
    GameState.story.chapter = 0;
    GameState.story.completedScenes = [];
    GameState.story.flags = {};
    GameState.story.choices = [];
    this.currentChapterScript = SCRIPT_PROLOGUE;
    await Transitions.switchScreen('title', 'poem', 'fade', 700);
    await PoemScreen.play(this.currentChapterScript.poem);
    await Transitions.switchScreen('poem', 'dialogue', 'fade', 500);
    var first = this.currentChapterScript.scenes.find(function(s) { return s.id === 'prologue_01'; });
    if (first) DialogueSystem.playScene(first);
  },

  startChapter1: async function() {
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
      var first = this.currentChapterScript.scenes.find(function(s) { return s.id === Engine.currentChapterScript.firstScene; });
      if (first) DialogueSystem.playScene(first);
    }
  },

  onSceneEnd: function() {
    var script = this.currentChapterScript;
    if (!script) return;

    // DLC场景结束不做任何事（DLC自己管理流程）
    if (script === SCRIPT_DLC_MIYUKI) return;

    GameState.save(0);

    if (GameState.story.flags._chapterEnd) {
      delete GameState.story.flags._chapterEnd;
      this.onChapterEnd();
      return;
    }

    if (script.startMode === 'explore' && GameState.story.chapter >= 1) {
      Transitions.switchScreen('dialogue', 'explore', 'fade', 500).then(function() {
        ExploreSystem.enter(script);
      });
      return;
    }

    if (GameState.story.chapter === 0) {
      this.startChapter1();
      return;
    }
  },

  onChapterEnd: function() {
    GameState.save(0);
    var self = this;
    setTimeout(async function() {
      await Transitions.switchScreen(GameState.currentScreen, 'title', 'fade', 1200);
      TitleScreen.init();
      DLCMiyuki.initTitleFlip();
    }, 1500);
  },

  enterSceneFromExplore: async function(sceneId) {
    var script = this.currentChapterScript;
    if (!script) return;
    var scene = script.scenes.find(function(s) { return s.id === sceneId; });
    if (!scene) return;
    await Transitions.switchScreen('explore', 'dialogue', 'fade', 500);
    DialogueSystem.playScene(scene);
  },

  startBattle: async function(enemyId, returnScene) {
    this.returnAfterBattle = returnScene || null;
    await Transitions.switchScreen(GameState.currentScreen, 'battle', 'glitch', 600);
    BattleSystem.start(enemyId);
  },

  onBattleEnd: async function() {
    var script = this.currentChapterScript;
    var self = this;

    if (this.returnAfterBattle) {
      var afterId = this.returnAfterBattle;
      var after = script.scenes.find(function(s) { return s.id === afterId; });
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

    var afterBattle = script.scenes.find(function(s) { return s.id === 'prologue_after_battle'; });
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

  showConfig: async function() {
    GameState.previousScreen = GameState.currentScreen;
    await Transitions.switchScreen(GameState.currentScreen, 'config', 'fade', 400);
    ConfigScreen.init();
  },

  backToTitle: async function() {
    ConfigScreen.destroy();
    var from = GameState.currentScreen;
    await Transitions.switchScreen(from, 'title', 'fade', 400);
    TitleScreen.init();
    DLCMiyuki.initTitleFlip();
  },

  showSaveScreen: async function(mode) {
    GameState.previousScreen = GameState.currentScreen;
    await Transitions.switchScreen(GameState.currentScreen, 'save', 'fade', 400);
    SaveUI.init(mode);
  },

  showArchive: async function() {
    GameState.previousScreen = GameState.currentScreen;
    await Transitions.switchScreen(GameState.currentScreen, 'archive', 'fade', 400);
    ArchiveSystem.init();
  },

  returnFromOverlay: async function() {
    var target = GameState.previousScreen || 'title';
    var from = GameState.currentScreen;
    await Transitions.switchScreen(from, target, 'fade', 400);
    if (target === 'title') {
      TitleScreen.init();
      DLCMiyuki.initTitleFlip();
    } else if (target === 'explore') {
      ExploreSystem.enter(this.currentChapterScript);
    }
  },

  wait: function(ms) {
    return new Promise(function(r) { setTimeout(r, ms); });
  }
};

document.addEventListener('DOMContentLoaded', function() {
  Engine.boot();
});
