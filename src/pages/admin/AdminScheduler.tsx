
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AdminSchedulerProps {
  tournamentType: string;
}

const teams = {
  asl: [
    { id: 1, name: 'Engineering Tigers' },
    { id: 2, name: 'Medicine United' },
    { id: 3, name: 'Commerce Titans' },
    { id: 4, name: 'Pharmacy Phoenix' }
  ],
  apl: [
    { id: 1, name: 'Science Strikers' },
    { id: 2, name: 'Arts Avengers' }
  ]
};

const venues = [
  { id: 1, name: 'Main Ground' },
  { id: 2, name: 'Cricket Stadium' },
  { id: 3, name: 'Indoor Court' }
];

interface Match {
  id: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
}

const AdminScheduler = ({ tournamentType }: AdminSchedulerProps) => {
  const [activeTab, setActiveTab] = useState('manual');
  const [selectedTeam1, setSelectedTeam1] = useState<string>('');
  const [selectedTeam2, setSelectedTeam2] = useState<string>('');
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [schedules, setSchedules] = useState<Match[]>([]);

  const relevantTeams = tournamentType === 'asl' ? teams.asl : teams.apl;

  const handleAddMatch = () => {
    if (!selectedTeam1 || !selectedTeam2 || !selectedVenue || !selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all the match details",
        variant: "destructive"
      });
      return;
    }

    if (selectedTeam1 === selectedTeam2) {
      toast({
        title: "Invalid selection",
        description: "Teams cannot play against themselves",
        variant: "destructive"
      });
      return;
    }

    const team1Name = relevantTeams.find(t => t.id.toString() === selectedTeam1)?.name || '';
    const team2Name = relevantTeams.find(t => t.id.toString() === selectedTeam2)?.name || '';
    const venueName = venues.find(v => v.id.toString() === selectedVenue)?.name || '';

    const newMatch: Match = {
      id: `match-${Date.now()}`,
      team1: team1Name,
      team2: team2Name,
      date: selectedDate,
      time: selectedTime,
      venue: venueName
    };

    setSchedules([...schedules, newMatch]);

    // Reset form
    setSelectedTeam1('');
    setSelectedTeam2('');
    setSelectedVenue('');
    setSelectedDate('');
    setSelectedTime('');

    toast({
      title: "Match scheduled",
      description: `${team1Name} vs ${team2Name} has been scheduled successfully.`
    });
  };

  const generateAutomaticSchedule = () => {
    const newSchedules: Match[] = [];
    const currentTeams = tournamentType === 'asl' ? teams.asl : teams.apl;
    
    // Create a round-robin tournament
    for (let i = 0; i < currentTeams.length; i++) {
      for (let j = i + 1; j < currentTeams.length; j++) {
        // Calculate dates (for demo, just spread over next 30 days)
        const matchDate = new Date();
        matchDate.setDate(matchDate.getDate() + (newSchedules.length * 3));
        
        const formattedDate = matchDate.toISOString().split('T')[0];
        
        // Alternate between two times
        const matchTime = newSchedules.length % 2 === 0 ? '15:00' : '17:30';
        
        // Alternate between venues
        const venueIndex = newSchedules.length % venues.length;
        
        newSchedules.push({
          id: `auto-${Date.now()}-${i}-${j}`,
          team1: currentTeams[i].name,
          team2: currentTeams[j].name,
          date: formattedDate,
          time: matchTime,
          venue: venues[venueIndex].name
        });
      }
    }

    setSchedules(newSchedules);
    
    toast({
      title: "Schedule generated",
      description: `Successfully created ${newSchedules.length} matches for the ${tournamentType.toUpperCase()} tournament.`
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Match Scheduler - {tournamentType === "asl" ? "Ahalia Soccer League" : "Ahalia Premier League"}
        </h2>
        <p className="text-gray-600">
          Create and manage match schedules for the tournament
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-1/3 grid-cols-2">
          <TabsTrigger value="manual">Manual Scheduling</TabsTrigger>
          <TabsTrigger value="automatic">Auto-generate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Team 1</label>
                  <Select value={selectedTeam1} onValueChange={setSelectedTeam1}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {relevantTeams.map(team => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Team 2</label>
                  <Select value={selectedTeam2} onValueChange={setSelectedTeam2}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {relevantTeams.map(team => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Venue</label>
                  <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map(venue => (
                        <SelectItem key={venue.id} value={venue.id.toString()}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <Button onClick={handleAddMatch}>
                <Plus className="mr-2 h-4 w-4" />
                Add Match
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="automatic" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p>
                  Automatically generate a round-robin schedule for all teams in the {tournamentType.toUpperCase()} tournament.
                  This will create match schedules with appropriate dates, times, and venues.
                </p>
                <Button onClick={generateAutomaticSchedule}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Current Schedule</h3>
            
            {schedules.length > 0 ? (
              <Table>
                <TableCaption>Match schedule for {tournamentType.toUpperCase()}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team 1</TableHead>
                    <TableHead>Team 2</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Venue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>{match.team1}</TableCell>
                      <TableCell>{match.team2}</TableCell>
                      <TableCell>{match.date}</TableCell>
                      <TableCell>{match.time}</TableCell>
                      <TableCell>{match.venue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center p-8 text-gray-500">
                <Calendar className="mr-2 h-5 w-5" />
                <span>No matches scheduled yet</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminScheduler;
