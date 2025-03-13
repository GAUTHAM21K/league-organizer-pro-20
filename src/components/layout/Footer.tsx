
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white pt-16 pb-12 border-t border-gray-100">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AT</span>
              </div>
              <span className="font-medium text-lg text-gray-900">
                Ahalia Tournaments
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Streamlining college tournaments with modern technology and exceptional design.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Tournaments</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Ahalia Soccer League (ASL)
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Ahalia Premier League (APL)
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Tournament Guidelines
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Past Tournaments
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/teams" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Teams
                </Link>
              </li>
              <li>
                <Link to="/matches" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Matches
                </Link>
              </li>
              <li>
                <Link to="/players" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Players
                </Link>
              </li>
              <li>
                <Link to="/statistics" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Statistics
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  Ahalia Campus, Palakkad, Kerala, India
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <a 
                  href="mailto:info@ahalia-tournaments.com" 
                  className="text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  info@ahalia-tournaments.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <a 
                  href="tel:+91-1234567890" 
                  className="text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  +91 12345 67890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-center text-gray-500">
            © {currentYear} Ahalia Tournaments. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
