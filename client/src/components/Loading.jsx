import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        marginTop: 2,
        margin: "auto",
        width: "400px",
      }}
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            width: "400px",
            bgcolor: "background.paper",
            filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
            p: 2,
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton
              height={40}
              sx={{
                ml: 2,
                width: "90%",
              }}
            />
          </Box>

          <Box>
            <Skeleton sx={{ height: 200 }} variant="rectangular" />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Loading;
