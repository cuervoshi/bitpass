import express, { Router, Request, Response } from 'express';
import { getPrisma } from '../lib/prisma.js';

const prisma = getPrisma();
const router: Router = express.Router();

router.post('/request', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'Email inválido' }).send();
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    await prisma.loginCode.create({
      data: { email, code, expiresAt },
    });

    console.log(`[OTP] Código para ${email}: ${code}`);
    res.status(200).json({ success: true }).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' }).send();
  }
});

export default router;
