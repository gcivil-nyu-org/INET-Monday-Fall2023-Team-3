import { Button, Avatar, Dialog, DialogTitle } from "@mui/material"
import { useState } from "react"
import { redirect } from "react-router-dom"
import GraphList from "components/user/GraphList"
import Update from "components/user/Update"

export default function User() {
  const [update, setUpdate] = useState(false)

  const onUpdateCancelled = () => {
    console.log("update cancelled")
    setUpdate(false)
  }


  const onCreateGraphButtonClicked = () => {
    redirect("/node")
  }

  return (
    <div className="w-full h-full flex flex-col min-h-screen">
      <div className='flex h-24 flex-row ml-auto'>
        <div className='flex h-16 m-4'>
          <Button className='w-60 mr-4 bg-gray-500' size="large" variant='contained' onClick={onCreateGraphButtonClicked}>Create New Graph</Button>

          <Button className="h-16 w-16 p-2 rounded-lg bg-white bg-opacity-60" onClick={() => setUpdate(true)}>
            <Avatar className="w-12 h-12" src="https://mui.com/static/images/avatar/1.jpg" />
          </Button>
        </div>
      </div>

      <Dialog open={update} onClose={onUpdateCancelled} maxWidth="sm" fullWidth={true}>
        <DialogTitle>Update</DialogTitle>
        <Update />
      </Dialog>
      <GraphList name="Recent Graph" graphs={[{ id: "id-1", title: "dummy", imgUrl: "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg" }]} />
      <GraphList name="Shared Graph" graphs={[{ id: "id-1", title: "dummy", imgUrl: "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg" }]} />
    </div>
  )
}
