import {Box, Typography} from "@mui/material";
import LoadingBox from "./LoadingBox";

export default function Loading() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                minHeight: '500px',
            }}
        >
            <LoadingBox value="1">
                <Typography
                    variant="h3"
                    component="h3"
                    sx={{
                        fontSize: {xs: '10px', sm: '12px'},
                        color: 'rgba(255, 255, 255, .8)',
                        lineHeight: 1,
                        fontFamily: 'Poppins',
                    }}
                >
                    Loading...
                </Typography>
            </LoadingBox>
        </Box>
    )
}