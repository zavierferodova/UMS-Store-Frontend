"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CameraIcon } from "@/components/icons/CameraIcon";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useController } from "./controller";

export default function ProfilePage() {
  const {
    imagePreview,
    handleImageChange,
    handleAvatarClick,
    handleRemoveAvatar,
    fileInputRef,
    user,
    handleChange,
    handleGenderChange,
  } = useController();

  return (
    <>
      <AdminHeader
        menu={[
          {
            name: "Beranda",
            href: "/admin",
          },
          {
            name: "Profil",
            href: "/admin/profile",
          },
        ]}
      />
      <div className="mt-6 flex w-full flex-col gap-4 lg:flex-row">
        <div className="flex w-full flex-col gap-4 lg:w-[40%]">
          <Card>
            <CardHeader>
              <CardTitle>My Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mb-6 flex items-center space-x-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/png, image/jpeg"
                />
                <div className="relative">
                  <Avatar
                    className="h-20 w-20 cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    <AvatarImage
                      src={imagePreview || ""}
                      alt="@shadcn"
                      className="object-cover"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div
                    className="group absolute inset-0 flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-opacity-0 transition-all duration-300 hover:bg-black/50"
                    onClick={handleAvatarClick}
                  >
                    <CameraIcon className="h-6 w-6 text-white opacity-0 transition-all duration-300 group-hover:opacity-100" />
                  </div>
                </div>
                <div className="space-x-2">
                  <Button onClick={handleAvatarClick}>Ubah avatar</Button>
                  <Button variant="outline" onClick={handleRemoveAvatar}>
                    Hapus avatar
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email"
                  value={user?.email}
                  onChange={handleChange}
                  name="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Masukkan username"
                  value={user?.username || ""}
                  onChange={handleChange}
                  name="username"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button>Simpan</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Update Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Password Confirmation</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Simpan</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="w-full lg:w-[60%]">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama</Label>
                  <Input
                    id="nama"
                    placeholder="Masukkan nama"
                    value={user?.name || "none"}
                    onChange={handleChange}
                    name="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelamin">Kelamin</Label>
                  <Select
                    value={user?.gender || undefined}
                    onValueChange={handleGenderChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undefined" disabled>
                        Pilih jenis kelamin
                      </SelectItem>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="no-telp">No Telp</Label>
                  <Input
                    id="no-telp"
                    placeholder="Masukkan nomor telepon"
                    value={user?.phone || ""}
                    onChange={handleChange}
                    name="phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <Textarea
                    id="alamat"
                    placeholder="Masukkan alamat"
                    className="min-h-33 max-h-33"
                    value={user?.address || ""}
                    onChange={handleChange}
                    name="address"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button>Simpan</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
