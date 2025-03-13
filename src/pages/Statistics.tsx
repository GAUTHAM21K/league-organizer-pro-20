import { useState } from 'react';
import { useAnimation } from '@/hooks/use-animation';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { LineChart, BarChart, Activity, Trophy } from 'lucide-react';
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line
} from 'recharts';

// Sample data for charts
const goalData = [
  { name: 'Match 1', Engineering: 2, Medicine: 1, Science: 0, Arts: 1, Commerce: 2, Pharmacy: 1 },
  { name: 'Match 2', Engineering: 1, Medicine: 3, Science: 1, Arts: 0, Commerce: 1, Pharmacy: 0 },
  { name: 'Match 3', Engineering: 3, Medicine: 2, Science: 2, Arts: 1, Commerce: 1, Pharmacy: 2 },
  { name: 'Match 4', Engineering: 1, Medicine: 1, Science: 0, Arts: 1, Commerce: 0, Pharmacy: 0 },
  { name: 'Match 5', Engineering: 0, Medicine: 2, Science: 1, Arts: 2, Commerce: 1, Pharmacy: 2 },
];

const teamStats = [
  { id: 1, team: 'Medicine United', wins: 5, losses: 1, draws: 1, goalsFor: 9, goalsAgainst: 4, points: 16 },
  { id: 2, team: 'Engineering Tigers', wins: 4, losses: 1, draws: 2, goalsFor: 7, goalsAgainst: 3, points: 14 },
  { id: 3, team: 'Arts Avengers', wins: 4, losses: 0, draws: 2, goalsFor: 5, goalsAgainst: 2, points: 14 },
  { id: 4, team: 'Pharmacy Phoenix', wins: 3, losses: 2, draws: 2, goalsFor: 5, goalsAgainst: 4, points: 11 },
  { id: 5, team: 'Science Strikers', wins: 3, losses: 2, draws: 1, goalsFor: 4, goalsAgainst: 5, points: 10 },
  { id: 6, team: 'Commerce Titans', wins: 2, losses: 3, draws: 2, goalsFor: 5, goalsAgainst: 6, points: 8 },
];

// Colors for teams
const teamColors = {
  Engineering: '#0088FE',
  Medicine: '#00C49F',
  Science: '#FFBB28',
  Arts: '#FF8042',
  Commerce: '#A44CD3',
  Pharmacy: '#FF5733',
};

const Statistics = () => {
  const { ref, isVisible } = useAnimation();
  const [chartType, setChartType] = useState<'goals' | 'points'>('goals');
  const [viewType, setViewType] = useState<'chart' | 'table'>('chart');
  const [tournamentFilter, setTournamentFilter] = useState<string>('all');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
                <p className="text-gray-600 mt-1">
                  Team performance and player statistics
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Select defaultValue="all" onValueChange={(value) => setTournamentFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Tournament" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tournaments</SelectLabel>
                      <SelectItem value="all">All Tournaments</SelectItem>
                      <SelectItem value="soccer">Ahalia Soccer League</SelectItem>
                      <SelectItem value="premier">Ahalia Premier League</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className="bg-gray-100 rounded-md p-1 flex">
                  <Button 
                    variant={viewType === 'chart' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setViewType('chart')}
                    className="gap-1"
                  >
                    <BarChart size={16} />
                    Chart
                  </Button>
                  <Button 
                    variant={viewType === 'table' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setViewType('table')}
                    className="gap-1"
                  >
                    <Activity size={16} />
                    Table
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Data type selector */}
          <div className="flex overflow-x-auto mb-6 border-b border-gray-200">
            <button
              className={cn(
                "mr-6 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                chartType === 'goals'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setChartType('goals')}
            >
              Goals Scored
            </button>
            <button
              className={cn(
                "mr-6 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                chartType === 'points'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setChartType('points')}
            >
              League Points
            </button>
          </div>
          
          <div 
            ref={ref as React.RefObject<HTMLDivElement>}
            className={cn(
              "transition-all duration-500",
              isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
            )}
          >
            {viewType === 'chart' ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {chartType === 'goals' ? 'Goals Scored by Teams' : 'Points Accumulated by Teams'}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {chartType === 'goals' ? 'Showing goals scored in each match' : 'Showing points accumulated over the tournament'}
                  </p>
                </div>
                
                {chartType === 'goals' ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={goalData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Engineering" name="Engineering Tigers" fill={teamColors.Engineering} />
                        <Bar dataKey="Medicine" name="Medicine United" fill={teamColors.Medicine} />
                        <Bar dataKey="Science" name="Science Strikers" fill={teamColors.Science} />
                        <Bar dataKey="Arts" name="Arts Avengers" fill={teamColors.Arts} />
                        <Bar dataKey="Commerce" name="Commerce Titans" fill={teamColors.Commerce} />
                        <Bar dataKey="Pharmacy" name="Pharmacy Phoenix" fill={teamColors.Pharmacy} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={goalData.map((match, index) => ({
                          name: match.name,
                          Engineering: (index + 1) * 3,
                          Medicine: (index + 1) * 3 + 1,
                          Science: (index + 1) * 2, 
                          Arts: (index + 1) * 2 + 2,
                          Commerce: (index + 1) * 1 + 3,
                          Pharmacy: (index + 1) * 2 + 1,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Engineering" name="Engineering Tigers" stroke={teamColors.Engineering} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Medicine" name="Medicine United" stroke={teamColors.Medicine} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Science" name="Science Strikers" stroke={teamColors.Science} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Arts" name="Arts Avengers" stroke={teamColors.Arts} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Commerce" name="Commerce Titans" stroke={teamColors.Commerce} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Pharmacy" name="Pharmacy Phoenix" stroke={teamColors.Pharmacy} activeDot={{ r: 8 }} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                  <TableCaption>Team statistics for the current season</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-center">P</TableHead>
                      <TableHead className="text-center">W</TableHead>
                      <TableHead className="text-center">D</TableHead>
                      <TableHead className="text-center">L</TableHead>
                      <TableHead className="text-center">GF</TableHead>
                      <TableHead className="text-center">GA</TableHead>
                      <TableHead className="text-center">GD</TableHead>
                      <TableHead className="text-center">Pts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamStats.map((team, index) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{team.team}</TableCell>
                        <TableCell className="text-center">{team.wins + team.losses + team.draws}</TableCell>
                        <TableCell className="text-center">{team.wins}</TableCell>
                        <TableCell className="text-center">{team.draws}</TableCell>
                        <TableCell className="text-center">{team.losses}</TableCell>
                        <TableCell className="text-center">{team.goalsFor}</TableCell>
                        <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                        <TableCell className="text-center">{team.goalsFor - team.goalsAgainst}</TableCell>
                        <TableCell className="text-center font-bold">{team.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          {/* Statistics summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Top Team</h3>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Trophy size={20} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">Medicine United</div>
                <div className="text-sm text-gray-500">16 points • 5 wins • 9 goals</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Best Attack</h3>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Activity size={20} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">Medicine United</div>
                <div className="text-sm text-gray-500">9 goals • 1.8 goals per game</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Best Defense</h3>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <Activity size={20} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">Arts Avengers</div>
                <div className="text-sm text-gray-500">2 goals conceded • 0.4 per game</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Statistics;
