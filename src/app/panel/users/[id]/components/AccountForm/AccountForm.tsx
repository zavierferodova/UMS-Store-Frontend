'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UserIcon } from '@phosphor-icons/react/dist/ssr';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useController } from './controller';
import { User } from '@/domain/model/user';
import { isAdmin } from '@/lib/role';

export type AccountFormProps = {
  user: User | null;
};

export const AccountForm = ({ user }: AccountFormProps) => {
  const { session, form, userImage, onSubmit } = useController(user);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Akun</CardTitle>
        <CardDescription>Informasi akun pengguna</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-6 flex items-center space-x-4">
          <div className="relative flex justify-center w-full">
            <Avatar className="h-20 w-20 rounded-md">
              <AvatarImage
                src={userImage}
                alt="User profile image"
                className="object-cover w-full h-full"
              />
              <AvatarFallback className="rounded-xl">
                <UserIcon className="text-accent-foreground/60" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" maxLength={255} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username anda" maxLength={30} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={!isAdmin(session?.user)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="procurement">Pengadaan</SelectItem>
                      <SelectItem value="cashier">Kasir</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              {isAdmin(session?.user) && (
                <Button type="submit" className="cursor-pointer">
                  Simpan
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
