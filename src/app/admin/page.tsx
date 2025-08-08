import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminPage() {
  return (
    <>
      <AdminHeader
        menu={[
          {
            name: "Beranda",
            href: "/admin",
          },
        ]}
      />
    </>
  );
}
