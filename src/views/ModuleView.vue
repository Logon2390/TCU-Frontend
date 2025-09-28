<template>
  <div class="flex flex-col h-[calc(100vh-15px)] bg-gray-50 p-6">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <button @click="goBack"
            class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Regresar">
            <span class="icon-[lucide--arrow-left] w-5 h-5"></span>
          </button>
          <h1 class="text-2xl font-bold text-gray-900">Perfil de Módulo</h1>
        </div>
      </div>

      <div v-if="module" class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
        <div class="flex items-start gap-6">
          <div class="flex-shrink-0">
            <div class="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-white">
                {{ getInitials(module.name) }}
              </span>
            </div>
          </div>

          <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Nombre del módulo</label>
              <p class="text-lg font-semibold text-gray-900">{{ module.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">ID del módulo</label>
              <p class="text-lg font-semibold text-gray-900">#{{ module.id }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Fecha de creación</label>
              <p class="text-lg font-semibold text-gray-900">{{ formatDate(module.createdAt || '') }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Última actualización</label>
              <p class="text-lg font-semibold text-gray-900">{{ formatDate(module.updatedAt || '') }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Total de visitas</label>
              <p class="text-lg font-semibold text-green-600">{{ totalVisits }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Estado</label>
              <p class="text-lg font-semibold text-gray-900">{{ module.isActive ? 'Visible' : 'Oculto' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="isLoadingModule" class="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div class="animate-pulse">
          <div class="flex items-start gap-6">
            <div class="w-20 h-20 bg-gray-300 rounded-full"></div>
            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="i in 6" :key="i">
                <div class="h-4 bg-gray-300 rounded mb-2"></div>
                <div class="h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-red-50 rounded-lg p-6 border border-red-200">
        <div class="flex items-center gap-3">
          <span class="icon-[lucide--alert-circle] w-6 h-6 text-red-600"></span>
          <div>
            <h3 class="text-lg font-semibold text-red-900">Módulo no encontrado</h3>
            <p class="text-red-700">No se pudo cargar la información del módulo.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-0">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Historial de Visitas</h2>
        <p class="text-gray-600 mt-1">Registro completo de las visitas realizadas a este módulo</p>
      </div>

      <div class="flex-1 overflow-hidden">
        <AppTable :columns="tableColumns" :data="pagination.data.value" 
          :loading="isLoadingRecords || pagination.isLoading.value" 
          :pagination="pagination.paginationConfig.value"
          empty-message="Este módulo no tiene visitas registradas">
          <template #cell-user="{ row }">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-xs font-bold text-white">
                  {{ getUserInitials(row.user?.name || 'Usuario') }}
                </span>
              </div>
              <div>
                <div class="font-medium text-gray-900">{{ row.user?.name || 'Usuario desconocido' }}</div>
                <div class="text-sm text-gray-500">{{ row.user?.document || 'N/A' }}</div>
              </div>
            </div>
          </template>

          <template #cell-visitedAt="{ row }">
            <div class="text-sm">
              <div class="font-medium text-gray-900">{{ formatDate(row.visitedAt) }}</div>
              <div class="text-gray-500">{{ formatTime(row.visitedAt) }}</div>
            </div>
          </template>
        </AppTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppTable from '@/components/common/AppTable.vue'
import { useFetching } from '@/composables/useFetching'
import { usePagination } from '@/composables/usePagination'
import modulesService from '@/service/Modules.service'
import recordService from '@/service/Record.service'
import type { TableColumn } from '@/types/component.types'
import type { Module } from '@/types/modules.types'

const route = useRoute()
const router = useRouter()

const moduleId = parseInt(route.params.id as string)
const module = ref<Module | null>(null)

const pagination = usePagination<any>({ initialLimit: 10 })
const { isLoading: isPaginationLoading, execute: fetchRecordsPaginated } = useFetching(
  (page: number, limit: number) => recordService.getRecordsByModulePaginated(moduleId, page, limit)
)

const { isLoading: isLoadingModule, execute: fetchModule } = useFetching(modulesService.getModuleById)
const { isLoading: isLoadingRecords, execute: fetchRecords } = useFetching(recordService.getRecordsByModule)

const totalVisits = computed(() => pagination.meta.value.totalItems)
const tableColumns: TableColumn[] = [
  {
    key: 'user',
    label: 'Usuario',
    sortable: true,
    align: 'left'
  },
  {
    key: 'visitedAt',
    label: 'Fecha y hora',
    sortable: true,
    align: 'center'
  }
]

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const formatDate = (dateString: string | Date) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goBack = () => {
  router.back()
}

const loadModuleData = async () => {
  if (!moduleId || isNaN(moduleId)) {
    console.error('ID de módulo inválido')
    return
  }

  const moduleResult = await fetchModule(moduleId)
  if (moduleResult?.success && moduleResult.data) {
    module.value = moduleResult.data
  }
}

const loadModuleRecords = async () => {
  if (!moduleId || isNaN(moduleId)) return

  const recordsResult = await fetchRecordsPaginated(pagination.currentPage.value, pagination.itemsPerPage.value)
  if (recordsResult?.success && recordsResult.data) {
    pagination.setData(recordsResult.data)
  }
}

watch([() => pagination.currentPage.value, () => pagination.itemsPerPage.value], async () => {
  await loadModuleRecords()
})

onMounted(async () => {
  await loadModuleData()
  await loadModuleRecords()
})
</script>
