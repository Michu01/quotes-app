import { useState, useEffect } from 'react'
import { randomElement } from './helpers/randomElement'
import useLocalStorage from 'use-local-storage'
import { useQueryClient } from '@tanstack/react-query'
import { FastAverageColor } from 'fast-average-color'
import { createTheme, MantineProvider, Select, Button, Stack, Group, BackgroundImage, Switch, Paper, Kbd, Text } from '@mantine/core'
import useRandomQuote from './hooks/useRandomQuote'
import QuoteComponent from './components/QuoteComponent'
import getBucketFileUrl from './helpers/getBucketFileUrl'
import getBucketFiles from './helpers/getBucketFiles'

const fac = new FastAverageColor()

const theme = createTheme({
  fontFamily: 'Roboto'
})

type BackgroundType = "image" | "autocolor"

function App() {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>()
  const [background, setBackground] = useLocalStorage<BackgroundType>("background", "image")
  const [hide, setHide] = useState(false)
  const isVideo = backgroundUrl?.endsWith(".mp4") ?? false
  const [showImage, setShowImage] = useLocalStorage("showImage", false)
  const queryClient = useQueryClient()

  const { data: quote } = useRandomQuote()

  const randomBackground = async () => {
    const { data: videos } = await getBucketFiles("videos")
    const { data: images } = await getBucketFiles("images")

    if (!videos || !images) return

    const backgrounds = [...videos, ...images]

    const background = randomElement(backgrounds)

    const bucket = backgrounds.indexOf(background) < videos.length ? 'videos' : 'images'

    const url = getBucketFileUrl(bucket, background.name).data.publicUrl

    setBackgroundUrl(url)
  }

  const randomQuote = () => queryClient.invalidateQueries({ queryKey: ["quotes"] })

  const handleKeyDown = (e: globalThis.KeyboardEvent) => {
    if (e.key === "h") {
      setHide(hide => !hide)
    }
  }

  const toggleShowImage = () => setShowImage(showImage => !showImage)

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    randomBackground()
  }, [])

  useEffect(() => {
    const container = document.querySelector<HTMLElement>('.container')

    if (!container) return

    if (background !== "autocolor") {
      container.style.backgroundColor = "initial"
      return
    }

    const img = container.querySelector('img')

    if (!img) return

    fac
      .getColorAsync(img)
      .then(color => {
        container.style.backgroundColor = color.rgba
      })
  }, [background, quote])

  return (
    <MantineProvider theme={theme}>
      {background === "image" && backgroundUrl && isVideo && <video className='background-video' src={backgroundUrl} autoPlay muted loop />}
      {background === "image" && backgroundUrl && !isVideo && <BackgroundImage mih='100vh' src={backgroundUrl} />}
      <Stack pos='fixed' left='1em' bottom='1em' top='1em' right='1em' justify='center' align='center' gap='lg' style={{ textAlign: 'center' }}>
        {quote && <QuoteComponent quote={quote} showImage={showImage} />}
      </Stack>
      {
        !hide &&
        <Paper pos='fixed' ml='1em' right='1em' top='1em' bg='white' p='xs'>
          <Group gap='md'>
            <Text>Press <Kbd>H</Kbd> to hide gui</Text>
            <Switch label='Show author image' labelPosition='left' checked={showImage} onChange={toggleShowImage} />
            <Select
              data={[{ value: "image", label: "Image" }, { value: "autocolor", label: "Autocolor" }]}
              value={background} onChange={e => setBackground(e as BackgroundType)}
            />
            {background === "image" && <Button type="button" onClick={randomBackground}>Change background</Button>}
            <Button type="button" onClick={randomQuote}>Change quote</Button>
          </Group>
        </Paper>
      }
    </MantineProvider>
  )
}

export default App
