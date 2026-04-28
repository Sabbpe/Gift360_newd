import { Zap, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import type { Voucher } from '@/data/vouchers';

interface OfferCardProps {
  voucher: Voucher;
}

export default function OfferCard({ voucher }: OfferCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300 hover:shadow-lg border-2 border-destructive/20" data-testid={`card-offer-${voucher.id}`}>
      <Link href={`/voucher/${voucher.id}`}>
        <button className="w-full text-left">
          <div className="relative aspect-video overflow-hidden bg-muted">
            <img
              src={voucher.image}
              alt={voucher.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 right-0 bg-destructive text-destructive-foreground px-4 py-2 flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 fill-current" />
              <span className="font-bold text-sm">FLASH DEAL - {voucher.discount}% OFF</span>
            </div>
          </div>

          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-lg" data-testid={`text-offer-title-${voucher.id}`}>
              {voucher.title}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">{voucher.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({voucher.reviewCount})
                </span>
              </div>
              <Badge variant="destructive" className="font-bold">
                Save ${((Math.min(...voucher.prices) * (voucher.discount || 0)) / 100).toFixed(2)}
              </Badge>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary" data-testid={`text-offer-price-${voucher.id}`}>
                ${(Math.min(...voucher.prices) * (1 - (voucher.discount || 0) / 100)).toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${Math.min(...voucher.prices)}
              </span>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button className="w-full rounded-full" data-testid={`button-grab-deal-${voucher.id}`}>
              Grab This Deal
            </Button>
          </CardFooter>
        </button>
      </Link>
    </Card>
  );
}
