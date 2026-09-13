import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import {
  Mail, Phone, Download, MapPin, Linkedin, Github,
  ChevronRight, ChevronUp, Shield, Menu, X, Award, BookOpen, Zap, Compass
} from 'lucide-react';
import { SplineScene } from '@/components/ui/spline-scene';
import { Spotlight } from '@/components/ui/spotlight';
import { CHRIS_DATA, EXPERIENCE, SKILLS, EDUCATION, CERTIFICATIONS } from './constants';
import heroPoster from './assets/hero-poster.webp';
import heroPoster2x from './assets/hero-poster-2x.webp';

// Loaded after the first render so the hero text paints before any WebGL work starts.
const AuroraBackground = lazy(() => import('@/components/ui/aurora-background'));

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];
const SECTION_IDS = ['hero', ...NAV_ITEMS.map((item) => item.id)];
const SPLINE_SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';
const MAIL_HREF = `mailto:${CHRIS_DATA.email}`;
const TEL_HREF = `tel:+1${CHRIS_DATA.phone.replace(/\D/g, '')}`;

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // The WebGL background only exists in the browser; keeping it out of the prerendered HTML
  // avoids a suspended boundary during hydration.
  useEffect(() => setMounted(true), []);

  // Scroll progress bar and scroll-to-top toggle. One passive listener, at most one update per
  // frame, and the bar is scaled with a transform so scrolling never triggers layout.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${ratio})`;
      setShowScrollTop(window.scrollY > 500);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Active nav item and reveal-on-scroll, both from IntersectionObserver.
  useEffect(() => {
    const intersecting = new Set<string>();
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        });
        const current = SECTION_IDS.find((id) => intersecting.has(id));
        if (current) setActiveSection(current);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -100px 0px' }
    );
    document.querySelectorAll('.reveal:not(.active)').forEach((el) => revealObserver.observe(el));

    return () => {
      sectionObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  // Mobile menu: Escape closes it and returns focus to the toggle, the page behind it does not
  // scroll, and it closes itself if the viewport grows into the desktop layout.
  useEffect(() => {
    if (!isMenuOpen) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      menuButtonRef.current?.focus();
      setIsMenuOpen(false);
    };
    const onViewportChange = () => {
      if (desktop.matches) setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onViewportChange);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onViewportChange);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Section links use native fragment navigation (smooth scrolling and the header offset come
  // from CSS), so focus and screen reader position move to the section.
  const closeMenu = () => setIsMenuOpen(false);

  const handleDownload = () => {
    window.print();
  };

  const fabVisible = showScrollTop && !isMenuOpen;

  return (
    <div className="relative min-h-screen text-slate-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[110] focus:rounded-xl focus:bg-blue-600 focus:px-5 focus:py-3 focus:font-bold focus:text-white"
      >
        Skip to content
      </a>

      <div className="aurora-fallback" aria-hidden="true" />
      {mounted && (
        <Suspense fallback={null}>
          <AuroraBackground />
        </Suspense>
      )}

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none" aria-hidden="true">
        <div
          ref={progressRef}
          className="h-full w-full origin-left bg-blue-500 shadow-[0_0_15px_#3b82f6]"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Scroll to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
        aria-label="Scroll to top"
        inert={!fabVisible}
        className={`fixed bottom-8 right-8 z-[95] p-4 bg-blue-600 rounded-2xl shadow-2xl transition-all duration-500 transform ${fabVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}
      >
        <ChevronUp size={24} aria-hidden="true" />
      </button>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[90] bg-slate-950/60 backdrop-blur-xl border-b border-white/5">
        <nav aria-label="Primary" className="max-w-7xl mx-auto px-6 lg:px-12 h-20 lg:h-24 flex justify-between items-center">
          <a href="#hero" className="flex items-center gap-4 group">
            <span className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:rotate-6" aria-hidden="true">CC</span>
            <span className="text-left">
              <span className="block text-xl font-bold tracking-tight">{CHRIS_DATA.name}</span>
              <span className="block text-[10px] uppercase font-black tracking-widest text-blue-400">{CHRIS_DATA.title}</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-2">
            {NAV_ITEMS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeSection === id ? 'location' : undefined}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${activeSection === id ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400 hover:text-white'}`}
              >
                {label}
              </a>
            ))}
            <div className="w-px h-6 bg-white/10 mx-4" aria-hidden="true" />
            <button type="button" onClick={handleDownload} className="px-6 py-3 bg-white text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:text-white transition-all">
              <Download className="inline w-4 h-4 mr-2" aria-hidden="true" /> Resume
            </button>
          </div>

          <button
            type="button"
            ref={menuButtonRef}
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={32} aria-hidden="true" /> : <Menu size={32} aria-hidden="true" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        inert={!isMenuOpen}
        className={`lg:hidden fixed inset-0 z-[85] overflow-y-auto overscroll-contain bg-slate-950/95 backdrop-blur-xl px-8 pb-8 pt-28 sm:pt-32 transition-all duration-500 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}
      >
        <nav aria-label="Mobile" className="space-y-6">
          {NAV_ITEMS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={closeMenu} className="block text-3xl sm:text-4xl font-black border-b border-white/5 pb-4">
              {label}
            </a>
          ))}
          <button type="button" onClick={handleDownload} className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-xl">
            Download Resume
          </button>
        </nav>
      </div>

      <main id="main" inert={isMenuOpen} className="relative z-10">
        {/* Hero */}
        <section id="hero" aria-label="Introduction" className="relative px-6 lg:px-12 pt-28 pb-16 lg:pt-40 lg:pb-28">
          <div className="max-w-7xl mx-auto reveal active">
            <div className="relative flex flex-col w-full min-h-[640px] lg:min-h-[660px] overflow-hidden bg-black/[0.9] border border-white/10 rounded-[2.5rem] shadow-2xl shadow-blue-500/10">
              <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />

              <div className="flex flex-1 flex-col lg:flex-row">
                <div className="flex-1 p-8 lg:p-14 relative z-10 flex flex-col justify-center">
                  <div className="inline-flex items-center self-start px-4 py-2 rounded-2xl bg-blue-600/10 border border-blue-600/20 text-blue-400 mb-8">
                    <Zap size={16} className="mr-2 fill-blue-400" aria-hidden="true" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{CHRIS_DATA.subtitle}</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl xl:text-6xl font-black leading-[0.95] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                    Resilient<br />Infrastructure<br />Architect.
                  </h1>

                  <p className="mt-6 text-neutral-300 max-w-lg text-base lg:text-lg leading-relaxed">
                    Hardening hybrid cloud and on-prem ecosystems through <span className="text-white font-semibold">automation</span> and <span className="text-white font-semibold">strategic engineering</span>, turning complexity into uptime.
                  </p>

                  <div className="mt-9 flex flex-wrap gap-4">
                    <button type="button" onClick={handleDownload} className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95">
                      <Download className="inline w-5 h-5 mr-2 -mt-1" aria-hidden="true" /> Download Resume
                    </button>
                    <a href="#experience" className="px-8 py-4 bg-white/5 border border-white/10 font-black rounded-2xl hover:bg-white/10 transition-all">
                      View Experience
                    </a>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-400 font-medium">
                    <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-blue-400" aria-hidden="true" /> {CHRIS_DATA.location}</span>
                    <a href={MAIL_HREF} className="inline-flex items-center gap-2 hover:text-white transition-colors"><Mail size={16} className="text-blue-400" aria-hidden="true" /> {CHRIS_DATA.email}</a>
                    <a href={TEL_HREF} className="inline-flex items-center gap-2 hover:text-white transition-colors"><Phone size={16} className="text-blue-400" aria-hidden="true" /> {CHRIS_DATA.phone}</a>
                  </div>
                </div>

                <SplineScene
                  scene={SPLINE_SCENE_URL}
                  poster={heroPoster}
                  posterSrcSet={`${heroPoster} 583w, ${heroPoster2x} 1166w`}
                  className="flex-1 h-[320px] sm:h-[400px] lg:h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" aria-labelledby="about-heading" className="relative overflow-hidden py-24 lg:py-32 bg-slate-950/75 border-y border-white/5 reveal">
          <div className="ombre-glow top-0 right-0 -mr-40 mt-20 opacity-40" aria-hidden="true"></div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="lg:w-[440px] shrink-0">
                <div className="group relative w-72 h-72 md:w-[420px] md:h-[420px] mx-auto rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10 bg-slate-900">
                  <img
                    src={CHRIS_DATA.profileImage}
                    srcSet={`${CHRIS_DATA.profileImageSmall} 400w, ${CHRIS_DATA.profileImage} 800w`}
                    sizes="(min-width: 768px) 420px, 288px"
                    width={800}
                    height={800}
                    alt={CHRIS_DATA.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" aria-hidden="true"></div>
                  <div className="absolute bottom-8 left-8 right-8 p-6 glass-card rounded-3xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white" aria-hidden="true"><Compass className="animate-spin-slow" /></div>
                      <div className="text-left"><p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Active Stack</p><p className="text-sm font-bold">Hybrid Cloud &amp; Security</p></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 text-left">
                <p className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase mb-4">The Brand Story</p>
                <h2 id="about-heading" className="text-4xl lg:text-6xl font-black tracking-tighter mb-8">Taming Complexity.</h2>
                {CHRIS_DATA.bio.map((paragraph, i) => (
                  <p
                    key={i}
                    className={i === 0
                      ? 'text-lg lg:text-xl text-slate-300 font-medium leading-relaxed mb-6'
                      : `text-base text-slate-400 leading-relaxed ${i === CHRIS_DATA.bio.length - 1 ? 'mb-12' : 'mb-6'}`}
                  >
                    {paragraph}
                  </p>
                ))}
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {CHRIS_DATA.kpis.map((kpi) => (
                    <div key={kpi.label} className="glass-card rounded-3xl p-6 text-center flex flex-col-reverse">
                      <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-3 leading-tight">{kpi.label}</dt>
                      <dd className="text-3xl lg:text-4xl font-black text-blue-300 leading-tight [text-shadow:0_0_24px_rgba(96,165,250,0.4)]">{kpi.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" aria-labelledby="experience-heading" className="py-24 lg:py-40 bg-slate-950/80 reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16 lg:mb-32">
              <p className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase mb-4">Impact Analysis</p>
              <h2 id="experience-heading" className="text-5xl lg:text-8xl font-black tracking-tighter">Professional Velocity.</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              {EXPERIENCE.map((exp) => (
                <article key={`${exp.company}-${exp.period}`} className="glass-card p-7 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] group hover:bg-slate-800/40 transition-all text-left">
                  <div className="mb-8">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-black uppercase mb-4">{exp.period}</span>
                    <h3 className="text-2xl sm:text-3xl font-black mb-2">{exp.role}</h3>
                    <p className="text-lg sm:text-xl font-bold text-slate-400">{exp.company} // {exp.location}</p>
                  </div>
                  <ul className="space-y-4">
                    {exp.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start text-slate-400 font-medium leading-relaxed group-hover:text-slate-200 transition-colors">
                        <ChevronRight size={18} className="mr-3 mt-1 text-blue-500 shrink-0" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" aria-labelledby="skills-heading" className="py-24 lg:py-40 bg-slate-950/70 reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16 lg:mb-24">
              <p className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase mb-4">Capability Matrix</p>
              <h2 id="skills-heading" className="text-5xl lg:text-7xl font-black tracking-tighter">Engineering Arsenal.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {SKILLS.map((cat) => (
                <div key={cat.title} className="glass-card p-7 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] hover:border-blue-500/20 transition-all text-left">
                  <h3 className="text-2xl font-black text-blue-400 mb-8">{cat.title}</h3>
                  <ul className="flex flex-wrap gap-3">
                    {cat.skills.map((skill) => (
                      <li key={skill} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education and certifications */}
        <section id="education" aria-labelledby="education-heading" className="py-24 lg:py-40 bg-slate-950/80 reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
              <div className="lg:w-3/5 text-left">
                <div className="flex items-center gap-4 sm:gap-6 mb-10 lg:mb-16">
                  <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/20" aria-hidden="true"><BookOpen className="w-7 h-7 sm:w-8 sm:h-8" /></div>
                  <h2 id="education-heading" className="text-3xl sm:text-5xl font-black tracking-tight">Education Baseline</h2>
                </div>
                <div className="space-y-12">
                  {EDUCATION.map((edu) => (
                    <div key={edu.degree} className="relative pl-10 sm:pl-12 border-l-4 border-slate-800 group hover:border-blue-600 transition-all">
                      <div className="absolute -left-[10px] top-0 w-4 h-4 rounded-full bg-slate-950 border-4 border-slate-800 group-hover:border-blue-600 transition-all" aria-hidden="true"></div>
                      <span className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4 block">{edu.date}</span>
                      <h3 className="text-2xl sm:text-3xl font-black mb-3">{edu.degree}</h3>
                      <p className="text-lg sm:text-xl font-bold text-slate-400 mb-4">{edu.institution} &bull; {edu.major}</p>
                      {edu.gpa && (
                        <div className="inline-flex items-center gap-4 bg-white/5 px-6 py-2 rounded-2xl border border-white/5">
                          <span className="text-lg font-black text-white">GPA {edu.gpa}</span>
                        </div>
                      )}
                      {edu.highlights?.map((h) => <p key={h} className="text-sm text-slate-400 mt-3">{h}</p>)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:w-2/5 text-left">
                <div className="flex items-center gap-4 sm:gap-6 mb-10 lg:mb-16">
                  <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-blue-600/10 rounded-2xl sm:rounded-[2rem] border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-2xl" aria-hidden="true"><Award className="w-7 h-7 sm:w-8 sm:h-8" /></div>
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Certifications</h2>
                </div>
                <ul className="grid gap-6">
                  {CERTIFICATIONS.map((cert) => (
                    <li key={cert} className="glass-card p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] flex items-center gap-5 sm:gap-6 hover:bg-slate-800/50 hover:border-blue-500/30 transition-all group">
                      <Shield className="text-blue-500 shrink-0 group-hover:scale-110 transition-transform" size={28} aria-hidden="true" />
                      <span className="text-lg sm:text-xl font-black text-slate-200">{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-heading" className="py-24 lg:py-40 bg-slate-950/70 reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
            <div className="bg-gradient-to-br from-blue-900/20 via-slate-900/60 to-slate-950/60 border border-white/5 rounded-[2.5rem] sm:rounded-[5rem] p-6 sm:p-16 lg:p-32">
              <h2 id="contact-heading" className="text-6xl lg:text-[9rem] font-black leading-[0.8] tracking-tighter mb-12">Contact <br /><span className="text-shimmer">Me</span>!</h2>
              <div className="flex flex-wrap justify-center gap-6 lg:gap-10 mb-4">
                <a href={MAIL_HREF} className="group flex flex-col items-center w-full sm:w-auto sm:min-w-[300px] p-8 sm:p-12 glass-card rounded-[2.5rem] sm:rounded-[3rem] hover:bg-blue-600 transition-all">
                  <Mail size={48} className="mb-6 text-blue-400 group-hover:text-white" aria-hidden="true" />
                  <span className="text-lg sm:text-xl font-bold break-words">{CHRIS_DATA.email}</span>
                </a>
                <a href={TEL_HREF} className="group flex flex-col items-center w-full sm:w-auto sm:min-w-[300px] p-8 sm:p-12 glass-card rounded-[2.5rem] sm:rounded-[3rem] hover:bg-indigo-600 transition-all">
                  <Phone size={48} className="mb-6 text-blue-400 group-hover:text-white" aria-hidden="true" />
                  <span className="text-lg sm:text-xl font-bold">{CHRIS_DATA.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer inert={isMenuOpen} className="relative z-10 py-16 lg:py-20 border-t border-white/5 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-10 lg:gap-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center font-black text-2xl" aria-hidden="true">CC</div>
            <div className="text-left">
              <span className="block text-2xl font-black">{CHRIS_DATA.name}</span>
              <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">{CHRIS_DATA.title}</span>
            </div>
          </div>
          <p className="text-slate-400 font-bold text-sm" suppressHydrationWarning>&copy; {new Date().getFullYear()} {CHRIS_DATA.name}</p>
          <div className="flex gap-8">
            <a href={CHRIS_DATA.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={32} aria-hidden="true" /></a>
            <a href={CHRIS_DATA.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-slate-400 hover:text-white transition-colors"><Github size={32} aria-hidden="true" /></a>
          </div>
        </div>
      </footer>

      {/* Resume print template: hidden on screen, the only element shown when printing */}
      <div id="resume-print-template" className="p-10 text-black leading-tight bg-white">
        <div className="text-center mb-8">
          <p className="text-3xl font-bold uppercase tracking-widest mb-2">{CHRIS_DATA.name}</p>
          <p className="text-sm font-medium">{CHRIS_DATA.phone} | {CHRIS_DATA.email} | {CHRIS_DATA.location}</p>
        </div>

        <section className="mb-6">
          <p className="text-lg font-bold border-b-2 border-black mb-2">EDUCATION</p>
          {EDUCATION.map((edu) => (
            <div key={edu.degree} className="mb-4">
              <div className="flex justify-between items-baseline">
                <p className="font-bold">{edu.institution}, {CHRIS_DATA.location}</p>
                <p className="text-xs font-bold">Graduated: {edu.date}</p>
              </div>
              <p className="italic">{edu.degree}, {edu.major}</p>
              {edu.gpa && <p className="text-xs">- Cumulative GPA: {edu.gpa}</p>}
              {edu.highlights?.map((h) => <p key={h} className="text-xs">- {h}</p>)}
            </div>
          ))}
        </section>

        <section className="mb-6">
          <p className="text-lg font-bold border-b-2 border-black mb-2">CERTIFICATIONS</p>
          <ul className="text-xs list-disc ml-6">
            {CERTIFICATIONS.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </section>

        <section className="mb-6">
          <p className="text-lg font-bold border-b-2 border-black mb-2">WORK EXPERIENCE</p>
          {EXPERIENCE.map((exp) => (
            <div key={`${exp.company}-${exp.period}`} className="mb-4">
              <div className="flex justify-between items-baseline font-bold">
                <p>{exp.company}, {exp.location}</p>
                <p className="text-xs">{exp.period}</p>
              </div>
              <p className="italic font-medium text-sm mb-1">{exp.role}</p>
              <ul className="text-xs list-disc ml-6">
                {exp.bullets.map((b) => <li key={b} className="mb-0.5">{b}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section className="mb-6">
          <p className="text-lg font-bold border-b-2 border-black mb-2">TECHNICAL SKILLS</p>
          {SKILLS.map((cat) => (
            <p key={cat.title} className="text-xs mb-1"><span className="font-bold">{cat.title}:</span> {cat.skills.join(', ')}</p>
          ))}
        </section>
      </div>
    </div>
  );
};

export default App;
