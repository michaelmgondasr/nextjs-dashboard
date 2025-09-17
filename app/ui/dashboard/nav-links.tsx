// 'use client';

// import {
//   UserGroupIcon,
//   HomeIcon,
//   DocumentDuplicateIcon,
// } from '@heroicons/react/24/outline';
// import Link from 'next/link';
// import { use } from 'react';
// import { usePathname } from 'next/navigation';
// import clsx from 'clsx';

// // Map of links to display in the side navigation.
// // Depending on the size of the application, this would be stored in a database.
// const links = [
//   { name: 'Home', href: '/dashboard', icon: HomeIcon },
//   {
//     name: 'Invoices',
//     href: '/dashboard/invoices',
//     icon: DocumentDuplicateIcon,
//   },
//   { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
// ];

// export default function NavLinks() {
//   const pathname = usePathname();
//   // This would be used to determine which link is active.
//   // const currentPath = use(pathname);
//   // console.log('Current Path:', currentPath);

//   // In a real application, you might fetch the links from an API.
//   // For this example, we're using a static array defined above.
//   return (
//     <>
//       {links.map((link) => {
//         const LinkIcon = link.icon;
//         return (
//           <Link
//             key={link.name}
//             href={link.href}
//             className={clsx(
//               'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
//               {
//                 'bg-sky-100 text-blue-600': pathname === link.href,
//               },
//             )}
//           >
//             <LinkIcon className="w-6" />
//             <p className="hidden md:block">{link.name}</p>
//           </Link>
//         );
//       })}
//     </>
//   );
// }

// app/ui/dashboard/nav-links.tsx
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { auth } from '@/auth';
import clsx from 'clsx';

// All available links
const allLinks = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon, roles: ['admin'] },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
    roles: ['admin']
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon, roles: ['admin'] },
  { name: 'Dashboard', href: '/dashboard/user', icon: HomeIcon, roles: ['user'] },
];

export default async function NavLinks() {
  const session = await auth();
  const userRole = session?.user?.role;

  // Filter links based on user role
  const visibleLinks = allLinks.filter(link =>
    link.roles.includes(userRole || '')
  );

  return (
    <>
      {visibleLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}