import type { SidebarConfig } from '@/types/layout.types'

export const sidebarConfig: SidebarConfig = {
  title: 'Panel de Control',
  items: [
    {
      id: 'stats',
      title: 'Estadísticas',
      route: '/stats',
      icon: 'icon-[lucide--chart-bar]',
    },
    {
      id: 'admin',
      title: 'Admin',
      route: '/admin',
      icon: 'icon-[lucide--shield]',
    },
    {
      id: 'usuarios',
      title: 'Usuarios',
      route: '/usuarios',
      icon: 'icon-[lucide--users]',
    },
    {
      id: 'modulos',
      title: 'Módulos',
      route: '/modulos',
      icon: 'icon-[lucide--book]',
    },
    {
      id: 'visitas',
      title: 'Visitas',
      route: '/visitas',
      icon: 'icon-[lucide--map-pinned]',
    },
  ],
}
