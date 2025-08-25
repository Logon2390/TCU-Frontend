import type { SidebarConfig } from '@/types/layout.types'

export const sidebarConfig: SidebarConfig = {
  title: 'Panel de Control',
  items: [
    {
      id: 'stats',
      title: 'Estadísticas',
      route: '/admin/stats',
      icon: 'icon-[lucide--chart-bar]',
    },
    {
      id: 'admin',
      title: 'Admin',
      route: '/admin/admin',
      icon: 'icon-[lucide--shield]',
    },
    {
      id: 'usuarios',
      title: 'Usuarios',
      route: '/admin/usuarios',
      icon: 'icon-[lucide--users]',
    },
    {
      id: 'modulos',
      title: 'Módulos',
      route: '/admin/modulos',
      icon: 'icon-[lucide--book]',
    },
    {
      id: 'visitas',
      title: 'Visitas',
      route: '/admin/visitas',
      icon: 'icon-[lucide--map-pinned]',
    },
  ],
}
