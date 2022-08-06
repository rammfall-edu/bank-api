import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
});

fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true,
});
fastify.register(import('@fastify/cookie'));

const db = {
  account: 100,
  transactions: {
    1: {
      type: 'Sending',
      amount: 20,
      date: '2022-01-01T00:00:00',
      description: 'Top up balance my internet provider',
      id: 1,
    },
    2: {
      type: 'Receiving',
      amount: 40,
      date: '2022-02-01T00:00:00',
      description: 'Money from my boss',
      id: 2,
    },
  },
  getLength() {
    return Object.keys(this.transactions).length;
  },
};

fastify.register(
  (instance, opts, done) => {
    instance.get('/transactions', async (request, reply) => {
      reply.send(db.transactions);
    });
    instance.get('/account', async (request, reply) => {
      reply.send({ account: db.account });
    });
    instance.post('/transactions', async (request, reply) => {
      const { type, description, amount } = request.body;
      const transaction = {
        type,
        description,
        amount,
        date: new Date().toLocaleString(),
        id: db.getLength(),
      };

      db.transactions[db.getLength()] = transaction;

      reply.send(transaction);
    });

    done();
  },
  {
    prefix: '/api',
  }
);

export default fastify;
