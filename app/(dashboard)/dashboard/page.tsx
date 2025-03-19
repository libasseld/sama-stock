'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { Package2, TrendingUp, TrendingDown } from 'lucide-react';
import api from '@/lib/axios';

interface DashboardStats {
  total_products: number;
  total_supplies: number;
  total_stock_outs: number;
  recent_activities: {
    supplies: Array<{
      id: number;
      product_name: string;
      quantity: number;
      created_at: string;
    }>;
    stock_outs: Array<{
      id: number;
      product_name: string;
      quantity: number;
      created_at: string;
    }>;
  };
  stock_evolution: Array<{
    date: string;
    stock: number;
  }>;
  product_distribution: Array<{
    name: string;
    stock: number;
  }>;
}

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', refreshKey],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_products}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approvisionnements
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_supplies}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sorties</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_stock_outs}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution du stock</CardTitle>
            <CardDescription>
              Évolution du stock total sur les 30 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.stock_evolution}>
                <defs>
                  <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="stock"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#stockGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution des produits</CardTitle>
            <CardDescription>Stock par produit</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.product_distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="stock"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Derniers approvisionnements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recent_activities.supplies.map((supply) => (
                <div
                  key={supply.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{supply.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(supply.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    +{supply.quantity}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières sorties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recent_activities.stock_outs.map((stockOut) => (
                <div
                  key={stockOut.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{stockOut.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(stockOut.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-red-600">
                    -{stockOut.quantity}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}