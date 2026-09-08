# API Usage Examples

## 1. cURL Commands

### Query by seq & shot (query params)
```bash
curl "http://localhost:5000/api/shots?seq=1&shot=Wide"
```

### Query by seq & shot (path params)
```bash
curl "http://localhost:5000/api/shots/1/Wide"
```

### Get all shots
```bash
curl "http://localhost:5000/api/shots-all"
```

### Pretty-print JSON
```bash
curl -s "http://localhost:5000/api/shots?seq=1&shot=Wide" | jq
```

---

## 2. JavaScript / Fetch

```javascript
// Query shot details
async function getShot(seq, shot) {
  const res = await fetch(`http://localhost:5000/api/shots?seq=${seq}&shot=${shot}`);
  const result = await res.json();
  
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error);
  }
}

// Usage
getShot('1', 'Wide').then(shot => {
  console.log('Filename:', shot.filename);
  console.log('GDrive Path:', shot.gdrivePath);
  console.log('Status:', shot.status);
});
```

---

## 3. React Hook

```javascript
function useShotDetails(seq, shot) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!seq || !shot) return;

    setLoading(true);
    fetch(`http://localhost:5000/api/shots?seq=${seq}&shot=${shot}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [seq, shot]);

  return { data, loading, error };
}

// Usage in component
function ShotDetails({ seq, shot }) {
  const { data, loading, error } = useShotDetails(seq, shot);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No shot found</div>;

  return (
    <div>
      <h2>{data.id}</h2>
      <p><strong>Filename:</strong> {data.filename}</p>
      <p><strong>GDrive:</strong> {data.gdrivePath}</p>
      <p><strong>Status:</strong> {data.status}</p>
    </div>
  );
}
```

---

## 4. Python Requests

```python
import requests

def get_shot(seq, shot):
    url = f"http://localhost:5000/api/shots?seq={seq}&shot={shot}"
    response = requests.get(url)
    result = response.json()
    
    if result.get('success'):
        return result['data']
    else:
        raise Exception(result['error'])

# Usage
shot = get_shot('1', 'Wide')
print(f"Filename: {shot['filename']}")
print(f"Status: {shot['status']}")
```

---

## 5. Node.js / Axios

```javascript
const axios = require('axios');

async function getShot(seq, shot) {
  try {
    const { data } = await axios.get('http://localhost:5000/api/shots', {
      params: { seq, shot }
    });
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error fetching shot:', error.message);
  }
}

// Usage
getShot('1', 'Wide').then(shot => console.log(shot));
```

---

## 6. Postman / REST Client

### VS Code REST Client Extension

Create `requests.http`:
```http
### Get shot by seq and shot
GET http://localhost:5000/api/shots?seq=1&shot=Wide

### Get shot using path params
GET http://localhost:5000/api/shots/1/Wide

### Get all shots
GET http://localhost:5000/api/shots-all

### Health check
GET http://localhost:5000/health
```

Click "Send Request" above each request.

---

## 7. Shell Script

```bash
#!/bin/bash

SEQ=$1
SHOT=$2

if [ -z "$SEQ" ] || [ -z "$SHOT" ]; then
  echo "Usage: $0 <seq> <shot>"
  exit 1
fi

curl -s "http://localhost:5000/api/shots?seq=$SEQ&shot=$SHOT" | jq '.'
```

Usage:
```bash
bash query_shot.sh 1 Wide
```
