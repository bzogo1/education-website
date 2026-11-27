'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { normalizeProject, newId } from './project';
import type { SiteProject } from './types';

const STORAGE_KEY = 'folio.projects.v1';
const LEGACY_KEY = 'builder.projects.v1';

export type WorkspaceMode = 'local' | 'cloud';
export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

function parseProjects(raw: string | null): SiteProject[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is { id: string } =>
        Boolean(item && typeof item === 'object' && 'id' in item)
      )
      .map((item) => normalizeProject(item));
  } catch {
    return [];
  }
}

function readLocal(): SiteProject[] {
  if (typeof window === 'undefined') return [];
  const current = window.localStorage.getItem(STORAGE_KEY);
  if (current) return parseProjects(current);
  const legacy = parseProjects(window.localStorage.getItem(LEGACY_KEY));
  if (legacy.length > 0) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
  return legacy;
}

function writeLocal(projects: SiteProject[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    /* storage can be full or blocked; cloud saves still work */
  }
}

async function getAccessToken(): Promise<string | null> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

async function sendProject(
  project: SiteProject,
  accessToken: string,
  method: 'POST' | 'PATCH'
): Promise<boolean> {
  try {
    const res = await fetch(
      method === 'POST' ? '/api/projects' : `/api/projects/${encodeURIComponent(project.id)}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ project }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<SiteProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<WorkspaceMode>('local');
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const projectsRef = useRef<SiteProject[]>([]);
  const tokenRef = useRef<string | null>(null);
  const modeRef = useRef<WorkspaceMode>('local');
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const pendingRef = useRef(new Map<string, SiteProject>());

  const commit = useCallback((next: SiteProject[]) => {
    projectsRef.current = next;
    setProjects(next);
  }, []);

  const flush = useCallback(async (projectId: string) => {
    const pending = pendingRef.current.get(projectId);
    pendingRef.current.delete(projectId);
    const accessToken = tokenRef.current;
    if (!pending || modeRef.current !== 'cloud' || !accessToken) return;
    setSaveState('saving');
    const ok = await sendProject(pending, accessToken, 'PATCH');
    setSaveState(ok ? 'saved' : 'error');
  }, []);

  const scheduleSave = useCallback(
    (project: SiteProject) => {
      if (modeRef.current !== 'cloud') return;
      pendingRef.current.set(project.id, project);
      const existing = timersRef.current.get(project.id);
      if (existing) clearTimeout(existing);
      timersRef.current.set(
        project.id,
        setTimeout(() => {
          timersRef.current.delete(project.id);
          void flush(project.id);
        }, 700)
      );
    },
    [flush]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const local = readLocal();
      const accessToken = await getAccessToken();
      if (!accessToken) {
        if (!cancelled) {
          commit(local);
          setLoading(false);
        }
        return;
      }

      tokenRef.current = accessToken;
      try {
        const res = await fetch('/api/projects', {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Unable to load cloud projects');
        const data = (await res.json()) as { projects?: { id: string }[] };
        const cloud = (data.projects ?? []).map((project) => normalizeProject(project));
        if (cancelled) return;

        modeRef.current = 'cloud';
        setMode('cloud');

        // First sign-in on this browser: keep local work and push it up.
        if (cloud.length === 0 && local.length > 0) {
          commit(local);
          for (const project of local) {
            void sendProject(project, accessToken, 'POST');
          }
        } else {
          commit(cloud);
        }
      } catch {
        if (!cancelled) commit(local);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      for (const timer of timersRef.current.values()) clearTimeout(timer);
      timersRef.current.clear();
    };
  }, [commit]);

  useEffect(() => {
    if (!loading) writeLocal(projects);
  }, [projects, loading]);

  const createProject = useCallback(
    (project: SiteProject) => {
      const next = [project, ...projectsRef.current];
      commit(next);
      const accessToken = tokenRef.current;
      if (modeRef.current === 'cloud' && accessToken) {
        setSaveState('saving');
        void sendProject(project, accessToken, 'POST').then((ok) =>
          setSaveState(ok ? 'saved' : 'error')
        );
      }
      return project;
    },
    [commit]
  );

  const updateProject = useCallback(
    (id: string, updater: (project: SiteProject) => SiteProject) => {
      const current = projectsRef.current.find((project) => project.id === id);
      if (!current) return;
      const next = { ...updater(current), updatedAt: new Date().toISOString() };
      commit(projectsRef.current.map((project) => (project.id === id ? next : project)));
      scheduleSave(next);
    },
    [commit, scheduleSave]
  );

  const deleteProject = useCallback(
    (id: string) => {
      commit(projectsRef.current.filter((project) => project.id !== id));
      const accessToken = tokenRef.current;
      if (modeRef.current !== 'cloud' || !accessToken) return;
      void fetch(`/api/projects/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      }).catch(() => undefined);
    },
    [commit]
  );

  const duplicateProject = useCallback(
    (id: string) => {
      const source = projectsRef.current.find((project) => project.id === id);
      if (!source) return;
      const now = new Date().toISOString();
      const copy: SiteProject = {
        ...JSON.parse(JSON.stringify(source)),
        id: newId('p'),
        title: `${source.title} (copy)`,
        slug: `${source.slug}-copy`,
        createdAt: now,
        updatedAt: now,
        publishedUrl: undefined,
        publishedAt: undefined,
        views: undefined,
      };
      const next = [copy, ...projectsRef.current];
      commit(next);
      const accessToken = tokenRef.current;
      if (modeRef.current === 'cloud' && accessToken) {
        void sendProject(copy, accessToken, 'POST').then((ok) => {
          if (!ok) setSaveState('error');
        });
      }
    },
    [commit]
  );

  return {
    projects,
    loading,
    hydrated: !loading,
    mode,
    saveState,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
  };
}
