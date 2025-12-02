import { NewProject } from '~/components/Projects/NewProject'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header/projects/new-project')({
  component: NewProject,
})
