"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/useCartStore";

const Cart = () => {
  const { items: cartItems, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  const subtotal = getSubtotal();
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-headings mb-2">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-heading font-semibold text-headings mb-4">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <Button asChild size="lg">
                <Link href="/products">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-border last:border-0">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-card-accent shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-semibold text-headings mb-1">
                            {item.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-sm text-muted-foreground">Size: {item.size}</span>
                            {item.isPremium && (
                              <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold">
                                PREMIUM
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg font-bold text-headings">₹{item.price}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Button variant="outline" asChild>
                  <Link href="/#products">
                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-heading font-semibold text-headings mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-green-600" : ""}>
                        {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (GST 18%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Free Shipping Notice */}
                  {subtotal < 500 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Add ₹{500 - subtotal} more for free shipping!
                      </p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <Button className="w-full mt-6" size="lg" asChild>
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>

                  {/* Payment Methods */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">Secure payment with</p>
                    <div className="flex justify-center space-x-4 opacity-60">
                      <div className="text-xs font-medium">UPI</div>
                      <div className="text-xs font-medium">Cards</div>
                      <div className="text-xs font-medium">Net Banking</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Eco Impact */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-heading font-semibold text-headings mb-4">
                    Your Eco Impact
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Plastic Saved</span>
                      <span className="text-sm font-medium text-green-600">
                        {cartItems.length * 100}g
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Carbon Offset</span>
                      <span className="text-sm font-medium text-green-600">
                        {cartItems.length * 50}g CO₂
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Trees Preserved</span>
                      <span className="text-sm font-medium text-green-600">
                        {Math.round(cartItems.length * 0.1 * 10) / 10}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Every purchase contributes to a sustainable future
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
