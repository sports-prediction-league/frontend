import { Modal } from "antd";
import { X } from "lucide-react";
import COMING_SOON from "../../../assets/coming_soon.png";
interface Props {
  onClose: () => void;
  open_modal: boolean;
}

const ComingSoonModal = ({ onClose, open_modal }: Props) => {
  return (
    <Modal
      className="relative"
      open={open_modal}
      onCancel={() => {
        onClose();
      }}
      destroyOnClose
      styles={{
        content: {
          background: "white",
          border: " 2.78px solid #00CB59",
          borderRadius: "20px",
        },
        header: { background: "white", color: "white" },
      }}
      closeIcon={
        <div className="border-[1.78px] border-[#00000080] p-2 rounded-lg">
          <X color="#00000080" />
        </div>
      }
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <div className="pilat space-y-2">
        <h2 className="text-[#2A2F3F] text-3xl font-[700]">Coming soon!</h2>
        <h5 className="text-xl font-[700] text-black">
          This feature will be available soon.
        </h5>
        <p className="font-[300] text-black w-1/2">
          Stay tuned for exciting updates—you won't have to wait long!
        </p>
        <p className="font-[300] text-black w-1/2">
          Thank you for your patience!
        </p>
      </div>
      <div className="absolute bottom-0 md:right-10 right-3">
        <img src={COMING_SOON} className="w-32 h-32" alt="" />
      </div>
    </Modal>
  );
};

export default ComingSoonModal;
