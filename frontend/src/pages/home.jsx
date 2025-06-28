import React from "react";
import LeftBar from "../components/common/leftBar";
import Feed from "../components/common/feed";
import RightBar from "../components/common/rightBar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { MenuIcon } from "lucide-react";

const Home = () => {
  return (
    <div className="flex">
      <div className="w-[16%] hidden md:block border-r-2 h-screen fixed">
        <LeftBar />
      </div>
      <div className="flex-1 md:ml-[20%] overflow-y-auto">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <MenuIcon />
            </SheetTrigger>
            <SheetContent>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
              <LeftBar />
            </SheetContent>
          </Sheet>
        </div>
        <Feed />
      </div>
      <div className="w-[23%] px-6 lg:block hidden h-screen">
        <RightBar />
      </div>
    </div>
  );
};

export default Home;
