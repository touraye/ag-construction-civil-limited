import type { ShareableProjectData } from '@/app/(portal)/portal/actions/project/public-share'

type CachedShareData = {
    data: ShareableProjectData
    cachedAt: number
}

const CACHE_PREFIX = 'ironclad_share_'
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes — matches a reasonable "active session" window

function getCacheKey(projectId: string, token: string): string {
    return `${CACHE_PREFIX}${projectId}_${token}`
}

export function getCachedShareData(
    projectId: string,
    token: string
): ShareableProjectData | null {
    if (typeof window === 'undefined') return null

    try {
        const raw = sessionStorage.getItem(getCacheKey(projectId, token))
        if (!raw) return null

        const parsed: CachedShareData = JSON.parse(raw)

        // Expire the cache after CACHE_TTL_MS even within the same tab session —
        // prevents an indefinitely-open tab from showing stale progress data forever
        if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) {
            sessionStorage.removeItem(getCacheKey(projectId, token))
            return null
        }

        return parsed.data
    } catch {
        // Corrupted cache entry — treat as a cache miss rather than throwing
        return null
    }
}

export function setCachedShareData(
    projectId: string,
    token: string,
    data: ShareableProjectData
): void {
    if (typeof window === 'undefined') return

    try {
        const payload: CachedShareData = { data, cachedAt: Date.now() }
        sessionStorage.setItem(getCacheKey(projectId, token), JSON.stringify(payload))
    } catch {
        // sessionStorage can throw if full or disabled (e.g. private browsing edge cases) —
        // fail silently, the app still works, it just re-fetches (and re-consumes) next time
    }
}

export function clearCachedShareData(projectId: string, token: string): void {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem(getCacheKey(projectId, token))
}