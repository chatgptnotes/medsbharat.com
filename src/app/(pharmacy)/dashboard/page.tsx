'use client';

// Pharmacy Owner Dashboard
// Manage orders, inventory, and analytics

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  todayRevenue: number;
  monthRevenue: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  placedAt: string;
  patient: {
    name: string;
  };
}

export default function PharmacyDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    monthRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data for demo
      setStats({
        totalOrders: 156,
        pendingOrders: 8,
        todayRevenue: 12450,
        monthRevenue: 234500,
      });

      setRecentOrders([
        {
          id: '1',
          orderNumber: 'ORD123456',
          status: 'PLACED',
          totalAmount: 850,
          placedAt: new Date().toISOString(),
          patient: { name: 'Ramesh Sharma' },
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/pharmacy/orders/${orderId}/accept`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Pharmacy Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today Revenue</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatPrice(stats.todayRevenue)}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Month Revenue</p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatPrice(stats.monthRevenue)}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Orders
          </h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.patient.name} - {formatPrice(order.totalAmount)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      order.status === 'PLACED'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }
                  >
                    {order.status}
                  </Badge>
                  {order.status === 'PLACED' && (
                    <Button
                      size="sm"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
