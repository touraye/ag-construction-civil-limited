export function isNetworkError(err: unknown): boolean {
    return err instanceof TypeError && err.message === 'Failed to fetch'
}