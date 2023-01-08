import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull, getSenderPic } from "../config/ChatLogic";
import ProfileModal from "./side/ProfileModal";
import UpdateGroupChatModel from "./side/UpdateGroupChatModel";
import axios from "axios";
import "./style.css";
import SrollableChat from "./SrollableChat";
import io from "socket.io-client";
import typingAnim from "../animationTyping/typing.json";
import Lottie from "react-lottie";
import { MajesticonsUserGroup } from "../icones/Icones";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnection, setSocketConnetion] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const {
    user,
    selectChat,
    setSelectChat,
    messages,
    setMessages,
    notifications,
    setNotifications,
  } = ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingAnim,
    rendererSetting: {
      preserveAspectRation: "xMidYMid slice",
    },
  };

  const toast = useToast();
  const fetchMessages = async () => {
    if (!selectChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectChat._id}`,
        config
      );
      console.log(data);
      console.log(user.email);
      setMessages(data);
      setLoading(false);
      socket.emit("join room", selectChat._id);
    } catch (error) {
      toast({
        title: "error occured",
        description: "failed to Load Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connedted", () => setSocketConnetion(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectChat;
  }, [selectChat]);

  console.log(notifications);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notifications.includes(newMessageRecieved)) {
          setNotifications([newMessageRecieved, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `http://localhost:5000/api/message`,
          {
            content: newMessage,
            chatId: selectChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "error occured",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (event) => {
    setNewMessage(event.target.value);

    if (!socketConnection) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center">
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectChat("")}
            />
            {messages &&
              (!selectChat.isGroupChat ? (
                <>
                  <Box>
                    <Avatar
                      size="md"
                      src={getSenderPic(user, selectChat.users)}
                    />
                    <span style={{ paddingLeft: "0.3em" }}>
                      {getSender(user, selectChat.users)}
                    </span>
                  </Box>
                  <ProfileModal user={getSenderFull(user, selectChat.users)} />
                </>
              ) : (
                <>
                  <Box>
                    <Avatar
                      size="md"
                      name={selectChat.chatName}
                      src="https://api.iconify.design/majesticons:user-group.svg?color=%23000000"
                    />
                    <span style={{ paddingLeft: "0.3em" }}>
                      {selectChat.chatName}
                    </span>
                  </Box>
                  <UpdateGroupChatModel
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden">
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <SrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter Yout message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3x1" pb={3}>
            Click on Getting Started
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
