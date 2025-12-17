import { useUserStore } from '@/stores/userStore'
import { fileToBase64, validateImageFile, optimizeImage } from '@/utils/photoHelpers'
import { useToast } from '@/composables/useToast'

/**
 * Composable для загрузки фотографий пользователей
 * Предоставляет методы для валидации, загрузки и удаления фото
 */
export const usePhotoUpload = () => {
  const userStore = useUserStore()
  const { success, error: showError } = useToast()
  const isUploading = ref(false)
  const uploadError = ref<string | null>(null)

  /**
   * Валидация фотографии
   * @param file - файл для валидации
   * @returns результат валидации
   */
  const validatePhoto = (file: File): { valid: boolean; error?: string } => {
    uploadError.value = null
    return validateImageFile(file)
  }

  /**
   * Загрузка и конвертация фото в base64/URL
   * @param file - файл для загрузки
   * @param optimize - оптимизировать ли изображение перед загрузкой (по умолчанию true)
   * @returns Promise с URL фотографии
   */
  const uploadPhoto = async (file: File, optimize: boolean = true): Promise<string> => {
    uploadError.value = null
    isUploading.value = true

    try {
      // Валидация файла
      const validation = validatePhoto(file)
      if (!validation.valid) {
        throw new Error(validation.error || 'Ошибка валидации файла')
      }

      // Оптимизация изображения перед загрузкой
      let fileToProcess = file
      if (optimize) {
        try {
          fileToProcess = await optimizeImage(file)
        } catch (optimizeError) {
          // Если оптимизация не удалась, используем исходный файл
          console.warn('Не удалось оптимизировать изображение:', optimizeError)
        }
      }

      // Конвертация в base64
      const base64Url = await fileToBase64(fileToProcess)
      isUploading.value = false
      return base64Url
    } catch (error) {
      isUploading.value = false
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при загрузке фото'
      uploadError.value = errorMessage
      showError(errorMessage)
      throw error
    }
  }

  /**
   * Загрузка фото для конкретного пользователя
   * @param userId - идентификатор пользователя
   * @param fileOrUrl - файл для загрузки или URL фотографии
   * @param optimize - оптимизировать ли изображение перед загрузкой (по умолчанию true)
   * @returns Promise с URL фотографии
   */
  const uploadPhotoForUser = async (
    userId: string | number,
    fileOrUrl: File | string,
    optimize: boolean = true,
  ): Promise<string> => {
    try {
      let photoUrl: string

      // Если передан URL (строка), используем его напрямую
      if (typeof fileOrUrl === 'string') {
        photoUrl = fileOrUrl
      } else {
        // Если передан файл, обрабатываем его
        photoUrl = await uploadPhoto(fileOrUrl, optimize)
      }

      userStore.updateUserPhoto(userId, photoUrl)
      success('Фото успешно загружено')
      return photoUrl
    } catch (error) {
      throw error
    }
  }

  /**
   * Удаление фото пользователя
   * @param userId - идентификатор пользователя
   */
  const removePhoto = (userId: string | number): void => {
    uploadError.value = null
    const user = userStore.users.find((u) => u.id === userId)
    if (user && user.photoUrl) {
      // Освобождение памяти для object URL, если это был создан через createObjectURL
      if (user.photoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(user.photoUrl)
      }
      userStore.updateUserPhoto(userId, '')
    }
  }

  /**
   * Сброс ошибки загрузки
   */
  const clearError = (): void => {
    uploadError.value = null
  }

  return {
    isUploading,
    uploadError,
    validatePhoto,
    uploadPhoto,
    uploadPhotoForUser,
    removePhoto,
    clearError,
  }
}
