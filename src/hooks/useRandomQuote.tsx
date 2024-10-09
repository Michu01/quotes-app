import { useQuery } from "@tanstack/react-query"
import Quote from "../types/Quote"
import supabase from "../services/supabase"

function useRandomQuote() {
  return useQuery<Quote | undefined>({
    queryFn: async () => {
      const response = await supabase.from("random_quotes").select("*").limit(1).single()
      const quote = response.data
      if (!quote) return undefined
      return {
        text: quote.text!,
        image: quote.image,
        author: quote.author,
        authorLink: quote.author_link,
        source: quote.source,
        sourceLink: quote.source_link
      } satisfies Quote
    },
    queryKey: ["quotes"],
    refetchOnWindowFocus: false
  })
}

export default useRandomQuote