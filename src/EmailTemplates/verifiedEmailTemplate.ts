export const generateDoctorVerifiedEmail = (name: string): string => {
  return `
        <html>
        <body>
          <h1>Dear Dr. ${name},</h1>
          <p>
            We are pleased to inform you that your profile has been successfully verified. You can now fully access your account, manage your profile, and start scheduling appointments with patients. 
          </p>
          <p>
            Thank you for your patience and for choosing our platform. If you have any questions or need further assistance, please do not hesitate to contact us.
          </p>
          <p>
            Best regards,<br/>
            The DABS Team
          </p>
        </body>
        </html>
      `;
};
