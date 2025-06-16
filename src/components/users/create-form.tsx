'use client';

import Link from 'next/link';
import { Button } from '@ui/button';
import { State, createUser } from '@lib/users/actions';
import { useActionState, useEffect, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { fetchAllRoles } from '@/lib/roles/data';
import { Role } from '@/lib/definitions';

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createUser, initialState);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchAllRoles().then(setRoles).catch(console.error);
  }, []);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Username */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Username
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter Username"
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

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter Email"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              required
              aria-describedby='email-error'
            />
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email?.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label htmlFor="roleId" className="mb-2 block text-sm font-medium">
            Role
          </label>
          <select
            id="roleId"
            name="roleId"
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm text-gray-700"
            required
            aria-describedby="role-error"
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <div id="role-error" aria-live="polite" aria-atomic="true">
            {state.errors?.roleId?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              required
              aria-describedby='password-error'
            />
            <button
              type="button"
              className="absolute top-2 right-3 text-xs text-blue-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
								<EyeSlashIcon className="h-5 w-5 text-blue-600 cursor-pointer" />
							) : (
								<EyeIcon className="h-5 w-5 text-blue-600 cursor-pointer" />
							)}
            </button>
          </div>
					<div id="password-error" aria-live="polite" aria-atomic="true">
            {state.errors?.password?.map((error) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
            </p>
            ))}
        	</div>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter Password"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              required
              aria-describedby='confirm-password-error'
            />
          </div>
          <div id="confirm-password-error" aria-live="polite" aria-atomic="true">
            {state.errors?.confirmPassword?.map((error) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
            </p>
            ))}
        	</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/users"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" aria-describedby="validation-message">
          Create User
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
