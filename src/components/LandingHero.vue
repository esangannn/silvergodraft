<script setup lang="ts">
import { Home, Stethoscope, Users, Activity, ChevronRight } from 'lucide-vue-next';
</script>

<template>
  <section class="hero-section">
    <!-- Kampong Noticeboard Banner -->
    <div class="notice-section">
      <div class="notice-card">
        <h2>Kampong Noticeboard</h2>
        <p>View local alerts and events</p>
        <ChevronRight class="nav-arrow" :size="20" stroke-width="2" />
      </div>
    </div>

    <!-- Category Icon Cards -->
    <section class="category-icons">
      <div class="icon-card all-places">
        <Home class="icon" :size="32" stroke-width="2" />
        <p>All Places</p>
      </div>
      <div class="icon-card healthcare">
        <Stethoscope class="icon" :size="32" stroke-width="2" />
        <p>Healthcare</p>
      </div>
      <div class="icon-card community">
        <Users class="icon" :size="32" stroke-width="2" />
        <p>Community Centres</p>
      </div>
      <div class="icon-card activities">
        <Activity class="icon" :size="32" stroke-width="2" />
        <p>Activities</p>
      </div>
    </section>

    <!-- Radius Filter Chips -->
    <section class="radius-container">
      <div class="radius-filters">
        <button class="radius-btn">1 km Radius</button>
        <button class="radius-btn active">3 km Radius</button>
        <button class="radius-btn">5 km Radius</button>
        <button class="radius-btn">10 km Radius</button>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.hero-section {
  padding: 1rem;
  background: #fff8f3;
}

/* Noticeboard Banner */
.notice-section {
  margin-bottom: 1.5rem;
}
.notice-card {
  position: relative;
  background: #fff;
  border: 1px solid #e5ecf6;
  border-radius: 12px;
  padding: 1rem 1.2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(34, 69, 116, 0.08);
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.notice-card:hover {
  box-shadow: 0 6px 16px rgba(34, 69, 116, 0.12);
}
.notice-card h2 {
  margin: 0.2rem 0 0.25rem;
  font-size: 1.3rem;
  color: #1e2d42;
  font-weight: 700;
}
.notice-card p {
  margin: 0;
  color: #707b8e;
  font-size: 0.9rem;
}
.nav-arrow {
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  color: #2a3f5a;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
}

.nav-arrow:hover {
  color: #ff6b36;
  transform: translateY(-50%) translateX(2px);
}

/* Category Icon Cards */
.category-icons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.icon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.6rem;
  padding: 1.2rem 0.8rem;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.icon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.icon-card.all-places {
  background: #e8f0f8;
}
.icon-card.healthcare {
  background: #fce4d6;
}
.icon-card.community {
  background: #d6e8f8;
}
.icon-card.activities {
  background: #d6f3e0;
}
.icon-card .icon {
  font-size: 2.4rem;
  line-height: 1;
  width: 2.4rem;
  height: 2.4rem;
  color: #1e3247;
}
.icon-card p {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2a3f5a;
  line-height: 1.2;
}

/* Radius Filter Container */
.radius-container {
  margin-bottom: 1.5rem;
}
.radius-filters {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: center;
}
.radius-btn {
  border: none;
  background: #ffd8cc;
  color: #be4f33;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}
.radius-btn:hover {
  background: #ffcbb3;
}
.radius-btn.active {
  background: #ff6b36;
  color: #fff;
}
.radius-btn.active:hover {
  background: #ff5620;
}

@media (max-width: 640px) {
  .category-icons {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
