//import React from 'react'

//props

// interface LoadingProps{
//     type?: number;
//     desc?: string;
// }

//ui
//import { Skeleton } from '../ui/skeleton';
const Loading = () => {
  return (
    <div className="w-full h-1/2">
      <p className="text-center font-medium">Loading...</p>
    </div>
  );
};

export default Loading;

// const LoadingType = ({type}:{type: number})=>{
//     switch (type) {
//         case 0:
//           return (
//             <div className="w-auto m-auto">
//                 <h1>Loading...</h1>
//             </div>
//           )
//           case 1:
//             return (
//               <div className="w-auto m-auto">
//                   <h1>Loading...</h1>
//               </div>
//             )

//         default:
//             break;
//     }
// }
