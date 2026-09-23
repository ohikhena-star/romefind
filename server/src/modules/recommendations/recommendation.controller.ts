import { Request, Response, NextFunction } from 'express';
import { RecommendationEngine } from './recommendation.service.js';

// GET /api/recommendations
export const getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { limit = '20' } = req.query;

    const feed = await RecommendationEngine.getPersonalizedFeed(userId, parseInt(String(limit), 10));

    res.json({
      success: true,
      data: feed
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/recommendations/alternative-paths
export const getAlternativePaths = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const paths = await RecommendationEngine.getAlternativePaths(userId);

    res.json({
      success: true,
      data: paths
    });
  } catch (error) {
    next(error);
  }
};
