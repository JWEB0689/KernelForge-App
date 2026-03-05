"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { KernelLogs } from "@/components/dashboard/KernelLogs";
import { AITroubleshooter } from "@/components/dashboard/AITroubleshooter";
import { useToast } from "@/hooks/use-toast";
import { 
  Cpu, 
  Settings2, 
  Terminal, 
  Download, 
  Play, 
  RefreshCcw, 
  Save, 
  ShieldAlert, 
  Zap, 
  CheckCircle2,
  FolderOpen,
  Box,
  Binary,
  FileDown
} from "lucide-react";

export default function KernelcrafterDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Form States
  const [projectPath, setProjectPath] = useState("~/android/lineage/kernel/msm-5.15");
  const [kernelSu, setKernelSu] = useState(true);
  const [susfs, setSusfs] = useState(true);
  const [compiler, setCompiler] = useState("Clang 17.0.4");
  
  const addLog = (message: string, level: "info" | "error" | "warning" | "success" = "info") => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    }]);
  };

  const startBuild = () => {
    setIsBuilding(true);
    setBuildProgress(0);
    setLogs([]);
    addLog("Initializing build environment for SM8550 (kalama)...", "info");
    addLog("Targeting LineageOS 23.2...", "info");
    
    if (kernelSu) addLog("Applying KernelSU v0.9.5 patches...", "success");
    if (susfs) addLog("Applying susfs4ksu kernel integration...", "success");
    
    addLog("Configuring kernel: lineageos_sm8550_defconfig", "info");
    addLog("Starting compilation with " + compiler + "...", "info");
  };

  const downloadKernel = () => {
    if (buildProgress < 100) return;
    
    addLog("Preparing kernel image for download...", "info");
    
    // Simulate file download
    const dummyContent = "LineageOS Kernel Image for SM8550";
    const blob = new Blob([dummyContent], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Image.lz4-dtb";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Kernel image (Image.lz4-dtb) is being downloaded.",
    });
    
    addLog("Kernel image download initiated.", "success");
  };

  useEffect(() => {
    if (isBuilding && buildProgress < 100) {
      const timer = setTimeout(() => {
        const nextProgress = buildProgress + Math.floor(Math.random() * 5) + 1;
        setBuildProgress(Math.min(nextProgress, 100));
        
        if (nextProgress % 10 === 0) {
          addLog(`Compiling: [${nextProgress}%] drivers/soc/qcom/...`, "info");
        }
        if (nextProgress === 45) {
          addLog("WARNING: deprecated function in kernel/sched/core.c", "warning");
        }
        if (nextProgress === 100) {
          setIsBuilding(false);
          addLog("Build completed successfully!", "success");
          addLog("Kernel Image: out/arch/arm64/boot/Image.lz4-dtb", "success");
          addLog("Ready for packaging.", "info");
          toast({
            title: "Build Successful",
            description: "Your kernel image is ready for download.",
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isBuilding, buildProgress, toast]);

  const logsText = logs.map(l => `[${l.timestamp}] ${l.message}`).join("\n");

  return (
    <SidebarProvider>
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset className="bg-[#161D18]">
        <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="h-4 w-px bg-border/50 mx-2 hidden md:block" />
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">SM8550</Badge>
              <Badge variant="outline" className="border-secondary/30 bg-secondary/5 text-secondary">Lineage 23.2</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-headline">Status</span>
              <span className={`text-xs font-bold ${isBuilding ? "text-secondary animate-pulse" : "text-primary"}`}>
                {isBuilding ? "System Building..." : buildProgress === 100 ? "Build Finished" : "Ready to Build"}
              </span>
            </div>
            {buildProgress === 100 && (
              <Button size="sm" variant="outline" onClick={downloadKernel} className="h-9 border-primary/50 text-primary hover:bg-primary/10 neon-glow">
                <FileDown className="h-4 w-4 mr-2" /> Download Image
              </Button>
            )}
            <Button size="sm" variant="outline" className="h-9 border-border hover:bg-muted/30">
              <RefreshCcw className="h-4 w-4 mr-2" /> Sync Source
            </Button>
            <Button size="sm" onClick={startBuild} disabled={isBuilding} className="h-9 bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
              {isBuilding ? <RefreshCcw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isBuilding ? "Compiling..." : "Build Kernel"}
            </Button>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-primary" />
                        <CardTitle className="font-headline">Build Overview</CardTitle>
                      </div>
                      {buildProgress === 100 && (
                        <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse">Build Ready</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                        <div className="text-[10px] uppercase text-muted-foreground tracking-widest mb-1">Target Device</div>
                        <div className="text-lg font-bold font-headline">Qualcomm SM8550</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                        <div className="text-[10px] uppercase text-muted-foreground tracking-widest mb-1">OS Base</div>
                        <div className="text-lg font-bold font-headline">LineageOS 23.2</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Compilation Progress</span>
                        <span className="font-code text-primary">{buildProgress}%</span>
                      </div>
                      <Progress value={buildProgress} className="h-2 bg-muted" />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">Active Modules</Label>
                      <div className="flex flex-wrap gap-2">
                        {kernelSu && <Badge className="bg-primary/20 text-primary border-primary/30">KernelSU v0.9.5</Badge>}
                        {susfs && <Badge className="bg-secondary/20 text-secondary border-secondary/30">SUSFS Integration</Badge>}
                        <Badge variant="outline" className="border-border text-muted-foreground">WireGuard</Badge>
                        <Badge variant="outline" className="border-border text-muted-foreground">KVM Support</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-3 border-t border-border/20 pt-4 bg-muted/5">
                    {buildProgress === 100 && (
                      <Button onClick={downloadKernel} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <FileDown className="h-4 w-4 mr-2" /> Download Kernel Image
                      </Button>
                    )}
                  </CardFooter>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-secondary" />
                      <CardTitle className="font-headline">Quick Stats</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/20">
                      <span className="text-sm text-muted-foreground">Last Build Time</span>
                      <span className="text-sm font-code">12m 43s</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/20">
                      <span className="text-sm text-muted-foreground">Storage Usage</span>
                      <span className="text-sm font-code">14.2 GB</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/20">
                      <span className="text-sm text-muted-foreground">Artifact Size</span>
                      <span className="text-sm font-code">32.4 MB</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Compiler Load</span>
                      <span className="text-sm font-code text-secondary">88%</span>
                    </div>
                    <div className="pt-4">
                      <Button variant="outline" className="w-full border-border/50 text-xs">View History</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="md:col-span-3">
                  <KernelLogs logs={logs} />
                </div>
              </div>
            )}

            {activeTab === "setup" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Settings2 className="h-6 w-6 text-primary" /> Project Setup
                  </CardTitle>
                  <CardDescription>Configure your workspace and source paths</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Kernel Source Path</Label>
                      <div className="flex gap-2">
                        <Input value={projectPath} onChange={(e) => setProjectPath(e.target.value)} className="bg-muted/20" />
                        <Button variant="outline" size="icon"><FolderOpen className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Target Device</Label>
                        <Input value="SM8550 (kalama)" disabled className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>LineageOS Version</Label>
                        <Input value="23.2 (Android 15)" disabled className="bg-muted/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Toolchain Selection</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant={compiler.includes("Clang") ? "default" : "outline"} onClick={() => setCompiler("Clang 17.0.4")} className="text-xs">Clang 17.0.4</Button>
                        <Button variant={compiler.includes("GCC") ? "default" : "outline"} onClick={() => setCompiler("GCC 13.2")} className="text-xs">GCC 13.2</Button>
                        <Button variant={compiler.includes("Proton") ? "default" : "outline"} onClick={() => setCompiler("Proton Clang")} className="text-xs">Proton Clang</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 border-t border-border/30 pt-4">
                  <Button className="ml-auto neon-glow"><Save className="h-4 w-4 mr-2" /> Save Configuration</Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "patching" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/50 overflow-hidden">
                  <div className="h-1 bg-primary neon-glow" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-headline flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-primary" /> KernelSU
                      </CardTitle>
                      <Switch checked={kernelSu} onCheckedChange={setKernelSu} />
                    </div>
                    <CardDescription>Systemless root integration for LineageOS</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">KernelSU provides kernel-level root access that is invisible to most detection methods.</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs py-1 border-b border-border/10">
                        <span className="text-muted-foreground">Patch Version</span>
                        <span>0.9.5-stable</span>
                      </div>
                      <div className="flex justify-between text-xs py-1">
                        <span className="text-muted-foreground">Status</span>
                        <span className="text-primary">Compatible</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 overflow-hidden">
                  <div className="h-1 bg-secondary purple-glow" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-headline flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-secondary" /> susfs4ksu
                      </CardTitle>
                      <Switch checked={susfs} onCheckedChange={setSusfs} />
                    </div>
                    <CardDescription>Filesystem hiding for root-detection bypass</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">SUSFS adds kernel hooks to effectively hide root-related files and modifications from Play Integrity.</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs py-1 border-b border-border/10">
                        <span className="text-muted-foreground">Integration</span>
                        <span>v1.5.x</span>
                      </div>
                      <div className="flex justify-between text-xs py-1">
                        <span className="text-muted-foreground">Status</span>
                        <span className="text-secondary">Requires KernelSU</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "logs" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline text-2xl font-bold flex items-center gap-2">
                    <Terminal className="h-6 w-6 text-primary" /> Build Output
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setLogs([])}>Clear Console</Button>
                    <Button variant="outline" size="sm" onClick={downloadKernel} disabled={buildProgress < 100} className="border-primary/50 text-primary">Export Log</Button>
                  </div>
                </div>
                <KernelLogs logs={logs} />
              </div>
            )}

            {activeTab === "ai" && (
              <div className="h-[600px]">
                <AITroubleshooter logsText={logsText} />
              </div>
            )}

            {activeTab === "flashable" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Box className="h-6 w-6 text-secondary" /> Flashable Package Creator
                  </CardTitle>
                  <CardDescription>Bundle your kernel into a flashable ZIP or Image</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label>Package Template</Label>
                        <div className="grid grid-cols-1 gap-2">
                          <Button variant="default" className="justify-start h-auto p-4 border-2 border-primary">
                            <div className="text-left">
                              <div className="font-bold flex items-center gap-2"><Binary className="h-4 w-4" /> AnyKernel3 (Recommended)</div>
                              <div className="text-xs opacity-70">Flashable ZIP for generic recovery installation</div>
                            </div>
                          </Button>
                          <Button variant="outline" className="justify-start h-auto p-4 border-border/50">
                            <div className="text-left">
                              <div className="font-bold flex items-center gap-2"><Download className="h-4 w-4" /> Raw Boot Image</div>
                              <div className="text-xs opacity-70">Single boot.img file for fastboot flashing</div>
                            </div>
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Package Name</Label>
                        <Input placeholder="Lineage-SM8550-Kernel-$(DATE).zip" className="bg-muted/20" />
                      </div>
                    </div>

                    <div className="bg-muted/10 rounded-xl p-6 border border-border/50 flex flex-col items-center justify-center text-center">
                      {buildProgress === 100 ? (
                        <>
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 neon-glow">
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                          </div>
                          <h4 className="font-headline text-xl mb-2">Build Ready</h4>
                          <p className="text-sm text-muted-foreground mb-6">Your kernel image has been compiled and is ready for packaging.</p>
                          <div className="flex flex-col gap-2 w-full">
                            <Button onClick={downloadKernel} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
                              <FileDown className="h-4 w-4 mr-2" /> Download Image (.lz4)
                            </Button>
                            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 purple-glow">
                              Generate Flashable ZIP
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                            <Box className="h-8 w-8 opacity-20" />
                          </div>
                          <h4 className="font-headline text-xl mb-2">Build Required</h4>
                          <p className="text-sm text-muted-foreground">Complete a kernel compilation before generating a flashable package.</p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "compilation" && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Compiler Flags</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>LTO (Link Time Optimization)</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Thin-LTO</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>CFI (Control Flow Integrity)</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>SCS (Shadow Call Stack)</span>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-3 space-y-6">
                   <Card className="border-border/50 bg-[#0c120d]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/10">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${isBuilding ? "bg-secondary animate-pulse" : buildProgress === 100 ? "bg-primary" : "bg-muted"}`} />
                        <CardTitle className={`font-headline ${isBuilding ? "text-secondary" : buildProgress === 100 ? "text-primary" : "text-muted-foreground"}`}>
                          {isBuilding ? "Live Compilation" : buildProgress === 100 ? "Compilation Complete" : "Waiting to Compile"}
                        </CardTitle>
                      </div>
                      <div className="text-xs font-code text-muted-foreground">Jobs: -j$(nproc)</div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <KernelLogs logs={logs} />
                    </CardContent>
                    {buildProgress === 100 && (
                      <CardFooter className="border-t border-border/10 pt-4 flex justify-between">
                        <span className="text-xs text-muted-foreground">Output: arch/arm64/boot/Image.lz4-dtb</span>
                        <Button size="sm" onClick={downloadKernel} className="h-8 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
                          <FileDown className="h-3.5 w-3.5 mr-2" /> Download
                        </Button>
                      </CardFooter>
                    )}
                   </Card>
                </div>
              </div>
            )}

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
