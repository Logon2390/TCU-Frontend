<template>
    <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t border-gray-200 bg-white">
        <div class="flex items-center gap-4 text-sm text-gray-700">
            <span>
                Mostrando {{ startItem }}-{{ endItem }} de {{ totalItems }} elementos
            </span>

            <div v-if="showItemsPerPageSelector" class="flex items-center gap-2">
                <Select :label-props="{ id: 'itemsPerPage' }" :select-props="{
                    options: pageSizeOptions.map(size => size.toString()),
                    onChange: handleItemsPerPageChange,
                    placeholder: ''
                }" :error-props="{ onError: false }" :model-value="itemsPerPage.toString()"
                    custom-style="min-w-[80px]" />
                <span class="text-sm text-gray-600">por página</span>
            </div>
        </div>

        <div v-if="totalPages > 1" class="flex items-center gap-1">
            <Button :button-props="{
                variant: 'custom',
                text: 'Primera',
                disabled: currentPage === 1,
                onClick: () => $emit('pageChange', 1)
            }" :custom-style="paginationButtonStyle" />

            <Button :button-props="{
                variant: 'custom',
                text: '',
                icon: 'icon-[lucide--chevron-left]',
                disabled: currentPage === 1,
                onClick: () => $emit('pageChange', currentPage - 1)
            }" :custom-style="paginationIconButtonStyle" />

            <div v-if="showPageNumbers" class="hidden sm:flex items-center gap-1">
                <Button v-for="page in visiblePages" :key="page" :button-props="{
                    variant: 'custom',
                    text: page.toString(),
                    onClick: () => $emit('pageChange', page)
                }" :custom-style="page === currentPage ? paginationActiveButtonStyle : paginationNumberButtonStyle" />
            </div>

            <Button :button-props="{
                variant: 'custom',
                text: '',
                icon: 'icon-[lucide--chevron-right]',
                disabled: currentPage === totalPages,
                onClick: () => $emit('pageChange', currentPage + 1)
            }" :custom-style="paginationIconButtonStyle" />

            <Button :button-props="{
                variant: 'custom',
                text: 'Última',
                disabled: currentPage === totalPages,
                onClick: () => $emit('pageChange', totalPages)
            }" :custom-style="paginationButtonStyle" />
        </div>

        <div v-if="totalPages > 1" class="flex sm:hidden justify-center">
            <span class="text-sm text-gray-700">
                Página {{ currentPage }} de {{ totalPages }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Select from '@/components/common/Select.vue'
import Button from '@/components/common/Button.vue'
import type { PaginationProps } from '@/types/component.types'

const props = withDefaults(defineProps<PaginationProps>(), {
    showPageNumbers: true,
    showItemsPerPageSelector: true,
    pageSizeOptions: () => [5, 10, 25, 50]
})

const emit = defineEmits<{
    pageChange: [page: number]
    itemsPerPageChange: [itemsPerPage: number]
}>()

const paginationBaseStyle = 'px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
const paginationButtonStyle = `${paginationBaseStyle} text-gray-500 bg-white border-gray-300 hover:bg-gray-50`
const paginationIconButtonStyle = `${paginationButtonStyle} flex items-center justify-center`
const paginationNumberButtonStyle = `${paginationBaseStyle} text-gray-700 bg-white border-gray-300 hover:bg-gray-50`
const paginationActiveButtonStyle = `${paginationBaseStyle} bg-blue-600 text-white border-blue-600 hover:bg-blue-700`

const totalPages = computed(() =>
    Math.ceil(props.totalItems / props.itemsPerPage)
)

const startItem = computed(() =>
    (props.currentPage - 1) * props.itemsPerPage + 1
)

const endItem = computed(() =>
    Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
)

const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

const handleItemsPerPageChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    const newItemsPerPage = parseInt(target.value)
    emit('itemsPerPageChange', newItemsPerPage)
}
</script>
