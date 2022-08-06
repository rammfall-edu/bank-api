import fastify from '../index';

describe('fastify', () => {
  describe('GET /api/account', () => {
    it('returns actual bank account', async () => {
      const { body } = await fastify.inject({
        method: 'GET',
        url: '/api/account',
      });

      expect(JSON.parse(body)).toEqual({ account: 100 });
    });
  });

  describe('GET /api/transactions', function () {
    it('get all transactions', async () => {
      const { body } = await fastify.inject({
        method: 'GET',
        url: '/api/transactions',
      });

      expect(JSON.parse(body)).toEqual({
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
      });
    });
  });

  describe('POST /api/transactions', () => {
    it('should create transaction', async () => {
      const payload = new FormData();

      payload.append('description', 'Gift for my friend');
      payload.append('type', 'Sending');
      payload.append('amount', '50');

      const { body } = await fastify.inject({
        method: 'POST',
        url: '/api/transactions',
        payload: new FormData(),
      });

      // expect(body).toEqual({
      //   id: 3,
      //   description,
      //
      // });
    });
  });
});
