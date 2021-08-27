import './App.css';
import React, { useState, useEffect } from 'react'

function App() {
  const [numFields, setNumFields] = useState(1)
  const [pairElems, setPairElems] = useState([])
  const [data, setData] = useState({})
  const [json, setJson] = useState([])
  const [url, setUrl] = useState("")
  const [jsonEntry, setjsonEntry] = useState({})

  useEffect(() => {
    for (var i = 0; i < numFields; i++) {
      setPairElems(renderPair(i))
    }
  }, [numFields])

  const upNumFields = () => {
    var counter = numFields
    counter++
    setNumFields(counter)
  }

  const downNumFields = () => {
    var counter = numFields
    if (numFields > 1) { counter-- }
    setNumFields(counter)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    for (var i = 1; i <= numFields; i++) {
      setJsonField([data["key" + i]], convertType(i, data["value" + i]))
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(json)
    });
    console.log(JSON.stringify(json))
  }

  const handleSubmitJson = (event) => {
    event.preventDefault()
    setJson(jsonEntry)
    fetch(url, {
      method: 'POST',
      body: JSON.parse(JSON.stringify(json))
    });
    console.log(JSON.parse(JSON.stringify(json)))
  }

  const convertType = (i, val) => {
    const type = data["type" + i]
    if (type == undefined || type == "string") {
      return val
    }

    if (type == "boolean") {
      return (val.toLowerCase() == "true" ? true : false)
    }

    if (type == "int") {
      return parseInt(val)
    }

    //type is float
    return parseFloat(val)

  }

  const set = name => {
    return ({ target: { value } }) => {
      setData(oldData => ({ ...oldData, [name]: value }));
    }
  };

  const setJsonField = (name, value) => {
    setJson(oldData => ({ ...oldData, [name]: value }));
  }

  const renderPair = (n) => {
    var result = []
    for (var i = 1; i <= n + 1; i++) {
      result.push(
        <div key={i} className="pair">
          <label className="pair-label" for={"key" + i}>Key {i}:</label>
          <input className="pair-input" type="text" id={"key" + i} name={"key" + i} onChange={set("key" + i)} />

          <label className="pair-label" for={"value" + i}>Value {i}:</label>
          <input className="pair-input" type="text" id={"value" + i} name={"value" + i} onChange={set("value" + i)} />

          <label className="pair-label" for={"type" + i}>Type of Value {i}:</label>
          <select className="pair-input" id={"type" + i} name={"type" + i} onChange={set("type" + i)} defaultValue="string">
            <option value="string">string</option>
            <option value="boolean">boolean</option>
            <option value="int">int</option>
            <option value="float">float</option>
          </select>
        </div>)
    }
    return result
  }

  function refreshPage() {
    window.location.reload();
  }

  const handleUrl = (event) => {
    setUrl(event.target.value)
  }

  const jsonEntryChange = (event) => {
    setjsonEntry(event.target.value)
  }

  return (
    <div className="App">
      <h1>Testing Tool</h1>
      <form id="kv-form">
        <label id="url_label" for="url">URL:</label>
        <input type="url" id="url" name="url" onChange={handleUrl} />

        <button id="submit-btn" type="submit" onClick={handleSubmit}>
          Construct JSON and Submit
        </button>
        {/* render numFields pairs */}
        <div className="pair-container">{pairElems}</div>
        <div className="add_res">
          <label className="label-btn" onClick={upNumFields}>Add Pair</label>
          <label className="label-btn" onClick={refreshPage}>Reset Form</label>
          <label className="label-btn" onClick={downNumFields}>Remove Pair</label>
        </div>
      </form>
      <form id="json-form">
        <label id="json-label" for="json-entry">OR input a JSON directly here: </label>
        <textarea id="json-entry" name="json-entry" onChange={jsonEntryChange}></textarea>
        <button id="json-btn" type="submit" onClick={handleSubmitJson}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
