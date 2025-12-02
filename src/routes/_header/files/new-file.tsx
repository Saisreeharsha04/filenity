import { NewFile } from '~/components/Files/NewFile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header/files/new-file')({
  component: NewFile,
})
