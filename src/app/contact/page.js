"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

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
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up delay-200">
              We&apos;re here to help make your stay exceptional. Reach out to
              us for any inquiries, special requests, or assistance with your
              booking.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Phone,
                title: "Phone Numbers",
                details: ["+675 7384 8240", "+675 8170 8727", "+675 7359 9590"],
                description: "Available for reservations and inquiries",
              },
              {
                icon: Mail,
                title: "Email",
                details: ["tmhotel.reservation@tangmow.com"],
                description: "For reservations and general inquiries",
              },
              {
                icon: MapPin,
                title: "Address",
                details: [
                  "4th Floor TangMow Plaza",
                  "Town Centre, Wewak",
                  "East Sepik Province, Papua New Guinea",
                ],
                description: "Located in the heart of Wewak",
              },
            ].map((contact, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-lg hover-lift animate-fade-in-up delay-${
                  (index + 1) * 200
                }`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                  <contact.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {contact.title}
                </h3>
                <div className="space-y-2 mb-4">
                  {contact.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700 font-medium">
                      {detail}
                    </p>
                  ))}
                </div>
                <p className="text-gray-600 text-sm">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-slide-in-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Have a question or special request? Fill out the form below and
                we&apos;ll get back to you promptly.
              </p>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-scale-in">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-green-700">
                    Thank you for contacting us. We&apos;ll respond within 2
                    hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select a subject</option>
                        <option value="booking">Booking Inquiry</option>
                        <option value="restaurant">
                          Restaurant Reservation
                        </option>
                        <option value="events">Event Planning</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-700 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Map & Hours */}
            <div className="animate-slide-in-right">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Us</h2>

              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-2xl h-64 mb-8 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive Map</p>
                  <p className="text-sm text-gray-400">
                    123 Luxury Avenue, Metropolitan City
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 text-orange-600 mr-2" />
                  Operating Hours
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Front Desk</span>
                    <span className="font-medium text-gray-900">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Restaurant</span>
                    <span className="font-medium text-gray-900">
                      6:00 AM - 11:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Service</span>
                    <span className="font-medium text-gray-900">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Concierge</span>
                    <span className="font-medium text-gray-900">
                      7:00 AM - 10:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What is your cancellation policy?",
                answer:
                  "Free cancellation up to 24 hours before check-in. Cancellations within 24 hours are subject to a one-night charge.",
              },
              {
                question: "Do you offer airport transportation?",
                answer:
                  "Yes, we provide complimentary airport shuttle service. Please contact us 24 hours in advance to arrange pickup.",
              },
              {
                question: "Are pets allowed?",
                answer:
                  "We welcome well-behaved pets with prior arrangement. A pet fee of $50 per night applies.",
              },
              {
                question: "What amenities are included?",
                answer:
                  "All rooms include free Wi-Fi, premium bedding, 24-hour room service, fitness center access, and concierge services.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-sm animate-fade-in-up delay-${
                  (index + 1) * 100
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
