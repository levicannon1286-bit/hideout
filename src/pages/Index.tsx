import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-6">
        <main className="relative text-center space-y-12 animate-fade-in w-full max-w-3xl">
          {/* Hideout Container with rounded background */}
          <div className="relative bg-card/30 backdrop-blur-sm rounded-3xl p-12 border border-border/50">
            <h1 className="text-9xl md:text-[12rem] font-bold tracking-tight">
              <span className="text-foreground">Hideout</span>
              <span className="text-primary">.</span>
            </h1>
          </div>

          {/* Search Bar with Button Inside */}
          <div className="relative w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground z-10" />
            <Input 
              placeholder="search anything" 
              className="w-full h-16 pl-16 pr-32 text-lg bg-card border-border transition-colors rounded-2xl"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors">
              Search
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
