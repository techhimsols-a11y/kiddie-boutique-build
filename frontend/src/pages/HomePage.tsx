import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listProducts, Product } from "@/lib/api/products";

const HomePage = () => {
  const { data: products = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products", "home"],
    queryFn: listProducts,
  });

  const featuredProducts = (products || []).filter((p) => !!p.featured).slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden rounded-b-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Magical Clothing for Little Adventures
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Discover our collection of comfortable, stylish, and playful clothing 
              designed to make every day special for your little ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8">
                Shop New Arrivals
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                View Collections
              </Button>
            </div>
          </div>
          <div className="hidden lg:block flex-1">
            <div className="relative h-96 w-96 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop"
                alt="Happy kids in colorful clothes"
                className="relative z-10 w-full h-full object-cover rounded-full shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground">Our most loved items by parents and kids</p>
          </div>

          {isLoading && (
            <div className="text-center py-12">Loading featured products...</div>
          )}
          {isError && (
            <div className="text-center py-12 text-destructive">Failed to load products.</div>
          )}

          {!isLoading && !isError && (
            <>
              {featuredProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No featured products yet. Check back soon!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                          src={(product.images && product.images[0]) || product.image_url || "https://placehold.co/600x400"}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.original_price && (
                          <Badge className="absolute top-3 left-3 bg-destructive">
                            Sale
                          </Badge>
                        )}
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="ml-1 text-sm">{product.rating || 0}</span>
                            <span className="ml-1 text-sm text-muted-foreground">({product.review_count || 0})</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">${product.price}</span>
                            {product.original_price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.original_price}
                              </span>
                            )}
                          </div>
                          <Button size="sm" className="gap-2" asChild>
                            <Link to={`/product/${product.id}`}>
                              <ShoppingCart className="h-4 w-4" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="text-center mt-12">
                <Button size="lg" variant="outline" asChild>
                  <Link to="/products">View All Products</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-success/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">Free shipping on orders over $50. Fast and reliable delivery.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Organic Materials</h3>
              <p className="text-muted-foreground">Safe, soft, and sustainable materials for your child's comfort.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">↩️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-muted-foreground">30-day return policy. No questions asked if you're not satisfied.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;