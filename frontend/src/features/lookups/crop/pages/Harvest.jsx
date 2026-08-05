import { IconBasket } from "@tabler/icons-react"
import ComingSoon from "@/pages/ComingSoon"

export default function Harvest() {
  return (
    <ComingSoon
      title="Harvest"
      description="Plan and log every harvest — quantities, dates, and quality grades. See what's ready to pick and track your season's yield at a glance."
      icon={IconBasket}
      accent="text-wheat"
      accentBg="bg-wheat/20"
    />
  )
}
