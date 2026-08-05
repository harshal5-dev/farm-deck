import { useParams, Link } from "react-router-dom"
import { IconPlant } from "@tabler/icons-react"
import { fields } from "@/mocks"
import FieldForm from "../components/FieldForm";

/**
 * Handles both /fields/new and /fields/:fieldId/edit by reading `mode` + the
 * optional fieldId. For edit, loads existing field data as defaultValues.
 */
export default function FieldFormPage({ mode = "create" }) {
  const { fieldId } = useParams()

  if (mode === "edit") {
    const field = fields.find((f) => f.id === fieldId)

    if (!field) {
      return (
        <div className="flex flex-col items-center justify-center py-24">
          <IconPlant className="size-12 text-muted-foreground/40" strokeWidth={1.5} />
          <p className="mt-4 text-muted-foreground">Field not found.</p>
          <Link to="/app/fields" className="mt-2 text-sm font-medium text-leaf hover:underline">
            Back to Fields
          </Link>
        </div>
      )
    }

    const defaultValues = {
      name: field.name,
      farmId: field.farmId,
      soilTypeId: field.soilTypeId || "",
      area: String(field.area),
      areaUnit: field.areaUnit || "sq_ft",
      cropName: field.cropName || "",
      status: field.status || "",
      notes: field.notes || "",
    }

    return <FieldForm mode="edit" defaultValues={defaultValues} fieldId={fieldId} />
  }

  return <FieldForm mode="create" />
}
