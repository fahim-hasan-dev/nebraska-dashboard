import { useState, useEffect, useRef, useCallback } from "react";
import { getAddressSuggestions, getPlaceCoordinates } from "@/app/actions/mapActions";
import toast from "react-hot-toast";

interface UseAddressAutocompleteOptions {
  initialValue?: string;
  initialCoordinates?: { lat: number; lng: number } | null;
}

/**
 * Custom hook to manage address search suggestions and location coordinates fetching.
 */
export function useAddressAutocomplete({
  initialValue = "",
  initialCoordinates = null,
}: UseAddressAutocompleteOptions = {}) {
  const [value, setValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(initialCoordinates);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set initial states when props update
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);


  // Click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle typing inside search input
  const handleChange = useCallback(async (val: string) => {
    setValue(val);
    setCoordinates(null); // Reset locked coordinates if user starts typing manually
    
    if (val.trim().length >= 3) {
      setIsSearching(true);
      const results = await getAddressSuggestions(val);
      setSuggestions(results);
      setShowSuggestions(true);
      setIsSearching(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // Handle selecting a suggestion
  const handleSelect = useCallback(async (suggestion: any) => {
    if (!suggestion || suggestion.placeId === "error") {
      setShowSuggestions(false);
      return;
    }

    setValue(suggestion.description);
    setShowSuggestions(false);
    
    const toastId = "locate-coords";
    toast.loading("Locating coordinates...", { id: toastId });
    
    try {
      const coords = await getPlaceCoordinates(suggestion.placeId);
      if (coords) {
        setCoordinates(coords);
        toast.success("Location locked!", { id: toastId });
      } else {
        toast.error("Failed to retrieve coordinates for this address", { id: toastId });
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      toast.error("An error occurred during location lookup", { id: toastId });
    }
  }, []);

  return {
    value,
    setValue,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    coordinates,
    setCoordinates,
    isSearching,
    handleChange,
    handleSelect,
    containerRef,
  };
}
