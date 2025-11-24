/**
 * Dashboard Statistics API Route
 * 
 * Provides aggregated statistics for the dashboard.
 * Requirements: 4.2, 11.3, 11.5
 */

import { NextResponse } from 'next/server';
import { countDoctors, countPatients, fetchTodayAppointments } from '@/lib/haunted-clinic/api';

// Simple in-memory cache
let cachedStats: {
  data: {
    totalDoctors: number;
    totalPatients: number;
    todayAppointments: number;
  } | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET() {
  try {
    const now = Date.now();

    // Check if cache is valid
    if (cachedStats.data && now - cachedStats.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        ...cachedStats.data,
        cached: true,
        cacheAge: Math.floor((now - cachedStats.timestamp) / 1000),
      });
    }

    // Fetch statistics in parallel for optimization
    const [totalDoctors, totalPatients, todayAppointments] = await Promise.all([
      countDoctors(),
      countPatients(),
      fetchTodayAppointments().then((apts) => apts.length),
    ]);

    const stats = {
      totalDoctors,
      totalPatients,
      todayAppointments,
    };

    // Update cache
    cachedStats = {
      data: stats,
      timestamp: now,
    };

    return NextResponse.json({
      ...stats,
      cached: false,
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
