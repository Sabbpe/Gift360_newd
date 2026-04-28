import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PromoCard() {
  return (
    <Card className="bg-gradient-to-r from-accent via-secondary to-primary/10 border-2 border-primary/20 overflow-hidden">
      {/* FIXED: Responsive padding */}
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* FIXED: Responsive spacing */}
          <div className="space-y-2 sm:space-y-3 flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-xs sm:text-sm font-semibold text-primary">SPECIAL OFFER</span>
            </div>

            {/* FIXED: Responsive heading */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Get upto 50% cashback on all Purchases*
            </h2>

            {/* FIXED: Responsive description */}
            <p className="text-sm sm:text-base text-muted-foreground">
              Sign up today and receive an exclusive cashback on all gift vouchers
            </p>
          </div>

          {/* FIXED: Responsive button */}
          <Button 
            size="lg" 
            className="rounded-full px-6 sm:px-8 h-10 sm:h-11 lg:h-12 text-sm sm:text-base whitespace-nowrap w-full md:w-auto" 
            data-testid="button-claim-offer"
          >
            Claim Offer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
