'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Club, SearchFilters } from '@/lib/types/club';
import { StationType } from '@/lib/types/station';
import ClubCard from '@/components/ui/ClubCard';
import MobileClubDetailsDialog from '@/components/ui/MobileClubDetailsDialog';
import { cn } from '@/lib/utils';

interface MobileClubSearchProps {
  clubs?: Club[];
  onClubSelect?: (club: Club) => void;
}

// Static club data - later will come from API
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
    availableGames: ["PC", "PS4", "XBOX"],
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
    availableGames: ["PC", "PS4", "SNOOKER"],
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
    availableGames: ["PC", "POOL"],
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
    availableGames: ["SNOOKER", "POOL", "PS4", "XBOX"],
    priceRange: "₹120-300/hr",
    description: "Complete entertainment destination with sports and gaming facilities under one roof.",
    phone: "+91 98765 43213",
    operatingHours: {
      open: "10:00 AM",
      close: "11:30 PM"
    },
    amenities: ["Restaurant", "Sports Bar", "Tournament Hall", "VIP Rooms"]
  }
];

export default function MobileClubSearch({ clubs = mockClubs, onClubSelect }: MobileClubSearchProps) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    gameType: undefined
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter clubs based on search criteria
  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      const matchesQuery = searchFilters.query === '' || 
        club.name.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        club.city.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        club.description.toLowerCase().includes(searchFilters.query.toLowerCase());
      
      const matchesGameType = !searchFilters.gameType || 
        club.availableGames.includes(searchFilters.gameType);
      
      return matchesQuery && matchesGameType;
    });
  }, [clubs, searchFilters]);

  const handleSearchChange = (value: string) => {
    setSearchFilters(prev => ({ ...prev, query: value }));
  };

  const handleGameTypeFilter = (gameType?: StationType) => {
    setSearchFilters(prev => ({ ...prev, gameType }));
  };

  const clearFilters = () => {
    setSearchFilters({ query: '', gameType: undefined });
    setShowFilters(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clubs, games, or location..."
              value={searchFilters.query}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded",
                showFilters ? "text-blue-600" : "text-gray-400"
              )}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Filter by Game</span>
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 flex items-center"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleGameTypeFilter(undefined)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs transition",
                    !searchFilters.gameType 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  All Games
                </button>
                {(['PC', 'PS4', 'XBOX', 'SNOOKER', 'POOL'] as StationType[]).map((gameType) => (
                  <button
                    key={gameType}
                    onClick={() => handleGameTypeFilter(gameType)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs transition",
                      searchFilters.gameType === gameType
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {gameType}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-600 mt-3">
            {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        {filteredClubs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No clubs found</div>
            <div className="text-gray-500 text-sm">Try adjusting your search or filters</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredClubs.map((club) => (
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
      <MobileClubDetailsDialog
        club={selectedClub}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onBookNow={handleDialogBookNow}
      />
    </div>
  );
} 