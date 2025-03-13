
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnimation } from '@/hooks/use-animation';
import { cn } from '@/lib/utils';
import { ChevronLeft, Calendar, Clock, MapPin, Trophy, Users } from 'lucide-react';

// Sample data - in a real app, this would come from an API
const matches = [
  {
    id: '1',
    tournament: 'Ahalia Soccer League',
    teamA: {
      id: '1',
      name: 'Engineering Tigers',
      logo: '🐯',
    },
    teamB: {
      id: '2',
      name: 'Medicine United',
      logo: '⚕️',
    },
    scoreA: null,
    scoreB: null,
    date: 'Oct 25, 2023',
    time: '4:30 PM',
    venue: 'Main Ground',
    status: 'upcoming',
    referee: 'James Wilson',
    details: 'Round 1 match of the ASL tournament.',
  },
  {
    id: '2',
    tournament: 'Ahalia Premier League',
    teamA: {
      id: '3',
      name: 'Science Strikers',
      logo: '🔬',
    },
    teamB: {
      id: '4',
      name: 'Arts Avengers',
      logo: '🎭',
    },
    scoreA: null,
    scoreB: null,
    date: 'Oct 26, 2023',
    time: '3:00 PM',
    venue: 'Cricket Stadium',
    status: 'upcoming',
    referee: 'Sarah Johnson',
    details: 'Opening match of the APL tournament.',
  },
  {
    id: '3',
    tournament: 'Ahalia Soccer League',
    teamA: {
      id: '5',
      name: 'Commerce Titans',
      logo: '💼',
    },
    teamB: {
      id: '6',
      name: 'Pharmacy Phoenix',
      logo: '💊',
    },
    scoreA: 2,
    scoreB: 1,
    date: 'Oct 20, 2023',
    time: '5:00 PM',
    venue: 'Main Ground',
    status: 'completed',
    referee: 'David Lee',
    details: 'Commerce Titans won with a goal in the final minutes.',
    highlights: [
      { time: '15 min', event: 'Goal', team: 'Commerce Titans', player: 'John Smith' },
      { time: '34 min', event: 'Yellow Card', team: 'Pharmacy Phoenix', player: 'Mike Johnson' },
      { time: '52 min', event: 'Goal', team: 'Pharmacy Phoenix', player: 'Alex Brown' },
      { time: '88 min', event: 'Goal', team: 'Commerce Titans', player: 'Robert Davis' },
    ],
  },
  // Additional matches would be here
];

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<typeof matches[0] | null>(null);
  const { ref, isVisible } = useAnimation();
  
  useEffect(() => {
    // Find the match in our data (in a real app, this would be an API call)
    const foundMatch = matches.find(m => m.id === id);
    setMatch(foundMatch || null);
  }, [id]);

  if (!match) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900">Match not found</h1>
              <p className="mt-2 text-gray-600">The match you're looking for doesn't exist or has been removed.</p>
              <Link to="/matches">
                <Button className="mt-4">
                  Return to Matches
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
            <Link to="/matches" className="inline-flex items-center text-primary hover:underline mb-4">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Matches
            </Link>
            
            <div 
              ref={ref as React.RefObject<HTMLDivElement>}
              className={cn(
                "transition-all duration-500",
                isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
              )}
            >
              <div className="mb-6">
                <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-2">
                  {match.tournament}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {match.status === 'upcoming' ? 'Upcoming Match' : 'Match Result'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {match.details}
                </p>
              </div>
              
              {/* Match info */}
              <Card className="overflow-hidden mb-8">
                <div className="p-6 md:p-8 flex flex-col items-center">
                  <div className="flex flex-col md:flex-row items-center justify-center w-full mb-6 gap-6">
                    <div className="flex flex-col items-center text-center">
                      <Link to={`/teams/${match.teamA.id}`} className="group">
                        <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-4xl mb-2 group-hover:bg-primary/20 transition-colors">
                          {match.teamA.logo}
                        </div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{match.teamA.name}</h3>
                      </Link>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      {match.status === 'completed' ? (
                        <div className="text-4xl font-bold my-4">
                          {match.scoreA} - {match.scoreB}
                        </div>
                      ) : (
                        <div className="text-xl font-bold my-4 px-8 py-2 bg-gray-100 rounded-lg">
                          VS
                        </div>
                      )}
                      <div className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        match.status === 'upcoming' 
                          ? "bg-amber-100 text-amber-800" 
                          : "bg-green-100 text-green-800"
                      )}>
                        {match.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <Link to={`/teams/${match.teamB.id}`} className="group">
                        <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-4xl mb-2 group-hover:bg-primary/20 transition-colors">
                          {match.teamB.logo}
                        </div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{match.teamB.name}</h3>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-xl">
                    <div className="flex items-center justify-center text-gray-700">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{match.date}</span>
                    </div>
                    <div className="flex items-center justify-center text-gray-700">
                      <Clock className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{match.time}</span>
                    </div>
                    <div className="flex items-center justify-center text-gray-700">
                      <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{match.venue}</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Match details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Match Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Referee</dt>
                        <dd className="mt-1 text-sm text-gray-900">{match.referee}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Tournament</dt>
                        <dd className="mt-1 text-sm text-gray-900">{match.tournament}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Venue</dt>
                        <dd className="mt-1 text-sm text-gray-900">{match.venue}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                {match.status === 'completed' && match.highlights && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Match Highlights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {match.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <span className="font-mono text-xs bg-gray-100 rounded px-1.5 py-0.5 mr-2 text-gray-700">
                              {highlight.time}
                            </span>
                            <div>
                              <span className={highlight.event === 'Goal' ? 'font-semibold' : ''}>
                                {highlight.event}
                              </span>
                              <span className="text-gray-600">
                                {' - '}
                                {highlight.player} ({highlight.team})
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="flex gap-4">
                {match.status === 'upcoming' ? (
                  <>
                    <Button>Print Match Sheet</Button>
                    <Button variant="outline">Update Match Details</Button>
                  </>
                ) : (
                  <>
                    <Button>View Full Match Report</Button>
                    <Button variant="outline">View Photos</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MatchDetail;
