'use client'
import { Card, CardContent, CardHeader } from "@mui/material"
import { useRouter } from "next/navigation"

export type IGraphEntryProp = {
  id: string
  title: string
  imgUrl: string
}

export default function GraphEntry({ title, imgUrl }: IGraphEntryProp) {
  const router = useRouter()
  const onGraphClicked = () => {
    console.log(`graph ${title} is being clicked`)
    router.push("/node")
  }

  return (
    <div className="flex flex-1" onClick={onGraphClicked}>
      <Card>
        <CardHeader title={title} />
        <CardContent>
          <img src={imgUrl} />
        </CardContent>
      </Card>
    </div>
  )
}
