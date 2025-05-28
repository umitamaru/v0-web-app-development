import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const width = searchParams.get('width') || '1200';
  const height = searchParams.get('height') || '800';
  
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f0f0f0"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#888" text-anchor="middle" dominant-baseline="middle">${width} x ${height}</text>
  </svg>`;
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
} 