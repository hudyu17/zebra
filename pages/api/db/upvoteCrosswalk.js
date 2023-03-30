import { prisma } from "../../../src/prisma";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";

export default async function upvoteCrosswalk(req, res) {
  const session = await getServerSession(req, res, authOptions)
    if (!session) {
      res.status(401).send('No permissions')
      return
    }

    const { userId, markerId } = req.body;

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
        
        // Update uservote
        const user = await prisma.userVote.findUnique({
          where: {
            userId: userId
          }
        })

        if (user) {
          await prisma.userVote.update({
            where: {
              userId: userId
            },
            data: {
              upvoted: {
                push: markerId
              }
            }
          })
        } else {
          await prisma.userVote.create({
            data: {
              userId: userId,
              upvoted: [markerId]
            }
          })
        }
        
        res.json(update);
    } catch (error) {
        res.status(400).send(error.message);
    }
}