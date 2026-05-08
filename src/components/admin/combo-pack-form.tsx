'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Loader2, Trash2, X, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ComboItem {
    name: string;
    quantity: string;
}

export interface ComboPackData {
    _id?: string;
    title: string;
    image: string;
    price: string;
    mrp?: string;
    items: ComboItem[];
    textPosition: 'left' | 'right';
}

interface ComboPackFormProps {
    initialData?: ComboPackData;
}

export function ComboPackForm({ initialData }: ComboPackFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<ComboPackData>(initialData || {
        title: '',
        image: '',
        price: '',
        mrp: '',
        items: [],
        textPosition: 'left'
    });
    const [newItemText, setNewItemText] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('1');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setSaving(true);
        const uploadData = new FormData();
        uploadData.append('file', files[0]);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: uploadData,
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setFormData(prev => ({ ...prev, image: data.url }));
            } else {
                toast.error('Upload failed');
            }
        } catch (error) {
            console.error('Upload error', error);
            toast.error('Upload failed');
        } finally {
            setSaving(false);
        }
    };

    const addItem = () => {
        if (!newItemText.trim()) return;
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { name: newItemText, quantity: newItemQuantity || '1' }]
        }));
        setNewItemText('');
        setNewItemQuantity('1');
    };

    const removeItem = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== idx)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image) {
            toast.error('Please upload an image');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/admin/combo-packs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/dashboard/combo-packs');
                router.refresh();
            } else {
                toast.error('Failed to save combo pack');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving combo pack');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{initialData ? 'Edit' : 'Create'} Combo Pack</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Price (₹)</Label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>MRP (₹)</Label>
                            <Input
                                type="number"
                                value={formData.mrp || ''}
                                onChange={e => setFormData({ ...formData, mrp: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Items Included</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Item Name (e.g. Plates)"
                                value={newItemText}
                                onChange={e => setNewItemText(e.target.value)}
                                className="flex-1"
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addItem();
                                    }
                                }}
                            />
                            <Input
                                type="number"
                                placeholder="Qty"
                                value={newItemQuantity}
                                onChange={e => setNewItemQuantity(e.target.value)}
                                className="w-20"
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addItem();
                                    }
                                }}
                            />
                            <Button type="button" onClick={addItem}>Add</Button>
                        </div>
                        <div className="space-y-1 mt-2">
                            {formData.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-muted px-3 py-1 rounded text-sm">
                                    <span>{item.quantity}x {item.name}</span>
                                    <Button type="button" variant="ghost" size="sm" className="h-6 w-6 text-red-500" onClick={() => removeItem(idx)}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Image</Label>
                        <div className="flex items-center gap-4">
                            {formData.image && (
                                <div className="relative h-24 w-24 rounded overflow-hidden border">
                                    <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                </div>
                            )}
                            <Label htmlFor="combo-image-upload" className="cursor-pointer border px-3 py-2 rounded-md hover:bg-muted text-sm flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Upload Image
                            </Label>
                            <Input
                                id="combo-image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Pack
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
