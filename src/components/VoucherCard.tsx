import { Star, Tag, Package } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Voucher } from "@/data/vouchers";

interface VoucherCardProps {
  voucher: Voucher;
  showBulkContext?: boolean;
}

export default function VoucherCard({ voucher, showBulkContext = false }: VoucherCardProps) {
  return (
    <Card
      className="overflow-hidden hover-elevate transition-all duration-300 hover:shadow-lg cursor-pointer"
      data-testid={`card-voucher-${voucher.id}`}
    >
      <Link href={`/voucher/${voucher.id}`} className="block w-full">
        <div className="w-full text-left">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={voucher.image}
              alt={voucher.title}
              className="w-full h-full object-cover"
            />
            {voucher.discount && (
              <Badge
                variant="destructive"
                className="absolute top-2 sm:top-3 right-2 sm:right-3 gap-1 text-xs"
                data-testid={`badge-discount-${voucher.id}`}
              >
                <Tag className="h-3 w-3" />
                {voucher.discount}% OFF
              </Badge>
            )}
          </div>

          {/* FIXED: Responsive content padding and spacing */}
          <CardContent className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
            <div className="flex items-start justify-between gap-2">
              {/* FIXED: Responsive title text */}
              <h3
                className="font-semibold text-base sm:text-lg line-clamp-2"
                data-testid={`text-title-${voucher.id}`}
              >
                {voucher.title}
              </h3>
            </div>

            {/* FIXED: Responsive brand text */}
            <p
              className="text-xs sm:text-sm text-muted-foreground"
              data-testid={`text-brand-${voucher.id}`}
            >
              {voucher.brand}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-primary text-primary" />
                <span
                  className="text-xs sm:text-sm font-medium"
                  data-testid={`text-rating-${voucher.id}`}
                >
                  {voucher.rating}
                </span>
              </div>
              <span
                className="text-xs sm:text-sm text-muted-foreground"
                data-testid={`text-reviews-${voucher.id}`}
              >
                ({voucher.reviewCount})
              </span>
            </div>

            {/* Bulk Context - Only for distributor mode */}
            {showBulkContext && (
              <div className="pt-2 border-t border-border space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-purple-700">
                  <Package className="h-3.5 w-3.5" />
                  <span className="font-semibold">Min Bulk: 10+</span>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Distributor Discount Available
                </p>
              </div>
            )}
          </CardContent>

          {/* FIXED: Responsive footer padding */}
          <CardFooter className="p-3 sm:p-4 pt-0 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">From</p>
              {/* FIXED: Responsive price text */}
              <p
                className="text-lg sm:text-xl font-bold text-primary"
                data-testid={`text-price-${voucher.id}`}
              >
                ${Math.min(...voucher.prices)}
              </p>
            </div>

            {/* FIXED: Responsive button */}
            <Button asChild size="sm" className="rounded-full text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4">
              <span>View Details</span>
            </Button>
          </CardFooter>
        </div>
      </Link>
    </Card>
  );
}
