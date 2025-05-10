import { BsCloudDownload } from "react-icons/bs";
import { GeneratedImage } from "@/types/imageGeneration";

interface ImageDetailProps {
  image: GeneratedImage;
  onDownload: (imageUrl: string, prompt: string) => void;
  onClose: () => void;
}

const ImageDetail = ({ image, onDownload, onClose }: ImageDetailProps) => {
  // Format creation date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(image.createdAt);

  return (
    <div className="p-4">
      <div className="rounded-box overflow-hidden mb-6">
        <img
          src={image.imageUrl}
          alt={`Generated from prompt: ${image.prompt}`}
          className="w-full object-contain max-h-[70vh]"
        />
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <h3 className="text-sm font-medium text-base-content/70 mb-1">
            Prompt
          </h3>
          <p className="text-base">{image.prompt}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-base-content/70 mb-1">
            Created
          </h3>
          <p className="text-base">{formattedDate}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button className="btn btn-sm btn-outline" onClick={onClose}>
          Close
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => onDownload(image.imageUrl, image.prompt)}
        >
          <BsCloudDownload className="h-4 w-4 mr-2" />
          Download
        </button>
      </div>
    </div>
  );
};

export default ImageDetail;
