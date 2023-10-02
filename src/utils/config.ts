export default {
  rabbitmq: {
    name: process.env.RABBITMQ_NAME || 'RABBITMQ',
    hostname: process.env.RABBITMQ_HOSTNAME || 'localhost',
    rabbitMqport: parseInt(process.env.RABBITMQ_PORT, 10) || 5672,
  },
};
