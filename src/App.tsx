import React from 'react';
import './App.css';
import axios from "axios"
const service = axios.create({
  withCredentials: true,
  headers: {
    //REQUEST_METHOD: "GET",
    "Pragma": "no-cache",
    "Cache-Control": "no-cache",
  }
})
export const checktoken = () => {
  return service.post(`https://www.masstracing.com/api/checktoken`)
}

export const getData = (csrf: string) => {
  return service.get(`https://www.masstracing.com/api/location/company/1/5/${encodeURIComponent("@")}`, 
  {
    headers: { "Authorization": csrf }
  })
}

const isWebview = (navigator.userAgent && navigator.userAgent.toLowerCase().includes('webview'))

declare global {
  interface Window {
    testInit: Function
    isReady: boolean
  }
}

function App() {
  const [text, setText] = React.useState('')
  const [data, setData] = React.useState({})
  const [apiData, setApiData] = React.useState({})
  const [csrf, setCsrf] = React.useState()
  const [iframUrl, setIframeUrl] = React.useState<string | undefined>()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)


  React.useEffect(() => {
    checktoken().then(response => {
      console.log(response)
      if (response && response.data && response.data.csrf) {
        setCsrf(response.data.csrf)
      }
    })
    if (isWebview) {
      setIframeUrl('abc://window.testInit?query=' + encodeURI('{}'))
    }
  }, [isWebview])
  React.useEffect(() => {
    if (csrf) getData(csrf).then(response => {
      if (response && response.data && response.data) {
        setApiData(response.data)
      }
    })
  }, [csrf])

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
      <div><strong>data From API</strong>: {JSON.stringify(apiData)}</div>
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
