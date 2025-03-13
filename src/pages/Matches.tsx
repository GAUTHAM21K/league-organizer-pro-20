
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { useAnimation } from '@/hooks/use-animation';
import { cn } from '@/lib/utils';
import { type ColumnDef } from '@tanstack/react-table';
import { Calendar, Clock, MapPin, ChevronRight, Filter } from 'lucide-react';
import { TournamentToggle } from '@/components/ui/tournament-toggle';

// Sample data
const matches = [
  {
    id: '1',
    tournament: 'Ahalia Soccer League',
    tournamentCode: 'asl',
    teamA: 'Engineering Tigers',
    teamB: 'Medicine United',
    scoreA: null,
    scoreB: null,
    date: 'Oct 25, 2023',
    time: '4:30 PM',
    venue: 'Main Ground',
    status: 'upcoming',
  },
  {
    id: '2',
    tournament: 'Ahalia Premier League',
    tournamentCode: 'apl',
    teamA: 'Science Strikers',
    teamB: 'Arts Avengers',
    scoreA: null,
    scoreB: null,
    date: 'Oct 26, 2023',
    time: '3:00 PM',
    venue: 'Cricket Stadium',
    status: 'upcoming',
  },
  {
    id: '3',
    tournament: 'Ahalia Soccer League',
    tournamentCode: 'asl',
    teamA: 'Commerce Titans',
    teamB: 'Pharmacy Phoenix',
    scoreA: 2,
    scoreB: 1,
    date: 'Oct 20, 2023',
    time: '5:00 PM',
    venue: 'Main Ground',
    status: 'completed',
  },
  {
    id: '4',
    tournament: 'Ahalia Premier League',
    tournamentCode: 'apl',
    teamA: 'Science Strikers',
    teamB: 'Commerce Titans',
    scoreA: 5,
    scoreB: 3,
    date: 'Oct 18, 2023',
    time: '4:00 PM',
    venue: 'Cricket Stadium',
    status: 'completed',
  },
  {
    id: '5',
    tournament: 'Ahalia Soccer League',
    tournamentCode: 'asl',
    teamA: 'Medicine United',
    teamB: 'Arts Avengers',
    scoreA: 3,
    scoreB: 3,
    date: 'Oct 15, 2023',
    time: '5:30 PM',
    venue: 'Main Ground',
    status: 'completed',
  },
  {
    id: '6',
    tournament: 'Ahalia Premier League',
    tournamentCode: 'apl',
    teamA: 'Engineering Tigers',
    teamB: 'Pharmacy Phoenix',
    scoreA: 4,
    scoreB: 2,
    date: 'Oct 13, 2023',
    time: '3:30 PM',
    venue: 'Cricket Stadium',
    status: 'completed',
  },
];

type Match = typeof matches[0];

// Define columns for the data table
const columns: ColumnDef<Match>[] = [
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
    id: 'teams',
    header: 'Teams',
    cell: ({ row }) => (
      <div className="flex items-center justify-center text-sm">
        <span className="font-medium text-right min-w-24 max-w-32 truncate">
          {row.original.teamA}
        </span>
        <span className="mx-2 font-medium">vs</span>
        <span className="font-medium text-left min-w-24 max-w-32 truncate">
          {row.original.teamB}
        </span>
      </div>
    ),
  },
  {
    id: 'score',
    header: 'Score',
    cell: ({ row }) => {
      const { scoreA, scoreB, status } = row.original;
      return status === 'completed' ? (
        <div className="font-mono font-bold text-center">
          {scoreA} - {scoreB}
        </div>
      ) : (
        <div className="text-xs text-gray-500 text-center">Not played</div>
      );
    },
  },
  {
    id: 'dateTime',
    header: 'Date & Time',
    cell: ({ row }) => (
      <div className="flex items-center text-sm text-gray-700">
        <Calendar className="mr-1.5 h-3.5 w-3.5 text-gray-500" />
        <span>{row.original.date}</span>
        <span className="mx-1.5">•</span>
        <Clock className="mr-1.5 h-3.5 w-3.5 text-gray-500" />
        <span>{row.original.time}</span>
      </div>
    ),
  },
  {
    accessorKey: 'venue',
    header: 'Venue',
    cell: ({ row }) => (
      <div className="flex items-center text-sm text-gray-700">
        <MapPin className="mr-1.5 h-3.5 w-3.5 text-gray-500" />
        <span>{row.getValue('venue')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      return status === 'upcoming' ? (
        <div className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-1 rounded-full inline-block">
          Upcoming
        </div>
      ) : (
        <div className="text-xs bg-green-100 text-green-800 font-medium px-2 py-1 rounded-full inline-block">
          Completed
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link to={`/matches/${row.original.id}`}>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];

const Matches = () => {
  const { ref, isVisible } = useAnimation();
  const [activeTab, setActiveTab] = useState('all');
  const [tournamentType, setTournamentType] = useState("all");

  // Filter matches based on both the active tab and tournament type
  const filteredMatches = matches.filter(match => {
    // Filter by status
    const statusMatch = 
      activeTab === 'all' ? true :
      activeTab === 'upcoming' ? match.status === 'upcoming' :
      match.status === 'completed';
    
    // Filter by tournament
    const tournamentMatch = 
      tournamentType === 'all' ? true : 
      match.tournamentCode === tournamentType;
    
    return statusMatch && tournamentMatch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Matches</h1>
                <p className="text-gray-600 mt-1">
                  View all scheduled and completed matches
                </p>
              </div>
              <Link to="/admin">
                <Button>
                  Schedule New Match
                </Button>
              </Link>
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
              Show All Matches
            </Button>
          </div>
          
          {/* Status filter tabs */}
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
              All Matches
            </button>
            <button
              className={cn(
                "mr-6 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === 'upcoming'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={cn(
                "mr-6 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === 'completed'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActiveTab('completed')}
            >
              Completed
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
              data={filteredMatches}
            />
          </div>
          
          {/* Match calendar preview */}
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Match Calendar</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Match calendar coming soon</p>
                <Button variant="outline">View Full Calendar</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Matches;
