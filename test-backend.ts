import { createPinia, setActivePinia } from 'pinia';
import { geocodePostalCode, isValidSingaporePostalCode, calculateDistanceInKm } from './src/utils/geoUtils';
import { searchFacilities } from './src/services/facilityService';
import { useFacilityStore, RADIUS_OPTIONS } from './src/stores/facilityStore';

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
      category: 'Gym', // Firestore queries are case-sensitive. It must match "Clinic" exactly.
      wheelchairOnly: false,
      userLocation: mockUserLocation,
      maxRadiusKm: 15
    });
    
    console.log(`Found ${results.length} facilities.`);
    console.log(results);
  } catch (error) {
    console.error('Firestore search failed:', error);
  }
}

async function testFacilityStore() {
  console.log('\n--- Testing FacilityStore (Person C tasks) ---');

  // Bootstrap Pinia outside of a Vue app (works in Node test environments)
  setActivePinia(createPinia());
  const store = useFacilityStore();

  // T02-03: Default radius should be 3 km on initialisation
  console.log('\n[T02-03] Default radius check:');
  console.log('  selectedRadius =', store.selectedRadius, '(expected: 3)');
  console.assert(store.selectedRadius === 3, 'FAIL: default radius is not 3 km');
  if (store.selectedRadius === 3) console.log('  PASS');

  // T02-03: Verify RADIUS_OPTIONS contains the expected values
  console.log('\n[T02-03] RADIUS_OPTIONS check:');
  console.log('  RADIUS_OPTIONS =', RADIUS_OPTIONS, '(expected: [1, 3, 5, 10])');
  const expectedOptions = [1, 3, 5, 10];
  const optionsMatch = expectedOptions.every((v, i) => RADIUS_OPTIONS[i] === v);
  console.assert(optionsMatch, 'FAIL: RADIUS_OPTIONS mismatch');
  if (optionsMatch) console.log('  PASS');

  // T02-02: setRadius updates state and re-queries (requires a location first)
  console.log('\n[T02-02] setRadius — state update check:');
  // Seed a location so runSearch() doesn't short-circuit
  await store.searchByPostalCode('238858'); // Ngee Ann City; triggers geocode + search
  console.log('  Location after searchByPostalCode:', store.userLocation);

  const newRadius = 5;
  await store.setRadius(newRadius);
  console.log(`  selectedRadius after setRadius(${newRadius}) =`, store.selectedRadius, `(expected: ${newRadius})`);
  console.assert(store.selectedRadius === newRadius, `FAIL: selectedRadius not updated to ${newRadius}`);
  if (store.selectedRadius === newRadius) console.log('  PASS');

  console.log('  facilities count after radius change:', store.facilities.length);
  console.log('  isLoading after search:', store.isLoading, '(expected: false)');
  console.assert(!store.isLoading, 'FAIL: isLoading should be false after search completes');

  // T02-02: Switch to a smaller radius and verify result count can differ
  const smallRadius = 1;
  await store.setRadius(smallRadius);
  const countAt1km = store.facilities.length;
  await store.setRadius(10);
  const countAt10km = store.facilities.length;
  console.log(`  Facilities within 1 km: ${countAt1km}, within 10 km: ${countAt10km}`);
  console.log(`  Larger radius returns >= results: ${countAt10km >= countAt1km ? 'PASS' : 'FAIL'}`);

  // T03-04: resetToAllPlaces clears category + wheelchair filter then re-queries
  console.log('\n[T03-04] resetToAllPlaces check:');
  // First apply some filters
  store.selectedCategory = 'Healthcare' as any;
  store.wheelchairOnly = true as any;
  console.log('  Before reset — category:', store.selectedCategory, '| wheelchairOnly:', store.wheelchairOnly);

  await store.resetToAllPlaces();
  console.log('  After reset  — category:', store.selectedCategory, '(expected: null)');
  console.log('  After reset  — wheelchairOnly:', store.wheelchairOnly, '(expected: false)');
  console.assert(store.selectedCategory === null, 'FAIL: selectedCategory should be null after reset');
  console.assert(store.wheelchairOnly === false, 'FAIL: wheelchairOnly should be false after reset');
  if (store.selectedCategory === null && !store.wheelchairOnly) console.log('  PASS');
  console.log('  facilities after reset (all types):', store.facilities.length);
}

testFacilityStore();