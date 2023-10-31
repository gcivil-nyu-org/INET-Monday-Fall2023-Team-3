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
    }, {
      source: "/user/ping",
      destination: "http://localhost:8000/user/ping/",
    }, {
      source: "/user/login",
      destination: "http://localhost:8000/user/login/",
    }, {
      source: "/user/signup",
      destination: "http://localhost:8000/user/signup/",
    }, {
      source: "/user/update",
      destination: "http://localhost:8000/user/update/"
    }, {
      source: "/user/get",
      destination: "http://localhost:8000/user/get/",
    }, {
      source: "/node/create",
      destination: "http://localhost:8000/node/create/",
    }, {
      source: "/node/edit",
      destination: "http://localhost:8000/node/edit/",
    }, {
      source: "/node/delete",
      destination: "http://localhost:8000/node/delete/",
    }, {
      source: "/node/predefined-nodes",
      destination: "http://localhost:8000/node/predefined-nodes/",
    }, {
      source: "/edge/create",
      destination: "http://localhost:8000/edge/create/",
    }, {
      source: "/edge/delete",
      destination: "http://localhost:8000/edge/delete/",
    }]
  }
}

module.exports = nextConfig
