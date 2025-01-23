// src/utils/imageUploader.ts
export async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`http://localhost:3001/uploadImage`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.base64 || null;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
