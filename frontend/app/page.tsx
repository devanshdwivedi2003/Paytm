"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, ArrowRightLeft, Users, Shield } from "lucide-react"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">PayWallet</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => router.push("/signin")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/signup")}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Digital Wallet for
            <span className="text-blue-600"> Seamless Payments</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Send money instantly, manage your balance, and connect with friends. Experience the future of digital
            payments with PayWallet.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/signup")}>
              Create Account
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/signin")}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PayWallet?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Built with security and simplicity in mind, PayWallet makes managing your money effortless.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <ArrowRightLeft className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Instant Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Send money to anyone instantly with just their email address. No waiting, no delays.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Secure & Safe</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your money and data are protected with bank-level security and encryption technology.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Easy to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Simple, intuitive interface that makes managing your money as easy as sending a text message.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust PayWallet for their digital payments.
          </p>
          <Button size="lg" variant="secondary" onClick={() => router.push("/signup")}>
            Create Your Account Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wallet className="h-6 w-6" />
            <span className="text-xl font-bold">PayWallet</span>
          </div>
          <p className="text-gray-400">© 2024 PayWallet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
