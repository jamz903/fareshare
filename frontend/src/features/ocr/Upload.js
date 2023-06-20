/**
 * Upload page for the app.
 */
// import authentication actions
import React, { useState } from "react";
import Button from "../../components/Button";
import CSRFToken from "../../components/CSRFToken";
import receiptJsonParser from "./ReceiptJsonParser";
import uploadFileToServer from "./UploadFileToServer";
// router
import { useNavigate } from "react-router-dom";
import NavBarLayout from "../../layouts/NavBarLayout";

export default function Upload() {
  const navigate = useNavigate();

  const [image, setImage] = useState({
    image: null
  });

  const [name, setName] = useState({
    name: ''
  })

  // for previewing image
  const [imageUrl, setImageUrl] = useState({
    imageUrl: ''
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
    const image = e.target.files[0];
    if (image === null || image === undefined || image === '') {
      setImageUrl({
        imageUrl: ''
      })
    } else {
      setImageUrl({
        imageUrl: URL.createObjectURL(e.target.files[0]).toString()
      })
    }

  }

  const handleSubmit = (e) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
    uploadFileToServer(name.name, image.image)
      .then(res => {
        const receiptData = receiptJsonParser(res.data.data);
        // navigate to receipt_data page
        navigate("/receipt_data", { state: { receiptData: receiptData } });
      })
      .catch(err => console.error(err));
  };

  return (
    <NavBarLayout navBarText="Upload">
      <form
        method="post"
        encType="multipart/form-data"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="h-full w-full flex flex-col items-center gap-5 px-5 pb-5">
        <CSRFToken />
        <label className="grow w-full flex flex-col justify-center border-primary border-2 rounded-xl py-2 px-4 gap-2">
          {
            imageUrl.imageUrl !== '' ?
              <img src={imageUrl.imageUrl} className="flex-none max-w-full mx-auto" alt='' />
              : null
          }
          <div className="text-center text-primary">
            {imageUrl.imageUrl !== '' ? "Change Image..." : "Choose File..."}
          </div>
          <input
            type="file"
            name="image_url"
            accept="image/jpeg"
            className="hidden"
            onChange={(e) => {
              handleImageChange(e);
            }} />
        </label>
        <label className="w-full flex flex-col items-center gap-1">
          <input type="text" id='name' className="border-primary border-2 rounded-xl py-2 px-4 w-full" placeholder="Give your image a name" onChange={(e) => { handleChange(e); }} />
        </label>
        <Button type="submit">
          Submit
        </Button>
      </form>
    </NavBarLayout>
  );
}