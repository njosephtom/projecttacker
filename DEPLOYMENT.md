# Deploy to Vercel

## Step 1: Prepare Firebase Service Account

1. Go to **Firebase Console** → **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Copy the entire JSON (it will be a long string)
4. Keep this secure! You'll use it for environment variables

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option B: Using GitHub (Recommended)

1. Push to GitHub (already done)
2. Go to [vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Click **Add New** → **Project**
5. Select your `projecttacker` repo
6. Click **Import**

## Step 3: Set Environment Variables on Vercel

After deploying or during the import process:

1. Go to **Project Settings** → **Environment Variables**
2. Add the following variables:

```
FIREBASE_SERVICE_ACCOUNT = <paste the entire JSON from Step 1>
```

## Step 4: Redeploy

After adding environment variables:
- Click **Deployments** → Select latest → Click **Redeploy**

## Test the API

Once deployed, test the API at:

```bash
# Query a specific shot
curl "https://projecttacker.vercel.app/api/shots?seq=1&shot=Wide"

# Get all shots
curl "https://projecttacker.vercel.app/api/shots-all"

# Health check
curl "https://projecttacker.vercel.app/api/health"
```

## Python Query Command

```bash
# Query production API
python query_shots.py 1 Wide

# Query local API (if running locally)
API_BASE_URL=http://localhost:5000 python query_shots.py 1 Wide

# Get all shots
python query_shots.py --all
```

## Troubleshooting

### API returns 500 error
- Check that `FIREBASE_SERVICE_ACCOUNT` is set correctly in Vercel environment variables
- Redeploy after setting variables

### CORS errors
- CORS is enabled in the API functions
- Make sure you're using the full domain: `https://projecttacker.vercel.app/api/...`

### Shot not found
- Verify the `seq` and `shot` values exist in Firebase
- Test with: `python query_shots.py --all`
