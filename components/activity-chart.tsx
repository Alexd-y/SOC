"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export function ActivityChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<number[]>([])
  const [dimensions, setDimensions] = useState({ width: 600, height: 200 })

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect()
      const height = Math.max(200, Math.min(300, width * 0.4))
      setDimensions({ width: Math.max(300, width - 40), height })
    }
  }, [])

  useEffect(() => {
    // Generate initial data
    const initialData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 8) + 1)
    setData(initialData)

    // Update dimensions on mount
    updateDimensions()

    // Update data every 3 seconds
    const dataInterval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev]
        newData.shift()
        newData.push(Math.floor(Math.random() * 8) + 1)
        return newData
      })
    }, 3000)

    // Handle resize
    const handleResize = () => updateDimensions()
    window.addEventListener("resize", handleResize)

    // ResizeObserver for better support
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(updateDimensions)
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      clearInterval(dataInterval)
      window.removeEventListener("resize", handleResize)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [updateDimensions])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { width, height } = dimensions
    const dpr = window.devicePixelRatio || 1

    // Set canvas size for high DPI displays
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw area chart
    const pointWidth = width / (data.length - 1)

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)")
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.1)")

    // Draw filled area
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(0, height)

    data.forEach((value, index) => {
      const x = index * pointWidth
      const y = height - (value / 8) * height
      if (index === 0) {
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.lineTo(width, height)
    ctx.closePath()
    ctx.fill()

    // Draw line
    ctx.strokeStyle = "#3B82F6"
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((value, index) => {
      const x = index * pointWidth
      const y = height - (value / 8) * height
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw time labels (responsive font size)
    const fontSize = Math.max(8, Math.min(12, width / 60))
    ctx.fillStyle = "#9CA3AF"
    ctx.font = `${fontSize}px sans-serif`
    ctx.textAlign = "center"

    const timeLabels =
      width > 400 ? ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"] : ["00", "08", "16", "24"]

    timeLabels.forEach((label, index) => {
      const x = (index / (timeLabels.length - 1)) * width
      ctx.fillText(label, x, height - 5)
    })

    // Draw y-axis labels
    ctx.textAlign = "left"
    for (let i = 0; i <= 4; i++) {
      const y = height - (i / 4) * height
      ctx.fillText((i * 2).toString(), 5, y - 5)
    }
  }, [data, dimensions])

  return (
    <div ref={containerRef} className="w-full h-full min-h-[200px] relative">
      <canvas ref={canvasRef} className="w-full h-full max-w-full" style={{ touchAction: "pan-y" }} />
    </div>
  )
}
