import { Card } from '@mui/material';
import ReactPlayer from 'react-player';

export const Esittelyvideo = ({ videoUrl }: { videoUrl?: string }) => {
  return (
    <Card
      data-testid="esittelyvideo"
      sx={{
        maxWidth: '1200px',
        position: 'relative',
        paddingTop: '56.25%',
      }}
      elevation={1}>
      <ReactPlayer
        data-testid="player"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        url={videoUrl}
        muted
        playing
        controls
        width="100%"
        height="100%"
      />
    </Card>
  );
};
