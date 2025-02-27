
import React from "react";
import { Link } from "react-router-dom";
import { Coffee, Instagram, Twitter, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-cream mt-16 pt-12 pb-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-coffee-dark">
              <Coffee className="h-5 w-5" />
              <span className="font-display text-lg font-semibold">Brew Haven</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Artisanal coffee and pastries with a seamless digital experience for ordering and pickup.
            </p>
            <div className="flex items-center space-x-4 text-coffee-dark/70">
              <a href="#" className="hover:text-coffee transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-coffee transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-coffee transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-coffee transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-medium text-coffee-dark">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-coffee transition-colors">
                  Coffee
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-coffee transition-colors">
                  Tea
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-coffee transition-colors">
                  Pastries
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-coffee transition-colors">
                  Equipment
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-medium text-coffee-dark">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/pickup" className="text-muted-foreground hover:text-coffee transition-colors">
                  Pickup Scheduling
                </Link>
              </li>
              <li>
                <Link to="/gift-cards" className="text-muted-foreground hover:text-coffee transition-colors">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link to="/wallet" className="text-muted-foreground hover:text-coffee transition-colors">
                  Wallet
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-coffee transition-colors">
                  Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-medium text-coffee-dark">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-coffee transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-coffee transition-colors">
                  Locations
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-coffee transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-coffee transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-medium text-coffee-dark">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-coffee transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-coffee transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-coffee transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream-dark/30 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Brew Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
