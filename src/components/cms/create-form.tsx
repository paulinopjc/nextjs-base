'use client';

import Link from 'next/link';
import { Button } from '@ui/button';
import { State, createCMS } from '@lib/cms/actions'; // ← custom CMS action
import { useActionState, useState } from 'react';
import TinyMCEEditor from '@ui/TinyMCEEditor';

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCMS, initialState);

  const [content, setContent] = useState('');

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Page Title */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Page Title
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter page title"
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
            required
            aria-describedby="name-error"
          />
          <div id="name-error" aria-live="polite">
            {state.errors?.name?.map((error) => (
              <p key={error} className="mt-2 text-sm text-red-500">{error}</p>
            ))}
          </div>
        </div>

        {/* Slug */}
        <div className="mb-4">
          <label htmlFor="slug" className="mb-2 block text-sm font-medium">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            placeholder="e.g. about-us"
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
            required
            aria-describedby="slug-error"
          />
          <div id="slug-error" aria-live="polite">
            {state.errors?.slug?.map((error) => (
              <p key={error} className="mt-2 text-sm text-red-500">{error}</p>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <label htmlFor="content" className="mb-2 block text-sm font-medium">
            Content
          </label>
          {/* <textarea
            id="content"
            name="content"
            rows={6}
            placeholder="Write your content here..."
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="content-error"
          ></textarea> */}
          <input type="hidden" name="content" value={content} />
          <TinyMCEEditor value={content} onChange={setContent} />
          <div id="content-error" aria-live="polite">
            {state.errors?.content?.map((error) => (
              <p key={error} className="mt-2 text-sm text-red-500">{error}</p>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            required
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm text-gray-700"
            aria-describedby="status-error"
          >
            <option value="">Select status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <div id="status-error" aria-live="polite">
            {state.errors?.status?.map((error) => (
              <p key={error} className="mt-2 text-sm text-red-500">{error}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/cms"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" aria-describedby="validation-message">
          Create Page
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
