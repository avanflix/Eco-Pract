"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "/hero/Plate1.png",
    title: "Plates starting from ₹6",
    subtitle: "Premium Palash and Sal leaf plates for every occasion",
    cta: "Shop Plates",
    link: "/#products",
  },
  {
    id: 2,
    image: "/hero/Bowls1.png",
    title: "Bowls starting from ₹1.5",
    subtitle: "100% natural, plastic-free bowls made from fallen leaves",
    cta: "Shop Bowls",
    link: "/#products",
  },
  {
    id: 3,
    image: "/hero/all.png",
    title: "Inaugural Offer",
    subtitle: "Flat 10% off on orders above ₹1000",
    cta: "Shop Now",
    link: "/#products",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative h-[35vh] w-full overflow-hidden group">
      {/* Slides */}
      <AnimatePresence>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl text-left">
                <ScrollAnimation direction="up" delay={0.2}>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                    {slides[currentSlide].title}
                  </h1>
                </ScrollAnimation>
                <ScrollAnimation direction="up" delay={0.4}>
                  <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md">
                    {slides[currentSlide].subtitle}
                  </p>
                </ScrollAnimation>
                <ScrollAnimation direction="up" delay={0.6}>
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary-accent hover:bg-primary-accent/90 text-primary-foreground text-lg px-8 py-6 rounded-full shadow-xl transition-transform hover:scale-105"
                  >
                    <Link href={slides[currentSlide].link}>
                      {slides[currentSlide].cta} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </ScrollAnimation>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
