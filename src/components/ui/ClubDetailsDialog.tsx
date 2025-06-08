'use client';

import { X, Star, MapPin, Clock, Phone, Gamepad2, Wifi, Car, Coffee, Users } from 'lucide-react';
import Image from 'next/image';
import { Club } from '@/lib/types/club';
import Button from './Button';
import { cn } from '@/lib/utils';

interface ClubDetailsDialogProps {
  club: Club | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: (club: Club) => void;
}

export default function ClubDetailsDialog({ club, isOpen, onClose, onBookNow }: ClubDetailsDialogProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="relative">
          {/* Club Image */}
          <div className="relative h-64 w-full">
            <Image
              src={club.imageUrl}
              alt={club.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Distance Badge */}
            {club.distance && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {club.distance}
              </div>
            )}
            
            {/* Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white mb-2">{club.name}</h2>
              <div className="flex items-center text-white/90 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{club.address}, {club.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-16rem)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Rating & Reviews */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="text-lg font-semibold">{club.rating}</span>
                  <span className="text-gray-500 ml-2">({club.totalReviews} reviews)</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{club.priceRange}</div>
                  <div className="text-sm text-gray-500">per hour</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600 leading-relaxed">{club.description}</p>
              </div>

              {/* Available Games */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Games</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {club.availableGames.map((game) => (
                    <div 
                      key={game}
                      className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <Gamepad2 className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">{game}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {club.amenities.map((amenity) => (
                    <div 
                      key={amenity}
                      className="flex items-center p-2 bg-gray-50 rounded-lg"
                    >
                      {getAmenityIcon(amenity)}
                      <span className="ml-2 text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">{club.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">
                      {club.operatingHours.open} - {club.operatingHours.close}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-1" />
                    <span className="text-gray-700">{club.address}, {club.city}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Games Available:</span>
                    <span className="font-medium">{club.availableGames.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amenities:</span>
                    <span className="font-medium">{club.amenities.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-medium">{club.rating}/5</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={handleBookNow}
                  className="w-full py-3"
                >
                  Book Now
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => window.open(`tel:${club.phone}`, '_self')}
                  className="w-full py-3"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Club
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 