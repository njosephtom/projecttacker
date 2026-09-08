#!/usr/bin/env python3
"""
Query Project Tracker shots via REST API.
Usage: python query_shots.py <seq> <shot>
"""

import requests
import json
import sys
from typing import Optional, Dict, Any

API_BASE_URL = "http://localhost:3000"


def get_shot(seq: str, shot: str) -> Optional[Dict[Any, Any]]:
    """Query shot by seq and shot."""
    try:
        url = f"{API_BASE_URL}/api/shots"
        params = {"seq": seq, "shot": shot}

        response = requests.get(url, params=params)
        result = response.json()

        if result.get("success"):
            return result["data"]
        else:
            print(f"❌ Error: {result.get('error')}")
            return None
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection failed: Is the server running? (npm run server)")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def get_all_shots() -> Optional[list]:
    """Get all shots."""
    try:
        url = f"{API_BASE_URL}/api/shots-all"
        response = requests.get(url)
        result = response.json()

        if result.get("success"):
            return result["data"]
        else:
            print(f"❌ Error: {result.get('error')}")
            return None
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection failed: Is the server running? (npm run server)")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def print_shot(shot: Dict) -> None:
    """Pretty print a shot."""
    print("\n" + "="*60)
    print(f"🎬 Shot Details")
    print("="*60)
    print(f"  ID:          {shot.get('id')}")
    print(f"  Seq:         {shot.get('seq')}")
    print(f"  Shot:        {shot.get('shot')}")
    print(f"  Dept:        {shot.get('dept')}")
    print(f"  Filename:    {shot.get('filename')}")
    print(f"  GDrive Path: {shot.get('gdrivePath')}")
    print(f"  Status:      {shot.get('status')}")
    print(f"  DocId:       {shot.get('docId')}")
    if shot.get('json'):
        print(f"  JSON:        {json.dumps(shot.get('json'), indent=2)}")
    print("="*60 + "\n")


def print_shots_table(shots: list) -> None:
    """Print shots in table format."""
    print("\n" + "="*120)
    print(f"{'ID':<15} {'Seq':<10} {'Shot':<15} {'Dept':<12} {'Filename':<30} {'Status':<10}")
    print("="*120)
    for shot in shots:
        print(f"{shot.get('id', 'N/A'):<15} {shot.get('seq', 'N/A'):<10} {shot.get('shot', 'N/A'):<15} {shot.get('dept', 'N/A'):<12} {shot.get('filename', 'N/A'):<30} {shot.get('status', 'N/A'):<10}")
    print("="*120 + "\n")


def main():
    if len(sys.argv) == 3:
        # Query specific shot
        seq = sys.argv[1]
        shot = sys.argv[2]
        print(f"\n🔍 Querying shot: seq={seq}, shot={shot}")
        result = get_shot(seq, shot)
        if result:
            print_shot(result)
    elif len(sys.argv) == 2 and sys.argv[1] == "--all":
        # Get all shots
        print(f"\n🔍 Fetching all shots...")
        results = get_all_shots()
        if results:
            print(f"✅ Found {len(results)} shots")
            print_shots_table(results)
    else:
        print("Usage:")
        print("  python query_shots.py <seq> <shot>    - Query specific shot")
        print("  python query_shots.py --all           - Get all shots")
        print("\nExamples:")
        print("  python query_shots.py 1 Wide")
        print("  python query_shots.py 2 Close")
        print("  python query_shots.py --all")


if __name__ == "__main__":
    main()
