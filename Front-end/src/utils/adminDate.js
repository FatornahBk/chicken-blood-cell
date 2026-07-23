export const formatAdminDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const pad = (number) => String(number).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return [
    `${pad(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  ].join(" ");
};
