//import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

//lib

//ui

//props

//layout
import NewVoterForm from "./NewVoterForm";
const NewVoters = () => {
  return (
    <div className=" w-full h-full">
      <Tabs defaultValue="manual" className="w-full border">
        <TabsList>
          <TabsTrigger value="manual" className="w-1/2">
            Manually
          </TabsTrigger>
          <TabsTrigger value="upload" className="w-1/2">
            File upload
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
         <NewVoterForm/>
        </TabsContent>
        <TabsContent value="upload">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default NewVoters;
