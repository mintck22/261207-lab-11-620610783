import { checkToken } from "../../backendLibs/checkToken";
import { readChatRoomsDB } from "../../backendLibs/dbLib";

export default function roomRoute(req, res) {
  const user = checkToken(req);
  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "Yon don't permission to access this api",
    });
  }
  const chatrooms = readChatRoomsDB();

  //create room data and return response
  const result = [];
  for (const room of chatrooms) {
    result.push({
      roomTd: room.roomId,
      roomName: room.roomName,
    });
  }

  return res.json({ ok: true, rooms: result });
}
