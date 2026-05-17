import React, { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const CATS = [
  { id: 'create-core',  label: "Create · сердце фабрики",            color: '#b87333' },
  { id: 'create-rails', label: "Create · стальные маршруты и орудия", color: '#a05a28' },
  { id: 'create-deco',  label: "Create · красота цеха",              color: '#c89b3c' },
  { id: 'letsdo',       label: "Let's Do · тёплая жизнь мира",       color: '#a74552' },
  { id: 'food',         label: "Farmer's Delight · кухня приключений", color: '#7a8a3a' },
  { id: 'storage',      label: "Рюкзаки, склады и спасение лута",    color: '#6a4a8a' },
  { id: 'world',        label: "Живой мир · биомы и генерация",      color: '#3a7a5a' },
  { id: 'arch',         label: "Архитектура и визуальный стиль",     color: '#8a6a3a' },
  { id: 'social',       label: "Общение, эмоции и присутствие",      color: '#3a5a8a' },
  { id: 'script',       label: "Скриптовая магия и тонкая настройка", color: '#a04a8a' },
  { id: 'lib',          label: "Технический фундамент · библиотеки", color: '#5a5a5a' },
]

const RAW = [
  ['create-core', "Create", "Базовый техномод с валами, шестернями, конвейерами и сборочными линиями; фундамент большинства Create-аддонов в сборке."],
  ['create-core', "Create: Aeronautics", "Воздушные и подвижные конструкции на базе Create: дирижабли, летательные платформы и продвинутая кинематика."],
  ['create-core', "Create Crafts & Additions", "Связывает кинетику и электричество: генераторы, моторы, катушки и энергоинфраструктура для фабрик."],
  ['create-core', "Create: Enchantment Industry", "Автоматизация чар и связанных процессов через механизмы Create, включая массовую обработку предметов."],
  ['create-core', "Create: Central Kitchen", "Интеграция кулинарных модов с Create: конвейерная обработка еды, рецепты и кухонная автоматизация."],
  ['create-core', "Create: Tweaked Controllers", "Расширенные контроллеры и более гибкое управление контрапциями, логикой и режимами работы."],
  ['create-core', "Create: Contraption Terminals", "Терминалы и интерфейсы для удалённого управления контрапциями и удобной настройки сложных механизмов."],
  ['create-core', "CreateBetterFPS", "Оптимизационный аддон для Create, снижающий нагрузку от рендера и симуляции крупных механических систем."],
  ['create-core', "Create: Diesel Generators", "Дизельная энергетика для фабрик: генераторы, топливные цепочки и индустриальные энерголинии."],
  ['create-core', "Create: The Factory Must Grow", "Тяжёлая индустрия для Create: расширенные производственные линии, техпроцессы и крупная заводская логистика."],
  ['create-rails', "Create Big Cannons", "Артиллерийская ветка для Create: крупнокалиберные пушки, боеприпасы и баллистика."],
  ['create-rails', "Big Cannons Aeronautics Fix", "Патч совместимости между Big Cannons и Create: Aeronautics для корректной работы пушек на летающих конструкциях."],
  ['create-rails', "Steam 'n' Rails (railways)", "Крупное расширение железных дорог Create: новые пути, локомотивные возможности, блоки и сигнальные элементы."],
  ['create-rails', "Create: Threaded Trains", "Улучшения производительности и обработки поездов и маршрутов в крупных железнодорожных сетях."],
  ['create-rails', "Vista Aeronautics Fix", "Исправления совместимости Vista и Create: Aeronautics для стабильной работы камер и визуальных систем на летающих контрапциях."],
  ['create-deco', "Create: Copycats+", "Большой набор copycat-блоков для маскировки механизмов Create под обычные строительные материалы."],
  ['create-deco', "Aero Copycats", "Дополнительные copycat-элементы под тематику Create Aeronautics и сложные формы подвижных конструкций."],
  ['create-deco', "Create: Bells & Whistles", "Декоративные и функциональные дополнения к Create для более «живых» и детализированных фабрик."],
  ['create-deco', "Create: Bits 'n' Bobs", "Мелкая механика и декоративные блоки, добавляющие вариативность машинным комнатам и цехам."],
  ['create-deco', "Create: Connected", "Набор QoL-блоков и соединителей, которые делают сборку фабрик аккуратнее и удобнее."],
  ['create-deco', "Create: Rustic Structures", "Готовые и полуготовые деревенские и индустриальные постройки в стиле Create."],
  ['create-deco', "Create: Vibrant Vaults", "Расширение системы хранилищ Create (vault): больше вариантов, цветов и визуальных исполнений."],
  ['create-deco', "Create: Vinery", "Винодельческие линии на базе Create: переработка винограда, брожение и тематические блоки винодельни."],
  ['create-deco', "Create Deco", "Декоративный пакет для индустриального строительства: блоки, отделка и стильные элементы фабричной архитектуры."],
  ['create-deco', "Create: Design n' Decor", "Интерьерно-декоративный аддон для красивого оформления производств, мастерских и домов."],
  ['create-deco', "Create: Interiors", "Мебель и интерьерные блоки в стилистике Create для жилых и технических помещений."],
  ['create-deco', "Create BB", "Нишевое расширение линейки Create с дополнительными блоками и механиками для тематических производств."],
  ['create-deco', "Create: Dragons Plus", "Тематическое расширение Create с контентом, связанным с драконьей и фэнтезийной эстетикой."],
  ['create-deco', "Rechiseled: Create", "Декоративные вариации именно для блоков Create в стиле Rechiseled."],
  ['letsdo', "[Let's Do] Farm & Charm", "Фермерско-бытовой мод: ремесло, хозяйство, кулинарные процессы и уютная сельская атмосфера."],
  ['letsdo', "[Let's Do] Bakery", "Пекарня с хлебами, выпечкой и десертами; расширяет роль муки, теста и кухонных цепочек."],
  ['letsdo', "[Let's Do] Brewery", "Пивоварение и напитки: рецептуры, ферментация и тематический декор таверн."],
  ['letsdo', "[Let's Do] Candlelight", "Ресторанно-кухонная тематика с сервировкой, блюдами и блоками для уютных ужинов."],
  ['letsdo', "[Let's Do] Beachparty", "Пляжный досуг: летний декор, тематические предметы и праздничная атмосфера отдыха."],
  ['letsdo', "[Let's Do] Furniture", "Большой набор мебели в едином стиле линейки Let's Do для домов, трактиров и мастерских."],
  ['letsdo', "[Let's Do] HerbalBrews", "Чаи, кофе, настои и фласки; напитки с акцентом на атмосферу и роль кухни."],
  ['letsdo', "[Let's Do] Meadow", "Переработка луговой тематики, молочное ремесло и дополнительные природные детали биома."],
  ['letsdo', "[Let's Do] Vinery", "Виноделие и садоводство: виноград, бочки выдержки, винные погреба и элитные напитки."],
  ['letsdo', "[Let's Do] WilderNature", "Дикая природа, охота и трофеи; больше «живой» фауны и приключенческого контента."],
  ['letsdo', "[Let's Do] Camping", "Туристическая ветка: палатки, походный быт, снаряжение и отдых вне базы."],
  ['letsdo', "[Let's Do] Lili's Lucky Lures", "Рыболовное расширение с новыми способами ловли, лутом и тематическим декором."],
  ['letsdo', "[Let's Do] Lili's Pottery", "Гончарное дело: керамика, обжиг и декоративные изделия из глины."],
  ['letsdo', "[Let's Do] Alpine Whispers", "Атмосферный модуль серии с альпийской эстетикой, декором и природным колоритом."],
  ['letsdo', "Let's Do Compat", "Общий слой совместимости между модулями Let's Do и внешними аддонами."],
  ['letsdo', "Let's Do Meadow Sawmill Compat", "Точечная совместимость Meadow с Sawmill для корректной переработки древесины."],
  ['letsdo', "[Let's Do Addon] Corn Expansion", "Кукурузный мини-аддон для экосистемы Let's Do и Farm & Charm с новыми продуктами и рецептами."],
  ['food', "Farmer's Delight", "Базовый кулинарный мод: новые культуры, кухонные станции, блюда и полноценный цикл готовки."],
  ['food', "Farmer's Delight: Extended", "Дополнительные рецепты и связки с техно-модами без перегруза лишними сущностями."],
  ['food', "End's Delight", "Кулинарный контент для Энда: новые ингредиенты и блюда под эндовую тематику."],
  ['food', "Ocean's Delight", "Морская кухня: рыба, морепродукты и рецепты, завязанные на океанские ресурсы."],
  ['food', "Miner's Delight", "«Шахтёрская кухня»: блюда и ингредиенты, ориентированные на подземный геймплей."],
  ['food', "Expanded Delight", "Расширение пищевой ветки Farmer's Delight дополнительными ингредиентами и рецептами."],
  ['food', "MoreDelight", "Ещё один пакет блюд и ингредиентов, углубляющий кулинарную ветку сборки."],
  ['food', "Crate Delight", "Небольшой food-аддон с дополнительными блюдами и кулинарными связками в экосистеме Delight."],
  ['food', "KubeJS Delight", "Интеграция Farmer's Delight с KubeJS для кастомных рецептов и правок через скрипты."],
  ['food', "Farmer's Knives", "Поддержка ножей и совместимых инструментов для множества модов вокруг Farmer's Delight."],
  ['food', "Slice & Dice", "Автоматизация кулинарных операций (нарезка и обработка) с интеграцией в механические цепочки."],
  ['storage', "Sophisticated Backpacks", "Продвинутые рюкзаки с апгрейдами, фильтрами, автосортировкой и модульной функциональностью."],
  ['storage', "Sophisticated Backpacks Create Integration", "Интеграция рюкзаков Sophisticated с инфраструктурой Create."],
  ['storage', "Tom's Simple Storage Mod", "Простая и удобная централизованная сеть хранилищ в ванильной стилистике."],
  ['storage', "Gravestone Mod", "На месте смерти появляется могила с сохранённым инвентарём — снижает риск полной потери ресурсов."],
  ['storage', "Cosmetic Armor Reworked (Forked)", "Слоты косметической брони: внешний вид без потери боевых характеристик экипировки."],
  ['world', "Terralith", "Глобальная переработка генерации мира: множество новых биомов и выразительный рельеф на ванильных блоках."],
  ['world', "Noisium", "Оптимизация генерации чанков и шума мира для более плавной игры на больших дистанциях."],
  ['world', "NetherPortalFix", "Исправляет некорректные обратные привязки порталов в мультиплеере."],
  ['arch', "Rechiseled", "Огромный набор декоративных вариантов блоков с акцентом на архитектуру и стилизацию построек."],
  ['arch', "Every Compat", "Массовая генерация совместимых вариантов блоков между модами: древесина, камень, мебель и т. п."],
  ['arch', "Gems Realm (Every Compat module)", "Совместимые декоративные и строительные варианты материалов из Gems Realm для других модов."],
  ['arch', "Stone Zone (Every Compat module)", "Расширение совместимости каменных наборов и блоков для строительных модов."],
  ['arch', "Sawmill (Universal Sawmill)", "Универсальный распил древесины и удобная переработка деревянных блоков."],
  ['arch', "Joy of Painting", "Художественный мод: краски, холсты и рисование для декоративного оформления баз."],
  ['arch', "Exposure", "Аналог фотоаппарата в Minecraft: съёмка, фотоконтент и атмосферное документирование мира."],
  ['arch', "Vista", "Камеры, экраны и медиа-элементы (ТВ, трансляции) для охранных систем и интерьерной визуализации."],
  ['arch', "AppleWood ReBarked", "Декоративная и совместимостная обработка древесины яблони с дополнительными вариантами."],
  ['social', "Simple Voice Chat", "Голосовой чат в реальном времени внутри сервера с поддержкой позиционного общения."],
  ['social', "Emotecraft", "Система эмоций и анимаций персонажа для ролевого и социального взаимодействия."],
  ['social', "EmoteTweaks", "Дополнение к Emotecraft с улучшениями и расширенной поддержкой (в т. ч. звук поведения эмоций)."],
  ['script', "KubeJS", "Скриптовая платформа на JavaScript: кастомные рецепты, события, предметы и логика модпака."],
  ['script', "KubeJS Create", "Мост между KubeJS и Create для скриптового контроля механических рецептов и процессов."],
  ['script', "LootJS", "Скриптовое редактирование лут-таблиц через KubeJS для тонкой настройки дропа."],
  ['lib', "Architectury API", "Кросс-лоадерный API для разработки модов под разные загрузчики."],
  ['lib', "AzureLib", "Библиотека анимаций и кастомных моделей (в т. ч. Bedrock-стиля) для модовых сущностей и предметов."],
  ['lib', "Balm", "Универсальный слой абстракций для модов BlayTheNinth и других проектов."],
  ['lib', "Curios API", "API дополнительных слотов экипировки (кольца, амулеты и пр.) для модовой экипировки."],
  ['lib', "Forge Config API Port", "Порт Forge Config API для совместимости конфиг-системы на нужном лоадере."],
  ['lib', "Kotlin for Forge", "Рантайм и инфраструктура Kotlin для модов, написанных на Kotlin."],
  ['lib', "Lodestone", "Техническая библиотека с общими системами и утилитами для модов авторской экосистемы."],
  ['lib', "Moonlight Lib", "Библиотека Selene/Moonlight: регистры, datapack-утилиты, вспомогательные API и совместимость."],
  ['lib', "Rhino", "JS-движок и библиотека, используемая модами вроде KubeJS для исполнения скриптов."],
  ['lib', "Sable", "Библиотека интерактивных подвижных структур и саб-уровней для сложной механики."],
  ['lib', "Sophisticated Core", "Базовая библиотека для линейки Sophisticated-модов."],
  ['lib', "SuperMartijn642's Config Lib", "Утилитарная библиотека конфигов для модов SuperMartijn642 и совместимых проектов."],
  ['lib', "SuperMartijn642's Core Lib", "Базовое ядро и общие классы для модов SuperMartijn642."],
  ['lib', "Ritchie's Projectile Library", "Библиотека для систем снарядов и баллистической логики в зависимых модах."],
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
        <title>Гойдакрафт — Серверные моды</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/assets/img/goidalogo.png" />
        <link rel="preload" as="image" href="/assets/img/goidalogo.png" />
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

      <section className="mods-video">
        <div className="mods-video-inner">
          <div className="trailer-panel">
            <span className="rivet corner-rivet cr1" /><span className="rivet corner-rivet cr2" />
            <span className="rivet corner-rivet cr3" /><span className="rivet corner-rivet cr4" />
            <p className="trailer-title">▸ Видео-обзор модов ◂</p>
            <div className="trailer-frame">
              <div className="trailer-placeholder trailer-soon">
                <p className="soon-label">Скоро...</p>
                <span className="soon-rule" aria-hidden="true" />
                <p className="soon-note">Обзор модпака в работе</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="build-variants" id="build-variants">
        <div className="build-variants-inner">
          <h2>Два варианта сборки</h2>
          <p>Обе сборки рассчитаны на Minecraft 1.21.1. Выбирайте под свой стиль игры и мощность ПК.</p>
          <div className="build-grid">
            <article className="build-card">
              <h3><span>Вариант 1</span>GOIDAbase</h3>
              <p>Сборка только с самыми важными (обязательными) модами. Без неё вы просто не сможете зайти на сервер.</p>
            </article>
            <article className="build-card">
              <h3><span>Вариант 2</span>GOIDAslon</h3>
              <p>Самые важные моды + оптимизация Minecraft. На выходе более стабильный и визуально приятный Minecraft.</p>
            </article>
          </div>
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
          <span className="label">Карта модов · Minecraft 1.21.1 / NeoForge 21.1.228</span>
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
