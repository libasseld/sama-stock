'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

interface StockOut {
  id: number;
  product_name: string;
  quantity: number;
  reason: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  current_stock: number;
}

const formSchema = z.object({
  product_id: z.string().min(1, 'Veuillez sélectionner un produit'),
  quantity: z.coerce.number().min(1, 'La quantité doit être supérieure à 0'),
  reason: z.string().min(2, 'La raison est requise'),
});

export default function OutputsPage() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      reason: '',
    },
  });

  const { data: stockOuts, refetch } = useQuery<StockOut[]>({
    queryKey: ['stock-outs'],
    queryFn: async () => {
      const response = await api.get('/stock-outs');
      return response.data;
    },
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data;
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const selectedProduct = products?.find(
        (p) => p.id.toString() === values.product_id
      );

      if (selectedProduct && values.quantity > selectedProduct.current_stock) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Stock insuffisant',
        });
        return;
      }

      await api.post('/stock-outs', {
        product_id: parseInt(values.product_id),
        quantity: values.quantity,
        reason: values.reason,
      });
      
      toast({
        title: 'Succès',
        description: 'Sortie de stock enregistrée avec succès',
      });
      
      setIsOpen(false);
      form.reset();
      refetch();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sorties de stock</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle sortie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle sortie de stock</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="product_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produit</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un produit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products?.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name} (Stock: {product.current_stock})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantité</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Raison</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Enregistrer
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Raison</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockOuts?.map((stockOut) => (
              <TableRow key={stockOut.id}>
                <TableCell>{stockOut.product.name}</TableCell>
                <TableCell>-{stockOut.quantity}</TableCell>
                <TableCell>{stockOut.reason}</TableCell>
                <TableCell>
                  {new Date(stockOut.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}