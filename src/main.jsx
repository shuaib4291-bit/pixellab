import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './style.css'

const GRID_SIZE = 16
const PALETTE = [
  '#000000', '#ffffff', '#ff0000', '#00ff00',
  '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
  '#ff8800', '#8800ff', '#88ff00', '#0088ff',
  '#884400', '#888888', '#ffcccc', '#00ffaa'
]

function App() {
  const [pixels, setPixels] = useState(Array(GRID_SIZE * GRID_SIZE).fill('#ffffff'))
  const [color, setColor] = useState('#000000')
  const [isDrawing, setIsDrawing] = useState(false)

  const paint = (i) => {
    setPixels(prev => {
      const next = [...prev]
      next[i] = color
      return next
    })
  }

  const clear = () => setPixels(Array(GRID_SIZE * GRID_SIZE).fill('#ffffff'))

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
            className={`swatch ${color === c ? 'active' : ''}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
            aria-label={c}
          />
        ))}
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          className="color-picker"
        />
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        onMouseLeave={() => setIsDrawing(false)}
      >
        {pixels.map((c, i) => (
          <div
            key={i}
            className="cell"
            style={{ background: c }}
            onMouseDown={() => { setIsDrawing(true); paint(i) }}
            onMouseEnter={() => isDrawing && paint(i)}
            onTouchStart={(e) => { e.preventDefault(); paint(i) }}
          />
        ))}
      </div>

      <div className="controls">
        <button onClick={clear}>🗑️ ক্লিয়ার</button>
        <span className="current">
          বর্তমান রঙ: <span className="preview" style={{ background: color }} />
        </span>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)