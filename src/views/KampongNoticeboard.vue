<template>
  <section class="noticeboard-page">
    <NoticeboardHeader :area="selectedArea" @back="clearArea" />

    <div v-if="!selectedArea" class="initial-state">
      <p class="instruction">Select your constituency to view local notices and alerts.</p>

      <ConstituencySelector @search="setSearch" />
      <PopularAreas :selectedArea="selectedArea" @select-area="selectArea" />

      <EmptyState />
    </div>

    <div v-else class="selected-state">
      <div class="other-constituencies-wrap">
        <button class="other-constituencies" type="button" @click="clearArea">
          View Other Constituencies
        </button>
      </div>

      <CategoryTabs :selectedTab="selectedCategory" @update:selectedTab="setCategory" />
      <NoticeList :notices="filteredNotices" />
    </div>
  </section>
</template>

<script>
import NoticeboardHeader from '@/components/noticeboard/NoticeboardHeader.vue';
import ConstituencySelector from '@/components/noticeboard/ConstituencySelector.vue';
import PopularAreas from '@/components/noticeboard/PopularAreas.vue';
import CategoryTabs from '@/components/noticeboard/CategoryTabs.vue';
import NoticeList from '@/components/noticeboard/NoticeList.vue';
import EmptyState from '@/components/noticeboard/EmptyState.vue';

export default {
  name: 'KampongNoticeboard',
  components: {
    NoticeboardHeader,
    ConstituencySelector,
    PopularAreas,
    CategoryTabs,
    NoticeList,
    EmptyState,
  },
  data() {
    return {
      placeholder: 'e.g., Ang Mo Kio, Bedok',
      query: '',
      selectedArea: null,
      selectedCategory: 'All',
      popularAreas: ['Ang Mo Kio', 'Bedok', 'Tampines', 'Jurong'],
      notices: [
        { id: 1, title: 'Health Alert: Dengue Cluster', description: 'Please take precautions and clear stagnant water at Blk 102.', date: 'Posted Today', category: 'Alerts' },
        { id: 2, title: 'Upgrading Works', description: 'Lift B scheduled maintenance on 14 Nov, 9 AM to 5 PM.', date: 'Posted Yesterday', category: 'Upgrading' },
        { id: 3, title: 'Roadworks', description: 'Left lane closed at Ave 3 from 10 PM to 5 AM.', date: 'Posted 2 days ago', category: 'Roadworks' },
        { id: 4, title: 'Community Event: Senior Yoga', description: 'Free senior yoga session at community centre hall.', date: 'Posted 3 days ago', category: 'Events' }
      ]
    };
  },
  computed: {
    filteredNotices() {
      if (this.selectedCategory === 'All') {
        return this.notices;
      }
      return this.notices.filter((notice) => notice.category === this.selectedCategory);
    }
  },
  methods: {
    selectArea(area) {
      this.selectedArea = area;
      this.selectedCategory = 'All';
    },
    clearArea() {
      if (!this.selectedArea) {
        this.$router.push('/');
      } else {
        this.selectedArea = null;
        this.query = '';
        this.selectedCategory = 'All';
      }
    },
    setCategory(cat) {
      this.selectedCategory = cat;
    },
    setSearch(value) {
      this.query = value;
      this.selectedArea = value;
    }
  }
};
</script>

<style scoped>
.noticeboard-page {
  min-height: 100vh;
  padding: 1.1rem 1rem 2rem;
  background: #fff8f3;
  color: #1d2f52;
  max-width: 980px;
  margin: 0 auto;
}

.initial-state{
  margin-top: 0.15rem;
}

.selected-state{
  margin-top: 0.35rem;
}

.other-constituencies-wrap{
  display:flex;
  justify-content:center;
  margin: 0.1rem 0 0.85rem;
}

.other-constituencies {
  border: 1px solid #c7dbf7;
  background: #f8fbff;
  color: #23549f;
  border-radius: 999px;
  padding: 0.55rem 1.05rem;
  font-size: 0.95rem;
  font-weight: 800;
  width: fit-content;
  cursor: pointer;
}

.instruction {
  margin: 0 0 1rem;
  text-align: center;
  color: #3d526f;
  font-size: 1rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .noticeboard-page {
    padding-left: 0.9rem;
    padding-right: 0.9rem;
  }
}
</style>