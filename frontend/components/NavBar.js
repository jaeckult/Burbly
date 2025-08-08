"use client";
import { useState } from "react";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("For you");

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/burbly-logo.png" alt="Burbly" className="h-8" />
          <span className="text-2xl font-bold text-white">Burbly</span>
        </div>

        {/* Nav Tabs */}
        <div className="flex items-center gap-8">
          {[
            { label: "For you", icon: "🏠" },
            { label: "Generate Plan", icon: "🎈", new: true },
            { label: "Collection", icon: "🛎️", new: true },
          ].map((tab) => (
            <div
              key={tab.label}
              className={`relative flex items-center gap-2 cursor-pointer transition-all duration-200 px-2 py-1 rounded ${
                activeTab === tab.label
                  ? "text-white font-semibold bg-blue-600"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              }`}
              onClick={() => setActiveTab(tab.label)}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
              {tab.new && (
                <span className="absolute -top-2 -right-3 bg-blue-500 text-white text-xs px-1 rounded-full">
                  NEW
                </span>
              )}
              {activeTab === tab.label && (
                <div className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-blue-400" />
              )}
            </div>
          ))}
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-gray-200 hover:text-white">
            Switch to hosting
          </p>
          <div className="w-8 h-8 bg-white/10 text-white rounded-full flex items-center justify-center backdrop-blur-sm">
            Y
          </div>
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-white text-lg">≡</span>
          </div>
        </div>

      </div>
    </div>
  );
}
