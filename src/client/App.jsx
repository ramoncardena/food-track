import { useState } from "react";

// Material UI
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

import { CloseRounded } from "@mui/icons-material";

// API
import { getProduct } from "./apis/OpenFoodFactsAPI";

// Components
import ScannerDialog from "./components/ScannerDialog";
import SettingsDialog from "./components/SettingsDialog";
import ScannedProductCard from "./components/ScannedProductCard";

// Resources
import barcodeLogo from "./assets/barcode.png";

function App() {
  const [product, setProduct] = useState();
  const [EAN, setEAN] = useState();
  const [openScanner, setOpenScanner] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [history, setHistory] = useState([]);

  const handleClickScannerOpen = () => {
    setProduct(null);
    setEAN(null);
    setOpenScanner(true);
  };

  const handleScannerDialogClose = (code) => {
    setOpenScanner(false);
    if (code) {
      getProduct(code, "Food").then((res) => {
        const product = res.product;
        setProduct(product);
        setEAN(code);

        const tmpHistory = [...history].filter(
          (item) => item.name !== product.product_name
        );
        setHistory([{ name: product.product_name, ean: code }, ...tmpHistory]);
        console.log(product);
      });
    }
  };

  const handleHistoryClick = (ean) => {
    getProduct(ean, "Food").then((res) => {
      const product = res.product;
      setProduct(product);
      setEAN(ean);
      const tmpHistory = [...history].filter(
        (item) => item.name !== product.product_name
      );
      setHistory([{ name: product.product_name, ean: ean }, ...tmpHistory]);
    });
  };

  const handleClickSettings = () => {
    setOpenSettings(true);
  };

  const handleSettingsDialogClose = () => {
    setOpenSettings(false);
  };

  const handleCloseClick = () => {
    setProduct(null);
  };

  return (
    <Container
      maxWidth={false}
      sx={{ backgroundColor: "#f6f6f6", height: "100vh" }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            style={{ color: "#323232", opacity: "0.9" }}
          >
            Food Track
          </Typography>
          <Typography
            variant="body1"
            style={{ color: "#323232", opacity: "0.9" }}
          >
            Keep an eye on your food
          </Typography>
          {product && (
            <Box sx={{ position: "absolute", top: 2, right: 6 }}>
              {/* <IconButton variant="outlined" onClick={handleClickScannerOpen}>
              <DocumentScannerIcon sx={{ transform: "rotate(90deg)" }} />
            </IconButton> */}

              <IconButton onClick={handleCloseClick} size="large">
                <CloseRounded />
              </IconButton>
            </Box>
          )}
        </Box>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {product ? (
            <>
              <ScannedProductCard product={product} ean={EAN} />
              <Button onClick={handleCloseClick}>Back</Button>
            </>
          ) : (
            <>
              <IconButton
                variant="outlined"
                onClick={handleClickScannerOpen}
                size="large"
              >
                <img
                  src={barcodeLogo}
                  style={{ maxWidth: "250px", opacity: "0.7", padding: "20px" }}
                />
              </IconButton>

              {history?.length > 0 && <Typography> HISTORY</Typography>}
              {history.map((item) => (
                <Paper
                  key={item.ean}
                  sx={{ padding: 1, cursor: "pointer" }}
                  elevation={16}
                  onClick={() => handleHistoryClick(item.ean)}
                >
                  <Typography>{item.name}</Typography>
                </Paper>
              ))}
            </>
          )}
        </Stack>
      </Container>
      <ScannerDialog open={openScanner} onClose={handleScannerDialogClose} />
      <SettingsDialog open={openSettings} onClose={handleSettingsDialogClose} />
    </Container>
  );
}

export default App;
