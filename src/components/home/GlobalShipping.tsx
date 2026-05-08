"use client";

import { Truck } from "lucide-react";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

const GlobalShipping = () => {
  

  return (
    <section className="py-10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        

        <ScrollAnimation direction="up" delay={0.4}>
          <div className="relative bg-primary-accent rounded-[3rem] p-8 md:p-16 overflow-hidden shadow-2xl">
            {/* Background Decorative Pattern */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-15deg] translate-x-1/4" />
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto ">
              <h3 className="text-3xl flex justify-center items-center gap-6 md:text-5xl font-heading font-bold text-white py-6">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center text-white ">
                  <Truck className="h-8 w-8" />
                </div>
                Eco-Friendly Packaging
              </h3>
              <p className="text-white/80 text-lg md:text-xl leading-relaxed">
                We are committed to delivering our sustainable products to you with the lowest possible environmental impact. All our shipments use eco-friendly packaging materials and partner with carbon-offset delivery networks. From our manufacturing facility to your doorstep, every order contributes to a cleaner planet. We offer free shipping on all orders above ₹500, ensuring that choosing sustainable alternatives is both affordable and convenient.
              </p>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default GlobalShipping;
