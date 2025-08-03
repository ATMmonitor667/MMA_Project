import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import mmaLogo from '@/assets/mma-logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gradient-primary shadow-strong border-b backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src={mmaLogo}
                alt="MMA Logo"
                className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-primary-foreground font-bold text-xl tracking-tight">
                FightZone
              </span>
              <span className="text-primary-foreground/70 text-xs font-medium">
                PREMIUM MMA GEAR
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-primary-foreground hover:text-secondary transition-all duration-300 font-medium text-sm uppercase tracking-wide relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-accent transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="text-primary-foreground hover:text-secondary transition-all duration-300 font-medium text-sm uppercase tracking-wide relative group"
            >
              Explore
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-accent transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-primary-foreground hover:text-secondary hover:bg-white/10 transition-all duration-300 group"
            >
              <ShoppingCart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute -top-2 -right-2 bg-gradient-accent text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center text-secondary-foreground shadow-glow">
                3
              </span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-primary-foreground hover:text-secondary hover:bg-white/10"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-gradient-primary/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#"
                className="block px-3 py-2 text-primary-foreground hover:text-secondary hover:bg-white/10 rounded-md font-medium transition-all duration-300"
              >
                Home
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-primary-foreground hover:text-secondary hover:bg-white/10 rounded-md font-medium transition-all duration-300"
              >
                Explore
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;