import { useParams, Link } from "react-router-dom"
import { IconPlant } from "@tabler/icons-react"
import { farms, farmTypes } from "@/mocks"
import FarmForm from "../components/FarmForm";

/**
 * Handles both /farms/new and /farms/:farmId/edit by reading `mode` + the
 * optional farmId. For edit, loads existing farm data as defaultValues.
 */
export default function FarmFormPage({ mode = "create" }) {
  const { farmId } = useParams()

  if (mode === "edit") {
    const farm = farms.find((f) => f.id === farmId)

    if (!farm) {
      return (
        <div className="flex flex-col items-center justify-center py-24">
          <IconPlant className="size-12 text-muted-foreground/40" strokeWidth={1.5} />
          <p className="mt-4 text-muted-foreground">Farm not found.</p>
          <Link
            to="/app/farms"
            className="mt-2 text-sm font-medium text-leaf hover:underline"
          >
            Back to Farms
          </Link>
        </div>
      )
    }

    // Map the existing farm + its type id onto the form's default values.
    const farmType = farmTypes.find((t) => t.name === farm.farmType)
    const defaultValues = {
      name: farm.name,
      location: farm.location,
      farmTypeId: farmType?.id || "",
      totalArea: String(farm.totalArea),
      areaUnit: farm.areaUnit || "sq_ft",
      notes: farm.notes || "",
    }

    return <FarmForm mode="edit" defaultValues={defaultValues} farmId={farmId} />
  }

  return <FarmForm mode="create" />
}
