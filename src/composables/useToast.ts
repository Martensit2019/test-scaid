export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

const toasts = ref<Toast[]>([])
let toastIdCounter = 0

/**
 * Composable для управления Toast уведомлениями
 */
export const useToast = () => {
  /**
   * Добавление нового уведомления
   */
  const showToast = (
    message: string,
    type: Toast['type'] = 'info',
    duration: number = 3000,
  ): void => {
    const id = ++toastIdCounter
    const toast: Toast = {
      id,
      message,
      type,
      duration,
    }

    toasts.value.push(toast)

    // Автоматическое удаление через указанное время
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  /**
   * Удаление уведомления
   */
  const removeToast = (id: number): void => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  /**
   * Очистка всех уведомлений
   */
  const clearToasts = (): void => {
    toasts.value = []
  }

  /**
   * Вспомогательные методы для разных типов уведомлений
   */
  const success = (message: string, duration?: number): void => {
    showToast(message, 'success', duration)
  }

  const error = (message: string, duration?: number): void => {
    showToast(message, 'error', duration)
  }

  const info = (message: string, duration?: number): void => {
    showToast(message, 'info', duration)
  }

  const warning = (message: string, duration?: number): void => {
    showToast(message, 'warning', duration)
  }

  return {
    toasts,
    showToast,
    removeToast,
    clearToasts,
    success,
    error,
    info,
    warning,
  }
}
