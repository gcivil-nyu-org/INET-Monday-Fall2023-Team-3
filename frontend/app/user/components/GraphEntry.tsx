'use client'
import { Card, CardContent, CardHeader } from "@mui/material"

export type IGraphEntryProp = {
  id: string
  title: string
  imgUrl: string
}

export default function GraphEntry({ title, imgUrl }: IGraphEntryProp) {
  const onGraphClicked = () => {
    console.log(`redirect to node`)
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
