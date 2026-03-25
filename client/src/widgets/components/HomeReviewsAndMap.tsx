import { Box, Paper, useTheme, useMediaQuery } from "@mui/material";
import YandexReviews from "../../widgets/components/YandexReviews";

const HomeReviewsAndMap = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const desktopHeight = 800;
    const mobileReviewsHeight = 520;
    const mobileMapHeight = 320;

    return (
        <Box
            sx={{
                px: { xs: 2, md: 3 },
                pb: { xs: 3, md: 6 },
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: { xs: 2, md: 3 },
                alignItems: "stretch",
            }}
        >
            <YandexReviews height={isMobile ? mobileReviewsHeight : desktopHeight} />

            <Paper
                elevation={3}
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    height: isMobile ? mobileMapHeight : desktopHeight,
                }}
            >
                <Box
                    component="iframe"
                    src="https://yandex.ru/map-widget/v1/?z=12&ol=biz&oid=184882154278"
                    title="ArtWheels map"
                    loading="lazy"
                    sx={{
                        width: "100%",
                        height: "100%",
                        border: 0,
                        display: "block",
                    }}
                />
            </Paper>
        </Box>
    );
};

export default HomeReviewsAndMap;
