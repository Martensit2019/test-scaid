<template>
  <div class="users-page">
    <h1 class="users-page__title">Список пользователей</h1>
    <UserList @update-photo="handlePhotoUpdate" />
  </div>
</template>

<script setup lang="ts">
import UserList from '@/components/UserList/UserList.vue'
import { useUsers } from '@/composables/useUsers'
import { usePhotoUpload } from '@/composables/usePhotoUpload'

const { initializeUsers } = useUsers()
const { uploadError } = usePhotoUpload()

// Инициализация пользователей при монтировании
initializeUsers()

/**
 * Обработка обновления фото пользователя
 */
const handlePhotoUpdate = (): void => {
  // Логика обработки загрузки фото уже реализована в UserList
  // Здесь можно добавить дополнительную обработку, если нужно
  if (uploadError.value) {
    console.error('Ошибка загрузки фото:', uploadError.value)
  }
}
</script>

<style scoped lang="scss">
.users-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  &__title {
    margin: 0 0 2rem 0;
    font-size: 2rem;
    font-weight: 600;
    color: #333;
  }
}
</style>
