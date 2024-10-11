import { ApolloError } from '@apollo/client'
import type { ServerError } from '@apollo/client/link/utils/index.js'

export interface ApiError {
  code: number
  message: string
  apiMessage?: string
}

export function processServerError(error: any): ApiError {
  console.error('[ServerError]', JSON.stringify(error, null, 2))
  let apiError: ApiError = {
    code: 500,
    message: 'An unexpected error occurred.',
    apiMessage: error.message,
  }
  if (!(error instanceof ApolloError)) {
    return apiError
  }
  if (error.networkError) {
    const serverError = error.networkError as ServerError
    switch (serverError.statusCode) {
      case 403: {
        apiError = {
          ...apiError,
          code: 403,
          message: 'Rate limit exceeded. Please try again later.',
        }
        break
      }
    }
  }
  if (error.cause) {
    // schema is broken and doesn't include type
    switch ((error.cause as any).type) {
      case 'NOT_FOUND': {
        apiError = {
          ...apiError,
          code: 404,
          message: 'Resource not found.',
        }
      }
    }
  }
  return apiError
}
