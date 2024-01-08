"use client";

import { useAtom } from "jotai";
import { headerTextAtom } from "../components/Navbar";
import { useEffect } from "react";

const page = () => {
  const [, setHeaderText] = useAtom(headerTextAtom);

  // Update the header text for this specific page
  useEffect(() => {
    setHeaderText("Audience");
    return () => {
      // Reset the header text when the component unmounts
      setHeaderText("Home");
    };
  }, [setHeaderText]);
  return <div> Hello from Audience</div>;
};
export default page;
