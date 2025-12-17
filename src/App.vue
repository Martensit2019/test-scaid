<script setup lang="ts">
import UsersPage from '@/views/UsersPage.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import ToastContainer from '@/components/ToastContainer.vue'
</script>

<template>
  <div id="app">
    <ErrorBoundary>
      <UsersPage />
    </ErrorBoundary>
    <ToastContainer />
  </div>
</template>

<style lang="scss">
#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
