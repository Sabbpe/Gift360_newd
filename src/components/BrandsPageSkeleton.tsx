import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton"; // Add this import

const BrandsPageSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section Skeleton */}
        <section className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="max-w-3xl">
              <Skeleton className="h-10 w-64 mb-3" />
              <Skeleton className="h-6 w-96" />
            </div>
          </div>
        </section>

        {/* Search Bar Skeleton */}
        <section className="border-b bg-background/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-4 items-center">
              <Skeleton className="h-12 w-24 lg:hidden" />
              <Skeleton className="h-12 flex-1 rounded-xl" />
            </div>
          </div>
        </section>

        {/* Main Content Skeleton */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex gap-8">
            {/* Sidebar Skeleton - Desktop */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            </aside>

            {/* Brand Grid Skeleton */}
            <div className="flex-1 min-w-0">
              <Skeleton className="h-5 w-48 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BrandsPageSkeleton;