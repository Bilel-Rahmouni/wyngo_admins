import { useState, useEffect } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  Typography,
  useTheme,
  MenuItem,
  Fade,
  Menu,
  Button,
} from "@mui/material";
import { tokens } from "../../theme";
import FullCalendar from "@fullcalendar/react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState();
  const [selectedMovieTitle, setSelectedMovieTitle] = useState();
  const [selectedMovieSubtitles, setSelectedMovieSubtitles] = useState();
  const [selectedMovieFormat, setSelectedMovieFormat] = useState();
  const [selectedStartStr, setSelectedStartStr] = useState();
  const [selectedEndStr, setSelectedEndStr] = useState();
  const [selectedDay, setSelectedDay] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [selectedAllDay, setSelectedAllDay] = useState(false);
  const startdateObject = new Date(selectedStartStr);
  const enddateObject = new Date(selectedEndStr);
  var starthours = startdateObject?.getHours().toString().padStart(2, "0");
  var startminutes = startdateObject?.getMinutes().toString().padStart(2, "0");
  var endhours = enddateObject?.getHours().toString().padStart(2, "0");
  var endminutes = enddateObject?.getMinutes().toString().padStart(2, "0");
  var selectedStartTime = `${starthours}:${startminutes}`;
  var selectedEndTime = `${endhours}:${endminutes}`;

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const handlesetSnackBarClick = () => {
    selectedStartTime = null;
    selectedEndTime = null;
    setSnackBarOpen(true);
    setSelectedMovieId();
    setSelectedMovieFormat();
    setSelectedMovieSubtitles();
    setSelectedDay();
    setSelectedDate();
  };

  const handlesetSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };
  ///// fetch movies
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const fetchMoviesFromWyngoDb = async () => {
      try {
        const res = await axios.get(
          "https://wynbackend-production.up.railway.app/api/v1/movies/"
        );
        setMovies(res?.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMoviesFromWyngoDb();
    return () => {
      setMovies([]);
    };
  }, []);
  const format = ["2D", "3D"];
  const Subtitles = ["VO", "VOSTFR", "VF"];
  ///// fetch movies
  /////////date click
  const handleDateClick = (selected) => {
    //const title = prompt("Please enter a new title for your event", "hi");
    const calendarApi = selected.view.calendar;
    // calendarApi.unselect();

    // if (title) {
    selectedMovieId
      ? calendarApi.addEvent({
          // id: `${selected.dateStr}-${selectedMovieId}`,
          //  title,
          movieId: selectedMovieId,
          start: selected.startStr,
          end: selected.endStr,
          day: new Date(selected.startStr).getDay(),
          allDay: selected.allDay,
        })
      : alert("pick a movie");
    setSelectedStartStr(selected.startStr);
    setSelectedEndStr(selected.endStr);
    setSelectedAllDay(selected.allDay);
    setSelectedDay(new Date(selected.startStr).getDay().toString());
    setSelectedDate(new Date(selected.startStr).getDate());
    // }
  };
  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      selected.event.remove();
    }
  };
  /////////date click
  /////////drop menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open2 = Boolean(anchorEl2);
  const [anchorEl3, setAnchorEl3] = useState(null);
  const open3 = Boolean(anchorEl3);
  const [anchorEl4, setAnchorEl4] = useState(null);
  const open4 = Boolean(anchorEl4);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };
  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };
  const handleMenuClose = (movie) => {
    setAnchorEl(null);
    setSelectedMovieId(movie?.movieId);
    setSelectedMovieTitle(movie?.title);
  };
  const handleMenuClose2 = (format) => {
    setAnchorEl2(null);
    setSelectedMovieFormat(format);
  };
  const handleMenuClose3 = (subtitle) => {
    setAnchorEl3(null);
    setSelectedMovieSubtitles(subtitle);
  };
  const handleMenuClose4 = (cinema) => {
    setAnchorEl4(null);
    setCinemaId(cinema);
  };
  /////////drop menu
  /////////Submit button
  const handleSubmitMovieDetails = async () => {
    selectedMovieId &&
    selectedMovieFormat &&
    selectedMovieSubtitles &&
    selectedStartTime &&
    selectedEndTime &&
    selectedDate
      ? await axios
          .post(
            `https://wynbackend-production.up.railway.app/api/v1/listings/${cinemaId}/program/`,
            {
              selectedMovieId,
              selectedMovieFormat,
              selectedMovieSubtitles,
              selectedStartTime,
              selectedEndTime,
              selectedDay,
              selectedDate,
            }
          )
          .then(handlesetSnackBarClick)
      : alert("pick a time");
    console.log(
      selectedMovieId,
      selectedMovieFormat,
      selectedMovieSubtitles,
      selectedStartTime,
      selectedEndTime,
      selectedDay,
      selectedDate
    );
  };
  /////////Submit button
  return (
    <Box flexDirection="row">
      <Box
        sx={{ display: "flex", width: "100%" }}
        flexDirection="row"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          sx={{
            color: colors.grey[100],
            borderRadius: 5,
            padding: 5,
          }}
          width="40vw"
          justifyContent="center"
          alignItems="center"
        >
          <Box flexDirection="column">
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
            {/* ////////////movie menu////////////// */}
            <Button
              id="fade-button"
              style={{
                backgroundColor: "dodgerblue",
                width: 180,
                margin: 5,
                height: 50,
              }}
              aria-controls={open ? "fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              variant="contained"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={handleClick}
            >
              <Typography variant="h2">Movies</Typography>
            </Button>
            <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              TransitionComponent={Fade}
            >
              {movies?.map((movie) => (
                <MenuItem
                  key={movie.id}
                  style={{ width: 200 }}
                  onClick={() => handleMenuClose(movie)}
                >
                  <Typography variant="h3">{movie.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
            {/* ////////////movie menu////////////// */}
            {/* ////////////format menu////////////// */}
            <Button
              id="fade-button"
              style={{
                backgroundColor: "dodgerblue",
                width: 180,
                margin: 5,
                height: 50,
              }}
              aria-controls={open2 ? "fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open2 ? "true" : undefined}
              variant="contained"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={handleClick2}
            >
              <Typography variant="h2">Format</Typography>
            </Button>
            <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              anchorEl={anchorEl2}
              open={open2}
              onClose={() => setAnchorEl2(null)}
              TransitionComponent={Fade}
            >
              {format?.map((format) => (
                <MenuItem
                  key={format}
                  style={{ width: 200 }}
                  onClick={() => handleMenuClose2(format)}
                >
                  <Typography variant="h5">{format}</Typography>
                </MenuItem>
              ))}
            </Menu>
            {/* ////////////format menu////////////// */}
            {/* ////////////Subtitles menu////////////// */}
            <Button
              id="fade-button"
              style={{
                backgroundColor: "dodgerblue",
                width: 180,
                margin: 5,
                height: 50,
              }}
              aria-controls={open3 ? "fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open3 ? "true" : undefined}
              variant="contained"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={handleClick3}
            >
              <Typography variant="h2">Subtitles</Typography>
            </Button>
            <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              open={open3}
              anchorEl={anchorEl3}
              onClose={() => setAnchorEl3(null)}
              TransitionComponent={Fade}
            >
              {Subtitles?.map((Subtitle) => (
                <MenuItem
                  key={Subtitle}
                  style={{ width: 200 }}
                  onClick={() => handleMenuClose3(Subtitle)}
                >
                  <Typography variant="h5">{Subtitle}</Typography>
                </MenuItem>
              ))}
            </Menu>
            {/* ////////////Subtitles menu////////////// */}
          </Box>
          <Box flexDirection="column" justifyContent="space-between">
            <Box height={50}>
              <Typography variant="h2">{selectedMovieTitle}</Typography>
            </Box>
            <Box height={50}>
              <Typography variant="h2">{selectedMovieFormat}</Typography>
            </Box>
            <Box height={50}>
              <Typography variant="h2">{selectedMovieSubtitles}</Typography>
            </Box>
            <Box height={50}>
              {selectedStartStr ? (
                <Typography variant="h2">{selectedStartTime}</Typography>
              ) : undefined}
            </Box>
            <Box height={50}>
              {selectedEndStr ? (
                <Typography variant="h2">{selectedEndTime}</Typography>
              ) : undefined}
            </Box>
          </Box>
          {/* CALENDAR SIDEBAR */}
          <Box
            alignSelf="center"
            width={"100%"}
            maxHeight={300}
            sx={{
              backgroundColor: colors.primary[400],
            }}
            p="10px"
            justifyContent={"space-between"}
            borderRadius="4px"
          >
            <Typography variant="h5">Movies</Typography>
            <Box
              sx={{
                backgroundColor: colors.greenAccent[800],
                margin: "10px 0",
                borderRadius: "2px",
                maxHeight: 300,
              }}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="h3">{selectedMovieTitle}</Typography>
              <Typography variant="h3">{selectedMovieFormat}</Typography>
              <Typography variant="h3">{selectedMovieSubtitles}</Typography>
              {selectedStartStr ? (
                <Typography variant="h2">{selectedStartTime}</Typography>
              ) : undefined}
              {selectedEndStr ? (
                <Typography variant="h2">{selectedEndTime}</Typography>
              ) : undefined}
            </Box>
            <Box>
              <Button
                style={{
                  backgroundColor: "dodgerblue",
                  width: 300,
                  margin: 10,
                }}
                variant="contained"
                onClick={() => {
                  handleSubmitMovieDetails();
                  //  console.log(typeof selectedStartStr);
                }}
              >
                <Typography variant="h2">Submit</Typography>
              </Button>
            </Box>
          </Box>
        </Box>

        {/* CALENDAR */}
        <Box
          sx={{
            color: colors.grey[100],
            borderRadius: 5,
            padding: 5,
          }}
          width="45vw"
        >
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="timeGridDay"
            editable={true}
            slotDuration={"00:15:00"} //how much time i can select min
            selectable={true}
            selectMirror={true}
            dayMaxEvents={15} //how many events i can put in same time
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={[]}
          />
        </Box>
      </Box>
      <Snackbar
        open={snackBarOpen}
        color="red"
        backgroundColor={"red"}
        autoHideDuration={6000}
        onClose={handlesetSnackBarClose}
        message="movie added with success"
      />
    </Box>
  );
};

export default Calendar;
