import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "lucide-react";
import ToolBar from "./ToolBar";
import TextToolBar from "./TextToolBar";
import LineToolBar from "./LineToolBar";

export function ToolsSidebar({ manualSync }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[340px]">
        <SheetHeader>
          <SheetTitle>Design Tools</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] mt-4">
          <div className="pr-6">
            <ToolBar manualSync={manualSync} />
            <TextToolBar manualSync={manualSync} />
            <LineToolBar manualSync={manualSync} />
          </div>
        </ScrollArea>
      </SheetContent>

      {/* Desktop version - always visible */}
      <div className="hidden md:block">
        <div className="w-[160px] h-screen border-r bg-background">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Design Tools</h2>
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="pr-4">
                <ToolBar manualSync={manualSync} />
                <TextToolBar manualSync={manualSync} />
                <LineToolBar manualSync={manualSync} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
