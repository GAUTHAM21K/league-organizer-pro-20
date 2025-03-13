
import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/ProtectedRoute';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TournamentToggle } from '@/components/ui/tournament-toggle';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Trophy, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Bell
} from 'lucide-react';
import AdminScheduler from './AdminScheduler';
import AdminTeams from './AdminTeams';
import AdminScores from './AdminScores';

const AdminDashboard = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const [tournamentType, setTournamentType] = useState("asl");
  
  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: 'Match Scheduler', 
      path: '/admin/scheduler', 
      icon: <Calendar size={20} /> 
    },
    { 
      name: 'Team Management', 
      path: '/admin/teams', 
      icon: <Users size={20} /> 
    },
    { 
      name: 'Live Scores', 
      path: '/admin/scores', 
      icon: <Trophy size={20} /> 
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: <Settings size={20} /> 
    },
  ];

  const handleSignOut = () => {
    signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex">
      {/* Admin Sidebar */}
      <aside className="fixed inset-y-0 left-0 bg-gray-900 text-white w-64 flex flex-col z-30">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AT</span>
            </div>
            <div>
              <h2 className="font-bold text-xl">Ahalia Admin</h2>
              <div className="text-xs text-gray-400">Tournament Management</div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 pt-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "group flex items-center px-3 py-3 rounded-md text-sm font-medium transition-all",
                location.pathname === item.path
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
              {location.pathname === item.path && (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <Button 
            variant="outline" 
            className="w-full justify-start text-gray-300 hover:text-white bg-transparent hover:bg-gray-800 border-gray-700"
            onClick={handleSignOut}
          >
            <LogOut size={18} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="pl-64 w-full">
        {/* Top navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Admin Portal
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Tournament:</span>
              <TournamentToggle
                value={tournamentType}
                onValueChange={setTournamentType}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                A
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Admin</div>
                <div className="text-xs text-gray-500">Tournament Director</div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content area */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={
              <AdminOverview tournamentType={tournamentType} />
            } />
            <Route path="/scheduler" element={
              <AdminScheduler tournamentType={tournamentType} />
            } />
            <Route path="/teams" element={
              <AdminTeams tournamentType={tournamentType} />
            } />
            <Route path="/scores" element={
              <AdminScores tournamentType={tournamentType} />
            } />
            <Route path="/settings" element={
              <div>Settings Content</div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
};

// Admin overview dashboard
const AdminOverview = ({ tournamentType }: { tournamentType: string }) => {
  const stats = [
    { 
      title: "Total Teams", 
      value: tournamentType === "asl" ? "4" : "2", 
      change: "+2 this week", 
      status: "up" 
    },
    { 
      title: "Matches Scheduled", 
      value: tournamentType === "asl" ? "6" : "4", 
      change: "+1 today", 
      status: "up" 
    },
    { 
      title: "Players Registered", 
      value: tournamentType === "asl" ? "64" : "32", 
      change: "+8 this week", 
      status: "up" 
    },
    { 
      title: "Upcoming Matches", 
      value: tournamentType === "asl" ? "2" : "1", 
      change: "Next: Oct 25", 
      status: "neutral" 
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Admin Dashboard - {tournamentType === "asl" ? "Ahalia Soccer League" : "Ahalia Premier League"}
        </h2>
        <p className="text-gray-600">
          Overview of tournament statistics and upcoming events
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div 
            key={stat.title}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-5"
          >
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className={cn(
                "text-xs font-medium rounded-full px-2 py-0.5",
                stat.status === "up" ? "bg-green-100 text-green-800" :
                stat.status === "down" ? "bg-red-100 text-red-800" :
                "bg-gray-100 text-gray-800"
              )}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick access buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/scheduler">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-medium">Schedule Matches</h3>
                <p className="text-gray-500 text-sm mt-1">Create and manage match schedules</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Calendar size={24} />
              </div>
            </div>
          </div>
        </Link>
        
        <Link to="/admin/teams">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-medium">Manage Teams</h3>
                <p className="text-gray-500 text-sm mt-1">View and edit team information</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Users size={24} />
              </div>
            </div>
          </div>
        </Link>
        
        <Link to="/admin/scores">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-medium">Update Live Scores</h3>
                <p className="text-gray-500 text-sm mt-1">Record match results and statistics</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Trophy size={24} />
              </div>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Recent activity list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="p-5 flex gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Users size={18} />
            </div>
            <div>
              <p className="text-gray-900">New team registered: <strong>Pharmacy Phoenix</strong></p>
              <p className="text-xs text-gray-500 mt-1">Today, 2:30 PM</p>
            </div>
          </div>
          <div className="p-5 flex gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Trophy size={18} />
            </div>
            <div>
              <p className="text-gray-900">Match result updated: <strong>Engineering Tigers 2 - 1 Medicine United</strong></p>
              <p className="text-xs text-gray-500 mt-1">Yesterday, 6:15 PM</p>
            </div>
          </div>
          <div className="p-5 flex gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-gray-900">New match scheduled: <strong>Science Strikers vs Arts Avengers</strong></p>
              <p className="text-xs text-gray-500 mt-1">Yesterday, 10:30 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
