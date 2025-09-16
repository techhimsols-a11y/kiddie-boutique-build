import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProduct, Product } from "@/lib/api/products";
import { Heart, ShoppingCart, Star, Plus, Minus, Share } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();

  const { data: product, isLoading, isError } = useQuery<Product | null>({
    queryKey: ["product", id],
    queryFn: () => getProduct(id as string),
    enabled: !!id,
  });
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Product ID is missing</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Loading product...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-destructive">Failed to load product</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 ? product.images : (product.image_url ? [product.image_url] : ["https://placehold.co/800x800"]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img 
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-border'
                }`}
              >
                <img 
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              {product.category && <Badge variant="outline">{product.category}</Badge>}
              <Button variant="ghost" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.age_group && <p className="text-muted-foreground mb-4">{product.age_group}</p>}
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(Number(product.rating || 0)) ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-sm">{product.rating || 0}</span>
                <span className="ml-1 text-sm text-muted-foreground">({product.review_count || 0} reviews)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.original_price && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.original_price}
                </span>
              )}
              {product.original_price && (
                <Badge className="bg-destructive">
                  Save ${(Number(product.original_price) - Number(product.price)).toFixed(2)}
                </Badge>
              )}
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="h-12"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Color</h3>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    onClick={() => setSelectedColor(color)}
                    className="h-12 px-6"
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full text-lg h-12"
              disabled={(product.sizes && product.sizes.length > 0 && !selectedSize) || (product.colors && product.colors.length > 0 && !selectedColor)}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart - ${(Number(product.price) * quantity).toFixed(2)}
            </Button>
            <Button variant="outline" size="lg" className="w-full text-lg h-12">
              <Heart className="mr-2 h-5 w-5" />
              Add to Wishlist
            </Button>
          </div>

          {/* Product Features */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Machine washable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="size-guide">Size Guide</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.review_count || 0})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-lg mb-4">{product.description}</p>
              <div className="space-y-2">
                <h4 className="font-semibold">Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Made from premium organic cotton</li>
                  <li>Hypoallergenic and gentle on sensitive skin</li>
                  <li>Reinforced seams for extra durability</li>
                  <li>Easy care - machine washable</li>
                  <li>OEKO-TEX Standard 100 certified</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="size-guide" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4">Size Guide</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr>
                      <th className="border border-border p-2 text-left">Size</th>
                      <th className="border border-border p-2 text-left">Age</th>
                      <th className="border border-border p-2 text-left">Height (inches)</th>
                      <th className="border border-border p-2 text-left">Weight (lbs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2">2T</td>
                      <td className="border border-border p-2">18-24 months</td>
                      <td className="border border-border p-2">32-34</td>
                      <td className="border border-border p-2">26-30</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">3T</td>
                      <td className="border border-border p-2">2-3 years</td>
                      <td className="border border-border p-2">34-37</td>
                      <td className="border border-border p-2">30-35</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">4T</td>
                      <td className="border border-border p-2">3-4 years</td>
                      <td className="border border-border p-2">37-40</td>
                      <td className="border border-border p-2">35-40</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            {[1, 2, 3].map((review) => (
              <Card key={review}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                        ))}
                      </div>
                      <span className="font-semibold">Sarah M.</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-muted-foreground">
                    Love this outfit! The quality is amazing and my daughter feels like a princess. 
                    The fabric is so soft and comfortable. Definitely buying more!
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products - placeholder for now */}
      <div>
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <div className="text-muted-foreground">More recommendations coming soon.</div>
      </div>
    </div>
  );
};

export default ProductDetail;