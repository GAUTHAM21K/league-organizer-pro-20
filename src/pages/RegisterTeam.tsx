import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAnimation } from '@/hooks/use-animation';
import { cn } from '@/lib/utils';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { TournamentToggle } from '@/components/ui/tournament-toggle';
import { Users, Upload, Info, Check } from 'lucide-react';

const formSchema = z.object({
  teamName: z.string().min(3, { message: "Team name must be at least 3 characters" }),
  department: z.string().min(1, { message: "Please select a department" }),
  captainName: z.string().min(3, { message: "Captain name is required" }),
  captainEmail: z.string().email({ message: "Please enter a valid email address" }),
  captainPhone: z.string().min(10, { message: "Please enter a valid phone number" }),
  tournament: z.string().min(1, { message: "Please select a tournament" }),
  teamDescription: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterTeam = () => {
  const { ref, isVisible } = useAnimation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [tournamentType, setTournamentType] = useState("asl");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      department: "",
      captainName: "",
      captainEmail: "",
      captainPhone: "",
      tournament: "",
      teamDescription: "",
    },
  });

  useEffect(() => {
    if (tournamentType === "asl") {
      form.setValue("tournament", "asl");
    } else {
      form.setValue("tournament", "apl");
    }
  }, [tournamentType, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function onNextStep() {
    form.trigger(['teamName', 'department', 'captainName', 'captainEmail', 'captainPhone']).then((isValid) => {
      if (isValid) {
        setStep(2);
      }
    });
  }

  function onPrevStep() {
    setStep(1);
  }

  function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Team registered successfully!",
        description: `Your team has been registered for the ${values.tournament === "asl" ? "Ahalia Soccer League" : "Ahalia Premier League"}.`,
      });
      console.log(values);
      form.reset();
      setStep(1);
      setLogoPreview(null);
    }, 1500);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Register Your Team</h1>
            <p className="text-gray-600 mt-2">
              Complete the form below to register your team for upcoming tournaments
            </p>
          </div>
          
          <div 
            ref={ref as React.RefObject<HTMLDivElement>}
            className={cn(
              "transition-all duration-500 bg-white rounded-xl shadow-md border border-gray-100 p-8",
              isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
            )}
          >
            <div className="mb-8 flex flex-col items-center justify-center">
              <div className="text-center mb-4">
                <h3 className="text-base font-medium text-gray-700">Select Tournament</h3>
              </div>
              <TournamentToggle
                value={tournamentType}
                onValueChange={setTournamentType}
              />
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  )}>
                    1
                  </div>
                  <span className="text-sm mt-2">Team Info</span>
                </div>
                <div className={cn(
                  "flex-1 h-1 mx-4",
                  step >= 2 ? "bg-primary" : "bg-gray-200"
                )} />
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  )}>
                    2
                  </div>
                  <span className="text-sm mt-2">Tournament</span>
                </div>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="teamName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter team name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Departments</SelectLabel>
                                  <SelectItem value="engineering">Engineering</SelectItem>
                                  <SelectItem value="medicine">Medicine</SelectItem>
                                  <SelectItem value="science">Science</SelectItem>
                                  <SelectItem value="arts">Arts</SelectItem>
                                  <SelectItem value="commerce">Commerce</SelectItem>
                                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mb-6">
                      <Label htmlFor="team-logo">Team Logo</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <div className={cn(
                          "w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300",
                          logoPreview ? "border-0" : ""
                        )}>
                          {logoPreview ? (
                            <img 
                              src={logoPreview} 
                              alt="Team logo preview" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <Upload size={24} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <input
                            id="team-logo"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById('team-logo')?.click()}
                          >
                            {logoPreview ? "Change Logo" : "Upload Logo"}
                          </Button>
                          <p className="text-xs text-gray-500 mt-1">
                            Optional. JPG, PNG or GIF. Max 2MB.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Captain Information</h3>
                      
                      <FormField
                        control={form.control}
                        name="captainName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Captain's Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter captain's name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="captainEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="captain@example.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="captainPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button type="button" onClick={onNextStep}>
                        Continue
                      </Button>
                    </div>
                  </>
                )}
                
                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="tournament"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input type="hidden" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="p-5 bg-gray-50 rounded-lg mb-6">
                      <h3 className="text-lg font-medium mb-2">Selected Tournament</h3>
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users size={16} className="text-primary" />
                        </div>
                        {tournamentType === "asl" ? "Ahalia Soccer League (ASL)" : "Ahalia Premier League (APL)"}
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="teamDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us a bit about your team, previous achievements, etc." 
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Optional. This information will be displayed on your team profile.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                      <div className="flex-shrink-0 text-blue-500">
                        <Info size={20} />
                      </div>
                      <div className="text-sm text-blue-700">
                        <p className="font-medium">Registration Rules</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Each team must have at least 11 players and maximum 18 players</li>
                          <li>Registration deadline is October 15, 2023</li>
                          <li>Registration fee must be paid within 5 days of form submission</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex items-center justify-between">
                      <Button type="button" variant="outline" onClick={onPrevStep}>
                        Back
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Check size={16} />
                            Register Team
                          </span>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterTeam;
