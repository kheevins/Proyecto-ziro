/** Stable per-browser id, used to dedupe leaderboard entries and gate the one-physical-prize rule. */
const KEY = 'ziro_device_id';

export function getDeviceId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(KEY, id); }
  return id;
}
