import { useUserStore } from '@/stores/userStore'

/**
 * Composable для сортировки пользователей
 * Предоставляет методы для сортировки и реактивный computed для отсортированных пользователей
 */
export const useUserSort = () => {
  const userStore = useUserStore()

  /**
   * Сортировка пользователей по полю и направлению
   * @param field - поле для сортировки ('name' | 'age')
   * @param direction - направление сортировки ('asc' | 'desc')
   */
  const sortBy = (field: 'name' | 'age', direction: 'asc' | 'desc'): void => {
    userStore.setSortParams({ field, direction })
  }

  /**
   * Сброс сортировки
   */
  const resetSort = (): void => {
    userStore.setSortParams({
      field: undefined,
      direction: 'asc',
    })
  }

  /**
   * Реактивный computed для отсортированных пользователей
   * Использует сортировку из store
   */
  const sortedUsers = computed(() => userStore.sortedUsers)

  /**
   * Текущие параметры сортировки
   */
  const currentSortParams = computed(() => userStore.sortParams)

  return {
    sortedUsers,
    currentSortParams,
    sortBy,
    resetSort,
  }
}
