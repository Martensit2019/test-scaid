<template>
  <div class="user-list-filters">
    <div class="filter-group">
      <label class="filter-label">
        <span>Поиск по имени/фамилии:</span>
        <UIInput
          v-model="nameSearch"
          type="text"
          variant="search"
          placeholder="Введите имя или фамилию"
          @update:modelValue="handleNameSearchChange"
        />
      </label>
    </div>

    <div class="filter-group">
      <label class="filter-label">
        <span>Поиск по email:</span>
        <UIInput
          v-model="emailSearch"
          type="email"
          variant="search"
          placeholder="Введите email"
          @update:modelValue="handleEmailSearchChange"
        />
      </label>
    </div>

    <div class="filter-group">
      <UICheckbox v-model="onlyAdults" @update:modelValue="handleOnlyAdultsChange">
        Только старше 18
      </UICheckbox>
    </div>

    <div class="filter-group">
      <label class="filter-label">
        <span>Возраст от:</span>
        <UIInput
          v-model="minAge"
          type="number"
          variant="age"
          placeholder="Не указан"
          :min="0"
          :max="120"
          @update:modelValue="handleMinAgeChange"
        />
      </label>
    </div>

    <div class="filter-group">
      <label class="filter-label">
        <span>Возраст до:</span>
        <UIInput
          v-model="maxAge"
          type="number"
          variant="age"
          placeholder="Не указан"
          :min="0"
          :max="120"
          @update:modelValue="handleMaxAgeChange"
        />
      </label>
    </div>

    <div class="filter-group filter-group--sort">
      <div class="sort-section">
        <label class="sort-label">
          <span>Сортировка:</span>
          <UISelect
            :model-value="currentSortParams.field || ''"
            @update:modelValue="handleSortFieldChange"
          >
            <option value="">Без сортировки</option>
            <option value="name">По имени</option>
            <option value="age">По возрасту</option>
          </UISelect>
        </label>

        <div v-if="currentSortParams.field" class="sort-controls">
          <UIButton
            variant="icon"
            :active="currentSortParams.direction === 'asc'"
            @click="handleSortDirectionChange('asc')"
            title="По возрастанию"
          >
            ↑
          </UIButton>
          <UIButton
            variant="icon"
            :active="currentSortParams.direction === 'desc'"
            @click="handleSortDirectionChange('desc')"
            title="По убыванию"
          >
            ↓
          </UIButton>
          <UIButton variant="icon" @click="handleResetSort" title="Сбросить сортировку">
            ✕
          </UIButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserFilters } from '@/composables/useUserFilters'
import { useUserSort } from '@/composables/useUserSort'
import UIInput from '@/components/UI/Input.vue'
import UISelect from '@/components/UI/Select.vue'
import UIButton from '@/components/UI/Button.vue'
import UICheckbox from '@/components/UI/Checkbox.vue'

const emit = defineEmits<{
  'filter-changed': [
    filters: {
      onlyAdults: boolean
      minAge?: number
      maxAge?: number
      nameSearch?: string
      emailSearch?: string
    },
  ]
}>()

const { filterOnlyAdults, filterByAge, filterByMaxAge, searchByName, filterByEmail } =
  useUserFilters()
const { sortBy, resetSort, currentSortParams } = useUserSort()

const onlyAdults = ref(false)
const minAge = ref<number | undefined>(undefined)
const maxAge = ref<number | undefined>(undefined)
const nameSearch = ref<string>('')
const emailSearch = ref<string>('')

const handleOnlyAdultsChange = (value: boolean) => {
  onlyAdults.value = value
  filterOnlyAdults(onlyAdults.value)
  emitFilterChanged()
}

const handleNameSearchChange = (value: string | number) => {
  nameSearch.value = String(value)
  searchByName(nameSearch.value || undefined)
  emitFilterChanged()
}

const handleEmailSearchChange = (value: string | number) => {
  emailSearch.value = String(value)
  filterByEmail(emailSearch.value || undefined)
  emitFilterChanged()
}

const handleMinAgeChange = (value: string | number) => {
  const numValue =
    typeof value === 'number' ? value : value ? parseInt(String(value), 10) : undefined
  minAge.value = numValue
  filterByAge(numValue)
  emitFilterChanged()
}

const handleMaxAgeChange = (value: string | number) => {
  const numValue =
    typeof value === 'number' ? value : value ? parseInt(String(value), 10) : undefined
  maxAge.value = numValue
  filterByMaxAge(numValue)
  emitFilterChanged()
}

const handleSortFieldChange = (value: string | number) => {
  const field = String(value) as 'name' | 'age' | ''

  if (field === '') {
    resetSort()
  } else {
    const direction = currentSortParams.value.direction || 'asc'
    sortBy(field, direction)
  }
}

const handleSortDirectionChange = (direction: 'asc' | 'desc') => {
  if (currentSortParams.value.field) {
    sortBy(currentSortParams.value.field, direction)
  }
}

const handleResetSort = () => {
  resetSort()
}

const emitFilterChanged = () => {
  emit('filter-changed', {
    onlyAdults: onlyAdults.value,
    minAge: minAge.value,
    maxAge: maxAge.value,
    nameSearch: nameSearch.value || undefined,
    emailSearch: emailSearch.value || undefined,
  })
}
</script>

<style scoped lang="scss">
.user-list-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 1rem;

  .filter-group {
    display: flex;
    align-items: center;

    .filter-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    &--sort {
      border-top: 1px solid #ddd;
      padding-top: 1rem;
      margin-top: 0.5rem;
    }
  }

  .sort-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    width: 100%;

    .sort-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
    }

    .sort-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: auto;
    }
  }
}
</style>
