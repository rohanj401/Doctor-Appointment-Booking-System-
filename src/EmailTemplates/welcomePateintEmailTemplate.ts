export const generatePatientWelcomeEmail = (
  name: string,
  email: string,
  contactNumber: string,
): string => {
  return ` <html>
      <body>
          <h1>Welcome to Our Platform, ${name}!</h1>
          <p>Thank you for registering. Your account has been successfully created.</p>
          <p>Here are some details about your registration:</p>
          <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Contact Number:</strong> ${contactNumber}</li>
                  </ul>
                  <p>You can now browse and book appointments with our doctors.</p>

                  
                  <p>Best regards,<br>The DABS Team</p>
              </body>
              </html>`;
};
