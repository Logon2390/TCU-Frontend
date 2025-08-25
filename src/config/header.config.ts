import type { HeaderConfig } from '@/types/layout.types'

export const headerConfig: HeaderConfig = {
  title: 'Panel de Control',
  items: [
    {
      title: 'Inicio',
      icon: 'icon-[lucide--home]',
      route: '/',
    },
    {
      title: 'Iniciar sesión',
      icon: 'icon-[lucide--log-in]',
      route: '/login',
    },
  ],
}
