"use client";

import { CheckCircle, Circle } from "lucide-react";

const Stepper = ({
  steps,
  currentStep,
  variant = "default",
  orientation = "horizontal",
  showLabels = true,
  className = "",
}) => {
  const getStepState = (stepIndex) => {
    if (currentStep > stepIndex) return "completed";
    if (currentStep === stepIndex) return "active";
    return "inactive";
  };

  const getStepStyles = (state) => {
    switch (state) {
      case "completed":
        return "bg-gradient-to-r from-orange-600 to-yellow-600 text-white border-orange-600";
      case "active":
        return "bg-white border-orange-600 text-orange-600 ring-4 ring-orange-100";
      case "inactive":
        return "bg-gray-100 border-gray-300 text-gray-400";
      default:
        return "";
    }
  };

  const getConnectorStyles = (stepIndex) => {
    const isCompleted = currentStep > stepIndex;
    return isCompleted
      ? "bg-gradient-to-r from-orange-600 to-yellow-600"
      : "bg-gray-200";
  };

  const getLabelStyles = (state) => {
    switch (state) {
      case "completed":
        return "text-orange-600 font-semibold";
      case "active":
        return "text-orange-600 font-semibold";
      case "inactive":
        return "text-gray-500";
      default:
        return "";
    }
  };

  if (orientation === "vertical") {
    return (
      <div className={`flex flex-col space-y-4 ${className}`}>
        {steps.map((step, index) => {
          const state = getStepState(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex items-start">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStepStyles(
                    state
                  )}`}
                >
                  {state === "completed" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-8 mt-2 transition-all duration-300 ${getConnectorStyles(
                      index
                    )}`}
                  />
                )}
              </div>
              {showLabels && (
                <div className="ml-4 flex-1">
                  <div
                    className={`text-sm font-medium transition-all duration-300 ${getLabelStyles(
                      state
                    )}`}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal stepper
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const state = getStepState(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStepStyles(
                    state
                  )}`}
                >
                  {state === "completed" ? (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold">
                      {index + 1}
                    </span>
                  )}
                </div>
                {showLabels && (
                  <div className="mt-2 text-center">
                    <div
                      className={`text-xs sm:text-sm font-medium transition-all duration-300 ${getLabelStyles(
                        state
                      )}`}
                    >
                      {step.title}
                    </div>
                    {step.description && (
                      <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                        {step.description}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {!isLast && (
                <div className="flex-1 mx-2 sm:mx-4">
                  <div
                    className={`h-0.5 sm:h-1 transition-all duration-300 ${getConnectorStyles(
                      index
                    )}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
