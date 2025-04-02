
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    if (!acceptedTerms) {
      toast({
        title: "Terms & Conditions",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // In the future, this will be connected to Supabase
      console.log("Registration attempt with:", { name, email, password });
      
      // Simulate registration success
      setTimeout(() => {
        toast({
          title: "Account created!",
          description: "Your account has been successfully created.",
        });
        navigate('/dashboard');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const toggleShowPassword = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-xl shadow-lg animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
        <p className="text-sm text-gray-500 mt-2">Start managing your WhatsApp API</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              id="name" 
              type="text" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
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
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
              onClick={() => toggleShowPassword('password')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? 
                <EyeOff className="h-5 w-5 text-gray-400" /> : 
                <Eye className="h-5 w-5 text-gray-400" />
              }
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              id="confirmPassword" 
              type={showConfirmPassword ? 'text' : 'password'} 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              required
            />
            <button 
              type="button"
              onClick={() => toggleShowPassword('confirmPassword')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? 
                <EyeOff className="h-5 w-5 text-gray-400" /> : 
                <Eye className="h-5 w-5 text-gray-400" />
              }
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <Link to="/terms" className="text-whatsapp hover:underline">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-whatsapp hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-whatsapp hover:bg-whatsapp-dark font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-whatsapp font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
