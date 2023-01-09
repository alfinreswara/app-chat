import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../user/UserBadgeItem";
import UserListResult from "../user/UserListResult";

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const { selectChat, setSelectChat, user } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRename, setLoadingRename] = useState(false);
  const toast = useToast();
  const handleAddUser = async (userOne) => {
    if (selectChat.users.find((u) => u._id === userOne._id)) {
      toast({
        title: "User Already in Group!!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin can someone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/groupadd`,
        { chatId: selectChat._id, UserId: userOne._id },
        config
      );
      setSelectChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "error occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const handleRemove = async (userOne) => {
    if (selectChat.groupAdmin._id !== user._id && userOne._id !== user._id) {
      toast({
        title: "Only Admin can removed User",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/groupremove`,
        { chatId: selectChat._id, userId: userOne._id },
        config
      );
      userOne._id === user._id ? setSelectChat() : setSelectChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
      console.log(data);
    } catch (error) {
      toast({
        title: "error occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setLoadingRename(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/rename`,
        { chatId: selectChat._id, chatName: groupChatName },
        config
      );
      setSelectChat(data);
      setFetchAgain(false);
      setLoadingRename(false);
    } catch (error) {
      toast({
        title: "error occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoadingRename(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      console.log(data);
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
  return (
    <>
      <IconButton
        d={{ base: "flex" }}
        icon={<HamburgerIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" d="flex" justifyContent="center">
            {selectChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectChat.users.map((us) => (
                <UserBadgeItem
                  key={us._id}
                  user={us}
                  handleFunc={() => handleRemove(us)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Rename Group"
                mb={1}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={loadingRename}
                onClick={handleRename}>
                Change
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Member To Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListResult
                    key={user._id}
                    user={user}
                    handleFunc={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
