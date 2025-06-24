"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Users, Server } from "lucide-react"
import { ActivityChart } from "@/components/activity-chart"
import { SeverityChart } from "@/components/severity-chart"
import { AttackTypesChart } from "@/components/attack-types-chart"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"

interface SecurityMetrics {
  threatScore: number
  activeAlerts: {
    total: number
    low: number
    medium: number
    high: number
    critical: number
  }
  monitoredSystems: {
    total: number
    online: number
    offline: number
    availability: number
  }
  activeUsers: {
    total: number
    growth: number
  }
}

interface SecurityAlert {
  id: string
  type: string
  description: string
  time: string
  severity: "low" | "medium" | "high" | "critical"
  location: string
  status: "new" | "investigating" | "resolved"
}

const alertTypes = [
  "Cross-Site Scripting",
  "SQL Injection",
  "Brute Force Attack",
  "Malware Detection",
  "Unauthorized Access",
  "DDoS Attack",
  "Phishing Attempt",
  "Data Breach",
  "Suspicious Login",
]

const locations = ["Nigeria", "Russia", "China", "USA", "Brazil", "India", "Germany", "France"]

function generateRandomMetrics(): SecurityMetrics {
  const total = Math.floor(Math.random() * 50) + 80
  const critical = Math.floor(Math.random() * 8) + 2
  const high = Math.floor(Math.random() * 15) + 10
  const medium = Math.floor(Math.random() * 20) + 15
  const low = total - critical - high - medium

  const systemsTotal = Math.floor(Math.random() * 100) + 1200
  const systemsOffline = Math.floor(Math.random() * 50) + 10
  const systemsOnline = systemsTotal - systemsOffline

  return {
    threatScore: Math.floor(Math.random() * 30) + 55,
    activeAlerts: {
      total,
      low: Math.max(0, low),
      medium,
      high,
      critical,
    },
    monitoredSystems: {
      total: systemsTotal,
      online: systemsOnline,
      offline: systemsOffline,
      availability: Math.round((systemsOnline / systemsTotal) * 100 * 100) / 100,
    },
    activeUsers: {
      total: Math.floor(Math.random() * 1000) + 4000,
      growth: Math.floor(Math.random() * 20) + 5,
    },
  }
}

function generateRandomAlert(): SecurityAlert {
  const severity = ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as SecurityAlert["severity"]
  const type = alertTypes[Math.floor(Math.random() * alertTypes.length)]
  const location = locations[Math.floor(Math.random() * locations.length)]

  const descriptions = {
    "Cross-Site Scripting": `XSS attack detected from India targeting web applications in ${location}`,
    "SQL Injection": `SQL injection attempt detected on database server in ${location}`,
    "Brute Force Attack": `Multiple failed login attempts detected from ${location}`,
    "Malware Detection": `Malicious software detected on endpoint in ${location}`,
    "Unauthorized Access": `Unauthorized access attempt from ${location}`,
    "DDoS Attack": `Distributed denial of service attack from ${location}`,
    "Phishing Attempt": `Phishing email campaign detected targeting users in ${location}`,
    "Data Breach": `Potential data breach detected in ${location} systems`,
    "Suspicious Login": `Suspicious login activity detected from ${location}`,
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    description: descriptions[type as keyof typeof descriptions] || `Security event detected in ${location}`,
    time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    severity,
    location,
    status: "new",
  }
}

export default function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>(generateRandomMetrics())
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: "1",
      type: "Cross-Site Scripting",
      description: "XSS attack detected from India targeting web applications in Nigeria",
      time: "07:55:28",
      severity: "high",
      location: "Nigeria",
      status: "new",
    },
  ])

  useEffect(() => {
    const metricsInterval = setInterval(() => {
      setMetrics(generateRandomMetrics())
    }, 5000)

    const alertsInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert = generateRandomAlert()
        setAlerts((prev) => [newAlert, ...prev.slice(0, 4)])
      }
    }, 8000)

    return () => {
      clearInterval(metricsInterval)
      clearInterval(alertsInterval)
    }
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getThreatLevel = (score: number) => {
    if (score >= 70) return { level: "High alert status", color: "text-red-400" }
    if (score >= 50) return { level: "Medium alert status", color: "text-yellow-400" }
    return { level: "Low alert status", color: "text-green-400" }
  }

  const threatLevel = getThreatLevel(metrics.threatScore)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <Navigation />

      <div className="p-3 sm:p-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Threat Score</CardTitle>
              <Shield className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-white">{metrics.threatScore}%</div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.threatScore}%` }}
                ></div>
              </div>
              <p className={`text-xs mt-2 ${threatLevel.color}`}>{threatLevel.level}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-white">{metrics.activeAlerts.total}</div>
              <div className="flex gap-1 sm:gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                  {metrics.activeAlerts.low} Low
                </Badge>
                <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                  {metrics.activeAlerts.medium} Med
                </Badge>
                <Badge variant="outline" className="text-xs text-orange-400 border-orange-400">
                  {metrics.activeAlerts.high} High
                </Badge>
                <Badge variant="outline" className="text-xs text-red-400 border-red-400">
                  {metrics.activeAlerts.critical} Crit
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Monitored Systems</CardTitle>
              <Server className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {metrics.monitoredSystems.total.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">{metrics.monitoredSystems.availability}% availability rate</p>
              <div className="flex gap-2 sm:gap-4 mt-2">
                <span className="text-green-400 text-sm">{metrics.monitoredSystems.online} Online</span>
                <span className="text-red-400 text-sm">{metrics.monitoredSystems.offline} Alert</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Active Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {metrics.activeUsers.total.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">+{metrics.activeUsers.growth}% from last week</p>
              <p className="text-blue-400 text-sm mt-1">{Math.floor(metrics.activeUsers.total * 0.85)} Active now</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Activity Timeline</CardTitle>
              <p className="text-sm text-slate-400">Security events over the last 24 hours</p>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="h-48 sm:h-64">
                <ActivityChart />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Severity Distribution</CardTitle>
              <p className="text-sm text-slate-400">Current alert levels by severity</p>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="h-48 sm:h-64">
                <SeverityChart metrics={metrics} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Latest Security Alerts</CardTitle>
              <p className="text-sm text-slate-400">Most recent security events</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getSeverityColor(alert.severity)}`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white text-sm sm:text-base truncate">{alert.type}</h4>
                        <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{alert.time}</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2 line-clamp-2">{alert.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-xs ${alert.severity === "high" ? "text-orange-400 border-orange-400" : "text-slate-400 border-slate-400"}`}
                        >
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-slate-400">{alert.location}</span>
                        <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Top Attack Types</CardTitle>
              <p className="text-sm text-slate-400">Most common security event types</p>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="h-48 sm:h-64">
                <AttackTypesChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
