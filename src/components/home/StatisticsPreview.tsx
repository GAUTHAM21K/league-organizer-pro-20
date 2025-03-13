
import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import { useAnimation } from '@/hooks/use-animation';

// Sample data for charts
const playerPerformanceData = [
  { name: 'Alex', goals: 12, assists: 8 },
  { name: 'Jamie', goals: 10, assists: 12 },
  { name: 'Ryan', goals: 8, assists: 5 },
  { name: 'Taylor', goals: 7, assists: 9 },
  { name: 'Jordan', goals: 13, assists: 3 },
];

const matchStatsData = [
  { name: 'Goals', value: 103 },
  { name: 'Assists', value: 82 },
  { name: 'Yellow Cards', value: 29 },
  { name: 'Red Cards', value: 5 },
];

const COLORS = ['#0070F3', '#38bdf8', '#3b82f6', '#6366f1'];

const StatisticsPreview = () => {
  const [activeTab, setActiveTab] = useState('players');
  const { ref: containerRef, isVisible } = useAnimation({ threshold: 0.1 });

  return (
    <section 
      ref={containerRef as React.RefObject<HTMLElement>} 
      className="py-20"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div 
          className={cn(
            "transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          )}
        >
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Data-Driven Insights
            </h2>
            <p className="text-lg text-gray-600">
              Track performance and analyze statistics with interactive visualizations.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={cn(
                  "flex-1 py-4 px-6 text-center text-sm font-medium transition-all",
                  activeTab === 'players'
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
                onClick={() => setActiveTab('players')}
              >
                Player Performance
              </button>
              <button
                className={cn(
                  "flex-1 py-4 px-6 text-center text-sm font-medium transition-all",
                  activeTab === 'matches'
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
                onClick={() => setActiveTab('matches')}
              >
                Match Statistics
              </button>
            </div>
            
            {/* Chart content */}
            <div className="p-6 h-80">
              {activeTab === 'players' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={playerPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '0.5rem', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                      }}
                    />
                    <Bar dataKey="goals" name="Goals" fill="#0070F3" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="assists" name="Assists" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={matchStatsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {matchStatsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value}`, `${name}`]}
                      contentStyle={{ 
                        borderRadius: '0.5rem', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 text-center">
              <p className="text-sm text-gray-600">
                Data shown represents statistics from the current tournament season.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsPreview;
