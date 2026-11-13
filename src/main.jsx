import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import './style.css'

const GRID_SIZE = 16
const PALETTE = [
  '#000000', '#ffffff', '#ff0000', '#00ff00',
  '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
  '#ff8800', '#8800ff', '#88ff00', '#0088ff',
  '#884400', '#888888', '#ffcccc', '#00ffaa'
]

const STORAGE_KEY = 'pixellab-canvas'

function App() {
  const [pixels, setPixels] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length === GRID_SIZE * GRID_SIZE) {
          return parsed
        }
      }
    } catch {}
    return Array(GRID_SIZE * GRID_SIZE).fill('#ffffff')
  })

  const [color, setColor] = useState('#000000')
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEraser, setIsEraser] = useState(false)
  const gridRef = useRef(null)

  // অটো-সেভ
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pixels))
    } catch {}
  }, [pixels])

  // মাউস ছাড়লে ড্রয়িং বন্ধ
  useEffect(() => {
    const stop = () => setIsDrawing(false)
    window.addEventListener('mouseup', stop)
    window.addEventListener('touchend', stop)
    return () => {
      window.removeEventListener('mouseup', stop)
      window.removeEventListener('touchend', stop)
    }
  }, [])

  const paint = (i) => {
    const paintColor = isEraser ? '#ffffff' : color
    setPixels(prev => {
      if (prev[i] === paintColor) return prev
      const next = [...prev]
      next[i] = paintColor
      return next
    })
  }

  const clear = () => {
    if (window.confirm('সব মুছে ফেলবেন?')) {
      setPixels(Array(GRID_SIZE * GRID_SIZE).fill('#ffffff'))
    }
  }

  const exportPNG = () => {
    const scale = 20
    const canvas = document.createElement('canvas')
    canvas.width = GRID_SIZE * scale
    canvas.height = GRID_SIZE * scale
    const ctx = canvas.getContext('2d')
    for (let i = 0; i < pixels.length; i++) {
      const x = (i % GRID_SIZE) * scale
      const y = Math.floor(i / GRID_SIZE) * scale
      ctx.fillStyle = pixels[i]
      ctx.fillRect(x, y, scale, scale)
    }
    const link = document.createElement('a')
    link.download = `pixellab-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    const el = document.elementFromPoint(touch.clientX, touch.clientY)
    if (el && el.dataset.index !== undefined) {
      paint(Number(el.dataset.index))
    }
  }

  return (
    <div className="app">
      <header>
        <h1>🎨 PixelLab</h1>
        <p>সহজ পিক্সেল আর্ট এডিটর</p>
      </header>

      <div className="palette">
        {PALETTE.map(c => (
          <button
            key={c}
            className={`swatch ${!isEraser && color === c ? 'active' : ''}`}
            style={{ background: c }}
            onClick={() => { setColor(c); setIsEraser(false) }}
            aria-label={`রঙ ${c}`}
          />
        ))}
        <input
          type="color"
          value={color}
          onChange={e => { setColor(e.target.value); setIsEraser(false) }}
          className="color-picker"
          title="কাস্টম রঙ"
        />
      </div>

      <div
        ref={gridRef}
        className="grid"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        onMouseLeave={() => setIsDrawing(false)}
        onTouchMove={handleTouchMove}
      >
        {pixels.map((c, i) => (
          <div
            key={i}
            data-index={i}
            className="cell"
            style={{ background: c }}
            onMouseDown={() => { setIsDrawing(true); paint(i) }}
            onMouseEnter={() => isDrawing && paint(i)}
            onTouchStart={(e) => { e.preventDefault(); paint(i) }}
          />
        ))}
      </div>

      <div className="controls">
        <button
          className={isEraser ? 'eraser active' : 'eraser'}
          onClick={() => setIsEraser(v => !v)}
        >
          {isEraser ? '🧽 ইরেজার (অন)' : '🧽 ইরেজার'}
        </button>
        <button className="clear" onClick={clear}>🗑️ ক্লিয়ার</button>
        <button className="export" onClick={exportPNG}>⬇️ PNG</button>
      </div>

      <p className="status">
        বর্তমান রঙ:{' '}
        <span className="preview" style={{ background: isEraser ? '#ffffff' : color }} />
        {isEraser && ' (ইরেজার মোড)'}
      </p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)