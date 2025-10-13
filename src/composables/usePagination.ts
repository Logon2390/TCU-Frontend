import { ref, computed, watch } from 'vue'
import type { PaginatedResponse } from '@/types/api.types'

export interface PaginationOptions {
  initialPage?: number
  initialLimit?: number
  maxLimit?: number
}

export function usePagination<T>(options: PaginationOptions = {}) {
  const {
    initialPage = 1,
    initialLimit = 10,
    maxLimit = 100
  } = options

  // State
  const currentPage = ref(initialPage)
  const itemsPerPage = ref(initialLimit)
  const isLoading = ref(false)
  const data = ref<T[]>([])
  const meta = ref({
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: initialLimit,
    totalPages: 0,
    currentPage: initialPage
  })

  // Computed
  const totalPages = computed(() => meta.value.totalPages)
  const totalItems = computed(() => meta.value.totalItems)
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)

  // Methods
  const setData = (paginatedResponse: PaginatedResponse<T>) => {
    data.value = paginatedResponse.items
    meta.value = paginatedResponse.meta
    currentPage.value = paginatedResponse.meta.currentPage
    itemsPerPage.value = paginatedResponse.meta.itemsPerPage
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      currentPage.value--
    }
  }

  const setItemsPerPage = (limit: number) => {
    const validLimit = Math.min(Math.max(1, limit), maxLimit)
    itemsPerPage.value = validLimit
    currentPage.value = 1 // Reset to first page when changing items per page
  }

  const reset = () => {
    currentPage.value = initialPage
    itemsPerPage.value = initialLimit
    data.value = []
    meta.value = {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: initialLimit,
      totalPages: 0,
      currentPage: initialPage
    }
  }

  // Pagination config for AppTable component
  const paginationConfig = computed(() => ({
    enabled: true,
    serverSide: true,
    currentPage: currentPage.value,
    totalItems: totalItems.value,
    itemsPerPage: itemsPerPage.value,
    showPageNumbers: true,
    showItemsPerPageSelector: true,
    pageSizeOptions: [10, 25, 50, 100],
    onPageChange: goToPage,
    onItemsPerPageChange: setItemsPerPage
  }))

  return {
    // State
    currentPage,
    itemsPerPage,
    isLoading,
    data,
    meta,
    
    // Computed
    totalPages,
    totalItems,
    hasNextPage,
    hasPrevPage,
    paginationConfig,
    
    // Methods
    setData,
    goToPage,
    nextPage,
    prevPage,
    setItemsPerPage,
    reset
  }
}
