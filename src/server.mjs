import fastify from './index.mjs';

(async () => {
  try {
    await fastify.listen(process.env.PORT || 3000, '0.0.0.0');
  } catch (err) {
    console.log(err);
  }
})();
