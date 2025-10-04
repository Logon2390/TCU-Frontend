import type { ContactInfo, SocialMedia } from '@/types/layout.types'

export const footerConfig = {
  organization: {
    name: 'Centro Cívico por la Paz - Pococi',
    logo: '@/assets/icons/LogoCCPP.vue',
  },

  contact: {
    phone: '2710 1244',
    email: 'ccppococi@mj.go.cr',
    address: '200m norte del Colegio Técnico de Pococí, en el Polideportivo de Pococí',
    schedule: 'Lunes a Sábado: 8:00 AM - 4  :00 PM',
  } as ContactInfo,

  socialMedia: [
    {
      name: 'Facebook',
      icon: 'icon-[lucide--facebook]',
      url: 'https://www.facebook.com/CentroCivicoporlaPazPococi',
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
