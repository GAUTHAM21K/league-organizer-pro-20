
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { useAnimation } from '@/hooks/use-animation';
import { cn } from '@/lib/utils';
import { type ColumnDef } from '@tanstack/react-table';
import { ChevronRight, Users, Trophy, Calendar } from 'lucide-react';

// Sample data
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
  },
  {
    id: '3',
    name: 'Science Strikers',
    captain: 'Jamie Taylor',
    players: 16,
    tournament: 'Ahalia Premier League',
    wins: 3,
    losses: 2,
    draws: 1,
    points: 10,
  },
  {
    id: '4',
    name: 'Arts Avengers',
    captain: 'Jordan Smith',
    players: 15,
    tournament: 'Ahalia Premier League',
    wins: 4,
    losses: 0,
    draws: 2,
    points: 14,
  },
  {
    id: '5',
    name: 'Commerce Titans',
    captain: 'Casey Brown',
    players: 14,
    tournament: 'Ahalia Soccer League',
    wins: 2,
    losses: 3,
    draws: 2,
    points: 8,
  },
  {
    id: '6',
    name: 'Pharmacy Phoenix',
    captain: 'Riley Martinez',
    players: 15,
    tournament: 'Ahalia Soccer League',
    wins: 3,
    losses: 2,
    draws: 2,
    points: 11,
  },
];

type Team = typeof teams[0];

// Define columns for the data table
const columns: ColumnDef<Team>[] = [
  {
    accessorKey: 'name',
    header: 'Team Name',
    cell: ({ row }) => (
      <div className="font-medium text-primary">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'captain',
    header: 'Captain',
  },
  {
    accessorKey: 'tournament',
    header: 'Tournament',
  },
  {
    accessorKey: 'players',
    header: 'Players',
    cell: ({ row }) => (
      <div className="flex items-center">
        <Users className="mr-2 h-4 w-4 text-gray-500" />
        <span>{row.getValue('players')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'points',
    header: 'Points',
    cell: ({ row }) => (
      <div className="font-semibold">{row.getValue('points')}</div>
    ),
  },
  {
    id: 'record',
    header: 'W/L/D',
    cell: ({ row }) => (
      <div className="font-mono">
        {row.original.wins}/{row.original.losses}/{row.original.draws}
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

const Teams = () => {
  const { ref, isVisible } = useAnimation();
  const [activeTab, setActiveTab] = useState('all');

  // Filter teams based on the active tab
  const filteredTeams = activeTab === 'all' 
    ? teams 
    : teams.filter(team => team.tournament.toLowerCase().includes(activeTab));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
                <p className="text-gray-600 mt-1">
                  Browse all registered teams and their performance
                </p>
              </div>
              <Button>
                Register New Team
              </Button>
            </div>
          </div>
          
          {/* Tournament filter tabs */}
          <div className="flex overflow-x-auto mb-6 border-b border-gray-200">
            <button
              className={cn(
                "mr-6 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === 'all'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActiveTab('all')}
            >
              All Teams
            </button>
            <button
              className={cn(
                "mr-6 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === 'soccer'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActiveTab('soccer')}
            >
              Soccer League
            </button>
            <button
              className={cn(
                "mr-6 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === 'premier'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActiveTab('premier')}
            >
              Premier League
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
              data={filteredTeams} 
              searchKey="name"
              searchPlaceholder="Search teams..."
            />
          </div>
          
          {/* Team stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Total Teams</h3>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Users size={20} />
                </div>
              </div>
              <div className="flex items-end">
                <span className="text-3xl font-bold text-gray-900">{teams.length}</span>
                <span className="ml-2 text-sm text-gray-500">teams registered</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Top Team</h3>
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <Trophy size={20} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">Medicine United</div>
                <div className="text-sm text-gray-500">16 points • 5 wins</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Next Registration</h3>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Calendar size={20} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">Winter Basketball</div>
                <div className="text-sm text-gray-500">Opens Nov 15, 2023</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Teams;
