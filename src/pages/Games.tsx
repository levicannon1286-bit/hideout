import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Gamepad2 } from "lucide-react";

const games = [
  { id: 1, name: "Slope", category: "Action", popularity: "hot" },
  { id: 2, name: "Among Us", category: "Multiplayer", popularity: "popular" },
  { id: 3, name: "1v1.lol", category: "Shooter", popularity: "hot" },
  { id: 4, name: "Subway Surfers", category: "Runner", popularity: "popular" },
  { id: 5, name: "Retro Bowl", category: "Sports", popularity: "trending" },
  { id: 6, name: "Drive Mad", category: "Racing", popularity: "hot" },
  { id: 7, name: "Monkey Mart", category: "Strategy", popularity: "new" },
  { id: 8, name: "Cookie Clicker", category: "Idle", popularity: "popular" },
  { id: 9, name: "Bitlife", category: "Simulation", popularity: "trending" },
  { id: 10, name: "Crossy Road", category: "Arcade", popularity: "new" },
  { id: 11, name: "Shell Shockers", category: "Shooter", popularity: "hot" },
  { id: 12, name: "Tunnel Rush", category: "Action", popularity: "popular" },
];

const getBadgeVariant = (popularity: string) => {
  switch (popularity) {
    case "hot":
      return "default";
    case "popular":
      return "secondary";
    case "trending":
      return "outline";
    default:
      return "secondary";
  }
};

const Games = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-6 mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold">
            <span className="text-foreground">Games</span>
            <span className="text-primary">.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Play unblocked games anywhere, anytime. No restrictions, just fun.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search games..." 
              className="pl-10 bg-card border-border focus:border-primary transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredGames.map((game, index) => (
            <Card
              key={game.id}
              className="group p-4 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow cursor-pointer animate-fade-in relative"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Popularity Badge */}
              {game.popularity && (
                <Badge 
                  variant={getBadgeVariant(game.popularity)}
                  className="absolute top-2 right-2 text-xs uppercase z-10"
                >
                  {game.popularity}
                </Badge>
              )}

              {/* Game Icon Placeholder */}
              <div className="aspect-square mb-3 rounded-lg bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Gamepad2 className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              {/* Game Info */}
              <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors truncate">
                {game.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{game.category}</p>
            </Card>
          ))}
        </div>

        {/* No results message */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No games found matching "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Games;
