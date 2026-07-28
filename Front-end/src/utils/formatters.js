export const formatCardDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  
  const day = String(d.getDate()).padStart(2, "0");       // วันที่ 2 หลัก (01-31)
  const month = String(d.getMonth() + 1).padStart(2, "0"); // เดือน 2 หลัก (01-12)
  const year = d.getFullYear();                           // ปี ค.ศ. 4 หลัก (เช่น 2026)
  
  return `${day}/${month}/${year}`;
};