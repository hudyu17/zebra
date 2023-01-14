import { prisma } from "../../../src/prisma";

export default async function createCrosswalk(req, res) {
    const { userId, lat, lng } = req.body;
    
    let currDate = new Date();
    const isoDate = currDate.toISOString()

    // console.log(userId, lat, lng)

    const result = await prisma.crosswalk.create({
        data: {
            userId: userId,
            latitude: lat,
            longitude: lng,
            address: 'test_address',
            votes: 0,
            createdAt: isoDate,
            updatedAt: isoDate
        }
      })

    res.json(result);
}