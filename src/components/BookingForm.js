"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestBookingSchema } from "@/lib/validations";
import DatePicker from "./DatePicker";
import { useToast } from "./Toast";
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
    price: 510,
    description:
      "Comfortable room with modern amenities and complimentary breakfast",
    maxGuests: 2,
    currency: "PGK",
    inclusions: ["Complimentary breakfast", "Free fitness room access"],
  },
  {
    id: "standard-b",
    name: "Standard Room B",
    price: 530,
    description:
      "Enhanced standard room with premium amenities and complimentary breakfast",
    maxGuests: 2,
    currency: "PGK",
    inclusions: ["Complimentary breakfast", "Free fitness room access"],
  },
  {
    id: "superior-twin",
    name: "Superior Twin Bed Room",
    price: 695,
    description: "Spacious twin bed room ideal for families or groups",
    maxGuests: 4,
    currency: "PGK",
    inclusions: ["Complimentary breakfast", "Free fitness room access"],
  },
  {
    id: "family-deluxe",
    name: "Family Deluxe Room",
    price: 999,
    description: "Luxurious family suite with separate living area",
    maxGuests: 4,
    currency: "PGK",
    inclusions: ["Complimentary breakfast", "Free fitness room access"],
  },
];

export default function BookingForm({
  onSubmit,
  isLoading = false,
  initialData = null,
  preselectedRoomType = null,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [additionalGuests, setAdditionalGuests] = useState([]);
  const { showError, showSuccess } = useToast();

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
      setValue("checkInDate", initialData.checkInDate);
      setValue("checkOutDate", initialData.checkOutDate);
      setValue("numberOfGuests", initialData.guests || 1);
    }
  }, [initialData, setValue]);

  // Register date fields manually since they're handled by custom DatePicker
  useEffect(() => {
    register("checkInDate", { required: "Check-in date is required" });
    register("checkOutDate", { required: "Check-out date is required" });
  }, [register]);

  // Initialize additional guests based on number of guests
  useEffect(() => {
    const numberOfGuests = watchedValues.numberOfGuests || 1;
    if (numberOfGuests > 1) {
      const newAdditionalGuests = [];
      for (let i = 1; i < numberOfGuests; i++) {
        newAdditionalGuests.push({
          id: i,
          name: "",
          age: "",
        });
      }
      setAdditionalGuests((prev) => {
        // Preserve existing data when possible
        return newAdditionalGuests.map((guest, index) => ({
          ...guest,
          name: prev[index]?.name || "",
          age: prev[index]?.age || "",
        }));
      });
    } else {
      setAdditionalGuests([]);
    }
  }, [watchedValues.numberOfGuests]);

  // Effect to handle preselected room type from URL
  useEffect(() => {
    if (preselectedRoomType) {
      const room = roomTypes.find((r) => r.id === preselectedRoomType);
      if (room) {
        setSelectedRoom(room);
        setValue("roomType", room.id);
      }
    }
  }, [preselectedRoomType, setValue]);

  // Additional guests management functions
  const updateAdditionalGuest = (index, field, value) => {
    setAdditionalGuests((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Calculate number of nights and total price
  const calculateBookingDetails = () => {
    const checkIn = new Date(watchedValues.checkInDate);
    const checkOut = new Date(watchedValues.checkOutDate);
    const room = roomTypes.find((r) => r.id === watchedValues.roomType);

    if (checkIn && checkOut && room) {
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const roomTotal = nights * room.price;
      const extraBedCost = watchedValues.extraBed ? nights * 150 : 0;
      const subtotal = roomTotal + extraBedCost;
      const taxes = subtotal * 0.12; // 12% tax
      const total = subtotal + taxes;

      return { nights, roomTotal, extraBedCost, subtotal, taxes, total, room };
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
      // Get current form values
      const formValues = getValues();

      // Check if all required fields for step 1 are filled
      const requiredFields = [
        "checkInDate",
        "checkOutDate",
        "numberOfGuests",
        "roomType",
      ];
      const missingFields = requiredFields.filter((field) => {
        const value = formValues[field] || watchedValues[field];
        return !value || value === "";
      });

      if (missingFields.length > 0) {
        showError(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
        return;
      }

      setCurrentStep(2);
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
      } else {
        showError("Please check your guest information and try again.");
      }
    } else {
      // Final submission - include additional guests data
      const formDataWithGuests = {
        ...data,
        additionalGuests: additionalGuests
          .filter((guest) => guest.name.trim() !== "")
          .map((guest) => ({
            name: guest.name.trim(),
            age:
              guest.age && guest.age !== "" ? parseInt(guest.age) : undefined,
          }))
          .filter((guest) => guest.name), // Extra safety check
      };
      onSubmit && onSubmit(formDataWithGuests);
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
                    onChange={(date) => setValue("checkOutDate", date)}
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
                          ? "border-red-700 bg-red-50"
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
                        <span className="text-red-700 font-bold">
                          K{room.price}/night
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {room.description}
                      </p>
                      <div className="text-xs text-gray-500 mb-2">
                        <p>Max {room.maxGuests} guests</p>
                        <div className="mt-1">
                          <strong>Included:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {room.inclusions.map((inclusion, idx) => (
                              <li key={idx}>{inclusion}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
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

              {/* Extra Bed Option */}
              {watchedValues.roomType && (
                <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Additional Options
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        {...register("extraBed")}
                        className="h-5 w-5 text-red-700 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <div>
                        <span className="font-medium text-gray-900">
                          Extra Bed
                        </span>
                        <p className="text-sm text-gray-600">
                          Additional bed for 1 guest
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-red-700">
                      K150.00/night
                    </span>
                  </div>
                </div>
              )}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900"
                  placeholder="Any special requests or preferences..."
                />
                {errors.specialRequests && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.specialRequests.message}
                  </p>
                )}
              </div>

              {/* Additional Guests Section */}
              {(watchedValues.numberOfGuests || 1) > 1 && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Additional Guests
                    </h4>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {additionalGuests.length} guest
                      {additionalGuests.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Providing additional guest names helps us offer personalized
                    service. Guest names can also be provided at check-in if not
                    entered now.
                  </p>

                  <div className="space-y-4">
                    {additionalGuests.map((guest, index) => (
                      <div key={guest.id} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3">
                          Guest {index + 2}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name (Optional)
                            </label>
                            <input
                              type="text"
                              value={guest.name}
                              onChange={(e) =>
                                updateAdditionalGuest(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                              placeholder="Enter guest name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Age (Optional)
                            </label>
                            <input
                              type="number"
                              value={guest.age}
                              onChange={(e) =>
                                updateAdditionalGuest(
                                  index,
                                  "age",
                                  e.target.value
                                )
                              }
                              min="1"
                              max="120"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                              placeholder="Age"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> All guests must present valid ID at
                      check-in. Children under 18 must be accompanied by an
                      adult.
                    </p>
                  </div>
                </div>
              )}
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
                      <span className="font-medium text-gray-900">
                        {formatDate(watchedValues.checkInDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(watchedValues.checkOutDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nights:</span>
                      <span className="font-medium text-gray-900">
                        {bookingDetails.nights}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-medium text-gray-900">
                        {watchedValues.numberOfGuests}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span className="font-medium text-gray-900">
                        {bookingDetails.room.name}
                      </span>
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Total:</span>
                      <span className="font-medium text-gray-900">
                        K{bookingDetails.roomTotal.toFixed(2)}
                      </span>
                    </div>
                    {bookingDetails.extraBedCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Extra Bed ({bookingDetails.nights} nights):
                        </span>
                        <span className="font-medium text-gray-900">
                          K{bookingDetails.extraBedCost.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium text-gray-900">
                        K{bookingDetails.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes & Fees:</span>
                      <span className="font-medium text-gray-900">
                        K{bookingDetails.taxes.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total:</span>
                      <span>K{bookingDetails.total.toFixed(2)}</span>
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
                    <span className="font-medium text-gray-900">
                      {watchedValues.guestName}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Email:</span>{" "}
                    <span className="font-medium text-gray-900">
                      {watchedValues.guestEmail}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Phone:</span>{" "}
                    <span className="font-medium text-gray-900">
                      {watchedValues.guestPhone}
                    </span>
                  </p>
                  {watchedValues.specialRequests && (
                    <p>
                      <span className="text-gray-600">Special Requests:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {watchedValues.specialRequests}
                      </span>
                    </p>
                  )}

                  {/* Additional Guests Summary */}
                  {additionalGuests.length > 0 &&
                    additionalGuests.some(
                      (guest) => guest.name.trim() !== ""
                    ) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-600 font-medium mb-2">
                          Additional Guests:
                        </p>
                        <div className="space-y-1">
                          {additionalGuests
                            .filter((guest) => guest.name.trim() !== "")
                            .map((guest, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium text-gray-900">
                                  {guest.name}
                                </span>
                                {guest.age && (
                                  <span className="text-gray-600 ml-2">
                                    (Age: {guest.age})
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
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
              type="button"
              disabled={isLoading}
              onClick={() => {
                // Call handleStepSubmit with current form data
                const formData = getValues();
                handleStepSubmit(formData);
              }}
              className="ml-auto flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-red-700 to-orange-600 text-white font-semibold rounded-xl hover:from-red-800 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </form>
      </div>
    </div>
  );
}
