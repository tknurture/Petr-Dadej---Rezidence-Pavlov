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
    window.addEventListener('scroll', onScroll);

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
        setTimeout(eraseChar, 1500);
      }
    }

    function eraseChar() {
      if (!typewriterActive) return;
      charIdx--;
      if (charIdx >= 0) {
        if (textEl) textEl.textContent = phrase.slice(0, charIdx);
        setTimeout(eraseChar, eraseSpeed);
      } else {
        typedEl?.classList.remove('active');
        setTimeout(() => {
          lineEl?.classList.remove('hidden');
          charIdx = 0;
          setTimeout(showTyped, 2500);
        }, 300);
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

      function resize() {
        w = canvas!.width = window.innerWidth;
        h = canvas!.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      const onTouch = () => {
        isTouchDevice = true;
      };
      window.addEventListener('touchstart', onTouch, { once: true });

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
      };
      window.addEventListener('mousemove', onMouseMove);

      function draw() {
        if (isTouchDevice) {
          animFrame = requestAnimationFrame(draw);
          return;
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

        if (mouseX > 0 && mouseY > 0) {
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
      draw();

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
      {/* TOP BAR */}
      <div className="top-bar">
        <strong>Duben 2026</strong>
        <span className="top-bar-sep"></span>
        Přijímáme pouze <strong>2 nové klienty</strong>
        <span className="top-bar-hide-mobile"> — kapacita je omezená, aby každý projekt dostal 100% pozornosti</span>
        <a href="#contact">Zjistit více &rarr;</a>
      </div>

      {/* HEADER */}
      <header id="header" ref={headerRef}>
        <div className="logo">
          <img src="/images/ANAGRAM_PD_barva_final.png" alt="Petr Dadej" />
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
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-label">Pavlov 163</p>
          <h1 className="hero-title">Rezidence<br />Pavlov</h1>
          <p className="hero-subtitle">S výhledem na Mohelnici</p>
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
            Rezidence Pavlov není běžný rodinný dům. Je to místo s duší,
            které prošlo pečlivou rekonstrukcí a proměnilo se v rezidenci
            nad Mohelnicí s výhledem na Bouzov a&nbsp;Praděd.
          </p>
          <div className="highlight-quote">
            {'\u201ENezáleží jen na tom, kolik stojí,'}<br />{'\u00A0ale jakou hodnotu nabízí.\u201C'}
          </div>
          <p>
            Od prvních vizí přes měsíce rekonstrukce až po finální podobu
            — každý detail nese otisk péče a lásky k tomuto místu.
            Pojďte nahlédnout do příběhu, který čeká na další kapitolu.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stats-grid reveal">
          <div className="stat-item">
            <div className="stat-number">10 000</div>
            <div className="stat-label">m² pozemku</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">360°</div>
            <div className="stat-label">panoramatický výhled</div>
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
                s panoramatickým výhledem na Bouzov a Praděd. Místo,
                kde se rodí klid a absolutní soukromí. Hektar vlastního světa
                čekající na svůj příběh.
              </p>
            </div>
            <div className="tl-image reveal-right">
              <img src="/images/zasilka/DJI_20260305151850_0030_D-HDR.jpg" alt="Lokace - výhled nad Mohelnicí" loading="lazy" />
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 2 - Rekonstrukce */}
          <div className="tl-item">
            <div className="tl-content reveal-right">
              <p className="tl-year">Kapitola II</p>
              <h3 className="tl-title">Rekonstrukce s duší</h3>
              <p className="tl-desc">
                Kompletní rekonstrukce proměnila dům v rezidenci s jedinečným
                charakterem. Ruční zpracování detailů, patinované dveře,
                autorské povrchy stěn a pečlivě zvolené materiály.
                Každá místnost dostala vlastní identitu.
              </p>
            </div>
            <div className="tl-image reveal-left">
              <div className="tl-image-grid">
                <img src="/images/zasilka/PS1A6929-HDR.jpg" alt="Rekonstrukce - vstupní hala" loading="lazy" />
                <img src="/images/zasilka/PS1A6834-HDR.jpg" alt="Rekonstrukce - patinované dveře" loading="lazy" />
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
                Kuchyně s ručně barvenými modrými skříňkami, žulovým
                pultem a industriálním osvětlením se stala srdcem celého domu.
                Otevřený prostor propojený s obývací částí vytváří
                velkorysý společenský prostor pro rodinu i přátele.
              </p>
            </div>
            <div className="tl-image reveal-right">
              <div className="tl-image-grid">
                <img src="/images/zasilka/PS1A6939-HDR.jpg" alt="Kuchyně - celkový pohled" loading="lazy" />
                <img src="/images/zasilka/PS1A6959-HDR.jpg" alt="Kuchyně - detail" loading="lazy" />
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
                Velkorysý obývací prostor s přímým výstupem na zahradu
                a velkoformátovými okny, jimiž proudí přirozené světlo.
                Otevřený koncept propojuje kuchyni, jídelnu i obývací
                část v jeden harmonický celek.
              </p>
            </div>
            <div className="tl-image reveal-left">
              <img src="/images/zasilka/PS1A6989-HDR.jpg" alt="Obývací prostor" loading="lazy" />
            </div>
            <div className="tl-dot"></div>
          </div>

          {/* 5 - Ložnice */}
          <div className="tl-item">
            <div className="tl-content reveal-left">
              <p className="tl-year">Kapitola V</p>
              <h3 className="tl-title">Soukromý svět</h3>
              <p className="tl-desc">
                Ložnice s dekorativní kamennou stěnou a autorskou nástěnnou
                malbou inspirovanou Středomořím. Každý pokoj je originál
                — místo, kde se prolíná útulnost s uměním a kde
                se ráno probouzíte s výhledem do zeleně.
              </p>
            </div>
            <div className="tl-image reveal-right">
              <div className="tl-image-grid">
                <img src="/images/zasilka/PS1A6746-HDR.jpg" alt="Hlavní ložnice" loading="lazy" />
                <img src="/images/zasilka/PS1A6756-HDR.jpg" alt="Ložnice - nástěnná malba" loading="lazy" />
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
                které čeká na svého nového majitele. Místo s charakterem,
                výhledy a příběhem, který si zaslouží pokračování.
                Rezidence, která se stane vaším domovem.
              </p>
            </div>
            <div className="tl-image reveal-left">
              <img src="/images/zasilka/DJI_20260305151440_0017_D-HDR.jpg" alt="Rezidence dnes - jarní pohled" loading="lazy" />
            </div>
            <div className="tl-dot"></div>
          </div>
        </div>
      </section>

      {/* IMAGE BREAK */}
      <div className="image-break">
        <img src="/images/DJI_20260219124457_0037_D-HDR.jpg" alt="Rezidence Pavlov - zimní panorama" loading="lazy" />
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

        <div className="room-row reveal">
          <div className="room-label">
            <img src="/images/zasilka/PS1A6999-HDR.jpg" alt="Obývací prostor s kuchyní" loading="lazy" />
            <div className="room-label-text">
              <p>Otevřený koncept</p>
              <h3>Obývací prostor s kuchyní</h3>
            </div>
          </div>
          <img src="/images/zasilka/PS1A6944-HDR.jpg" alt="Kuchyně - modré skříňky" loading="lazy" />
        </div>

        <div className="room-row reverse reveal">
          <img src="/images/zasilka/PS1A6701-HDR.jpg" alt="Koupelna" loading="lazy" />
          <div className="room-label">
            <img src="/images/zasilka/PS1A6909-HDR.jpg" alt="Chodba" loading="lazy" />
            <div className="room-label-text">
              <p>Každý detail s péčí</p>
              <h3>Chodby a vstupy</h3>
            </div>
          </div>
        </div>

        <div className="room-row reveal">
          <div className="room-label">
            <img src="/images/zasilka/PS1A6849-HDR.jpg" alt="Modrá ložnice" loading="lazy" />
            <div className="room-label-text">
              <p>Klid a soukromí</p>
              <h3>Ložnice</h3>
            </div>
          </div>
          <img src="/images/zasilka/PS1A6864-HDR.jpg" alt="Ložnice detail" loading="lazy" />
        </div>

        <div className="room-row reverse reveal">
          <img src="/images/zasilka/PS1A6780-HDR.jpg" alt="Pracovna" loading="lazy" />
          <div className="room-label">
            <img src="/images/zasilka/PS1A6984-HDR.jpg" alt="Obývací pokoj" loading="lazy" />
            <div className="room-label-text">
              <p>Prostor pro inspiraci</p>
              <h3>Pracovna a obývací pokoj</h3>
            </div>
          </div>
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
          <img className="wide" src="/images/zasilka/DJI_20260305151656_0025_D-HDR.jpg" alt="Jarní panorama" loading="lazy" />
          <img src="/images/DJI_20260219124532_0040_D-HDR.jpg" alt="Zimní pohled" loading="lazy" />
          <img src="/images/DJI_20260219124342_0030_D-HDR.jpg" alt="Pozemek v zimě" loading="lazy" />
          <img src="/images/DJI_20260219124424_0034_D-HDR.jpg" alt="Panoramatický výhled" loading="lazy" />
          <img className="wide" src="/images/zasilka/DJI_20260305151440_0017_D-HDR.jpg" alt="Západ slunce nad rezidencí" loading="lazy" />
        </div>
      </section>

      {/* LIFESTYLE */}
      <section className="lifestyle">
        <div className="reveal">
          <p className="section-label">Epilog</p>
          <h2 className="section-title">Přál bych si, aby ta duše,<br />kterou jste domu vetkli,<br />žila dále.</h2>
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
            <img src="/images/petr-dadej.jpg" alt="Petr Dadej" loading="lazy" />
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
