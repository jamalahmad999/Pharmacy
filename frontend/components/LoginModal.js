"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Icons } from "@/components/Icons";

export default function LoginModal({ isOpen, onClose, onLogin, user, alreadyLoggedIn }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("email");
      setEmail("");
      setOtp("");
      setLoading(false);
      setError("");
      setResendTimer(0);
    }
  }, [isOpen]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendOtp = async (emailAddress) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/otp/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddress }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      // In development, show the OTP for testing
      if (data.devOtp) {
        console.info(`🔐 Development OTP for ${emailAddress}: ${data.devOtp}`);
      }

      return data;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const handleSend = async (e) => {
    e && e.preventDefault();
    setError("");
    
    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await sendOtp(email.trim().toLowerCase());
      setStep("otp");
      setResendTimer(60);
      
      if (result.devOtp) {
        console.log(`Development OTP: ${result.devOtp}`);
      }
    } catch (error) {
      setError(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e && e.preventDefault();
    setError("");
    
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/otp/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          otp: otp.trim() 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      // Store user in localStorage
      const user = data.user;
      try {
        localStorage.setItem("lp_user", JSON.stringify(user));
      } catch (e) {
        console.error("Failed to save user to localStorage:", e);
      }

      // Call onLogin callback
      if (typeof onLogin === "function") onLogin(user);

      onClose();
      
      // Welcome message for new users
      if (user.isNewUser) {
        setTimeout(() => {
          alert("Welcome to LifePharmacy! Check your email for exclusive offers.");
        }, 500);
      }
    } catch (error) {
      setError(error.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setError("");
    setLoading(true);
    
    try {
      await sendOtp(email.trim().toLowerCase());
      setResendTimer(60);
      setOtp("");
    } catch (error) {
      setError(error.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseAnother = () => {
    setStep("email");
    setOtp("");
    setError("");
    setResendTimer(0);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={step === "email" ? "Sign in with Email" : "Verify Your Email"} 
      size="sm"
    >
      <div className="space-y-4">
        {alreadyLoggedIn ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Icons.CheckCircle className="w-12 h-12 text-green-600 mb-4" />
            <div className="text-lg font-semibold text-gray-800 mb-2">You are already logged in</div>
            <div className="text-gray-600 mb-4">{user && (user.name || user.email)}</div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-[#002579] to-[#a92579] text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        ) : step === "email" && (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
                <Icons.Mail className="w-5 h-5 text-[#002579]" />
                <p className="text-sm text-gray-700">
                  We'll send you a verification code to your email
                </p>
              </div>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579] transition-colors`}
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <Icons.AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#002579] to-[#a92579] text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending OTP...
                </>
              ) : (
                <>
                  Send Verification Code
                  <Icons.ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg">
                <Icons.CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    We sent a 6-digit code to
                  </p>
                  <p className="text-sm font-semibold text-gray-900">{email}</p>
                </div>
              </div>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                  setError("");
                }}
                placeholder="000000"
                className={`w-full px-4 py-3 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579] text-center text-2xl tracking-widest font-mono transition-colors`}
                maxLength="6"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <Icons.AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <button 
                type="button" 
                onClick={handleUseAnother} 
                className="text-gray-600 hover:text-[#002579] transition-colors flex items-center gap-1"
              >
                <Icons.ArrowLeft className="w-4 h-4" />
                Change email
              </button>
              
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                className="text-[#002579] hover:text-[#a92579] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
              </button>
            </div>
            
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#002579] to-[#a92579] text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <Icons.CheckCircle className="w-5 h-5" />
                  Verify & Sign In
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              Didn't receive the code? Check your spam folder
            </p>
          </form>
        )}
      </div>
    </Modal>
  );
}