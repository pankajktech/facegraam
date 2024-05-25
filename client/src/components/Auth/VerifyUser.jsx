import React, { useState, useEffect } from "react";
import { TextField, Box, Button, Container, Typography, CircularProgress } from "@mui/material";
import { toast } from "sonner";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const errMess = {
  message: "OTP Is required",
};

const validationSchema = yup.object().shape({
  otp: yup.string().min(6).max(6).required(errMess.message),
});

const VerifyUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const location = useLocation();
  const email = location?.state?.email;

  console.log(email);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const sendOTP = async () => {
    if (resendTimer > 0) return;

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/sendotp/user`,
      {
        email: email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      toast.success("OTP Sent Successfully");
      setResendTimer(60);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleFormSubmit = async (data) => {
    const { otp } = data;
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/verify/user`,
        { email, otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        navigate("/login");
        toast.success("OTP verified successfully.");
      }
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  const handleError = (error) => {
    let errorMessage = "An error occurred. Please try again.";
    if (error.response && error.response.status === 400) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  };

  return (
    <Container
      sx={{
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
      maxWidth="xs"
    >
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: "#333" }}
        >
          OTP Verification
        </Typography>
        <Typography
          variant="body1"
          align="center"
          paragraph
          sx={{ color: "#666", fontWeight: 500 }}
        >
          An OTP has been sent to your email. Please enter it below:
        </Typography>

        <form
          name="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          style={{ width: "100%" }}
        >
          <TextField
            id="otp"
            label="Enter OTP"
            error={!!errors.otp}
            helperText={errors.otp?.message}
            {...register("otp")}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{ marginBottom: "16px" }}
          />

          <div className="d-flex gap-3 mt-3" style={{ display: 'flex', justifyContent: 'space-between' }}>
            {!loading ? (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={sendOTP}
                  disabled={resendTimer > 0}
                  sx={{
                    backgroundColor: resendTimer > 0 ? "#888" : "#333",
                    color: "#fff",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: resendTimer > 0 ? "#888" : "#555",
                    },
                  }}
                >
                  {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : "Resend OTP"}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    backgroundColor: "#333",
                    color: "#fff",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#555",
                    },
                  }}
                >
                  Verify OTP
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                disabled
                startIcon={<CircularProgress size={24} />}
                sx={{
                  backgroundColor: "#888",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Verifying OTP...
              </Button>
            )}
          </div>
        </form>
      </Box>
    </Container>
  );
};

export default VerifyUser;
