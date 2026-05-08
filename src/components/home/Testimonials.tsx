"use client";

import { Star, Quote } from "lucide-react";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Srinivas Rao",
      location: "Hyderabad, Telangana",
      rating: 5,
      text: "These plates are very good. They are strong and do not leak when we eat. I like that they are natural and safe for the environment. Will buy again.",
    },
    {
      name: "Lakshmi Reddy",
      location: "Vijayawada, AP",
      rating: 5,
      text: "Ee platelu chala bagunnayi. Subhakaryalaku vadataniki chala anuvuga unnayi. Paryavarananiki kuda manchivi kabatti andaru vadochu.",
    },
    {
      name: "Pradeep Varma",
      location: "Visakhapatnam, AP",
      rating: 5,
      text: "Very happy with this purchase. The leaf plates look nice for parties and are easy to throw away after eating. Best choice for big family dinners.",
    },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center pb-4">
          <ScrollAnimation direction="up">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-headings mb-4">
              What Our Customers Say
            </h2>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.1}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made the switch to sustainable dining
            </p>
          </ScrollAnimation>
        </div>

        {/* Testimonials Grid/Carousel */}
        <div className="relative">
          <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-8 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {testimonials.map((testimonial, index) => (
              <ScrollAnimation key={testimonial.name} direction="up" delay={index * 0.1} className="min-w-[85vw] md:min-w-0 snap-center first:pl-4 last:pr-4 md:first:pl-0 md:last:pr-0 h-full">
                <div
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-accent/10 group h-full flex flex-col"
                >
                  {/* Quote Icon */}
                  <div className="mb-6 relative">
                    <Quote className="h-10 w-10 text-primary-accent/20 group-hover:text-primary-accent/40 transition-colors" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-grow italic">
                    &quot;{testimonial.text}&quot;
                  </p>

                  {/* Author */}
                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <div className="font-heading text-xl font-semibold text-headings group-hover:text-primary-accent transition-colors">
                      {testimonial.name}
                    </div> 
                    <div className="text-xs md:text-sm text-muted-foreground mt-0.5">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>

          {/* Mobile Scroll Indicator Hint */}
          <div className="flex justify-center gap-2 mt-4 md:hidden">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-primary-accent/20"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
