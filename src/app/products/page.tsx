import { Suspense } from 'react';
import ProductsContent from './ProductsContent';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Browse Products',
  description: 'Browse medicines and healthcare products by category',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
