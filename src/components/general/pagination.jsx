import { Pagination as MUIPagination, Stack } from '@mui/material';

function Pagination({ totalPages, currentPage, onPageChange }) {
    if (totalPages <= 1) {
        return null;
    }

    const handleChange = (event, page) => {
        onPageChange(page);
    };

    return (
        <Stack sx={{ margin: '20px 0', alignItems: 'center' }}>
            <MUIPagination
                count={totalPages}
                page={currentPage}
                onChange={handleChange}
                color="primary"
            />
        </Stack>
    );
}

export default Pagination;