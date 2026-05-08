"use client";

import Link from "next/link";
import { ShoppingBag, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

const DualCTA = () => {
  return (
    <section className="py-10 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center overflow-hidden p-2">
          {/* Shop CTA */}
          <ScrollAnimation direction="left" delay={0.2} className="h-full">
            <div className="text-center md:text-left bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-primary-accent/10 group h-full flex flex-col justify-center items-center md:items-start">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-accent/10 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="h-8 w-8 text-primary-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-headings mb-4">
                Start Your Sustainable Journey
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
                Browse our collection of premium wooden, bamboo, and Palash and Sal tableware.
                Quality craftsmanship meets environmental responsibility.
              </p>
              <div className="mt-auto w-full md:w-auto">
                <Button asChild size="lg" className="bg-primary-accent text-white hover:bg-primary-accent/90 w-full md:w-auto shadow-md hover:shadow-lg transition-all transform active:scale-95">
                  <Link href="/#products">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollAnimation>

          {/* Bulk CTA */}
          <ScrollAnimation direction="right" delay={0.2} className="h-full">
            <div className="text-center md:text-left bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-primary-accent/10 group h-full flex flex-col justify-center items-center md:items-start">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-accent/10 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <Package className="h-8 w-8 text-primary-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-headings mb-4">
                Bulk Orders for Businesses
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
                Perfect for restaurants, hotels, and eco-conscious businesses.
                Custom packaging and competitive wholesale pricing.
              </p>
              <div className="mt-auto w-full md:w-auto">
                <Button asChild size="lg" variant="outline" className="border-primary-accent text-primary-accent hover:bg-primary-accent hover:text-white w-full md:w-auto shadow-sm hover:shadow-md transition-all transform active:scale-95">
                  <Link href="/contact?type=bulk">
                    Get Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default DualCTA;
