import Fastify from 'fastify';

const fastify = Fastify({
  logger: true
});

fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true
});
fastify.register(import('@fastify/cookie'));
fastify.register(import('@fastify/swagger'), {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Bank API doc',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header'
      }
    }
  },
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  exposeRoute: true
})

const db = {
  account: 100,
  transactions: {
    0: {
      type: 'Sending',
      amount: 20,
      date: '2022-01-01T00:00:00',
      description: 'Top up balance my internet provider',
      id: 0
    },
    1: {
      type: 'Receiving',
      amount: 40,
      date: '2022-02-01T00:00:00',
      description: 'Money from my boss',
      id: 1
    }
  },
  getLength() {
    return Object.keys(this.transactions).length;
  }
};

fastify.register(
  (instance, opts, done) => {
    instance.get('/transactions', async (request, reply) => {
      reply.send(db.transactions);
    });
    instance.get('/account', async (request, reply) => {
      reply.send({ account: db.account });
    });
    instance.post('/transactions',{
      schema: {
        body: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['Sending', 'Receiving']
            },
            description: {
              type: 'string'
            },
            amount: {
              type: 'number',
              minimum: 1,
            }
          },
          required: ['type', 'description', 'amount'],
        }
      }
    }, async (request, reply) => {
      const { type, description, amount } = request.body;
      const transaction = {
        type,
        description,
        amount,
        date: new Date().toLocaleString(),
        id: db.getLength()
      };

      if (type === 'Sending' && Number(amount) > db.account) {
        return reply.status(400).send({ info: 'You have not enough money' });
      }

      if (type === 'Sending') {
        db.account -= Number(amount);
      }
      if (type === 'Receiving') {
        db.account += Number(amount);
      }


        db.transactions[db.getLength()] = transaction;

      reply.send(transaction);
    });

    done();
  },
  {
    prefix: '/api'
  }
);

export default fastify;
