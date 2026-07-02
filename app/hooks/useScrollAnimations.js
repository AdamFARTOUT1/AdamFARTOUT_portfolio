"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimations() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Wait for DOM to be ready
    const ctx = gsap.context(() => {
      // ─── Hero Title Reveal (Dynamic to Video Duration) ───
      const heroVideo = document.getElementById("hero-video");
      
      const animateHero = (vidDuration) => {
        // The name comes from above and reaches the center precisely as the video ends
        gsap.fromTo("#hero h1", 
          { y: "-60vh", opacity: 0 },
          { y: 0, opacity: 1, duration: vidDuration, ease: "power2.out" }
        );

        // Subtitle fades in quickly
        gsap.from("#subtitle-bg", {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 1.5,
        });

        // Background highlights when video ends (matching title lock)
        gsap.to("#subtitle-bg", {
          backgroundColor: "#cb9e0bff",
          duration: 0.5,
          delay: vidDuration,
          ease: "power2.out",
        });
      };

      if (heroVideo) {
        if (heroVideo.readyState >= 1) {
          animateHero(heroVideo.duration || 4);
        } else {
          heroVideo.addEventListener("loadedmetadata", () => {
            animateHero(heroVideo.duration || 4);
          });
        }
      } else {
        animateHero(4);
      }

      // ─── Smooth Video Fade-Out ───
      // Fade out the video as user scrolls away from hero
      gsap.to("#hero-video", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "50% top",   // start fading at halfway through hero
          end: "bottom top",  // fully invisible by end of hero
          scrub: 0.5,         // smooth 0.5s lag for buttery feel
        },
      });

      // ─── About Section ───
      // Fade in the label
      gsap.from("#about > div > p:first-child", {
        x: -40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: "#about",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Reveal each word/line of the About text
      const aboutHeading = document.querySelector("#about h2");
      if (aboutHeading) {
        // Animate child spans (keywords) with a stagger
        const spans = aboutHeading.querySelectorAll("span");
        gsap.from(spans, {
          opacity: 0.2,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: "#about",
            start: "top 60%",
            end: "center center",
            scrub: 1,
          },
        });

        // Overall heading fade-in
        gsap.from(aboutHeading, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#about",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Fade in the section label
      gsap.from("#journey p.uppercase", {
        y: -20,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: "#journey",
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      const journeyCards = gsap.utils.toArray("#journey .journey-card");
      if (journeyCards.length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#journey",
            start: "top top",
            end: "+=200%",
            scrub: 1,
            pin: true,
          },
        });

        // 1. Initial state: First card fades in
        tl.to(journeyCards[0], { opacity: 1, y: 0, duration: 1 }, 0);

        // 2. Loop through the rest of the cards
        journeyCards.forEach((card, i) => {
          if (i === 0) return;

          // Fade out and move up the previous card
          tl.to(journeyCards[i - 1], { opacity: 0, y: -48, duration: 1 }, "+=0.5");
          
          // Fade in and move up the current card (slight overlap for continuity)
          tl.to(card, { opacity: 1, y: 0, duration: 1 }, "<0.2");
        });

        // 3. Add some padding at the end of the timeline so the last card stays on screen
        tl.to({}, { duration: 1 });
      }

      // ─── Global Background Transition ───
      // Smoothly animate the page background to gold/yellow when the Projects section is active
      gsap.to("main", {
        backgroundColor: "#cb9e0bff",
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#projects",
          start: "top 50%",
          end: "+=350%", // Covers the 300% pin duration + 50% extra
          toggleActions: "play reverse play reverse",
        }
      });

      // ─── Projects Section (Stacked Card Overlay) ───
      gsap.from("#projects p.uppercase", {
        y: -20,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: "#projects",
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      const pCards = gsap.utils.toArray("#projects .project-card");

      if (pCards.length > 0) {
        // Initial state: Cards perfectly centered. Only first card is visible.
        pCards.forEach((card, i) => {
          gsap.set(card, {
            scale: i === 0 ? 1 : 0.95,
            opacity: i === 0 ? 1 : 0,
            yPercent: 0,
            xPercent: 0,
            zIndex: pCards.length - i,
          });
        });

        const tlProjects = gsap.timeline({
          scrollTrigger: {
            trigger: "#projects",
            start: "top top",
            end: "+=300%",
            scrub: 1,
            pin: true,
          },
        });

        pCards.forEach((card, i) => {
          if (i === pCards.length - 1) return; // Last card stays

          const nextCard = pCards[i + 1];
          const label = `step${i}`;

          // Active card scales down slightly and fades out (perfectly centered)
          tlProjects.to(card, {
            scale: 0.95,
            opacity: 0,
            duration: 1,
          }, label);

          // Next card scales up to 100% and fades in (perfectly centered)
          tlProjects.to(nextCard, {
            scale: 1,
            opacity: 1,
            duration: 1,
          }, label);

          // Add a pause before the next scroll step
          tlProjects.to({}, { duration: 0.8 });
        });

        // Add padding at the end so the last card stays on screen
        tlProjects.to({}, { duration: 1 });
      }

      // ─── Skills Bento Grid ───
      // Pin Arsenal but allow Contact to slide OVER it
      ScrollTrigger.create({
        trigger: "#skills",
        start: "top top",
        end: "+=100%", 
        pin: true,
        pinSpacing: false, // The magic property that lets the next section slide over!
      });

      gsap.from("#skills > div > p:first-child", {
        x: -40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: "#skills",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });


      // ─── Contact Section ───

      gsap.from("#contact > div > p:first-child", {
        x: -40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: "#contact",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Contact left side
      gsap.from("#contact h2", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#contact",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });


      // ─── Footer "Made with LOVE" ───
      gsap.from("footer p:first-child", {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "footer",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => ctx.revert();
  }, []);
}
