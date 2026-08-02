import { useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useInput, useNotify } from 'react-admin';

interface UploadResponse {
  urls: string[];
  error?: { message?: string };
}

export const ImageListInput = (props: { source: string; label?: string }) => {
  const { field } = useInput(props);
  const notify = useNotify();
  const [busy, setBusy] = useState(false);
  const images: string[] = Array.isArray(field.value) ? field.value : [];

  const handleFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    setBusy(true);
    try {
      const response = await fetch('/api/v1/uploads/products', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });
      const json = (await response.json().catch(() => ({}))) as UploadResponse;
      if (!response.ok) {
        throw new Error(json?.error?.message ?? 'Image upload failed');
      }
      field.onChange([...images, ...json.urls]);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Image upload failed', { type: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const remove = (url: string) => field.onChange(images.filter((u) => u !== url));

  return (
    <Box>
      <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
        {images.map((url) => (
          <Box key={url} position="relative">
            <Box
              component="img"
              src={url}
              alt=""
              sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
            />
            <IconButton
              size="small"
              onClick={() => remove(url)}
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} disabled={busy}>
        {busy ? 'Uploading…' : 'Upload images'}
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </Button>
    </Box>
  );
};
