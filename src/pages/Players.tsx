
import { useState } from 'react';
import { useAnimation } from '@/hooks/use-animation';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type ColumnDef } from '@tanstack/react-table';
import { User, Filter, ChevronRight } from 'lucide-react';

// Sample player data
const players = [
  {
    id: '1',
    name: 'Alex Johnson',
    team: 'Engineering Tigers',
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

  // Filter players based on position
  const filteredPlayers = activePosition === 'all' 
    ? players 
    : players.filter(player => player.position.toLowerCase() === activePosition.toLowerCase());

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
                <div className="text-xl font-bold text-gray-900">Alex Johnson</div>
                <div className="text-sm text-gray-500">7 goals • Engineering Tigers</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Top Assists</h3>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">Sam Williams</div>
                <div className="text-sm text-gray-500">8 assists • Medicine United</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Most Yellow Cards</h3>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">Jamie Taylor</div>
                <div className="text-sm text-gray-500">3 cards • Science Strikers</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Most Red Cards</h3>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">Casey Brown</div>
                <div className="text-sm text-gray-500">1 card • Commerce Titans</div>
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
