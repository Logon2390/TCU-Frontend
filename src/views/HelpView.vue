<template>
    <div class="min-h-screen bg-background">
        <div class="bg-white shadow-sm border-b border-gray-200">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex items-center gap-3">
                    <button @click="router.push('/registro')"
                        class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <span class="icon-[lucide--arrow-left] size-6 text-text-secondary"></span>
                    </button>
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-text-primary">Guía de Registro de Visitante</h1>
                        <p class="text-sm sm:text-base text-text-secondary mt-1">Aprende cómo completar tu registro paso
                            a paso</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div class="bg-white rounded-2xl overflow-hidden mb-8 border border-gray-200">
                <div class="bg-primary px-6 py-4">
                    <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                        <span class="icon-[lucide--video] size-6"></span>
                        Video Tutorial
                    </h2>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="relative w-full" style="padding-bottom: 56.25%;">
                        <iframe class="absolute top-0 left-0 w-full h-full rounded-lg"
                            src="https://www.youtube.com/embed/" title="YouTube video player" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </div>
                    <p class="text-sm text-text-secondary mt-4 text-center">
                        Mira este video para una guía visual del proceso de registro
                    </p>
                </div>
            </div>

            <div class="bg-white rounded-2xl overflow-hidden mb-8 border border-gray-200">
                <div class="bg-primary px-6 py-4">
                    <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                        <span class="icon-[lucide--book-open] size-6"></span>
                        Guía Paso a Paso
                    </h2>
                </div>

                <div class="p-6 sm:p-8 space-y-8">
                    <div class="border-l-4 border-primary pl-4 sm:pl-6 py-2">
                        <div class="flex items-center gap-3 sm:gap-4 mb-4">
                            <div
                                class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl">
                                1
                            </div>
                            <h3 class="text-lg sm:text-xl font-bold text-text-primary">Identificación</h3>
                        </div>

                        <div class="space-y-3 text-text-primary">
                            <p class="leading-relaxed">
                                En este primer paso, debes seleccionar el tipo de documento que utilizarás para
                                registrarte:
                            </p>
                            <ul class="space-y-2 ml-4">
                                <li class="flex items-start gap-2">
                                    <span
                                        class="icon-[lucide--check-circle] size-5 text-success mt-0.5 flex-shrink-0"></span>
                                    <span><strong>Nacional:</strong> Si eres costarricense, selecciona esta
                                        opción</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span
                                        class="icon-[lucide--check-circle] size-5 text-success mt-0.5 flex-shrink-0"></span>
                                    <span><strong>Extranjero:</strong> Si tienes pasaporte o DIMEX, selecciona
                                        esta opción</span>
                                </li>
                            </ul>

                            <div class="bg-warning/10 border border-warning/30 rounded-lg p-4 mt-4">
                                <div class="flex items-start gap-3">
                                    <span
                                        class="icon-[lucide--alert-circle] size-6 text-warning flex-shrink-0 mt-0.5"></span>
                                    <div>
                                        <h4 class="font-semibold text-text-primary mb-2">Importante para Nacionales:
                                        </h4>
                                        <p class="text-text-primary text-sm sm:text-base leading-relaxed">
                                            Debes ingresar <strong>exactamente 9 dígitos</strong> de tu cédula de
                                            identidad, tal como aparecen en tu cédula física. Por ejemplo: si tu
                                            cédula es <code class="bg-warning/20 px-2 py-1 rounded">1-2345-6789</code>,
                                            debes
                                            ingresar <code class="bg-warning/20 px-2 py-1 rounded">123456789</code> (sin
                                            guiones).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="border-l-4 border-secondary pl-4 sm:pl-6 py-2">
                        <div class="flex items-center gap-3 sm:gap-4 mb-4">
                            <div
                                class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl">
                                2
                            </div>
                            <h3 class="text-lg sm:text-xl font-bold text-text-primary">Datos Personales</h3>
                        </div>

                        <div class="space-y-3 text-text-primary">
                            <p class="leading-relaxed">
                                En este paso deberás completar tu información personal:
                            </p>
                            <ul class="space-y-2 ml-4">
                                <li class="flex items-start gap-2">
                                    <span class="icon-[lucide--user] size-5 text-secondary mt-0.5 flex-shrink-0"></span>
                                    <span><strong>Nombre completo:</strong> Ingresa tu nombre tal como aparece en
                                        tu documento de identidad</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span
                                        class="icon-[lucide--calendar] size-5 text-secondary mt-0.5 flex-shrink-0"></span>
                                    <span><strong>Fecha de nacimiento:</strong> Selecciona tu fecha de
                                        nacimiento</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span
                                        class="icon-[lucide--users] size-5 text-secondary mt-0.5 flex-shrink-0"></span>
                                    <span><strong>Género:</strong> Selecciona tu género de las opciones
                                        disponibles</span>
                                </li>
                            </ul>

                            <div class="bg-info/10 border border-info/30 rounded-lg p-4 mt-4">
                                <div class="flex items-start gap-3">
                                    <span class="icon-[lucide--info] size-6 text-info flex-shrink-0 mt-0.5"></span>
                                    <div>
                                        <h4 class="font-semibold text-text-primary mb-2">¿Ya te has registrado antes?
                                        </h4>
                                        <p class="text-text-primary text-sm sm:text-base leading-relaxed">
                                            Si ya completaste el registro anteriormente, <strong>solo necesitas
                                                ingresar nuevamente tu documento de identidad</strong> en
                                            el Paso 1. El sistema
                                            reconocerá tu documento y <strong>autocompletará automáticamente</strong>
                                            todos tus datos personales. ¡No necesitas escribir nada más!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                                <div class="flex items-start gap-3">
                                    <span
                                        class="icon-[lucide--edit] size-6 text-text-secondary flex-shrink-0 mt-0.5"></span>
                                    <div>
                                        <h4 class="font-semibold text-text-primary mb-2">¿Necesitas cambiar tus datos?
                                        </h4>
                                        <p class="text-text-primary text-sm sm:text-base leading-relaxed">
                                            Si deseas modificar alguno de los datos que proporcionaste
                                            anteriormente, por favor contacta a un colaborador con acceso al
                                            sistema. Ellos te ayudarán a actualizar la información que necesites
                                            cambiar.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="border-l-4 border-success pl-4 sm:pl-6 py-2">
                        <div class="flex items-center gap-3 sm:gap-4 mb-4">
                            <div
                                class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-success text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl">
                                3
                            </div>
                            <h3 class="text-lg sm:text-xl font-bold text-text-primary">Propósito de Visita</h3>
                        </div>

                        <div class="space-y-3 text-text-primary">
                            <p class="leading-relaxed">
                                En el último paso, selecciona la opción que mejor describa el motivo de tu
                                visita:
                            </p>
                            <ul class="space-y-2 ml-4">
                                <li class="flex items-start gap-2">
                                    <span
                                        class="icon-[lucide--check-circle] size-5 text-success mt-0.5 flex-shrink-0"></span>
                                    <span>Revisa las opciones disponibles en el menú desplegable</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span
                                        class="icon-[lucide--check-circle] size-5 text-success mt-0.5 flex-shrink-0"></span>
                                    <span>Selecciona la que mejor se ajuste al propósito de tu visita</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span
                                        class="icon-[lucide--check-circle] size-5 text-success mt-0.5 flex-shrink-0"></span>
                                    <span>Haz clic en el botón <strong>"Enviar"</strong> para completar tu
                                        registro</span>
                                </li>
                            </ul>

                            <div class="bg-success/10 border border-success/30 rounded-lg p-4 mt-4">
                                <div class="flex items-start gap-3">
                                    <span
                                        class="icon-[lucide--check-circle-2] size-6 text-success flex-shrink-0 mt-0.5"></span>
                                    <div>
                                        <h4 class="font-semibold text-text-primary mb-2">¡Listo!</h4>
                                        <p class="text-text-primary text-sm sm:text-base leading-relaxed">
                                            Una vez que hayas completado estos tres pasos, tu registro estará
                                            completo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>