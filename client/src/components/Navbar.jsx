import React, { useContext, useState } from "react";
import {
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Card,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { Link } from "react-router-dom";
import { Context } from "../Context/Context";

const Navbar = () => {
  const { user } = useContext(Context);
  const [value, setValue] = useState(0);

  return (
    <Box sx={{ pb: 5, width: "100%" }}>
      <Card
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 100,
          position: "fixed",
          bottom: { xs: "0", md: "10px" },
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "100%", md: "90%" },
          maxWidth: "500px",
          borderRadius: { xs: "0", md: "30px 30px 30px 30px" },
          opacity: 0.9,
          backdropFilter: "blur(30px)",
        }}
        elevation={20}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            component={Link}
            to="/all/posts"
            label="Home"
            icon={<HomeIcon />}
          />

          <BottomNavigationAction
            component={Link}
            to="/my/posts"
            label="My Posts"
            icon={<FormatListBulletedIcon />}
          />
          <BottomNavigationAction
            component={Link}
            to="/post/search"
            label="Search"
            icon={<ManageSearchIcon />}
          />

          <BottomNavigationAction
            component={Link}
            to="/chat"
            label="Chat"
            icon={<ChatIcon />}
          />
          <BottomNavigationAction
            component={Link}
            to="/profile"
            label="Profile"
            icon={
              <Avatar variant="circular" sizes="sm" src={user?.profilepic} />
            }
          />
        </BottomNavigation>
      </Card>
    </Box>
  );
};

export default Navbar;
