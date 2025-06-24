"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="flex items-center justify-between p-3 sm:p-6 border-b border-slate-700">
      <div className="min-w-0">
        <h1 className="text-lg sm:text-2xl font-bold truncate">Security Operations Center</h1>
        <p className="text-slate-400 text-sm hidden sm:block">Real-time security monitoring and analysis</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <span className="text-slate-300 text-xs sm:text-sm">
          <span className="hidden sm:inline">{currentTime.toLocaleDateString("en-GB")} </span>
          {currentTime.toLocaleTimeString("en-GB", { hour12: false })}
        </span>
        <div className="relative">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
          <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
        </div>
      </div>
    </header>
  )
}
