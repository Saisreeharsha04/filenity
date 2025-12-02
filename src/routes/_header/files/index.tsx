import { Files } from '~/components/Files/Files'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header/files/')({
  component: Files,
  validateSearch: (search: { viewMode?: string }) => ({
    viewMode: search.viewMode === 'grid' ? 'grid' : 'list',
  }),
})

