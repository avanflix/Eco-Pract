import Link from "next/link";
import Image from "next/image";
import { Users, Award, Heart, TreePine, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Former environmental engineer with 15+ years in sustainable manufacturing."
    },
    {
      name: "Priya Sharma",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      bio: "Award-winning designer specializing in eco-friendly product development."
    },
    {
      name: "Amit Patel",
      role: "Operations Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Supply chain expert ensuring ethical and sustainable sourcing practices."
    }
  ];

  const milestones = [
    { year: "2018", title: "Founded EcoForever", description: "Started with a vision to replace plastic tableware" },
    { year: "2019", title: "First Product Launch", description: "Introduced bamboo cutlery line to market" },
    { year: "2020", title: "Sustainable Certification", description: "Achieved FSC certification for all products" },
    { year: "2021", title: "100,000 Products Sold", description: "Reached major milestone in eco-conscious consumers" },
    { year: "2022", title: "International Expansion", description: "Began exporting to 15+ countries worldwide" },
    { year: "2023", title: "Zero Waste Achievement", description: "Implemented 100% biodegradable packaging" }
  ];

  const values = [
    {
      icon: TreePine,
      title: "Environmental Stewardship",
      description: "Every product we create contributes to reducing plastic waste and protecting our planet."
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "We work directly with local artisans and communities, creating sustainable livelihoods."
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "Our products meet the highest standards of durability, safety, and aesthetic appeal."
    },
    {
      icon: Heart,
      title: "Customer Centric",
      description: "We put our customers first, ensuring satisfaction and building lasting relationships."
    }
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-headings mb-6">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              From a simple idea to transform dining culture, we&apos;ve grown into a movement
              for sustainable tableware that serves both people and planet.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-headings mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                To replace single-use plastic tableware with beautiful, durable, and completely
                biodegradable alternatives that don&apos;t compromise on quality or convenience.
                We&apos;re not just selling products; we&apos;re building a sustainable future, one meal at a time.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-6 bg-alt-bg rounded-2xl">
                  <div className="text-3xl font-bold text-primary-accent mb-2">500K+</div>
                  <div className="text-sm text-muted-foreground">Products Sold</div>
                </div>
                <div className="text-center p-6 bg-alt-bg rounded-2xl">
                  <div className="text-3xl font-bold text-primary-accent mb-2">25+</div>
                  <div className="text-sm text-muted-foreground">Countries Served</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-card-accent rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=600&fit=crop&crop=center"
                  alt="Artisan crafting sustainable tableware"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-alt-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-headings mb-4">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from product design to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-accent/10 rounded-full mb-4 mx-auto">
                      <Icon className="h-8 w-8 text-primary-accent" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-headings mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-headings mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Key milestones that have shaped our path to sustainable dining.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-border"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'pr-8 md:pr-12' : 'pl-8 md:pl-12'}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-primary-accent mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-heading font-semibold text-headings mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-accent rounded-full border-4 border-white shadow"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-alt-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-headings mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate individuals dedicated to creating a sustainable future through innovative design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <Card key={member.name} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-headings mb-1">
                    {member.name}
                  </h3>
                  <div className="text-primary-accent font-medium mb-3">
                    {member.role}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="p-8 md:p-12">
            <CardContent className="p-0">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-headings mb-4">
                Join Our Mission
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Every purchase contributes to our vision of a plastic-free dining experience.
                Be part of the change and make a difference with every meal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/#products">
                    Shop Our Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">
                    Get In Touch
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
