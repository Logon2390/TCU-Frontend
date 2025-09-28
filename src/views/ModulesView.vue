<template>
  <AppLayout :config="layoutConfig" :loading="isLoading">
    <template #actions>
      <AppButton :button-props="{
        variant: 'primary',
        text: 'Nuevo Módulo',
        icon: 'icon-[lucide--plus] text-white',
        onClick: handleCreateModule
      }" custom-style="px-4 py-2 text-sm" />
    </template>

    <template #default="{ searchValue: layoutSearchValue, loading }">
      <AppTable :columns="tableColumns" :data="getFilteredModules(layoutSearchValue)" :loading="loading || isLoading"
        :pagination="{
          enabled: true,
          itemsPerPage: 10,
          showPageNumbers: true,
          showItemsPerPageSelector: true,
          pageSizeOptions: [5, 10, 25, 50]
        }" empty-message="No se encontraron módulos">
        <template #cell-name="{ row }">
          {{ row.name }}
        </template>
        <template #cell-isActive="{ row }">
          {{ row.isActive ? 'Visible' : 'Oculto' }}
        </template>
        <template #cell-createdAt="{ row }">
          {{ formatDate(row.createdAt || '') }}
        </template>
        <template #cell-updatedAt="{ row }">
          {{ formatDate(row.updatedAt || '') }}
        </template>
        <template #cell-actions="{ row }">
          <div class="flex gap-2 justify-center">
            <button @click="handleViewModule(row.id)" class="p-1 text-green-600 hover:text-green-800 transition-colors"
              title="Ver visitas">
              <span class="icon-[lucide--eye] w-4 h-4"></span>
            </button>
            <button @click="handleEditModule(row.id)" class="p-1 text-blue-600 hover:text-blue-800 transition-colors"
              title="Editar">
              <span class="icon-[lucide--edit] w-4 h-4"></span>
            </button>
            <button @click="handleDeleteModule(row.id)" class="p-1 text-red-600 hover:text-red-800 transition-colors"
              title="Eliminar">
              <span class="icon-[lucide--trash-2] w-4 h-4"></span>
            </button>
          </div>
        </template>
      </AppTable>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppTable from '@/components/common/AppTable.vue'
import { modulesLayoutConfig } from '@/config/layout.config'
import { useFetching } from '@/composables/useFetching'
import { useModal } from '@/composables/useModal'
import modulesService from '@/service/Modules.service'
import type { TableColumn } from '@/types/component.types'

const { isLoading, data: modules, execute: fetchModules } = useFetching(modulesService.getModules)
const { showInput, showConfirmation, showToast, showForm } = useModal()
const router = useRouter()

const layoutConfig = modulesLayoutConfig

const tableColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'Nombre',
    sortable: true,
    align: 'left'
  },
  {
    key: 'isActive',
    label: 'Activo',
    sortable: true,
    align: 'center'
  },
  {
    key: 'createdAt',
    label: 'Fecha de creación',
    sortable: true,
    align: 'center'
  },
  {
    key: 'updatedAt',
    label: 'Fecha de actualización',
    sortable: true,
    align: 'center'
  },
  {
    key: 'actions',
    label: 'Acciones',
    width: '150px',
    align: 'center'
  }
]

const getFilteredModules = (searchValue: string) => {
  if (!modules.value?.data) return []

  const modulesList = modules.value.data
  if (!searchValue.trim()) return modulesList

  return modulesList.filter(module =>
    module.name.toLowerCase().includes(searchValue.toLowerCase())
  )
}

async function handleCreateModule() {
  const formConfig = {
    title: 'Nuevo Módulo',
    confirmButtonText: 'Crear Módulo',
    cancelButtonText: 'Cancelar',
    fields: [
      {
        id: 'name',
        label: 'Nombre del módulo',
        type: 'text' as const,
        placeholder: 'Ingrese el nombre del módulo',
        required: true,
        validation: (value: string) => {
          if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres'
          if (value.length > 100) return 'El nombre no puede exceder los 100 caracteres'
          return null
        }
      },
      {
        id: 'isActive',
        label: 'Estado',
        type: 'select' as const,
        placeholder: 'Seleccione el estado',
        required: true,
        value: 'Visible',
        options: ['Visible', 'Oculto']
      }
    ]
  }

  const onSubmitCreate = async (values: Record<string, string>) => {
    const moduleData = {
      name: values.name,
      isActive: values.isActive === 'Visible'
    }

    const createResult = await modulesService.createModule(moduleData)

    if (createResult.success) {
      showToast('success', 'Módulo creado exitosamente')
      await fetchModules()
      return true
    } else {
      showToast('error', createResult.message || 'Error al crear el módulo')
      return false
    }
  }

  await showForm(formConfig, onSubmitCreate)
}

function handleViewModule(id: number) {
  router.push({ name: 'admin-module-profile', params: { id: id.toString() } })
}

async function handleEditModule(id: number) {
  const module = modules.value?.data?.find(m => m.id === id)
  if (!module) return

  const formConfig = {
    title: 'Editar Módulo',
    confirmButtonText: 'Actualizar Módulo',
    cancelButtonText: 'Cancelar',
    fields: [
      {
        id: 'name',
        label: 'Nombre del módulo',
        type: 'text' as const,
        placeholder: 'Ingrese el nombre del módulo',
        required: true,
        value: module.name,
        validation: (value: string) => {
          if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres'
          if (value.length > 100) return 'El nombre no puede exceder los 100 caracteres'
          return null
        }
      },
      {
        id: 'isActive',
        label: 'Estado',
        type: 'select' as const,
        placeholder: 'Seleccione el estado',
        required: true,
        value: module.isActive ? 'Visible' : 'Oculto',
        options: ['Visible', 'Oculto']
      }
    ]
  }

  const onSubmitEdit = async (values: Record<string, string>) => {
    const moduleData = {
      name: values.name,
      isActive: values.isActive === 'Visible'
    }

    const updateResult = await modulesService.updateModule(id, moduleData)

    if (updateResult.success) {
      showToast('success', 'Módulo actualizado exitosamente')
      await fetchModules()
      return true
    } else {
      showToast('error', updateResult.message || 'Error al actualizar el módulo')
      return false
    }
  }

  await showForm(formConfig, onSubmitEdit)
}

async function handleDeleteModule(id: number) {
  const module = modules.value?.data?.find(m => m.id === id)
  if (!module) return

  const result = await showConfirmation(
    '¿Eliminar módulo?',
    `¿Está seguro de que desea eliminar el módulo "${module.name}"? Esta acción no se puede deshacer.`
  )

  if (result.isConfirmed) {
    const deleteResult = await modulesService.deleteModule(id)

    if (deleteResult.success) {
      showToast('success', 'Módulo eliminado exitosamente')
      await fetchModules()
    } else {
      showToast('error', deleteResult.message || 'Error al eliminar el módulo')
    }
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}


onMounted(async () => {
  await fetchModules()
})

</script>
