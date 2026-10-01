// packages
import type { Plugin } from 'vite';

// llms
import { loadSite } from './load';
import { renderSite } from './render';

const SERVED = /\.(md|txt|xml)$/;

const contentType = (path: string): string => {
  if (path.endsWith('.xml')) return 'application/xml; charset=utf-8';
  if (path.endsWith('.md')) return 'text/markdown; charset=utf-8';
  return 'text/plain; charset=utf-8';
};

// Emits the crawler-facing files (llms.txt, markdown copies, sitemap, robots)
// into dist at build time, and serves the same paths from the dev server,
// re-rendered on each request so a content edit shows up without a restart.
export const llmsPlugin = (): Plugin => {
  let root = process.cwd();
  return {
    name: 'jorius:llms-txt',
    configResolved(config) {
      root = config.root;
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(renderSite(loadSite(root)))) {
        this.emitFile({ type: 'asset', fileName, source });
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = new URL(req.url ?? '/', 'http://localhost').pathname.slice(1);
        if (!SERVED.test(path)) {
          next();
          return;
        }
        const body = renderSite(loadSite(root))[path];
        if (body === undefined) {
          next();
          return;
        }
        res.setHeader('Content-Type', contentType(path));
        res.end(body);
      });
    },
  };
};
