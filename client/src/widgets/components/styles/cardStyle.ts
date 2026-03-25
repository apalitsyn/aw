export const cardSx = (theme: any) => ({
    height: '100%',
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    boxShadow:
        theme.palette.mode === 'dark'
            ? '0 6px 20px rgba(255,255,255,0.08)'
            : '0 6px 20px rgba(0,0,0,0.12)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow:
            theme.palette.mode === 'dark'
                ? '0 10px 28px rgba(255,255,255,0.12)'
                : '0 12px 30px rgba(0,0,0,0.18)',
    },
});
