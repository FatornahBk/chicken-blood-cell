import { loginClient } from "../api";

const authConfig = (params = {}) => {
  const token = localStorage.getItem("access_token");
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined,
    ),
  );

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...(Object.keys(cleanParams).length ? { params: cleanParams } : {}),
  };
};

export const getAllDatasets = async ({
  page = 1,
  limit = 10,
  email = "",
  startDate = "",
  endDate = "",
  stainType = "",
  status = "",
} = {}) => {
  const response = await loginClient.get(
    "/data/admin/all",
    authConfig({
      page,
      limit,
      email: email.trim(),
      startDate,
      endDate,
      stain_type: stainType,
      status,
    }),
  );

  return response.data;
};

export const getDatasetById = async (datasetId) => {
  const response = await loginClient.get(
    `/data/admin/${encodeURIComponent(datasetId)}`,
    authConfig(),
  );

  return response.data;
};

export const deleteDatasetById = async (datasetId) => {
  const response = await loginClient.delete(
    `/data/admin/delete/${encodeURIComponent(datasetId)}`,
    authConfig(),
  );

  return response.data;
};
