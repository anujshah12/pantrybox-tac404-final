import { useEffect } from "react"

function useDocumentTitle(title) {
  useEffect(() => {
    if (title) {
      document.title = `${title} • PantryBox Pro`
    } else {
      document.title = "PantryBox Pro"
    }
  }, [title])
}

export default useDocumentTitle
