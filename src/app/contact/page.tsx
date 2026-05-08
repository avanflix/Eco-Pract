"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent successfully! We will get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "info@ecoforever.co.in",
      action: "mailto:info@ecoforever.co.in"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our customer service team",
      contact: "+91 7036777677",
      action: "tel:+917036777677"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Quick responses and product inquiries",
      contact: "+91 7036777677",
      action: "https://wa.me/917036777677"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Schedule an office visit",
      contact: "Villa No : 178, Chitrapuri Row House Rd, Chitrapuri Colony, Hyderabad",
      action: "#"
    }
  ];


  const faqs = [
    { q: "Are your products truly biodegradable?", a: "Yes, all our products are made from natural materials and fully decompose within 90-180 days in composting conditions. We have third-party certifications to verify this." },
    { q: "Do you offer bulk pricing for events?", a: "Absolutely! We offer special pricing for bulk orders, weddings, corporate events, and restaurants. Contact us for customized quotes based on your specific needs." },
    { q: "What's your shipping policy?", a: "We offer free shipping on orders over ₹500 within India. International shipping is available with carbon-neutral options. All packages use eco-friendly materials." }
  ];

  return (
    <div className="min-h-screen w-[85%] mx-auto bg-bg">
      {/* Hero & Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-headings mb-6">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-12">
              Have questions about our products or want to learn more about sustainable dining?
              We're here to help and love hearing from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-heading font-bold text-headings mb-6">
                  Send Us a Message
                </h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-headings mb-2">
                      Name *
                    </label>
                    <Input 
                      placeholder="John Doe" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-headings mb-2">
                        Email Address *
                      </label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-headings mb-2">
                        Phone Number
                      </label>
                      <Input 
                        type="tel" 
                        placeholder="+91 7036777677" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-headings mb-2">
                      Subject *
                    </label>
                    <Select 
                      required 
                      value={formData.subject}
                      onValueChange={(val) => setFormData({...formData, subject: val})}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="products">Product Information</SelectItem>
                        <SelectItem value="bulk">Bulk Orders</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                        <SelectItem value="support">Customer Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-headings mb-2">
                      Message *
                    </label>
                    <Textarea
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5 mr-2" />
                    )}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Sidebar info */}
            <div className="space-y-8">
              
              {/* Contact Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-semibold text-headings mb-6">
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    {contactMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <div key={method.title} className="flex items-start">
                          <div className="shrink-0 p-3 bg-primary-accent/10 rounded-xl mr-4">
                            <Icon className="h-6 w-6 text-primary-accent" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-headings">{method.title}</h4>
                            {method.action !== "#" ? (
                              <a href={method.action} className="text-primary-accent hover:underline mt-1 block">
                                {method.contact}
                              </a>
                            ) : (
                              <span className="text-muted-foreground mt-1 block text-sm">
                                {method.contact}
                              </span>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">
                              {method.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-alt-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-headings mb-4">
              Visit Our Location
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our facilities combine traditional craftsmanship with modern sustainable practices.
            </p>
          </div>

          <Card className=" h-100 relative overflow-hidden border-0 p-0">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.9319499093863!2d78.37897889999999!3d17.415053099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb95aecaf120e9%3A0x85d7307a839bcd1a!2sAvanflix%20Studio!5e0!3m2!1sen!2sin!4v1775478742133!5m2!1sen!2sin" 
              className="absolute inset-0 w-full h-full" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-headings mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Quick answers to common questions about our products and services.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-heading font-semibold text-lg text-headings hover:text-primary-accent transition-colors">
                  {faq.q}
                  <span className="transition-transform duration-300 group-open:rotate-180 text-muted-foreground group-hover:text-primary-accent">
                    <ChevronDown className="h-5 w-5" />
                  </span>
                </summary>
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;