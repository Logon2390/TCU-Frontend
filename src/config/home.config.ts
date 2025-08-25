import { footerConfig } from '@/config/footer.config'
export const homeConfig = {
  hero: {
    title: 'Centro Cívico por la Paz',
    subtitle: 'Pococi, Costa Rica',
    description:
      'Construyendo puentes hacia una comunidad más unida, pacífica y próspera. Trabajamos juntos por el desarrollo social y la convivencia armoniosa en Pococi.',
    image:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    primaryCtaLabel: 'Conoce Más',
    secondaryCtaLabel: 'Programas',
    secondaryCtaTarget: 'programas',
    ctaCard: {
      title: 'Registra tu Visita',
      buttonText: 'Comenzar Registro',
    },
  },
  about: {
    id: 'quienes-somos',
    title: '¿Quiénes Somos?',
    missionTitle: 'Nuestra Misión',
    mission:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel ea porro quod eaque tempore, illo evenietofficiis doloribus nemo perspiciatis dolorem blanditiis, molestiae molestias repudiandae neque.',
    visionTitle: 'Nuestra Visión',
    vision:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel ea porro quod eaque tempore, illo eveniet officiis doloribus nemo perspiciatis dolorem blanditiis, molestiae molestias repudiandae neque.',
    valuesTitle: 'Nuestros Valores',
    values: ['-', '-', '-', '-'],
  },
  programs: {
    id: 'programas',
    title: 'Nuestros Programas',
    subtitle: 'Desarrollamos iniciativas que fortalecen la paz y el bienestar comunitario',
    items: [
      {
        title: 'Educación para la Paz',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        icon: '📚',
      },
      {
        title: 'Mediación Comunitaria',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        icon: '🤝',
      },
      {
        title: 'Desarrollo Social',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        icon: '🌱',
      },
      {
        title: 'Actividades Culturales',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        icon: '🎭',
      },
    ],
  },
  contact: {
    id: 'contacto',
    title: 'Únete a Nosotros',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    cards: [
      { title: 'Ubicación', content: footerConfig.contact.address, icon: 'icon-[lucide--map-pin]' },
      { title: 'Teléfono', content: footerConfig.contact.phone, icon: 'icon-[lucide--phone]' },
      { title: 'Email', content: footerConfig.contact.email, icon: 'icon-[lucide--mail]' },
    ],
  },
}
