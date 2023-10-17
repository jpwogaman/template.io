import { type NextApiRequest, type NextApiResponse } from 'next'

import { prisma } from '@/server/db/client'

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  const examples = await prisma.fileItems.findMany({
    include: {
      fullRange: true,
      artListTog: true,
      artListSwitch: true,
      fadList: true
    }
  })
  res.status(200).json(examples)
}

export default examples
