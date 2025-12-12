/**
 * Get default start date (30 days ago)
 */
export const getDefaultStartDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return formatDateLocal(date);
};

/**
 * Get default end date (today)
 */
export const getDefaultEndDate = () => {
  return formatDateLocal(new Date());
};

/**
 * Get start date for last day (yesterday)
 */
export const getLastDayStartDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatDateLocal(date);
};

/**
 * Get end date for last day (yesterday)
 */
export const getLastDayEndDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatDateLocal(date);
};

/**
 * Format date as YYYY-MM-DD in local timezone
 */
export const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
