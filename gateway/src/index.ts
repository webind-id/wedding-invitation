/**
 * KudoStack Gateway — Cloudflare Worker untuk *.kudostack.com.
 * Setiap undangan mendapat subdomain sendiri: {slug}.kudostack.com,
 * dilayani oleh app template yang dipakai undangan tersebut.
 */
import { handle, productionDeps, type Env } from "./handler";

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handle(request, env, productionDeps(env));
  },
};
