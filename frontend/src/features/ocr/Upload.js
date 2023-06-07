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
import NavBar from "../../components/navbar";

export default function Upload() {

  const [data, setData] = useState({
    name: "",
    image_url: null
  });

  const handleChange = (e) => {
    setData({
      [e.target.id]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    setData({
      image: e.target.files[0]
    })
  }

  const handleSubmit = (e) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
    console.log(data);
    let form_data = new FormData();
    form_data.append('image_url', data.image_url, data.image_url.name);
    form_data.append('name', data.name);
    let url = `${process.env.REACT_APP_API_URL}/ocr/upload/`;
    axios.post(url, form_data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Aceess-Control-Allow-Origin':'*',
      }
    })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err))
  };

  return (
    <body>
      <NavBar />
      <Header text="Upload" />
      <form method="post" enctype="multipart/form-data" className="flex flex-col items-center gap-16">
            <CSRFToken />
            <Row>
              <input type="text" placeholder='name' id='name' onChange={(e) => {handleChange(e);}} />
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
            <Button onSubmit={(e) => {
                                handleSubmit(e);
                              }} type="submit" text="Submit" />
      </form>
    </body>
  );
}