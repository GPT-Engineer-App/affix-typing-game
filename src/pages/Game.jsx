import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const [currentTypingPlayer, setCurrentTypingPlayer] = useState(null);
  const [opponentTyping, setOpponentTyping] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:3000"); // Replace with your server URL
    setSocket(newSocket);

    newSocket.on("gameState", (gameState) => {
      setAffix(gameState.currentAffix);
      setTimer(gameState.timeRemaining);
      setPlayers(gameState.players);
      setIsMyTurn(gameState.currentPlayer === newSocket.id);
      setCurrentTypingPlayer(gameState.currentPlayer);
    });

    newSocket.on("turnResult", (result) => {
      if (result.success) {
        setScore((prevScore) => prevScore + 1);
      } else {
        setLives((prevLives) => prevLives - 1);
      }
    });

    newSocket.on("opponentTyping", (data) => {
      if (data.playerId !== newSocket.id) {
        setOpponentTyping(data.input);
      }
    });

    return () => newSocket.close();
  }, []);

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setInputWord(newInput);
    if (socket && isMyTurn) {
      socket.emit("playerTyping", { input: newInput });
    }
  };

  const handleSubmit = () => {
    if (socket && isMyTurn) {
      socket.emit("submitWord", inputWord);
      setInputWord("");
      setOpponentTyping("");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-8 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardTitle className="text-3xl font-bold">Word Affix Challenge</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-3xl font-bold mb-6 text-center text-purple-700">Current Affix: {affix}</div>
          <div className="mb-6">
            <Input
              type="text"
              placeholder={isMyTurn ? "Type your word here" : "Waiting for opponent..."}
              value={isMyTurn ? inputWord : opponentTyping}
              onChange={handleInputChange}
              disabled={!isMyTurn}
              className="text-lg"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={!isMyTurn}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Submit Word
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">Game Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-500 mb-1">Time Remaining</div>
              <div className="flex items-center">
                <Progress value={(timer / 30) * 100} className="flex-grow mr-2" />
                <span className="text-lg font-bold">{timer}s</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Your Score</div>
                <div className="text-2xl font-bold text-purple-600">{score}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Lives</div>
                <div className="flex">
                  {[...Array(lives)].map((_, i) => (
                    <span key={i} className="text-red-500 text-2xl mr-1">❤️</span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {players.map((player, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${player.name}`} />
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-gray-500">{player.score} points</div>
                    </div>
                  </div>
                  {player.id === socket?.id && (
                    <Badge variant="secondary">You</Badge>
                  )}
                  {player.id === currentTypingPlayer && (
                    <Badge variant="outline" className="animate-pulse">Typing</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Game;