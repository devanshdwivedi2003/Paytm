"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Send, LogOut, User, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface UserData {
  balance: number
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    fetchUserData(token)
  }, [router])

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/account/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      } else {
        localStorage.removeItem("token")
        router.push("/signin")
      }
    } catch (err) {
      console.error("Error fetching user data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your wallet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">PayWallet</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to your Wallet</h1>
            <p className="text-gray-600">Manage your money, send payments, and track your transactions.</p>
          </div>

          {/* Balance Card */}
          <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Current Balance</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white hover:bg-white/20"
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">
                {showBalance ? `₹${userData?.balance?.toFixed(2) || "0.00"}` : "••••••"}
              </div>
              <p className="text-blue-100">Available to spend</p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/transfer">
                <CardHeader className="text-center">
                  <Send className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle>Send Money</CardTitle>
                  <CardDescription>Transfer money to friends and family instantly</CardDescription>
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/users">
                <CardHeader className="text-center">
                  <User className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle>Find Users</CardTitle>
                  <CardDescription>Search and connect with other PayWallet users</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions and account activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>No recent transactions</p>
                <p className="text-sm">Start by sending money to someone!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
