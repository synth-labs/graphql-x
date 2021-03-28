import { PrismaClient } from '@prisma/client';

type PrismaModel = keyof Omit<
    PrismaClient,
    'disconnect' | 'connect' | 'executeRaw' | 'queryRaw' | 'transaction' | 'on'
>

export default PrismaModel;