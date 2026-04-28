import { useState, useEffect } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoImg from "@/attached_assets/generated_images/logo.png";
import { useToast } from "@/hooks/use-toast";
import { useResetPassword } from "@/hooks/useResetPassword";
import { useValidateResetToken } from "@/hooks/useValidateResetToken";
import axios from "axios";

type TokenStatus = "loading" | "valid" | "invalid" | "expired" | "used";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const { toast } = useToast();

  // Extract token from URL
  const token = new URLSearchParams(searchParams).get("token") || "";

  // Form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Validation state
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("loading");
  const [success, setSuccess] = useState(false);

  const validateTokenMutation = useValidateResetToken();
  const resetPasswordMutation = useResetPassword();

  // Validate token on page load
  useEffect(() => {
    if (!token) {
      setTokenStatus("invalid");
      return;
    }

    validateTokenMutation.mutate(
      { token },
      {
        onSuccess: (data) => {
          if (data.status === "VALID") {
            setTokenStatus("valid");
          } else if (data.status === "EXPIRED") {
            setTokenStatus("expired");
          } else if (data.status === "ALREADY_USED") {
            setTokenStatus("used");
          } else {
            setTokenStatus("invalid");
          }
        },
        onError: () => {
          setTokenStatus("invalid");
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    setError("");
    const validationError = validatePassword(value);
    setPasswordError(validationError);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword) {
      setError("Password is required");
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate(
      { token, newPassword },
      {
        onSuccess: (data) => {
          if (data.success) {
            setSuccess(true);
            toast({
              title: "Password Reset Successful",
              description: "You can now login with your new password",
              duration: 5000,
            });
            setTimeout(() => {
              setLocation("/login");
            }, 3000);
          } else {
            setError(data.message);
          }
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            setError(error.response?.data?.message || "Failed to reset password. Please try again.");
          } else {
            setError("Failed to reset password. Please try again.");
          }
        },
      }
    );
  };

  const isLoading = resetPasswordMutation.isPending;

  // Loading state
  if (tokenStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid/Expired/Used token states
  if (tokenStatus !== "valid") {
    let title = "Invalid Reset Link";
    let message = "This password reset link is invalid or has expired.";

    if (tokenStatus === "expired") {
      title = "Link Expired";
      message = "This password reset link has expired. Please request a new one.";
    } else if (tokenStatus === "used") {
      title = "Link Already Used";
      message = "This password reset link has already been used. Please request a new one if you need to reset your password again.";
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center">
                <img src={logoImg} alt="Logo" className="max-w-[190%] max-h-[190%] object-contain" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{message}</p>
              <div className="pt-4 space-y-3">
                <Link href="/forgot-password">
                  <Button className="w-full h-12">Request New Reset Link</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full h-12">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center">
                <img src={logoImg} alt="Logo" className="max-w-[190%] max-h-[190%] object-contain" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Password Reset Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your password has been updated. Redirecting you to login...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Valid token - show password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center">
              <img src={logoImg} alt="Logo" className="max-w-[190%] max-h-[190%] object-contain" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reset Your Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your new password below
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  className="pl-10 pr-10 h-12"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              className="w-full h-12"
              type="submit"
              disabled={isLoading || !!passwordError || !newPassword || !confirmPassword}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login">
              <button 
                type="button"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
              >
                Back to Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
