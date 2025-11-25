export const panelRoutes = {
  home: '/panel',
  profile: '/panel/profile',
  users: '/panel/users',
  userEdit: (id: string) => `/panel/users/${id}`,
  suppliers: '/panel/suppliers',
  supplierEdit: (id: string) => `/panel/suppliers/${id}`,
  supplierAdd: '/panel/suppliers/add',
  supplierPayments: `/panel/suppliers/payments`,
  products: '/panel/products',
  addProduct: '/panel/products/add',
  productEdit: (id: string) => `/panel/products/${id}`,
  purchaseOrders: '/panel/purchase-orders',
  addPurchaseOrder: '/panel/purchase-orders/add',
  purchaseOrderEdit: (id: string) => `/panel/purchase-orders/${id}`,
  noRole: '/no-role',
};

export const publicRoutes = {
  login: '/login',
  notFound: '/not-found',
};
