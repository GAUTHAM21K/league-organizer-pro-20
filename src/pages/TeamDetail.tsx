
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnimation } from '@/hooks/use-animation';
import { cn } from '@/lib/utils';
import { ChevronLeft, Users, Trophy, BarChart3, Calendar } from 'lucide-react';

// Sample data - in a real app, this would come from an API
const teams = [
  {
    id: '1',
    name: 'Engineering Tigers',
    captain: 'Alex Johnson',
    players: 15,
    tournament: 'Ahalia Soccer League',
    wins: 4,
    losses: 1,
    draws: 2,
    points: 14,
    logo: '🐯',
    coach: 'Michael Brown',
    established: '2021',
    description: 'A team of engineering students with a passion for soccer.',
    members: [
      { id: '1', name: 'Alex Johnson', position: 'Forward (Captain)', number: 10 },
      { id: '2', name: 'Sam Roberts', position: 'Goalkeeper', number: 1 },
      { id: '3', name: 'Chris Wilson', position: 'Defender', number: 5 },
      { id: '4', name: 'Taylor Moore', position: 'Midfielder', number: 8 },
      { id: '5', name: 'Jordan Lee', position: 'Forward', number: 9 },
    ]
  },
  {
    id: '2',
    name: 'Medicine United',
    captain: 'Sam Williams',
    players: 14,
    tournament: 'Ahalia Soccer League',
    wins: 5,
    losses: 1,
    draws: 1,
    points: 16,
    logo: '⚕️',
    coach: 'Dr. Sarah Thompson',
    established: '2020',
    description: 'Medical students who balance academics and sports excellence.',
    members: [
      { id: '1', name: 'Sam Williams', position: 'Midfielder (Captain)', number: 8 },
      { id: '2', name: 'Alex Chen', position: 'Goalkeeper', number: 1 },
      { id: '3', name: 'Robin Garcia', position: 'Defender', number: 4 },
      { id: '4', name: 'Jamie Lewis', position: 'Forward', number: 11 },
      { id: '5', name: 'Casey Martinez', position: 'Midfielder', number: 6 },
    ]
  },
  // Additional teams would be here
];

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<typeof teams[0] | null>(null);
  const { ref, isVisible } = useAnimation();
  
  useEffect(() => {
    // Find the team in our data (in a real app, this would be an API call)
    const foundTeam = teams.find(t => t.id === id);
    setTeam(foundTeam || null);
  }, [id]);

  if (!team) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900">Team not found</h1>
              <p className="mt-2 text-gray-600">The team you're looking for doesn't exist or has been removed.</p>
              <Link to="/teams">
                <Button className="mt-4">
                  Return to Teams
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Link to="/teams" className="inline-flex items-center text-primary hover:underline mb-4">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Teams
            </Link>
            
            <div 
              ref={ref as React.RefObject<HTMLDivElement>}
              className={cn(
                "transition-all duration-500",
                isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                <div className="flex-shrink-0 w-24 h-24 bg-primary/10 rounded-xl flex items-center justify-center text-4xl">
                  {team.logo}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                  <p className="text-gray-600 mt-1">
                    {team.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {team.tournament}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Trophy className="mr-1 h-3 w-3" /> {team.points} Points
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Team stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Coach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium">{team.coach}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Captain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium">{team.captain}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Players</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium">{team.players}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Established</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium">{team.established}</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Team record */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Team Record
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{team.wins}</p>
                      <p className="text-sm text-gray-500">Wins</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{team.losses}</p>
                      <p className="text-sm text-gray-500">Losses</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-600">{team.draws}</p>
                      <p className="text-sm text-gray-500">Draws</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Team members */}
              <h2 className="text-xl font-bold mb-4">Team Members</h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {team.members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex gap-4">
                <Link to={`/teams/${team.id}/edit`}>
                  <Button variant="outline">Edit Team</Button>
                </Link>
                <Link to={`/teams/${team.id}/schedule`}>
                  <Button>View Schedule</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeamDetail;
