"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Calendar,
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui";
import DatePicker from "@/components/DatePicker";
import TangMowLogo from "@/components/TangMowLogo";
import { useToast } from "@/components/Toast";

// Event booking validation schema
const eventBookingSchema = z.object({
  eventType: z.string().min(1, "Please select an event type"),
  organizerName: z.string().min(2, "Organizer name is required"),
  organizerEmail: z.string().email("Please enter a valid email"),
  organizerPhone: z.string().min(10, "Please enter a valid phone number"),
  eventDate: z.string().min(1, "Event date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  expectedGuests: z.number().min(1, "Number of guests is required"),
  eventTitle: z.string().min(2, "Event title is required"),
  eventDescription: z.string().optional(),
  cateringRequired: z.boolean().optional(),
  equipmentNeeds: z.string().optional(),
  specialRequests: z.string().optional(),
});

const eventTypes = [
  { id: "wedding", name: "Wedding Reception", capacity: 300, price: 2500 },
  { id: "corporate", name: "Corporate Event", capacity: 200, price: 1800 },
  { id: "conference", name: "Conference/Seminar", capacity: 150, price: 1500 },
  { id: "birthday", name: "Birthday Party", capacity: 100, price: 1200 },
  {
    id: "anniversary",
    name: "Anniversary Celebration",
    capacity: 150,
    price: 1400,
  },
  { id: "meeting", name: "Business Meeting", capacity: 50, price: 800 },
  { id: "other", name: "Other Event", capacity: 200, price: 1600 },
];

export default function EventBookingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError, showSuccess, ToastComponent } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(eventBookingSchema),
    defaultValues: {
      expectedGuests: 50,
      cateringRequired: false,
    },
  });

  const watchedValues = watch();
  const selectedEventType = eventTypes.find(
    (type) => type.id === watchedValues.eventType
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically send the data to your API
      console.log("Event booking data:", data);

      // Generate reference number
      const referenceNumber = `TM-EVT-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 4)
        .toUpperCase()}`;

      // Calculate total estimate
      const total = calculateEstimate();

      // Get selected event type name
      const eventTypeName = selectedEventType?.name || data.eventType;

      // Redirect to success page with booking details
      const searchParams = new URLSearchParams({
        ref: referenceNumber,
        eventType: eventTypeName,
        eventDate: data.eventDate,
        guests: data.expectedGuests.toString(),
        organizerName: data.organizerName,
        organizerEmail: data.organizerEmail,
        total: total.toString(),
      });

      router.push(`/events/success?${searchParams.toString()}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      showError("Failed to submit event booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEstimate = () => {
    if (!selectedEventType || !watchedValues.expectedGuests) return 0;

    const basePrice = selectedEventType.price;
    const guestSurcharge =
      watchedValues.expectedGuests > 100
        ? (watchedValues.expectedGuests - 100) * 10
        : 0;
    const cateringCost = watchedValues.cateringRequired
      ? watchedValues.expectedGuests * 25
      : 0;

    return basePrice + guestSurcharge + cateringCost;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link
              href="/"
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium text-sm sm:text-base">
                Back to Home
              </span>
            </Link>
            <TangMowLogo
              variant="compact"
              showText={true}
              textClassName="text-lg sm:text-2xl font-bold gradient-text hidden sm:block"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Book Your <span className="gradient-text">Event Space</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plan your special event at Tang Mow Hotel. From intimate
              gatherings to grand celebrations, we provide the perfect venue for
              your memorable occasions.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Event Planning Assistance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-600" />
                <span className="text-gray-700">+675 7384 8240</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-600" />
                <span className="text-gray-700">
                  tmhotel.reservation@tangmow.com
                </span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Event Type Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Event Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    {...register("eventType")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} (Max {type.capacity} guests)
                      </option>
                    ))}
                  </select>
                  {errors.eventType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.eventType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    {...register("eventTitle")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    placeholder="Enter event title"
                  />
                  {errors.eventTitle && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.eventTitle.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <DatePicker
                    value={watchedValues.eventDate || ""}
                    onChange={(date) => setValue("eventDate", date)}
                    placeholder="Select event date"
                    label=""
                    size="md"
                  />
                  {errors.eventDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.eventDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Guests *
                  </label>
                  <input
                    type="number"
                    {...register("expectedGuests", { valueAsNumber: true })}
                    min="1"
                    max="300"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    placeholder="Number of guests"
                  />
                  {errors.expectedGuests && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.expectedGuests.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    {...register("startTime")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                  {errors.startTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    {...register("endTime")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                  {errors.endTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Description
                </label>
                <textarea
                  {...register("eventDescription")}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900"
                  placeholder="Describe your event..."
                />
              </div>
            </div>

            {/* Organizer Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Organizer Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register("organizerName")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    placeholder="Enter your full name"
                  />
                  {errors.organizerName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.organizerName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register("organizerEmail")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    placeholder="your@email.com"
                  />
                  {errors.organizerEmail && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.organizerEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register("organizerPhone")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    placeholder="+675 1234 5678"
                  />
                  {errors.organizerPhone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.organizerPhone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Services */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Additional Services
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    {...register("cateringRequired")}
                    className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label className="text-gray-700">
                    Catering Services Required (K25 per guest)
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipment Needs
                  </label>
                  <textarea
                    {...register("equipmentNeeds")}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900"
                    placeholder="Audio/visual equipment, microphones, projectors, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    {...register("specialRequests")}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900"
                    placeholder="Any special requirements or requests..."
                  />
                </div>
              </div>
            </div>

            {/* Price Estimate */}
            {selectedEventType && (
              <div className="bg-white rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Estimated Cost
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-800">
                    <span className="font-medium">Base venue cost:</span>
                    <span className="font-semibold text-orange-600">
                      K{selectedEventType.price.toLocaleString()}
                    </span>
                  </div>
                  {watchedValues.expectedGuests > 100 && (
                    <div className="flex justify-between text-gray-800">
                      <span className="font-medium">
                        Additional guests surcharge:
                      </span>
                      <span className="font-semibold text-orange-600">
                        K
                        {(
                          (watchedValues.expectedGuests - 100) *
                          10
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {watchedValues.cateringRequired && (
                    <div className="flex justify-between text-gray-800">
                      <span className="font-medium">
                        Catering ({watchedValues.expectedGuests} guests):
                      </span>
                      <span className="font-semibold text-orange-600">
                        K{(watchedValues.expectedGuests * 25).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <hr className="my-3 border-gray-200" />
                  <div className="flex justify-between text-lg font-bold bg-orange-50 -mx-2 px-2 py-2 rounded-lg">
                    <span className="text-gray-900">Total Estimate:</span>
                    <span className="text-orange-700">
                      K{calculateEstimate().toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-4 bg-gray-50 p-3 rounded-lg">
                  *This is an estimate. Final pricing will be confirmed during
                  consultation.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white px-12 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit Event Booking Request"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastComponent />
    </div>
  );
}
