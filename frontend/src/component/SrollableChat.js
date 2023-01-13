import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogic";
import { ChatState } from "../Context/ChatProvider";
const SrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const getTimeChat = (time) => {
    var getHoursChat = new Date(time).getHours();
    var getMinutesChat = new Date(time).getMinutes();
    if (getMinutesChat <= 9) {
      getMinutesChat = `0${getMinutesChat}`;
    }
    if (getHoursChat <= 9) {
      getHoursChat = `0${getHoursChat}`;
    }

    var timeChat = `${getHoursChat}:${getMinutesChat}`;
    return timeChat;
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <div
              style={{
                display: "inline-block",
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}>
              <span style={{ fontSize: "1.1rem" }}>{m.content}</span>
              <small
                style={{
                  display: "inline-block",
                  fontSize: "0.7rem",
                  paddingLeft: "0.6em",
                }}>
                {getTimeChat(m.createdAt)}
              </small>
            </div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default SrollableChat;
