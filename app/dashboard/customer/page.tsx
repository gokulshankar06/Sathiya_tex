"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-store"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, TrendingUp, ArrowRight, Clock, CheckCircle2 } from "lucide-react"

export default function CustomerDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { products, orders } = useData()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "customer")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const myOrders = orders.filter((o) => o.customerId === user.id || o.customerName === user.name)
  const totalSpent = myOrders.reduce((sum, o) => sum + o.total, 0)

  const stats = [
    {
      title: "Available Products",
      value: products.length,
      icon: Package,
      description: "Browse our catalog",
    },
    {
      title: "My Orders",
      value: myOrders.length,
      icon: ShoppingCart,
      description: "Track your orders",
    },
    {
      title: "Total Spent",
      value: `₹${(totalSpent / 1000).toFixed(1)}K`,
      icon: TrendingUp,
      description: "All time",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">Explore our premium textile products</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Browse Products</CardTitle>
              <CardDescription>Explore our premium textile collection</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/customer/products">
                <Button className="w-full gap-2">
                  View Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Track and manage your orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/customer/orders">
                <Button variant="outline" className="w-full gap-2">
                  View Orders
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Featured Products */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Featured Products</CardTitle>
            <CardDescription>Top quality textiles for your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg border border-border p-4 transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 aspect-video rounded-md bg-muted" />
                  <h3 className="font-medium text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold text-primary">
                      ₹{product.price}/{product.unit}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        {myOrders.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest order activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {order.status === "delivered" ? (
                          <CheckCircle2 className="h-5 w-5 text-accent" />
                        ) : (
                          <Clock className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.products.length} items - {order.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">₹{order.total.toLocaleString()}</p>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          order.status === "pending"
                            ? "bg-chart-5/10 text-chart-5"
                            : order.status === "processing"
                            ? "bg-primary/10 text-primary"
                            : order.status === "shipped"
                            ? "bg-chart-4/10 text-chart-4"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
