export const aboutConfig = {
  title: 'Sobre este proyecto',
  subtitle: 'TCU-663 · Universidad de Costa Rica',
  intro:
    'Este sitio web fue desarrollado por estudiantes de la Universidad de Costa Rica como parte de sus acciones en el TCU-663.',
  objectives: [
    'Facilitar a las personas usuarias el proceso de registro de visita al acceder a las instalaciones del Centro Cívico por la Paz.',
    'Disminuir tiempos de espera durante el ingreso a las instalaciones.',
    'Brindar una interfaz sencilla y adaptada a dispositivos móviles.',
    'Garantizar mejores registros para análisis y mejora del servicio.',
  ],
  features: [
    {
      title: 'Registro de visitas',
      description: 'Formulario por pasos que reduce errores y agiliza el proceso.',
      icon: 'icon-[lucide--check-circle]',
    },
    {
      title: 'Accesible en móviles',
      description: 'Diseño responsivo que funciona en diferentes tamaños de pantalla.',
      icon: 'icon-[lucide--smartphone]',
    },
    {
      title: 'Claridad y privacidad',
      description: 'Mensajes informativos y manejo responsable de la información.',
      icon: 'icon-[lucide--shield-check]',
    },
  ],
  techTitle: 'Tecnologías utilizadas',
  tech: ['Vue 3 + Vite', 'TypeScript', 'Tailwind CSS', '@vueuse/motion'],
  contributorsTitle: 'Personas colaboradoras',
  contributorsNote:
    'Espacio para listar nombres de quienes colaboraron con el desarrollo del proyecto.',
  contributors: ['-', '-', '-', '-'] as string[],
}
