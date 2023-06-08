/**
 * Upload page for the app.
 */
// import authentication actions
import React, { useState } from "react";
//import CSRFToken from "../../components/CSRFToken";
import Header from "../../components/Header";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "../../components/Button";
import axios from 'axios';
import CSRFToken from "../../components/CSRFToken";
import Cookies from 'js-cookie';
import NavBar from "../../components/NavBar";
import receiptJsonParser from "./ReceiptJsonParser";

export default function Upload() {

  const [image, setImage] = useState({
    image: null
  });

  const [name, setName] = useState({
    name: ''
  })

  const handleChange = (e) => {
    console.log("value: " + e.target.value);
    setName({
      name: e.target.value
    })
  }

  const handleImageChange = (e) => {
    setImage({
      image: e.target.files[0]
    })
  }

  const handleSubmit = (e) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
    let form_data = new FormData();
    console.log(name.name);
    form_data.append('image', image.image, name.name + ".jpg");
    form_data.append('name', name.name);
    let url = `/ocr/upload/`;
    axios.post(url, form_data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Aceess-Control-Allow-Origin': '*',
      }
    })
      .then(res => {
        console.log(res.data.data);
        console.log(receiptJsonParser(res.data.data));
      })
      .catch(err => console.log(err))
  };

  return (
    <body>
      <NavBar />
      <Header text="Upload" />
      <form method="post" enctype="multipart/form-data" onSubmit={(e) => {
        handleSubmit(e);
      }} className="flex flex-col items-center gap-16">
        <CSRFToken />
        <Row>
          <input type="text" placeholder='name' id='name' onChange={(e) => { handleChange(e); }} />
        </Row>
        <Row>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload Receipt</Form.Label>
            <Form.Control type="file"
              name="image_url"
              accept="image/jpeg"
              onChange={(e) => {
                handleImageChange(e);
              }}
            />
          </Form.Group>
        </Row>
        <Button type="submit" text="Submit" />
      </form>
    </body>
  );
}