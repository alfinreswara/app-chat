import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

const Mybox = ({ fetchAgain, setFetchAgain }) => {
  const { selectChat } = ChatState();
  return (
    <Box
      d={{ base: selectChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={2}
      pb={0}
      bg="#7f8bff"
      w={{ base: "100%", md: "68%" }}
      h="98vh"
      borderRadius="lg">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Mybox;
