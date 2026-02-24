"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const heroRef     = useRef<HTMLElement>(null)
  const carWrapRef  = useRef<HTMLDivElement>(null)   // GSAP animates this wrapper
  const headlineRef = useRef<HTMLDivElement>(null)
  const statsRef    = useRef<HTMLDivElement>(null)
  const overlayRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.style.background = "#080808"
    document.body.style.background            = "#080808"

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {

        /* ── Opening flash ──────────────────────────────── */
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            if (overlayRef.current) overlayRef.current.style.display = "none"
          }
        })

        /* ── Letters stagger in ─────────────────────────── */
        gsap.from(".hero-letter", {
          y: 80,
          opacity: 0,
          duration: 1.0,
          stagger: 0.045,
          ease: "power3.out",
          delay: 0.3,
        })

        /* ── Stats fade up ──────────────────────────────── */
        gsap.from(".stat-item", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.9,
        })

        /* ── Car glides in from left ────────────────────── */
        gsap.fromTo(
          carWrapRef.current,
          { xPercent: -110, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            duration: 2.8,
            ease: "power2.out",
            delay: 0.1,
            onComplete: function () {
              if (carWrapRef.current) gsap.set(carWrapRef.current, { clearProps: "xPercent,opacity" })
            },
          }
        )

        /* ── Scroll: car rises + scales ─────────────────── */
        gsap.to(carWrapRef.current, {
          yPercent: -30,
          scale: 1.15,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        })

        /* ── Scroll: headline fades out ─────────────────── */
        gsap.to(headlineRef.current, {
          yPercent: -20,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "45% top",
            scrub: 1,
          },
        })

        /* ── Scroll: stats fade out ─────────────────────── */
        gsap.to(statsRef.current, {
          yPercent: -15,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "35% top",
            scrub: 1,
          },
        })

        /* ── Mouse parallax (desktop only) ─────────────── */
        const handleMouse = (e: MouseEvent) => {
          const nx = ((e.clientX / window.innerWidth)  - 0.5) * 28
          const ny = ((e.clientY / window.innerHeight) - 0.5) * 12
          gsap.to(carWrapRef.current, {
            x: nx, y: ny,
            duration: 0.9,
            ease: "power2.out",
            overwrite: "auto",
          })
        }
        if (window.innerWidth >= 768) {
          heroRef.current?.addEventListener("mousemove", handleMouse)
        }

        return () => {
          heroRef.current?.removeEventListener("mousemove", handleMouse)
        }
      })

      return () => ctx.revert()
    }, 80)

    return () => clearTimeout(timer)
  }, [])

  const displayFont = "'Bebas Neue', sans-serif"
  const bodyFont    = "'DM Sans', sans-serif"

  return (
    <>
      {/* Cinematic black overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed", inset: 0,
          background: "#000",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />

      <div style={{ background: "#080808", color: "#f0ede8", overflowX: "hidden" }}>

        {/* ══════════════════════════ HERO ══════════════════════════ */}
        <section
          ref={heroRef}
          style={{
            position: "relative",
            width: "100%",
            height: "100svh",
            minHeight: 600,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: "clamp(4rem, 12vh, 9rem)",
            background: "#080808",
          }}
        >
          {/* Gold glow orb top-center */}
          <div style={{
            position: "absolute",
            top: "-8%", left: "50%", transform: "translateX(-50%)",
            width: "clamp(220px, 55vw, 680px)",
            height: "clamp(220px, 55vw, 680px)",
            background: "radial-gradient(circle, rgba(200,169,110,0.13) 0%, transparent 70%)",
            filter: "blur(55px)",
            pointerEvents: "none",
            zIndex: 1,
          }} />

          {/* Radial vignette */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 85% 85% at 50% 45%, transparent 30%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.92) 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }} />

          {/* Bottom fade */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "36%",
            background: "linear-gradient(to top, #080808 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 8,
          }} />

          {/* ── Headline ── */}
          <div ref={headlineRef} style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 clamp(0.5rem,4vw,2rem)" }}>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", overflow: "hidden" }}>
              {"WELCOME".split("").map((l, i) => (
                <span key={i} className="hero-letter" style={{
                  fontFamily: displayFont,
                  fontSize: "clamp(2.6rem, 10vw, 9rem)",
                  letterSpacing: "0.18em",
                  lineHeight: 1,
                  color: "#f0ede8",
                  display: "inline-block",
                }}>
                  {l}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", overflow: "hidden", marginTop: "clamp(0.1rem,1vw,0.45rem)" }}>
              {"ITZFIZZ".split("").map((l, i) => (
                <span key={i} className="hero-letter" style={{
                  fontFamily: displayFont,
                  fontSize: "clamp(1.3rem, 4.8vw, 4.5rem)",
                  letterSpacing: "0.28em",
                  lineHeight: 1,
                  color: "#c8a96e",
                  display: "inline-block",
                }}>
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* ── Stats ── */}
          <div
            ref={statsRef}
            style={{
              position: "relative", zIndex: 10,
              display: "flex",
              gap: "clamp(1.4rem, 5vw, 4.5rem)",
              marginTop: "clamp(1.2rem, 3.5vw, 2.2rem)",
            }}
          >
            {[
              { value: "250%", label: "Growth"      },
              { value: "120K", label: "Users"        },
              { value: "98%",  label: "Satisfaction" },
            ].map(({ value, label }) => (
              <div key={label} className="stat-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.28rem" }}>
                <span style={{ fontFamily: displayFont, fontSize: "clamp(1.4rem, 3.6vw, 2.7rem)", color: "#f0ede8", letterSpacing: "0.06em", lineHeight: 1 }}>
                  {value}
                </span>
                <span style={{ fontFamily: bodyFont, fontSize: "clamp(0.48rem, 1.1vw, 0.68rem)", color: "rgba(240,237,232,0.5)", textTransform: "uppercase" as const, letterSpacing: "0.26em", fontWeight: 500 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* ── Car wrapper — GSAP animates this ── */}
          <div
            ref={carWrapRef}
            style={{
              position: "absolute",
              bottom: "-3%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(100vw, 1200px)",
              willChange: "transform",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 5,
            }}
          >
            {/* The actual car image — desaturated + blended to kill red bg */}
            <img
              src="/car.JPG"
              alt="Sports Car"
              style={{
                width: "100%",
                display: "block",
                objectFit: "contain",
                // Kill the red background:
                // luminosity blend uses only the brightness of the photo,
                // inheriting the dark page color instead of the image color
                mixBlendMode: "luminosity",
                // Boost contrast so car body stays sharp, reduce saturation to kill red cast
                filter: "contrast(1.18) brightness(0.88) saturate(0.1)",
              }}
            />

            {/* Left smoke edge fade */}
            <div style={{
              position: "absolute", top: 0, left: 0, bottom: 0,
              width: "22%",
              background: "linear-gradient(to right, #080808 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }} />

            {/* Right smoke edge fade */}
            <div style={{
              position: "absolute", top: 0, right: 0, bottom: 0,
              width: "22%",
              background: "linear-gradient(to left, #080808 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }} />

            {/* Top fade — kills sky/studio background at top */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: "50%",
              background: "linear-gradient(to bottom, #080808 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }} />

            {/* Radial mask — darkens corners, keeps car centre bright */}
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse 65% 55% at 50% 62%, transparent 30%, rgba(8,8,8,0.75) 80%, #080808 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }} />

            {/* Reflection / ground shadow underneath car */}
            <div style={{
              position: "absolute",
              bottom: "-8%", left: "10%", right: "10%",
              height: "18%",
              background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(200,169,110,0.08) 0%, transparent 100%)",
              filter: "blur(8px)",
              pointerEvents: "none",
              zIndex: 3,
            }} />
          </div>

        </section>

        {/* ══════════════════════════ SECTION 2 ══════════════════════════ */}
        <section
          style={{
            minHeight: "100svh",
            background: "#111111",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "clamp(4rem,10vw,8rem) clamp(1.5rem,6vw,5rem)",
            position: "relative",
          }}
        >
          <div style={{
            position: "absolute", top: 0, left: "10%", right: "10%",
            height: 1,
            background: "linear-gradient(to right, transparent, rgba(200,169,110,0.5), transparent)",
          }} />

          <p style={{ fontFamily: bodyFont, fontSize: "clamp(0.52rem,1.3vw,0.76rem)", letterSpacing: "0.38em", color: "#c8a96e", textTransform: "uppercase", fontWeight: 500, marginBottom: "clamp(0.7rem,2vw,1.3rem)" }}>
            EST. 2024
          </p>

          <h2 style={{ fontFamily: displayFont, fontSize: "clamp(2.2rem, 7vw, 6.5rem)", lineHeight: 1.0, letterSpacing: "0.04em", color: "#f0ede8", marginBottom: "clamp(1rem,2.5vw,2rem)" }}>
            Driven By<br />Innovation
          </h2>

          <p style={{ fontFamily: bodyFont, fontSize: "clamp(0.85rem,1.8vw,1.1rem)", color: "rgba(240,237,232,0.52)", lineHeight: 1.8, maxWidth: 560, fontWeight: 300 }}>
            Experience motion crafted with precision.
            Scroll-driven storytelling meets performance engineering
            to create immersive digital journeys.
          </p>
        </section>

      </div>
    </>
  )
}



