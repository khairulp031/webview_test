import React from 'react';
import './App.css';

const isWebview = (navigator.userAgent && navigator.userAgent.toLowerCase().includes('webview'))

declare global {
  interface Window {
    testInit: Function
  }
}

function App() {
  const [text, setText] = React.useState('')
  const [data, setData] = React.useState({})
  const [iframUrl, setIframeUrl] = React.useState<string | undefined>()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)


  React.useEffect(() => {
    if (isWebview) {
      setIframeUrl('abc://window.testInit?query=' + encodeURI('{}'))
    }
  }, [])

  React.useEffect(() => {
    if (iframUrl && iframeRef.current) {
      window.testInit = function (input: string) {
        setText(input)
        try {
          setData(JSON.parse(input))
        } catch (e) {
          console.log(e)
        }
        return 'good'
      }
      iframeRef.current.src = iframUrl
    }
  }, [iframUrl])


  return (
    <>
      <div><strong>URL</strong>: {document.location.href}</div>
      <div><strong>isWebview</strong>: {isWebview ? 'true' : 'false'}</div>
      <div><strong>UserAgent</strong>: {navigator.userAgent}</div>
      <div><strong>text from Native</strong>: {text}</div>
      <div><strong>data in JSON</strong>: {JSON.stringify(data)}</div>
      {
        isWebview &&
        <iframe
          title="webview"
          ref={iframeRef}
          width='100%' height='100vh' src=''
          style={{ visibility: 'hidden' }}
        />
      }
    </>
  );
}

export default App;
