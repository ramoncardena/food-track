import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';



export default function SettingsDialog({ open, onClose }) {

    const handleClose = () => {
        if (typeof onClose === "function") onClose();
    };

    const handleScannedCode = (code) => {
        if (typeof onClose === "function") onClose(code);
    }

    return (
        <Dialog
            maxWidth="md"
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
                    SETTINGS
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}