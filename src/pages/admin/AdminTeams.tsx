
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Pencil, Plus, Trash, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AdminTeamsProps {
  tournamentType: string;
}

interface Team {
  id: number;
  name: string;
  captain: string;
  players: number;
  contactEmail: string;
  status: 'active' | 'pending' | 'rejected';
}

const mockTeams: Record<string, Team[]> = {
  asl: [
    { id: 1, name: 'Engineering Tigers', captain: 'John Davis', players: 18, contactEmail: 'john@example.com', status: 'active' },
    { id: 2, name: 'Medicine United', captain: 'Sarah Wilson', players: 16, contactEmail: 'sarah@example.com', status: 'active' },
    { id: 3, name: 'Commerce Titans', captain: 'Mike Johnson', players: 15, contactEmail: 'mike@example.com', status: 'active' },
    { id: 4, name: 'Pharmacy Phoenix', captain: 'Emily Brown', players: 17, contactEmail: 'emily@example.com', status: 'active' },
  ],
  apl: [
    { id: 1, name: 'Science Strikers', captain: 'David Miller', players: 14, contactEmail: 'david@example.com', status: 'active' },
    { id: 2, name: 'Arts Avengers', captain: 'Jessica Lee', players: 13, contactEmail: 'jessica@example.com', status: 'active' },
  ]
};

const AdminTeams = ({ tournamentType }: AdminTeamsProps) => {
  const [teams, setTeams] = useState<Team[]>(mockTeams[tournamentType]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    captain: '',
    players: '',
    contactEmail: '',
  });
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (editingTeam) {
      setEditingTeam({
        ...editingTeam,
        [field]: field === 'players' ? parseInt(e.target.value) || 0 : e.target.value,
      });
    } else {
      setNewTeam({
        ...newTeam,
        [field]: e.target.value,
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

    const playerCount = parseInt(newTeam.players) || 0;
    if (playerCount < 11) {
      toast({
        title: "Invalid team size",
        description: "A team must have at least 11 players",
        variant: "destructive"
      });
      return;
    }

    const newTeamObject: Team = {
      id: teams.length + 1,
      name: newTeam.name,
      captain: newTeam.captain,
      players: playerCount,
      contactEmail: newTeam.contactEmail,
      status: 'active'
    };

    setTeams([...teams, newTeamObject]);
    setNewTeam({ name: '', captain: '', players: '', contactEmail: '' });
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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Team Management - {tournamentType === "asl" ? "Ahalia Soccer League" : "Ahalia Premier League"}
        </h2>
        <p className="text-gray-600">
          Manage teams participating in the tournament
        </p>
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
                <Label htmlFor="players">Number of Players</Label>
                <Input
                  id="players"
                  value={newTeam.players}
                  onChange={(e) => handleInputChange(e, 'players')}
                  placeholder="Enter player count"
                  type="number"
                  min="11"
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
                        <Input
                          value={editingTeam.players}
                          onChange={(e) => handleInputChange(e, 'players')}
                          type="number"
                          min="11"
                        />
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
                      <TableCell>{team.players}</TableCell>
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
    </div>
  );
};

export default AdminTeams;
