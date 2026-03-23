<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: #fff8f3;
}
</style>

<style scoped>
#app {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #1e3247;
  background: #fefcf8;
  min-height: 100vh;
}
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid #e6ebf4;
  position: sticky;
  top: 0;
  z-index: 10;
}
.brand {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.brand-name {
  font-weight: 800;
  color: #ff5722;
  font-size: 1.6rem;
}
.brand-name .go {
  color: #34aa46;
}
small {
  font-size: 0.8rem;
  color: #6b7c93;
  font-weight: 600;
}
.top-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.top-actions button {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
}
.btn-outline {
  border: 1px solid #d5dce8;
  color: #2e3b56;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  background: #fff;
  font-weight: 600;
  font-size: 0.9rem;
}
.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e5ecf6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 0;
}

.btn-icon svg {
  width: 20px;
  height: 20px;
  color: #2e3b56;
  stroke: #2e3b56;
}

.btn-heart {
  background: #ff6b36;
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.btn-heart svg {
  width: 20px;
  height: 20px;
  color: #fff;
  fill: #fff;
}
.content {
  max-width: 100%;
  padding: 0 0 1.2rem;
}
</style>
