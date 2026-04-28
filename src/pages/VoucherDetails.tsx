import { useState } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import VoucherCard from "@/components/VoucherCard";
import Footer from "@/components/Footer";
import { vouchers } from "@/data/vouchers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function VoucherDetails() {
  const [, params] = useRoute("/voucher/:id");
  const voucher = vouchers.find((v) => v.id === params?.id);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);

  const { user } = useAuthContext();

  const { addToCart } = useCart(user?.clientId);
  const { toast } = useToast();

  if (!voucher) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              Voucher Not Found
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              The voucher you're looking for doesn't exist.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    const price = voucher.prices[selectedPrice];
    addToCart({
      brandId: voucher.id,
      brandName: voucher.title,
      quantity: 1,
      unitValue: price,
      image: voucher.image,
    });

    toast({
      title: "Added to cart",
      description: `${voucher.title} ($${price}) has been added to your cart.`,
    });
  };

  const suggestedVouchers = vouchers
    .filter((v) => v.id !== voucher.id && v.category === voucher.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* MAIN SECTION - FIXED: Responsive padding */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            {/* IMAGE */}
            <div className="space-y-4 sm:space-y-6">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={voucher.image}
                  alt={voucher.title}
                  className="w-full h-full object-cover"
                />

                {voucher.discount && (
                  <Badge
                    variant="destructive"
                    className="absolute top-3 sm:top-4 right-3 sm:right-4 text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 gap-1.5 sm:gap-2"
                  >
                    <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                    {voucher.discount}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* DETAILS */}
            <div className="space-y-4 sm:space-y-6">
              {/* TITLE + RATING */}
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  {voucher.brand}
                </p>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                  {voucher.title}
                </h1>

                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-primary text-primary" />
                    <span className="text-sm sm:text-base font-semibold">
                      {voucher.rating}
                    </span>
                  </div>

                  <span className="text-xs sm:text-sm text-muted-foreground">
                    ({voucher.reviewCount} reviews)
                  </span>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {voucher.description}
                </p>
              </div>

              {/* PRICE CARD */}
              <Card>
                <CardContent className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-6">
                  {/* PRICE SELECTION */}
                  <div>
                    <label className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 block">
                      Select Amount
                    </label>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {voucher.prices.map((price, index) => (
                        <Button
                          key={price}
                          variant={
                            selectedPrice === index ? "default" : "outline"
                          }
                          className="h-10 sm:h-12 text-sm sm:text-base font-semibold"
                          onClick={() => setSelectedPrice(index)}
                        >
                          ${price}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* PRICE + ADD TO CART */}
                  <div className="border-t pt-4 sm:pt-6">
                    <div className="flex items-baseline justify-between mb-3 sm:mb-4">
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        Price
                      </span>

                      <span className="text-2xl sm:text-3xl font-bold text-primary">
                        ${voucher.prices[selectedPrice]}
                      </span>
                    </div>

                    <Button
                      size="lg"
                      className="w-full rounded-full h-11 sm:h-12 text-sm sm:text-base"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* SUGGESTED VOUCHERS - FIXED: Responsive */}
          {suggestedVouchers.length > 0 && (
            <section className="mt-12 sm:mt-16 lg:mt-20">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
                You May Also Like
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {suggestedVouchers.map((v) => (
                  <VoucherCard key={v.id} voucher={v} />
                ))}
              </div>
            </section>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
