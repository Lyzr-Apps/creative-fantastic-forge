'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Phone, Clock, TrendingUp, AlertCircle, Upload, Search, Send, CheckCircle, X, PhoneOff, Zap } from 'lucide-react'

// Types
interface ActiveCall {
  id: string
  customerId: string
  customerName: string
  deviceModel: string
  issueCategory: string
  duration: number
  status: 'greeting' | 'troubleshooting' | 'escalating' | 'resolved'
  sentiment: 'positive' | 'neutral' | 'frustrated'
  timestamp: string
}

interface CallTranscript {
  callId: string
  timestamp: string
  speaker: 'ai' | 'customer'
  message: string
}

interface EscalationCall {
  id: string
  customerName: string
  deviceModel: string
  issueCategory: string
  waitTime: number
  priority: 'high' | 'medium' | 'low'
  timestamp: string
}

interface KBDocument {
  id: string
  title: string
  uploadDate: string
  documentType: string
  status: 'active' | 'processing'
}

interface AnalyticsData {
  totalCalls: number
  resolutionRate: number
  avgEscalationTime: number
  customerSatisfaction: number
  escalationRate: number
}

// Mock data generator
const generateMockActiveCalls = (): ActiveCall[] => [
  {
    id: 'call-001',
    customerId: 'cust-001',
    customerName: 'Sarah Johnson',
    deviceModel: 'VX520',
    issueCategory: 'WiFi Connectivity',
    duration: 245,
    status: 'troubleshooting',
    sentiment: 'neutral',
    timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
  },
  {
    id: 'call-002',
    customerId: 'cust-002',
    customerName: 'Michael Chen',
    deviceModel: 'VX690',
    issueCategory: 'Payment Processing',
    duration: 180,
    status: 'greeting',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
  },
  {
    id: 'call-003',
    customerId: 'cust-003',
    customerName: 'Emma Rodriguez',
    deviceModel: 'VX805',
    issueCategory: 'Software Update',
    duration: 420,
    status: 'troubleshooting',
    sentiment: 'frustrated',
    timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
  },
]

const generateMockEscalationCalls = (): EscalationCall[] => [
  {
    id: 'esc-001',
    customerName: 'Emma Rodriguez',
    deviceModel: 'VX805',
    issueCategory: 'Software Update Issue',
    waitTime: 3,
    priority: 'high',
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
  },
  {
    id: 'esc-002',
    customerName: 'James Wilson',
    deviceModel: 'VX520',
    issueCategory: 'Hardware Malfunction',
    waitTime: 8,
    priority: 'high',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 'esc-003',
    customerName: 'Lisa Anderson',
    deviceModel: 'VX690',
    issueCategory: 'Billing Question',
    waitTime: 12,
    priority: 'medium',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
  },
]

const generateMockTranscript = (callId: string): CallTranscript[] => [
  {
    callId,
    timestamp: new Date(Date.now() - 240000).toISOString(),
    speaker: 'ai',
    message: 'Welcome to Verifone Support. I\'m your AI assistant. How can I help you today?',
  },
  {
    callId,
    timestamp: new Date(Date.now() - 235000).toISOString(),
    speaker: 'customer',
    message: 'Hi, my VX520 terminal isn\'t connecting to WiFi properly.',
  },
  {
    callId,
    timestamp: new Date(Date.now() - 230000).toISOString(),
    speaker: 'ai',
    message: 'I understand you\'re experiencing WiFi connectivity issues with your VX520. Let me help you with that. First, let\'s restart the device. Can you hold the power button for 10 seconds?',
  },
  {
    callId,
    timestamp: new Date(Date.now() - 220000).toISOString(),
    speaker: 'customer',
    message: 'OK, I\'ve held the power button.',
  },
  {
    callId,
    timestamp: new Date(Date.now() - 210000).toISOString(),
    speaker: 'ai',
    message: 'Great! Now the device should be booting up. While it restarts, let\'s check your router. Can you confirm your WiFi is working on other devices?',
  },
  {
    callId,
    timestamp: new Date(Date.now() - 200000).toISOString(),
    speaker: 'customer',
    message: 'Yes, my phone and laptop are both connected fine.',
  },
]

const generateMockAnalytics = (): AnalyticsData => ({
  totalCalls: 1247,
  resolutionRate: 78,
  avgEscalationTime: 4.2,
  customerSatisfaction: 4.3,
  escalationRate: 22,
})

const generateMockKBDocuments = (): KBDocument[] => [
  {
    id: 'kb-001',
    title: 'VX520 WiFi Setup Guide',
    uploadDate: '2025-01-15',
    documentType: 'PDF',
    status: 'active',
  },
  {
    id: 'kb-002',
    title: 'Payment Processing Troubleshooting',
    uploadDate: '2025-01-10',
    documentType: 'DOCX',
    status: 'active',
  },
  {
    id: 'kb-003',
    title: 'VX805 Software Update Instructions',
    uploadDate: '2025-01-08',
    documentType: 'PDF',
    status: 'processing',
  },
  {
    id: 'kb-004',
    title: 'Common Issues and Solutions',
    uploadDate: '2025-01-05',
    documentType: 'TXT',
    status: 'active',
  },
]

// MetricsBar Component
function MetricsBar({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      <Card className="border border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Calls</p>
              <p className="text-2xl font-bold text-blue-600">3</p>
            </div>
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-green-600">{analytics.resolutionRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Handle Time</p>
              <p className="text-2xl font-bold text-purple-600">{analytics.avgEscalationTime}m</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Escalation Rate</p>
              <p className="text-2xl font-bold text-orange-600">{analytics.escalationRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Calls</p>
              <p className="text-2xl font-bold text-gray-700">{analytics.totalCalls.toLocaleString()}</p>
            </div>
            <Zap className="w-8 h-8 text-gray-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ActiveCallCard Component
function ActiveCallCard({ call, onViewTranscript }: { call: ActiveCall; onViewTranscript: (id: string) => void }) {
  const [displayDuration, setDisplayDuration] = useState(0)

  useEffect(() => {
    setDisplayDuration(call.duration)
    const timer = setInterval(() => {
      setDisplayDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [call.duration])

  const minutes = Math.floor(displayDuration / 60)
  const seconds = displayDuration % 60

  const statusColors = {
    greeting: 'bg-blue-50 border-blue-200',
    troubleshooting: 'bg-yellow-50 border-yellow-200',
    escalating: 'bg-red-50 border-red-200',
    resolved: 'bg-green-50 border-green-200',
  }

  const sentimentColors = {
    positive: 'bg-green-100 text-green-800',
    neutral: 'bg-gray-100 text-gray-800',
    frustrated: 'bg-red-100 text-red-800',
  }

  return (
    <Card className={`border-2 ${statusColors[call.status]}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{call.customerName}</CardTitle>
            <CardDescription>{call.deviceModel}</CardDescription>
          </div>
          <Badge className={sentimentColors[call.sentiment]}>
            {call.sentiment.charAt(0).toUpperCase() + call.sentiment.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Issue: {call.issueCategory}</p>
          <p className="text-sm text-gray-600">Duration: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</p>
          <p className="text-sm text-gray-600">Status: {call.status.charAt(0).toUpperCase() + call.status.slice(1)}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onViewTranscript(call.id)}>
            View Transcript
          </Button>
          {call.status === 'troubleshooting' && (
            <Button size="sm" variant="outline" className="flex-1">
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// EscalationQueueCard Component
function EscalationQueueCard({ call, onTakeCall }: { call: EscalationCall; onTakeCall: (id: string) => void }) {
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
  }

  return (
    <Card className="border border-gray-200">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-900">{call.customerName}</p>
              <p className="text-sm text-gray-600">{call.deviceModel}</p>
            </div>
            <Badge className={priorityColors[call.priority]}>
              {call.priority.charAt(0).toUpperCase() + call.priority.slice(1)} Priority
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{call.issueCategory}</p>
          <p className="text-sm font-semibold text-orange-600">Wait: {call.waitTime} min</p>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onTakeCall(call.id)}>
            Take Call
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// TranscriptDialog Component
function TranscriptDialog({ callId, isOpen, onClose }: { callId: string; isOpen: boolean; onClose: () => void }) {
  const transcript = generateMockTranscript(callId)
  const call = generateMockActiveCalls().find((c) => c.id === callId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Call Transcript</DialogTitle>
          <DialogDescription>{call?.customerName} - {call?.deviceModel}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-600">Device Model</p>
            <p className="font-semibold">{call?.deviceModel}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-600">Issue</p>
            <p className="font-semibold text-sm">{call?.issueCategory}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-600">Status</p>
            <Badge className="mt-1">{call?.status}</Badge>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3 bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
          {transcript.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${item.speaker === 'ai' ? 'bg-blue-200 text-blue-900' : 'bg-green-200 text-green-900'}`}>
                  {item.speaker === 'ai' ? 'AI Agent' : 'Customer'}
                </span>
                <span className="text-xs text-gray-600">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-800 ml-2">{item.message}</p>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">KB Articles Referenced</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>- WiFi Connectivity Troubleshooting Guide</li>
              <li>- VX520 Network Configuration</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Troubleshooting Steps</h4>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Restart device</li>
              <li>Check router connectivity</li>
              <li>Verify network settings</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Dashboard Screen
function DashboardScreen() {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>(generateMockActiveCalls())
  const [escalationCalls, setEscalationCalls] = useState<EscalationCall[]>(generateMockEscalationCalls())
  const [analytics] = useState<AnalyticsData>(generateMockAnalytics())
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null)
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)

  const handleViewTranscript = (callId: string) => {
    setSelectedCallId(callId)
    setIsTranscriptOpen(true)
  }

  const handleTakeCall = (callId: string) => {
    const call = escalationCalls.find((c) => c.id === callId)
    if (call) {
      alert(`Taking call from ${call.customerName}. Context loaded with issue: ${call.issueCategory}`)
      setEscalationCalls(escalationCalls.filter((c) => c.id !== callId))
    }
  }

  return (
    <div className="space-y-6">
      <MetricsBar analytics={analytics} />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Active Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {activeCalls.map((call) => (
                  <ActiveCallCard key={call.id} call={call} onViewTranscript={handleViewTranscript} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="w-5 h-5" />
                Escalation Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {escalationCalls.map((call) => (
                  <EscalationQueueCard key={call.id} call={call} onTakeCall={handleTakeCall} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedCallId && (
        <TranscriptDialog callId={selectedCallId} isOpen={isTranscriptOpen} onClose={() => setIsTranscriptOpen(false)} />
      )}
    </div>
  )
}

// Call Detail Screen
function CallDetailScreen() {
  const [selectedCall, setSelectedCall] = useState<ActiveCall>(generateMockActiveCalls()[0])
  const [transcript] = useState<CallTranscript[]>(generateMockTranscript(selectedCall.id))
  const [internalNote, setInternalNote] = useState('')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                {transcript.map((item, idx) => (
                  <div key={idx} className={`flex ${item.speaker === 'customer' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        item.speaker === 'ai'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-green-100 text-green-900'
                      }`}
                    >
                      <p className="text-sm">{item.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Internal Note</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  placeholder="Add internal notes for this call..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="min-h-24"
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Note</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issue Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-600">Device</p>
                <p className="font-semibold">{selectedCall.deviceModel}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-gray-600">Issue Category</p>
                <p className="font-semibold">{selectedCall.issueCategory}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <Badge className="mt-2">{selectedCall.status}</Badge>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-gray-600 mb-2">KB Articles</p>
                <div className="space-y-1">
                  <p className="text-sm text-blue-600 hover:underline cursor-pointer">WiFi Configuration Guide</p>
                  <p className="text-sm text-blue-600 hover:underline cursor-pointer">VX520 Manual</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <PhoneOff className="w-4 h-4 mr-2" />
                  Escalate to Human
                </Button>
                <Button variant="outline" className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Resolved
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Name</p>
                <p className="font-semibold">{selectedCall.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Customer ID</p>
                <p className="font-semibold text-sm">{selectedCall.customerId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Account Status</p>
                <Badge className="bg-green-100 text-green-800 mt-2">Active</Badge>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-2">Previous Issues</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>- WiFi connectivity (2 months ago)</li>
                  <li>- Payment processing (6 months ago)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Knowledge Base Screen
function KnowledgeBaseScreen() {
  const [documents, setDocuments] = useState<KBDocument[]>(generateMockKBDocuments())
  const [searchQuery, setSearchQuery] = useState('')

  const handleUpload = () => {
    alert('File upload functionality would be integrated here.')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>Add FAQs, troubleshooting guides, and product documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition cursor-pointer bg-gray-50">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-700 font-semibold mb-1">Drop files here or click to upload</p>
            <p className="text-sm text-gray-500">Supported formats: PDF, DOCX, TXT</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleUpload}>
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test KB Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Test search query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4" />
            </Button>
          </div>
          {searchQuery && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-900">
                Found 3 relevant articles for "{searchQuery}" - KB search integration working
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Documents</CardTitle>
          <CardDescription>Manage knowledge base documents and troubleshooting guides</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-semibold">Title</TableCell>
                <TableCell className="font-semibold">Type</TableCell>
                <TableCell className="font-semibold">Upload Date</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="border-b">
                  <TableCell className="text-gray-900">{doc.title}</TableCell>
                  <TableCell className="text-gray-600">{doc.documentType}</TableCell>
                  <TableCell className="text-gray-600">{doc.uploadDate}</TableCell>
                  <TableCell>
                    <Badge
                      className={doc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {doc.status === 'active' ? 'Active' : 'Processing'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Analytics Screen
function AnalyticsScreen() {
  const [analytics] = useState<AnalyticsData>(generateMockAnalytics())

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Total Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalCalls}</div>
            <p className="text-xs text-gray-600 mt-1">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{analytics.resolutionRate}%</div>
            <Progress value={analytics.resolutionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{analytics.customerSatisfaction}/5</div>
            <p className="text-xs text-gray-600 mt-1">Based on post-call surveys</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Call Metrics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">AI Resolution Rate</span>
                <span className="text-sm font-bold text-green-600">{analytics.resolutionRate}%</span>
              </div>
              <Progress value={analytics.resolutionRate} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Escalation Rate</span>
                <span className="text-sm font-bold text-orange-600">{analytics.escalationRate}%</span>
              </div>
              <Progress value={analytics.escalationRate} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Avg Resolution Time</span>
                <span className="text-sm font-bold text-purple-600">{analytics.avgEscalationTime} min</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-semibold">Issue Category</TableCell>
                <TableCell className="font-semibold">Count</TableCell>
                <TableCell className="font-semibold">Resolution Rate</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b">
                <TableCell className="text-gray-900">WiFi Connectivity</TableCell>
                <TableCell className="text-gray-600">342</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">85%</Badge>
                </TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="text-gray-900">Payment Processing</TableCell>
                <TableCell className="text-gray-600">289</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">72%</Badge>
                </TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="text-gray-900">Software Updates</TableCell>
                <TableCell className="text-gray-600">156</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800">65%</Badge>
                </TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="text-gray-900">Hardware Issues</TableCell>
                <TableCell className="text-gray-600">198</TableCell>
                <TableCell>
                  <Badge className="bg-orange-100 text-orange-800">45%</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Escalation Reasons</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-semibold">Reason</TableCell>
                <TableCell className="font-semibold">Count</TableCell>
                <TableCell className="font-semibold">Percentage</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b">
                <TableCell className="text-gray-900">Unresolved Issue</TableCell>
                <TableCell className="text-gray-600">156</TableCell>
                <TableCell className="text-gray-600">56%</TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="text-gray-900">Customer Request</TableCell>
                <TableCell className="text-gray-600">98</TableCell>
                <TableCell className="text-gray-600">35%</TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="text-gray-900">Technical Complexity</TableCell>
                <TableCell className="text-gray-600">23</TableCell>
                <TableCell className="text-gray-600">9%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Main App Component
export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Verifone AI Support Agent</h1>
          <p className="text-blue-100 mt-1">Intelligent voice-enabled customer support system</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start rounded-none h-auto p-0">
              <TabsTrigger value="dashboard" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="call-detail" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">
                Call Details
              </TabsTrigger>
              <TabsTrigger value="knowledge-base" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">
                Knowledge Base
              </TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">
                Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="min-h-[calc(100vh-300px)]">
          {activeTab === 'dashboard' && <DashboardScreen />}
          {activeTab === 'call-detail' && <CallDetailScreen />}
          {activeTab === 'knowledge-base' && <KnowledgeBaseScreen />}
          {activeTab === 'analytics' && <AnalyticsScreen />}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>Verifone AI Support Agent © 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
