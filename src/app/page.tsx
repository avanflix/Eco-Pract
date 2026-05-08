"use client";
import BestSellers from "@/components/home/BestSellers";
import Testimonials from "@/components/home/Testimonials";
import GlobalShipping from "@/components/home/GlobalShipping";
import DualCTA from "@/components/home/DualCTA";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <BestSellers />
      <DualCTA />
      <GlobalShipping />
      <Testimonials />
    </div>
  );
}
