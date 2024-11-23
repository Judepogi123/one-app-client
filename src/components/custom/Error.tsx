//ui
//import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
//props
interface ErrorProps {
  title?: string;
  desc?: string;
  image?: boolean | undefined;
  alert?: number
}
const Error = ({ title,desc }: ErrorProps) => {
  return (
    <div className=" w-full h-auto py-6 grid border">
      <div className="w-auto m-auto p-4">
        <h1 className="">{title}</h1>
        <h3>{desc}</h3>
      </div>
    </div>
  );
};

export default Error;
