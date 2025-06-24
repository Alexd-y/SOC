"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Search, Eye, CheckCircle, Clock, AlertTriangle, X } from "lucide-react"

interface SecurityAlert {
  id: string
  type: string
  description: string
  timestamp: Date
  severity: "low" | "medium" | "high" | "critical"
  location: string
  status: "new" | "investigating" | "resolved"
  source: string
  target: string
  details: string
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
  "Port Scanning",
]

const locations = ["Nigeria", "Russia", "China", "USA", "Brazil", "India", "Germany", "France", "UK", "Japan"]
const sources = ["192.168.1.100", "10.0.0.50", "172.16.0.25", "203.0.113.45", "198.51.100.30"]
const targets = ["web-server-01", "db-server-02", "mail-server-03", "file-server-04", "app-server-05"]

function generateRandomAlert(): SecurityAlert {
  const severity = ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as SecurityAlert["severity"]
  const type = alertTypes[Math.floor(Math.random() * alertTypes.length)]
  const location = locations[Math.floor(Math.random() * locations.length)]
  const source = sources[Math.floor(Math.random() * sources.length)]
  const target = targets[Math.floor(Math.random() * targets.length)]

  const descriptions = {
    "Cross-Site Scripting": `XSS attack detected targeting ${target} from ${location}`,
    "SQL Injection": `SQL injection attempt on ${target} database`,
    "Brute Force Attack": `Multiple failed login attempts on ${target}`,
    "Malware Detection": `Malicious software detected on ${target}`,
    "Unauthorized Access": `Unauthorized access attempt to ${target}`,
    "DDoS Attack": `Distributed denial of service attack on ${target}`,
    "Phishing Attempt": `Phishing email targeting users in ${location}`,
    "Data Breach": `Potential data breach on ${target}`,
    "Suspicious Login": `Suspicious login activity on ${target}`,
    "Port Scanning": `Port scanning activity detected from ${source}`,
  }

  const details = {
    "Cross-Site Scripting": `Malicious script injection detected in web form. Attack vector: ${source}. Payload: <script>alert('XSS')</script>`,
    "SQL Injection": `SQL injection payload detected: ' OR 1=1 --. Database queries blocked automatically.`,
    "Brute Force Attack": `${Math.floor(Math.random() * 500) + 100} failed login attempts in 5 minutes. Account temporarily locked.`,
    "Malware Detection": `Trojan.Win32.Generic detected. File quarantined. Hash: ${Math.random().toString(36).substr(2, 32)}`,
    "Unauthorized Access": `Access attempt using expired credentials. User: admin. Source IP: ${source}`,
    "DDoS Attack": `${Math.floor(Math.random() * 10000) + 5000} requests per second detected. Traffic filtering activated.`,
    "Phishing Attempt": `Suspicious email with malicious link detected. Sender: security@fake-bank.com`,
    "Data Breach": `Unusual data access pattern detected. ${Math.floor(Math.random() * 1000) + 100} records accessed.`,
    "Suspicious Login": `Login from unusual location: ${location}. Device fingerprint mismatch detected.`,
    "Port Scanning": `Sequential port scan detected. Ports 22, 80, 443, 3389 probed from ${source}`,
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    description: descriptions[type as keyof typeof descriptions] || `Security event detected`,
    timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
    severity,
    location,
    status: ["new", "investigating", "resolved"][Math.floor(Math.random() * 3)] as SecurityAlert["status"],
    source,
    target,
    details: details[type as keyof typeof details] || "Additional details not available",
  }
}

export default function SecurityAlertsPage() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<SecurityAlert[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const alertsPerPage = 10

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Generate initial alerts
    const initialAlerts = Array.from({ length: 50 }, generateRandomAlert).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    )
    setAlerts(initialAlerts)
    setFilteredAlerts(initialAlerts)

    // Add new alerts periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newAlert = generateRandomAlert()
        setAlerts((prev) => [newAlert, ...prev].slice(0, 100)) // Keep only last 100 alerts
      }
    }, 10000)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    let filtered = alerts

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter((alert) => alert.severity === severityFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((alert) => alert.status === statusFilter)
    }

    setFilteredAlerts(filtered)
    setCurrentPage(1)
  }, [alerts, searchTerm, severityFilter, statusFilter])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "text-red-400 border-red-400"
      case "investigating":
        return "text-yellow-400 border-yellow-400"
      case "resolved":
        return "text-green-400 border-green-400"
      default:
        return "text-slate-400 border-slate-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
      case "investigating":
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
      case "resolved":
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      default:
        return null
    }
  }

  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage)
  const startIndex = (currentPage - 1) * alertsPerPage
  const currentAlerts = filteredAlerts.slice(startIndex, startIndex + alertsPerPage)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <Navigation />

      <div className="p-3 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Security Alerts
                </CardTitle>
                <div className="flex flex-col gap-3 sm:gap-4 mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 sm:p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                            <h3 className="font-medium text-white text-sm sm:text-base truncate">{alert.type}</h3>
                            <Badge variant="outline" className={`text-xs ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getStatusColor(alert.status)} flex items-center gap-1`}
                            >
                              {getStatusIcon(alert.status)}
                              {alert.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300 mb-2 line-clamp-2">{alert.description}</p>
                          <div className="flex items-center gap-2 sm:gap-4 text-xs text-slate-400 flex-wrap">
                            <span>{alert.timestamp.toLocaleString()}</span>
                            <span>Location: {alert.location}</span>
                            <span className="hidden sm:inline">Source: {alert.source}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white flex-shrink-0">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                    <p className="text-sm text-slate-400 text-center sm:text-left">
                      Showing {startIndex + 1} to {Math.min(startIndex + alertsPerPage, filteredAlerts.length)} of{" "}
                      {filteredAlerts.length} alerts
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Alert Details Sidebar - Mobile Modal */}
          {selectedAlert && (
            <>
              {isMobile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
                  <Card className="bg-slate-800 border-slate-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <CardHeader>
                      <CardTitle className="text-slate-300 flex items-center justify-between">
                        Alert Details
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAlert(null)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-white mb-2">{selectedAlert.type}</h4>
                        <p className="text-sm text-slate-300">{selectedAlert.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-400">Severity</label>
                          <Badge variant="outline" className={`mt-1 ${getSeverityColor(selectedAlert.severity)}`}>
                            {selectedAlert.severity}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Status</label>
                          <Badge
                            variant="outline"
                            className={`mt-1 ${getStatusColor(selectedAlert.status)} flex items-center gap-1`}
                          >
                            {getStatusIcon(selectedAlert.status)}
                            {selectedAlert.status}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Timestamp</label>
                        <p className="text-sm text-white">{selectedAlert.timestamp.toLocaleString()}</p>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Location</label>
                        <p className="text-sm text-white">{selectedAlert.location}</p>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Source IP</label>
                        <p className="text-sm text-white font-mono">{selectedAlert.source}</p>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Target</label>
                        <p className="text-sm text-white font-mono">{selectedAlert.target}</p>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Details</label>
                        <p className="text-sm text-slate-300 mt-1">{selectedAlert.details}</p>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button size="sm" className="flex-1">
                          Investigate
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Resolve
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Desktop Sidebar */}
              {!isMobile && (
                <div className="w-full lg:w-96">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-slate-300 flex items-center justify-between">
                        Alert Details
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAlert(null)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-white mb-2">{selectedAlert.type}</h4>
                        <p className="text-sm text-slate-300">{selectedAlert.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-400">Severity</label>
                          <Badge variant="outline" className={`mt-1 ${getSeverityColor(selectedAlert.severity)}`}>
                            {selectedAlert.severity}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Status</label>
                          <Badge
                            variant="outline"
                            className={`mt-1 ${getStatusColor(selectedAlert.status)} flex items-center gap-1`}
                          >
                            {getStatusIcon(selectedAlert.status)}
                            {selectedAlert.status}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Timestamp</label>
                        <p className="text-sm text-white">{selectedAlert.timestamp.toLocaleString()}</p>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Location</label>
                        <p className="text-sm text-white">{selectedAlert.location}</p>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Source IP</label>
                        <p className="text-sm text-white font-mono">{selectedAlert.source}</p>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Target</label>
                        <p className="text-sm text-white font-mono">{selectedAlert.target}</p>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Details</label>
                        <p className="text-sm text-slate-300 mt-1">{selectedAlert.details}</p>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button size="sm" className="flex-1">
                          Investigate
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Resolve
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
