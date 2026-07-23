import { loginClient } from "../api";

const authConfig = () => {
  const token = localStorage.getItem("access_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getDashboardUsers = async ({ page = 1, limit = 3 } = {}) => {
  const response = await loginClient.get("/user/admin/dashboard", {
    ...authConfig(),
    params: { page, limit },
  });

  return response.data;
};
