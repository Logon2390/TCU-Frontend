<template>
    <div class="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Loader v-if="loading" :message="'Cargando datos...'" />
        <div v-else-if="data.length > 0">
            <div v-if="!isMobile" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead :class="striped ? 'bg-gray-50' : 'bg-white'">
                        <tr>
                            <th v-for="column in columns" :key="column.key" :style="{ width: column.width }" :class="[
                                'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider',
                                getAlignment(column.align),
                                column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : '',
                                bordered ? 'border-r border-gray-200 last:border-r-0' : ''
                            ]" @click="handleSort(column)">
                                <div class="flex items-center justify-between">
                                    <span>{{ column.label }}</span>
                                    <span v-if="column.sortable" class="ml-1">
                                        <span v-if="sortColumn === column.key && sortDirection === 'asc'"
                                            class="icon-[lucide--chevron-up] w-4 h-4 text-blue-600" />
                                        <span v-else-if="sortColumn === column.key && sortDirection === 'desc'"
                                            class="icon-[lucide--chevron-down] w-4 h-4 text-blue-600" />
                                        <span v-else class="icon-[lucide--chevrons-up-down] w-4 h-4 text-gray-400" />
                                    </span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody :class="striped ? 'bg-white divide-y divide-gray-200' : 'divide-y divide-gray-200'">
                        <tr v-for="(row, index) in paginatedData" :key="index" :class="[
                            striped && index % 2 === 1 ? 'bg-gray-50' : 'bg-white',
                            hoverable ? 'hover:bg-gray-50' : '',
                            onRowClick ? 'cursor-pointer' : '',
                            'transition-colors duration-150'
                        ]" @click="handleRowClick(row)">
                            <td v-for="column in columns" :key="column.key" :class="[
                                'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                                getAlignment(column.align),
                                bordered ? 'border-r border-gray-200 last:border-r-0' : ''
                            ]">
                                <span v-if="column.formatter">
                                    {{ column.formatter(row[column.key]) }}
                                </span>
                                <span v-else>
                                    {{ row[column.key] || '-' }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else class="divide-y divide-gray-200">
                <div v-for="(row, index) in paginatedData" :key="index" :class="[
                    'p-4 space-y-3',
                    onRowClick ? 'cursor-pointer hover:bg-gray-50' : '',
                    'transition-colors duration-150'
                ]" @click="handleRowClick(row)">
                    <div v-for="column in columns" :key="column.key" class="flex justify-between items-start">
                        <span class="text-sm font-medium text-gray-500 min-w-0 flex-1">
                            {{ column.label }}:
                        </span>
                        <span class="text-sm text-gray-900 text-right ml-4 flex-1">
                            <span v-if="column.formatter">
                                {{ column.formatter(row[column.key]) }}
                            </span>
                            <span v-else>
                                {{ row[column.key] || '-' }}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            <Pagination v-if="pagination?.enabled" :current-page="currentPage" :total-items="sortedData.length"
                :items-per-page="itemsPerPage" :show-page-numbers="pagination.showPageNumbers"
                :show-items-per-page-selector="pagination.showItemsPerPageSelector"
                :page-size-options="pagination.pageSizeOptions || [5, 10, 25, 50]" @page-change="handlePageChange"
                @items-per-page-change="handleItemsPerPageChange" />
        </div>

        <div v-else class="flex flex-col items-center justify-center py-12 px-4">
            <span class="icon-[lucide--inbox] w-12 h-12 text-gray-400 mb-4" />
            <p class="text-gray-500 text-center">{{ emptyMessage || 'No hay datos disponibles' }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import Loader from '@/components/features/Loader.vue'
import Pagination from '@/components/common/Pagination.vue'
import type { TableProps, TableColumn } from '@/types/component.types'

const props = withDefaults(defineProps<TableProps>(), {
    loading: false,
    responsive: true,
    striped: true,
    bordered: false,
    hoverable: true,
    emptyMessage: 'No hay datos disponibles',
    pagination: () => ({
        enabled: true,
        itemsPerPage: 10,
        showPageNumbers: true,
        showItemsPerPageSelector: true,
        pageSizeOptions: [5, 10, 25, 50]
    })
})

const currentPage = ref(1)
const sortColumn = ref<string>('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const itemsPerPage = ref(props.pagination?.itemsPerPage || 10)
const isMobile = ref(false)

const sortedData = computed(() => {
    if (!sortColumn.value) return props.data

    return [...props.data].sort((a, b) => {
        const aVal = a[sortColumn.value]
        const bVal = b[sortColumn.value]

        if (aVal === bVal) return 0

        const result = aVal < bVal ? -1 : 1
        return sortDirection.value === 'asc' ? result : -result
    })
})

const paginatedData = computed(() => {
    if (!props.pagination?.enabled) return sortedData.value

    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return sortedData.value.slice(start, end)
})

const getAlignment = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
        case 'center': return 'text-center'
        case 'right': return 'text-right'
        default: return 'text-left'
    }
}

const handleSort = (column: TableColumn) => {
    if (!column.sortable) return

    if (sortColumn.value === column.key) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortColumn.value = column.key
        sortDirection.value = 'asc'
    }

    currentPage.value = 1
    props.onSort?.(column.key, sortDirection.value)
}

const handleRowClick = (row: Record<string, any>) => {
    props.onRowClick?.(row)
}

const handlePageChange = (page: number) => {
    currentPage.value = page
}

const handleItemsPerPageChange = (newItemsPerPage: number) => {
    itemsPerPage.value = newItemsPerPage
    currentPage.value = 1
}

const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
}

watch(() => props.data, () => {
    currentPage.value = 1
})

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})
</script>
