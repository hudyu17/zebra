import { prisma } from "../../../src/prisma";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";

export default async function checkUser(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      res.status(401).send('No permissions')
      return
    }

    const { userId } = req.body;
    
    try {
        // Update uservote; user must exist if they've already upvoted
        const count = await prisma.crosswalk.aggregate({
          _count: {
            id: true
          },
          where: {
            userId: {
                contains: userId
            }
          }
        })
        
        res.json(count);
    } catch (error) {
        res.status(400).send(error.message);
    }
}