import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, TrendingUp } from "lucide-react";

const LeadByStatusChart = ({ data, total, contactedPercentage }) => {
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Lead by Status</p>
            <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold">{total}</span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                    <TrendingUp size={10} />
                    10%
                </div>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="h-[200px] w-full relative mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={65}
                outerRadius={100}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-2">
            <p className="text-2xl font-bold leading-tight">{contactedPercentage}%</p>
            <p className="text-[10px] font-medium text-muted-foreground">Contacted</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-8">
            {data.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-medium text-neutral-600">{item.name}</span>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadByStatusChart;
