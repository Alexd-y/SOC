"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface SeverityChartProps {
  metrics: {
    activeAlerts: {
      low: number
      medium: number
      high: number
      critical: number
    }
  }
}

export function SeverityChart({ metrics }: SeverityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 400, height: 250 })

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect()
      const size = Math.max(250, Math.min(400, width - 40))
      setDimensions({ width: size, height: size })
    }
  }, [])

  useEffect(() => {
    updateDimensions()

    const handleResize = () => updateDimensions()
    window.addEventListener("resize", handleResize)

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(updateDimensions)
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [updateDimensions])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { low, medium, high, critical } = metrics.activeAlerts
    const total = low + medium + high + critical

    if (total === 0) return

    const { width, height } = dimensions
    const dpr = window.devicePixelRatio || 1

    // Set canvas size for high DPI displays
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 40

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const colors = {
      low: "#3B82F6",
      medium: "#F59E0B",
      high: "#F97316",
      critical: "#EF4444",
    }

    const data = [
      { label: "low", value: low, color: colors.low },
      { label: "medium", value: medium, color: colors.medium },
      { label: "high", value: high, color: colors.high },
      { label: "critical", value: critical, color: colors.critical },
    ]

    let currentAngle = -Math.PI / 2

    // Draw pie slices
    data.forEach(({ value, color }) => {
      if (value === 0) return

      const sliceAngle = (value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()

      currentAngle += sliceAngle
    })

    // Draw labels with percentages
    currentAngle = -Math.PI / 2
    const fontSize = Math.max(10, Math.min(14, width / 30))
    ctx.fillStyle = "#FFFFFF"
    ctx.font = `${fontSize}px sans-serif`
    ctx.textAlign = "center"

    data.forEach(({ label, value, color }) => {
      if (value === 0) return

      const sliceAngle = (value / total) * 2 * Math.PI
      const labelAngle = currentAngle + sliceAngle / 2
      const percentage = Math.round((value / total) * 100)

      if (percentage >= 5) {
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7)
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7)

        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(`${percentage}%`, labelX, labelY)
      }

      currentAngle += sliceAngle
    })

    // Draw legend (responsive positioning)
    const legendX = width > 350 ? width - 120 : 20
    const legendY = width > 350 ? 30 : height - 120
    const legendFontSize = Math.max(9, Math.min(12, width / 35))

    data.forEach(({ label, value, color }, index) => {
      const y = legendY + index * 20
      const percentage = Math.round((value / total) * 100)

      // Color box
      ctx.fillStyle = color
      ctx.fillRect(legendX, y - 6, 10, 10)

      // Label
      ctx.fillStyle = "#FFFFFF"
      ctx.font = `${legendFontSize}px sans-serif`
      ctx.textAlign = "left"
      ctx.fillText(`${label}: ${percentage}%`, legendX + 15, y + 2)
    })
  }, [metrics, dimensions])

  return (
    <div ref={containerRef} className="w-full h-full min-h-[250px] relative flex items-center justify-center">
      <canvas ref={canvasRef} className="max-w-full max-h-full" style={{ touchAction: "pan-y" }} />
    </div>
  )
}
