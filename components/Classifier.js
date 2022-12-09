import React, { useState, useRef } from 'react';

export default function ImageUploader() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = () => {
    const file = fileInputRef.current.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
      {image && <img src={image} alt="Uploaded image" />}
    </div>
  );
};

