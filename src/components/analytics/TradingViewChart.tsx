
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ChartData {
  timestamp: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  formattedTime: string;
}

interface TradingViewChartProps {
  data: ChartData[];
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ data }) => {
  const [timeInterval, setTimeInterval] = useState<'1m' | '5m' | '1h' | '1d'>('1h');
  const [zoomLevel, setZoomLevel] = useState(1);

  const intervals = [
    { key: '1m' as const, label: '1M', duration: 60000 },
    { key: '5m' as const, label: '5M', duration: 300000 },
    { key: '1h' as const, label: '1H', duration: 3600000 },
    { key: '1d' as const, label: '1D', duration: 86400000 },
  ];

  const processDataForInterval = (rawData: ChartData[], interval: string) => {
    const intervalDuration = intervals.find(i => i.key === interval)?.duration || 3600000;
    const grouped: { [key: number]: ChartData } = {};

    rawData.forEach(item => {
      const intervalKey = Math.floor(item.timestamp / intervalDuration) * intervalDuration;
      
      if (!grouped[intervalKey]) {
        grouped[intervalKey] = {
          timestamp: intervalKey,
          correct: 0,
          incorrect: 0,
          accuracy: 0,
          formattedTime: new Date(intervalKey).toLocaleTimeString(),
        };
      }
      
      grouped[intervalKey].correct += item.correct;
      grouped[intervalKey].incorrect += item.incorrect;
      const total = grouped[intervalKey].correct + grouped[intervalKey].incorrect;
      grouped[intervalKey].accuracy = total > 0 ? (grouped[intervalKey].correct / total) * 100 : 0;
    });

    return Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);
  };

  const chartData = processDataForInterval(data, timeInterval);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'accuracy' ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-300 p-1">
              {intervals.map(interval => (
                <button
                  key={interval.key}
                  onClick={() => setTimeInterval(interval.key)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    timeInterval === interval.key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {interval.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Correct Answers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Incorrect Answers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Accuracy %</span>
            </div>
          </div>
        </div>

        <div style={{ height: '400px', transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="formattedTime" 
                stroke="#666"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line 
                type="monotone" 
                dataKey="correct" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="incorrect" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              
              <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">
              {chartData.reduce((sum, item) => sum + item.correct, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Correct</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">
              {chartData.reduce((sum, item) => sum + item.incorrect, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Incorrect</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">
              {chartData.length > 0 
                ? (chartData.reduce((sum, item) => sum + item.accuracy, 0) / chartData.length).toFixed(1)
                : 0
              }%
            </p>
            <p className="text-sm text-gray-600">Average Accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingViewChart;
