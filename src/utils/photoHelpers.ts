/**
 * Конвертация файла в base64 строку
 * @param file - файл для конвертации
 * @returns Promise с base64 строкой
 */
export const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }
    reader.onerror = () => {
      reject(new Error('Ошибка при чтении файла'))
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Валидация изображения
 * @param file - файл для валидации
 * @returns объект с результатом валидации
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
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

  // Проверка минимального размера (не пустой файл)
  if (file.size === 0) {
    return {
      valid: false,
      error: 'Файл пустой',
    }
  }

  return { valid: true }
}

/**
 * Создание URL для отображения изображения
 * @param file - файл или строка URL
 * @returns URL для отображения
 */
export const createImageUrl = (file: File | string): string => {
  if (typeof file === 'string') {
    return file
  }
  return URL.createObjectURL(file)
}

/**
 * Оптимизация изображения (сжатие)
 * @param file - исходный файл изображения
 * @param maxWidth - максимальная ширина (по умолчанию 1920px)
 * @param maxHeight - максимальная высота (по умолчанию 1920px)
 * @param quality - качество сжатия (0.0 - 1.0, по умолчанию 0.8)
 * @param maxSizeKB - максимальный размер в KB после сжатия (по умолчанию 500KB)
 * @returns Promise с оптимизированным файлом
 */
export const optimizeImage = async (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8,
  maxSizeKB: number = 500,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Не удалось создать контекст canvas'))
      return
    }

    img.onload = () => {
      try {
        // Вычисление новых размеров с сохранением пропорций
        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }

        // Установка размеров canvas
        canvas.width = width
        canvas.height = height

        // Рисование изображения на canvas
        ctx.drawImage(img, 0, 0, width, height)

        // Функция для конвертации canvas в Blob с учетом максимального размера
        const convertToBlob = (currentQuality: number): void => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Не удалось создать blob из canvas'))
                return
              }

              const sizeKB = blob.size / 1024

              // Если размер превышает максимальный и качество можно уменьшить
              if (sizeKB > maxSizeKB && currentQuality > 0.3) {
                // Уменьшаем качество и пробуем снова
                convertToBlob(currentQuality - 0.1)
              } else {
                // Создаем новый File из Blob
                const optimizedFile = new File([blob], file.name, {
                  type: file.type || 'image/jpeg',
                  lastModified: Date.now(),
                })
                resolve(optimizedFile)
              }
            },
            file.type || 'image/jpeg',
            currentQuality,
          )
        }

        // Начинаем конвертацию с указанным качеством
        convertToBlob(quality)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('Ошибка при загрузке изображения'))
    }

    // Загрузка изображения
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string
      }
    }
    reader.onerror = () => {
      reject(new Error('Ошибка при чтении файла'))
    }
    reader.readAsDataURL(file)
  })
}
