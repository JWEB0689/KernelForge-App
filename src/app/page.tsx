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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  FileDown,
  Activity,
  Globe,
  GitBranch,
  Smartphone,
  ShieldCheck,
  Layers,
  FileArchive,
  EyeOff
} from "lucide-react";

export default function KernelcrafterDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Setup States
  const [kernelUrl, setKernelUrl] = useState("https://github.com/LineageOS/android_kernel_qcom_msm-5.15");
  const [kernelBranch, setKernelBranch] = useState("lineage-21");
  const [deviceCodename, setDeviceCodename] = useState("kalama");
  const [deviceModel, setDeviceModel] = useState("SM8550");
  const [gkiVersion, setGkiVersion] = useState("android13-5.15");
  const [kmiVersion, setKmiVersion] = useState("v5.15-android13");
  
  // Patching States
  const [kernelSu, setKernelSu] = useState(true);
  const [ksuVariant, setKsuVariant] = useState("official"); // official, next, gki
  const [susfs, setSusfs] = useState(true);
  const [susfsBranch, setSusfsBranch] = useState("v1.5.x");
  const [noMount, setNoMount] = useState(true);
  
  // Compilation States
  const [bbr, setBbr] = useState(true);
  const [compiler, setCompiler] = useState("Clang 17.0.4");
  const [projectPath, setProjectPath] = useState("~/android/lineage/kernel/msm-5.15");
  
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
    addLog(`Initializing build environment for ${deviceModel} (${deviceCodename})...`, "info");
    addLog(`Targeting GKI: ${gkiVersion} | KMI: ${kmiVersion}`, "info");
    addLog(`Fetching source from: ${kernelUrl} [${kernelBranch}]`, "info");
    
    if (kernelSu) {
      const variantName = ksuVariant === "next" ? "KernelSU-Next" : "Official KernelSU";
      addLog(`Applying ${variantName} patches for ${kmiVersion}...`, "success");
    }
    
    if (susfs) {
      addLog(`Integrating SUSFS from branch: ${susfsBranch}...`, "success");
    }

    if (noMount) {
      addLog("Applying NoMount patches by maxsteeel for filesystem hiding...", "success");
    }
    
    if (bbr) addLog("Enabling TCP BBR v3 Congestion Control...", "success");
    
    addLog(`Configuring kernel: ${deviceCodename}_defconfig`, "info");
    addLog("Starting compilation with " + compiler + "...", "info");
  };

  const downloadKernel = () => {
    if (buildProgress < 100) return;
    
    addLog("Preparing kernel image for download...", "info");
    
    const dummyContent = `LineageOS Kernel Image for ${deviceModel}`;
    const blob = new Blob([dummyContent], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Image-${deviceCodename}.lz4-dtb`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `Kernel image (Image-${deviceCodename}.lz4-dtb) is being downloaded.`,
    });
    
    addLog("Kernel image download initiated.", "success");
  };

  const createFlashableZip = () => {
    if (buildProgress < 100) return;
    addLog("Packaging kernel with AnyKernel3 template...", "info");
    addLog("Generating AnyKernel3 zip: AnyKernel3-Lineage-" + deviceCodename + ".zip", "success");
    toast({
      title: "Flashable ZIP Ready",
      description: "AnyKernel3 package has been generated successfully.",
    });
  };

  useEffect(() => {
    if (isBuilding && buildProgress < 100) {
      const timer = setTimeout(() => {
        const nextProgress = buildProgress + Math.floor(Math.random() * 5) + 1;
        setBuildProgress(Math.min(nextProgress, 100));
        
        if (nextProgress % 10 === 0) {
          addLog(`Compiling: [${nextProgress}%] drivers/soc/qcom/...`, "info");
        }
        if (nextProgress === 25 && bbr) {
          addLog("Compiling net/ipv4/tcp_bbr.c", "info");
        }
        if (nextProgress === 40 && noMount) {
          addLog("Patching fs/namespace.c with NoMount hooks", "info");
        }
        if (nextProgress === 100) {
          setIsBuilding(false);
          addLog("Build completed successfully!", "success");
          addLog(`Kernel Image: out/arch/arm64/boot/Image-${deviceCodename}.lz4-dtb`, "success");
          addLog("Ready for packaging.", "info");
          toast({
            title: "Build Successful",
            description: "Your kernel image is ready for download.",
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isBuilding, buildProgress, toast, bbr, deviceCodename, noMount]);

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
              <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary uppercase">{deviceCodename}</Badge>
              <Badge variant="outline" className="border-secondary/30 bg-secondary/5 text-secondary">{deviceModel}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-headline">Status</span>
              <span className={`text-xs font-bold ${isBuilding ? "text-secondary animate-pulse" : "text-primary"}`}>
                {isBuilding ? "System Building..." : buildProgress === 100 ? "Build Finished" : "Ready to Build"}
              </span>
            </div>
            {buildProgress === 100 && (activeTab === "flashable" ? (
               <Button size="sm" onClick={createFlashableZip} className="h-9 bg-secondary text-secondary-foreground hover:bg-secondary/90 purple-glow">
                <FileArchive className="h-4 w-4 mr-2" /> Generate ZIP
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={downloadKernel} className="h-9 border-primary/50 text-primary hover:bg-primary/10 neon-glow">
                <FileDown className="h-4 w-4 mr-2" /> Download Image
              </Button>
            ))}
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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                        <div className="text-[10px] uppercase text-muted-foreground tracking-widest mb-1">Target Device</div>
                        <div className="text-sm font-bold font-headline truncate">{deviceModel}</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                        <div className="text-[10px] uppercase text-muted-foreground tracking-widest mb-1">Codename</div>
                        <div className="text-sm font-bold font-headline truncate">{deviceCodename}</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                        <div className="text-[10px] uppercase text-muted-foreground tracking-widest mb-1">GKI Version</div>
                        <div className="text-sm font-bold font-headline truncate">{gkiVersion}</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                        <div className="text-[10px] uppercase text-muted-foreground tracking-widest mb-1">Compiler</div>
                        <div className="text-sm font-bold font-headline truncate">{compiler}</div>
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
                        {kernelSu && <Badge className="bg-primary/20 text-primary border-primary/30">{ksuVariant === "next" ? "KernelSU-Next" : "KernelSU"}</Badge>}
                        {susfs && <Badge className="bg-secondary/20 text-secondary border-secondary/30">SUSFS {susfsBranch}</Badge>}
                        {noMount && <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">NoMount</Badge>}
                        {bbr && <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">TCP BBR v3</Badge>}
                        <Badge variant="outline" className="border-border text-muted-foreground">WireGuard</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-3 border-t border-border/20 pt-4 bg-muted/5">
                    {buildProgress === 100 && (
                      <>
                        <Button variant="outline" onClick={createFlashableZip} className="border-secondary/50 text-secondary hover:bg-secondary/10">
                          <FileArchive className="h-4 w-4 mr-2" /> AnyKernel3 ZIP
                        </Button>
                        <Button onClick={downloadKernel} className="bg-primary text-primary-foreground hover:bg-primary/90">
                          <FileDown className="h-4 w-4 mr-2" /> Download Image
                        </Button>
                      </>
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
                      <span className="text-sm text-muted-foreground">KMI Version</span>
                      <span className="text-xs font-code truncate max-w-[120px]">{kmiVersion}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/20">
                      <span className="text-sm text-muted-foreground">Branch</span>
                      <span className="text-sm font-code">{kernelBranch}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/20">
                      <span className="text-sm text-muted-foreground">NoMount Patch</span>
                      <span className="text-xs text-primary">{noMount ? "Active" : "Disabled"}</span>
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
                  <CardDescription>Configure your kernel source and target device compatibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> Kernel Source Repository URL</Label>
                        <Input 
                          placeholder="https://github.com/..." 
                          value={kernelUrl} 
                          onChange={(e) => setKernelUrl(e.target.value)} 
                          className="bg-muted/20" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><GitBranch className="h-3.5 w-3.5" /> Default Branch</Label>
                        <Input 
                          placeholder="main" 
                          value={kernelBranch} 
                          onChange={(e) => setKernelBranch(e.target.value)} 
                          className="bg-muted/20" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Smartphone className="h-3.5 w-3.5" /> Device Model Name</Label>
                        <Input 
                          placeholder="Google Pixel 8" 
                          value={deviceModel} 
                          onChange={(e) => setDeviceModel(e.target.value)} 
                          className="bg-muted/20" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Terminal className="h-3.5 w-3.5" /> Device Codename</Label>
                        <Input 
                          placeholder="shiba" 
                          value={deviceCodename} 
                          onChange={(e) => setDeviceCodename(e.target.value)} 
                          className="bg-muted/20" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Layers className="h-3.5 w-3.5" /> GKI Version</Label>
                        <Select value={gkiVersion} onValueChange={setGkiVersion}>
                          <SelectTrigger className="bg-muted/20">
                            <SelectValue placeholder="Select GKI version" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="android12-5.10">Android 12 (5.10)</SelectItem>
                            <SelectItem value="android13-5.15">Android 13 (5.15)</SelectItem>
                            <SelectItem value="android14-6.1">Android 14 (6.1)</SelectItem>
                            <SelectItem value="android15-6.6">Android 15 (6.6)</SelectItem>
                            <SelectItem value="legacy">Non-GKI (Legacy)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> Target KMI (Kernel Module Interface)</Label>
                        <Input 
                          placeholder="v5.15-android13" 
                          value={kmiVersion} 
                          onChange={(e) => setKmiVersion(e.target.value)} 
                          className="bg-muted/20" 
                        />
                        <p className="text-[10px] text-muted-foreground italic px-1">Must match your device's expected KMI for module compatibility.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Kernel Local Path (for compilation)</Label>
                      <div className="flex gap-2">
                        <Input value={projectPath} onChange={(e) => setProjectPath(e.target.value)} className="bg-muted/20" />
                        <Button variant="outline" size="icon"><FolderOpen className="h-4 w-4" /></Button>
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
                        <ShieldAlert className="h-5 w-5 text-primary" /> KernelSU Variant
                      </CardTitle>
                      <Switch checked={kernelSu} onCheckedChange={setKernelSu} />
                    </div>
                    <CardDescription>Choose your root integration type</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={ksuVariant} onValueChange={setKsuVariant} disabled={!kernelSu} className="grid grid-cols-1 gap-4">
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:bg-muted/20 cursor-pointer transition-colors">
                        <RadioGroupItem value="official" id="official" />
                        <Label htmlFor="official" className="flex-1 cursor-pointer">
                          <div className="font-bold">Official KernelSU</div>
                          <div className="text-[10px] text-muted-foreground">Stable kernel-level root access</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:bg-muted/20 cursor-pointer transition-colors">
                        <RadioGroupItem value="next" id="next" />
                        <Label htmlFor="next" className="flex-1 cursor-pointer">
                          <div className="font-bold text-secondary">KernelSU-Next</div>
                          <div className="text-[10px] text-muted-foreground">Enhanced features & experimental patches</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card className="border-border/50 overflow-hidden">
                  <div className="h-1 bg-secondary purple-glow" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-headline flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-secondary" /> SUSFS Integration
                      </CardTitle>
                      <Switch checked={susfs} onCheckedChange={setSusfs} />
                    </div>
                    <CardDescription>Advanced filesystem hiding for security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs">SUSFS Repository Branch</Label>
                      <Input 
                        placeholder="v1.5.x" 
                        value={susfsBranch} 
                        onChange={(e) => setSusfsBranch(e.target.value)} 
                        disabled={!susfs}
                        className="bg-muted/20" 
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-border/20 space-y-3">
                       <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <EyeOff className="h-4 w-4 text-orange-400" />
                          <Label className="text-sm font-bold">NoMount (maxsteeel)</Label>
                        </div>
                        <Switch checked={noMount} onCheckedChange={setNoMount} />
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        maxsteeel's NoMount patches add hooks to prevent detection of modified filesystems by preventing certain mounting behaviors.
                      </p>
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
                    <Box className="h-6 w-6 text-secondary" /> AnyKernel3 Flashable Creator
                  </CardTitle>
                  <CardDescription>Bundle your kernel into an AnyKernel3 flashable ZIP for recovery installation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label>Zipping Template</Label>
                        <div className="grid grid-cols-1 gap-2">
                          <Button variant="default" className="justify-start h-auto p-4 border-2 border-primary">
                            <div className="text-left">
                              <div className="font-bold flex items-center gap-2"><Binary className="h-4 w-4" /> AnyKernel3 (v3.0.x)</div>
                              <div className="text-xs opacity-70">Universal installer for generic recovery scripts</div>
                            </div>
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>ZIP Filename Format</Label>
                        <Input placeholder={`Lineage-${deviceCodename}-Kernel-AnyKernel3.zip`} className="bg-muted/20" />
                        <p className="text-[10px] text-muted-foreground italic">Template: AnyKernel3-Lineage-{deviceCodename}.zip</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked />
                          <Label className="text-xs">Include DTB/DTBO blobs</Label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/10 rounded-xl p-6 border border-border/50 flex flex-col items-center justify-center text-center">
                      {buildProgress === 100 ? (
                        <>
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 neon-glow">
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                          </div>
                          <h4 className="font-headline text-xl mb-2">Build Ready</h4>
                          <p className="text-sm text-muted-foreground mb-6">Your compiled Image for {deviceCodename} is available for zipping.</p>
                          <div className="flex flex-col gap-2 w-full">
                            <Button onClick={createFlashableZip} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 purple-glow">
                              <FileArchive className="h-4 w-4 mr-2" /> Generate AnyKernel3 ZIP
                            </Button>
                            <Button onClick={downloadKernel} variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10">
                              <FileDown className="h-4 w-4 mr-2" /> Download Raw Image
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
                      <CardTitle className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Network & Optimization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-400" />
                          <span>TCP BBR v3</span>
                        </div>
                        <Switch checked={bbr} onCheckedChange={setBbr} />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>LTO (Optimization)</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Thin-LTO</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>CFI Security</span>
                        <Switch />
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
