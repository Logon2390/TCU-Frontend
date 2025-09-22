import { ref, watch, type Ref } from 'vue'

export const useDebounce = <T>(
  value: Ref<T>,
  delay: number = 300
): Ref<T> => {
  const debouncedValue: Ref<T> = ref(value.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout>

  watch(value, (newValue) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  }, { immediate: true })

  return debouncedValue
}

export default useDebounce
