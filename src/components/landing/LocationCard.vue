<template>
  <article class="location-card" @click="$emit('select', location.id)">
    <div class="location-card__iconWrap" :style="{ background: iconColor }" aria-hidden="true">
      <BaseIcon :icon="locationIcon" :size="20" stroke-width="2" />
    </div>

    <div class="location-card__content">
      <div class="location-card__topRow">
        <h3 class="location-card__name">{{ location.name }}</h3>

        <button class="fav-btn" type="button" aria-label="Favourite" @click.stop="handleFavourite">
          <BaseIcon :icon="Heart" :size="18" stroke-width="2" :class="{ 'fav-btn--active': isFaved }" />
        </button>
      </div>

      <div class="location-card__category">{{ location.type }}</div>
      <div class="location-card__address">{{ location.address }}</div>

      <div class="location-card__tagRow">
        <span class="distance-tag">{{ formattedDistance }}</span>
        <span v-if="location.wheelchair" class="a11y-pill">Wheelchair Access</span>
      </div>

      <button class="details-btn" type="button" @click.stop="$router.push('/location/' + location.id)">
        View Details →
      </button>
    </div>
  </article>
</template>

<script>
import BaseIcon from '@/components/shared/BaseIcon.vue';
import { Heart, Home, Stethoscope, Users, Activity } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStore';
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { app } from '@/firebase';

const ICON_MAP = {
  Clinic:          { icon: Stethoscope, color: '#ff7f50' },
  Pharmacy:        { icon: Stethoscope, color: '#ff7f50' },
  Eldercare:       { icon: Stethoscope, color: '#ff7f50' },
  'Community Club':{ icon: Users,       color: '#64b5f6' },
  Gym:             { icon: Activity,    color: '#34d399' },
  Park:            { icon: Activity,    color: '#34d399' },
};

const db = getFirestore(app);

export default {
  name: 'LocationCard',
  components: { BaseIcon },
  emits: ['select'],
  props: {
    location: { type: Object, required: true },
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return { Heart, isFaved: false };
  },
  async mounted() {
    if (!this.authStore.user) return;
    const ref = doc(db, 'users', this.authStore.user.uid, 'favourites', this.location.id);
    const snap = await getDoc(ref);
    this.isFaved = snap.exists();
  },
  computed: {
    locationIcon() {
      return (ICON_MAP[this.location.type] || { icon: Home }).icon;
    },
    iconColor() {
      return (ICON_MAP[this.location.type] || { color: '#94a3b8' }).color;
    },
    formattedDistance() {
      if (this.location.distance == null) return '';
      return `${this.location.distance} km away`;
    },
  },
  methods: {
    async handleFavourite() {
      if (!this.authStore.user) {
        this.$router.push('/auth');
        return;
      }
      const ref = doc(db, 'users', this.authStore.user.uid, 'favourites', this.location.id);
      if (this.isFaved) {
        await deleteDoc(ref);
        this.isFaved = false;
      } else {
        await setDoc(ref, {
          id: this.location.id,
          name: this.location.name,
          address: this.location.address,
          type: this.location.type,
          lat: this.location.lat,
          lng: this.location.lng,
          wheelchair: this.location.wheelchair ?? false,
          hours: this.location.hours ?? '',
          phone: this.location.phone ?? '',
          about: this.location.about ?? '',
          iconColor: this.location.iconColor ?? '',
        });
        this.isFaved = true;
      }
    },
  },
};
</script>

<style scoped>
.location-card {
  width: 100%;
  display: flex;
  gap: 0.95rem;
  align-items: flex-start;
  background: #fff;
  border: 1px solid #dce8f0;
  border-radius: 14px;
  padding: 0.9rem 0.95rem;
  cursor: pointer;
}

.location-card:hover {
  border-color: #ff6b36;
}

.location-card__iconWrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #fff;
  flex: 0 0 auto;
}

.location-card__content {
  flex: 1 1 auto;
  min-width: 0;
}

.location-card__topRow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.location-card__name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 900;
  color: #0f172a;
}

.fav-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.05rem;
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.fav-btn--active {
  color: #ef4444;
  fill: #ef4444;
}

.fav-btn--active :deep(svg) {
  fill: #ef4444;
}


.location-card__category {
  margin-top: 0.25rem;
  font-size: 0.78rem;
  font-weight: 800;
  color: #64748b;
}

.location-card__address {
  margin-top: 0.25rem;
  font-size: 0.78rem;
  color: #475569;
  line-height: 1.25;
}

.location-card__tagRow {
  margin-top: 0.55rem;
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
  align-items: center;
}

.distance-tag {
  font-size: 0.78rem;
  font-weight: 800;
  color: #334155;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.15);
}

.a11y-pill {
  font-size: 0.78rem;
  font-weight: 900;
  color: #047857;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.18);
}

.details-btn {
  margin-top: 0.6rem;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.78rem;
  font-weight: 800;
  color: #2563eb;
  cursor: pointer;
  text-decoration: underline;
}
</style>
