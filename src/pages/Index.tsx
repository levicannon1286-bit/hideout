import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-glow opacity-50 animate-glow-pulse" />
      
      <Navigation />

      {/* Main Content */}
      <main className="relative text-center space-y-12 animate-fade-in px-6">
        {/* Big Hideout Text with Glow */}
        <div className="relative inline-block">
          {/* Glowing green background */}
          <div className="absolute inset-0 bg-primary/30 blur-[100px] animate-glow-pulse scale-150" />
          
          <h1 className="text-8xl md:text-9xl font-bold tracking-tight relative">
            <span className="text-foreground">Hideout</span>
            <span className="text-primary">.</span>
          </h1>
        </div>

        {/* Start Button */}
        <div>
          <Button 
            size="lg" 
            className="group text-lg px-12 py-6 h-auto rounded-xl shadow-glow hover:scale-105 transition-transform"
            asChild
          >
            <Link to="/games">
              <Play className="w-6 h-6 fill-current" />
              Start
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
