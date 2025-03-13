
import { useSequentialAnimation } from '@/hooks/use-animation';
import { cn } from '@/lib/utils';
import { Calendar, LineChart, Users, Trophy, Activity, Clock, Bell, Smartphone } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isVisible: boolean;
  delay?: number;
}

const FeatureCard = ({
  title,
  description,
  icon,
  isVisible,
  delay = 0
}: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "feature-card relative p-6 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-500 hover:-translate-y-1", 
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )} 
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: <Users size={24} />,
    title: "Team Registration",
    description: "Streamlined team and player registration with digital profiles and credential verification."
  },
  {
    icon: <Calendar size={24} />,
    title: "Match Scheduling",
    description: "Intelligent scheduling system that avoids conflicts and optimizes venue usage."
  },
  {
    icon: <Trophy size={24} />,
    title: "Result Management",
    description: "Instantly update match results and tournament standings with automatic calculations."
  },
  {
    icon: <LineChart size={24} />,
    title: "Player Statistics",
    description: "Track and visualize detailed player performance metrics throughout tournaments."
  },
  {
    icon: <Activity size={24} />,
    title: "Live Updates",
    description: "Real-time updates for ongoing matches with play-by-play commentary and stats."
  },
  {
    icon: <Clock size={24} />,
    title: "Time Management",
    description: "Automated time tracking for matches with notifications for upcoming events."
  },
  {
    icon: <Bell size={24} />,
    title: "Notifications",
    description: "Instant notifications for schedule changes, results, and important tournament updates."
  },
  {
    icon: <Smartphone size={24} />,
    title: "Mobile Responsive",
    description: "Access all features on any device with a seamless, responsive design experience."
  }
];

const FeatureSection = () => {
  const {
    containerRef,
    visibleItems
  } = useSequentialAnimation(features.length, {
    delay: 200,
    interval: 100,
    threshold: 0.1
  });

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Tournament Management</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to organize and manage successful college tournaments
          </p>
        </div>
        
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              isVisible={visibleItems[index]}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
