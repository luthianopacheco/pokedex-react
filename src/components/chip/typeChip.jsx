import { capitalize, Chip, Stack } from "@mui/material";
import { getContrastColor, getTypeColorWithOpacity } from "../../utils/colorUtils";

const CHIP_STYLE = (name) => {
    return {
        color: getContrastColor(name),
        backgroundColor: getTypeColorWithOpacity({ type: name }),
        padding: '0 15px',
        maxHeight: '25px',
        fontWeight: 500,
        letterSpacing: 1,
        boxShadow: '2px 3px 5px 2px rgba(0,0,0,0.1)'
    }
}

export default function TypeChip({ types, spacing = 1 }) {
    return <Stack direction="row" spacing={spacing} sx={{ justifyContent: 'center' }}>
        {types?.map(t => (
            <Chip
                key={t.type.name}
                label={capitalize(t.type.name)}
                sx={CHIP_STYLE(t.type.name)}
            />
        ))}
    </Stack>
};