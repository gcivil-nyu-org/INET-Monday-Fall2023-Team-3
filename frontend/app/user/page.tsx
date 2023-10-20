'use client'

import { Avatar } from "@mui/material"
import { useEffect, useState } from "react"
import GraphList from "./components/GraphList"
import { useRouter } from "next/navigation"

export default function User() {
  const router = useRouter()
  const [token, setToken] = useState<string>("")

  // redirect to welcome page if not logged in
  useEffect(() => {
    setToken(sessionStorage.getItem("token") ?? "")

    if (token === undefined || token === "") {
      router.replace("/")
    }
  }, [])

  return (
    <div className="w-full h-full flex flex-col min-h-screen">
      <div className="absolute top-8 right-8 h-16 w-16 p-2 rounded-lg bg-white bg-opacity-60">
        <Avatar className="w-12 h-12" src="https://mui.com/static/images/avatar/1.jpg" />
      </div>
      <GraphList name="Recent Graph" graphs={[{ id: "id-1", title: "dummy", imgUrl: "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg" }]} />
      <GraphList name="Shared Graph" graphs={[{ id: "id-1", title: "dummy", imgUrl: "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg" }]} />
    </div>
  )
}
