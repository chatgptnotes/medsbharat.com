'use client';

// Admin Dashboard
// Manage users, pharmacies, orders, and platform analytics

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Store,
  ShoppingBag,
  TrendingUp,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface AdminStats {
  totalUsers: number;
  totalPharmacies: number;
  pendingPharmacies: number;
  totalOrders: number;
  totalRevenue: number;
}

interface PendingPharmacy {
  id: string;
  businessName: string;
  ownerName: string;
  licenseNumber: string;
  status: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPharmacies: 0,
    pendingPharmacies: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [pendingPharmacies, setPendingPharmacies] = useState<
    PendingPharmacy[]
  >([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    // Mock data for demo
    setStats({
      totalUsers: 1250,
      totalPharmacies: 45,
      pendingPharmacies: 5,
      totalOrders: 3420,
      totalRevenue: 4250000,
    });

    setPendingPharmacies([
      {
        id: '1',
        businessName: 'HealthCare Pharmacy',
        ownerName: 'Rajesh Kumar',
        licenseNumber: 'DL-12345',
        status: 'PENDING',
      },
    ]);
  };

  const handleApprovePharmacy = async (pharmacyId: string) => {
    try {
      const response = await fetch(`/api/admin/pharmacies/${pharmacyId}/approve`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error approving pharmacy:', error);
    }
  };

  const handleRejectPharmacy = async (pharmacyId: string) => {
    try {
      const response = await fetch(`/api/admin/pharmacies/${pharmacyId}/reject`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error rejecting pharmacy:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pharmacies</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalPharmacies}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Store className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pendingPharmacies}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Store className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Pending Pharmacy Approvals */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Pending Pharmacy Approvals
          </h2>
          <div className="space-y-4">
            {pendingPharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {pharmacy.businessName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Owner: {pharmacy.ownerName} | License: {pharmacy.licenseNumber}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => handleApprovePharmacy(pharmacy.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectPharmacy(pharmacy.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
