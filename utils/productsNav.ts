export const productsNav = () => {
    return [
        {
            name: 'Products',
            href: '/products',
            current: true,
        },
        {
            name: 'Types',
            href: '/products/types',
            current: true,
        },
        {
            name: 'Accessory Fields',
            href: '/products/accessory-fields',
            current: true,
        },
        {
            name: 'Bulk Editor',
            href: '/products/editor',
            current: true,
        },
        {
            name: 'Discounts',
            href: '/products/discounts',
            children: [],
            current: false
        },
    ]
}