import GraphEntry, { IGraphEntryProp } from "./GraphEntry"

type IGraphListProp = {
  name: string
  graphs: IGraphEntryProp[]
}

export default function GraphList({ name, graphs }: IGraphListProp) {
  return (
    <div className="flex flex-col self-stretch">
      <div className='h-16 m-4'>
        <span className='h-16 flex items-center text-center m-auto text-lg'>{name}</span>
      </div>
      <div className="flex flex-1 flex-row">
        {
          graphs.map((graph) => (
            <div className="h-64 w-64 flex m-4" key={graph.id}>
              <GraphEntry id={graph.id} title={graph.title} imgUrl={graph.imgUrl} />
            </div>
          ))
        }
      </div>
    </div>
  )
}
