import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient;

async function hashPassword(password: string): Promise<Buffer> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return Buffer.from(hashedPassword, 'utf8');
}
async function CuyTest() {
    const body = {
        fullName: "Test",
        password: "123",
        email: "johndoe@gmail.com",
        phone: "0891237123"
    };
    await prisma.user.create({
        data: {
            fullName: body.fullName,
            password: await hashPassword(body.password.toString()),
            email: body.email,
            phone: body.phone
        }
    });
    console.log(`Hash Password => `, );
}
console.log(`CuyTest()`, CuyTest());


