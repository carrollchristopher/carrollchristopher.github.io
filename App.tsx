import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import {
  Mail, Phone, Download, MapPin, Linkedin, Github,
  ChevronRight, ChevronUp, Shield, Menu, X, Award, BookOpen, Zap, Compass
} from 'lucide-react';
import { HeroRobot } from '@/components/ui/hero-robot';
import { Spotlight } from '@/components/ui/spotlight';
import { CHRIS_DATA, EXPERIENCE, SKILLS, EDUCATION, CERTIFICATIONS } from './constants';
import heroPoster from './assets/hero-poster.webp';
import heroPoster2x from './assets/hero-poster-2x.webp';
import heroRobotWebm from './assets/hero-robot.webm';
import heroRobotMp4 from './assets/hero-robot.mp4';

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
const RESUME_HREF = '/Resume-Christopher-Carroll.pdf';
const RESUME_FILENAME = 'Resume - Christopher Carroll.pdf';

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

  const fabVisible = showScrollTop && !isMenuOpen;

  return (
    <div className="relative min-h-screen text-slate-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[110] focus:rounded-md focus:bg-blue-600 focus:px-5 focus:py-3 focus:font-bold focus:text-white"
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
      <div className="fixed top-0 left-0 w-full h-0.5 z-[100] pointer-events-none" aria-hidden="true">
        <div
          ref={progressRef}
          className="h-full w-full origin-left bg-blue-500"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Scroll to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
        aria-label="Scroll to top"
        inert={!fabVisible}
        className={`fixed bottom-6 right-6 z-[95] p-3 bg-blue-600 hover:bg-blue-500 border border-blue-400/30 rounded-md shadow-lg shadow-black/40 transition-all duration-300 ${fabVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
      >
        <ChevronUp size={22} aria-hidden="true" />
      </button>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[90] bg-slate-950/90 border-b border-white/10">
        <nav aria-label="Primary" className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex justify-between items-center">
          <a href="#hero" className="flex items-center gap-3.5 group">
            <span className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-black text-base" aria-hidden="true">CC</span>
            <span className="text-left">
              <span className="block text-lg font-bold tracking-tight leading-tight">{CHRIS_DATA.name}</span>
              <span className="block text-[10px] uppercase font-bold tracking-[0.18em] text-blue-400">{CHRIS_DATA.title}</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeSection === id ? 'location' : undefined}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeSection === id ? 'text-white bg-white/[0.07]' : 'text-slate-400 hover:text-white'}`}
              >
                {label}
              </a>
            ))}
            <div className="w-px h-6 bg-white/10 mx-4" aria-hidden="true" />
            <a
              href={RESUME_HREF}
              download={RESUME_FILENAME}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-950 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-blue-500 hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" aria-hidden="true" /> Resume
            </a>
          </div>

          <button
            type="button"
            ref={menuButtonRef}
            className="lg:hidden p-1 -mr-1 text-white rounded-md"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        inert={!isMenuOpen}
        className={`lg:hidden fixed inset-0 z-[85] overflow-y-auto overscroll-contain bg-slate-950 px-6 pb-8 pt-28 transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
      >
        <nav aria-label="Mobile">
          {NAV_ITEMS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={closeMenu} className="block py-4 text-3xl font-black tracking-tight border-b border-white/10">
              {label}
            </a>
          ))}
          <a
            href={RESUME_HREF}
            download={RESUME_FILENAME}
            onClick={() => {
              menuButtonRef.current?.focus();
              closeMenu();
            }}
            className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-md font-bold text-lg"
          >
            <Download className="w-5 h-5" aria-hidden="true" /> Download Resume
          </a>
        </nav>
      </div>

      <main id="main" inert={isMenuOpen} className="relative z-10">
        {/* Hero */}
        <section id="hero" aria-label="Introduction" className="relative px-6 lg:px-12 pt-28 pb-16 lg:pt-32 lg:pb-24">
          <div className="max-w-7xl mx-auto reveal active">
            <div className="relative flex flex-col w-full lg:min-h-[660px] overflow-hidden bg-black border border-white/10 rounded-lg shadow-2xl shadow-blue-950/40">
              <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />

              <div className="flex flex-1 flex-col lg:flex-row">
                <div className="flex-1 p-8 lg:p-14 relative z-10 flex flex-col justify-center">
                  <div className="inline-flex items-center self-start px-3 py-1.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300 mb-8">
                    <Zap size={14} className="mr-2 fill-blue-300" aria-hidden="true" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{CHRIS_DATA.subtitle}</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl xl:text-6xl font-black leading-[0.95] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                    Resilient<br />Infrastructure<br />Architect.
                  </h1>

                  <p className="mt-6 text-neutral-300 max-w-lg text-base lg:text-lg leading-relaxed">
                    Hardening hybrid cloud and on-prem ecosystems through <span className="text-white font-semibold">automation</span> and <span className="text-white font-semibold">strategic engineering</span>, turning complexity into uptime.
                  </p>

                  <div className="mt-9 flex flex-wrap gap-3">
                    <a
                      href={RESUME_HREF}
                      download={RESUME_FILENAME}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-500 transition-colors"
                    >
                      <Download className="w-5 h-5" aria-hidden="true" /> Download Resume
                    </a>
                    <a href="#experience" className="inline-flex items-center px-6 py-3.5 border border-white/15 bg-white/[0.03] font-bold rounded-md hover:bg-white/[0.08] hover:border-white/25 transition-colors">
                      View Experience
                    </a>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-400 font-medium">
                    <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-blue-400" aria-hidden="true" /> {CHRIS_DATA.location}</span>
                    <a href={MAIL_HREF} className="inline-flex items-center gap-2 hover:text-white transition-colors"><Mail size={16} className="text-blue-400" aria-hidden="true" /> {CHRIS_DATA.email}</a>
                    <a href={TEL_HREF} className="inline-flex items-center gap-2 hover:text-white transition-colors"><Phone size={16} className="text-blue-400" aria-hidden="true" /> {CHRIS_DATA.phone}</a>
                  </div>
                </div>

                <HeroRobot
                  scene={SPLINE_SCENE_URL}
                  poster={heroPoster}
                  posterSrcSet={`${heroPoster} 575w, ${heroPoster2x} 1150w`}
                  videoWebm={heroRobotWebm}
                  videoMp4={heroRobotMp4}
                  className="flex-none h-[340px] sm:h-[420px] lg:flex-1 lg:h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" aria-labelledby="about-heading" className="relative py-24 lg:py-32 bg-slate-950/75 border-y border-white/5 reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
              <div className="w-full max-w-sm lg:w-[400px] lg:max-w-none shrink-0">
                <div className="group relative aspect-square w-full overflow-hidden rounded-lg border border-white/10 bg-slate-900">
                  <img
                    src={CHRIS_DATA.profileImage}
                    srcSet={`${CHRIS_DATA.profileImageSmall} 400w, ${CHRIS_DATA.profileImage} 800w`}
                    sizes="(min-width: 1024px) 400px, 384px"
                    width={800}
                    height={800}
                    alt={CHRIS_DATA.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" aria-hidden="true"></div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3.5 p-4 rounded-md border border-white/10 bg-slate-950/85">
                    <div className="w-10 h-10 shrink-0 bg-blue-600 rounded flex items-center justify-center text-white" aria-hidden="true"><Compass size={20} className="animate-spin-slow" /></div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.18em]">Active Stack</p>
                      <p className="text-sm font-bold">Hybrid Cloud &amp; Security</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 text-left">
                <p className="eyebrow">The Brand Story</p>
                <h2 id="about-heading" className="text-4xl lg:text-6xl font-black tracking-tighter mb-8">Taming Complexity.</h2>
                <div className="max-w-3xl space-y-5 text-[1.0625rem] leading-8 text-slate-300">
                  {CHRIS_DATA.bio.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                  {CHRIS_DATA.kpis.map((kpi) => (
                    <div key={kpi.label} className="panel rounded-lg px-4 py-5 text-center flex flex-col-reverse">
                      <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mt-2 leading-snug">{kpi.label}</dt>
                      <dd className="text-3xl lg:text-4xl font-black text-blue-300 leading-tight [text-shadow:0_0_24px_rgba(96,165,250,0.35)]">{kpi.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" aria-labelledby="experience-heading" className="py-24 lg:py-32 bg-slate-950/80 reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-14 lg:mb-20">
              <p className="eyebrow">Impact Analysis</p>
              <h2 id="experience-heading" className="text-5xl lg:text-7xl font-black tracking-tighter">Professional Velocity.</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
              {EXPERIENCE.map((exp) => (
                <article key={`${exp.company}-${exp.period}`} className="panel panel-hover rounded-lg p-7 sm:p-9 text-left">
                  <div className="mb-7 pb-6 border-b border-white/10">
                    <span className="inline-block px-2.5 py-1 rounded border border-blue-500/25 bg-blue-500/10 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-4">{exp.period}</span>
                    <h3 className="text-2xl sm:text-[1.75rem] font-black tracking-tight mb-1.5">{exp.role}</h3>
                    <p className="text-base sm:text-lg font-semibold text-slate-400">{exp.company} / {exp.location}</p>
                  </div>
                  <ul className="space-y-3.5">
                    {exp.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-[0.95rem] text-slate-300 leading-relaxed">
                        <ChevronRight size={16} className="mt-1 text-blue-500 shrink-0" aria-hidden="true" />
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
        <section id="skills" aria-labelledby="skills-heading" className="py-24 lg:py-32 bg-slate-950/70 reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-14 lg:mb-20">
              <p className="eyebrow">Capability Matrix</p>
              <h2 id="skills-heading" className="text-5xl lg:text-7xl font-black tracking-tighter">Engineering Arsenal.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {SKILLS.map((cat) => (
                <div key={cat.title} className="panel panel-hover rounded-lg p-7 text-left">
                  <h3 className="text-xl font-black text-white mb-5 pb-4 border-b border-white/10">{cat.title}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <li key={skill} className="px-2.5 py-1.5 rounded border border-white/10 bg-white/[0.03] text-xs font-semibold text-slate-300">{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education and certifications */}
        <section id="education" aria-labelledby="education-heading" className="py-24 lg:py-32 bg-slate-950/80 reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
              <div className="lg:w-3/5 text-left">
                <div className="flex items-center gap-4 mb-10 lg:mb-12">
                  <div className="shrink-0 w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center text-white" aria-hidden="true"><BookOpen size={24} /></div>
                  <h2 id="education-heading" className="text-3xl sm:text-5xl font-black tracking-tight">Education Baseline</h2>
                </div>
                <div className="space-y-10">
                  {EDUCATION.map((edu) => (
                    <div key={edu.degree} className="relative pl-8 sm:pl-10 border-l-2 border-slate-800 hover:border-blue-600 transition-colors group">
                      <div className="absolute -left-[7px] top-1 w-3 h-3 bg-slate-950 border-2 border-slate-700 group-hover:border-blue-500 transition-colors" aria-hidden="true"></div>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400 mb-3 block">{edu.date}</span>
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">{edu.degree}</h3>
                      <p className="text-base sm:text-lg font-semibold text-slate-400 mb-4">{edu.institution} / {edu.major}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        {edu.gpa && (
                          <span className="inline-flex items-center px-3 py-1.5 rounded border border-white/10 bg-white/[0.03] text-sm font-bold text-white">GPA {edu.gpa}</span>
                        )}
                        {edu.highlights?.map((h) => <span key={h} className="text-sm text-slate-400">{h}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:w-2/5 text-left">
                <div className="flex items-center gap-4 mb-10 lg:mb-12">
                  <div className="shrink-0 w-12 h-12 border border-blue-500/30 bg-blue-500/10 rounded-md flex items-center justify-center text-blue-400" aria-hidden="true"><Award size={24} /></div>
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Certifications</h2>
                </div>
                <ul className="grid gap-3">
                  {CERTIFICATIONS.map((cert) => (
                    <li key={cert} className="panel panel-hover rounded-lg px-5 py-4 flex items-center gap-4">
                      <Shield className="text-blue-500 shrink-0" size={22} aria-hidden="true" />
                      <span className="text-base sm:text-lg font-bold text-slate-100">{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-heading" className="py-24 lg:py-32 bg-slate-950/70 reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
            <div className="rounded-lg border border-white/10 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-slate-950/60 px-6 py-14 sm:p-16 lg:p-24">
              <h2 id="contact-heading" className="text-6xl lg:text-[8rem] font-black leading-[0.85] tracking-tighter mb-12">Contact <br /><span className="text-shimmer">Me</span>!</h2>
              <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
                <a href={MAIL_HREF} className="group panel rounded-lg flex flex-col items-center w-full sm:w-auto sm:min-w-[300px] px-8 py-9 hover:bg-blue-600 hover:border-blue-500 transition-colors">
                  <Mail size={36} className="mb-5 text-blue-400 group-hover:text-white transition-colors" aria-hidden="true" />
                  <span className="text-lg font-bold break-words">{CHRIS_DATA.email}</span>
                </a>
                <a href={TEL_HREF} className="group panel rounded-lg flex flex-col items-center w-full sm:w-auto sm:min-w-[300px] px-8 py-9 hover:bg-blue-600 hover:border-blue-500 transition-colors">
                  <Phone size={36} className="mb-5 text-blue-400 group-hover:text-white transition-colors" aria-hidden="true" />
                  <span className="text-lg font-bold">{CHRIS_DATA.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer inert={isMenuOpen} className="relative z-10 pt-12 pb-12 md:pb-24 lg:pt-14 border-t border-white/10 bg-slate-950/90">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center font-black text-base" aria-hidden="true">CC</div>
            <div className="text-left">
              <span className="block text-lg font-bold leading-tight">{CHRIS_DATA.name}</span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.18em]">{CHRIS_DATA.title}</span>
            </div>
          </div>
          <p className="text-slate-400 font-medium text-sm" suppressHydrationWarning>&copy; {new Date().getFullYear()} {CHRIS_DATA.name}</p>
          <div className="flex gap-3">
            <a href={CHRIS_DATA.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2.5 rounded-md border border-white/10 text-slate-400 hover:text-white hover:border-white/25 transition-colors"><Linkedin size={20} aria-hidden="true" /></a>
            <a href={CHRIS_DATA.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2.5 rounded-md border border-white/10 text-slate-400 hover:text-white hover:border-white/25 transition-colors"><Github size={20} aria-hidden="true" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
