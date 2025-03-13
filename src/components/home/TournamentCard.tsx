
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, Flag, Trophy, Users } from 'lucide-react';

interface TournamentCardProps {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  teams: number;
  status: 'upcoming' | 'active' | 'completed';
  imageSrc: string;
}

const TournamentCard = ({
  id,
  name,
  type,
  startDate,
  endDate,
  teams,
  status,
  imageSrc,
}: TournamentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    upcoming: 'bg-amber-100 text-amber-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  const statusLabels = {
    upcoming: 'Upcoming',
    active: 'Active',
    completed: 'Completed',
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 hover-lift",
        isHovered ? "shadow-xl" : "shadow-md"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card image */}
      <div className="relative h-48 w-full overflow-hidden">
        {/* Tournament status badge */}
        <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </div>
        
        {/* Image with overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0"></div>
        <img
          src={imageSrc}
          alt={name}
          className={cn(
            "h-full w-full object-cover transition-transform duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        
        {/* Tournament name on image */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h3 className="text-white font-semibold text-xl">{name}</h3>
          <div className="flex items-center mt-1">
            <Flag className="h-4 w-4 text-white/80 mr-1.5" />
            <p className="text-white/90 text-sm">{type}</p>
          </div>
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start space-x-2">
            <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Date</p>
              <p className="text-sm text-gray-900 font-medium">
                {startDate}
                {endDate && ` - ${endDate}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Users className="h-4 w-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Teams</p>
              <p className="text-sm text-gray-900 font-medium">{teams} teams</p>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Button variant="outline" className="w-full">
            View Tournament
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
