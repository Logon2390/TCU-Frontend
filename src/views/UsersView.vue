<template>
    <AppLayout :config="layoutConfig" :loading="isPaginationLoading || pagination.isLoading.value">
        <template #filters="{ searchValue, updateSearch }">
            <AppInput v-model="documentSearch"
                :label-props="{ id: 'document-search', label: '' }" :input-props="{
                    type: 'text',
                    placeholder: 'Buscar por documento...',
                    icon: 'icon-[lucide--search]'
                }" />
        </template>

        <template #actions>
            <AppButton :button-props="{
                variant: 'primary',
                text: 'Nuevo Usuario',
                icon: 'icon-[lucide--plus] text-white',
                onClick: handleCreateUser
            }" custom-style="px-4 py-2 text-sm" />
        </template>

        <template #default="{ searchValue: layoutSearchValue, loading }">
            <AppTable :columns="tableColumns" :data="displayUsers" 
                :loading="loading || isPaginationLoading || isSearching || pagination.isLoading.value"
                :pagination="isSearchMode ? { enabled: false } : pagination.paginationConfig.value" 
                empty-message="No se encontraron usuarios">
                <template #cell-document="{ row }">
                    {{ row.document }}
                </template>
                <template #cell-name="{ row }">
                    {{ row.name }}
                </template>
                <template #cell-gender="{ row }">
                    {{ getGenderLabel(row.gender) }}
                </template>
                <template #cell-birthday="{ row }">
                    {{ formatDate(row.birthday) }}
                </template>
                <template #cell-lastRecord="{ row }">
                    {{ formatDate(row.lastRecord) }}
                </template>

                <template #cell-actions="{ row }">
                    <div class="flex gap-2 justify-center">
                        <button @click="handleViewUser(row.id)"
                            class="p-1 text-blue-600 hover:text-blue-800 transition-colors" title="Ver">
                            <span class="icon-[lucide--eye] w-4 h-4"></span>
                        </button>
                        <button @click="handleEditUser(row.id)"
                            class="p-1 text-blue-600 hover:text-blue-800 transition-colors" title="Editar">
                            <span class="icon-[lucide--edit] w-4 h-4"></span>
                        </button>
                        <button @click="handleDeleteUser(row.id)"
                            class="p-1 text-red-600 hover:text-red-800 transition-colors" title="Eliminar">
                            <span class="icon-[lucide--trash-2] w-4 h-4"></span>
                        </button>
                    </div>
                </template>
            </AppTable>
        </template>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppTable from '@/components/common/AppTable.vue'
import AppInput from '@/components/common/AppInput.vue'
import { usersLayoutConfig } from '@/config/layout.config'
import { useFetching } from '@/composables/useFetching'
import { usePagination } from '@/composables/usePagination'
import { useModal } from '@/composables/useModal'
import { useDebounce } from '@/composables/useDebounce'
import userService from '@/service/User.service'
import type { TableColumn } from '@/types/component.types'
import type { User } from '@/types/user.types'
import { GENDER_OPTIONS } from '@/types/form.types'

const { isLoading: isSearching, data: searchData, execute: searchByDocument } = useFetching(userService.getUserByDocument)
const { isLoading: isCreating, execute: executeCreateUser } = useFetching(userService.createUser)
const { isLoading: isUpdating, execute: executeUpdateUser } = useFetching(userService.updateUser)
const { showConfirmation, showToast, showForm } = useModal()
const router = useRouter()

const pagination = usePagination<User>({ initialLimit: 10 })
const { isLoading: isPaginationLoading, execute: fetchUsersPaginated } = useFetching(
  (page: number, limit: number) => userService.getUsersPaginated(page, limit)
)

const layoutConfig = usersLayoutConfig
const genderOptions = [...GENDER_OPTIONS]

const documentSearch = ref('')
const debouncedDocumentSearch = useDebounce(documentSearch, 500)
const isSearchMode = ref(false)
const searchResults = ref<User[]>([])
const displayUsers = computed(() => isSearchMode.value ? searchResults.value : pagination.data.value)
const tableColumns: TableColumn[] = [
    {
        key: 'document',
        label: 'Documento',
        sortable: true,
        align: 'left'
    },
    {
        key: 'name',
        label: 'Nombre',
        sortable: true,
        align: 'left'
    },
    {
        key: 'gender',
        label: 'Género',
        sortable: true,
        align: 'center'
    },
    {
        key: 'birthday',
        label: 'Fecha de Nacimiento',
        sortable: true,
        align: 'center'
    },
    {
        key: 'lastRecord',
        label: 'Última Visita',
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

const getGenderLabel = (genderValue: string) => {
    const option = genderOptions.find(opt => opt.value === genderValue)
    return option ? option.label : genderValue
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
}

const performSearch = async (searchTerm: string) => {
    if (searchTerm.trim()) {
        isSearchMode.value = true
        const result = await searchByDocument(searchTerm.trim())
        if (result?.success && result.data) {
            searchResults.value = [result.data]
        } else {
            searchResults.value = []
        }
    } else {
        isSearchMode.value = false
        searchResults.value = []
        await loadUsers()
    }
}

watch(debouncedDocumentSearch, (newValue) => {
    performSearch(newValue)
})

watch([() => pagination.currentPage.value, () => pagination.itemsPerPage.value], async () => {
    if (!isSearchMode.value) {
        await loadUsers()
    }
})

const loadUsers = async () => {
    const result = await fetchUsersPaginated(pagination.currentPage.value, pagination.itemsPerPage.value)
    if (result?.success && result.data) {
        pagination.setData(result.data)
    }
}

const handleCreateUser = async () => {
    const formConfig = {
        title: 'Nuevo Usuario',
        confirmButtonText: 'Crear Usuario',
        cancelButtonText: 'Cancelar',
        fields: [
            {
                id: 'document',
                label: 'Documento',
                type: 'text' as const,
                placeholder: 'Ingrese el número de documento',
                required: true,
                validation: (value: string) => {
                    if (value.length < 3) return 'El documento debe tener al menos 3 caracteres'
                    return null
                }
            },
            {
                id: 'name',
                label: 'Nombre completo',
                type: 'text' as const,
                placeholder: 'Ingrese el nombre completo',
                required: true,
                validation: (value: string) => {
                    if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres'
                    return null
                }
            },
            {
                id: 'birthday',
                label: 'Fecha de nacimiento',
                type: 'date' as const,
                required: true
            },
            {
                id: 'gender',
                label: 'Género',
                type: 'select' as const,
                placeholder: 'Seleccione el género',
                required: true,
                options: genderOptions.map(option => option.label)
            }
        ]
    }

    const onSubmitCreate = async (values: Record<string, string>) => {
        const genderOption = genderOptions.find(option => option.label === values.gender)
        const userData = {
            document: values.document,
            name: values.name,
            birthday: values.birthday,
            gender: genderOption?.value || values.gender
        }

        const createResult = await executeCreateUser(userData)

        if (createResult?.success) {
            showToast('success', 'Usuario creado exitosamente')
            await loadUsers()
            return true
        } else {
            showToast('error', createResult?.message || 'Error al crear el usuario')
            return false
        }
    }

    await showForm(formConfig, onSubmitCreate)
}

const handleViewUser = (id: number) => {
    router.push({ name: 'admin-user-profile', params: { id: id.toString() } })
}

const handleEditUser = async (id: number) => {
    const user = displayUsers.value.find(u => u.id === id)
    if (!user) return

    const currentGenderLabel = getGenderLabel(user.gender)

    const formConfig = {
        title: 'Editar Usuario',
        confirmButtonText: 'Actualizar Usuario',
        cancelButtonText: 'Cancelar',
        fields: [
            {
                id: 'document',
                label: 'Documento',
                type: 'text' as const,
                placeholder: 'Ingrese el número de documento',
                required: true,
                value: user.document,
                validation: (value: string) => {
                    if (value.length < 3) return 'El documento debe tener al menos 3 caracteres'
                    return null
                }
            },
            {
                id: 'name',
                label: 'Nombre completo',
                type: 'text' as const,
                placeholder: 'Ingrese el nombre completo',
                required: true,
                value: user.name,
                validation: (value: string) => {
                    if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres'
                    return null
                }
            },
            {
                id: 'birthday',
                label: 'Fecha de nacimiento',
                type: 'date' as const,
                required: true,
                value: user.birthday
            },
            {
                id: 'gender',
                label: 'Género',
                type: 'select' as const,
                placeholder: 'Seleccione el género',
                required: true,
                value: currentGenderLabel,
                options: genderOptions.map(option => option.label)
            }
        ]
    }

    const onSubmitEdit = async (values: Record<string, string>) => {
        const genderOption = genderOptions.find(option => option.label === values.gender)
        const userData = {
            document: values.document,
            name: values.name,
            birthday: values.birthday,
            gender: genderOption?.value || values.gender
        }

        const updateResult = await executeUpdateUser(id, userData)

        if (updateResult?.success) {
            showToast('success', 'Usuario actualizado exitosamente')
            await loadUsers()
            return true
        } else {
            showToast('error', updateResult?.message || 'Error al actualizar el usuario')
            return false
        }
    }

    await showForm(formConfig, onSubmitEdit)
}

const handleDeleteUser = async (id: number) => {
    const user = displayUsers.value.find(u => u.id === id)
    if (!user) return

    const result = await showConfirmation(
        '¿Eliminar usuario?',
        `¿Está seguro de que desea eliminar al usuario "${user.name}"? Esta acción no se puede deshacer.
        Al eliminar el usuario, se eliminarán todas las visitas asociadas a él.`
    )

    if (result.isConfirmed) {
        const deleteResult = await userService.deleteUser(id)

        if (deleteResult.success) {
            showToast('success', 'Usuario eliminado exitosamente')
            await loadUsers()
        } else {
            showToast('error', deleteResult.message || 'Error al eliminar el usuario')
        }
    }
}

onMounted(async () => {
    await loadUsers()
})
</script>
