import { createFileRoute } from '@tanstack/react-router'
import { Users } from '~/components/Users/Users'

export const Route = createFileRoute('/_header/users/')({
  component: Users,
})
