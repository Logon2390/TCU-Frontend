import type { SidebarConfig } from '@/types/layout.types'

export const sidebarConfig: SidebarConfig = {
  title: 'Panel de Control',
  items: [
    {
      id: 'stats',
      title: 'Estadísticas',
      route: '/admin/stats',
      icon: 'icon-[lucide--chart-bar]',
      requiereMaster: false,
    },
    {
      id: 'admin',
      title: 'Admin',
      route: '/admin/management',
      icon: 'icon-[lucide--shield]',
      requiereMaster: true,
    },
    {
      id: 'usuarios',
      title: 'Usuarios',
      route: '/admin/users',
      icon: 'icon-[lucide--users]',
      requiereMaster: false,
    },
    {
      id: 'modulos',
      title: 'Módulos',
      route: '/admin/modules',
      icon: 'icon-[lucide--book]',
      requiereMaster: false,
    },
  ],
}
