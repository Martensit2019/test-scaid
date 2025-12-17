import { useUserStore } from '@/stores/userStore'
import type { User } from '@/types/user'
import { mockUsers } from '@/mocks/users'

/**
 * Composable для работы с пользователями
 * Предоставляет доступ к пользователям из store и методы для их получения
 */
export const useUsers = () => {
  const userStore = useUserStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Инициализация моковых данных пользователей
   */
  const initializeUsers = async (): Promise<void> => {
    if (userStore.users.length > 0) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      // Имитация асинхронной загрузки для демонстрации loading state
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Попытка загрузить данные из localStorage
      const savedUsers = userStore.loadFromLocalStorage()

      if (savedUsers && savedUsers.length > 0) {
        // Используем сохраненные данные
        userStore.loadUsers(savedUsers)
      } else {
        // Используем моковые данные, если в localStorage ничего нет
        userStore.loadUsers(mockUsers)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка при загрузке пользователей'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Получение всех пользователей
   */
  const getUsers = (): User[] => {
    return userStore.users
  }

  /**
   * Получение пользователя по ID
   */
  const getUserById = (id: string | number): User | undefined => {
    return userStore.users.find((user) => user.id === id)
  }

  // Инициализация при монтировании компонента
  onMounted(() => {
    initializeUsers()
  })

  return {
    users: userStore.users,
    filteredUsers: userStore.filteredUsers,
    sortedUsers: userStore.sortedUsers,
    isLoading,
    error,
    getUsers,
    getUserById,
    initializeUsers,
  }
}
