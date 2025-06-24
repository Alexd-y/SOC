"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, Shield, AlertTriangle } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Overview", icon: Activity },
    { href: "/alerts", label: "Security Alerts", icon: Shield },
    { href: "/threat-map", label: "Threat Map", icon: AlertTriangle },
  ]

  return (
    <nav className="flex gap-1 p-3 sm:p-6 pb-0 overflow-x-auto">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
            pathname === href ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">{label.split(" ")[0]}</span>
        </Link>
      ))}
    </nav>
  )
}
