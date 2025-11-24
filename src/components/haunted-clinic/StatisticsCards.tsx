/**
 * Statistics Cards Component
 * 
 * Displays key metrics in card format with icons.
 * Responsive design for mobile, tablet, and desktop.
 * 
 * Requirements: 4.2, 8.2, 9.1, 9.2, 9.3
 */

interface StatisticsCardsProps {
  stats: {
    totalDoctors: number;
    totalPatients: number;
    todayAppointments: number;
  };
}

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  const cards = [
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: '👨‍⚕️',
      description: 'Active medical staff',
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: '🧑‍🦱',
      description: 'Registered patients',
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: '📅',
      description: 'Scheduled for today',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}

/**
 * Individual Stat Card Component
 * 
 * Styled with bone_minimal theme colors and responsive design.
 */
interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  description: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="bg-tertiary rounded-lg p-4 md:p-6 border border-border hover:border-accent transition-colors duration-200 animate-entrance animate-hover">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs md:text-sm text-secondary mb-1 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold">
            {value}
          </p>
        </div>
        <div className="text-3xl md:text-4xl opacity-50 ml-2">
          {icon}
        </div>
      </div>
      <p className="text-xs md:text-sm text-secondary">
        {description}
      </p>
    </div>
  );
}
