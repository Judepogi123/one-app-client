
interface Props {
  title: string;
  fullname: string;
}

const HeaderInfo = ({ title, fullname }: Props) => {
  return (
    <div className="w-full p-2">
      <h1 className="text-lg font-medium">{fullname}</h1>
      <h1 className="text-sm font-light">{title}</h1>
    </div>
  );
};

export default HeaderInfo;
