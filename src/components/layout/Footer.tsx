"use client";

import Link from "next/link";
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-headings text-white border-t border-border pt-8 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">

          {/* Column 1: About Us */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-3xl">
              {/* <Leaf className="h-10 w-10 text-white" /> */}
              <span className="text-3xl font-heading font-semibold text-white ">
                EcoForever
              </span>
            </Link>
            <p className="text-white/80 text-base leading-relaxed max-w-xs">
              Crafting sustainable tableware from nature&apos;s finest materials.
              Join us in our journey towards a plastic-free world, one meal at a time.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-white/80 hover:text-primary-accent transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-white/80 hover:text-primary-accent transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-white/80 hover:text-primary-accent transition-colors" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Wrapper for Mobile Row */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full md:w-auto md:flex md:gap-12">
            {/* Column 2: Categories */}
            <div>
              <h3 className="font-heading font-semibold text-white text-xl sm:text-2xl md:text-3xl mb-4 md:mb-6">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/#products" className="text-white/80 hover:text-primary-accent transition-colors text-xs sm:text-sm md:text-base">
                    Wooden Cutlery
                  </Link>
                </li>
                <li>
                  <Link href="/#products" className="text-white/80 hover:text-primary-accent transition-colors text-xs sm:text-sm md:text-base">
                    Plates & Bowls
                  </Link>
                </li>
                <li>
                  <Link href="/#products" className="text-white/80 hover:text-primary-accent transition-colors text-xs sm:text-sm md:text-base">
                    Eco Packaging
                  </Link>
                </li>
                <li>
                  <Link href="/contact?type=bulk" className="text-white/80 hover:text-primary-accent transition-colors text-xs sm:text-sm md:text-base">
                    Bulk Orders
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Us */}
            <div>
              <h3 className="font-heading font-semibold text-white text-xl sm:text-2xl md:text-3xl mb-4 md:mb-6">Contact Us</h3>
              <ul className="space-y-3 md:space-y-4">
                <li className="flex items-start space-x-2 md:space-x-3">
                  <Phone className="h-4 w-4 md:h-5 md:w-5 text-white/80 shrink-0 mt-0.5 md:mt-1" />
                  <span className="text-white/80 text-xs sm:text-sm md:text-base">+91 7036777677</span>
                </li>
                <li className="flex items-start space-x-2 md:space-x-3">
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-white/80 shrink-0 mt-0.5 md:mt-1" />
                  <span className="text-white/80 text-xs sm:text-sm md:text-base break-words">info@ecoforever.co.in</span>
                </li>
                <li className="flex items-start space-x-2 md:space-x-3">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-white/80 shrink-0 mt-0.5 md:mt-1" />
                  <span className="text-white/80 text-xs sm:text-sm md:text-base">
                    Villa No : 178,<br /> Chitrapuri Row House Rd,<br /> Chitrapuri Colony,<br />
                    Hyderabad, Telangana 500104
                  </span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center bg-[var(--color-heading)]">
          <p className="text-xs text-white/60">
            © {currentYear} EcoForever. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/60 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
