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
    <div className="min-h-screen flex items-center justify-center bg-black p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {/* Signup Form */}
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
      </div>
    </div>
  );
}
