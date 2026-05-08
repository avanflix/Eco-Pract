'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Users, ShoppingBag, Package, Truck, Activity, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        orders: 0,
        pendingOrders: 0,
        fulfilledOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statItems = [
        {
            title: 'Total Users',
            value: stats.users,
            description: 'Registered users',
            icon: Users,
        },
        {
            title: 'Orders Fulfilled',
            value: stats.fulfilledOrders,
            description: 'Successfully delivered',
            icon: Truck,
        },
        {
            title: 'Orders Pending',
            value: stats.pendingOrders,
            description: 'Action required',
            icon: Activity,
        },
        {
            title: 'Total Products',
            value: stats.products,
            description: 'Active SKUs',
            icon: Package,
        },
    ];

    if (loading) {
        return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Overview</h1>
                <p className="text-muted-foreground">
                    Welcome back to your store dashboard.
                </p>
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statItems.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
