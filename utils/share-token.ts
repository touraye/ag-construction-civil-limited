const SAFE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no O, 0, I, 1 — avoids visual ambiguity

export function generateShareToken(): string {
    const segment = (n: number) =>
        Array.from({ length: n }, () => SAFE_CHARS[ Math.floor(Math.random() * SAFE_CHARS.length) ]).join('')
    return `IRON-${segment(4)}-${segment(4)}`
}