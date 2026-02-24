"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"


gsap.registerPlugin(ScrollTrigger)

export default function Home() {

  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {

    if (!containerRef.current) return

    let locoScroll: any
    let ctx: gsap.Context
    let mouseHandler: any

    const init = async () => {

      // ✅ Dynamic import (IMPORTANT for Next)
     const module = await import("locomotive-scroll")
      const LocomotiveScroll = module.default

      locoScroll = new LocomotiveScroll({
        el: containerRef.current!,
        smooth: true,
        multiplier: 0.8
      })

      locoScroll.on("scroll", ScrollTrigger.update)

      ScrollTrigger.scrollerProxy(containerRef.current!, {
        scrollTop(value) {
          if (arguments.length) {
            locoScroll.scrollTo(value, 0, 0)
          }
          return locoScroll.scroll.instance.scroll.y
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      })

      ScrollTrigger.addEventListener("refresh", () => locoScroll.update())
      ScrollTrigger.refresh()

      // 🎬 GSAP Context
      ctx = gsap.context(() => {

        // 🔥 Car left entry
        gsap.from(imageRef.current, {
          x: -800,
          opacity: 0,
          duration: 1.8,
          ease: "power4.out"
        })

        // 🔥 Headline stagger
        gsap.from(".letter", {
          y: 120,
          opacity: 0,
          duration: 1.2,
          stagger: 0.05,
          ease: "power4.out"
        })

        // 🔥 Stats
        gsap.from(statsRef.current!.children, {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          delay: 0.5,
          ease: "power3.out"
        })

        // 🎬 Scroll Cinematic Pin
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            scroller: containerRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 2,
            pin: true
          }
        })

        tl.to(imageRef.current, {
          scale: 1.2,
          y: -200
        }, 0)

        tl.to(".headline", {
          opacity: 0.1,
          y: -100
        }, 0)

        tl.to(statsRef.current, {
          opacity: 0,
          y: -40
        }, 0)

      }, heroRef)

      // 🌀 Mouse Parallax
      mouseHandler = (e: MouseEvent) => {
        const x = (e.clientX - window.innerWidth / 2) / 25
        const y = (e.clientY - window.innerHeight / 2) / 25

        gsap.to(imageRef.current, {
          x,
          y: y - 200,
          duration: 0.6,
          ease: "power2.out"
        })
      }

      heroRef.current?.addEventListener("mousemove", mouseHandler)
    }

    init()

    return () => {
      if (locoScroll) locoScroll.destroy()
      if (ctx) ctx.revert()
      if (heroRef.current && mouseHandler) {
        heroRef.current.removeEventListener("mousemove", mouseHandler)
      }
    }

  }, [])

  return (
    <div ref={containerRef} data-scroll-container>

      <main className="bg-black text-white overflow-hidden">

        {/* HERO */}
        <section
          ref={heroRef}
          data-scroll-section
          className="h-screen relative flex flex-col items-center justify-center overflow-hidden bg-black"
        >

          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black z-10" />
          <div className="absolute w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full top-20" />

          <div className="headline z-20 text-center">
            <h1 className="text-5xl md:text-8xl font-black tracking-[0.7em] flex justify-center">
              {"WELCOME".split("").map((l, i) => (
                <span key={i} className="letter inline-block">{l}</span>
              ))}
            </h1>

            <h1 className="text-3xl md:text-6xl font-light tracking-[0.6em] mt-6 flex justify-center opacity-80">
              {"ITZFIZZ".split("").map((l, i) => (
                <span key={i} className="letter inline-block">{l}</span>
              ))}
            </h1>
          </div>

          <div
            ref={statsRef}
            className="flex gap-12 mt-14 text-center z-20"
          >
            <div>
              <h2 className="text-4xl font-bold">250%</h2>
              <p className="text-xs uppercase tracking-widest opacity-60">Growth</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold">120K</h2>
              <p className="text-xs uppercase tracking-widest opacity-60">Users</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold">98%</h2>
              <p className="text-xs uppercase tracking-widest opacity-60">Satisfaction</p>
            </div>
          </div>

          <img
            ref={imageRef}
            src="/car.JPG"
            alt="Car"
            className="absolute bottom-[-5%] w-[80%] max-w-[1200px] object-contain will-change-transform pointer-events-none"
          />

        </section>

        {/* NEXT SECTION */}
        <section
          data-scroll-section
          className="h-screen bg-neutral-900 flex flex-col items-center justify-center text-center px-6"
        >
          <h2 className="text-6xl md:text-7xl font-bold mb-6 tracking-wide">
            Driven By Innovation
          </h2>

          <p className="max-w-2xl text-lg opacity-60 leading-relaxed">
            Experience motion crafted with precision.
            Scroll-driven storytelling meets performance engineering
            to create immersive digital journeys.
          </p>
        </section>

      </main>
    </div>
  )
}