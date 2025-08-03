"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Services");

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/burbly-logo.png" alt="Burbly" className="h-6" />
        </div>

        {/* Nav Tabs */}
        <div className="flex items-center gap-6 text-gray-700">
          {[
            { label: "Homes", icon: "🏠" },
            { label: "Experiences", icon: "🎈", new: true },
            { label: "Services", icon: "🛎️", new: true },
          ].map((tab) => (
            <div
              key={tab.label}
              className={`relative flex items-center gap-1 cursor-pointer ${
                activeTab === tab.label ? "font-semibold text-black" : ""
              }`}
              onClick={() => setActiveTab(tab.label)}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.new && (
                <span className="absolute -top-2 -right-3 bg-blue-500 text-white text-xs px-1 rounded">
                  NEW
                </span>
              )}
              {activeTab === tab.label && (
                <div className="absolute bottom-[-8px] left-0 right-0 h-[2px] bg-black" />
              )}
            </div>
          ))}
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-gray-700">Switch to hosting</p>
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
            Y
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-xl">≡</span>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="flex items-center justify-center px-6 pb-4">
        <div className="flex w-full max-w-3xl divide-x divide-gray-300 rounded-full border border-gray-300 shadow-sm">
          {/* Where */}
          <div className="flex-1 px-4 py-3">
            <p className="text-sm font-semibold">Where</p>
            <p className="text-sm text-gray-500">Search destinations</p>
          </div>

          {/* Date */}
          <div className="flex-1 px-4 py-3">
            <p className="text-sm font-semibold">Date</p>
            <p className="text-sm text-gray-500">Add dates</p>
          </div>

          {/* Type of service */}
          <div className="flex-1 px-4 py-3">
            <p className="text-sm font-semibold">Type of service</p>
            <p className="text-sm text-gray-500">Add service</p>
          </div>

          {/* Search Button */}
          <div className="p-3 pr-4">
            <div className="bg-rose-500 rounded-full p-3 text-white">
              <FaSearch size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
