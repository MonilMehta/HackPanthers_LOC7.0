// Signup.jsx
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, UserCircle, Phone, Key, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const Signup = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    role: "",
    serviceId: "",
    otp: ""
  });
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOTP = () => {
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError("Please enter a valid Indian mobile number");
      return;
    }
    setIsOtpSent(true);
    setCountdown(30);
    setError("");
    // Mock OTP send
    console.log("OTP sent to", formData.phone);
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.phone || !formData.role || !formData.otp) {
      setError("All fields are required");
      return false;
    }
    if (formData.otp.length !== 6) {
      setError("Invalid OTP");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = "secure-token-" + Date.now();
    login(token, formData.role);
    console.log("Signup successful", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white py-12">
      <div className="w-full max-w-2xl p-8">
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
          <p className="text-slate-400 mt-2">Join Our Security Network</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit} 
          className="space-y-6 backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Full Name</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  disabled={isOtpSent}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-2 bg-white/5 border-white/10 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select Role</option>
                <option value="Police Officer">Police Officer</option>
                <option value="Supervisor/Manager">Supervisor/Manager</option>
                <option value="Citizen/Public">Citizen/Public</option>
              </select>
            </div>

            {(formData.role === "Police Officer" || formData.role === "Supervisor/Manager") && (
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Service ID</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    placeholder="Enter Service ID"
                  />
                </div>
              </div>
            )}
          </div>

          {!isOtpSent ? (
            <Button
              type="button"
              onClick={handleSendOTP}
              className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600"
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
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
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
              <Button type="submit" className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600">
                Register
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
          Already have an account? <a href="/login" className="text-teal-400 hover:text-teal-300">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;