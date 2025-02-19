import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import "./style.scss";
import "./App.css";
export function App() {
  const [searchParams] = useSearchParams();
  const [loggedIn, setLoggedIn] = useState(false);
  // State for form fields
  const [editableInfo, setEditableInfo] = useState({
    citizenshipNumber: "",
    fullName: "",
    sex: "",
    dob: { year: "", month: "", day: "" },
    birthPlace: { district: "" },
    permanentAddress: { district: "" },
    wardNumber: "",
  });

  async function getCitizenshipData(accessToken, userId) {
    const { data } = await axios.get(
      `http://localhost:3000/api/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  }

  async function getUser(accessToken) {
    return await axios.get("http://localhost:3000/api/self", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  function onClick() {
    // Redirect to Verify Now
    window.location.href = "http://localhost:3000/external-login?redirect=true";
  }
  async function init() {
    const accessToken = searchParams.get("accessToken");
    if (!accessToken) {
      return;
    }
    setLoggedIn(true);
    const { data } = await getUser(accessToken);

    if (!data) {
      return;
    }
    const { data: citizenshipData } = await getCitizenshipData(
      accessToken,
      data.data.id
    );
    const [year, month, day] = citizenshipData.dob.split("-");
    setEditableInfo((prevData) => ({
      ...prevData,
      citizenshipNumber: citizenshipData.certificateNumber,
      fullName: citizenshipData.fullName,
      sex: citizenshipData.gender,
      dob: { year, month, day },
      birthPlace: { district: citizenshipData.birthplace },
      permanentAddress: { district: citizenshipData.birthplace },
      wardNumber: citizenshipData.wardNumber,
    }));
  }

  useEffect(() => {
    init();
  }, []);

  // Handle change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditableInfo((prev) => {
      if (name in prev.dob) {
        return { ...prev, dob: { ...prev.dob, [name]: value } };
      }

      if (name in prev.birthPlace) {
        return { ...prev, birthPlace: { ...prev.birthPlace, district: value } };
      }

      if (name in prev.permanentAddress) {
        return {
          ...prev,
          permanentAddress: { ...prev.permanentAddress, district: value },
        };
      }

      return { ...prev, [name]: value };
    });
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        className="form-container"
        sx={{
          maxWidth: 600,
          margin: "auto",
        }}
      >
        <Grid item xs={12}>
          <Typography
            level="h2"
            className="form-title"
            sx={{ fontSize: "xl", mb: 0.5 }}
          >
            External Form
          </Typography>
          <p className="form-paragraph">
            Provide the required details accurately to proceed with your
            registration or login.
          </p>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Certificate No"
            variant="outlined"
            fullWidth
            name="citizenshipNumber"
            value={editableInfo.citizenshipNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            name="fullName"
            value={editableInfo.fullName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Gender</InputLabel>
            <Select
              name="sex"
              value={editableInfo.sex}
              onChange={handleChange}
              label="Gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Year of Birth"
            variant="outlined"
            fullWidth
            name="year"
            value={editableInfo.dob.year}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Month of Birth"
            variant="outlined"
            fullWidth
            name="month"
            value={editableInfo.dob.month}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Day of Birth"
            variant="outlined"
            fullWidth
            name="day"
            value={editableInfo.dob.day}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Birth Place"
            variant="outlined"
            fullWidth
            name="birthPlace"
            value={editableInfo.birthPlace.district}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Permanent Address"
            variant="outlined"
            fullWidth
            name="permanentAddress"
            value={editableInfo.permanentAddress.district}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Ward Number"
            variant="outlined"
            fullWidth
            name="wardNumber"
            value={editableInfo.wardNumber}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <hr
            style={{
              margin: "20px 0",
              border: "none",
              borderTop: "1px solid #ddd",
            }}
          />
          {!loggedIn && (
            <Button
              type="button"
              variant="contained"
              className="btn-primary"
              sx={{
                color: "#1113a2",
                boxShadow: "none",
                border: "1px solid #1113a2",
                background: "#fff",
              }}
              onClick={onClick}
            >
              Continue with Verify Now
            </Button>
          )}
          <hr
            style={{
              margin: "20px 0",
              border: "none",
              borderTop: "1px solid #ddd",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
