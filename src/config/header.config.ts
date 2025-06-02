import type { HeaderConfig } from '@/types/layout.types'

export const headerConfig: HeaderConfig = {
  title: 'Panel de Control',
  items: [
    {
      title: 'Registrar visita',
      route: '/visitas',
    },
    {
      title: 'Inicio',
      route: '/',
    },
    {
      title: 'Iniciar sesión',
      route: '/user/Login',
    },
  ],
}
