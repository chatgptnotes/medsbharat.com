'use client';

// Order Details & Tracking Page
// Shows order status and tracking information

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  MapPin,
  Phone,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface OrderItem {
  id: string;
  medicine: {
    name: string;
    strength?: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  deliveryAddress: string;
  contactPhone: string;
  prescriptionUrl: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  placedAt: string;
  items: OrderItem[];
  pharmacy: {
    businessName: string;
    address: string;
  };
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();

        if (data.order) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order not found
          </h2>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { key: 'PLACED', label: 'Order Placed', icon: CheckCircle },
    { key: 'ACCEPTED', label: 'Accepted', icon: Clock },
    { key: 'PREPARING', label: 'Preparing', icon: Package },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === order.status
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED':
        return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED':
      case 'PREPARING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_FOR_DELIVERY':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <Badge className={getStatusColor(order.status)}>
              {order.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-gray-600">
            Placed on {new Date(order.placedAt).toLocaleDateString('en-IN')} at{' '}
            {new Date(order.placedAt).toLocaleTimeString('en-IN')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Status
              </h2>
              <div className="space-y-4">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step.key} className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          isCompleted
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            isCurrent ? 'text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Order Items */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start pb-4 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.medicine.name}</h3>
                      {item.medicine.strength && (
                        <p className="text-sm text-gray-600">
                          {item.medicine.strength}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Prescription */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Prescription
              </h2>
              <a
                href={order.prescriptionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:underline"
              >
                View Prescription
                <span className="material-icons ml-2">open_in_new</span>
              </a>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pharmacy Details */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Pharmacy
              </h2>
              <p className="font-semibold mb-2">
                {order.pharmacy.businessName}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {order.pharmacy.address}
              </p>
            </Card>

            {/* Delivery Address */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Delivery Address
              </h2>
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <p className="text-gray-700">{order.deliveryAddress}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <p className="text-gray-700">{order.contactPhone}</p>
              </div>
            </Card>

            {/* Bill Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Bill Summary
              </h2>
              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">
                    {formatPrice(order.deliveryFee)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
