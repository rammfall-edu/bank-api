import fastify from './index.mjs';

(async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    });
  } catch (err) {
    console.log(err);
  }
})();
