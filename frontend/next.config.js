/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{
      source: "/backend/user/login",
      destination: "http://backend:8000/user/login/",
    }, {
      source: "/backend/user/signup",
      destination: "http://backend:8000/user/signup/",
    }, {
      source: "/backend/user/update",
      destination: "http://backend:8000/user/update/"
    }]
  }
}

module.exports = nextConfig
