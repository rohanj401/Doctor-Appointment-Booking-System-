// src/templates/welcomeDoctorEmailTemplate.ts

export const generateDoctorWelcomeEmail = (
  name: string,
  speciality: string,
  contactNumber: string,
): string => {
  return `
      <html>
        <body>
          <h1>Welcome to Our Platform, Dr. ${name}!</h1>
          <p>We are excited to have you on board as one of our esteemed doctors.</p>
          <p>Thank you for registering. Your profile has been successfully created.</p>
          <p>Here are some details about your registration:</p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Specialty:</strong> ${speciality}</li>
            <li><strong>Contact Number:</strong> ${contactNumber}</li>
          </ul>
          <p>Once your details are verified by our admin, you will be added to the list of doctors available to patients.
          You will receive a notification email once your verification is complete.</p>
          
          <p>Best regards,<br>The DABS Team</p>
        </body>
      </html>
    `;
};
// <p>If you have any questions, feel free to contact us at
// <a href="mailto:support@example.com">support@example.com</a>.</p>
