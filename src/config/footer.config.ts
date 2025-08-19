import type { ContactInfo, FooterLink, SocialMedia } from '@/types/layout.types'

export const footerConfig = {
  organization: {
    name: 'Centro Cívico por la Paz - Pococi',
    logo: '@/assets/icons/LogoCCPP.vue',
  },

  contact: {
    phone: '2710 1244',
    email: 'ccppococi@mj.go.cr',
    address: 'Pococí, Limón, Costa Rica',
    schedule: 'Lunes a Sábado: 8:00 AM - 4  :00 PM',
  } as ContactInfo,
  links: [
    {
      label: 'Inicio',
      url: '/',
    },
    {
      label: 'Acerca de',
      url: '/about',
    },
    {
      label: 'Servicios',
      url: '/services',
    },
    {
      label: 'Contacto',
      url: '/contact',
    },
    {
      label: 'Política de Privacidad',
      url: '/privacy',
    },
  ] as FooterLink[],

  socialMedia: [
    {
      name: 'Facebook',
      icon: 'icon-[lucide--facebook]',
      url: 'https://facebook.com',
    },
    {
      name: 'Twitter',
      icon: 'icon-[lucide--twitter]',
      url: 'https://twitter.com',
    },
    {
      name: 'Instagram',
      icon: 'icon-[lucide--instagram]',
      url: 'https://instagram.com',
    },
    {
      name: 'Youtube',
      icon: 'icon-[lucide--youtube]',
      url: 'https://youtube.com',
    },
  ] as SocialMedia[],
}
