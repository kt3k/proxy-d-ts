import { serve } from "https://deno.land/x/sift@0.2.0/mod.ts";

const EXAMPLE_VERSION = "v1.8.3";

serve({
  "/": () =>
    new Response(
      `
      serving lib.deno.d.ts<br />
      visit <a href="/builtin/${EXAMPLE_VERSION}">/builtin/${EXAMPLE_VERSION}</a> for example
      `,
      { status: 200, headers: { "content-type": "text/html" } },
    ),
  "/builtin/:version": async (_, params) => {
    if (!params) {
      return notFound();
    }
    const { version } = params;
    if (!version) {
      return notFound();
    }
    const resp = await fetch(
      `https://github.com/denoland/deno/releases/download/${version}/lib.deno.d.ts`,
    );
    if (resp.status !== 200) {
      return notFound();
    }
    resp.headers.set("content-type", "application/typescript; charset=utf-8");
    return resp;
  },
  404: () => notFound(),
});

function notFound(): Response {
  return new Response(`not found<br /><a href="/">Back to Top</a>`, {
    status: 404,
    headers: { "content-type": "text/html" },
  })
}
