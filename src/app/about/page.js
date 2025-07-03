"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Award,
  Heart,
  Clock,
  Leaf,
  Shield,
  Star,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold gradient-text">Tang Mow</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 page-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Our <span className="gradient-text">Story</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up delay-200">
              For over three decades, Tang Mow has been setting the standard for
              luxury hospitality, creating unforgettable experiences for guests
              from around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                A Legacy of Excellence
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Founded in 1990, Tang Mow began as a vision to create a
                sanctuary where luxury meets comfort. Our founder, inspired by
                the grand hotels of Europe, set out to establish a destination
                that would become synonymous with exceptional service and
                timeless elegance.
              </p>
              <p className="text-gray-600 text-lg mb-6">
                Today, we continue to honor that vision while embracing modern
                innovations and sustainable practices. Our commitment to
                excellence has earned us recognition as one of the premier
                luxury hotels in the region.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Award Winning
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">
                    5-Star Service
                  </span>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <Image
                src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
                alt="Tang Mow Historic Photo"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-200">
              These core principles guide everything we do, from the way we
              welcome guests to how we care for our community and environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Exceptional Service",
                description:
                  "We anticipate needs and exceed expectations with genuine care and attention to detail.",
              },
              {
                icon: Users,
                title: "Community",
                description:
                  "We believe in building lasting relationships with our guests, staff, and local community.",
              },
              {
                icon: Leaf,
                title: "Sustainability",
                description:
                  "We're committed to environmental responsibility and sustainable practices.",
              },
              {
                icon: Shield,
                title: "Integrity",
                description:
                  "We conduct business with honesty, transparency, and ethical standards.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-xl hover-lift animate-fade-in-up delay-${
                  (index + 1) * 200
                }`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <value.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "30+", label: "Years of Excellence" },
              { number: "10K+", label: "Happy Guests" },
              { number: "150+", label: "Luxury Rooms" },
              { number: "50+", label: "Award Recognitions" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`animate-scale-in delay-${index * 100}`}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-orange-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our experienced team brings decades of hospitality expertise and a
              passion for creating exceptional experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "General Manager",
                image:
                  "https://images.unsplash.com/photo-1494790108755-2616b612b17c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
                description:
                  "With 20 years in luxury hospitality, Sarah leads our team with passion and dedication.",
              },
              {
                name: "Michael Chen",
                role: "Executive Chef",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
                description:
                  "Michelin-starred chef bringing innovative culinary experiences to our guests.",
              },
              {
                name: "Emily Rodriguez",
                role: "Guest Relations Director",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                description:
                  "Emily ensures every guest feels welcomed and valued throughout their stay.",
              },
            ].map((member, index) => (
              <div
                key={index}
                className={`text-center hover-lift animate-fade-in-up delay-${
                  (index + 1) * 200
                }`}
              >
                <div className="relative mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="rounded-full mx-auto shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-orange-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Experience the Tang Mow Difference
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Join thousands of satisfied guests who have made Tang Mow their home
            away from home.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105"
          >
            Book Your Stay Today
          </Link>
        </div>
      </section>
    </div>
  );
}
