import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Mybox from "../component/Mybox";
import MyChats from "../component/MyChats";
import { ChatState } from "../Context/ChatProvider";

const ChatsPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Mybox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatsPage;
