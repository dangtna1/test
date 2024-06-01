import { CopyPlusIcon, CornerDownRight, PlusIcon } from "lucide-react";

export function getRuneImage(rune?: string) {
  switch (rune) {
    case "COOK":
      return "/image/rune.png";
    default:
      return false;
  }
}

export function getUtxoTypeIcon(type?: string) {
  switch (type) {
    case "transfer":
      return <CornerDownRight className={"text-[#A18D88]"} size={16} />;
    case "claim":
      return <PlusIcon className={"text-[#96e576]"} size={16} />;
    case "etch":
      return <CopyPlusIcon className={"text-[#b4540a]"} size={16} />;
    default:
      return <CornerDownRight className={"text-[#A18D88]"} size={16} />;
  }
}
