import { limitHour, limitMinute } from '../../middleware/rateLimit.js';
import { Request, Response, Router } from 'express';

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "v1 working",
    timestamp: new Date().toLocaleString(),
  });
  return;
})


// rate limited 
// router.use('/ai', limitHour, limitMinute, aiRoutes);

router.use((req: Request, res: Response) => {
  res.status(404).json({ error: "v1: Route not found" });
});

export default router;
