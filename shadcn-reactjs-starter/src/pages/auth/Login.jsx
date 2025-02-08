// Login.jsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Phone, Key, ArrowRight } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const Login = () => {
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid Indian mobile number");
      return;
    }
    setIsOtpSent(true);
    setCountdown(30);
    setError("");
    // Mock OTP send
    console.log("OTP sent to", phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || !otp) {
      setError("All fields are required");
      return;
    }
    if (otp.length !== 6) {
      setError("Invalid OTP");
      return;
    }
    // Mock authentication
    const token = "secure-token-" + Date.now();
    login(token, "Citizen/Public");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <div className="w-full max-w-md p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-3 rounded-2xl bg-gradient-to-tr from-teal-400/20 to-blue-500/20 backdrop-blur-xl mb-4">
            <Shield className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            SurakshaSetu
          </h1>
          <p className="text-slate-400 mt-2">Connecting Communities, Ensuring Safety</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit} 
          className="space-y-6 backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10"
        >
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                disabled={isOtpSent}
              />
            </div>
          </div>

          {!isOtpSent ? (
            <Button
              type="button"
              onClick={handleSendOTP}
              className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white transition-all duration-300"
            >
              Send OTP
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Enter OTP</label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                </div>
                {countdown > 0 ? (
                  <p className="text-sm text-slate-400">Resend OTP in {countdown}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="text-sm text-teal-400 hover:text-teal-300"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600"
              >
                Verify & Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </motion.form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account? <a href="/signup" className="text-teal-400 hover:text-teal-300">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;