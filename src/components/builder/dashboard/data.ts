'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { AnalyticsSummary, SiteProject, StudentProfile } from '@/lib/site/types';

export async function authToken(): Promise<string | null> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

export interface PublishResult {
  url?: string;
  absoluteUrl?: string;
  mode?: 'cloud' | 'file';
  handle?: string;
  slug?: string;
  error?: string;
}

export async function publishProject(project: SiteProject): Promise<PublishResult> {
  const token = await authToken();
  try {
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ project }),
    });
    const data = (await res.json()) as PublishResult;
    if (!res.ok) return { error: data.error ?? 'Publish failed' };
    return data;
  } catch {
    return { error: 'Could not reach the publishing service. Check your connection.' };
  }
}

export async function unpublishProject(id: string): Promise<{ ok: boolean; error?: string }> {
  const token = await authToken();
  if (!token) return { ok: false, error: 'Sign in to manage published sites.' };
  try {
    const res = await fetch(`/api/publish?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      return { ok: false, error: data.error ?? 'Could not unpublish.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error.' };
  }
}

export function useAnalytics() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = await authToken();
    if (!token) {
      setLoading(false);
      setSummary(null);
      return;
    }
    try {
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = (await res.json()) as {
        available?: boolean;
        summary?: AnalyticsSummary;
        error?: string;
      };
      setSummary(data.summary ?? null);
      setAvailable(data.available !== false);
      setError(data.error ?? null);
    } catch {
      setError('Could not load analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { summary, available, loading, error, reload: load };
}

export function useProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = await authToken();
    if (!token) {
      setLoading(false);
      setProfile(null);
      return;
    }
    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = (await res.json()) as { profile?: StudentProfile | null; error?: string };
      setProfile(data.profile ?? null);
      if (data.error) setError(data.error);
    } catch {
      setError('Could not load your profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(async (next: StudentProfile): Promise<StudentProfile | null> => {
    const token = await authToken();
    if (!token) {
      setError('Sign in to save your profile.');
      return null;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(next),
      });
      const data = (await res.json()) as { profile?: StudentProfile; error?: string };
      if (!res.ok || !data.profile) {
        setError(data.error ?? 'Could not save your profile.');
        return null;
      }
      setProfile(data.profile);
      return data.profile;
    } catch {
      setError('Could not save your profile.');
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  return { profile, loading, saving, error, save, reload: load };
}
