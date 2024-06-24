export function contentNav() {
    return [
        {
            name: 'Pages',
            href: '/content/pages',
            current: true,
        },
        {
            name: 'Elements',
            href: '/content/elements',
            children: [],
            current: false
        },
        {
            name: 'FAQ',
            href: '/content/faq',
            children: [],
            current: false
        },
    ]
}