import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation'
import notificationSound from '../assets/sounds/notification.mp3'

const useListenMessages = () => {
  const {socket} = useSocketContext();
  const {messages,setMessages} = useConversation();

  useEffect(()=>{
    socket?.on("newMessage",(newMessage) => {

        newMessage.shouldShake = true;
        const sound = new Audio(notificationSound);
        sound.play();

        setMessages([...messages,newMessage])
    })

    return () => socket?.off("newMessage"); // when this component unmounts, we dont wanna listen for this event
    // important because we donot want to listen for this event more than once
    // notif sound multi times for multi clients
  },[socket,setMessages,messages])

}

export default useListenMessages