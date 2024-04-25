import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteStats {
  requestCount: number;
  totalTime: number;
}

const routeStatsMap: Map<string, RouteStats> = new Map();

const calculateLatency = (routeStats: RouteStats): number => {
  return routeStats.totalTime / routeStats.requestCount;
};

const monitoringMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const requestStartTime = Date.now();
  const routePath = req.path;

  if (!routeStatsMap.has(routePath)) {
    routeStatsMap.set(routePath, { requestCount: 0, totalTime: 0 });
  }

  const routeStats = routeStatsMap.get(routePath)!;
  routeStats.requestCount++;

  const threshold = 10;
  if (routeStats.requestCount > threshold) {
    console.log(`Alert: High request count detected for route ${routePath} (${routeStats.requestCount} requests).`);
    await prisma.routeAlert.create({
      data: {
        routePath,
        requestCount: routeStats.requestCount,
      },
    });
  }

  next();

  const requestEndTime = Date.now();
  const requestLatency = requestEndTime - requestStartTime;

  routeStats.totalTime += requestLatency;

  const latencyThreshold = 10;
  if (requestLatency > latencyThreshold) {
    console.log(`Alert: High request latency detected for route ${routePath} (${requestLatency} ms).`);
  }

  // Check if a time window has passed (e.g., every 5 minutes) and reset route stats
  const timeWindowDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
  const currentTime = Date.now();
  if (currentTime - requestStartTime > timeWindowDuration) {
    routeStats.requestCount = 0;
    routeStats.totalTime = 0;
  }

  // Store or update route statistics in the database
  await prisma.routeStatistics.upsert({
    where: { routePath },
    update: {
      requestCount: routeStats.requestCount,
      averageLatency: calculateLatency(routeStats),
    },
    create: {
      routePath,
      requestCount: routeStats.requestCount,
      averageLatency: calculateLatency(routeStats),
    },
  });
};

export default monitoringMiddleware;
