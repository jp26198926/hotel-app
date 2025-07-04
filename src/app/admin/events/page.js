"use client";

import { useState } from "react";
import { Plus, Filter, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";
import AdminLayout from "@/components/admin/AdminLayout";

export default function EventsPage() {
  const { showSuccess } = useToast();

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Events Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage event bookings and event types
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Events Management
            </h3>
            <p className="text-gray-600 mb-6">
              Full CRUD interface for events management coming soon.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Event Management
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Manage event types</li>
                  <li>• Book and schedule events</li>
                  <li>• Set pricing packages</li>
                  <li>• Coordinate catering</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
