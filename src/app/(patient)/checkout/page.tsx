'use client';

// Checkout Page
// Handles address, prescription upload, and payment

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, CheckCircle, Loader2, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

const addressSchema = z.object({
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  phone: z.string().regex(/^\d{10}$/, 'Invalid phone number'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type AddressForm = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionUrl, setPrescriptionUrl] = useState<string>('');
  const [uploadingPrescription, setUploadingPrescription] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  // Redirect if cart is empty (client-side only)
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const subtotal = getSubtotal();
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;
  const pharmacyId = items[0]?.pharmacyId;

  const handlePrescriptionUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPrescriptionFile(file);
    setUploadingPrescription(true);

    try {
      const formData = new FormData();
      formData.append('prescription', file);

      const response = await fetch('/api/upload/prescription', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPrescriptionUrl(data.url);
      } else {
        alert(data.error || 'Upload failed');
        setPrescriptionFile(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload prescription');
      setPrescriptionFile(null);
    } finally {
      setUploadingPrescription(false);
    }
  };

  const onSubmit = async (data: AddressForm) => {
    if (!prescriptionUrl) {
      alert('Please upload prescription before placing order');
      return;
    }

    setPlacingOrder(true);

    try {
      // Create order
      const orderData = {
        pharmacyId,
        deliveryAddress: `${data.street}, ${data.city}, ${data.state} - ${data.pincode}`,
        deliveryLatitude: data.latitude || 0,
        deliveryLongitude: data.longitude || 0,
        contactPhone: data.phone,
        prescriptionUrl,
        items: items.map((item) => ({
          medicineId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        deliveryFee,
        totalAmount: total,
        paymentMethod: 'PAY_AT_PHARMACY', // Default for now
      };

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        clearCart();
        router.push(`/orders/${result.orderId}`);
      } else {
        alert(result.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Delivery Address
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Street Address"
                      {...register('street')}
                    />
                    {errors.street && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.street.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input placeholder="City" {...register('city')} />
                      {errors.city && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input placeholder="State" {...register('state')} />
                      {errors.state && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Input
                      placeholder="Pincode (6 digits)"
                      {...register('pincode')}
                    />
                    {errors.pincode && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.pincode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="Contact Phone (10 digits)"
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Prescription Upload */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Upload Prescription
                </h2>

                {!prescriptionUrl ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">
                      Upload your prescription (JPG, PNG, or PDF)
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={handlePrescriptionUpload}
                      className="hidden"
                      id="prescription-upload"
                      disabled={uploadingPrescription}
                    />
                    <label htmlFor="prescription-upload">
                      <Button
                        type="button"
                        disabled={uploadingPrescription}
                        onClick={() =>
                          document.getElementById('prescription-upload')?.click()
                        }
                      >
                        {uploadingPrescription ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </>
                        )}
                      </Button>
                    </label>
                  </div>
                ) : (
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-green-900">
                          Prescription Uploaded Successfully
                        </p>
                        <p className="text-sm text-green-700">
                          {prescriptionFile?.name}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPrescriptionFile(null);
                          setPrescriptionUrl('');
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4 pb-4 border-b">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-700">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">
                      {formatPrice(deliveryFee)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(total)}</span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={!prescriptionUrl || placingOrder}
                >
                  {placingOrder ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>

                <p className="text-xs text-gray-600 mt-4 text-center">
                  By placing this order, you agree to our terms and conditions
                </p>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
