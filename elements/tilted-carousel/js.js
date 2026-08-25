import React, { useState, useEffect } from "https://esm.sh/react@19"
import { createRoot } from "https://esm.sh/react-dom@19/client"
import { motion } from "https://esm.sh/motion/react"
import { ChevronLeft, ChevronRight } from "https://esm.sh/lucide-react"

const ASSETS = [
  {
    src: 'https://images.unsplash.com/photo-1769921546096-7a648d953a3e?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'urban exploration',
  },
  {
    src: 'https://images.unsplash.com/photo-1777726515600-65be20641e1b?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'night scene',
  },
  {
    src: 'https://images.unsplash.com/photo-1776582929657-9710d9cfa46a?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'yellow wildflowers',
  },
  {
    src: 'https://images.unsplash.com/photo-1776582929656-78ad8b515d75?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'street with mount fuji',
  },
  {
    src: 'https://images.unsplash.com/photo-1775990630948-3c1f696f4ab1?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'bridgestone bicycle shop',
  },
  {
    src: 'https://images.unsplash.com/photo-1775380744191-8fbff371c40b?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'train window view',
  },
  {
    src: 'https://images.unsplash.com/photo-1774775479879-082fd47d41e1?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'train tracks',
  },
  {
    src: 'https://images.unsplash.com/photo-1773544517453-95c148cb42b7?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'lawson convenience store',
  },
  {
    src: 'https://images.unsplash.com/photo-1771385809377-9b0348e1f8dc?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'street scene',
  },
  {
    src: 'https://images.unsplash.com/photo-1775990631076-f6f208079475?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'japanese culture',
  },
]

const App = () => {
  const [activeIndex, setActiveIndex] = useState(3)

  const toPrev = () => {
    setActiveIndex(prev => Math.max(0, prev - 1))
  }

  const toNext = () => {
    setActiveIndex(prev => Math.min(ASSETS.length - 1, prev + 1))
  }

  const toSlide = (index) => {
    setActiveIndex(index)
  }

  return (
    <div className="p-2 text-neutral-800 select-none">
      {/* carousel wrapper */}
      <div className="w-30 md:w-50 mt-8">
        {/* slides container */}
        <motion.div 
          className="flex w-fit" 
          animate={{ x: `${-activeIndex * 100 / ASSETS.length}%` }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
          >

          {ASSETS.map((item, i) => {
            const isActive = activeIndex === i
            {/* slide */}
            return (
              <div className="perspective-midrange" key={i}>
                <motion.div 
                  className="w-30 md:w-50 aspect-3/4 flex flex-col items-center gap-2 will-change-[transform,scale]"
                  animate={{ rotateY: (activeIndex - i) * 60, scale: isActive ? 1 : 0.85  }}
                  transition={{ type: 'spring', bounce: 0.1, duration: 1 }}
                  >
                  <img src={item.src} alt={item.title} className="w-full h-full object-cover rounded-lg" onClick={() => toSlide(i)} />

                  <motion.div 
                    className="text-xs md:text-sm whitespace-nowrap will-change-[opacity,filter]" 
                    animate={{ filter: isActive ? 'blur(0)' : 'blur(2px)', opacity: isActive ? 1 : 0 }}
                    >
                    {item.title}
                  </motion.div>
                </motion.div>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* controls */}
      <div className="fixed bottom-4 left-0 right-0 w-fit px-2 mx-auto flex items-center gap-4 justify-center text-neutral-700 rounded-full bg-neutral-200/50 backdrop-blur-xs border border-neutral-200/80 shadow-sm">
        {/* prev button */}
        <button onClick={toPrev} className="p-2 cursor-pointer">
          <ChevronLeft />
        </button>
        {/* slide dots */}
        <div className="w-[180px] flex justify-center items-center gap-2">
          {ASSETS.map((_, i) => (
            <div 
              key={i} 
              onClick={() => toSlide(i)}
              className={`rounded-full cursor-pointer h-2 transition-[width,background-color] duration-300 ${activeIndex === i ? 'w-7 bg-current' : 'w-2 bg-current/30'}`}>
            </div>
          ))}
        </div>
        {/* next button */}
        <button onClick={toNext} className="p-2 cursor-pointer">
          <ChevronRight />
        </button>
      </div>

    </div>
  )
}

const root = createRoot(document.getElementById("app"))

root.render(<App />)