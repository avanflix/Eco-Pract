"use client";

import Link from "next/link";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ArrowRight, Utensils, Circle, Square, Package } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

const ProductCategories = () => {
  const categories = [
    {
      name: "Plates",
      description: "Premium Palash and Sal leaf plates",
      icon: Circle,
      href: "/#products",
      image: "https://pub-90128cc82748409abc1429b2f1594649.r2.dev/ecodosth/products/1774508586786-break_fast_plate_9_inches.jpeg",
      color: "bg-green-50",
    },
    {
      name: "Bowls",
      description: "Sustainable bowls for every meal",
      icon: Circle,
      href: "/#products",
      image: "https://pub-90128cc82748409abc1429b2f1594649.r2.dev/ecodosth/products/1774510866149-snack_bowl_6_inch.jpeg",
      color: "bg-green-50",
    },
    {
      name: "Trays",
      description: "Eco-friendly wooden Trays",
      icon: Utensils,
      href: "/#products",
      image: "https://pub-90128cc82748409abc1429b2f1594649.r2.dev/ecodosth/products/1774510989370-idly_plate_1_.jpeg",
      color: "bg-green-50",
    },
    // {
    //   name: "Combo Packs",
    //   description: "Value packs for events and parties",
    //   icon: Package,
    //   href: "/#products",
    //   image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop&crop=center",
    //   color: "bg-stone-50",
    // },
  ];

  return (
    <section className="hidden md:block py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <ScrollAnimation direction="up">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-headings mb-4">
              Our Collections
            </h2>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.1}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our range of sustainable tableware, crafted from nature&apos;s finest materials
            </p>
          </ScrollAnimation>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.slice(0, 3).map((category, index) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const Icon = category.icon;
            return (
              <ScrollAnimation key={category.name} direction="up" delay={index * 0.1}>
                <Link
                  href={category.href}
                  className="group block"
                >
                  {/* Image */}
                  <div className="mx-auto w-55 h-55 relative overflow-hidden rounded-full bg-gray-100 mb-4 shadow-sm border-4 border-white group-hover:border-primary-accent/20 transition-all duration-300">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-heading font-medium text-headings mb-2 group-hover:text-primary-accent transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </ScrollAnimation>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <ScrollAnimation direction="up" delay={0.4}>
            <Button
              asChild
              size="lg"
              className="bg-primary-accent hover:bg-primary-accent/90 text-primary-foreground font-medium px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link href="/#products" className="inline-flex items-center space-x-2">
                <span>View All Products</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
