import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    // Extract the image data (Base64 or binary)
    const { image } = await request.json();

    // Imgur API URL and Authorization
    const IMGUR_API_URL = 'https://api.imgur.com/3/image';
    const CLIENT_ID = '3f85ba1f6b41766';

    const response = await axios.post(
      IMGUR_API_URL,
      { image }, // Send the image data
      {
        headers: {
          Authorization: `Client-ID ${CLIENT_ID}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Return the uploaded image link
    return NextResponse.json({ link: response.data.data.link });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
