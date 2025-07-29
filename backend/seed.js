const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seed() {
    try {
        // Delete all existing users
        await prisma.user.deleteMany();
        console.log('Deleted all existing users');

        // // Define new users to seed
        // const users = [
        //     { username: 'user1', email: 'user1@example.com' },
        //     { username: 'user2', email: 'user2@example.com' },
        //     { username: 'user3', email: 'user3@example.com' },
        // ];

        // // Hash password and create users
        // const saltRounds = 10;
        // const hashedPassword = await bcrypt.hash('password', saltRounds);

        // for (const user of users) {
        //     await prisma.user.create({
        //         data: {
        //             username: user.username,
        //             email: user.email,
        //             password: hashedPassword,
        //         },
        //     });
        //     console.log(`Created user: ${user.username}`);
        // }

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();