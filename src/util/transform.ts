export const convertDateToStringDDMMYYYY = (val: Date | string) => {
  const date = new Date(val);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const convertDDMMYYYtoDate = (dateStr: string): Date => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    throw new Error("Date must be in DD/MM/YYYY format");
  }
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};
