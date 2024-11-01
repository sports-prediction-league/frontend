import { Modal } from "antd";
import InputField from "./InputField";
import Button from "./Button";
import { TbLoader } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";

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
          content: { background: "hsl(var(--background))" },
          header: { background: "hsl(var(--background))", color: "white" },
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
            <InputField
              name="username"
              type="text"
              onChange={(e) => {
                if (!t_username) {
                  setUsername(e.target.value.trim());
                }
              }}
              value={username}
              placeholder="Username"
              disabled={loading}
            />

            <Button
              type="submit"
              variant={"secondary"}
              size={"lg"}
              disabled={loading}
              className="!w-full mt-8"
            >
              {loading ? (
                <>
                  <TbLoader size={22} className="mr-1.5 animate-spin" /> PLEASE
                  WAIT...
                </>
              ) : (
                "SET USERNAME"
              )}
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default RegisterModal;
