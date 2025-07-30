const { OAuth2Client } = require('google-auth-library');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
async function googleAuth(req, res) {
  console.log("endpoint hit");
  
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'No ID token provided' });

  try {
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("Creating new user");
      user = await prisma.user.create({
        data: {
          email,
          username: email, // or generate a username
          isVerified: true,
          profilePicture: picture,
          passwordHash: '', // No password for OAuth users
          accounts: {
            create: {
              provider: 'google',
              providerAccountId: sub,
            }
          }
        },
        include: { accounts: true }
      });
    } else {
      // Ensure Google account is linked
      const account = await prisma.account.findFirst({
        where: {
          userId: user.id,
          provider: 'google',
          providerAccountId: sub
        }
      });
      if (!account) {
        await prisma.account.create({
          data: {
            userId: user.id,
            provider: 'google',
            providerAccountId: sub
          }
        });
      }
    }

    // Issue JWT (or session)
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = googleAuth; 