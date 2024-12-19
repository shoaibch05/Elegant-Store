import React, { useState } from "react";
import { Box, IconButton, Typography, Grid, Paper, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
const ImageUploadList = ({ images, setImages }) => {
  const handleAddImage = (event) => {
    const newFiles = Array.from(event.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages([...images, ...newFiles]); // Updating the parent state correctly
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages); // Removing image by index
  };

  return (
    <Box sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        Upload Images
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          overflowX: "auto",
          p: 1,
          border: "1px solid #ccc",
          borderRadius: "4px",
          justifyContent: "flex-start",
        }}
      >
        {images.map((image, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              position: "relative",
              width: 100,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <img
              src={image.preview}
              alt={`Preview ${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <IconButton
              color="error"
              size="small"
              onClick={() => handleRemoveImage(index)}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "rgba(255,255,255,0.7)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Paper>
        ))}

        {/* Add New Image */}
        <Paper
          elevation={3}
          sx={{
            width: 100,
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            borderRadius: "8px",
            border: "1px dashed #ccc",
          }}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            id="upload-image-input"
            onChange={handleAddImage}
          />
          <label htmlFor="upload-image-input" style={{ cursor: "pointer" }}>
            <IconButton color="primary" component="span">
              <AddIcon />
            </IconButton>
          </label>
        </Paper>
      </Stack>
    </Box>
  );
};

export default ImageUploadList;
