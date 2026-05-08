'use client';

import { useEffect, useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Loader2, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
    product: {
        title: string;
        images: string[];
    };
    quantity: number;
    size: string;
    price: number;
}

interface Order {
    _id: string;
    orderId?: string;
    user?: {
        name: string;
        email: string;
    };
    guestInfo?: {
        name: string;
        email: string;
        phone: string;
    };
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
    shippingAddress: {
        street?: string;
        city: string;
        state?: string;
        zipCode?: string;
        country: string;
    };
}

const statusColorMap: Record<string, string> = {
    Pending: 'bg-yellow-500',
    Processing: 'bg-blue-500',
    Shipped: 'bg-purple-500',
    Delivered: 'bg-green-500',
    Cancelled: 'bg-red-500',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('date_desc');

    // Modal State
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            if (res.ok) {
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders.');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setOrders((prev) =>
                    prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
                );
                toast.success('Status updated successfully');
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating status');
        }
    };

    // Filter and Sort Logic
    const filteredOrders = useMemo(() => {
        let result = [...orders];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(order => {
                const idMatch = (order.orderId || order._id).toLowerCase().includes(q);
                const nameMatch = (order.user?.name || order.guestInfo?.name || '').toLowerCase().includes(q);
                return idMatch || nameMatch;
            });
        }

        if (statusFilter !== 'All') {
            result = result.filter(order => order.status === statusFilter);
        }

        result.sort((a, b) => {
            if (sortBy === 'date_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === 'date_asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy === 'amount_desc') return b.totalAmount - a.totalAmount;
            if (sortBy === 'amount_asc') return a.totalAmount - b.totalAmount;
            return 0;
        });

        return result;
    }, [orders, searchQuery, statusFilter, sortBy]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-4xl font-bold tracking-tight">Orders</h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-md border shadow-sm">
                <div className="relative w-full sm:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search order ID or customer name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Status</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date_desc">Date (Newest First)</SelectItem>
                        <SelectItem value="date_asc">Date (Oldest First)</SelectItem>
                        <SelectItem value="amount_desc">Total Amount (High - Low)</SelectItem>
                        <SelectItem value="amount_asc">Total Amount (Low - High)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    No orders match your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell className="font-mono font-medium text-emerald-700">
                                        {order.orderId || order._id.substring(order._id.length - 8).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {order.user?.name || order.guestInfo?.name || 'Guest'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {order.user?.email || order.guestInfo?.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="font-semibold">₹{order.totalAmount}</TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={order.status}
                                            onValueChange={(val) => updateStatus(order._id, val)}
                                        >
                                            <SelectTrigger className={`w-[130px] h-8 text-white ${statusColorMap[order.status] || 'bg-gray-500'}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Processing">Processing</SelectItem>
                                                <SelectItem value="Shipped">Shipped</SelectItem>
                                                <SelectItem value="Delivered">Delivered</SelectItem>
                                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* View Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            Review the items, shipping address, and total for this order.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="mt-4 space-y-6">
                            <div className="flex justify-between items-center border-b pb-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Order ID</p>
                                    <p className="font-mono font-medium text-emerald-700">
                                        {selectedOrder.orderId || selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Placed On</p>
                                    <p className="font-medium">{format(new Date(selectedOrder.createdAt), 'PPpp')}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 border-b pb-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Customer Details</h3>
                                    <p className="text-sm">{selectedOrder.user?.name || selectedOrder.guestInfo?.name || 'Guest'}</p>
                                    <p className="text-sm">{selectedOrder.user?.email || selectedOrder.guestInfo?.email}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                                    <p className="text-sm">{selectedOrder.shippingAddress.street}</p>
                                    <p className="text-sm">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                                    <p className="text-sm">{selectedOrder.shippingAddress.country}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-4">Order Items</h3>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border">
                                            <div>
                                                <p className="font-medium text-sm">{item.product?.title || 'Unknown Product'}</p>
                                                <p className="text-xs text-muted-foreground">Size: {item.size} | Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium text-sm">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg">Total Amount</h3>
                                    <p className="font-bold text-lg text-emerald-700">₹{selectedOrder.totalAmount}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
