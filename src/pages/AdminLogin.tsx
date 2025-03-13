
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, Shield } from 'lucide-react';
import { useAnimation } from '@/hooks/use-animation';
import { cn } from '@/lib/utils';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/components/auth/ProtectedRoute';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { 
    message: "Password must be at least 6 characters" 
  }),
});

type FormValues = z.infer<typeof formSchema>;

const AdminLogin = () => {
  const { ref, isVisible } = useAnimation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/admin";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    // For demo purposes only - in a real app, validate against a backend
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Demo admin credentials
      if (values.email === "admin@ahalia.edu" && values.password === "admin123") {
        signIn();

        toast({
          title: "Signed in successfully!",
          description: "Welcome to the admin dashboard.",
        });

        navigate('/admin');
      } else {
        toast({
          title: "Invalid credentials",
          description: "The email or password you entered is incorrect.",
          variant: "destructive"
        });
      }
    }, 1500);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4 sm:px-6">
          <div 
            ref={ref as React.RefObject<HTMLDivElement>}
            className={cn(
              "transition-all duration-500 bg-white rounded-xl shadow-md border border-gray-100 p-8",
              isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
            )}
          >
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Shield size={24} />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600 text-center mb-8">Sign in to access tournament administration</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="admin@ahalia.edu" 
                          type="email" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          type="password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn size={16} />
                      Sign In
                    </span>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Want to register a team?{' '}
                <Link to="/register-team" className="text-primary hover:underline font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;
