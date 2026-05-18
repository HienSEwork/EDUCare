# EDUcare VN Frontend

React + Vite frontend for EDUcare VN.

## Local Development

Run from the repository root:

```powershell
npm install
npm --prefix frontend install
npm run dev
```

Or run only the frontend:

```powershell
npm --prefix frontend run dev
```

Local URL:

```text
http://localhost:5173
```

## API Configuration

For local development, the frontend calls `/api` by default. Vite proxies `/api` to:

```text
http://localhost:8081
```

That means the backend must be running before API-backed pages can load data.

For deployed environments, set:

```text
VITE_API_URL=https://your-backend-domain.com/api
```

## Checks

```powershell
npm --prefix frontend test
npm --prefix frontend run build
```
