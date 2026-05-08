'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Pencil } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ComboItem {
    name: string;
    quantity: string;
}

interface ComboPack {
    _id: string;
    title: string;
    image: string;
    price: string;
    mrp?: string;
    items: ComboItem[];
}

export default function ComboPackListPage() {
    const [loading, setLoading] = useState(true);
    const [packs, setPacks] = useState<ComboPack[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const router = useRouter();

    useEffect(() => {
        fetchComboPacks();
    }, []);

    const fetchComboPacks = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/combo-packs');
            const data = await res.json();
            if (Array.isArray(data)) {
                setPacks(data);
            }
        } catch (error) {
            console.error('Error fetching combo packs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePack = async (id: string) => {
        if (!confirm('Are you sure you want to delete this combo pack?')) return;

        try {
            const res = await fetch(`/api/admin/combo-packs?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setPacks(prev => prev.filter(p => p._id !== id));
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error deleting');
        }
    };

    if (loading) {
        return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold ">Combo Packs</h1>
                <Button asChild>
                    <Link href="/admin/dashboard/combo-packs/new" >
                        <Plus className="mr-2 h-4 w-4" /> Add Combo Pack
                    </Link>
                </Button>
            </div>

            {packs.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No combo packs found. Add one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packs.map((pack) => (
                        <Card key={pack._id} className="overflow-hidden group py-0">
                            <div className="h-80 relative bg-muted">
                                {pack.image && (
                                    <Image src={pack.image} alt={pack.title} fill className="object-cover" />
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <Button size="icon" variant="secondary" className="h-8 w-8" asChild>
                                        <Link href={`/admin/dashboard/combo-packs/${pack._id}`}>
                                            <span className="sr-only">Edit</span>
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeletePack(pack._id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardHeader>
                                <CardTitle>{pack.title}</CardTitle>
                                <CardDescription>
                                    {pack.mrp ? <span className="line-through text-muted-foreground mr-2">₹{pack.mrp}</span> : null}
                                    ₹{pack.price}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-base text-muted-foreground py-3">
                                    <strong>Items:</strong>
                                    <ul className="list-disc list-inside mt-1">
                                        {pack.items.map((item, idx) => (
                                            <li key={idx} className="truncate">{item.quantity}x {item.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
