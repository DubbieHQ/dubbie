import { Spinner } from "../../ui/Spinner";

const UploadingStatus = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <Spinner />
    <div className="relative top-3 text-sm opacity-50"> Uploading</div>
  </div>
);

export default UploadingStatus;
