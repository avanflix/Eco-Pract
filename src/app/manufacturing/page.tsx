import Link from "next/link";
import Image from "next/image";
import { Factory, Users, Cog, CheckCircle, ArrowRight, MapPin, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Manufacturing = () => {
  const processSteps = [
    {
      step: 1,
      title: "Sustainable Sourcing",
      description: "We source bamboo and Palash and Sal leaves from certified sustainable farms and plantations, ensuring no deforestation and fair trade practices.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop&crop=center",
      icon: Factory,
      duration: "2-3 days"
    },
    {
      step: 2,
      title: "Artisan Processing",
      description: "Skilled craftsmen carefully process the raw materials using traditional techniques combined with modern quality control.",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=400&fit=crop&crop=center",
      icon: Users,
      duration: "1-2 weeks"
    },
    {
      step: 3,
      title: "Quality Testing",
      description: "Every product undergoes rigorous testing for food safety, durability, and environmental impact before packaging.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=400&fit=crop&crop=center",
      icon: CheckCircle,
      duration: "3-5 days"
    },
    {
      step: 4,
      title: "Eco Packaging",
      description: "Products are packaged in fully biodegradable materials and prepared for carbon-neutral shipping worldwide.",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=400&fit=crop&crop=center",
      icon: Cog,
      duration: "1-2 days"
    }
  ];

  const facilities = [
    {
      name: "Main Manufacturing Facility",
      location: "Coimbatore, Tamil Nadu",
      capacity: "50,000 units/month",
      features: ["Solar-powered", "Water recycling", "Zero waste"],
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center"
    },
    {
      name: "Quality Control Lab",
      location: "Coimbatore, Tamil Nadu",
      capacity: "24/7 testing",
      features: ["Food safety certified", "Environmental monitoring", "R&D center"],
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&crop=center"
    },
    {
      name: "Sustainable Packaging Unit",
      location: "Pollachi, Tamil Nadu",
      capacity: "100,000 packages/month",
      features: ["Biodegradable materials", "Compostable", "Carbon neutral"],
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop&crop=center"
    }
  ];

  const qualityStandards = [
    {
      title: "Food Safety",
      description: "All products meet international food safety standards including FDA and EU regulations",
      icon: Award,
      certifications: ["FSSAI", "FDA Approved", "EU Food Safe"]
    },
    {
      title: "Environmental Standards",
      description: "Zero harmful chemicals, fully biodegradable, and carbon-neutral manufacturing",
      icon: CheckCircle,
      certifications: ["FSC Certified", "ISO 14001", "Carbon Neutral"]
    },
    {
      title: "Quality Assurance",
      description: "Rigorous testing ensures durability, functionality, and consistent quality",
      icon: Factory,
      certifications: ["ISO 9001", "CE Marked", "BIS Certified"]
    }
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero & Process Timeline */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-headings mb-6">
              From Forest to Table
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-12">
              Discover our state-of-the-art manufacturing process that combines traditional craftsmanship
              with modern sustainability standards.
            </p>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-headings mb-4">
              Our Manufacturing Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A transparent journey from sustainable sourcing to your table, ensuring quality at every step.
            </p>
          </div>

          <div className="space-y-12">
            {processSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Step Number & Icon */}
                  <div className="shrink-0">
                    <div className="relative">
                      <div className="w-16 h-16 bg-primary-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {step.step}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-card-accent rounded-full flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary-accent" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <h3 className="text-2xl font-heading font-semibold text-headings mb-3">
                              {step.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              {step.description}
                            </p>
                            <Badge variant="outline" className="text-primary-accent border-primary-accent">
                              Duration: {step.duration}
                            </Badge>
                          </div>
                          <div className="lg:w-64">
                            <div className="aspect-5/4 relative rounded-lg overflow-hidden">
                              <Image
                                src={step.image}
                                alt={step.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 256px"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-alt-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-headings mb-4">
              Our Facilities
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern manufacturing facilities designed with sustainability and efficiency in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facilities.map((facility) => (
              <Card key={facility.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-4/3 relative">
                  <Image
                    src={facility.image}
                    alt={facility.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary-accent text-primary-foreground">
                      {facility.capacity}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-heading font-semibold text-headings">
                      {facility.name}
                    </h3>
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
                  </div>
                  <p className="text-primary-accent font-medium mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {facility.location}
                  </p>
                  <div>
                    <h4 className="font-medium text-headings mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {facility.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-headings mb-4">
              Quality & Compliance
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We maintain the highest standards across all aspects of our manufacturing process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {qualityStandards.map((standard) => {
              const Icon = standard.icon;
              return (
                <Card key={standard.title} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-accent/10 rounded-full mb-4">
                      <Icon className="h-8 w-8 text-primary-accent" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-headings mb-3">
                      {standard.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {standard.description}
                    </p>
                    <div className="space-y-2">
                      {standard.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Factory Tour CTA */}
      <section className="py-16 bg-primary-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Experience Our Facilities
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Schedule a virtual or in-person tour to see our sustainable manufacturing process
              and meet the artisans behind our products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">
                  Schedule a Tour
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-accent">
                <Link href="/sustainability">
                  Learn About Materials
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-accent mb-2">99.8%</div>
              <div className="text-sm text-muted-foreground">Quality Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-accent mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Units/Month Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-accent mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Quality Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-accent mb-2">0%</div>
              <div className="text-sm text-muted-foreground">Waste to Landfill</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Manufacturing;
