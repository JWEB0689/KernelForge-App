"use client";

import { useState } from "react";
import { aiBuildTroubleshootingAssistant, AiBuildTroubleshootingAssistantOutput } from "@/ai/flows/ai-build-troubleshooting-assistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, AlertCircle, CheckCircle2, ChevronRight, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AITroubleshooterProps {
  logsText: string;
}

export function AITroubleshooter({ logsText }: AITroubleshooterProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AiBuildTroubleshootingAssistantOutput | null>(null);

  const handleAnalyze = async () => {
    if (!logsText) return;
    setIsAnalyzing(true);
    try {
      const output = await aiBuildTroubleshootingAssistant({ buildLog: logsText });
      setResult(output);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="border-secondary/20 bg-secondary/5 h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-secondary/10 bg-secondary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-secondary/20 rounded-md">
              <Sparkles className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <CardTitle className="font-headline text-lg">AI Troubleshooting Assistant</CardTitle>
              <CardDescription className="text-xs">Analyze logs for LineageOS 23.2 & SM8550 issues</CardDescription>
            </div>
          </div>
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !logsText}
            variant="outline"
            className="border-secondary/50 text-secondary hover:bg-secondary/10"
          >
            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Analyze Logs
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        {result ? (
          <ScrollArea className="h-[500px] w-full p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-headline font-bold uppercase tracking-widest text-secondary">Summary</h4>
                <p className="text-sm text-foreground/80 leading-relaxed bg-muted/20 p-4 rounded-lg border border-border/50">
                  {result.summary}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-headline font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Identified Errors
                </h4>
                <div className="grid gap-2">
                  {result.identifiedErrors.map((err, i) => (
                    <div key={i} className="flex gap-3 text-sm bg-red-500/5 border border-red-500/20 p-3 rounded-lg">
                      <span className="text-red-400 font-bold shrink-0">E0{i + 1}</span>
                      <span className="text-foreground/90">{err}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-headline font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Suggested Solutions
                </h4>
                <div className="grid gap-2">
                  {result.suggestedSolutions.map((sol, i) => (
                    <div key={i} className="flex gap-3 text-sm bg-primary/5 border border-primary/20 p-3 rounded-lg">
                      <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{sol}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
              <Bot className="h-8 w-8 opacity-20" />
            </div>
            <p className="text-sm max-w-xs">
              Waiting for build logs to analyze. Start a compilation or paste logs manually to receive AI-powered guidance.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
