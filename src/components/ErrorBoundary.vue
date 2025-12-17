<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-boundary__content">
      <h2 class="error-boundary__title">Произошла ошибка</h2>
      <p class="error-boundary__message">{{ errorMessage }}</p>
      <button class="error-boundary__button" @click="handleReset">Попробовать снова</button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
const hasError = ref(false)
const errorMessage = ref<string>('')

/**
 * Обработка ошибок в дочерних компонентах
 */
onErrorCaptured((err: unknown) => {
  hasError.value = true
  errorMessage.value = err instanceof Error ? err.message : 'Произошла неизвестная ошибка'

  // Логирование ошибки в консоль для отладки
  console.error('ErrorBoundary caught an error:', err)

  // Предотвращаем дальнейшее распространение ошибки
  return false
})

/**
 * Сброс состояния ошибки
 */
const handleReset = (): void => {
  hasError.value = false
  errorMessage.value = ''
}

// Предоставляем функцию для сброса ошибки дочерним компонентам
provide('resetError', handleReset)
</script>

<style scoped lang="scss">
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;

  &__content {
    text-align: center;
    max-width: 500px;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  &__title {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    color: #e74c3c;
  }

  &__message {
    margin: 0 0 1.5rem 0;
    color: #666;
    font-size: 1rem;
  }

  &__button {
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

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
