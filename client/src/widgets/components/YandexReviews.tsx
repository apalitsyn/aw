import { Box, useTheme } from "@mui/material";

const YandexReviews = ({ height = 800 }) => {
  const theme = useTheme();

  const bg = theme.palette.mode === "dark"
    ? theme.palette.background.paper
    : "#f5f5f5";

  const borderColor = theme.palette.mode === "dark" ? "#444" : "#e6e6e6";

  return (
    <Box
      sx={{
        width: "100%",
        height,
        backgroundColor: bg,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <iframe
        src="https://yandex.ru/maps-reviews-widget/184882154278?comments"
        style={{
          width: "100%",
          height: "100%",
          border: `1px solid ${borderColor}`,
          borderRadius: "8px",
          boxSizing: "border-box",
        }}
        loading="lazy"
        title="Yandex reviews"
      />

      <a
        href="https://yandex.ru/maps/org/artwheels/184882154278/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          boxSizing: "border-box",
          textDecoration: "none",
          color: theme.palette.text.secondary,
          fontSize: 10,
          fontFamily: "YS Text, sans-serif",
          position: "absolute",
          bottom: 8,
          left: 0,
          width: "100%",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          padding: "0 16px",
          maxHeight: 14,
        }}
      >
        ArtWheels на карте Москвы — Яндекс Карты
      </a>
    </Box>
  );
};

export default YandexReviews;
