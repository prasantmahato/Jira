import React, { useEffect, useRef, useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    // Simulate API call
    setTimeout(() => {
      const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      setSuccess(`Password reset link sent to ${email} at ${now} IST. Check your inbox.`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white border border-gray-200 shadow-sm rounded-md p-6 w-full max-w-md">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Forgot Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailRef}
                className={`mt-1 w-full border ${
                  error ? 'border-red-300' : 'border-gray-200'
                } rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200`}
                aria-label="Email address"
                aria-describedby={error ? 'email-error' : undefined}
              />
              {error && (
                <p id="email-error" className="text-xs text-red-600 mt-1" aria-live="polite">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm text-green-600 mt-2" aria-live="polite">
                  {success}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
              aria-label="Request password reset"
            >
              Send Reset Link
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            <a href="/login" className="text-blue-600 hover:text-blue-700">Back to Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;