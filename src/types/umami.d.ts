// The Umami tracker (loaded by the script tag in index.html) exposes a global.
// A Window augmentation rather than `declare var`, which the no-var lint rule
// would reject.
interface UmamiTracker {
  track(name: string, data?: Record<string, unknown>): void;
}

interface Window {
  umami?: UmamiTracker;
}
