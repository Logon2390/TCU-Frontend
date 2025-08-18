import { ref, type Ref } from 'vue'

export const useFetching = <TResult, TArgs extends unknown[] = unknown[]>(
  serviceCallback: (...args: TArgs) => Promise<TResult>,
) => {
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<boolean> = ref(false)
  const data: Ref<TResult | null> = ref(null)

  const reset = () => {
    error.value = false
    data.value = null
  }

  const execute = async (...args: TArgs): Promise<TResult | null> => {
    isLoading.value = true
    error.value = false

    try {
      const result = await serviceCallback(...args)
      data.value = result
      return result
    } catch (err) {
      error.value = true
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    data,
    execute,
    reset,
  }
}

export default useFetching
