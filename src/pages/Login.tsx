
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center">
              <svg className="w-8 h-8 text-whatsapp" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
                <path d="M12 6L11.06 11.06L6 12L11.06 12.94L12 18L12.94 12.94L18 12L12.94 11.06L12 6Z" />
              </svg>
              <span className="ml-2 text-xl font-bold">WhatsAPI</span>
            </Link>
          </div>
          <LoginForm />
        </div>
      </div>
      
      {/* Right side - Image/Banner */}
      <div 
        className="hidden md:flex md:flex-1 bg-whatsapp relative overflow-hidden"
        style={{ backgroundImage: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-10">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-6">Manage WhatsApp communications efficiently</h2>
            <p className="mb-8 text-lg">
              Connect with your customers instantly using our WhatsApp API management platform.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <h3 className="font-bold mb-1">Easy Integration</h3>
                <p className="text-sm">Integrate with your existing systems seamlessly</p>
              </div>
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <h3 className="font-bold mb-1">Advanced Analytics</h3>
                <p className="text-sm">Track and optimize your messaging campaigns</p>
              </div>
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <h3 className="font-bold mb-1">Automation</h3>
                <p className="text-sm">Set up automated responses and workflows</p>
              </div>
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <h3 className="font-bold mb-1">Security</h3>
                <p className="text-sm">Enterprise-grade security for your data</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 text-white text-opacity-70 text-sm">
          © 2023 WhatsAPI. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
