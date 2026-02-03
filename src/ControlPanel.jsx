import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { useRef, useEffect } from 'react'
import { useStore } from '../store'

export function ControlPanel() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const itemsRef = useRef([])

  // Дістаємо стан з Zustand store
  const activePart = useStore((state) => state.activePart)
  const colors = useStore((state) => state.colors)
  const setActivePart = useStore((state) => state.setActivePart)
  const setColor = useStore((state) => state.setColor)

  const activeColor = colors[activePart] || '#222222'
  const colorSwatches = ['#ff0000', '#00ff00', '#0000ff', '#222']
  const parts = ['Сидіння', 'Спинка', 'Колеса']

  // Анімація появи елементів dropdown за допомогою GSAP
  useEffect(() => {
    if (isDropdownOpen) {
      gsap.to(itemsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'back.out'
      })
    }
  }, [isDropdownOpen])

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handlePartSelect = (part) => {
    setActivePart(part)
    setIsDropdownOpen(false)
  }

  const handleColorSelect = (color) => {
    setColor(activePart, color)
  }

  return (
    <div className="fixed top-6 right-6 w-80 z-50">
      {/* Панель з glassmorphism ефектом */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
        {/* Заголовок */}
        <h2 className="text-white text-lg font-semibold mb-6 tracking-wide">
          Конфігуратор крісла
        </h2>

        {/* Секція кольорів */}
        <div className="mb-6">
          <p className="text-white/70 text-sm font-medium mb-3">Колір обшивки</p>
          <div className="flex gap-3">
            {colorSwatches.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-10 h-10 rounded-full transition-all duration-300 ${
                  activeColor === color
                    ? 'border-2 border-white scale-110 shadow-lg'
                    : 'border-2 border-white/30 hover:border-white/60'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Dropdown для вибору частин */}
        <div className="relative">
          <p className="text-white/70 text-sm font-medium mb-2">Частина крісла</p>
          
          <button
            onClick={handleDropdownToggle}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg 
                       text-white/90 flex items-center justify-between hover:bg-white/10
                       transition-all duration-200 group"
          >
            <span className="text-sm font-medium">{activePart}</span>
            <ChevronDown 
              size={18} 
              className={`transition-transform duration-300 group-hover:text-white 
                          ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown меню */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md 
                         border border-white/20 rounded-lg overflow-hidden shadow-2xl"
            >
              {parts.map((part, index) => (
                <button
                  key={part}
                  ref={(el) => (itemsRef.current[index] = el)}
                  onClick={() => handlePartSelect(part)}
                  className={`w-full px-4 py-3 text-left text-sm font-medium
                             transition-all duration-200 opacity-0 translate-y-2
                             ${
                               activePart === part
                                 ? 'bg-white/20 text-white border-l-4 border-white'
                                 : 'text-white/70 hover:bg-white/10 hover:text-white'
                             }`}
                  style={{
                    borderLeft: activePart === part ? '4px solid white' : 'none'
                  }}
                >
                  {part}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Інформація про активні налаштування */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-white/50 text-xs">
            Колір: <span className="text-white/80 font-mono">{activeColor}</span>
          </p>
          <p className="text-white/50 text-xs mt-1">
            Частина: <span className="text-white/80">{activePart}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
