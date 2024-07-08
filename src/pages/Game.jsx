import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white overflow-hidden">
          <CardHeader className="text-center relative">
            <CardTitle className="text-4xl font-bold">Word Affix Challenge</CardTitle>
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-white opacity-10"
              animate={{
                background: [
                  "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
                  "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)",
                  "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </CardHeader>
          <CardContent className="p-6 relative">
            <motion.div
              className="text-5xl font-bold mb-6 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
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
              <AnimatePresence>
                {isMyTurn && (
                  <motion.div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      🎮
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleSubmit} 
                disabled={!isMyTurn}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-purple-900 font-bold py-3 rounded-full text-lg transform transition"
              >
                Submit Word
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-md bg-gradient-to-br from-blue-500 to-cyan-400 text-white overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Game Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-sm font-medium mb-1">Time Remaining</div>
                <div className="flex items-center">
                  <Progress value={(timer / 30) * 100} className="flex-grow mr-2 h-4 bg-blue-200" />
                  <motion.span
                    key={timer}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl font-bold"
                  >
                    {timer}s
                  </motion.span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm font-medium">Your Score</div>
                  <motion.div
                    key={score}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl font-bold"
                  >
                    {score}
                  </motion.div>
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="shadow-md bg-gradient-to-br from-green-500 to-teal-400 text-white overflow-hidden">
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
                    whileHover={{ scale: 1.05 }}
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
        </motion.div>
      </div>
    </div>
  );
};

export default Game;