'use client';

import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

interface Product {
  id: string;
  name: string;
  image: string | null;
  current_stock: number;
  price: number;
}

const formSchema = z.object({
  name: z.string().min(2, 'La désignation doit contenir au moins 2 caractères'),
  image: z.any().optional(),
  current_stock: z.coerce.number().min(0, 'Le stock ne peut pas être négatif'),
  price: z.coerce.number().min(0, 'Le prix ne peut pas être négatif'),
});

export default function ProductsPage() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      current_stock: 0,
      price: 0,
    },
  });

  

  const { data: products, refetch } = useQuery<Product[]>({
    queryKey: ['products', search],
    queryFn: async () => {
      const response = await api.get('/products', {
        params: { search }
      });
      return response.data;
    },
  });

  // Rafraîchir les produits lorsque la page est visitée
  useEffect(() => {
    refetch();
  }, [refetch]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('current_stock', values.current_stock.toString());
      formData.append('price', values.price.toString());
      if (values.image && values.image.length > 0) {
        formData.append('image', values.image[0]);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (selectedProduct) {
        await api.post(`/products/${selectedProduct.id}?_method=PUT`, formData, config);
        toast({
          title: 'Succès',
          description: 'Produit modifié avec succès',
        });
      } else {
        await api.post('/products', formData, config);
        toast({
          title: 'Succès',
          description: 'Produit ajouté avec succès',
        });
      }

      setIsOpen(false);
      form.reset();
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue',
      });
    }
  };

  const handleDelete = async (id: string) => {
    // Demander confirmation avant de supprimer
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?');
    
    if (!confirmed) return;
    
    try {
      await api.delete(`/products/${id}`);
      toast({
        title: 'Succès',
        description: 'Produit supprimé avec succès',
      });
      refetch();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue',
      });
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    form.reset({
      name: product.name,
      current_stock: product.current_stock,
      price: product.price,
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Produits</h1>
        {/* Search bar */}
        <Input 
          type="text" 
          placeholder="Rechercher un produit" 
          className="w-1/2 md:w-2/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)} 
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              refetch();
            }
          }}
        />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Désignation</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix (CFA)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            field.onChange(e.target.files);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="current_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock actuel</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {selectedProduct ? 'Modifier' : 'Ajouter'}
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
              <TableHead>Image</TableHead>
              <TableHead>Désignation</TableHead>
              <TableHead>Prix (CFA)</TableHead>
              <TableHead>Stock actuel</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image ? (
                    <img
                      src={`http://localhost:8000/${product.image}`}
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                      N/A
                    </div>
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price.toLocaleString()} CFA</TableCell>
                <TableCell>{product.current_stock}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}