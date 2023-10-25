/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{
      source: "/backend/user/ping",
      destination: "http://backend:8000/user/ping/",
    }, {
      source: "/backend/user/login",
      destination: "http://backend:8000/user/login/",
    }, {
      source: "/backend/user/signup",
      destination: "http://backend:8000/user/signup/",
    }, {
      source: "/backend/user/update",
      destination: "http://backend:8000/user/update/"
    }, {
      source: "/backend/user/get",
      destination: "http://backend:8000/user/get/",
    }, {
      source: "/backend/node/create",
      destination: "http://backend:8000/node/create/",
    }]
  }
}

module.exports = nextConfig
