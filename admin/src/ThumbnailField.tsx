import { Box } from '@mui/material';
import { useRecordContext } from 'react-admin';

export const ThumbnailField = () => {
  const record = useRecordContext();
  const image = record?.image as string | undefined;
  if (!image) return null;
  return (
    <Box
      component="img"
      src={image}
      alt=""
      sx={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 1, display: 'block' }}
    />
  );
};
