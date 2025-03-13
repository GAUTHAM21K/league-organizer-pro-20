
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Pencil, Plus, Trash, X, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { TournamentToggle } from '@/components/ui/tournament-toggle';

interface AdminTeamsProps {
  tournamentType: string;
}

interface Player {
  id: number;
  name: string;
  position: string;
  jerseyNumber?: number;
  stats: {
    // Soccer stats
    goals?: number;
    assists?: number;
    yellowCards?: number;
    redCards?: number;
    // Cricket stats
    runs?: number;
    wickets?: number;
    matches?: number;
    average?: number;
  };
}

interface Team {
  id: number;
  name: string;
  captain: string;
  players: Player[];
  contactEmail: string;
  status: 'active' | 'pending' | 'rejected';
}

const mockTeams: Record<string, Team[]> = {
  asl: [
    { 
      id: 1, 
      name: 'Engineering Tigers', 
      captain: 'John Davis', 
      contactEmail: 'john@example.com', 
      status: 'active',
      players: [
        { id: 1, name: 'John Davis', position: 'Forward', jerseyNumber: 10, stats: { goals: 5, assists: 3, yellowCards: 1, redCards: 0 } },
        { id: 2, name: 'Mike Smith', position: 'Midfielder', jerseyNumber: 8, stats: { goals: 2, assists: 4, yellowCards: 0, redCards: 0 } },
        { id: 3, name: 'Chris Johnson', position: 'Defender', jerseyNumber: 5, stats: { goals: 0, assists: 1, yellowCards: 2, redCards: 0 } },
      ]
    },
    { 
      id: 2, 
      name: 'Medicine United', 
      captain: 'Sarah Wilson', 
      contactEmail: 'sarah@example.com', 
      status: 'active',
      players: [
        { id: 1, name: 'Sarah Wilson', position: 'Midfielder', jerseyNumber: 7, stats: { goals: 3, assists: 5, yellowCards: 0, redCards: 0 } },
        { id: 2, name: 'Alex Brown', position: 'Forward', jerseyNumber: 9, stats: { goals: 6, assists: 2, yellowCards: 1, redCards: 0 } },
      ]
    },
  ],
  apl: [
    { 
      id: 1, 
      name: 'Science Strikers', 
      captain: 'David Miller', 
      contactEmail: 'david@example.com', 
      status: 'active',
      players: [
        { id: 1, name: 'David Miller', position: 'Batter', jerseyNumber: 45, stats: { runs: 120, wickets: 0, matches: 4, average: 30 } },
        { id: 2, name: 'Raj Patel', position: 'Bowler', jerseyNumber: 99, stats: { runs: 15, wickets: 8, matches: 4, average: 3.75 } },
        { id: 3, name: 'Tom Wilson', position: 'All Rounder', jerseyNumber: 7, stats: { runs: 85, wickets: 5, matches: 4, average: 21.25 } },
      ]
    },
    { 
      id: 2, 
      name: 'Arts Avengers', 
      captain: 'Jessica Lee', 
      contactEmail: 'jessica@example.com', 
      status: 'active',
      players: [
        { id: 1, name: 'Jessica Lee', position: 'Batter', jerseyNumber: 18, stats: { runs: 95, wickets: 0, matches: 3, average: 31.67 } },
        { id: 2, name: 'Ben Smith', position: 'All Rounder', jerseyNumber: 23, stats: { runs: 75, wickets: 4, matches: 3, average: 25 } },
      ]
    }
  ]
};

const AdminTeams = ({ tournamentType: initialTournamentType = "asl" }: AdminTeamsProps) => {
  const [tournamentType, setTournamentType] = useState(initialTournamentType);
  const [teams, setTeams] = useState<Team[]>(mockTeams[initialTournamentType]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPlayerDialogOpen, setIsPlayerDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [newTeam, setNewTeam] = useState({
    name: '',
    captain: '',
    contactEmail: '',
  });
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    position: tournamentType === 'asl' ? 'Forward' : 'Batter',
    jerseyNumber: '',
  });

  useEffect(() => {
    setTeams(mockTeams[tournamentType]);
    setNewPlayer({
      ...newPlayer,
      position: tournamentType === 'asl' ? 'Forward' : 'Batter',
    });
  }, [tournamentType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (editingTeam) {
      setEditingTeam({
        ...editingTeam,
        [field]: e.target.value,
      });
    } else {
      setNewTeam({
        ...newTeam,
        [field]: e.target.value,
      });
    }
  };

  const handlePlayerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    if (selectedPlayer) {
      if (field === 'goals' || field === 'assists' || field === 'yellowCards' || field === 'redCards' || 
          field === 'runs' || field === 'wickets' || field === 'matches' || field === 'average') {
        setSelectedPlayer({
          ...selectedPlayer,
          stats: {
            ...selectedPlayer.stats,
            [field]: field === 'average' ? parseFloat(e.target.value) || 0 : parseInt(e.target.value) || 0
          }
        });
      } else {
        setSelectedPlayer({
          ...selectedPlayer,
          [field]: field === 'jerseyNumber' ? parseInt(e.target.value) || undefined : e.target.value,
        });
      }
    } else {
      setNewPlayer({
        ...newPlayer,
        [field]: field === 'jerseyNumber' ? e.target.value : e.target.value,
      });
    }
  };

  const handleAddTeam = () => {
    if (!newTeam.name || !newTeam.captain || !newTeam.contactEmail) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newTeamObject: Team = {
      id: teams.length + 1,
      name: newTeam.name,
      captain: newTeam.captain,
      players: [],
      contactEmail: newTeam.contactEmail,
      status: 'active'
    };

    setTeams([...teams, newTeamObject]);
    setNewTeam({ name: '', captain: '', contactEmail: '' });
    setIsAddDialogOpen(false);

    toast({
      title: "Team added",
      description: `${newTeam.name} has been added to the ${tournamentType.toUpperCase()} tournament.`
    });
  };

  const startEditing = (team: Team) => {
    setEditingTeam(team);
  };

  const cancelEditing = () => {
    setEditingTeam(null);
  };

  const saveTeamEdit = () => {
    if (!editingTeam) return;

    if (!editingTeam.name || !editingTeam.captain || !editingTeam.contactEmail) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const updatedTeams = teams.map(team => 
      team.id === editingTeam.id ? editingTeam : team
    );
    
    setTeams(updatedTeams);
    setEditingTeam(null);
    
    toast({
      title: "Team updated",
      description: `${editingTeam.name} has been updated successfully.`
    });
  };

  const deleteTeam = (teamId: number) => {
    const teamToDelete = teams.find(team => team.id === teamId);
    if (!teamToDelete) return;

    const updatedTeams = teams.filter(team => team.id !== teamId);
    setTeams(updatedTeams);
    
    toast({
      title: "Team removed",
      description: `${teamToDelete.name} has been removed from the tournament.`
    });
  };

  const openPlayerDialog = (team: Team, player: Player | null = null) => {
    setSelectedTeam(team);
    setSelectedPlayer(player);
    setIsPlayerDialogOpen(true);
  };

  const handleAddPlayer = () => {
    if (!selectedTeam) return;
    if (!newPlayer.name) {
      toast({
        title: "Missing information",
        description: "Please enter the player's name",
        variant: "destructive"
      });
      return;
    }

    const newPlayerObject: Player = {
      id: selectedTeam.players.length + 1,
      name: newPlayer.name,
      position: newPlayer.position,
      jerseyNumber: parseInt(newPlayer.jerseyNumber) || undefined,
      stats: tournamentType === 'asl' 
        ? { goals: 0, assists: 0, yellowCards: 0, redCards: 0 } 
        : { runs: 0, wickets: 0, matches: 0, average: 0 }
    };

    const updatedTeam = {
      ...selectedTeam,
      players: [...selectedTeam.players, newPlayerObject]
    };

    const updatedTeams = teams.map(team => 
      team.id === selectedTeam.id ? updatedTeam : team
    );
    
    setTeams(updatedTeams);
    setNewPlayer({
      name: '',
      position: tournamentType === 'asl' ? 'Forward' : 'Batter',
      jerseyNumber: '',
    });
    
    toast({
      title: "Player added",
      description: `${newPlayer.name} has been added to ${selectedTeam.name}.`
    });
  };

  const handleSavePlayerStats = () => {
    if (!selectedTeam || !selectedPlayer) return;

    const updatedPlayers = selectedTeam.players.map(player => 
      player.id === selectedPlayer.id ? selectedPlayer : player
    );

    const updatedTeam = {
      ...selectedTeam,
      players: updatedPlayers
    };

    const updatedTeams = teams.map(team => 
      team.id === selectedTeam.id ? updatedTeam : team
    );
    
    setTeams(updatedTeams);
    setIsPlayerDialogOpen(false);
    
    toast({
      title: "Player updated",
      description: `${selectedPlayer.name}'s statistics have been updated.`
    });
  };

  const handleDeletePlayer = (teamId: number, playerId: number) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const playerToDelete = team.players.find(p => p.id === playerId);
    if (!playerToDelete) return;

    const updatedPlayers = team.players.filter(p => p.id !== playerId);
    
    const updatedTeam = {
      ...team,
      players: updatedPlayers
    };

    const updatedTeams = teams.map(t => t.id === teamId ? updatedTeam : t);
    
    setTeams(updatedTeams);
    
    toast({
      title: "Player removed",
      description: `${playerToDelete.name} has been removed from ${team.name}.`
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Team Management
        </h2>
        <p className="text-gray-600">
          Manage teams participating in the tournament
        </p>
      </div>

      <div className="mb-6">
        <Label className="mb-2 block">Tournament</Label>
        <TournamentToggle
          value={tournamentType}
          onValueChange={setTournamentType}
        />
      </div>

      <div className="flex justify-between mb-6">
        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium text-gray-700">
            {teams.length} teams registered
          </span>
          <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">
            {teams.filter(t => t.status === 'active').length} active
          </span>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team</DialogTitle>
              <DialogDescription>
                Enter the details for the new team to add to the {tournamentType.toUpperCase()} tournament.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  value={newTeam.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                  placeholder="Enter team name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="captain">Captain Name</Label>
                <Input
                  id="captain"
                  value={newTeam.captain}
                  onChange={(e) => handleInputChange(e, 'captain')}
                  placeholder="Enter captain name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  value={newTeam.contactEmail}
                  onChange={(e) => handleInputChange(e, 'contactEmail')}
                  placeholder="Enter contact email"
                  type="email"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTeam}>
                Add Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Captain</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  {editingTeam && editingTeam.id === team.id ? (
                    <>
                      <TableCell>
                        <Input
                          value={editingTeam.name}
                          onChange={(e) => handleInputChange(e, 'name')}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editingTeam.captain}
                          onChange={(e) => handleInputChange(e, 'captain')}
                        />
                      </TableCell>
                      <TableCell>
                        {team.players.length}
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editingTeam.contactEmail}
                          onChange={(e) => handleInputChange(e, 'contactEmail')}
                          type="email"
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={editingTeam.status}
                          onChange={(e) => setEditingTeam({...editingTeam, status: e.target.value as 'active' | 'pending' | 'rejected'})}
                          className="p-2 border rounded"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={saveTeamEdit}>
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={cancelEditing}>
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{team.name}</TableCell>
                      <TableCell>{team.captain}</TableCell>
                      <TableCell>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto font-normal text-primary"
                          onClick={() => openPlayerDialog(team)}
                        >
                          {team.players.length} players
                        </Button>
                      </TableCell>
                      <TableCell>{team.contactEmail}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          team.status === 'active' ? 'bg-green-100 text-green-800' : 
                          team.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {team.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(team)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteTeam(team.id)}>
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Player Management Dialog */}
      <Dialog open={isPlayerDialogOpen} onOpenChange={setIsPlayerDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTeam ? `${selectedTeam.name} - Player Management` : "Player Management"}
            </DialogTitle>
            <DialogDescription>
              {selectedPlayer ? "Edit player statistics" : "Add players or manage existing players"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTeam && !selectedPlayer && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="player-name">Player Name</Label>
                  <Input
                    id="player-name"
                    value={newPlayer.name}
                    onChange={(e) => handlePlayerInputChange(e, 'name')}
                    placeholder="Enter player name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="player-position">Position</Label>
                  <select
                    id="player-position"
                    value={newPlayer.position}
                    onChange={(e) => handlePlayerInputChange(e, 'position')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {tournamentType === 'asl' ? (
                      <>
                        <option value="Forward">Forward (FW)</option>
                        <option value="Midfielder">Midfielder (MF)</option>
                        <option value="Defender">Defender (DF)</option>
                        <option value="Goalkeeper">Goalkeeper (GK)</option>
                      </>
                    ) : (
                      <>
                        <option value="Batter">Batter</option>
                        <option value="Bowler">Bowler</option>
                        <option value="All Rounder">All Rounder</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="player-jersey">Jersey Number</Label>
                  <Input
                    id="player-jersey"
                    value={newPlayer.jerseyNumber}
                    onChange={(e) => handlePlayerInputChange(e, 'jerseyNumber')}
                    placeholder="Optional"
                    type="number"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleAddPlayer}>
                  <Users className="mr-2 h-4 w-4" />
                  Add Player
                </Button>
              </div>
              
              <div className="my-6">
                <h3 className="text-lg font-medium mb-4">Current Players</h3>
                {selectedTeam.players.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Jersey</TableHead>
                        {tournamentType === 'asl' ? (
                          <>
                            <TableHead>Goals</TableHead>
                            <TableHead>Assists</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead>Runs</TableHead>
                            <TableHead>Wickets</TableHead>
                          </>
                        )}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTeam.players.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell>{player.id}</TableCell>
                          <TableCell className="font-medium">{player.name}</TableCell>
                          <TableCell>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {player.position}
                            </span>
                          </TableCell>
                          <TableCell>{player.jerseyNumber || '-'}</TableCell>
                          {tournamentType === 'asl' ? (
                            <>
                              <TableCell>{player.stats.goals}</TableCell>
                              <TableCell>{player.stats.assists}</TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>{player.stats.runs}</TableCell>
                              <TableCell>{player.stats.wickets}</TableCell>
                            </>
                          )}
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openPlayerDialog(selectedTeam, player)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeletePlayer(selectedTeam.id, player.id)}
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
                    No players added yet.
                  </div>
                )}
              </div>
            </>
          )}
          
          {selectedPlayer && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-player-name">Player Name</Label>
                  <Input
                    id="edit-player-name"
                    value={selectedPlayer.name}
                    onChange={(e) => handlePlayerInputChange(e, 'name')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-player-position">Position</Label>
                  <select
                    id="edit-player-position"
                    value={selectedPlayer.position}
                    onChange={(e) => handlePlayerInputChange(e, 'position')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {tournamentType === 'asl' ? (
                      <>
                        <option value="Forward">Forward (FW)</option>
                        <option value="Midfielder">Midfielder (MF)</option>
                        <option value="Defender">Defender (DF)</option>
                        <option value="Goalkeeper">Goalkeeper (GK)</option>
                      </>
                    ) : (
                      <>
                        <option value="Batter">Batter</option>
                        <option value="Bowler">Bowler</option>
                        <option value="All Rounder">All Rounder</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-player-jersey">Jersey Number</Label>
                  <Input
                    id="edit-player-jersey"
                    value={selectedPlayer.jerseyNumber || ''}
                    onChange={(e) => handlePlayerInputChange(e, 'jerseyNumber')}
                    type="number"
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-6 mb-3">Player Statistics</h3>
              
              {tournamentType === 'asl' ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-player-goals">Goals</Label>
                    <Input
                      id="edit-player-goals"
                      value={selectedPlayer.stats.goals || 0}
                      onChange={(e) => handlePlayerInputChange(e, 'goals')}
                      type="number"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-player-assists">Assists</Label>
                    <Input
                      id="edit-player-assists"
                      value={selectedPlayer.stats.assists || 0}
                      onChange={(e) => handlePlayerInputChange(e, 'assists')}
                      type="number"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-player-yellowCards">Yellow Cards</Label>
                    <Input
                      id="edit-player-yellowCards"
                      value={selectedPlayer.stats.yellowCards || 0}
                      onChange={(e) => handlePlayerInputChange(e, 'yellowCards')}
                      type="number"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-player-redCards">Red Cards</Label>
                    <Input
                      id="edit-player-redCards"
                      value={selectedPlayer.stats.redCards || 0}
                      onChange={(e) => handlePlayerInputChange(e, 'redCards')}
                      type="number"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-player-runs">Runs</Label>
                    <Input
                      id="edit-player-runs"
                      value={selectedPlayer.stats.runs || 0}
                      onChange={(e) => handlePlayerInputChange(e, 'runs')}
                      type="number"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-player-wickets">Wickets</Label>
                    <Input
                      id="edit-player-wickets"
                      value={selectedPlayer.stats.wickets || 0}
                      onChange={(e) => handlePlayerInputChange(e, 'wickets')}
                      type="number"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-player-matches">Matches</Label>
                    <Input
                      id="edit-player-matches"
                      value={selectedPlayer.stats.matches || 0}
                      onChange={(e) => handlePlayerInputChange(e, 'matches')}
                      type="number"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-player-average">Average</Label>
                    <Input
                      id="edit-player-average"
                      value={selectedPlayer.stats.average || 0}
                      onChange={(e) => handlePlayerInputChange(e, 'average')}
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedPlayer(null);
                  }}
                >
                  Back to Players
                </Button>
                <Button onClick={handleSavePlayerStats}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTeams;
