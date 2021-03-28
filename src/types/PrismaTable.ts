
type DeleteArg = {
    where: {
        [key: string]: number | string | { [keys: string]: number | string };
    }
}

type UpdateArg = {
    where: {
        [key: string]: number | string | { [keys: string]: number | string };
    }
    data: { [keys: string]: any }
}

interface PrismaTable {
    create: (data: any) => any;
    update: (data: UpdateArg) => any;
    delete: (data: DeleteArg) => Promise<void>;
}

export default PrismaTable;