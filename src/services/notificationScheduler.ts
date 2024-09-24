import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from 'src/schemas/Appointment.schema';
import { Doctor } from 'src/schemas/Doctor.schema';
import { User } from 'src/schemas/User.schema';
import { addHours, isBefore, isToday } from 'date-fns';
import { MailerService } from '@nestjs-modules/mailer';
import * as Twilio from 'twilio';
import { generateAppointmnetAlertEmail } from 'src/EmailTemplates/appointmnetAlertNotificationEmailTemplate';
import { generateAppointmentAlertNotificationSMS } from 'src/SMS_Templates/appointmentAlertNotification';
@Injectable()
export class NotificationService {
  private alertHoursBefore = 4; // Alert 4 hours before the appointment

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
    const lowerTimeLimit = addHours(currentTime, this.alertHoursBefore);

    console.log('Running sendAppointmentNotifications...');

    try {
      console.log('Fetching accepted appointments for today...');
      const appointments = await this.appointmentModel
        .find({ status: 'accepted', notified: false })
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
        console.log('No accepted appointments found for today.');
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

        // Check if the appointment is scheduled for today
        if (!isToday(new Date(appointmentDate))) {
          continue; // Skip non-today appointments
        }

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
          `Lower time limit condition: isBefore(currentTime, lowerTimeLimit) = ${isBefore(alertTime, lowerTimeLimit)}`,
        );

        // Send notification if current time is 4 hours before the appointment
        if (
          isBefore(alertTime, currentTime) &&
          isBefore(currentTime, slotTime)
        ) {
          const user = patient.user;
          const contactNumber = patient.contactNumber;

          console.log(
            `Sending email to ${user.email} for appointment ${appointment._id}`,
          );
          const emailContent = generateAppointmnetAlertEmail(
            user.name,
            doctor.name,
            appointmentDate,
            bookedSlot.time,
          );
          await this.mailerService.sendMail({
            to: user.email,
            subject: 'Upcoming Appointment Reminder',
            html: emailContent,
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
            const SMS_Body = generateAppointmentAlertNotificationSMS(
              doctor.name,
              timeFormatter.format(slotTime),
              dateFormatter.format(appointmentDate),
            );
            await this.twilioClient.messages.create({
              body: SMS_Body,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: contactNumber,
            });
          }

          // Mark the appointment as notified to avoid multiple notifications
          appointment.notified = true;
          await appointment.save();
        }
      }

      console.log('All notifications processed.');
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  }

  scheduleNotifications() {
    console.log('Scheduling the notifications cron job...');
    cron.schedule('0 * * * *', async () => {
      console.log('Cron job triggered at:', new Date());
      await this.sendAppointmentNotifications();
    });
  }
}
