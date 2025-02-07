import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCanvas } from "@/hooks/useCanvas";

const SaveDesign = () => {
  const { toast } = useToast();
  const { frontCanvas, backCanvas } = useCanvas();

  const saveCanvasToFile = async (canvas, filename, includeShirt = false) => {
    try {
      if (includeShirt) {
        // Create a temporary canvas to combine t-shirt and design
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d");

        // Set canvas size to match the t-shirt container size
        const container = canvas.wrapperEl.parentElement;
        tempCanvas.width = container.offsetWidth;
        tempCanvas.height = container.offsetHeight;

        // Draw the t-shirt background (you'll need to adjust this based on your t-shirt image)
        const tshirtImg = container.querySelector("img");
        if (tshirtImg) {
          ctx.drawImage(tshirtImg, 0, 0, tempCanvas.width, tempCanvas.height);
        }

        // Draw the design canvas at its correct position
        const rect = canvas.wrapperEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const x = rect.left - containerRect.left;
        const y = rect.top - containerRect.top;
        ctx.drawImage(canvas.lowerCanvasEl, x, y, canvas.width, canvas.height);

        // Get the data URL from the temporary canvas
        const dataUrl = tempCanvas.toDataURL({
          format: "png",
          quality: 1,
        });

        // Create download link
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Original save functionality for design only
        const dataUrl = canvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 2,
          width: canvas.width,
          height: canvas.height,
        });

        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      return true;
    } catch (error) {
      console.error(`Error saving ${filename}:`, error);
      return false;
    }
  };

  const handleSave = async (includeShirt = false) => {
    try {
      if (!frontCanvas && !backCanvas) {
        toast({
          variant: "destructive",
          title: "No Design Found",
          description: "Please create a design before saving.",
          duration: 3000,
        });
        return;
      }

      let savedCount = 0;
      let failedCount = 0;

      if (frontCanvas) {
        const frontSaved = await saveCanvasToFile(
          frontCanvas,
          `tshirt-front-${includeShirt ? "with-shirt" : "design-only"}.png`,
          includeShirt
        );
        frontSaved ? savedCount++ : failedCount++;
      }

      if (backCanvas) {
        const backSaved = await saveCanvasToFile(
          backCanvas,
          `tshirt-back-${includeShirt ? "with-shirt" : "design-only"}.png`,
          includeShirt
        );
        backSaved ? savedCount++ : failedCount++;
      }

      if (failedCount > 0) {
        toast({
          variant: "destructive",
          title: "Save Error",
          description: `Failed to save ${failedCount} design${
            failedCount > 1 ? "s" : ""
          }.`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Design Saved!",
          description: `Successfully saved ${savedCount} design file${
            savedCount > 1 ? "s" : ""
          }.`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Save error:", error);
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "An unexpected error occurred while saving.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleSave(true)}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <Save className="mr-2 h-4 w-4" />
        Save
      </Button>
    </div>
  );
};

export default SaveDesign;
