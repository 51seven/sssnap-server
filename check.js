// This file will be executed once the server boots.
// Here all required environment variables will be checked.
// The server will be forced to exit if something is missing.

var error = false;
var reason = "";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  Log.w('Provide a GOOGLE_CLIENT_ID and GOOGLE_CLIENT_KEY as environment variables when starting the server.');
  reason = "missing GOOGLE_CLIENT credentials.";
  error = true;
}

if (error) {
  Log.e('Cannot start Server due to', reason);
  Log.i('Shutting down...');
  process.exit(0);
}
