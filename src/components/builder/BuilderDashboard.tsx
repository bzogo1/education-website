'use client';

import { useCallback, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useProjects } from '@/lib/site/store';
import { getTemplate } from '@/lib/site/templates';
import { newId, normalizeProject } from '@/lib/site/project';
import { useViewer } from '@/lib/supabase/use-user';
import type { SiteProject } from '@/lib/site/types';
import AnalyticsView from './dashboard/AnalyticsView';
import { publishProject, unpublishProject, useAnalytics, useProfile } from './dashboard/data';
import Overview from './dashboard/Overview';
import ProjectsView from './dashboard/ProjectsView';
import PublishedView from './dashboard/PublishedView';
import SettingsView from './dashboard/SettingsView';
import Shell, { type ViewKey } from './dashboard/Shell';
import TemplatesView from './dashboard/TemplatesView';
import ProjectEditor from './ProjectEditor';

export default function BuilderDashboard() {
  const {
    projects,
    loading,
    mode,
    saveState,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
  } = useProjects();
  const viewer = useViewer();
  const analytics = useAnalytics();
  const profileState = useProfile();

  const [view, setView] = useState<ViewKey>('overview');
  const [openId, setOpenId] = useState<string | null>(null);

  const openProject = projects.find((project) => project.id === openId) ?? null;

  const handleCreateFromTemplate = useCallback(
    (templateId: string) => {
      const template = getTemplate(templateId);
      if (!template) return;
      const project = template.build();
      createProject(project);
      setOpenId(project.id);
    },
    [createProject]
  );

  const handleCreateFromPrompt = useCallback(
    async (prompt: string): Promise<string | null> => {
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'create', message: prompt }),
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { site?: Partial<SiteProject> };
        if (!data.site?.pages?.length) return null;
        const now = new Date().toISOString();
        const project = normalizeProject({
          ...data.site,
          id: newId('p'),
          source: 'ai',
          createdAt: now,
          updatedAt: now,
        });
        createProject(project);
        setOpenId(project.id);
        return project.id;
      } catch {
        return null;
      }
    },
    [createProject]
  );

  const handlePublish = useCallback(
    async (project: SiteProject): Promise<{ ok: boolean; error?: string }> => {
      const result = await publishProject(project);
      if (result.error || !result.absoluteUrl) {
        return { ok: false, error: result.error ?? 'Publishing failed.' };
      }
      updateProject(project.id, (current) => ({
        ...current,
        publishedUrl: result.absoluteUrl,
        publishedAt: new Date().toISOString(),
        handle: result.handle ?? current.handle,
        slug: result.slug ?? current.slug,
      }));
      void analytics.reload();
      return { ok: true };
    },
    [analytics, updateProject]
  );

  const handleUnpublish = useCallback(
    async (project: SiteProject): Promise<{ ok: boolean; error?: string }> => {
      const result = await unpublishProject(project.id);
      if (!result.ok) return result;
      updateProject(project.id, (current) => ({
        ...current,
        publishedUrl: undefined,
        publishedAt: undefined,
      }));
      void analytics.reload();
      return { ok: true };
    },
    [analytics, updateProject]
  );

  if (loading || viewer.loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[#08090a]">
        <div className="flex flex-col items-center gap-3">
          <span className="grid size-10 animate-pulse place-items-center rounded-xl bg-gradient-to-b from-[#e2f0e6] to-[#b9d6c3] font-serif text-lg font-bold text-[#0f2518]">
            F
          </span>
          <p className="text-[11.5px] text-white/30">Opening your workspace…</p>
        </div>
      </div>
    );
  }

  if (openProject) {
    return (
      <ProjectEditor
        key={openProject.id}
        project={openProject}
        mode={mode}
        saveState={saveState}
        onBack={() => setOpenId(null)}
        onUpdate={(updater) => updateProject(openProject.id, updater)}
        onPublish={handlePublish}
        onDelete={() => {
          deleteProject(openProject.id);
          setOpenId(null);
        }}
      />
    );
  }

  const publishedCount = projects.filter((project) => project.publishedUrl).length;

  return (
    <>
      <Shell
        viewer={viewer}
        mode={mode}
        active={view}
        projectCount={projects.length}
        publishedCount={publishedCount}
        onNavigate={setView}
        onNewSite={() => setView('templates')}
      >
        {view === 'overview' ? (
          <Overview
            projects={projects}
            viewer={viewer}
            profile={profileState.profile}
            summary={analytics.summary}
            mode={mode}
            onCreateFromPrompt={handleCreateFromPrompt}
            onOpenProject={setOpenId}
            onNavigate={setView}
          />
        ) : null}

        {view === 'projects' ? (
          <ProjectsView
            projects={projects}
            onOpen={setOpenId}
            onDuplicate={duplicateProject}
            onDelete={deleteProject}
            onPublish={handlePublish}
            onNewSite={() => setView('templates')}
          />
        ) : null}

        {view === 'templates' ? (
          <TemplatesView
            onCreateFromTemplate={handleCreateFromTemplate}
            onCreateFromPrompt={handleCreateFromPrompt}
          />
        ) : null}

        {view === 'published' ? (
          <PublishedView
            projects={projects}
            summary={analytics.summary}
            viewerUsername={viewer.username}
            onOpen={setOpenId}
            onUnpublish={handleUnpublish}
            onBrowseProjects={() => setView('projects')}
          />
        ) : null}

        {view === 'analytics' ? (
          <AnalyticsView
            summary={analytics.summary}
            loading={analytics.loading}
            available={analytics.available}
            error={analytics.error}
            onNavigate={setView}
          />
        ) : null}

        {view === 'settings' ? (
          <SettingsView
            viewer={viewer}
            profile={profileState.profile}
            projects={projects}
            mode={mode}
            loading={profileState.loading}
            saving={profileState.saving}
            error={profileState.error}
            onSave={profileState.save}
          />
        ) : null}
      </Shell>
      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
