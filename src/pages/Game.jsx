import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

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
      <Card className="mb-8 shadow-lg bg-gradient-to-br from-purple-400 to-pink-500 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">Word Affix Challenge</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <motion.div
            className="text-5xl font-bold mb-6 text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Current Affix: {affix}
          </motion.div>
          <div className="mb-6 relative">
            <Input
              type="text"
              placeholder={isMyTurn ? "Type your word here" : "Waiting for opponent..."}
              value={isMyTurn ? inputWord : opponentTyping}
              onChange={handleInputChange}
              disabled={!isMyTurn}
              className="text-lg bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white placeholder-white/70 rounded-full px-6 py-4"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {isMyTurn && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  🎮
                </motion.div>
              )}
            </div>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={!isMyTurn}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-3 rounded-full text-lg transform transition hover:scale-105"
          >
            Submit Word
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-md bg-gradient-to-br from-blue-400 to-cyan-300 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Game Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Time Remaining</div>
              <div className="flex items-center">
                <Progress value={(timer / 30) * 100} className="flex-grow mr-2 h-4 bg-blue-200" />
                <span className="text-2xl font-bold">{timer}s</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm font-medium">Your Score</div>
                <div className="text-3xl font-bold">{score}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Lives</div>
                <div className="flex">
                  {[...Array(lives)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="text-3xl mr-1"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    >
                      ❤️
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-gradient-to-br from-green-400 to-teal-300 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {players.map((player, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg p-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-3 border-2 border-white">
                      <AvatarImage src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${player.name}`} />
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-lg">{player.name}</div>
                      <div className="text-sm">{player.score} points</div>
                    </div>
                  </div>
                  {player.id === socket?.id && (
                    <Badge variant="secondary" className="bg-yellow-300 text-purple-900">You</Badge>
                  )}
                  {player.id === currentTypingPlayer && (
                    <Badge variant="outline" className="animate-pulse border-white text-white">Typing</Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Game;