"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "error" | "warning" | "success";
  message: string;
}

interface KernelLogsProps {
  logs: LogEntry[];
}

export function KernelLogs({ logs }: KernelLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-[#0c120d] rounded-lg border border-border overflow-hidden font-code">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-headline">
          Build Output Terminal
        </span>
      </div>
      <ScrollArea className="h-[400px] w-full p-4 code-scrollbar">
        <div ref={scrollRef} className="space-y-1">
          {logs.length === 0 && (
            <div className="text-muted-foreground/40 animate-pulse italic">
              Waiting for compilation to start...
            </div>
          )}
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 group">
              <span className="text-muted-foreground/40 select-none shrink-0 text-xs">
                [{log.timestamp}]
              </span>
              <span className={`text-sm break-all ${
                log.level === "error" ? "text-red-400" :
                log.level === "warning" ? "text-secondary" :
                log.level === "success" ? "text-primary" :
                "text-slate-300"
              }`}>
                <span className="opacity-70 mr-2">
                  {log.level === "error" ? "✖" :
                   log.level === "warning" ? "⚠" :
                   log.level === "success" ? "✔" : "$"}
                </span>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}