import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              justifyItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                marginBottom: 20,
              }}
            >
              🐟 ZenKoi
            </div>
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              marginBottom: 10,
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            Trang Trại Cá Koi Premium
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            Hệ thống quản lý thông minh & bán hàng chuyên nghiệp
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.log(`${errorMessage}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}