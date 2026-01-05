type DropdownMenuTypes = {
  triggerButton?: React.ReactNode
  label?: string
  menuElement: DropdownMenuState[]
  align?: 'center' | 'end' | 'start' | undefined
}
type DropdownMenuState = {
  id: string
  element: React.ReactNode
  boardContent?: React.ReactNode
}
