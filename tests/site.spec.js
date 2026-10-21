import { readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? htmlFiles(entryPath) : [entryPath];
    })
  );

  return nestedFiles.flat().filter((file) => file.endsWith('.html'));
}

const outputDirectory = path.join(process.cwd(), 'dist');
const routes = (await htmlFiles(outputDirectory))
  .filter((file) => path.basename(file) !== '404.html')
  .map((file) => {
    const relativePath = path.relative(outputDirectory, file);
    return relativePath === 'index.html'
      ? '/'
      : `/${relativePath.replace(/\/index\.html$/, '/').replace(/\.html$/, '')}`;
  });

for (const route of routes) {
  test(`${route} renders without browser errors and meets WCAG 2.1 AA`, async ({ page }) => {
    const pageErrors = [];
    const failedLocalResponses = [];
    const origin = `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT ?? '4321'}`;

    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('response', (response) => {
      const isVercelSpeedInsights = response.url() === `${origin}/_vercel/speed-insights/script.js`;
      if (response.url().startsWith(origin) && response.status() >= 400 && !isVercelSpeedInsights) {
        failedLocalResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    const response = await page.goto(route);
    expect(response?.status(), `HTTP status for ${route}`).toBe(200);
    await expect(page.locator('body')).not.toBeEmpty();
    await page.addStyleTag({
      content:
        '*, *::before, *::after { animation: none !important; transition: none !important; }',
    });

    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibility.violations, `Accessibility violations on ${route}`).toEqual([]);
    expect(pageErrors, `Browser errors on ${route}`).toEqual([]);
    expect(failedLocalResponses, `Failed same-site requests on ${route}`).toEqual([]);
  });
}
