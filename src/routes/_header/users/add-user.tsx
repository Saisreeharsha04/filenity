import { createFileRoute } from '@tanstack/react-router'
import { AddUser } from '~/components/Users/AddUser'

export const Route = createFileRoute('/_header/users/add-user')({
  component: AddUser,
})
