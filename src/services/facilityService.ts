// T03-03: Firestore query utility filtering by category + radius + wheelchair simultaneously
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../firebase.js';
import { Coordinates, calculateDistanceInKm } from '../utils/geoUtils';

export interface Facility {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  wheelchair: boolean;
  hours?: string;
  phone?: string;
  about?: string;
  distance?: number; // Calculated distance from query center
}

export interface SearchFilters {
  category?: string;       // Facility type (e.g., 'clinic', 'gym')
  wheelchairOnly?: boolean; // Filter by wheelchair accessible
  maxRadiusKm?: number;    // Search radius in km
  userLocation?: Coordinates; // Center point of the search
}

/**
 * Fetches and filters facilities based on category, wheelchair accessibility, and radius.
 * Since Firestore doesn't natively support querying by lat/lng radius without 
 * specialized hashing libraries, we query by indexed fields (type, wheelchair) 
 * first, and perform the distance radius filtering client-side.
 */
export async function searchFacilities(filters: SearchFilters): Promise<Facility[]> {
  const facilitiesRef = collection(db, 'facilities');
  const queryConstraints = [];

  // Filter by category if provided
  if (filters.category) {
    queryConstraints.push(where('type', '==', filters.category));
  }

  // Filter by wheelchair accessibility if strictly true
  if (filters.wheelchairOnly) {
    queryConstraints.push(where('wheelchair', '==', true));
  }

  // Combine query parameters
  const q = query(facilitiesRef, ...queryConstraints);

  try {
    const querySnapshot = await getDocs(q);
    const results: Facility[] = [];

    querySnapshot.forEach((doc: DocumentData) => {
      const data = doc.data();
      const facility: Facility = {
        id: doc.id,
        name: data.name,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        type: data.type,
        wheelchair: data.wheelchair,
        hours: data.hours,
        phone: data.phone,
        about: data.about
      };

      // Perform client-side radius filtering if coordinates & radius provided
      if (filters.userLocation && filters.maxRadiusKm !== undefined) {
        if (facility.lat && facility.lng) {
          const distance = calculateDistanceInKm(
            filters.userLocation,
            { lat: facility.lat, lng: facility.lng }
          );

          // Only keep within maxRadiusKm
          if (distance <= filters.maxRadiusKm) {
            facility.distance = parseFloat(distance.toFixed(2));
            results.push(facility);
          }
        }
      } else {
        results.push(facility);
      }
    });

    // Optionally sort by distance if location provided
    if (filters.userLocation) {
      results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return results;

  } catch (error) {
    console.error('Error fetching facilities: ', error);
    throw error;
  }
}
