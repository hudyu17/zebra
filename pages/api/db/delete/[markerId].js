import { prisma } from "../../../../src/prisma";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]";

export default async function deleteCrosswalk(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      res.status(401).send('No permissions')
      return
    }
    
    const { markerId } = req.query;

    try {
        const deleteCrosswalk = await prisma.crosswalk.delete({
            where: {
                id: parseInt(markerId),
            },
          })
        res.json(deleteCrosswalk);
    } catch (error) {
        res.status(400).send(error.message);
    }
}