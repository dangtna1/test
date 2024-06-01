import type { AuthError } from "next-auth";

export const errorMessages: Record<AuthError["type"], string> = {
  AdapterError:
    "There was an issue connecting to the authentication service. Please try again later.",
  CallbackRouteError:
    "Error in the callback route. Please try signing in again.",
  ErrorPageLoop:
    "An error occurred while processing the authentication. Please try signing in again.",
  EventError:
    "An unexpected event error occurred during authentication. Please try again.",
  InvalidCallbackUrl:
    "Invalid callback URL. Please contact support for assistance.",
  CredentialsSignin:
    "Invalid credentials. Please double-check your username and password.",
  InvalidEndpoints:
    "Invalid authentication endpoints. Please contact support for assistance.",
  InvalidCheck:
    "Invalid check during authentication. Please contact support for assistance.",
  JWTSessionError:
    "There was an issue with your session. Please sign in again.",
  MissingAdapter:
    "Missing authentication adapter. Please contact support for assistance.",
  MissingAdapterMethods:
    "Missing authentication adapter methods. Please contact support for assistance.",
  MissingAuthorize:
    "Missing authorization during authentication. Please contact support for assistance.",
  MissingSecret:
    "Missing secret during authentication. Please contact support for assistance.",
  OAuthAccountNotLinked:
    "Your OAuth account is not linked. Please sign in using a different method.",
  OAuthCallbackError:
    "Error during OAuth callback. Please try signing in again.",
  OAuthProfileParseError:
    "Error parsing OAuth profile. Please try signing in again.",
  SessionTokenError:
    "Error with session token during authentication. Please sign in again.",
  OAuthSignInError: "Error during OAuth sign-in. Please try signing in again.",
  EmailSignInError: "Error during email sign-in. Please try signing in again.",
  SignOutError: "Error during sign-out. Please try signing out again.",
  UnknownAction:
    "Unknown action during authentication. Please contact support for assistance.",
  UnsupportedStrategy:
    "Unsupported authentication strategy. Please contact support for assistance.",
  InvalidProvider:
    "Invalid authentication provider. Please contact support for assistance.",
  UntrustedHost:
    "Untrusted host during authentication. Please contact support for assistance.",
  Verification:
    "Verification error during authentication. Please contact support for assistance.",
  MissingCSRF: "Missing CSRF token. Please try signing in again.",
  AccessDenied: "Access denied. Please try signing in again.",
  AccountNotLinked: "Account not linked. Please try signing in again.",
  WebAuthnVerificationError:
    "Error during WebAuthn verification. Please try signing in again.",
  MissingWebAuthnAutocomplete:
    "Missing WebAuthn autocomplete. Please try signing in again.",
  DuplicateConditionalUI:
    "Duplicate conditional UI. Please try signing in again.",
  ExperimentalFeatureNotEnabled:
    "Experimental feature not enabled. Please try signing in again.",
};
