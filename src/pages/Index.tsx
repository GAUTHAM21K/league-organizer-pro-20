
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import TournamentCard from '@/components/home/TournamentCard';
import FeatureSection from '@/components/home/FeatureSection';
import StatisticsPreview from '@/components/home/StatisticsPreview';
import { Button } from '@/components/ui/button';
import { useAnimation } from '@/hooks/use-animation';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

// Sample tournament data
const tournaments = [
  {
    id: '1',
    name: 'Ahalia Soccer League 2023',
    type: 'Soccer Tournament',
    startDate: 'Oct 15, 2023',
    endDate: 'Dec 20, 2023',
    teams: 16,
    status: 'active' as const,
    imageSrc: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2832&q=80',
  },
  {
    id: '2',
    name: 'Ahalia Premier League 2023',
    type: 'Cricket Tournament',
    startDate: 'Sep 5, 2023',
    endDate: 'Nov 30, 2023',
    teams: 12,
    status: 'active' as const,
    imageSrc: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2305&q=80',
  },
  {
    id: '3',
    name: 'Winter Basketball Tournament',
    type: 'Basketball Tournament',
    startDate: 'Jan 10, 2024',
    endDate: 'Feb 28, 2024',
    teams: 8,
    status: 'upcoming' as const,
    imageSrc: 'https://images.unsplash.com/photo-1628779238951-be2c9f2a59f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80',
  },
  {
    id: '4',
    name: 'Ahalia Volleyball Championship',
    type: 'Volleyball Tournament',
    startDate: 'Feb 15, 2024',
    endDate: 'Mar 30, 2024',
    teams: 10,
    status: 'upcoming' as const,
    imageSrc: 'https://images.unsplash.com/photo-1574271143515-5cddf8da19be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80',
  },
];

// Upcoming matches data
const upcomingMatches = [
  {
    id: 'm1',
    tournament: 'Ahalia Soccer League',
    teamA: 'Engineering Tigers',
    teamB: 'Medicine United',
    date: 'Oct 25, 2023',
    time: '4:30 PM',
    venue: 'Main Ground',
  },
  {
    id: 'm2',
    tournament: 'Ahalia Premier League',
    teamA: 'Science Strikers',
    teamB: 'Arts Avengers',
    date: 'Oct 26, 2023',
    time: '3:00 PM',
    venue: 'Cricket Stadium',
  },
  {
    id: 'm3',
    tournament: 'Ahalia Soccer League',
    teamA: 'Commerce Titans',
    teamB: 'Pharmacy Phoenix',
    date: 'Oct 27, 2023',
    time: '5:00 PM',
    venue: 'Main Ground',
  },
];

const Index = () => {
  const { ref: tournamentsRef, isVisible: isTournamentsVisible } = useAnimation();
  const { ref: matchesRef, isVisible: isMatchesVisible } = useAnimation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Tournament Section */}
        <section 
          ref={tournamentsRef as React.RefObject<HTMLElement>}
          className="py-20"
        >
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div 
              className={cn(
                "transition-all duration-700 transform",
                isTournamentsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              )}
            >
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Active Tournaments</h2>
                  <p className="text-gray-600 mt-2">
                    Explore our ongoing and upcoming sports tournaments
                  </p>
                </div>
                <Button variant="outline">
                  View All Tournaments
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tournaments.map((tournament) => (
                  <TournamentCard
                    key={tournament.id}
                    {...tournament}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <FeatureSection />
        
        {/* Upcoming Matches */}
        <section 
          ref={matchesRef as React.RefObject<HTMLElement>}
          className="py-20 bg-white"
        >
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div 
              className={cn(
                "transition-all duration-700 transform",
                isMatchesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              )}
            >
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Upcoming Matches</h2>
                  <p className="text-gray-600 mt-2">
                    Don't miss the action - check out the next scheduled matches
                  </p>
                </div>
                <Button variant="outline">
                  View Full Schedule
                </Button>
              </div>
              
              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <div 
                    key={match.id} 
                    className="flex flex-col md:flex-row justify-between items-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
                      <div className="bg-primary/10 text-primary font-medium text-sm px-3 py-1 rounded-full mb-4 md:mb-0 md:mr-6">
                        {match.tournament}
                      </div>
                      <div className="flex flex-col md:flex-row items-center">
                        <div className="text-center md:text-right md:mr-4">
                          <span className="text-lg font-semibold text-gray-900">{match.teamA}</span>
                        </div>
                        <div className="my-2 md:my-0 md:mx-3 text-gray-500 font-medium">vs</div>
                        <div className="text-center md:text-left">
                          <span className="text-lg font-semibold text-gray-900">{match.teamB}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex items-center mr-6">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{match.date}, {match.time}</span>
                      </div>
                      <div className="text-sm py-1 px-3 bg-gray-100 text-gray-700 rounded-full">
                        {match.venue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Statistics Preview */}
        <StatisticsPreview />
        
        {/* CTA Section */}
        <section className="py-24 bg-primary/5">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Join the League?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Register your team today and be a part of Ahalia's prestigious sports tournaments.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="rounded-full px-8">
                  Register Your Team
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
