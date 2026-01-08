import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MoreHorizontal, ChevronRight } from "lucide-react";

const RecentLeadsList = ({ leads }) => {
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold">Recent Lead</CardTitle>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>
      <CardContent className="space-y-6">
        {leads.map((lead, index) => (
          <div key={index} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="relative">
                {lead.avatar ? (
                  <img src={lead.avatar} alt={lead.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 leading-tight">{lead.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="text-blue-600 font-medium">{lead.email}</span> • {lead.company}
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-neutral-400 group-hover:text-neutral-900 transition-colors" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentLeadsList;
