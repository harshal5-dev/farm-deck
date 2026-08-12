import FarmerAvatar from "@/components/effects/FarmerAvatar";

import { Avatar as ChosenAvatar } from "@/components/avatars/avatars";


const HeaderAvatar = ({ id, className }) => {
  if (id) {
    return <ChosenAvatar id={id} className={className} />;
  }
  return (
    <div
      className={
        "overflow-hidden rounded-full ring-2 ring-background " +
        (className || "")
      }
    >
      <FarmerAvatar className="size-full" />
    </div>
  );
}

export default HeaderAvatar;
