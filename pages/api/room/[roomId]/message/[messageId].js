import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  if (req.method === "DELETE") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }

    //get ids from url
    const roomId = req.query.roomId;
    const messageId = req.query.messageId;
    const rooms = readChatRoomsDB();
    const roomIdIDX = rooms.findIndex((x) => x.roomId === roomId);

    //check if roomId exist
    if (roomIdIDX === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });

    const mess = rooms[roomIdIDX].messages;
    const messageIdx = mess.findIndex((x) => x.messageId === messageId);

    //check if messageId exist
    if (messageIdx === -1)
      return res.status(404).json({ ok: false, message: "Invalid message id" });

    //check if token owner is admin, they can delete any message
    //or if token owner is normal user, they can only delete their own message!
    if (!user.isAdmin) {
      if (mess[messageIdx].username === user.username) {
        mess.splice(messageIdx, 1);
        writeChatRoomsDB(rooms);
        return res.json({ ok: true });
      } else {
        return res.status(403).json({
          ok: false,
          message: "You do not have permission to access this data",
        });
      }
    } else {
      mess.splice(messageIdx, 1);
      writeChatRoomsDB(rooms);
      return res.json({ ok: true });
    }
  }
}
