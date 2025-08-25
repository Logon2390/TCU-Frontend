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
  icon: string
  route: string
}

export interface FooterLink {
  label: string
  url: string
}

export interface SocialMedia {
  name: string
  icon: string
  url: string
}

export interface ContactInfo {
  phone: string
  email: string
  address: string
  schedule: string
}
