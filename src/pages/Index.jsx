import React, { useState, useEffect, useRef } from 'react';
import { Box, Input, Button, VStack, Text } from '@chakra-ui/react';
import { create } from 'lib/openai';

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    const userMessage = { role: 'user', content: inputText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');

    const response = await create({
      messages: [{ role: 'system', content: 'Start chat' }, userMessage],
      model: 'gpt-3.5-turbo',
      stream: true
    });

    if (response.data.choices[0].message) {
      const aiMessage = { role: 'ai', content: response.data.choices[0].message.content };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    }
  };

  return (
    <Box p={5}>
      <VStack spacing={4}>
        <Box w="100%" p={5} bg="gray.100" borderRadius="lg" overflowY="auto" maxHeight="70vh">
          {messages.map((msg, index) => (
            <Text key={index} alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}>
              {msg.content}
            </Text>
          ))}
          <div ref={endOfMessagesRef} />
        </Box>
        <Input
          placeholder="Type your message here..."
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={event => event.key === 'Enter' && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} colorScheme="blue">Send</Button>
      </VStack>
    </Box>
  );
};

export default Index;