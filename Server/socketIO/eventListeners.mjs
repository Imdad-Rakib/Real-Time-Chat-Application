import { io } from "../app.mjs";
import {addClient, removeClient, handlePrivateMsg} from './eventHandler.mjs'

function handleSocketConnections(socket){

    socket.on('client-info', (arg) =>{
        addClient(arg, socket.id);
    })
    socket.on('disconnect', () =>{
        console.log('a client disconnected');
        removeClient(socket.id);
    })
    socket.on('private_message', async (payload, callback)=>{
        let res = await handlePrivateMsg(payload);
        callback(res);
    })
}
export {handleSocketConnections}