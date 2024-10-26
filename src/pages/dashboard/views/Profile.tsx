import Assets from "src/assets";

import { useAppSelector } from "src/state/store";

const Profile = () => {
  const { profile, connected_address } = useAppSelector((state) => state.app);

  return (
    <div className="px-2 sm:px-4 lg:px-8 py-6 flex flex-col w-full gap-8">
      <div className="flex flex-col gap-4">
        <h5>PROFILE PICTURE</h5>

        <div className="flex items-center gap-8">
          <div className="size-[160px] md:size-[200px] rounded-full bg-secondary relative overflow-hidden">
            <img
              src={profile?.profile_picture || Assets.dummyAvatar}
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
                (e.target as HTMLImageElement).src = Assets.dummyAvatar;
              }}
              alt={"Profile"}
              className="size-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full gap-8">
        <div className="flex flex-col gap-4">
          <h5>PERSONAL DETAILS</h5>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-col sm:flex-row">
              <div className="flex flex-col w-full gap-1">
                <p className="text-sm">USERNAME</p>
                <div className="w-full h-[48px] bg-[#003428] opacity-50 pointer-events-none select-none flex items-center px-5 rounded-md">
                  <p className="text-sm">{profile?.username ?? "N/A"}</p>
                </div>
              </div>
              <div className="flex flex-col w-full gap-1">
                <p className="text-sm">CONNECTED WALLET</p>
                <div className="w-full h-[48px] bg-[#003428]  opacity-50 pointer-events-none select-none flex items-center px-5 rounded-md">
                  <p className="text-sm">
                    {connected_address
                      ? `${connected_address.slice(
                          0,
                          5
                        )}... ${connected_address.slice(-5)}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
