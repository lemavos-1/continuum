const rawVersion = import.meta.env.VITE_BUILD_VERSION;

const normalizedVersion = typeof rawVersion === "string" && rawVersion.trim() ? rawVersion.trim() : "local";
const version = normalizedVersion === "local" ? "local" : normalizedVersion.slice(0, 4);

export { version };
