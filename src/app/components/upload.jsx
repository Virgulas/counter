'use client';

import React, { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import '../styles/upload.css';

const ImageUpload = ({
  setImageUrl,
  fileInputRef,
  file,
  setFile,
  imageUrl,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];

        const response = await axios.post('/api/upload', {
          image: base64Image,
        });

        setImageUrl(response.data.link);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <Form.Group controlId="formFile">
        <Form.Control
          type="file"
          className="form-upload"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </Form.Group>

      <Button
        className="upload-btn"
        variant="primary"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />{' '}
            Uploading...
          </>
        ) : imageUrl ? (
          'Adicionado!'
        ) : (
          'Adicionar'
        )}
      </Button>
    </div>
  );
};

export default ImageUpload;
