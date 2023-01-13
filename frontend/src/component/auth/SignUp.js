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

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const postDetails = (photoProfil) => {
    setLoading(true);
    if (photoProfil === undefined) {
      toast({
        title: "Please Select an Image p",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (
      photoProfil.type === "image/jpeg" ||
      photoProfil.type === "image/png" ||
      photoProfil.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", photoProfil);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dnkkxknpz");
      fetch("https://api.cloudinary.com/v1_1/dnkkxknpz/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confPassword) {
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
    if (password !== confPassword) {
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
      const { data } = await axios.post("http://localhost:5000/api/user", {
        name,
        email,
        password,
        pic,
      });
      toast({
        title: "Registration successfully  ",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
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
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name">
        <FormLabel> Name </FormLabel>
        <Input
          placeholder="Your Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FormControl>
      <FormControl id="email">
        <FormLabel> Email </FormLabel>
        <Input
          placeholder="Email-Address"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FormControl>
      <FormControl id="password">
        <FormLabel> password </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? (
                <IcRoundRemoveRedEye width="30px" height="24px" />
              ) : (
                <MdiEyeOff width="30px" height="24px" />
              )}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confPassword">
        <FormLabel> cofirm password </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfPassword(e.target.value)}
            required
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? (
                <IcRoundRemoveRedEye width="30px" height="24px" />
              ) : (
                <MdiEyeOff width="30px" height="24px" />
              )}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
