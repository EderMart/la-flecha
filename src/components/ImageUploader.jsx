import { useState } from 'react';

const ImageUploader = ({ onImageUpload, multiple = false }) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file) => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append('quality', 'auto'); // Optimización automática
  formData.append('fetch_format', 'auto'); // Formato automático (WebP, etc.)
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      console.log('Imagen subida:', data.secure_url);
      onImageUpload(data.secure_url); // Esta URL la guardas en Firebase
      
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error al subir la imagen');
    }
    
    setUploading(false);
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    
    if (multiple) {
      // Si permite múltiples archivos
      for (let file of files) {
        await uploadImage(file);
      }
    } else {
      // Solo un archivo
      if (files[0]) {
        uploadImage(files[0]);
      }
    }
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <input 
        type="file" 
        accept="image/*,video/*"
        multiple={multiple}
        onChange={handleFileChange}
        disabled={uploading}
        style={{
          padding: '10px',
          border: '2px dashed #ccc',
          borderRadius: '5px',
          cursor: uploading ? 'not-allowed' : 'pointer'
        }}
      />
      {uploading && (
        <p style={{ color: '#007bff', marginTop: '10px' }}>
          📤 Subiendo imagen(es)...
        </p>
      )}
    </div>
  );
};

export default ImageUploader;