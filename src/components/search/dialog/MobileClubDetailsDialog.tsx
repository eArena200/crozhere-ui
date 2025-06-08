'use client';

import { useEffect } from 'react';
import { X, Star, MapPin, Clock, Phone, Gamepad2, Wifi, Car, Coffee, Users, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { Club } from '@/lib/types/club';
import Button from '@/components/ui/Button';

interface MobileClubDetailsDialogProps {
  club: Club | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: (club: Club) => void;
}

export default function MobileClubDetailsDialog({ club, isOpen, onClose, onBookNow }: MobileClubDetailsDialogProps) {
  // Disable background scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !club) return null;

  const handleBookNow = () => {
    onBookNow?.(club);
    onClose();
  };

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet')) return <Wifi className="w-5 h-5" />;
    if (lower.includes('parking') || lower.includes('car')) return <Car className="w-5 h-5" />;
    if (lower.includes('snack') || lower.includes('coffee') || lower.includes('food') || lower.includes('beverages')) return <Coffee className="w-5 h-5" />;
    if (lower.includes('group') || lower.includes('tournament') || lower.includes('coaching')) return <Users className="w-5 h-5" />;
    return <Star className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Scrollable Content - Everything */}
      <div className="flex-1 overflow-y-auto">
        {/* Header with Hero Image */}
        <div className="relative">
          {/* Club Image */}
          <div className="relative h-80 w-full">
            <Image
              src={club.imageUrl}
              alt={club.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Header Controls - Fixed during scroll */}
            <div className="sticky top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
              <button
                onClick={onClose}
                className="bg-black/30 backdrop-blur-sm text-white p-2 rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              {club.distance && (
                <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {club.distance}
                </div>
              )}
            </div>
            
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h1 className="text-2xl font-bold text-white mb-2">{club.name}</h1>
              <div className="flex items-center text-white/90 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{club.address}, {club.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="text-white font-medium">{club.rating}</span>
                  <span className="text-white/80 ml-1">({club.totalReviews})</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-400">{club.priceRange}</div>
                  <div className="text-xs text-white/80">per hour</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-4 space-y-6 pb-32">
          {/* About Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">{club.description}</p>
          </section>

          {/* Available Games */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Available Games</h2>
            <div className="grid grid-cols-2 gap-3">
              {club.availableGames.map((game) => (
                <div 
                  key={game}
                  className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100"
                >
                  <Gamepad2 className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="font-medium text-blue-900">{game}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact & Hours</h2>
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">{club.phone}</div>
                  <div className="text-sm text-gray-500">Phone Number</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">
                    {club.operatingHours.open} - {club.operatingHours.close}
                  </div>
                  <div className="text-sm text-gray-500">Operating Hours</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                <div>
                  <div className="font-medium text-gray-900">{club.address}</div>
                  <div className="text-sm text-gray-500">{club.city}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Amenities</h2>
            <div className="grid grid-cols-1 gap-3">
              {club.amenities.map((amenity) => (
                <div 
                  key={amenity}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-gray-500 mr-3">
                    {getAmenityIcon(amenity)}
                  </div>
                  <span className="text-gray-700 font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Stats */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Quick Stats</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{club.availableGames.length}</div>
                <div className="text-sm text-gray-600">Games</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{club.rating}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{club.amenities.length}</div>
                <div className="text-sm text-gray-600">Amenities</div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 mb-16 p-2">
        <Button
          variant="primary"
          onClick={handleBookNow}
          className="w-full py-4 text-lg font-semibold"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
} 