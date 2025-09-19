'use client';

import React, { ChangeEvent, FC, ReactNode } from 'react';

interface InputProps {
  label: string;
  icon?: ReactNode;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
}

const Input: FC<InputProps> = ({
  label,
  icon,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  error,
  maxLength,
  disabled = false,
}) => {
  return (
    <div className="relative w-full">
      <label className="text-gray-600 text-sm font-medium">{label}</label>
      <div
        className={`flex items-center border rounded-md px-3 py-2 mt-1 transition-colors duration-200
          ${
            error
              ? 'border-red-500'
              : 'border-gray-300 hover:border-blue-500 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      >
        <div className="text-gray-400 mr-2">{icon}</div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={`w-full p-2 outline-none bg-transparent
            ${
              disabled
                ? 'cursor-not-allowed text-gray-400'
                : 'text-black selection:bg-blue-300 selection:text-white'
            }
          `}
        />
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
