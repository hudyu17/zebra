import { prisma } from "../../../src/prisma";

export default async function getMyCrosswalks(req, res) {
    const { userId } = req.body;
   

    const result = await prisma.crosswalk.findMany({
        where: {
            userId: userId
        }
    })

    res.json(result);
}