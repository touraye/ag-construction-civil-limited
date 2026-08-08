export const SERVICE_ICONS = [
    'home', 'building-2', 'building', 'warehouse', 'factory',
    'wrench', 'hammer', 'drill', 'ruler', 'construction',
    'truck', 'clipboard-check', 'map-pin', 'compass',
    'paintbrush', 'lamp', 'door-open',
    'tree', 'flower-2', 'mountain', 'waves',
    'shield-check', 'layers', 'grid-2x2', 'blocks', 'package',
] as const

export type ServiceIconName = typeof SERVICE_ICONS[ number ]