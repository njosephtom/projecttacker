# Python API Guide

Query Project Tracker shots with Python.

## 1. Installation

```bash
pip install requests
```

## 2. Using the CLI Script

### Setup
```bash
# Make executable (Linux/Mac)
chmod +x query_shots.py

# Or just run with Python
python query_shots.py
```

### Query specific shot
```bash
python query_shots.py 1 Wide
```

Output:
```
============================================================
🎬 Shot Details
============================================================
  ID:          1_Wide
  Seq:         1
  Shot:        Wide
  Dept:        Anim
  Filename:    SQ1_Sh1_Anim_v0000.ma
  GDrive Path: /Shots/1/1_Wide
  Status:      approved
  DocId:       abc123xyz
============================================================
```

### Get all shots
```bash
python query_shots.py --all
```

Output:
```
120  
ID              Seq        Shot            Dept         Filename                      Status    
============================================================
1_Wide          1          Wide            Anim         SQ1_Sh1_Anim_v0000.ma         approved  
1_Close         1          Close           VFX          SQ1_Sh1_VFX_v0000.ma          wip       
2_Wide          2          Wide            Lighting     SQ2_Sh1_Lighting_v0000.ma     approved  
```

---

## 3. Using in Your Python Code

### Simple Query
```python
import requests

def get_shot(seq, shot):
    """Get shot details."""
    url = "http://localhost:5000/api/shots"
    response = requests.get(url, params={"seq": seq, "shot": shot})
    result = response.json()
    
    if result["success"]:
        return result["data"]
    else:
        raise Exception(result["error"])

# Usage
shot = get_shot("1", "Wide")
print(f"Filename: {shot['filename']}")
print(f"GDrive: {shot['gdrivePath']}")
print(f"Status: {shot['status']}")
```

### With Error Handling
```python
import requests

def get_shot_safe(seq, shot):
    """Get shot with error handling."""
    try:
        url = "http://localhost:5000/api/shots"
        response = requests.get(url, params={"seq": seq, "shot": shot}, timeout=5)
        response.raise_for_status()  # Raise for HTTP errors
        
        result = response.json()
        
        if not result.get("success"):
            print(f"API Error: {result.get('error')}")
            return None
            
        return result["data"]
        
    except requests.exceptions.Timeout:
        print("❌ Request timeout")
        return None
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - is server running?")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

# Usage
shot = get_shot_safe("1", "Wide")
if shot:
    print(f"✅ Found: {shot['id']}")
```

### Get All Shots
```python
import requests

def get_all_shots():
    """Get all shots."""
    url = "http://localhost:5000/api/shots-all"
    response = requests.get(url)
    result = response.json()
    
    if result["success"]:
        return result["data"]
    return []

# Usage
all_shots = get_all_shots()
print(f"Total shots: {len(all_shots)}")

for shot in all_shots:
    print(f"  - {shot['id']}: {shot['filename']}")
```

### Filter & Process
```python
import requests

def get_shots_by_dept(dept):
    """Get all shots for a specific department."""
    all_shots = requests.get("http://localhost:5000/api/shots-all").json()["data"]
    
    return [s for s in all_shots if s.get("dept") == dept]

# Usage
anim_shots = get_shots_by_dept("Anim")
print(f"Animation shots: {len(anim_shots)}")
for shot in anim_shots:
    print(f"  - {shot['filename']}")
```

### Export to CSV
```python
import requests
import csv

def export_shots_to_csv(filename="shots.csv"):
    """Export all shots to CSV."""
    response = requests.get("http://localhost:5000/api/shots-all")
    shots = response.json()["data"]
    
    if not shots:
        print("No shots found")
        return
    
    keys = shots[0].keys()
    
    with open(filename, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(shots)
    
    print(f"✅ Exported {len(shots)} shots to {filename}")

# Usage
export_shots_to_csv()
```

### Export to JSON
```python
import requests
import json

def export_shots_to_json(filename="shots.json"):
    """Export all shots to JSON."""
    response = requests.get("http://localhost:5000/api/shots-all")
    result = response.json()
    
    with open(filename, 'w') as f:
        json.dump(result, f, indent=2)
    
    print(f"✅ Exported to {filename}")

# Usage
export_shots_to_json()
```

### Class-Based Wrapper
```python
import requests
from typing import Optional, List, Dict

class ProjectTrackerClient:
    """Client for Project Tracker API."""
    
    def __init__(self, base_url="http://localhost:5000"):
        self.base_url = base_url
    
    def get_shot(self, seq: str, shot: str) -> Optional[Dict]:
        """Get shot by seq and shot."""
        try:
            response = requests.get(
                f"{self.base_url}/api/shots",
                params={"seq": seq, "shot": shot},
                timeout=5
            )
            result = response.json()
            return result.get("data") if result.get("success") else None
        except Exception as e:
            print(f"Error: {e}")
            return None
    
    def get_all_shots(self) -> List[Dict]:
        """Get all shots."""
        try:
            response = requests.get(f"{self.base_url}/api/shots-all", timeout=5)
            result = response.json()
            return result.get("data", []) if result.get("success") else []
        except Exception as e:
            print(f"Error: {e}")
            return []
    
    def search_by_dept(self, dept: str) -> List[Dict]:
        """Find all shots by department."""
        return [s for s in self.get_all_shots() if s.get("dept") == dept]
    
    def search_by_seq(self, seq: str) -> List[Dict]:
        """Find all shots in a sequence."""
        return [s for s in self.get_all_shots() if s.get("seq") == seq]

# Usage
client = ProjectTrackerClient()

# Single shot
shot = client.get_shot("1", "Wide")
if shot:
    print(f"✅ {shot['id']}: {shot['filename']}")

# All shots
all_shots = client.get_all_shots()
print(f"Total shots: {len(all_shots)}")

# By department
anim_shots = client.search_by_dept("Anim")
print(f"Animation shots: {len(anim_shots)}")

# By sequence
seq_shots = client.search_by_seq("1")
print(f"Sequence 1 shots: {len(seq_shots)}")
```

---

## 4. Async Queries (asyncio)

```python
import asyncio
import aiohttp

async def get_shot_async(seq, shot):
    """Query shot asynchronously."""
    async with aiohttp.ClientSession() as session:
        url = "http://localhost:5000/api/shots"
        async with session.get(url, params={"seq": seq, "shot": shot}) as response:
            result = await response.json()
            return result.get("data") if result.get("success") else None

async def get_multiple_shots(shots_list):
    """Query multiple shots concurrently."""
    tasks = [
        get_shot_async(seq, shot)
        for seq, shot in shots_list
    ]
    return await asyncio.gather(*tasks)

# Usage
shots_to_query = [("1", "Wide"), ("1", "Close"), ("2", "Wide")]
results = asyncio.run(get_multiple_shots(shots_to_query))

for result in results:
    if result:
        print(f"✅ {result['id']}")
```

---

## 5. Batch Operations

```python
import requests

def batch_update_shots_status(seq_shot_pairs, new_status="approved"):
    """
    Batch query multiple shots (note: updating requires backend support).
    """
    results = []
    for seq, shot in seq_shot_pairs:
        try:
            response = requests.get(
                "http://localhost:5000/api/shots",
                params={"seq": seq, "shot": shot}
            )
            shot_data = response.json().get("data")
            if shot_data:
                results.append({
                    "id": shot_data["id"],
                    "status": shot_data["status"],
                    "new_status": new_status
                })
        except Exception as e:
            print(f"Error querying {seq}_{shot}: {e}")
    
    return results

# Usage
shots = [("1", "Wide"), ("1", "Close"), ("2", "Wide")]
results = batch_update_shots_status(shots, "wip")
for r in results:
    print(f"{r['id']}: {r['status']} → {r['new_status']}")
```

---

## Common Issues

### Connection Error
```
❌ Connection failed: Is the server running? (npm run server)
```
**Fix:** Start the API server first:
```bash
npm run server
```

### Request Timeout
```
❌ Request timeout
```
**Fix:** Server may be slow or unreachable. Check:
```bash
curl http://localhost:5000/health
```

### Import Error
```
ModuleNotFoundError: No module named 'requests'
```
**Fix:** Install requests:
```bash
pip install requests
```
