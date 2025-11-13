const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handlePhotoUpload called');
    const file = e.target.files?.[0];
    console.log('File selected:', file);
    
    if (!file) {
      console.log('No file selected');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File too large:', file.size);
      setError('Image must be less than 5MB');
      return;
    }

    console.log('Starting file read...');
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('File read complete');
      const base64String = reader.result as string;
      console.log('Base64 length:', base64String.length);
      setFormData({
        ...formData,
        profile_photo: base64String
      });
      setPhotoPreview(base64String);
      setError('');
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };
