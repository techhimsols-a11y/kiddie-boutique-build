import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
// import { products } from "@/data/products";
import { listProducts } from "@/lib/api/products";
import { Heart, Star, ShoppingCart, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [filters, setFilters] = useState({
    categories: categoryFilter ? [categoryFilter] : [],
    priceRange: [0, 100],
    sizes: [],
    colors: [],
  });
  const [sortBy, setSortBy] = useState('featured');

  const allSizes = ['Newborn', '3M', '6M', '9M', '12M', '18M', '24M', '2T', '3T', '4T', '5T', '6', '7', '8', '9', '10'];
  const allColors = ['White', 'Cream', 'Pink', 'Purple', 'Blue', 'Green', 'Yellow', 'Red', 'Navy', 'Gray', 'Brown'];

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
  });

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product: any) => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Size filter
      if (filters.sizes.length > 0) {
        const hasSize = filters.sizes.some(size => (product.sizes || []).includes(size));
        if (!hasSize) return false;
      }

      // Color filter
      if (filters.colors.length > 0) {
        const hasColor = filters.colors.some(color => (product.colors || []).includes(color));
        if (!hasColor) return false;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.category === 'new' ? 1 : 0) - (a.category === 'new' ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [filters, sortBy, products]);

  const updateFilter = (type: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const FilterSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Filters</h3>
      
      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          {['baby', 'toddler', 'boys', 'girls', 'new', 'sale'].map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFilter('categories', [...filters.categories, category]);
                  } else {
                    updateFilter('categories', filters.categories.filter(c => c !== category));
                  }
                }}
              />
              <Label htmlFor={category} className="capitalize">{category}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-3">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value)}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="font-medium mb-3">Sizes</h4>
        <div className="grid grid-cols-3 gap-2">
          {allSizes.map(size => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={size}
                checked={filters.sizes.includes(size)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFilter('sizes', [...filters.sizes, size]);
                  } else {
                    updateFilter('sizes', filters.sizes.filter(s => s !== size));
                  }
                }}
              />
              <Label htmlFor={size} className="text-sm">{size}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="font-medium mb-3">Colors</h4>
        <div className="grid grid-cols-2 gap-2">
          {allColors.map(color => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={color}
                checked={filters.colors.includes(color)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFilter('colors', [...filters.colors, color]);
                  } else {
                    updateFilter('colors', filters.colors.filter(c => c !== color));
                  }
                }}
              />
              <Label htmlFor={color} className="text-sm">{color}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Collection` : 'All Products'}
          </h1>
          <p className="text-muted-foreground">{filteredProducts.length} products found</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile filter button */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <FilterSection />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <FilterSection />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={(product.images && product.images[0]) || (product.image_url) || "https://placehold.co/600x400"}
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
                  <p className="text-sm text-muted-foreground mb-2">{product.ageGroup}</p>
                  <div className="flex items-center mb-3">
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
                    <Button size="sm" className="gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {isLoading && (
            <div className="text-center py-12">Loading products...</div>
          )}
          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No products found matching your filters.</p>
              <Button onClick={() => setFilters({ categories: [], priceRange: [0, 100], sizes: [], colors: [] })}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;