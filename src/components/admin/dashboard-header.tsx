'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function DashboardHeader() {
    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/admin';
        } catch (error) {
            console.error('Logout failed:', error);
            // Fallback redirect just in case
            window.location.href = '/admin';
        }
    };

    return (
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="font-semibold text-xl">Admin Dashboard</div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">admin@ecoforever.com</span>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
