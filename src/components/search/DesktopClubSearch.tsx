'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Star, Clock, Gamepad2, X, SlidersHorizontal } from 'lucide-react';
import { Club, SearchFilters } from '@/lib/types/club';
import { StationType } from '@/lib/types/station';
import ClubCard from '@/components/ui/ClubCard';
import DesktopClubDetailsDialog from '@/components/search/dialog/DesktopClubDetailsDialog';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface DesktopClubSearchProps {
  clubs?: Club[];
  onClubSelect?: (club: Club) => void;
}

// Using the same static data as mobile for consistency
const mockClubs: Club[] = [
  {
    id: "1",
    name: "GameZone Arena",
    address: "123 MG Road, Bangalore",
    city: "Bangalore",
    rating: 4.5,
    totalReviews: 234,
    imageUrl: "/arena.jpg",
    distance: "0.8 km",
    availableGames: [StationType.PC, StationType.PS4, StationType.XBOX],
    priceRange: "₹80-200/hr",
    description: "Premium gaming arena with latest PCs and consoles. Perfect for esports tournaments and casual gaming.",
    phone: "+91 98765 43210",
    operatingHours: {
      open: "10:00 AM",
      close: "11:00 PM"
    },
    amenities: ["Air Conditioning", "High-speed WiFi", "Snacks", "Parking"]
  },
  {
    id: "2", 
    name: "Elite Gaming Hub",
    address: "456 Brigade Road, Bangalore",
    city: "Bangalore",
    rating: 4.3,
    totalReviews: 156,
    imageUrl: "/arena.jpg",
    distance: "1.2 km",
    availableGames: [StationType.PC, StationType.PS4, StationType.SNOOKER],
    priceRange: "₹100-250/hr",
    description: "Luxury gaming experience with premium setups and professional snooker tables.",
    phone: "+91 98765 43211",
    operatingHours: {
      open: "11:00 AM",
      close: "12:00 AM"
    },
    amenities: ["Premium Chairs", "Professional Tables", "Beverages", "Lounge Area"]
  },
  {
    id: "3",
    name: "Cyber Cafe Plus",
    address: "789 Commercial Street, Bangalore",
    city: "Bangalore", 
    rating: 4.1,
    totalReviews: 89,
    imageUrl: "/arena.jpg",
    distance: "2.1 km",
    availableGames: [StationType.PC, StationType.PS4, StationType.SNOOKER],
    priceRange: "₹60-150/hr",
    description: "Affordable gaming with modern PCs and pool tables. Great for students and casual gamers.",
    phone: "+91 98765 43212",
    operatingHours: {
      open: "9:00 AM",
      close: "10:00 PM"
    },
    amenities: ["Budget Friendly", "Student Discounts", "Group Packages", "Free Water"]
  },
  {
    id: "4",
    name: "Sports & Gaming Complex",
    address: "321 Koramangala, Bangalore",
    city: "Bangalore",
    rating: 4.7,
    totalReviews: 312,
    imageUrl: "/arena.jpg",
    distance: "1.8 km",
    availableGames: [StationType.SNOOKER, StationType.POOL, StationType.PS4, StationType.XBOX],
    priceRange: "₹120-300/hr",
    description: "Complete entertainment destination with sports and gaming facilities under one roof.",
    phone: "+91 98765 43213",
    operatingHours: {
      open: "10:00 AM",
      close: "11:30 PM"
    },
    amenities: ["Restaurant", "Spa Services", "Tournament Hall", "VIP Rooms"]
  },
  {
    id: "5",
    name: "Pro Gaming Center",
    address: "567 Indiranagar, Bangalore",
    city: "Bangalore",
    rating: 4.4,
    totalReviews: 178,
    imageUrl: "/arena.jpg",
    distance: "2.5 km",
    availableGames: [StationType.PC, StationType.XBOX],
    priceRange: "₹90-180/hr",
    description: "Professional esports training facility with tournament-grade equipment and coaching.",
    phone: "+91 98765 43214",
    operatingHours: {
      open: "2:00 PM",
      close: "11:00 PM"
    },
    amenities: ["Tournament Setup", "Coaching", "Practice Rooms", "Streaming Setup"]
  },
  {
    id: "6",
    name: "Retro Gaming Lounge",
    address: "890 Jayanagar, Bangalore",
    city: "Bangalore",
    rating: 4.0,
    totalReviews: 92,
    imageUrl: "/arena.jpg",
    distance: "3.2 km",
    availableGames: [StationType.PS4, StationType.SNOOKER, StationType.POOL],
    priceRange: "₹70-160/hr",
    description: "Nostalgic gaming experience with classic consoles and traditional games in a cozy environment.",
    phone: "+91 98765 43215",
    operatingHours: {
      open: "12:00 PM",
      close: "10:00 PM"
    },
    amenities: ["Retro Consoles", "Comfortable Seating", "Snack Bar", "Group Rooms"]
  }
];

export default function DesktopClubSearch({ clubs = mockClubs, onClubSelect }: DesktopClubSearchProps) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    gameType: undefined,
    city: undefined
  });
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'price'>('rating');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter and sort clubs
  const filteredAndSortedClubs = useMemo(() => {
    let filtered = clubs.filter(club => {
      const matchesQuery = searchFilters.query === '' || 
        club.name.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        club.city.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        club.description.toLowerCase().includes(searchFilters.query.toLowerCase());
      
      const matchesGameType = !searchFilters.gameType || 
        club.availableGames.includes(searchFilters.gameType);
      
      const matchesCity = !searchFilters.city || 
        club.city.toLowerCase() === searchFilters.city.toLowerCase();
      
      return matchesQuery && matchesGameType && matchesCity;
    });

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance?.replace(' km', '') || '0') - parseFloat(b.distance?.replace(' km', '') || '0');
        case 'price':
          const aPrice = parseInt(a.priceRange.split('-')[0].replace('₹', ''));
          const bPrice = parseInt(b.priceRange.split('-')[0].replace('₹', ''));
          return aPrice - bPrice;
        default:
          return 0;
      }
    });

    return filtered;
  }, [clubs, searchFilters, sortBy]);

  const handleSearchChange = (value: string) => {
    setSearchFilters(prev => ({ ...prev, query: value }));
  };

  const handleGameTypeFilter = (gameType?: StationType) => {
    setSearchFilters(prev => ({ ...prev, gameType }));
  };

  const handleCityFilter = (city?: string) => {
    setSearchFilters(prev => ({ ...prev, city }));
  };

  const clearFilters = () => {
    setSearchFilters({ query: '', gameType: undefined, city: undefined });
  };

  const handleClubClick = (club: Club) => {
    onClubSelect?.(club);
    console.log('Club selected:', club.name);
  };

  const handleViewDetails = (club: Club) => {
    setSelectedClub(club);
    setIsDialogOpen(true);
  };

  const handleBookNow = (club: Club) => {
    console.log('Book now for:', club.name);
    // TODO: Navigate to booking page for this club
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedClub(null);
  };

  const handleDialogBookNow = (club: Club) => {
    handleBookNow(club);
    handleCloseDialog();
  };

  const uniqueCities = Array.from(new Set(clubs.map(club => club.city)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Gaming Clubs</h1>
          <p className="text-gray-600">Discover the best gaming venues in your area</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md z-40">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-40" />
              <input
                type="text"
                placeholder="Search clubs, games, or location..."
                value={searchFilters.query}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent relative z-40"
              />
            </div>


          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-4 flex-wrap relative">
            {/* Game Type Filter */}
            <div className="flex items-center gap-2 relative z-30">
              <span className="text-sm font-medium text-gray-700">Game:</span>
              <select
                value={searchFilters.gameType || ''}
                onChange={(e) => handleGameTypeFilter(e.target.value as StationType || undefined)}
                className="border border-gray-300 text-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-30"
              >
                <option value="">All Games</option>
                {(['PC', 'PS4', 'XBOX', 'SNOOKER', 'POOL'] as StationType[]).map((gameType) => (
                  <option key={gameType} value={gameType}>{gameType}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="flex items-center gap-2 relative z-20">
              <span className="text-sm font-medium text-gray-700">City:</span>
              <select
                value={searchFilters.city || ''}
                onChange={(e) => handleCityFilter(e.target.value || undefined)}
                className="border border-gray-300 text-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-20"
              >
                <option value="">All Cities</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2 relative z-10">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'distance' | 'price')}
                className="border border-gray-300 text-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10"
              >
                <option value="rating">Rating</option>
                <option value="distance">Distance</option>
                <option value="price">Price</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchFilters.gameType || searchFilters.city || searchFilters.query) && (
              <Button
                variant="secondary"
                onClick={clearFilters}
                className="text-sm"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            {filteredAndSortedClubs.length} club{filteredAndSortedClubs.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Results */}
        {filteredAndSortedClubs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl mb-2">No clubs found</div>
            <div className="text-gray-500">Try adjusting your search criteria or filters</div>
          </div>
        ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {filteredAndSortedClubs.map((club) => (
               <ClubCard
                 key={club.id}
                 club={club}
                 onClick={() => handleClubClick(club)}
                 onViewDetails={() => handleViewDetails(club)}
                 onBookNow={() => handleBookNow(club)}
               />
             ))}
          </div>
        )}
      </div>

      {/* Club Details Dialog */}
      <DesktopClubDetailsDialog
        club={selectedClub}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onBookNow={handleDialogBookNow}
      />
    </div>
  );
} 