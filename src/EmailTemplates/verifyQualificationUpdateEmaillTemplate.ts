export const generateDoctorQualificationUpdateEmail = (
  doctorName: string,
  doctorEmail: string,
  specialization: string,
  qualification: string,
  documentLink: string,
): string => {
  return `
            <html>
              <body>
                <h1>Dear Admin,</h1>
                <p>
                  Dr. ${doctorName}(${doctorEmail}) has updated their profile with the following details:
                </p>
                <ul>
                  <li><strong>Qualification:</strong> ${qualification}</li>
                  <li><strong>Specialization:</strong> ${specialization}</li>
                </ul>
                <p>
                  The updated document for verification can be accessed <a href="${documentLink}">here</a>.
                </p>
                <p>
                  Please review and verify the updated information at your earliest convenience.
                </p>
                <p>
                  Best regards,<br />
                  The Hospital Management Team
                </p>
              </body>
            </html>
          `;
};
