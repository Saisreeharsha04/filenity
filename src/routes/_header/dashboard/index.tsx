import { Dashboard } from '~/components/Dashboard/Dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header/dashboard/')({
  component: Dashboard,
})

