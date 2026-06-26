# V16 Chat Message Attachments

## Purpose
- Support real image and audio recordings attachments in chat rooms synchronized across users.

## Data Contract
- `image_url`: string (URL of uploaded image on Cloudinary), nullable.
- `audio_url`: string (URL of uploaded audio recording on Cloudinary), nullable.
- `audio_name`: string (display name of audio recording), nullable.

## Backend Integration
- **Entity**: `ChatMessageEntity` updated with `imageUrl`, `audioUrl`, and `audioName` fields.
- **DTOs**: `ChatMessageRequest` and `ChatMessageResponse` updated with `imageUrl`, `audioUrl`, and `audioName` fields.
- **Service**: `CommunityService` updated to map and persist those columns from requests.
- **Controller**: `MediaController` created to handle file upload endpoint `POST /api/media/upload` using Cloudinary SDK.

## Database Integration
- Added columns `image_url`, `audio_url`, `audio_name` to `chat_messages` table in `data/init.sql`.

## Frontend Integration
- **API Client**: `client.ts` updated to allow `FormData` request body without overriding content type.
- **Types**: `api.ts` updated to include `imageUrl`, `audioUrl`, and `audioName` on the `ChatMessage` interface to avoid type mismatch errors.
- **Page**: `ChatRoomsPage.tsx` updated to perform actual file uploads to `/api/media/upload` and map Cloudinary URLs into messages request.

## Compatibility
- Non-destructive schema change: existing messages will have NULL values for attachments.

## Verification
- Compilation checks: `mvn compile` and `npm run build`.
- Automated test checks: `npm run test`.
