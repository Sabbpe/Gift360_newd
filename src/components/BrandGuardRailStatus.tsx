// src/components/GuardRails/BrandGuardRailStatus.tsx
import { useEffect, useState, useRef } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Info,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { Brand } from "@/types/guardRails";

interface BrandGuardRailStatusProps {
  brandGuardRail: Brand | null;
  currentUsage: number;
  requestedAmount: number;
  onLimitExceeded: (exceeded: boolean, message: string) => void;
  isAuthenticated: boolean;
}

export const BrandGuardRailStatus = ({
  brandGuardRail,
  currentUsage,
  requestedAmount,
  onLimitExceeded,
  isAuthenticated,
}: BrandGuardRailStatusProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // ✅ FIX: Use useRef instead of useState
  const prevRequestedAmountRef = useRef(requestedAmount);
  const prevWillExceedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate values before conditional returns
  const totalAfterPurchase = brandGuardRail
    ? currentUsage + requestedAmount
    : 0;

  const usagePercentage = brandGuardRail
    ? (currentUsage / brandGuardRail.monthlyLimit) * 100
    : 0;

  const afterPurchasePercentage = brandGuardRail
    ? (totalAfterPurchase / brandGuardRail.monthlyLimit) * 100
    : 0;

  const remaining = brandGuardRail
    ? Math.max(0, brandGuardRail.monthlyLimit - currentUsage)
    : 0;

  const willExceed = brandGuardRail
    ? totalAfterPurchase >= brandGuardRail.monthlyLimit
    : false;

  const isNearLimit = usagePercentage >= 80 && usagePercentage < 100;
  const isOverLimit = usagePercentage >= 100;

  // ✅ FIXED: Properly handle state updates
  useEffect(() => {
    // Only update if values actually changed
    if (
      prevRequestedAmountRef.current === requestedAmount &&
      prevWillExceedRef.current === willExceed
    ) {
      return;
    }

    // Update refs
    prevRequestedAmountRef.current = requestedAmount;
    prevWillExceedRef.current = willExceed;

    if (!brandGuardRail) {
      onLimitExceeded(false, "");
      return;
    }

    if (requestedAmount > 0 && willExceed) {
      const diff = Math.max(
        0,
        totalAfterPurchase - brandGuardRail.monthlyLimit
      );

      if (diff === 0) {
        onLimitExceeded(
          true,
          `You have reached your monthly limit of ₹${brandGuardRail.monthlyLimit.toFixed(
            2
          )}.`
        );
      } else {
        onLimitExceeded(
          true,
          `This purchase will exceed your monthly limit by ₹${diff.toFixed(2)}.`
        );
      }
    } else if (requestedAmount > remaining) {
      onLimitExceeded(
        true,
        `Insufficient limit! You have ₹${remaining.toFixed(
          2
        )} remaining out of ₹${brandGuardRail.monthlyLimit.toFixed(2)}.`
      );
    } else {
      onLimitExceeded(false, "");
    }

    // ✅ IMPORTANT: Don't include onLimitExceeded in dependencies
  }, [
    requestedAmount,
    willExceed,
    brandGuardRail,
    totalAfterPurchase,
    remaining,
  ]);

  if (!isAuthenticated) return null;
  if (!brandGuardRail) return null;

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Guard Rail Header */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Monthly Spending Limit
            </span>
          </div>
          <Badge
            variant={
              isOverLimit
                ? "destructive"
                : isNearLimit
                ? "default"
                : "secondary"
            }
            className="text-xs font-medium"
          >
            {brandGuardRail.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Current Usage Bar */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-muted-foreground">Current Usage</span>
            <span className="font-bold text-foreground">
              ₹{currentUsage.toFixed(2)} / ₹
              {brandGuardRail.monthlyLimit.toFixed(2)}
            </span>
          </div>

          <Progress
            value={Math.min(usagePercentage, 100)}
            className={`h-2 transition-all duration-300 ${
              isOverLimit
                ? "[&>div]:bg-destructive"
                : isNearLimit
                ? "[&>div]:bg-orange-500"
                : "[&>div]:bg-primary"
            }`}
          />

          {/* After Purchase Preview */}
          {requestedAmount > 0 && (
            <div className="mt-3 pt-3 border-t border-primary/10">
              <div className="flex items-baseline justify-between text-xs mb-2">
                <span className="text-muted-foreground">
                  After This Purchase
                </span>
                <span
                  className={`font-bold ${
                    willExceed
                      ? "text-destructive"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  ₹{totalAfterPurchase.toFixed(2)} / ₹
                  {brandGuardRail.monthlyLimit.toFixed(2)}
                </span>
              </div>

              <Progress
                value={Math.min(afterPurchasePercentage, 100)}
                className={`h-2 transition-all duration-300 ${
                  willExceed
                    ? "[&>div]:bg-destructive animate-pulse"
                    : "[&>div]:bg-green-500"
                }`}
              />

              <div className="flex items-center justify-between mt-2 text-xs">
                <span
                  className={`font-medium ${
                    willExceed ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {afterPurchasePercentage.toFixed(1)}% utilized
                </span>
                {willExceed && (
                  <span className="flex items-center gap-1 text-destructive font-semibold">
                    <AlertTriangle className="h-3 w-3" />
                    Limit exceeded
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Remaining Amount */}
        <div className="mt-3 flex items-center justify-between bg-background/50 backdrop-blur-sm rounded-md p-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Remaining Limit
            </span>
          </div>
          <span className="text-sm font-bold text-foreground">
            ₹{remaining.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Warning Messages */}
      {willExceed && requestedAmount > 0 && (
        <Alert
          variant="destructive"
          className="mb-4 animate-in slide-in-from-top-2 duration-300"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="ml-2 text-sm">
            <strong>Cannot proceed:</strong> This purchase exceeds your monthly
            limit by{" "}
            <strong>
              ₹{(totalAfterPurchase - brandGuardRail.monthlyLimit).toFixed(2)}
            </strong>
            . Please reduce the amount or quantity.
          </AlertDescription>
        </Alert>
      )}

      {!willExceed && isNearLimit && requestedAmount > 0 && (
        <Alert className="mb-4 border-orange-500/50 bg-orange-500/10 animate-in slide-in-from-top-2 duration-300">
          <Info className="h-4 w-4 text-orange-500" />
          <AlertDescription className="ml-2 text-sm text-orange-900 dark:text-orange-100">
            You're approaching your monthly limit. After this purchase, you'll
            have{" "}
            <strong>
              ₹{(brandGuardRail.monthlyLimit - totalAfterPurchase).toFixed(2)}
            </strong>{" "}
            remaining.
          </AlertDescription>
        </Alert>
      )}

      {!willExceed &&
        !isNearLimit &&
        requestedAmount > 0 &&
        remaining - requestedAmount < brandGuardRail.monthlyLimit * 0.2 && (
          <Alert className="mb-4 border-green-500/50 bg-green-500/10 animate-in slide-in-from-top-2 duration-300">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="ml-2 text-sm text-green-900 dark:text-green-100">
              Purchase within limit. You'll have{" "}
              <strong>₹{(remaining - requestedAmount).toFixed(2)}</strong>{" "}
              remaining.
            </AlertDescription>
          </Alert>
        )}
    </div>
  );
};
