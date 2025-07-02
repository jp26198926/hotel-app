"use client";

import Link from "next/link";
import {
  Hotel,
  Calendar,
  Users,
  UtensilsCrossed,
  Star,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui";

export default function HomePage() {
  const features = [
    {
      icon: Hotel,
      title: "Room Management",
      description:
        "Efficiently manage room inventory, availability, and housekeeping status.",
    },
    {
      icon: Calendar,
      title: "Booking System",
      description:
        "Streamlined reservation system with real-time availability and automated confirmations.",
    },
    {
      icon: Users,
      title: "Guest Services",
      description:
        "Comprehensive guest profile management and personalized service tracking.",
    },
    {
      icon: UtensilsCrossed,
      title: "Restaurant Management",
      description:
        "Complete restaurant operations including table reservations and menu management.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with data encryption and regular backups.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock technical support and system monitoring.",
    },
  ];

  const stats = [
    { label: "Hotels Managed", value: "500+" },
    { label: "Rooms Booked", value: "1M+" },
    { label: "Happy Customers", value: "50K+" },
    { label: "Uptime", value: "99.9%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-teal-100/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 animate-fade-in-up">
              <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-2 rounded-xl shadow-lg">
                <Hotel className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">HotelMS</span>
            </div>
            <div className="flex items-center gap-4 animate-fade-in-up delay-200">
              <Link
                href="/login"
                className="text-gray-600 hover:text-teal-600 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-teal-50"
              >
                Sign In
              </Link>
              <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-breathe">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50/80 via-blue-50/60 to-emerald-50/80 py-24 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-teal-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-xl animate-gentle-pulse"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-gentle-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-300 to-green-300 rounded-full mix-blend-multiply filter blur-xl animate-gentle-pulse delay-500"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-teal-400/20 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-emerald-400/20 rounded-full animate-float delay-1000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-cyan-400/20 rounded-full animate-float delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8 animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Serene Hotel & Restaurant
                <span className="block gradient-text animate-fade-in-up delay-200">
                  Management Experience
                </span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-400">
              Transform your hospitality operations with our peaceful and
              intuitive management platform. Create unforgettable guest
              experiences while maintaining perfect operational harmony in a
              tranquil digital environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-600">
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 px-8 py-4 hover-lift"
              >
                <Link href="/dashboard" className="flex items-center gap-3">
                  Begin Your Journey <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 shadow-md hover:shadow-lg transition-all duration-300 px-8 py-4 hover-lift"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/60 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-50/30 to-emerald-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover-lift">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 soft-shadow hover:soft-shadow-lg transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50/30 to-teal-50/20 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(15, 118, 110, 0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 40% 80%, rgba(8, 145, 178, 0.1) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Everything You Need for
              <span className="block gradient-text">
                Harmonious Hotel Management
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our thoughtfully designed platform provides all the tools you need
              to create exceptional guest experiences while maintaining
              operational serenity and inner peace.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm p-8 rounded-2xl soft-shadow hover:soft-shadow-lg border border-teal-100/50 hover:border-teal-200/50 transition-all duration-500 hover-lift group animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-teal-100 to-emerald-100 p-4 rounded-xl group-hover:from-teal-200 group-hover:to-emerald-200 transition-all duration-300 shadow-sm">
                    <feature.icon className="h-7 w-7 text-teal-600 group-hover:text-emerald-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 ml-4 group-hover:gradient-text transition-all duration-300">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 relative overflow-hidden">
        {/* Enhanced background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full animate-gentle-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white rounded-full animate-gentle-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/30 rounded-full animate-gentle-pulse delay-500"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/40 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-float delay-1000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-white/20 rounded-full animate-float delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your Hotel into a
              <span className="block">Sanctuary of Excellence?</span>
            </h2>
          </div>
          <p className="text-xl text-teal-100 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Join thousands of hotels already using our platform to create
            unforgettable guest experiences while maintaining perfect
            operational harmony and inner peace.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-400">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-teal-700 hover:bg-gray-50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 px-8 py-4 hover-lift"
            >
              <Link href="/dashboard">Start Your Free Journey</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-teal-600 shadow-md hover:shadow-lg transition-all duration-300 px-8 py-4 hover-lift"
            >
              Speak with an Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900 text-white py-16 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, rgba(15, 118, 110, 0.3) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 80%, rgba(5, 150, 105, 0.3) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-2 rounded-xl shadow-lg">
                  <Hotel className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">HotelMS</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Creating serene hotel and restaurant management experiences
                designed for the modern hospitality industry. Where technology
                meets tranquility.
              </p>
            </div>

            <div className="animate-fade-in-up delay-200">
              <h3 className="font-semibold mb-6 text-teal-400">Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Room Management
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Booking System
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Guest Services
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Restaurant Management
                </li>
              </ul>
            </div>

            <div className="animate-fade-in-up delay-400">
              <h3 className="font-semibold mb-6 text-teal-400">Support</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Documentation
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  API Reference
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Help Center
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Contact Support
                </li>
              </ul>
            </div>

            <div className="animate-fade-in-up delay-600">
              <h3 className="font-semibold mb-6 text-teal-400">Contact</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3 hover:text-white transition-colors duration-300 group cursor-pointer">
                  <div className="bg-teal-600/20 p-2 rounded-lg group-hover:bg-teal-600/30 transition-colors duration-300">
                    <Phone className="h-4 w-4 text-teal-400" />
                  </div>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 hover:text-white transition-colors duration-300 group cursor-pointer">
                  <div className="bg-teal-600/20 p-2 rounded-lg group-hover:bg-teal-600/30 transition-colors duration-300">
                    <Mail className="h-4 w-4 text-teal-400" />
                  </div>
                  <span>support@hotelms.com</span>
                </div>
                <div className="flex items-center gap-3 hover:text-white transition-colors duration-300 group cursor-pointer">
                  <div className="bg-teal-600/20 p-2 rounded-lg group-hover:bg-teal-600/30 transition-colors duration-300">
                    <MapPin className="h-4 w-4 text-teal-400" />
                  </div>
                  <span>New York, NY</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 animate-fade-in-up delay-800">
            <p>
              &copy; 2025 HotelMS. All rights reserved. Crafted with care for
              exceptional hospitality. 🌿
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
