'use client';

import { ComboPackForm } from '@/components/admin/combo-pack-form';

export default function NewComboPackPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">New Combo Pack</h1>
            </div>
            <ComboPackForm />
        </div>
    );
}
