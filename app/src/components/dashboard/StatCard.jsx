import React from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ title, value, percentage, isPositive, data, color }) => {
  return (
    <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
            isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? "+" : ""}{percentage}%
          </div>
        </div>
        
        <div className="h-16 w-full -mx-6 -mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill={`url(#gradient-${color})`} 
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4">
           <button className="text-xs font-semibold text-neutral-900 flex items-center gap-1 hover:underline">
              See more details <span className="text-lg">›</span>
           </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
