# Project Tracker REST API

Query shot details from Firebase via REST endpoints.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file** with Firebase service account:
   ```env
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
   PORT=5000
   ```
   
   Get the service account JSON from: Firebase Console → Project Settings → Service Accounts → Generate New Private Key

3. **Start the API server:**
   ```bash
   npm run server
   ```
   
   Server runs on `http://localhost:5000`

---

## Endpoints

### Get Shot by Seq & Shot (Query Parameters)
```
GET /api/shots?seq=VALUE&shot=VALUE
```

**Example:**
```bash
curl "http://localhost:5000/api/shots?seq=1&shot=Wide"
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": {
    "docId": "abc123",
    "id": "1_Wide",
    "seq": "1",
    "shot": "Wide",
    "dept": "Anim",
    "filename": "SQ1_Sh1_Anim_v0000.ma",
    "gdrivePath": "/Shots/1/1_Wide",
    "status": "approved",
    "json": {}
  }
}
```

---

### Get Shot by Seq & Shot (Path Parameters)
```
GET /api/shots/:seq/:shot
```

**Example:**
```bash
curl "http://localhost:5000/api/shots/1/Wide"
```

---

### Get All Shots
```
GET /api/shots-all
```

**Example:**
```bash
curl "http://localhost:5000/api/shots-all"
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    { "id": "1_Wide", "seq": "1", "shot": "Wide", ... },
    { "id": "1_Close", "seq": "1", "shot": "Close", ... },
    { "id": "2_Wide", "seq": "2", "shot": "Wide", ... }
  ]
}
```

---

### Health Check
```
GET /health
```

---

## Error Responses

**Missing parameters:**
```json
{
  "error": "Missing required parameters",
  "required": ["seq", "shot"],
  "example": "/api/shots?seq=1&shot=Wide"
}
```

**Not found:**
```json
{
  "error": "Shot not found",
  "query": { "seq": "1", "shot": "Wide" }
}
```

**Server error:**
```json
{
  "error": "Server error",
  "message": "Error details..."
}
```

---

## Usage in Frontend

```javascript
// Query shot details
async function getShot(seq, shot) {
  const res = await fetch(`http://localhost:5000/api/shots?seq=${seq}&shot=${shot}`);
  const result = await res.json();
  
  if (result.success) {
    console.log('Shot found:', result.data);
  } else {
    console.error('Error:', result.error);
  }
}

getShot('1', 'Wide');
```

---

## Run Both Frontend & Server

```bash
npm install concurrently --save-dev
npm run dev
```

This starts both React (`port 3000`) and API server (`port 5000`) concurrently.
