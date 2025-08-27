"use client";

import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Bot, Shield, Clock } from "lucide-react";
import { authAPI, apiUtils } from '@/lib/apiService';


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError("");
  };

  // Countdown timer for resend OTP
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Send OTP for registration
  const sendOTP = async () => {
    try {
      setLoading(true);
      setError("");

      // First validate the form data using the registration API
      const validationResponse = await authAPI.registerSendOTP({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (!validationResponse.success) {
        setError(validationResponse.message);
        return;
      }

      // If validation passes, send OTP
      const otpResponse = await authAPI.sendOTP(
        formData.email,
        'registration',
        formData.name
      );

      if (otpResponse.success) {
        setShowOTPInput(true);
        setOtpSent(true);
        setSuccess('Verification code sent to your email! Please check your inbox.');
        setCountdown(60);
      } else {
        setError(otpResponse.message);
      }
    } catch (error) {
      setError(apiUtils.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        setSuccess('Login successful! Welcome back.');
        // Store user data or redirect
        localStorage.setItem('user', JSON.stringify(response.user));
        // Redirect to dashboard or home page
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(apiUtils.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  // Handle registration with OTP verification
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!showOTPInput) {
      // Send OTP first
      await sendOTP();
      return;
    }

    // Complete registration with OTP
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await authAPI.registerComplete({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: formData.otp
      });

      if (response.success) {
        setSuccess('Account created successfully! Welcome to GROBOTS!');
        // Store user data and redirect
        localStorage.setItem('user', JSON.stringify(response.user));
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(apiUtils.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      setLoading(true);
      const response = await authAPI.sendOTP(
        formData.email,
        'registration',
        formData.name
      );

      if (response.success) {
        setSuccess('New verification code sent!');
        setCountdown(60);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(apiUtils.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  // Reset form when switching between login/register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "", otp: "" });
    setShowOTPInput(false);
    setOtpSent(false);
    setError("");
    setSuccess("");
    setCountdown(0);
  };


  return (
    <div className="min-h-screen bg-background py-20 ml-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Content Card */}
        <div className="bg-themed-card rounded-3xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Side - Branding */}
            <div className="bg-secondary p-12 flex flex-col justify-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-6">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl font-light text-primary-foreground mb-4 leading-tight">
                  Welcome to the<br />future of robotics
                </h1>
                <p className="text-primary-foreground/80 text-lg leading-relaxed">
                  Join GROBOTS and become part of a community that's building tomorrow's technology today.
                </p>
              </div>
              
              {/* Feature List */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-secondary-foreground rounded-full"></div>
                  <span className="text-secondary-foreground/80 text-sm">Access to exclusive workshops</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-secondary-foreground rounded-full"></div>
                  <span className="text-secondary-foreground/80 text-sm">Collaborate on cutting-edge projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-secondary-foreground rounded-full"></div>
                  <span className="text-secondary-foreground/80 text-sm">Network with industry professionals</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-secondary-foreground rounded-full"></div>
                  <span className="text-secondary-foreground/80 text-sm">Participate in competitions</span>
                </div>
              </div>
            </div>
            
            {/* Right Side - Auth Form */}
            <div className="p-12 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-xs text-themed-muted uppercase tracking-wider font-semibold">
                    {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
                  </span>
                </div>
                <h2 className="text-3xl font-light text-foreground mb-4">
                  {isLogin ? "Welcome back" : "Get started"}
                </h2>
                <p className="text-themed-muted">
                  {isLogin ? "Enter your credentials to access your account" : "Create your account to join our community"}
                </p>
              </div>

              <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-themed-muted" />
                      <input
                        type="text"
                        name="name"
                        required={!isLogin}
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-themed-accent border border-themed-border text-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
                        placeholder="Enter your full name"
                        autoComplete="name"
                        disabled={showOTPInput}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-themed-muted" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-themed-accent border border-themed-border text-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
                      placeholder="Enter your email"
                      autoComplete="email"
                      disabled={showOTPInput && !isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-themed-muted" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-themed-accent border border-themed-border text-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
                      placeholder="Enter your password"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      disabled={showOTPInput && !isLogin}
                    />
                  </div>
                </div>

                {showOTPInput && !isLogin && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Verification Code
                      <span className="text-themed-muted text-xs ml-2">(Check your email)</span>
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-themed-muted" />
                      <input
                        type="text"
                        name="otp"
                        required
                        value={formData.otp}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-themed-accent border border-themed-border text-foreground focus:outline-none focus:border-primary focus:bg-background transition-all text-center text-xl tracking-widest"
                        placeholder="000000"
                        maxLength="6"
                        pattern="[0-9]{6}"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-themed-muted">
                        <Clock className="w-4 h-4" />
                        <span>Code expires in 10 minutes</span>
                      </div>
                      <button
                        type="button"
                        onClick={resendOTP}
                        disabled={countdown > 0 || loading}
                        className="text-primary hover:underline disabled:text-themed-muted disabled:no-underline"
                      >
                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 dark:bg-red-900/20 dark:border-red-700/30">
                    <p className="text-red-600 text-sm dark:text-red-400">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 dark:bg-green-900/20 dark:border-green-700/30">
                    <p className="text-green-600 text-sm dark:text-green-400">{success}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-semibold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {isLogin 
                        ? "Sign In" 
                        : showOTPInput 
                          ? "Complete Registration" 
                          : "Send Verification Code"
                      }
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-themed-muted text-sm">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    className="ml-2 text-primary font-semibold hover:underline"
                    onClick={toggleAuthMode}
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>

              {/* Additional Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    SECURE & TRUSTED
                  </p>
                  <div className="flex justify-center items-center gap-4 text-xs text-gray-400">
                    <span>Privacy Protected</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>Data Encrypted</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 