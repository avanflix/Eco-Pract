import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Package, MapPin, Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

// --- Types ---

export interface OrderItemType {
    product?: {
        title?: string;
        images?: string[];
    };
    quantity: number;
    size: string;
    price: number;
}

export interface ShippingAddressType {
    street?: string;
    city: string;
    state?: string;
    zipCode?: string;
    country: string;
}

export interface Order {
    id: string;
    orderId?: string;
    date: string;
    status: "Pending" | "Delivered" | "Processing" | "Shipped" | "Cancelled";
    total: number;
    items: string[];
    fullItems?: OrderItemType[];
    shippingAddress?: ShippingAddressType;
}

export interface Address {
    id?: string;
    _id?: string;
    type: "Home" | "Work" | "Other";
    name: string;
    email: string;
    phone: string;
    flat: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

// --- Components ---

export const OrderCard = ({ order, compact = false }: { order: Order; compact?: boolean }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "Delivered": return "bg-green-100 text-green-700 hover:bg-green-100/80";
            case "Processing": return "bg-blue-100 text-blue-700 hover:bg-blue-100/80";
            case "Shipped": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80";
            case "Cancelled": return "bg-red-100 text-red-700 hover:bg-red-100/80";
            default: return "bg-gray-100 text-gray-700 hover:bg-gray-100/80";
        }
    };

    const displayId = order.orderId || order.id.slice(-8).toUpperCase();

    return (
        <>
            <Card className={`min-w-[300px] snap-start ${compact ? 'shadow-sm' : ''}`}>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                            <CardTitle className="text-base font-semibold truncate" title={`Order #${displayId}`}>
                                Order #{displayId}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} shrink-0`} variant="secondary">
                            {order.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="text-sm">
                    <div className="space-y-1 mb-3">
                        <p className="font-medium text-foreground/80">{order.items.join(", ")}</p>
                        <p className="text-muted-foreground">Total: ₹{order.total}</p>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs h-8"
                        onClick={() => setIsModalOpen(true)}
                    >
                        View Details
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Order Summary</DialogTitle>
                        <DialogDescription>
                            Review the details of your order.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                        <div className="flex justify-between items-center border-b pb-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Order ID</p>
                                <p className="font-mono font-medium text-emerald-700">#{displayId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge className={`${getStatusColor(order.status)}`} variant="secondary">
                                    {order.status}
                                </Badge>
                            </div>
                        </div>

                        {order.shippingAddress && (
                            <div className="border-b pb-4">
                                <h3 className="font-semibold mb-2 text-sm">Shipping Address</h3>
                                <p className="text-sm text-muted-foreground">{order.shippingAddress.street}</p>
                                <p className="text-sm text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            </div>
                        )}

                        <div>
                            <h3 className="font-semibold mb-3 text-sm">Items</h3>
                            <div className="space-y-3">
                                {order.fullItems && order.fullItems.length > 0 ? (
                                    order.fullItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border text-sm">
                                            <div>
                                                <p className="font-medium">{item.product?.title || 'Unknown Product'}</p>
                                                <p className="text-xs text-muted-foreground">Size: {item.size} | Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">{order.items.join(", ")}</p>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-4 flex justify-between items-center">
                            <h3 className="font-bold">Total Amount</h3>
                            <p className="font-bold text-emerald-700">₹{order.total}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export const AddressCard = ({ address, compact = false, onEdit, onDelete }: { address: Address; compact?: boolean, onEdit?: () => void, onDelete?: () => void }) => {
    return (
        <Card className={`min-w-[280px] snap-start relative ${compact ? 'shadow-sm' : ''}`}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{address.type}</span>
                    </div>
                    {address.isDefault && (
                        <Badge variant="outline" className="text-[10px] px-2 py-0 border-primary text-primary bg-primary/5">
                            Default
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">{address.name}</p>
                <p>{address.flat}, {address.area}</p>
                <p>{address.city}, {address.state} - {address.pincode}</p>
                <p className="mt-2 text-xs">Ph: {address.phone} {address.email && `| Email: ${address.email}`}</p>

                {!compact && (
                    <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={onEdit}>
                            <Edit2 className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
                            <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export const ProfileForm = ({ defaultValues }: { defaultValues: UserProfile }) => {
    const updateProfile = useProfileStore(state => state.updateProfile);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await updateProfile({
                firstName: formData.get('firstName') as string,
                lastName: formData.get('lastName') as string,
                phone: formData.get('phone') as string,
            });
            toast.success("Profile updated successfully!");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" defaultValue={defaultValues.firstName} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" defaultValue={defaultValues.lastName} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={defaultValues.email} disabled className="bg-gray-50 text-gray-500" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Mobile Number</Label>
                        <Input id="phone" name="phone" type="tel" defaultValue={defaultValues.phone} />
                    </div>
                    <div className="md:col-span-2 pt-2">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
