import { useState } from "react";

import { useZxing } from "react-zxing";

import Box from "@mui/material/Box";

// Resources
import frameImage from "../assets/frame.png";

function BarcodeScanner({ onScanned }) {
  const [result, setResult] = useState("");
  const { ref } = useZxing({
    onDecodeResult(result) {
      console.log("RESULT: ", result);
      setResult(result.getText());
      if (typeof onScanned === "function") onScanned(result.getText());
    },
  });

  return (
    <Box>
      <video style={{ width: "300px" }} ref={ref} />
    </Box>
  );
}

export default BarcodeScanner;
