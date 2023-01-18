import { prisma } from "../../../src/prisma";

export default async function deleteCrosswalk(req, res) {
    const { 
        userId, // just another weak check
        markerId
    } = req.body;

    try {
        const deleteCrosswalk = await prisma.crosswalk.delete({
            where: {
                userId: userId,
                id: markerId
            }
          })
        res.json(deleteCrosswalk);
    } catch (error) {
        res.status(400).send(error.message);
    }
}