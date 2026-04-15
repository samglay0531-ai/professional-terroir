export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = (context) => {
  const runtime = (context.locals as any).runtime;
  const clientId = runtime?.env?.GITHUB_CLIENT_ID || import.meta.env.GITHUB_CLIENT_ID;
  const scope = 'repo,user';
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}`;
  return context.redirect(authUrl, 302);
};
