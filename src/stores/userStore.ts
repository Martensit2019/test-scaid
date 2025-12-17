import type { User } from '@/types/user'

interface FilterParams {
  minAge?: number
  maxAge?: number
  onlyAdults?: boolean
  nameSearch?: string
  emailSearch?: string
}

interface SortParams {
  field?: 'name' | 'age'
  direction?: 'asc' | 'desc'
}

const LOCAL_STORAGE_KEY = 'scaid_users'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const filterParams = ref<FilterParams>({
    minAge: undefined,
    maxAge: undefined,
    onlyAdults: false,
    nameSearch: undefined,
    emailSearch: undefined,
  })
  const sortParams = ref<SortParams>({
    field: undefined,
    direction: 'asc',
  })

  // Getters
  /**
   * Отфильтрованные пользователи на основе параметров фильтрации
   */
  const filteredUsers = computed(() => {
    let result = [...users.value]

    // Фильтр только совершеннолетних
    if (filterParams.value.onlyAdults) {
      result = result.filter((user) => user.age >= 18)
    }

    // Фильтр по минимальному возрасту
    if (filterParams.value.minAge !== undefined) {
      result = result.filter((user) => user.age >= filterParams.value.minAge!)
    }

    // Фильтр по максимальному возрасту
    if (filterParams.value.maxAge !== undefined) {
      result = result.filter((user) => user.age <= filterParams.value.maxAge!)
    }

    // Поиск по имени/фамилии
    if (filterParams.value.nameSearch) {
      const query = filterParams.value.nameSearch.toLowerCase().trim()
      result = result.filter(
        (user) =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query),
      )
    }

    // Поиск по email
    if (filterParams.value.emailSearch) {
      const query = filterParams.value.emailSearch.toLowerCase().trim()
      result = result.filter((user) => user.email.toLowerCase().includes(query))
    }

    return result
  })

  /**
   * Отсортированные пользователи на основе параметров сортировки
   */
  const sortedUsers = computed(() => {
    const filtered = filteredUsers.value

    if (!sortParams.value.field) {
      return filtered
    }

    return [...filtered].sort((a, b) => {
      let comparison = 0

      if (sortParams.value.field === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
        comparison = nameA.localeCompare(nameB)
      } else if (sortParams.value.field === 'age') {
        comparison = a.age - b.age
      }

      return sortParams.value.direction === 'asc' ? comparison : -comparison
    })
  })

  // Actions
  /**
   * Сохранение пользователей в localStorage
   */
  const saveToLocalStorage = (): void => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users.value))
    } catch (error) {
      console.error('Ошибка при сохранении в localStorage:', error)
    }
  }

  /**
   * Загрузка пользователей из localStorage
   * @returns массив пользователей или null, если данных нет
   */
  const loadFromLocalStorage = (): User[] | null => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (data) {
        return JSON.parse(data) as User[]
      }
    } catch (error) {
      console.error('Ошибка при загрузке из localStorage:', error)
    }
    return null
  }

  /**
   * Загрузка/инициализация пользователей
   * @param newUsers - массив пользователей для загрузки
   */
  const loadUsers = (newUsers: User[]): void => {
    users.value = newUsers
    saveToLocalStorage()
  }

  /**
   * Обновление фото пользователя
   * @param userId - идентификатор пользователя
   * @param photoUrl - URL фотографии
   */
  const updateUserPhoto = (userId: string | number, photoUrl: string): void => {
    const user = users.value.find((u) => u.id === userId)
    if (user) {
      user.photoUrl = photoUrl
      saveToLocalStorage()
    }
  }

  /**
   * Добавление нового пользователя
   * @param user - объект пользователя
   */
  const addUser = (user: User): void => {
    users.value.push(user)
    saveToLocalStorage()
  }

  /**
   * Установка параметров фильтрации
   * @param params - параметры фильтрации
   */
  const setFilterParams = (params: Partial<FilterParams>): void => {
    filterParams.value = { ...filterParams.value, ...params }
  }

  /**
   * Установка параметров сортировки
   * @param params - параметры сортировки
   */
  const setSortParams = (params: Partial<SortParams>): void => {
    sortParams.value = { ...sortParams.value, ...params }
  }

  return {
    // State
    users,
    filterParams,
    sortParams,
    // Getters
    filteredUsers,
    sortedUsers,
    // Actions
    loadUsers,
    loadFromLocalStorage,
    saveToLocalStorage,
    updateUserPhoto,
    addUser,
    setFilterParams,
    setSortParams,
  }
})
