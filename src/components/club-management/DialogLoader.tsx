import React from 'react'

interface DialogLoaderProps {
  message?: string;
}

function DialogLoader({ message = "Loading..." }: DialogLoaderProps) {
  return (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-b-2xl">
        <div className="flex flex-col items-center gap-2">
            <svg
                className="animate-spin h-8 w-8 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
            </svg>
            <p className="text-gray-700 text-sm">{message}</p>
        </div>
    </div>
  )
}

export default DialogLoader