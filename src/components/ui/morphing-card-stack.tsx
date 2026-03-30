"use client"

import { useState, type ReactNode } from "react"
import { motion, AnimatePresence, LayoutGroup, type PanInfo } from "framer-motion"
import { cn } from "@/lib/utils"
import { Grid3X3, Layers, LayoutList } from "lucide-react"

export type LayoutMode = "stack" | "grid" | "list"

export interface CardData {
  id: string
  title: string
  description: string
  icon?: ReactNode
  color?: string
}

export interface MorphingCardStackProps {
  cards?: CardData[]
  className?: string
  defaultLayout?: LayoutMode
  onCardClick?: (card: CardData) => void
}

const layoutIcons = {
  stack: Layers,
  grid: Grid3X3,
  list: LayoutList,
}

const SWIPE_THRESHOLD = 50

export function MorphingCardStack({
  cards = [],
  className,
  defaultLayout = "stack",
  onCardClick,
}: MorphingCardStackProps) {
  const [layout, setLayout] = useState<LayoutMode>(defaultLayout)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  if (!cards || cards.length === 0) {
    return null
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info
    const swipe = Math.abs(offset.x) * velocity.x

    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      setActiveIndex((prev) => (prev + 1) % cards.length)
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length)
    }
    setIsDragging(false)
  }

  const getStackOrder = () => {
    const reordered = []
    for (let i = 0; i < cards.length; i++) {
      const index = (activeIndex + i) % cards.length
      reordered.push({ ...cards[index], stackPosition: i })
    }
    return reordered.reverse()
  }

  const getLayoutStyles = (stackPosition: number) => {
    switch (layout) {
      case "stack":
        return {
          top: stackPosition * 8,
          left: stackPosition * 8,
          zIndex: cards.length - stackPosition,
          rotate: (stackPosition - 1) * 2,
        }
      case "grid":
      case "list":
        return { top: 0, left: 0, zIndex: 1, rotate: 0 }
    }
  }

  const containerStyles = {
    stack: "relative h-56 w-full max-w-[280px] sm:h-72 sm:w-80",
    grid: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4",
    list: "flex flex-col gap-3 sm:gap-4 w-full max-w-2xl",
  }

  const displayCards = layout === "stack" ? getStackOrder() : cards.map((c, i) => ({ ...c, stackPosition: i }))

  return (
    <div className={cn("space-y-6 sm:space-y-8", className)}>
      {/* Layout Toggle */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 p-1 w-fit mx-auto" style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        {(Object.keys(layoutIcons) as LayoutMode[]).map((mode) => {
          const Icon = layoutIcons[mode]
          return (
            <button
              key={mode}
              onClick={() => setLayout(mode)}
              className={cn(
                "p-1.5 sm:p-2 transition-all font-mono uppercase text-xs tracking-widest",
                layout === mode ? "font-bold" : "hover:opacity-100",
              )}
              style={{
                background: layout === mode ? 'var(--accent)' : 'transparent',
                color: layout === mode ? 'var(--bg-primary)' : 'var(--text-muted)',
              }}
              aria-label={`Switch to ${mode} layout`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
            </button>
          )
        })}
      </div>

      {/* Cards Container */}
      <LayoutGroup>
        <motion.div layout className={cn(containerStyles[layout], "mx-auto")}>
          <AnimatePresence mode="popLayout">
            {displayCards.map((card) => {
              const styles = getLayoutStyles(card.stackPosition)
              const isExpanded = expandedCard === card.id
              const isTopCard = layout === "stack" && card.stackPosition === 0

              return (
                <motion.div
                  key={card.id}
                  layoutId={card.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isExpanded ? 1.02 : 1,
                    x: 0,
                    ...styles,
                  }}
                  exit={{ opacity: 0, scale: 0.8, x: -200 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  drag={isTopCard ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                  onClick={() => {
                    if (isDragging) return
                    setExpandedCard(isExpanded ? null : card.id)
                    onCardClick?.(card)
                  }}
                  className={cn(
                    "cursor-pointer p-4 sm:p-5 transition-colors backdrop-blur-sm",
                    layout === "stack" && "absolute w-full h-full max-w-[280px] sm:w-80 sm:h-64",
                    layout === "stack" && isTopCard && "cursor-grab active:cursor-grabbing",
                    layout === "grid" && "w-full min-h-[180px] sm:min-h-[200px] flex flex-col justify-between",
                    layout === "list" && "w-full flex-row items-center",
                  )}
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    border: isExpanded ? '1px solid var(--accent)' : '1px solid var(--border)',
                    boxShadow: isExpanded ? '0 0 20px var(--accent-glow)' : 'none',
                  }}
                >
                  <div className={cn(
                    "flex gap-3 sm:gap-4 h-full",
                    layout === "grid" ? "flex-col" : "flex-row items-start"
                  )}>
                    {card.icon && (
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center bg-transparent" style={{ border: '1px solid var(--border-hover)', color: 'var(--accent)' }}>
                        {card.icon}
                      </div>
                    )}
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <h3 className="font-bold font-mono text-base sm:text-lg md:text-xl tracking-widest uppercase truncate border-b border-dotted pb-2 mb-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
                        {card.title}
                      </h3>
                      <p className={cn(
                        "text-xs sm:text-sm font-mono normal-case tracking-normal leading-relaxed",
                        layout === "stack" && "line-clamp-3 sm:line-clamp-4",
                        layout === "grid" && "line-clamp-3",
                        layout === "list" && "line-clamp-2",
                      )}>
                        <span style={{ color: 'var(--text-secondary)' }}>{card.description}</span>
                      </p>
                    </div>
                  </div>

                  {isTopCard && (
                    <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 text-center">
                      <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                        &lt; SWIPE TO NAVIGATE &gt;
                      </span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Pagination */}
      {layout === "stack" && cards.length > 1 && (
        <div className="flex justify-center gap-2 mt-6 sm:mt-8">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn("h-1 transition-all rounded-none", index === activeIndex ? "w-6 sm:w-8" : "w-2")}
              style={{ background: index === activeIndex ? 'var(--accent)' : 'var(--border)' }}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
