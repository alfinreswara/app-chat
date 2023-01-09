import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import { ArrowDown } from "../../icones/Icones";
import ProfileModal from "./ProfileModal";
import { getSender } from "../../config/ChatLogic";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";

const SideDrawer = () => {
  const { user, setSelectChat, notifications, setNotifications } = ChatState();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#7f8bff"
        w="100%"
        p="5px 10px 10px 10px"
        borderBottom="2px"
        borderColor="#f9f9f9">
        <Text fontSize="2xl"> App chat</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notifications.length}
                effect={Effect.SCALE}
              />
            </MenuButton>
            <MenuList pl={2}>
              {!notifications.length && "no new message"}
              {notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectChat(notif.chat);
                    setNotifications(notifications.filter((n) => n !== notif));
                  }}>
                  {notif.chat.isGroupChat
                    ? `New Message ${notif.chat.chatName}`
                    : `New Message ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ArrowDown />} />
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </>
  );
};

export default SideDrawer;
