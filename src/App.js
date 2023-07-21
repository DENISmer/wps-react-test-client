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

    const request = () => {
    console.log(url)
    axios.get(`${url}`,{
        headers:{
        "Content-type": "text/html",
        },
        params:{
            'service': service,
            'version': version,
            'request': requestParam,
        }
    })
        // .elements[0].elements[0].elements[0].text
        .then((response) => {
                res = xml2js(response.data).elements[0].elements[3].elements
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
        axios.get(`${url}`,{
            headers:{
                "Content-type": "text/html",
            },
            params:{
                'service': service,
                'version': version,
                'request': 'DescribeProcess',
                'identifier': id,
            }
        })
            .then((response) => {
                console.log(xml2json(response.data))
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
