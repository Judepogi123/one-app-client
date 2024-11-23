import React from "react";
import { useNavigate, useParams } from "react-router-dom";

//queries
import { GET_MUNICIPALS } from "../../GraphQL/Queries";
//ui
import { BreadcrumbItem } from "../ui/breadcrumb";

const MuniBreadCrumb = () => {
  const { municipalID } = useParams();
  

  return <BreadcrumbItem>BreadCrumb</BreadcrumbItem>;
};

export default MuniBreadCrumb;
