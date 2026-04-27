'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const translations = {
  cs: {
    dlTopbarLong: 'Ke stažení: půdorysy, technická dokumentace, rozbor vody a další podklady k nemovitosti',
    dlTopbarShort: 'Dokumentace ke stažení',
    navStory: 'Příběh',
    navInterior: 'Interiér',
    navExterior: 'Exteriér',
    navContact: 'Kontakt',
    heroSubtitle: 'S výhledem, co se neokouká',
    heroSub2: 'Hektar vlastního světa',
    typewriterPhrase: 'Chci vidět více',
    introLabel: 'O rezidenci',
    introTitle: 'Každý výjimečný dům\nmá svůj příběh',
    introP1: 'Rezidence Pavlov není běžný rodinný dům. Je to místo s duší, které prošlo pečlivou rekonstrukcí a proměnilo se v rezidenci nad Mohelnicí s výhledem na Bouzov, Úsov a Praděd.',
    introQuote: '„Nezáleží jen na tom, kolik stojí,\nale jakou hodnotu nabízí.“',
    introP2: 'Od prvních vizí přes měsíce rekonstrukce až po finální podobu — každý detail nese otisk péče a lásky k tomuto místu. Pojďte nahlédnout do příběhu, který čeká na další kapitolu.',
    statLabel1: 'm² pozemku',
    statLabel2: 'soukromí',
    statLabel3: 'hektar vlastního světa',
    statLabel4: 'výhled do krajiny',
    storyLabel: 'Příběh rezidence',
    storyTitle: 'Od vize k realitě',
    ch1num: 'Kapitola I', ch1title: 'Vize a místo',
    ch1desc: 'Všechno začalo nalezením výjimečné lokace — kopec nad Mohelnicí s panoramatickým výhledem na Bouzov, Úsov a Praděd. Místo, kde se rodí klid a absolutní soukromí. Hektar vlastního světa čekající na svůj příběh.',
    ch2num: 'Kapitola II', ch2title: 'Rekonstrukce s duší',
    ch2desc: 'Kompletní rekonstrukce proměnila dům v rezidenci s jedinečným charakterem. Ruční zpracování detailů, patinované dveře, autorské povrchy stěn a pečlivě zvolené materiály. Každá místnost dostala vlastní identitu.',
    ch3num: 'Kapitola III', ch3title: 'Srdce domova',
    ch3desc: 'Zakázková dubová kuchyně s žulovým pultem a industriálním osvětlením se stala srdcem celého domu. Otevřený prostor propojený s obývací částí vytváří velkorysý společenský prostor pro rodinu i přátele.',
    ch4num: 'Kapitola IV', ch4title: 'Prostor pro život',
    ch4desc: 'Obývací část s přímým vstupem na zahradu a velkoformátovými okny je zaplavená denním světlem. Celek plynule propojuje kuchyni, jídelnu i relaxační zónu do harmonického a funkčního uspořádání.',
    ch5num: 'Kapitola V', ch5title: 'Soukromý svět',
    ch5desc: 'Ložnice s dekorativní kamennou stěnou a tapetou inspirovanou středomořím. Každý pokoj je originál, kde se prolíná útulnost s uměním, a kde se každé ráno probouzíte s výhledem do zeleně.',
    ch6num: 'Kapitola VI', ch6title: 'Technologie a zázemí',
    ch6desc: 'Za klidem tohoto místa stojí promyšlené technické řešení, které zajišťuje komfort i dlouhodobou soběstačnost. Tepelné čerpadlo Daikin s klimatizací udržuje příjemnou teplotu po celý rok. Vlastní vrt o hloubce 90 metrů zajišťuje kvalitní měkkou vodu, doplněnou o zásobník a filtraci. Odpadní vody jsou řešeny moderní čističkou (ČOV) s možností dalšího využití. Technologie byly instalovány v rámci rekonstrukce a jsou pravidelně servisovány.',
    ch7num: 'Kapitola VII', ch7title: 'Víceúčelový prostor',
    ch7desc: 'Velkorysých 77 m², které se přizpůsobí tomu, jak chcete žít. Nejen třeba garáž, ale i místo pro pohyb, odpočinek i každodenní provoz — se saunou, zázemím pro cvičení, kuchyňkou i posezením. Prostor, který může být zázemím domu, domácí posilovnou i místem pro setkávání.',
    ch8num: 'Kapitola VIII', ch8title: 'Rezidence dnes',
    ch8desc: 'Dnes je Rezidence Pavlov ve fázi, kdy to nejnáročnější je za námi. Zásadní rekonstrukce byla provedena s důrazem na kvalitu a dlouhodobou hodnotu, takže budoucí majitel se už může soustředit na to nejpříjemnější – dotvořit si prostor podle vlastních představ.',
    imageBreakSub: 'Rezidence ve čtyřech ročních obdobích',
    imageBreakTitle: 'Výhled, který nikdy neomrzí',
    interiorLabel: 'Interiér',
    interiorTitle: 'Nahlédněte dovnitř',
    r1sub: 'Srdce domova', r1title: 'Kuchyně',
    r2sub: 'Prostor pro život', r2title: 'Obývací pokoj',
    r3sub: 'Každý detail s péčí', r3title: 'Chodby a vstupy',
    r4sub: 'Klid a soukromí', r4title: 'Ložnice s příběhem',
    r5sub: 'Autorský design', r5title: 'Koupelna',
    r6sub: 'Místo pro myšlenky', r6title: 'Pracovna',
    r7sub: 'Funkční detail', r7title: 'Toaleta',
    r8sub: 'Pro vzácné hosty', r8title: 'Hostinský pokoj',
    r9sub: 'Vlastní zázemí', r9title: 'Hostinská koupelna',
    r10sub: 'Moderní technologie', r10title: 'Technická místnost',
    prev: 'Předchozí', next: 'Další',
    exteriorLabel: 'Exteriér',
    exteriorTitle: 'Hektar vlastního světa',
    lifestyleLabel: 'Epilog',
    lifestyleTitle: 'Domov pro váš příběh',
    lifestyleP: 'Rozhodnutí o koupi u výjimečných nemovitostí vzniká emocí, ne tabulkou metrů čtverečních. Rezidence Pavlov čeká na svého správného kupce — na další kapitolu svého příběhu.',
    contactLabel: 'Kontakt',
    contactTitle: 'Napište další kapitolu',
    contactExclusive: 'Exkluzivní zastoupení',
    contactInquiry: 'Nezávazná poptávka',
    formName: 'Jméno a příjmení',
    formPhone: 'Telefon',
    formMessage: 'Vaše zpráva...',
    formSubmit: 'Odeslat zprávu',
    formSending: 'Odesílám...',
    formSuccess: 'Děkujeme! Vaše zpráva byla odeslána. Ozveme se vám co nejdříve.',
    formError: 'Omlouváme se, zprávu se nepodařilo odeslat. Zkuste to prosím znovu nebo nás kontaktujte telefonicky.',
    footer: 'Všechna práva vyhrazena.',
    dlPanelLabel: 'Dokumentace',
    dlPanelTitle: 'Ke stažení',
    dlPanelDesc: 'Technická dokumentace, půdorysy a podklady k nemovitosti.',
    dlZipBtn: 'Stáhnout vše (ZIP)',
    dlGateLabel: 'Dokumenty ke stažení',
    dlGateTitle: 'Zadejte e-mail',
    dlGateDesc: 'Pošleme vám potvrzení a budeme vás informovat o aktualizacích dokumentace.',
    dlGateEmailPlaceholder: 'Váš e-mail',
    dlGateBtn: 'Stáhnout',
    dlGateSending: 'Odesílám...',
    dlGateSuccess: 'Hotovo! Stahování začíná.',
    dlGateError: 'Nepodařilo se odeslat. Zkuste to prosím znovu.',
    docs: ['Půdorys','Řez','Pohledy','Základy','Krov vazníkový','Situační výkres','Zaměření pozemku','Rozbor vody z vlastní studny','PENB','Souhrnná technická zpráva','Dokumentace skutečného provedení stavby'],
    ytLabel: 'Prohlídka rezidence',
    ytClose: 'Zavřít video',
    close: 'Zavřít',
  },
  en: {
    dlTopbarLong: 'Downloads: floor plans, technical documentation, water analysis and other property documents',
    dlTopbarShort: 'Documentation downloads',
    navStory: 'Story',
    navInterior: 'Interior',
    navExterior: 'Exterior',
    navContact: 'Contact',
    heroSubtitle: 'With a view that never gets old',
    heroSub2: 'A hectare of your own world',
    typewriterPhrase: 'I want to see more',
    introLabel: 'About the residence',
    introTitle: 'Every exceptional home\nhas its own story',
    introP1: 'Rezidence Pavlov is no ordinary family home. It is a place with a soul — thoughtfully restored and transformed into a residence above Mohelnice with panoramic views of Bouzov, Úsov, and Praděd.',
    introQuote: '“It’s not just about the price,\nbut about the value it offers.”',
    introP2: 'From the first visions through months of reconstruction to its final form — every detail carries the imprint of care and love for this place. Come and discover the story that awaits its next chapter.',
    statLabel1: 'm² of land',
    statLabel2: 'privacy',
    statLabel3: 'hectare of your own world',
    statLabel4: 'panoramic view',
    storyLabel: 'Story of the residence',
    storyTitle: 'From vision to reality',
    ch1num: 'Chapter I', ch1title: 'Vision & Location',
    ch1desc: 'It all began with finding an exceptional location — a hilltop above Mohelnice with a panoramic view of Bouzov, Úsov and Praděd. A place where calm and absolute privacy are born. A hectare of your own world awaiting its story.',
    ch2num: 'Chapter II', ch2title: 'A Soulful Renovation',
    ch2desc: 'A complete renovation transformed the house into a residence with a unique character. Hand-crafted details, patinated doors, original wall finishes and carefully chosen materials. Every room was given its own identity.',
    ch3num: 'Chapter III', ch3title: 'Heart of the Home',
    ch3desc: 'A custom oak kitchen with a granite countertop and industrial lighting became the heart of the entire house. The open-plan space connected to the living area creates a generous social space for family and friends.',
    ch4num: 'Chapter IV', ch4title: 'Space for Living',
    ch4desc: 'The living area with direct garden access and floor-to-ceiling windows is flooded with natural light. The layout seamlessly connects the kitchen, dining room, and relaxation zone into a harmonious and functional arrangement.',
    ch5num: 'Chapter V', ch5title: 'A Private World',
    ch5desc: 'Bedrooms with decorative stone walls and Mediterranean-inspired wallpaper. Every room is an original, where cosiness meets art, and where each morning you wake to views of greenery.',
    ch6num: 'Chapter VI', ch6title: 'Technology & Infrastructure',
    ch6desc: 'Behind the calm of this place lies a well-designed technical setup that ensures comfort and long-term self-sufficiency. A Daikin heat pump with air conditioning maintains a pleasant temperature year-round. A private borehole 90 metres deep provides quality soft water, supplemented by a storage tank and filtration. Wastewater is handled by a modern treatment plant (ČOV) with options for further use. All systems were installed during the renovation and are regularly serviced.',
    ch7num: 'Chapter VII', ch7title: 'Multi-Purpose Space',
    ch7desc: 'A generous 77 m² that adapts to the way you want to live. Not just a garage — but a place for movement, relaxation and daily routines, featuring a sauna, a workout area, a kitchenette and a lounge. A space that can serve as a home base, a private gym, or a place for gatherings.',
    ch8num: 'Chapter VIII', ch8title: 'The Residence Today',
    ch8desc: 'Today, Rezidence Pavlov is at a stage where the most demanding work is behind us. The major renovation was carried out with an emphasis on quality and long-term value, so the future owner can focus on the most enjoyable part — finishing the space according to their own vision.',
    imageBreakSub: 'The residence through four seasons',
    imageBreakTitle: 'A view that never gets old',
    interiorLabel: 'Interior',
    interiorTitle: 'Take a look inside',
    r1sub: 'Heart of the home', r1title: 'Kitchen',
    r2sub: 'Space for living', r2title: 'Living room',
    r3sub: 'Every detail with care', r3title: 'Hallways & entrances',
    r4sub: 'Peace and privacy', r4title: 'Bedroom with a story',
    r5sub: 'Original design', r5title: 'Bathroom',
    r6sub: 'A place for thought', r6title: 'Study',
    r7sub: 'Functional detail', r7title: 'WC',
    r8sub: 'For special guests', r8title: 'Guest room',
    r9sub: 'Private facilities', r9title: 'Guest bathroom',
    r10sub: 'Modern technology', r10title: 'Utility room',
    prev: 'Previous', next: 'Next',
    exteriorLabel: 'Exterior',
    exteriorTitle: 'A hectare of your own world',
    lifestyleLabel: 'Epilogue',
    lifestyleTitle: 'A home for your story',
    lifestyleP: 'The decision to buy an exceptional property is made with emotion, not a spreadsheet of square metres. Rezidence Pavlov is waiting for its rightful owner — for the next chapter of its story.',
    contactLabel: 'Contact',
    contactTitle: 'Write the next chapter',
    contactExclusive: 'Exclusive representation',
    contactInquiry: 'Non-binding inquiry',
    formName: 'Full name',
    formPhone: 'Phone',
    formMessage: 'Your message...',
    formSubmit: 'Send message',
    formSending: 'Sending...',
    formSuccess: 'Thank you! Your message has been sent. We will get back to you as soon as possible.',
    formError: 'Sorry, your message could not be sent. Please try again or contact us by phone.',
    footer: 'All rights reserved.',
    dlPanelLabel: 'Documentation',
    dlPanelTitle: 'Downloads',
    dlPanelDesc: 'Technical documentation, floor plans and property documents.',
    dlZipBtn: 'Download all (ZIP)',
    dlGateLabel: 'Documents for download',
    dlGateTitle: 'Enter your email',
    dlGateDesc: 'We will send you a confirmation and keep you informed about documentation updates.',
    dlGateEmailPlaceholder: 'Your email',
    dlGateBtn: 'Download',
    dlGateSending: 'Sending...',
    dlGateSuccess: 'Done! Your download is starting.',
    dlGateError: 'Could not send. Please try again.',
    docs: ['Floor plan','Cross-section','Elevations','Foundations','Truss roof','Site plan','Land survey','Well water analysis','Energy performance certificate','Summary technical report','As-built documentation'],
    ytLabel: 'Property tour',
    ytClose: 'Close video',
    close: 'Close',
  },
} as const;

type Lang = keyof typeof translations;

const docFiles = [
  '/documents/pudorys.pdf',
  '/documents/rez.pdf',
  '/documents/pohledy.pdf',
  '/documents/zaklady.pdf',
  '/documents/krov-vaznikovy.pdf',
  '/documents/situacni-vykres.pdf',
  '/documents/zamereni-pozemku.pdf',
  '/documents/rozbor-vody.pdf',
  '/documents/penb.pdf',
  '/documents/souhrna-technicka-zprava.pdf',
  '/documents/dokumentace-stavby.pdf',
];

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
);

export default function Home() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [ytExpanded, setYtExpanded] = useState(false);
  const [lang, setLang] = useState<Lang>('cs');
  const langRef = useRef<Lang>('cs');
  const galleryRef = useRef<string[]>([]);

  useEffect(() => { langRef.current = lang; }, [lang]);

  const tr = translations[lang];

  const openLightbox = useCallback((src: string) => {
    if (galleryRef.current.length === 0) {
      const imgs = document.querySelectorAll('#interior img, #exterior img');
      galleryRef.current = Array.from(imgs).map(img => (img as HTMLImageElement).src);
    }
    const idx = galleryRef.current.findIndex(s => s.endsWith(src.replace(/^.*\/images\//, '/images/')));
    setLightboxIdx(idx >= 0 ? idx : 0);
  }, []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const lightboxPrev = useCallback(() => setLightboxIdx(i => i !== null ? (i - 1 + galleryRef.current.length) % galleryRef.current.length : null), []);
  const lightboxNext = useCallback(() => setLightboxIdx(i => i !== null ? (i + 1) % galleryRef.current.length : null), []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const scrollLineRef = useRef<HTMLSpanElement>(null);
  const scrollTypedRef = useRef<HTMLDivElement>(null);
  const scrollTypedTextRef = useRef<HTMLSpanElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const formBtnRef = useRef<HTMLButtonElement>(null);
  const formMsgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, closeLightbox, lightboxPrev, lightboxNext]);

  useEffect(() => {
    // ── Header scroll ──
    const header = headerRef.current;
    const onScroll = () => {
      header?.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Mobile menu ──
    let scrollPos = 0;
    const toggle = menuToggleRef.current;
    const nav = navRef.current;

    function openMenu() {
      scrollPos = window.scrollY;
      toggle?.classList.add('active');
      nav?.classList.add('active');
      document.body.classList.add('menu-open');
      document.body.style.top = `-${scrollPos}px`;
    }
    function closeMenu() {
      toggle?.classList.remove('active');
      nav?.classList.remove('active');
      document.body.classList.remove('menu-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollPos);
    }

    toggle?.addEventListener('click', () => {
      nav?.classList.contains('active') ? closeMenu() : openMenu();
    });
    nav?.querySelectorAll('a').forEach((l) => l.addEventListener('click', closeMenu));

    // ── Scroll reveal ──
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .tl-item').forEach((el) => {
      observer.observe(el);
    });

    // ── Download panel ──
    const dlTrigger = document.getElementById('dlTrigger');
    const dlPanel = document.getElementById('dlPanel');
    const dlOverlay = document.getElementById('dlOverlay');
    const dlClose = document.getElementById('dlClose');
    let dlScrollPos = 0;

    function openDl() {
      dlScrollPos = window.scrollY;
      dlPanel?.classList.add('open');
      dlOverlay?.classList.add('open');
      document.body.classList.add('menu-open');
      document.body.style.top = `-${dlScrollPos}px`;
    }
    function closeDl() {
      dlPanel?.classList.remove('open');
      dlOverlay?.classList.remove('open');
      document.body.classList.remove('menu-open');
      document.body.style.top = '';
      window.scrollTo(0, dlScrollPos);
    }

    dlTrigger?.addEventListener('click', openDl);
    dlClose?.addEventListener('click', closeDl);
    dlOverlay?.addEventListener('click', closeDl);

    // ── Download gate ──
    const gateOverlay = document.getElementById('dlGateOverlay');
    const gateForm = document.getElementById('dlGateForm') as HTMLFormElement | null;
    const gateEmailInput = document.getElementById('dlGateEmail') as HTMLInputElement | null;
    const gateBtn = document.getElementById('dlGateBtn') as HTMLButtonElement | null;
    const gateMsg = document.getElementById('dlGateMsg');
    const gateClose = document.getElementById('dlGateClose');
    let pendingHref: string | null = null;

    function openGate(href: string) {
      pendingHref = href;
      gateOverlay?.classList.add('open');
      setTimeout(() => gateEmailInput?.focus(), 100);
    }
    function closeGate() {
      gateOverlay?.classList.remove('open');
      pendingHref = null;
      if (gateMsg) { gateMsg.className = 'form-message'; gateMsg.textContent = ''; }
      if (gateEmailInput) gateEmailInput.value = '';
    }
    function triggerDownload(href: string) {
      const a = document.createElement('a');
      a.href = href;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    document.querySelectorAll<HTMLAnchorElement>('.dl-list a, .dl-zip-btn').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href') || '';
        openGate(href);
      });
    });

    gateClose?.addEventListener('click', closeGate);
    gateOverlay?.addEventListener('click', (e) => {
      if (e.target === gateOverlay) closeGate();
    });

    gateForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = gateEmailInput?.value.trim();
      if (!email || !gateBtn || !gateMsg) return;
      const t = translations[langRef.current];

      gateBtn.disabled = true;
      gateBtn.textContent = t.dlGateSending;
      gateMsg.className = 'form-message';
      gateMsg.textContent = '';

      try {
        const fileName = pendingHref?.includes('rezidence-pavlov-dokumenty.zip')
          ? 'vsechny soubory'
          : ((pendingHref?.split('/').pop()?.replace(/\.pdf$/i, '') ?? 'dokument') + '1');
        const res = await fetch('https://n8n.korysol.cz/webhook/52c43095-3921-49ef-81b4-6438254739c4', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            typ_formulare: fileName,
            source: 'Rezidence Pavlov - Stažení dokumentů',
            timestamp: new Date().toISOString(),
          }),
        });
        if (res.ok) {
          const href = pendingHref;
          closeGate();
          if (href) triggerDownload(href);
        } else {
          throw new Error();
        }
      } catch {
        gateMsg.className = 'form-message error';
        gateMsg.textContent = translations[langRef.current].dlGateError;
      } finally {
        gateBtn.disabled = false;
        gateBtn.textContent = translations[langRef.current].dlGateBtn;
      }
    });

    // ── Room scroll galleries ──
    document.querySelectorAll<HTMLElement>('.room-scroll').forEach((container) => {
      const track = container.querySelector<HTMLElement>('.room-scroll-track');
      if (!track) return;
      container.querySelector('.room-scroll-prev')?.addEventListener('click', () => {
        track.scrollBy({ left: -track.offsetWidth, behavior: 'smooth' });
      });
      container.querySelector('.room-scroll-next')?.addEventListener('click', () => {
        track.scrollBy({ left: track.offsetWidth, behavior: 'smooth' });
      });
    });

    // ── Typewriter loop ──
    const lineEl = scrollLineRef.current;
    const typedEl = scrollTypedRef.current;
    const textEl = scrollTypedTextRef.current;
    const typeSpeed = 80;
    const eraseSpeed = 50;
    let charIdx = 0;
    let typewriterActive = true;

    function showTyped() {
      if (!typewriterActive) return;
      lineEl?.classList.add('hidden');
      setTimeout(() => {
        typedEl?.classList.add('active');
        setTimeout(typeChar, 300);
      }, 400);
    }

    function typeChar() {
      if (!typewriterActive) return;
      const phrase = translations[langRef.current].typewriterPhrase;
      if (charIdx <= phrase.length) {
        if (textEl) textEl.textContent = phrase.slice(0, charIdx);
        charIdx++;
        setTimeout(typeChar, typeSpeed);
      } else {
        const cursor = typedEl?.querySelector('.scroll-typed-cursor') as HTMLElement | null;
        if (cursor) cursor.style.opacity = '0';
        setTimeout(() => {
          typedEl?.classList.add('done');
          typedEl?.addEventListener('animationend', () => {
            typedEl?.classList.add('settled');
          }, { once: true });
        }, 350);
      }
    }

    const typewriterTimeout = setTimeout(showTyped, 3000);

    // ── Gold cursor trail ──
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      let w: number, h: number;
      let mouseX = -100, mouseY = -100;
      const trail: { x: number; y: number; life: number; size: number; vx: number; vy: number }[] = [];
      const MAX_POINTS = 50;
      let isTouchDevice = false;
      let animFrame: number;
      let loopRunning = false;

      function resize() {
        w = canvas!.width = window.innerWidth;
        h = canvas!.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      const onTouch = () => {
        isTouchDevice = true;
        cancelAnimationFrame(animFrame);
        loopRunning = false;
      };
      window.addEventListener('touchstart', onTouch, { once: true, passive: true });

      function startLoop() {
        if (isTouchDevice || loopRunning) return;
        loopRunning = true;
        animFrame = requestAnimationFrame(draw);
      }

      const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        trail.push({
          x: mouseX, y: mouseY, life: 1,
          size: 3 + Math.random() * 2,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
        if (trail.length > MAX_POINTS) trail.shift();
        startLoop();
      };
      window.addEventListener('mousemove', onMouseMove);

      function draw() {
        if (isTouchDevice) { loopRunning = false; return; }
        const hasCursor = mouseX > 0 && mouseY > 0;
        if (trail.length === 0 && !hasCursor) { loopRunning = false; return; }

        ctx.clearRect(0, 0, w, h);
        for (let i = trail.length - 1; i >= 0; i--) {
          const p = trail[i];
          p.life -= 0.02; p.x += p.vx; p.y += p.vy; p.size *= 0.98;
          if (p.life <= 0) { trail.splice(i, 1); continue; }
          const alpha = p.life * 0.6;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(197, 165, 90, ${alpha * 0.15})`; ctx.fill();
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 185, 110, ${alpha})`; ctx.fill();
        }
        if (trail.length > 2) {
          ctx.beginPath(); ctx.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length; i++) {
            const xc = (trail[i].x + trail[i - 1].x) / 2;
            const yc = (trail[i].y + trail[i - 1].y) / 2;
            ctx.quadraticCurveTo(trail[i - 1].x, trail[i - 1].y, xc, yc);
          }
          ctx.strokeStyle = 'rgba(197, 165, 90, 0.15)'; ctx.lineWidth = 1.5; ctx.stroke();
        }
        if (hasCursor) {
          ctx.beginPath(); ctx.arc(mouseX, mouseY, 14, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(197, 165, 90, 0.1)'; ctx.fill();
          ctx.beginPath(); ctx.arc(mouseX, mouseY, 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(212, 185, 110, 0.25)'; ctx.fill();
          ctx.beginPath(); ctx.arc(mouseX, mouseY, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#D4B96E'; ctx.fill();
        }
        animFrame = requestAnimationFrame(draw);
      }

      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchstart', onTouch);
        cancelAnimationFrame(animFrame);
        clearTimeout(typewriterTimeout);
        typewriterActive = false;
        observer.disconnect();
      };
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(typewriterTimeout);
      typewriterActive = false;
      observer.disconnect();
    };
  }, []);

  // ── Contact form handler ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current;
    const btn = formBtnRef.current;
    const msg = formMsgRef.current;
    if (!form || !btn || !msg) return;
    const t = translations[lang];

    btn.disabled = true;
    btn.textContent = t.formSending;
    msg.className = 'form-message';
    msg.textContent = '';

    const formData = new FormData(form);
    const data = {
      name: (formData.get('name') as string)?.trim(),
      email: (formData.get('email') as string)?.trim(),
      phone: (formData.get('phone') as string)?.trim(),
      message: (formData.get('message') as string)?.trim(),
      typ_formulare: 'hlavni_formular',
      source: 'Rezidence Pavlov - Landing Page',
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch('https://n8n.korysol.cz/webhook/52c43095-3921-49ef-81b4-6438254739c4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        msg.className = 'form-message success';
        msg.textContent = t.formSuccess;
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      msg.className = 'form-message error';
      msg.textContent = t.formError;
    } finally {
      btn.disabled = false;
      btn.textContent = t.formSubmit;
    }
  }

  return (
    <>
      {/* DOWNLOAD TOP BAR */}
      <button id="dlTrigger" className="dl-topbar" aria-label={tr.dlTopbarShort}>
        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
        <span className="dl-topbar-long">{tr.dlTopbarLong}</span>
        <span className="dl-topbar-short">{tr.dlTopbarShort}</span>
        <span className="dl-topbar-arrow">→</span>
      </button>

      {/* HEADER */}
      <header id="header" ref={headerRef}>
        <div className="logo">
          <a href="#">
            <img src="/images/ANAGRAM_PD_barva_final.png" alt="Petr Dadej" />
          </a>
        </div>
        <button className="menu-toggle" ref={menuToggleRef} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        <nav ref={navRef}>
          <a href="#story">{tr.navStory}</a>
          <a href="#interior">{tr.navInterior}</a>
          <a href="#exterior">{tr.navExterior}</a>
          <a href="#contact" className="nav-contact-btn">{tr.navContact}</a>
          <button
            className="lang-toggle"
            onClick={() => setLang(l => l === 'cs' ? 'en' : 'cs')}
            aria-label="Switch language"
          >
            {lang === 'cs' ? 'EN' : 'CS'}
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <video className="hero-bg" autoPlay muted loop playsInline preload="auto"
          poster="/images/zasilka/DJI_20260305151656_0025_D-HDR.webp">
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Rezidence<br />Pavlov</h1>
          <p className="hero-subtitle">{tr.heroSubtitle}</p>
          <p className="hero-sub2">{tr.heroSub2}</p>
          <div className="hero-divider"></div>
          <div className="hero-scroll">
            <a href="#intro" id="scrollLink">
              <div className="scroll-line-wrap">
                <span className="scroll-line" ref={scrollLineRef}></span>
                <div className="scroll-typed" ref={scrollTypedRef}>
                  <span className="scroll-typed-text" ref={scrollTypedTextRef}></span>
                  <span className="scroll-typed-cursor"></span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section id="intro">
        <div className="intro reveal">
          <p className="section-label">{tr.introLabel}</p>
          <h2 className="section-title">{tr.introTitle.split('\n').map((l, i) => i === 0 ? <>{l}<br key={i}/></> : l)}</h2>
          <div className="gold-line"></div>
          <p>{tr.introP1}</p>
          <div className="highlight-quote">
            {tr.introQuote.split('\n').map((l, i) => i === 0 ? <>{l}<br key={i}/></> : l)}
          </div>
          <p>{tr.introP2}</p>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stats-grid reveal">
          <div className="stat-item">
            <div className="stat-number">10 670</div>
            <div className="stat-label">{tr.statLabel1}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">{tr.statLabel2}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1</div>
            <div className="stat-label">{tr.statLabel3}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">270°</div>
            <div className="stat-label">{tr.statLabel4}</div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="story" className="timeline-section">
        <div className="timeline-header reveal">
          <p className="section-label">{tr.storyLabel}</p>
          <h2 className="section-title">{tr.storyTitle}</h2>
          <div className="gold-line"></div>
        </div>

        <div className="timeline">
          {/* 1 */}
          <div className="tl-item">
            <div className="tl-content reveal-left">
              <p className="tl-year">{tr.ch1num}</p>
              <h3 className="tl-title">{tr.ch1title}</h3>
              <p className="tl-desc">{tr.ch1desc}</p>
            </div>
            <div className="tl-image reveal-right">
              <img src="/images/pavlov_vize.webp" alt="View from the residence above Mohelnice" loading="lazy" />
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 2 */}
          <div className="tl-item">
            <div className="tl-content reveal-right">
              <p className="tl-year">{tr.ch2num}</p>
              <h3 className="tl-title">{tr.ch2title}</h3>
              <p className="tl-desc">{tr.ch2desc}</p>
            </div>
            <div className="tl-image reveal-left">
              <div className="tl-image-grid">
                <img src="/images/kuchyne-pred-rekonstrukci.webp" alt="Kitchen before renovation" loading="lazy" />
                <img src="/images/zasilka/PS1A6944-HDR.webp" alt="Kitchen after renovation" loading="lazy" />
              </div>
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 3 */}
          <div className="tl-item">
            <div className="tl-content reveal-left">
              <p className="tl-year">{tr.ch3num}</p>
              <h3 className="tl-title">{tr.ch3title}</h3>
              <p className="tl-desc">{tr.ch3desc}</p>
            </div>
            <div className="tl-image reveal-right">
              <div className="tl-image-grid">
                <img src="/images/zasilka/PS1A6939-HDR.webp" alt="Kitchen overview" loading="lazy" />
                <img src="/images/zasilka/PS1A6959-HDR.webp" alt="Kitchen detail" loading="lazy" />
              </div>
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 4 */}
          <div className="tl-item">
            <div className="tl-content reveal-right">
              <p className="tl-year">{tr.ch4num}</p>
              <h3 className="tl-title">{tr.ch4title}</h3>
              <p className="tl-desc">{tr.ch4desc}</p>
            </div>
            <div className="tl-image reveal-left">
              <img src="/images/zasilka/PS1A6989-HDR.webp" alt="Living room" loading="lazy" />
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 5 */}
          <div className="tl-item">
            <div className="tl-content reveal-left">
              <p className="tl-year">{tr.ch5num}</p>
              <h3 className="tl-title">{tr.ch5title}</h3>
              <p className="tl-desc">{tr.ch5desc}</p>
            </div>
            <div className="tl-image reveal-right">
              <div className="tl-image-grid">
                <img src="/images/zasilka/PS1A6746-HDR.webp" alt="Master bedroom" loading="lazy" />
                <img src="/images/zasilka/PS1A6756-HDR.webp" alt="Bedroom wall mural" loading="lazy" />
              </div>
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 6 */}
          <div className="tl-item">
            <div className="tl-content reveal-left">
              <p className="tl-year">{tr.ch6num}</p>
              <h3 className="tl-title">{tr.ch6title}</h3>
              <p className="tl-desc">{tr.ch6desc}</p>
            </div>
            <div className="tl-image reveal-right">
              <img src="/images/zasilka/PS1A6869-HDR.webp" alt="Daikin heat pump" loading="lazy" />
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 7 */}
          <div className="tl-item">
            <div className="tl-content reveal-right">
              <p className="tl-year">{tr.ch7num}</p>
              <h3 className="tl-title">{tr.ch7title}</h3>
              <p className="tl-desc">{tr.ch7desc}</p>
            </div>
            <div className="tl-image reveal-left">
              <img src="/images/viceucelovy-prostor.jpg" alt="Multi-purpose space" loading="lazy" />
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 8 */}
          <div className="tl-item">
            <div className="tl-content reveal-left">
              <p className="tl-year">{tr.ch8num}</p>
              <h3 className="tl-title">{tr.ch8title}</h3>
              <p className="tl-desc">{tr.ch8desc}</p>
            </div>
            <div className="tl-image reveal-right">
              <img src="/images/zasilka/rezidence-dnes.webp" alt="Residence today - spring view" loading="lazy" />
            </div>
            <div className="tl-dot"></div>
          </div>
        </div>
      </section>

{/* INTERIOR GALLERY */}
      <section id="interior" className="rooms" onClick={e => { const el = e.target as HTMLElement; if (el.tagName === 'IMG') openLightbox((el as HTMLImageElement).src); }}>
        <div className="rooms-header reveal">
          <p className="section-label">{tr.interiorLabel}</p>
          <h2 className="section-title">{tr.interiorTitle}</h2>
          <div className="gold-line"></div>
        </div>

        {/* Kitchen */}
        <div className="room-row reveal">
          <div className="room-label">
            <img src="/images/zasilka/PS1A6939-HDR.webp" alt="Kitchen with island" loading="lazy" decoding="async" />
            <div className="room-label-text"><p>{tr.r1sub}</p><h3>{tr.r1title}</h3></div>
          </div>
          <div className="room-scroll">
            <div className="room-scroll-track">
              <img src="/images/zasilka/PS1A6944-HDR.webp" alt="Kitchen blue cabinets" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6959-HDR.webp" alt="Kitchen fridge" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6964-HDR.webp" alt="Kitchen garden view" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6969-HDR.webp" alt="Kitchen countertop" loading="lazy" decoding="async" />
            </div>
            <button className="room-scroll-btn room-scroll-prev" aria-label={tr.prev}>&#8249;</button>
            <button className="room-scroll-btn room-scroll-next" aria-label={tr.next}>&#8250;</button>
          </div>
        </div>

        {/* Living room */}
        <div className="room-row reverse reveal">
          <div className="room-scroll">
            <div className="room-scroll-track">
              <img src="/images/zasilka/PS1A6999-HDR.webp" alt="Living room open space" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6984-HDR.webp" alt="Living room TV" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6994-HDR.webp" alt="Living room angle" loading="lazy" decoding="async" />
            </div>
            <button className="room-scroll-btn room-scroll-prev" aria-label={tr.prev}>&#8249;</button>
            <button className="room-scroll-btn room-scroll-next" aria-label={tr.next}>&#8250;</button>
          </div>
          <div className="room-label">
            <img src="/images/zasilka/PS1A6989-HDR.webp" alt="Living room sofa" loading="lazy" decoding="async" />
            <div className="room-label-text"><p>{tr.r2sub}</p><h3>{tr.r2title}</h3></div>
          </div>
        </div>

        {/* Hallways */}
        <div className="room-row reveal">
          <div className="room-label">
            <img src="/images/zasilka/PS1A6909-HDR.webp" alt="Hallway" loading="lazy" decoding="async" />
            <div className="room-label-text"><p>{tr.r3sub}</p><h3>{tr.r3title}</h3></div>
          </div>
          <div className="room-scroll">
            <div className="room-scroll-track">
              <img src="/images/zasilka/PS1A6929-HDR.webp" alt="Entrance hall" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6731-HDR.webp" alt="Hallway second view" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6736-HDR.webp" alt="Hallway third view" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6829-HDR.webp" alt="Hallway passage" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6834-HDR.webp" alt="Blue door" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6924-HDR.webp" alt="Hallway detail" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6934-HDR.webp" alt="Hallway entrance" loading="lazy" decoding="async" />
            </div>
            <button className="room-scroll-btn room-scroll-prev" aria-label={tr.prev}>&#8249;</button>
            <button className="room-scroll-btn room-scroll-next" aria-label={tr.next}>&#8250;</button>
          </div>
        </div>

        {/* Master bedroom */}
        <div className="room-row reverse reveal">
          <div className="room-scroll">
            <div className="room-scroll-track">
              <img src="/images/zasilka/PS1A6756-HDR.webp" alt="Bedroom Provence wallpaper" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6741-HDR.webp" alt="Bedroom second angle" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6751-HDR.webp" alt="Bedroom third angle" loading="lazy" decoding="async" />
            </div>
            <button className="room-scroll-btn room-scroll-prev" aria-label={tr.prev}>&#8249;</button>
            <button className="room-scroll-btn room-scroll-next" aria-label={tr.next}>&#8250;</button>
          </div>
          <div className="room-label">
            <img src="/images/zasilka/PS1A6746-HDR.webp" alt="Bedroom stone wall" loading="lazy" decoding="async" />
            <div className="room-label-text"><p>{tr.r4sub}</p><h3>{tr.r4title}</h3></div>
          </div>
        </div>

        {/* Bathroom */}
        <div className="room-row reveal">
          <div className="room-label">
            <img src="/images/zasilka/PS1A6701-HDR.webp" alt="Main bathroom" loading="lazy" decoding="async" />
            <div className="room-label-text"><p>{tr.r5sub}</p><h3>{tr.r5title}</h3></div>
          </div>
          <div className="room-scroll">
            <div className="room-scroll-track">
              <img src="/images/zasilka/PS1A6721-HDR.webp" alt="Bathroom shower" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6711-HDR.webp" alt="Bathroom second angle" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6716-HDR.webp" alt="Bathroom third angle" loading="lazy" decoding="async" />
            </div>
            <button className="room-scroll-btn room-scroll-prev" aria-label={tr.prev}>&#8249;</button>
            <button className="room-scroll-btn room-scroll-next" aria-label={tr.next}>&#8250;</button>
          </div>
        </div>

        {/* Study */}
        <div className="room-row reverse reveal">
          <div className="room-scroll">
            <div className="room-scroll-track">
              <img src="/images/zasilka/PS1A6772-HDR.webp" alt="Study first view" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6787-HDR.webp" alt="Study second view" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6794-HDR.webp" alt="Study third view" loading="lazy" decoding="async" />
            </div>
            <button className="room-scroll-btn room-scroll-prev" aria-label={tr.prev}>&#8249;</button>
            <button className="room-scroll-btn room-scroll-next" aria-label={tr.next}>&#8250;</button>
          </div>
          <div className="room-label">
            <img src="/images/zasilka/PS1A6780-HDR.webp" alt="Study" loading="lazy" decoding="async" />
            <div className="room-label-text"><p>{tr.r6sub}</p><h3>{tr.r6title}</h3></div>
          </div>
        </div>

        {/* WC */}
        <div className="room-row reveal">
          <div className="room-label">
            <img src="/images/zasilka/PS1A6914-HDR.webp" alt="WC" loading="lazy" decoding="async" />
            <div className="room-label-text"><p>{tr.r7sub}</p><h3>{tr.r7title}</h3></div>
          </div>
          <img src="/images/zasilka/PS1A6919-HDR.webp" alt="WC second view" loading="lazy" decoding="async" />
        </div>

        {/* Guest room */}
        <div className="room-row reverse reveal">
          <div className="room-scroll">
            <div className="room-scroll-track">
              <img src="/images/zasilka/PS1A6849-HDR.webp" alt="Guest room" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6854-HDR.webp" alt="Guest room second angle" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6859-HDR.webp" alt="Guest room third angle" loading="lazy" decoding="async" />
            </div>
            <button className="room-scroll-btn room-scroll-prev" aria-label={tr.prev}>&#8249;</button>
            <button className="room-scroll-btn room-scroll-next" aria-label={tr.next}>&#8250;</button>
          </div>
          <div className="room-label">
            <img src="/images/zasilka/PS1A6864-HDR.webp" alt="Guest room" loading="lazy" decoding="async" />
            <div className="room-label-text"><p>{tr.r8sub}</p><h3>{tr.r8title}</h3></div>
          </div>
        </div>

        {/* Guest bathroom */}
        <div className="room-row reveal">
          <div className="room-label">
            <img src="/images/zasilka/PS1A6808-HDR.webp" alt="Guest bathroom" loading="lazy" decoding="async" />
            <div className="room-label-text"><p>{tr.r9sub}</p><h3>{tr.r9title}</h3></div>
          </div>
          <div className="room-scroll">
            <div className="room-scroll-track">
              <img src="/images/zasilka/PS1A6815-HDR.webp" alt="Guest bathroom shower" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6822-HDR.webp" alt="Guest bathroom second angle" loading="lazy" decoding="async" />
            </div>
            <button className="room-scroll-btn room-scroll-prev" aria-label={tr.prev}>&#8249;</button>
            <button className="room-scroll-btn room-scroll-next" aria-label={tr.next}>&#8250;</button>
          </div>
        </div>

        {/* Utility room */}
        <div className="room-row reverse reveal">
          <div className="room-scroll">
            <div className="room-scroll-track">
              <img src="/images/zasilka/PS1A6869-HDR.webp" alt="Boiler room heat pump" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6884-HDR.webp" alt="Utility room second view" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6889-HDR.webp" alt="Utility room third view" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6894-HDR.webp" alt="Utility room fourth view" loading="lazy" decoding="async" />
            </div>
            <button className="room-scroll-btn room-scroll-prev" aria-label={tr.prev}>&#8249;</button>
            <button className="room-scroll-btn room-scroll-next" aria-label={tr.next}>&#8250;</button>
          </div>
          <div className="room-label">
            <img src="/images/zasilka/PS1A6874-HDR.webp" alt="Laundry room" loading="lazy" decoding="async" />
            <div className="room-label-text"><p>{tr.r10sub}</p><h3>{tr.r10title}</h3></div>
          </div>
        </div>
      </section>

      {/* EXTERIOR */}
      <section id="exterior" className="rooms" onClick={e => { const el = e.target as HTMLElement; if (el.tagName === 'IMG') openLightbox((el as HTMLImageElement).src); }}>
        <div className="rooms-header reveal">
          <p className="section-label">{tr.exteriorLabel}</p>
          <h2 className="section-title">{tr.exteriorTitle}</h2>
          <div className="gold-line"></div>
        </div>
        <div className="exterior-grid reveal">
          <img className="wide" src="/images/zasilka/DJI_20260305151656_0025_D-HDR.webp" alt="Spring panorama" loading="lazy" />
          <img src="/images/DJI_20260219124228_0023_D-HDR.webp" alt="Aerial winter view" loading="lazy" />
          <img src="/images/DJI_20260219124342_0030_D-HDR.webp" alt="Property in winter" loading="lazy" />
          <img src="/images/DJI_20260219124532_0040_D-HDR.webp" alt="Driveway" loading="lazy" />
          <img src="/images/DJI_20260219124424_0034_D-HDR.webp" alt="Panoramic view" loading="lazy" />
          <img src="/images/zasilka/DJI_20260305151440_0017_D-HDR.webp" alt="Spring sunset" loading="lazy" />
          <img className="wide" src="/images/zasilka/DJI_20260305151720_0026_D.webp" alt="Residence in landscape" loading="lazy" style={{objectPosition: '60% 70%'}} />
        </div>
      </section>

      {/* LIFESTYLE */}
      <section className="lifestyle">
        <div className="reveal">
          <p className="section-label">{tr.lifestyleLabel}</p>
          <h2 className="section-title">{tr.lifestyleTitle}</h2>
          <div className="gold-line"></div>
          <p>{tr.lifestyleP}</p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <div className="contact-inner">
          <div className="contact-info reveal">
            <p className="section-label">{tr.contactLabel}</p>
            <h2 className="section-title">{tr.contactTitle}</h2>
            <div className="gold-line"></div>
            <h3>{tr.contactExclusive}</h3>
            <p className="contact-name">Petr Dadej</p>
            <div className="contact-detail">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <a href="tel:+420775180127">775 180 127</a>
            </div>
            <div className="contact-detail">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4L12 13L2 4" />
              </svg>
              <a href="mailto:info@petrdadej.cz">info@petrdadej.cz</a>
            </div>
            <div className="contact-detail">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
              <a href="https://www.petrdadej.cz" target="_blank" rel="noopener noreferrer">www.petrdadej.cz</a>
            </div>

            <div className="contact-form">
              <h3>{tr.contactInquiry}</h3>
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <input type="text" name="name" placeholder={tr.formName} required />
                  </div>
                  <div className="form-group">
                    <input type="tel" name="phone" placeholder={tr.formPhone} />
                  </div>
                </div>
                <div className="form-group">
                  <input type="email" name="email" placeholder="E-mail" required />
                </div>
                <div className="form-group">
                  <textarea name="message" placeholder={tr.formMessage}></textarea>
                </div>
                <button type="submit" className="form-submit" ref={formBtnRef}>{tr.formSubmit}</button>
                <div className="form-message" ref={formMsgRef}></div>
              </form>
            </div>
          </div>
          <div className="contact-photo reveal">
            <img src="/images/petr-dadej.webp" alt="Petr Dadej" loading="lazy" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <img src="/images/ANAGRAM_PD_barva_final.png" alt="Petr Dadej" />
        </div>
        <p>&copy; 2026 Petr Dadej. {tr.footer}</p>
      </footer>

      {/* DOWNLOAD OVERLAY */}
      <div id="dlOverlay" className="dl-overlay" />

      {/* DOWNLOAD PANEL */}
      <div id="dlPanel" className="dl-panel">
        <button id="dlClose" className="dl-close" aria-label={tr.close}>×</button>
        <p className="section-label">{tr.dlPanelLabel}</p>
        <h3 className="dl-panel-title">{tr.dlPanelTitle}</h3>
        <div className="gold-line"></div>
        <p>{tr.dlPanelDesc}</p>
        <ul className="dl-list">
          {docFiles.map((href, i) => (
            <li key={href}>
              <a href={href} download>
                <DownloadIcon />
                {tr.docs[i]}
              </a>
            </li>
          ))}
        </ul>
        <a href="/documents/rezidence-pavlov-dokumenty.zip" download className="dl-zip-btn">
          {tr.dlZipBtn}
        </a>
      </div>

      {/* DOWNLOAD GATE MODAL */}
      <div id="dlGateOverlay" className="dl-gate-overlay">
        <div id="dlGateModal" className="dl-gate-modal">
          <button id="dlGateClose" className="dl-close" aria-label={tr.close}>×</button>
          <p className="section-label">{tr.dlGateLabel}</p>
          <h3 className="dl-panel-title">{tr.dlGateTitle}</h3>
          <div className="gold-line"></div>
          <p>{tr.dlGateDesc}</p>
          <form id="dlGateForm">
            <div className="form-group">
              <input id="dlGateEmail" type="email" placeholder={tr.dlGateEmailPlaceholder} required />
            </div>
            <button id="dlGateBtn" type="submit" className="form-submit">{tr.dlGateBtn}</button>
            <div id="dlGateMsg" className="form-message"></div>
          </form>
        </div>
      </div>

      {/* YOUTUBE WIDGET — malý roh */}
      <div className="yt-widget">
        <button className="yt-thumb" onClick={() => setYtExpanded(true)} aria-label={tr.ytLabel}>
          <img src="https://img.youtube.com/vi/7ebzI_obhDw/mqdefault.jpg" alt="Rezidence Pavlov – video" />
          <span className="yt-play-icon">
            <svg viewBox="0 0 68 48"><path d="M66.52 7.74C65.7 4.54 63.2 2.04 60 1.22 54.76 0 34 0 34 0S13.24 0 8 1.22C4.8 2.04 2.3 4.54 1.48 7.74 0 13 0 24 0 24s0 11 1.48 16.26c.82 3.2 3.32 5.7 6.52 6.52C13.24 48 34 48 34 48s20.76 0 26-1.22c3.2-.82 5.7-3.32 6.52-6.52C68 35 68 24 68 24s0-11-1.48-16.26z" fill="#ff0000"/><path d="M45 24L27 14v20" fill="#fff"/></svg>
          </span>
          <span className="yt-label">{tr.ytLabel}</span>
        </button>
      </div>

      {/* YOUTUBE OVERLAY */}
      {ytExpanded && (
        <div className="yt-expanded" onClick={() => setYtExpanded(false)}>
          <button className="yt-close" onClick={() => setYtExpanded(false)} aria-label={tr.ytClose}>×</button>
          <iframe
            src="https://www.youtube.com/embed/7ebzI_obhDw?autoplay=1&rel=0"
            title="Rezidence Pavlov"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* CURSOR TRAIL */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}
      />

      {/* LIGHTBOX */}
      {lightboxIdx !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label={tr.close}>&#x2715;</button>
          <button className="lightbox-prev" onClick={e => { e.stopPropagation(); lightboxPrev(); }} aria-label={tr.prev}>&#8249;</button>
          <img src={galleryRef.current[lightboxIdx]} alt="" onClick={e => e.stopPropagation()} />
          <button className="lightbox-next" onClick={e => { e.stopPropagation(); lightboxNext(); }} aria-label={tr.next}>&#8250;</button>
        </div>
      )}
    </>
  );
}
