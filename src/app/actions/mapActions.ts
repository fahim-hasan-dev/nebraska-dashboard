"use server";

export interface AddressSuggestion {
  description: string;
  placeId: string;
}

export async function getAddressSuggestions(input: string): Promise<AddressSuggestion[]> {
  const apiKey = process.env.MAPAPI;
  if (!apiKey) {
    console.error("MAPAPI key is not configured in environment variables");
    return [{
      description: "Error: MAPAPI key is not configured in environment variables (.env.local)",
      placeId: "error"
    }];
  }

  if (!input || input.trim().length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&key=${apiKey}`
    );
    const data = await response.json();
    
    if (data.status === "OK" && data.predictions) {
      return data.predictions.map((p: any) => ({
        description: p.description,
        placeId: p.place_id,
      }));
    }
    
    if (data.status !== "OK") {
      console.error("Google Places API Autocomplete Error Status:", data.status);
      if (data.error_message) {
        console.error("Google Places API Autocomplete Error Message:", data.error_message);
      }
      return [{
        description: `Error: ${data.status} ${data.error_message ? `- ${data.error_message}` : ""}`,
        placeId: "error"
      }];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [{
      description: `Error: Failed to fetch suggestions - ${error instanceof Error ? error.message : String(error)}`,
      placeId: "error"
    }];
  }
}

export async function getPlaceCoordinates(placeId: string): Promise<{ lat: number; lng: number } | null> {
  if (placeId === "error") {
    return null;
  }
  const apiKey = process.env.MAPAPI;
  if (!apiKey) {
    console.error("MAPAPI key is not configured");
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${apiKey}`
    );
    const data = await response.json();
    if (data.status === "OK" && data.result?.geometry?.location) {
      const { lat, lng } = data.result.geometry.location;
      return { lat, lng };
    }
    if (data.status !== "OK") {
      console.error("Google Places Details API Error Status:", data.status);
      if (data.error_message) {
        console.error("Google Places Details API Error Message:", data.error_message);
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}
