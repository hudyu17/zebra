import { prisma } from "../../../src/prisma";

export default async function deleteCrosswalk(req, res) {
    const { markerId } = req.query;

    try {
        const deleteCrosswalk = await prisma.crosswalk.delete({
            where: {
                id: markerId
            }
          })
        res.json(deleteCrosswalk);
    } catch (error) {
        res.status(400).send(error.message);
    }
}