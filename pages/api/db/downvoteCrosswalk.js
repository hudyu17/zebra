import { prisma } from "../../../src/prisma";

export default async function downvoteCrosswalk(req, res) {
    const { userId, markerId } = req.body;

    try {
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

        // update uservote; user must exist if they've already upvoted
        const upvoted = await prisma.userVote.findUnique({
          where: {
            userId: userId
          },
          select: {
            upvoted: true
          }
        })
        console.log(upvoted)
        const index = upvoted.upvoted.indexOf(markerId);
        if (index > -1) { // only splice array when item is found
          upvoted.upvoted.splice(index, 1); // 2nd parameter means remove one item only
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
        res.json(updateUserVote);
    } catch (error) {
        res.status(400).send(error.message);
    }
}