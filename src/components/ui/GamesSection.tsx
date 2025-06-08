'use client';

import { Game } from "@/lib/types/games";
import GameCard from "./GameCard";
import Button from "./Button";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

interface GamesSectionProps {
  className?: string;
}

// Mock data for games - in a real app, this would come from an API or Redux store
const mockGames: Game[] = [
  {
    id: "1",
    name: "Valorant",
    type: "PC",
    description: "Tactical 5v5 character-based shooter. Precise gunplay meets unique agent abilities in competitive matches that demand strategy and skill.",
    imageUrl: "/assets/games/valorant.png",
    playersCount: "5v5 players",
    avgDuration: "30-45 min",
    priceRange: "₹80-150/hr"
  },
  {
    id: "2", 
    name: "Counter-Strike 2",
    type: "PC",
    description: "The legendary tactical shooter rebuilt on Source 2 engine. Experience competitive 5v5 matches with enhanced graphics and gameplay.",
    imageUrl: "/assets/games/cs-2.png",
    playersCount: "5v5 players",
    avgDuration: "30-60 min", 
    priceRange: "₹80-150/hr"
  },
  {
    id: "3",
    name: "PUBG Battlegrounds",
    type: "PC",
    description: "Last player standing battle royale. Drop into massive maps, loot weapons, and fight to be the sole survivor in intense 100-player matches.",
    imageUrl: "/assets/games/battle_ground.png",
    playersCount: "1-4 squad",
    avgDuration: "25-35 min",
    priceRange: "₹60-120/hr"
  },
  {
    id: "4",
    name: "FIFA",
    type: "PS4",
    description: "The world's most popular football simulation. Experience realistic gameplay, career modes, and compete in online tournaments.",
    imageUrl: "/assets/games/fifa.png",
    playersCount: "1-2 players",
    avgDuration: "15-30 min",
    priceRange: "₹50-100/hr"
  },
  {
    id: "5",
    name: "Mortal Kombat",
    type: "PS4",
    description: "Legendary fighting game with brutal combat and iconic Fatalities. Master unique fighters and dominate in competitive battles.",
    imageUrl: "/assets/games/mortal_combat.png",
    playersCount: "1-2 players",
    avgDuration: "10-20 min",
    priceRange: "₹50-100/hr"
  },
  {
    id: "6",
    name: "Snooker",
    type: "SNOOKER",
    description: "Professional snooker table with precision pockets and premium felt. Perfect for serious players who appreciate the gentleman's game.",
    imageUrl: "/assets/games/snooker.png",
    playersCount: "2 players",
    avgDuration: "45-90 min",
    priceRange: "₹150-300/hr"
  }
];

export default function GamesSection({ className }: GamesSectionProps) {
  const router = useRouter();

  const handleGameClick = (game: Game) => {
    // TODO: Navigate to game booking or club selection page
    console.log("Game clicked:", game.name);
  };

  return (
    <section className={cn("py-16 px-4 sm:px-6 lg:px-8 bg-gray-50", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Popular Games & Activities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing gaming experiences at our partner clubs. From classic cue sports to cutting-edge console gaming.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onClick={() => handleGameClick(game)}
              className="h-full"
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            variant="primary" 
            className="px-8 py-3"
            onClick={() => router.push('/player/club/search')}
          >
            View All Games
          </Button>  
        </div>
      </div>
    </section>
  );
} 