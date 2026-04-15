export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const runtime = (context.locals as any).runtime;
  const clientId = runtime?.env?.GITHUB_CLIENT_ID || import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = runtime?.env?.GITHUB_CLIENT_SECRET || import.meta.env.GITHUB_CLIENT_SECRET;

  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const data: any = await response.json();
  const token = data.access_token || '';
  const error = data.error || '';

  const status = error ? 'error' : 'success';
  const content = JSON.stringify(error || token);

  const html = `<!doctype html><html><body><script>
(function() {
  window.opener.postMessage(
    'authorization:github:${status}:${content}',
    '*'
  );
})();
</script></body></html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  });
};
