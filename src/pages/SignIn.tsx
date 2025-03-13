import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Shield, User } from 'lucide-react';
import { useAnimation } from '@/hooks/use-animation';
import { cn } from '@/lib/utils';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/components/auth/ProtectedRoute';
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { 
    message: "Password must be at least 6 characters" 
  }),
  isAdmin: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const SignIn = () => {
  const { ref, isVisible } = useAnimation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      isAdmin: false,
    },
  });

  function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      
      const role = values.isAdmin ? 'admin' : 'user';
      signIn(role);

      toast({
        title: "Signed in successfully!",
        description: values.isAdmin ? 
          "Welcome to the admin dashboard." : 
          "Welcome back to Ahalia Tournaments.",
      });

      if (values.isAdmin) {
        navigate('/admin');
      } else {
        navigate(from);
      }
      
      console.log(values);
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
            
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600 text-center mb-8">Sign in to your Ahalia Tournaments account</p>
            
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
                          placeholder="your.email@example.com" 
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
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link 
                          to="/reset-password" 
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
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

                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Admin Access</FormLabel>
                        <FormDescription>
                          Sign in as tournament administrator
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
                Don't have an account?{' '}
                <Link to="/sign-up" className="text-primary hover:underline font-medium">
                  Sign up
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

export default SignIn;
