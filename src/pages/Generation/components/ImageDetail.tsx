import { BsCloudDownload } from "react-icons/bs";
import { GeneratedImage } from "@/types/imageGeneration";

interface ImageDetailProps {
  image: GeneratedImage;
  onDownload: (imageUrl: string, prompt: string) => void;
  onClose: () => void;
}

const ImageDetail = ({ image, onDownload, onClose }: ImageDetailProps) => {
  return (
    <div className="p-4">
      <div className="rounded-box overflow-hidden mb-6">
        <img
          src={image.imageUrl}
          alt={`Generated from prompt: ${image.prompt}`}
          className="w-full object-contain max-h-[70vh]"
        />
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
