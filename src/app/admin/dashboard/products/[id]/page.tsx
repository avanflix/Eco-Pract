'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Trash2, Plus, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface Variant {
    size: string;
    price: string;
    mrp?: string;
    stock: string;
    premiumPrice?: string;
    premiumMrp?: string;
    premiumStock?: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use() or just await it if in an async component (but this is client)
    // In Next.js client components receiving params prop (which is a promise), we must unwrap it.
    // However, simpler to handle it via useEffect or use() hook.
    // Using `use` hook to unwrap params
    const { id } = use(params);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [hasPremium, setHasPremium] = useState(false);
    const [premiumImages, setPremiumImages] = useState<string[]>([]);
    const [variants, setVariants] = useState<Variant[]>([
        { size: '', price: '', mrp: '', stock: '', premiumPrice: '', premiumMrp: '', premiumStock: '' },
    ]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        packSize: '',
    });

    useEffect(() => {
        fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/admin/products/${id}`);
            if (!res.ok) throw new Error('Failed to fetch product');
            const data = await res.json();

            setFormData({
                title: data.title,
                description: data.description,
                category: data.category,
                packSize: data.packSize,
            });
            setHasPremium(data.hasPremium || false);
            setPremiumImages(data.premiumImages || []);
            setImages(data.images || []);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setVariants(data.variants.map((v: any) => ({
                size: v.size,
                price: v.price.toString(),
                ...(v.mrp !== undefined ? { mrp: v.mrp.toString() } : {}),
                stock: v.stock.toString(),
                ...(v.premiumPrice !== undefined ? { premiumPrice: v.premiumPrice.toString() } : {}),
                ...(v.premiumMrp !== undefined ? { premiumMrp: v.premiumMrp.toString() } : {}),
                ...(v.premiumStock !== undefined ? { premiumStock: v.premiumStock.toString() } : {})
            })));
        } catch (error) {
            console.error(error);
            toast.error('Error loading product');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { size: '', price: '', mrp: '', stock: '', premiumPrice: '', premiumMrp: '', premiumStock: '' }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isPremium = false) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setSaving(true);
        const newUrls: string[] = [];

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                });
                
                if (res.ok) {
                    const data = await res.json();
                    if (data.url) return data.url;
                }
                throw new Error('Upload failed for ' + file.name);
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            newUrls.push(...uploadedUrls.filter(url => url !== undefined));

            if (newUrls.length > 0) {
                if (isPremium) {
                    setPremiumImages(prev => [...prev, ...newUrls]);
                } else {
                    setImages(prev => [...prev, ...newUrls]);
                }
            } else {
                toast.error('Upload failed for all images');
            }
        } catch (error) {
            console.error('Upload error', error);
            toast.error('Some or all uploads failed');
        } finally {
            setSaving(false);
            // reset file input
            e.target.value = '';
        }
    };

    const removeImage = (index: number, isPremium = false) => {
        if (isPremium) {
            setPremiumImages(premiumImages.filter((_, i) => i !== index));
        } else {
            setImages(images.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        if (images.length === 0) {
            toast.error('Please upload at least one image');
            setSaving(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                images,
                hasPremium,
                premiumImages,
                variants: variants.map(v => ({
                    size: v.size,
                    price: parseFloat(v.price),
                    ...(v.mrp ? { mrp: parseFloat(v.mrp) } : {}),
                    stock: parseInt(v.stock),
                    ...(hasPremium && v.premiumPrice ? { premiumPrice: parseFloat(v.premiumPrice) } : {}),
                    ...(hasPremium && v.premiumMrp ? { premiumMrp: parseFloat(v.premiumMrp) } : {}),
                    ...(hasPremium && v.premiumStock ? { premiumStock: parseInt(v.premiumStock) } : {})
                }))
            };

            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/admin/dashboard/products');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Error updating product');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                router.push('/admin/dashboard/products');
            } else {
                toast.error("Failed to delete product");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error deleting product");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-10 text-center">Loading product...</div>;

    return (
        <div className="max-w-4xl mx-auto py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Edit Product</CardTitle>
                        <CardDescription>Update product details</CardDescription>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Product
                    </Button>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Product Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g. Round Plate"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="plates">Plates</SelectItem>
                                        <SelectItem value="bowls">Bowls</SelectItem>
                                        <SelectItem value="cutlery">Cutlery</SelectItem>
                                        <SelectItem value="trays">Trays</SelectItem>
                                        <SelectItem value="combo-packs">Combo Packs</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Product details..."
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="packSize">Pack Size</Label>
                            <Input
                                id="packSize"
                                name="packSize"
                                placeholder="e.g. Pack of 25"
                                value={formData.packSize}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-2 border p-4 rounded-md bg-gray-50">
                            <input
                                type="checkbox"
                                id="hasPremium"
                                checked={hasPremium}
                                onChange={(e) => setHasPremium(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-accent focus:ring-primary-accent"
                            />
                            <Label htmlFor="hasPremium" className="font-semibold text-base cursor-pointer">
                                Enable Premium Variant
                            </Label>
                        </div>

                        {/* Images */}
                        <div className="space-y-2">
                            <Label>Images</Label>
                            <div className="flex flex-wrap gap-4">
                                {images.map((url, idx) => (
                                    <div key={idx} className="relative h-24 w-24 border rounded-md overflow-hidden group">
                                        <Image src={url} alt="Product" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                <Label
                                    htmlFor="image-upload"
                                    className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed hover:bg-muted"
                                >
                                    <Upload className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground mt-1">Upload</span>
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={saving}
                                    />
                                </Label>
                            </div>
                        </div>

                        {/* Premium Images */}
                        {hasPremium && (
                            <div className="space-y-2 border-t pt-4 border-dashed">
                                <Label className="text-primary-accent">Premium Images</Label>
                                <div className="flex flex-wrap gap-4">
                                    {premiumImages.map((url, idx) => (
                                        <div key={idx} className="relative h-24 w-24 border rounded-md overflow-hidden group">
                                            <Image src={url} alt="Premium Product" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx, true)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}

                                    <Label
                                        htmlFor="premium-image-upload"
                                        className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-primary-accent/50 hover:bg-primary-accent/5"
                                    >
                                        <Upload className="h-5 w-5 text-primary-accent disabled:opacity-50" />
                                        <span className="text-xs text-primary-accent mt-1">Upload Premium</span>
                                        <Input
                                            id="premium-image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageUpload(e, true)}
                                            disabled={saving}
                                        />
                                    </Label>
                                </div>
                            </div>
                        )}

                        {/* Variants */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold">Variants (Size & Pricing)</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                                    <Plus className="h-4 w-4 mr-1" /> Add Variant
                                </Button>
                            </div>

                            {variants.map((variant, index) => (
                                <div key={index} className={`grid gap-4 ${hasPremium ? 'md:grid-cols-7' : 'md:grid-cols-4'} items-end border p-4 rounded-md relative bg-gray-50/50`}>
                                    <div className="space-y-2">
                                        <Label>Size</Label>
                                        <Input
                                            placeholder="e.g. 10 inch"
                                            value={variant.size}
                                            onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Price (₹)</Label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>MRP (₹)</Label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={variant.mrp || ''}
                                            onChange={(e) => handleVariantChange(index, 'mrp', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Stock</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={variant.stock}
                                            onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                            required
                                        />
                                    </div>

                                    {hasPremium && (
                                        <>
                                            <div className="space-y-2">
                                                <Label className="text-primary-accent">Prem. Price (₹)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={variant.premiumPrice || ''}
                                                    onChange={(e) => handleVariantChange(index, 'premiumPrice', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-primary-accent">Prem. MRP (₹)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={variant.premiumMrp || ''}
                                                    onChange={(e) => handleVariantChange(index, 'premiumMrp', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-primary-accent">Prem. Stock</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={variant.premiumStock || ''}
                                                    onChange={(e) => handleVariantChange(index, 'premiumStock', e.target.value)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {variants.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 mb-0.5"
                                            onClick={() => removeVariant(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || saving}>
                            {saving ? 'Saving...' : 'Update Product'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
