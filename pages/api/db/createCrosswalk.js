import { prisma } from "../../../src/prisma";
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";

export default async function createCrosswalk(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
      res.status(401).send('No permissions')
      return
    }
    
    const { 
        userId, 
        address,
        description,
        // image
        lat, 
        lng,
        shareInfo, // nameImage, nameOnly, anon
    } = req.body;
    
    let currDate = new Date();
    const isoDate = currDate.toISOString()

    try {
        const result = await prisma.crosswalk.create({
            data: {
                userId: userId,
                latitude: lat,
                longitude: lng,
                address: address,
                description: description,
                votes: 0,
                shareInfo: shareInfo,
                createdAt: isoDate,
                updatedAt: isoDate
            }
          })
        res.json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}