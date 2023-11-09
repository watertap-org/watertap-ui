import React , {Fragment} from 'react';
import { Grid, Button, Modal, TextField } from '@mui/material';

export default function PopupModal(props) {

    const styles = {
        modalStyle: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: props.width !== undefined ? props.width : 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
        },
    }

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            {props.input ? 

            <Grid container sx={styles.modalStyle} spacing={1}>
                        
            <Grid item xs={12}>
                <TextField
                    required
                    variant="standard"
                    id="margin-none"
                    label={props.textLabel}
                    value={props.text}
                    onChange={props.handleEditText}
                    fullWidth
                />
            </Grid>
            <Grid item xs={8}></Grid>
            <Grid item xs={4}>
                <Button onClick={props.handleSave} variant={props.buttonVariant} color={props.buttonColor}>{props.buttonText}</Button>
            </Grid>
            </Grid>

            :
            <Grid container sx={styles.modalStyle} spacing={1}>
            <Grid item xs={12}>
                <p>{props.text}{props.showError && <span style={{color: "red"}}>{props.errorText}</span>}</p>
            </Grid>
            {props.hasInput &&
                <Fragment>
                    <Grid item xs={6}></Grid>
                        <Grid item xs={6}>
                            <TextField
                                //  required
                                sx={{marginBottom: "10px"}}
                                variant="standard"
                                id="margin-none"
                                label={props.textLabel}
                                value={props.inputText}
                                onChange={props.handleEditText}
                                fullWidth
                            />
                        </Grid>
                </Fragment>
            }
            {props.hasTwoButtons ? 
            <>
            <Grid item xs={1}></Grid>
            <Grid item xs={4.5}>
                <Button fullWidth onClick={props.handleButtonTwoClick} variant={props.buttonTwoVariant} color={props.buttonTwoColor} endIcon={props.iconTwo && props.iconTwo}>{props.buttonTwoText}</Button>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={4.5}>
                <Button fullWidth onClick={props.handleSave} variant={props.buttonVariant} color={props.buttonColor} endIcon={props.iconOne && props.iconOne}>{props.buttonText}</Button>
            </Grid>
            <Grid item xs={1}></Grid>
            </> 
            : 
            <>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
                <Button fullWidth onClick={props.handleSave} variant={props.buttonVariant} color={props.buttonColor} endIcon={props.iconOne && props.iconOne}>{props.buttonText}</Button>
            </Grid>
            <Grid item xs={3}></Grid>
            </>}
            
            </Grid>
            }
            
        </Modal>
    );

}


