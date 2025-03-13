
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, Trophy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AdminScoresProps {
  tournamentType: string;
}

interface Match {
  id: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  score?: {
    team1: number;
    team2: number;
  };
  winner?: string;
}

// Sample matches data
const mockMatches: Record<string, Match[]> = {
  asl: [
    {
      id: 'm1',
      team1: 'Engineering Tigers',
      team2: 'Medicine United',
      date: '2023-10-25',
      time: '16:30',
      venue: 'Main Ground',
      status: 'scheduled'
    },
    {
      id: 'm2',
      team1: 'Commerce Titans',
      team2: 'Pharmacy Phoenix',
      date: '2023-10-27',
      time: '17:00',
      venue: 'Main Ground',
      status: 'scheduled'
    },
    {
      id: 'm3',
      team1: 'Engineering Tigers',
      team2: 'Commerce Titans',
      date: '2023-10-20',
      time: '16:00',
      venue: 'Main Ground',
      status: 'completed',
      score: {
        team1: 2,
        team2: 1
      },
      winner: 'Engineering Tigers'
    },
    {
      id: 'm4',
      team1: 'Medicine United',
      team2: 'Pharmacy Phoenix',
      date: '2023-10-18',
      time: '17:30',
      venue: 'Main Ground',
      status: 'completed',
      score: {
        team1: 0,
        team2: 0
      }
    }
  ],
  apl: [
    {
      id: 'm1',
      team1: 'Science Strikers',
      team2: 'Arts Avengers',
      date: '2023-10-26',
      time: '15:00',
      venue: 'Cricket Stadium',
      status: 'scheduled'
    },
    {
      id: 'm2',
      team1: 'Science Strikers',
      team2: 'Arts Avengers',
      date: '2023-10-19',
      time: '15:30',
      venue: 'Cricket Stadium',
      status: 'completed',
      score: {
        team1: 150,
        team2: 120
      },
      winner: 'Science Strikers'
    }
  ]
};

const AdminScores = ({ tournamentType }: AdminScoresProps) => {
  const [matches, setMatches] = useState<Match[]>(mockMatches[tournamentType]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [team1Score, setTeam1Score] = useState<string>('');
  const [team2Score, setTeam2Score] = useState<string>('');
  const [winnerTeam, setWinnerTeam] = useState<string>('');
  const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false);
  const [isLiveScoreMode, setIsLiveScoreMode] = useState(false);

  const upcomingMatches = matches.filter(match => match.status === 'scheduled');
  const completedMatches = matches.filter(match => match.status === 'completed');
  const liveMatches = matches.filter(match => match.status === 'in-progress');

  const handleStartMatch = (match: Match) => {
    const updatedMatches = matches.map(m => 
      m.id === match.id ? { ...m, status: 'in-progress' as const } : m
    );
    
    setMatches(updatedMatches);
    
    toast({
      title: "Match started",
      description: `${match.team1} vs ${match.team2} is now in progress.`
    });
  };

  const openScoreDialog = (match: Match, isLive: boolean = false) => {
    setSelectedMatch(match);
    setTeam1Score(match.score?.team1.toString() || '');
    setTeam2Score(match.score?.team2.toString() || '');
    setWinnerTeam(match.winner || '');
    setIsLiveScoreMode(isLive);
    setIsScoreDialogOpen(true);
  };

  const handleScoreSubmit = () => {
    if (!selectedMatch) return;
    
    // Validate scores
    const score1 = parseInt(team1Score);
    const score2 = parseInt(team2Score);
    
    if (isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) {
      toast({
        title: "Invalid scores",
        description: "Please enter valid positive numbers for scores",
        variant: "destructive"
      });
      return;
    }

    let winner = '';
    if (!isLiveScoreMode) {
      // If not live mode and scores are equal, a winner must be selected for some sports
      if (score1 === score2 && tournamentType === 'asl' && !winnerTeam) {
        // In soccer, if there's a tie, we don't need a winner unless it's a knockout match
      } else {
        // For cricket and other sports, we typically have a winner
        if (score1 > score2) {
          winner = selectedMatch.team1;
        } else if (score2 > score1) {
          winner = selectedMatch.team2;
        } else if (winnerTeam) {
          winner = winnerTeam;
        }
      }
    }

    const updatedMatches = matches.map(m => {
      if (m.id === selectedMatch.id) {
        return {
          ...m,
          status: isLiveScoreMode ? 'in-progress' as const : 'completed' as const,
          score: {
            team1: score1,
            team2: score2
          },
          winner: winner || undefined
        };
      }
      return m;
    });
    
    setMatches(updatedMatches);
    setIsScoreDialogOpen(false);
    
    toast({
      title: isLiveScoreMode ? "Live score updated" : "Match result recorded",
      description: `${selectedMatch.team1} ${score1} - ${score2} ${selectedMatch.team2}`
    });
  };

  const completeMatch = (match: Match) => {
    // First ensure we have scores
    if (!match.score) {
      toast({
        title: "Missing information",
        description: "Please update the score before completing the match",
        variant: "destructive"
      });
      return;
    }
    
    const updatedMatches = matches.map(m => {
      if (m.id === match.id) {
        let winner = '';
        if (m.score!.team1 > m.score!.team2) {
          winner = m.team1;
        } else if (m.score!.team2 > m.score!.team1) {
          winner = m.team2;
        }
        
        return {
          ...m,
          status: 'completed' as const,
          winner: winner || undefined
        };
      }
      return m;
    });
    
    setMatches(updatedMatches);
    
    toast({
      title: "Match completed",
      description: `${match.team1} vs ${match.team2} has been marked as completed.`
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Live Scores & Results - {tournamentType === "asl" ? "Ahalia Soccer League" : "Ahalia Premier League"}
        </h2>
        <p className="text-gray-600">
          Update match scores and record final results
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-2/3 grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming Matches
            <span className="ml-2 bg-gray-100 text-gray-700 text-xs py-0.5 px-1.5 rounded-full">
              {upcomingMatches.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="live">
            Live Matches
            <span className="ml-2 bg-red-100 text-red-700 text-xs py-0.5 px-1.5 rounded-full">
              {liveMatches.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <span className="ml-2 bg-green-100 text-green-700 text-xs py-0.5 px-1.5 rounded-full">
              {completedMatches.length}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {upcomingMatches.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teams</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingMatches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell>
                          <div className="font-medium">{match.team1} vs {match.team2}</div>
                        </TableCell>
                        <TableCell>
                          {new Date(match.date).toLocaleDateString()} at {match.time}
                        </TableCell>
                        <TableCell>{match.venue}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="default" size="sm" onClick={() => handleStartMatch(match)}>
                            Start Match
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  <span>No upcoming matches scheduled</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="live" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {liveMatches.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teams</TableHead>
                      <TableHead>Current Score</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {liveMatches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell>
                          <div className="font-medium">{match.team1} vs {match.team2}</div>
                          <div className="text-xs text-red-600 flex items-center mt-1">
                            <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                            Live Now
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-lg font-bold">
                            {match.score ? `${match.score.team1} - ${match.score.team2}` : '0 - 0'}
                          </div>
                        </TableCell>
                        <TableCell>{match.venue}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openScoreDialog(match, true)}
                          >
                            Update Score
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => completeMatch(match)}
                          >
                            End Match
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  <span>No matches currently in progress</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {completedMatches.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teams</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Winner</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedMatches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell>
                          <div className="font-medium">{match.team1} vs {match.team2}</div>
                        </TableCell>
                        <TableCell>
                          {match.score ? `${match.score.team1} - ${match.score.team2}` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {new Date(match.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {match.winner ? (
                            <div className="flex items-center">
                              <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                              <span>{match.winner}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500">Draw</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openScoreDialog(match)}
                          >
                            Edit Result
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  <span>No completed matches yet</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Score Update Dialog */}
      <Dialog open={isScoreDialogOpen} onOpenChange={setIsScoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isLiveScoreMode ? 'Update Live Score' : 'Record Match Result'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMatch && (
            <div className="space-y-4 py-4">
              <div className="text-center mb-4">
                <div className="text-lg font-medium">{selectedMatch.team1} vs {selectedMatch.team2}</div>
                <div className="text-sm text-gray-500">
                  {new Date(selectedMatch.date).toLocaleDateString()} at {selectedMatch.time}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <Label className="block mb-2">{selectedMatch.team1}</Label>
                  <Input
                    type="number"
                    min="0"
                    value={team1Score}
                    onChange={(e) => setTeam1Score(e.target.value)}
                    className="text-center text-lg"
                  />
                </div>
                
                <div className="text-center text-xl font-bold">
                  vs
                </div>
                
                <div className="text-center">
                  <Label className="block mb-2">{selectedMatch.team2}</Label>
                  <Input
                    type="number"
                    min="0"
                    value={team2Score}
                    onChange={(e) => setTeam2Score(e.target.value)}
                    className="text-center text-lg"
                  />
                </div>
              </div>
              
              {!isLiveScoreMode && tournamentType === 'asl' && team1Score === team2Score && (
                <div className="mt-4">
                  <Label className="block mb-2">Winner (if decided by penalties/extra time)</Label>
                  <RadioGroup value={winnerTeam} onValueChange={setWinnerTeam}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={selectedMatch.team1} id="team1" />
                      <Label htmlFor="team1">{selectedMatch.team1}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={selectedMatch.team2} id="team2" />
                      <Label htmlFor="team2">{selectedMatch.team2}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="" id="draw" />
                      <Label htmlFor="draw">Draw (No Winner)</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsScoreDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleScoreSubmit}>
                  <Check className="mr-2 h-4 w-4" />
                  {isLiveScoreMode ? 'Update Score' : 'Save Result'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminScores;
