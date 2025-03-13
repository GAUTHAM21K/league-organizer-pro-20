
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
import { Users, Upload, Info, Check, Plus, Trash, UserPlus } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";

// Type for player positions based on tournament type
type APLPosition = 'Batter' | 'Bowler' | 'All Rounder';
type ASLPosition = 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';

// Player type that can accommodate both tournament types
interface Player {
  id: number;
  name: string;
  position: ASLPosition | APLPosition;
  jerseyNumber?: number;
  age?: number;
}

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
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [tournamentType, setTournamentType] = useState("asl");
  
  // State for players
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Omit<Player, 'id'>>({
    name: '',
    position: tournamentType === 'asl' ? 'Forward' : 'Batter',
    jerseyNumber: undefined,
    age: undefined
  });

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
      // Reset player position for ASL
      setCurrentPlayer(prev => ({
        ...prev,
        position: 'Forward'
      }));
    } else {
      form.setValue("tournament", "apl");
      // Reset player position for APL
      setCurrentPlayer(prev => ({
        ...prev,
        position: 'Batter'
      }));
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

  const handlePlayerInputChange = (field: keyof Omit<Player, 'id'>, value: any) => {
    setCurrentPlayer({
      ...currentPlayer,
      [field]: value
    });
  };

  const addPlayer = () => {
    if (!currentPlayer.name) {
      toast({
        title: "Missing player name",
        description: "Please enter the player's name",
        variant: "destructive"
      });
      return;
    }

    const newPlayer: Player = {
      ...currentPlayer,
      id: players.length + 1
    };

    setPlayers([...players, newPlayer]);
    setCurrentPlayer({
      name: '',
      position: tournamentType === 'asl' ? 'Forward' : 'Batter',
      jerseyNumber: undefined,
      age: undefined
    });
  };

  const removePlayer = (playerId: number) => {
    setPlayers(players.filter(player => player.id !== playerId));
  };

  function onNextStep() {
    if (step === 2 && players.length < 11) {
      toast({
        title: "Insufficient players",
        description: `You need at least 11 players to register a team for ${tournamentType === "asl" ? "Ahalia Soccer League" : "Ahalia Premier League"}`,
        variant: "destructive"
      });
      return;
    }

    if (step === 1) {
      form.trigger(['teamName', 'department', 'captainName', 'captainEmail', 'captainPhone']).then((isValid) => {
        if (isValid) {
          setStep(2);
        }
      });
    } else if (step === 2) {
      setStep(3);
    }
  }

  function onPrevStep() {
    setStep(step - 1);
  }

  function onSubmit(values: FormValues) {
    if (players.length < 11) {
      toast({
        title: "Insufficient players",
        description: `You need at least 11 players to register a team for ${tournamentType === "asl" ? "Ahalia Soccer League" : "Ahalia Premier League"}`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Team registered successfully!",
        description: `Your team has been registered for the ${values.tournament === "asl" ? "Ahalia Soccer League" : "Ahalia Premier League"}.`,
      });
      console.log({
        ...values,
        players
      });
      form.reset();
      setStep(1);
      setLogoPreview(null);
      setPlayers([]);
      navigate('/');
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
                  <span className="text-sm mt-2">Players</span>
                </div>
                <div className={cn(
                  "flex-1 h-1 mx-4",
                  step >= 3 ? "bg-primary" : "bg-gray-200"
                )} />
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  )}>
                    3
                  </div>
                  <span className="text-sm mt-2">Review</span>
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
                        Continue to Players
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
                      <h3 className="text-lg font-medium mb-2">Team Players - {tournamentType.toUpperCase()}</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Add at least 11 players to your team. Include their positions and details.
                      </p>
                      
                      <Card className="mb-6">
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label htmlFor="player-name">Player Name</Label>
                              <Input
                                id="player-name"
                                value={currentPlayer.name}
                                onChange={(e) => handlePlayerInputChange('name', e.target.value)}
                                placeholder="Enter player name"
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="player-position">Position</Label>
                              <Select
                                value={currentPlayer.position}
                                onValueChange={(value) => handlePlayerInputChange('position', value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                  {tournamentType === 'asl' ? (
                                    <>
                                      <SelectItem value="Forward">Forward (FW)</SelectItem>
                                      <SelectItem value="Midfielder">Midfielder (MF)</SelectItem>
                                      <SelectItem value="Defender">Defender (DF)</SelectItem>
                                      <SelectItem value="Goalkeeper">Goalkeeper (GK)</SelectItem>
                                    </>
                                  ) : (
                                    <>
                                      <SelectItem value="Batter">Batter</SelectItem>
                                      <SelectItem value="Bowler">Bowler</SelectItem>
                                      <SelectItem value="All Rounder">All Rounder</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <Label htmlFor="player-jersey">Jersey Number</Label>
                              <Input
                                id="player-jersey"
                                value={currentPlayer.jerseyNumber || ''}
                                onChange={(e) => handlePlayerInputChange('jerseyNumber', parseInt(e.target.value) || undefined)}
                                placeholder="Optional"
                                type="number"
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="player-age">Age</Label>
                              <Input
                                id="player-age"
                                value={currentPlayer.age || ''}
                                onChange={(e) => handlePlayerInputChange('age', parseInt(e.target.value) || undefined)}
                                placeholder="Optional"
                                type="number"
                                className="mt-1"
                              />
                            </div>
                          </div>
                          
                          <Button 
                            type="button" 
                            onClick={addPlayer}
                            className="w-full"
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Player
                          </Button>
                        </CardContent>
                      </Card>
                      
                      {players.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>#</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Position</TableHead>
                              <TableHead>Jersey</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {players.map((player) => (
                              <TableRow key={player.id}>
                                <TableCell>{player.id}</TableCell>
                                <TableCell className="font-medium">{player.name}</TableCell>
                                <TableCell>
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    {player.position}
                                  </span>
                                </TableCell>
                                <TableCell>{player.jerseyNumber || '-'}</TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removePlayer(player.id)}
                                  >
                                    <Trash className="h-4 w-4 text-red-500" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No players added yet. Add at least 11 players to continue.
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className={cn(
                          "text-sm font-medium",
                          players.length < 11 ? "text-red-500" : "text-green-500"
                        )}>
                          {players.length} of 11 required players
                        </div>
                        <div className="text-sm text-gray-500">
                          Maximum 18 players
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex items-center justify-between">
                      <Button type="button" variant="outline" onClick={onPrevStep}>
                        Back
                      </Button>
                      <Button type="button" onClick={onNextStep}>
                        Continue to Review
                      </Button>
                    </div>
                  </>
                )}
                
                {step === 3 && (
                  <>
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
                    
                    <div className="p-5 bg-gray-50 rounded-lg mt-6">
                      <h3 className="text-lg font-medium mb-4">Team Summary</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium">Team Name:</span>
                          <span>{form.getValues("teamName")}</span>
                        </div>
                        
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium">Department:</span>
                          <span>{form.getValues("department")}</span>
                        </div>
                        
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium">Captain:</span>
                          <span>{form.getValues("captainName")}</span>
                        </div>
                        
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium">Tournament:</span>
                          <span>{tournamentType === "asl" ? "Ahalia Soccer League" : "Ahalia Premier League"}</span>
                        </div>
                        
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium">Players:</span>
                          <span>{players.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3 mt-6">
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
