"use client";

import { useAtom } from "jotai";
import { headerTextAtom } from "../components/Navbar";
import { useEffect } from "react";

const Page = () => {
  const [, setHeaderText] = useAtom(headerTextAtom);

  // Update the header text for this specific Page
  useEffect(() => {
    setHeaderText("Plugins");
    return () => {
      // Reset the header text when the component unmounts
      setHeaderText("Home");
    };
  }, [setHeaderText]);
  return <div> Hello from Plugins</div>;
};
export default Page;
