// import { Injectable } from '@nestjs/common';
// import * as cron from 'node-cron';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Appointment } from 'src/schemas/Appointment.schema';
// import { Doctor } from 'src/schemas/Doctor.schema';
// import { User } from 'src/schemas/User.schema';
// import { addHours, isBefore } from 'date-fns';
// import { MailerService } from '@nestjs-modules/mailer';

// @Injectable()
// export class NotificationService {
//   private alertHoursBefore = 1; // Alert 1 hour before the appointment

//   constructor(
//     @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
//     @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
//     @InjectModel(User.name) private userModel: Model<User>,
//     private readonly mailerService: MailerService,
//   ) {}

//   async sendAppointmentNotifications() {
//     const currentTime = new Date();
//     const upperTimeLimit = addHours(currentTime, this.alertHoursBefore);

//     console.log('Running sendAppointmentNotifications...');

//     try {
//       console.log('Fetching accepted appointments...');
//       const appointments = await this.appointmentModel
//         .find({ status: 'accepted' })
//         .populate({
//           path: 'doctor',
//           select: 'availability name',
//         })
//         .populate({
//           path: 'patient',
//           select: 'user',
//           populate: {
//             path: 'user',
//             select: 'name email',
//           },
//         })
//         .exec();

//       if (!appointments || appointments.length === 0) {
//         console.log('No accepted appointments found.');
//         return;
//       }

//       console.log(`Found ${appointments.length} appointments to process...`);

//       for (const appointment of appointments) {
//         const doctor = appointment.doctor as any;
//         const patient = appointment.patient as any;

//         if (!doctor || !doctor.availability) {
//           console.warn(
//             `Doctor or availability data missing for appointment ${appointment._id}`,
//           );
//           continue;
//         }

//         if (!patient || !patient.user || !patient.user.email) {
//           console.warn(
//             `Patient or user data missing for appointment ${appointment._id}`,
//           );
//           continue;
//         }

//         const { appointmentDate, slot } = appointment;

//         const availabilityForDate = doctor.availability.find(
//           (availability: any) =>
//             new Date(availability.date).toDateString() ===
//             new Date(appointmentDate).toDateString(),
//         );

//         if (!availabilityForDate) {
//           console.warn(
//             `No availability found for appointment ${appointment._id}`,
//           );
//           continue;
//         }

//         const bookedSlot = availabilityForDate.slots.find(
//           (s: any) =>
//             s._id.toString() === slot.toString() && s.status === 'booked',
//         );

//         if (!bookedSlot) {
//           console.warn(
//             `Booked slot not found for appointment ${appointment._id}`,
//           );
//           continue;
//         }

//         const [slotHour, slotMinute] = bookedSlot.time.split(':').map(Number);
//         const slotTime = new Date(appointmentDate);
//         slotTime.setHours(slotHour, slotMinute, 0, 0);

//         const alertTime = addHours(slotTime, -this.alertHoursBefore);

//         console.log(`Current time: ${currentTime}, Alert time: ${alertTime}`);
//         console.log(
//           `Alert time condition: isBefore(currentTime, alertTime) = ${isBefore(currentTime, alertTime)}`,
//         );
//         console.log(
//           `Upper time limit condition: isBefore(alertTime, upperTimeLimit) = ${isBefore(alertTime, upperTimeLimit)}`,
//         );

//         if (
//           isBefore(alertTime, currentTime) &&
//           isBefore(currentTime, upperTimeLimit)
//         ) {
//           const user = patient.user;

//           console.log(
//             `Sending email to ${user.email} for appointment ${appointment._id}`,
//           );
//           await this.mailerService.sendMail({
//             to: user.email,
//             subject: 'Upcoming Appointment Reminder',
//             html: this.generateEmailTemplate(
//               user.name,
//               doctor.name,
//               appointmentDate,
//               bookedSlot.time,
//             ),
//           });
//         }
//       }

//       console.log('All notifications processed.');
//     } catch (error) {
//       console.error('Error sending notifications:', error);
//     }
//   }

//   private generateEmailTemplate(
//     userName: string,
//     doctorName: string,
//     appointmentDate: Date,
//     time: string,
//   ): string {
//     // Parse the time into hours and minutes
//     const [hours, minutes] = time.split(':').map(Number);

//     // Create a Date object for the appointment time
//     const appointmentTime = new Date(appointmentDate);
//     appointmentTime.setHours(hours, minutes, 0, 0);

//     // Format the appointment time to 12-hour format
//     const timeFormatter = new Intl.DateTimeFormat('en-US', {
//       hour: 'numeric',
//       minute: 'numeric',
//       hour12: true,
//     });

//     // Format the appointment date
//     const dateFormatter = new Intl.DateTimeFormat('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });

//     return `
//       <html>
//         <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; margin: 0; padding: 0;">
//           <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; padding: 20px;">
//             <tr>
//               <td style="padding: 20px; text-align: center;">
//                 <h1 style="font-size: 24px; color: #2d3748; margin-bottom: 20px;">Dear ${userName},</h1>
//                 <p style="font-size: 16px; margin-bottom: 20px;">
//                   This is a friendly reminder that you have an appointment scheduled with Dr. ${doctorName} today on ${dateFormatter.format(appointmentDate)} at ${timeFormatter.format(appointmentTime)}.
//                 </p>
//                 <p style="font-size: 16px; margin-bottom: 20px;">
//                   Please make sure to arrive early to complete any necessary paperwork.
//                 </p>
//                 <p style="font-size: 16px; color: #4a5568;">
//                   Thank you!
//                 </p>
//               </td>
//             </tr>
//           </table>
//         </body>
//       </html>
//     `;
//   }

//   scheduleNotifications() {
//     console.log('Scheduling the notifications cron job...');
//     cron.schedule('0 * * * *', async () => {
//       console.log('Cron job triggered at:', new Date());
//       await this.sendAppointmentNotifications();
//     });
//   }
// }

import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from 'src/schemas/Appointment.schema';
import { Doctor } from 'src/schemas/Doctor.schema';
import { User } from 'src/schemas/User.schema';
import { addHours, isBefore } from 'date-fns';
import { MailerService } from '@nestjs-modules/mailer';
import * as Twilio from 'twilio';

@Injectable()
export class NotificationService {
  private alertHoursBefore = 1; // Alert 1 hour before the appointment

  private twilioClient: Twilio.Twilio;

  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {
    this.twilioClient = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendAppointmentNotifications() {
    const currentTime = new Date();
    const upperTimeLimit = addHours(currentTime, this.alertHoursBefore);

    console.log('Running sendAppointmentNotifications...');

    try {
      console.log('Fetching accepted appointments...');
      const appointments = await this.appointmentModel
        .find({ status: 'accepted' })
        .populate({
          path: 'doctor',
          select: 'availability name',
        })
        .populate({
          path: 'patient',
          select: 'user contactNumber',
          populate: {
            path: 'user',
            select: 'name email',
          },
        })
        .exec();

      if (!appointments || appointments.length === 0) {
        console.log('No accepted appointments found.');
        return;
      }

      console.log(`Found ${appointments.length} appointments to process...`);

      for (const appointment of appointments) {
        const doctor = appointment.doctor as any;
        const patient = appointment.patient as any;

        if (!doctor || !doctor.availability) {
          console.warn(
            `Doctor or availability data missing for appointment ${appointment._id}`,
          );
          continue;
        }

        if (!patient || !patient.user || !patient.user.email) {
          console.warn(
            `Patient or user data missing for appointment ${appointment._id}`,
          );
          continue;
        }

        const { appointmentDate, slot } = appointment;

        const availabilityForDate = doctor.availability.find(
          (availability: any) =>
            new Date(availability.date).toDateString() ===
            new Date(appointmentDate).toDateString(),
        );

        if (!availabilityForDate) {
          console.warn(
            `No availability found for appointment ${appointment._id}`,
          );
          continue;
        }

        const bookedSlot = availabilityForDate.slots.find(
          (s: any) =>
            s._id.toString() === slot.toString() && s.status === 'booked',
        );

        if (!bookedSlot) {
          console.warn(
            `Booked slot not found for appointment ${appointment._id}`,
          );
          continue;
        }

        const [slotHour, slotMinute] = bookedSlot.time.split(':').map(Number);
        const slotTime = new Date(appointmentDate);
        slotTime.setHours(slotHour, slotMinute, 0, 0);

        const alertTime = addHours(slotTime, -this.alertHoursBefore);

        console.log(`Current time: ${currentTime}, Alert time: ${alertTime}`);
        console.log(
          `Alert time condition: isBefore(currentTime, alertTime) = ${isBefore(currentTime, alertTime)}`,
        );
        console.log(
          `Upper time limit condition: isBefore(alertTime, upperTimeLimit) = ${isBefore(alertTime, upperTimeLimit)}`,
        );

        if (
          isBefore(alertTime, currentTime) &&
          isBefore(currentTime, upperTimeLimit)
        ) {
          const user = patient.user;
          const contactNumber = patient.contactNumber;

          console.log(
            `Sending email to ${user.email} for appointment ${appointment._id}`,
          );
          await this.mailerService.sendMail({
            to: user.email,
            subject: 'Upcoming Appointment Reminder',
            html: this.generateEmailTemplate(
              user.name,
              doctor.name,
              appointmentDate,
              bookedSlot.time,
            ),
          });

          if (contactNumber) {
            console.log(
              `Sending SMS to ${contactNumber} for appointment ${appointment._id}`,
            );
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

            await this.twilioClient.messages.create({
              body: `Reminder: You have an appointment with Dr. ${doctor.name} today at ${timeFormatter.format(slotTime)}. Date: ${dateFormatter.format(appointmentDate)}. Please arrive early.`,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: contactNumber,
            });
          }
        }
      }

      console.log('All notifications processed.');
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  }

  private generateEmailTemplate(
    userName: string,
    doctorName: string,
    appointmentDate: Date,
    time: string,
  ): string {
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
  }

  scheduleNotifications() {
    console.log('Scheduling the notifications cron job...');
    cron.schedule('0 * * * *', async () => {
      console.log('Cron job triggered at:', new Date());
      await this.sendAppointmentNotifications();
    });
  }
}
