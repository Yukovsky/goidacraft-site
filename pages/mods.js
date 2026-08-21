import React, { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const CATS = [
  { id: 'create-core',   label: "Create · сердце фабрики",             color: '#b87333' },
  { id: 'create-addons', label: "Create · аддоны и машины",            color: '#a05a28' },
  { id: 'create-deco',   label: "Create · красота цеха",               color: '#c89b3c' },
  { id: 'letsdo',        label: "Let's Do · тёплая жизнь мира",        color: '#a74552' },
  { id: 'food',          label: "Farmer's Delight · кухня приключений", color: '#7a8a3a' },
  { id: 'storage',       label: "Рюкзаки, склады и спасение лута",     color: '#6a4a8a' },
  { id: 'world',         label: "Живой мир · биомы и генерация",       color: '#3a7a5a' },
  { id: 'social',        label: "Общение, эмоции и присутствие",       color: '#3a5a8a' },
  { id: 'script',        label: "Скриптовая магия и тонкая настройка", color: '#a04a8a' },
  { id: 'optimize',      label: "Производительность и оптимизация",    color: '#2f7a7a' },
  { id: 'interface',     label: "Интерфейс, HUD и подсказки",          color: '#8a6a3a' },
  { id: 'visual',        label: "Визуал, звук и атмосфера",            color: '#c2447a' },
  { id: 'utility',       label: "Быт и мелкие удобства",               color: '#7a5a3a' },
  { id: 'lib',           label: "Технический фундамент · библиотеки",  color: '#5a5a5a' },
]

const RAW = [
  ['visual', "AmbientSounds", "Добавляет атмосферные фоновые звуки в зависимости от биома, высоты, времени суток и погоды."],
  ['world', "Amplified Nether", "Делает Нижний мир высотой до 256 блоков с амплифицированным рельефом, новыми 3D-биомами и типами террейна."],
  ['optimize', "AsyncParticles", "Переносит обработку и рендер частиц на асинхронный тик и GPU, снижая нагрузку на CPU."],
  ['optimize', "BadOptimizations", "Оптимизирует серверную логику (не рендер): тик сущностей, ИИ и вычисления, дополняя рендер-оптимизации вроде Sodium."],
  ['food', "Brewin' & Chewin'", "Аддон к Farmer's Delight с кегом для брожения и варки — сидр, пиво, сыр, помадка и другие напитки и блюда."],
  ['lib', "CERBON's API", "Библиотека-зависимость для модов CERBON (включая Just Enough Beacons); сама по себе геймплей не меняет."],
  ['interface', "Controlling", "Добавляет поиск по названию и подсветку конфликтующих клавиш в меню назначения управления."],
  ['create-addons', "Create: Dragons Plus", "Аддон Create с массовыми блочными операциями по области: заморозка, обжиг, покраска и тушение."],
  ['optimize', "Create: LazyTick", "Снижает частоту тика механизмов Create, позволяя серверу держать в 2-3 раза больше фабрик без лагов."],
  ['lib', "CreativeCore", "Библиотека CreativeMD, необходимая для работы LittleTiles и других его модов."],
  ['create-deco', "Create: Design n' Decor", "Аддон Create с декоративными блоками: лампы, вывески, котлы разных материалов и другие эстетичные детали для фабрик."],
  ['optimize', "Distant Horizons", "Рендерит удалённые чанки упрощённой LOD-геометрией, резко увеличивая дальность прорисовки почти без потери FPS."],
  ['utility', "Exposure: Detective", "Аддон к фотомоду Exposure с инструментами расследований — чернила для пометок на снимках, лупа и доска с фото на ниточках."],
  ['food', "Farmer's Delight", "Базовый мод готовки и фермерства: разделочная доска, сковорода, супы и десятки новых блюд."],
  ['visual', "Inventory Particles", "Добавляет частицы, исходящие от предметов в инвентаре игрока, для более живой картинки интерфейса."],
  ['interface', "Jade", "HUD-подсказка с информацией о блоке или мобе, на который смотрит игрок (аналог Waila/Hwyla)."],
  ['interface', "Jade Addons", "Расширяет Jade поддержкой сторонних модов, добавляя для их блоков и мобов корректные подсказки."],
  ['interface', "Just Enough Beacons (Reforged)", "Аддон JEI, показывающий подробную информацию об уровнях и эффектах маяков."],
  ['interface', "Just Enough Resources (JER)", "Расширяет JEI информацией о генерации мира, дропах мобов и торговле жителей."],
  ['lib', "KotlinLangForge", "Языковой адаптер, добавляющий поддержку Kotlin для модов на Forge/NeoForge; используется другими модами как зависимость."],
  ['lib', "MossyLib", "Библиотека с общим кодом для модов автора LopyMine; самостоятельного геймплея не добавляет."],
  ['utility', "Mouse Tweaks", "Ускоряет работу с инвентарём: перетаскивание и быстрый перенос стаков по нескольким слотам мышью."],
  ['world', "Nether Descent", "Добавляет новые биомы, мобов, блоки и предметы в Нижний мир."],
  ['social', "No Chat Reports", "Отключает криптографическую подпись и репорты чата, введённые в 1.19.1, для приватного общения без риска блокировки."],
  ['lib', "Oh The Trees You'll Grow", "Библиотека деревьев для биомных модов (например, Nether Descent), сама содержит новые типы деревьев."],
  ['world', "Ribbits", "Добавляет болотные деревни с лягушками-риббитами — торговцами, музыкантами, садовниками и колдунами."],
  ['lib', "Searchables", "Библиотека для поиска и автодополнения в интерфейсах; сама по себе не используется напрямую, только другими модами."],
  ['world', "Streams Reflowing", "Добавляет реалистичные ручьи и реки, текущие по рельефу вниз к морю обычной водой."],
  ['utility', "TableCraft", "Добавляет интерактивные блоки настольных игр — шахматы и шашки — с 3D-фигурами и анимацией ходов."],
  ['lib', "YUNG's API", "Библиотека-зависимость для модов YUNG (пещеры, подземелья, структуры)."],
  ['food', "Abnormals Delight", "Аддон, связывающий Farmer's Delight с модами Team Abnormals: новые рецепты, шкафы и куски мяса."],
  ['create-addons', "Aeronautics Camera Sync", "Синхронизирует камеру игрока с наклоном и поворотом контрапций Create Aeronautics для более естественного обзора в полёте."],
  ['create-addons', "Aeronautics: Simulated Copycats", "Добавляет копикат-блоки для Create Aeronautics с симулированными свойствами, влияющими на полёт, дрейф и повреждения корабля."],
  ['visual', "Aeronautics Wind Sound", "Добавляет звук ветра при полёте на контрапциях Create Aeronautics; громкость зависит от скорости и укрытия."],
  ['create-addons', "Create Aeronautics: Compatibility", "Патчи совместимости Create Aeronautics с другими модами, изначально не поддерживающими его систему физики."],
  ['create-addons', "Create: Aeroworks", "Аддон Create Aeronautics с гироскопами, джойстиками и пультами управления для стабилизации и пилотирования кораблей."],
  ['utility', "Aileron", "Масштабный оверхол и ребаланс полёта на элитрах."],
  ['utility', "Allurement", "Добавляет и переделывает зачарования, ломая привычную зачарную мету, включая зачарование конской брони."],
  ['utility', "Amendments", "Набор настраиваемых улучшений ванильных блоков: смешивание зелий в котле, анимация фонарей и другие мелкие твики."],
  ['interface', "AppleSkin", "Показывает скрытые цифры голода — насыщение, истощение и точную сытость от еды — прямо на HUD."],
  ['lib', "Architectury API", "Кросс-платформенная API-библиотека для мультизагрузчиковых модов (Forge/NeoForge/Fabric), без собственного контента."],
  ['lib', "Azimuth API", "Библиотека-API для аддонов Create: поведения блок-сущностей, кинематика и система достижений в стиле Create."],
  ['storage', "Backpacked", "Ванильно-дружелюбные рюкзаки с прогрессией через опыт, системой аугментов и настройкой."],
  ['storage', "Backpacked: Shells", "Аддон к Backpacked, добавляющий рюкзаки из раковины наутилуса и улитки."],
  ['lib', "BaguetteLib", "Событийная библиотека для разработчиков модов, улучшающая обработку смерти и инвентаря в NeoForge."],
  ['lib', "Balm", "Библиотека-прослойка для мультизагрузчиковых модов BlayTheNinth, унифицирует API и конфиги."],
  ['food', "Barbeque's Delight", "Аддон к Farmer's Delight: шашлыки на шпажках с разными приправами и блоки для их готовки."],
  ['create-deco', "Create: Bells & Whistles", "Аддон Create с 36 декоративными и утилитарными блоками для украшения построек и механизмов."],
  ['create-deco', "Create: Bits 'n' Bobs", "Аддон Create с декоративными и механическими мелочами, дополняющими стройки на Create."],
  ['lib', "Blueprint", "Библиотека Team Abnormals: реестры, синхронизация данных, биомы и система анимации Endimator для контент-модов."],
  ['lib', "Bookshelf", "Открытая библиотека кода и утилит, на которой построены другие моды."],
  ['optimize', "C2ME", "Многопоточный движок генерации, загрузки и записи чанков для повышения производительности."],
  ['utility', "Cardboard Chalkbox", "Датапак-мостик, добавляющий рецепт мела через верстак Create."],
  ['utility', "Chalk", "Мел 16 цветов для разметки блоков — ставит метки на полной стороне блока по месту клика."],
  ['social', "Chat Heads", "Показывает head-иконки игроков рядом с их сообщениями в чате для удобного различения собеседников."],
  ['social', "Chat Animation (Smooth Chat)", "Плавная анимация появления сообщений в чате."],
  ['food', "Chewy Cheeses", "Аддон к Brewin' and Chewin', добавляющий сыры из ингредиентов других модов в процесс созревания и брожения."],
  ['create-deco', "Clayworks", "Печь-кильн и набор строительных блоков из терракоты — плиты, лестницы, кирпичи."],
  ['utility', "Clickable Links", "Восстанавливает кликабельность ссылок в чате."],
  ['create-addons', "Climbable Ropes for Create Aeronautics", "Верёвки для Create Aeronautics с режимом лазания голыми руками — вверх-вниз, прыжок отпустить."],
  ['lib', "Cloth Config API", "Библиотека для экранов настроек модов — единый визуальный стандарт конфигурационных меню."],
  ['create-addons', "Create More: Parallel Pipes", "Аддон Create: трубы, которые не соединяются автоматически друг с другом, как закованные трубы, плюс блокировка состояния жидкости."],
  ['interface', "Configured", "Добавляет команду и меню для тонкой настройки игровых параметров прямо в игре."],
  ['create-deco', "Create: Copycats+", "Аддон Create: копирование текстур материалов в лестницы, плиты, панели и другие формы с сохранением текстур."],
  ['utility', "Cosmetic Armor Reworked Forked", "Позволяет носить два комплекта брони — один для вида, другой для характеристик."],
  ['storage', "Crate Delight", "Ящики и мешки для сортировки урожая, рыбы, яиц и других ресурсов — освобождает сундуки от захламления."],
  ['create-core', "Create", "Базовый техномод с валами, шестернями, конвейерами и сборочными линиями; фундамент большинства Create-аддонов в сборке."],
  ['create-core', "Create Aeronautics", "Расширение Create для постройки дирижаблей, самолётов и машин."],
  ['create-addons', "Create: Central Kitchen", "Аддон Create для автоматизации готовки: интеграция кастрюль, скилетов и разделочных досок с механической рукой и упаковщиком."],
  ['create-addons', "Create: Enchantment Industry", "Аддон Create для автоматизации опыта и зачарований: жидкий опыт, механический точильный камень, блейз-зачарователь."],
  ['create-addons', "Create Aeronautics: Toolgun", "Инструмент-пушка для Create Aeronautics: сохранение, печать и перетаскивание физических конструкций, аналог гравипушки."],
  ['create-deco', "Create: Blocks and Boggies", "Аддон Create с дополнительными декоративными блоками и мелкими деталями для строительства и оформления фабрик."],
  ['create-deco', "Create: Connected", "Аддон Create с QoL-блоками, которых не хватало в базовом моде."],
  ['create-addons', "Create Radars: Mobile Radars", "Портативные радары для Create: Radars — планшет с HUD и очки-радар для аддона слежения и наведения оружия."],
  ['world', "Create: Rustic Structures", "Аддон для Create, добавляющий в мир генерируемые постройки в деревенском стиле — колодцы, мельницы, кузницы и амбары."],
  ['create-addons', "Create: Deep Seas", "Аддон Create Aeronautics для постройки и пилотирования подводных лодок с системой давления и запасом кислорода."],
  ['create-addons', "Create: Winery", "Аддон Create про виноделие: виноград, давильня для сусла и винный погреб для автоматической выдержки вина и сидра."],
  ['create-addons', "Create Crafts & Additions", "Аддон Create, связывающий электричество и кинетическую энергию через электромотор, альтернатор и прокатный стан."],
  ['optimize', "CreateBetterFps", "Патч производительности для рендера Create, снижающий просадки FPS при работающих шейдерах."],
  ['create-addons', "Create Big Cannons", "Аддон Create для постройки больших многоблочных пушек и автопушек с системой снарядов и наводки, заточенный под PvP."],
  ['storage', "Create Contraption Terminals", "Позволяет терминалам Tom's Simple Storage обращаться к инвентарю собранных контраптов Create."],
  ['create-deco', "Create Deco", "Индустриальные декоративные блоки в стиле Create: настилы, решётки, контейнеры и листовой металл в шести материалах."],
  ['create-addons', "Create: Diesel Generators", "Аддон Create с компактными дизельными генераторами и переработкой сырой нефти в топливо."],
  ['interface', "Create JEI Compat", "Патч совместимости, корректно показывающий в JEI рецепты последовательной сборки Create длиннее шести шагов."],
  ['create-addons', "Create Nuclear", "Аддон Create, добавляющий ядерные реакторы, добычу и переработку урана в мощный источник кинетической энергии."],
  ['create-addons', "Create Nuclear Radiation", "Дополнение к Create Nuclear, добавляющее радиационное заражение местности после взрыва реактора."],
  ['create-addons', "Create Propulsion: Simulated", "Аддон Create Aeronautics с реактивными двигателями, редстоун-магнитами и оптическими датчиками для управляемых конструкций."],
  ['create-addons', "Create Railways Navigator", "Аддон для железных дорог Create: навигатор маршрутов между станциями, линии и группы поездов, улучшенные табло."],
  ['interface', "Create: Redstone Link GUI", "Добавляет GUI для настройки частоты редстоун-линков без необходимости держать нужный предмет в руке."],
  ['optimize', "Create Tick Controller", "Серверная оптимизация: динамически снижает частоту тиков механизмов Create на крупных фабриках, чтобы не проседал TPS."],
  ['create-addons', "Create: Transmission!", "Аддон Create с блоком передаточной цепи для аккуратной передачи кинетики на ленты без цепного привода в кожухе."],
  ['lib', "Curios API", "Библиотека, добавляющая дополнительные слоты экипировки (кольца, кулоны и т.д.) для других модов."],
  ['lib', "Delight Lib", "Библиотека для аддонов Farmer's Delight: упрощает регистрацию еды, шкафов, ящиков, ножей и урожая."],
  ['script', "KubeJS Diesel Generators", "Интеграция Create: Diesel Generators с KubeJS для написания собственных рецептов брожения и перегонки."],
  ['lib', "DragonLib", "Служебная библиотека автора нескольких аддонов (в т.ч. Railways Navigator), не даёт игрового контента сама по себе."],
  ['interface', "Durability Tooltip", "Показывает точную прочность предмета в подсказке при наведении."],
  ['create-deco', "Create Aeronautics: Dyeable Components", "Позволяет красить компоненты Create Aeronautics в цвета красителей."],
  ['optimize', "Dynamic FPS", "Резко снижает нагрузку на CPU/GPU, когда окно игры свёрнуто или неактивно."],
  ['world', "Ecologics", "Обновляет ванильные биомы новыми мобами (капибары и др.), блоками и растениями."],
  ['social', "Emotecraft", "Добавляет систему эмоций и жестов персонажа, видимых другим игрокам на сервере."],
  ['interface', "Enchantment Descriptions", "Добавляет описание эффекта чар в подсказку зачарованных книг и предметов на множестве языков."],
  ['world', "Enderscape", "Полностью переделывает Энд: новые биомы, генерация, форпосты, звуки и опасная жидкость Void Lachryma."],
  ['visual', "Entity Model Features (EMF)", "Позволяет ресурспакам менять модели мобов и игроков в духе OptiFine CEM, совместимо с Sodium."],
  ['visual', "Entity Sound Features (ESF)", "Даёт ресурспакам управлять звуками мобов через правила в духе OptiFine, дополняя EMF и ETF."],
  ['visual', "Entity Texture Features (ETF)", "Поддержка эмиссивных, случайных и кастомных текстур для мобов и скинов игроков в стиле OptiFine."],
  ['utility', "Etch and Copy", "Утилитарный мод для переноса и копирования гравировки между предметами."],
  ['social', "Etched", "Позволяет создавать собственные музыкальные пластинки из аудио по ссылке и проигрывать их через джукбокс, альбом-джукбокс или вагонетку."],
  ['social', "Etched-Extension", "Расширяет источники музыки для Etched, добавляя поддержку meting-api и Netease Music."],
  ['visual', "Exposure", "Плёночная фотокамера с полным циклом съёмки: зарядка плёнки, кадрирование, проявка негативов и печать фото."],
  ['visual', "Exposure: Expanded", "Дополнение к Exposure с новыми объективами, ретро-плёнками и фильтрами на основе шейдеров."],
  ['interface', "FancyMenu", "Позволяет полностью кастомизировать главное меню, экраны загрузки и другие GUI игры."],
  ['optimize', "FerriteCore", "Снижает потребление оперативной памяти игрой за счёт более эффективного хранения данных о блоках и чанках."],
  ['create-addons', "Create: Fluid", "Аддон Create для продвинутой логистики жидкостей: интерфейсы, насосы и сети передачи флюидов между машинами."],
  ['lib', "Framework", "Библиотека MrCrayfish, обеспечивающая сеть, конфиги и общие системы для его модов."],
  ['world', "Friends & Foes", "Добавляет новых мобов и биомные элементы, вдохновлённые отклонёнными предложениями Minecraft Mob Vote."],
  ['food', "Fruits Delight", "Аддон Farmer's Delight, добавляющий фрукты, ягоды и блюда на их основе."],
  ['lib', "FTB Library", "Базовая библиотека, необходимая для работы модов FTB (кланы, ранги, общие утилиты)."],
  ['visual', "Fusion (Connected Textures)", "Клиентский мод, добавляющий поддержку связанных текстур (CTM) и дополнительных типов моделей для ресурс-паков."],
  ['lib', "FzzyConfig", "Библиотека для удобной настройки конфигов других модов через игровой интерфейс."],
  ['lib', "GeckoLib", "Библиотека продвинутой анимации мобов, блоков и предметов, на которой держится множество контентных модов."],
  ['storage', "GraveStone Mod", "Ставит на месте смерти надгробие с инвентарём и опытом игрока вместо разброса вещей по земле."],
  ['storage', "Gravestone x Backpacked Compat", "Патч совместимости GraveStone с модом рюкзаков Backpacked, чтобы содержимое рюкзака корректно попадало в могилу."],
  ['storage', "Gravestone and Sable Compatibility Patch", "Патч совместимости GraveStone с Sable: могила корректно ставится на палубе аэростата вместо мира под ним."],
  ['utility', "HWID Anti Alts", "Серверный анти-чит, блокирующий обход банов через альтернативные аккаунты по HWID устройства."],
  ['visual', "Immersive Melodies", "Позволяет проигрывать мелодии на игровых музыкальных инструментах в реальном времени."],
  ['create-deco', "Create: Interiors", "Аддон Create, добавляющий декоративную мебель и элементы интерьера."],
  ['lib', "Iris/Flywheel Compat", "Патч совместимости шейдеров Iris с рендер-движком Flywheel, который использует Create."],
  ['visual', "Iris", "Шейдерный мод, добавляющий поддержку шейдер-паков на современном рендере (аналог OptiFine ShadersMod)."],
  ['lib', "JamLib", "Библиотека JamCoreModding для конфигов, регистрации контента и тик-задач других их модов."],
  ['interface', "Just Enough Archaeology", "Аддон JEI, показывающий, что можно найти в подозрительных блоках и что выкапывают нюхачи."],
  ['interface', "Just Enough Items (JEI)", "Показывает все предметы и рецепты крафта/переработки в удобном окне поиска."],
  ['optimize', "JEI Optimizer", "Оптимизирует загрузку и поиск в JEI, снижая лаги при открытии каталога предметов."],
  ['interface', "Just Enough Breeding", "Аддон JEI, показывающий предметы и условия для разведения животных."],
  ['utility', "Just Zoom", "Добавляет удобную клавишу приближения камеры без необходимости в шейдерах или OptiFine."],
  ['lib', "Konkrete", "Библиотека Keksuccino, используемая как основа для его модов с экранными меню и HUD."],
  ['lib', "Kotlin for Forge", "Добавляет поддержку языка Kotlin и его стандартной библиотеки для модов на NeoForge."],
  ['script', "KubeJS Create", "Аддон KubeJS для скриптового доступа к рецептам и механикам Create."],
  ['script', "KubeJS", "Позволяет добавлять предметы, рецепты и игровые события через JavaScript-скрипты без написания полноценного мода."],
  ['script', "KubeJSable", "Аддон KubeJS для скриптового взаимодействия с событиями и API мода Sable."],
  ['script', "KubeJS Additions", "Расширяет KubeJS дополнительными привязками и функциями для более гибкого скриптинга."],
  ['script', "KubeJS Farmer's Delight", "Аддон KubeJS для скриптового создания рецептов и контента на основе Farmer's Delight."],
  ['food', "Kvass Addon", "Небольшой аддон, добавляющий квас и связанные рецепты в сборку."],
  ['letsdo', "Let's Do Meadow x Sawmill Compat", "Патч совместимости между дровосеком Let's Do: Meadow и модом Sawmill, чтобы избежать конфликтов."],
  ['letsdo', "Let's Do: Bakery", "Пекарня из серии Let's Do: новые виды хлеба, выпечки и кухонная утварь."],
  ['letsdo', "Let's Do: Beachparty", "Пляжная тематика Let's Do: коктейли, пляжный декор и связанные блоки."],
  ['letsdo', "Let's Do: Brewery", "Пивоварня из Let's Do: хмель, солод, брожение и алкогольные напитки."],
  ['letsdo', "Let's Do: Candlelight", "Свечи и уютный декор из серии Let's Do: разноцветные свечи и атмосферные блоки."],
  ['letsdo', "Let's Do: Farm & Charm", "Фермерский модуль Let's Do: новые культуры, животные и связанная утварь."],
  ['letsdo', "Let's Do: Furniture", "Аддон серии Let's Do с деревянной мебелью — стулья, столы, шкафы и прочий декор для дома."],
  ['letsdo', "Let's Do: Herbalbrews", "Аддон серии Let's Do о травяных настойках и зельях на растительной основе с новыми ингредиентами и эффектами."],
  ['letsdo', "Let's Do: Lili's Pottery", "Аддон серии Let's Do о гончарном деле — глина, гончарный круг и керамическая посуда."],
  ['letsdo', "Let's Do: Meadow", "Аддон серии Let's Do, добавляющий луговые цветы, травы и декоративную флору."],
  ['letsdo', "Let's Do: Vinery", "Аддон серии Let's Do о виноделии — виноградники, давильни и алкогольные напитки."],
  ['letsdo', "Let's Do: WilderNature", "Аддон серии Let's Do, расширяющий природное разнообразие: новые растения, грибы и элементы дикой природы."],
  ['optimize', "Lithium", "Оптимизация игровой логики и симуляции мира без изменения геймплея, заметно поднимает TPS/FPS."],
  ['lib', "Lodestone", "Библиотека команды Lodestar с общим кодом для рендеринга и вспомогательных систем их модов."],
  ['interface', "MC Jade Crops", "Небольшой аддон, добавляющий в подсказку Jade отображение стадии роста культур."],
  ['lib', "Melody", "Клиентская библиотека на OpenAL для асинхронного воспроизведения музыки и звука в модах, независимо от звукового движка Minecraft."],
  ['visual', "Model Gap Fix", "Устраняет визуальные щели и артефакты на стыках блочных и предметных моделей."],
  ['optimize', "ModernFix", "Комплексный набор патчей производительности: ускоряет загрузку игры, снижает потребление памяти и число микрофризов."],
  ['lib', "Moonlight Lib", "Библиотека MehVahdJukaar с общими инструментами (AI жителей, датапак-система, маркеры карты) для его модов."],
  ['script', "MoreJS", "Расширяет KubeJS дополнительными событиями и хуками для более гибких скриптов сборки."],
  ['world', "Naturalist", "Добавляет мелких лесных и полевых животных (белки, лягушки, крабы и др.) для оживления окружающего мира."],
  ['food', "Neapolitan", "Добавляет мороженое шести вкусов с забавными эффектами при поедании."],
  ['utility', "Not Enough Crashes", "Перехватывает часть игровых крашей и позволяет продолжить игру или мягко перезайти в мир без полного вылета."],
  ['world', "One To One Nether Travel", "Меняет коэффициент перемещения через портал Нижнего мира с ванильного 8:1 на 1:1."],
  ['utility', "Packet Fixer", "Исправляет ошибки сетевых пакетов, NBT-данных и таймаутов, снижая число дисконнектов и багов синхронизации."],
  ['world', "Pet Cemetery", "Позволяет воскрешать погибших питомцев в виде зомби- или скелет-версий через выпадающий с них ошейник."],
  ['social', "Plasmo Voice", "Голосовой чат в реальном времени внутри сервера с поддержкой позиционного общения."],
  ['lib', "Player Animator", "Библиотека для проигрывания кастомных анимаций игрока, используется другими модами как зависимость."],
  ['interface', "Polymorph", "Даёт выбирать нужный результат крафта при конфликте нескольких рецептов на одни и те же ингредиенты."],
  ['script', "Ponder JS", "Позволяет через KubeJS-скрипты создавать собственные сцены Ponder (всплывающие подсказки-анимации Create) для новых предметов и механик."],
  ['lib', "Prickle", "Библиотека JSON-конфигов, которую используют другие моды для хранения и загрузки своих настроек."],
  ['social', "Plasmo Voice: Walkie-Talkie", "Аддон Plasmo Voice, добавляющий рацию для голосовой связи на расстоянии независимо от обычного радиуса чата."],
  ['social', "Plasmo Voice: Volume Booster", "Аддон Plasmo Voice, добавляющий регулировку и усиление громкости голоса отдельных игроков."],
  ['create-addons', "Railways (Create: Railways)", "Аддон Create с полноценными железными дорогами: рельсы, стрелки, семафоры, станции и поезда."],
  ['create-deco', "Rechiseled", "Добавляет альтернативные (чиселёные) варианты текстур для ванильных блоков без лишних предметов в инвентаре."],
  ['create-deco', "Rechiseled: Create", "Аддон Rechiseled, добавляющий чиселёные варианты декоративных блоков из Create."],
  ['interface', "Reese's Sodium Options", "Возвращает удобное меню настроек графики Sodium в NeoForge-сборках."],
  ['interface', "Reliable Recount", "Заменяет отображение числа предметов в стаках на компактный стиль, аналогичный Create."],
  ['lib', "ResourcefulConfig", "Библиотека для удобной настройки конфигов модов линейки Resourceful (Bees, Lib и др.)."],
  ['lib', "ResourcefulLib", "Общая библиотека с базовым кодом для модов линейки Resourceful (например, ResourcefulBees)."],
  ['lib', "Rhino", "JavaScript-движок, на котором работает KubeJS — обязательная зависимость для всех JS-скриптов сборки."],
  ['lib', "Ritchie's Projectile Lib", "Библиотека для создания и обработки кастомных снарядов, используется боевыми и оружейными модами."],
  ['lib', "Sable", "Библиотека подуровней с физическим движком на Rapier, лежит в основе подвижных конструкций вроде Create: Simulated."],
  ['create-addons', "Create Additions: Sable Compat", "Патч совместимости, позволяющий проводам Create Crafts & Additions соединяться между физическими подуровнями Sable и обычным миром."],
  ['utility', "Sable CleanUp", "Админ-инструмент для поиска, телепортации, заморозки, просмотра в 3D и удаления физических подуровней Sable через единый GUI."],
  ['interface', "Sable Jade", "Аддон для Jade, добавляющий во всплывающие подсказки информацию о физических подуровнях и объектах Sable."],
  ['optimize', "Saturn", "Оптимизирует использование памяти клиента и сервера, снижая нагрузку на RAM."],
  ['utility', "Universal Sawmill", "Автоматическая лесопилка, перерабатывающая брёвна в доски и другие изделия из дерева совместимо с любыми модами."],
  ['create-addons', "Simulated Coasters", "Аддон Create на физическом движке Sable, добавляющий американские горки и рельсовые аттракционы."],
  ['create-addons', "Slice & Dice", "Аддон Create для автоматической разделки и переработки мобов на фабричной линии."],
  ['interface', "Smithing Template Viewer", "Показывает в JEI, как кузнечный шаблон (трим) будет выглядеть на разных предметах брони и в разных цветах."],
  ['optimize', "Sodium Extra", "Дополнительные настройки производительности и визуальные переключатели поверх Sodium."],
  ['optimize', "Sodium", "Оптимизированный рендер-движок, значительно повышающий FPS без потери качества графики."],
  ['utility', "Sort It Out!", "Автоматически сортирует содержимое сундуков и инвентарей по настраиваемым правилам."],
  ['utility', "Spear Backport", "Добавляет копьё из будущего обновления Mounts of Mayhem как оружие ближнего боя с выпадами."],
  ['food', "SpiceOfLife: Latiao", "Снижает питательность еды при частом повторном употреблении одного и того же блюда, стимулируя разнообразие рациона."],
  ['lib', "Strut Your Stuff", "Библиотека для блоков-тросов, растягивающихся между двумя точками, используется другими декоративными модами."],
  ['utility', "Submarine Fix", "Патч, исправляющий баги и краши, связанные с подводными лодками в сборке."],
  ['lib', "SuperMartijn642's Config Lib", "Библиотека для создания экранов конфигурации модов SuperMartijn642."],
  ['lib', "SuperMartijn642's Core Lib", "Общая библиотека с базовыми утилитами для модов SuperMartijn642, включая Supplementaries."],
  ['utility', "Supplementaries", "Добавляет десятки утилитарных и декоративных блоков — от досок объявлений и шкивов до ловушек и сигнальных устройств."],
  ['lib', "TealLib", "Служебная библиотека, необходимая для работы модов автора XieDeWu, включая SpiceOfLife: Latiao."],
  ['world', "Tide Extra Compatibility", "Датапак совместимости, добавляющий рыб из Tide в биомы, лут и рецепты других модов."],
  ['world', "Tide", "Расширяет рыбалку: около сотни видов рыб с редкостью, миниигрой подсечки и настраиваемыми удочками."],
  ['storage', "Tom's Storage", "Система централизованного хранения с шкафами, терминалами доступа и удалённым выводом предметов по кабелям."],
  ['create-addons', "Create: Tracks+", "Аддон Create/Aeronautics, добавляющий рельсы и элементы путей в стиле Trackwork."],
  ['lib', "Trimmed", "Клиентская система, позволяющая другим модам и датапакам создавать собственные кузнечные отделки (трим), работающие как ванильные."],
  ['lib', "TxniLib", "Мультиверсионная библиотека для модов автора Txni, устраняющая дублирование кода между версиями Minecraft."],
  ['world', "Upgrade Aquatic", "Расширяет контент обновления Update Aquatic: новых мобов, укрытия и генерацию океанов и рек."],
  ['storage', "Wet Backpacks", "Аддон к Backpacked, добавляющий несколько новых косметических рюкзаков со своими способами разблокировки."],
  ['world', "WilderNature Board Fit", "Патч совместимости, исправляющий размещение и отображение Доски наград (Bounty Board) мода WilderNature."],
  ['interface', "Xaero's Minimap", "Миникарта в углу экрана с отображением существ, вейпоинтов и радаром."],
  ['interface', "Xaero's World Map", "Полноэкранная карта мира, дополняющая миникарту Xaero подробным обзором исследованной территории."],
  ['visual', "Xerca Paint", "Позволяет создать холст и палитру для рисования собственных картин и повесить их на стену как ванильные полотна."],
  ['lib', "YetAnotherConfigLib (YACL)", "Библиотека для построения экранов конфигурации модов, используется Sodium Extra и другими."],
  ['food', "Gensokyo Delight ~ Youkai's Feasts", "Японская кухня для Farmer's Delight: свыше 140 блюд, напитков и кухонной утвари."],
]

const CAT_MAP = Object.fromEntries(CATS.map(c => [c.id, c]))
const MODS = RAW.map((row, i) => ({
  n: i + 1,
  cat: row[0],
  name: row[1],
  desc: row[2],
  catLabel: CAT_MAP[row[0]].label,
  color: CAT_MAP[row[0]].color,
}))

const ACCESS_QUERY_RE = /^select\s*\*\s*from\s+([^\s]+)$/i

export default function ModsPage() {
  const [activeCat, setActiveCat] = useState('all')
  const [search, setSearch] = useState('')
  const [activeModN, setActiveModN] = useState(null)
  const searchRef = useRef(null)
  const accessTimerRef = useRef(null)

  const filteredMods = MODS.filter(m => {
    if (activeCat !== 'all' && m.cat !== activeCat) return false
    if (search) return m.name.toLowerCase().includes(search.toLowerCase())
    return true
  })

  const activeMod = activeModN ? MODS.find(m => m.n === activeModN) : null

  function handleSearch(val) {
    if (accessTimerRef.current) { clearTimeout(accessTimerRef.current); accessTimerRef.current = null }
    if (ACCESS_QUERY_RE.test(val.trim())) {
      accessTimerRef.current = setTimeout(() => {
        try { sessionStorage.setItem('goida_console_access', '1') } catch (_) {}
        window.location.href = '/console?target=' + encodeURIComponent(val.trim().match(ACCESS_QUERY_RE)[1])
      }, 1200)
    }
    setSearch(val)
    if (activeModN) setActiveModN(null)
  }

  function handleSearchKey(e) {
    if (e.key !== 'Enter') return
    if (accessTimerRef.current) { clearTimeout(accessTimerRef.current); accessTimerRef.current = null }
    const val = e.target.value
    const m = val.trim().match(ACCESS_QUERY_RE)
    if (m) {
      try { sessionStorage.setItem('goida_console_access', '1') } catch (_) {}
      window.location.href = '/console?target=' + encodeURIComponent(m[1])
    }
  }

  function handleModClick(mod) {
    setActiveModN(prev => (prev === mod.n ? null : mod.n))
  }

  const catsWithMods = CATS.filter(c => {
    if (activeCat !== 'all' && c.id !== activeCat) return false
    return filteredMods.some(m => m.cat === c.id)
  })

  return (
    <>
      <Head>
        <title>Моды Гойдакрафт — Create, Aeronautics, Farmer's Delight</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Полный список модов сервера Гойдакрафт: Create, Aeronautics, Railways, Farmer's Delight, Let's Do. Скачай сборку для Minecraft 1.21.1." />
        <meta name="keywords" content="моды гойдакрафт, goidacraft моды, create aeronautics мод, create mod list, minecraft mods 1.21.1, neoforge mods, farmer's delight, railways create, список модов сервера, goidacraft mods" />
        <link rel="canonical" href="https://goidacraft.online/mods/" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goidacraft.online/mods/" />
        <meta property="og:title" content="Моды сервера Гойдакрафт — Create, Aeronautics и другие" />
        <meta property="og:description" content="Полный список модов: Create, Create: Aeronautics, Railways, Farmer's Delight, Let's Do. Скачай сборку для Minecraft 1.21.1 NeoForge." />
        <meta property="og:image" content="https://goidacraft.online/assets/img/goidalogo.png" />
        {/* Twitter */}
        <meta name="twitter:title" content="Моды сервера Гойдакрафт — Create, Aeronautics и другие" />
        <meta name="twitter:description" content="Полный список модов: Create, Create: Aeronautics, Railways, Farmer's Delight. Сборка для Minecraft 1.21.1." />
        <meta name="twitter:image" content="https://goidacraft.online/assets/img/goidalogo.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Моды сервера Гойдакрафт",
          "url": "https://goidacraft.online/mods/",
          "description": "Полный список модов сервера Гойдакрафт для Minecraft 1.21.1 NeoForge 21.1.248: Create, Create: Aeronautics, Railways, Farmer's Delight и другие.",
          "isPartOf": { "@type": "WebSite", "name": "Гойдакрафт", "url": "https://goidacraft.online" }
        }) }} />
      </Head>

      <section className="page-head">
        <div className="deco-gear gear-host gear-spin" data-teeth="14" data-r="80" data-color="#8a6a1f" data-highlight="#c89b3c" style={{ left: '5%', top: '30%' }} />
        <div className="deco-gear gear-host gear-spin ccw" data-teeth="10" data-r="50" data-color="#8a6a1f" data-highlight="#c89b3c" style={{ right: '8%', top: '25%' }} />
        <h1>СЕРВЕРНЫЕ МОДЫ</h1>
        <p className="subtitle">Как детали одного механизма</p>
        <div className="stats">
          <span><strong>{MODS.length}</strong>модов</span>
          <span><strong>{CATS.length}</strong>категорий</span>
          <span><strong>1.21.1</strong>Minecraft</span>
        </div>
      </section>

      <section className="build-variants" id="build-variants">
        <div className="build-variants-inner">
          <h2>Единая сборка</h2>
          <p>Одна сборка на Minecraft 1.21.1, оптимизированная и заточенная под сервер — ничего выбирать не нужно.</p>
            <h2>Два способа установки</h2>
            <p>Два способа для удобства установки как игрокам с лицензией, так и без</p>
          <div className="download-methods" style={{ marginTop: '24px' }}>
            <article className="method-card install-card">
              <h3>ZIP-архив</h3>
              <p>Ручная установка: распакуйте в профиль все папки из архива (например, resourcepacks/, mods/, kubejs/).</p>
            </article>
            <article className="method-card install-card">
              <h3>.mrpack</h3>
              <p>Для Modrinth, Prism и похожих лаунчеров. Устанавливается автоматически.</p>
            </article>
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <a
              href="https://drive.google.com/drive/u/1/folders/1YL2rmhQ25l3TBhtMInGarqKM6UomWXdy"
              target="_blank" rel="noopener noreferrer"
              className="dl-btn-mods"
            >
              <span className="gear-host gear-spin" data-teeth="10" data-r="11" data-color="#3a1c08" data-highlight="#7a4818" />
              Скачать сборку
            </a>
          </div>
        </div>
      </section>

      <section className="blueprint">
        <div className="bp-header">
          <span className="label">Карта модов · Minecraft 1.21.1 / NeoForge 21.1.248</span>
          <h2>Кликните на любую деталь</h2>
          <p>Каждый мод — это шестерёнка в общем механизме сервера.</p>
          <div className="mods-search">
            <input
              ref={searchRef}
              type="search"
              placeholder="Поиск по названию мода..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              onKeyDown={handleSearchKey}
            />
          </div>
        </div>

        <div className="cat-tabs">
          <button className={`cat-tab${activeCat === 'all' ? ' active' : ''}`} onClick={() => { setActiveCat('all'); setActiveModN(null) }}>
            <span className="dot" style={{ background: '#3a2818' }} />Все
          </button>
          {CATS.map(c => (
            <button
              key={c.id}
              className={`cat-tab${activeCat === c.id ? ' active' : ''}`}
              onClick={() => { setActiveCat(c.id); setActiveModN(null) }}
            >
              <span className="dot" style={{ background: c.color }} />{c.label.split(' · ')[0]}
            </button>
          ))}
        </div>

        <div className="bp-canvas">
          <div className="bp-categories">
            {catsWithMods.map(c => {
              const catMods = filteredMods.filter(m => m.cat === c.id)
              const catActive = catMods.some(m => m.n === activeModN)
              return (
                <div key={c.id} className="bp-cat" style={{ borderColor: c.color + 'a0' }}>
                  <div className="bp-cat-title">
                    <span className="cat-dot" style={{ background: c.color }} />{c.label}
                  </div>
                  <div className="bp-mods">
                    {catMods.map(m => (
                      <button
                        key={m.n}
                        className={`mod-node${m.n === activeModN ? ' active' : ''}`}
                        onClick={() => handleModClick(m)}
                      >
                        <span className="mn-num">№{String(m.n).padStart(2, '0')}</span>
                        <span>{m.name}</span>
                      </button>
                    ))}
                  </div>
                  {catActive && activeMod && (
                    <div className="detail-panel open" style={{ borderColor: activeMod.color }}>
                      <span className="corner tl" style={{ borderColor: activeMod.color }} />
                      <span className="corner tr" style={{ borderColor: activeMod.color }} />
                      <span className="corner bl" style={{ borderColor: activeMod.color }} />
                      <span className="corner br" style={{ borderColor: activeMod.color }} />
                      <div className="detail-panel-header">
                        <div>
                          <div className="cat-line">{activeMod.catLabel}</div>
                          <h3>{activeMod.name}</h3>
                        </div>
                        <button className="close-btn" onClick={() => setActiveModN(null)} aria-label="Закрыть">×</button>
                      </div>
                      <div className="detail-panel-body">{activeMod.desc}</div>
                      <div className="detail-meta">
                        <span>№ {String(activeMod.n).padStart(2, '0')}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
