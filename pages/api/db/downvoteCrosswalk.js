import { prisma } from "../../../src/prisma";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";

export default async function downvoteCrosswalk(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      res.status(401).send('No permissions')
      return
    }

    const { userId, markerId } = req.body;
    
    try {
        // Update uservote; user must exist if they've already upvoted
        const upvoted = await prisma.userVote.findUnique({
          where: {
            userId: userId
          },
          select: {
            upvoted: true
          }
        })
        const index = upvoted.upvoted.indexOf(markerId);
        if (index > -1) { // only splice array when item is found
          upvoted.upvoted.splice(index, 1); // 2nd parameter means remove one item only
        } else {
          // Crosswalk wasn't upvoted previously (maybe error)
          res.status(400).send('Already downvoted')
          return
        }

        const newUpvoted = upvoted.upvoted;
        
        const updateUserVote = await prisma.userVote.update({
            where: {
              userId: userId
            },
            data: {
              upvoted: newUpvoted
            }
          })

        // Decrement votes
        const updateVotes = await prisma.crosswalk.update({
          where: {
            id: markerId,
          },
          data: {
            votes: {
              decrement: 1
            }
          },
        })
        res.json(updateUserVote);
    } catch (error) {
        res.status(400).send(error.message);
    }
}