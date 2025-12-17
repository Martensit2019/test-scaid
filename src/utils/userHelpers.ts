import type { User } from '@/types/user'

/**
 * Получение полного имени пользователя
 * @param user - объект пользователя
 * @returns строка с полным именем (firstName + lastName)
 */
export const getFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`.trim()
}

/**
 * Форматирование возраста пользователя
 * @param age - возраст пользователя
 * @returns отформатированная строка возраста
 */
export const formatUserAge = (age: number): string => {
  if (age < 0 || !Number.isInteger(age)) {
    return 'Не указан'
  }

  const lastDigit = age % 10
  const lastTwoDigits = age % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${age} лет`
  }

  if (lastDigit === 1) {
    return `${age} год`
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${age} года`
  }

  return `${age} лет`
}
