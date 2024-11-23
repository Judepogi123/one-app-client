// import React from 'react'


//props
interface EmptyProps {
    title?:string;
    image?: boolean | undefined
}
const Empty = ({title}: EmptyProps) => {
  return (
    <div className=' w-full h-auto grid'>
        <h1 className=" m-auto">{title}</h1>
    </div>
  )
}

export default Empty