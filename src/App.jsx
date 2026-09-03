import { useCallback, useEffect, useRef, useState } from 'react'

import './App.css'

function App() {

    const [toasts, setToasts] = useState([]);
  const notify = useCallback((msg) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts.slice(-2), { id, msg }]);
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 2800);
  }, []);
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = window.matchMedia('(pointer: fine)').matches;

/* ---------------- icons (hand-drawn, square caps — drafting-table feel) ---------------- */
const Svg = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" {...props} />
);
const IcArrowUpRight = (p) => <Svg {...p}><path d="M7 17L17 7M9 7h8v8"/></Svg>;
const IcArrowDown    = (p) => <Svg {...p}><path d="M12 4v15M6 13l6 6 6-6"/></Svg>;
const IcPlus         = (p) => <Svg {...p}><path d="M12 5v14M5 12h14"/></Svg>;
const IcCopy         = (p) => <Svg {...p}><rect x="9" y="9" width="11" height="11"/><path d="M5 15V4h11"/></Svg>;
const IcDownload     = (p) => <Svg {...p}><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></Svg>;
const Asterisk = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
       className={"spin-slow shrink-0 text-accent md:h-7 md:w-7 h-5 w-5 " + (p.className || "")}>
    <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/>
  </svg>
);

/* ---------------- data ---------------- */
const PROJECTS = [
  { id:'halcyon', name:'Halcyon', year:'2024', seed:'halcyon', role:'Design & full-stack', status:'In production',
    stack:['GO','REACT','POSTGRES','REDIS'],
    fact:'40k flag evaluations per second, p99 under 8ms.',
    blurb:'Feature-flag and kill-switch platform with edge evaluation. Rollouts, A/B splits and instant rollbacks behind one auditable API — with SDKs small enough to embed anywhere.' },
  { id:'cadence', name:'Cadence', year:'2024', seed:'cadence', role:'Creator', status:'Open source · MIT',
    stack:['TYPESCRIPT','WEBAUDIO','YJS','CANVAS'],
    fact:'A 200-track session holds 60fps on a five-year-old laptop.',
    blurb:'Collaborative step sequencer that runs entirely in the browser. CRDTs keep every cursor in sync; the whole audio engine is hand-rolled on WebAudio with a canvas-drawn timeline.' },
  { id:'ledgerline', name:'Ledgerline', year:'2023', seed:'ledgerline', role:'Creator', status:'Open source · MIT',
    stack:['RUST','SQLITE','WASM'],
    fact:'The whole double-entry core compiles to 12kb of WASM.',
    blurb:'A double-entry accounting engine for indie hackers. Immutable journal, typed postings, CSV and PDF export — all computed client-side. No server ever sees a number.' },
  { id:'papertrail', name:'Papertrail', year:'2023', seed:'papertrail', role:'Maintainer', status:'Open source · MIT',
    stack:['NODE','MDX','REMARK'],
    fact:'Powers the docs of 300+ open-source repositories.',
    blurb:'Git-native documentation generator. Docs live next to code, review through pull requests, and build to static pages in milliseconds — no CMS, no lock-in, no drama.' },
  { id:'ferry', name:'Ferry', year:'2022', seed:'ferry-dev', role:'Maintainer', status:'Stable · v2',
    stack:['GO','OPENAPI','CODEGEN'],
    fact:'Saves the team roughly six hours a week, every week.',
    blurb:'Typed API clients generated straight from OpenAPI specs. Write the contract once, get TypeScript, Go and Python clients with retries, auth and pagination for free.' },
];

const PRINCIPLES = [
  { title:'Boring is a feature.', body:'Proven tools and sleep-friendly architecture — nobody ever got paged at 2am for picking Postgres.' },
  { title:'Readability beats cleverness.', body:'Code is read a hundred times more than it is written. I write for the reader, not the reviewer.' },
  { title:'Measure, then optimize.', body:'Intuition proposes, profiling disposes. The data decides where the hours go.' },
  { title:'Design is a spec.', body:'An interface is an API for humans — version it, respect it, sweat the details.' },
];

const CAPABILITIES = [
  ['LANGUAGES', 'TypeScript · Rust · Go · Python · SQL'],
  ['FRONTEND',  'React · Next.js · Tailwind · WebAudio · Canvas & WebGL'],
  ['BACKEND',   'Node · Postgres · Redis · Kafka · gRPC'],
  ['INFRA',     'Docker · Kubernetes · Terraform · AWS'],
];

const ROLES = [
  { years:'2023 — NOW',  role:'Senior Software Engineer', org:'Northwind Labs', loc:'AMSTERDAM', note:'Payments infrastructure · team of 11' },
  { years:'2021 — 2023', role:'Software Engineer',        org:'Parallax',       loc:'BERLIN',    note:'Real-time collaboration engine' },
  { years:'2019 — 2021', role:'Frontend Engineer',        org:'Studio Metric',  loc:'ROTTERDAM', note:'Data-viz & design systems' },
  { years:'2018 — 2019', role:'Freelance Developer',      org:'Independent',    loc:'REMOTE',    note:'Fourteen shipped products' },
];

const TALKS = [
  { y:'2024', t:'WASM at the edge',             v:'JSNATION — AMSTERDAM' },
  { y:'2023', t:'The case for boring tech',     v:'SMASHING CONF — FREIBURG' },
  { y:'2022', t:'Variable fonts in production', v:'CSS DAY — AMSTERDAM' },
];

const CV_TEXT = `ADRIAN VOSS — SOFTWARE DEVELOPER
Amsterdam, NL · hello@adrianvoss.dev
------------------------------------------------------------
SENIOR SOFTWARE ENGINEER — Northwind Labs (2023–now)
  Payments infrastructure; led migration to an event-sourced ledger.
SOFTWARE ENGINEER — Parallax, Berlin (2021–2023)
  Real-time collaboration engine (CRDTs, WebSockets, Rust/WASM).
FRONTEND ENGINEER — Studio Metric, Rotterdam (2019–2021)
  Data visualisation, design systems, Canvas/WebGL.
FREELANCE DEVELOPER (2018–2019)
  Fourteen shipped products for studios and early-stage startups.
------------------------------------------------------------
STACK: TypeScript · Rust · Go · React · Node · Postgres · Kafka
OPEN SOURCE: Ledgerline · Papertrail · Cadence
TALKS: JSNation '24 · Smashing Conf '23 · CSS Day '22`;

/* ---------------- hooks & primitives ---------------- */
function useClock() {
  const [t, setT] = useState('--:--:--');
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/Amsterdam', hour12: false }));
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (REDUCED) { setInView(true); return; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={delay ? { transitionDelay: `${delay}ms` } : undefined}
         className={`reveal ${inView ? 'reveal-in' : ''} ${className}`}>
      {children}
    </div>
  );
}

function StubLink({ label, onClick, dark, className = '' }) {
  return (
    <button onClick={onClick}
      className={`group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] underline underline-offset-8 transition-colors ${dark ? 'text-paper/80 decoration-paper/30 hover:text-accent hover:decoration-accent' : 'text-ink decoration-ink/30 hover:text-accent hover:decoration-accent'} ${className}`}>
      {label}
      <IcArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/>
    </button>
  );
}

function SectionHead({ num, title, meta, dark }) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <div className={`flex items-end justify-between gap-6 border-t-2 ${dark ? 'border-paper' : 'border-ink'} pt-5`}>
        <div className="flex items-baseline gap-4 md:gap-6">
          <span className="font-mono text-xs tracking-widest text-accent">({num})</span>
          <h2 className="font-display text-4xl tracking-[-0.02em] md:text-6xl">{title}</h2>
        </div>
        {meta && <span className={`hidden shrink-0 pb-1 font-mono text-[10px] tracking-[0.2em] md:block ${dark ? 'text-paper/50' : 'text-ink/50'}`}>{meta}</span>}
      </div>
    </Reveal>
  );
}

/* ---------------- custom cursor ---------------- */
function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    if (!FINE || REDUCED) return;
    document.documentElement.classList.add('has-cursor');
    const el = ref.current;
    let x = -100, y = -100, tx = x, ty = y, s = 1, ts = 1, raf;
    const move = (e) => {
      tx = e.clientX; ty = e.clientY;
      ts = e.target.closest && e.target.closest('a, button') ? 2.8 : 1;
    };
    const loop = () => {
      x += (tx - x) * 0.22; y += (ty - y) * 0.22; s += (ts - s) * 0.16;
      el.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${s.toFixed(3)})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    addEventListener('mousemove', move);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      cancelAnimationFrame(raf);
      removeEventListener('mousemove', move);
    };
  }, []);
  if (!FINE || REDUCED) return null;
  return <div ref={ref} className="cursor-dot"/>;
}

/* ---------------- header ---------------- */
function Header() {
  const time = useClock();
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - innerHeight;
        setPct(max > 0 ? Math.round((scrollY / max) * 100) : 0);
      });
    };
    addEventListener('scroll', on, { passive: true });
    on();
    return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-5 md:px-10">
        <a href="#top" className="font-mono text-xs font-bold tracking-[0.2em]">
          AV<span className="text-accent">/</span>FOLIO—25
        </a>
        <nav className="hidden items-center gap-8 font-mono text-[11px] tracking-[0.18em] md:flex">
          {[['01','WORK','#work'],['02','ABOUT','#about'],['03','EXPERIENCE','#experience'],['04','CONTACT','#contact']].map(([n, l, h]) => (
            <a key={n} href={h} className="group relative py-2">
              <span className="mr-1.5 text-accent">{n}</span>{l}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full"/>
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4 font-mono text-[11px] tracking-widest">
          <span className="hidden text-ink/60 sm:inline">AMS {time}</span>
          <span className="hidden text-ink/60 tabular-nums lg:inline">SCR {String(pct).padStart(3,'0')}%</span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70"/>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"/>
            </span>
            OPEN Q3
          </span>
        </div>
      </div>
    </header>
  );
}

/* ---------------- hero ---------------- */
function useLens(ref) {
  useEffect(() => {
    if (REDUCED || !FINE) return;
    const root = ref.current;
    if (!root) return;
    const els = [...root.querySelectorAll('.hl')];
    if (!els.length) return;
    const st = els.map((el) => ({ el, w: 430, t: 430 }));
    const MIN = 430, MAX = 810, R = 190;
    let mx = -9999, my = -9999, raf = null;
    const tick = () => {
      let live = false;
      for (const s of st) {
        const r = s.el.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my);
        s.t = d >= R ? MIN : MAX - (MAX - MIN) * (1 - d / R);
        s.w += (s.t - s.w) * 0.18;
        if (Math.abs(s.t - s.w) > 0.4) live = true;
        s.el.style.fontVariationSettings = `"opsz" 144, "wght" ${s.w.toFixed(1)}`;
      }
      raf = live ? requestAnimationFrame(tick) : null;
    };
    const kick = () => { if (raf == null) raf = requestAnimationFrame(tick); };
    const move = (e) => { mx = e.clientX; my = e.clientY; kick(); };
    const leave = () => { mx = -9999; my = -9999; kick(); };
    root.addEventListener('mousemove', move);
    root.addEventListener('mouseleave', leave);
    return () => {
      root.removeEventListener('mousemove', move);
      root.removeEventListener('mouseleave', leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

function Stamp() {
  return (
    <span className="relative block h-28 w-28">
      <svg viewBox="0 0 120 120" className="spin-slower h-full w-full text-ink">
        <defs>
          <path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/>
        </defs>
        <text fill="currentColor" fontSize="10" letterSpacing="2" fontFamily="'JetBrains Mono', monospace">
          <textPath href="#circ" textLength="286">OPEN TO WORK · AMSTERDAM · SOFTWARE ·</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <IcArrowDown className="h-5 w-5"/>
      </span>
    </span>
  );
}

function Hero({ notify }) {
  const heroRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  useLens(heroRef);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  const downloadCV = () => {
    const blob = new Blob([CV_TEXT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'adrian-voss_cv.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('CV SAVED — ADRIAN-VOSS_CV.TXT');
  };

  const lines = [
    { words: ['I', 'build'],                 cls: '',                  wrap: '' },
    { words: ['deliberate'],                 cls: 'italic text-accent', wrap: 'pl-[7vw]' },
    { words: ['software.'],                  cls: '',                  wrap: 'text-right' },
  ];

  return (
    <section id="top" ref={heroRef} className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mb-10 flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-ink/60">
          <Reveal><span>PORTFOLIO — 2025 EDITION</span></Reveal>
          <Reveal delay={80}><span className="hidden sm:inline">52.3676° N, 4.9041° E</span></Reveal>
        </div>

        <h1 aria-label="I build deliberate software." className={`select-none ${loaded ? 'loaded' : ''}`}>
          <span aria-hidden="true" className="block">
            {lines.map((ln, i) => (
              <span key={i} className={`line-mask block ${ln.wrap}`}>
                <span style={{ transitionDelay: `${120 + i * 110}ms` }}
                      className={`line-inner block font-display text-[clamp(3.4rem,11.5vw,11rem)] leading-[0.95] tracking-[-0.03em] ${ln.cls}`}>
                  {ln.words.map((w, wi) => (
                    <span key={wi} className="inline-block whitespace-nowrap">
                      {w.split('').map((ch, ci) => <span key={ci} className="hl inline-block">{ch}</span>)}
                      {wi < ln.words.length - 1 ? '\u00A0' : null}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-12 grid gap-10 border-t border-ink/15 pt-8 md:mt-16 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div>
            <Reveal>
              <p className="max-w-md text-lg leading-relaxed text-ink/75">
                Full-stack developer in Amsterdam. Nine years shipping distributed systems and the interfaces
                on top of them — software that stays boring in production and obvious in the hand.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#work" className="group inline-flex items-center gap-3 bg-ink px-6 py-4 font-mono text-[11px] tracking-[0.2em] text-paper transition-colors hover:bg-accent hover:text-ink">
                  SEE THE WORK <IcArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5"/>
                </a>
                <button onClick={downloadCV} className="inline-flex items-center gap-3 border border-ink/30 px-6 py-4 font-mono text-[11px] tracking-[0.2em] transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                  DOWNLOAD CV <IcDownload className="h-4 w-4"/>
                </button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={160} className="md:justify-self-end">
            <dl className="grid gap-5 border-l border-ink/15 pl-6 font-mono text-[11px] tracking-[0.15em] md:min-w-[300px]">
              <div><dt className="text-ink/45">CURRENTLY</dt><dd className="mt-1">SR. ENGINEER — NORTHWIND LABS</dd></div>
              <div><dt className="text-ink/45">FOCUS</dt><dd className="mt-1">DISTRIBUTED SYSTEMS · DEV TOOLING</dd></div>
              <div>
                <dt className="text-ink/45">STATUS</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70"/>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"/>
                  </span>
                  OPEN FOR Q3 2025
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>

      <button aria-label="Scroll to selected work"
              onClick={() => document.getElementById('work').scrollIntoView({ behavior: 'smooth' })}
              className="absolute right-[7vw] top-40 hidden xl:block">
        <Stamp/>
      </button>
    </section>
  );
}

/* ---------------- marquee ---------------- */
function Marquee() {
  const items = ['TYPESCRIPT','REACT','RUST','POSTGRES','NODE','GO','KAFKA','REDIS','WASM','NEXT.JS','TAILWIND','GRPC'];
  const Half = ({ hidden }) => (
    <div aria-hidden={hidden ? 'true' : undefined} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 font-display text-2xl italic tracking-tight md:px-10 md:text-4xl">{t}</span>
          <Asterisk/>
        </span>
      ))}
    </div>
  );
  return (
    <section className="overflow-hidden bg-ink py-5 text-paper md:py-6" aria-label="Technologies">
      <div className="marquee-track flex w-max"><Half/><Half hidden/></div>
    </section>
  );
}

/* ---------------- selected work ---------------- */
function Preview({ hover }) {
  const ref = useRef(null);
  const hoverRef = useRef(hover);
  hoverRef.current = hover;
  useEffect(() => {
    const el = ref.current;
    const st = { x: innerWidth / 2, y: innerHeight / 2, tx: innerWidth / 2, ty: innerHeight / 2, r: 0, o: 0 };
    const move = (e) => { st.tx = e.clientX; st.ty = e.clientY; };
    addEventListener('mousemove', move);
    let raf;
    const loop = () => {
      st.x += (st.tx - st.x) * 0.13;
      st.y += (st.ty - st.y) * 0.13;
      st.r += (Math.max(-11, Math.min(11, (st.tx - st.x) * 0.3)) - st.r) * 0.12;
      st.o += ((hoverRef.current ? 1 : 0) - st.o) * 0.12;
      el.style.opacity = st.o.toFixed(3);
      el.style.transform = `translate3d(${st.x.toFixed(1)}px,${st.y.toFixed(1)}px,0) translate(-50%,-115%) rotate(${st.r.toFixed(2)}deg) scale(${(0.85 + 0.15 * st.o).toFixed(3)})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', move); };
  }, []);
  return (
    <div ref={ref} style={{ opacity: 0 }} className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[230px] w-[350px] lg:block">
      {PROJECTS.map((p) => (
        <div key={p.id} className={`absolute inset-0 overflow-hidden bg-accent transition-opacity duration-150 ${hover === p.id ? 'opacity-100' : 'opacity-0'}`}>
          <img alt="" src={`https://picsum.photos/seed/${p.seed}/700/460.jpg`}
               className="h-full w-full object-cover grayscale contrast-125 mix-blend-multiply"/>
          <span className="absolute bottom-2.5 left-3 bg-paper px-1.5 py-0.5 font-mono text-[9px] tracking-[0.2em] text-ink">
            {p.name.toUpperCase()} — {p.year}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProjectRow({ p, i, open, onToggle, onHover, notify }) {
  return (
    <div className="border-t border-ink/20">
      <button onClick={onToggle} onMouseEnter={onHover} aria-expanded={open}
        className={`group grid w-full grid-cols-[2.2rem_1fr_auto] items-center gap-x-4 py-6 text-left transition-colors duration-300 md:grid-cols-[3.5rem_1fr_9rem_4rem_2.5rem] md:gap-x-6 md:py-8 ${open ? 'bg-ink text-paper' : 'hover:bg-ink hover:text-paper'}`}>
        <span className={`font-mono text-[11px] tracking-widest ${open ? 'text-accent' : 'text-ink/45 group-hover:text-accent'}`}>
          {String(i + 1).padStart(2, '0')}
        </span>
        <span className="font-display text-[1.65rem] leading-none tracking-[-0.01em] transition-all duration-300 group-hover:translate-x-2 group-hover:italic md:text-5xl">
          {p.name}
        </span>
        <span className="hidden text-right font-mono text-[10px] tracking-[0.15em] opacity-50 md:block">
          {p.stack.slice(0, 3).join(' · ')}
        </span>
        <span className="hidden text-right font-mono text-xs opacity-60 md:block">{p.year}</span>
        <span className={`flex h-9 w-9 items-center justify-center justify-self-end rounded-full border transition-all duration-300 ${open ? 'rotate-45 border-accent text-accent' : 'border-current opacity-40 group-hover:opacity-90'}`}>
          <IcPlus className="h-4 w-4"/>
        </span>
      </button>

      <div className={`acc ${open ? 'open' : ''}`}>
        <div>
          <div className="grid gap-10 py-10 md:grid-cols-2 md:gap-16 md:pl-[5rem]">
            <div>
              <p className="max-w-xl font-display text-lg leading-relaxed text-ink/80 md:text-xl">{p.blurb}</p>
              <p className="mt-6 border-l-2 border-accent pl-4 font-display text-xl italic md:text-2xl">{p.fact}</p>
              <dl className="mt-8 grid grid-cols-3 gap-4 font-mono text-[10px] tracking-[0.15em]">
                <div><dt className="text-ink/45">ROLE</dt><dd className="mt-1.5">{p.role.toUpperCase()}</dd></div>
                <div><dt className="text-ink/45">STATUS</dt><dd className="mt-1.5">{p.status.toUpperCase()}</dd></div>
                <div><dt className="text-ink/45">YEAR</dt><dd className="mt-1.5">{p.year}</dd></div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-6">
                <StubLink label="CASE STUDY" onClick={() => notify(`“${p.name}” is a demo entry — no case study behind this door.`)}/>
                <StubLink label="SOURCE" onClick={() => notify('Source links stay local in this demo.')}/>
              </div>
            </div>
            <div>
              <div className="bg-accent">
                <img alt={`${p.name} interface preview`} src={`https://picsum.photos/seed/${p.seed}/840/525.jpg`}
                     className="aspect-[16/10] w-full object-cover grayscale contrast-125 mix-blend-multiply"/>
              </div>
              <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-ink/50">
                FIG. {String(i + 1).padStart(2, '0')} — {p.name.toUpperCase()} / INTERFACE
              </p>
              <p className="mt-5 font-mono text-[10px] leading-relaxed tracking-[0.15em] text-ink/60">{p.stack.join('  ·  ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Work({ notify }) {
  const [open, setOpen] = useState(null);
  const [hover, setHover] = useState(null);
  return (
    <section id="work" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead num="01" title="Selected work" meta="2022 — 2025 · FIVE PROJECTS"/>
        <Reveal>
          <p className="mb-10 font-mono text-[11px] tracking-[0.2em] text-ink/50">
            {FINE ? 'HOVER TO PREVIEW — CLICK A ROW FOR THE NOTES' : 'TAP A ROW FOR THE NOTES'}
          </p>
        </Reveal>
        <div className="border-b border-ink/20" onMouseLeave={() => setHover(null)}>
          {PROJECTS.map((p, i) => (
            <ProjectRow key={p.id} p={p} i={i} notify={notify}
              open={open === p.id}
              onToggle={() => setOpen(open === p.id ? null : p.id)}
              onHover={() => { if (FINE) setHover(p.id); }}/>
          ))}
        </div>
      </div>
      {FINE && <Preview hover={hover}/>}
    </section>
  );
}

/* ---------------- about ---------------- */
function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-ink py-24 text-paper md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead dark num="02" title="About" meta="THE PERSON BEHIND THE COMMITS"/>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <Reveal>
                <div className="bg-paper">
                  <img alt="Portrait of Adrian Voss" src="https://picsum.photos/seed/voss-portrait/620/780.jpg"
                       className="aspect-[4/5] w-full object-cover grayscale contrast-125 mix-blend-multiply"/>
                </div>
                <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-paper/50">FIG. 00 — A.VOSS, PROBABLY REFACTORING</p>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Reveal>
              <p className="max-w-2xl font-display text-2xl leading-snug md:text-[2.6rem] md:leading-[1.15]">
                I treat software as a <em className="text-accent">craft</em> — nine years across startups and studios,
                from real-time collaboration engines to payment rails that can't afford drama.
              </p>
            </Reveal>
            <div className="mt-10 grid max-w-2xl gap-6 text-base leading-relaxed text-paper/70 md:grid-cols-2">
              <Reveal delay={80}>
                <p>I started in design, drifted into frontend, and kept going until the servers answered too. These days I live comfortably across the stack — happiest somewhere near the boundary where systems thinking meets interface detail.</p>
              </Reveal>
              <Reveal delay={140}>
                <p>Outside the editor I write about engineering, give the occasional talk, and maintain a small orchard of open-source tools that real teams depend on. Slow coffee, fast feedback loops.</p>
              </Reveal>
            </div>

            <Reveal className="mt-16 md:mt-20">
              <h3 className="mb-2 font-mono text-[11px] tracking-[0.25em] text-paper/45">WORKING PRINCIPLES</h3>
            </Reveal>
            <div className="border-b border-paper/15">
              {PRINCIPLES.map((pr, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-t border-paper/15 py-6 md:grid-cols-[4rem_1fr_1fr] md:gap-8">
                    <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display text-xl md:text-2xl">{pr.title}</span>
                    <span className="col-span-2 pl-12 font-mono text-[11px] leading-relaxed tracking-wide text-paper/55 md:col-span-1 md:pl-0">{pr.body}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-16">
              <h3 className="mb-2 font-mono text-[11px] tracking-[0.25em] text-paper/45">CAPABILITIES</h3>
            </Reveal>
            <div className="border-b border-paper/15">
              {CAPABILITIES.map(([label, items]) => (
                <div key={label} className="grid grid-cols-1 gap-1 border-t border-paper/15 py-5 transition-all duration-300 hover:pl-3 md:grid-cols-[10rem_1fr] md:gap-6">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-accent">{label}</span>
                  <span className="font-display text-lg text-paper/85">{items}</span>
                </div>
              ))}
            </div>

            <div className="mt-14 grid gap-8 font-mono text-[11px] tracking-[0.15em] sm:grid-cols-3">
              {[['READING', '“Designing Data-Intensive Applications”, again'],
                ['LISTENING', 'Floating Points — Cascade'],
                ['BUILDING', 'a tiny HTTP router in Rust']].map(([k, v]) => (
                <Reveal key={k}>
                  <div>
                    <p className="text-paper/45">{k}</p>
                    <p className="mt-2 font-display text-base italic tracking-normal text-paper/90">{v}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- experience ---------------- */
function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead num="03" title="Experience" meta="2018 — PRESENT"/>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <div className="border-b border-ink/20">
              {ROLES.map((r, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="group grid gap-2 border-t border-ink/20 py-7 transition-all duration-300 hover:pl-3 md:grid-cols-[10rem_1fr_auto] md:items-baseline md:gap-6">
                    <span className="font-mono text-[11px] tracking-[0.15em] text-ink/50 transition-colors group-hover:text-accent">{r.years}</span>
                    <div>
                      <p className="font-display text-2xl md:text-3xl">
                        {r.role} <span className="text-ink/40">·</span> <span className="italic">{r.org}</span>
                      </p>
                      <p className="mt-1.5 font-mono text-[10px] tracking-[0.15em] text-ink/50">{r.note.toUpperCase()}</p>
                    </div>
                    <span className="font-mono text-[11px] tracking-[0.15em] text-ink/50">{r.loc}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <Reveal><h3 className="mb-6 font-mono text-[11px] tracking-[0.25em] text-ink/45">STAGE & PAGE</h3></Reveal>
            <div className="border-b border-ink/20">
              {TALKS.map((t, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="flex items-baseline justify-between gap-4 border-t border-ink/20 py-5 transition-all duration-300 hover:pl-2">
                    <div>
                      <p className="font-display text-lg italic">{t.t}</p>
                      <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-ink/50">{t.v}</p>
                    </div>
                    <span className="font-mono text-[11px] text-ink/45">{t.y}</span>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <p className="mt-8 font-mono text-[11px] leading-relaxed tracking-[0.1em] text-ink/50">
                OCCASIONAL ESSAYS ON SYSTEMS, TYPE AND THE CRAFT OF BORING SOFTWARE — COLLECTED IN THE NEWSLETTER, “THE GRAIN”.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- contact + footer ---------------- */
function Contact({ notify }) {
  const copyEmail = async () => {
    const em = 'hello@adrianvoss.dev';
    try { await navigator.clipboard.writeText(em); }
    catch (e) {
      const ta = document.createElement('textarea');
      ta.value = em; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
    }
    notify('EMAIL COPIED — TALK SOON.');
  };

  return (
    <section id="contact" className="scroll-mt-20 bg-ink pt-24 text-paper md:pt-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead dark num="04" title="Contact" meta="REPLIES WITHIN 24H"/>
        <Reveal>
          <h3 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[1.02] tracking-[-0.02em]">
            Got something <em className="text-accent">worth building</em>?
          </h3>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10 md:mt-16 md:flex-row md:items-center md:justify-between">
          <Reveal>
            <button onClick={copyEmail}
              className="group inline-flex items-center gap-5 border border-paper/30 px-7 py-5 font-mono text-sm tracking-[0.12em] transition-colors hover:border-paper hover:bg-paper hover:text-ink md:text-base">
              hello@adrianvoss.dev
              <IcCopy className="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100"/>
            </button>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-xs font-mono text-[11px] leading-relaxed tracking-[0.12em] text-paper/50">
              CURRENTLY BOOKING Q3 2025 · AMSTERDAM / REMOTE · CET (UTC+1)
            </p>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-paper/15 pt-8">
          {['GITHUB', 'LINKEDIN', 'X / TWITTER', 'READ.CV'].map((s) => (
            <StubLink key={s} dark label={s} onClick={() => notify('Socials stay local in this demo — email works best.')}/>
          ))}
        </div>

        <footer className="mt-16 flex flex-col gap-4 border-t border-paper/15 py-7 font-mono text-[10px] tracking-[0.18em] text-paper/45 md:flex-row md:items-center md:justify-between">
          <span>© 2025 ADRIAN VOSS — BUILT WITH REACT & TAILWIND</span>
          <FooterTime/>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group inline-flex items-center gap-2 transition-colors hover:text-paper">
            BACK TO TOP
            <IcArrowUpRight className="h-3.5 w-3.5 -rotate-45 transition-transform group-hover:-translate-y-0.5"/>
          </button>
        </footer>
      </div>
    </section>
  );
}

function FooterTime() {
  const t = useClock();
  return <span className="tabular-nums">LOCAL — {t} CET</span>;
}

/* ---------------- toasts ---------------- */
function Toasts({ items }) {
  return (
    <div className="pointer-events-none fixed bottom-6 left-5 z-[100] flex flex-col gap-2 md:left-10">
      {items.map((t) => (
        <div key={t.id} className="toast-in border-l-2 border-accent bg-ink px-4 py-3 font-mono text-[11px] tracking-[0.12em] text-paper shadow-2xl">
          {t.msg}
        </div>
      ))}
    </div>
  );
}


  return (
    <div  class="bg-paper text-ink font-display antialiased">
     <Header/>
      <main>
        <Hero notify={notify}/>
        <Marquee/>
        <Work notify={notify}/>
        <About/>
        <Experience/>
        <Contact notify={notify}/>
      </main>
    </div>
  )
}

export default App
