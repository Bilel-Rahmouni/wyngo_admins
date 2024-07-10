import {
  Typography,
  useTheme,
  Box,
  MenuItem,
  Fade,
  Menu,
  Button,
} from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";
import MovieDbApi from "../../common/MovieDbApi";
import { MovieDbApiKey } from "../../common/MovieDbApi";
import { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cinema, setCinema] = useState();
  const [moviesFromWyngoDb, setMoviesFromWyngoDb] = useState();
  const [moviesFromTmdb, setMoviesFromTmdb] = useState();
  const [movieIds, setMovieIds] = useState([]);
  const [cinemaId, setCinemaId] = useState("6501e022c68f6ef6da263c1c");
  const [cinemasIds, setCinemasIds] = useState([
    "6501e022c68f6ef6da263c1a",
    "6501e022c68f6ef6da263c1c",
    "6501e022c68f6ef6da263c1d",
    "6501e022c68f6ef6da263c1e",
    "6501e022c68f6ef6da263c1f",
    "6501e022c68f6ef6da263c20",
    "6501e022c68f6ef6da263c21",
  ]);
  const [anchorEl4, setAnchorEl4] = useState(null);
  const daysFr = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
  useEffect(() => {
    const fetchCinemasFromWyngoDB = async () => {
      try {
        const res = await axios.get(
          `https://wynbackend-production.up.railway.app/api/v1/listings/${cinemaId}`
        );
        setCinema(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchMoviesFromWyngoDB = async () => {
      try {
        const res = await axios.get(
          `https://wynbackend-production.up.railway.app/api/v1/movies`
        );
        setMoviesFromWyngoDb(res.data);
        const newMovieIds = res?.data?.map((movie) => movie.movieId);
        setMovieIds(newMovieIds);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCinemasFromWyngoDB();
    fetchMoviesFromWyngoDB().then(
      moviesFromWyngoDb?.map((movie) => movieIds.push(movie.movieId))
    );
    return () => {
      setCinema([]);
      setMoviesFromWyngoDb([]);
    };
  }, [cinemaId]);
  useEffect(() => {
    const fetchedMovies = [];
    const movieTitle = [];
    const moviePosterPath = [];
    const movieGenres = [];
    const fetchMovieData = async (movieId) => {
      try {
        const response = await axios.get(`${MovieDbApi}/movie/${movieId}`, {
          params: {
            api_key: MovieDbApiKey,
            language: "fr-FR",
          },
        });
        fetchedMovies.push(response.data);
        movieTitle.push(response.data.original_title);
        moviePosterPath.push(response.data.poster_path);
        movieGenres.push(response.data.genres);
      } catch (error) {
        console.log("Error fetching movie data:", error);
      }
    };
    const fetchDataForMovies = async () => {
      for (const movieId of movieIds) {
        await fetchMovieData(movieId);
      }
      setMoviesFromTmdb(fetchedMovies);
    };
    fetchDataForMovies();
  }, [movieIds]);

  if (!Array.isArray(cinema?.program)) {
    // Handle the case where 'program' is not an array (null or undefined)
    return <Typography>No program data available.</Typography>;
  }
  // Step 1: Sort the array based on selectedDate and selectedStartTime
  const sortedProgram = cinema?.program?.sort((a, b) => {
    if (a?.selectedDate !== b?.selectedDate) {
      return a?.selectedDate - b?.selectedDate;
    }
    return a?.selectedStartTime.localeCompare(b?.selectedStartTime);
  });
  // Step 2: Group the array by selectedDate
  const groupedByDate = sortedProgram?.reduce((result, item) => {
    const day = item?.selectedDate;
    if (!result[day]) {
      result[day] = [];
    }
    result[day]?.push(item);
    return result;
  }, {});

  const open4 = Boolean(anchorEl4);
  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };
  const handleMenuClose4 = (cinema) => {
    setAnchorEl4(null);
    setCinemaId(cinema);
  };
  return (
    <Box m="20px">
      {/* ////////////cinema menu////////////// */}
      <Button
        id="fade-button"
        style={{
          backgroundColor: "dodgerblue",
          width: 180,
          margin: 5,
          height: 50,
        }}
        aria-controls={open4 ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open4 ? "true" : undefined}
        variant="contained"
        endIcon={<KeyboardArrowDownIcon />}
        onClick={handleClick4}
      >
        <Typography variant="h2">Cinema</Typography>
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl4}
        open={open4}
        onClose={() => setAnchorEl4(null)}
        TransitionComponent={Fade}
      >
        {cinemasIds?.map((cinema) => (
          <MenuItem
            key={cinema}
            style={{ width: 400 }}
            onClick={() => handleMenuClose4(cinema)}
          >
            <Typography variant="h3">{cinema}</Typography>
          </MenuItem>
        ))}
      </Menu>
      {/* ////////////cinema menu////////////// */}
      {/* HEADER */}
      {/* <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box>
          <Button
            sx={{
              background: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "12px",
              fontWeight: "bold",
              padding: "5px 10px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box> */}
      <Box justifyContent="center" width={"80vw"} height={"300px"}>
        {Object?.entries(groupedByDate)?.map(([day, moviesForDay]) => (
          <Box margin={5} key={day} display={"flex"} flexDirection={"row"}>
            <Typography
              variant="h4"
              style={{
                marginRight: 10,
                alignSelf: "center",
              }}
            >
              {daysFr[moviesForDay[0].selectedDay]}
            </Typography>
            <Typography
              variant="h4"
              style={{
                marginRight: 50,
                alignSelf: "center",
              }}
            >
              {day}
            </Typography>
            <Box
              display={"flex"}
              flexDirection={"row"}
              sx={{
                scrollBehavior: "smooth",
                overflowX: "scroll",
                scrollbarWidth: "thin",
                whiteSpace: "nowrap",
              }}
            >
              {moviesForDay?.map((movie, index) => (
                <Box
                  m={1}
                  sx={{ cursor: "pointer" }}
                  width={"80px"}
                  key={index}
                >
                  <Typography
                    noWrap={true}
                    variant="h6"
                    style={{
                      alignSelf: "center",
                    }}
                  >
                    {
                      moviesFromTmdb?.find(
                        (myMovie) => myMovie?.id == movie?.selectedMovieId
                      )?.original_title
                    }
                  </Typography>
                  <img
                    src={`https://image.tmdb.org/t/p/original/${
                      moviesFromTmdb?.find(
                        (myMovie) => myMovie?.id == movie?.selectedMovieId
                      )?.poster_path
                    }`}
                    style={{
                      width: "100%",
                      height: "120px",
                    }}
                  />
                  <Typography variant="h6">{`${movie.selectedMovieFormat}-${movie.selectedMovieSubtitles}`}</Typography>
                  <Typography variant="h6">{`${movie.selectedStartTime}-${movie.selectedEndTime}`}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="10px"
      >
        {/* ROW 1 */}
        {/* <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="12,361"
            subtitle="Emails Sent"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="431,225"
            subtitle="Sales Obtained"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="32,441"
            subtitle="New Clients"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1,325,134"
            subtitle="Traffic Received"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box> */}

        {/* ROW 2 */}
        {/* <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box> */}

        {/* ROW 3 */}
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;
