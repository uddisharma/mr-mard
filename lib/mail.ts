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
    subject: "2FA Code | Milele Health",
    html: `<p>Your 2FA code for login: ${token}</p>`,
  });
};

export const sendVerificationOTP = async (
  recipientEmail: string,
  authCode: Number,
) => {
  try {
    await resend.emails.send({
      from: "info@milele.health",
      to: recipientEmail,
      subject: "Your Milele Health 2FA Verification Code",
      html: `<p>Hello,</p>
      <p>Your one‑time verification code is:</p>
      <h2 style="margin: 0;">${authCode}</h2>
      <p>This code will expire in 10 minutes. If you did not request it, please ignore this email.</p>
    `,
    });
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.log("error sending email ", error);
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
    await resend.emails.send({
      from: "info@milele.health",
      to: email,
      subject: "New Appointment Booking",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #2E86C1;">📅 New Appointment Booking</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone Number:</strong> ${phone}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        </div>
      `,
    });

    return { success: true, message: "sent successfully" };
  } catch (error) {
    return { success: false, message: "Failed to send" };
  }
};
