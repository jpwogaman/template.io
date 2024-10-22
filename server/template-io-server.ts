import Fastify from 'fastify';
import cors from '@fastify/cors'
import { trpc } from '@/utils/trpc'
import { prisma } from './db'

const fastify = Fastify({
  logger: true
})

fastify.register(cors)

const PORT = { port: 5661 }

fastify.get('/api/trpc/items', async (req, res) => {
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  console.log(req.headers)

  //const { data } = trpc.test.export.useQuery()

  const items = await prisma.fileItems.findMany({
    include: {
      fullRange: true,
      artListTog: true,
      artListTap: true,
      artLayers: true,
      fadList: true
    }
  })

  res.type('application/json').status(200).send(items)
})

fastify.get('/trpc/test', async (req, res) => {
  const items = await prisma.fileItems.findMany({
    include: {
      fullRange: true,
      artListTog: true,
      artListTap: true,
      artLayers: true,
      fadList: true
    }
  })

  res.type('application/json').status(200).send({ data: items.length })
})

fastify.listen(PORT, (error, address) => {
  console.log(`Server listening on port ${PORT.port}`)
})
