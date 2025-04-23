import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-card overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="text-secondary-500">{icon}</div>
        </div>
        
        <div className="flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          
          {trend && (
            <span 
              className={`ml-2 text-sm font-medium ${
                trend.isPositive ? 'text-error-600' : 'text-success-600'
              }`}
            >
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
          )}
        </div>
        
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;