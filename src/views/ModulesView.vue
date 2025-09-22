<template>
  <AppLayout :config="layoutConfig" :loading="isLoading">
    <template #actions>
      <AppButton
        :button-props="{
          variant: 'primary',
          text: 'Nuevo Módulo',
          icon: 'icon-[lucide--plus] text-white',
          onClick: handleCreateModule
        }"
        custom-style="px-4 py-2 text-sm"
      />
    </template>

    <template #default="{ searchValue: layoutSearchValue, loading }">
      <AppTable
        :columns="tableColumns"
        :data="getFilteredModules(layoutSearchValue)"
        :loading="loading || isLoading"
        :pagination="{
          enabled: true,
          itemsPerPage: 10,
          showPageNumbers: true,
          showItemsPerPageSelector: true,
          pageSizeOptions: [5, 10, 25, 50]
        }"
        empty-message="No se encontraron módulos"
      >
        <template #cell-actions="{ row }">
          <div class="flex gap-2 justify-center">
            <button 
              @click="handleEditModule(row.id)"
              class="p-1 text-blue-600 hover:text-blue-800 transition-colors"
              title="Editar"
            >
              <span class="icon-[lucide--edit] w-4 h-4"></span>
            </button>
            <button 
              @click="handleDeleteModule(row.id)"
              class="p-1 text-red-600 hover:text-red-800 transition-colors"
              title="Eliminar"
            >
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
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppTable from '@/components/common/AppTable.vue'
import { modulesLayoutConfig } from '@/config/modules.config'
import { useFetching } from '@/composables/useFetching'
import { useModal } from '@/composables/useModal'
import modulesService from '@/service/Modules.service'
import type { TableColumn } from '@/types/component.types'

const { isLoading, data: modules, execute: fetchModules } = useFetching(modulesService.getModules)
const { showInput, showConfirmation, showToast } = useModal()

const layoutConfig = modulesLayoutConfig

const tableColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'Nombre',
    sortable: true,
    align: 'left'
  },
  {
    key: 'actions',
    label: 'Acciones',
    width: '120px',
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
  const result = await showInput(
    'Nuevo Módulo',
    'text',
    'Ingrese el nombre del módulo (máximo 100 caracteres)',
    ''
  )

  if (result.isConfirmed && result.value) {
    if (typeof result.value === 'string' && result.value.length > 100) {
      showToast('error', 'El nombre del módulo no puede exceder los 100 caracteres')
      return
    }

    const createResult = await modulesService.createModule({ name: result.value as string })
    
    if (createResult.success) {
      showToast('success', 'Módulo creado exitosamente')
      await fetchModules()
    } else {
      showToast('error', createResult.message || 'Error al crear el módulo')
    }
  }
}

async function handleEditModule(id: number) {
  const module = modules.value?.data?.find(m => m.id === id)
  if (!module) return

  const result = await showInput(
    'Editar Módulo',
    'text',
    'Ingrese el nuevo nombre del módulo (máximo 100 caracteres)',
    module.name
  )

  if (result.isConfirmed && result.value) {
    if (typeof result.value === 'string' && result.value.length > 100) {
      showToast('error', 'El nombre del módulo no puede exceder los 100 caracteres')
      return
    }

    const updateResult = await modulesService.updateModule(id, { name: result.value as string })
    
    if (updateResult.success) {
      showToast('success', 'Módulo actualizado exitosamente')
      await fetchModules()
    } else {
      showToast('error', updateResult.message || 'Error al actualizar el módulo')
    }
  }
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


onMounted(async () => {
  await fetchModules()
})

</script>
