"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, ArrowLeft, Send, Search } from "lucide-react"
import Link from "next/link"

interface User {
  _id: string
  username: string
  firstName: string
  lastName: string
}

export default function TransferPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [amount, setAmount] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [transferLoading, setTransferLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }
  }, [router])

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setUsers([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/api/v1/user/bulk?filter=${searchQuery}`)
      const data = await response.json()

      if (response.ok) {
        setUsers(data.user || [])
      }
    } catch (err) {
      console.error("Error searching users:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleTransfer = async () => {
    if (!selectedUser || !amount) {
      setError("Please select a user and enter an amount")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    setTransferLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("http://localhost:3000/api/v1/account/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: selectedUser._id,
          amount: Number.parseFloat(amount),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Successfully transferred ₹${amount} to ${selectedUser.firstName} ${selectedUser.lastName}`)
        setAmount("")
        setSelectedUser(null)
        setSearchQuery("")
        setUsers([])
      } else {
        setError(data.message || "Transfer failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setTransferLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Send Money</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Search Users */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Recipient
              </CardTitle>
              <CardDescription>Search for users by their first or last name</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchUsers()}
                />
                <Button onClick={searchUsers} disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>

              {/* Search Results */}
              {users.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Select Recipient:</Label>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedUser?._id === user._id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.username}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transfer Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Transfer Details
              </CardTitle>
              <CardDescription>Enter the amount you want to send</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedUser && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label className="text-sm font-medium text-blue-800">Sending to:</Label>
                  <div className="font-medium text-blue-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </div>
                  <div className="text-sm text-blue-700">{selectedUser.username}</div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleTransfer}
                disabled={!selectedUser || !amount || transferLoading}
                className="w-full"
              >
                {transferLoading ? "Processing..." : `Send ₹${amount || "0.00"}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
