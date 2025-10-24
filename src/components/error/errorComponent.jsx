import { Button } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router";

export default function ErrorComponent({ errorMessage, showHomeButton = false }) {
    const navigate = useNavigate();
    return (
        <div className="error-container">
            <h2 style={{ marginBottom: '12px', color: 'red' }}>{errorMessage}</h2>
            {!showHomeButton ? null
                : <Button
                    variant="contained"
                    color='background'
                    startIcon={<HomeIcon />}
                    onClick={() => navigate('/')}
                    sx={{ borderRadius: '18px' }}
                >
                    Voltar para a Lista
                </Button>
            }
        </div>
    );
}