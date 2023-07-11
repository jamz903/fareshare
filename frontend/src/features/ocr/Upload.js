/**
 * Upload page for the app.
 */
// import authentication actions
import React, { useState } from "react";
import Button from "../../components/Buttons/Button";
import CSRFToken from "../../components/CSRFToken";
import receiptJsonParser from "./ReceiptJsonParser";
import uploadFileToServer from "./UploadFileToServer";
// router
import { useNavigate } from "react-router-dom";
import NavBarLayout from "../../layouts/NavBarLayout";
import { LightSpinner } from "../../components/Spinner";

export default function Upload() {
  const navigate = useNavigate();

  const [image, setImage] = useState({
    image: null
  });

  const [name, setName] = useState({
    name: ''
  })

  const [receiptType, setReceiptType] = useState({
    receiptType: ''
  })

  // for previewing image
  const [imageUrl, setImageUrl] = useState({
    imageUrl: ''
  })

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (nameError) {
      setNameError(false);
    }
    setName({
      name: e.target.value.trim()
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
      if (imageError) {
        setImageError(false);
      }
      setImageUrl({
        imageUrl: URL.createObjectURL(e.target.files[0]).toString()
      })
    }
  }

  const handleReceiptChange = (e) => {
    setReceiptType({
      receiptType: e.target.value
    })
    console.log(e.target.value)
    if (e.target.value === "physical") {
      document.getElementById("physical").style.backgroundColor = "#f3f4f6";
      document.getElementById("physical").style.color = "#1b9aaa";
      document.getElementById("online").style.backgroundColor = "#f8f7f6";
      document.getElementById("online").style.color = "#05387b";
    }
    if (e.target.value === "online") {
      document.getElementById("physical").style.backgroundColor = "#f8f7f6";
      document.getElementById("physical").style.color = "#05387b";
      document.getElementById("online").style.backgroundColor = "#f3f4f6";
      document.getElementById("online").style.color = "#1b9aaa";
    }
  }

  const handleSubmit = (e) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
    setLoading(true);
    if (!image.image) {
      setImageError(true);
      setImageErrorMessage('Please upload an image.');
      setLoading(false);
      return;
    }
    if (!name.name) {
      setNameError(true);
      setNameErrorMessage('Please enter a name for your image.');
      setLoading(false);
      return;
    }
    if (!receiptType.receiptType) {
      setReceiptTypeError(true);
      setLoading(false);
      return;
    }
    uploadFileToServer(name.name, image.image, receiptType.receiptType)
      .then(res => {
        const receiptData = receiptJsonParser(res.data.data);
        // navigate to receipt_data page
        navigate("/receipt_data", { state: { id: res.data.id, receiptData: receiptData } });
      })
      .catch(err => {
        let message;
        if (err.response && err.response.data && err.response.data.message) {
          message = err.response.data.message;
        } else {
          message = err.message;
        }
        setNameError(true);
        setImageError(true);
        setImageErrorMessage('');
        setNameErrorMessage(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // error handling
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('Please enter a name for your image.');
  const [imageError, setImageError] = useState(false);
  const [receiptTypeError, setReceiptTypeError] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState('Please upload an image.');
  let nameBorderColor = 'primary';
  let chooseFileBorderColor = 'primary';
  let chooseFileTextColor = 'primary';
  let receiptTypeBorderColor = 'primary';

  if (imageError) {
    chooseFileBorderColor = 'red';
    chooseFileTextColor = 'red';
  }
  if (nameError) {
    nameBorderColor = 'red';
  }
  if (receiptTypeError) {
    receiptTypeBorderColor = 'red';
  }

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
        <div className="w-full grow flex flex-col gap-1">
          <label className={`w-full grow flex flex-col justify-center border-${chooseFileBorderColor} border-2 rounded-xl py-2 px-4 gap-2`}>
            {
              imageUrl.imageUrl !== '' ?
                <img src={imageUrl.imageUrl} className="flex-none max-w-full mx-auto" alt='' />
                : null
            }
            <div className={`text-center text-${chooseFileTextColor}`}>
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
          {
            imageError ?
              <div className="text-sm text-red mt--5">
                {imageErrorMessage}
              </div> : null
          }
        </div>
        <label className="w-full flex flex-col gap-1">
          <input type="text" id='name' className={`border-${nameBorderColor} border-2 rounded-xl py-2 px-4 w-full`} placeholder="Give your image a name" onChange={(e) => { handleChange(e); }} />
          {
            nameError ?
              <div className={`text-sm text-red`}>
                {nameErrorMessage}
              </div> : null
          }
        </label>
        
        <label className="text-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button id="physical" type="button" value="physical" onClick={(e) => {
                handleReceiptChange(e);
              }} className={`border-${receiptTypeBorderColor} inline-flex items-center px-6 py-3 text-xl font-medium  text-primary bg-seasalt border border-gray-200 rounded-l-lg hover:bg-gray-100 focus:z-10 focus:bg-gray-100 focus:text-secondary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:text-white`}>
              Physical Receipt
            </button>
            <button id="online" type="button" value="online" onClick={(e) => {
                handleReceiptChange(e);
              }} className={`border-${receiptTypeBorderColor} inline-flex items-center px-6 py-3 text-xl font-medium text-primary bg-seasalt border border-gray-200 rounded-r-lg hover:bg-gray-100 focus:z-10 focus:bg-gray-100 focus:text-secondary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:text-white`}>
              Online Receipt
            </button>
          </div>
        {
            nameError ?
              <div className={`text-sm text-red`}>
                Please select a receipt type.
              </div> : null
          }
        </label>

        <Button type="submit" disabled={loading}>
          {
            loading ?
              <LightSpinner />
              : "Upload"
          }
        </Button>
      </form>
    </NavBarLayout>
  );
}