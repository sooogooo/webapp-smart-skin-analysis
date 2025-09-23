import React, { useState, useRef } from 'react';
import CameraIcon from './icons/CameraIcon';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (base64: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          // Define max dimensions for resizing
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          // Create canvas to draw the resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            // Fallback to original if canvas context is not available
            console.error("Canvas 2D context is not available. Falling back to original image.");
            const originalBase64 = e.target.result as string;
            setImagePreview(originalBase64);
            onImageUpload(originalBase64);
            return;
          }

          // Draw the image onto the canvas (this resizes it)
          ctx.drawImage(img, 0, 0, width, height);

          // Get the compressed base64 string as a JPEG
          // This also handles conversion from formats like HEIC
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // 90% quality

          // Update state and notify parent component
          setImagePreview(dataUrl);
          onImageUpload(dataUrl);

        } catch (error) {
            console.error("Error processing image:", error);
            // In case of an error during processing, fallback to the original
            const originalBase64 = e.target.result as string;
            setImagePreview(originalBase64);
            onImageUpload(originalBase64);
        }
      };
      
      img.onerror = () => {
        console.error("Error loading image file into Image object.");
        onImageUpload(null);
        setImagePreview(null);
      };
      
      img.src = e.target.result as string;
    };
    
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        onImageUpload(null);
        setImagePreview(null);
    };

    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => fileInputRef.current?.click();
  const triggerCameraUpload = () => cameraInputRef.current?.click();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">上传照片</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="flex flex-col space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">为获得最准确的 AI 分析，请上传一张清晰、光线充足的患处照片。</p>
          <div className="flex space-x-2">
            <button onClick={triggerFileUpload} className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
              <UploadIcon className="h-5 w-5 mr-2" />
              上传文件
            </button>
            <button onClick={triggerCameraUpload} className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <CameraIcon className="h-5 w-5 mr-2" />
              拍照
            </button>
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
        </div>
        <div className="flex justify-center items-center h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          {imagePreview ? (
            <img src={imagePreview} alt="皮肤预览" className="h-full w-full object-cover" />
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm">图片预览</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;