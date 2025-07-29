// routes/verifyOtpRouter.js

const express = require('express');
const verifyOtpRouter = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

verifyOtpRouter.post('/', async (req, res) => {
  const { otp, username, email, phoneNumber } = req.body;

  if (!otp || (!username && !email && !phoneNumber)) {
    return res.status(400).json({ error: 'OTP and one of username, email, or phone number are required' });
  }

  try {
    // Find user by username, email, or phoneNumber and not verified
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          username ? { username } : undefined,
          email ? { email } : undefined,
          phoneNumber ? { phoneNumber } : undefined
        ].filter(Boolean),
        isVerified: false
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found or already verified' });
    }

    // Find OTP for user
    const validOtp = await prisma.oTP.findFirst({
      where: {
        userId: user.id,
        otp
      }
    });

    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (new Date(validOtp.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'OTP expired. Please sign up again to get a new OTP.' });
    }

    // Mark user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true
      }
    });

    // Delete all OTPs for this user
    await prisma.oTP.deleteMany({
      where: { userId: user.id }
    });

    return res.status(200).json({
      message: 'Account successfully verified!',
      userId: user.id
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ error: 'Something went wrong during OTP verification' });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = verifyOtpRouter;
