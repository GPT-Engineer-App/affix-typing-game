import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-purple-500 via-pink-600 to-red-600 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-2xl px-6 py-12 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl"
      >
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            background: [
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
              "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)",
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <div className="relative z-10">
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-600"
          >
            Word Affix Challenge
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl mb-8 text-white"
          >
            Test your vocabulary skills in this exciting multiplayer word game!
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild className="text-2xl px-10 py-8 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-purple-900 font-bold rounded-full shadow-lg relative overflow-hidden group">
              <Link to="/game">
                <span className="relative z-10">Start Playing</span>
                <motion.div
                  className="absolute inset-0 bg-white opacity-25"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.5, opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-900 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      />
    </div>
  );
};

export default Index;