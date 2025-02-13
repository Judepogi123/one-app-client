/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

//ui
import { Input } from "../components/ui/input";

interface ComProps {
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean>>;
  isCorrect: boolean
}

const DeleteConfirm = ({ setIsCorrect,isCorrect }: ComProps) => {
  const [input, setInput] = useState<string>("");

  const passwords = "RESET";

  useEffect(() => {
    setIsCorrect(input.trim() === passwords);
  }, [input]);
  return (
    <div className="w-auto p-2">
        <h1 className="mb-4 flex gap-1 items-center">Type <h1 className="font-bold">RESET</h1> to proceed?</h1>
      <Input
        className={`border ${
          input !== passwords ? "border-red-400" : "border-green-500"
        }`}
        onChange={(e) => setInput(e.target.value)}
      />
      {!isCorrect && (
        <h1 className="text-red-500 font-medium text-sm">Incorrect password</h1>
      )}
    </div>
  );
};

export default DeleteConfirm;
