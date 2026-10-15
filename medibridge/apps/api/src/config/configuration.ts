export default () => ({
  port: Number(process.env.PORT ?? 4000),
  webUrl: process.env.WEB_URL ?? "http://localhost:3000",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
  redis: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  storage: {
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT,
  },
});
