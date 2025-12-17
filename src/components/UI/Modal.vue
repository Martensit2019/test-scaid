<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal">
      <div class="modal__overlay" @click="handleOverlayClick"></div>
      <div class="modal__content" :class="[`modal__content--${size}`]">
        <div class="modal__header">
          <h3 v-if="title" class="modal__title">{{ title }}</h3>
          <button
            v-if="showClose"
            class="modal__close-btn"
            type="button"
            @click="handleClose"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
        <div class="modal__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="modal__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  size?: 'small' | 'medium' | 'large'
  showClose?: boolean
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  showClose: true,
  closeOnOverlay: true,
})

const emit = defineEmits<{
  close: []
  'update:isOpen': [value: boolean]
}>()

const handleClose = (): void => {
  emit('close')
  emit('update:isOpen', false)
}

const handleOverlayClick = (): void => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease;
  }

  &__content {
    position: relative;
    background: #fff;
    border-radius: 8px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 1001;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease;
    display: flex;
    flex-direction: column;

    &--small {
      max-width: 400px;
    }

    &--medium {
      max-width: 600px;
    }

    &--large {
      max-width: 900px;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid #e0e0e0;
  }

  &__title {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
    font-weight: 600;
  }

  &__close-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #666;
    transition: all 0.2s;

    &:hover {
      background: #f5f5f5;
      color: #333;
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &__body {
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;
  }

  &__footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
