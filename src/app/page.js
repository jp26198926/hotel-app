"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  ChevronDown,
  Plus,
  Minus,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";
import DatePicker from "@/components/DatePicker";
import TangMowLogo from "@/components/TangMowLogo";
import { useToast } from "@/components/Toast";

export default function HomePage() {
  const router = useRouter();
  const { showError, showSuccess, ToastComponent } = useToast();
  // Hero background images array
  const heroImages = [
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  ];

  // State for booking form
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for hero image carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Ref for guest dropdown and mobile menu
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGuestDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on window resize (when switching to desktop)
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        // md breakpoint
        setIsMobileMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Hero image carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 20000); // Change image every 20 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Handle form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    // Set loading state
    setIsCheckingAvailability(true);

    try {
      // Validate form data
      if (!checkInDate || !checkOutDate) {
        showError("Please select both check-in and check-out dates");
        return;
      }

      // Validate date logic
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        showError("Check-in date cannot be in the past");
        return;
      }

      if (checkOut <= checkIn) {
        showError("Check-out date must be after check-in date");
        return;
      }

      // Calculate number of nights
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Prepare booking data
      const bookingData = {
        checkInDate,
        checkOutDate,
        guests,
        nights,
        fromHomePage: true,
      };

      // Store booking data in sessionStorage for the booking page
      sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));

      // Show success message
      showSuccess(
        "Availability confirmed! Redirecting to booking page...",
        2000
      );

      // Small delay to show loading state and success message
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to booking page
      router.push("/booking");
    } catch (error) {
      console.error("Error processing booking:", error);
      showError(
        "An error occurred while checking availability. Please try again."
      );
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Handle Learn More button click - scroll to accommodations section
  const handleLearnMoreClick = () => {
    const accommodationsSection = document.getElementById("accommodations");
    if (accommodationsSection) {
      accommodationsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50/30 to-orange-50/50">
      {/* Navigation */}
      <nav
        className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300"
        ref={mobileMenuRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <TangMowLogo
              className="animate-fade-in-up"
              variant="compact"
              showText={true}
              textClassName="text-xl sm:text-2xl font-bold text-gray-800 hidden sm:block"
              priority={true}
            />

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 animate-fade-in-up delay-200">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 transition-colors duration-300 font-medium"
              >
                Home
              </Link>
              <Link
                href="/gallery"
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300 font-medium"
              >
                Gallery
              </Link>
              <Link
                href="/about"
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300 font-medium"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300 font-medium"
              >
                Contact
              </Link>
              <Link
                href="/booking"
                className="bg-gradient-to-r from-red-700 to-orange-600 text-white px-6 py-2 rounded-full hover:from-red-800 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
              >
                Book Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 animate-slide-down">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md">
                <Link
                  href="/"
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/gallery"
                  className="block px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Gallery
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/booking"
                  className="block mx-3 mt-3 bg-gradient-to-r from-red-700 to-orange-600 text-white px-4 py-2 rounded-full hover:from-red-800 hover:to-orange-700 transition-all duration-300 font-medium shadow-lg text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen lg:min-h-screen md:min-h-[90vh] sm:min-h-[85vh] bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center lg:justify-start overflow-hidden">
        {/* Hero Background Images Carousel */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt={`Luxury Hotel View ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          {/* Enhanced background overlay for better text readability - reduced opacity */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/20 to-black/15 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 z-10"></div>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-orange-500 scale-125"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-items-center lg:justify-items-stretch py-8 lg:py-0 min-h-[calc(100vh-8rem)] lg:min-h-auto">
            {/* Left Content */}
            <div className="text-white order-2 lg:order-1 flex items-center justify-center lg:justify-start">
              {/* Add backdrop blur and semi-transparent background for better text contrast */}
              <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10 text-center lg:text-left w-full max-w-lg mx-auto lg:mx-0">
                <div className="mb-6 sm:mb-8 animate-fade-in-up">
                  <h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-white drop-shadow-2xl"
                    style={{
                      textShadow:
                        "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)",
                    }}
                  >
                    Tang Mow
                    <br />
                    Hotel{" "}
                    <span
                      className="text-orange-300 drop-shadow-2xl"
                      style={{
                        textShadow:
                          "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)",
                      }}
                    >
                      Wewak
                    </span>
                  </h1>
                </div>
                <p
                  className="text-lg sm:text-xl text-white mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed animate-fade-in-up delay-200 drop-shadow-lg"
                  style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
                >
                  Premium accommodations in the heart of Wewak with modern
                  amenities, complimentary breakfast, and exceptional Papua New
                  Guinea hospitality.
                </p>
                <div className="animate-fade-in-up delay-400">
                  <Button
                    onClick={handleLearnMoreClick}
                    className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-white/20 cursor-pointer"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Content - Interactive Booking Form */}
            <div className="order-1 lg:order-2 flex items-center justify-center lg:justify-end">
              <form
                onSubmit={handleBookingSubmit}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full mx-auto lg:mx-0 animate-fade-in-up delay-600"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
                  Book Your Stay
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {/* Check-in Date */}
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                      Check-in
                    </label>
                    <DatePicker
                      value={checkInDate}
                      onChange={setCheckInDate}
                      placeholder="Select check-in date"
                      size="sm"
                      className="bg-gray-50"
                      popupPosition="center"
                    />
                  </div>

                  {/* Check-out Date */}
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                      Check-out
                    </label>
                    <DatePicker
                      value={checkOutDate}
                      onChange={setCheckOutDate}
                      placeholder="Select check-out date"
                      isCheckOut={true}
                      checkInDate={checkInDate}
                      size="sm"
                      className="bg-gray-50"
                      popupPosition="center"
                    />
                  </div>
                </div>

                {/* Guests Selector */}
                <div className="mb-4 sm:mb-6 relative" ref={dropdownRef}>
                  <label className="block text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                    Guests
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <span className="text-sm sm:text-base text-gray-800 font-medium">
                        {guests} {guests === 1 ? "Guest" : "Guests"}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform duration-200 ${
                        showGuestDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Guest Dropdown */}
                  {showGuestDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Adults</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setGuests(Math.max(1, guests - 1))}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="text-gray-800 font-medium w-8 text-center">
                              {guests}
                            </span>
                            <button
                              type="button"
                              onClick={() => setGuests(Math.min(8, guests + 1))}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                            >
                              <Plus className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isCheckingAvailability}
                  className="w-full bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isCheckingAvailability ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Checking Availability...</span>
                    </div>
                  ) : (
                    "Check Availability"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Function Halls & Event Spaces Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Elegant Event Venues
            </h2>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto">
              Host your special occasions in our beautifully designed function
              halls and event spaces. From intimate gatherings to grand
              celebrations, we provide the perfect setting for your memorable
              moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Grand Ballroom */}
            <div className="animate-fade-in-up">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2098&q=80"
                  alt="Grand Ballroom"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Grand Ballroom</h3>
                  <p className="text-white/90">Capacity: 300 guests</p>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up delay-200 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Perfect for Grand Celebrations
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our Grand Ballroom features crystal chandeliers, elegant décor,
                and state-of-the-art audio-visual equipment. Ideal for weddings,
                corporate events, and milestone celebrations.
              </p>
              <ul className="space-y-3 text-gray-700 mb-8 text-left max-w-md mx-auto md:mx-0">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-red-700 flex-shrink-0" />
                  Professional event planning services
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-red-700 flex-shrink-0" />
                  Custom catering menus available
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-red-700 flex-shrink-0" />
                  Advanced lighting and sound systems
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-red-700 flex-shrink-0" />
                  Dedicated event coordinator
                </li>
              </ul>
              <div className="flex justify-center md:justify-start">
                <Link href="/events">
                  <Button className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-full transition-all duration-300">
                    Book Event Space
                  </Button>
                </Link>
              </div>
            </div>

            {/* Conference Room */}
            <div className="animate-fade-in-up delay-400 text-center md:text-left md:order-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Modern Conference Facilities
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our conference rooms are designed for productivity and comfort,
                featuring the latest technology and flexible layouts for
                meetings, seminars, and corporate retreats.
              </p>
              <ul className="space-y-3 text-gray-700 mb-8 text-left max-w-md mx-auto md:mx-0">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  High-speed Wi-Fi and video conferencing
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  Flexible seating arrangements
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  Presentation equipment included
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  Coffee break and catering services
                </li>
              </ul>
              <div className="flex justify-center md:justify-start">
                <Link href="/events">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full transition-all duration-300">
                    Reserve Conference Room
                  </Button>
                </Link>
              </div>
            </div>

            <div className="animate-fade-in-up delay-600 md:order-2">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                  alt="Modern Conference Room"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    Executive Conference Room
                  </h3>
                  <p className="text-white/90">Capacity: 50 guests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Accommodations Section */}
      <section
        id="accommodations"
        className="py-20 bg-orange-300 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 text-center md:text-left gap-6 md:gap-0">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Premium
                <br />
                Accommodations
              </h2>
              <p className="text-gray-700 text-lg max-w-md mx-auto md:mx-0">
                Discover our range of comfortable accommodations designed for
                modern travelers. Each room features premium amenities,
                complimentary breakfast, and free fitness room access.
              </p>
            </div>
            <div className="flex gap-3 animate-fade-in-up delay-200">
              <button className="w-12 h-12 bg-gray-800 hover:bg-gray-900 rounded-full flex items-center justify-center text-white transition-colors duration-300">
                <ArrowRight className="h-5 w-5 rotate-180" />
              </button>
              <button className="w-12 h-12 bg-gray-800 hover:bg-gray-900 rounded-full flex items-center justify-center text-white transition-colors duration-300">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Standard Room */}
            <div className="group hover-lift animate-fade-in-up h-full">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Standard Hotel Room"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Standard Room
                    </h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3 flex-grow">
                    Comfortable room with modern amenities and complimentary
                    breakfast
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>• 2 guests maximum</p>
                    <p>• Complimentary breakfast</p>
                    <p>• Free fitness room access</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto mb-4">
                    <span className="text-2xl font-bold text-gray-800">
                      K510
                    </span>
                    <span className="text-gray-500">/night</span>
                  </div>
                  <Link href="/booking?roomType=standard" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Standard Room B */}
            <div className="group hover-lift animate-fade-in-up delay-200 h-full">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Standard Room B"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Standard Room B
                    </h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3 flex-grow">
                    Enhanced standard room with premium amenities and
                    complimentary breakfast
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>• 2 guests maximum</p>
                    <p>• Complimentary breakfast</p>
                    <p>• Free fitness room access</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto mb-4">
                    <span className="text-2xl font-bold text-gray-800">
                      K530
                    </span>
                    <span className="text-gray-500">/night</span>
                  </div>
                  <Link href="/booking?roomType=standard-b" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Superior Twin Bed Room */}
            <div className="group hover-lift animate-fade-in-up delay-400 h-full">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
                    alt="Superior Twin Bed Room"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Superior Twin Bed Room
                    </h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3 flex-grow">
                    Spacious twin bed room ideal for families or groups
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>• 4 guests maximum</p>
                    <p>• Complimentary breakfast</p>
                    <p>• Free fitness room access</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto mb-4">
                    <span className="text-2xl font-bold text-gray-800">
                      K695
                    </span>
                    <span className="text-gray-500">/night</span>
                  </div>
                  <Link
                    href="/booking?roomType=superior-twin"
                    className="w-full"
                  >
                    <Button className="w-full bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Family Deluxe Room */}
            <div className="group hover-lift animate-fade-in-up delay-600 h-full">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Family Deluxe Room"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Family Deluxe Room
                    </h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3 flex-grow">
                    Luxurious family suite with separate living area
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>• 4 guests maximum</p>
                    <p>• Complimentary breakfast</p>
                    <p>• Free fitness room access</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto mb-4">
                    <span className="text-2xl font-bold text-gray-800">
                      K999
                    </span>
                    <span className="text-gray-500">/night</span>
                  </div>
                  <Link
                    href="/booking?roomType=family-deluxe"
                    className="w-full"
                  >
                    <Button className="w-full bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Extra Bed Information */}
          <div className="mt-12 text-center animate-fade-in-up delay-800">
            <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md mx-auto">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Additional Options
              </h4>
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <span className="font-medium text-gray-900">Extra Bed</span>
                  <p className="text-sm text-gray-600">
                    Additional bed for 1 guest
                  </p>
                </div>
                <span className="text-xl font-bold text-red-700">
                  K150/night
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Menu Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The Grand Restaurant
              <span className="block text-orange-500">
                Signature Culinary Experience
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Savor our award-winning cuisine crafted by world-class chefs using
              the finest ingredients, served in an atmosphere of refined
              elegance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Grilled Lobster */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-orange-100 hover:border-orange-200 transition-all duration-500 hover-lift group animate-fade-in-up overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Grilled Lobster with Herbs"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    #1 Best Seller
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-all duration-300">
                    Grilled Lobster with Herbs
                  </h3>
                  <span className="text-2xl font-bold text-orange-600">
                    $89
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Fresh Atlantic lobster grilled to perfection with aromatic
                  herbs, served with garlic butter and seasonal vegetables.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      (127 reviews)
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Wagyu Beef */}
            <div
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-orange-100 hover:border-orange-200 transition-all duration-500 hover-lift group animate-fade-in-up overflow-hidden"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Wagyu Beef Tenderloin"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Chef&apos;s Choice
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-all duration-300">
                    Wagyu Beef Tenderloin
                  </h3>
                  <span className="text-2xl font-bold text-orange-600">
                    $125
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Premium Japanese Wagyu beef tenderloin with truffle sauce,
                  roasted potatoes, and market vegetables.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      (98 reviews)
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Seafood Paella */}
            <div
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-orange-100 hover:border-orange-200 transition-all duration-500 hover-lift group animate-fade-in-up overflow-hidden"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1534080564583-6be75777b70a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Seafood Paella"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Traditional
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-all duration-300">
                    Traditional Seafood Paella
                  </h3>
                  <span className="text-2xl font-bold text-orange-600">
                    $65
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Authentic Spanish paella with fresh seafood, saffron rice, and
                  a medley of Mediterranean flavors. Perfect for sharing.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      (156 reviews)
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Tuna Tartare */}
            <div
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-orange-100 hover:border-orange-200 transition-all duration-500 hover-lift group animate-fade-in-up overflow-hidden"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1551326844-4df70f78d0e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Tuna Tartare"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Light & Fresh
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-all duration-300">
                    Yellowfin Tuna Tartare
                  </h3>
                  <span className="text-2xl font-bold text-orange-600">
                    $42
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Fresh yellowfin tuna with avocado, citrus, and microgreens.
                  Served with crispy wonton chips and sesame oil drizzle.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      (89 reviews)
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Chocolate Soufflé */}
            <div
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-orange-100 hover:border-orange-200 transition-all duration-500 hover-lift group animate-fade-in-up overflow-hidden"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80"
                  alt="Chocolate Soufflé"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Signature Dessert
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-all duration-300">
                    Dark Chocolate Soufflé
                  </h3>
                  <span className="text-2xl font-bold text-orange-600">
                    $28
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Decadent dark chocolate soufflé with vanilla bean ice cream
                  and berry compote. The perfect sweet ending to your meal.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      (201 reviews)
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Wine Selection */}
            <div
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-orange-100 hover:border-orange-200 transition-all duration-500 hover-lift group animate-fade-in-up overflow-hidden"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Premium Wine Selection"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Sommelier&apos;s Pick
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-all duration-300">
                    Premium Wine Pairing
                  </h3>
                  <span className="text-2xl font-bold text-orange-600">
                    $95
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Curated selection of three premium wines perfectly paired with
                  your dining experience, guided by our expert sommelier.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      (74 reviews)
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 mb-8 animate-fade-in-up delay-600">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto sm:max-w-none">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 shadow-md hover:shadow-lg transition-all duration-300 px-8 py-4 hover-lift"
              >
                View Full Menu
              </Button>
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 hover-lift"
              >
                Make Reservation
              </Button>
            </div>
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
              backgroundImage: `radial-gradient(circle at 20% 20%, rgba(251, 146, 60, 0.3) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 text-center md:text-left">
            <div className="animate-fade-in-up">
              <TangMowLogo
                variant="full"
                showText={false}
                className="mb-6 justify-center md:justify-start"
              />
              <p className="text-gray-300 leading-relaxed max-w-sm mx-auto md:mx-0">
                Experience premium hospitality in the heart of Wewak, East Sepik
                Province. Located at TangMow Plaza Town Centre, we offer modern
                accommodations, exceptional service, and authentic Papua New
                Guinea hospitality.
              </p>
            </div>

            <div className="animate-fade-in-up delay-200">
              <h3 className="font-semibold mb-6 text-orange-400">Services</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Hotel Accommodations
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Bar and Restaurant
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Room Service
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Laundry Service
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Fitness Room Access
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Free Airport Pickup and Drop off
                </li>
              </ul>
            </div>

            <div className="animate-fade-in-up delay-400">
              <h3 className="font-semibold mb-6 text-orange-400">
                Guest Support
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Reservation Assistance
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Room Service
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  Event Planning
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-1">
                  24/7 Front Desk
                </li>
              </ul>
            </div>

            <div className="animate-fade-in-up delay-600">
              <h3 className="font-semibold mb-6 text-orange-400">Contact</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3 hover:text-white transition-colors duration-300 group cursor-pointer justify-center md:justify-start">
                  <div className="bg-orange-600/20 p-2 rounded-lg group-hover:bg-orange-600/30 transition-colors duration-300">
                    <Phone className="h-4 w-4 text-orange-400" />
                  </div>
                  <span>+675 7384 8240</span>
                </div>
                <div className="flex items-center gap-3 hover:text-white transition-colors duration-300 group cursor-pointer justify-center md:justify-start">
                  <div className="bg-orange-600/20 p-2 rounded-lg group-hover:bg-orange-600/30 transition-colors duration-300">
                    <Mail className="h-4 w-4 text-orange-400" />
                  </div>
                  <span>tmhotel.reservation@tangmow.com</span>
                </div>
                <div className="flex items-center gap-3 hover:text-white transition-colors duration-300 group cursor-pointer justify-center md:justify-start">
                  <div className="bg-orange-600/20 p-2 rounded-lg group-hover:bg-orange-600/30 transition-colors duration-300">
                    <MapPin className="h-4 w-4 text-orange-400" />
                  </div>
                  <span>
                    4th Floor TangMow Plaza, Town Centre, Wewak East Sepik
                    Province
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 animate-fade-in-up delay-800">
            <p>
              &copy; 2025 Tang Mow. All rights reserved. Crafted for exceptional
              hospitality experiences. �
            </p>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastComponent />
    </div>
  );
}
