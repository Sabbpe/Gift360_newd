import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Mail, AlertCircle, CheckCircle, Smartphone, User, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRegisterSendOtp } from "@/hooks/useRegisterSendOtp";
import { useRegisterVerifyOtp } from "@/hooks/useRegisterVerifyOtp";
import { useAuthContext } from "@/contexts/AuthContext";
import { decodeJwtPayload } from "@/api/authApi";

export default function Register() {
  const [, setLocation] = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const registerSendOtpMutation = useRegisterSendOtp();
  const registerVerifyOtpMutation = useRegisterVerifyOtp();
  const { setUser } = useAuthContext();
  const { toast } = useToast();

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validateMobile = (m: string) => /^[0-9]{10}$/.test(m);
  const validateOtp = (o: string) => /^[0-9]{4,6}$/.test(o);

  const validateForm = () => {
    let valid = true;
    setError(""); setNameError(""); setEmailError(""); setMobileError("");
    if (!fullName.trim()) { setNameError("Full name is required"); valid = false; }
    if (!email.trim()) { setEmailError("Email is required"); valid = false; }
    else if (!validateEmail(email)) { setEmailError("Please enter a valid email"); valid = false; }
    if (!mobile.trim()) { setMobileError("Mobile number is required"); valid = false; }
    else if (!validateMobile(mobile)) { setMobileError("Please enter a valid 10-digit mobile number"); valid = false; }
    return valid;
  };

  const handleSendOtp = () => {
    if (!validateForm()) return;
    setOtp(""); setOtpSent(false);
    registerSendOtpMutation.mutate({ mobileNumber: mobile, email }, {
      onSuccess: (data) => {
        if (data.alreadyRegistered) { toast({ title:"Already registered", description:"This mobile is already registered. Please login.", variant:"destructive", duration:4000 }); setTimeout(() => setLocation("/login"), 2000); return; }
        if (data.success) { setOtpSent(true); toast({ title:"OTP Sent!", description:data.message||"OTP sent to your mobile", duration:3000 }); }
      },
      onError: (err: any) => toast({ title:"Error", description:err.response?.data?.message||"Failed to send OTP", variant:"destructive" })
    });
  };

  const handleVerifyOtp = () => {
    if (!validateOtp(otp)) { toast({ title:"Invalid OTP", description:"Please enter a valid 4-6 digit OTP", variant:"destructive" }); return; }
    if (!validateForm()) return;
    registerVerifyOtpMutation.mutate({ fullName, email, mobileNumber: mobile, otp }, {
      onSuccess: (data) => {
        if (data.success && data.token) {
          const payload = decodeJwtPayload(data.token);
          setUser({ name:fullName, email, mobile, token:data.token, clientId:payload.userId??"" });
          toast({ title:"Welcome to Gift360!", description:"Account created successfully", duration:3000 });
          setTimeout(() => setLocation("/"), 400);
        }
      },
      onError: (err: any) => toast({ title:"Error", description:err.response?.data?.message||"Invalid OTP. Try again.", variant:"destructive" })
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{background:"linear-gradient(160deg,hsl(var(--primary)) 0%,hsl(262 80% 45%) 55%,#7c3aed 100%)"}}>
      <div className="flex flex-col items-center pt-10 pb-4 px-8 g-fade-up">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 g-float"
          style={{background:"rgba(255,255,255,.18)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,.3)"}}>
          <Gift size={34} color="white" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Create Account</h1>
        <p className="text-white/75 text-sm mt-1 font-medium">Join Gift360 today</p>
      </div>

      <div className="flex-1 bg-white rounded-t-[2.5rem] px-6 py-7 g-slide-up shadow-g-card-lg overflow-y-auto">
        <h2 className="text-xl font-extrabold text-foreground mb-5">Sign Up</h2>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
            <AlertCircle size={16} className="shrink-0" /><span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Enter your full name" value={fullName}
                onChange={e => { setFullName(e.target.value); setNameError(""); }}
                disabled={otpSent} className="pl-10 h-11 rounded-2xl border-border/60 font-medium" />
            </div>
            {nameError && <p className="text-red-500 text-xs mt-1 font-medium">{nameError}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="email" placeholder="Enter your email" value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                disabled={otpSent} className="pl-10 h-11 rounded-2xl border-border/60 font-medium" />
            </div>
            {emailError && <p className="text-red-500 text-xs mt-1 font-medium">{emailError}</p>}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">Mobile Number</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <span className="absolute left-9 top-1/2 -translate-y-1/2 text-foreground font-semibold text-sm pointer-events-none z-10">+91</span>
                <Input type="tel" placeholder="10-digit number" value={mobile} maxLength={10}
                  onChange={e => { if (!/^[0-9]*$/.test(e.target.value)) return; setMobile(e.target.value); setMobileError(""); }}
                  disabled={otpSent} className="pl-14 h-11 rounded-2xl border-border/60 font-medium" />
              </div>
              <Button type="button" onClick={handleSendOtp}
                disabled={!validateMobile(mobile)||!validateEmail(email)||!fullName.trim()||registerSendOtpMutation.isPending||otpSent}
                className={`h-11 px-3 rounded-2xl font-bold text-xs whitespace-nowrap ${otpSent?"bg-green-500 hover:bg-green-600":""}`}>
                {registerSendOtpMutation.isPending?"Sending...":otpSent?"✓ Sent":"Send OTP"}
              </Button>
            </div>
            {mobileError && <p className="text-red-500 text-xs mt-1 font-medium">{mobileError}</p>}
            {otpSent && !mobileError && (
              <p className="text-green-600 text-xs mt-1 font-medium flex items-center gap-1">
                <CheckCircle size={12} />OTP sent successfully
              </p>
            )}
          </div>

          {/* OTP */}
          {otpSent && (
            <div className="g-scale-in">
              <label className="block text-sm font-bold text-foreground mb-1.5">Enter OTP</label>
              <div className="flex gap-2">
                <Input type="text" placeholder="4-6 digit OTP" value={otp} maxLength={6}
                  onChange={e => { if (!/^[0-9]*$/.test(e.target.value)) return; setOtp(e.target.value); }}
                  className="h-11 rounded-2xl border-border/60 font-bold text-lg tracking-widest" />
                <Button type="button" onClick={handleVerifyOtp}
                  disabled={!validateOtp(otp)||registerVerifyOtpMutation.isPending}
                  className="h-11 px-3 rounded-2xl font-bold text-xs whitespace-nowrap">
                  {registerVerifyOtpMutation.isPending?"Verifying...":"Verify"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Already have an account?{" "}
            <Link href="/login"><button className="font-bold text-primary hover:underline">Sign in</button></Link>
          </p>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4 font-medium">
          By creating an account, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
