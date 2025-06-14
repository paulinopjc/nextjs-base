'use client';

import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

const navItems = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'User Settings',
    icon: Cog6ToothIcon,
    children: [
      {
        name: 'Users',
        href: '/dashboard/users',
        icon: UsersIcon,
      },
    ],
  },
  {
    name: 'Team Management',
    icon: Cog6ToothIcon,
    children: [
      {
        name: 'Roles',
        href: '/dashboard/roles',
        icon: UsersIcon,
      },
    ],
  },
];

export default function NavLinks() {
  const path = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  // Expand by default if current path matches a child
  useEffect(() => {
    const initialExpanded: { [key: string]: boolean } = {};
    navItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some((child) => path.startsWith(child.href));
        initialExpanded[item.name] = isChildActive;
      }
    });
    setExpandedMenus(initialExpanded);
  }, [path]);

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <>
      {navItems.map((item) => {
        if (!item.children) {
          const LinkIcon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                  'bg-sky-100 text-blue-600': path === item.href,
                }
              )}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{item.name}</p>
            </Link>
          );
        }

        const isExpanded = expandedMenus[item.name] || false;
        const ParentIcon = item.icon;

        return (
          <div key={item.name} className="space-y-1">
            <button
              onClick={() => toggleMenu(item.name)}
              className={clsx(
                'flex w-full items-center gap-2 rounded-md p-2 px-3 text-sm font-medium md:justify-start',
                isExpanded ? 'bg-sky-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <ParentIcon className="w-6" />
              <span className="hidden md:block flex-1 text-left">{item.name}</span>
              {isExpanded ? (
                <ChevronDownIcon className="w-4" />
              ) : (
                <ChevronRightIcon className="w-4" />
              )}
            </button>

            {isExpanded && (
              <div className="ml-8 space-y-1 transition-all">
                {item.children.map((child) => {
                  const ChildIcon = child.icon;
                  return (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={clsx(
                        'flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-sky-100 hover:text-blue-600',
                        {
                          'bg-sky-100 text-blue-600': path === child.href,
                        }
                      )}
                    >
                      <ChildIcon className="w-5" />
                      <span>{child.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
