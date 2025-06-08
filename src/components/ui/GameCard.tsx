'use client';

import Image from 'next/image';
import { cn } from "@/lib/utils";
import { Game } from "@/lib/types/games";

interface GameCardProps {
  game: Game;
  className?: string;
  onClick?: () => void;
}

export default function GameCard({ game, className, onClick }: GameCardProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      {/* Game Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={game.imageUrl}
          alt={game.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Game Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {game.name}
          </h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {game.type}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {game.description}
        </p>
        
        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Players:</span>
            <span className="font-medium">{game.playersCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-medium">{game.avgDuration}</span>
          </div>
          <div className="flex justify-between">
            <span>Price:</span>
            <span className="font-medium text-green-600">{game.priceRange}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 