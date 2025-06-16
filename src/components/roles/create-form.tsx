'use client';

import Link from 'next/link';
import { Button } from '@ui/button';
import { State, createRole } from '@lib/roles/actions';
import { useActionState } from 'react';

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createRole, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Role */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Role
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter Role"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              required
              aria-describedby='name-error'
            />
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name?.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/roles"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" aria-describedby="validation-message">
          Create Role
        </Button>
      </div>

      {/* Global Message */}
      <div id="validation-message" aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        )}
      </div>
    </form>
  );
}
