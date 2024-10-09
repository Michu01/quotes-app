import { Paper, Anchor, Image, Text, Title } from "@mantine/core"
import Quote from "../types/Quote"
import parse from "html-react-parser"

function QuoteComponent({ quote, showImage }: { quote: Quote, showImage: boolean }) {
  const text = quote.text.replace(/\\n/g, '<br/>')

  const textBackgroundColor = "rgba(0, 0, 0, 0.8)"

  return (
    <>
      {showImage && quote.image && <Image crossOrigin='anonymous' w='15em' h='15em' fit="cover" radius='50%' src={quote.image} />}
      <Paper p='md' bg={textBackgroundColor}>
        <Title order={1} c='white'>“{parse(text)}”</Title>
      </Paper>
      {
        (quote.author || quote.source) &&
        <Paper p='md' bg={textBackgroundColor}>
          <Text c='white'>
            {quote.authorLink ? <Anchor target="_blank" href={quote.authorLink}>{quote.author}</Anchor> : <>{quote.author}</>}
            {quote.author && quote.source && ", "}
            {quote.sourceLink ? <Anchor target="_blank" href={quote.sourceLink}>{quote.source}</Anchor> : <>{quote.source}</>}
          </Text>
        </Paper>
      }
    </>
  )
}

export default QuoteComponent