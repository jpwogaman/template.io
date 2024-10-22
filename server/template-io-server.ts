import Fastify from 'fastify';
import cors from '@fastify/cors';
import { add } from '@/shared/add';
import { trpc } from '@/utils/trpc'

const fastify = Fastify({
  logger: true
})

fastify.register(cors)

const PORT = { port: 5661 }

fastify.get('/trpc/test', async (req, res) => {
  req.log.info('TEST')
  const data = trpc.test.export.useQuery()
  res.type('application/json').status(200).send(data)
})

fastify.listen(PORT, (error, address) => {
  console.log(`Server listening on port ${PORT.port}`)
})
