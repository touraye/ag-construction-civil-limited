export function buildWhatsAppShareUrl(params: {
    phone: string          // international format, digits only, e.g. "2207123456"
    projectName: string
    shareUrl: string
    token: string
    expiresAt: string
}): string {
    const message =
        `Hello! Here is your project progress update for *${params.projectName}*.\n\n` +
        `View your project: ${params.shareUrl}\n` +
        `Access code: *${params.token}*\n\n` +
        `This link is valid until ${new Date(params.expiresAt).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric',
        })}.\n\n` +
        `— IRONCLAD Construction`

    return `https://wa.me/${params.phone}?text=${encodeURIComponent(message)}`
}