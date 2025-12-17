<template>
  <input
    ref="fileInputRef"
    type="file"
    :accept="accept"
    :disabled="disabled"
    :class="['ui-file-input', { 'ui-file-input--disabled': disabled }]"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
interface Props {
  accept?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  change: [event: Event]
  'file-selected': [file: File | null]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

const handleChange = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null
  emit('change', event)
  emit('file-selected', file)
}

defineExpose({
  fileInputRef,
  click: () => fileInputRef.value?.click(),
  reset: () => {
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  },
})
</script>

<style scoped lang="scss">
.ui-file-input {
  display: none;

  &--disabled {
    cursor: not-allowed;
  }
}
</style>
