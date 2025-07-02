"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Hotel,
  Calendar,
  Users,
  UtensilsCrossed,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Rooms", href: "/rooms", icon: Hotel },
  { name: "Bookings", href: "/bookings", icon: Calendar },
  { name: "Guests", href: "/guests", icon: Users },
  { name: "Restaurant", href: "/restaurant", icon: UtensilsCrossed },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-900/80"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <SidebarContent
            pathname={pathname}
            onClose={() => setSidebarOpen(false)}
            user={user}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 shadow-lg">
          <SidebarContent pathname={pathname} user={user} />
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          Hotel Management
        </div>
        <div className="flex items-center gap-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <Bell className="h-5 w-5" />
          </button>
          <div className="h-6 w-6 rounded-full bg-gray-300" />
        </div>
      </div>
    </>
  );
}

function SidebarContent({ pathname, onClose, user }) {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Hotel className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">HotelMS</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          <li className="mt-auto">
            <div className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm">{user?.name || "User"}</span>
                <span className="text-xs text-gray-500 capitalize">
                  {user?.role || "Guest"}
                </span>
              </div>
            </div>
            <button className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-red-600">
              <LogOut className="h-6 w-6 shrink-0" />
              Sign out
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
