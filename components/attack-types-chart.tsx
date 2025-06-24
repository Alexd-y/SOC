"use client"

import { useEffect, useRef, useState, useCallback } from "react"

const attackTypes = ["Port Scanning", "Unauthorized Access", "Malware", "DDoS"]

export function AttackTypesChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<number[]>([])
  const [dimensions, setDimensions] = useState({ width: 400, height: 250 })

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect()
      const height = Math.max(200, Math.min(300, width * 0.6))
      setDimensions({ width: Math.max(300, width - 40), height })
    }
  }, [])

  useEffect(() => {
    // Generate initial data
    const initialData = attackTypes.map(() => Math.floor(Math.random() * 80) + 20)
    setData(initialData)

    updateDimensions()

    // Update data every 6 seconds
    const dataInterval = setInterval(() => {
      setData(attackTypes.map(() => Math.floor(Math.random() * 80) + 20))
    }, 6000)

    const handleResize = () => updateDimensions()
    window.addEventListener("resize", handleResize)

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

    const padding = width > 400 ? 60 : 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const maxValue = Math.max(...data)
    const barWidth = chartWidth / data.length
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]

    // Draw bars
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight
      const x = padding + index * barWidth + barWidth * 0.1
      const y = height - padding - barHeight
      const barWidthActual = barWidth * 0.8

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
      gradient.addColorStop(0, colors[index])
      gradient.addColorStop(1, colors[index] + "80")

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidthActual, barHeight)

      // Draw value on top of bar
      const fontSize = Math.max(10, Math.min(14, width / 35))
      ctx.fillStyle = "#FFFFFF"
      ctx.font = `${fontSize}px sans-serif`
      ctx.textAlign = "center"
      ctx.fillText(value.toString(), x + barWidthActual / 2, y - 5)

      // Draw label
      ctx.fillStyle = "#9CA3AF"
      const labelFontSize = Math.max(8, Math.min(11, width / 40))
      ctx.font = `${labelFontSize}px sans-serif`
      ctx.save()
      ctx.translate(x + barWidthActual / 2, height - padding + 15)

      // Rotate labels on mobile for better readability
      if (width < 500) {
        ctx.rotate(-Math.PI / 4)
        ctx.textAlign = "right"
      } else {
        ctx.textAlign = "center"
      }

      ctx.fillText(attackTypes[index], 0, 0)
      ctx.restore()
    })

    // Draw grid lines
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 1

    for (let i = 0; i <= 4; i++) {
      const y = height - padding - (i / 4) * chartHeight
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      // Y-axis labels
      ctx.fillStyle = "#9CA3AF"
      const axisFontSize = Math.max(8, Math.min(11, width / 45))
      ctx.font = `${axisFontSize}px sans-serif`
      ctx.textAlign = "right"
      ctx.fillText(Math.round((i / 4) * maxValue).toString(), padding - 5, y + 3)
    }
  }, [data, dimensions])

  return (
    <div ref={containerRef} className="w-full h-full min-h-[200px] relative">
      <canvas ref={canvasRef} className="w-full h-full max-w-full" style={{ touchAction: "pan-y" }} />
    </div>
  )
}
