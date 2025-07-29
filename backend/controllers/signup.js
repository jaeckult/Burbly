// routes/signupRouter.js

const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const twilioClient = require('../utils/twilio');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const signupRouter = express.Router();
const prisma = new PrismaClient();

signupRouter.post('/', async (req, res) => {
    // console.log(Object.keys(prisma));

  const { username, email, password } = req.body;
  console.log("you are here");
  

  if (!username  || !email || !password) {
    return res.status(400).json({ error: 'Username email, and password are required' });
  }

  try {
    // Check if user already exists by username, phone, or email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    let user;
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ error: 'Username, or email already in use and verified' });
      }
      // Update passwordHash in case user wants to change password before verifying
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          passwordHash,
          // Optionally update phone/email if you want to allow changing before verification
        }
      });
    } else {
      // Create the user
      user = await prisma.user.create({
        data: {
          username,
          email,
          passwordHash,
          isVerified: false
        }
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Creating OTP for user:', user.id, otp);

    // Upsert OTP (update if exists, create if not)
    await prisma.oTP.upsert({
      where: {
        userId: user.id,
      },
      update: {
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        verified: false,
      },
      create: {
        userId: user.id,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        verified: false,
      }
    });

    console.log('created OTP for user:', user.id, otp);

    const msg = {
  to: email, // Change to your recipient
  from: 'yitbarek.alemu-ug@aau.edu.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'here is your OTP: ' + otp,
  html: '<strong>here is your otp</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })

    return res.status(200).json({
      id: user.id,
      message: 'OTP sent. Please verify with /verify-otp',
      requiresOtp: true
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Something went wrong during signup' });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = signupRouter;
