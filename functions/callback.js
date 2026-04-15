export async function onRequestGet(context) {
  const code = new URL(context.request.url).searchParams.get('code');
  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;

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

  const data = await response.json();

  let message;
  if (data.error) {
    message = `authorization:github:error:${JSON.stringify({ error: data.error })}`;
  } else {
    message = `authorization:github:success:${JSON.stringify({ provider: 'github', token: data.access_token })}`;
  }

  const html = `<!doctype html><html><body><script>
(function() {
  window.opener.postMessage('${message}', '*');
})();
</script></body></html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  });
}
