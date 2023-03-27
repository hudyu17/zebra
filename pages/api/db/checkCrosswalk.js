import { prisma } from "../../../src/prisma";

export default async function checkCrosswalk(req, res) {
    const { userId, markerId } = req.body;

    try {
        const marker = await prisma.crosswalk.findUnique({
            where: {
                id: markerId
            }
        })
        const voted = await prisma.userVote.findUnique({
            where: {
                userId: userId
            },
            select: {
                upvoted: true            
            }
        })
        if (!voted) {
            res.json({upvoted: false, marker: marker})
        } else {
            if (voted.upvoted.includes(markerId)) {
                res.json({upvoted: true, marker: marker})
            } else {
                res.json({upvoted: false, marker: marker})
            }
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}