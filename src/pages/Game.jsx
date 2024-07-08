import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { io } from "socket.io-client";

const Game = () => {
  const [socket, setSocket] = useState(null);
  const [affix, setAffix] = useState("");
  const [inputWord, setInputWord] = useState("");
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [players, setPlayers] = useState([]);
  const [isMyTurn, setIsMyTurn] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:3000"); // Replace with your server URL
    setSocket(newSocket);

    newSocket.on("gameState", (gameState) => {
      setAffix(gameState.currentAffix);
      setTimer(gameState.timeRemaining);
      setPlayers(gameState.players);
      setIsMyTurn(gameState.currentPlayer === newSocket.id);
    });

    newSocket.on("turnResult", (result) => {
      if (result.success) {
        setScore((prevScore) => prevScore + 1);
      } else {
        setLives((prevLives) => prevLives - 1);
      }
    });

    return () => newSocket.close();
  }, []);

  const handleSubmit = () => {
    if (socket && isMyTurn) {
      socket.emit("submitWord", inputWord);
      setInputWord("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Word Affix Challenge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">Current Affix: {affix}</div>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Type your word here"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              disabled={!isMyTurn}
            />
          </div>
          <Button onClick={handleSubmit} disabled={!isMyTurn}>
            Submit Word
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Game Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">Time Remaining: {timer} seconds</div>
          <Progress value={(timer / 30) * 100} className="mb-4" />
          <div>Your Score: {score}</div>
          <div>Lives Remaining: {lives}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Players</CardTitle>
        </CardHeader>
        <CardContent>
          {players.map((player, index) => (
            <div key={index} className="mb-2">
              {player.name}: {player.score} points
              {player.id === socket?.id && " (You)"}
              {isMyTurn && player.id === socket?.id && " - Your Turn!"}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Game;