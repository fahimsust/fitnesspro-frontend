export function customersNav() {
    return [
        {
            name: 'Accounts',
            href: '/accounts',
            current: true,
        },
        {
            name: 'Types',
            href: '/accounts/types',
            children: [],
            current: false
        },
        {
            name: 'Memberships',
            href: '/accounts/memberships',
            children: [],
            current: false
        },
        {
            name: 'Photos',
            href: '/accounts/photos',
            children: [],
            current: false
        },
        {
            name: 'Specialties',
            href: '/accounts/specialties',
            children: [],
            current: false
        },
    ]
}