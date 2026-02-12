
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Mail, Phone, Download, MapPin, Linkedin, Github, 
  ChevronRight, ChevronUp, Terminal, Cloud, Shield, 
  Menu, X, Award, BookOpen, Zap, Globe, Compass, BarChart3
} from 'lucide-react';
import { CHRIS_DATA, EXPERIENCE, SKILLS, EDUCATION, CERTIFICATIONS } from './constants';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = useCallback(() => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress((window.scrollY / totalScroll) * 100);
    setShowScrollTop(window.scrollY > 500);

    const sections = ['hero', 'about', 'experience', 'skills', 'education', 'contact'];
    const scrollPosition = window.scrollY + 150;

    for (const section of sections) {
      const el = document.getElementById(section);
      if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
        setActiveSection(section);
      }
    }

    document.querySelectorAll('.reveal').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('active');
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
        <div className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-300" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-[95] p-4 bg-blue-600 rounded-2xl shadow-2xl transition-all duration-500 transform ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}
      >
        <ChevronUp size={24} />
      </button>

      {/* Glass Header */}
      <nav className="fixed top-0 left-0 right-0 z-[90] bg-slate-950/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 lg:h-24 flex justify-between items-center">
          <a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:rotate-6">CC</div>
            <div className="text-left">
              <span className="block text-xl font-bold tracking-tight">Chris Carroll</span>
              <span className="text-[9px] uppercase font-black tracking-widest text-blue-400">Escalation Lead Engineer</span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-2">
            {['About', 'Experience', 'Skills', 'Education', 'Contact'].map(s => (
              <a key={s} href={`#${s.toLowerCase()}`} onClick={(e) => scrollToSection(e, s.toLowerCase())}
                 className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${activeSection === s.toLowerCase() ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400 hover:text-white'}`}>
                {s}
              </a>
            ))}
            <div className="w-px h-6 bg-white/10 mx-4" />
            <button onClick={handleDownload} className="px-6 py-3 bg-white text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:text-white transition-all">
              <Download className="inline w-4 h-4 mr-2" /> Resume
            </button>
          </div>

          <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-[85] bg-slate-950 p-8 pt-32 transition-all duration-500 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <div className="space-y-6">
          {['About', 'Experience', 'Skills', 'Education', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={(e) => scrollToSection(e, item.toLowerCase())} className="block text-4xl font-black border-b border-white/5 pb-4">{item}</a>
          ))}
          <button onClick={handleDownload} className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-xl">Download Resume</button>
        </div>
      </div>

      <main className="relative">
        <div className="ombre-glow top-0 right-0 -mr-40 mt-20 opacity-40"></div>
        <div className="ombre-glow bottom-0 left-0 -ml-40 mb-20 opacity-30"></div>

        {/* Hero */}
        <section id="hero" className="relative pt-48 pb-24 lg:pt-64 lg:pb-48 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-24 relative z-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-blue-600/10 border border-blue-600/20 text-blue-400 mb-10">
                <Zap size={16} className="mr-2 fill-blue-400" /> <span className="text-[10px] font-black uppercase tracking-[0.2em]">Senior Escalation Resource</span>
              </div>
              <h1 className="text-6xl md:text-8xl xl:text-[10rem] font-black leading-[0.85] tracking-tighter mb-10">
                Resilient <br /><span className="text-shimmer">Infrastructure</span> <br />Architect.
              </h1>
              <p className="text-xl lg:text-3xl text-slate-400 font-medium max-w-2xl mx-auto lg:mx-0 mb-16 leading-tight">
                Hardening hybrid ecosystems through <span className="text-white">automation</span> and <span className="text-white">strategic engineering</span>.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <button onClick={handleDownload} className="px-12 py-6 bg-blue-600 text-white font-black text-xl rounded-[2rem] shadow-2xl hover:bg-blue-500 transition-all active:scale-95">Download PDF</button>
                <a href="#experience" onClick={(e) => scrollToSection(e, 'experience')} className="px-12 py-6 bg-slate-900 border border-white/10 font-black text-xl rounded-[2rem] hover:bg-slate-800 transition-all">View Velocity</a>
              </div>
            </div>

            <div className="lg:w-[500px] reveal active">
              <div className="relative w-80 h-80 md:w-[480px] md:h-[480px] rounded-[5rem] overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10 bg-slate-900">
                <img src={CHRIS_DATA.profileImage} alt="Chris Carroll" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                     onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop")} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-10 left-10 right-10 p-6 glass-card rounded-3xl border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><Compass className="animate-spin-slow" /></div>
                    <div className="text-left"><p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Active Stack</p><p className="text-sm font-bold">Hybrid Cloud & Security</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="py-40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-32">
              <h2 className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase mb-4">Impact Analysis</h2>
              <h3 className="text-5xl lg:text-8xl font-black tracking-tighter">Professional Velocity.</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="glass-card p-12 rounded-[4rem] group hover:bg-slate-800/40 transition-all text-left">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase mb-4">{exp.period}</span>
                      <h4 className="text-3xl font-black mb-2">{exp.role}</h4>
                      <p className="text-xl font-bold text-slate-400">{exp.company} // {exp.location}</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex items-start text-slate-400 font-medium leading-relaxed group-hover:text-slate-200 transition-colors">
                        <ChevronRight size={18} className="mr-3 mt-1 text-blue-500 shrink-0" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="py-40 bg-slate-950 reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {SKILLS.map((cat, i) => (
                <div key={i} className="glass-card p-10 rounded-[3.5rem] hover:border-blue-500/20 transition-all text-left">
                  <h4 className="text-2xl font-black text-blue-400 mb-8">{cat.title}</h4>
                  <div className="flex flex-wrap gap-3">
                    {cat.skills.map(s => (
                      <span key={s} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education & Certifications Section */}
        <section id="education" className="py-40 bg-gradient-to-b from-slate-950 to-slate-900 reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row gap-20">
              {/* Academic History */}
              <div className="lg:w-3/5 text-left">
                <div className="flex items-center gap-6 mb-16">
                   <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/20"><BookOpen size={32} /></div>
                   <h3 className="text-5xl font-black tracking-tight">Education Baseline</h3>
                </div>
                <div className="space-y-12">
                  {EDUCATION.map((edu, idx) => (
                    <div key={idx} className="relative pl-12 border-l-4 border-slate-800 group hover:border-blue-600 transition-all">
                      <div className="absolute -left-[10px] top-0 w-4 h-4 rounded-full bg-slate-950 border-4 border-slate-800 group-hover:border-blue-600 transition-all"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4 block">{edu.date}</span>
                      <h4 className="text-3xl font-black mb-3">{edu.degree}</h4>
                      <p className="text-xl font-bold text-slate-400 mb-4">{edu.institution} • {edu.major}</p>
                      <div className="inline-flex items-center gap-4 bg-white/5 px-6 py-2 rounded-2xl border border-white/5">
                        <span className="text-lg font-black text-white">GPA {edu.gpa}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications Card */}
              <div className="lg:w-2/5 text-left">
                <div className="flex items-center gap-6 mb-16">
                   <div className="w-16 h-16 bg-blue-600/10 rounded-[2rem] border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-2xl"><Award size={32} /></div>
                   <h3 className="text-5xl font-black tracking-tight">Certifications</h3>
                </div>
                <div className="grid gap-6">
                  {CERTIFICATIONS.map((cert, idx) => (
                    <div key={idx} className="glass-card p-8 rounded-[2.5rem] flex items-center gap-6 hover:bg-slate-800/50 hover:border-blue-500/30 transition-all group">
                      <Shield className="text-blue-500 shrink-0 group-hover:scale-110 transition-transform" size={28} />
                      <span className="text-xl font-black text-slate-200">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-40 bg-slate-950 reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
            <div className="bg-gradient-to-br from-blue-900/10 via-slate-900 to-slate-950 border border-white/5 rounded-[5rem] p-16 lg:p-32">
              <h2 className="text-6xl lg:text-[9rem] font-black leading-[0.8] tracking-tighter mb-12">Contact <br /><span className="text-shimmer">Me</span>!</h2>
              <div className="flex flex-wrap justify-center gap-10 mb-20">
                <a href={`mailto:${CHRIS_DATA.email}`} className="flex flex-col items-center p-12 glass-card rounded-[3rem] hover:bg-blue-600 transition-all min-w-[300px]">
                  <Mail size={48} className="mb-6 text-blue-400 group-hover:text-white" />
                  <span className="text-xl font-bold">{CHRIS_DATA.email}</span>
                </a>
                <a href={`tel:${CHRIS_DATA.phone.replace(/\D/g, '')}`} className="flex flex-col items-center p-12 glass-card rounded-[3rem] hover:bg-indigo-600 transition-all min-w-[300px]">
                  <Phone size={48} className="mb-6 text-blue-400 group-hover:text-white" />
                  <span className="text-xl font-bold">{CHRIS_DATA.phone}</span>
                </a>
              </div>
              <button onClick={handleDownload} className="px-16 py-8 bg-blue-600 text-white font-black rounded-[2.5rem] text-2xl hover:bg-blue-500 shadow-2xl transition-all">Download Exact Resume PDF</button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center font-black text-2xl">CC</div>
            <div className="text-left"><span className="block text-2xl font-black">Chris Carroll</span><span className="text-slate-500 text-sm font-bold uppercase tracking-widest">Escalation Lead Engineer</span></div>
          </div>
          <p className="text-slate-600 font-bold text-sm">© {new Date().getFullYear()} // PROFESSIONAL BRAND SYSTEM</p>
          <div className="flex gap-8">
            <a href={CHRIS_DATA.linkedin} target="_blank" className="text-slate-500 hover:text-white transition-colors"><Linkedin size={32} /></a>
            <a href={CHRIS_DATA.github} target="_blank" className="text-slate-500 hover:text-white transition-colors"><Github size={32} /></a>
          </div>
        </div>
      </footer>

      {/* HIDDEN RESUME PRINT TEMPLATE */}
      <div id="resume-print-template" className="p-10 text-black leading-tight bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Chris Carroll</h1>
          <p className="text-sm font-medium">631-521-0628 | Carroll7044@gmail.com | Boca Raton, FL 33486</p>
        </div>

        <section className="mb-6">
          <h2 className="text-lg font-bold border-b-2 border-black mb-2">EDUCATION</h2>
          {EDUCATION.map((edu, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <p className="font-bold">{edu.institution}, Boca Raton, FL</p>
                <p className="text-xs font-bold">{edu.date.includes('Expected') ? 'Exp. Graduation:' : 'Graduated:'} {edu.date.replace('Expected ', '')}</p>
              </div>
              <p className="italic">{edu.degree}</p>
              <p className="text-xs">- Cumulative GPA: {edu.gpa}</p>
              {edu.highlights?.map((h, j) => <p key={j} className="text-xs">- {h}</p>)}
            </div>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold border-b-2 border-black mb-2">CERTIFICATIONS</h2>
          <ul className="text-xs list-disc ml-6">
            {CERTIFICATIONS.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold border-b-2 border-black mb-2">WORK EXPERIENCE</h2>
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline font-bold">
                <p>{exp.company}, {exp.location}</p>
                <p className="text-xs">{exp.period}</p>
              </div>
              <p className="italic font-medium text-sm mb-1">{exp.role}</p>
              <ul className="text-xs list-disc ml-6">
                {exp.bullets.map((b, j) => <li key={j} className="mb-0.5">{b}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold border-b-2 border-black mb-2">OTHER</h2>
          <p className="text-sm font-bold underline mb-1">Technical Skills</p>
          <ul className="text-xs list-disc ml-6 mb-4">
            {SKILLS.filter(s => s.title !== "Soft Skills").flatMap(s => s.skills).map((sk, k) => <li key={k}>{sk}</li>)}
          </ul>
          <p className="text-sm font-bold underline mb-1">Soft Skills</p>
          <ul className="text-xs list-disc ml-6">
            {SKILLS.find(s => s.title === "Soft Skills")?.skills.map((sk, k) => <li key={k}>{sk}</li>)}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default App;
