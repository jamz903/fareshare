import { useRef, useState } from 'react';
import Button from '../../components/Buttons/Button';
import NavBarLayout from '../../layouts/NavBarLayout';
import Measure from 'react-measure'
import { CameraIcon } from '@heroicons/react/24/outline'
import CSRFToken from '../../components/CSRFToken';
import receiptJsonParser from './ReceiptJsonParser';
import uploadFileToServer from './UploadFileToServer';
// router
import { useNavigate } from 'react-router-dom';
import { LightSpinner } from '../../components/Spinner';
import { debounce } from 'lodash';

export default function Camera() {
    const navigate = useNavigate();
    const videoRef = useRef(null)
    const canvasRef = useRef();
    const [dimensions, setDimensions] = useState({ width: -1, height: -1 });
    const minLength = Math.min(dimensions.width, dimensions.height);
    const [capturing, setCapturing] = useState(false);
    const [loading, setLoading] = useState(false);

    const DISPLAY_TEXT = 'Please keep receipt in this frame.'

    const [blob, setBlob] = useState(null);

    const config = {
        audio: false,
        video: {
            facingMode: "environment",
            height: { ideal: 2160 },
            width: { ideal: 2160 },
            aspectRatio: { ideal: 1 },
        }
    }
    navigator.mediaDevices.getUserMedia(config).then((mediaStream) => {
        if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
            videoRef.current.srcObject = mediaStream;
        }
    }).catch((error) => {
        console.warn(error);
        alert(error.message);
    });

    function handleCapture() {
        setCapturing(true);
        const context = canvasRef.current.getContext("2d");

        canvasRef.current.width = minLength;
        canvasRef.current.height = minLength;

        context.drawImage(
            videoRef.current,
            0, //offset.x
            0, //offset.y
            minLength, //width
            minLength, //height
        );

        canvasRef.current.toBlob((blob) => {
            setBlob(blob);
        }, "image/png", 1);
        setCapturing(false);
    }

    function handleUpload() {
        setLoading(true);
        // upload blob to server and redirect user to receipt page
        const debouncedUpload = debounce(() => {
            uploadFileToServer("receipt.jpg", blob)
                .then(res => {
                    const receiptData = receiptJsonParser(res.data.data);
                    // after upload, clear canvas and blob
                    setBlob(null);
                    const context = canvasRef.current.getContext("2d");
                    context.clearRect(0, 0, minLength, minLength);
                    // navigate to receipt_data page
                    navigate("/receipt_data", { state: { receiptData: receiptData } });
                })
                .catch(err => {
                    if (err.response && err.response.data && err.response.data.message) {
                        alert(err.response.data.message);
                    } else {
                        alert(err.message);
                    }
                }).finally(() => {
                    setLoading(false);
                });
        }, 1000)
        debouncedUpload();
    }

    return (
        <NavBarLayout>
            <CSRFToken />
            <Measure
                bounds
                onResize={contentRect => {
                    setDimensions(contentRect.bounds)
                }}
            >
                {({ measureRef }) => (
                    <div className='w-full h-full flex flex-col items-center justify-center' ref={measureRef}>
                        <video
                            className="max-w-full max-h-full"
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline>
                        </video>
                        <div className='absolute text-seasalt block p-3 flex flex-row items-center justify-center' style={{ width: `${minLength}px`, height: `${minLength}px` }}>
                            <div className='w-[69%] h-full border-2 p-1 flex flex-col items-center justify-end rounded-xl'>
                                <div className='text-center'>
                                    {DISPLAY_TEXT}
                                </div>
                            </div>
                        </div>
                        <canvas ref={canvasRef} className='absolute'></canvas>
                    </div>
                )}
            </Measure>
            <div className='p-5'>
                {
                    blob === null ?
                        <Button onClick={handleCapture}>
                            {
                                capturing ?
                                    <LightSpinner /> :
                                    <CameraIcon className='h-6 w-6 mx-auto' />
                            }
                        </Button> :
                        <Button onClick={handleUpload} disabled={loading}>
                            {
                                loading ?
                                    <LightSpinner /> :
                                    'Upload'
                            }
                        </Button>
                }
            </div>
        </NavBarLayout>
    );
}