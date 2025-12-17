<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast--${toast.type}`]"
          @click="removeToast(toast.id)"
        >
          <div class="toast__icon">
            <span v-if="toast.type === 'success'">✓</span>
            <span v-else-if="toast.type === 'error'">✕</span>
            <span v-else-if="toast.type === 'warning'">⚠</span>
            <span v-else>ℹ</span>
          </div>
          <div class="toast__message">{{ toast.message }}</div>
          <button class="toast__close" @click.stop="removeToast(toast.id)">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  cursor: pointer;
  transition:
    transform 0.2s,
    opacity 0.2s;

  &:hover {
    transform: translateX(-4px);
  }

  &--success {
    border-left: 4px solid #27ae60;
  }

  &--error {
    border-left: 4px solid #e74c3c;
  }

  &--warning {
    border-left: 4px solid #f39c12;
  }

  &--info {
    border-left: 4px solid #3498db;
  }

  &__icon {
    font-size: 1.25rem;
    font-weight: bold;
    flex-shrink: 0;
  }

  &--success &__icon {
    color: #27ae60;
  }

  &--error &__icon {
    color: #e74c3c;
  }

  &--warning &__icon {
    color: #f39c12;
  }

  &--info &__icon {
    color: #3498db;
  }

  &__message {
    flex: 1;
    font-size: 0.9rem;
    color: #333;
    line-height: 1.4;
  }

  &__close {
    flex-shrink: 0;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #999;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    transition: color 0.2s;

    &:hover {
      color: #333;
    }
  }
}

// Анимации для TransitionGroup
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .toast-container {
    right: 10px;
    left: 10px;
    max-width: none;
  }

  .toast {
    padding: 0.875rem 1rem;
  }
}
</style>
