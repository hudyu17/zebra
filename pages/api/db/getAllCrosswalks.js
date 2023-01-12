import { prisma } from "../../../src/prisma";

export default async function getAllCrosswalks(req, res) {
    

    const result = await prisma.crosswalk.findMany({
        
      })

    res.json(result);
}