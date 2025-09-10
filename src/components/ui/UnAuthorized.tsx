import { Info, MessageCircleWarning, ShieldBan, TriangleAlert } from 'lucide-react';
import React from 'react'

function UnAuthorized() {
  return (
    <div className='flex flex-col bg-white h-[90vh] w-full items-center justify-center-safe'>
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-3">
            <span className="text-red-500 text-2xl">!</span>
        </div>
        <p className="text-red-600 text-lg font-medium">UnAuthorized</p>
        <p className="text-gray-600 text-sm font-medium">Please login to continue</p>
    </div>
  )
}

export default UnAuthorized;