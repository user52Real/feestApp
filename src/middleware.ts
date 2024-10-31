import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()

  if (!userId && isProtectedRoute(req)) {
    // Add custom logic to run before redirecting

    const returnUrl = new URL(req.url).pathname;
    
    return redirectToSignIn({
      returnBackUrl: returnUrl,
    });
  }

  const isAuthRoute = req.url.includes('/sign-in') || req.url.includes('/sign-up');
  if (userId && isAuthRoute) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return Response.redirect(dashboardUrl);
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}