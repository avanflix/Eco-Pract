"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/useCartStore";

export function CartSheet() {
    const { items, removeItem, updateQuantity, getTotalItems, getSubtotal } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Prevent hydration mismatch for persistent store
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="relative p-2">
                <ShoppingCart className="h-6 w-6 text-headings hover:text-primary-accent transition-colors" />
            </div>
        );
    }

    const totalItems = getTotalItems();
    const subtotal = getSubtotal();

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button className="relative p-2 focus:outline-none focus:ring-2 focus:ring-primary-accent rounded-full transition-colors">
                    <ShoppingCart className="h-6 w-6 text-headings hover:text-primary-accent transition-colors" />
                    {totalItems > 0 && (
                        <span className="absolute top-0 right-0 bg-primary-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                            {totalItems > 99 ? "99+" : totalItems}
                        </span>
                    )}
                </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg flex flex-col pt-10 px-4 sm:px-6">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl font-heading font-bold flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6" /> Your Cart
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                            ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                        </span>
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <ShoppingCart className="h-10 w-10 text-gray-300" />
                        </div>
                        <p className="text-lg font-medium text-headings">Your cart is empty</p>
                        <p className="text-muted-foreground max-w-[250px]">
                            Looks like you haven&apos;t added any eco-friendly products to your cart yet.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/#products" onClick={() => setIsOpen(false)}>Start Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 -mx-6 px-6 overflow-y-auto">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-2">
                                        {/* Item Image */}
                                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border bg-gray-50 flex-shrink-0">
                                            <Image
                                                src={item.image || "/placeholder.png"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="96px"
                                            />
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-headings line-clamp-1">{item.name}</h4>
                                                    <div className="text-sm text-muted-foreground mt-0.5 space-y-0.5">
                                                        <p>Size: {item.size}</p>
                                                        <p>Pack: {item.packSize}</p>
                                                        {item.isPremium && (
                                                            <span className="inline-block bg-primary-accent/10 text-primary-accent text-[10px] px-1.5 py-0.5 rounded font-bold">
                                                                PREMIUM
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right ml-2">
                                                    <p className="font-bold text-headings">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                    {item.quantity > 1 && (
                                                        <p className="text-xs text-muted-foreground">₹{item.price.toFixed(2)} each</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quantity & Actions */}
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center border rounded-lg bg-white overflow-hidden shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-2 py-1.5 hover:bg-gray-50 text-muted-foreground hover:text-headings transition-colors"
                                                    >
                                                        <Minus className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-2 py-1.5 hover:bg-gray-50 text-muted-foreground hover:text-headings transition-colors"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 transition-colors flex items-center gap-1 text-xs font-medium"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer (Subtotal & Checkout) */}
                        <div className="pt-6 pb-2 border-t mt-auto">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-semibold text-headings text-lg">Subtotal</span>
                                <span className="font-bold text-headings text-xl">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground text-center mb-4">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <Button className="w-full py-6 text-lg hover:shadow-md transition-shadow" asChild>
                                <Link href="/cart" onClick={() => setIsOpen(false)}>
                                    Proceed to Checkout
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
