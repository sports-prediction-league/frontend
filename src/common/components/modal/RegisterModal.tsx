import { Modal } from "antd";
import { TbLoader } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import Button from "../button/Button";

interface Props {
  open: boolean;
  loading: boolean;
  onOpenChange: () => void;
  t_username?: string;
  onSubmit: (username: string) => void;
}
const RegisterModal = ({
  onOpenChange,
  onSubmit,
  open,
  loading,
  t_username,
}: Props) => {
  const [username, setUsername] = useState("");
  useEffect(() => {
    setUsername(t_username ?? "");
  }, [t_username]);
  return (
    <>
      <Modal
        className="text-white"
        open={open}
        onCancel={onOpenChange}
        styles={{
          content: { background: "#042822" },
          header: { background: "#042822", color: "white" },
        }}
        closeIcon={<IoClose color="white" />}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
      >
        <div className="flex flex-col gap-4 text-center">
          <h4 className="!text-[32px]">Set Username</h4>
          <p className="text-base md:text-lg font-normal opacity-60">
            Setup and start making winning predictions.
          </p>
        </div>
        <div className="w-full mt-6 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(username.trim());
            }}
            className="w-full flex flex-col gap-3 md:gap-6"
          >
            {/* Username Field */}
            <input
              name="username"
              type="text"
              onChange={(e) => {
                if (!t_username) {
                  setUsername(e.target.value.trim());
                }
              }}
              className="bg-transparent py-2.5 px-3 outline-none border-[1px] border-[#ffffff]/[0.5] rounded"
              value={username}
              placeholder="Username"
              disabled={loading}
            />

            <button
              // text="SET USERNAME"
              // background=""
              // type="submit"
              // variant={"secondary"}
              // size={"lg"}
              disabled={loading}
              className={`button-container px-[14px] flex justify-center items-center gap-[6px] border leading-[25.7px] rounded mt-3 py-2`}
            >
              {loading ? (
                <>
                  <TbLoader size={22} className="mr-1.5 animate-spin" /> PLEASE
                  WAIT...
                </>
              ) : (
                "SET USERNAME"
              )}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default RegisterModal;
