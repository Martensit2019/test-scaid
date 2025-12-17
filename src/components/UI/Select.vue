<template>
  <select
    :value="modelValue"
    :disabled="disabled"
    :class="['ui-select', { 'ui-select--disabled': disabled }]"
    @change="handleChange"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [event: Event]
}>()

const handleChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
  emit('change', event)
}
</script>

<style scoped lang="scss">
.ui-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  min-width: 150px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  font-family: inherit;

  &:hover:not(:disabled) {
    border-color: #999;
  }

  &:focus {
    outline: none;
    border-color: #42b983;
    box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f5f5f5;
  }
}
</style>
