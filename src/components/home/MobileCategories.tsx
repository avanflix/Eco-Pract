"use client";

import Link from "next/link";
import Image from "next/image";
 
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Utensils, Circle, Square, Package } from "lucide-react";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

const MobileCategories = () => {
    const categories = [
        {
            name: "Plates",
            href: "/#products",
            image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&h=200&fit=crop&crop=center",
        },
        {
            name: "Bowls",
            href: "/#products",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center",
        },
        {
            name: "Trays",
            href: "/#products",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center",
        },
        // {
        //     name: "Combo Packs",
        //     href: "/#products",
        //     image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=200&h=200&fit=crop&crop=center",
        // },
    ];

    return (
        <div className="md:hidden bg-white py-2 border-b border-border sticky  z-40 bg-opacity-95 backdrop-blur">
            {/* sticky top-16 to sit below navbar which is h-16. Adjust if navbar height changes */}
            <div className="flex overflow-x-auto px-4 gap-6 no-scrollbar pb-2">
                {categories.map((category, index) => (
                    <ScrollAnimation key={category.name} direction="up" delay={index * 0.1} className="shrink-0">
                        <Link
                            href={category.href}
                            className="flex flex-col items-center w-20 space-y-2 group"
                        >
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary-accent/10 group-hover:border-primary-accent transition-colors">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </div>
                            <span className="text-xs font-medium text-headings text-center leading-tight">
                                {category.name}
                            </span>
                        </Link>
                    </ScrollAnimation>
                ))}
            </div>
        </div>
    );
};

export default MobileCategories;
