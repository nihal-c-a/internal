// import { prisma } from './prismaClient'; // Replace this with your actual Prisma setup if you're using it

// Fetch all payments from the database
export async function fetchAllPayments() {
    return await prisma.payment.findMany({
        select: {
            id: true,
            userId: true,
            amount: true,
            date: true,
        },
    });
}

// Fetch all users from the database
export async function fetchAllUsers() {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
        },
    });
}

// Group payments by user
export async function getAllPaymentsGroupedByUser() {
    const payments = await fetchAllPayments();
    const users = await fetchAllUsers();

    return users.map((user) => {
        const userPayments = payments.filter((p) => p.userId === user.id);
        const total = userPayments.reduce((sum, p) => sum + p.amount, 0);

        return {
            userId: user.id,
            userName: user.name,
            total,
            payments: userPayments,
        };
    });
}
