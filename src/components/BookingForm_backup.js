"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestBookingSchema } from "@/lib/validations";
import DatePicker from "./DatePicker";
import {
  Calendar,
  Users,
  Hotel,
  CheckCircle,
  AlertCircle,
  CreditCard,
  ArrowRight,
} from "lucide-react";

const roomTypes = [
  {
    id: "standard",
    name: "Standard Room",
    price: 199,
    description: "Comfortable room with modern amenities",
    maxGuests: 2,
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    price: 299,
    description: "Spacious room with city view",
    maxGuests: 3,
  },
  {
    id: "suite",
    name: "Executive Suite",
    price: 499,
    description: "Luxury suite with separate living area",
    maxGuests: 4,
  },
  {
    id: "presidential",
    name: "Presidential Suite",
    price: 899,
    description: "Ultimate luxury with panoramic views",
    maxGuests: 6,
  },
];

export default function BookingForm({
  onSubmit,
  isLoading = false,
  initialData = null,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(guestBookingSchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          checkInDate: initialData.checkInDate,
          checkOutDate: initialData.checkOutDate,
          numberOfGuests: initialData.guests || 1,
        }
      : {
          numberOfGuests: 1,
        },
  });

  const watchedValues = watch();

  // Effect to handle initial data from home page
  useEffect(() => {
    if (initialData) {
      // Set form values if initial data is provided
      setValue("checkInDate", initialData.checkInDate);
      setValue("checkOutDate", initialData.checkOutDate);
      setValue("numberOfGuests", initialData.guests || 1);
    }
  }, [initialData, setValue]);

  // Calculate number of nights and total price
  const calculateBookingDetails = () => {
    const checkIn = new Date(watchedValues.checkInDate);
    const checkOut = new Date(watchedValues.checkOutDate);
    const room = roomTypes.find((r) => r.id === watchedValues.roomType);

    if (checkIn && checkOut && room) {
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const roomTotal = nights * room.price;
      const taxes = roomTotal * 0.12; // 12% tax
      const total = roomTotal + taxes;

      return { nights, roomTotal, taxes, total, room };
    }
    return null;
  };

  const bookingDetails = calculateBookingDetails();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStepSubmit = async (data) => {
    if (currentStep === 1) {
      // Simple validation for step 1
      const requiredFields = {
        checkInDate: watchedValues.checkInDate,
        checkOutDate: watchedValues.checkOutDate,
        numberOfGuests: watchedValues.numberOfGuests,
        roomType: watchedValues.roomType
      };
      
      const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => !value || value === '')
        .map(([key]) => key);
      
      if (missingFields.length === 0) {
        // All required fields are present, proceed to step 2
        setCurrentStep(2);
      } else {
        // Show which fields are missing
        console.log('Missing fields:', missingFields);
        alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
      }
    } else if (currentStep === 2) {
      // Validate step 2 fields
      const step2Valid = await trigger([
        "guestName",
        "guestEmail", 
        "guestPhone",
      ]);
      if (step2Valid) {
        setBookingData(data);
        setCurrentStep(3);
      }
    } else {
      // Final submission
      onSubmit && onSubmit(data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit(handleStepSubmit)}>
          {/* Step 1: Dates and Room Selection */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Date Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <DatePicker
                    value={watchedValues.checkInDate || ""}
                    onChange={(date) => setValue("checkInDate", date)}
                    placeholder="Choose your check-in date"
                    label="Check-in Date"
                    size="md"
                  />
                  {errors.checkInDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.checkInDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <DatePicker
                    value={watchedValues.checkOutDate || ""}
                    onChange={(date) => {
                      setValue("checkOutDate", date);
                      // Clear check-out date if it's before or same as the new check-in date
                      if (
                        watchedValues.checkInDate &&
                        new Date(date) <= new Date(watchedValues.checkInDate)
                      ) {
                        setValue("checkOutDate", "");
                      }
                    }}
                    placeholder="Choose your check-out date"
                    label="Check-out Date"
                    isCheckOut={true}
                    checkInDate={watchedValues.checkInDate}
                    size="md"
                  />
                  {errors.checkOutDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.checkOutDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  Number of Guests
                </label>
                <select
                  {...register("numberOfGuests", { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                  defaultValue={initialData?.guests || 1}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num} className="text-gray-700">
                      {num} Guest{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                {errors.numberOfGuests && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.numberOfGuests.message}
                  </p>
                )}
              </div>

              {/* Room Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  <Hotel className="h-4 w-4 inline mr-1" />
                  Select Room Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roomTypes.map((room) => (
                    <div
                      key={room.id}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        watchedValues.roomType === room.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setValue("roomType", room.id)}
                    >
                      <input
                        type="radio"
                        {...register("roomType")}
                        value={room.id}
                        className="hidden"
                      />
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {room.name}
                        </h3>
                        <span className="text-orange-600 font-bold">
                          ${room.price}/night
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {room.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Max {room.maxGuests} guests
                      </p>
                    </div>
                  ))}
                </div>
                {errors.roomType && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.roomType.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Guest Information */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register("guestName")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.guestName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.guestName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register("guestEmail")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                  {errors.guestEmail && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.guestEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register("guestPhone")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.guestPhone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.guestPhone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  {...register("specialRequests")}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Any special requests or preferences..."
                />
                {errors.specialRequests && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.specialRequests.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review and Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Booking Summary */}
              {bookingDetails && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Booking Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">
                        {formatDate(watchedValues.checkInDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">
                        {formatDate(watchedValues.checkOutDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nights:</span>
                      <span className="font-medium">
                        {bookingDetails.nights}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-medium">
                        {watchedValues.numberOfGuests}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span className="font-medium">
                        {bookingDetails.room.name}
                      </span>
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Total:</span>
                      <span className="font-medium">
                        ${bookingDetails.roomTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes & Fees:</span>
                      <span className="font-medium">
                        ${bookingDetails.taxes.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total:</span>
                      <span>${bookingDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Guest Information Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Guest Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="text-gray-600">Name:</span>{" "}
                    <span className="font-medium">
                      {watchedValues.guestName}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Email:</span>{" "}
                    <span className="font-medium">
                      {watchedValues.guestEmail}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Phone:</span>{" "}
                    <span className="font-medium">
                      {watchedValues.guestPhone}
                    </span>
                  </p>
                  {watchedValues.specialRequests && (
                    <p>
                      <span className="text-gray-600">Special Requests:</span>{" "}
                      <span className="font-medium">
                        {watchedValues.specialRequests}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="ml-auto flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : currentStep === 3 ? (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span>Proceed to Payment</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : currentStep === 3 ? (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span>Proceed to Payment</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
