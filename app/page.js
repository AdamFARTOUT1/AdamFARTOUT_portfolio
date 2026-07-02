"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "./components/SmoothScroll";
import Navbar from "./components/Navbar";
import useScrollAnimations from "./hooks/useScrollAnimations";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiPython, SiC, SiPhp, SiMysql, SiLaravel, SiFlask,
  SiDocker, SiGooglecloud, SiGoogle, SiHedera
} from "react-icons/si";
import { FaJava, FaBrain, FaLinkedin, FaWhatsapp, FaEnvelope, FaInstagram, FaGithub } from "react-icons/fa";

const MapComponent = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
  useScrollAnimations();

  const videoRef = useRef(null);

  // --- Magnetic Button & Form State ---
  const [formState, setFormState] = useState("idle"); // idle, submitting, success
  const [isFormUnlocked, setIsFormUnlocked] = useState(true);
  const [btnHoverPos, setBtnHoverPos] = useState({ x: 0, y: 0 });
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const btnRef = useRef(null);

  // Cursor Tether State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [btnCenter, setBtnCenter] = useState({ x: 0, y: 0 });
  const [isContactHovered, setIsContactHovered] = useState(false);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Update button center for the tether line if it's unlocked and rendered
      if (btnRef.current && isFormUnlocked) {
        const rect = btnRef.current.getBoundingClientRect();
        setBtnCenter({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [isFormUnlocked]);

  const handleBtnMouseMove = (e) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.4;
    const y = (e.clientY - top - height / 2) * 0.4;
    setBtnHoverPos({ x, y });
  };

  const handleBtnMouseLeave = () => {
    setIsBtnHovered(false);
    setBtnHoverPos({ x: 0, y: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState !== "idle") return;
    setFormState("submitting");
    setTimeout(() => {
      setFormState("success");
      setTimeout(() => setFormState("idle"), 3000);
    }, 2000);
  };

  // Replay video each time the hero section scrolls into view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.currentTime = 0;
          video.play().catch(() => { });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const bentoVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" }
    })
  };

  return (
    <SmoothScroll>
      <Navbar />


      <main>
        {/* ─── Hero Section ─── */}
        <section
          id="hero"
          className="relative h-screen flex items-center justify-center"
        >
          <div className="text-center z-10 relative px-4">
            <a
              href="/resume.pdf"
              download="Adam_Fartout_Resume.pdf"
              className="block cursor-pointer hover:scale-[1.02] transition-transform duration-300"
            >
              <h1
                className="font-display text-7xl md:text-9xl font-black tracking-tighter uppercase"
                style={{ lineHeight: 0.9 }}
              >
                Adam
                <br />
                Fartout
              </h1>
            </a>
            <div className="mt-6">
              <span
                id="subtitle-bg"
                className="text-black text-sm md:text-base tracking-[0.3em] uppercase font-light px-3 py-1 bg-transparent"
              >
                Digital Transformation & AI Engineer
              </span>
            </div>
          </div>
          {/* Video — fades out smoothly as you scroll away */}
          <video
            id="hero-video"
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 will-change-[opacity]"
            src="/hero-bg.mp4"
          />
          {/* Top subtle gradient */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/40 to-transparent z-[1]" />
          {/* Bottom fade — tall and aggressive to dissolve the video edge */}
          <div
            className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none"
            style={{
              height: "50%",
              background: "linear-gradient(to bottom, transparent 0%, rgba(5,5,5,0.3) 30%, rgba(5,5,5,0.7) 60%, rgba(5,5,5,1) 100%)",
            }}
          />
        </section>

        {/* ─── About Section ─── */}
        <section id="about" className="section-padding min-h-screen flex items-center relative">
          <div className="max-w-5xl mx-auto">
            <p className="text-muted text-sm tracking-[0.3em] uppercase mb-8 font-mono">
              // About Me
            </p>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              I build{" "}
              <span className="text-[#cb9e0bff]">intelligent software</span> with
              intent. I am a first-year Engineering student specializing in{" "}
              <span className="text-secondary">
                Digital Transformation and Artificial Intelligence
              </span>
              . I am passionate about{" "}
              <span className="text-accent">optimizing workflows</span>,
              leveraging <span className="text-secondary">cloud computing</span>
              , and integrating{" "}
              <span className="text-accent">AI into practical applications</span>{" "}
              to solve complex problems.
            </h2>
          </div>
        </section>

        {/* ─── Journey Section ─── */}
        <section id="journey" className="relative w-full h-screen">
          <div className="w-full h-screen flex flex-col items-center justify-center overflow-hidden">

            {/* Ambient "Tunnel" effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
              <div className="w-[800px] h-[800px] rounded-full border border-accent/20 border-dashed animate-[spin_60s_linear_infinite]" />
              <div className="absolute w-[500px] h-[500px] rounded-full border border-secondary/20 animate-[spin_40s_linear_infinite_reverse]" />
              <div className="absolute w-[200px] h-[200px] rounded-full border border-accent/10 bg-accent/5 animate-pulse" />
            </div>

            <div className="relative w-full max-w-4xl px-4 z-10 flex flex-col items-center h-full justify-center">
              <div className="absolute top-12 md:top-24 w-full flex justify-center">
                <p className="text-muted text-sm tracking-[0.3em] uppercase font-mono">
                  // The Journey
                </p>
              </div>

              <div className="relative w-full h-[400px] flex items-center justify-center">
                {[
                  {
                    date: "July 2026",
                    title: "Systems Department Intern",
                    place: "Aéropole Nouaceur",
                    status: "upcoming",
                  },
                  {
                    date: "2023 — 2026",
                    title: "Engineering Degree in Digital Transformation & AI",
                    place: "ENSA Al Hoceima",
                    status: "current",
                  },
                  {
                    date: "2022 — 2023",
                    title: "Baccalauréat in Mathematical Sciences",
                    place: "Lycée Ibnou Mandour",
                    status: "completed",
                  },
                ].reverse().map((entry, i) => (
                  <div
                    key={i}
                    className="journey-card absolute inset-0 flex flex-col items-center justify-center text-center opacity-0 translate-y-12"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-muted text-base font-mono">
                        {entry.date}
                      </span>
                      {entry.status === "upcoming" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent font-mono uppercase border border-accent/30">
                          Soon
                        </span>
                      )}
                      {entry.status === "current" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-mono uppercase border border-secondary/30">
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight">
                      {entry.title}
                    </h3>
                    <p className="text-secondary text-lg md:text-xl font-light">{entry.place}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Projects Section (Stacked Card Overlay) ─── */}
        <section id="projects" className="relative w-full h-screen">
          <div className="w-full h-screen flex flex-col items-center justify-center overflow-hidden">

            <div className="absolute top-12 md:top-24 w-full flex justify-center z-20">
              <p className="text-[#0a0a0a]/60 text-sm tracking-[0.3em] uppercase font-mono font-semibold">
                // Projects
              </p>
            </div>

            <div className="relative w-full max-w-5xl mx-auto px-4 h-[500px] flex items-center justify-center">

              {/* Stacked Cards */}
              <div className="relative w-full max-w-3xl mx-auto h-[400px] flex flex-col items-center justify-center">
                {[
                  {
                    title: "PFE Scheduler",
                    description:
                      "A Laravel-based task scheduling application built with Scrum methodology to optimize enterprise workflow management.",
                    tags: ["Laravel", "PHP", "MySQL", "Scrum"],
                    link: "https://github.com/AdamFARTOUT1/PFE_Scheduler", // Add your GitHub link here! Example: "https://github.com/yourusername/pfe-scheduler"
                  },
                  {
                    title: "Movie Viewer",
                    description:
                      "A dynamic Flask web application integrating the OMDb API for real-time movie data fetching and display.",
                    tags: ["Flask", "Python", "API", "REST"],
                    link: "https://github.com/AdamFARTOUT1/movie_viewer", // Add your GitHub link here!
                  },
                  {
                    title: "Gestion Congés",
                    description:
                      "A lightning-fast command-line leave management tool developed in C featuring a modular architecture.",
                    tags: ["C", "CLI", "Architecture"],
                    link: "https://github.com/AdamFARTOUT1/Gestion_Conges", // Add your GitHub link here!
                  },
                ].map((project, i) => (
                  <div
                    key={i}
                    className="project-card absolute inset-0 w-full bg-[#0a0a0a] border border-[#cb9e0bff]/40 rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-2xl"
                    style={{ zIndex: 30 - i }}
                  >
                    <h3 className="font-display text-3xl md:text-5xl font-bold mb-4 text-white">
                      {project.title}
                    </h3>
                    <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                      {project.description}
                    </p>

                    <div className="flex flex-col items-center justify-center gap-6 mt-8">
                      <div className="flex flex-wrap justify-center gap-2">
                        {project.tags.map((tag, j) => (
                          <span
                            key={j}
                            className="text-xs md:text-sm px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white/90 uppercase tracking-widest font-mono"
                          >
                            {project.link !== "#" ? tag : tag}
                          </span>
                        ))}
                      </div>

                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 px-8 py-4 bg-[#cb9e0bff] text-[#0a0a0a] font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white transition-colors duration-300"
                      >
                        View on GitHub
                        <span className="text-base leading-none">↗</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ─── Skills Bento Grid ─── */}
        <section id="skills" className="section-padding min-h-screen flex flex-col justify-center items-center relative z-10">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <p className="text-muted text-sm tracking-[0.3em] uppercase mb-12 font-mono text-center">
              // My Arsenal
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              {/* Languages */}
              <motion.div
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={bentoVariants}
                className="col-span-1 md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(203,158,11,0.15)] transition-all duration-300 flex flex-col items-center justify-center"
              >
                <h3 className="font-display text-xl font-bold mb-6 text-[#cb9e0bff] text-center">Languages</h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {[
                    { name: "Python", icon: SiPython },
                    { name: "Java", icon: FaJava },
                    { name: "C", icon: SiC },
                    { name: "PHP", icon: SiPhp },
                    { name: "SQL", icon: SiMysql }
                  ].map((tech) => (
                    <div key={tech.name} className="flex flex-col items-center gap-2 group cursor-default">
                      <div className="w-14 h-14 rounded-xl bg-neutral-800/50 flex items-center justify-center border border-neutral-800 group-hover:border-[#cb9e0bff]/50 group-hover:bg-[#cb9e0bff]/10 transition-colors duration-300">
                        <tech.icon className="text-2xl text-neutral-400 group-hover:text-[#cb9e0bff] transition-colors duration-300" />
                      </div>
                      <span className="text-xs font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Web & Frameworks */}
              <motion.div
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={bentoVariants}
                className="col-span-1 md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(203,158,11,0.15)] transition-all duration-300 flex flex-col items-center justify-center"
              >
                <h3 className="font-display text-xl font-bold mb-6 text-[#cb9e0bff] text-center">Web & Frameworks</h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {[
                    { name: "Laravel", icon: SiLaravel },
                    { name: "Flask", icon: SiFlask }
                  ].map((tech) => (
                    <div key={tech.name} className="flex flex-col items-center gap-2 group cursor-default">
                      <div className="w-14 h-14 rounded-xl bg-neutral-800/50 flex items-center justify-center border border-neutral-800 group-hover:border-[#cb9e0bff]/50 group-hover:bg-[#cb9e0bff]/10 transition-colors duration-300">
                        <tech.icon className="text-2xl text-neutral-400 group-hover:text-[#cb9e0bff] transition-colors duration-300" />
                      </div>
                      <span className="text-xs font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Systems & Arch */}
              <motion.div
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={bentoVariants}
                className="col-span-1 md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(203,158,11,0.15)] transition-all duration-300 flex flex-col items-center justify-center"
              >
                <h3 className="font-display text-xl font-bold mb-6 text-[#cb9e0bff] text-center">Systems & Arch</h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {[
                    { name: "DevOps", icon: SiDocker },
                    { name: "Cloud Computing", icon: SiGooglecloud },
                    { name: "AI Integration", icon: FaBrain }
                  ].map((tech) => (
                    <div key={tech.name} className="flex flex-col items-center gap-2 group cursor-default">
                      <div className="w-14 h-14 rounded-xl bg-neutral-800/50 flex items-center justify-center border border-neutral-800 group-hover:border-[#cb9e0bff]/50 group-hover:bg-[#cb9e0bff]/10 transition-colors duration-300">
                        <tech.icon className="text-2xl text-neutral-400 group-hover:text-[#cb9e0bff] transition-colors duration-300" />
                      </div>
                      <span className="text-xs font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Certifications */}
              <motion.div
                custom={3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={bentoVariants}
                className="col-span-1 md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(203,158,11,0.15)] transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#cb9e0bff]/5 rounded-bl-full blur-3xl pointer-events-none" />
                <h3 className="font-display text-xl font-bold mb-6 text-[#cb9e0bff] text-center">Certifications</h3>
                <div className="flex flex-col gap-6 relative z-10 w-full max-w-sm items-center">
                  {[
                    { name: "Google AI Certification", icon: SiGoogle, href: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/LHBLIGLQSDX7" },
                    { name: "Machine Learning Specialization", icon: FaBrain }
                  ].map((tech) => {
                    const Tag = tech.href ? "a" : "div";
                    const linkProps = tech.href ? { href: tech.href, target: "_blank", rel: "noopener noreferrer" } : {};

                    return (
                      <Tag key={tech.name} {...linkProps} className={`flex flex-col items-center gap-3 group ${tech.href ? 'cursor-pointer' : 'cursor-default'}`}>
                        <div className="w-12 h-12 rounded-lg bg-neutral-800/50 flex items-center justify-center border border-neutral-800 group-hover:border-[#cb9e0bff]/50 group-hover:bg-[#cb9e0bff]/10 transition-colors duration-300 shrink-0">
                          <tech.icon className="text-xl text-neutral-400 group-hover:text-[#cb9e0bff] transition-colors duration-300" />
                        </div>
                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors text-center">{tech.name}</span>
                      </Tag>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Contact Section ─── */}
        <section
          id="contact"
          className="section-padding min-h-screen flex items-center relative overflow-hidden group/contact bg-[#050505] z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          onMouseEnter={() => setIsContactHovered(true)}
          onMouseLeave={() => setIsContactHovered(false)}
        >

          {/* Custom Styles for Glitch */}
          <style dangerouslySetInnerHTML={{
            __html: `
            .glitch-hover {
              position: relative;
              transition: color 0.3s;
            }
            .glitch-hover:hover {
              color: #cb9e0bff;
              animation: glitch-anim 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
            }
            .glitch-hover:hover::before, .glitch-hover:hover::after {
              content: "something great.";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: transparent;
            }
            .glitch-hover:hover::before {
              left: 3px;
              text-shadow: -2px 0 #ff00c1;
              clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
              animation: glitch-anim-2 0.4s cubic-bezier(.25, .46, .45, .94) both infinite;
            }
            .glitch-hover:hover::after {
              left: -3px;
              text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
              clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
              animation: glitch-anim 0.3s cubic-bezier(.25, .46, .45, .94) both infinite reverse;
            }
            @keyframes glitch-anim {
              0% { transform: translate(0) }
              20% { transform: translate(-2px, 2px) }
              40% { transform: translate(-2px, -2px) }
              60% { transform: translate(2px, 2px) }
              80% { transform: translate(2px, -2px) }
              100% { transform: translate(0) }
            }
            @keyframes glitch-anim-2 {
              0% { transform: translate(0) }
              20% { transform: translate(2px, -2px) }
              40% { transform: translate(2px, 2px) }
              60% { transform: translate(-2px, -2px) }
              80% { transform: translate(-2px, 2px) }
              100% { transform: translate(0) }
            }
          `}} />



          {/* 1. The Foundation: Dark Map Background */}
          <div className="absolute inset-0 z-0">
            <MapComponent onMarkerHover={() => setIsFormUnlocked(true)} />
          </div>

          <div className="max-w-6xl mx-auto w-full relative z-10 pointer-events-none">
            <p className="text-white/50 text-sm tracking-[0.3em] uppercase mb-16 font-mono drop-shadow-md">
              // Let&apos;s Connect
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">

              {/* Left: Contact Info & Glitch Trigger */}
              <div className="flex flex-col justify-center pointer-events-auto">
                <h2 className="font-serif text-5xl md:text-7xl font-normal mb-10 leading-tight tracking-tight drop-shadow-2xl">
                  Let&apos;s build
                  <br />
                  <span className="italic glitch-hover cursor-crosshair">something great.</span>
                </h2>
                <div className="space-y-6 text-white/90 font-sans text-lg drop-shadow-lg">
                  <p className="flex items-center gap-4 cursor-default">
                    <span className="text-[#cb9e0bff] text-xl">◎</span> Casablanca, Morocco
                  </p>
                  <p className="flex items-center gap-4 hover:text-[#cb9e0bff] transition-colors cursor-pointer w-fit">
                    <span className="text-[#cb9e0bff] text-xl">✉</span> adamfartout1@gmail.com
                  </p>
                </div>
              </div>

              {/* Right: Contact Form Panel (Locked/Unlocked) */}
              <div className="relative pointer-events-auto flex items-center justify-center w-full">

                {/* Floating Social Particles (Concept 3) */}
                <AnimatePresence>
                  {isFormUnlocked && (
                    <>
                      <motion.a
                        href="https://www.linkedin.com/in/adam-fartout-4042972b0/"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{ opacity: 1, scale: 1, x: isMobile ? -60 : -40, y: isMobile ? 80 : -200 }}
                        drag dragConstraints={{ top: -300, bottom: 300, left: -300, right: 300 }} dragElastic={0.1}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="absolute w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-[#cb9e0bff]/40 flex items-center justify-center text-[#cb9e0bff] z-0 shadow-[0_0_15px_rgba(203,158,11,0.2)] cursor-grab active:cursor-grabbing"
                      >
                        <FaLinkedin className="text-2xl" />
                      </motion.a>
                      <motion.a
                        href="https://wa.me/+212696215160"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{ opacity: 1, scale: 1, x: isMobile ? 60 : 300, y: isMobile ? 120 : 200 }}
                        drag dragConstraints={{ top: -300, bottom: 300, left: -300, right: 300 }} dragElastic={0.1}
                        whileHover={{ scale: 1.2, rotate: -10 }}
                        className="absolute w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-[#cb9e0bff]/40 flex items-center justify-center text-[#cb9e0bff] z-0 shadow-[0_0_15px_rgba(203,158,11,0.2)] cursor-grab active:cursor-grabbing"
                      >
                        <FaWhatsapp className="text-2xl" />
                      </motion.a>
                      <motion.a
                        href="mailto:adamfartout1@gmail.com"
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{ opacity: 1, scale: 1, x: isMobile ? -30 : 320, y: isMobile ? 180 : -100 }}
                        drag dragConstraints={{ top: -300, bottom: 300, left: -300, right: 300 }} dragElastic={0.1}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        className="absolute w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-[#cb9e0bff]/40 flex items-center justify-center text-[#cb9e0bff] z-0 shadow-[0_0_15px_rgba(203,158,11,0.2)] cursor-grab active:cursor-grabbing"
                      >
                        <FaEnvelope className="text-2xl" />
                      </motion.a>
                      <motion.a
                        href="https://www.instagram.com/adam__frt_?igsh=cDVwNHo1aWJhdXl6"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{ opacity: 1, scale: 1, x: isMobile ? -100 : -80, y: isMobile ? 130 : 150 }}
                        drag dragConstraints={{ top: -300, bottom: 300, left: -300, right: 300 }} dragElastic={0.1}
                        whileHover={{ scale: 1.2, rotate: 20 }}
                        className="absolute w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-[#cb9e0bff]/40 flex items-center justify-center text-[#cb9e0bff] z-0 shadow-[0_0_15px_rgba(203,158,11,0.2)] cursor-grab active:cursor-grabbing"
                      >
                        <FaInstagram className="text-2xl" />
                      </motion.a>
                      <motion.a
                        href="https://github.com/AdamFARTOUT1/AdamFARTOUT1"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{ opacity: 1, scale: 1, x: isMobile ? 80 : 100, y: isMobile ? 40 : -150 }}
                        drag dragConstraints={{ top: -300, bottom: 300, left: -300, right: 300 }} dragElastic={0.1}
                        whileHover={{ scale: 1.2, rotate: -15 }}
                        className="absolute w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-[#cb9e0bff]/40 flex items-center justify-center text-[#cb9e0bff] z-0 shadow-[0_0_15px_rgba(203,158,11,0.2)] cursor-grab active:cursor-grabbing"
                      >
                        <FaGithub className="text-2xl" />
                      </motion.a>
                    </>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="py-24 overflow-hidden" style={{ background: "var(--bg-primary)" }}>
          <div className="text-center">
            <p
              className="font-display font-black uppercase tracking-tighter
                text-6xl md:text-[8rem] lg:text-[12rem] leading-none
                text-transparent whitespace-nowrap px-4"
              style={{
                WebkitTextStroke: "2px #cb9e0bff",
              }}
            >
              Made with lOve
            </p>
            <p className="text-muted text-xs font-mono mt-8 tracking-widest uppercase">
              © {new Date().getFullYear()} Adam Fartout
            </p>
          </div>
        </footer>
      </main>
    </SmoothScroll >
  );
}
