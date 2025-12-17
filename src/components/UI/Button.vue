<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'ui-button',
      `ui-button--${variant}`,
      { 'ui-button--active': active, 'ui-button--disabled': disabled },
    ]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'default' | 'primary' | 'danger' | 'icon'
  disabled?: boolean
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'default',
  disabled: false,
  active: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent): void => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped lang="scss">
.ui-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: #f5f5f5;
    border-color: #999;
    color: #333;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--primary {
    background-color: #667eea;
    border-color: #667eea;
    color: #fff;

    &:hover:not(:disabled) {
      background-color: #5568d3;
      border-color: #5568d3;
    }
  }

  &--danger {
    border-color: #e74c3c;
    color: #e74c3c;

    &:hover:not(:disabled) {
      background-color: #e74c3c;
      color: #fff;
    }
  }

  &--icon {
    padding: 0.5rem 0.75rem;
    min-width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }

  &--active {
    background-color: #42b983;
    border-color: #42b983;
    color: #fff;
    font-weight: bold;

    &:hover:not(:disabled) {
      background-color: #35a372;
      border-color: #35a372;
    }
  }
}
</style>
