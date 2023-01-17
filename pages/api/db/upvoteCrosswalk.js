import { prisma } from "../../../src/prisma";

export default async function upvoteCrosswalk(req, res) {
    const { markerId } = req.body;

    try {
        const update = await prisma.crosswalk.update({
            where: {
              id: markerId,
            },
            data: {
              votes: {
                increment: 1
              }
            },
          })
        res.json(update);
    } catch (error) {
        res.status(400).send(error.message);
    }
}