import { redirect } from 'next/navigation'
import { checkRole } from '@/utils/roles'
import { SearchUsers } from './SearchUsers'
import { clerkClient } from '@clerk/nextjs/server'
import { removeRole, setRole } from './_actions'

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string }>
}) {
  if (!checkRole('admin')) {
    redirect('/')
  }

  const query = (await params.searchParams).search
  const client = await clerkClient()
  const users = query ? (await client.users.getUserList({ query })).data : []

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Admin Dashboard</h1>
      <p className="mb-6 text-gray-600">
        This is the protected admin dashboard restricted to users with the <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">admin</code> role.
      </p>

      <div className="mb-8">
        <SearchUsers />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map((user) => {
          const primaryEmail = user.emailAddresses.find(
            (email) => email.id === user.primaryEmailAddressId
          )?.emailAddress

          return (
            <div
              key={user.id}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              <div className="text-lg font-semibold mb-1">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-500 mb-2">{primaryEmail}</div>
              <div className="text-sm mb-4">
                <span className="font-medium">Role:</span>{' '}
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                  {user.publicMetadata.role as string || 'None'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <form action={setRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="admin" name="role" />
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Make Admin
                  </button>
                </form>

                <form action={setRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="moderator" name="role" />
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Make Moderator
                  </button>
                </form>

                <form action={removeRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove Role
                  </button>
                </form>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
