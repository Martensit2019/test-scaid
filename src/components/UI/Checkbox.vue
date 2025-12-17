<template>
  <label :class="['ui-checkbox', { 'ui-checkbox--disabled': disabled }]">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="ui-checkbox__input"
      @change="handleChange"
    />
    <span class="ui-checkbox__label">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [event: Event]
}>()

const handleChange = (event: Event): void => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
  emit('change', event)
}
</script>

<style scoped lang="scss">
.ui-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  &__input {
    cursor: pointer;
    width: 18px;
    height: 18px;
    accent-color: #42b983;
  }

  &__label {
    user-select: none;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    .ui-checkbox__input {
      cursor: not-allowed;
    }
  }
}
</style>
