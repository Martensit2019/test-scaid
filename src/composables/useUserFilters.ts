import { useUserStore } from '@/stores/userStore'

/**
 * Composable для фильтрации пользователей
 * Предоставляет методы для фильтрации и реактивный computed для отфильтрованных пользователей
 */
export const useUserFilters = () => {
  const userStore = useUserStore()

  /**
   * Фильтр по минимальному возрасту
   * @param minAge - минимальный возраст
   */
  const filterByAge = (minAge: number | undefined): void => {
    userStore.setFilterParams({ minAge })
  }

  /**
   * Фильтр по максимальному возрасту
   * @param maxAge - максимальный возраст
   */
  const filterByMaxAge = (maxAge: number | undefined): void => {
    userStore.setFilterParams({ maxAge })
  }

  /**
   * Фильтр только совершеннолетних (18+)
   * @param onlyAdults - показывать только совершеннолетних
   */
  const filterOnlyAdults = (onlyAdults: boolean): void => {
    userStore.setFilterParams({ onlyAdults })
  }

  /**
   * Поиск по имени или фамилии
   * @param searchQuery - поисковый запрос
   */
  const searchByName = (searchQuery: string | undefined): void => {
    userStore.setFilterParams({
      nameSearch: searchQuery?.trim() || undefined,
    })
  }

  /**
   * Фильтр по email
   * @param emailQuery - поисковый запрос для email
   */
  const filterByEmail = (emailQuery: string | undefined): void => {
    userStore.setFilterParams({
      emailSearch: emailQuery?.trim() || undefined,
    })
  }

  /**
   * Сброс всех фильтров
   */
  const resetFilters = (): void => {
    userStore.setFilterParams({
      minAge: undefined,
      maxAge: undefined,
      onlyAdults: false,
      nameSearch: undefined,
      emailSearch: undefined,
    })
  }

  /**
   * Реактивный computed для отфильтрованных пользователей
   * Использует фильтры из store (по возрасту и только совершеннолетние)
   */
  const filteredUsers = computed(() => userStore.filteredUsers)

  return {
    filteredUsers,
    filterByAge,
    filterByMaxAge,
    filterOnlyAdults,
    searchByName,
    filterByEmail,
    resetFilters,
  }
}
