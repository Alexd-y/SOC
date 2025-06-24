"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"

interface ThreatData {
  country: string
  coordinates: [number, number]
  attacks: number
  severity: "low" | "medium" | "high" | "critical"
  types: string[]
}

interface ThreatMapProps {
  threats: ThreatData[]
}

// Realistic world map coordinates (simplified continents)
const worldMapPaths = {
  northAmerica: [
    [0.12, 0.15],
    [0.35, 0.15],
    [0.35, 0.25],
    [0.32, 0.35],
    [0.28, 0.45],
    [0.25, 0.5],
    [0.15, 0.5],
    [0.12, 0.45],
    [0.12, 0.15],
  ],
  southAmerica: [
    [0.2, 0.5],
    [0.25, 0.5],
    [0.28, 0.55],
    [0.3, 0.65],
    [0.28, 0.8],
    [0.25, 0.85],
    [0.22, 0.85],
    [0.18, 0.8],
    [0.16, 0.65],
    [0.18, 0.55],
    [0.2, 0.5],
  ],
  europe: [
    [0.45, 0.15],
    [0.55, 0.15],
    [0.58, 0.2],
    [0.55, 0.25],
    [0.52, 0.3],
    [0.48, 0.28],
    [0.45, 0.25],
    [0.45, 0.15],
  ],
  africa: [
    [0.45, 0.3],
    [0.55, 0.3],
    [0.58, 0.35],
    [0.6, 0.5],
    [0.58, 0.65],
    [0.55, 0.7],
    [0.5, 0.72],
    [0.45, 0.7],
    [0.42, 0.6],
    [0.43, 0.45],
    [0.45, 0.3],
  ],
  asia: [
    [0.55, 0.1],
    [0.85, 0.1],
    [0.9, 0.15],
    [0.92, 0.25],
    [0.9, 0.35],
    [0.85, 0.45],
    [0.8, 0.5],
    [0.75, 0.52],
    [0.65, 0.5],
    [0.6, 0.45],
    [0.58, 0.35],
    [0.55, 0.25],
    [0.55, 0.1],
  ],
  australia: [
    [0.75, 0.65],
    [0.85, 0.65],
    [0.88, 0.7],
    [0.85, 0.75],
    [0.8, 0.77],
    [0.75, 0.75],
    [0.72, 0.7],
    [0.75, 0.65],
  ],
}

export function ThreatMap({ threats }: ThreatMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
  const [hoveredThreat, setHoveredThreat] = useState<ThreatData | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect()
      const height = Math.max(300, Math.min(500, width * 0.5))
      setDimensions({ width: Math.max(400, width - 20), height })
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

  const coordToCanvas = useCallback((coord: [number, number], width: number, height: number): [number, number] => {
    const [lng, lat] = coord
    const x = ((lng + 180) / 360) * width
    const y = ((90 - lat) / 180) * height
    return [x, y]
  }, [])

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      setMousePos({ x: event.clientX, y: event.clientY })

      // Check if mouse is over a threat indicator
      let foundThreat: ThreatData | null = null
      threats.forEach((threat) => {
        const [threatX, threatY] = coordToCanvas(threat.coordinates, dimensions.width, dimensions.height)
        const distance = Math.sqrt((x - threatX) ** 2 + (y - threatY) ** 2)
        const radius = Math.max(5, Math.min(20, threat.attacks / 5))

        if (distance <= radius) {
          foundThreat = threat
        }
      })

      setHoveredThreat(foundThreat)
    },
    [threats, dimensions, coordToCanvas],
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredThreat(null)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

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

    // Draw ocean background
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, height)
    oceanGradient.addColorStop(0, "#1e3a8a")
    oceanGradient.addColorStop(1, "#1e293b")
    ctx.fillStyle = oceanGradient
    ctx.fillRect(0, 0, width, height)

    // Draw grid (latitude/longitude lines)
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 0.5

    // Longitude lines
    for (let i = 0; i <= 12; i++) {
      const x = (i / 12) * width
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Latitude lines
    for (let i = 0; i <= 6; i++) {
      const y = (i / 6) * height
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw continents with realistic shapes
    const drawContinent = (path: number[][], color: string) => {
      ctx.fillStyle = color
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 1
      ctx.beginPath()

      path.forEach((point, index) => {
        const x = point[0] * width
        const y = point[1] * height
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }

    // Draw all continents
    drawContinent(worldMapPaths.northAmerica, "#475569")
    drawContinent(worldMapPaths.southAmerica, "#475569")
    drawContinent(worldMapPaths.europe, "#475569")
    drawContinent(worldMapPaths.africa, "#475569")
    drawContinent(worldMapPaths.asia, "#475569")
    drawContinent(worldMapPaths.australia, "#475569")

    // Draw threat indicators
    threats.forEach((threat) => {
      const [x, y] = coordToCanvas(threat.coordinates, width, height)

      // Get color based on severity
      let color = "#3b82f6" // blue for low
      if (threat.severity === "medium") color = "#f59e0b" // yellow
      if (threat.severity === "high") color = "#f97316" // orange
      if (threat.severity === "critical") color = "#ef4444" // red

      // Calculate radius based on attacks (responsive)
      const baseRadius = Math.max(3, Math.min(15, width / 80))
      const radius = baseRadius + threat.attacks / 20

      // Draw pulsing effect
      const time = Date.now() / 1000
      const pulseRadius = radius + Math.sin(time * 2 + threat.attacks) * 3

      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseRadius * 2)
      gradient.addColorStop(0, color + "60")
      gradient.addColorStop(1, color + "00")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, pulseRadius * 2, 0, 2 * Math.PI)
      ctx.fill()

      // Inner circle
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fill()

      // Attack count (responsive font)
      if (threat.attacks > 0 && radius > 8) {
        ctx.fillStyle = "#ffffff"
        const fontSize = Math.max(8, Math.min(12, radius / 2))
        ctx.font = `${fontSize}px sans-serif`
        ctx.textAlign = "center"
        ctx.fillText(threat.attacks.toString(), x, y + fontSize / 3)
      }

      // Country label (only on larger screens)
      if (width > 600) {
        ctx.fillStyle = "#e2e8f0"
        const labelFontSize = Math.max(9, Math.min(12, width / 70))
        ctx.font = `${labelFontSize}px sans-serif`
        ctx.textAlign = "center"
        ctx.fillText(threat.country, x, y - radius - 8)
      }
    })

    // Draw legend
    const legendX = width > 600 ? 20 : 10
    const legendY = height - (width > 600 ? 120 : 100)
    const legendWidth = width > 600 ? 200 : 150
    const legendHeight = width > 600 ? 100 : 80

    // Legend background
    ctx.fillStyle = "rgba(30, 41, 59, 0.9)"
    ctx.fillRect(legendX - 10, legendY - 10, legendWidth, legendHeight)
    ctx.strokeStyle = "#475569"
    ctx.strokeRect(legendX - 10, legendY - 10, legendWidth, legendHeight)

    const severities = [
      { level: "Critical", color: "#ef4444" },
      { level: "High", color: "#f97316" },
      { level: "Medium", color: "#f59e0b" },
      { level: "Low", color: "#3b82f6" },
    ]

    const legendFontSize = Math.max(10, Math.min(14, width / 60))
    ctx.fillStyle = "#e2e8f0"
    ctx.font = `${legendFontSize}px sans-serif`
    ctx.textAlign = "left"
    ctx.fillText("Threat Levels:", legendX, legendY)

    severities.forEach((severity, index) => {
      const y = legendY + 15 + index * 15
      const circleSize = Math.max(4, Math.min(6, width / 150))

      // Color circle
      ctx.fillStyle = severity.color
      ctx.beginPath()
      ctx.arc(legendX + 10, y, circleSize, 0, 2 * Math.PI)
      ctx.fill()

      // Label
      ctx.fillStyle = "#e2e8f0"
      const labelFontSize = Math.max(9, Math.min(12, width / 70))
      ctx.font = `${labelFontSize}px sans-serif`
      ctx.fillText(severity.level, legendX + 25, y + 4)
    })
  }, [threats, dimensions, coordToCanvas])

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px] relative bg-slate-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ touchAction: "pan-y" }}
      />

      {/* Live indicator */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-slate-800 p-2 sm:p-3 rounded-lg border border-slate-700">
        <div className="text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
          <div className="text-xs text-slate-400">{threats.reduce((sum, t) => sum + t.attacks, 0)} active threats</div>
        </div>
      </div>

      {/* Tooltip for hovered threat */}
      {hoveredThreat && (
        <div
          className="fixed z-50 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg pointer-events-none"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <div className="text-white font-medium">{hoveredThreat.country}</div>
          <div className="text-slate-300 text-sm">{hoveredThreat.attacks} attacks</div>
          <div className="text-slate-400 text-xs">
            Severity:{" "}
            <span
              className={`
              ${hoveredThreat.severity === "critical" ? "text-red-400" : ""}
              ${hoveredThreat.severity === "high" ? "text-orange-400" : ""}
              ${hoveredThreat.severity === "medium" ? "text-yellow-400" : ""}
              ${hoveredThreat.severity === "low" ? "text-blue-400" : ""}
            `}
            >
              {hoveredThreat.severity}
            </span>
          </div>
          <div className="text-slate-400 text-xs">Types: {hoveredThreat.types.join(", ")}</div>
        </div>
      )}
    </div>
  )
}
