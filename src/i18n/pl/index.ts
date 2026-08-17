/**
 * Polish copy for the home page.
 *
 * Checked against the English dictionary with `satisfies typeof en`: a missing
 * or renamed key, or an array of the wrong length, fails the build.
 *
 * Register: Polish sentences, English industry vocabulary. Terms Polish
 * engineers actually say in Polish sentences (code review, pull request, CI,
 * merge, sandbox, deployment, property-based, mutation testing) stay in
 * English, as do every Visdom product name and the Maturity Matrix's own
 * L1-L5 and perspective vocabulary, which the live matrix publishes in
 * English. The reader is addressed in the plural ("wasz"), consistently.
 *
 * Article titles are not translated: their links point at English texts.
 */

import en from '../en';

const pl = {
  meta: {
    title: 'Visdom by VirtusLab: jak budujemy AI-Native SDLC z zespołami enterprise',
    description:
      'Wchodzimy do zespołów platformowych w dużych organizacjach i budujemy infrastrukturę, której agenty naprawdę potrzebują: kontekst, CI, code review i governance. Przynosimy platformę, którą sami zbudowaliśmy, wdrażamy ją razem z waszym zespołem i zostajemy na dłużej.',
    siteName: 'Visdom by VirtusLab',
    ogImageAlt:
      'Visdom by VirtusLab: jak budujemy AI-Native SDLC z zespołami enterprise',
  },

  nav: {
    ariaPrimary: 'Główna',
    platform: 'Platforma',
    insights: 'Publikacje',
    maturityMatrix: 'Maturity Matrix',
    contact: 'Porozmawiajmy',
    themeToggle: 'Przełącz motyw kolorystyczny',
    openMenu: 'Otwórz menu',
    languageLabel: 'Język',
  },

  tour: {
    tag: 'Visdom AI Tour',
    aria: 'Visdom AI Tour 2026, zobaczcie terminy i zapiszcie się',
    nextStop: 'Następny przystanek:',
    months: {
      May: 'maj',
      June: 'czerwiec',
      September: 'wrzesień',
      October: 'październik',
    } as Record<string, string>,
  },

  hero: {
    brandTagline: 'Platforma AI-Native SDLC',
    headlineLead: 'Brakująca warstwa między',
    headlineAccent: 'kodowaniem z AI a produkcją',
    lead: 'Workflow AI-Native SDLC gotowe na produkcję, wdrożone razem z waszym zespołem inżynierskim.',
    cta: 'Zobaczcie, jak pracujemy ->',
    trust: ['W pełni konfigurowalne', 'Zacznijcie od małego, skalujcie szybko'] as [
      string,
      string,
    ],
    visualLabel: 'Model forward-deployed',
    visualTitle: 'Wchodzimy, wdrażamy, zostajemy.',
    steps: [
      {
        phase: 'Faza 1',
        title: 'Assessment',
        detail:
          'Sprawdzamy wasz obecny stack, mapujemy luki i wskazujemy pierwszy zespół pilotażowy.',
      },
      {
        phase: 'Faza 2',
        title: 'Wdrożenie pilotażowe',
        detail:
          'Wdrażamy komponenty w waszych repozytoriach, CI i mechanizmach kontrolnych, razem z waszymi inżynierami platformowymi.',
      },
      {
        phase: 'Faza 3',
        title: 'Skalowanie i rozwój',
        detail:
          'Rozszerzamy wdrożenie na kolejne zespoły, przeglądamy architekturę i odblokowujemy przypadki brzegowe w miarę wzrostu adopcji.',
      },
      {
        phase: 'Faza 4',
        title: 'Wsparcie',
        detail:
          'Stała współpraca przy przeglądach architektury i kolejnym kroku dojrzałości, na przewidywalnych warunkach.',
      },
    ],
  },

  shift: {
    aria: 'Dlaczego AI grzęźnie w infrastrukturze dostarczania zbudowanej dla ludzi',
    label: 'Zmiana',
    title: "AI przyspieszyło. Pipeline'y, przez które płynie, nie.",
    subtitle:
      "Wdrożyliście asystenta. Na starcie było dużo entuzjazmu. Potem tempo stanęło, a ROI wyparowało. Asystent nigdy nie był wąskim gardłem. Była nim infrastruktura dostarczania wokół niego: pipeline'y, CI i review zbudowane dla ludzi piszących w ludzkim tempie. Podłączenie AI tego nie naprawia, tylko obnaża każde pęknięcie.",
    changedLabel: 'Co się zmieniło',
    changedLead: 'Agenty generują dziś kod szybciej niż jakikolwiek człowiek.',
    changedBody:
      'Wąskie gardło przesunęło się z pisania kodu na jego zrozumienie, weryfikację i bezpieczne dowiezienie na produkcję.',
    sameLabel: 'Co się nie zmieniło',
    unchanged: [
      {
        dim: 'Kontekst',
        text: 'Nadal siedzi w czyjejś głowie, a nie w systemie. Agent widzi otwarte pliki, a nie graf zależności i intencji.',
      },
      {
        dim: 'Wykonanie',
        text: '45-minutowe CI zbudowane dla ludzi. Agent, który iteruje szybko, więcej czasu spędza na czekaniu na build niż na pisaniu kodu.',
      },
      {
        dim: 'Weryfikacja',
        text: 'Testy pisane przez tego samego agenta, który napisał kod. Coverage wygląda świetnie, bugi i tak trafiają na produkcję.',
      },
      {
        dim: 'Walidacja',
        text: "Review pull requestów wciąż czeka na tych samych seniorów. Przegląd specyfikacji i merge'a zmienia się w pusty rytuał.",
      },
    ],
    bridge: 'Zbudowaliśmy więc warstwę infrastruktury, której AI naprawdę potrzebuje.',
  },

  diagnosis: {
    label: 'Czym jest Visdom',
    title: 'Platforma do dostarczania oprogramowania w modelu AI-Native.',
    lead: 'Visdom to platforma AI-Native SDLC od VirtusLab. AI potrafi już napisać kod; trudność zaczyna się przy dowożeniu go w skali enterprise. Visdom składa system dostarczania wokół agenta (kontekst, code review, testy, governance, security i CI) w jeden nadzorowany pipeline, żeby wasza organizacja przestała pokazywać agenty na demach i zaczęła ich realnie używać na produkcji.',
    kicker: 'Co go definiuje:',
    pillars: [
      {
        key: 'Kompozytowalny',
        copy: 'Jedna platforma, kompozytowalne komponenty. Zacznijcie od dowolnego, rozszerzajcie we własnym tempie. Kontekst, code review, testy, governance, security i CI, razem albo osobno.',
      },
      {
        key: 'Nadzorowany',
        copy: 'Zmiany płyną przez jeden system, z egzekwowaniem polityk i ścieżką audytu, w której każda ingerencja zostawia ślad. Domknięta pętla, a nie szuflada z niepowiązanymi narzędziami.',
      },
      {
        key: 'Wasz',
        copy: 'Nasi inżynierowie wdrażają go w waszych repozytoriach, CI i infrastrukturze, a potem przekazują. Od tego momentu prowadzicie to sami. Nic nie opuszcza waszego środowiska.',
      },
    ],
    bridge: 'Tędy płynie zmiana.',
  },

  architecture: {
    label: 'Droga zmiany',
    title: 'Jedna architektura, end-to-end',
    subtitle: {
      lead: 'Context Fabric dostarcza agentowi kontekst systemu, kodu, organizacji i historii przez MCP, w obie strony i bez przerwy.',
      beforeLinks: 'Zmiana przechodzi następnie przez',
      testing: 'testy',
      review: 'wielopoziomowy code review',
      security: 'skanowanie bezpieczeństwa',
      afterLinks: 'i triage ryzyka;',
      tracing: 'Visdom AI Tracing',
      tail: 'podpisuje każdy krok.',
    },
    svgTitle:
      'Architektura Visdom: Context Fabric, Orchestrator, Coding Agent (Cursor, Claude, Codex), Testing, Code Review, skanowanie bezpieczeństwa przez Aikido, triage pull requestów i Visdom AI Tracing.',
    diagram: {
      sources: [
        'Jira',
        'Historia gita',
        'Komentarze z review',
        'Repozytoria',
        'Dokumentacja i ADR',
        'Ownerzy i on-call',
      ],
      fabric: 'Visdom Context Fabric',
      fabricTag: 'odpytywany na każdym etapie',
      orchestrator: 'Visdom Orchestrator',
      orchestratorSub: 'w oparciu o Visdom Machine Speed',
      preflight: ['Kontekst', 'preflight'] as [string, string],
      activeContext: ['Kontekst', 'aktywny'] as [string, string],
      agent: ['Coding', 'Agent'] as [string, string],
      sandbox: ['Visdom', 'Sandbox'] as [string, string],
      runsYourAgent: 'Wasz agent',
      testing: 'Visdom Testing',
      testLayers: [
        'Testy klasyczne',
        'Testy architektury',
        'Property-based',
        'Mutation testing',
      ],
      pullRequest: 'Pull Request',
      review: 'Visdom Code Review',
      reviewLevels: [
        { n: 'L1', label: 'Linting' },
        { n: 'L2', label: 'Reguły deterministyczne' },
        { n: 'L3', label: 'Jeden przebieg LLM' },
        { n: 'L4', label: 'Głęboki przegląd LLM' },
      ],
      security: 'Visdom Security',
      securityLayers: ['SAST i DAST', 'Zależności', 'Sekrety i IaC'],
      poweredBy: 'W oparciu o',
      triage: 'Triage',
      riskGate: 'Bramka ryzyka',
      autofix: 'zielone i trywialne: auto-fix → z powrotem do agenta',
      highRisk: 'Wysokie ryzyko',
      humanApproval: 'zgoda człowieka',
      approved: 'zaakceptowane',
      production: 'Produkcja',
      vault: 'Visdom AI Tracing',
    },
    captions: [
      {
        n: '01',
        t: 'Context Fabric',
        d: 'Tickety w Jirze, historia gita, stare dyskusje, zakopana dokumentacja: wszystko, co wie wasz zespół, spięte w jedno źródło, które agent może realnie odpytać.',
      },
      {
        n: '02',
        t: 'Orchestrator',
        d: 'Jeden orchestrator prowadzi całą maszynownię: preflight, coding agent, testy, review i triage ryzyka dzieją się w środku. Woła człowieka tylko wtedy, gdy wymaga tego ryzyko.',
      },
      {
        n: '03',
        t: 'Kontekst preflight',
        d: 'Żadnych zimnych startów. Zanim powstanie pierwsza linia kodu, agent wie już, co ma zrobić, kto za to odpowiada i gdzie są miny.',
      },
      {
        n: '04',
        t: 'Kontekst aktywny',
        d: 'Kto jest ownerem? Co się zepsuje, jeśli to zmienić? Agent pyta dalej, Fabric dalej odpowiada. Kontekst płynie bez przerwy.',
      },
      {
        n: '05',
        t: 'Warstwa testów',
        d: 'Agenty uwielbiają testy, które przechodzą. Tym bramkom to obojętne: reguły architektury, testy property-based i mutation testing pokazują to, co ukrywa zielone CI.',
      },
      {
        n: '06',
        t: 'Code review · VCR',
        d: 'VCR czyta każdy pull request w CI, zanim zrobi to człowiek: lint, sprawdzenia deterministyczne, potem przebiegi LLM, które wiedzą, jak naprawdę pisze się w waszym repo.',
      },
      {
        n: '07',
        t: 'Security',
        d: 'Aikido skanuje ten sam pull request: SAST, DAST, zależności, sekrety i IaC. Analiza osiągalności wycisza to, czego wasz kod nigdy nie wywołuje; realne znaleziska trafiają do bramki ryzyka.',
      },
      {
        n: '08',
        t: 'Triage',
        d: 'Nie każdy bug zasługuje na spotkanie. Bramka ocenia ścieżkę, diff i pokrycie: trywialne agent poprawia od ręki, ryzykowne trafiają do człowieka.',
      },
      {
        n: '09',
        t: 'Visdom AI Tracing',
        d: 'Prompty, decyzje i testy lądują w podpisanym rejestrze spiętym łańcuchem hashy. Kiedy pyta audytor, odpowiedź już istnieje.',
      },
      {
        n: '10',
        t: 'Wdrożenie na produkcję',
        d: 'Wszystkie bramki zielone. Zmiana wychodzi z kompletem dowodów: przetestowana, po review, po skanie bezpieczeństwa, z pełnym śladem w AI Tracing.',
      },
    ],
    stepAria: 'Pokaż krok {n}: {t}',
  },

  orchestrator: {
    label: 'Orchestrator',
    titleFirst: 'Jeden ticket na wejściu.',
    titleSecondBefore: 'Jeden',
    titleAccent: 'pull request',
    titleSecondAfter: 'na wyjściu.',
    subtitle:
      'Każdy krok to wyspecjalizowany agent. Wy nie widzicie z tego nic. Błędy z produkcji, tickety z Jiry, zdarzenia: sygnały wchodzą, orchestrator odwala czarną robotę przez te same bramki, które przed chwilą widzieliście, a człowiek zatwierdza tylko wtedy, gdy wymaga tego ryzyko.',
    signalsLabel: 'Sygnały przychodzące',
    signals: [
      { key: 'błąd na produkcji', title: 'usługa zaczyna się sypać' },
      { key: 'ticket w Jirze', title: 'bug ląduje w backlogu' },
      { key: 'security advisory', title: 'CVE trafia w zależność' },
    ],
    human: {
      name: 'Człowiek w pętli',
      idle: 'pod telefonem · każdy krok',
      ask: 'szybkie pytanie',
      answered: 'odpowiedź ✓',
      called: 'review na czerwono · decyduje',
      resolved: 'rozwiązane ✓',
    },
    hubName: 'Orchestrator',
    work: ['Context Fabric', 'testy', 'security', 'code review', 'deployment'],
    prTitle: 'Pull request',
    prMeta: 'wszystkie bramki zielone · pełny trace',
    captions: [
      'Sygnały napływają: błędy, tickety, zdarzenia, advisory.',
      'Orchestrator bierze jeden z nich i odwala czarną robotę.',
      'W trakcie pinguje człowieka: jedno szybkie pytanie, jedna odpowiedź.',
      'Code review na czerwono. Człowiek wraca do pętli.',
      'Review zielone, deployment gotowy. Wychodzi pull request.',
    ],
    ctaLine: 'Chcecie zobaczyć Orchestratora na waszym stacku?',
    ctaButton: 'Zobaczcie Visdom w akcji!',
  },

  useCases: {
    label: 'Orchestrator w akcji',
    titleBefore: 'Orchestrator bierze',
    titleAccent: 'nocną zmianę',
    subtitle:
      'Jeden orchestrator prowadzi każdy z powyższych przepływów end-to-end: obserwuje, koreluje, planuje i przygotowuje. Te same bramki, te same akceptacje, ta sama ścieżka audytu. Ludzie wchodzą tylko tam, gdzie liczy się osąd. Gdzie opłaca się to już pierwszego dnia:',
    cases: [
      {
        tag: 'Reakcja na incydent',
        title: 'Produkcja rzuca 500-kami o drugiej w nocy',
        steps: [
          { t: '02:14', d: 'Odpalają się alerty: skok liczby błędów na produkcji.' },
          {
            t: '02:31',
            d: 'Logi skorelowane, przyczyna wskazana, poprawka napisana i przepuszczona przez wszystkie bramki.',
          },
          { t: '08:00', d: 'Poranny standup ogląda zielony pull request z pełnym trace.' },
        ],
        outcome: 'Pull request, a nie ticket w Zendesku',
      },
      {
        tag: 'Polowanie na regresję',
        title: 'Liczba błędów na API podwaja się',
        steps: [
          { t: '11:02', d: 'API checkoutu zaczyna sypać się dwa razy częściej.' },
          {
            t: '11:04',
            d: 'Zdarzenia skorelowane między usługami; wskazany deploy, który to zepsuł.',
          },
          { t: '11:27', d: 'Proponowana poprawka czeka na jedno kliknięcie akceptacji.' },
        ],
        outcome: 'Przyczyna przed zwołaniem war roomu',
      },
      {
        tag: 'Odtworzenie buga',
        title: 'Klient trafia na ten sam bug drugi raz',
        steps: [
          { t: '14:50', d: 'Support eskaluje powracającą, trudną do namierzenia awarię.' },
          {
            t: '15:12',
            d: 'Odtworzona z logów i telemetrii; jest już czerwony test, który ją łapie.',
          },
          { t: '16:05', d: 'Poprawka wychodzi razem z testem regresyjnym.' },
        ],
        outcome: 'Odtworzone, naprawione, zabezpieczone na stałe',
      },
      {
        tag: 'Łatka bezpieczeństwa',
        title: 'CVE ląduje w kluczowej bibliotece',
        steps: [
          { t: '06:00', d: 'Nowa podatność w zależności, której używacie.' },
          {
            t: '06:18',
            d: 'Dotknięte komponenty zmapowane, zależność podbita, całość przepuszczona przez pełny zestaw bramek.',
          },
          { t: '07:02', d: 'Zweryfikowana aktualizacja czeka na merge.' },
        ],
        outcome: 'Załatane w godziny, nie w sprinty',
      },
      {
        tag: 'Migracja',
        title: 'Wycofywane API, używane w 214 miejscach',
        steps: [
          {
            t: '09:00',
            d: 'Framework oznacza API do usunięcia; wasze repo woła je wszędzie.',
          },
          {
            t: '09:30',
            d: 'Miejsca wywołań zmapowane, mechaniczne 95% zmigrowane, bramki uruchomione na każdej zmianie.',
          },
          {
            t: '11:45',
            d: 'Ludzie przeglądają sześć wywołań, które naprawdę wymagały osądu.',
          },
        ],
        outcome: '214 wywołań, sześć ludzkich decyzji',
      },
      {
        tag: 'Higiena CI',
        title: 'CI wywala się co trzeci przebieg',
        steps: [
          { t: '16:20', d: 'Flaky test zaczyna blokować co drugi merge.' },
          {
            t: '16:35',
            d: 'Test odizolowany, historia przeszukana bisectem, race condition namierzony.',
          },
          { t: '17:10', d: "Deterministyczna poprawka wchodzi; kolejka merge'y znów rusza." },
        ],
        outcome: 'Zestaw testów, któremu znów można ufać',
      },
    ],
  },

  solutions: {
    engagementLabel: 'Model współpracy',
    engagementTitle: 'Jak pracujemy',
    engagementSubtitle:
      'Cztery fazy, każda kolejna oparta na poprzedniej, każda kończąca się czymś, co działa i z czego da się korzystać. Dokładny zakres, tempo i skład zespołu ustalamy z wami przy każdym projekcie, nigdy ze sztywnego cennika.',
    phases: [
      {
        name: 'Faza 1: Assessment',
        meta: 'stały zakres',
        body: 'U was albo zdalnie. Przepuszczamy wasze środowisko przez Visdom Maturity Matrix i zostawiamy roadmapę uporządkowaną priorytetami, wskazany zespół pilotażowy i zakres kolejnej fazy. Po waszej stronie to niewielkie zaangażowanie. Jeśli chcecie się tu zatrzymać, zostajecie z roadmapą i bez żadnych zobowiązań.',
      },
      {
        name: 'Faza 2: Wdrożenie pilotażowe',
        meta: 'stały zakres',
        body: 'Jeden zespół pilotażowy. Komponenty, które mają znaczenie, wdrożone w wasze SCM, CI, IdP i stack obserwowalności. Mały zespół naszych inżynierów pracuje ramię w ramię z waszym AI championem i zespołem platformowym. Runbooki, ADR-y i kod integracyjny powstają wspólnie od pierwszego dnia. Nie jako obserwatorzy, tylko jako właściciele.',
      },
      {
        name: 'Faza 3: Skalowanie i rozwój',
        meta: 'doradztwo',
        body: 'Skalowanie idzie w dwie strony: w pionie, gdy dochodzą kolejne komponenty, i w poziomie, gdy adopcja rozlewa się na kolejne zespoły i szerszą organizację. Komponenty są utwardzane i rozwijane wraz z tym zasięgiem, a przeglądy architektury, trudne decyzje i niewygodne wyjątki przerabiamy razem.',
      },
      {
        name: 'Faza 4: Wsparcie',
        meta: 'ciągłe',
        body: 'Stała współpraca po przekazaniu, a nie pozycja na liście płac. Zostajemy dostępni przy przeglądach architektury, trudnych decyzjach i kolejnym kroku dojrzałości, na warunkach przewidywalnych dla finansów i elastycznych dla inżynierii.',
      },
    ],
    transferAria: 'Przekazywanie odpowiedzialności w kolejnych fazach współpracy',
    transfer: [
      { label: 'Faza 1', strong: 'VirtusLab prowadzi' },
      { label: 'Faza 2', strong: 'Ścisła współpraca' },
      { label: 'Faza 3', strong: 'Wdrożenie w skali' },
      { label: 'Faza 4', strong: 'Zostajemy pod telefonem' },
    ],

    platformLabel: 'Komponenty platformy',
    platformTitle: 'Platforma, którą przynosimy',
    platformSubtitle:
      'Jeden kręgosłup: Context Fabric. Code review, testy, security i governance czytają to samo źródło prawdy, więc agenty i reviewerzy odpowiadają na te same pytania tak samo. Zespoły zatrudniają nas właśnie do tego: żeby je złożyć, utwardzić i wpiąć w regulowany stack enterprise.',
    readReference: 'Przeczytajcie dokumentację',

    fabric: {
      title: 'Visdom Context Fabric',
      body: 'Context Fabric dostarcza dopasowany kontekst waszym agentom planującym, kodującym i robiącym review. Agent za każdym razem mniej szuka, a przy okazji dostaje informacje, do których bez szerszego obrazu zwykle nie ma dostępu.',
      note: 'Deterministyczna wiedza o kodzie, analiza blast radius i grafy własności przez MCP.',
      readLink: 'Przeczytajcie: „Your README Is a Lie”',
      diagramAria:
        'Visdom Context Fabric zbiera dane z repozytoriów, dokumentacji, ticketów i CI, a potem udostępnia deterministyczne źródło prawdy, które komponenty Coding Agent, Code Review i Testing czytają przez MCP',
      sourcesLabel: 'Źródła',
      sources: [
        { name: 'Repozytorium git', meta: 'kod · historia · blame' },
        { name: 'Confluence / Notion', meta: 'ADR-y · runbooki' },
        { name: 'Jira / Linear', meta: 'tickety · własność' },
        { name: 'CI / Actions', meta: 'buildy · artefakty' },
        { name: 'CLAUDE.md / reguły', meta: 'konwencje' },
      ],
      coreName: 'Context Fabric',
      coreDesc: 'Zbieranie · normalizacja · indeksowanie źródła prawdy organizacji.',
      outputsLabel: 'Komponenty, które to czytają',
      outputs: [
        { name: 'Coding Agent', meta: 'kontekst · konwencje' },
        { name: 'Code Review', meta: 'własność · blast radius' },
        { name: 'Testing', meta: 'konwencje · ryzyko' },
      ],
      outputsNote: 'Każdy komponent Visdom czyta to samo źródło prawdy.',
    },

    review: {
      title: 'Visdom Code Review',
      abbr: 'VCR',
      body: 'Code Review robi automatyczny wstępny przegląd pull requestów pisanych przez AI i przez ludzi. Weryfikując zmiany względem konwencji inżynierskich, wzorców ryzyka i znanych klas błędów, pozwala reviewerom skupić się tam, gdzie to naprawdę ważne.',
      diagramAria: 'Wielopoziomowy code review wewnątrz pull requesta, z triage ryzyka',
      prTag: 'Pull request',
      panelHead: 'Visdom Code Review',
      levels: [
        { n: 'L1', label: 'Linting' },
        { n: 'L2', label: 'Reguły deterministyczne' },
        { n: 'L3', label: 'Jeden przebieg LLM' },
        { n: 'L4', label: 'Głęboki przegląd LLM' },
      ],
      triageHead: 'Triage',
      riskGate: 'Bramka ryzyka',
      human: 'Człowiek w pętli',
    },

    testing: {
      title: 'Visdom Testing',
      body: 'Testing wprowadza warstwy walidacji wykraczające poza klasyczne testy jednostkowe i metryki pokrycia. Łącząc testy architektury, testy property-based i mutation testing, wykrywa defekty, które konwencjonalne podejścia zwykle przepuszczają.',
      note: 'Kształt testów dopasowany do waszej architektury, z bramkami architektonicznymi, które nie pozwalają AI odpłynąć.',
      diagramAria:
        'Techniki Visdom Testing: testy klasyczne, testy architektury, property-based i mutation testing',
      panelHead: 'Visdom Testing',
      techniques: [
        'Testy klasyczne',
        'Testy architektury',
        'Property-based',
        'Mutation testing',
      ],
    },

    tracing: {
      title: 'Visdom AI Tracing',
      body: 'Rejestruje interakcje z AI w całym cyklu dostarczania oprogramowania, egzekwuje polityki i prowadzi ścieżkę audytu, w której każda ingerencja zostawia ślad. Czarna skrzynka dla systemów AI: rozliczalność i pełny wgląd.',
      noteStrong: 'Rekordy podpisane Ed25519, spięte łańcuchem hashy',
      noteRest:
        'z atrybucją AI linia po linii, zmapowane na EU AI Act, SR 11-7, SOX, PCI-DSS i DORA.',
      capabilities: [
        {
          label: 'Trace',
          desc: 'Ślady sesji, zużycie tokenów, wywołania narzędzi, maskowanie sekretów',
        },
        { label: 'Enforce', desc: 'Allowlisty modeli, ochrona ścieżek, budżety tokenów' },
        {
          label: 'Audit',
          desc: 'Podpisy Ed25519, rekordy w łańcuchu hashy, SOX/PCI-DSS',
        },
        {
          label: 'Evaluate',
          desc: 'Automatyczna ewaluacja, rozkład modeli, wzorce adopcji',
        },
        { label: 'Attribute', desc: 'Atrybucja kodu AI linia po linii przez tree-sitter' },
      ],
    },

    security: {
      title: 'Visdom Security',
      body: 'Security stawia bariery ochronne wokół waszych agentów i procesów dostarczania. Agenty mogą działać bezpiecznie, z kontrolowanym dostępem do systemów, poświadczeń i zasobów, a generowane zmiany są na bieżąco weryfikowane względem polityk bezpieczeństwa.',
      notePoweredBy: 'W oparciu o',
      noteSandbox: 'Visdom Sandbox',
      noteContainment: '(izolacja) i',
      noteAikido: 'Aikido',
      noteRest:
        '(AppSec): efemeryczne, odizolowane sandboxy z ograniczonymi poświadczeniami i allowlistami ruchu wychodzącego, plus skanowanie oparte na osiągalności, zbudowane pod workflow agentowe.',
      diagramAria:
        'Visdom Sandbox uruchamia agenta w izolacji; przez egress przechodzi tylko zatwierdzony ruch, więc dane zostają w środku, a produkcja jest nieosiągalna',
      caption: 'Dwie warstwy, jeden model ochrony.',
      sandboxHead: 'Visdom Sandbox · izolacja runtime',
      agentTag: 'Agent',
      agentDesc: 'odizolowany efemeryczny sandbox · uruchom · testuj · iteruj',
      egressOk: 'przez egress przechodzą: rejestry pakietów · API modeli',
      egressNo: 'wasze dane · sekrety · produkcja → 403',
      secretsNote:
        'Prawdziwe sekrety zostają poza sandboxem, wstrzykiwane tylko przy zatwierdzonych wywołaniach.',
      aikidoHead: 'Aikido · skanowanie AppSec',
      aikidoNote: 'Każda zmiana od agenta jest skanowana przed mergem:',
      chips: ['SAST · kod', 'SCA · zależności', 'DAST · API', 'Sekrety', 'IaC · chmura'],
      reachability: 'triage osiągalności pokazuje tylko realnie eksploatowalne znaleziska',
    },

    machineCi: {
      title: 'Visdom Machine CI',
      badge: 'Wkrótce',
      body: "Machine CI to continuous integration zoptymalizowane pod dostarczanie oprogramowania w modelu AI-Native. Skracając czasy buildów i pętle feedbacku, pozwala agentom działać w maszynowym tempie, bez ograniczeń klasycznych pipeline'ów CI.",
      builtOn: 'Zbudowane na',
      readLink: 'Przeczytajcie: „The Ferrari Engine in a Fiat 500”',
      metrics: [
        {
          label: 'Skrócenie czasu buildu',
          note: 'Globalna logistyka, monorepo Scala, sbt -> Bazel. 40-60 min -> 5 min.',
        },
        {
          label: 'Czas do merge pull requesta',
          note: 'Bank inwestycyjny, monorepo Scala, zarządzane środowisko IntelliJ IDEA.',
        },
        {
          label: 'Tempo iteracji agenta (cel)',
          note: "Docelowe tempo dla coding agentów, czyli to, za czym muszą nadążyć dzisiejsze pipeline'y.",
        },
      ],
      footnoteBefore: 'Nazwy klientów objęte NDA. Pełne opisy w',
      footnoteLink: 'success stories',
      footnoteAfter: 'VirtusLab.',
    },
  },

  results: {
    label: 'Dorobek',
    title: 'Doświadczenie stojące za Visdom',
    subtitleBefore:
      'To są własne wyniki VirtusLab z budowania narzędzi platformowych i optymalizacji dostarczania, a nie metryki produktu Visdom. Na tym go budujemy. Klienci objęci NDA, pełne opisy w',
    subtitleLink: 'success stories',
    subtitleAfter: 'VirtusLab.',
    items: [
      {
        headline: 'krótszy czas do merge pull requesta',
        client: 'dla wiodącego banku inwestycyjnego',
        detail: 'Monorepo Scala, zarządzane rozwiązanie IntelliJ IDEA.',
      },
      {
        headline: 'mniej podów dla pojedynczego workloadu',
        client: 'dla globalnego lidera branży hotelarskiej',
        detail: 'Dopasowanie rozmiaru workloadów w całej platformie.',
      },
      {
        headline: 'krótsze czasy buildu',
        client: 'dla globalnego spedytora',
        detail: 'Monorepo Scala zmigrowane z sbt na Bazel, z 40-60 min do około 5 min.',
      },
    ],
    photoAlt:
      'Inżynierowie VirtusLab na konferencji o infrastrukturze AI, w koszulkach Can Your AI Agents Actually Ship.',
    photoCaption: 'W terenie, na Visdom AI Tour.',
  },

  builtBy: {
    title: 'Zbudowane przez VirtusLab',
    body: 'Inżynierowie VirtusLab od ponad dekady pomagają organizacjom rozwiązywać problemy z dostarczaniem oprogramowania i produktywnością zespołów w dużej skali. Utrzymujemy kluczową infrastrukturę open source (toolchain Scali, Metals, Scala CLI), współtworzymy ekosystem JVM i budujemy narzędzia produkcyjne tam, gdzie pomyłka drogo kosztuje.',
    stats: [
      { value: '15+', label: 'lat na rynku' },
      { value: '500', label: 'inżynierów' },
      { value: 'Open Source', label: 'w DNA' },
      { value: 'Scala i JVM', label: 'core contributors' },
    ],
  },

  partners: {
    badge: 'partnerstwa i technologie',
    title: 'Sprawdzeni w całym nowoczesnym stacku.',
    body: 'VirtusLab utrzymuje głębokie partnerstwa techniczne z narzędziami i platformami, na których stoi nowoczesna inżynieria w skali. Aktywnie współtworzymy te ekosystemy i wnosimy praktyczne doświadczenie do organizacji, które modernizują dostarczanie oprogramowania i operacje inżynierskie.',
    cta: 'Zobaczcie Visdom w akcji!',
    gridAria: 'Narzędzia i platformy, z którymi VirtusLab współpracuje',
  },

  writing: {
    label: 'Piszemy otwarcie',
    title: 'Pracujemy otwarcie i dzielimy się tym, czego się uczymy.',
    subtitle:
      '50+ artykułów w trzech seriach, pisanych przez inżynierów, którzy budują AI-native SDLC, publikowanych otwarcie dla szerszej społeczności.',
    latestLabel: 'Najnowsze',
    linkLabel: 'Przeczytajcie najnowszy artykuł',
    series: [
      {
        description: 'Notatki z pola o AI-Native SDLC: kontekst, CI, code review i governance.',
      },
      { description: 'Co obserwujemy na GitHubie i dlaczego to ma znaczenie.' },
      { description: 'Techniczna analiza modeli, systemów i wzorców inżynierskich.' },
    ],
  },

  maturity: {
    aria: 'Model dojrzałości',
    label: 'Model dojrzałości',
    title: 'AI Maturity Matrix',
    lead: 'Framework, którym określamy zakres każdego projektu. Pokazuje, gdzie wasz SDLC stoi dzisiaj i co powinny objąć pierwsze dwa tygodnie.',
    shotAria: 'Otwórzcie AI Maturity Matrix',
    shotAlt:
      'AI Maturity Matrix dla obszaru Development: kompetencje ocenione na pięciu poziomach od Ad-hoc do Autonomous, z L4 Optimized jako celem.',
    shotHint: 'Zobaczcie macierz na żywo',
    ladder: {
      heading: 'Gdzie stoi wasza organizacja?',
      lead: 'Visdom Maturity Matrix mapuje 60 praktyk w 4 perspektywach i na 5 poziomach dojrzałości.',
      levels: [
        { id: 'L1', name: 'Ad-hoc' },
        { id: 'L2', name: 'Guided' },
        { id: 'L3', name: 'Systematic' },
        { id: 'L4', name: 'Optimized' },
        { id: 'L5', name: 'Autonomous' },
      ],
      perspectives: ['Development', 'Delivery', 'Organization', 'Infrastructure'],
      assessmentCta: 'Zróbcie self-assessment',
      matrixCta: 'Zobaczcie pełną macierz',
    },
    publicationAria: 'Publikacja towarzysząca AI Maturity Matrix',
    publicationLabel: 'Lektura uzupełniająca',
    publicationLevel: 'L4 · Optimized',
    publicationTitle: 'AI Works Great. At Level Four.',
    publicationBlurb:
      'Teza stojąca za Matrixem: dlaczego AI dowozi to, co obiecuje, dopiero gdy infrastruktura wokół niego osiągnie L4, i czego trzeba, żeby tam dojść.',
    publicationCta: 'Przeczytajcie artykuł',
  },

  cta: {
    label: 'Następny krok',
    title: 'Odpuśćmy prezentację. Zacznijmy od kodu.',
    subtitle:
      'Najszybszy sposób, żeby sprawdzić, czy możemy pomóc, to 30-minutowa rozmowa z inżynierami, którzy to zbudowali. Jeśli pasujemy do siebie, wspólnie ustalamy zakres Assessmentu. Jeśli nie, wychodzicie z linkami do naszych tekstów inżynierskich i do Matrixa.',
    form: {
      title: 'Umówcie sesję roboczą',
      body: '30 minut ze staff engineerem. Napiszcie, nad czym pracujecie, a przyjdziemy przygotowani z jednym wzorcem, który u was najszybciej zrobi różnicę.',
      nameLabel: 'Imię i nazwisko',
      companyLabel: 'Firma',
      emailLabel: 'E-mail służbowy',
      messageLabel: 'Co próbujecie dowieźć?',
      optional: 'opcjonalne',
      submit: 'Zobaczcie Visdom w akcji!',
      sending: 'Wysyłam...',
      success: 'Dzięki. Inżynier odpowie w ciągu jednego dnia roboczego, a potwierdzenie jest już w drodze na wasz e-mail.',
      error: 'Nie udało się wysłać. Spróbujcie ponownie albo napiszcie na visdom@virtuslab.com.',
      errorRef: 'Numer zgłoszenia:',
      errorFallback: 'Napiszcie na visdom@virtuslab.com',
    },
    alt: {
      lead: 'Jeszcze nie na rozmowę?',
      matrix: 'Przejdźcie Matrix sami',
      writing: 'Poczytajcie nasze teksty inżynierskie',
    },
    footnoteBefore: 'Wolicie zwykłego maila?',
    footnoteAfter: 'Odpowiada inżynier, w ciągu jednego dnia roboczego.',
  },

  footer: {
    poweredBy: 'Tworzone przez VirtusLab',
    links: [
      { label: 'VirtusLab' },
      { label: 'GitHub' },
      { label: 'Blog' },
      { label: 'Kontakt' },
    ],
  },
} satisfies typeof en;

export default pl;
