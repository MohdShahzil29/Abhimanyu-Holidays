import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-orange-500">Abhimanyu</span>
              <span className="text-blue-500">Holidays</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Your trusted partner for unforgettable travel experiences across domestic and international destinations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-orange-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/one-day-tours" className="text-gray-400 hover:text-orange-500 transition-colors">
                  One Day Tours
                </Link>
              </li>
              <li>
                <Link to="/tour-packages" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Tour Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/taxi-services" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Taxi Services
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Hotel Booking
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-orange-500 flex-shrink-0 mt-1" />
                <span className="text-gray-400">
                  4/164 SFS Near B2 Bypass Mansarovar, Nearby Airport Jaipur
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-orange-500 flex-shrink-0" />
                <span className="text-gray-400">+91 9587084879</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-orange-500 flex-shrink-0" />
                <span className="text-gray-400">+91 9829301061</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-orange-500 flex-shrink-0" />
                <span className="text-gray-400">info@abhimanyuholidays.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Abhimanyu Holidays. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
