'use client';

import Image from 'next/image';
import { Star, MapPin, Clock, Phone, Gamepad2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Club } from "@/lib/types/club";
import Button from './Button';

interface ClubCardProps {
  club: Club;
  className?: string;
  onClick?: () => void;
  onViewDetails?: () => void;
  onBookNow?: () => void;
}

export default function ClubCard({ club, className, onClick, onViewDetails, onBookNow }: ClubCardProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Club Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={club.imageUrl}
          alt={club.name}
          fill
          className="object-cover object-center"
        />
        {club.distance && (
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
            {club.distance}
          </div>
        )}
      </div>
      
      {/* Club Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
            {club.name}
          </h3>
          <div className="flex items-center text-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 font-medium">{club.rating}</span>
            <span className="ml-1 text-gray-500">({club.totalReviews})</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">{club.address}, {club.city}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {club.description}
        </p>
        
        {/* Available Games */}
        <div className="flex items-center mb-3">
          <Gamepad2 className="w-4 h-4 text-blue-600 mr-1" />
          <div className="flex flex-wrap gap-1">
            {club.availableGames.slice(0, 3).map((game) => (
              <span 
                key={game} 
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {game}
              </span>
            ))}
            {club.availableGames.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{club.availableGames.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{club.operatingHours.open} - {club.operatingHours.close}</span>
          </div>
          <span className="font-medium text-green-600">{club.priceRange}</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.();
            }}
            className="flex-1 text-sm py-2"
          >
            View Details
          </Button>
          <Button
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              onBookNow?.();
            }}
            className="flex-1 text-sm py-2"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
} 