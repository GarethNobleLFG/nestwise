import * as React from 'react';
import Box from '@mui/material/Box';
import Zoom from '@mui/material/Zoom';
import Slide from '@mui/material/Slide';
import Sidebar from './SideBar';
import ContentViewer from './ContentViewer';

export default function ChatContainer({
  animationTriggered,
  profileData,
  safeMessages,
  input,
  setInput,
  handleSend,
  handleFileUpload,
  sending
}) {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Zoom in={animationTriggered} timeout={1000}>
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            width: '100%',
            border: 1,
            borderColor: 'divider',
            borderRadius: 0,
            overflow: 'hidden',
            position: 'relative',
            bgcolor: '#f7f7f8',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}
        >
          <Slide direction="right" in={animationTriggered} timeout={1200}>
            <Box sx={{ width: '20%', display: 'flex' }}>
              <Sidebar
                animationTriggered={animationTriggered}
                profileData={profileData}
              />
            </Box>
          </Slide>

          <Slide direction="left" in={animationTriggered} timeout={1200}>
            <Box sx={{
              flex: 1,
              display: 'flex',
              padding: '16px',
              marginLeft: '-40px',
              marginTop: '10px',
              width: '100%',
              height: '100%',
            }}>
              <ContentViewer
                animationTriggered={true}





                // THIS WILL NEED CHANGED IN THE FUTURE.
                pdfUrl="path/to/your/document.pdf"
                leftData={{
                  "Portfolio Value": "$347,500",
                  "Annual Contribution": "$22,000",
                  "Years to Retirement": "23",
                  "Target Retirement": "$1.2M"
                }}
                rightData={{
                  "Asset Allocation": "60/30/10",
                  "Annual Growth": "7.2%",
                  "Risk Level": "Moderate",
                  "On Track": "Yes"
                }}





                topBoxHeight={450}
                bottomBoxHeight={250}
                containerPadding={16}
                leftOffset={0}
              />
            </Box>
          </Slide>
        </Box>
      </Zoom>
    </Box>
  );
}