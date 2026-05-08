"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Truck, ArrowRight, MapPin, Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/useCartStore";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useProfileStore, Address } from "@/store/useProfileStore";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CheckoutPage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const router = useRouter();
    const { items: cartItems, getSubtotal, clearCart } = useCartStore();
    const { addresses, fetchAddresses } = useProfileStore();

    const [mounted, setMounted] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("online");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        fetchAddresses();
    }, [fetchAddresses]);

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            const defaultAddress = addresses.find((a) => a.isDefault);
            setSelectedAddressId(defaultAddress?._id || addresses[0]._id || "");
        }
    }, [addresses, selectedAddressId]);

    if (!mounted) return <div className="min-h-screen bg-gray-50" />;

    // Redirect to cart if empty (unless we just succeeded)
    if (cartItems.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-8">
                    <h2 className="text-2xl font-bold mb-4 text-headings">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
                    <Button asChild>
                        <Link href="/products">Browse Products</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    const subtotal = getSubtotal();
    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 50;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            setError("Please select a shipping address");
            return;
        }

        setIsProcessing(true);
        setError(null);

        const selectedAddress = addresses.find(a => a._id === selectedAddressId);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cartItems,
                    shippingAddress: selectedAddress,
                    paymentMethod,
                    subtotal,
                    tax,
                    shipping,
                    total
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to place order");
            }

            // Success
            clearCart();
            setIsSuccess(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Card className="max-w-md w-full p-8 text-center space-y-6">
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-20 w-20 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-headings">Order Confirmed!</h2>
                    <p className="text-muted-foreground">
                        Thank you for your purchase. We have received your order and are processing it right away.
                    </p>
                    <div className="pt-4 flex flex-col gap-3">
                        <Button asChild>
                            <Link href="/profile">View My Orders</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/">Return to Home</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-heading font-bold text-headings mb-8">Checkout</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Address & Payment) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-emerald-600" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {addresses.length === 0 ? (
                                    <div className="text-center py-6">
                                        <p className="text-muted-foreground mb-4">You have no saved addresses.</p>
                                        <Button variant="outline" asChild>
                                            <Link href="/profile/address/new?redirect=/checkout">
                                                <Plus className="h-4 w-4 mr-2" /> Add New Address
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <RadioGroup
                                            value={selectedAddressId}
                                            onValueChange={setSelectedAddressId}
                                            className="grid gap-4"
                                        >
                                            {addresses.map((address) => (
                                                <Label
                                                    key={address._id}
                                                    className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                                                        selectedAddressId === address._id
                                                            ? "border-emerald-500 bg-emerald-50/50"
                                                            : "hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <RadioGroupItem value={address._id || ""} className="mt-1" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-semibold text-headings">
                                                                {address.name} ({address.type})
                                                            </span>
                                                            {address.isDefault && (
                                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {address.flat}, {address.area}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {address.city}, {address.state} - {address.pincode}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mt-1 text-gray-600">
                                                            Phone: {address.phone}
                                                        </p>
                                                    </div>
                                                </Label>
                                            ))}
                                        </RadioGroup>

                                        <div className="pt-2">
                                            <Button variant="link" asChild className="px-0">
                                                <Link href="/profile/address/new?redirect=/checkout">
                                                    <Plus className="h-4 w-4 mr-1" /> Add another address
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-emerald-600" />
                                    Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={setPaymentMethod}
                                    className="grid gap-4 sm:grid-cols-2"
                                >
                                    <Label
                                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                                            paymentMethod === "online"
                                                ? "border-emerald-500 bg-emerald-50/50"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <RadioGroupItem value="online" />
                                        <div className="flex-1 flex items-center justify-between">
                                            <span className="font-medium text-headings">Pay Online</span>
                                            <CreditCard className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </Label>

                                    <Label
                                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                                            paymentMethod === "cod"
                                                ? "border-emerald-500 bg-emerald-50/50"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <RadioGroupItem value="cod" />
                                        <div className="flex-1 flex items-center justify-between">
                                            <span className="font-medium text-headings">Cash on Delivery</span>
                                            <Truck className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </Label>
                                </RadioGroup>
                                {paymentMethod === "online" && (
                                    <p className="text-sm text-muted-foreground mt-4 ml-1">
                                        You will be redirected to our secure payment gateway to complete your purchase.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (Order Summary) */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle className="text-xl">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                <Image
                                                    src={item.image || "/placeholder.png"}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            </div>
                                            <div className="flex-1 text-sm min-w-0">
                                                <p className="font-medium text-headings truncate">{item.name}</p>
                                                <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-sm font-medium">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-4 border-t text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="font-medium">
                                            {shipping === 0 ? <span className="text-emerald-600">Free</span> : `₹${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tax (18% GST)</span>
                                        <span className="font-medium">₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-lg font-bold text-headings">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button 
                                    className="w-full mt-8 py-6 text-lg shadow-sm"
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing || addresses.length === 0}
                                >
                                    {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
                                    {!isProcessing && <ArrowRight className="ml-2 h-5 w-5" />}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
