import { Alert as AlertCon, AlertTitle, AlertDescription } from "../ui/alert";
import { IconType } from "react-icons";
//props
interface AlertProps {
  title?: string;
  desc?: string;
  variant?: "default" | "destructive" | null | undefined;
  Icon?: IconType | undefined;
}
const Alert = ({ title, desc, variant }: AlertProps) => {
  return (
    <AlertCon variant={variant}>

        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{desc}</AlertDescription>

    </AlertCon>
  );
};

export default Alert;
