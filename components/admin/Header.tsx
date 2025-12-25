'use client';

import { signOut } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4" />
          <span className="font-medium">{user.name}</span>
          <span className="text-gray-500">{user.email}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </header>
  );
}
