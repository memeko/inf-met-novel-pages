(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const VIEW_W = 960;
  const VIEW_H = 540;
  const CANVAS_W = 2560;
  const CANVAS_H = 1440;
  const RENDER_SCALE_X = CANVAS_W / VIEW_W;
  const RENDER_SCALE_Y = CANVAS_H / VIEW_H;
  const STEP = 1 / 60;

  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;

  const palette = {
    ink: "#1a2136",
    paper: "#f4ebd8",
    panelBlue: "#24395f",
    panelBlueDark: "#1b2a46",
    burgundy: "#753246",
    emerald: "#2f6956",
    softGold: "#d6b86a",
    warning: "#d4524f",
  };
  const locationLabelColor = "#1f3556";

  const roadmap = {
    bvo: [
      "1 курс: Первая пара",
      "2 курс: Летняя сессия",
      "3 курс: Практика в школе",
      "4 курс: Исследовательский семинар",
      "5 курс: Преддипломный маршрут",
    ],
    spvo: [
      "Магистратура: Профиль",
      "Магистратура: Итоговый проект",
    ],
  };

  const heroes = {
    inf: {
      id: "inf",
      name: "Инф",
      species: "fox",
      role: "лисенок-информатик",
      motto: "Методика информатики: проектно, строго, осознанно.",
      fur: "#d58443",
      furDark: "#b26735",
      accent: "#3f83ca",
      prop: "laptop",
    },
    met: {
      id: "met",
      name: "Мэт",
      species: "fox",
      role: "лисенок-математик",
      motto: "Методика математики: смысл, доказательство, уважение к мысли.",
      fur: "#cc7642",
      furDark: "#ad5e31",
      accent: "#5c4db7",
      prop: "book",
    },
  };

  const actorTemplates = {
    fox_glasses: {
      id: "fox_glasses",
      name: "Пушистый лис",
      species: "fox",
      fur: "#c9783e",
      furDark: "#9f562d",
      outfit: "#2f77bf",
      extra: ["glasses", "laptop"],
    },
    cat_braid: {
      id: "cat_braid",
      name: "Кошка-методист",
      species: "cat",
      fur: "#d0ac87",
      furDark: "#a38262",
      outfit: "#7b4f44",
      extra: ["braid", "docs"],
    },
    wolf_tail: {
      id: "wolf_tail",
      name: "Умный волк",
      species: "wolf",
      fur: "#9da2aa",
      furDark: "#6f7277",
      outfit: "#2f69b1",
      extra: ["ponytail", "sandwich"],
    },
    dog_bow: {
      id: "dog_bow",
      name: "Собачка с бантиком",
      species: "dog",
      fur: "#d8bea0",
      furDark: "#aa8b6d",
      outfit: "#87556d",
      extra: ["bow", "tablet"],
    },
    gray_cat: {
      id: "gray_cat",
      name: "Высокий серый кот",
      species: "cat",
      fur: "#a2a5ab",
      furDark: "#72767c",
      outfit: "#6a6d74",
      extra: ["suit", "strict"],
    },
    varan_jacket: {
      id: "varan_jacket",
      name: "Варан в пиджаке",
      species: "varan",
      fur: "#7c8a5b",
      furDark: "#5b6643",
      outfit: "#56627a",
      extra: ["jacket", "chalk"],
    },
  };

  const scenes = {
    dorm_intro: {
      id: "dorm_intro",
      bg: "dorm",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "alert" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "narrator",
          text: "Каждое великое путешествие начинается с расписания...",
        },
        {
          speaker: "narrator",
          text: "И с попытки понять, где находится аудитория 314.",
        },
        {
          speaker: "narrator",
          text: "Звук звонка. Камера просыпается в пиксельном общежитии.",
        },
        {
          speaker: "hero",
          text: "Я - {hero}, {heroRole}. Кажется, сегодня начинается наш большой путь.",
        },
        {
          speaker: "companion",
          text: "Я рядом. Если что, спасу от хищных дедлайнов. Погнали на первую пару.",
        },
      ],
      choice: {
        prompt: "Перед выходом:",
        options: [
          { text: "Сверить пары в приложении", effect: "app_check" },
          { text: "Спросить старосту в чате", effect: "chat_check" },
        ],
      },
      next: "orientation",
    },
    orientation: {
      id: "orientation",
      bg: "hall",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "narrator",
          text: "1 курс. В расписании появляется «Зачёт по методике».",
        },
        {
          speaker: "narrator",
          text: "Дальше в потоке: «Практикум по искусственному интеллекту», «Педагогика» и «Предмет по выбору».",
        },
        {
          speaker: "companion",
          text: "Пары плотные, но именно так и собирается профессиональный маршрут.",
        },
      ],
      next: "fox_request",
    },
    fox_request: {
      id: "fox_request",
      bg: "hall",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "fox_glasses", slot: "center", pose: "excited" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "fox_glasses",
          text: "Эй! Вы новенькие? Супер! Есть задачка на пять минут.",
        },
        {
          speaker: "fox_glasses",
          text: "Нужно собрать 6 QR-кодиков с парами - я ничего не помню и теперь боюсь расписания.",
        },
        {
          speaker: "fox_glasses",
          text: "Заодно потренируете компьютерное зрение. Ну это же отдых, правда?",
        },
      ],
      triggerMini: "qr",
      taskKey: "qr",
      next: "fox_after",
    },
    fox_after: {
      id: "fox_after",
      bg: "hall",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "fox_glasses", slot: "center", pose: "happy" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "fox_glasses",
          text: "Ух! Молодцы! Если что - у меня есть пара идей про ИИ...",
        },
        {
          speaker: "fox_glasses",
          text: "Ой, кажется, пара уже началась! Бегите!",
        },
      ],
      next: "cat_request",
    },
    cat_request: {
      id: "cat_request",
      bg: "stairs",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "cat_braid", slot: "center", pose: "strict" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "cat_braid",
          text: "Итак. Вы идете на первую пару. Поздравляю.",
        },
        {
          speaker: "cat_braid",
          text: "Но без пропуска вы никуда не пройдете.",
        },
        {
          speaker: "cat_braid",
          text: "Найдите ошибку в оформлении конспекта урока - и я его заверю.",
        },
      ],
      triggerMini: "plan",
      taskKey: "plan",
      next: "cat_after",
    },
    cat_after: {
      id: "cat_after",
      bg: "stairs",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "cat_braid", slot: "center", pose: "strict" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "cat_braid",
          text: "Правила - не враги. Они порядок.",
        },
        {
          speaker: "cat_braid",
          text: "Ваш пропуск заверен. На следующей площадке вас ждет практика.",
        },
      ],
      next: "ai_request",
    },
    ai_request: {
      id: "ai_request",
      bg: "hall",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "fox_glasses", slot: "center", pose: "excited" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "fox_glasses",
          text: "Мини-уровень про ИИ в образовании. Здесь важно не только что можно, но и что нельзя.",
        },
        {
          speaker: "fox_glasses",
          text: "Определите, где ИИ помогает обучению, а где подменяет мышление и нарушает этику.",
        },
      ],
      triggerMini: "ai",
      taskKey: "ai",
      next: "ai_after",
    },
    ai_after: {
      id: "ai_after",
      bg: "hall",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "fox_glasses", slot: "center", pose: "happy" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "fox_glasses",
          text: "Отлично. ИИ должен усиливать педагога, а не заменять профессиональную ответственность.",
        },
      ],
      next: "wolf_request",
    },
    wolf_request: {
      id: "wolf_request",
      bg: "classroom",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "wolf_tail", slot: "center", pose: "calm" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "wolf_tail",
          text: "Если увидите первокурсников, не пугайтесь. Они всегда боятся.",
        },
        {
          speaker: "wolf_tail",
          text: "Чтобы пройти дальше, помогите школьнику: он потерялся на олимпиаде.",
        },
      ],
      triggerMini: "wolf",
      taskKey: "wolf",
      next: "wolf_after",
    },
    wolf_after: {
      id: "wolf_after",
      bg: "classroom",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "wolf_tail", slot: "center", pose: "calm" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "wolf_tail",
          text: "Люди - всегда важнее планов. Это не в учебнике пишут - это узнают.",
        },
      ],
      next: "gray_request",
    },
    gray_request: {
      id: "gray_request",
      bg: "library",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "gray_cat", slot: "center", pose: "strict" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "gray_cat",
          text: "Вы опоздали ровно на 27 секунд.",
        },
        {
          speaker: "gray_cat",
          text: "Это не критично. Но раз уж вы пришли - докажите, что вы действительно сюда поступили.",
        },
      ],
      triggerMini: "final",
      taskKey: "final",
      next: "gray_after",
    },
    gray_after: {
      id: "gray_after",
      bg: "library",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "gray_cat", slot: "center", pose: "strict" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "gray_cat",
          text: "Стремление к знанию - достаточное условие входа.",
        },
      ],
      next: "dog_career",
    },
    dog_career: {
      id: "dog_career",
      bg: "roof",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "dog_bow", slot: "center", pose: "warm" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "dog_bow",
          text: "После ИМИ МПГУ путь не только в школу.",
        },
        {
          speaker: "dog_bow",
          text: "Можно стать учителем, методистом, тьютором, исследователем, экспертом EdTech.",
        },
        {
          speaker: "dog_bow",
          text: "Важно рано пробовать практику и проектные форматы.",
        },
      ],
      choice: {
        prompt: "Какая роль откликается сейчас?",
        options: [
          { text: "Учитель", effect: "career_teacher" },
          { text: "Методист", effect: "career_methodist" },
          { text: "Исследователь", effect: "career_research" },
          { text: "EdTech-разработчик", effect: "career_edtech" },
        ],
      },
      next: "graduation",
    },
    graduation: {
      id: "graduation",
      bg: "roof",
      chapter: roadmap.bvo[0],
      cast: [
        { id: "hero", slot: "left", pose: "happy" },
        { id: "companion", slot: "right", pose: "happy" },
      ],
      lines: [
        {
          speaker: "narrator",
          text: "Инф и Мэт сделали сильный старт и собрали первую сессию в рабочий маршрут.",
        },
        {
          speaker: "hero",
          text: "Теперь я вижу свой профессиональный вектор: {careerPath}.",
        },
        {
          speaker: "companion",
          text: "Институт математики и информатики МПГУ - это место, где идеи становятся педагогической практикой.",
        },
      ],
      next: "summer_intro",
    },
    summer_intro: {
      id: "summer_intro",
      bg: "roof",
      chapter: roadmap.bvo[1],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "narrator",
          text: "Второй уровень: Инф и Мэт готовятся к летней сессии.",
        },
        {
          speaker: "hero",
          text: "Пора проверить математику на прочность.",
        },
        {
          speaker: "companion",
          text: "Начнем с загадки, потом спортзал и столовая.",
        },
      ],
      next: "qadic_request",
    },
    qadic_request: {
      id: "qadic_request",
      bg: "classroom",
      chapter: roadmap.bvo[1],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "varan_jacket", slot: "center", pose: "calm" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "varan_jacket",
          text: "Перед летней сессией загадка: как выглядит q-адическое число?",
        },
        {
          speaker: "varan_jacket",
          text: "Выберите один из четырех вариантов ответа.",
        },
      ],
      triggerMini: "qadic",
      taskKey: "qadic",
      next: "qadic_after",
    },
    qadic_after: {
      id: "qadic_after",
      bg: "classroom",
      chapter: roadmap.bvo[1],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "varan_jacket", slot: "center", pose: "calm" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "varan_jacket",
          text: "Верно: q-адические числа бесконечны в обе стороны по степеням q.",
        },
        {
          speaker: "varan_jacket",
          text: "Их можно складывать и умножать, как полноценные числа.",
        },
      ],
      next: "gym_request",
    },
    gym_request: {
      id: "gym_request",
      bg: "gym",
      chapter: roadmap.bvo[1],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "narrator",
          text: "В спортзале новая тренировка: ловить только нужные числа.",
        },
        {
          speaker: "companion",
          text: "Раунд 1: четные. Раунд 2: кратные 3. Раунд 3: кратные 7.",
        },
      ],
      triggerMini: "sport",
      taskKey: "sport",
      next: "gym_after",
    },
    gym_after: {
      id: "gym_after",
      bg: "gym",
      chapter: roadmap.bvo[1],
      cast: [
        { id: "hero", slot: "left", pose: "happy" },
        { id: "companion", slot: "right", pose: "happy" },
      ],
      lines: [
        {
          speaker: "hero",
          text: "Числовая ловкость прокачана. Осталась столовая.",
        },
      ],
      next: "canteen_request",
    },
    canteen_request: {
      id: "canteen_request",
      bg: "canteen",
      chapter: roadmap.bvo[1],
      cast: [
        { id: "hero", slot: "left", pose: "focus" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "narrator",
          text: "В столовой лисята хотят купить ПИрожок.",
        },
        {
          speaker: "companion",
          text: "Но названия пирожков зашифрованы буквами греческого, латиницы и иврита.",
        },
      ],
      triggerMini: "letters",
      taskKey: "letters",
      next: "canteen_after",
    },
    canteen_after: {
      id: "canteen_after",
      bg: "canteen",
      chapter: roadmap.bvo[1],
      cast: [
        { id: "hero", slot: "left", pose: "happy" },
        { id: "companion", slot: "right", pose: "happy" },
      ],
      lines: [
        {
          speaker: "hero",
          text: "ПИрожок найден. Летняя сессия закрыта!",
        },
        {
          speaker: "narrator",
          text: "Теперь лисята едут в летний лагерь на практику вожатыми.",
        },
      ],
      next: "summer_final",
    },
    summer_final: {
      id: "summer_final",
      bg: "sea",
      chapter: roadmap.bvo[1],
      cast: [
        { id: "hero", slot: "left", pose: "happy" },
        { id: "companion", slot: "right", pose: "happy" },
      ],
      lines: [
        {
          speaker: "narrator",
          text: "Инф и Мэт успешно сдали летнюю сессию.",
        },
        {
          speaker: "companion",
          text: "Впереди море, закат и педагогическая практика в лагере.",
        },
      ],
      next: null,
    },
    retake_end: {
      id: "retake_end",
      bg: "dorm",
      chapter: "Пересдача зачёта",
      cast: [
        { id: "hero", slot: "left", pose: "alert" },
        { id: "companion", slot: "right", pose: "warm" },
      ],
      lines: [
        {
          speaker: "narrator",
          text: "Хищные дедлайны отбросили Инфа и Мэта обратно в общежитие.",
        },
        {
          speaker: "companion",
          text: "Похоже, мы попадем на пересдачу зачета.",
        },
        {
          speaker: "hero",
          text: "Соберемся, подтянем материал и вернемся сильнее.",
        },
      ],
      endMode: "fail",
      next: null,
    },
  };

  const speakerStyles = {
    narrator: { name: "Рассказщик", color: "#284267" },
    hero: { name: "{hero}", color: "#753246" },
    companion: { name: "{companion}", color: "#2f6956" },
    fox_glasses: { name: "Пушистый лис", color: "#295f9d" },
    cat_braid: { name: "Кошка-методист", color: "#7a473b" },
    wolf_tail: { name: "Умный волк", color: "#345d7f" },
    dog_bow: { name: "Собачка с бантиком", color: "#8a4f75" },
    gray_cat: { name: "Высокий серый кот", color: "#50545f" },
    varan_jacket: { name: "Варан", color: "#4f6141" },
  };

  const input = {
    keys: new Set(),
    justPressed: new Set(),
    mouse: {
      x: 0,
      y: 0,
      clicked: false,
    },
    virtual: {
      keyCounts: new Map(),
      justPressed: new Set(),
      touchBindings: new Map(),
      touchActive: false,
    },
  };

  const state = {
    mode: "intro",
    heroId: null,
    companionId: null,
    selectIndex: 0,
    introTimer: 0,
    introReady: false,
    sceneId: "dorm_intro",
    lineIndex: 0,
    typeProgress: 0,
    textSpeed: 44,
    chapter: roadmap.bvo[0],
    tasks: {
      qr: false,
      plan: false,
      ai: false,
      wolf: false,
      final: false,
      qadic: false,
      sport: false,
      letters: false,
    },
    artifacts: [],
    inventory: {
      coffee: false,
      fgos: false,
      laser: false,
      points: false,
      fgosShield: 0,
      charisma: 0,
      retryToken: 0,
    },
    stats: {
      health: 4,
      maxHealth: 6,
      deadline: 120,
      rescueUsed: false,
    },
    companionTip: "",
    choice: null,
    pendingMiniSource: null,
    pendingMiniNext: null,
    careerPath: "методист",
    qrGame: null,
    planGame: null,
    aiGame: null,
    wolfGame: null,
    finalGame: null,
    qadicGame: null,
    sportGame: null,
    lettersGame: null,
    message: "",
    messageTimer: 0,
    clock: 0,
    manualTimeControl: false,
    lastFrameTime: 0,
    accum: 0,
  };

  const textureLayer = createTextureLayer();

  function createTextureLayer() {
    const layer = document.createElement("canvas");
    layer.width = VIEW_W;
    layer.height = VIEW_H;
    const tctx = layer.getContext("2d");
    if (!tctx) return layer;

    tctx.clearRect(0, 0, VIEW_W, VIEW_H);
    for (let y = 0; y < VIEW_H; y += 2) {
      for (let x = 0; x < VIEW_W; x += 2) {
        const noise = (x * 17 + y * 31) % 19;
        if (noise < 3) {
          tctx.fillStyle = "#101627";
          tctx.fillRect(x, y, 1, 1);
        } else if (noise > 16) {
          tctx.fillStyle = "#fff4de";
          tctx.fillRect(x, y, 1, 1);
        }
      }
    }
    return layer;
  }

  function resetState() {
    state.mode = "intro";
    state.heroId = null;
    state.companionId = null;
    state.selectIndex = 0;
    state.introTimer = 0;
    state.introReady = false;
    state.sceneId = "dorm_intro";
    state.lineIndex = 0;
    state.typeProgress = 0;
    state.chapter = roadmap.bvo[0];

    state.tasks.qr = false;
    state.tasks.plan = false;
    state.tasks.ai = false;
    state.tasks.wolf = false;
    state.tasks.final = false;
    state.tasks.qadic = false;
    state.tasks.sport = false;
    state.tasks.letters = false;

    state.artifacts = [];

    state.inventory.coffee = false;
    state.inventory.fgos = false;
    state.inventory.laser = false;
    state.inventory.points = false;
    state.inventory.fgosShield = 0;
    state.inventory.charisma = 0;
    state.inventory.retryToken = 0;

    state.stats.health = 4;
    state.stats.maxHealth = 6;
    state.stats.deadline = 120;
    state.stats.rescueUsed = false;

    state.choice = null;
    state.pendingMiniSource = null;
    state.pendingMiniNext = null;
    state.careerPath = "методист";

    state.qrGame = null;
    state.planGame = null;
    state.aiGame = null;
    state.wolfGame = null;
    state.finalGame = null;
    state.qadicGame = null;
    state.sportGame = null;
    state.lettersGame = null;

    state.message = "";
    state.messageTimer = 0;
    state.companionTip = "";
    state.manualTimeControl = false;
    clearVirtualInput();
  }

  function normalizeKey(key) {
    if (key === " ") return "space";
    return key.toLowerCase();
  }

  function getPointerPos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const rawX = (clientX - rect.left) * scaleX;
    const rawY = (clientY - rect.top) * scaleY;
    return {
      x: rawX / RENDER_SCALE_X,
      y: rawY / RENDER_SCALE_Y,
    };
  }

  function getMousePos(event) {
    return getPointerPos(event.clientX, event.clientY);
  }

  function getTouchPos(touch) {
    return getPointerPos(touch.clientX, touch.clientY);
  }

  function getQrTouchButtons() {
    return [
      { key: "arrowup", label: "^", x: 108, y: 352, w: 56, h: 56 },
      { key: "arrowleft", label: "<", x: 44, y: 416, w: 56, h: 56 },
      { key: "arrowdown", label: "v", x: 108, y: 416, w: 56, h: 56 },
      { key: "arrowright", label: ">", x: 172, y: 416, w: 56, h: 56 },
      { key: "space", label: "SCAN", x: 772, y: 388, w: 148, h: 84 },
    ];
  }

  function findQrTouchKey(point) {
    if (state.mode !== "mini_qr" || !state.qrGame) return null;
    for (const button of getQrTouchButtons()) {
      if (pointInRect(point, button)) {
        return button.key;
      }
    }
    return null;
  }

  function pressVirtualKey(key, touchId) {
    if (!key) return;
    const current = input.virtual.keyCounts.get(key) || 0;
    if (current === 0) {
      input.virtual.justPressed.add(key);
    }
    input.virtual.keyCounts.set(key, current + 1);
    input.virtual.touchBindings.set(touchId, key);
  }

  function releaseVirtualTouch(touchId) {
    const key = input.virtual.touchBindings.get(touchId);
    if (!key) return;
    const current = input.virtual.keyCounts.get(key) || 0;
    if (current <= 1) {
      input.virtual.keyCounts.delete(key);
    } else {
      input.virtual.keyCounts.set(key, current - 1);
    }
    input.virtual.touchBindings.delete(touchId);
  }

  function clearVirtualInput() {
    input.virtual.keyCounts.clear();
    input.virtual.justPressed.clear();
    input.virtual.touchBindings.clear();
  }

  window.addEventListener("keydown", (event) => {
    const key = normalizeKey(event.key);
    if (!input.keys.has(key)) {
      input.justPressed.add(key);
    }
    input.keys.add(key);

    if (["arrowup", "arrowdown", "arrowleft", "arrowright", "space"].includes(key)) {
      event.preventDefault();
    }

    if (key === "f") {
      toggleFullscreen();
    }

    if (key === "escape" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  });

  window.addEventListener("keyup", (event) => {
    input.keys.delete(normalizeKey(event.key));
  });

  window.addEventListener("blur", () => {
    input.keys.clear();
    input.justPressed.clear();
    clearVirtualInput();
  });

  canvas.addEventListener("mousemove", (event) => {
    const pos = getMousePos(event);
    input.mouse.x = pos.x;
    input.mouse.y = pos.y;
  });

  canvas.addEventListener("mousedown", (event) => {
    const pos = getMousePos(event);
    input.mouse.x = pos.x;
    input.mouse.y = pos.y;
    input.mouse.clicked = true;
  });

  canvas.addEventListener(
    "touchstart",
    (event) => {
      input.virtual.touchActive = true;
      for (const touch of event.changedTouches) {
        const pos = getTouchPos(touch);
        input.mouse.x = pos.x;
        input.mouse.y = pos.y;
        input.mouse.clicked = true;
        const key = findQrTouchKey(pos);
        if (key) {
          pressVirtualKey(key, touch.identifier);
        }
      }
      event.preventDefault();
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    (event) => {
      input.virtual.touchActive = true;
      for (const touch of event.changedTouches) {
        const pos = getTouchPos(touch);
        input.mouse.x = pos.x;
        input.mouse.y = pos.y;
        const nextKey = findQrTouchKey(pos);
        const prevKey = input.virtual.touchBindings.get(touch.identifier) || null;
        if (prevKey !== nextKey) {
          releaseVirtualTouch(touch.identifier);
          if (nextKey) {
            pressVirtualKey(nextKey, touch.identifier);
          }
        }
      }
      event.preventDefault();
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchend",
    (event) => {
      for (const touch of event.changedTouches) {
        releaseVirtualTouch(touch.identifier);
      }
      event.preventDefault();
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchcancel",
    (event) => {
      for (const touch of event.changedTouches) {
        releaseVirtualTouch(touch.identifier);
      }
      event.preventDefault();
    },
    { passive: false }
  );

  document.addEventListener("fullscreenchange", resizeCanvas);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    canvas.requestFullscreen().catch(() => {});
  }

  function resizeCanvas() {
    const ratio = CANVAS_W / CANVAS_H;
    const availableW = window.innerWidth - 24;
    const availableH = window.innerHeight - 24;
    let width = availableW;
    let height = width / ratio;
    if (height > availableH) {
      height = availableH;
      width = height * ratio;
    }
    canvas.style.width = `${Math.floor(width)}px`;
    canvas.style.height = `${Math.floor(height)}px`;
  }

  function justPressed(...keys) {
    return keys.some((key) => input.justPressed.has(key) || input.virtual.justPressed.has(key));
  }

  function isDown(...keys) {
    return keys.some((key) => input.keys.has(key) || (input.virtual.keyCounts.get(key) || 0) > 0);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
    return array;
  }

  function showMessage(text, ttl = 2.6) {
    state.message = text;
    state.messageTimer = ttl;
  }

  function addArtifact(name, note) {
    if (state.artifacts.find((item) => item.name === name)) {
      return;
    }
    state.artifacts.push({ name, note });
    showMessage(`Артефакт: ${name}`);
  }

  function resolveHero(id) {
    return heroes[id] || heroes.inf;
  }

  function resolveActor(id) {
    if (id === "hero") {
      return resolveHero(state.heroId);
    }
    if (id === "companion") {
      return resolveHero(state.companionId);
    }
    return actorTemplates[id] || actorTemplates.fox_glasses;
  }

  function replaceTokens(text) {
    const hero = resolveHero(state.heroId);
    const companion = resolveHero(state.companionId);
    const heroRole = hero.id === "inf" ? "лисенок-информатик" : "лисенок-математик";
    return text
      .replaceAll("{hero}", hero.name)
      .replaceAll("{heroRole}", heroRole)
      .replaceAll("{companion}", companion.name)
      .replaceAll("{careerPath}", state.careerPath);
  }

  function currentScene() {
    return scenes[state.sceneId];
  }

  function currentLine() {
    const scene = currentScene();
    if (!scene) return null;
    return scene.lines[state.lineIndex] || null;
  }

  function currentLineText() {
    const line = currentLine();
    if (!line) return "";
    return replaceTokens(line.text);
  }

  function setScene(sceneId) {
    state.sceneId = sceneId;
    state.lineIndex = 0;
    state.typeProgress = 0;
    state.mode = "novel";
    state.choice = null;
    const scene = currentScene();
    if (scene && scene.chapter) {
      state.chapter = scene.chapter;
    }
    refreshCompanionTip();
  }

  function chooseHero(id) {
    state.heroId = id;
    state.companionId = id === "inf" ? "met" : "inf";
    setScene("dorm_intro");
    showMessage(`Герой выбран: ${resolveHero(id).name}`);
  }

  function advanceLine() {
    const scene = currentScene();
    if (!scene) return;

    state.lineIndex += 1;
    state.typeProgress = 0;

    if (state.lineIndex < scene.lines.length) {
      return;
    }

    finishScene(scene);
  }

  function finishScene(scene) {
    if (scene.choice) {
      startChoice(scene.choice, scene.next);
      return;
    }

    if (scene.triggerMini && scene.taskKey && !state.tasks[scene.taskKey]) {
      startMini(scene.triggerMini, scene.id, scene.next);
      return;
    }

    if (scene.next) {
      setScene(scene.next);
      return;
    }

    state.mode = scene.endMode || "outro";
  }

  function startChoice(choiceData, nextScene) {
    state.mode = "choice";
    state.choice = {
      prompt: choiceData.prompt,
      options: choiceData.options,
      index: 0,
      nextScene,
    };
  }

  function applyChoiceEffect(effect) {
    if (effect === "app_check") {
      state.inventory.charisma += 1;
      showMessage("Привычка к цифровым инструментам укреплена (+1 харизма).", 2.6);
      return;
    }

    if (effect === "chat_check") {
      state.stats.deadline = clamp(state.stats.deadline + 8, 0, 180);
      showMessage("Староста прислал ориентиры по корпусу (+время).", 2.6);
      return;
    }

    if (effect === "career_teacher") {
      state.careerPath = "учитель";
      return;
    }

    if (effect === "career_methodist") {
      state.careerPath = "методист";
      return;
    }

    if (effect === "career_research") {
      state.careerPath = "исследователь";
      return;
    }

    if (effect === "career_edtech") {
      state.careerPath = "EdTech-разработчик";
      return;
    }
  }

  function confirmChoice(index) {
    const choice = state.choice;
    if (!choice) return;

    const option = choice.options[index];
    if (!option) return;

    applyChoiceEffect(option.effect);

    if (choice.nextScene) {
      setScene(choice.nextScene);
    } else {
      state.mode = "outro";
    }
  }

  function refreshCompanionTip() {
    if (!state.companionId) {
      state.companionTip = "";
      return;
    }
    const companionName = resolveHero(state.companionId).name;
    if (!state.tasks.qr) {
      state.companionTip = `${companionName}: сначала расписание, потом героизм.`;
      return;
    }
    if (!state.tasks.plan) {
      state.companionTip = `${companionName}: внимательно к формулировкам и нормам.`;
      return;
    }
    if (!state.tasks.ai) {
      state.companionTip = `${companionName}: с ИИ можно работать только этично и осознанно.`;
      return;
    }
    if (!state.tasks.wolf) {
      state.companionTip = `${companionName}: практика - это всегда про ребенка.`;
      return;
    }
    if (!state.tasks.final) {
      state.companionTip = `${companionName}: держись, осталось доказать мотивацию.`;
      return;
    }
    if (!state.tasks.qadic) {
      state.companionTip = `${companionName}: дальше загадка про q-адические числа.`;
      return;
    }
    if (!state.tasks.sport) {
      state.companionTip = `${companionName}: в спортзале ловим только нужные числа.`;
      return;
    }
    if (!state.tasks.letters) {
      state.companionTip = `${companionName}: в столовой смотри на буквы и алфавиты внимательно.`;
      return;
    }
    state.companionTip = `${companionName}: летняя сессия закрыта, впереди практика у моря.`;
  }

  function takeDeadlineHit(amount = 1, reason = "") {
    if (state.inventory.fgosShield > 0) {
      state.inventory.fgosShield -= 1;
      showMessage("Памятка по ФГОСам нейтрализовала урон дедлайна.", 2.8);
      return false;
    }

    state.stats.health = clamp(state.stats.health - amount, 0, state.stats.maxHealth);
    state.stats.deadline = clamp(state.stats.deadline - 6 * amount, 0, 180);

    if (state.stats.health <= 0) {
      if (!state.stats.rescueUsed && state.companionId) {
        state.stats.rescueUsed = true;
        state.stats.health = 2;
        showMessage(`${resolveHero(state.companionId).name} прикрыл(а) от хищного дедлайна.`, 3.1);
      } else {
        state.stats.health = 0;
        state.pendingMiniSource = null;
        state.pendingMiniNext = null;
        state.qrGame = null;
        state.planGame = null;
        state.aiGame = null;
        state.wolfGame = null;
        state.finalGame = null;
        state.qadicGame = null;
        state.sportGame = null;
        state.lettersGame = null;
        setScene("retake_end");
        return true;
      }
      return false;
    }

    if (reason) {
      showMessage(reason, 2.2);
    }
    return false;
  }

  function startMini(kind, sourceScene, nextScene) {
    state.pendingMiniSource = sourceScene;
    state.pendingMiniNext = nextScene;

    if (kind === "qr") {
      state.mode = "mini_qr";
      state.qrGame = {
        cursor: { x: 210, y: 300, r: 9 },
        speed: 220,
        time: 32,
        collected: 0,
        stickers: [
          { x: 180, y: 140, taken: false },
          { x: 320, y: 260, taken: false },
          { x: 500, y: 150, taken: false },
          { x: 650, y: 280, taken: false },
          { x: 760, y: 180, taken: false },
          { x: 820, y: 380, taken: false },
        ],
        hazards: [
          { x: 430, y: 170, vx: 92, vy: 0, r: 14 },
          { x: 560, y: 334, vx: -88, vy: 0, r: 14 },
          { x: 700, y: 230, vx: 0, vy: 102, r: 14 },
        ],
        hitCooldown: 0,
      };
      showMessage("Мини-игра: собери 6 QR-кодов и не попадись дедлайнам.", 3.2);
      return;
    }

    if (kind === "plan") {
      state.mode = "mini_plan";
      state.planGame = {
        options: [
          {
            text: "Актуализация знаний; Установочный этап (цели и задачи); Объяснение нового материала; Закрепление нового материала (практика); Рефлексия; Домашнее задание",
            good: true,
          },
          {
            text: "Домашнее задание; Актуализация знаний; Установочный этап; Объяснение нового материала; Закрепление",
            good: false,
          },
          {
            text: "Объяснение нового материала; Рефлексия; Закрепление нового материала; Домашнее задание",
            good: false,
          },
          {
            text: "Актуализация знаний; Установочный этап; Закрепление; Объяснение нового материала; Домашнее задание",
            good: false,
          },
        ],
        feedback: "Выбери корректный по требованиям конспект урока.",
        lock: 0,
        solved: false,
      };
      showMessage("Мини-игра: проверка оформления конспекта урока.");
      return;
    }

    if (kind === "ai") {
      state.mode = "mini_ai";
      state.aiGame = {
        items: [
          {
            text: "Сгенерировать 3 объяснения темы и выбрать одно, доработав под свой класс.",
            allowed: true,
            explain: "Можно: ИИ используется как черновик, финальная методика за педагогом.",
          },
          {
            text: "Отправить ученикам ответ ИИ без проверки и без источников.",
            allowed: false,
            explain: "Нельзя: риск ошибок и отсутствие педагогической ответственности.",
          },
          {
            text: "Попросить ИИ придумать вариативные задания разного уровня сложности.",
            allowed: true,
            explain: "Можно: это ускоряет подготовку и помогает дифференциации.",
          },
          {
            text: "Использовать ИИ для подмены обратной связи: всем один автокомментарий.",
            allowed: false,
            explain: "Нельзя: обратная связь должна учитывать конкретного ученика.",
          },
          {
            text: "Проверить у ИИ идеи проекта, а потом обсудить риски и этику с группой.",
            allowed: true,
            explain: "Можно: ИИ становится поводом для критического обсуждения.",
          },
          {
            text: "Сгенерировать диплом и сдать без собственного анализа.",
            allowed: false,
            explain: "Нельзя: это академическое нарушение.",
          },
        ],
        index: 0,
        selected: 1,
        correct: 0,
        mistakes: 0,
        feedback: "Определи: МОЖНО или НЕЛЬЗЯ использовать ИИ в этой ситуации.",
      };
      showMessage("Мини-уровень: ИИ в образовании (можно/нельзя).", 3.2);
      return;
    }

    if (kind === "wolf") {
      const target = [
        "Уточнить запрос ученика",
        "Выбрать материал уровня ученика",
        "Показать пример решения",
        "Дать самостоятельную задачу",
        "Обсудить ошибку и успех",
      ];
      state.mode = "mini_wolf";
      state.wolfGame = {
        target,
        pool: shuffle([...target]),
        chosen: [],
        feedback: "Собери порядок этапов урока.",
        lock: 0,
        solved: false,
      };
      showMessage("Мини-игра: школьный лабиринт практики.");
      return;
    }

    if (kind === "final") {
      state.mode = "mini_final";
      state.finalGame = {
        cards: [
          { text: "Хочу объяснять сложное просто", good: true, removed: false, picked: false },
          { text: "Хочу развивать методику информатики и математики", good: true, removed: false, picked: false },
          { text: "Вижу смысл в развитии учеников", good: true, removed: false, picked: false },
          { text: "Готов(а) к исследовательскому росту", good: true, removed: false, picked: false },
          { text: "Так родители сказали", good: false, removed: false, picked: false },
          { text: "Понравилось здание", good: false, removed: false, picked: false },
          { text: "Хочу минимум усилий", good: false, removed: false, picked: false },
          { text: "Чтобы просто закрыть сессию", good: false, removed: false, picked: false },
        ],
        selectedGood: 0,
        mistakes: 0,
        notice: "Собери пазл " + '"почему я выбрал профессию"' + ".",
      };
      showMessage("Мини-игра: финальный пазл мотивации.");
      return;
    }

    if (kind === "qadic") {
      state.mode = "mini_qadic";
      state.qadicGame = {
        question: "Как выглядит q-адическое число?",
        options: [
          { text: "Конечная десятичная дробь с запятой.", good: false },
          { text: "Бесконечная запись в обе стороны по степеням q.", good: true },
          { text: "Только отрицательные целые числа.", good: false },
          { text: "Случайный набор цифр без арифметики.", good: false },
        ],
        selected: 0,
        solved: false,
        lock: 0,
        feedback: "Выбери правильный вариант.",
      };
      showMessage("Мини-игра: загадка про q-адические числа.", 3.0);
      return;
    }

    if (kind === "sport") {
      state.mode = "mini_sport";
      state.sportGame = {
        round: 0,
        caught: 0,
        goal: 6,
        basketX: 480,
        basketW: 108,
        numbers: [],
        spawnTimer: 0.35,
        time: 78,
        feedback: "Раунд 1: лови только четные числа.",
      };
      showMessage("Спортзал: ловим числа по правилам раундов.", 3.2);
      return;
    }

    if (kind === "letters") {
      state.mode = "mini_letters";
      state.lettersGame = {
        items: [
          { name: "альфа", symbol: "α" },
          { name: "омега", symbol: "Ω" },
          { name: "эм (латиница)", symbol: "M" },
          { name: "джи (латиница)", symbol: "G" },
          { name: "алеф", symbol: "א" },
          { name: "шин", symbol: "ש" },
        ],
        index: 0,
        selected: 0,
        options: [],
        correct: 0,
        mistakes: 0,
        feedback: "Найди букву по русскому названию.",
      };
      state.lettersGame.options = buildLetterOptions(state.lettersGame);
      showMessage("Столовая: расшифруй ПИрожки по буквам.", 3.2);
    }
  }

  function completeMini(kind, success) {
    if (!success) {
      setScene(state.pendingMiniSource || state.sceneId);
      return;
    }

    if (kind === "qr") {
      state.tasks.qr = true;
      addArtifact("Собранное расписание", "Пары наконец структурированы");
      state.stats.deadline = clamp(state.stats.deadline + 10, 0, 180);
    }

    if (kind === "plan") {
      state.tasks.plan = true;
      addArtifact("Заверенный пропуск", "Официальный вход в аудиторию");
      state.inventory.fgos = true;
      state.inventory.fgosShield += 1;
      addArtifact("Памятка ФГОС", "1 щит от дедлайна");
    }

    if (kind === "ai") {
      state.tasks.ai = true;
      addArtifact("Этичный протокол ИИ", "Навык корректного применения ИИ в обучении");
    }

    if (kind === "wolf") {
      state.tasks.wolf = true;
      addArtifact("Педагогический отклик", "Практика с заботой о ребенке");
      state.inventory.laser = true;
      state.inventory.charisma += 5;
      addArtifact("Лазерная указка", "+5 харизма");
      state.inventory.points = true;
      state.inventory.retryToken += 1;
      addArtifact("Баллы по предмету", "+1 повтор");
    }

    if (kind === "final") {
      state.tasks.final = true;
      addArtifact("Пазл мотивации", "Осознанный выбор профессии");
      state.inventory.coffee = true;
      state.stats.health = clamp(state.stats.health + 2, 0, state.stats.maxHealth);
      addArtifact("Кофе +2 к здоровью", "Поддержка перед зачётами");
    }

    if (kind === "qadic") {
      state.tasks.qadic = true;
      addArtifact("q-адик конспект", "Базовая модель q-адических чисел");
    }

    if (kind === "sport") {
      state.tasks.sport = true;
      addArtifact("Спорт-зачёт", "Точность в признаках делимости");
      state.stats.deadline = clamp(state.stats.deadline + 8, 0, 180);
    }

    if (kind === "letters") {
      state.tasks.letters = true;
      addArtifact("ПИрожок-код", "Алфавитный шифр столовой раскрыт");
    }

    refreshCompanionTip();
    if (state.pendingMiniNext) {
      setScene(state.pendingMiniNext);
    } else {
      state.mode = "outro";
    }
  }

  function updateIntro(dt) {
    state.introTimer += dt;
    if (state.introTimer > 3.1) {
      state.introReady = true;
    }
    if (state.introReady && (justPressed("enter", "space") || input.mouse.clicked)) {
      state.mode = "select";
    }
  }

  function updateHeroSelect() {
    if (justPressed("arrowleft", "a")) {
      state.selectIndex = (state.selectIndex - 1 + 2) % 2;
    }
    if (justPressed("arrowright", "d")) {
      state.selectIndex = (state.selectIndex + 1) % 2;
    }

    const cards = getHeroSelectCards();
    if (input.mouse.clicked) {
      const hit = cards.findIndex((card) => pointInRect(input.mouse, card));
      if (hit >= 0) {
        state.selectIndex = hit;
        chooseHero(hit === 0 ? "inf" : "met");
      }
    }

    if (justPressed("enter", "space")) {
      chooseHero(state.selectIndex === 0 ? "inf" : "met");
    }
  }

  function updateNovel(dt) {
    state.stats.deadline = clamp(state.stats.deadline - dt * 0.08, 0, 180);

    const text = currentLineText();
    state.typeProgress = clamp(state.typeProgress + dt * state.textSpeed, 0, text.length);

    if (justPressed("enter", "space") || input.mouse.clicked) {
      if (state.typeProgress < text.length) {
        state.typeProgress = text.length;
      } else {
        advanceLine();
      }
    }
  }

  function updateChoice() {
    const choice = state.choice;
    if (!choice) return;

    if (justPressed("arrowup", "w")) {
      choice.index = (choice.index - 1 + choice.options.length) % choice.options.length;
    }
    if (justPressed("arrowdown", "s")) {
      choice.index = (choice.index + 1) % choice.options.length;
    }

    const boxes = getChoiceBoxes(choice.options.length);
    if (input.mouse.clicked) {
      const hit = boxes.findIndex((box) => pointInRect(input.mouse, box));
      if (hit >= 0) {
        choice.index = hit;
        confirmChoice(hit);
      }
    }

    if (justPressed("enter", "space")) {
      confirmChoice(choice.index);
    }
  }

  function updateMiniQr(dt) {
    const game = state.qrGame;
    if (!game) return;

    const moveX = (isDown("arrowright", "d") ? 1 : 0) - (isDown("arrowleft", "a") ? 1 : 0);
    const moveY = (isDown("arrowdown", "s") ? 1 : 0) - (isDown("arrowup", "w") ? 1 : 0);
    game.cursor.x += moveX * game.speed * dt;
    game.cursor.y += moveY * game.speed * dt;
    game.cursor.x = clamp(game.cursor.x, 146, 836);
    game.cursor.y = clamp(game.cursor.y, 108, 446);

    game.time = Math.max(0, game.time - dt);
    game.hitCooldown = Math.max(0, game.hitCooldown - dt);

    for (const hazard of game.hazards) {
      hazard.x += hazard.vx * dt;
      hazard.y += hazard.vy * dt;
      if (hazard.x < 150 || hazard.x > 830) hazard.vx *= -1;
      if (hazard.y < 112 || hazard.y > 442) hazard.vy *= -1;

      const dx = hazard.x - game.cursor.x;
      const dy = hazard.y - game.cursor.y;
      if (dx * dx + dy * dy < (hazard.r + game.cursor.r) * (hazard.r + game.cursor.r)) {
        if (game.hitCooldown <= 0) {
          game.time = Math.max(0, game.time - 2.4);
          game.hitCooldown = 0.7;
          if (takeDeadlineHit(1, "Красные песочные часы съели время.")) {
            return;
          }
        }
      }
    }

    if (justPressed("space", "enter")) {
      for (const sticker of game.stickers) {
        if (sticker.taken) continue;
        const dx = sticker.x - game.cursor.x;
        const dy = sticker.y - game.cursor.y;
        if (dx * dx + dy * dy < 18 * 18) {
          sticker.taken = true;
          game.collected += 1;
          break;
        }
      }
    }

    if (game.collected >= 6) {
      state.qrGame = null;
      completeMini("qr", true);
      return;
    }

    if (game.time <= 0) {
      state.qrGame = null;
      completeMini("qr", false);
    }
  }

  function updateMiniPlan(dt) {
    const game = state.planGame;
    if (!game) return;

    const boxes = getPlanBoxes();

    if (!game.solved && input.mouse.clicked) {
      const hit = boxes.findIndex((box) => pointInRect(input.mouse, box));
      if (hit >= 0) {
        selectPlanOption(hit);
      }
    }

    if (!game.solved) {
      if (justPressed("1")) selectPlanOption(0);
      if (justPressed("2")) selectPlanOption(1);
      if (justPressed("3")) selectPlanOption(2);
      if (justPressed("4")) selectPlanOption(3);
    }

    if (game.lock > 0) {
      game.lock -= dt;
      if (game.lock <= 0 && game.solved) {
        state.planGame = null;
        completeMini("plan", true);
      }
    }
  }

  function selectPlanOption(index) {
    const game = state.planGame;
    if (!game || game.solved) return;

    const option = game.options[index];
    if (!option) return;

    if (option.good) {
      game.feedback = "Верно. Конспект урока оформлен по требованиям.";
      game.solved = true;
      game.lock = 0.8;
    } else {
      game.feedback = "Нет. Формулировка не выдерживает методическую проверку.";
      if (takeDeadlineHit(1, "Курсовой дедлайн подкрался.")) return;
    }
  }

  function getAiButtons() {
    return {
      no: { x: 220, y: 372, w: 210, h: 62 },
      yes: { x: 528, y: 372, w: 210, h: 62 },
    };
  }

  function submitAiAnswer(allowedAnswer) {
    const game = state.aiGame;
    if (!game) return;
    const item = game.items[game.index];
    if (!item) return;

    if (allowedAnswer === item.allowed) {
      game.correct += 1;
    } else {
      game.mistakes += 1;
      if (takeDeadlineHit(1, "Ошибка в этике применения ИИ.")) return;
    }

    game.feedback = item.explain;
    game.index += 1;

    if (game.index >= game.items.length) {
      const passed = game.correct >= 5;
      state.aiGame = null;
      if (!passed) {
        showMessage("Нужно закрепить этику ИИ. Попробуй уровень снова.", 3.2);
      }
      completeMini("ai", passed);
    }
  }

  function updateMiniAi() {
    const game = state.aiGame;
    if (!game) return;

    if (justPressed("arrowleft", "a")) {
      game.selected = 0;
    }
    if (justPressed("arrowright", "d")) {
      game.selected = 1;
    }

    const buttons = getAiButtons();
    if (input.mouse.clicked) {
      if (pointInRect(input.mouse, buttons.no)) {
        game.selected = 0;
        submitAiAnswer(false);
        return;
      }
      if (pointInRect(input.mouse, buttons.yes)) {
        game.selected = 1;
        submitAiAnswer(true);
        return;
      }
    }

    if (justPressed("enter", "space")) {
      submitAiAnswer(game.selected === 1);
    }
  }

  function updateMiniWolf(dt) {
    const game = state.wolfGame;
    if (!game) return;

    const boxes = getWolfBoxes(game.pool.length);

    if (!game.solved && input.mouse.clicked) {
      const hit = boxes.findIndex((box) => pointInRect(input.mouse, box));
      if (hit >= 0) {
        selectWolfOption(hit);
      }
    }

    if (game.lock > 0) {
      game.lock -= dt;
      if (game.lock <= 0 && game.solved) {
        state.wolfGame = null;
        completeMini("wolf", true);
      }
    }
  }

  function selectWolfOption(index) {
    const game = state.wolfGame;
    if (!game || game.solved) return;

    const option = game.pool[index];
    const expected = game.target[game.chosen.length];
    if (!option) return;

    if (option === expected) {
      game.chosen.push(option);
      game.pool.splice(index, 1);
      game.feedback = "Фрагмент пазла зафиксирован.";
      if (game.chosen.length === game.target.length) {
        game.solved = true;
        game.feedback = "Школьник прошел лабиринт и успел на олимпиаду.";
        game.lock = 1.0;
      }
    } else {
      game.feedback = "Порядок сбился. Начни заново.";
      if (takeDeadlineHit(1, "Лабиринт урока перепутан.")) return;
      game.pool = shuffle([...game.target]);
      game.chosen = [];
    }
  }

  function updateMiniFinal() {
    const game = state.finalGame;
    if (!game) return;

    const boxes = getFinalBoxes(game.cards.length);

    if (input.mouse.clicked) {
      const hit = boxes.findIndex((box) => pointInRect(input.mouse, box));
      if (hit >= 0) {
        selectFinalCard(hit);
      }
    }
  }

  function selectFinalCard(index) {
    const game = state.finalGame;
    if (!game) return;

    const card = game.cards[index];
    if (!card || card.removed || card.picked) return;

    if (card.good) {
      card.picked = true;
      game.selectedGood += 1;
      game.notice = `Сильный мотив принят (${game.selectedGood}/4).`;
    } else {
      card.removed = true;
      game.mistakes += 1;
      game.notice = "Слабый мотив удален.";
      if (takeDeadlineHit(1, "Мотивация должна быть честной и профессиональной.")) return;

      if (game.mistakes >= 3 && state.inventory.retryToken > 0) {
        state.inventory.retryToken -= 1;
        game.mistakes = 0;
        for (const item of game.cards) {
          if (!item.good) {
            item.removed = false;
          }
        }
        game.notice = "Баллы по предмету дали шанс перепройти пазл.";
      }
    }

    if (game.selectedGood >= 4) {
      state.finalGame = null;
      completeMini("final", true);
    }
  }

  function getQadicBoxes() {
    return [
      { x: 120, y: 166, w: 720, h: 62 },
      { x: 120, y: 242, w: 720, h: 62 },
      { x: 120, y: 318, w: 720, h: 62 },
      { x: 120, y: 394, w: 720, h: 62 },
    ];
  }

  function selectQadicOption(index) {
    const game = state.qadicGame;
    if (!game || game.solved) return;
    const option = game.options[index];
    if (!option) return;

    if (option.good) {
      game.feedback = "Верно. Это запись по степеням q, бесконечная в обе стороны.";
      game.solved = true;
      game.lock = 0.9;
    } else {
      game.feedback = "Пока нет. Подумай о бесконечной записи по степеням q.";
      if (takeDeadlineHit(1, "Неверная гипотеза по q-адическим числам.")) return;
    }
  }

  function updateMiniQadic(dt) {
    const game = state.qadicGame;
    if (!game) return;

    if (justPressed("arrowup", "w")) {
      game.selected = (game.selected - 1 + game.options.length) % game.options.length;
    }
    if (justPressed("arrowdown", "s")) {
      game.selected = (game.selected + 1) % game.options.length;
    }

    const boxes = getQadicBoxes();
    if (input.mouse.clicked) {
      const hit = boxes.findIndex((box) => pointInRect(input.mouse, box));
      if (hit >= 0) {
        game.selected = hit;
        selectQadicOption(hit);
      }
    }

    if (!game.solved) {
      if (justPressed("1")) selectQadicOption(0);
      if (justPressed("2")) selectQadicOption(1);
      if (justPressed("3")) selectQadicOption(2);
      if (justPressed("4")) selectQadicOption(3);
    }

    if (justPressed("enter", "space")) {
      selectQadicOption(game.selected);
    }

    if (game.lock > 0) {
      game.lock -= dt;
      if (game.lock <= 0 && game.solved) {
        state.qadicGame = null;
        completeMini("qadic", true);
      }
    }
  }

  function sportRuleText(round) {
    if (round === 0) return "Раунд 1: лови только четные числа.";
    if (round === 1) return "Раунд 2: лови только числа, делящиеся на 3.";
    return "Раунд 3: лови только числа, делящиеся на 7.";
  }

  function sportHintText(round) {
    if (round === 0) return "Подсказка: четные оканчиваются на 0, 2, 4, 6, 8.";
    if (round === 1) return "Признак делимости на 3: сумма цифр числа кратна 3.";
    return "Для 7 сверяй с таблицей умножения: 7, 14, 21, ...";
  }

  function sportMatchesRound(round, value) {
    if (round === 0) return value % 2 === 0;
    if (round === 1) return value % 3 === 0;
    return value % 7 === 0;
  }

  function spawnSportNumber(round) {
    const shouldMatch = Math.random() < 0.48;
    let value = 1;

    if (shouldMatch) {
      if (round === 0) {
        value = 2 * (1 + Math.floor(Math.random() * 49));
      } else if (round === 1) {
        value = 3 * (1 + Math.floor(Math.random() * 33));
      } else {
        value = 7 * (1 + Math.floor(Math.random() * 14));
      }
    } else {
      value = 1 + Math.floor(Math.random() * 99);
      while (sportMatchesRound(round, value)) {
        value = 1 + Math.floor(Math.random() * 99);
      }
    }

    return {
      x: 92 + Math.random() * 776,
      y: 96,
      value,
      vy: 136 + Math.random() * 86,
    };
  }

  function updateMiniSport(dt) {
    const game = state.sportGame;
    if (!game) return;

    const moveX = (isDown("arrowright", "d") ? 1 : 0) - (isDown("arrowleft", "a") ? 1 : 0);
    game.basketX = clamp(game.basketX + moveX * 336 * dt, 94, 866);
    if (input.mouse.clicked) {
      game.basketX = clamp(input.mouse.x, 94, 866);
    }

    game.time = Math.max(0, game.time - dt);
    game.spawnTimer -= dt;
    if (game.spawnTimer <= 0) {
      game.numbers.push(spawnSportNumber(game.round));
      game.spawnTimer = 0.45 + Math.random() * 0.25;
    }

    for (let i = game.numbers.length - 1; i >= 0; i--) {
      const item = game.numbers[i];
      item.y += item.vy * dt;

      const catchZone = item.y >= 438 && item.y <= 490;
      const inBasket = Math.abs(item.x - game.basketX) <= game.basketW / 2;
      if (catchZone && inBasket) {
        if (sportMatchesRound(game.round, item.value)) {
          game.caught += 1;
          game.feedback = `${sportRuleText(game.round)} Поймано: ${game.caught}/${game.goal}.`;
          game.numbers.splice(i, 1);

          if (game.caught >= game.goal) {
            game.round += 1;
            game.caught = 0;
            game.numbers = [];
            if (game.round >= 3) {
              state.sportGame = null;
              completeMini("sport", true);
              return;
            }
            game.feedback = `${sportRuleText(game.round)} ${sportHintText(game.round)}`;
            if (game.round === 1) {
              showMessage("Раунд 2: лови кратные 3. Признак: сумма цифр числа кратна 3.", 3.3);
            } else if (game.round === 2) {
              showMessage("Раунд 3: лови кратные 7.", 2.8);
            }
          }
        } else {
          game.numbers.splice(i, 1);
          game.feedback = `${item.value} не подходит. ${sportHintText(game.round)}`;
          if (takeDeadlineHit(1, "Поймано число не по условию раунда.")) {
            return;
          }
        }
        continue;
      }

      if (item.y > 510) {
        game.numbers.splice(i, 1);
      }
    }

    if (game.time <= 0) {
      state.sportGame = null;
      showMessage("Время вышло. Тренировку нужно пройти заново.", 3.0);
      completeMini("sport", false);
    }
  }

  function buildLetterOptions(game) {
    if (!game || !game.items[game.index]) return [];
    const target = game.items[game.index].symbol;
    const pool = game.items.map((item) => item.symbol);
    const distractors = shuffle([...new Set(pool.filter((symbol) => symbol !== target))]).slice(0, 3);
    return shuffle([target, ...distractors]);
  }

  function getLetterBoxes() {
    return [
      { x: 162, y: 214, w: 286, h: 88 },
      { x: 512, y: 214, w: 286, h: 88 },
      { x: 162, y: 322, w: 286, h: 88 },
      { x: 512, y: 322, w: 286, h: 88 },
    ];
  }

  function submitLetterAnswer(index) {
    const game = state.lettersGame;
    if (!game) return;
    const current = game.items[game.index];
    if (!current) return;
    const picked = game.options[index];
    if (!picked) return;

    if (picked === current.symbol) {
      game.correct += 1;
      game.feedback = `Верно: ${current.name} = ${current.symbol}`;
    } else {
      game.mistakes += 1;
      game.feedback = `Неверно: ${current.name} обозначается ${current.symbol}.`;
      if (takeDeadlineHit(1, "Буквенный шифр столовой оказался с подвохом.")) return;
    }

    game.index += 1;
    if (game.index >= game.items.length) {
      const passed = game.correct >= 5;
      state.lettersGame = null;
      if (!passed) {
        showMessage("Нужно лучше сопоставлять названия букв и символы.", 3.1);
      }
      completeMini("letters", passed);
      return;
    }

    game.options = buildLetterOptions(game);
    game.selected = 0;
  }

  function updateMiniLetters() {
    const game = state.lettersGame;
    if (!game) return;

    if (justPressed("arrowleft", "a")) {
      game.selected = game.selected % 2 === 0 ? game.selected + 1 : game.selected - 1;
    }
    if (justPressed("arrowright", "d")) {
      game.selected = game.selected % 2 === 0 ? game.selected + 1 : game.selected - 1;
    }
    if (justPressed("arrowup", "w")) {
      game.selected = game.selected < 2 ? game.selected + 2 : game.selected - 2;
    }
    if (justPressed("arrowdown", "s")) {
      game.selected = game.selected < 2 ? game.selected + 2 : game.selected - 2;
    }

    const boxes = getLetterBoxes();
    if (input.mouse.clicked) {
      const hit = boxes.findIndex((box) => pointInRect(input.mouse, box));
      if (hit >= 0) {
        game.selected = hit;
        submitLetterAnswer(hit);
      }
    }

    if (justPressed("1")) submitLetterAnswer(0);
    if (justPressed("2")) submitLetterAnswer(1);
    if (justPressed("3")) submitLetterAnswer(2);
    if (justPressed("4")) submitLetterAnswer(3);

    if (justPressed("enter", "space")) {
      submitLetterAnswer(game.selected);
    }
  }

  function updateOutro() {
    if (justPressed("enter", "space") || input.mouse.clicked) {
      resetState();
    }
  }

  function updateFail() {
    if (justPressed("enter", "space") || input.mouse.clicked) {
      resetState();
    }
  }

  function update(dt) {
    state.clock += dt;

    if (state.messageTimer > 0) {
      state.messageTimer -= dt;
      if (state.messageTimer <= 0) {
        state.message = "";
      }
    }

    if (state.mode !== "mini_qr" && input.virtual.keyCounts.size > 0) {
      clearVirtualInput();
    }

    if (state.mode === "intro") {
      updateIntro(dt);
    } else if (state.mode === "select") {
      updateHeroSelect();
    } else if (state.mode === "novel") {
      updateNovel(dt);
    } else if (state.mode === "choice") {
      updateChoice();
    } else if (state.mode === "mini_qr") {
      updateMiniQr(dt);
    } else if (state.mode === "mini_plan") {
      updateMiniPlan(dt);
    } else if (state.mode === "mini_ai") {
      updateMiniAi(dt);
    } else if (state.mode === "mini_wolf") {
      updateMiniWolf(dt);
    } else if (state.mode === "mini_final") {
      updateMiniFinal(dt);
    } else if (state.mode === "mini_qadic") {
      updateMiniQadic(dt);
    } else if (state.mode === "mini_sport") {
      updateMiniSport(dt);
    } else if (state.mode === "mini_letters") {
      updateMiniLetters();
    } else if (state.mode === "outro") {
      updateOutro();
    } else if (state.mode === "fail") {
      updateFail();
    }

    input.justPressed.clear();
    input.virtual.justPressed.clear();
    input.mouse.clicked = false;
  }

  function pointInRect(point, rect) {
    return point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;
  }

  function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  }

  function drawText(text, x, y, size = 16, color = palette.ink, align = "left") {
    ctx.fillStyle = color;
    ctx.font = `${size}px "Press Start 2P", "VT323", monospace`;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    ctx.textAlign = "left";
  }

  function drawTextOutlined(text, x, y, size = 16, color = palette.ink, outline = "#ffffff", align = "left") {
    ctx.font = `${size}px "Press Start 2P", "VT323", monospace`;
    ctx.textAlign = align;
    ctx.fillStyle = outline;
    ctx.fillText(text, x - 1, y);
    ctx.fillText(text, x + 1, y);
    ctx.fillText(text, x, y - 1);
    ctx.fillText(text, x, y + 1);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.textAlign = "left";
  }

  function drawWrappedText(text, x, y, width, lineHeight, size, color) {
    ctx.fillStyle = color;
    ctx.font = `${size}px "Press Start 2P", "VT323", monospace`;
    const words = text.split(" ");
    let line = "";
    let currentY = y;
    for (let i = 0; i < words.length; i++) {
      const probe = line + words[i] + " ";
      if (ctx.measureText(probe).width > width && line.length > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i] + " ";
        currentY += lineHeight;
      } else {
        line = probe;
      }
    }
    if (line.length) {
      ctx.fillText(line, x, currentY);
    }
  }

  function drawPanel(x, y, w, h, outer, inner) {
    drawRect(x, y, w, h, outer);
    drawRect(x + 4, y + 4, w - 8, h - 8, inner);
  }

  function drawPixelStars(count, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    for (let i = 0; i < count; i++) {
      const sx = (i * 73 + Math.floor(state.clock * 14)) % VIEW_W;
      const sy = (i * 41 + Math.floor(state.clock * 6)) % 220;
      ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.restore();
  }

  function drawTexture(_step, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(textureLayer, 0, 0);
    ctx.restore();
  }

  function drawVignette(strength) {
    const grad = ctx.createRadialGradient(VIEW_W * 0.5, VIEW_H * 0.55, 120, VIEW_W * 0.5, VIEW_H * 0.55, 620);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, `rgba(7, 10, 20, ${strength})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }

  function drawBackground(type) {
    if (type === "dorm") {
      const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
      grad.addColorStop(0, "#dbe7f8");
      grad.addColorStop(1, "#f4e8d9");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      drawRect(0, 320, VIEW_W, 220, "#cebfae");
      drawRect(58, 124, 240, 182, "#c7d5ea");
      drawRect(70, 136, 216, 158, "#eaf3ff");
      drawRect(86, 196, 56, 32, "#3e5f87");
      drawRect(160, 188, 12, 40, "#3e5f87");
      drawRect(208, 170, 8, 58, "#3e5f87");

      drawRect(332, 194, 260, 132, "#b58c6f");
      drawRect(346, 208, 232, 34, "#f3d9bf");
      drawRect(346, 248, 232, 64, "#deceb4");
      drawRect(364, 220, 86, 18, "#2f69b1");
      drawRect(458, 220, 34, 22, "#24395f");
      drawRect(504, 220, 42, 12, "#f7efdf");

      drawRect(664, 178, 246, 158, "#b58c6f");
      drawRect(680, 194, 216, 130, "#f3e7d4");
      drawRect(706, 214, 164, 30, "#d36f44");
      drawRect(712, 252, 54, 54, "#24395f");
      drawRect(780, 252, 54, 54, "#24395f");
      drawRect(610, 246, 18, 62, "#6b8a62");
      drawRect(604, 238, 30, 16, "#7faa77");
      drawRect(588, 228, 20, 12, "#7faa77");
      drawRect(628, 228, 20, 12, "#7faa77");

      drawRect(350, 170, 40, 12, "#f7efdf");
      drawRect(396, 170, 34, 12, "#89a1c5");
      drawRect(434, 170, 24, 12, "#d18f62");

      for (let i = 0; i < 9; i++) {
        drawRect(0, 318 + i * 2, VIEW_W, 1, i % 2 ? "#beaf9c" : "#d3c4b2");
      }

      drawTexture(14, 0.07);
      drawVignette(0.16);
      drawTextOutlined("Общежитие", 72, 118, 11, locationLabelColor, "#ffffff");
      return;
    }

    if (type === "hall") {
      const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
      grad.addColorStop(0, "#e3e9f6");
      grad.addColorStop(1, "#e7dac8");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      drawRect(0, 300, VIEW_W, 240, "#d3c9ba");
      drawRect(0, 276, VIEW_W, 24, "#c9ced9");
      drawRect(0, 0, VIEW_W, 40, "#cfd6e8");
      drawRect(0, 40, VIEW_W, 8, "#8d9ab7");

      for (let i = 0; i < 6; i++) {
        const x = 60 + i * 150;
        drawRect(x, 88, 100, 184, "#f5f0e3");
        drawRect(x + 10, 102, 80, 160, "#24395f");
      }

      drawRect(20, 142, 164, 92, "#efe5d3");
      drawRect(28, 150, 148, 76, "#f6f1e5");
      drawRect(42, 162, 40, 40, "#ffffff");
      drawRect(92, 162, 40, 40, "#ffffff");
      drawRect(142, 162, 24, 40, "#ffffff");
      drawTextOutlined("Расписание", 46, 218, 10, locationLabelColor, "#ffffff");

      drawRect(786, 120, 154, 162, "#d2b8ab");
      drawRect(796, 132, 134, 140, "#f7ede1");
      drawRect(808, 152, 110, 14, "#753246");
      drawTextOutlined("Ауд. 314", 824, 163, 10, locationLabelColor, "#ffffff");
      drawRect(202, 152, 14, 64, "#b9a889");
      drawRect(220, 152, 14, 64, "#b9a889");
      drawRect(238, 152, 14, 64, "#b9a889");

      for (let i = 0; i < 6; i++) {
        const qx = 432 + i * 56;
        drawRect(qx, 172, 16, 16, "#ffffff");
        drawRect(qx + 3, 175, 5, 5, "#141414");
        drawRect(qx + 8, 175, 5, 5, "#141414");
      }

      for (let i = 0; i < 30; i++) {
        const tx = 12 + (i * 41) % VIEW_W;
        drawRect(tx, 308 + (i % 8) * 18, 14, 8, i % 2 ? "#cabfab" : "#bfb39f");
      }
      drawTexture(14, 0.06);
      drawVignette(0.2);
      return;
    }

    if (type === "stairs") {
      const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
      grad.addColorStop(0, "#e6ebf6");
      grad.addColorStop(1, "#e6dfd2");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      drawRect(0, 344, VIEW_W, 196, "#d7ccbc");
      for (let i = 0; i < 12; i++) {
        drawRect(30 + i * 76, 334 - i * 18, 132, 20, i % 2 ? "#bec7d8" : "#d2d9e9");
      }

      drawRect(0, 214, VIEW_W, 8, "#818da8");
      drawRect(0, 222, VIEW_W, 6, "#9aa6c0");

      drawRect(92, 236, 182, 98, "#f4e9d8");
      drawRect(110, 252, 146, 68, "#f8f2e7");
      drawRect(130, 266, 100, 10, "#7f4f44");

      drawRect(700, 236, 212, 98, "#c8d4e8");
      drawRect(718, 252, 176, 68, "#ecf3ff");
      drawRect(734, 266, 144, 10, "#355f92");

      for (let i = 0; i < 6; i++) {
        drawRect(420 + i * 18, 270 + i * 6, 120 - i * 8, 12, "#f8efe0");
      }
      drawRect(306, 234, 74, 8, "#7f4f44");
      drawRect(316, 244, 54, 6, "#f0e5d2");
      drawRect(772, 272, 32, 42, "#b37f68");
      drawRect(810, 280, 20, 34, "#6e8aac");
      drawTexture(14, 0.065);
      drawVignette(0.2);
      drawTextOutlined("Лестница и методический контроль", 84, 226, 11, locationLabelColor, "#ffffff");
      return;
    }

    if (type === "classroom") {
      const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
      grad.addColorStop(0, "#d9e4f5");
      grad.addColorStop(1, "#f1e4d2");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      drawRect(0, 308, VIEW_W, 232, "#d1c5b2");
      drawRect(64, 88, 512, 162, "#35506e");
      drawRect(78, 100, 484, 134, "#3d6a52");
      drawTextOutlined("Функциональная грамотность", 102, 136, 12, locationLabelColor, "#ffffff");
      drawRect(82, 160, 130, 8, "#d9f1dd");
      drawRect(82, 176, 180, 8, "#d9f1dd");

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          const x = 130 + c * 180;
          const y = 286 + r * 74;
          drawRect(x, y, 116, 14, "#b38257");
          drawRect(x + 8, y + 14, 12, 40, "#8a5e3d");
          drawRect(x + 96, y + 14, 12, 40, "#8a5e3d");
          drawRect(x + 38, y - 14, 24, 14, "#71839f");
        }
      }

      drawRect(724, 160, 164, 204, "#f4ead8");
      drawRect(740, 176, 132, 172, "#fff8ef");
      drawRect(766, 232, 82, 72, "#ddb78d");
      drawRect(790, 214, 34, 16, "#9f6f52");
      drawRect(620, 112, 32, 20, "#f8f0df");
      drawRect(660, 112, 26, 20, "#8fa7cc");
      drawRect(694, 112, 28, 20, "#f1d08b");
      drawRect(728, 112, 18, 20, "#be8a78");
      drawRect(762, 112, 22, 20, "#95b494");
      drawTexture(14, 0.06);
      drawVignette(0.18);
      drawTextOutlined("Класс", 750, 198, 10, locationLabelColor, "#ffffff");
      return;
    }

    if (type === "library") {
      const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
      grad.addColorStop(0, "#d5def2");
      grad.addColorStop(1, "#e7d6c6");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      drawRect(0, 322, VIEW_W, 218, "#d2c4af");

      for (let i = 0; i < 6; i++) {
        const x = 34 + i * 154;
        drawRect(x, 118, 120, 204, "#8f6a4b");
        drawRect(x + 8, 126, 104, 188, "#5c4a3f");
        for (let j = 0; j < 6; j++) {
          drawRect(x + 14 + (j % 3) * 30, 136 + Math.floor(j / 3) * 90, 24, 76, j % 2 ? "#9f7ab5" : "#6f8eb7");
        }
      }

      drawRect(346, 74, 268, 98, "#f7f0e3");
      drawRect(362, 90, 236, 66, "#eef5ff");
      drawRect(396, 112, 168, 18, "#753246");
      drawTextOutlined("Аудитория 314", 424, 126, 10, locationLabelColor, "#ffffff");

      drawRect(420, 252, 120, 70, "#a98b74");
      drawRect(436, 266, 88, 56, "#f4ead8");
      drawRect(560, 252, 120, 70, "#a98b74");
      drawRect(576, 266, 88, 56, "#f4ead8");
      drawRect(472, 280, 16, 10, "#7c5a43");
      drawRect(612, 280, 16, 10, "#7c5a43");
      drawTexture(14, 0.065);
      drawVignette(0.24);
      return;
    }

    if (type === "roof") {
      const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
      grad.addColorStop(0, "#f3cfa4");
      grad.addColorStop(0.5, "#d6b8cc");
      grad.addColorStop(1, "#7f8fb2");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      drawRect(0, 320, VIEW_W, 220, "#aab0c3");
      drawRect(0, 300, VIEW_W, 20, "#858da5");

      for (let i = 0; i < 16; i++) {
        const x = i * 62;
        const h = 64 + ((i * 31) % 90);
        drawRect(x, 300 - h, 46, h, i % 2 ? "#44516f" : "#3b465f");
      }

      drawRect(98, 246, 764, 42, "#d8ddea");
      drawRect(112, 258, 736, 24, "#f1f4fb");
      drawRect(196, 266, 38, 8, "#753246");
      drawRect(252, 266, 38, 8, "#2f6956");
      drawRect(308, 266, 38, 8, "#24395f");

      drawPixelStars(26, "#fff3cc", 0.55);
      drawRect(650, 248, 18, 40, "#7383a3");
      drawRect(676, 252, 14, 36, "#6b7a98");
      drawRect(698, 246, 22, 42, "#7383a3");
      drawTexture(16, 0.07);
      drawVignette(0.23);
      drawTextOutlined("Крыша главного корпуса МПГУ", 120, 242, 12, locationLabelColor, "#ffffff");
      return;
    }

    if (type === "gym") {
      const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
      grad.addColorStop(0, "#d9e4f5");
      grad.addColorStop(1, "#efd9bf");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      drawRect(0, 326, VIEW_W, 214, "#c79f73");
      for (let i = 0; i < 12; i++) {
        drawRect(0, 330 + i * 16, VIEW_W, 4, i % 2 ? "#b98c62" : "#d8b086");
      }

      drawRect(46, 98, 868, 188, "#f2ede0");
      drawRect(58, 110, 844, 164, "#cfd9ea");
      drawRect(72, 124, 816, 136, "#f3f7ff");
      drawRect(120, 140, 280, 108, "#36587c");
      drawRect(560, 140, 280, 108, "#36587c");
      drawRect(136, 156, 248, 76, "#7aa0ce");
      drawRect(576, 156, 248, 76, "#7aa0ce");

      drawRect(420, 124, 120, 140, "#f5f1e6");
      drawRect(442, 146, 76, 94, "#cc4f42");
      drawRect(456, 160, 48, 66, "#f5f1e6");
      drawRect(468, 178, 24, 30, "#cc4f42");

      drawRect(64, 302, 832, 8, "#6d8eb8");
      drawRect(74, 308, 812, 4, "#4f6f98");
      drawTexture(14, 0.05);
      drawVignette(0.16);
      drawTextOutlined("Спортзал", 96, 124, 12, locationLabelColor, "#ffffff");
      return;
    }

    if (type === "canteen") {
      const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
      grad.addColorStop(0, "#e7edf7");
      grad.addColorStop(1, "#f2dfc7");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      drawRect(0, 320, VIEW_W, 220, "#c9b69e");
      drawRect(0, 286, VIEW_W, 34, "#9fb0c9");

      drawRect(72, 122, 816, 176, "#f6f0e3");
      drawRect(86, 136, 788, 148, "#efe6d7");
      drawRect(114, 156, 220, 92, "#2f486b");
      drawRect(366, 156, 220, 92, "#2f486b");
      drawRect(618, 156, 220, 92, "#2f486b");

      drawRect(108, 264, 744, 76, "#b7865c");
      drawRect(122, 278, 716, 48, "#e6ceb3");
      drawRect(150, 286, 92, 28, "#d5a774");
      drawRect(266, 286, 92, 28, "#d5a774");
      drawRect(382, 286, 92, 28, "#d5a774");
      drawRect(498, 286, 92, 28, "#d5a774");
      drawRect(614, 286, 92, 28, "#d5a774");

      drawTextOutlined("α  Ω  M  א", 150, 206, 14, "#f5f1e6", "#223754");
      drawTextOutlined("G  β  ש  λ", 402, 206, 14, "#f5f1e6", "#223754");
      drawTextOutlined("ПИрожки", 660, 206, 14, "#f5f1e6", "#223754");

      drawTexture(14, 0.06);
      drawVignette(0.18);
      drawTextOutlined("Столовая", 94, 118, 12, locationLabelColor, "#ffffff");
      return;
    }

    if (type === "sea") {
      const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
      grad.addColorStop(0, "#f6c27f");
      grad.addColorStop(0.45, "#f09686");
      grad.addColorStop(0.72, "#6f8fb4");
      grad.addColorStop(1, "#365978");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      drawRect(0, 292, VIEW_W, 248, "#3f6f93");
      for (let i = 0; i < 24; i++) {
        drawRect(0, 298 + i * 10, VIEW_W, 2, i % 2 ? "#5a84a8" : "#315d7f");
      }

      drawRect(412, 154, 136, 136, "#f8d89d");
      drawRect(430, 172, 100, 100, "#f2b58a");
      drawRect(448, 190, 64, 64, "#f8d89d");

      drawRect(0, 430, VIEW_W, 110, "#d5b892");
      for (let i = 0; i < 40; i++) {
        const x = 10 + i * 24;
        const h = 8 + ((i * 7) % 12);
        drawRect(x, 432 + (i % 3) * 6, 14, h, "#c6a27b");
      }

      drawRect(160, 390, 10, 46, "#4a5f43");
      drawRect(166, 376, 18, 14, "#4a5f43");
      drawRect(178, 390, 10, 46, "#4a5f43");
      drawRect(760, 396, 10, 40, "#4a5f43");
      drawRect(766, 382, 18, 14, "#4a5f43");
      drawRect(778, 396, 10, 40, "#4a5f43");

      drawTexture(16, 0.06);
      drawVignette(0.2);
      drawTextOutlined("Море и закат", 96, 112, 12, locationLabelColor, "#ffffff");
      return;
    }

    drawRect(0, 0, VIEW_W, VIEW_H, "#d9dde8");
  }

  function locationTitle(type) {
    if (type === "dorm") return "Общежитие";
    if (type === "hall") return "Холл корпуса";
    if (type === "stairs") return "Лестница и методический контроль";
    if (type === "classroom") return "Класс";
    if (type === "library") return "Аудитория 314";
    if (type === "roof") return "Крыша главного корпуса МПГУ";
    if (type === "gym") return "Спортзал";
    if (type === "canteen") return "Столовая";
    if (type === "sea") return "Летний лагерь у моря";
    return "";
  }

  function drawLocationTag(type) {
    const title = locationTitle(type);
    if (!title) return;
    drawPanel(16, 152, 420, 28, "#d7e1f3", "#f6f0e2");
    drawTextOutlined(title, 28, 170, 10, locationLabelColor, "#ffffff");
  }

  function slotX(slot) {
    if (slot === "left") return 210;
    if (slot === "center") return 480;
    if (slot === "right") return 748;
    return 480;
  }

  function drawActor(actorRef, focused) {
    const actor = resolveActor(actorRef.id);
    const x = slotX(actorRef.slot);
    const y = 332;
    drawCharacter(actor, x, y, actorRef.pose, focused, { showName: true });
  }

  function drawCharacter(actor, x, y, pose, focused, options = {}) {
    const showName = options.showName !== false;
    const bob = Math.sin(state.clock * 2.1 + x * 0.01) * 2;
    const baseX = Math.floor(x);
    const baseY = Math.floor(y + bob);

    const species = actor.species || "fox";
    const fur = actor.fur || "#cc7642";
    const furDark = actor.furDark || "#9f5c31";
    const outfit = actor.outfit || actor.accent || "#3e78bf";
    const extras = actor.extra || [];
    const outline = focused ? "#181821" : "#2a2a34";
    const isGrayCat = actor.id === "gray_cat";

    let headW = 62;
    let headH = 56;
    let headTop = -34;
    let bodyW = 58;
    let bodyH = 40;
    let bodyY = 36;
    let legY = 74;
    let legH = 24;

    if (species === "fox") {
      headW = 56;
      headH = 54;
      headTop = -34;
    }

    if (species === "cat") {
      headW = 56;
      headH = 54;
      headTop = -36;
      bodyW = 52;
      bodyH = 40;
      bodyY = 38;
    }

    if (species === "wolf") {
      headW = 64;
      headH = 58;
      headTop = -36;
      bodyW = 60;
      bodyH = 42;
      bodyY = 36;
    }

    if (species === "dog") {
      headW = 60;
      headH = 52;
      headTop = -32;
      bodyW = 56;
      bodyH = 40;
      bodyY = 38;
    }

    if (species === "varan") {
      headW = 58;
      headH = 48;
      headTop = -30;
      bodyW = 60;
      bodyH = 44;
      bodyY = 36;
      legY = 76;
      legH = 24;
    }

    if (isGrayCat) {
      headW = 54;
      headH = 58;
      headTop = -40;
      bodyW = 44;
      bodyH = 52;
      bodyY = 30;
      legY = 82;
      legH = 28;
    }

    if (focused) {
      drawRect(baseX - 70, baseY + 104, 140, 10, "rgba(24, 45, 78, 0.26)");
    }

    if (species === "fox") {
      drawRect(baseX + 30, baseY + 52, 18, 8, furDark);
      drawRect(baseX + 42, baseY + 50, 14, 10, furDark);
      drawRect(baseX + 50, baseY + 52, 12, 8, fur);
      drawRect(baseX + 54, baseY + 54, 8, 6, "#f7e5d1");
    } else if (species === "cat" && !isGrayCat) {
      drawRect(baseX + 28, baseY + 58, 14, 4, furDark);
      drawRect(baseX + 38, baseY + 54, 6, 16, furDark);
      drawRect(baseX + 40, baseY + 66, 8, 4, fur);
    } else if (isGrayCat) {
      drawRect(baseX + 22, baseY + 66, 18, 6, furDark);
      drawRect(baseX + 36, baseY + 62, 8, 14, furDark);
    } else if (species === "wolf") {
      drawRect(baseX + 30, baseY + 54, 20, 8, furDark);
      drawRect(baseX + 46, baseY + 56, 14, 8, "#c7ccd2");
    } else if (species === "dog") {
      drawRect(baseX + 28, baseY + 56, 14, 8, furDark);
      drawRect(baseX + 40, baseY + 58, 10, 6, fur);
    } else if (species === "varan") {
      drawRect(baseX + 30, baseY + 58, 16, 6, furDark);
      drawRect(baseX + 44, baseY + 56, 12, 8, furDark);
      drawRect(baseX + 54, baseY + 58, 10, 4, "#d4c68f");
    }

    const legColor = isGrayCat ? "#4f535c" : focused ? "#4e2e22" : "#5f3b2b";
    drawRect(baseX - 14, baseY + legY, 10, legH, legColor);
    drawRect(baseX + 4, baseY + legY, 10, legH, legColor);
    drawRect(baseX - 16, baseY + legY + legH, 14, 4, "#3f2b22");
    drawRect(baseX + 2, baseY + legY + legH, 14, 4, "#3f2b22");

    drawRect(baseX - bodyW / 2, baseY + bodyY, bodyW, bodyH, outfit);
    drawRect(baseX - bodyW / 2 + 6, baseY + bodyY + 6, bodyW - 12, bodyH - 10, shadeColor(outfit, -18));
    drawRect(baseX - 12, baseY + bodyY + 12, 24, bodyH - 16, "#f0d8ba");

    drawRect(baseX - bodyW / 2 - 10, baseY + bodyY + 6, 10, 24, furDark);
    drawRect(baseX + bodyW / 2, baseY + bodyY + 6, 10, 24, furDark);

    if (isGrayCat || extras.includes("suit")) {
      drawRect(baseX - 22, baseY + bodyY, 44, bodyH + 8, "#6f737a");
      drawRect(baseX - 4, baseY + bodyY, 8, bodyH + 2, "#4f5259");
      drawRect(baseX - 12, baseY + bodyY + 8, 8, 16, "#8c9097");
      drawRect(baseX + 4, baseY + bodyY + 8, 8, 16, "#8c9097");
    } else if (extras.includes("jacket")) {
      drawRect(baseX - 24, baseY + bodyY, 48, bodyH + 6, "#59647a");
      drawRect(baseX - 4, baseY + bodyY, 8, bodyH + 2, "#3f495e");
      drawRect(baseX - 14, baseY + bodyY + 10, 10, 16, "#7a869f");
      drawRect(baseX + 4, baseY + bodyY + 10, 10, 16, "#7a869f");
    }

    const headLeft = baseX - headW / 2;
    drawRect(headLeft, baseY + headTop, headW, headH, fur);
    drawRect(headLeft + 6, baseY + headTop + 8, headW - 12, headH - 12, shadeColor(fur, -12));

    if (species === "fox") {
      drawRect(baseX - 20, baseY + headTop, 40, 8, fur);
      drawRect(baseX - 26, baseY + headTop + 8, 52, 8, fur);
      drawRect(baseX - 30, baseY + headTop + 16, 60, 8, fur);
      drawRect(baseX - 32, baseY + headTop + 24, 64, 8, fur);
      drawRect(baseX - 28, baseY + headTop + 32, 56, 8, fur);
      drawRect(baseX - 22, baseY + headTop + 40, 44, 8, fur);

      drawRect(baseX - 24, baseY + headTop + 10, 48, 24, shadeColor(fur, -14));
      drawRect(baseX - 17, baseY + headTop + 30, 34, 10, "#f7e3cc");
      drawRect(baseX - 7, baseY + headTop + 38, 14, 8, "#e9b690");

      drawRect(baseX - 34, baseY + headTop - 10, 10, 8, furDark);
      drawRect(baseX - 30, baseY + headTop - 20, 6, 12, furDark);
      drawRect(baseX - 29, baseY + headTop - 15, 3, 5, "#f8e8d0");
      drawRect(baseX + 24, baseY + headTop - 10, 10, 8, furDark);
      drawRect(baseX + 24, baseY + headTop - 20, 6, 12, furDark);
      drawRect(baseX + 26, baseY + headTop - 15, 3, 5, "#f8e8d0");
    } else if (species === "cat") {
      drawRect(baseX - 18, baseY + headTop + 30, 36, 14, "#f3deca");
      drawRect(baseX - 9, baseY + headTop + 40, 18, 8, "#dcae8a");

      drawRect(baseX - 30, baseY + headTop - 10, 8, 14, furDark);
      drawRect(baseX - 27, baseY + headTop - 6, 3, 8, "#f3deca");
      drawRect(baseX + 22, baseY + headTop - 10, 8, 14, furDark);
      drawRect(baseX + 25, baseY + headTop - 6, 3, 8, "#f3deca");
    } else if (species === "wolf") {
      drawRect(baseX - 22, baseY + headTop + 28, 44, 16, "#e8ddcf");
      drawRect(baseX - 10, baseY + headTop + 40, 20, 8, "#cab79f");

      drawRect(baseX - 33, baseY + headTop - 8, 12, 12, furDark);
      drawRect(baseX + 21, baseY + headTop - 8, 12, 12, furDark);
    } else if (species === "dog") {
      drawRect(baseX - 20, baseY + headTop + 28, 40, 16, "#f1dfc8");
      drawRect(baseX - 10, baseY + headTop + 40, 20, 8, "#d0af89");
      drawRect(baseX - 34, baseY + headTop + 4, 10, 16, furDark);
      drawRect(baseX + 24, baseY + headTop + 4, 10, 16, furDark);
    } else if (species === "varan") {
      drawRect(baseX - 20, baseY + headTop + 26, 40, 14, "#c9c48f");
      drawRect(baseX - 8, baseY + headTop + 36, 16, 6, "#b0a96e");
      drawRect(baseX - 28, baseY + headTop + 4, 8, 8, furDark);
      drawRect(baseX + 20, baseY + headTop + 4, 8, 8, furDark);
      drawRect(baseX - 12, baseY + headTop + 12, 24, 6, shadeColor(fur, -22));
    }

    const eyeY = baseY + headTop + 22;
    const eyeOffset = isGrayCat ? 11 : species === "cat" ? 10 : species === "varan" ? 9 : 12;
    drawRect(baseX - eyeOffset, eyeY, 4, 4, outline);
    drawRect(baseX + eyeOffset - 4, eyeY, 4, 4, outline);
    drawRect(baseX - eyeOffset + 1, eyeY + 1, 1, 1, "#ffffff");
    drawRect(baseX + eyeOffset - 3, eyeY + 1, 1, 1, "#ffffff");

    if (species === "cat") {
      drawRect(baseX - 26, baseY + headTop + 34, 8, 2, outline);
      drawRect(baseX - 28, baseY + headTop + 38, 10, 2, outline);
      drawRect(baseX + 18, baseY + headTop + 34, 8, 2, outline);
      drawRect(baseX + 18, baseY + headTop + 38, 10, 2, outline);
    }

    if (pose === "happy" || pose === "warm") {
      drawRect(baseX - 7, baseY + headTop + 38, 14, 3, outline);
      drawRect(baseX - 5, baseY + headTop + 41, 10, 2, outline);
    } else if (pose === "strict") {
      drawRect(baseX - 8, baseY + headTop + 36, 16, 2, outline);
      drawRect(baseX - 10, baseY + headTop + 18, 8, 2, outline);
      drawRect(baseX + 2, baseY + headTop + 18, 8, 2, outline);
    } else {
      drawRect(baseX - 6, baseY + headTop + 38, 12, 2, outline);
    }

    drawRect(baseX - 2, baseY + headTop + 34, 4, 3, "#7f4f35");

    if (extras.includes("glasses")) {
      drawRect(baseX - 16, eyeY - 2, 11, 8, "#1f2739");
      drawRect(baseX + 5, eyeY - 2, 11, 8, "#1f2739");
      drawRect(baseX - 5, eyeY, 10, 2, "#1f2739");
    }

    if (extras.includes("braid")) {
      drawRect(baseX + 28, baseY + headTop + 14, 6, 42, "#8a6a4f");
      drawRect(baseX + 26, baseY + headTop + 50, 10, 6, "#8a6a4f");
      drawRect(baseX + 27, baseY + headTop + 54, 8, 4, "#6f4f3a");
    }

    if (extras.includes("ponytail")) {
      drawRect(baseX + 22, baseY + headTop - 6, 14, 5, "#544235");
      drawRect(baseX + 32, baseY + headTop - 5, 4, 20, "#544235");
    }

    if (extras.includes("bow")) {
      drawRect(baseX + 10, baseY + headTop - 8, 10, 4, "#a25b87");
      drawRect(baseX + 13, baseY + headTop - 12, 4, 12, "#a25b87");
    }

    if (actor.prop === "laptop" || extras.includes("laptop")) {
      drawRect(baseX - 52, baseY + bodyY + 6, 20, 14, "#2d6cae");
      drawRect(baseX - 50, baseY + bodyY + 8, 16, 9, "#8dc0f3");
    }

    if (actor.prop === "book") {
      drawRect(baseX - 50, baseY + bodyY + 6, 16, 16, "#f7f0de");
      drawRect(baseX - 43, baseY + bodyY + 6, 2, 16, "#bfa05e");
    }

    if (extras.includes("docs")) {
      drawRect(baseX - 52, baseY + bodyY + 8, 20, 10, "#f8f3e6");
      drawRect(baseX - 48, baseY + bodyY + 10, 12, 2, "#8893aa");
      drawRect(baseX - 48, baseY + bodyY + 14, 12, 2, "#8893aa");
    }

    if (extras.includes("tablet")) {
      drawRect(baseX - 52, baseY + bodyY + 4, 18, 16, "#375678");
      drawRect(baseX - 49, baseY + bodyY + 7, 12, 10, "#9ed0f7");
    }

    if (extras.includes("sandwich")) {
      drawRect(baseX - 50, baseY + bodyY + 10, 16, 6, "#d7b17b");
      drawRect(baseX - 50, baseY + bodyY + 8, 16, 2, "#86aa73");
    }

    if (extras.includes("chalk")) {
      drawRect(baseX - 52, baseY + bodyY + 10, 16, 4, "#f4f3ea");
      drawRect(baseX - 52, baseY + bodyY + 14, 16, 2, "#9aa5be");
    }

    if (focused) {
      drawRect(baseX - 42, baseY + 94, 84, 3, "#f3deb2");
      drawRect(baseX - 36, baseY + 98, 72, 2, "#f8eed5");
    }

    if (showName) {
      drawText(actor.name || "", baseX - 54, baseY + 114, 10, focused ? "#1d2f4d" : "#3a3f56");
    }
  }

  function shadeColor(hex, delta) {
    const clean = hex.replace("#", "");
    const num = parseInt(clean, 16);
    const r = clamp(((num >> 16) & 255) + delta, 0, 255);
    const g = clamp(((num >> 8) & 255) + delta, 0, 255);
    const b = clamp((num & 255) + delta, 0, 255);
    const value = (r << 16) | (g << 8) | b;
    return `#${value.toString(16).padStart(6, "0")}`;
  }

  function speakerName(speakerId) {
    const style = speakerStyles[speakerId] || speakerStyles.narrator;
    return replaceTokens(style.name);
  }

  function speakerColor(speakerId) {
    const style = speakerStyles[speakerId] || speakerStyles.narrator;
    return style.color;
  }

  function drawTopHud() {
    drawPanel(12, 8, 640, 54, palette.panelBlueDark, palette.panelBlue);
    drawText("Инф и Мэт", 28, 29, 13, "#f5ecd8");
    drawText("Мама, я на Матфаке!", 28, 47, 10, "#f1dcae");

    drawPanel(664, 8, 284, 54, "#1d3152", "#29446a");
    drawText(`Здоровье: ${state.stats.health}/${state.stats.maxHealth}`, 676, 29, 10, "#f6ecd9");
    drawText(`Дедлайн: ${Math.ceil(state.stats.deadline)}`, 676, 47, 10, "#d6e6f8");

    drawPanel(12, 66, 640, 48, "#1f3556", "#2d4f77");
    drawText(state.chapter, 24, 86, 11, "#f6ecd9");
    drawText(`Харизма: ${state.inventory.charisma}  Щит ФГОС: ${state.inventory.fgosShield}`, 24, 102, 9, "#d7e6f9");

    drawPanel(664, 66, 284, 126, "#1f3556", "#2d4f77");
    drawText("Артефакты", 676, 86, 11, "#f6ecd9");

    const artifacts = state.artifacts.slice(-4);
    if (artifacts.length === 0) {
      drawText("пока нет", 676, 104, 9, "#d7e6f9");
    } else {
      for (let i = 0; i < artifacts.length; i++) {
        const name = artifacts[i].name;
        const label = name.length > 30 ? `${name.slice(0, 27)}...` : name;
        drawText(`• ${label}`, 676, 104 + i * 16, 9, "#d7e6f9");
      }
    }

    drawPanel(664, 196, 284, 108, "#1f3556", "#2d4f77");
    drawText("Прогресс", 676, 214, 10, "#f6ecd9");

    const flags = [
      { key: "qr", label: "QR" },
      { key: "plan", label: "План" },
      { key: "ai", label: "ИИ" },
      { key: "wolf", label: "Практика" },
      { key: "final", label: "Финал" },
      { key: "qadic", label: "q-адик" },
      { key: "sport", label: "Спорт" },
      { key: "letters", label: "ПИрожок" },
    ];

    for (let i = 0; i < flags.length; i++) {
      const item = flags[i];
      const x = 676 + (i % 2) * 132;
      const y = 218 + Math.floor(i / 2) * 20;
      drawRect(x, y, 120, 18, state.tasks[item.key] ? palette.emerald : "#6f7586");
      drawText(item.label, x + 10, y + 13, 9, "#f5ecd8");
    }

    if (state.companionTip) {
      drawPanel(12, 118, 640, 30, "#2a466a", "#2e577f");
      drawText(state.companionTip, 24, 136, 9, "#f6ecd9");
    }
  }

  function drawDialogueBox() {
    const line = currentLine();
    if (!line) return;

    const fullText = currentLineText();
    const visible = fullText.slice(0, Math.floor(state.typeProgress));

    drawPanel(20, 356, 920, 164, "#203757", "#f1e8d6");

    const speaker = line.speaker || "narrator";
    const name = speakerName(speaker);
    const color = speakerColor(speaker);

    drawPanel(36, 370, 280, 34, color, "#f7f1e5");
    drawText(name, 50, 392, 12, color);

    drawWrappedText(visible, 42, 426, 876, 24, 15, palette.ink);

    if (state.typeProgress >= fullText.length) {
      drawText("Enter/Клик ->", 792, 504, 11, palette.panelBlue);
    }
  }

  function getHeroSelectCards() {
    return [
      { x: 108, y: 168, w: 348, h: 296 },
      { x: 504, y: 168, w: 348, h: 296 },
    ];
  }

  function drawIntro() {
    drawRect(0, 0, VIEW_W, VIEW_H, "#04070d");
    drawPixelStars(46, "#ead7aa", 0.55);

    drawText("Каждое великое путешествие начинается с расписания...", 72, 220, 20, "#f5efe0");
    drawText("И с попытки понять, где находится аудитория 314.", 72, 260, 20, "#f5efe0");

    drawText("Инф и Мэт", 480, 332, 36, "#f4d48e", "center");
    drawText("Мама, я на Матфаке!", 480, 368, 22, "#9fd1ff", "center");

    if (state.introReady) {
      drawPanel(236, 430, 488, 48, "#1d3152", "#29446a");
      drawText("Enter/Клик: начать новеллу", 278, 460, 14, "#f6ecd9");
    }
  }

  function drawHeroSelect() {
    drawBackground("dorm");
    drawRect(0, 0, VIEW_W, VIEW_H, "rgba(13, 18, 29, 0.28)");

    drawPanel(100, 22, 760, 112, "#1f3556", "#f2e9d7");
    drawText("Выбор героя", 384, 58, 28, palette.burgundy);
    drawText("Играй за Инфа или Мэта. Второй лис станет спутником.", 128, 88, 12, palette.ink);
    drawText("Формат: визуальная новелла с сюжетными мини-играми.", 128, 110, 12, palette.ink);

    const cards = getHeroSelectCards();
    const ids = ["inf", "met"];

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const hero = resolveHero(ids[i]);
      const active = i === state.selectIndex;
      drawPanel(card.x, card.y, card.w, card.h, active ? "#224168" : "#3b3f57", "#f3e9d7");
      drawCharacter(hero, card.x + card.w / 2, card.y + 198, active ? "focus" : "warm", active, {
        showName: false,
      });
      drawText(hero.name, card.x + 128, card.y + 42, 24, hero.accent);
      drawText(hero.role, card.x + 34, card.y + 72, 12, palette.ink);
      drawWrappedText(hero.motto, card.x + 26, card.y + 98, card.w - 52, 16, 10, palette.ink);
    }

    drawPanel(182, 486, 594, 34, "#1d3152", "#2a4a72");
    drawText("A/D или стрелки, Enter. F - полноэкранный режим", 208, 508, 11, "#f4ebd8");
  }

  function drawNovelScene() {
    const scene = currentScene();
    if (!scene) {
      drawRect(0, 0, VIEW_W, VIEW_H, "#cfd6e8");
      return;
    }

    drawBackground(scene.bg);
    drawTopHud();
    drawLocationTag(scene.bg);

    const line = currentLine();
    const activeSpeaker = line ? line.speaker : "narrator";

    for (const castItem of scene.cast) {
      const resolvedId = castItem.id === "hero" ? "hero" : castItem.id === "companion" ? "companion" : castItem.id;
      const focused = resolvedId === activeSpeaker;
      drawActor(castItem, focused);
    }

    drawDialogueBox();
  }

  function getChoiceBoxes(count) {
    const boxes = [];
    for (let i = 0; i < count; i++) {
      boxes.push({ x: 170, y: 188 + i * 62, w: 620, h: 50 });
    }
    return boxes;
  }

  function drawChoiceOverlay() {
    drawNovelScene();
    const choice = state.choice;
    if (!choice) return;

    drawRect(0, 0, VIEW_W, VIEW_H, "rgba(9, 14, 24, 0.62)");
    drawPanel(124, 96, 712, 360, "#203757", "#f1e8d6");
    drawText(choice.prompt, 150, 136, 16, palette.burgundy);

    const boxes = getChoiceBoxes(choice.options.length);
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const active = i === choice.index;
      drawPanel(box.x, box.y, box.w, box.h, active ? "#2f6956" : "#314b6d", active ? "#e2f3ea" : "#f7efdf");
      drawWrappedText(choice.options[i].text, box.x + 20, box.y + 24, box.w - 30, 16, 12, palette.ink);
    }

    drawText("Enter/Клик: выбрать", 596, 438, 11, palette.panelBlue);
  }

  function drawMiniQr() {
    const game = state.qrGame;
    drawBackground("hall");
    drawRect(0, 0, VIEW_W, VIEW_H, "rgba(16, 22, 34, 0.32)");

    drawPanel(20, 20, 920, 56, "#203757", "#29446a");
    drawText("Сбор QR-кодов: стрелки/WASD + Space/Enter. На смартфоне - кнопки на экране.", 34, 53, 10, "#f5ecd8");

    drawPanel(120, 90, 720, 390, "#203757", "#eaf1fd");

    if (!game) return;

    drawText(`Собрано: ${game.collected}/6`, 144, 114, 12, palette.ink);
    drawText(`Время: ${Math.ceil(game.time)}`, 312, 114, 12, palette.ink);

    for (const sticker of game.stickers) {
      if (sticker.taken) continue;
      drawRect(sticker.x - 11, sticker.y - 11, 22, 22, "#ffffff");
      drawRect(sticker.x - 8, sticker.y - 8, 6, 6, "#121212");
      drawRect(sticker.x + 2, sticker.y - 8, 6, 6, "#121212");
      drawRect(sticker.x - 8, sticker.y + 2, 6, 6, "#121212");
    }

    for (const hazard of game.hazards) {
      drawRect(hazard.x - 12, hazard.y - 12, 24, 24, "#d4524f");
      drawRect(hazard.x - 8, hazard.y - 8, 16, 4, "#f7d8bf");
      drawRect(hazard.x - 8, hazard.y + 4, 16, 4, "#f7d8bf");
      drawRect(hazard.x - 6, hazard.y - 2, 12, 6, "#f7d8bf");
    }

    drawRect(game.cursor.x - 12, game.cursor.y - 12, 24, 24, "#224168");
    drawRect(game.cursor.x - 8, game.cursor.y - 8, 16, 16, "#f6e6cf");
    drawRect(game.cursor.x - 2, game.cursor.y - 16, 4, 32, "#224168");
    drawRect(game.cursor.x - 16, game.cursor.y - 2, 32, 4, "#224168");

    if (input.virtual.touchActive || navigator.maxTouchPoints > 0) {
      for (const button of getQrTouchButtons()) {
        const pressed = (input.virtual.keyCounts.get(button.key) || 0) > 0;
        drawPanel(
          button.x,
          button.y,
          button.w,
          button.h,
          pressed ? "#2f6956" : "#203757",
          pressed ? "#e3f3ea" : "#f7efdf"
        );
        drawText(
          button.label,
          button.x + button.w / 2,
          button.y + (button.key === "space" ? 49 : 36),
          button.key === "space" ? 11 : 16,
          palette.ink,
          "center"
        );
      }
      drawText("Сенсорное управление", 742, 506, 10, "#f5ecd8");
    }
  }

  function getPlanBoxes() {
    return [
      { x: 40, y: 124, w: 430, h: 150 },
      { x: 490, y: 124, w: 430, h: 150 },
      { x: 40, y: 292, w: 430, h: 150 },
      { x: 490, y: 292, w: 430, h: 150 },
    ];
  }

  function drawMiniPlan() {
    const game = state.planGame;
    drawBackground("stairs");
    drawRect(0, 0, VIEW_W, VIEW_H, "rgba(14, 20, 31, 0.28)");

    drawPanel(20, 20, 920, 56, "#203757", "#29446a");
    drawText("Проверка конспекта урока: найди корректный вариант", 38, 53, 14, "#f5ecd8");

    const boxes = getPlanBoxes();
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      drawPanel(box.x, box.y, box.w, box.h, "#314b6d", "#f7efdf");
      if (game) {
        drawWrappedText(game.options[i].text, box.x + 14, box.y + 24, box.w - 28, 14, 10, palette.ink);
      }
    }

    if (game) {
      drawPanel(32, 450, 896, 60, "#203757", "#29446a");
      drawWrappedText(game.feedback, 52, 472, 860, 16, 12, "#f5ecd8");
    }
  }

  function drawMiniAi() {
    const game = state.aiGame;
    drawBackground("hall");
    drawRect(0, 0, VIEW_W, VIEW_H, "rgba(12, 18, 29, 0.34)");

    drawPanel(20, 20, 920, 56, "#203757", "#29446a");
    drawText("ИИ в образовании: где МОЖНО, а где НЕЛЬЗЯ", 36, 53, 14, "#f5ecd8");

    if (!game) return;

    const item = game.items[game.index];
    if (!item) return;

    drawPanel(96, 108, 768, 216, "#2a4a6b", "#f7efdf");
    drawText(`Ситуация ${game.index + 1} / ${game.items.length}`, 124, 140, 12, palette.burgundy);
    drawWrappedText(item.text, 124, 178, 712, 24, 14, palette.ink);

    const buttons = getAiButtons();
    drawPanel(
      buttons.no.x,
      buttons.no.y,
      buttons.no.w,
      buttons.no.h,
      game.selected === 0 ? "#753246" : "#314b6d",
      game.selected === 0 ? "#f3e0dd" : "#f7efdf"
    );
    drawText("НЕЛЬЗЯ", buttons.no.x + 52, buttons.no.y + 38, 14, palette.ink);

    drawPanel(
      buttons.yes.x,
      buttons.yes.y,
      buttons.yes.w,
      buttons.yes.h,
      game.selected === 1 ? "#2f6956" : "#314b6d",
      game.selected === 1 ? "#e2f3ea" : "#f7efdf"
    );
    drawText("МОЖНО", buttons.yes.x + 56, buttons.yes.y + 38, 14, palette.ink);

    drawPanel(96, 454, 768, 56, "#203757", "#29446a");
    drawText(`Верно: ${game.correct}  Ошибки: ${game.mistakes}`, 118, 478, 11, "#f5ecd8");
    drawWrappedText(game.feedback, 118, 498, 730, 16, 10, "#dbe8f9");
  }

  function getWolfBoxes(count) {
    const boxes = [];
    const cols = 2;
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      boxes.push({ x: 480 + col * 220, y: 178 + row * 74, w: 208, h: 60 });
    }
    return boxes;
  }

  function drawMiniWolf() {
    const game = state.wolfGame;
    drawBackground("classroom");
    drawRect(0, 0, VIEW_W, VIEW_H, "rgba(16, 21, 30, 0.3)");

    drawPanel(20, 20, 920, 56, "#203757", "#29446a");
    drawText("Лабиринт урока: собери этапы для школьника", 38, 53, 14, "#f5ecd8");

    drawPanel(54, 126, 408, 332, "#2a4a6b", "#f6eddd");
    drawText("Принципы объяснения новой задачи", 74, 156, 13, palette.burgundy);
    drawText("Подсказок по порядку нет", 74, 176, 10, "#5f6a7f");

    if (game) {
      for (let i = 0; i < game.target.length; i++) {
        const done = i < game.chosen.length;
        drawRect(74, 194 + i * 50, 368, 36, done ? palette.emerald : "#bcb09b");
        if (done) {
          drawText(game.chosen[i], 88, 218 + i * 50, 11, "#f7efdf");
        } else {
          drawRect(88, 208 + i * 50, 340, 6, "#d7ccba");
        }
      }

      const boxes = getWolfBoxes(game.pool.length);
      for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        drawPanel(box.x, box.y, box.w, box.h, "#314b6d", "#f7efdf");
        drawWrappedText(game.pool[i], box.x + 12, box.y + 24, box.w - 20, 14, 10, palette.ink);
      }

      drawPanel(496, 448, 428, 56, "#203757", "#29446a");
      drawText(game.feedback, 516, 482, 11, "#f5ecd8");
    }
  }

  function getFinalBoxes(count) {
    const boxes = [];
    const cols = 2;
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      boxes.push({ x: 70 + col * 410, y: 146 + row * 84, w: 380, h: 62 });
    }
    return boxes;
  }

  function drawMiniFinal() {
    const game = state.finalGame;
    drawBackground("library");
    drawRect(0, 0, VIEW_W, VIEW_H, "rgba(18, 22, 33, 0.32)");

    drawPanel(20, 20, 920, 56, "#203757", "#29446a");
    drawText("Финальный пазл: почему я выбрал профессию", 38, 53, 14, "#f5ecd8");

    if (!game) return;

    const boxes = getFinalBoxes(game.cards.length);
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const card = game.cards[i];
      if (card.removed) {
        drawPanel(box.x, box.y, box.w, box.h, "#8d6262", "#d8b9b9");
        drawText("удалено", box.x + 150, box.y + 38, 11, "#5f2f2f");
        continue;
      }
      if (card.picked) {
        drawPanel(box.x, box.y, box.w, box.h, "#2f6956", "#e3f3ea");
      } else {
        drawPanel(box.x, box.y, box.w, box.h, "#314b6d", "#f7efdf");
      }
      drawWrappedText(card.text, box.x + 14, box.y + 28, box.w - 26, 16, 11, palette.ink);
    }

    drawPanel(34, 470, 892, 44, "#203757", "#29446a");
    drawText(`${game.notice} Ошибки: ${game.mistakes}`, 54, 498, 12, "#f5ecd8");
  }

  function drawMiniQadic() {
    const game = state.qadicGame;
    drawBackground("classroom");
    drawRect(0, 0, VIEW_W, VIEW_H, "rgba(17, 23, 35, 0.32)");

    drawPanel(20, 20, 920, 56, "#203757", "#29446a");
    drawText("Загадка: как выглядит q-адическое число?", 44, 53, 13, "#f5ecd8");

    if (!game) return;

    drawPanel(88, 96, 784, 72, "#2a4a6b", "#f7efdf");
    drawWrappedText(game.question, 112, 136, 740, 20, 15, palette.burgundy);

    const boxes = getQadicBoxes();
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const active = i === game.selected;
      drawPanel(box.x, box.y, box.w, box.h, active ? "#2f6956" : "#314b6d", active ? "#e3f3ea" : "#f7efdf");
      drawWrappedText(`${i + 1}. ${game.options[i].text}`, box.x + 16, box.y + 28, box.w - 30, 18, 11, palette.ink);
    }

    drawPanel(88, 470, 784, 44, "#203757", "#29446a");
    drawWrappedText(game.feedback, 110, 495, 750, 16, 10, "#f5ecd8");
  }

  function drawMiniSport() {
    const game = state.sportGame;
    drawBackground("gym");
    drawRect(0, 0, VIEW_W, VIEW_H, "rgba(12, 18, 29, 0.24)");

    drawPanel(20, 20, 920, 56, "#203757", "#29446a");
    drawText("Спортзал: лови числа по условию раунда", 42, 53, 13, "#f5ecd8");

    if (!game) return;

    drawPanel(68, 86, 824, 48, "#2a4a6b", "#f7efdf");
    drawText(`Раунд ${game.round + 1}/3`, 90, 114, 11, palette.burgundy);
    drawText(`Поймано: ${game.caught}/${game.goal}`, 264, 114, 11, palette.ink);
    drawText(`Время: ${Math.ceil(game.time)}`, 472, 114, 11, palette.ink);
    drawWrappedText(sportHintText(game.round), 600, 114, 272, 14, 9, "#385b86");

    drawPanel(68, 142, 824, 322, "#203757", "#dbe6f7");

    for (const item of game.numbers) {
      const good = sportMatchesRound(game.round, item.value);
      drawPanel(item.x - 22, item.y - 16, 44, 32, good ? "#2f6956" : "#753246", "#f7efdf");
      drawText(String(item.value), item.x - 13, item.y + 5, 11, palette.ink);
    }

    drawPanel(game.basketX - game.basketW / 2, 456, game.basketW, 28, "#223a5e", "#f7e3bf");
    drawText("Ловушка", game.basketX - 34, 474, 9, "#223a5e");

    drawPanel(68, 474, 824, 40, "#203757", "#29446a");
    drawWrappedText(game.feedback, 90, 498, 790, 15, 10, "#f5ecd8");
  }

  function drawMiniLetters() {
    const game = state.lettersGame;
    drawBackground("canteen");
    drawRect(0, 0, VIEW_W, VIEW_H, "rgba(15, 22, 34, 0.3)");

    drawPanel(20, 20, 920, 56, "#203757", "#29446a");
    drawText("Столовая: подбери букву к названию ПИрожка", 42, 53, 12, "#f5ecd8");

    if (!game) return;
    const current = game.items[game.index];
    if (!current) return;

    drawPanel(110, 94, 740, 88, "#2a4a6b", "#f7efdf");
    drawText(`Задание ${game.index + 1}/${game.items.length}`, 136, 126, 11, palette.burgundy);
    drawText(`Название буквы: ${current.name}`, 136, 156, 14, palette.ink);

    const boxes = getLetterBoxes();
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const active = i === game.selected;
      drawPanel(box.x, box.y, box.w, box.h, active ? "#2f6956" : "#314b6d", active ? "#e3f3ea" : "#f7efdf");
      drawText(game.options[i], box.x + box.w / 2 - 8, box.y + 54, 30, palette.ink);
      drawText(`${i + 1}`, box.x + 16, box.y + 22, 11, "#5b6680");
    }

    drawPanel(110, 430, 740, 36, "#2a4a6b", "#f7efdf");
    drawText(`Верно: ${game.correct}  Ошибки: ${game.mistakes}`, 136, 454, 11, palette.ink);

    drawPanel(110, 470, 740, 44, "#203757", "#29446a");
    drawWrappedText(game.feedback, 132, 495, 704, 15, 10, "#f5ecd8");
  }

  function drawOutro() {
    drawBackground("sea");
    drawRect(0, 0, VIEW_W, VIEW_H, "rgba(10, 16, 28, 0.42)");

    drawPanel(80, 52, 800, 126, "#1f3556", "#f1e8d6");
    drawText("ТЫ СДАЛ ЛЕТНЮЮ СЕССИЮ!", 98, 118, 46, palette.burgundy);
    drawText("Инф и Мэт закрыли второй уровень.", 226, 156, 13, palette.ink);

    drawPanel(140, 210, 680, 176, "#203757", "#2d4f77");
    drawText("Твой профессиональный вектор: " + state.careerPath, 166, 244, 15, "#f4ebd8");
    drawText("Артефактов собрано: " + state.artifacts.length, 166, 272, 12, "#dce8fa");
    drawText("Лисята уехали на практику вожатыми в летний лагерь.", 166, 300, 12, "#dce8fa");
    drawText("Море, закат и педагогическая смена впереди.", 166, 328, 12, "#dce8fa");

    for (let i = 0; i < 28; i++) {
      const cx = 120 + ((i * 47 + Math.floor(state.clock * 34)) % 720);
      const cy = 70 + ((i * 33 + Math.floor(state.clock * 18)) % 160);
      const color = i % 3 === 0 ? "#f0d48d" : i % 3 === 1 ? "#9fd1ff" : "#97c7a4";
      drawRect(cx, cy, 6, 6, color);
      drawRect(cx + 2, cy + 6, 2, 4, color);
    }

    drawPanel(236, 436, 488, 72, "#2f6956", "#3e806a");
    drawText("Новая попытка: Enter/Клик", 304, 468, 16, "#f7efdf");
    drawText("Пройти историю еще раз", 320, 494, 12, "#e6f7ef");
  }

  function drawFailScreen() {
    drawBackground("dorm");
    drawRect(0, 0, VIEW_W, VIEW_H, "rgba(10, 16, 28, 0.44)");

    drawPanel(86, 76, 788, 132, "#753246", "#f1e8d6");
    drawText("ПЕРЕСДАЧА ЗАЧЕТА", 220, 132, 44, palette.burgundy);
    drawText("Инф и Мэт снова в общежитии.", 214, 170, 13, palette.ink);

    drawPanel(122, 232, 716, 134, "#203757", "#2d4f77");
    drawText("Здоровье закончилось, и маршрут прервался.", 148, 270, 12, "#f4ebd8");
    drawText("Лисы готовятся к пересдаче зачета и вернутся сильнее.", 148, 298, 12, "#dce8fa");
    drawText("Игра завершена.", 148, 326, 12, "#dce8fa");

    drawPanel(236, 428, 488, 70, "#753246", "#8a3d54");
    drawText("Новая попытка: Enter/Клик", 302, 460, 15, "#f7efdf");
    drawText("Подготовиться и пройти заново", 284, 486, 11, "#f7dfdf");
  }

  function renderMessage() {
    if (!state.message) return;
    drawPanel(20, VIEW_H - 44, VIEW_W - 40, 30, "#203757", "#29446a");
    drawText(state.message, 34, VIEW_H - 23, 11, "#f5ecd8");
  }

  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(RENDER_SCALE_X, 0, 0, RENDER_SCALE_Y, 0, 0);

    if (state.mode === "intro") {
      drawIntro();
    } else if (state.mode === "select") {
      drawHeroSelect();
    } else if (state.mode === "novel") {
      drawNovelScene();
    } else if (state.mode === "choice") {
      drawChoiceOverlay();
    } else if (state.mode === "mini_qr") {
      drawMiniQr();
    } else if (state.mode === "mini_plan") {
      drawMiniPlan();
    } else if (state.mode === "mini_ai") {
      drawMiniAi();
    } else if (state.mode === "mini_wolf") {
      drawMiniWolf();
    } else if (state.mode === "mini_final") {
      drawMiniFinal();
    } else if (state.mode === "mini_qadic") {
      drawMiniQadic();
    } else if (state.mode === "mini_sport") {
      drawMiniSport();
    } else if (state.mode === "mini_letters") {
      drawMiniLetters();
    } else if (state.mode === "outro") {
      drawOutro();
    } else if (state.mode === "fail") {
      drawFailScreen();
    }

    renderMessage();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function loop(timestamp) {
    if (!state.lastFrameTime) {
      state.lastFrameTime = timestamp;
    }

    const delta = Math.min(0.05, (timestamp - state.lastFrameTime) / 1000);
    state.lastFrameTime = timestamp;

    if (!state.manualTimeControl) {
      state.accum += delta;
      while (state.accum >= STEP) {
        update(STEP);
        state.accum -= STEP;
      }
    }

    render();
    requestAnimationFrame(loop);
  }

  function miniStateForText() {
    if (state.mode === "mini_qr" && state.qrGame) {
      return {
        type: "qr",
        collected: state.qrGame.collected,
        remaining: 6 - state.qrGame.collected,
        time: Number(state.qrGame.time.toFixed(2)),
        cursorX: Number(state.qrGame.cursor.x.toFixed(2)),
        cursorY: Number(state.qrGame.cursor.y.toFixed(2)),
      };
    }

    if (state.mode === "mini_plan" && state.planGame) {
      return {
        type: "plan",
        feedback: state.planGame.feedback,
        solved: state.planGame.solved,
      };
    }

    if (state.mode === "mini_ai" && state.aiGame) {
      return {
        type: "ai",
        index: state.aiGame.index,
        total: state.aiGame.items.length,
        correct: state.aiGame.correct,
        mistakes: state.aiGame.mistakes,
      };
    }

    if (state.mode === "mini_wolf" && state.wolfGame) {
      return {
        type: "wolf",
        done: state.wolfGame.chosen.length,
        total: state.wolfGame.target.length,
      };
    }

    if (state.mode === "mini_final" && state.finalGame) {
      return {
        type: "final",
        selectedGood: state.finalGame.selectedGood,
        mistakes: state.finalGame.mistakes,
      };
    }

    if (state.mode === "mini_qadic" && state.qadicGame) {
      return {
        type: "qadic",
        selected: state.qadicGame.selected,
        solved: state.qadicGame.solved,
        feedback: state.qadicGame.feedback,
      };
    }

    if (state.mode === "mini_sport" && state.sportGame) {
      return {
        type: "sport",
        round: state.sportGame.round,
        caught: state.sportGame.caught,
        goal: state.sportGame.goal,
        numbers: state.sportGame.numbers.length,
        time: Number(state.sportGame.time.toFixed(2)),
      };
    }

    if (state.mode === "mini_letters" && state.lettersGame) {
      return {
        type: "letters",
        index: state.lettersGame.index,
        total: state.lettersGame.items.length,
        correct: state.lettersGame.correct,
        mistakes: state.lettersGame.mistakes,
      };
    }

    return null;
  }

  window.render_game_to_text = () => {
    const line = currentLine();
    const payload = {
      mode: state.mode,
      hero: state.heroId,
      companion: state.companionId,
      chapter: state.chapter,
      sceneId: state.sceneId,
      lineIndex: state.lineIndex,
      speaker: line ? line.speaker : null,
      lineText: line ? currentLineText() : null,
      visibleChars: Math.floor(state.typeProgress),
      tasks: { ...state.tasks },
      stats: {
        health: state.stats.health,
        maxHealth: state.stats.maxHealth,
        deadline: Number(state.stats.deadline.toFixed(2)),
        charisma: state.inventory.charisma,
        fgosShield: state.inventory.fgosShield,
        retryToken: state.inventory.retryToken,
      },
      choice: state.choice
        ? {
            prompt: state.choice.prompt,
            selected: state.choice.index,
            options: state.choice.options.map((item) => item.text),
          }
        : null,
      miniGame: miniStateForText(),
      artifacts: state.artifacts.map((item) => item.name),
      coords: "origin top-left, x right, y down",
    };
    return JSON.stringify(payload);
  };

  window.advanceTime = (ms) => {
    state.manualTimeControl = true;
    const steps = Math.max(1, Math.round(ms / (1000 / 60)));
    for (let i = 0; i < steps; i++) {
      update(STEP);
    }
    render();
  };

  resizeCanvas();
  resetState();
  requestAnimationFrame(loop);
})();
