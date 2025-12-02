import { Projects } from '~/components/Projects/Projects'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header/projects/')({
  component: Projects,
})
