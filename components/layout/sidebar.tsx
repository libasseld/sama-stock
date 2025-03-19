'use client';

import { cn } from '@/lib/utils';
import {
  BarChart3,
  Box,
  LogOut,
  Package,
  ShoppingCart,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const routes = [
  {
    label: 'Tableau de bord',
    icon: BarChart3,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Produits',
    icon: Package,
    href: '/products',
    color: 'text-violet-500',
  },
  {
    label: 'Approvisionnements',
    icon: Truck,
    href: '/supplies',
    color: 'text-pink-500',
  },
  {
    label: 'Sorties',
    icon: ShoppingCart,
    href: '/outputs',
    color: 'text-orange-500',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const onLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <Box className="h-8 w-8" />
          <h1 className="text-2xl font-bold ml-2">StockApp</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                pathname === route.href
                  ? 'text-white bg-white/10'
                  : 'text-zinc-400'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3">
        <button
          onClick={onLogout}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3 text-red-500" />
            Déconnexion
          </div>
        </button>
      </div>
    </div>
  );
}