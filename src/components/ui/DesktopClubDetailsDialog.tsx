'use client';

import { useEffect } from 'react';
import { X, Star, MapPin, Clock, Phone, Gamepad2, Wifi, Car, Coffee, Users } from 'lucide-react';
import Image from 'next/image';
import { Club } from '@/lib/types/club';
import Button from './Button';

interface DesktopClubDetailsDialogProps {
  club: Club | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: (club: Club) => void;
}

export default function DesktopClubDetailsDialog({ club, isOpen, onClose, onBookNow }: DesktopClubDetailsDialogProps) {
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
    if (lower.includes('wifi') || lower.includes('internet')) return <Wifi className="w-4 h-4" />;
    if (lower.includes('parking') || lower.includes('car')) return <Car className="w-4 h-4" />;
    if (lower.includes('snack') || lower.includes('coffee') || lower.includes('food') || lower.includes('beverages')) return <Coffee className="w-4 h-4" />;
    if (lower.includes('group') || lower.includes('tournament') || lower.includes('coaching')) return <Users className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative h-72">
          {/* Club Image */}
          <Image
            src={club.imageUrl}
            alt={club.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/70" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Distance Badge */}
          {club.distance && (
            <div className="absolute top-6 left-6 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium">
              {club.distance} away
            </div>
          )}
          
          {/* Title & Basic Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-3">{club.name}</h1>
                <div className="flex items-center text-white/90 text-lg mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{club.address}, {club.city}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-6 h-6 text-yellow-400 fill-current mr-2" />
                  <span className="text-white text-xl font-semibold">{club.rating}</span>
                  <span className="text-white/80 ml-2 text-lg">({club.totalReviews} reviews)</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-400">{club.priceRange}</div>
                <div className="text-white/80">per hour</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-18rem)] overflow-y-auto">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About Section */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Club</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">{club.description}</p>
                </section>

                {/* Available Games */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Games</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {club.availableGames.map((game) => (
                      <div 
                        key={game}
                        className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition"
                      >
                        <Gamepad2 className="w-6 h-6 text-blue-600 mr-3" />
                        <span className="font-semibold text-blue-900">{game}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Amenities */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities & Features</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {club.amenities.map((amenity) => (
                      <div 
                        key={amenity}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="text-gray-500 mr-3">
                          {getAmenityIcon(amenity)}
                        </div>
                        <span className="text-gray-700 font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
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
                </div>

                {/* Quick Stats */}
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Games Available</span>
                      <span className="text-2xl font-bold text-blue-600">{club.availableGames.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rating</span>
                      <span className="text-2xl font-bold text-green-600">{club.rating}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amenities</span>
                      <span className="text-2xl font-bold text-purple-600">{club.amenities.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Reviews</span>
                      <span className="text-2xl font-bold text-orange-600">{club.totalReviews}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div>
                  <Button
                    variant="primary"
                    onClick={handleBookNow}
                    className="w-full py-3 text-lg font-semibold"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 