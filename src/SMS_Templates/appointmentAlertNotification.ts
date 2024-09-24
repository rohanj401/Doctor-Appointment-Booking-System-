export const generateAppointmentAlertNotificationSMS = (
  doctorName: string,
  time: string,
  date: string,
): string => {
  return `Reminder: You have an appointment with Dr. ${doctorName} today at ${time}. Date: ${date}. Please arrive early.`;
};
