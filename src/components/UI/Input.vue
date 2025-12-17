<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :min="min"
    :max="max"
    :class="['ui-input', `ui-input--${variant}`, { 'ui-input--disabled': disabled }]"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url'
  placeholder?: string
  disabled?: boolean
  min?: number | string
  max?: number | string
  variant?: 'default' | 'search' | 'age'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  variant: 'default',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? (target.value ? Number(target.value) : '') : target.value
  emit('update:modelValue', value)
}

const handleBlur = (event: FocusEvent): void => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent): void => {
  emit('focus', event)
}
</script>

<style scoped lang="scss">
.ui-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  font-family: inherit;

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

  &--search {
    flex: 1;
    min-width: 200px;
  }

  &--age {
    width: 120px;
  }
}
</style>
