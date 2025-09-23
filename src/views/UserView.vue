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
          <h1 class="text-2xl font-bold text-gray-900">Perfil de Usuario</h1>
        </div>
      </div>

      <div v-if="user" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div class="flex items-start gap-6">
          <div class="flex-shrink-0">
            <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-white">
                {{ getInitials(user.name) }}
              </span>
            </div>
          </div>

          <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Nombre completo</label>
              <p class="text-lg font-semibold text-gray-900">{{ user.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Documento</label>
              <p class="text-lg font-semibold text-gray-900">{{ user.document }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Género</label>
              <p class="text-lg font-semibold text-gray-900">{{ getGenderLabel(user.gender) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Fecha de nacimiento</label>
              <p class="text-lg font-semibold text-gray-900">{{ formatDate(user.birthday) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Última visita</label>
              <p class="text-lg font-semibold text-gray-900">
                {{ user.lastRecord ? formatDateTime(user.lastRecord) : 'Sin visitas' }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Total de visitas</label>
              <p class="text-lg font-semibold text-blue-600">{{ records.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="isLoadingUser" class="bg-gray-50 rounded-lg p-6 border border-gray-200">
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
            <h3 class="text-lg font-semibold text-red-900">Usuario no encontrado</h3>
            <p class="text-red-700">No se pudo cargar la información del usuario.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-0">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Historial de Visitas</h2>
        <p class="text-gray-600 mt-1">Registro completo de las visitas realizadas por este usuario</p>
      </div>

      <div class="flex-1 overflow-hidden">
        <AppTable :columns="tableColumns" :data="records" :loading="isLoadingRecords" :pagination="{
          enabled: true,
          itemsPerPage: 10,
          showPageNumbers: true,
          showItemsPerPageSelector: true,
          pageSizeOptions: [5, 10, 25, 50]
        }" empty-message="Este usuario no tiene visitas registradas">
          <template #cell-module="{ row }">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span class="font-medium text-gray-900">{{ row.module.name }}</span>
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppTable from '@/components/common/AppTable.vue'
import { useFetching } from '@/composables/useFetching'
import userService from '@/service/User.service'
import recordService from '@/service/Record.service'
import type { User } from '@/types/user.types'
import type { Registration } from '@/types/form.types'
import type { TableColumn } from '@/types/component.types'
import { GENDER_OPTIONS } from '@/types/form.types'

const route = useRoute()
const router = useRouter()

const userId = parseInt(route.params.id as string)
const user = ref<User | null>(null)
const records = ref<Registration[]>([])

const { isLoading: isLoadingUser, execute: fetchUser } = useFetching(userService.getUserById)
const { isLoading: isLoadingRecords, execute: fetchRecords } = useFetching(recordService.getRecordsByUser)

const tableColumns: TableColumn[] = [
  {
    key: 'module',
    label: 'Módulo visitado',
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

const getGenderLabel = (genderValue: string) => {
  const option = GENDER_OPTIONS.find(opt => opt.value === genderValue)
  return option ? option.label : genderValue
}

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string | Date) => {
  const date = new Date(dateString)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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

const loadUserData = async () => {
  if (!userId || isNaN(userId)) {
    console.error('ID de usuario inválido')
    return
  }

  const userResult = await fetchUser(userId)
  if (userResult?.success && userResult.data) {
    user.value = userResult.data
  }
}

const loadUserRecords = async () => {
  if (!userId || isNaN(userId)) return

  const recordsResult = await fetchRecords(userId)
  if (recordsResult?.success && recordsResult.data) {
    records.value = recordsResult.data
  }
}

onMounted(async () => {
  await Promise.all([
    loadUserData(),
    loadUserRecords()
  ])
})
</script>
