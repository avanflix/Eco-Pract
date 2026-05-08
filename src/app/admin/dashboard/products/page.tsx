'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
    _id: string;
    title: string;
    category: string;
    packSize: string;
    images: string[];
    variants: {
        size: string;
        price: number;
        mrp?: number;
        stock: number;
    }[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            if (res.ok) {
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold tracking-tight">Products</h1>
                <Button asChild>
                    <Link href="/admin/dashboard/products/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Link>
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading products...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-10">
                    No products found. Add one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
                        return (
                            <div key={product._id} className="group relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                                <div className="aspect-square relative overflow-hidden bg-muted">
                                    {product.images[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold leading-none tracking-tight">{product.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex-1 space-y-2 text-sm">
                                        <p className="text-muted-foreground">
                                            <span className="font-medium text-foreground">Pack:</span> {product.packSize}
                                        </p>
                                        <div className="text-muted-foreground">
                                            <span className="font-medium text-foreground">Variants:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {product.variants.map((v, i) => (
                                                    <span key={i} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-foreground">
                                                        {v.size} ({v.mrp ? <span className="line-through text-muted-foreground mr-1">₹{v.mrp}</span> : null}₹{v.price})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                                        <div className="text-sm">
                                            <span className="font-medium">Stock:</span> {totalStock}
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/admin/dashboard/products/${product._id}`}>Edit</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
