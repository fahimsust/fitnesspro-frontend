export function settingsNav() {
    return [
        {
            name: 'Sites',
            href: '/settings/sites',
            current: true,
        },
        {
            name: 'Payments',
            href: '/settings/payments/accounts',
            children: [],
            current: false
        },
        {
            name: 'Tax Rules',
            href: '/settings/tax-rules',
            children: [],
            current: false
        },
        {
            name: 'Users',
            href: '/settings/users',
            children: [],
            current: false
        },
    ]
}