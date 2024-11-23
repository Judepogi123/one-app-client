// import { useSearchParams } from "react-router-dom";

// //ui
// import {
//   Breadcrumb,
//   BreadcrumbList,
//   BreadcrumbItem,
//   BreadcrumbSeparator,
// } from "../components/ui/breadcrumb";

//lib
import { useLocation, Link } from "react-router-dom";

const AreaHeader = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="w-full h-auto p-2">
      <nav className="w-full flex">
        <ul className="flex gap-\">
          {pathnames.length > 0 ? (
            <li>
              <Link to="/">Home</Link>
            </li>
          ) : (
            <li>Home</li>
          )}

          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;

            return last ? (
              <li key={to}>{value}</li>
            ) : (
              <li key={to}>
                <Link to={to}>{value}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AreaHeader;
