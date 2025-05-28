
import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ZoomIn, ZoomOut, TrendingUp, TrendingDown } from 'lucide-react';
import { CandlestickData } from '@/contexts/PracticeContext';

interface CandlestickChartProps {
  data: CandlestickData[];
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const [timeInterval, setTimeInterval] = useState<'1D' | '7D' | '30D'>('30D');
  const [zoomLevel, setZoomLevel] = useState(1);

  const intervals = [
    { key: '1D' as const, label: '1D', days: 1 },
    { key: '7D' as const, label: '7D', days: 7 },
    { key: '30D' as const, label: '30D', days: 30 },
  ];

  const getFilteredData = () => {
    const selectedInterval = intervals.find(i => i.key === timeInterval);
    if (!selectedInterval) return data;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - selectedInterval.days);
    
    return data.filter(item => item.timestamp >= cutoffDate.getTime());
  };

  const chartData = getFilteredData().map(item => ({
    ...item,
    candleBody: [item.open, item.close],
    upperShadow: item.high,
    lowerShadow: item.low,
    isPositive: item.close >= item.open,
    formattedDate: new Date(item.timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
  }));

  const CustomCandlestick = (props: any) => {
    const { payload } = props;
    if (!payload) return null;

    const { x, y, width, height, isPositive, open, close, high, low } = payload;
    const candleWidth = Math.max(width * 0.6, 2);
    const centerX = x + width / 2;
    
    // Calculate positions
    const openY = y + height - ((open - payload.lowerShadow) / (payload.upperShadow - payload.lowerShadow)) * height;
    const closeY = y + height - ((close - payload.lowerShadow) / (payload.upperShadow - payload.lowerShadow)) * height;
    const highY = y + height - ((high - payload.lowerShadow) / (payload.upperShadow - payload.lowerShadow)) * height;
    const lowY = y + height - ((low - payload.lowerShadow) / (payload.upperShadow - payload.lowerShadow)) * height;

    const color = isPositive ? '#10b981' : '#ef4444';
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.abs(closeY - openY);

    return (
      <g>
        {/* Upper and lower shadows */}
        <line
          x1={centerX}
          y1={highY}
          x2={centerX}
          y2={Math.min(openY, closeY)}
          stroke={color}
          strokeWidth={1}
        />
        <line
          x1={centerX}
          y1={Math.max(openY, closeY)}
          x2={centerX}
          y2={lowY}
          stroke={color}
          strokeWidth={1}
        />
        
        {/* Candle body */}
        <rect
          x={centerX - candleWidth / 2}
          y={bodyTop}
          width={candleWidth}
          height={bodyHeight || 1}
          fill={isPositive ? '#10b981' : '#ef4444'}
          stroke={color}
          strokeWidth={1}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-2 font-medium">{data.date}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Open:</span>
              <span className="font-mono">{data.open.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">High:</span>
              <span className="font-mono text-green-600">{data.high.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Low:</span>
              <span className="font-mono text-red-600">{data.low.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Close:</span>
              <span className="font-mono">{data.close.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Volume:</span>
              <span className="font-mono">{data.volume}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const latestData = chartData[chartData.length - 1];
  const previousData = chartData[chartData.length - 2];
  const priceChange = latestData && previousData ? latestData.close - previousData.close : 0;
  const priceChangePercent = previousData ? (priceChange / previousData.close) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Accuracy Performance</h3>
            {latestData && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {latestData.close.toFixed(1)}%
                </span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${
                  priceChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
                </div>
              </div>
            )}
          </div>
          
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
        <div style={{ height: '400px', transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="formattedDate" 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="accuracy"
                orientation="left"
                domain={['dataMin - 5', 'dataMax + 5']}
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                yAxisId="volume"
                orientation="right"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Volume bars */}
              <Bar dataKey="volume" fill="#e5e7eb" yAxisId="volume" opacity={0.3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-lg font-bold text-blue-600">
              {chartData.length > 0 ? chartData[chartData.length - 1].close.toFixed(1) : 0}%
            </p>
            <p className="text-sm text-gray-600">Current Accuracy</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-lg font-bold text-green-600">
              {chartData.length > 0 ? Math.max(...chartData.map(d => d.high)).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-gray-600">Highest Accuracy</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-lg font-bold text-red-600">
              {chartData.length > 0 ? Math.min(...chartData.map(d => d.low)).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-gray-600">Lowest Accuracy</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-lg font-bold text-purple-600">
              {chartData.reduce((sum, item) => sum + item.volume, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Questions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChart;
