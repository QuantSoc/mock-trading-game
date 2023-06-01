import { Button } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DoneIcon from '@mui/icons-material/Done';
import { useState } from 'react';

const ImageUploadBtn = ({ callback }) => {
  const [thumbnail, setThumbnail] = useState(null);

  const convertImageToUrl = (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const parseImage = async (event) => {
    const imageFile = event.target.files[0];
    const imageUrl = await convertImageToUrl(imageFile);
    setThumbnail(imageUrl);
    callback(imageUrl);
  };

  return (
    <Button
      variant="contained"
      color={thumbnail ? 'success' : 'primary'}
      component="label"
      startIcon={thumbnail ? <DoneIcon /> : <FileUploadIcon />}
    >
      {thumbnail ? 'Uploaded' : 'Upload'}
      <input
        type="file"
        hidden
        accept="image/jpg, image/jpeg, image/png"
        onChange={(event) => parseImage(event)}
      />
    </Button>
  );
};
export default ImageUploadBtn;
