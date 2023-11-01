import { Handle, Position } from 'reactflow'

import { INode } from 'utils/models'

export type SmoothNodeProp = {
  data: INode
}

export default function SmoothNode({ data }: SmoothNodeProp) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <div>
          { data.id }
        </div>
        <div>
          { data.name }
        </div>
        <div>
          { data.description }
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  )
}
