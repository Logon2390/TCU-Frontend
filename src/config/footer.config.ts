import type { ContactInfo, SocialMedia } from '@/types/layout.types'

export const footerConfig = {
  organization: {
    name: 'Centro Cívico por la Paz - Pococí',
    logo: '/logo.webp',
  },

  contact: {
    phone: '2101 5426',
    email: 'jose.soto@munipococi.go.cr',
    address: '200m norte del Colegio Técnico de Pococí, en el Polideportivo de Pococí',
    schedule: 'Lunes a Viernes: 8:00 AM - 4:00 PM | Sábado: 9:00 AM - 5:00 PM',
  } as ContactInfo,

  socialMedia: [
    {
      name: 'Facebook',
      icon: 'icon-[lucide--facebook]',
      url: 'https://www.facebook.com/CentroCivicoporlaPazPococi',
    }
  ] as SocialMedia[],
}
