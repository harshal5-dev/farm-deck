import { Mark } from "@/components/layout/Logo";

/**
 * FarmMark — thin re-export of the shared `Mark` so home-page / 404
 * consumers don't have to reach into the layout folder. Kept as a
 * component (not an element) so `<FarmMark />` keeps working.
 */
const FarmMark = ({ className }) => <Mark className={className} />;

export default FarmMark;
