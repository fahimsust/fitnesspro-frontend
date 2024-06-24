export const orderNav = () => {
    return [
        {
            name: 'Completed',
            href: '/orders',
            current: true,
        },
        {
            name: 'Abandoned',
            href: '/orders/abandoned',
            children: [],
            current: false
        }
    ]
}