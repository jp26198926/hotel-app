"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  minDate,
  isCheckOut = false,
  checkInDate,
  className = "",
  label,
  size = "md", // "sm", "md", "lg"
  popupPosition = "auto", // "auto", "left", "right", "center"
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const calendarRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input click
  const handleInputClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setShowCalendar((prev) => !prev);
      }
    },
    [disabled]
  );

  // Get calendar position classes
  const getCalendarPositionClasses = () => {
    switch (popupPosition) {
      case "left":
        return "left-0 w-80";
      case "right":
        return "right-0 w-80";
      case "center":
        return "left-1/2 transform -translate-x-1/2 w-80";
      case "auto":
      default:
        // For small size (usually in constrained containers), use center positioning with fixed width
        if (size === "sm") {
          return "left-1/2 transform -translate-x-1/2 w-80";
        }
        // For larger sizes, use full width of container
        return "left-0 right-0 min-w-80";
    }
  };

  // Datepicker utility functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push({
        date: currentDate,
        isCurrentMonth: currentDate.getMonth() === month,
      });
    }
    return days;
  };

  const formatDateForInput = (date) => {
    // Use local timezone to avoid date shifting
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (dateString) => {
    // Parse the date string safely without timezone conversion
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const navigateMonth = (direction) => {
    setCalendarMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if date is before minimum date
    if (minDate) {
      const [minYear, minMonth, minDay] = minDate.split("-");
      const minDateObj = new Date(minYear, minMonth - 1, minDay);
      if (date < minDateObj) {
        return true;
      }
    }

    // For check-out dates, ensure it's after check-in date
    if (isCheckOut && checkInDate) {
      const [checkInYear, checkInMonth, checkInDay] = checkInDate.split("-");
      const checkInDateObj = new Date(
        checkInYear,
        checkInMonth - 1,
        checkInDay
      );
      return date <= checkInDateObj;
    }

    // Don't allow past dates
    return date < today;
  };

  const handleDateSelect = (date) => {
    const formattedDate = formatDateForInput(date);
    onChange(formattedDate);
    setShowCalendar(false);
  };

  // Size variants
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  // Calendar Component
  const CalendarPopup = () => {
    const days = getDaysInMonth(calendarMonth);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h3 className="font-semibold text-gray-800">
            {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
          </h3>
          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-xs font-medium text-gray-500 bg-gray-50"
            >
              {day}
            </div>
          ))}

          {days.map((dayObj, index) => {
            const isSelected =
              value && formatDateForInput(dayObj.date) === value;
            const isDisabled = isDateDisabled(dayObj.date);
            const isToday =
              formatDateForInput(dayObj.date) ===
              formatDateForInput(new Date());

            return (
              <button
                key={index}
                type="button"
                onClick={() => !isDisabled && handleDateSelect(dayObj.date)}
                className={`p-3 text-sm text-center transition-all duration-200 relative ${
                  !dayObj.isCurrentMonth
                    ? "text-gray-300 hover:bg-gray-50"
                    : isDisabled
                    ? "text-gray-300 cursor-not-allowed"
                    : isSelected
                    ? "bg-red-700 text-white font-semibold"
                    : isToday
                    ? "bg-red-100 text-red-700 font-medium hover:bg-red-200"
                    : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                }`}
                disabled={isDisabled}
              >
                {dayObj.date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={calendarRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="h-4 w-4 inline mr-1" />
          {label}
        </label>
      )}

      <div
        onClick={handleInputClick}
        className={`w-full border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all duration-200 cursor-pointer bg-gray-50 flex items-center justify-between hover:border-red-300 hover:shadow-md date-picker-container ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${sizeClasses[size]}`}
      >
        <input
          type="text"
          readOnly
          value={value ? formatDateForDisplay(value) : ""}
          className="flex-1 bg-transparent border-none outline-none cursor-pointer text-gray-800 font-medium placeholder:text-gray-500"
          placeholder={placeholder}
          disabled={disabled}
        />
        <Calendar className={`text-gray-400 ml-2 ${iconSizes[size]}`} />
      </div>

      {showCalendar && (
        <div
          className={`absolute top-full mt-2 z-[9999] ${getCalendarPositionClasses()}`}
        >
          <CalendarPopup />
        </div>
      )}
    </div>
  );
}
