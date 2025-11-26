import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter signup */}
        <div className="mb-12 text-center">
          <h3 className="mb-4 text-2xl font-bold">Stay in the Loop!</h3>
          <p className="mb-6 text-muted-foreground">
            Get the latest kids fashion trends and exclusive deals delivered to your inbox.
          </p>
          <div className="mx-auto flex max-w-md space-x-2">
            <Input placeholder="Enter your email" className="flex-1" />
            <Button>Subscribe</Button>
          </div>
        </div>

        {/* Footer links */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company info */}
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                K
              </div>
              <span className="text-xl font-bold text-primary">KidsWear</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Quality, comfortable, and stylish clothing for kids of all ages. 
              Made with love and care for your little ones.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Mail className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=new" className="text-muted-foreground hover:text-primary">New Arrivals</Link></li>
              <li><Link to="/products?category=baby" className="text-muted-foreground hover:text-primary">Baby (0-2)</Link></li>
              <li><Link to="/products?category=toddler" className="text-muted-foreground hover:text-primary">Toddler (2-4)</Link></li>
              <li><Link to="/products?category=boys" className="text-muted-foreground hover:text-primary">Boys (4-12)</Link></li>
              <li><Link to="/products?category=girls" className="text-muted-foreground hover:text-primary">Girls (4-12)</Link></li>
              <li><Link to="/products?category=sale" className="text-muted-foreground hover:text-primary">Sale</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="mb-4 font-semibold">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-muted-foreground hover:text-primary">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-muted-foreground hover:text-primary">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide" className="text-muted-foreground hover:text-primary">Size Guide</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary">Parenting Blog</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-primary">Careers</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 KidsWear. All rights reserved. Made with ❤️ for kids and parents.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;