import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

// Mock user data - in a real app, this would come from authentication
const mockUser = {
  name: "John Doe",
  email: "john@hotelms.com",
  role: "manager",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={mockUser} />

      <div className="lg:pl-64">
        <Header user={mockUser} />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
