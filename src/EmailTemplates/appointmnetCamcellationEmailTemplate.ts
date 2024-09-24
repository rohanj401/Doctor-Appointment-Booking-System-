export const generateAppointmentCancellationEmail = (
  name: string,
  date: string,
  doctorName: string,
): string => {
  return `
          <html>
            <body>
              <h1>Dear ${name},</h1>
              <p>
                We regret to inform you that your appointment scheduled for ${date} with Dr. ${doctorName} has been cancelled due to unforeseen circumstances.
              </p>
              <p>
                We apologize for any inconvenience this may cause. Please contact the hospital management team to reschedule your appointment at your earliest convenience.
              </p>
              <p>
                Thank you for your understanding.
              </p>
              <p>
                Best regards,<br />
                The Hospital Management Team
              </p>
            </body>
          </html>
        `;
};
