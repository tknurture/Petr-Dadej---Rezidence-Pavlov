'use client';

import { useEffect, useRef } from 'react';

export default function Home() {
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
        if (sessionStorage.getItem('dlEmailSubmitted')) {
          triggerDownload(href);
          return;
        }
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

      gateBtn.disabled = true;
      gateBtn.textContent = 'Odesílám...';
      gateMsg.className = 'form-message';
      gateMsg.textContent = '';

      try {
        const res = await fetch('https://n8n.korysol.cz/webhook/52c43095-3921-49ef-81b4-6438254739c4', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            source: 'Rezidence Pavlov - Stažení dokumentů',
            timestamp: new Date().toISOString(),
          }),
        });
        if (res.ok) {
          sessionStorage.setItem('dlEmailSubmitted', '1');
          const href = pendingHref;
          closeGate();
          if (href) triggerDownload(href);
        } else {
          throw new Error();
        }
      } catch {
        gateMsg.className = 'form-message error';
        gateMsg.textContent = 'Nepodařilo se odeslat. Zkuste to prosím znovu.';
      } finally {
        gateBtn.disabled = false;
        gateBtn.textContent = 'Stáhnout';
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
    const phrase = 'Chci vidět více';
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
      let mouseX = -100,
        mouseY = -100;
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
          x: mouseX,
          y: mouseY,
          life: 1,
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
        if (trail.length === 0 && !hasCursor) {
          loopRunning = false;
          return; // nic ke kreslení — zastaví smyčku
        }

        ctx.clearRect(0, 0, w, h);

        for (let i = trail.length - 1; i >= 0; i--) {
          const p = trail[i];
          p.life -= 0.02;
          p.x += p.vx;
          p.y += p.vy;
          p.size *= 0.98;

          if (p.life <= 0) {
            trail.splice(i, 1);
            continue;
          }

          const alpha = p.life * 0.6;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(197, 165, 90, ${alpha * 0.15})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 185, 110, ${alpha})`;
          ctx.fill();
        }

        if (trail.length > 2) {
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length; i++) {
            const xc = (trail[i].x + trail[i - 1].x) / 2;
            const yc = (trail[i].y + trail[i - 1].y) / 2;
            ctx.quadraticCurveTo(trail[i - 1].x, trail[i - 1].y, xc, yc);
          }
          ctx.strokeStyle = 'rgba(197, 165, 90, 0.15)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        if (hasCursor) {
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, 14, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(197, 165, 90, 0.1)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(mouseX, mouseY, 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(212, 185, 110, 0.25)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(mouseX, mouseY, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#D4B96E';
          ctx.fill();
        }

        animFrame = requestAnimationFrame(draw);
      }

      // Cleanup for cursor trail
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

    btn.disabled = true;
    btn.textContent = 'Odesílám...';
    msg.className = 'form-message';
    msg.textContent = '';

    const formData = new FormData(form);
    const data = {
      name: (formData.get('name') as string)?.trim(),
      email: (formData.get('email') as string)?.trim(),
      phone: (formData.get('phone') as string)?.trim(),
      message: (formData.get('message') as string)?.trim(),
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
        msg.textContent = 'Děkujeme! Vaše zpráva byla odeslána. Ozveme se vám co nejdříve.';
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      msg.className = 'form-message error';
      msg.textContent = 'Omlouváme se, zprávu se nepodařilo odeslat. Zkuste to prosím znovu nebo nás kontaktujte telefonicky.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Odeslat zprávu';
    }
  }

  return (
    <>
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
          <a href="#story">Příběh</a>
          <a href="#interior">Interiér</a>
          <a href="#exterior">Exteriér</a>
          <a href="#contact" className="nav-contact-btn">Kontakt</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <video
          className="hero-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/zasilka/DJI_20260305151656_0025_D-HDR.webp"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-label">Pavlov 163</p>
          <h1 className="hero-title">Rezidence<br />Pavlov</h1>
          <p className="hero-subtitle">S výhledem, co se neokouká</p>
          <p className="hero-sub2">Hektar vlastního světa</p>
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
          <p className="section-label">O rezidenci</p>
          <h2 className="section-title">Každý výjimečný dům<br />má svůj příběh</h2>
          <div className="gold-line"></div>
          <p>
            Rezidence Pavlov není běžný rodinný dům. Je to místo s&nbsp;duší,
            které prošlo pečlivou rekonstrukcí a&nbsp;proměnilo se v&nbsp;rezidenci
            nad Mohelnicí s&nbsp;výhledem na Bouzov a&nbsp;Praděd.
          </p>
          <div className="highlight-quote">
            {'\u201EDomov si nevybíráte rozumem, ale pocitem.'}<br />{'\u00A0Ten správný poznáte hned.\u201C'}
          </div>
          <p>
            Od prvních vizí přes měsíce rekonstrukce až po finální podobu
            — každý detail nese otisk péče a&nbsp;lásky k&nbsp;tomuto místu.
            Pojďte nahlédnout do příběhu, který čeká na další kapitolu.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stats-grid reveal">
          <div className="stat-item">
            <div className="stat-number">10 670</div>
            <div className="stat-label">m² pozemku</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">soukromí</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1</div>
            <div className="stat-label">hektar vlastního světa</div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="story" className="timeline-section">
        <div className="timeline-header reveal">
          <p className="section-label">Příběh rezidence</p>
          <h2 className="section-title">Od vize k realitě</h2>
          <div className="gold-line"></div>
        </div>

        <div className="timeline">
          {/* 1 - Vize */}
          <div className="tl-item">
            <div className="tl-content reveal-left">
              <p className="tl-year">Kapitola I</p>
              <h3 className="tl-title">Vize a místo</h3>
              <p className="tl-desc">
                Všechno začalo nalezením výjimečné lokace — kopec nad Mohelnicí
                s&nbsp;panoramatickým výhledem na Bouzov a&nbsp;Praděd. Místo,
                kde se rodí klid a&nbsp;absolutní soukromí. Hektar vlastního světa
                čekající na svůj příběh.
              </p>
            </div>
            <div className="tl-image reveal-right">
              <img src="/images/zasilka/DJI_20260305151850_0030_D-HDR.webp" alt="Lokace - výhled nad Mohelnicí" loading="lazy" />
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 2 - Rekonstrukce */}
          <div className="tl-item">
            <div className="tl-content reveal-right">
              <p className="tl-year">Kapitola II</p>
              <h3 className="tl-title">Rekonstrukce s duší</h3>
              <p className="tl-desc">
                Kompletní rekonstrukce proměnila dům v&nbsp;rezidenci s&nbsp;jedinečným
                charakterem. Ruční zpracování detailů, patinované dveře,
                autorské povrchy stěn a&nbsp;pečlivě zvolené materiály.
                Každá místnost dostala vlastní identitu.
              </p>
            </div>
            <div className="tl-image reveal-left">
              <div className="tl-image-grid">
                <img src="/images/kuchyne-pred-rekonstrukci.webp" alt="Kuchyně před rekonstrukcí" loading="lazy" />
                <img src="/images/zasilka/PS1A6944-HDR.webp" alt="Kuchyně po rekonstrukci" loading="lazy" />
              </div>
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 3 - Kuchyně */}
          <div className="tl-item">
            <div className="tl-content reveal-left">
              <p className="tl-year">Kapitola III</p>
              <h3 className="tl-title">Srdce domova</h3>
              <p className="tl-desc">
                Kuchyně s&nbsp;ručně barvenými modrými skříňkami, žulovým
                pultem a&nbsp;industriálním osvětlením se stala srdcem celého domu.
                Otevřený prostor propojený s&nbsp;obývací částí vytváří
                velkorysý společenský prostor pro rodinu i&nbsp;přátele.
              </p>
            </div>
            <div className="tl-image reveal-right">
              <div className="tl-image-grid">
                <img src="/images/zasilka/PS1A6939-HDR.webp" alt="Kuchyně - celkový pohled" loading="lazy" />
                <img src="/images/zasilka/PS1A6959-HDR.webp" alt="Kuchyně - detail" loading="lazy" />
              </div>
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 4 - Obývací prostor */}
          <div className="tl-item">
            <div className="tl-content reveal-right">
              <p className="tl-year">Kapitola IV</p>
              <h3 className="tl-title">Prostor pro život</h3>
              <p className="tl-desc">
                Obývací část s přímým vstupem na zahradu
                a&nbsp;velkoformátovými okny je zaplavená denním světlem.
                Celek plynule propojuje kuchyni, jídelnu
                i&nbsp;relaxační zónu do harmonického
                a&nbsp;funkčního uspořádání.
              </p>
            </div>
            <div className="tl-image reveal-left">
              <img src="/images/zasilka/PS1A6989-HDR.webp" alt="Obývací prostor" loading="lazy" />
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 5 - Ložnice */}
          <div className="tl-item">
            <div className="tl-content reveal-left">
              <p className="tl-year">Kapitola V</p>
              <h3 className="tl-title">Soukromý svět</h3>
              <p className="tl-desc">
                Ložnice s dekorativní kamennou stěnou a&nbsp;tapetou
                inspirovanou francouzským Provence. Dřevěné dveře
                sladěné s&nbsp;tapetou — s&nbsp;vynýtovanými šrouby
                — dotváří jedinečný charakter prostoru.
                Každý pokoj je originál, kde se prolíná útulnost
                s&nbsp;uměním.
              </p>
            </div>
            <div className="tl-image reveal-right">
              <div className="tl-image-grid">
                <img src="/images/zasilka/PS1A6746-HDR.webp" alt="Hlavní ložnice" loading="lazy" />
                <img src="/images/zasilka/PS1A6756-HDR.webp" alt="Ložnice - nástěnná malba" loading="lazy" />
              </div>
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 6 - Finální podoba */}
          <div className="tl-item">
            <div className="tl-content reveal-right">
              <p className="tl-year">Kapitola VI</p>
              <h3 className="tl-title">Rezidence dnes</h3>
              <p className="tl-desc">
                Dnes je Rezidence Pavlov kompletní — hotové dílo,
                které čeká na svého nového majitele. Místo s&nbsp;charakterem,
                výhledy a&nbsp;příběhem, který si zaslouží pokračování.
                Rezidence, která se stane vaším domovem.
              </p>
            </div>
            <div className="tl-image reveal-left">
              <img src="/images/zasilka/DJI_20260305151440_0017_D-HDR.webp" alt="Rezidence dnes - jarní pohled" loading="lazy" />
            </div>
            <div className="tl-dot"></div>
          </div>
        </div>
      </section>

      {/* IMAGE BREAK */}
      <div className="image-break">
        <img src="/images/DJI_20260219124457_0037_D-HDR.webp" alt="Rezidence Pavlov - zimní panorama" loading="lazy" />
        <div className="image-break-overlay">
          <div className="image-break-text reveal">
            <p>Rezidence ve čtyřech ročních obdobích</p>
            <h2>Výhled, který nikdy neomrzí</h2>
          </div>
        </div>
      </div>

      {/* INTERIOR GALLERY */}
      <section id="interior" className="rooms">
        <div className="rooms-header reveal">
          <p className="section-label">Interiér</p>
          <h2 className="section-title">Nahlédněte dovnitř</h2>
          <div className="gold-line"></div>
        </div>

        {/* Kuchyně — 3 fotky v scroll galerii */}
        <div className="room-row reveal">
          <div className="room-label">
            <img src="/images/zasilka/PS1A6939-HDR.webp" alt="Kuchyně s ostrovem" loading="lazy" decoding="async" />
            <div className="room-label-text">
              <p>Srdce domova</p>
              <h3>Kuchyně</h3>
            </div>
          </div>
          <div className="room-scroll">
            <div className="room-scroll-track">
              <img src="/images/zasilka/PS1A6944-HDR.webp" alt="Kuchyně - modré skříňky" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6959-HDR.webp" alt="Kuchyně - americká lednička" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6964-HDR.webp" alt="Kuchyně - výhled na zahradu" loading="lazy" decoding="async" />
            </div>
            <button className="room-scroll-btn room-scroll-prev" aria-label="Předchozí">&#8249;</button>
            <button className="room-scroll-btn room-scroll-next" aria-label="Další">&#8250;</button>
          </div>
        </div>

        {/* Obývací pokoj — 2 fotky v scroll galerii */}
        <div className="room-row reverse reveal">
          <div className="room-scroll">
            <div className="room-scroll-track">
              <img src="/images/zasilka/PS1A6999-HDR.webp" alt="Obývací pokoj s kuchyní - open space" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6984-HDR.webp" alt="Obývací pokoj - TV a okno do zahrady" loading="lazy" decoding="async" />
            </div>
            <button className="room-scroll-btn room-scroll-prev" aria-label="Předchozí">&#8249;</button>
            <button className="room-scroll-btn room-scroll-next" aria-label="Další">&#8250;</button>
          </div>
          <div className="room-label">
            <img src="/images/zasilka/PS1A6989-HDR.webp" alt="Obývací pokoj - sedačka a výhled na zahradu" loading="lazy" decoding="async" />
            <div className="room-label-text">
              <p>Prostor pro život</p>
              <h3>Obývací pokoj</h3>
            </div>
          </div>
        </div>

        {/* Chodby a vstupy */}
        <div className="room-row reveal">
          <div className="room-label">
            <img src="/images/zasilka/PS1A6909-HDR.webp" alt="Chodba se zelenými dveřmi" loading="lazy" decoding="async" />
            <div className="room-label-text">
              <p>Každý detail s&nbsp;péčí</p>
              <h3>Chodby a&nbsp;vstupy</h3>
            </div>
          </div>
          <img src="/images/zasilka/PS1A6929-HDR.webp" alt="Vstupní hala" loading="lazy" decoding="async" />
        </div>

        {/* Ložnice — 2 fotky v scroll galerii */}
        <div className="room-row reverse reveal">
          <div className="room-scroll">
            <div className="room-scroll-track">
              <img src="/images/zasilka/PS1A6756-HDR.webp" alt="Ložnice - Provence tapeta a výhled" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6849-HDR.webp" alt="Ložnice - modrý pruh" loading="lazy" decoding="async" />
            </div>
            <button className="room-scroll-btn room-scroll-prev" aria-label="Předchozí">&#8249;</button>
            <button className="room-scroll-btn room-scroll-next" aria-label="Další">&#8250;</button>
          </div>
          <div className="room-label">
            <img src="/images/zasilka/PS1A6746-HDR.webp" alt="Ložnice s kamennou stěnou" loading="lazy" decoding="async" />
            <div className="room-label-text">
              <p>Klid a&nbsp;soukromí</p>
              <h3>Ložnice s&nbsp;příběhem</h3>
            </div>
          </div>
        </div>

        {/* Koupelna */}
        <div className="room-row reveal">
          <div className="room-label">
            <img src="/images/zasilka/PS1A6701-HDR.webp" alt="Koupelna" loading="lazy" decoding="async" />
            <div className="room-label-text">
              <p>Autorský design</p>
              <h3>Koupelna</h3>
            </div>
          </div>
          <img src="/images/zasilka/PS1A6721-HDR.webp" alt="Koupelna - sprchový kout a umyvadla" loading="lazy" decoding="async" />
        </div>

        {/* Hostinský pokoj — 2 fotky v scroll galerii */}
        <div className="room-row reverse reveal">
          <div className="room-scroll">
            <div className="room-scroll-track">
              <img src="/images/zasilka/PS1A6849-HDR.webp" alt="Hostinský pokoj - přední pohled" loading="lazy" decoding="async" />
              <img src="/images/zasilka/PS1A6854-HDR.webp" alt="Hostinský pokoj - druhý úhel" loading="lazy" decoding="async" />
            </div>
            <button className="room-scroll-btn room-scroll-prev" aria-label="Předchozí">&#8249;</button>
            <button className="room-scroll-btn room-scroll-next" aria-label="Další">&#8250;</button>
          </div>
          <div className="room-label">
            <img src="/images/zasilka/PS1A6864-HDR.webp" alt="Hostinský pokoj" loading="lazy" decoding="async" />
            <div className="room-label-text">
              <p>Pro vzácné hosty</p>
              <h3>Hostinský pokoj</h3>
            </div>
          </div>
        </div>

        {/* Technické zázemí */}
        <div className="room-row reveal">
          <div className="room-label">
            <img src="/images/zasilka/PS1A6874-HDR.webp" alt="Prádelna s pračkou a sušičkou" loading="lazy" decoding="async" />
            <div className="room-label-text">
              <p>Zázemí v&nbsp;pořádku</p>
              <h3>Technické zázemí</h3>
            </div>
          </div>
          <img src="/images/zasilka/PS1A6869-HDR.webp" alt="Kotelna - tepelné čerpadlo" loading="lazy" decoding="async" />
        </div>
      </section>

      {/* EXTERIOR */}
      <section id="exterior" className="rooms">
        <div className="rooms-header reveal">
          <p className="section-label">Exteriér</p>
          <h2 className="section-title">Hektar vlastního světa</h2>
          <div className="gold-line"></div>
        </div>
        <div className="exterior-grid reveal">
          <img className="wide" src="/images/zasilka/DJI_20260305151656_0025_D-HDR.webp" alt="Jarní panorama" loading="lazy" />
          <img src="/images/DJI_20260219124228_0023_D-HDR.webp" alt="Rezidence v zimě - ptačí pohled" loading="lazy" />
          <img src="/images/DJI_20260219124342_0030_D-HDR.webp" alt="Pozemek v zimě" loading="lazy" />
          <img src="/images/DJI_20260219124532_0040_D-HDR.webp" alt="Příjezdová cesta" loading="lazy" />
          <img src="/images/DJI_20260219124424_0034_D-HDR.webp" alt="Panoramatický výhled" loading="lazy" />
          <img src="/images/zasilka/DJI_20260305151440_0017_D-HDR.webp" alt="Jarní západ slunce" loading="lazy" />
          <img className="wide" src="/images/zasilka/DJI_20260305151850_0030_D-HDR.webp" alt="Rezidence v krajině" loading="lazy" />
        </div>
      </section>

      {/* LIFESTYLE */}
      <section className="lifestyle">
        <div className="reveal">
          <p className="section-label">Epilog</p>
          <h2 className="section-title">Přál bych si, aby ta duše,<br />kterou jsme domu vetkli,<br />žila dále.</h2>
          <div className="gold-line"></div>
          <p>
            Rozhodnutí o koupi u výjimečných nemovitostí vzniká emocí,
            ne tabulkou metrů čtverečních. Rezidence Pavlov čeká
            na svého správného kupce — na další kapitolu svého příběhu.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <div className="contact-inner">
          <div className="contact-info reveal">
            <p className="section-label">Kontakt</p>
            <h2 className="section-title">Napište další kapitolu</h2>
            <div className="gold-line"></div>
            <h3>Exkluzivní zastoupení</h3>
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
              <h3>Nezávazná poptávka</h3>
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <input type="text" name="name" placeholder="Jméno a příjmení" required />
                  </div>
                  <div className="form-group">
                    <input type="tel" name="phone" placeholder="Telefon" />
                  </div>
                </div>
                <div className="form-group">
                  <input type="email" name="email" placeholder="E-mail" required />
                </div>
                <div className="form-group">
                  <textarea name="message" placeholder="Vaše zpráva..."></textarea>
                </div>
                <button type="submit" className="form-submit" ref={formBtnRef}>Odeslat zprávu</button>
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
        <p>&copy; 2026 Petr Dadej. Všechna práva vyhrazena.</p>
      </footer>

      {/* DOWNLOAD TRIGGER */}
      <button id="dlTrigger" className="dl-trigger">Ke stažení</button>

      {/* DOWNLOAD OVERLAY */}
      <div id="dlOverlay" className="dl-overlay" />

      {/* DOWNLOAD PANEL */}
      <div id="dlPanel" className="dl-panel">
        <button id="dlClose" className="dl-close" aria-label="Zavřít">×</button>
        <p className="section-label">Dokumentace</p>
        <h3 className="dl-panel-title">Ke stažení</h3>
        <div className="gold-line"></div>
        <p>Technická dokumentace, půdorysy a podklady k nemovitosti.</p>
        <ul className="dl-list">
          <li>
            <a href="/documents/pudorys.pdf" download>
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
              Půdorys
            </a>
          </li>
          <li>
            <a href="/documents/pudorys-1np.pdf" download>
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
              Půdorys 1.NP
            </a>
          </li>
          <li>
            <a href="/documents/pudorys-1np-2.pdf" download>
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
              Půdorys 1.NP (varianta 2)
            </a>
          </li>
          <li>
            <a href="/documents/pohledy.pdf" download>
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
              Pohledy
            </a>
          </li>
          <li>
            <a href="/documents/rez-a.pdf" download>
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
              Řez A
            </a>
          </li>
          <li>
            <a href="/documents/zaklady.pdf" download>
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
              Základy
            </a>
          </li>
          <li>
            <a href="/documents/krov-vaznikovy.pdf" download>
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
              Krov vazníkový
            </a>
          </li>
          <li>
            <a href="/documents/situacni-vykres.pdf" download>
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
              Situační výkres
            </a>
          </li>
          <li>
            <a href="/documents/zamereni-pozemku.pdf" download>
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
              Zaměření pozemku
            </a>
          </li>
          <li>
            <a href="/documents/rozbor-vody.pdf" download>
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
              Rozbor vody
            </a>
          </li>
          <li>
            <a href="/documents/dokumentace-stavby.pdf" download>
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
              Dokumentace stavby
            </a>
          </li>
        </ul>
        <a href="/documents/rezidence-pavlov-dokumenty.zip" download className="dl-zip-btn">
          Stáhnout vše (ZIP)
        </a>
      </div>

      {/* DOWNLOAD GATE MODAL */}
      <div id="dlGateOverlay" className="dl-gate-overlay">
        <div id="dlGateModal" className="dl-gate-modal">
          <button id="dlGateClose" className="dl-close" aria-label="Zavřít">×</button>
          <p className="section-label">Dokumenty ke stažení</p>
          <h3 className="dl-panel-title">Zadejte e-mail</h3>
          <div className="gold-line"></div>
          <p>Pošleme vám potvrzení a budeme vás informovat o&nbsp;aktualizacích dokumentace.</p>
          <form id="dlGateForm">
            <div className="form-group">
              <input id="dlGateEmail" type="email" placeholder="Váš e-mail" required />
            </div>
            <button id="dlGateBtn" type="submit" className="form-submit">Stáhnout</button>
            <div id="dlGateMsg" className="form-message"></div>
          </form>
        </div>
      </div>

      {/* CURSOR TRAIL */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  );
}
