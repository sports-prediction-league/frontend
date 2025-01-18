import { Modal } from "antd";
import { IoClose } from "react-icons/io5";
import COMING_SOON from "../../../assets/coming_soon.png";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  XIcon,
} from "react-share";
interface Props {
  onClose: () => void;
  open_modal: boolean;
  modal_title: string;
  content: { message: string; url: string };
}

const ShareModal = ({ onClose, open_modal, modal_title, content }: Props) => {
  return (
    <Modal
      className=""
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
          <IoClose color="#00000080" />
        </div>
      }
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <div className="pilat space-y-5 mt-10">
        <p className="font-[300] text-black text-center md:text-lg text-sm">
          {modal_title}
        </p>

        <div className="flex items-center justify-center gap-5">
          <TwitterShareButton
            title={content.message}
            url={content.url}
            children={<XIcon round size={30} />}
          />
          <FacebookShareButton
            url={content.url}
            title={content.message}
            children={<FacebookIcon round size={30} />}
          />
          <LinkedinShareButton
            title={content.message}
            url={content.url}
            children={<LinkedinIcon round size={30} />}
          />

          <TelegramShareButton
            url={content.url}
            title={content.message}
            children={<TelegramIcon round size={30} />}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
