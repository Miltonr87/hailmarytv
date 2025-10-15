import { useState } from 'react';

interface VideoUploadProps {
  accessToken: string;
}

export const VideoUpload = ({ accessToken }: VideoUploadProps) => {
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
      setResponse(`✅ Uploaded! Video ID: ${data.id}`);
    } catch (err) {
      setResponse('❌ Upload failed');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>
      {response && <p className="text-sm mt-2">{response}</p>}
    </div>
  );
};
