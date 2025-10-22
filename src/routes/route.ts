export const panelRoutes = {
  home: '/panel',
  profile: '/panel/profile',
  users: '/panel/users',
  userEdit: (id: string) => `/panel/users/${id}`,
  suppliers: '/panel/suppliers',
  supplierEdit: (id: string) => `/panel/suppliers/${id}`,
  supplierAdd: '/panel/suppliers/add',
  products: '/panel/products',
  addProduct: '/panel/products/add',
  noRole: '/no-role',
};

export const publicRoutes = {
  login: '/login',
  notFound: '/not-found',
};
