import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Calendar, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const RecentEmployees = ({ tasks }) => {
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold">My Task</CardTitle>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task, index) => (
          <div key={index} className={cn(
            "p-4 rounded-xl border border-neutral-100 flex items-start gap-3 relative",
            task.completed ? "bg-white" : "bg-white"
          )}>
            <button className={cn(
              "mt-0.5",
              task.completed ? "text-green-500" : "text-neutral-300"
            )}>
              {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>
            <div className="flex-1">
              <p className={cn(
                "text-sm font-semibold leading-tight",
                task.completed && "text-neutral-500"
              )}>{task.title}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={14} />
                  <span>{task.date}</span>
                </div>
                <div className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-md",
                  task.tagColor === 'purple' ? "bg-purple-50 text-purple-600" :
                    task.tagColor === 'blue' ? "bg-blue-50 text-blue-600" :
                      "bg-neutral-50 text-neutral-600"
                )}>
                  {task.tag}
                </div>
              </div>
            </div>
            <div className="flex -space-x-2">
              {task.assignees?.map((a, i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-neutral-100">
                  <img src={a.avatar} alt="avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentEmployees;
