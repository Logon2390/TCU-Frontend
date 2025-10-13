<template>
  <div class="flex flex-col h-[calc(100vh-15px)] bg-gray-50 p-6">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ config.title }}</h1>
      
      <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div class="flex-1 sm:max-w-md">
          <slot name="filters" :search-value="searchValue" :update-search="updateSearchValue">
            <AppInput
              v-model="searchValue"
              :label-props="{ id: 'search', label: '' }"
              :input-props="{
                type: 'text',
                placeholder: config.searchPlaceholder,
                icon: 'icon-[lucide--search]'
              }"
            />
          </slot>
        </div>

        <div class="flex gap-2 justify-center sm:justify-end flex-shrink-0">
          <slot name="actions" />
        </div>
      </div>
    </div>

    <div class="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-0">
      <slot :search-value="debouncedSearchValue" :loading="loading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import { useDebounce } from '@/composables/useDebounce'
import type { LayoutProps } from '@/types/layout.types'

const props = withDefaults(defineProps<LayoutProps>(), {
  loading: false
})

const searchValue = ref('')
const debouncedSearchValue = useDebounce(searchValue, 300)

const updateSearchValue = (value: string) => {
  searchValue.value = value
}
</script>
