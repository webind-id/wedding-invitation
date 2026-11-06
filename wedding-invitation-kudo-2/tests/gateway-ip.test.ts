import { afterEach, describe, expect, it, vi } from "vitest";
import { clientIp } from "@/lib/rate-limit";

const SECRET = "g".repeat(40);
const gatewayHeaders = (secret: string) =>
  new Headers({ "x-kudo-gateway-secret": secret, "x-kudo-client-ip": "1.2.3.4", "x-forwarded-for": "9.9.9.9" });

describe("clientIp via subdomain gateway", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("trusts the forwarded IP only when the shared secret matches", () => {
    vi.stubEnv("GATEWAY_SECRET", SECRET);
    expect(clientIp(gatewayHeaders(SECRET))).toBe("1.2.3.4");
    expect(clientIp(gatewayHeaders("h".repeat(40)))).toBe("9.9.9.9");
    expect(clientIp(gatewayHeaders("short"))).toBe("9.9.9.9");
  });

  it("ignores gateway headers when no (or a too-short) secret is configured", () => {
    vi.stubEnv("GATEWAY_SECRET", "");
    expect(clientIp(gatewayHeaders(""))).toBe("9.9.9.9");
    vi.stubEnv("GATEWAY_SECRET", "pendek");
    expect(clientIp(gatewayHeaders("pendek"))).toBe("9.9.9.9");
  });
});
