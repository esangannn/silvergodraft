import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase.js';
import { calculateDistanceInKm, type Coordinates } from '../utils/geoUtils';

export type NoticeCategory = 'Alerts' | 'Upgrading' | 'Roadworks' | 'Events';
export type NoticeSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Notice {
  id: string;
  title: string;
  description: string;
  category: NoticeCategory;
  severity: NoticeSeverity;
  postalCode: string;
  constituency: string;
  lat?: number;
  lng?: number;
  distanceKm?: number;
  createdAt: Date;
  date: string; // Human label, e.g. "Posted Today"
}

interface NoticeDoc {
  title: string;
  description: string;
  category: NoticeCategory;
  severity: NoticeSeverity;
  postalCode: string;
  constituency: string;
  lat?: number;
  lng?: number;
  createdAt: Timestamp;
}

function relativeDateLabel(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Posted Today';
  if (days === 1) return 'Posted Yesterday';
  if (days < 7) return `Posted ${days} days ago`;
  if (days < 14) return 'Posted 1 week ago';
  return `Posted ${Math.floor(days / 7)} weeks ago`;
}

function mapDoc(id: string, data: NoticeDoc): Notice {
  const createdAt = data.createdAt.toDate();
  return {
    id,
    title: data.title,
    description: data.description,
    category: data.category,
    severity: data.severity,
    postalCode: data.postalCode,
    constituency: data.constituency,
    lat: data.lat,
    lng: data.lng,
    createdAt,
    date: relativeDateLabel(createdAt),
  };
}

function sortByNewest(a: Notice, b: Notice): number {
  return b.createdAt.getTime() - a.createdAt.getTime();
}

export async function fetchNoticesByConstituency(constituency: string): Promise<Notice[]> {
  const ref = collection(db, 'notices');
  const q = query(ref, where('constituency', '==', constituency));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => mapDoc(d.id, d.data() as NoticeDoc))
    .sort(sortByNewest);
}

export async function fetchNoticesNearLocation(
  center: Coordinates,
  radiusKm: number
): Promise<Notice[]> {
  const ref = collection(db, 'notices');
  const snap = await getDocs(ref);
  const withDistance: Notice[] = [];
  snap.docs.forEach((d) => {
    const notice = mapDoc(d.id, d.data() as NoticeDoc);
    if (notice.lat == null || notice.lng == null) return;
    const distance = calculateDistanceInKm(center, { lat: notice.lat, lng: notice.lng });
    if (distance <= radiusKm) {
      notice.distanceKm = parseFloat(distance.toFixed(2));
      withDistance.push(notice);
    }
  });
  return withDistance.sort(sortByNewest);
}
