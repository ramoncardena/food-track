import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import BarcodeScanner from './BarcodeScanner';

export default function ScannerDialog({ open, onClose }) {
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');

    const handleClose = () => {
        if (typeof onClose === "function") onClose();
    };

    const handleScannedCode = (code) => {
        if (typeof onClose === "function") onClose(code);
    }

    return (
        <Dialog
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
        >
            <DialogContent>
                <Box
                    noValidate
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        m: 'auto',
                        width: 'fit-content',
                    }}
                >
                    <BarcodeScanner onScanned={handleScannedCode} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}