import { prisma } from "../../../src/prisma";

export default async function downvoteCrosswalk(req, res) {
    const { markerId } = req.body;

    try {
        const update = await prisma.crosswalk.update({
            where: {
              id: markerId,
            },
            data: {
              votes: {
                decrement: 1
              }
            },
          })
        res.json(update);
    } catch (error) {
        res.status(400).send(error.message);
    }
}