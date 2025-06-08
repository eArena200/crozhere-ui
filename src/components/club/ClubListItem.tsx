'use client';

import React from 'react';

interface ClubListItemProps {
    isSelected?: boolean
    club: {
        clubId: number;
        name: string;
    };
    isMobile?: boolean;
}

function ClubListItem({
     isSelected = false, 
     club, 
     isMobile = false 
    }: ClubListItemProps) {
  return (
      <div className={`flex flex-col p-4 border-2 rounded-sm 
        ${isSelected ? `bg-blue-200 border-blue-600 text-black` : 
        `bg-white border-gray-400 hover:bg-blue-200 hover:border-blue-600 text-gray-800`}`}>
        <div>
            {club.name}
        </div>
      </div>
  );
}

export default ClubListItem;
