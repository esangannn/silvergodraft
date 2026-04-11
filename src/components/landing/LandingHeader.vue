<template>
  <header class="landing-header">
    <button class="home-btn" type="button" aria-label="Home">
      <Home :size="22" stroke-width="2" />
    </button>

    <div class="actions">
      <button
        class="login-btn"
        type="button"
        @click="$router.push('/auth')"
      >
        Log In
      </button>
      <button class="icon-btn" type="button" aria-label="Language">
        <Globe :size="20" stroke-width="2" />
      </button>
      <button class="icon-btn icon-btn--filled" type="button" aria-label="Favourites">
        <Heart :size="20" stroke-width="2" />
      </button>
    </div>
  </header>
</template>

<script>
import { Home, Globe, Heart } from 'lucide-vue-next'

export default {
  name: 'LandingHeader',
  components: { Home, Globe, Heart },
}
</script>

<style scoped>
.landing-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 0.25rem 0.75rem;
}

.home-btn {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #dce8f0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #173b65;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.login-btn {
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid #d5dce8;
  background: #fff;
  color: #2e3b56;
  font-weight: 700;
  cursor: pointer;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e5ecf6;
  background: #fff;
  color: #2e3b56;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-btn--filled {
  background: #ff6b36;
  border-color: #ff6b36;
  color: #fff;
}
</style>