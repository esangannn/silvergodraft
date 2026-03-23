import { geocodePostalCode, isValidSingaporePostalCode, calculateDistanceInKm } from './src/utils/geoUtils';
import { searchFacilities } from './src/services/facilityService';

async function runTests() {
  console.log('--- Testing GeoUtils ---');
  
  // Test Postal Code Validation
  console.log('Is 123456 valid?', isValidSingaporePostalCode('123456')); // Should be true
  console.log('Is 123 valid?', isValidSingaporePostalCode('123')); // Should be false
  
  // Test Geocoding (OneMap API)
  try {
    const postal = '238858'; // Ngee Ann City / Takashimaya
    console.log(`Geocoding ${postal}...`);
    const coords = await geocodePostalCode(postal);
    console.log(`Result for ${postal}:`, coords);
    
    if (coords) {
      // Create a dummy coordinate somewhere else (e.g., Changi Airport)
      const changi = { lat: 1.3644, lng: 103.9915 };
      const distance = calculateDistanceInKm(coords, changi);
      console.log(`Distance to Changi Airport: ${distance.toFixed(2)} km`);
    }
  } catch (error) {
    console.error('Geocoding failed:', error);
  }

  console.log('\n--- Testing Facility Service ---');
  
  // Test Firestore Queries
  // Note: This relies on Person A having seeded the data into your Firebase project!
  try {
    const mockUserLocation = { lat: 1.3644, lng: 103.9915 }; // Example user location
    
    console.log('Searching for clinics within 10km...');
    const results = await searchFacilities({
      category: 'Clinic', // Firestore queries are case-sensitive. It must match "Clinic" exactly.
      wheelchairOnly: false,
      userLocation: mockUserLocation,
      maxRadiusKm: 10
    });
    
    console.log(`Found ${results.length} facilities.`);
    console.log(results);
  } catch (error) {
    console.error('Firestore search failed:', error);
  }
}

runTests();