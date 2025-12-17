<template>
  <div class="user-card">
    <div class="user-card__photo-wrapper">
      <div class="user-card__photo">
        <div v-if="user.photoUrl" class="user-card__image-wrapper">
          <img
            :src="user.photoUrl"
            :alt="getFullName(user)"
            class="user-card__image"
            loading="lazy"
            @error="handleImageError"
          />
        </div>
        <div v-else class="user-card__placeholder">
          {{ getInitials(user) }}
        </div>
      </div>
      <button
        v-if="user.photoUrl"
        class="user-card__delete-btn"
        type="button"
        @click.stop="handlePhotoDelete"
        aria-label="Удалить фото"
      >
        <span class="user-card__delete-icon">✕</span>
        <span class="user-card__delete-tooltip">Удалить фото</span>
      </button>
    </div>

    <div class="user-card__info">
      <h3 class="user-card__name">{{ getFullName(user) }}</h3>
      <p class="user-card__age">{{ formatUserAge(user.age) }}</p>
      <p class="user-card__email">{{ user.email }}</p>
    </div>

    <button class="user-card__upload-btn" @click="handlePhotoUpload" type="button">
      {{ user.photoUrl ? 'Обновить фото' : 'Загрузить фото' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
import { getFullName, formatUserAge } from '@/utils/userHelpers'

interface Props {
  user: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-photo': [userId: string | number]
  'delete-photo': [userId: string | number]
}>()

/**
 * Получение инициалов пользователя для placeholder
 */
const getInitials = (user: User): string => {
  const first = user.firstName.charAt(0).toUpperCase()
  const last = user.lastName.charAt(0).toUpperCase()
  return `${first}${last}`
}

/**
 * Обработка ошибки загрузки изображения
 */
const handleImageError = (event: Event): void => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

/**
 * Обработка клика на кнопку загрузки фото
 */
const handlePhotoUpload = (): void => {
  emit('update-photo', props.user.id)
}

/**
 * Обработка клика на кнопку удаления фото
 */
const handlePhotoDelete = (): void => {
  emit('delete-photo', props.user.id)
}
</script>

<style scoped lang="scss">
.user-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &__photo-wrapper {
    position: relative;
    width: 100%;
    margin-bottom: 1rem;
  }

  &__photo {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #f5f5f5;
    position: relative;
    overflow: hidden;
  }

  &__image-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    background: #667eea;
    color: #fff;
    border-radius: 50%;
  }

  &__delete-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 100;

    &:hover {
      background: #ff4444;
      transform: scale(1.1);

      .user-card__delete-icon {
        color: #fff;
      }

      .user-card__delete-tooltip {
        opacity: 1;
        visibility: visible;
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &__delete-icon {
    font-size: 1.2rem;
    line-height: 1;
    color: #666;
    transition: color 0.2s;
  }

  &__delete-tooltip {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    padding: 6px 12px;
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    font-size: 0.75rem;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s;
    pointer-events: none;
    z-index: 200;

    &::before {
      content: '';
      position: absolute;
      bottom: 100%;
      right: 8px;
      border: 4px solid transparent;
      border-bottom-color: rgba(0, 0, 0, 0.9);
    }
  }

  &__info {
    flex: 1;
    margin-bottom: 1rem;
  }

  &__name {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
  }

  &__age {
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
    color: #666;
  }

  &__email {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    word-break: break-word;
  }

  &__upload-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #667eea;
    border-radius: 4px;
    background: #fff;
    color: #667eea;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #667eea;
      color: #fff;
    }

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
