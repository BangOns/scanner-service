export const SCANNER_AGENT_HOST =
  process.env.NEXT_PUBLIC_SCANNER_AGENT_HOST || "http://127.0.0.1";

export const SCANNER_AGENT_DEFAULT_PORT =
  Number(process.env.NEXT_PUBLIC_SCANNER_AGENT_PORT) || 2019;
