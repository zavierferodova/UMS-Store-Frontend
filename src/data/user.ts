import { fetchJSON } from "@/lib/fetch";
import { apiBaseURL } from "@/config/api";
import { User } from "@/domain/model/user";

export async function getUserServerSide(id: string, accessToken: string): Promise<User | null> {
  const response = await fetchJSON(`${apiBaseURL}/api/external/users/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (response) {
    const { data } = response;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      username: data.username,
      role: data.role,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
    };
  }

  return null;
}
