import { IconType } from "react-icons";


export interface HomeLayoutProps {
    title: string;
    value: string
}

export interface DataLayoutProps {
    title: string;
    value: string;
    icon: IconType;
    desc?: string;
}

export interface SurveyStateList {
    name: string;
    link: string
    icon: IconType
}