
import { useState } from 'react';
import { useAnimation } from '@/hooks/use-animation';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type ColumnDef } from '@tanstack/react-table';
import { User, Filter, ChevronRight } from 'lucide-react';
import { TournamentToggle } from '@/components/ui/tournament-toggle';

// Sample player data
const players = [
  {
    id: '1',
    name: 'Alex Johnson',
    team: 'Engineering Tigers',
    tournament: 'Ahalia Soccer League',
    tournamentCode: 'asl',
    position: 'Forward',
    goals: 7,
    assists: 4,
    yellowCards: 2,
    redCards: 0,
  },
  {
    id: '2',
    name: 'Sam Williams',
    team: 'Medicine United',
    tournament: 'Ahalia Soccer League',
    tournamentCode: 'asl',
    position: 'Midfielder',
    goals: 3,
    assists: 8,
    yellowCards: 1,
    redCards: 0,
  },
  {
    id: '3',
    name: 'Jamie Taylor',
    team: 'Science Strikers',
    tournament: 'Ahalia Premier League',
    tournamentCode: 'apl',
    position: 'Defender',
    goals: 1,
    assists: 2,
    yellowCards: 3,
    redCards: 0,
  },
  {
    id: '4',
    name: 'Jordan Smith',
    team: 'Arts Avengers',
    tournament: 'Ahalia Premier League',
    tournamentCode: 'apl',
    position: 'Goalkeeper',
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: '5',
    name: 'Casey Brown',
    team: 'Commerce Titans',
    tournament: 'Ahalia Soccer League',
    tournamentCode: 'asl',
    position: 'Forward',
    goals: 5,
    assists: 3,
    yellowCards: 2,
    redCards: 1,
  },
  {
    id: '6',
    name: 'Riley Martinez',
    team: 'Pharmacy Phoenix',
    tournament: 'Ahalia Soccer League',
    tournamentCode: 'asl',
    position: 'Midfielder',
    goals: 2,
    assists: 5,
    yellowCards: 1,
    redCards: 0,
  },
];

type Player = typeof players[0];

// Define columns for the data table
const columns: ColumnDef<Player>[] = [
  {
    accessorKey: 'name',
    header: 'Player Name',
  },
  {
    accessorKey: 'team',
    header: 'Team',
  },
  {
    accessorKey: 'tournament',
    header: 'Tournament',
    cell: ({ row }) => (
      <div className="text-xs bg-primary/10 text-primary font-medium px-2 py-1 rounded-full inline-block">
        {row.getValue('tournament')}
      </div>
    ),
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'goals',
    header: 'Goals',
    cell: ({ row }) => (
      <div className="font-semibold text-center">{row.getValue('goals')}</div>
    ),
  },
  {
    accessorKey: 'assists',
    header: 'Assists',
    cell: ({ row }) => (
      <div className="font-semibold text-center">{row.getValue('assists')}</div>
    ),
  },
  {
    id: 'cards',
    header: 'Cards (Y/R)',
    cell: ({ row }) => (
      <div className="font-mono text-center">
        {row.original.yellowCards}/{row.original.redCards}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <ChevronRight className="h-4 w-4" />
      </Button>
    ),
  },
];

const Players = () => {
  const { ref, isVisible } = useAnimation();
  const [activePosition, setActivePosition] = useState('all');
  const [tournamentType, setTournamentType] = useState("all");

  // Filter players based on position and tournament
  const filteredPlayers = players.filter(player => {
    // Filter by position
    const positionMatch = 
      activePosition === 'all' ? true : 
      player.position.toLowerCase() === activePosition.toLowerCase();
    
    // Filter by tournament
    const tournamentMatch = 
      tournamentType === 'all' ? true : 
      player.tournamentCode === tournamentType;
    
    return positionMatch && tournamentMatch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Players</h1>
                <p className="text-gray-600 mt-1">
                  Browse all registered players and their statistics
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter size={16} />
                  Filter
                </Button>
                <Button size="sm" className="gap-2">
                  <User size={16} />
                  Register Player
                </Button>
              </div>
            </div>
          </div>
          
          {/* Tournament toggle */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Tournament:</span>
              <TournamentToggle 
                value={tournamentType !== "all" ? tournamentType : ""}
                onValueChange={(value) => setTournamentType(value || "all")}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "gap-2",
                tournamentType === "all" ? "bg-primary/10 border-primary/20 text-primary" : ""
              )}
              onClick={() => setTournamentType("all")}
            >
              <Filter size={16} />
              Show All Players
            </Button>
          </div>
          
          {/* Position filter tabs */}
          <div className="flex overflow-x-auto mb-6 border-b border-gray-200">
            <button
              className={cn(
                "mr-6 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activePosition === 'all'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActivePosition('all')}
            >
              All Positions
            </button>
            <button
              className={cn(
                "mr-6 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activePosition === 'forward'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActivePosition('forward')}
            >
              Forwards
            </button>
            <button
              className={cn(
                "mr-6 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activePosition === 'midfielder'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActivePosition('midfielder')}
            >
              Midfielders
            </button>
            <button
              className={cn(
                "mr-6 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activePosition === 'defender'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActivePosition('defender')}
            >
              Defenders
            </button>
            <button
              className={cn(
                "mr-6 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activePosition === 'goalkeeper'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActivePosition('goalkeeper')}
            >
              Goalkeepers
            </button>
          </div>
          
          <div 
            ref={ref as React.RefObject<HTMLDivElement>}
            className={cn(
              "transition-all duration-500",
              isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
            )}
          >
            <DataTable 
              columns={columns} 
              data={filteredPlayers} 
              searchKey="name"
              searchPlaceholder="Search players..."
            />
          </div>
          
          {/* Player stats summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Top Scorer</h3>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">
                  {tournamentType === "apl" ? "Jordan Smith" : "Alex Johnson"}
                </div>
                <div className="text-sm text-gray-500">
                  {tournamentType === "apl" ? "4 goals • Arts Avengers" : "7 goals • Engineering Tigers"}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Top Assists</h3>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">
                  {tournamentType === "apl" ? "Jamie Taylor" : "Sam Williams"}
                </div>
                <div className="text-sm text-gray-500">
                  {tournamentType === "apl" ? "2 assists • Science Strikers" : "8 assists • Medicine United"}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Most Yellow Cards</h3>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">
                  {tournamentType === "apl" ? "Jamie Taylor" : "Alex Johnson"}
                </div>
                <div className="text-sm text-gray-500">
                  {tournamentType === "apl" ? "3 cards • Science Strikers" : "2 cards • Engineering Tigers"}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Most Red Cards</h3>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">
                  {tournamentType === "apl" ? "None" : "Casey Brown"}
                </div>
                <div className="text-sm text-gray-500">
                  {tournamentType === "apl" ? "0 cards" : "1 card • Commerce Titans"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Players;
