"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import { Skeleton } from "@/components/ui/skeleton";
import { products as defaultProductsData } from "@/data/products";

type Variant = {
  size: string;
  price: number;
  mrp?: number;
};

type Product = {
  _id: string;
  title: string;
  images?: string[];
  description?: string;
  hasPremium?: boolean;
  variants?: Variant[];
  packSize?: number;
};

const ProductSkeleton = () => (
  <div className="bg-white border border-border rounded-2xl p-3 shadow-sm flex flex-col h-full min-h-60">
    <div className="flex flex-row gap-4 md:gap-5 h-full">
      <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-xl shrink-0" />
      <div className="flex flex-col grow py-1">
        <Skeleton className="h-6 md:h-7 w-full mb-3" />
        <div className="space-y-2 mb-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-1/3" />
        </div>
        <div className="space-y-2 mt-auto mb-4 hidden sm:block">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
        <Skeleton className="h-9 w-full rounded-lg mt-auto" />
      </div>
    </div>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapVariant = (v: any): Variant => ({
  size: v.attributes?.size || v.attributes?.type || v.attributes?.pack || "Standard",
  price: v.price,
  mrp: v.originalPrice,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformProduct = (p: any): Product => ({
  _id: p.id,
  title: p.name,
  images: p.images,
  hasPremium: false,
  variants: p.variants?.map(mapVariant) || [],
});

const getFallbackProducts = (): Product[] =>
  defaultProductsData.map(transformProduct);

const BestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products?limit=8");

        if (!res.ok) {
          setProducts(getFallbackProducts());
          return;
        }

        const data = await res.json();

        if (data?.products?.length) {
          setProducts(data.products);
        } else {
          setProducts(getFallbackProducts());
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts(getFallbackProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  let content;

  if (loading) {
    content = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  } else if (products.length === 0) {
    content = (
      <div className="text-center py-24 bg-white/50 rounded-3xl border border-dashed border-border">
        <p className="text-xl text-muted-foreground">
          No products available yet.
        </p>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {products.map((product, index) => {
          const variants = product.variants || [];
          const hasVariants = variants.length > 0;

          const minPrice = hasVariants
            ? Math.min(...variants.map((v) => v.price))
            : 0;

          const minMrp = hasVariants
            ? Math.min(...variants.map((v) => v.mrp ?? Infinity))
            : Infinity;

          const displayMrp =
            minMrp !== Infinity && minMrp > minPrice ? minMrp : null;

          const packCount = product.packSize ?? 1;

          const totalMinPrice = minPrice * packCount;
          const totalDisplayMrp = displayMrp ? displayMrp * packCount : null;

          return (
            <ScrollAnimation
              key={product._id}
              direction="up"
              delay={index * 0.1}
              duration={0.6}
              distance={60}
              className="h-full"
            >
              <Link
                href={`/product/${product._id}`}
                className="bg-white border border-border rounded-2xl p-2 shadow-sm hover:shadow-lg hover:border-primary-accent/30 transition-all duration-300 group hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="flex flex-row gap-4 md:gap-6 h-full">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 relative overflow-hidden rounded-xl bg-card-accent shrink-0">
                    <Image
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-col grow min-w-0 py-1">
                    <h3 className="text-base sm:text-lg md:text-2xl font-heading font-bold text-headings mb-2 group-hover:text-primary-accent transition-colors line-clamp-2">
                      {product.title}
                    </h3>

                    <div className="mb-4">
                      {totalDisplayMrp && (
                        <span className="text-sm text-muted-foreground line-through block">
                          ₹{totalDisplayMrp.toFixed(2)}
                        </span>
                      )}

                      <div className="flex flex-col">
                        <span className="text-2xl sm:text-3xl font-bold text-primary-accent">
                          ₹{totalMinPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground mt-0.5">
                          (pack of {packCount})
                        </span>
                      </div>
                    </div>

                    <p 
                      className="text-xs text-muted-foreground hidden sm:block mb-4 leading-relaxed"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {product.description ||
                        "100% natural, compostable and eco-friendly tableware."}
                    </p>

                    <div className="mt-auto pt-2">
                      <Button className="w-full bg-primary-accent hover:bg-primary-accent/90 text-white rounded-lg h-8 md:h-9 text-xs md:text-sm">
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollAnimation>
          );
        })}
      </div>
    );
  }

  return (
    <section className="py-4 grass-frame" id="products">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <ScrollAnimation direction="up" duration={0.8} distance={80}>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-headings mb-4">
              Our Products
            </h2>
          </ScrollAnimation>
        </div>

        <div>{content}</div>
      </div>
    </section>
  );
};

export default BestSellers;
