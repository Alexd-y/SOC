"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { ThreatMap } from "@/components/threat-map"
import { Globe, Shield, AlertTriangle, Activity } from "lucide-react"

interface ThreatData {
  country: string
  coordinates: [number, number]
  attacks: number
  severity: "low" | "medium" | "high" | "critical"
  types: string[]
}

interface GlobalStats {
  totalAttacks: number
  activeThreats: number
  countriesAffected: number
  criticalAlerts: number
}

const threatLocations: ThreatData[] = [
  { country: "Russia", coordinates: [37.6176, 55.7558], attacks: 0, severity: "high", types: ["DDoS", "Malware"] },
  {
    country: "China",
    coordinates: [116.4074, 39.9042],
    attacks: 0,
    severity: "critical",
    types: ["APT", "Data Breach"],
  },
  {
    country: "USA",
    coordinates: [-74.006, 40.7128],
    attacks: 0,
    severity: "medium",
    types: ["Phishing", "Ransomware"],
  },
  { country: "Brazil", coordinates: [-43.1729, -22.9068], attacks: 0, severity: "low", types: ["Botnet", "Spam"] },
  { country: "India", coordinates: [77.209, 28.6139], attacks: 0, severity: "medium", types: ["SQL Injection", "XSS"] },
  { country: "Germany", coordinates: [13.405, 52.52], attacks: 0, severity: "low", types: ["Brute Force", "Scanning"] },
  { country: "France", coordinates: [2.3522, 48.8566], attacks: 0, severity: "medium", types: ["Phishing", "Malware"] },
  { country: "UK", coordinates: [-0.1276, 51.5074], attacks: 0, severity: "high", types: ["APT", "Data Breach"] },
  { country: "Japan", coordinates: [139.6917, 35.6895], attacks: 0, severity: "low", types: ["DDoS", "Botnet"] },
  { country: "Nigeria", coordinates: [3.3792, 6.5244], attacks: 0, severity: "critical", types: ["Fraud", "Phishing"] },
]

export default function ThreatMapPage() {
  const [threats, setThreats] = useState<ThreatData[]>(threatLocations)
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalAttacks: 0,
    activeThreats: 0,
    countriesAffected: 0,
    criticalAlerts: 0,
  })

  useEffect(() => {
    // Update threat data every 3 seconds
    const interval = setInterval(() => {
      setThreats((prev) =>
        prev.map((threat) => ({
          ...threat,
          attacks: Math.floor(Math.random() * 100) + 10,
          severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as ThreatData["severity"],
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Calculate global stats
    const totalAttacks = threats.reduce((sum, threat) => sum + threat.attacks, 0)
    const activeThreats = threats.filter((threat) => threat.attacks > 50).length
    const countriesAffected = threats.filter((threat) => threat.attacks > 0).length
    const criticalAlerts = threats.filter((threat) => threat.severity === "critical").length

    setGlobalStats({
      totalAttacks,
      activeThreats,
      countriesAffected,
      criticalAlerts,
    })
  }, [threats])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 border-red-400"
      case "high":
        return "text-orange-400 border-orange-400"
      case "medium":
        return "text-yellow-400 border-yellow-400"
      case "low":
        return "text-blue-400 border-blue-400"
      default:
        return "text-slate-400 border-slate-400"
    }
  }

  const topThreats = [...threats].sort((a, b) => b.attacks - a.attacks).slice(0, 5)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <Navigation />

      <div className="p-3 sm:p-6">
        {/* Global Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Attacks</CardTitle>
              <Activity className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {globalStats.totalAttacks.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Active Threats</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-white">{globalStats.activeThreats}</div>
              <p className="text-xs text-slate-400 mt-1">High activity regions</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Countries Affected</CardTitle>
              <Globe className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-white">{globalStats.countriesAffected}</div>
              <p className="text-xs text-slate-400 mt-1">Out of {threats.length} monitored</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Critical Alerts</CardTitle>
              <Shield className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-white">{globalStats.criticalAlerts}</div>
              <p className="text-xs text-slate-400 mt-1">Require immediate attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-6">
          {/* Threat Map */}
          <div className="xl:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                  Global Threat Map
                </CardTitle>
                <p className="text-sm text-slate-400">Real-time cyber threat visualization</p>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="h-64 sm:h-80 lg:h-96">
                  <ThreatMap threats={threats} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Threat Rankings */}
          <div className="space-y-3 sm:space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300">Top Threat Sources</CardTitle>
                <p className="text-sm text-slate-400">Countries with highest attack volume</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {topThreats.map((threat, index) => (
                    <div key={threat.country} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono text-sm">#{index + 1}</span>
                        <div className="min-w-0">
                          <h4 className="font-medium text-white text-sm sm:text-base">{threat.country}</h4>
                          <div className="flex gap-1 sm:gap-2 mt-1 flex-wrap">
                            {threat.types.slice(0, 2).map((type) => (
                              <Badge key={type} variant="outline" className="text-xs text-slate-400 border-slate-600">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-white">{threat.attacks}</div>
                        <Badge variant="outline" className={`text-xs ${getSeverityColor(threat.severity)}`}>
                          {threat.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300">Attack Types</CardTitle>
                <p className="text-sm text-slate-400">Most common threat vectors</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["DDoS", "Malware", "Phishing", "APT", "Ransomware", "Botnet"].map((type, index) => {
                    const count = Math.floor(Math.random() * 50) + 10
                    const percentage = Math.floor(Math.random() * 30) + 10
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">{type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 sm:w-20 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-slate-400 text-sm w-6 sm:w-8 text-right">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
