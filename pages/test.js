import prisma from "../src/prisma";


export default function test({jsonData}) {
  return (
    <div>{jsonData}</div>
  )
}


export const getStaticProps = async () => {
    const data = await prisma.crosswalk.findMany({});
    const jsonData = JSON.stringify(data)
    
    return {
      props: { jsonData },
      revalidate: 10,
    };
  };