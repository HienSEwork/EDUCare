# V18 chat-room-management

## Purpose
- Provide premium chat room membership and administration features:
  - Add Owner and Member roles to allow administrative actions (change room details, kick members, restrict pinning to owners).
  - Add Leave group capability.
  - Implement a Pending/Active invitation flow so users are not automatically forced into groups.
  - Implement System Messages to announce group membership changes (joins, leaves, kicks).

## Data Contract

### Bảng `chat_room_members`
- `status` (varchar(50)): `PENDING` (invited but not accepted) or `ACTIVE` (normal participant). Defaults to `ACTIVE` (for backwards compatibility/existing members).
- `role` (varchar(50)): `OWNER` or `MEMBER`. Defaults to `MEMBER`.

### Bảng `chat_messages`
- `is_system` (tinyint(1)): `1` (true) or `0` (false). Indicates if this is an automated system announcement message.

## Backend Integration
- **`ChatRoomMemberEntity`**: mapped `status` and `role` properties.
- **`ChatMessageEntity`**: mapped `isSystem` property.
- **`AuthDtos`**:
  - `ChatMessageResponse` updated with `isSystem` boolean flag.
  - `ChatRoomMemberResponse` response DTO.
  - `ChatRoomUpdateRequest` request DTO.
- **`ChatRoomMemberRepository`**: added state querying methods.
- **`CommunityService`**:
  - Auto-assign `"OWNER"` role to chat room creator.
  - Set invited members to `"PENDING"`.
  - Add `acceptInvitation`, `rejectInvitation`, `leaveChatRoom`, `kickMember`, `updateChatRoom`, and `getRoomMembers`.
  - Limit pin/unpin to owner/admin.
  - Create and broadcast system messages on joins, leaves, and kicks.
- **`CommunityController`**:
  - Endpoints mapped to `CommunityService` for accept, reject, leave, kick, update, and get members.

## Database Integration
- Added columns to creation scripts in `data/init.sql`.
- Appended `ALTER TABLE` statements at the bottom of `data/init.sql` for schema validation compatibility:
  ```sql
  ALTER TABLE `chat_room_members` ADD COLUMN `status` varchar(50) NOT NULL DEFAULT 'ACTIVE';
  ALTER TABLE `chat_room_members` ADD COLUMN `role` varchar(50) NOT NULL DEFAULT 'MEMBER';
  ALTER TABLE `chat_messages` ADD COLUMN `is_system` tinyint(1) NOT NULL DEFAULT 0;
  ```

## Frontend Integration
- Update API types in `frontend/src/types/api.ts`.
- In `ChatRoomsPage.tsx`:
  - Fetch pending invitations and allow accept/reject.
  - Fetch and show group members with roles/statuses.
  - Allow Owner to kick members.
  - Allow members to leave the group.
  - Allow Owner to update room details.
  - Render system messages (centered gray text, italic, no bubble).
- Render accept/reject buttons for invitation notifications in `Navbar.tsx` and `DashboardPage.tsx`.

## Compatibility
- Backwards compatible. Existing memberships default to `ACTIVE` and `MEMBER`. Existing messages default to `is_system = 0`.

## Verification
- Run backend unit tests: `mvn -f backend/pom.xml test`.
- Run frontend build: `npm --prefix frontend run build`.
