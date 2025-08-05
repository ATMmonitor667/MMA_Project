import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Backend connection successful!',
    timestamp: new Date().toISOString(),
    environment: 'nextjs-fullstack',
    version: '1.0.0'
  });
}
