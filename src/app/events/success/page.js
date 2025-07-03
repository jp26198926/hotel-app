"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Home,
  Calendar,
  Users,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui";
import TangMowLogo from "@/components/TangMowLogo";

export default function EventBookingSuccess() {
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // Get booking details from URL parameters
    const referenceNumber = searchParams.get("ref");
    const eventType = searchParams.get("eventType");
    const eventDate = searchParams.get("eventDate");
    const guests = searchParams.get("guests");
    const organizerName = searchParams.get("organizerName");
    const organizerEmail = searchParams.get("organizerEmail");
    const total = searchParams.get("total");

    if (referenceNumber) {
      setBookingDetails({
        referenceNumber,
        eventType,
        eventDate,
        guests,
        organizerName,
        organizerEmail,
        total,
      });
    }
  }, [searchParams]);

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          @page {
            size: A4;
            margin: 0.5in;
          }

          body {
            font-size: 12px !important;
            line-height: 1.3 !important;
          }

          .no-print {
            display: none !important;
          }

          .print-compact {
            margin: 0 !important;
            padding: 0.5rem !important;
          }

          .print-header {
            margin-bottom: 1rem !important;
          }

          .print-section {
            margin-bottom: 1rem !important;
            padding: 0.75rem !important;
          }

          .print-title {
            font-size: 18px !important;
            margin-bottom: 0.5rem !important;
          }

          .print-subtitle {
            font-size: 14px !important;
            margin-bottom: 0.5rem !important;
          }

          .print-text {
            font-size: 12px !important;
            line-height: 1.2 !important;
          }

          .print-ref-number {
            font-size: 20px !important;
            font-weight: bold !important;
          }

          .print-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 1rem !important;
            margin-bottom: 1rem !important;
          }

          .print-steps {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
          }

          .print-step {
            display: flex !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }

          .print-step-number {
            width: 20px !important;
            height: 20px !important;
            font-size: 12px !important;
            margin-top: 0 !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 print:bg-white print:min-h-0">
        {/* Header */}
        <header className="bg-white shadow-sm print:shadow-none print-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print-compact">
            <div className="flex items-center justify-center h-16 print:h-auto print:py-2">
              <TangMowLogo
                variant="compact"
                showText={true}
                textClassName="text-2xl font-bold gradient-text print:text-lg"
              />
            </div>
          </div>
        </header>

        {/* Success Content */}
        <div className="py-12 print:py-2">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 print-compact">
            {/* Success Icon and Title */}
            <div className="text-center mb-12 print:mb-4 print-section">
              <div className="mx-auto flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 print:w-12 print:h-12 print:mb-2 no-print">
                <CheckCircle className="w-10 h-10 text-green-600 print:w-6 print:h-6" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 print-title">
                Event Booking Confirmation
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto print-text print:mb-2">
                Thank you for choosing Tang Mow Hotel for your event.
              </p>
            </div>

            {/* Booking Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 print:shadow-none print:rounded-none print-section">
              <div className="border-b border-gray-200 pb-6 mb-6 print:pb-2 print:mb-3">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 print-subtitle">
                  Booking Reference
                </h2>
                <div className="bg-orange-50 rounded-lg p-4 print:bg-gray-100 print:p-2">
                  <p className="text-sm text-gray-600 mb-1 print-text">
                    Reference Number:
                  </p>
                  <p className="text-3xl font-bold text-orange-600 tracking-wider print-ref-number">
                    {bookingDetails.referenceNumber}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 print-grid">
                {/* Event Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Event Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Event Type</p>
                        <p className="font-medium text-gray-900">
                          {bookingDetails.eventType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Event Date</p>
                        <p className="font-medium text-gray-900">
                          {bookingDetails.eventDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Expected Guests</p>
                        <p className="font-medium text-gray-900">
                          {bookingDetails.guests} guests
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organizer Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Organizer Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Organizer Name</p>
                        <p className="font-medium text-gray-900">
                          {bookingDetails.organizerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">
                          {bookingDetails.organizerEmail}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💰</span>
                      <div>
                        <p className="text-sm text-gray-600">Estimated Total</p>
                        <p className="font-medium text-gray-900">
                          K{bookingDetails.total}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-2xl p-8 mb-8 print:bg-gray-50 print:rounded-none print-section">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 print-subtitle">
                What Happens Next?
              </h3>
              <div className="space-y-3 print-steps">
                <div className="flex items-start gap-3 print-step">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5 print-step-number">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 print-text">
                      Confirmation Call
                    </p>
                    <p className="text-gray-600 print-text">
                      Our events coordinator will contact you within 24 hours to
                      discuss details and confirm availability.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 print-step">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5 print-step-number">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 print-text">
                      Site Visit
                    </p>
                    <p className="text-gray-600 print-text">
                      We&apos;ll schedule a site visit to finalize arrangements
                      and customize the setup to your needs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 print-step">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5 print-step-number">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 print-text">
                      Final Confirmation
                    </p>
                    <p className="text-gray-600 print-text">
                      Once all details are confirmed, we&apos;ll send you a
                      contract and payment information.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 print:shadow-none print:rounded-none print-section">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 print-subtitle">
                Contact Information
              </h3>
              <p className="text-gray-600 mb-4 print-text">
                For any questions or changes, please contact us using your
                reference number:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 print:flex-col print:gap-2">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-600 print:w-4 print:h-4" />
                  <div>
                    <p className="text-sm text-gray-600">Call us</p>
                    <p className="font-medium text-gray-900">+675 472 1234</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email us</p>
                    <p className="font-medium text-gray-900">
                      events@tangmowhotel.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
              <Link href="/" className="w-full sm:w-auto">
                <Button className="w-full bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white px-8 py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                  <Home className="w-5 h-5" />
                  Return to Homepage
                </Button>
              </Link>
              <Button
                onClick={() => window.print()}
                className="w-full sm:w-auto bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="text-lg">🖨️</span>
                Print Confirmation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
