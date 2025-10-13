<template>
    <AppLayout :config="layoutConfig" :loading="isLoading">
        <template #filters="{ searchValue, updateSearch }">
            <AppInput v-model="emailSearch" :label-props="{ id: 'email-search', label: '' }" :input-props="{
                type: 'email',
                placeholder: 'Buscar por email...',
                icon: 'icon-[lucide--search]'
            }" />
        </template>

        <template #actions>
            <AppButton :button-props="{
                variant: 'primary',
                text: 'Nuevo Administrador',
                icon: 'icon-[lucide--plus] text-white',
                onClick: handleCreateAdmin
            }" custom-style="px-4 py-2 text-sm" />
        </template>

        <template #default="{ searchValue: layoutSearchValue, loading }">
            <AppTable :columns="tableColumns" :data="admins || []" :loading="loading || isLoading || isSearching"
                :pagination="{
                    enabled: true,
                    itemsPerPage: 10,
                    showPageNumbers: true,
                    showItemsPerPageSelector: true,
                    pageSizeOptions: [5, 10, 25, 50]
                }" empty-message="No se encontraron administradores">
                <template #cell-name="{ row }">
                    {{ row.name }}
                </template>
                <template #cell-email="{ row }">
                    {{ row.email }}
                </template>
                <template #cell-role="{ row }">
                    <span :class="getRoleClass(row.role)">
                        {{ getRoleLabel(row.role) }}
                    </span>
                </template>
                <template #cell-createdAt="{ row }">
                    {{ formatDate(row.createdAt) }}
                </template>
                <template #cell-updatedAt="{ row }">
                    {{ formatDate(row.updatedAt) }}
                </template>
                <template #cell-actions="{ row }">
                    <div class="flex gap-2 justify-center">
                        <button @click="handleEditAdmin(row.id)"
                            class="p-1 text-blue-600 hover:text-blue-800 transition-colors" title="Editar">
                            <span class="icon-[lucide--edit] w-4 h-4"></span>
                        </button>
                        <button @click="handleDeleteAdmin(row.id)"
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
import { ref, onMounted, watch } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppTable from '@/components/common/AppTable.vue'
import AppInput from '@/components/common/AppInput.vue'
import { adminsLayoutConfig } from '@/config/layout.config'
import { useFetching } from '@/composables/useFetching'
import { useModal } from '@/composables/useModal'
import { useDebounce } from '@/composables/useDebounce'
import adminService from '@/service/Admin.service'
import type { TableColumn } from '@/types/component.types'
import type { Admin } from '@/types/admin.types'
import { ROLE_OPTIONS } from '@/types/admin.types'

const { isLoading, data: adminsData, execute: fetchAdmins } = useFetching(adminService.getAdmins)
const { isLoading: isSearching, data: searchData, execute: searchByEmail } = useFetching(adminService.getAdminById)
const { isLoading: isCreating, execute: executeCreateAdmin } = useFetching(adminService.createAdmin)
const { isLoading: isUpdating, execute: executeUpdateAdmin } = useFetching(adminService.updateAdmin)
const { isLoading: isSendingCode, execute: executeSendCode } = useFetching(adminService.sendVerificationCode)
const { showConfirmation, showToast, showForm, showFormWithWarning } = useModal()

const layoutConfig = adminsLayoutConfig
const roleOptions = [...ROLE_OPTIONS]

const admins = ref<Admin[]>([])
const emailSearch = ref('')
const debouncedEmailSearch = useDebounce(emailSearch, 500)

const tableColumns: TableColumn[] = [
    {
        key: 'name',
        label: 'Nombre',
        sortable: true,
        align: 'left'
    },
    {
        key: 'email',
        label: 'Email',
        sortable: true,
        align: 'left'
    },
    {
        key: 'role',
        label: 'Rol',
        sortable: true,
        align: 'center'
    },
    {
        key: 'createdAt',
        label: 'Fecha de Creación',
        sortable: true,
        align: 'center'
    },
    {
        key: 'updatedAt',
        label: 'Fecha de Actualización',
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

const getRoleLabel = (roleValue: string) => {
    const option = roleOptions.find(opt => opt.value === roleValue)
    return option ? option.label : roleValue
}

const getRoleClass = (roleValue: string) => {
    return roleValue === 'M'
        ? 'px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
        : 'px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
}

const sendVerificationCode = async () => {
    const result = await executeSendCode()
    if (result?.success) {
        return {
            success: true,
            message: 'Código de verificación enviado exitosamente'
        }
    } else {
        return {
            success: false,
            message: result?.message || 'Error al enviar código de verificación'
        }
    }
}


const performSearch = async (searchTerm: string) => {
    if (searchTerm.trim()) {
        const filtered = (adminsData.value?.data || []).filter(admin =>
            admin.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        admins.value = filtered
    } else {
        await loadAllAdmins()
    }
}

watch(debouncedEmailSearch, (newValue) => {
    performSearch(newValue)
})

const loadAllAdmins = async () => {
    await fetchAdmins()
    if (adminsData.value?.success && adminsData.value.data) {
        admins.value = adminsData.value.data
    }
}

const showMasterRoleWarning = async (): Promise<boolean> => {
    const result = await showConfirmation(
        'Rol Master seleccionado',
        'El rol Master tiene permisos completos incluyendo la gestión de administradores. ¿Está seguro de asignar este rol?'
    )
    return result.isConfirmed
}

const handleCreateAdmin = async () => {
    const formConfig = {
        title: 'Nuevo Administrador',
        confirmButtonText: 'Crear Administrador',
        cancelButtonText: 'Cancelar',
        fields: [
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
                id: 'email',
                label: 'Email',
                type: 'email' as const,
                placeholder: 'Ingrese el email',
                required: true,
                validation: (value: string) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (!emailRegex.test(value)) return 'Ingrese un email válido'
                    return null
                }
            },
            {
                id: 'password',
                label: 'Contraseña',
                type: 'password' as const,
                placeholder: 'Ingrese la contraseña',
                required: true,
                validation: (value: string) => {
                    if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
                    return null
                }
            },
            {
                id: 'role',
                label: 'Rol',
                type: 'select' as const,
                placeholder: 'Seleccione el rol',
                required: true,
                value: 'Admin',
                options: roleOptions.map(option => option.label)
            },
            {
                id: 'code',
                label: 'Código de verificación',
                type: 'input-with-action' as const,
                placeholder: 'Ingrese el código de 6 dígitos',
                required: true,
                inputClass: 'flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center text-lg tracking-widest',
                helperText: 'Haga clic en el botón para recibir el código de verificación',
                actionButton: {
                    icon: 'icon-[lucide--send]',
                    title: 'Enviar código de verificación',
                    onClick: sendVerificationCode,
                    loadingIcon: 'icon-[lucide--loader-2] animate-spin'
                },
                validation: (value: string) => {
                    if (!/^\d{6}$/.test(value)) return 'El código debe tener exactamente 6 dígitos numéricos'
                    return null
                }
            }
        ]
    }

    const onSubmitCreate = async (values: Record<string, string>) => {
        const roleOption = roleOptions.find(option => option.label === values.role)
        const selectedRole = roleOption?.value || 'A'

        if (selectedRole === 'M') {
            const confirmed = await showMasterRoleWarning()
            if (!confirmed) return false
        }

        const adminData = {
            name: values.name,
            email: values.email,
            password: values.password,
            role: selectedRole as 'M' | 'A',
            code: values.code,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const createResult = await executeCreateAdmin(adminData)

        if (createResult?.success) {
            showToast('success', 'Administrador creado exitosamente')
            await loadAllAdmins()
            return true
        } else {
            showToast('error', createResult?.message || 'Error al crear el administrador')
            return false
        }
    }

    await showForm(formConfig, onSubmitCreate)
}

const handleEditAdmin = async (id: number) => {
    const admin = admins.value.find(a => a.id === id)
    if (!admin) return

    const currentRoleLabel = getRoleLabel(admin.role)

    const formConfig = {
        title: 'Editar Administrador',
        confirmButtonText: 'Actualizar Administrador',
        cancelButtonText: 'Cancelar',
        fields: [
            {
                id: 'name',
                label: 'Nombre completo',
                type: 'text' as const,
                placeholder: 'Ingrese el nombre completo',
                required: true,
                value: admin.name,
                validation: (value: string) => {
                    if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres'
                    return null
                }
            },
            {
                id: 'email',
                label: 'Email',
                type: 'email' as const,
                placeholder: 'Ingrese el email',
                required: true,
                value: admin.email,
                validation: (value: string) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (!emailRegex.test(value)) return 'Ingrese un email válido'
                    return null
                }
            },
            {
                id: 'role',
                label: 'Rol',
                type: 'select' as const,
                placeholder: 'Seleccione el rol',
                required: true,
                value: currentRoleLabel,
                options: roleOptions.map(option => option.label)
            },
            {
                id: 'code',
                label: 'Código de verificación',
                type: 'input-with-action' as const,
                placeholder: 'Ingrese el código de 6 dígitos',
                required: true,
                inputClass: 'flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center text-lg tracking-widest',
                helperText: 'Haga clic en el botón para recibir el código de verificación',
                actionButton: {
                    icon: 'icon-[lucide--send]',
                    title: 'Enviar código de verificación',
                    onClick: sendVerificationCode,
                    loadingIcon: 'icon-[lucide--loader-2] animate-spin'
                },
                validation: (value: string) => {
                    if (!/^\d{6}$/.test(value)) return 'El código debe tener exactamente 6 dígitos numéricos'
                    return null
                }
            }
        ]
    }

    const onSubmitEdit = async (values: Record<string, string>) => {
        const roleOption = roleOptions.find(option => option.label === values.role)
        const selectedRole = roleOption?.value || 'A'

        if (selectedRole === 'M' && admin.role !== 'M') {
            const confirmed = await showMasterRoleWarning()
            if (!confirmed) return false
        }

        const adminData = {
            name: values.name,
            email: values.email,
            role: selectedRole as 'M' | 'A',
            code: values.code,
            updatedAt: new Date().toISOString()
        }

        const updateResult = await executeUpdateAdmin(id, adminData)

        if (updateResult?.success) {
            showToast('success', 'Administrador actualizado exitosamente')
            await loadAllAdmins()
            return true
        } else {
            showToast('error', updateResult?.message || 'Error al actualizar el administrador')
            return false
        }
    }

    await showForm(formConfig, onSubmitEdit)
}

const handleDeleteAdmin = async (id: number) => {
    const admin = admins.value.find(a => a.id === id)
    if (!admin) return

    const deleteFormConfig = {
        title: `¿Eliminar administrador "${admin.name}"?`,
        confirmButtonText: 'Eliminar Administrador',
        cancelButtonText: 'Cancelar',
        fields: [
            {
                id: 'code',
                label: 'Código de verificación',
                type: 'input-with-action' as const,
                placeholder: 'Ingrese el código de 6 dígitos',
                required: true,
                inputClass: 'flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center text-lg tracking-widest',
                helperText: 'Haga clic en el botón para recibir el código de verificación',
                actionButton: {
                    icon: 'icon-[lucide--send]',
                    title: 'Enviar código de verificación',
                    onClick: sendVerificationCode,
                    loadingIcon: 'icon-[lucide--loader-2] animate-spin'
                },
                validation: (value: string) => {
                    if (!/^\d{6}$/.test(value)) return 'El código debe tener exactamente 6 dígitos numéricos'
                    return null
                }
            }
        ]
    }

    const onSubmitDelete = async (values: Record<string, string>) => {
        const deleteResult = await adminService.deleteAdmin(id, values.code)

        if (deleteResult.success) {
            showToast('success', 'Administrador eliminado exitosamente')
            await loadAllAdmins()
            return true
        } else {
            showToast('error', deleteResult.message || 'Error al eliminar el administrador')
            return false
        }
    }

    await showFormWithWarning(deleteFormConfig, onSubmitDelete)
}

onMounted(async () => {
    await loadAllAdmins()
})
</script>
