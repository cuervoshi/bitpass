import type { Request, Response } from "express";
import * as teamService from "../services/team.service.js";
import type {
  AddTeamInput,
  UpdateTeamInput,
} from "../lib/validators/team.schema.js";

export async function handleListTeam(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const members = await teamService.listTeam(req.params.id);
    res.status(200).json(members);
    return;
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message });
    return;
  }
}

export async function handleAddTeam(
  req: Request<{ id: string }, {}, AddTeamInput>,
  res: Response,
) {
  try {
    const userId = (req as any).user.id as string;
    const member = await teamService.addTeamMember(
      req.params.id,
      req.body,
      userId,
    );
    res.status(201).json(member);
    return;
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message });
    return;
  }
}

export async function handleUpdateTeam(
  req: Request<{ id: string; userId: string }, {}, UpdateTeamInput>,
  res: Response,
) {
  try {
    const currentUserId = (req as any).user.id as string;
    const updated = await teamService.updateTeamMember(
      req.params.id,
      req.params.userId,
      req.body,
      currentUserId,
    );
    res.status(200).json(updated);
    return;
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message });
    return;
  }
}

export async function handleDeleteTeam(
  req: Request<{ id: string; userId: string }>,
  res: Response,
) {
  try {
    const currentUserId = (req as any).user.id as string;
    await teamService.deleteTeamMember(
      req.params.id,
      req.params.userId,
      currentUserId,
    );
    res.status(204).send();
    return;
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message });
    return;
  }
}
