export interface SidebarItem {
  id: string
  title: string
  route: string
  icon?: string
}

export interface SidebarConfig {
  title: string
  items: SidebarItem[]
}

export type HeaderConfig = {
  title: string
  items: HeaderItem[]
}

export type HeaderItem = {
  title: string
  route: string
}
