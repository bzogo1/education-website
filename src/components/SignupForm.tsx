"use client";

import { useState } from 'react';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgDark1 p-4 md:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side - Signup Form */}
        <div className="flex flex-col justify-center bg-bgDark2/50 border border-mainBorderSubtler rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primaryText mb-2">
              Create your account
            </h1>
            <p className="text-secondaryText text-sm md:text-base">
              Join thousands of learners and start your educational journey today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primaryText mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primaryText mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primaryText mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-primaryText mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              className="contained-button w-full h-12 text-base font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(145,198,255,0.3)]"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-secondaryText text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-primaryColor hover:text-secondaryColor transition-colors">
                Log in
              </a>
            </p>
          </div>
        </div>

        {/* Right Side - Image with content */}
        <div className="relative rounded-2xl overflow-hidden border border-mainBorderSubtler">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-bgDark1/90 via-bgDark1/70 to-bgDark2/80" />

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-12 min-h-[500px]">
            {/* Profile Picture and Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-primaryColor/30 overflow-hidden flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-primaryText">
                  Welcome to Learning
                </h2>
                <p className="text-secondaryColor text-sm font-medium mt-1">
                  Your journey starts here
                </p>
              </div>
            </div>

            {/* Subtext */}
            <div className="space-y-4">
              <p className="text-primaryText text-base md:text-lg leading-relaxed">
                Discover a world of knowledge with our comprehensive learning platform. 
                Access courses, connect with instructors, and achieve your educational goals.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="badge-primary">Expert Instructors</span>
                <span className="badge-primary">Interactive Courses</span>
                <span className="badge-primary">Community Support</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-mainBorderSubtler">
              <p className="text-secondaryText text-sm">
                Join over 10,000+ students already learning with us
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
