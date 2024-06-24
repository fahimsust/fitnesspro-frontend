export function reportsNav() {
    return [
        {
            name: 'Orders',
            href: '/reports',
            current: true,
        },
        {
            name: 'Products',
            href: '/reports/products',
            children: [],
            current: false
        },
        {
            name: 'Customers',
            href: '/reports/customers',
            children: [],
            current: false
        },
    ]
}