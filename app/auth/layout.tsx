'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center space-x-3">
            <Box className="h-12 w-12 text-white" />
            <span className="text-2xl font-bold text-white">StockApp</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}