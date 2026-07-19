"use client";

import React, { useEffect, useRef } from "react";
import { Loader2, X } from "lucide-react";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete";

interface AddressInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange: (coords: { lat: number; lng: number } | null) => void;
  initialCoordinates?: { lat: number; lng: number } | null;
  required?: boolean;
}

export default function AddressInput({
  label = "Venue *",
  placeholder = "Search address...",
  value,
  onChange,
  onCoordinatesChange,
  initialCoordinates = null,
  required = false,
}: AddressInputProps) {
  const {
    value: venue,
    setValue: setVenue,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    coordinates,
    isSearching,
    handleChange,
    handleSelect,
    containerRef,
  } = useAddressAutocomplete({
    initialValue: value,
    initialCoordinates,
  });

  // Sync internal venue state when external value changes
  useEffect(() => {
    if (value !== venue) {
      setVenue(value);
    }
  }, [value, venue, setVenue]);

  // Bubble up venue changes
  const handleVenueChange = (val: string) => {
    handleChange(val);
    onChange(val);
    if (val === "") {
      onCoordinatesChange(null);
    }
  };

  const onCoordinatesChangeRef = useRef(onCoordinatesChange);
  useEffect(() => {
    onCoordinatesChangeRef.current = onCoordinatesChange;
  }, [onCoordinatesChange]);

  // Bubble up coordinate changes when suggestions are selected
  useEffect(() => {
    onCoordinatesChangeRef.current(coordinates);
  }, [coordinates]);

  // Wrap select to notify parent component's state
  const handleSuggestionSelect = (suggestion: { description: string; placeId: string }) => {
    handleSelect(suggestion);
    onChange(suggestion.description);
  };

  return (
    <div className="flex flex-col gap-2 relative w-full" ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        <input
          type="text"
          value={venue}
          onChange={(e) => handleVenueChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder={placeholder}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-28"
          required={required}
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
          {/* Clear / Cross button */}
          {venue && (
            <button
              type="button"
              onClick={() => handleVenueChange("")}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-200"
              title="Clear location"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Locked geocode badge */}
          {coordinates && (
            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-1 rounded border border-green-200 pointer-events-none select-none">
              ✓ Geocoded
            </span>
          )}
        </div>
      </div>

      {/* Suggestions dropdown popover overlay */}
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-[68px] z-50 bg-white border border-gray-200 rounded-xl shadow-xl max-h-52 overflow-y-auto divide-y divide-gray-100 animate-in fade-in slide-in-from-top-1 duration-150">
          {isSearching ? (
            <div className="px-4 py-3 text-xs text-gray-400 font-medium flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
              Searching addresses...
            </div>
          ) : suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestionSelect(s)}
              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs font-semibold text-gray-700 truncate block transition-colors"
            >
              {s.description}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
