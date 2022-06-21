import { PrismaClient } from "@prisma/client";

import AnyMap from "../../types/AnyMap";
import PrismaTable from "../../types/PrismaTable";
import PrismaModel from "../../types/PrismaModel";
import CustomError from "../../types/CustomError";

function deleteTypeMutationResolver(tableName: string, prisma: PrismaClient) {
    return async (_parent: any, args: AnyMap) => {
        if (!args.id || !Number.isInteger(args.id)) {
            throw new Error("The `id` argument is mandatory and must be an integer.");
        }

        if (!(tableName in prisma)) {
            throw new Error(`Tablename \`${tableName}\` is missing on Prisma client!`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const table: PrismaTable = <PrismaTable>prisma[tableName as PrismaModel];

        try {
            await table.delete({
                where: {
                    id: <number>args.id
                }
            });
        } catch (e) {
            const err: CustomError = <CustomError>e;
            if (err.code === "P2014" || err.code === "P2003") {
                throw new Error("Cannot delete since the object has references!");
            } else {
                throw new Error(err.message);
            }
        }

        return <number>args.id;
    };
}

export default deleteTypeMutationResolver;
