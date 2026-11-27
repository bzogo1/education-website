'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from './client';

export interface Viewer {
  user: User | null;
  loading: boolean;
  displayName: string;
  username: string | null;
  initials: string;
}

function nameFromUser(user: User | null): { displayName: string; username: string | null } {
  if (!user) return { displayName: 'Guest', username: null };
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const first = typeof meta.first_name === 'string' ? meta.first_name : '';
  const last = typeof meta.last_name === 'string' ? meta.last_name : '';
  const username = typeof meta.username === 'string' ? meta.username : null;
  const full = `${first} ${last}`.trim();
  const fallback = user.email?.split('@')[0] ?? 'Student';
  return { displayName: full || username || fallback, username };
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'S';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function useViewer(): Viewer {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe = () => {};

    try {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.getSession().then(({ data }) => {
        if (!mounted) return;
        setUser(data.session?.user ?? null);
        setLoading(false);
      });

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
      });
      unsubscribe = () => data.subscription.unsubscribe();
    } catch {
      setLoading(false);
    }

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const { displayName, username } = nameFromUser(user);
  return { user, loading, displayName, username, initials: initialsOf(displayName) };
}
