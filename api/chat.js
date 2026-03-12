module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  const defaultModel = process.env.NVIDIA_MODEL || 'qwen/qwen3.5-122b-a10b';

  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing NVIDIA_API_KEY' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const system = String(body.system || 'You are a helpful assistant.');
  const user = String(body.user || '').trim();
  const maxTokens = Number.isFinite(Number(body.maxTokens)) ? Number(body.maxTokens) : 1200;
  const temperature = Number.isFinite(Number(body.temperature)) ? Number(body.temperature) : 0.3;
  const model = defaultModel;

  if (!user) {
    return res.status(400).json({ error: 'Missing user prompt' });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const upstream = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        max_tokens: maxTokens,
        temperature,
        top_p: 0.95,
        stream: false
      })
    });

    const textBody = await upstream.text();

    if (!upstream.ok) {
      let parsed = null;
      try { parsed = JSON.parse(textBody); } catch (_) {}
      return res.status(upstream.status).json({
        error: parsed?.error?.message || parsed?.error || textBody || `Upstream error ${upstream.status}`
      });
    }

    let parsed = null;
    try { parsed = JSON.parse(textBody); } catch (_) {}
    const content = parsed?.choices?.[0]?.message?.content || '';

    if (!content) {
      return res.status(502).json({ error: 'NVIDIA returned empty content' });
    }

    return res.status(200).json({ text: content, model });
  } catch (err) {
    const msg = (err && err.name === 'AbortError')
      ? 'NVIDIA request timed out'
      : (err?.message || 'Proxy request failed');
    return res.status(500).json({ error: msg });
  } finally {
    clearTimeout(timeoutId);
  }
};
