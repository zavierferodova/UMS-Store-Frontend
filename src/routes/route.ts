export const panelRoutes = {
    home: "/panel",
    profile: "/panel/profile",
    users: "/panel/users",
    userEdit: (id: string) => `/panel/users/${id}`,
    noRole: "/no-role",
}

export const publicRoutes = {
    login: "/login"
}