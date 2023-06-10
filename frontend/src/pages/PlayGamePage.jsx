import { useParams } from 'react-router-dom';
import { fetchAPIRequest } from '../helpers';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';

const PlayGamePage = () => {
  const { sessionId } = useParams();
  const [teamName, setTeamName] = useState('');
  const [bid, setBid] = useState('');
  const [ask, setAsk] = useState('');
  const [teamId, setTeamId] = useState('');

  const createTeam = async () => {
    const teamData = await fetchAPIRequest(`/game/join/${sessionId}`, 'POST', {
      name: teamName,
    });
    console.log(teamData);
    setTeamId(teamData.teamId);
  };
  const submitSpread = async () => {
    const teamData = await fetchAPIRequest(`/game/${teamId}/submit`, 'PUT', {
      bid,
      ask,
    });
  };
  const advanceGame = async () => {
    await fetchAPIRequest(`/games/641196079/next`, 'POST');
  };

  return (
    <div>
      <TextField onChange={(event) => setTeamName(event.target.value)} />
      <Button onClick={createTeam}>Create Team</Button>
      <TextField label="bid" onChange={(event) => setBid(event.target.value)} />
      <TextField label="ask" onChange={(event) => setAsk(event.target.value)} />
      <Button onClick={submitSpread}>Submit Bid Ask Spread</Button>
      <Button onClick={advanceGame}>Advance</Button>
    </div>
  );
};
export default PlayGamePage;
