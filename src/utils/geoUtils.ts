export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Validates if the given string is a valid Singapore postal code (6 digits).
 */
export function isValidSingaporePostalCode(postalCode: string): boolean {
  const regex = /^\d{6}$/;
  return regex.test(postalCode.trim());
}

/**
 * T01-03: Postal code validation + OneMap Geocoding (postal code -> lat/lng)
 * Uses Singapore's OneMap API for free, keyless geocoding.
 */
export async function geocodePostalCode(postalCode: string): Promise<Coordinates | null> {
  const cleanPostal = postalCode.trim();
  
  if (!isValidSingaporePostalCode(cleanPostal)) {
    throw new Error('Invalid Singapore postal code format. Must be 6 digits.');
  }

  try {
    const response = await fetch(
      `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${cleanPostal}&returnGeom=Y&getAddrDetails=N&pageNum=1`
    );
    
    if (!response.ok) {
      throw new Error(`OneMap API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data && data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: parseFloat(result.LATITUDE),
        lng: parseFloat(result.LONGITUDE)
      };
    }
    
    return null; // Could not find coordinates for this postal code
  } catch (error) {
    console.error('Error geocoding postal code:', error);
    throw error;
  }
}

/**
 * Calculates the Haversine distance between two coordinates in kilometers.
 */
export function calculateDistanceInKm(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLon = deg2rad(coord2.lng - coord1.lng); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}
