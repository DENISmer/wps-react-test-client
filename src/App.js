import logo from './logo.svg';
import './App.css';
import axios from "axios";
import {useEffect, useState} from "react";
import {domain} from "./config/config";
import {xml2js, xml2json} from "xml-js";

function App() {
    const [url,setUrl] = useState();
    const [result,setResult] = useState([]);
    let res;
    let arrayOfId = [];
    const [error,setError] = useState();
    const [service,setService] = useState('WPS');
    const [version,setVersion] = useState('1.0.0');
    const [requestParam,setRequestParam] = useState('GetCapabilities');
    const [id,setId] = useState()
    const [globalResult,setGlobalResult] = useState()

    const request = () => {
    console.log(url)
    axios.get(`${url}`,{
        headers:{
        "Content-type": "text/xml",
        },
        params:{
            'service': service,
            'version': version,
            'request': requestParam,
        }
    })
        // .elements[0].elements[0].elements[0].text
        .then(async (response) => {
                res = xml2js(response.data).elements[0].elements[3].elements
                // setResult(response.data)
            simpleNamingOfProcessors(res)
            console.log(xml2js(response.data).elements[0].elements[3].elements)
        })
        .catch((err) =>{
            alert(err.message)
        })
    }
    const simpleNamingOfProcessors = (inputArray) => {
        arrayOfId = [];
        inputArray.map((item, index)=>(
            arrayOfId.push(item.elements[0].elements[0].text)
        ))
        setResult(arrayOfId)
    }

    useEffect(()=>{
        axios.get(`${url}`,{'data': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
            <wps:Execute service="WPS" version="1.0.0" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0
        http://schemas.opengis.net/wps/1.0.0/wpsExecute_request.xsd">
            <ows:Identifier>r.to.vect</ows:Identifier>
        <wps:DataInputs>
            <wps:Input>
                <ows:Identifier xmlns:ns1="http://www.opengis.net/ows/1.1">input</ows:Identifier>
                <wps:Reference xlink:href="https://figshare.com/ndownloader/files/10144938" mimeType="image/tiff" />
            </wps:Input>
        </wps:DataInputs>
        <wps:ResponseForm>
            <wps:RawDataOutput mimeType="application/x-zipped-shp">
                <ows:Identifier>output</ows:Identifier>
            </wps:RawDataOutput>
        </wps:ResponseForm>
    </wps:Execute>`}
            ,{
            headers:{
                "Content-type": "text/xml",
            },
            params:{
                'service': service,
                'version': version,
                'request': requestParam,
                'identifier': id,
            },
        })
            .then((response) => {
                setGlobalResult(response.data)
                console.log(response.data)
            })
            .catch((e) => {
                console.log(e.message)
            })
    },[id])
  return (
    <div className="App">

            <div>
                <select style={{height: '40px',fontSize: '20px',fontFamily: "Roboto, sans-serif"}}  onClick={(e) => setUrl(e.target.value)}>{
                    domain.map((item,index) =>(
                        <option value={item.name} onClick={(e) => setUrl(item.name)}>{item.name}</option>
                    ))
                }</select>

                <select style={{height: '40px',fontSize: '20px',fontFamily: "Roboto, sans-serif"}} onClick={(e) => setId(e.target.value)}>
                    {
                        result.map((item,index) =>(
                            <option value={item} onClick={(e) => {
                                setId(e.target.value);
                            }}>{item}</option>
                        ))
                    }
                </select>
                {globalResult ? globalResult : null}
                {/*<input list={"browsers"} type={"text"}*/}
                {/*        placeholder={'Введите название и выберите регион'}*/}
                {/*        // value={url}*/}
                {/*        style={{width: '400px'}}*/}
                {/*        onChange={(e) => {*/}
                {/*            // setUrl(e.target.value)*/}
                {/*        }}/>*/}

                {/*<datalist id="browsers">*/}
                {/*    {domain.map((item,index)=>(<option key={index} value={item.name}>{item.name}</option>)*/}
                {/*    )}*/}
                {/*</datalist>*/}
            </div>

            <div>{error ? error : 'no error'}</div>
            <button onClick={() =>request()}>TEST</button>

    </div>
  );
}

export default App;
