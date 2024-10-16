export default {
  cookieName: "CATT_USER_COOKIE",
  password: process.env.API_KEY,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true: false,
  },
  ttl: 60 * 60 * 24 //24hrs
}
