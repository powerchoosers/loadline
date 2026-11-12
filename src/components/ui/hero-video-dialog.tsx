"use client"

import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Play, XIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out"

interface HeroVideoProps {
  animationStyle?: AnimationStyle
  videoSrc: string
  thumbnailSrc: string
  thumbnailAlt?: string
  className?: string
  /** Local slot for an honest storyboard placeholder or a self-hosted video. */
  children?: ReactNode
  triggerLabel?: string
  title?: string
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
}

export function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
  children,
  triggerLabel = "Play video",
  title = "Loadline product film",
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const reduce = useReducedMotion()
  const selectedAnimation = reduce ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } } : animationVariants[animationStyle]
  useEffect(() => {
    if (!isVideoOpen) return
    const site = document.getElementById("site")
    const wasInert = site?.inert || false
    if (site) site.inert = true
    document.documentElement.classList.add("video-viewing")
    closeRef.current?.focus()
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setIsVideoOpen(false) }
      if (event.key !== "Tab") return
      const controls = [...(modalRef.current?.querySelectorAll<HTMLElement>('button,a[href],video,[tabindex="0"]') || [])].filter(node => node.getClientRects().length)
      const first = controls[0], last = controls.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener("keydown", keyboard)
    return () => {
      document.removeEventListener("keydown", keyboard)
      if (site) site.inert = wasInert
      document.documentElement.classList.remove("video-viewing")
      triggerRef.current?.focus({ preventScroll: true })
    }
  }, [isVideoOpen])

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        ref={triggerRef}
        aria-label={triggerLabel}
        aria-haspopup="dialog"
        className="group relative cursor-pointer border-0 bg-transparent p-0"
        onClick={() => setIsVideoOpen(true)}
      >
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1920}
          height={1080}
          className="w-full rounded-md border shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]"
        />
        <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
          <div className="bg-primary/10 flex size-28 items-center justify-center rounded-full backdrop-blur-md">
            <div
              className={`from-primary/30 to-primary relative flex size-20 scale-100 items-center justify-center rounded-full bg-linear-to-b shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]`}
            >
              <Play
                className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                style={{
                  filter:
                    "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
                }}
              />
            </div>
          </div>
        </div>
      </button>
      {typeof document !== "undefined" && createPortal(<AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: reduce ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : .18 }}
            onClick={() => setIsVideoOpen(false)}
            exit={{ opacity: reduce ? 1 : 0 }}
            className="film-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              {...selectedAnimation}
              transition={reduce ? { duration: 0 } : { type: "spring", damping: 30, stiffness: 300 }}
              className="film-dialog relative mx-4 w-full max-w-4xl md:mx-0"
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={(event) => event.stopPropagation()}
            >
              <h2 className="film-modal-title" id={titleId}>{title}</h2>
              <motion.button ref={closeRef} type="button" aria-label="Close product film" onClick={() => setIsVideoOpen(false)} className="film-close absolute right-0 rounded-full p-2 text-xl">
                <XIcon className="size-5" />
              </motion.button>
              <div className="film-content relative isolate z-1 size-full overflow-hidden">
                {children || <iframe
                  src={videoSrc}
                  title="Hero Video player"
                  className="mt-0 size-full rounded-2xl"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </div>
  )
}
