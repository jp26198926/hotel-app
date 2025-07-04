"use client";

import AdminLayout from "@/components/admin/AdminLayout";

export default function RestaurantOrdersPage() {
  return (
    <AdminLayout title="Orders" description="Manage restaurant orders">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Orders Management
          </h3>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>
    </AdminLayout>
  );
}
