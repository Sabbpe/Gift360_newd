import { Gift } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted/30 mt-12 sm:mt-16 lg:mt-20 pb-20 md:pb-0">
      {/* FIXED: Mobile-first responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* BRAND - FIXED: Responsive sizing */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>© 2024 One78 SabbPe Technology Solutions India Pvt. Ltd</span>
          </div>

          {/* LINKS - FIXED: Responsive text and spacing */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:underline hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline hover:text-foreground transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/refund" className="hover:underline hover:text-foreground transition-colors">
              Refund Policy
            </Link>
          </div>

          {/* COPYRIGHT - FIXED: Responsive text */}
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-right">
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
