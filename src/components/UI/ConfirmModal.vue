<template>
  <Modal :is-open="isOpen" :title="title" size="small" :show-close="false" @close="handleCancel">
    <p class="confirm-modal__message">{{ message }}</p>

    <template #footer>
      <UIButton @click="handleCancel">
        {{ cancelText }}
      </UIButton>
      <UIButton variant="danger" @click="handleConfirm">
        {{ confirmText }}
      </UIButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'
import UIButton from './Button.vue'

interface Props {
  isOpen: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Подтвердите действие',
  confirmText: 'OK',
  cancelText: 'Отмена',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const handleConfirm = (): void => {
  emit('confirm')
}

const handleCancel = (): void => {
  emit('cancel')
}
</script>

<style scoped lang="scss">
.confirm-modal {
  &__message {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
    line-height: 1.5;
  }
}
</style>
