import React from 'react';
import { Leaf, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-semibold text-gray-900">EcoGo Corporate</span>
            </div>
            <p className="text-gray-600 max-w-xs">
              Helping companies track and reduce their carbon footprint through intelligent invoice analysis.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Sustainability Guide
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center">
          <p className="text-gray-500 text-sm">&copy; {currentYear} EcoGo Corporate. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-primary-500 transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="#" className="text-gray-500 hover:text-primary-500 transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;