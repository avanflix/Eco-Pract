"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Ban , ShoppingCart, Truck, Shield, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

const ProductDetail = () => {
  const params = useParams();
  const id = params?.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isPremiumSelected, setIsPremiumSelected] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentVariant, setCurrentVariant] = useState<any>(null);
  const [activeImages, setActiveImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  // Ref for the thumbnail container to handle auto-scrolling
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll thumbnails when currentImageIndex changes
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const activeElement = container.children[currentImageIndex] as HTMLElement;
      
      if (activeElement) {
        // Calculate position to scroll to (center the item if possible, or just bring into view)
        // For vertical scroll (desktop)
        if (window.innerWidth >= 768) {
           const scrollPos = activeElement.offsetTop - container.offsetTop - (container.clientHeight / 2) + (activeElement.clientHeight / 2);
           container.scrollTo({ top: scrollPos, behavior: 'smooth' });
        } else {
           // For horizontal scroll (mobile)
           const scrollPos = activeElement.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (activeElement.clientWidth / 2);
           container.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }
      }
    }
  }, [currentImageIndex]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);

        // Set initial defaults
        if (data.variants && data.variants.length > 0) {
          setSelectedSize(data.variants[0].size);
          setCurrentVariant(data.variants[0]);
        }
        setActiveImages(data.images || []);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Update current variant when size changes
  useEffect(() => {
    if (product && product.variants) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const variant = product.variants.find((v: any) => v.size === selectedSize);
      setCurrentVariant(variant || null);
    }
  }, [product, selectedSize]);

  // Update active images based on premium toggle
  useEffect(() => {
    if (product) {
      // Check if there are valid premium images (not just an empty array)
      const hasValidPremiumImages = product.premiumImages && 
                                    product.premiumImages.length > 0 && 
                                    product.premiumImages.some((img: string) => img && img.trim() !== "");

      if (isPremiumSelected && product.hasPremium && hasValidPremiumImages) {
        setActiveImages(product.premiumImages);
      } else {
        // Fallback to normal images, or a placeholder if those are missing too
        const fallbackImages = product.images && product.images.length > 0 
                               ? product.images 
                               : ["/placeholder.png"];
        setActiveImages(fallbackImages);
      }
      setCurrentImageIndex(0);
    }
  }, [isPremiumSelected, product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-accent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link href="/#products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const availableSizes = product.variants ? product.variants.map((v: any) => v.size) : [];

  // Calculate current price based on premium toggle
  let displayPrice = 0;
  let displayMrp = 0;
  let displayStock = 0;

  if (currentVariant) {
    if (isPremiumSelected) {
      displayPrice = currentVariant.premiumPrice || currentVariant.price;
      displayMrp = currentVariant.premiumMrp || currentVariant.mrp || 0;
      displayStock = currentVariant.premiumStock || 0;
    } else {
      displayPrice = currentVariant.price;
      displayMrp = currentVariant.mrp || 0;
      displayStock = currentVariant.stock;
    }
  }

  const handleAddToCart = () => {
    if (!product || !currentVariant) return;
    const itemId = `${product._id}-${currentVariant.size}-${isPremiumSelected ? 'premium' : 'standard'}`;
    addItem({
      id: itemId,
      productId: product._id,
      name: product.title,
      image: activeImages[0] || "/placeholder.png",
      price: totalPrice,
      quantity: quantity,
      packSize: product.packSize || "pack",
      size: currentVariant.size,
      isPremium: isPremiumSelected
    });
    setQuantity(1);
  };

  // Try to extract original pack size number for per-piece price calculation
  const packCount = product.packSize;
  const totalPrice = displayPrice * packCount;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === activeImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? activeImages.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary-accent">Home</Link>
          <span>/</span>
          <Link href="/#products" className="hover:text-primary-accent">Products</Link>
          <span>/</span>
          <span className="text-headings">{product.category}</span>
          <span>/</span>
          <span className="text-headings">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="flex flex-col md:flex-row gap-4 items-start h-fit lg:sticky lg:top-24">
            
            {/* Main Image */}
            <div className="flex-1 w-full aspect-square relative overflow-hidden rounded-2xl bg-card-accent border shadow-sm group shrink-0">
              <Image
                src={activeImages[currentImageIndex] || "/placeholder.png"}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {activeImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-headings p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-headings p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails (Row on Mobile, Column on Desktop) */}
            {activeImages.length > 1 && (
              <div 
                ref={thumbnailContainerRef}
                className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 md:w-24 w-full max-h-[500px] p-1 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
              >
                {activeImages.map((image, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "w-16 h-16 shrink-0 relative overflow-hidden rounded-lg bg-card-accent cursor-pointer border shadow-sm transition-all",
                      currentImageIndex === index ? "ring-2 ring-primary-accent border-transparent opacity-100" : "opacity-70 hover:opacity-100"
                    )}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 64px, 64px"
                    />
                  </div>
                ))}
              </div>
            )}
            
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-primary-accent text-primary-foreground">
                  100% Palash & Sal Leaf
                </Badge>
                {product.hasPremium && (
                  <Badge variant="outline" className="text-primary-accent border-primary-accent">
                    Premium Available
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-heading font-bold text-headings mb-4">
                {product.title}
              </h1>

              {/* Default Rating Placeholder */}
              {/* <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < 5 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-medium">5.0</span>
                </div>
                <span className="text-muted-foreground">
                  (12 reviews)
                </span>
              </div> */}

              {/* Price */}
              <div className="flex flex-col mb-6 bg-gray-50 p-4 border rounded-xl relative overflow-hidden">
                {isPremiumSelected && (
                  <div className="absolute top-0 right-0 bg-primary-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    PREMIUM
                  </div>
                )}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-3">
                    {displayMrp > displayPrice && (
                      <span className="text-xl line-through text-muted-foreground">
                        ₹{(displayMrp * packCount).toFixed(2)}
                      </span>
                    )}
                    <span className="text-3xl font-heading font-bold text-headings">
                      {currentVariant ? `₹${totalPrice.toFixed(2)}` : "..."} 
                    </span>
                    {displayMrp > displayPrice && (
                      <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                        Save {Math.round(((displayMrp - displayPrice) / displayMrp) * 100)}%
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">(pack of {packCount})</span>
                </div>

              </div>

              {/* Variant Selectors */}

              {/* Premium Toggle */}
              {product.hasPremium && (
                <div className="mb-6 border-b pb-6">
                  <span className="block text-sm font-medium text-headings mb-2">Select Variant Quality</span>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsPremiumSelected(false)}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center relative",
                        !isPremiumSelected
                          ? "bg-primary-accent/5 border-primary-accent"
                          : "bg-white border-border hover:border-primary-accent/50"
                      )}
                    >
                      <span className={cn("font-bold", !isPremiumSelected ? "text-primary-accent" : "text-headings")}>
                        Standard
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">High-quality eco friendly</span>
                      {!isPremiumSelected && (
                        <Check className="absolute top-2 right-2 w-4 h-4 text-primary-accent" />
                      )}
                    </button>
                    <button
                      onClick={() => setIsPremiumSelected(true)}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center relative",
                        isPremiumSelected
                          ? "bg-primary-accent/10 border-primary-accent"
                          : "bg-white border-border hover:border-primary-accent/50"
                      )}
                    >
                      <span className={cn("font-bold", isPremiumSelected ? "text-primary-accent" : "text-headings")}>
                        Premium
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">Sturdier, Strong base</span>
                      {isPremiumSelected && (
                        <Check className="absolute top-2 right-2 w-4 h-4 text-primary-accent" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {availableSizes.length > 0 && (
                <div className="mb-6">
                  <span className="block text-sm font-medium text-headings mb-2">Available Sizes</span>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((s: string) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={cn(
                          "px-4 py-2 rounded-lg border transition-all text-sm font-medium",
                          selectedSize === s
                            ? "bg-primary-accent text-white border-primary-accent"
                            : "bg-white text-body-text border-gray-200 hover:border-primary-accent/50"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-6">
                {displayStock > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-medium">In Stock</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-heading font-semibold text-headings mb-3">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {product.description}
                <br />
                <span className="text-muted-foreground">Eco-friendly packaging charges extra will be applied.</span>
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-row gap-4 pt-4 mt-2 items-stretch">
              {(() => {
                const itemId = product && currentVariant ? `${product._id}-${currentVariant.size}-${isPremiumSelected ? 'premium' : 'standard'}` : null;
                const isItemInCart = itemId ? cartItems.some(item => item.id === itemId) : false;

                if (isItemInCart) {
                  return (
                    <Button
                      asChild
                      className="flex-1 h-[56px] text-lg shadow-md bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <Link href="/cart">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Checkout
                      </Link>
                    </Button>
                  );
                }

                return (
                  <>
                    <div className="flex items-center border-2 border-border rounded-xl bg-white overflow-hidden h-[56px] shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="px-3 md:px-4 h-full flex items-center justify-center text-headings hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="text-2xl leading-none mt-[-2px]">-</span>
                      </button>
                      <span className="px-2 md:px-4 h-full flex items-center justify-center font-bold border-x-2 border-border min-w-[2.5rem] md:min-w-[3.5rem] text-center text-lg">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(q => q + 1)}
                        className="px-3 md:px-4 h-full flex items-center justify-center text-headings hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-2xl leading-none mt-[-2px]">+</span>
                      </button>
                    </div>

                    <Button
                      className="flex-1 h-[56px] text-base md:text-lg shadow-md"
                      size="lg"
                      disabled={!currentVariant || displayStock <= 0}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2 hidden md:block" />
                      {!currentVariant ? "Select Options" : displayStock <= 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </>
                );
              })()}
            </div>
          </div>

        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-4 pt-6">
              <div className="flex flex-col items-center text-center p-2 md:p-4 bg-gray-50 border rounded-xl">
                <Truck className="h-6 w-6 md:h-8 md:w-8 text-primary-accent mb-2" />
                <div>
                  <div className="font-medium text-headings text-xs md:text-sm">Free Shipping</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground mt-1 hidden md:block">Above ₹500 across India</div>
                </div>
              </div>
              <div className="flex flex-col items-center text-center p-2 md:p-4 bg-gray-50 border rounded-xl">
                <Shield className="h-6 w-6 md:h-8 md:w-8 text-primary-accent mb-2" />
                <div>
                  <div className="font-medium text-headings text-xs md:text-sm">Secure Pay</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground mt-1 hidden md:block">100% Protected</div>
                </div>
              </div>
              <div className="flex flex-col items-center text-center p-2 md:p-4 bg-gray-50 border rounded-xl">
                <Ban className="h-6 w-6 md:h-8 md:w-8 text-primary-accent mb-2" />
                <div>
                  <div className="font-medium text-headings text-xs md:text-sm">No Returns</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground mt-1 hidden md:block">No Return Policy</div>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
};

export default ProductDetail;