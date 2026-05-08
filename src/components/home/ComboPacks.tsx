"use client";

import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ComboPackSkeleton = () => (
    <div className="relative overflow-hidden rounded-3xl h-[400px] md:h-[500px] shadow-lg border border-gray-100 bg-white p-8 flex flex-col justify-end">
        <Skeleton className="absolute inset-0" />
        <div className="relative z-10 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4 rounded-full" />
            <div className="space-y-2 hidden md:block">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="flex flex-row items-center gap-4 mt-6 pt-6 border-t border-gray-100">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-10 w-1/3 ml-auto rounded-lg" />
            </div>
        </div>
    </div>
);

const defaultComboPacks = [
    {
        _id: "default-combo-1",
        title: "Normal Combo Pack",
        items: [
            { quantity: "1", name: "14'' inch Buffet Plate" },
            { quantity: "1", name: "15'' inch Sitting Plate" },
            { quantity: "1", name: "10'' Inch Breakfast Plate" },
            { quantity: "1", name: "14'' inch Meal Trays" },
            { quantity: "1", name: "4'' Inch Bowls" },
            { quantity: "1", name: "Spoons & Forks" }
        ],
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1974&auto=format&fit=crop",
        price: 499,
        mrp: 599,
        textPosition: "left",
    },
    {
        _id: "default-combo-2",
        title: "Premium Combo Pack",
        items: [
            { quantity: "1", name: "14'' inch Buffet Plate Premium" },
            { quantity: "1", name: "15'' inch Sitting Plate" },
            { quantity: "1", name: "10'' Inch Breakfast Plate" },
            { quantity: "1", name: "14'' Meal Trays (Slotted)" },
            { quantity: "1", name: "4'' Inch Bowls" },
            { quantity: "1", name: "Spoons & Forks" }
        ],
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop",
        price: 799,
        mrp: 999,
        textPosition: "right",
    },
];

const ComboPacks = () => {
    const addItem = useCartStore((state) => state.addItem);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [packs, setPacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPacks = async () => {
            try {
                const response = await fetch('/api/admin/combo-packs');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setPacks(data);
                    } else {
                        setPacks(defaultComboPacks);
                    }
                } else {
                    setPacks(defaultComboPacks);
                }
            } catch (error) {
                console.error("Failed to fetch combo packs:", error);
                setPacks(defaultComboPacks);
            } finally {
                setLoading(false);
            }
        };

        fetchPacks();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddToCart = (pack: any) => {
        const isPremium = pack.title?.toLowerCase().includes('premium');

        addItem({
            id: pack._id,
            productId: pack._id,
            name: pack.title,
            image: pack.image,
            price: pack.price,
            quantity: 1,
            packSize: "1 Combo Box",
            size: "Standard",
            isPremium: isPremium
        });
    };

    return (
        <section className="py-16 bg-white min-h-[600px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollAnimation direction="up">
                    <h2 className="text-4xl md:text-5xl text-center font-heading font-bold text-headings mb-12">
                        Value Combo Packs
                    </h2>
                </ScrollAnimation>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden p-2">
                    {loading ? (
                        <>
                            <ComboPackSkeleton />
                            <ComboPackSkeleton />
                        </>
                    ) : packs.length === 0 ? (
                        <div className="col-span-full text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <p className="text-xl text-muted-foreground">No combo packs available yet.</p>
                        </div>
                    ) : (
                        packs.map((pack, index) => (
                            <ScrollAnimation
                                key={pack._id}
                                direction={index % 2 === 0 ? "left" : "right"}
                                delay={0.2}
                                className="h-full"
                            >
                                <div
                                    className="relative overflow-hidden rounded-3xl h-[400px] md:h-[500px] shadow-lg group border border-gray-100"
                                >
                                    <Image
                                        src={pack.image}
                                        alt={pack.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    {/* Subtle Overlay to ensure text readability only on the text side */}
                                    <div
                                        className={`absolute inset-0 transition-opacity duration-300 bg-black/40 md:bg-transparent ${pack.textPosition === 'left'
                                            ? 'md:bg-gradient-to-r md:from-black/70 md:via-black/30 md:to-transparent'
                                            : 'md:bg-gradient-to-l md:from-black/70 md:via-black/30 md:to-transparent'
                                            }`}
                                    />

                                    <div className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white ${pack.textPosition === 'left' ? 'md:items-start' : 'md:items-end'} ${pack.textPosition === 'left' ? 'md:text-left' : 'md:text-right'}`}>
                                        <div className="max-w-full md:max-w-[85%] w-full">
                                            <div className="text-2xl md:text-3xl text-white font-bold mb-2">{pack.title}</div>
                                            {pack.title?.toLowerCase().includes('premium') && (
                                                <span className="bg-primary-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                                                    PREMIUM
                                                </span>
                                            )}

                                            <ul className={`space-y-1 md:space-y-1.5 mb-6 text-white/90 hidden md:block`}>
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                {pack.items?.map((item: any, idx: number) => (
                                                    <li key={idx} className="text-sm md:text-base flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-primary-accent" /> {item.quantity}x {item.name}
                                                    </li>
                                                ))}
                                            </ul>
                                            {/* Mobile list summary */}
                                            <p className="text-white/90 text-sm mb-4 md:hidden line-clamp-2">
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                Includes: {pack.items?.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}
                                            </p>

                                            <div className={`flex flex-row items-center gap-4 mt-6 pt-6 border-t border-white/20 w-full ${pack.textPosition === 'left' ? 'justify-start' : 'justify-end'}`}>
                                                <div className="text-2xl md:text-3xl font-bold text-white">
                                                    {pack.mrp && <span className="line-through text-white/70 text-lg mr-2">₹{pack.mrp}</span>}
                                                    ₹{pack.price}
                                                </div>
                                                <Button
                                                    onClick={() => handleAddToCart(pack)}
                                                    className="bg-primary-accent text-white hover:bg-primary-accent/90 font-semibold px-6 py-2 md:px-8 shadow-md transition-transform active:scale-95 text-sm md:text-base ml-auto"
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollAnimation>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ComboPacks;
