export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  LOGIN_SUCCESSFUL: 'Login successful',
  REGISTER_SUCCESSFUL: 'Register successful',
  USER_NOT_FOUND: 'User not found',
  USER_IS_TAKEN: 'User is taken',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  VERIFY_EMAIL_SUCCESSFULLY: 'Verify email successfully',
  LOGOUT_SUCCESSFUL: 'Logout successful',
  USER_LOGGED_OUT: 'User logged out',
  REFRESH_TOKEN_SUCCESSFULLY: 'Refresh token successfully',
  PASSWORD_OR_USERNAME_INCORRECT: 'Password or username is incorrect',
  UPDATE_PROFILE_SUCCESSFULLY: 'Update profile successfully',
  DELETE_USER_SUCCESSFULLY: 'Delete user successfully',
  VERIFY_TOKEN_BEFORE_LOGIN: 'Please verify token before login',
  PASSWORD_NOT_MATCH: 'Password not match',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_A_PASSWORD:
    'Confirm password must be the same as password',
  CHANGE_PASSWORD_SUCCESSFULLY: 'Change password successfully',
  RESEND_CONFIRM_EMAIL_SUCCESSFULLY: 'Resend confirm email successfully',
  VERIFY_STATUS_INCORRECT: 'Verify status incorrect',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check mail to reset password',
  FORGOT_PASSWORD_TOKEN_INVALID: 'Forgot password token invalid',
  RESET_PASSWORD_SUCCESSFUL: 'Reset password successful',
  ACCOUNT_IS_VERIFIED: 'Account is verified, cant verify again',
  USER_IS_BANNED: 'User is banned',
  MAP_STUDENT_ID_WITH_USER_ID_SUCCESSFULLY:
    'Map student id with user id successfully',
  UN_MAP_STUDENT_ID_WITH_USER_ID_SUCCESSFULLY:
    'Un map student id with user id successfully',
  GET_USERS_LIST_SUCCESSFULLY: 'Get users successfully',
  LOCK_USER_SUCCESSFULLY: 'Lock user successfully',
  UNLOCK_USER_SUCCESSFULLY: 'Unlock user successfully',
  STUDENT_ID_USED: 'Student ID already used',
} as const;

export const TOKEN_MESSAGES = {
  TOKEN_IS_EXPIRED: 'Token is expired',
  TOKEN_IS_BLACKLIST: 'Token is blacklist',
  TOKEN_IS_INVALID: 'Token is invalid',
};

export const TMDB_MESSAGES = {
  INVALID_ID: 'Invalid id: The pre-requisite id is invalid or not found.',
};

export const FAVORITE_MESSAGES = {
  ADD_FAVORITE_SUCCESSFULLY: 'Add favorite successfully',
  DELETE_FAVORITE_SUCCESSFULLY: 'Delete favorite successfully',
  MOVIE_ALREADY_IN_FAVORITE: 'Movie already in favorite',
};

export const WATCHLIST_MESSAGES = {
  CREATE_WATCHLIST_SUCCESSFULLY: 'Create new watch list successfully',
  ADD_WATCHLIST_SUCCESSFULLY: 'Add watch list successfully',
  DELETE_WATCHLIST_SUCCESSFULLY: 'Delete watch list successfully',
  REMOVE_MOVIE_FROM_WATCHLIST_SUCCESSFULLY:
    'Remove movie from watch list successfully',
  MOVIE_ALREADY_IN_WATCHLIST: 'Movie already in watch list',
  WATCHLIST_ALREADY_EXISTS: 'Watch list already exists',
  WATCHLIST_DOES_NOT_EXIST: 'Watch list does not exist',
  UPDATE_WATCHLIST_SUCCESSFULLY: 'Update watch list successfully',
};
