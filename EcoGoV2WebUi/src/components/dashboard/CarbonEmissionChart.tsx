import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EmissionData {
  name: string;
  fuel: number;
  plane: number;
  train: number;
}

interface CarbonEmissionChartProps {
  data: EmissionData[];
}

const CarbonEmissionChart: React.FC<CarbonEmissionChartProps> = ({ data }) => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis 
            label={{ 
              value: 'kg CO₂', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }} 
          />
          <Tooltip formatter={(value) => `${Math.round(Number(value)).toLocaleString()} kg CO₂`} />
          <Legend />
          <Bar dataKey="fuel" name="Fuel" fill="#F59E0B" />
          <Bar dataKey="plane" name="Plane" fill="#4A6FA5" />
          <Bar dataKey="train" name="Train" fill="#2D6A4F" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CarbonEmissionChart;