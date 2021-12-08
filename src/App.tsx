import React from 'react';
import './App.css';
import { request } from './request';
import axios from "axios"
//axios.defaults.headers.common['Sec-Fetch-Mode'] = 'no-cors';
const service = axios.create({
  withCredentials: true,
  headers: {
    REQUEST_METHOD: "GET",
    "Pragma": "no-cache",
    "Cache-Control": "no-cache",
    'Content-Type': 'application/x-www-form-urlencoded',
    "Accept": "application/json",
    "Sec-Fetch-Mode": "no-cors",
    "Origin": "https://www.masstracing.com/"
  }
})
export const checktoken = () => {
  return service.post(`https://www.masstracing.com/api/checktoken`, )
  //return request("get", "abc://www.masstracing.com/api/checktoken")
}

const isWebview = (navigator.userAgent && navigator.userAgent.toLowerCase().includes('webview'))

declare global {
  interface Window {
    testInit: Function
    isReady: boolean
  }
}

function postData(url = '', method = "GET", data = {}) {
  return fetch(url, {
    method, // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, *same-origin, omit
    headers: {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "*",

    },
    //redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'strict-origin-when-cross-origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
}

function postData1(url = '', method = "GET", data = {}) {
  const myInit: any = {
    method,
    mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, *same-origin, omit
    //redirect: 'error', // manual, *follow, error
    referrerPolicy: 'strict-origin-when-cross-origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    headers: {
      "Accept": "application/json",
    },
  };

  const myRequest = new Request(url, myInit);

  fetch(myRequest).then(function (response) {
    return response;
  }).then(function (response) {
    console.log(response);
  }).catch(function (e) {
    console.log(e);
  });
}

function App() {
  const [text, setText] = React.useState('')
  const [data, setData] = React.useState({})
  const [iframUrl, setIframeUrl] = React.useState<string | undefined>()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)


  React.useEffect(() => {
    console.log(window.isReady)
    //if (window.isReady){
    //
    postData1("https://www.masstracing.com/api/checktoken","post")
    /*postData("https://www.masstracing.com/api/checktoken", "GET")
      .then(function (rawResponse) {
        return rawResponse
      })
      .then(function (rawResponse: any) {
        console.log(rawResponse)
        //checktoken()
      });*/
    checktoken()
    if (isWebview) {
      setIframeUrl('abc://window.testInit?query=' + encodeURI('{}'))
    }
    //}
  }, [window.isReady])

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
      <iframe name="my_iframe"></iframe>
      <form id="myForm"
        encType="application/x-www-form-urlencoded"
        action="https://www.masstracing.com/api/checktoken"
        target="my_iframe"
        method="GET"
        /*onSubmit={(e) => {
          e.preventDefault();
          /*let myForm: any = document.getElementById('myForm');
          let formData = new FormData(myForm);
          var request = new XMLHttpRequest();
          request.open("POST", "https://www.masstracing.com/api/checktoken", true);
          request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          request.setRequestHeader('REQUEST_METHOD', 'GET');
          request.setRequestHeader('Sec-Fetch-Mode', 'no-cors');
          request.onreadystatechange = function (res) { console.log(res) };
          request.send(formData);
          return false
          return true;
        }}*/>
        <label htmlFor="fname">First name:</label><br />
        <input type="text" id="fname" name="fname" value="John" /><br />
        <label htmlFor="lname">Last name:</label><br />
        <input type="text" id="lname" name="lname" value="Doe" /><br /><br />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
}

export default App;
