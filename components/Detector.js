import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const ImageClassifier = () => {
  // Use a state variable to store the image URL
  const [imageUrl, setImageUrl] = useState('');

  // Use a state variable to store the classification results
  const [classification, setClassification] = useState(null);

  // Define a handleChange function to update the image URL state variable
  const handleChange = (event) => {
    setImageUrl(event.target.value);
  };

  // Define a handleSubmit function to classify the image
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Load the MobileNet model
    const model = await tf.automobile.load();

    // Classify the image
    const predictions = await model.classify(imageUrl);

    // Set the classification results in the state
    setClassification(predictions);
  };

  // Render the image URL input form and the classification results
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Image URL:
          <input type="text" value={imageUrl} onChange={handleChange} />
        </label>
        <input type="submit" value="Classify" />
      </form>
      {classification && (
        <>
          <p>Classification Results:</p>
          <ul>
            {classification.map((prediction, index) => (
              <li key={index}>{prediction.className}: {prediction.probability}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default ImageClassifier;

