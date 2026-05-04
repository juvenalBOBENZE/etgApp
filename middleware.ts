import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Firebase Auth is client-side; middleware only does basic cookie-based redirect hint.
// Full guard is in AuthGuard component.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
