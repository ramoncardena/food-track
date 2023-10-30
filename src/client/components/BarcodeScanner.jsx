import { useState } from "react";

import { useZxing } from "react-zxing";
import { BarLoader } from "react-spinners";

import Box from "@mui/material/Box";

// Resources
import frameImage from "../assets/frame.png";
import { Stack, Typography } from "@mui/material";

function BarcodeScanner({ onScanned }) {
  const [loaded, setLoaded] = useState(false);

  const { ref } = useZxing({
    onDecodeResult(result) {
      console.log("RESULT: ", result);
      if (typeof onScanned === "function") onScanned(result.getText());
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <video
        style={{ maxWidth: "250px" }}
        ref={ref}
        onPlay={() => setLoaded(true)}
      />
      {!loaded && (
        <Stack alignItems="center">
          <Typography variant="caption" color="primary">
            Loading Scanner
          </Typography>

          <BarLoader color="#7fc2d8" />
        </Stack>
      )}
    </Box>
  );
}

export default BarcodeScanner;
