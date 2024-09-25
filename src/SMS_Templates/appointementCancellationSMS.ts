export const generateAppointmentCancellationSMS = (
  pname: string,
  doctorName: string,
  appointmnetDate: string,
): string => {
  return ` Dear ${pname}
        Your appointment with Dr. ${doctorName} scheduled for ${appointmnetDate} has been cancelled due to unforeseen circumstances. 
        We apologize for any inconvenience this may cause. 
        Please contact the hospital management team to reschedule your appointment at your earliest convenience.
        
        Thank you for your understanding.`;
};
