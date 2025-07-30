"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/auth';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center py-6 px-8 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-600">Burbly</h1>
        <nav className="space-x-4">
          {user ? (
            <span className="text-gray-700 font-medium">Hello, {user.username}!</span>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                Login
              </Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-gray-900 mb-4"
        >
          Your Daily Entertainment Planner
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-lg text-gray-600 leading-relaxed mb-8"
        >
          Burbly helps you discover fun activities, events, and places tailored to your tastes every day. 
          From local events to personalized recommendations, we've got your next adventure covered.
        </motion.p>
        <div className="space-x-4">
          <Link href="/signup" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Get Started
          </Link>
          <Link href="/learn-more" className="text-blue-600 font-medium hover:underline">
            Learn More
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-10">Why Choose Burbly?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-gray-50 rounded-xl shadow-lg">
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Personalized Picks</h4>
              <p className="text-gray-600">Get recommendations tailored to your interests and past activities.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-gray-50 rounded-xl shadow-lg">
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Local Events</h4>
              <p className="text-gray-600">Discover nearby events, concerts, and meetups happening today.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-gray-50 rounded-xl shadow-lg">
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Plan & Share</h4>
              <p className="text-gray-600">Organize your daily plans and share fun activities with friends.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 text-sm bg-gray-50">
        © {new Date().getFullYear()} Burbly. All rights reserved.
      </footer>
    </div>
  );
}

// Ensure you have installed framer-motion: npm install framer-motion
