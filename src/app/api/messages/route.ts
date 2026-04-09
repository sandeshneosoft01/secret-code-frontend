import { NextResponse } from "next/server";

// In-memory data store for demonstration purposes
// In a real app, this would be a database
let messages = [
  {
    id: "1",
    emailLists: ["user@example.com"],
    content: "<p>Hello! This is a secret message.</p>",
    accessTime: new Date().toISOString(),
    code: "123456",
    status: "new",
  },
  {
    id: "2",
    emailLists: ["another@example.com"],
    content: "<p>Another secret here.</p>",
    accessTime: new Date().toISOString(),
    code: "654321",
    status: "new",
  },
];

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Basic validation
  if (!body.content || !body.emailLists || body.emailLists.length === 0) {
    return NextResponse.json(
      { error: "Content and at least one email are required" },
      { status: 400 }
    );
  }

  const newMessage = {
    id: Math.random().toString(36).substr(2, 9),
    ...body,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  messages = [newMessage, ...messages];

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return NextResponse.json(newMessage, { status: 201 });
}
