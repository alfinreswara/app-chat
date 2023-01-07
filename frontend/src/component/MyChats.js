import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import ChatLoading from "../component/ChatLoading";
import { getSender, getSenderPic } from "../config/ChatLogic";
import GroupChatModel from "../component/side/GroupChatModal";
import { MenuKebab, Search } from "../icones/Icones";
import UserListResult from "./user/UserListResult";
import ProfileModal from "./side/ProfileModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { selectChat, setSelectChat, messages, user, chats, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Enter something in Search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "error occured",
        description: "failed to load the search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:5000/api/chat`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "error fhecing chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/chat`,
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "error occured",
        description: "failed to load the search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      d={{ base: selectChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItem="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px">
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItem="center">
        <Box cursor="pointer">
          <ProfileModal user={user}>
            <Avatar size="md" name={user.name} src={user.pic} />
          </ProfileModal>
        </Box>
        <Menu>
          <MenuButton as={Button} variant="ghost">
            <MenuKebab />
          </MenuButton>
          <MenuList>
            <GroupChatModel>
              <Button
                d="flex"
                width="100%"
                fontSize={{ base: "13px", md: "10px", lg: "13px" }}
                rightIcon={<AddIcon />}>
                New Group
              </Button>
            </GroupChatModel>
            <MenuDivider />
          </MenuList>
        </Menu>
      </Box>

      <Button
        variant="outline"
        onClick={onOpen}
        justifyContent="flex-start"
        size="lg"
        colorScheme="teal">
        <Search />
        <Text d={{ base: "flex", md: "flex" }} p={2}>
          Search
        </Text>
      </Button>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search name or Email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>
                <Search />
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListResult
                  key={user._id}
                  user={user}
                  handleFunc={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden">
          {console.log(chats)}
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectChat(chat)}
                cursor="pointer"
                bg={selectChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}>
                <Box>
                  {!chat.isGroupChat ? (
                    <>
                    <div style={{display: "flex"}}>
                      
                      <Avatar name={getSender(loggedUser, chat.users)} src={getSenderPic(loggedUser, chat.users)} />
                      <span style={{ paddingLeft: "0.8em", fontSize:"1.1em", fontWeight:"500" }}>
                        {getSender(loggedUser, chat.users)}
                      </span>
                    </div>
                    </>
                  ) : (
                    chat.chatName
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
