/**
 * facilityStore.ts
 * Central state store for facility search, radius control, and category filtering.
 *
 * Person C tasks implemented here:
 *   T02-02: Wire radius state to Firestore query — re-run on change without page reload.
 *   T02-03: Default radius of 3 km applied on initialisation.
 *   T03-04: "All Places" reset logic — clears category and accessibility filters.
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { searchFacilities, type Facility } from '../services/facilityService';
import {
  geocodePostalCode,
  geocodeQuery,
  isValidSingaporePostalCode,
  type Coordinates,
} from '../utils/geoUtils';

// T02-03: Default radius is 3 km on first load
const DEFAULT_RADIUS_KM = 3;

/** Selectable radius options shown in the UI (in km). */
export const RADIUS_OPTIONS = [1, 3, 5, 10] as const;

/**
 * Category values that map directly to the Firestore `type` field.
 * null means "All Places" (no category filter applied).
 */
export type FacilityCategory = 'Healthcare' | 'Community Centre' | 'Activity';

export const useFacilityStore = defineStore('facility', () => {
  // ─── State ────────────────────────────────────────────────────────────────

  /** Currently selected search radius in km. T02-03: initialised to 3. */
  const selectedRadius = ref<number>(DEFAULT_RADIUS_KM);

  /** Currently selected category filters. Empty array = show all categories. */
  const selectedCategory = ref<FacilityCategory[]>([]);

  /** Whether to restrict results to wheelchair-accessible venues only. */
  const wheelchairOnly = ref<boolean>(false);

  /** Geocoded coordinates of the user's searched location. */
  const userLocation = ref<Coordinates | null>(null);

  /** Facilities returned by the last successful search. */
  const facilities = ref<Facility[]>([]);

  /** True while a Firestore query is in flight. */
  const isLoading = ref<boolean>(false);

  /** Human-readable error message, or null when no error exists. */
  const error = ref<string | null>(null);

  // ─── Internal helper ──────────────────────────────────────────────────────

  /**
   * T02-02: Executes a Firestore search with the current filter state.
   * Called internally whenever radius, category, or location changes so the
   * map and list update without any page reload.
   */
  async function runSearch(): Promise<void> {
    if (!userLocation.value) return; // Nothing to search without a centre point.

    isLoading.value = true;
    error.value = null;

    try {
      facilities.value = await searchFacilities({
        categories: selectedCategory.value.length > 0 ? selectedCategory.value : undefined,
        wheelchairOnly: wheelchairOnly.value,
        maxRadiusKm: selectedRadius.value,
        userLocation: userLocation.value,
      });
    } catch (err) {
      error.value = 'Failed to load facilities. Please try again.';
      facilities.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * T02-02: Updates the search radius and immediately re-queries Firestore.
   * The map and list refresh without any page reload.
   *
   * @param km - New radius in kilometres (must be one of RADIUS_OPTIONS).
   */
  async function setRadius(km: number): Promise<void> {
    selectedRadius.value = km;
    await runSearch();
  }

  /**
   * Updates the active category filters and re-runs the query.
   * Pass an empty array to show all categories.
   *
   * @param categories - Array of UI category labels to filter by.
   */
  async function setCategory(categories: FacilityCategory[]): Promise<void> {
    selectedCategory.value = categories;
    await runSearch();
  }

  /**
   * T03-04: "All Places" reset logic.
   * Clears all category filters AND the wheelchair-only flag, then re-queries
   * so the results reflect the full unfiltered set within the current radius.
   */
  async function resetToAllPlaces(): Promise<void> {
    selectedCategory.value = [];
    wheelchairOnly.value = false;
    await runSearch();
  }

  /**
   * Updates the wheelchair-only filter and re-runs the query.
   *
   * @param value - True to restrict to accessible venues only.
   */
  async function setWheelchairOnly(value: boolean): Promise<void> {
    wheelchairOnly.value = value;
    await runSearch();
  }

  /**
   * Geocodes a Singapore postal code via OneMap, stores the resulting
   * coordinates, then immediately runs a search with the current filters.
   * T02-03 default radius (3 km) is already in place at this point.
   *
   * @param postalCode - 6-digit Singapore postal code string.
   */
  async function searchByPostalCode(postalCode: string): Promise<void> {
    if (!isValidSingaporePostalCode(postalCode)) {
      error.value = 'Please enter a valid 6-digit postal code.';
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const coords = await geocodePostalCode(postalCode);
      if (!coords) {
        error.value = 'Location not found for this postal code. Please try another.';
        return;
      }
      userLocation.value = coords;
      await runSearch();
    } catch {
      error.value = 'Failed to look up the postal code. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Sets user location from browser GPS and immediately runs a search.
   *
   * @param coords - Lat/lng coordinates from the Geolocation API.
   */
  async function setLocationAndSearch(coords: Coordinates): Promise<void> {
    userLocation.value = coords;
    await runSearch();
  }

  /**
   * Geocodes a free-form query (street address, landmark, building, etc.) via
   * OneMap and runs a search around the resulting coordinates.
   *
   * @param query - Free-form address, street, or place name.
   */
  async function searchByAddress(query: string): Promise<void> {
    const trimmed = query.trim();
    if (!trimmed) return;

    isLoading.value = true;
    error.value = null;

    try {
      const coords = await geocodeQuery(trimmed);
      if (!coords) {
        error.value = 'No matching location found. Try a different address.';
        return;
      }
      userLocation.value = coords;
      await runSearch();
    } catch {
      error.value = 'Failed to look up that address. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }

  // ─── Expose ───────────────────────────────────────────────────────────────

  return {
    // State
    selectedRadius,
    selectedCategory,
    wheelchairOnly,
    userLocation,
    facilities,
    isLoading,
    error,
    // Constants
    RADIUS_OPTIONS,
    DEFAULT_RADIUS_KM,
    // Actions
    setRadius,           // T02-02
    setCategory,
    resetToAllPlaces,    // T03-04
    setWheelchairOnly,
    searchByPostalCode,
    searchByAddress,
    setLocationAndSearch,
  };
});
