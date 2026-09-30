import { defaultPageSize } from "@/constants"
import { getTags } from "@/lib/actions/tag.actions"

const Tags = async () => {
  const { success, data, error } = await getTags({
    page: 1,
    pageSize: defaultPageSize,
  })

  const { tags } = data || {}

  console.log("TAGS", JSON.stringify(tags, null, 2))

  return <div>Tags page</div>
}

export default Tags
