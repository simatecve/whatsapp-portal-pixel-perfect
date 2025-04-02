
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-whatsapp" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
                <path d="M12 6L11.06 11.06L6 12L11.06 12.94L12 18L12.94 12.94L18 12L12.94 11.06L12 6Z" />
              </svg>
              <span className="ml-2 text-xl font-bold">WhatsAPI</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/features" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Features</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Pricing</Link>
              <Link to="/documentation" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Documentation</Link>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
              <Link to="/register">
                <Button className="bg-whatsapp hover:bg-whatsapp-dark">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="md:hidden">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-whatsapp to-whatsapp-dark text-white py-16 md:py-24 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Powerful WhatsApp API Management Platform
              </h1>
              <p className="text-lg md:text-xl mb-8 md:pr-12 opacity-90">
                Connect with your customers through WhatsApp seamlessly. Our platform makes it easy to integrate, automate, and scale your WhatsApp communications.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-whatsapp-dark hover:bg-gray-100">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/documentation">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-whatsapp-dark">
                    View Documentation
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="glass-effect p-4 rounded-xl shadow-lg max-w-md mx-auto">
                  <img 
                    src="https://cdn.pixabay.com/photo/2021/08/16/08/55/phone-6549492_1280.jpg" 
                    alt="WhatsApp API Dashboard" 
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose WhatsAPI?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides everything you need to power your WhatsApp business communications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-whatsapp bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-whatsapp" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Easy Integration</h3>
              <p className="text-gray-600">
                Integrate WhatsApp messaging into your existing systems with just a few lines of code.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-whatsapp bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-whatsapp" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 9H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 13H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Automated Messaging</h3>
              <p className="text-gray-600">
                Build automated messaging workflows to engage with your customers efficiently.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-whatsapp bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-whatsapp" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8V16M12 11V16M8 14V16M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Detailed Analytics</h3>
              <p className="text-gray-600">
                Track engagement metrics and optimize your messaging strategy with actionable insights.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-whatsapp bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-whatsapp" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 20C4 17.34 7.33 15 12 15C16.67 15 20 17.34 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Customer Profiles</h3>
              <p className="text-gray-600">
                Build comprehensive customer profiles to personalize your communication.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-whatsapp bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-whatsapp" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1428 17.2336 20.3377 17.7053 20.3377 18.1975C20.3377 18.6897 20.1428 19.1614 19.79 19.515C19.4364 19.8678 18.9647 20.0627 18.4725 20.0627C17.9803 20.0627 17.5086 19.8678 17.155 19.515L17.095 19.455C16.6128 18.9833 15.8921 18.8527 15.275 19.125C14.6718 19.3854 14.2779 19.9789 14.275 20.635V20.75C14.275 21.7165 13.4915 22.5 12.525 22.5C11.5585 22.5 10.775 21.7165 10.775 20.75V20.655C10.7653 19.9888 10.3575 19.391 9.74 19.135C9.12292 18.8623 8.40221 18.9929 7.92 19.465L7.86 19.525C7.50643 19.8778 7.03474 20.0727 6.5425 20.0727C6.05026 20.0727 5.57857 19.8778 5.225 19.525C4.87218 19.1614 4.67734 18.6897 4.67734 18.1975C4.67734 17.7053 4.87218 17.2336 5.225 16.88L5.285 16.82C5.75674 16.3378 5.88732 15.6171 5.625 15C5.36456 14.3968 4.77112 14.0029 4.115 14H4C3.0335 14 2.25 13.2165 2.25 12.25C2.25 11.2835 3.0335 10.5 4 10.5H4.095C4.76123 10.4903 5.35905 10.0825 5.615 9.465C5.88732 8.84792 5.75674 8.12721 5.285 7.645L5.225 7.585C4.87218 7.23143 4.67734 6.75974 4.67734 6.2675C4.67734 5.77526 4.87218 5.30357 5.225 4.95C5.57857 4.59718 6.05026 4.40234 6.5425 4.40234C7.03474 4.40234 7.50643 4.59718 7.86 4.95L7.92 5.01C8.40221 5.48174 9.12292 5.61232 9.74 5.35C10.3432 5.08956 10.7371 4.49612 10.74 3.84V3.75C10.74 2.7835 11.5235 2 12.49 2C13.4565 2 14.24 2.7835 14.24 3.75V3.845C14.2429 4.50112 14.6368 5.09456 15.24 5.355C15.8571 5.61732 16.5778 5.48674 17.06 5.015L17.12 4.955C17.4736 4.60218 17.9453 4.40734 18.4375 4.40734C18.9297 4.40734 19.4014 4.60218 19.755 4.955C20.1078 5.30857 20.3027 5.78026 20.3027 6.2725C20.3027 6.76474 20.1078 7.23643 19.755 7.59L19.695 7.65C19.2233 8.13221 19.0927 8.85292 19.325 9.47C19.5854 10.0732 20.1789 10.4671 20.835 10.47H20.95C21.9165 10.47 22.7 11.2535 22.7 12.22C22.7 13.1865 21.9165 13.97 20.95 13.97H20.855C20.1948 13.9792 19.6049 14.3792 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Advanced Settings</h3>
              <p className="text-gray-600">
                Customize your WhatsApp integration with advanced configuration options.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-whatsapp bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-whatsapp" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Enterprise Security</h3>
              <p className="text-gray-600">
                Enterprise-grade security features to keep your data and communications safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-whatsapp rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:p-16">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                  Ready to transform your WhatsApp communications?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-white opacity-90">
                  Sign up for your free trial today. No credit card required.
                </p>
              </div>
              <div className="mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
                <Link to="/register">
                  <Button size="lg" className="w-full bg-white text-whatsapp-dark hover:bg-gray-100">
                    Get Started Now
                  </Button>
                </Link>
                <p className="mt-3 text-sm text-white text-center opacity-80">
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="font-medium text-white underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="font-medium text-white underline">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Solutions</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-gray-300 hover:text-white">Marketing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Customer Support</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">E-commerce</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-gray-300 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Guides</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">API Status</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Help</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-gray-300 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Jobs</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-gray-300 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Cookies</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-whatsapp" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
                <path d="M12 6L11.06 11.06L6 12L11.06 12.94L12 18L12.94 12.94L18 12L12.94 11.06L12 6Z" />
              </svg>
              <span className="ml-2 text-xl font-bold">WhatsAPI</span>
            </div>
            <p className="mt-8 md:mt-0 text-base text-gray-400">
              &copy; 2023 WhatsAPI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
