import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "info@milele.health",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "info@milele.health",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "info@milele.health",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendVerificationOTP = async (email: string, otp: number) => {
  try {
    await resend.emails
      .send({
        from: "info@milele.health",
        to: email,
        subject: "2FA Code",
        html: `<p>Your verification code: ${otp} and expires in 10 minutes</p>`,
      })
      .then(() => {
        return { success: true, message: "OTP sent successfully" };
      })
      .catch((error) => {
        return { success: false, message: "Failed to send OTP" };
      });
  } catch (error) {
    return { success: false, message: "Failed to send OTP" };
  }
};

const generateTable = (result: any) => {
  return result
    .map(
      (entry: any) => `
      <tr>
          <td>${entry.id}</td>
          <td>${entry.userId}</td>
          <td>${entry.user.phone || "N/A"}</td>
          <td>${entry.lastStep}</td>
          <td>${entry.selectedDate ? new Date(entry.selectedDate).toLocaleDateString() : "N/A"}</td>
          <td>${entry.selectedTimeSlotId || "N/A"}</td>
          <td>${new Date(entry.updatedAt).toLocaleString()}</td>
          <td>${entry.processedAt ? new Date(entry.processedAt).toLocaleString() : "N/A"}</td>
      </tr>
  `,
    )
    .join("");
};

export const sendCancelledAppointments = async (results: any) => {
  const cancelledAppointments = await generateTable(results);

  try {
    await resend.emails
      .send({
        from: "info@milele.health",
        to: "info@milele.health",
        subject: "2FA Code",
        html: `<table border="1" width="100%" cellspacing="0" cellpadding="5" style="border-collapse: collapse; font-family: Arial, sans-serif;">
        <thead>
            <tr style="background-color: #f2f2f2;">
                <th>ID</th>
                <th>User ID</th>
                <th>Phone</th>
                <th>Last Step</th>
                <th>Selected Date</th>
                <th>Selected Time Slot ID</th>
                <th>Updated At</th>
                <th>Processed At</th>
            </tr>
        </thead>
        <tbody>
            ${cancelledAppointments}
        </tbody>
    </table>`,
      })
      .then(() => {
        return { success: true, message: "Email sent successfully" };
      })
      .catch((error) => {
        return { success: false, message: "Failed to send Email" };
      });
  } catch (error) {
    return { success: false, message: "Failed to send Email" };
  }
};

export const sendAppointmentBookings = async (
  email: string,
  name: string,
  phone: string,
  date: string,
  time: string,
) => {
  try {
    await resend.emails
      .send({
        from: "info@milele.health",
        to: email,
        subject: "New Appointment Booking",
        html: `<p>New appointment booked by ${name} with phone number ${phone} for ${date} at ${time}</p>`,
      })
      .then(() => {
        return { success: true, message: "sent successfully" };
      })
      .catch((error) => {
        return { success: false, message: "Failed to send" };
      });
  } catch (error) {
    return { success: false, message: "Failed to send" };
  }
};
