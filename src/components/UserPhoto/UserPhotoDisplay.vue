<template>
  <div class="user-photo-display">
    <img
      v-if="photoUrl && !imageError"
      :src="photoUrl"
      :alt="userName || 'User photo'"
      class="user-photo-display__image"
      loading="lazy"
      @error="handleImageError"
    />
    <div v-else class="user-photo-display__placeholder">
      {{ getInitials() }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  photoUrl?: string
  userName?: string
}

const props = defineProps<Props>()

const imageError = ref(false)

/**
 * Получение инициалов из имени пользователя для placeholder
 */
const getInitials = (): string => {
  if (!props.userName) {
    return '?'
  }

  const nameParts = props.userName.trim().split(/\s+/)

  if (nameParts.length >= 2) {
    // Если есть имя и фамилия, берем первые буквы
    const first = nameParts[0]?.charAt(0).toUpperCase() || '?'
    const last = nameParts[nameParts.length - 1]?.charAt(0).toUpperCase() || '?'
    return `${first}${last}`
  }

  // Если только одно слово, берем первые две буквы
  if (nameParts[0] && nameParts[0].length >= 2) {
    return nameParts[0].substring(0, 2).toUpperCase()
  }

  return nameParts[0]?.charAt(0).toUpperCase() || '?'
}

/**
 * Обработка ошибки загрузки изображения
 */
const handleImageError = (): void => {
  imageError.value = true
}
</script>

<style scoped lang="scss">
.user-photo-display {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    color: #fff;
    background: #667eea;
  }
}
</style>
