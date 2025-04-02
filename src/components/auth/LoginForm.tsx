
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In the future, this will be connected to Supabase
      console.log("Login attempt with:", { email, password });
      
      // Simulate login success
      setTimeout(() => {
        toast({
          title: "Success!",
          description: "You have successfully logged in.",
        });
        navigate('/dashboard');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-xl shadow-lg animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-sm text-gray-500 mt-2">Sign in to your WhatsApp API Dashboard</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Link to="/forgot-password" className="text-xs text-whatsapp hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              id="password" 
              type={showPassword ? 'text' : 'password'} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
            <button 
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? 
                <EyeOff className="h-5 w-5 text-gray-400" /> : 
                <Eye className="h-5 w-5 text-gray-400" />
              }
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-whatsapp hover:bg-whatsapp-dark font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-whatsapp font-medium hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
