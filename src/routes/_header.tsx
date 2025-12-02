import { Header } from '~/components/layout/Header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header')({
  component: () => <Header />,
})
