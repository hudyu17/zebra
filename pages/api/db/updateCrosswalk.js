import { prisma } from "../../../src/prisma";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";

export default async function updateCrosswalk(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      res.status(401).send('No permissions')
      return
    }
    
    const { 
        // userId, 
        markerId,
        address,
        description,
        shareInfo, // nameImage, nameOnly, anon
    } = req.body;
    
    let currDate = new Date();
    const isoDate = currDate.toISOString()

    try {
        const updateCrosswalk = await prisma.crosswalk.update({
            where: {
                // userId: userId,
                id: markerId
            },
            data: {
                address: address,
                description: description,
                updatedAt: isoDate
            }
          })
        res.json(updateCrosswalk);
    } catch (error) {
        res.status(400).send(error.message);
    }
}