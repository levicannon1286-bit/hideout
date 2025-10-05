import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const reqUrl = new URL(req.url);
  const functionBase = `${reqUrl.origin}${reqUrl.pathname}`;

  try {
    const urlParam = new URL(req.url).searchParams.get("url");

    if (!urlParam) {
      return new Response("Missing 'url' query parameter", {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }

    // Basic validation to prevent SSRF to internal networks
    let target: URL;
    try {
      target = new URL(urlParam);
      if (!/^https?:$/.test(target.protocol)) throw new Error("Invalid protocol");
    } catch (_e) {
      return new Response("Invalid URL", { status: 400, headers: corsHeaders });
    }

    const upstream = await fetch(target.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Upgrade-Insecure-Requests": "1"
      },
      redirect: "follow",
    });

    const contentType = upstream.headers.get("content-type") || "";

    // Build safe headers: forward content-type and length, strip all blocking headers
    const headers = new Headers({ ...corsHeaders });
    if (contentType) headers.set("Content-Type", contentType);
    
    // Remove all headers that could block embedding
    headers.delete("X-Frame-Options");
    headers.delete("Content-Security-Policy");
    headers.delete("X-Content-Type-Options");

    // If HTML, aggressively rewrite to allow embedding
    if (contentType.includes("text/html")) {
      let html = await upstream.text();

      const baseUrl = target.origin + target.pathname.replace(/\/[^/]*$/, "/");
      
      // Remove ALL blocking tags and headers
      html = html
        // Add base tag first
        .replace(/<head>/i, `<head><base href="${baseUrl}">`)
        // Remove ALL meta tags that could block embedding
        .replace(/<meta[^>]*http-equiv[^>]*>/gi, "")
        .replace(/<meta[^>]*content-security-policy[^>]*>/gi, "")
        // Remove iframe busting scripts
        .replace(/if\s*\(\s*(?:window|self|top)\s*!==?\s*(?:window\.top|top|parent)\s*\)/gi, "if(false)")
        .replace(/if\s*\(\s*(?:window\.top|top|parent)\s*!==?\s*(?:window|self)\s*\)/gi, "if(false)");

      // Enhanced link and form rewriting - make ALL links go through proxy
      const injector = `<script>
(function() {
  const functionBase = '${functionBase}';
  const currentUrl = '${target.href}';
  
  // Helper to convert relative URLs to absolute, then proxy them
  const toProxy = (url) => {
    if (!url || url.startsWith('#') || url.startsWith('javascript:') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      return url;
    }
    try {
      const absolute = new URL(url, currentUrl).href;
      return functionBase + '?url=' + encodeURIComponent(absolute);
    } catch {
      return url;
    }
  };

  // Intercept ALL clicks on the page
  document.addEventListener('click', function(e) {
    let target = e.target;
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
    }
    
    if (target && target.tagName === 'A') {
      const href = target.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = toProxy(href);
        return false;
      }
    }
  }, true);

  // Intercept form submissions
  document.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const action = form.getAttribute('action') || currentUrl;
    const method = (form.getAttribute('method') || 'GET').toUpperCase();
    
    if (method === 'GET') {
      const formData = new FormData(form);
      const params = new URLSearchParams(formData);
      const url = action + (action.includes('?') ? '&' : '?') + params.toString();
      window.location.href = toProxy(url);
    }
  }, true);

  // Rewrite all existing links and forms immediately
  function rewritePage() {
    // Rewrite all links
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        const original = a.getAttribute('data-original-href') || href;
        a.setAttribute('data-original-href', original);
        a.href = toProxy(original);
      }
    });

    // Rewrite all form actions
    document.querySelectorAll('form[action]').forEach(form => {
      const action = form.getAttribute('action');
      if (action) {
        const original = form.getAttribute('data-original-action') || action;
        form.setAttribute('data-original-action', original);
        form.action = toProxy(original);
      }
    });
  }

  // Initial rewrite
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rewritePage);
  } else {
    rewritePage();
  }

  // Watch for dynamic content
  const observer = new MutationObserver(rewritePage);
  observer.observe(document.body, { childList: true, subtree: true });
})();
<\/script>`;
      
      if (/<\/head>/i.test(html)) {
        html = html.replace(/<\/head>/i, injector + '</head>');
      } else if (/<\/body>/i.test(html)) {
        html = html.replace(/<\/body>/i, injector + '</body>');
      } else {
        html += injector;
      }

      headers.set("Content-Type", "text/html; charset=utf-8");

      return new Response(html, {
        status: upstream.status,
        headers,
      });
    }

    // For non-HTML content, stream the response body
    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (e) {
    console.error("http-proxy error:", e);
    return new Response("Proxy error", {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }
});
