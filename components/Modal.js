import { Dialog, Transition } from "@headlessui/react";
import { CameraIcon } from "@heroicons/react/outline";
import { modalState } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import { Fragment, useRef, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { useSession } from "next-auth/react";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
import * as cocoSsd from '@tensorflow-models/coco-ssd';

function Modal() {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const captionRef = useRef(null);
  const filePickerRef = useRef(null);
  const [imageElement, setImageElement] = useState(null);
  const uploadPost = async () => {
    if (loading) return;
     if (!selectedFile) {
      // Handle error if no image was selected
      console.error('No image was selected');
      return;
	}
    setLoading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      caption: captionRef.current.value,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    console.log("New doc added with ID", docRef.id);

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
	setSelectedFile(null);
      }
    );

    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };
const addImageToPost = async (e) => {
  const reader = new FileReader();
  if (e.target.files[0]) {
    // Read the selected file as a data URL
    reader.readAsDataURL(e.target.files[0]);

    // Set the selectedFile variable in the reader.onload event handler
    reader.onload = async (readerEvent) => {
      const selectedFile = readerEvent.target.result;

   // Make sure the result property is not null or undefined
      if (readerEvent.target.result) {
        setSelectedFile(readerEvent.target.result);
      if (!selectedFile) {
        // Handle error if no image was selected
        console.error('No image was selected');
        return;
      }
      // Create an image element from the selected file
      const newImageElement = document.createElement('img');
      newImageElement.src = selectedFile;

      setImageElement(newImageElement);

      // Load the coco-ssd model
      const model = await cocoSsd.load();

      // Use the model to detect objects in the selected image
      const predictions = await model.detect(newImageElement);
      console.log(predictions);   
      };
    };
  };
};

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                {imageElement ? (
		  <img
            className="w-full object-contain cursor-pointer"
            src={imageElement.src}
            alt=""
	          />
                ) : (
                  <div
                    onClick={() => filePickerRef.current.click()}
                    className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
                  >
                    <CameraIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Upload a photo 
                  </Dialog.Title>

                  <div>
                    <input
                      ref={filePickerRef}
                      type="file"
                      hidden
                      onChange={addImageToPost}
                    />
                  </div>

                  <div className="mt-2">
                    <input
                      className="border-none focus:ring-0 w-full text-center"
                      type="text"
                      ref={captionRef}
                      placeholder="Please enter a caption..."
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
                  onClick={uploadPost}
                >
                  {loading ? "Searching Photo for Dogs..." : "Run Dog Detector and Upload Post."}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal;
