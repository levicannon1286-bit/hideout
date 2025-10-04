import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import * as LucideIcons from "lucide-react";
import appsData from "@/data/apps.json";

type App = {
  id: number;
  name: string;
  icon: string;
  category: string;
  description: string;
  link: string;
};

const apps: App[] = appsData;

const Apps = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-6 mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground">Apps</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Access popular apps and tools directly from your browser.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search apps..." 
              className="pl-10 bg-card border-border transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app, index) => {
            const IconComponent = (LucideIcons as any)[app.icon] || LucideIcons.AppWindow;
            return (
              <Card
                key={app.id}
                className="group p-6 bg-card border-border hover:border-primary/20 transition-all duration-300 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-primary/80 transition-colors">
                      {app.name}
                    </h3>
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {app.category}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{app.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* No results */}
        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No apps found matching "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Apps;
