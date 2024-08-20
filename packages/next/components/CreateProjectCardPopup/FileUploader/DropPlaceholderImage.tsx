import Image from "next/image";

export const DropPlaceholderImage = () => {
  return (
    <>
      <Image
        src="/folderIcon.png"
        alt="folder icon"
        width={100}
        height={100}
        className="rounded-2xl"
      />
      <div className="absolute bottom-[10%] left-[50%] w-full translate-x-[-50%] text-center text-sm opacity-50">
        Choose a file or drag and drop it here
      </div>
    </>
  );
};
