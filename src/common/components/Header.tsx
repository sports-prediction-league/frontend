import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Assets from "src/assets";
import MaxWrapper from "./MaxWrapper";
import { cn } from "src/lib/utils";
import Button from "./Button";

import useConnect from "src/lib/useConnect";
import { useAppDispatch, useAppSelector } from "src/state/store";
import { Popover } from "antd";
import { cairo } from "starknet";
import useContractInstance from "src/lib/useContractInstance";
import toast from "react-hot-toast";
import { setShowRegisterModal } from "src/state/slices/appSlice";
import RegisterModal from "./RegisterModal";

export default function Header() {
  const { logo } = Assets;
  const dispatch = useAppDispatch();
  const { getWalletProviderContract } = useContractInstance();
  const [isScrolled, setIsScrolled] = useState(false);
  const [open_popover, set_open_popover] = useState(false);
  const { connected_address, profile, show_register_modal, is_mini_app } =
    useAppSelector((state) => state.app);
  const { handleConnect, handleDisconnect } = useConnect();
  // Function to handle scroll events
  const handleScroll = () => {
    if (window.scrollY > 10) {
      // Adjust this value to your desired scroll position
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [registering, set_registering] = useState(false);

  const register_user = async (username: string) => {
    try {
      if (!username.trim()) return;
      set_registering(true);
      const contract = getWalletProviderContract();
      await contract!.register_user(
        is_mini_app && profile?.id
          ? cairo.felt(profile.id.toString().trim())
          : cairo.felt(
              Math.floor(10000000 + Math.random() * 90000000).toString()
            ),
        cairo.felt(username.trim().toLowerCase())
      );

      set_registering(false);
      dispatch(setShowRegisterModal(false));
      toast.success("Username set!");
    } catch (error: any) {
      toast.error(error.message ?? "OOPS Something went wrong");
      set_registering(false);
    }
  };

  return (
    <header
      className={cn(
        "flex h-14 w-full sticky top-0 left-0 z-40 transition-all duration-300 px-4 md:px-0",
        {
          "backdrop-blur-md bg-background/20 h-16 md:h-20": isScrolled,
        }
      )}
    >
      <RegisterModal
        t_username={profile?.username}
        loading={registering}
        onOpenChange={() => {
          dispatch(setShowRegisterModal(false));
        }}
        onSubmit={register_user}
        open={show_register_modal}
      />

      <MaxWrapper className="size-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="size-fit">
            <img
              src={logo}
              alt="logo"
              height={24}
              width={168}
              className="object-contain"
            />
          </Link>
        </div>
        {connected_address ? (
          <Popover
            open={open_popover}
            onOpenChange={(_open) => {
              set_open_popover(_open);
            }}
            arrow={false}
            showArrow={false}
            content={() => {
              return (
                <button
                  onClick={async () => {
                    await handleDisconnect();
                    set_open_popover(false);
                  }}
                >
                  Disconnect
                </button>
              );
            }}
            title=""
            trigger="click"
          >
            <div className="flex cursor-pointer items-center gap-2 bg-ray-400 rounded-full py-1 px-4">
              <div className="size-8 rounded-full">
                <img
                  src={profile?.profile_picture ?? ""}
                  alt=""
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
                    (e.target as HTMLImageElement).src = Assets.dummyAvatar;
                  }}
                  loading="lazy"
                  className="size-full rounded-full object-cover"
                />
              </div>
              <p>
                {connected_address?.slice(0, 5)}..{connected_address?.slice(-5)}{" "}
              </p>
            </div>
          </Popover>
        ) : (
          <Button
            variant={"secondary"}
            size={"sm"}
            onClick={async () => {
              await handleConnect();
            }}
          >
            Connect Wallet
          </Button>
        )}
      </MaxWrapper>
    </header>
  );
}
