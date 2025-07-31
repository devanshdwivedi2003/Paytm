"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Wallet, ArrowLeft, Search, Send } from "lucide-react"
import Link from "next/link"

interface User {
  _id: string
  username: string
  firstName: string
  lastName: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    // Load all users initially
    searchUsers("")
  }, [router])

  const searchUsers = async (query: string = searchQuery) => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/api/v1/user/bulk?filter=${query}`)
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

  const handleSendMoney = (user: User) => {
    // Navigate to transfer page with pre-selected user
    router.push(`/transfer?userId=${user._id}&name=${user.firstName} ${user.lastName}`)
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
              <span className="text-xl font-bold text-gray-900">Find Users</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Users
              </CardTitle>
              <CardDescription>Find other PayWallet users to send money to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by first or last name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchUsers()}
                />
                <Button onClick={() => searchUsers()} disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({users.length})</CardTitle>
              <CardDescription>Click "Send Money" to transfer funds to any user</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Searching users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users found</p>
                  <p className="text-sm text-gray-400">Try searching with different keywords</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.username}</div>
                      </div>
                      <Button size="sm" onClick={() => handleSendMoney(user)} className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Money
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
