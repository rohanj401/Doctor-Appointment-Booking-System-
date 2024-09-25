export const generateAppointmnetAlertEmail = (
  userName: string,
  doctorName: string,
  appointmentDate: Date,
  time: string,
): string => {
  // Parse the time into hours and minutes
  const [hours, minutes] = time.split(':').map(Number);

  // Create a Date object for the appointment time
  const appointmentTime = new Date(appointmentDate);
  appointmentTime.setHours(hours, minutes, 0, 0);

  // Format the appointment time to 12-hour format
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  // Format the appointment date
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; margin: 0; padding: 0;">
          <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; padding: 20px;">
            <tr>
              <td style="padding: 20px; text-align: center;">
                <h1 style="font-size: 24px; color: #2d3748; margin-bottom: 20px;">Dear ${userName},</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">
                  This is a friendly reminder that you have an appointment scheduled with Dr. ${doctorName} today on ${dateFormatter.format(appointmentDate)} at ${timeFormatter.format(appointmentTime)}.
                </p>
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Please make sure to arrive early to complete any necessary paperwork.
                </p>
                <p style="font-size: 16px; color: #4a5568;">
                  Thank you!
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
};
