import Image from "next/image";
import { X } from "lucide-react";

interface PreviewProps {
  previewFile: {
    preview: string;
    name: string;
    type: string;
  };
  isUploaded: boolean;
  resetFileInput: () => void;
}

const Preview: React.FC<PreviewProps> = ({
  previewFile,
  isUploaded,
  resetFileInput,
}) => {
  return (
    <>
      {previewFile.type.includes("video") ? (
        <video
          src={previewFile.preview}
          controls={false}
          autoPlay={false}
          muted
          className="h-full w-full rounded-2xl object-cover"
        />
      ) : (
        <Image
          src={previewFile.preview}
          width={300}
          height={300}
          onError={(e) => {
            e.currentTarget.src = "/placeholderBlob.png";
          }}
          alt="Uploaded file"
          className="h-full w-full rounded-2xl object-cover"
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 px-3 py-2 text-sm text-white">
        {previewFile.name}
      </div>
      {isUploaded && (
        <div className="absolute left-3 top-3 rounded-full bg-black bg-opacity-75 px-3 py-1 text-sm text-white">
          Uploaded
        </div>
      )}
      <div
        className="absolute right-3 top-3 cursor-pointer rounded-full bg-black bg-opacity-75 p-1 text-sm text-white hover:bg-opacity-50"
        onClick={(e) => {
          resetFileInput();
          e.stopPropagation();
        }}
      >
        <X className="h-4 w-4" />
      </div>
    </>
  );
};

export default Preview;
