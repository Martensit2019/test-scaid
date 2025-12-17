<template>
  <div class="user-photo-upload">
    <UIFileInput
      ref="fileInputRef"
      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
      :disabled="isUploading"
      @file-selected="handleFileSelected"
    />

    <div
      class="user-photo-upload__dropzone"
      :class="{ 'user-photo-upload__dropzone--active': isDragOver }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div v-if="!previewUrl" class="user-photo-upload__dropzone-content">
        <div class="user-photo-upload__dropzone-icon">📁</div>
        <p class="user-photo-upload__dropzone-text">Перетащите фото сюда или</p>
        <UIButton :disabled="isUploading" @click="triggerFileInput">
          {{ isUploading ? 'Загрузка...' : 'Выбрать фото' }}
        </UIButton>
      </div>

      <div v-else class="user-photo-upload__preview">
        <img :src="previewUrl" alt="Preview" class="user-photo-upload__preview-image" />
        <UIButton variant="danger" :disabled="isUploading" @click="clearPreview">
          Удалить
        </UIButton>
      </div>
    </div>

    <div class="user-photo-upload__divider">
      <span>или</span>
    </div>

    <div class="user-photo-upload__url-input">
      <UIInput
        v-model="photoUrl"
        type="url"
        placeholder="Вставьте URL фотографии"
        :disabled="isUploading || !!selectedFile"
        @blur="handleUrlBlur"
      />
      <UIButton
        v-if="photoUrl && !previewUrl"
        :disabled="isUploading || !!selectedFile"
        @click="handleLoadFromUrl"
      >
        Загрузить по URL
      </UIButton>
    </div>

    <div v-if="uploadError" class="user-photo-upload__error">
      {{ uploadError }}
    </div>

    <UIButton v-if="selectedFile && !isUploading" variant="primary" @click="handleUpload">
      Загрузить
    </UIButton>
  </div>
</template>

<script setup lang="ts">
import { usePhotoUpload } from '@/composables/usePhotoUpload'
import { createImageUrl } from '@/utils/photoHelpers'
import UIFileInput from '@/components/UI/FileInput.vue'
import UIButton from '@/components/UI/Button.vue'
import UIInput from '@/components/UI/Input.vue'

interface Props {
  userId: string | number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'photo-uploaded': [photoUrl: string]
}>()

const fileInputRef = ref<InstanceType<typeof UIFileInput> | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isDragOver = ref(false)
const photoUrl = ref('')

const { isUploading, uploadError, uploadPhotoForUser, clearError } = usePhotoUpload()

/**
 * Открытие диалога выбора файла
 */
const triggerFileInput = (): void => {
  fileInputRef.value?.click()
}

/**
 * Обработка выбора файла
 */
const handleFileSelected = (file: File | null): void => {
  clearError()

  if (!file) {
    return
  }

  // Валидация файла
  const validation = validatePhoto(file)
  if (!validation.valid) {
    uploadError.value = validation.error || 'Ошибка валидации файла'
    fileInputRef.value?.reset()
    return
  }

  selectedFile.value = file
  previewUrl.value = createImageUrl(file)
}

/**
 * Валидация фотографии
 */
const validatePhoto = (file: File): { valid: boolean; error?: string } => {
  // Проверка типа файла
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Недопустимый тип файла. Разрешены только: JPG, PNG, GIF, WEBP',
    }
  }

  // Проверка размера файла (максимум 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB в байтах
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Размер файла превышает 5MB',
    }
  }

  // Проверка минимального размера
  if (file.size === 0) {
    return {
      valid: false,
      error: 'Файл пустой',
    }
  }

  return { valid: true }
}

/**
 * Обработка загрузки фото
 */
const handleUpload = async (): Promise<void> => {
  if (!selectedFile.value) {
    return
  }

  try {
    const photoUrl = await uploadPhotoForUser(props.userId, selectedFile.value)
    emit('photo-uploaded', photoUrl)
    clearPreview()
  } catch (error) {
    // Ошибка уже обработана в composable
    console.error('Ошибка при загрузке фото:', error)
  }
}

/**
 * Очистка preview и выбранного файла
 */
const clearPreview = (): void => {
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = null
  selectedFile.value = null
  photoUrl.value = ''
  fileInputRef.value?.reset()
  clearError()
}

/**
 * Валидация URL
 */
const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Проверка URL на изображение
 */
const isImageUrl = (url: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
  const lowerUrl = url.toLowerCase()
  return imageExtensions.some((ext) => lowerUrl.includes(ext))
}

/**
 * Обработка blur на инпуте URL
 */
const handleUrlBlur = (): void => {
  if (!photoUrl.value) {
    return
  }

  if (!isValidUrl(photoUrl.value)) {
    uploadError.value = 'Некорректный URL'
    return
  }

  clearError()
}

/**
 * Загрузка фото по URL
 */
const handleLoadFromUrl = async (): Promise<void> => {
  if (!photoUrl.value) {
    return
  }

  clearError()

  if (!isValidUrl(photoUrl.value)) {
    uploadError.value = 'Некорректный URL'
    return
  }

  if (!isImageUrl(photoUrl.value)) {
    uploadError.value = 'URL не похож на изображение'
    return
  }

  // Проверяем доступность изображения
  try {
    previewUrl.value = photoUrl.value

    // Создаем фейковую загрузку изображения для проверки
    const img = new Image()
    img.onload = async () => {
      // Изображение загружено успешно, отправляем URL
      try {
        await uploadPhotoForUser(props.userId, photoUrl.value)
        emit('photo-uploaded', photoUrl.value)
        clearPreview()
      } catch (error) {
        console.error('Ошибка при сохранении фото:', error)
        previewUrl.value = null
      }
    }
    img.onerror = () => {
      uploadError.value = 'Не удалось загрузить изображение по указанному URL'
      previewUrl.value = null
    }
    img.src = photoUrl.value
  } catch {
    uploadError.value = 'Ошибка при загрузке изображения'
    previewUrl.value = null
  }
}

/**
 * Обработка события dragover
 */
const handleDragOver = (event: DragEvent): void => {
  if (isUploading.value) {
    return
  }
  isDragOver.value = true
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
}

/**
 * Обработка события dragleave
 */
const handleDragLeave = (event: DragEvent): void => {
  // Проверяем, что мы действительно покинули dropzone, а не просто перешли на дочерний элемент
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    isDragOver.value = false
  }
}

/**
 * Обработка события drop
 */
const handleDrop = (event: DragEvent): void => {
  isDragOver.value = false

  if (isUploading.value) {
    return
  }

  const files = event.dataTransfer?.files
  if (!files || files.length === 0) {
    return
  }

  const file = files[0]
  if (!file) {
    return
  }
  handleFileSelected(file)
}
</script>

<style scoped lang="scss">
.user-photo-upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__dropzone {
    min-height: 200px;
    border: 2px dashed #ddd;
    border-radius: 8px;
    padding: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    background: #fafafa;

    &--active {
      border-color: #667eea;
      background: #f0f4ff;
      border-style: solid;
    }
  }

  &__dropzone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }

  &__dropzone-icon {
    font-size: 3rem;
    opacity: 0.6;
  }

  &__dropzone-text {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
  }

  &__preview {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    width: 100%;
  }

  &__preview-image {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid #e0e0e0;
  }

  &__error {
    padding: 0.5rem;
    border-radius: 4px;
    background: #fee;
    color: #c33;
    font-size: 0.85rem;
    border: 1px solid #fcc;
  }

  &__divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 0.5rem 0;

    &::before,
    &::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #ddd;
    }

    span {
      padding: 0 1rem;
      color: #999;
      font-size: 0.9rem;
      text-transform: uppercase;
    }
  }

  &__url-input {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;

    :deep(.ui-input) {
      flex: 1;
    }
  }
}
</style>
