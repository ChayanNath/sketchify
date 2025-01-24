import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";

export const createRoom = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }
    const safeParsedData = data.data;
    const userId = req.user;

    if (!userId || safeParsedData.name) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }
    const room = await prismaClient.room.create({
      data: {
        slug: safeParsedData.name,
        adminId: userId,
      },
    });
    res
      .status(201)
      .json({ message: "Room created successfully", roomId: room.id });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};
