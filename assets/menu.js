export const menu = [
  {
    icon: "ShoppingCart",
    pageName: "/order/actives",
    title: "Orders",
    subMenu: [
      {
        icon: "Truck",
        pageName: "/order/actives",
        title: "Completed",
      },
      {
        icon: "Slash",
        pageName: "/order/abandoned",
        title: "Abandoned",
      },
    ],
  },
  {
    icon: "BookOpen",
    pageName: "/catalog/products",
    title: "Catalog",
    subMenu: [
      {
        icon: "Tag",
        pageName: "/catalog/products",
        title: "Products",
      },
      {
        icon: "Scissors",
        pageName: "/catalog/discounts",
        title: "Discounts",
        subMenu: [
          {
            icon: "PercentDiamond",
            pageName: "/catalog/discounts",
            title: "Promotions",
          },
          {
            icon: "PercentCircle",
            pageName: "/catalog/discounts/levels",
            title: "Discounts Levels",
          }
        ]
      },
      {
        icon: "Grid",
        pageName: "/catalog/categories",
        title: "Categories",
      },
      {
        icon: "Edit",
        pageName: "/catalog/products/editor",
        title: "Product Bulk Edit",
      },
      {
        icon: "Pocket",
        pageName: "/catalog/brands",
        title: "Brands",
      },
      {
        icon: "Shuffle",
        pageName: "/catalog/products/types",
        title: "Product Types",
      },
      {
        icon: "Info",
        pageName: "/catalog/attributes",
        title: "Attributes",
      },
      {
        icon: "Filter",
        pageName: "/catalog/ordering-rules",
        title: "Ordering Rules",
      },
      {
        icon: "Box",
        pageName: "/catalog/distributors",
        title: "Distributors",
      },
      {
        icon: "Star",
        pageName: "/catalog/reviews",
        title: "Reviews",
      },
      {
        icon: "Menu",
        pageName: "/catalog/products/accessory-fields",
        title: "Accessory Fields",
      },
    ],
  },
  {
    icon: "Smile",
    pageName: "/customers",
    title: "Customers",
    subMenu: [
      {
        icon: "Users",
        pageName: "/customers",
        title: "Accounts",
      },
      {
        icon: "Settings",
        pageName: "/customers/types",
        title: "Types",
      },
      {
        icon: "UserCheck",
        pageName: "/customers/memberships",
        title: "Memberships",
      },
      {
        icon: "Image",
        pageName: "/customers/photos",
        title: "Photos",
      },
      {
        icon: "Target",
        pageName: "/customers/specialties",
        title: "Specialties",
      },
    ],
  },
  {
    icon: "PieChart",
    pageName: "/reports/customer",
    title: "Reports",
    subMenu: [
      {
        icon: "ShoppingCart",
        pageName: "/reports/orders",
        title: "Orders",
      },
      {
        icon: "Tag",
        pageName: "/reports/products",
        title: "Products",
      },
      {
        icon: "Smile",
        pageName: "/reports/customer",
        title: "Customers",
      },
    ],
  },
  {
    icon: "FileText",
    pageName: "/content/pages",
    title: "Content",
    subMenu: [
      {
        icon: "File",
        pageName: "/content/pages",
        title: "Pages",
      },
      {
        icon: "Copy",
        pageName: "/content/elements",
        title: "Elements",
      },
      {
        icon: "Mail",
        pageName: "/content/message-templates",
        title: "Message Template",
        subMenu: [
          {
            icon: "FileSpreadsheet",
            pageName: "/content/message-templates",
            title: "Message Template",
          },
          {
            icon: "LayoutList",
            pageName: "/content/message-templates/category",
            title: "Message Template Category",
          }
        ]
      },
      {
        icon: "Layers",
        pageName: "/content/module-templates",
        title: "Module Templates",
      },
      {
        icon: "PanelLeft",
        pageName: "/content/display-templates",
        title: "Display Template",
      },
      {
        icon: "LayoutPanelLeft",
        pageName: "/content/layouts",
        title: "Layouts",
      },
      {
        icon: "ShieldQuestion",
        pageName: "/content/faq",
        title: "FAQ",
        subMenu: [
          {
            icon: "FileQuestion",
            pageName: "/content/faq",
            title: "FAQ",
          },
          {
            icon: "MailQuestion",
            pageName: "/content/faq/category",
            title: "FAQ Category",
          }
        ]
      },
      {
        icon: "FilePlus",
        pageName: "/customforms",
        title: "Custom Forms",
      },
    ],
  },
  {
    icon: "HeartHandshake",
    pageName: "/affiliates",
    title: "Affiliates",
    subMenu: [
      {
        icon: "Users",
        pageName: "/affiliates",
        title: "Affiliates",
      },
      {
        icon: "DollarSign",
        pageName: "/affiliates/referrals",
        title: "Referrals",
      },
      {
        icon: "Sliders",
        pageName: "/affiliates/levels",
        title: "Levels",
      },
    ],
  },
  {
    icon: "Settings",
    pageName: "/settings/sites",
    title: "Settings",
    subMenu: [
      {
        icon: "Monitor",
        pageName: "/settings/sites",
        title: "Sites",
      },
      {
        icon: "CreditCard",
        pageName: "/settings/payments",
        title: "Payments",
      },
      {
        icon: "Users",
        pageName: "/settings/users",
        title: "Users",
      },
    ],
  }
]