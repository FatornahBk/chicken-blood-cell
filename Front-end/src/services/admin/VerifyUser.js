import { loginClient } from "../api";

// สร้าง config สำหรับ API ที่ต้องใช้ token หลัง login
const authConfig = () => {
  const token = localStorage.getItem("access_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ดึงรายชื่อผู้ใช้ที่รออนุมัติหรือถูกปฏิเสธ พร้อมตัวกรองและ pagination
export const getPendingUsers = async ({
  email = "",
  status = "all",
  page = 1,
  limit = 10,
} = {}) => {
  const config = authConfig();
  const keyword = email.trim();

  config.params = { status, page, limit };
  if (keyword) config.params.email = keyword;

  const response = await loginClient.get("/user/admin/pending", config);
  return response.data;
};

// อนุมัติผู้ใช้ตาม user_id
export const approveUser = async (userId) => {
  const response = await loginClient.patch(
    `/user/admin/approve/${userId}`,
    null,
    authConfig()
  );
  return response.data;
};

// ปฏิเสธผู้ใช้ตาม user_id
export const rejectUser = async (userId) => {
  const response = await loginClient.patch(
    `/user/admin/reject/${userId}`,
    null,
    authConfig()
  );
  return response.data;
};

// ยกเลิกการปฏิเสธและคืนผู้ใช้กลับเป็นสถานะรออนุมัติ
export const undoRejectUser = async (userId) => {
  const response = await loginClient.patch(
    `/user/admin/undo-reject/${userId}`,
    null,
    authConfig()
  );
  return response.data;
};
