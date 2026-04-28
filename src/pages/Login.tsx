import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { AlertCircle, Smartphone, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendOtp } from "@/hooks/useSendOtp";
import { useLoginWithOtp } from "@/hooks/useLoginWithOtp";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const isSessionExpired = searchParams.includes("session=expired");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpMsg, setOtpMsg] = useState("");
  const sendOtpMutation = useSendOtp();
  const loginWithOtpMutation = useLoginWithOtp();
  const { setUser } = useAuthContext();
  const { toast } = useToast();

  useEffect(() => {
    if (isSessionExpired) {
      const t = setTimeout(() => window.history.replaceState({}, '', '/login'), 5000);
      return () => clearTimeout(t);
    }
  }, [isSessionExpired]);

  const validateMobile = (m: string) => /^[0-9]{10}$/.test(m);
  const validateOtp = (o: string) => /^[0-9]{4,6}$/.test(o);

  const handleSendOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    setError(""); setOtpMsg(""); setOtpSent(false); setOtp("");
    if (!mobile.trim()) { setMobileError("Mobile number is required"); return; }
    if (!validateMobile(mobile)) { setMobileError("Please enter a valid 10-digit mobile number"); return; }
    setMobileError("");
    sendOtpMutation.mutate({ mobileNumber: mobile, email: email.trim() }, {
      onSuccess: (data) => {
        if (data.notRegistered) { setError("Mobile number not registered. Please register first."); return; }
        if (data.success) { setOtpSent(true); setOtpMsg(data.message || "OTP sent successfully"); toast({ title:"OTP sent", description:data.message||"OTP sent to your mobile", duration:3000 }); }
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || err?.response?.data || "Failed to send OTP";
        setError(typeof msg === "string" ? msg : "Failed to send OTP");
      }
    });
  };

  const handleOtpLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");
    if (!validateMobile(mobile)) { setError("Please enter a valid mobile number"); return; }
    if (!validateOtp(otp)) { setError("Please enter a valid 4-6 digit OTP"); return; }
    loginWithOtpMutation.mutate({ mobileNumber: mobile.trim(), otp, email: email.trim() }, {
      onSuccess: (data) => {
        if (data.token && data.userInfo) {
          setUser({ name:data.userInfo.name, email:data.userInfo.email, mobile:data.userInfo.mobile, token:data.token, clientId:data.userInfo.clientId });
          toast({ title:"Welcome back!", description:data.message||"Login successful", duration:3000 });
          setTimeout(() => setLocation("/"), 400);
        } else { setError(data.message || "OTP login failed"); }
      },
      onError: (err: any) => {
        const d = err?.response?.data;
        const msg = typeof d === "string" ? d : d?.message || "OTP login failed. Please try again.";
        setError(msg);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{background:"linear-gradient(160deg,hsl(var(--primary)) 0%,hsl(262 80% 45%) 55%,#7c3aed 100%)"}}>
      {/* Top branding */}
      <div className="flex flex-col items-center pt-12 pb-6 px-8 g-fade-up">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 g-float"
          style={{background:"rgba(255,255,255,.18)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,.3)"}}>
          <Gift size={42} color="white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">{isSessionExpired ? "Session Expired" : "Welcome Back"}</h1>
        <p className="text-white/75 text-sm mt-1 font-medium">{isSessionExpired ? "Please login to continue" : "Sign in to Gift360"}</p>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-t-[2.5rem] px-6 py-8 g-slide-up shadow-g-card-lg">
        <h2 className="text-2xl font-extrabold text-foreground mb-6">Sign In</h2>

        {isSessionExpired && (
          <div className="flex items-center gap-2 p-4 mb-5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm font-medium">
            <AlertCircle size={18} className="shrink-0" />
            <span>Your session has expired. Please login again.</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 mb-5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">Email</label>
            <Input type="email" placeholder="Enter your registered email" value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              disabled={otpSent} className="h-12 rounded-2xl border-border/60 font-medium" />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">Mobile Number</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <span className="absolute left-10 top-1/2 -translate-y-1/2 text-foreground font-semibold text-sm pointer-events-none z-10">+91</span>
                <Input type="tel" placeholder="10-digit mobile number" value={mobile} maxLength={10}
                  onChange={e => { if (!/^[0-9]*$/.test(e.target.value)) return; setMobile(e.target.value); setMobileError(""); setError(""); }}
                  disabled={otpSent} className="pl-16 h-12 rounded-2xl border-border/60 font-medium" />
              </div>
              <Button type="button" onClick={handleSendOtp}
                disabled={!validateMobile(mobile) || sendOtpMutation.isPending || otpSent}
                className={`h-12 px-4 rounded-2xl font-bold text-sm whitespace-nowrap ${otpSent ? "bg-green-500 hover:bg-green-600" : ""}`}>
                {sendOtpMutation.isPending ? "Sending..." : otpSent ? "✓ Sent" : "Send OTP"}
              </Button>
            </div>
            {mobileError && <p className="text-red-500 text-xs mt-1 font-medium">{mobileError}</p>}
            {otpMsg && otpSent && <p className="text-green-600 text-xs mt-1 font-medium">✓ {otpMsg}</p>}
          </div>

          {/* OTP */}
          {otpSent && (
            <div className="g-scale-in">
              <label className="block text-sm font-bold text-foreground mb-1.5">Enter OTP</label>
              <div className="flex gap-2">
                <Input type="text" placeholder="4-6 digit OTP" value={otp} maxLength={6}
                  onChange={e => { if (!/^[0-9]*$/.test(e.target.value)) return; setOtp(e.target.value); setError(""); }}
                  className="h-12 rounded-2xl border-border/60 font-bold text-lg tracking-widest" />
                <Button type="button" onClick={handleOtpLogin}
                  disabled={!validateOtp(otp) || loginWithOtpMutation.isPending}
                  className="h-12 px-4 rounded-2xl font-bold text-sm whitespace-nowrap">
                  {loginWithOtpMutation.isPending ? "Verifying..." : "Verify & Login"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Don't have an account?{" "}
            <Link href="/register">
              <button className="font-bold text-primary hover:underline">Sign up</button>
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-medium">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
