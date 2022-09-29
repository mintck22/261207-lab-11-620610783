import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "You don't permission to access this api",
      });
    }

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();
    const roomIdx = rooms.findIndex((x) => x.roomId === roomId);

    //check if roomId exist
    if (roomIdx === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });

    //find room and return
    const message = rooms[roomIdx].messages;
    return res.json({ ok: true, messages: message });
  } else if (req.method === "POST") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "You don't permission to access this api",
      });
    }

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();
    const roomIdx = rooms.findIndex((x) => x.roomId === roomId);

    //check if roomId exist
    if (roomIdx === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });

    //validate body
    const text = req.body.text;
    if (typeof text !== "string" || text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    //create message
    const newId = uuidv4();
    const newMessage = {
      messageId: newId,
      text: text,
      username: user.username,
    };
    rooms[roomIdx].messages.push(newMessage);
    writeChatRoomsDB(rooms);
    return res.json({ ok: true, message: newMessage });
  }
}
