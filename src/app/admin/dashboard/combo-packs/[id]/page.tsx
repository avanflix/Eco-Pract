'use client';

import { useEffect, useState, use } from 'react';
import { ComboPackForm, ComboPackData } from '@/components/admin/combo-pack-form';
import { Loader2 } from 'lucide-react';

// Using Next.js 15+ convention for params as promise
export default function EditComboPackPage({ params }: { params: Promise<{ id: string }> }) {
    const [pack, setPack] = useState<ComboPackData | null>(null);
    const [loading, setLoading] = useState(true);
    // Unwrap params
    const resolvedParams = use(params);
    const id = resolvedParams.id;


    useEffect(() => {
        const fetchPack = async () => {
            try {
                const res = await fetch(`/api/admin/combo-packs?id=${id}`);
                const data = await res.json();
                if (res.ok) {
                    setPack(data);
                }
            } catch (error) {
                console.error('Error fetching pack', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPack();
    }, [id]);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    if (!pack) return <div>Combo Pack not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Edit Combo Pack</h1>
            </div>
            <ComboPackForm initialData={pack} />
        </div>
    );
}
