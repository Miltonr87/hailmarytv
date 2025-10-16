import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VideoUploadProps {
  accessToken: string;
}

const VideoUpload = ({ accessToken }: VideoUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file || !accessToken) return;
    setUploading(true);

    const metadata = {
      snippet: {
        title: 'HailMaryTV Test Upload',
        description: 'Uploaded via HailMaryTV React App ⚡',
        tags: ['NFL', 'Highlights', 'HailMaryTV'],
        categoryId: '17', // Sports
      },
      status: {
        privacyStatus: 'private',
      },
    };

    const form = new FormData();
    form.append(
      'snippet',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append('videoFile', file);

    try {
      const res = await fetch(
        'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: form,
        }
      );

      const data = await res.json();

      if (data.error) {
        console.error('YouTube upload error:', data.error);
        setResponse(
          `❌ Upload failed: ${data.error.message || 'Unknown error'}`
        );
      } else {
        setResponse(`✅ Uploaded! Video ID: ${data.id}`);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setResponse('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <Input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={uploading}
        className="max-w-md"
      />

      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="min-w-[150px]"
      >
        {uploading ? 'Uploading...' : 'Upload Video'}
      </Button>

      {response && (
        <p
          className={`text-sm mt-2 ${
            response.startsWith('✅') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {response}
        </p>
      )}
    </div>
  );
};

export default VideoUpload;
