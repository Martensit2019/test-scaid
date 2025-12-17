<template>
  <div class="user-list">
    <UserListFilters @filter-changed="handleFilterChanged" />

    <div v-if="isLoading" class="user-list__loading">
      <div class="spinner"></div>
      <p>Загрузка пользователей...</p>
    </div>

    <div v-else-if="usersError" class="user-list__error">
      <p>Ошибка загрузки: {{ usersError }}</p>
      <button @click="initializeUsers" class="user-list__retry-btn">Попробовать снова</button>
    </div>

    <div v-else-if="displayedUsers.length === 0" class="user-list__empty">
      Пользователи не найдены
    </div>

    <div v-else class="user-list__grid">
      <UserCard
        v-for="user in displayedUsers"
        :key="user.id"
        :user="user"
        v-memo="[user.id, user.photoUrl, user.firstName, user.lastName, user.age, user.email]"
        @update-photo="handlePhotoUpdate"
        @delete-photo="handlePhotoDelete"
      />
    </div>

    <Modal :is-open="showPhotoUpload" title="Загрузка фото" @close="closePhotoUpload">
      <UserPhotoUpload :userId="selectedUserId!" @photo-uploaded="handlePhotoUploaded" />
    </Modal>

    <ConfirmModal
      :is-open="showDeleteConfirm"
      title="Удаление фото"
      message="Вы уверены, что хотите удалить фото?"
      confirm-text="OK"
      cancel-text="Отмена"
      @confirm="confirmPhotoDelete"
      @cancel="cancelPhotoDelete"
    />
  </div>
</template>

<script setup lang="ts">
import UserCard from './UserCard.vue'
import UserListFilters from './UserListFilters.vue'
import UserPhotoUpload from '@/components/UserPhoto/UserPhotoUpload.vue'
import Modal from '@/components/UI/Modal.vue'
import ConfirmModal from '@/components/UI/ConfirmModal.vue'
import { useUsers } from '@/composables/useUsers'
import { useUserSort } from '@/composables/useUserSort'
import { usePhotoUpload } from '@/composables/usePhotoUpload'

const emit = defineEmits<{
  'update-photo': [userId: string | number]
}>()

const { initializeUsers, isLoading, error: usersError } = useUsers()
const { sortedUsers } = useUserSort()
const { removePhoto } = usePhotoUpload()
const showPhotoUpload = ref(false)
const showDeleteConfirm = ref(false)
const selectedUserId = ref<string | number | null>(null)
const userIdToDelete = ref<string | number | null>(null)

// Отображаемые пользователи (отсортированные)
const displayedUsers = computed(() => sortedUsers.value)

/**
 * Обработка изменения фильтров
 */
const handleFilterChanged = (): void => {
  // Фильтры обрабатываются через composables и store
  // Здесь можно добавить дополнительную логику, если нужно
}

/**
 * Обработка запроса на обновление фото
 */
const handlePhotoUpdate = (userId: string | number): void => {
  selectedUserId.value = userId
  showPhotoUpload.value = true
  emit('update-photo', userId)
}

/**
 * Обработка успешной загрузки фото
 */
const handlePhotoUploaded = (): void => {
  closePhotoUpload()
  // Фото уже обновлено в store через composable
}

/**
 * Обработка удаления фото
 */
const handlePhotoDelete = (userId: string | number): void => {
  userIdToDelete.value = userId
  showDeleteConfirm.value = true
}

/**
 * Подтверждение удаления фото
 */
const confirmPhotoDelete = (): void => {
  if (userIdToDelete.value !== null) {
    removePhoto(userIdToDelete.value)
  }
  cancelPhotoDelete()
}

/**
 * Отмена удаления фото
 */
const cancelPhotoDelete = (): void => {
  showDeleteConfirm.value = false
  userIdToDelete.value = null
}

/**
 * Закрытие модального окна загрузки фото
 */
const closePhotoUpload = (): void => {
  showPhotoUpload.value = false
  selectedUserId.value = null
}

// Инициализация пользователей
onMounted(async () => {
  await initializeUsers()
})
</script>

<style scoped lang="scss">
.user-list {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    gap: 1rem;

    p {
      margin: 0;
      color: #666;
      font-size: 1.1rem;
    }
  }

  &__error {
    text-align: center;
    padding: 3rem;
    color: #e74c3c;
    font-size: 1.1rem;

    p {
      margin: 0 0 1rem 0;
    }
  }

  &__retry-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    background: #667eea;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #5568d3;
    }
  }

  &__empty {
    text-align: center;
    padding: 3rem;
    color: #666;
    font-size: 1.1rem;
  }
}

// Спиннер для загрузки
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
