import { LayoutDashboard, Cpu, ShieldCheck, Terminal, Bot, Settings, FolderCode, PackageSearch } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "Project Setup", icon: FolderCode, id: "setup" },
  { title: "Kernel Patching", icon: ShieldCheck, id: "patching" },
  { title: "Compilation", icon: Cpu, id: "compilation" },
  { title: "Log Viewer", icon: Terminal, id: "logs" },
  { title: "Flashable Creator", icon: PackageSearch, id: "flashable" },
  { title: "AI Assistant", icon: Bot, id: "ai" },
];

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg neon-glow">
            <Cpu className="text-primary-foreground h-6 w-6" />
          </div>
          <h1 className="font-headline text-xl font-bold tracking-tight text-primary">
            K-CRAFTER
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 font-headline uppercase tracking-widest text-[10px] text-muted-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`py-6 px-4 transition-all duration-200 ${
                      activeTab === item.id 
                        ? "bg-primary/10 text-primary border-r-2 border-primary" 
                        : "text-sidebar-foreground hover:bg-muted/50"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="font-headline font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenuButton className="py-6 text-muted-foreground hover:text-foreground">
          <Settings className="h-5 w-5 mr-3" />
          <span className="font-headline font-medium">Global Settings</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}