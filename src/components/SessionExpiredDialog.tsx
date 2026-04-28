// src/components/SessionExpiredDialog.tsx
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface SessionExpiredDialogProps {
  open: boolean;
  onLoginRedirect: () => void;
}

export const SessionExpiredDialog = ({
  open,
  onLoginRedirect,
}: SessionExpiredDialogProps) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (open) {
      setCountdown(5);
    }
  }, [open]);

  useEffect(() => {
    if (!open || countdown === 0) return;

    const timer = setTimeout(() => {
      if (countdown === 1) {
        onLoginRedirect();
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [open, countdown, onLoginRedirect]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-xl w-[90%] max-w-md">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-4">
            <AlertTriangle className="h-12 w-12 text-yellow-600 dark:text-yellow-500" />
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4 text-center">
          Session Expired
        </h2>

        <p className="text-center text-sm mb-6 text-foreground/70">
          Your session has expired. Please login again to continue.
        </p>

        <div className="flex flex-col items-center gap-2 mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-foreground/60">
            Redirecting to login in
          </p>
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30">
            <span className="text-4xl font-bold text-primary">
              {countdown}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            onClick={onLoginRedirect}
            className="w-full"
          >
            Login Now
          </Button>
        </div>
      </div>
    </div>
  );
};
