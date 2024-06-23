import { Router } from "express";
import { BeschaRoutes } from "../BESCHA/beschaRoutes.js";
import { TedRoutes } from "../TED/tedRoutes.js";
import { CompanyRoutes } from "../Companies/companyRoutes.js";
import { MatchingRoutes } from "../Matching/matchingRoutes.js";
const router: Router = Router();

router.use("/bescha", BeschaRoutes);
router.use("/ted", TedRoutes);
router.use("/company", CompanyRoutes);
router.use("/matching", MatchingRoutes);

export const MainRouter: Router = router;
