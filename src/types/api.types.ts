export type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
}

export type PaginatedResponse<T> = {
  items: T[]
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

export type PaginationParams = {
  page?: number
  limit?: number
}
