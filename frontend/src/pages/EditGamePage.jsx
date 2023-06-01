import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAPIRequest } from "../helpers";
import { ImageUploadBtn } from "../components/index.js";

import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import DoneIcon from "@mui/icons-material/Done";

const EditGamePage = () => {
  const { gameId } = useParams();
  const [oldGameName, setOldGameName] = useState("");
  const [gameName, setGameName] = useState("");
  const [oldGameDesc, setOldGameDesc] = useState("");
  const [gameDesc, setGameDesc] = useState("");
  const [gameRounds, setGameRounds] = useState([]);
  const [gameMedia, setGameMedia] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      const gameData = await fetchAPIRequest(`/games/${gameId}`, "GET");
      setOldGameName(gameData.name);
      setGameName(gameData.name);
      setOldGameDesc(gameData.desc);
      setGameDesc(gameData.desc);
      setGameRounds(gameData.markets);
    };
    fetchGame();
  }, [gameId]);

  const saveChanges = async () => {
    await fetchAPIRequest(`/games/${gameId}`, "PUT", {
      markets: gameRounds,
      name: gameName,
      desc: gameDesc,
      media: gameMedia,
    });
  };

  const renderMarketRounds = (markets) => {
    return (
      <Box>
        {markets.map((market, marketIndex) => {
          return (
            <Box
              key={"market" + marketIndex}
              sx={{
                px: 2,
                pt: 3,
                pb: 2,
                mb: 3,
                border: "1px solid lightgray",
                borderRadius: 3,
              }}
            >
              <TextField
                key={"marketNameTextbox" + marketIndex}
                label="Market Name"
                fullWidth
                defaultValue={market.name}
                placeholder={market.name}
                onChange={(event) => {
                  markets[marketIndex].name = event.target.value;
                  setGameRounds([...markets]);
                  setIsSaved(false);
                }}
              />
              {market.rounds.map((round, index) => {
                return (
                  <Box key={"roundBox" + index} sx={{ py: 2, pl: 4 }}>
                    <Typography key={"roundNum" + index}>
                      Round {index + 1}
                    </Typography>
                    <Box
                      key={"roundDesc" + index}
                      sx={{ display: "flex", pt: 1 }}
                    >
                      <TextField
                        key={"roundDescTextbox" + index}
                        label="Description"
                        fullWidth
                        defaultValue={round.optionalDesc}
                        placeholder={round.optionalDesc}
                        onChange={(event) => {
                          markets[marketIndex].rounds[index].optionalDesc =
                            event.target.value;
                          setGameRounds([...markets]);
                          setIsSaved(false);
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
              <Button
                key={"marketAddRound" + marketIndex}
                startIcon={<AddIcon />}
                sx={{ ml: 4 }}
                onClick={() => {
                  markets[marketIndex].rounds.push({ optionalDesc: "" });
                  setGameRounds([...markets]);
                  setIsSaved(false);
                }}
              >
                New Round
              </Button>
            </Box>
          );
        })}
        <Button
          startIcon={<ShowChartIcon />}
          // sx={{}}
          onClick={() => {
            markets.push({
              name: "",
              rounds: [],
            });
            setGameRounds([...markets]);
          }}
        >
          New Market
        </Button>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "92.5vh",
        height: "fit-content",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        pt: 10,
        px: { xs: 1, sm: 10, md: 18, lg: 25 },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          flexGrow: 1,
          borderRadius: "20px 20px 0px 0px",
          boxShadow: 3,
          px: { xs: 2, sm: 5 },
          py: 7,
        }}
      >
        <Typography variant="h4">
          <EditIcon sx={{ mr: 2 }} />
          Edit Game
        </Typography>
        <Box sx={{ pt: 3, px: { md: 5 } }}>
          <TextField
            label="Name"
            variant="standard"
            value={gameName}
            onChange={(event) => {
              setIsSaved(false);
              setGameName(event.target.value);
            }}
            placeholder={oldGameName}
            autoFocus
            fullWidth
            sx={{ pb: 5 }}
          />
          <TextField
            label="Description"
            variant="standard"
            value={gameDesc}
            onChange={(event) => {
              setIsSaved(false);
              setGameDesc(event.target.value);
            }}
            placeholder={oldGameDesc}
            autoFocus
            fullWidth
            multiline
            sx={{ pb: 5 }}
          />
          <Typography variant="h5" sx={{ pb: 2 }}>
            Upload Thumbnail
          </Typography>
          <ImageUploadBtn
            callback={(imgUrl) => {
              setGameMedia(imgUrl);
              setIsSaved(false);
            }}
          />
          <Divider sx={{ my: 4 }} />
          <Typography variant="h5" sx={{ pb: 2 }}>
            Markets
          </Typography>
          {renderMarketRounds(gameRounds)}
          {/* <Button></Button> */}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            size="large"
            type="submit"
            color={isSaved ? "success" : "primary"}
            variant="contained"
            startIcon={isSaved ? <DoneIcon /> : <SaveIcon />}
            sx={{ mt: 3 }}
            onClick={() => {
              saveChanges();
              setIsSaved(true);
            }}
          >
            {isSaved ? "Saved" : "Save My Changes"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default EditGamePage;
