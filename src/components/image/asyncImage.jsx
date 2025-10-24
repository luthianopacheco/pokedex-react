import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';

const URL_PLACEHOLDER = '../../assets/logos/pokédex.png';

export function AsyncImage({ src, alt, style }) {
    const [loading, setLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState(URL_PLACEHOLDER);

    useEffect(() => {
        if (!src) return;

        setLoading(true);

        const img = new Image();
        img.src = src;

        img.onload = () => {
            setImageSrc(src);
            setLoading(false);
        };

        img.onerror = () => {
            console.error(`Falha ao carregar imagem para: ${alt}. URL: ${src}`);
            setImageSrc(URL_PLACEHOLDER);
            setLoading(false);
        };

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, alt]);


    if (loading) {
        return (
            <div style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={24} />
            </div>
        );
    }

    return <img src={imageSrc} alt={alt} style={style} />;
}