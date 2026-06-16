import { uploadClient } from "./api";

export const getPendingBatches = async (stain_type, page = 1) => {
  const response = await uploadClient.get("/batches/prediction/pending", {
    params: { page, stain_type },
  });
  return response.data;
};