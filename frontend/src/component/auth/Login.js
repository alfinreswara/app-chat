import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { IcRoundRemoveRedEye, MdiEyeOff } from "../../icones/Icones";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);
  const submitHandlerKey = (event) => {
    if (event.key === "Enter") {
      submitHandler();
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the feild",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password }
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast({
        title: "Login successfully  ",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      window.location.reload();
      history.push("/chats");
    } catch (error) {
      toast({
        title: " Error Occured ",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl w="80%" id="email">
        <FormLabel> Email </FormLabel>
        <Input
          h="2em"
          fontSize="1.2em"
          fontWeight="350"
          borderRadius="15px"
          border="2px"
          p={3}
          value={email}
          placeholder="Email-Address"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={submitHandlerKey}
          required
        />
      </FormControl>
      <FormControl w="80%" pt={1} pb={5} id="password">
        <FormLabel> password </FormLabel>
        <InputGroup>
          <Input
            h="2em"
            fontSize="1.2em"
            fontWeight="350"
            borderRadius="15px"
            border="2px"
            p={3}
            value={password}
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={submitHandlerKey}
            required
          />
          <InputRightElement width="4.5rem">
            <div
              style={{
                backgroundColor: "#e8e8e8",
                padding: "5px",
                borderRadius: "11px",
                cursor: "pointer",
              }}
              onClick={handleClick}>
              {show ? (
                <IcRoundRemoveRedEye width="30px" height="24px" />
              ) : (
                <MdiEyeOff width="30px" height="24px" />
              )}
            </div>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        d="inline-block"
        w="50%"
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}>
        Login
      </Button>
    </VStack>
  );
};

export default Login;
