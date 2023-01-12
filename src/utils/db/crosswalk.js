// import prisma from "../../prisma";

// const createCrosswalk = async ({ userId, lat, lng }) => {
//     let currDate = new Date();
//     const isoDate = currDate.toISOString()

//     console.log(userId, lat, lng)

//     const crosswalk = await prisma.crosswalk.create({
//         userId: userId,
//         latitude: lat,
//         longitude: lng,
//         address: 'test_address',
//         votes: 0,
//         createdAt: isoDate,
//         updatedAt: isoDate
//       })
    
//     return crosswalk;
// }

// export { createCrosswalk };