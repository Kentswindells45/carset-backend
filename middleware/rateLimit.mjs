import arcjet from "@arcjet/node";

const arc = arcjet({
  token: process.env.ARCJET_API_KEY,
  rules: [
    {
      key: (req) => req.ip,
      limit: 100,
      window: 60,
    },
  ],
});


export default arc.protect;
